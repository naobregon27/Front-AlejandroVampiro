const KEYS = {
  ACCESS: 'acv2_access_token',
  REFRESH: 'acv2_refresh_token',
  USER: 'acv2_user',
};

export const tokenStore = {
  getAccessToken: () => localStorage.getItem(KEYS.ACCESS),

  getRefreshToken: () => localStorage.getItem(KEYS.REFRESH),

  getUser: () => {
    const raw = localStorage.getItem(KEYS.USER);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setSession: (accessToken, refreshToken, user) => {
    localStorage.setItem(KEYS.ACCESS, accessToken);
    localStorage.setItem(KEYS.REFRESH, refreshToken);
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  setUser: (user) => {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  clearSession: () => {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  },
};
