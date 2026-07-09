import { apiClient } from '../api/apiClient';

/**
 * Servicio de configuración del sitio.
 * Incluye nav links, redes sociales, highlights y metadatos SEO.
 */
export const siteConfigService = {
  /**
   * @returns {{ navLinks, socialLinks, highlights, siteSettings }}
   */
  getSiteConfig: () => apiClient.get('/public/site-config').then((r) => r.data),
};
