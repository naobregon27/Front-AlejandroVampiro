import axios from 'axios';
import { tokenStore } from './tokenStore';

/**
 * Base del API.
 * - Vacío / no definido → same-origin `/api/v1` (proxy Netlify o Vite). Evita CORS en producción.
 * - URL absoluta → llamada directa al backend (requiere CORS_ORIGINS correcto).
 */
const configured = import.meta.env.VITE_API_URL;
const BASE_URL =
  configured === undefined || configured === null || String(configured).trim() === ''
    ? ''
    : String(configured).replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

function isPublicApiUrl(url = '') {
  return String(url).includes('/public/');
}

/** Lecturas públicas no llevan Bearer. Excepción: POST .../vote (requiere login). */
function shouldOmitAuth(config) {
  const url = String(config?.url ?? '');
  if (!isPublicApiUrl(url)) return false;
  if (url.includes('/vote')) return false;
  return true;
}

// ─── Request interceptor: Bearer solo donde hace falta ────────────────────
apiClient.interceptors.request.use((config) => {
  // Un JWT vencido en lecturas /public/* puede provocar 401 + refresh fallido
  // y tumbar galería/música aunque el backend responda bien sin token.
  if (shouldOmitAuth(config)) {
    if (config.headers) {
      delete config.headers.Authorization;
      delete config.headers.authorization;
    }
    return config;
  }

  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Cola de peticiones en espera mientras se refresca el token ────────────
let isRefreshing = false;
let waitingQueue = [];

function processQueue(error, newToken = null) {
  waitingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  waitingQueue = [];
}

// ─── Response interceptor: refresco automático al recibir 401 ─────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshRoute = originalRequest?.url?.includes('/auth/refresh');
    // No intentar refresh en lecturas públicas (no llevan sesión).
    if (status === 401 && shouldOmitAuth(originalRequest)) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry && !isRefreshRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitingQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(Promise.reject.bind(Promise));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStore.getRefreshToken();
        if (!refreshToken) throw new Error('no_refresh_token');

        const { data } = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        tokenStore.setSession(data.accessToken, data.refreshToken, data.user);
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        tokenStore.clearSession();
        window.dispatchEvent(new CustomEvent('acv2:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
