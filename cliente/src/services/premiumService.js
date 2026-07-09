import { apiClient } from '../api/apiClient';

/**
 * Servicio de contenido premium.
 * - preview: público, sin URLs reales (tarjetas "locked").
 * - content: requiere Bearer + hasPremiumAccess.
 */
export const premiumService = {
  /**
   * Vista previa pública para la landing (sin mediaUrl/downloadUrl).
   * @returns {{ items: PremiumPreviewItem[] }}
   */
  getPremiumPreview: () => apiClient.get('/public/premium-preview').then((r) => r.data),

  /**
   * Contenido premium completo con URLs de medios.
   * Requiere autenticación y hasPremiumAccess: true.
   * @returns {{ items: PremiumContentItem[] }}
   */
  getPremiumContent: () => apiClient.get('/me/premium-content').then((r) => r.data),
};
