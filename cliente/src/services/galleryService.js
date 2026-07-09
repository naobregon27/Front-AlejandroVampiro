import { apiClient } from '../api/apiClient';

/**
 * Servicio de galería visual.
 * Retorna ítems publicados (fotos / videos de shows y backstage).
 */
export const galleryService = {
  /**
   * @returns {{ items: GalleryItem[] }}
   */
  getGallery: () => apiClient.get('/public/gallery').then((r) => r.data),
};
