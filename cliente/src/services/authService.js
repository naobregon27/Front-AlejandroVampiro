import { apiClient } from '../api/apiClient';

/**
 * Servicio de autenticación.
 * Maneja registro, login, logout, refresh y perfil del usuario.
 */
export const authService = {
  /**
   * Registra un nuevo usuario.
   * @returns {{ accessToken, refreshToken, user }}
   */
  register: (name, email, password) =>
    apiClient.post('/auth/register', { name, email, password }).then((r) => r.data),

  /**
   * Inicia sesión.
   * @returns {{ accessToken, refreshToken, user }}
   */
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }).then((r) => r.data),

  /**
   * Cierra la sesión activa (requiere accessToken vigente).
   * El backend responde 204 sin body.
   */
  logout: () => apiClient.post('/auth/logout').then(() => undefined),

  /**
   * Refresca los tokens con el refreshToken.
   * @returns {{ accessToken, refreshToken, user }}
   */
  refresh: (refreshToken) =>
    apiClient.post('/auth/refresh', { refreshToken }).then((r) => r.data),

  /**
   * Retorna el usuario autenticado actual.
   * @returns {{ user }}
   */
  getMe: () => apiClient.get('/auth/me').then((r) => r.data),
};
