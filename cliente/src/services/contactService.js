import { apiClient } from '../api/apiClient';

/**
 * Servicio de mensajes de contacto.
 * Rate limit: ~30 peticiones / hora por IP.
 */
export const contactService = {
  /**
   * Envía un mensaje de contacto (sin autenticación requerida).
   * @param {{ name: string, email: string, subject: string, message: string }} payload
   * @returns {{ ok: true }}
   */
  sendMessage: (payload) =>
    apiClient.post('/public/contact-messages', payload).then((r) => r.data),
};
