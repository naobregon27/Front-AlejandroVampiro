import { apiClient } from '../api/apiClient';

/**
 * Servicio de encuestas públicas.
 * Nota: no existe endpoint de listado; el ID de la encuesta activa
 * se configura mediante la variable de entorno VITE_POLL_ID.
 */
export const pollService = {
  /**
   * Retorna el detalle de una encuesta publicada con opciones y porcentajes.
   * @param {string} pollId
   * @returns {{ id, title, startsAt, endsAt, totalVotes, options }}
   */
  getPoll: (pollId) => apiClient.get(`/public/polls/${pollId}`).then((r) => r.data),

  /**
   * Emite un voto en la encuesta. Requiere Bearer token (usuario logueado).
   * @param {string} pollId
   * @param {string} optionId
   * @returns {{ ok: true }}
   */
  vote: (pollId, optionId) =>
    apiClient.post(`/public/polls/${pollId}/vote`, { optionId }).then((r) => r.data),
};
