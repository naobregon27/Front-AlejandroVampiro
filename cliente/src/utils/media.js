/**
 * Helpers para URLs de medios (Cloudinary HTTPS u otras).
 * Los campos *DataUrl del API son URLs públicas, no base64.
 */

export function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

export function isCloudinaryUrl(value) {
  return typeof value === 'string' && value.includes('res.cloudinary.com');
}

/** YouTube / Vimeo / etc. embebibles o enlazables (no archivo directo). */
export function youtubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      const parts = u.pathname.split('/').filter(Boolean);
      const embedIdx = parts.indexOf('embed');
      if (embedIdx !== -1 && parts[embedIdx + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIdx + 1]}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function vimeoEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes('vimeo.com')) return null;
    const id = u.pathname.split('/').filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  } catch {
    return null;
  }
}

export function externalVideoEmbedUrl(url) {
  return youtubeEmbedUrl(url) ?? vimeoEmbedUrl(url);
}

/**
 * ¿Se puede usar en <video src> / <audio src>?
 * Cloudinary a veces sirve audio/video bajo /video/upload/ sin extensión clara.
 */
export function isDirectMediaFile(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:')) return true;
  if (!isHttpUrl(url)) return false;
  if (externalVideoEmbedUrl(url)) return false;
  if (/\.(mp4|webm|ogg|mov|m4v|mp3|wav|m4a|aac)(\?|#|$)/i.test(url)) return true;
  if (isCloudinaryUrl(url) && /\/(video|image|raw)\/upload\//i.test(url)) return true;
  return false;
}

export function isLikelyAudioUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:audio')) return true;
  return /\.(mp3|wav|m4a|aac|ogg)(\?|#|$)/i.test(url);
}

export function isLikelyVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:video')) return true;
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url)) return true;
  if (isCloudinaryUrl(url) && /\/video\/upload\//i.test(url) && !isLikelyAudioUrl(url)) {
    return true;
  }
  return false;
}

export function sortByOrder(items = []) {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
