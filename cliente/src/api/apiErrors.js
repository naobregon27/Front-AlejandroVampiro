const ERROR_MAP = {
  EMAIL_IN_USE: 'El email ya está en uso. Probá con otro.',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
  USER_BLOCKED: 'Tu cuenta está bloqueada. Contactá soporte.',
  INVALID_REFRESH: 'Tu sesión expiró. Iniciá sesión nuevamente.',
  INVALID_TOKEN: 'Tu sesión no es válida. Iniciá sesión nuevamente.',
  PREMIUM_REQUIRED: 'Necesitás acceso premium para ver este contenido.',
  POLL_NOT_FOUND: 'La encuesta no existe o no está disponible.',
  ALREADY_VOTED: 'Ya votaste en esta encuesta.',
  POLL_ENDED: 'La votación ya terminó.',
  POLL_NOT_STARTED: 'La votación aún no empezó.',
  INVALID_OPTION: 'Opción de voto inválida.',
  INVALID_ID: 'ID inválido.',
  SITE_CONFIG_NOT_FOUND: 'Configuración del sitio no disponible.',
  VALIDATION_ERROR: 'Hay errores en el formulario. Revisá los campos.',
  INTERNAL_ERROR: 'Error interno del servidor. Intentá más tarde.',
};

const FALLBACK = 'Ocurrió un error inesperado. Intentá nuevamente.';

/**
 * Extrae un mensaje de error legible de un error de axios.
 * @param {unknown} error
 * @param {string} [fallback]
 * @returns {string}
 */
export function getErrorMessage(error, fallback = FALLBACK) {
  const status = error?.response?.status;
  if (status === 429) {
    return 'Demasiados intentos. Probá de nuevo más tarde.';
  }
  const code = error?.response?.data?.code;
  const serverMessage = error?.response?.data?.message;
  return ERROR_MAP[code] ?? serverMessage ?? fallback;
}
