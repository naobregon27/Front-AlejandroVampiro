import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStore } from '../../api/tokenStore';
import { authService } from '../../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [isLoading, setIsLoading] = useState(false);

  // Sincroniza hasPremiumAccess / role con el servidor (p. ej. cambios desde el panel admin)
  useEffect(() => {
    const access = tokenStore.getAccessToken();
    if (!access) return undefined;
    let cancelled = false;
    authService
      .getMe()
      .then((data) => {
        if (cancelled || !data?.user) return;
        tokenStore.setUser(data.user);
        setUser(data.user);
      })
      .catch(() => {
        /* sesión inválida: el interceptor o la próxima petición limpiará */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Escucha el evento que dispara el apiClient cuando el refresh falla
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
    };
    window.addEventListener('acv2:session-expired', handleSessionExpired);
    return () => window.removeEventListener('acv2:session-expired', handleSessionExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      tokenStore.setSession(data.accessToken, data.refreshToken, data.user);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.register(name, email, password);
      tokenStore.setSession(data.accessToken, data.refreshToken, data.user);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignorar error de logout (token ya expirado, red, etc.)
    } finally {
      tokenStore.clearSession();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      hasPremiumAccess: Boolean(user?.hasPremiumAccess),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
