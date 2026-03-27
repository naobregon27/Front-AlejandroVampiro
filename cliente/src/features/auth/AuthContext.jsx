import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'musico-prototype-user';

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (payload) => {
        const userData = { name: payload.name || 'Fan VIP', email: payload.email };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
      },
      register: (payload) => {
        const userData = { name: payload.name, email: payload.email };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    }),
    [user]
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
