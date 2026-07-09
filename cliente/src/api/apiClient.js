import axios from 'axios';
import { tokenStore } from './tokenStore';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://backend-acv2.onrender.com';

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// ─── Request interceptor: adjunta el Bearer token si existe ────────────────
apiClient.interceptors.request.use((config) => {
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
