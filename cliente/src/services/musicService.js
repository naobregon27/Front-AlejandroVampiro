import { apiClient } from '../api/apiClient';

/**
 * Servicio de catálogo musical.
 * Retorna tracks publicados ordenados por sortOrder.
 */
export const musicService = {
  /**
   * @returns {{ items: MusicTrack[] }}
   */
  getMusicTracks: () => apiClient.get('/public/music-tracks').then((r) => r.data),
};
