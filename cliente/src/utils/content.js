/**
 * Helpers compartidos para tracks / galería desde la API.
 */

export function mediaPublicUrl(media) {
  if (!media) return null;
  if (typeof media === 'string') return media;
  return media.publicUrl ?? null;
}

export function trackCover(t) {
  return t?.coverDataUrl ?? mediaPublicUrl(t?.coverMediaId) ?? t?.coverUrl ?? null;
}

export function trackPreview(t) {
  return t?.previewDataUrl ?? mediaPublicUrl(t?.previewMediaId) ?? t?.previewUrl ?? null;
}

export function galleryThumb(item) {
  return (
    item?.thumbnailDataUrl ??
    mediaPublicUrl(item?.thumbnailMediaId) ??
    item?.thumbnailUrl ??
    null
  );
}

export const TYPE_LABEL = {
  single: 'Single',
  live: 'Live',
  ep: 'EP',
};
