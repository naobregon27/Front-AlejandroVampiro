import { apiClient } from '../api/apiClient';

/**
 * Servicio de eventos de comunidad.
 * Retorna eventos publicados ordenados por sortOrder y startsAt.
 */
export const communityService = {
  /**
   * @returns {{ items: CommunityEvent[] }}
   */
  getCommunityEvents: () => apiClient.get('/public/community-events').then((r) => r.data),
};
