import { createContext, useContext } from 'react';

const SiteConfigContext = createContext(null);

export function SiteConfigProvider({ children, value }) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig debe usarse dentro de SiteConfigProvider');
  }
  return ctx;
}
