import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '../hooks/useQuery';
import { galleryService } from '../services/galleryService';
import {
  externalVideoEmbedUrl,
  isDirectMediaFile,
  sortByOrder,
} from '../utils/media';
import { galleryThumb, mediaPublicUrl } from '../utils/content';

const CATEGORY_LABEL = {
  show: 'Show',
  backstage: 'Backstage',
};

const FILTERS = [
  { value: 'all', label: 'Todo' },
  { value: 'show', label: 'Shows' },
  { value: 'backstage', label: 'Backstage' },
];

function detailMediaType(item) {
  return item.detailMediaType ?? item.mediaType;
}

function itemCaption(item) {
  return item.caption ?? item.description;
}

function GalleryDetailMedia({ item }) {
  const thumb = galleryThumb(item);
  const mediaType = detailMediaType(item);

  if (mediaType === 'video') {
    const videoSrc =
      item.detailVideoDataUrl ??
      mediaPublicUrl(item.detailVideoMediaId) ??
      item.mediaUrl ??
      null;
    const external = item.externalVideoUrl;
    const embed =
      (videoSrc ? externalVideoEmbedUrl(videoSrc) : null) ??
      (external ? externalVideoEmbedUrl(external) : null);

    if (embed) {
      return (
        <iframe
          title={item.title ?? 'Video'}
          src={embed}
          className="mt-5 aspect-video w-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoSrc && isDirectMediaFile(videoSrc)) {
      return (
        <video
          src={videoSrc}
          controls
          playsInline
          autoPlay
          className="mt-5 w-full rounded-xl"
          poster={thumb || undefined}
        />
      );
    }

    if (external) {
      return (
        <a
          href={external}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 inline-flex text-sm"
        >
          Ver video
        </a>
      );
    }
  }

  const imageSrc =
    item.detailImageDataUrl ?? mediaPublicUrl(item.detailImageMediaId) ?? thumb;
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={item.title ?? 'Visual'}
        className="mt-5 max-h-[65vh] w-full rounded-xl object-contain"
      />
    );
  }

  return (
    <div className="mt-5 grid h-48 place-items-center rounded-xl border border-white/10 bg-black/40 text-sm text-zinc-500">
      Vista previa no disponible
    </div>
  );
}

function GalleryPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const { data, loading, error } = useQuery(galleryService.getGallery);

  const items = useMemo(() => sortByOrder(data?.items ?? []), [data?.items]);
  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  return (
    <div>
      <section className="page-shell-wide pb-4">
        <p className="section-kicker">Archivo visual</p>
        <h1 className="section-title mt-2">Galería</h1>
        <p className="section-copy">
          Escenas de show, backstage y material audiovisual del proyecto.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`filter-pill ${filter === f.value ? 'filter-pill-active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="page-shell-wide pt-4">
        {error ? (
          <div className="surface-card p-5 text-sm text-red-300">
            No se pudo cargar la galería. Intentá más tarde.
          </div>
        ) : null}

        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-3 break-inside-avoid animate-pulse rounded-2xl bg-white/5"
                  style={{ height: 160 + (i % 3) * 40 }}
                />
              ))
            : filtered.map((item, i) => {
                const thumb = galleryThumb(item);
                const isVideo = detailMediaType(item) === 'video';
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    className="group relative mb-3 w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 text-left"
                    onClick={() => setSelected(item)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.25) }}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.title ?? 'Visual'}
                        className="w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid aspect-video place-items-center bg-ink-800 text-zinc-600">
                        Visual
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90 transition group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-center gap-2">
                        <span className="chip !py-0.5">
                          {CATEGORY_LABEL[item.category] ?? item.category ?? 'Show'}
                        </span>
                        {isVideo ? (
                          <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-200">
                            Video
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                    </div>
                  </motion.button>
                );
              })}
        </div>

        {!loading && !error && filtered.length === 0 ? (
          <div className="surface-card mt-6 p-8 text-center text-sm text-zinc-400">
            No hay piezas en esta categoría todavía.
          </div>
        ) : null}
      </section>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/90 px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            role="presentation"
          >
            <motion.div
              className="surface-card max-h-[92vh] w-full max-w-3xl overflow-y-auto p-5 sm:p-7"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={selected.title ?? 'Detalle'}
            >
              <p className="section-kicker">
                {CATEGORY_LABEL[selected.category] ?? selected.category ?? 'Visual'}
              </p>
              <h2 className="mt-2 font-display text-4xl tracking-wide">
                {selected.title ?? 'Sin título'}
              </h2>
              {itemCaption(selected) ? (
                <p className="mt-2 text-sm text-zinc-400">{itemCaption(selected)}</p>
              ) : null}
              <GalleryDetailMedia item={selected} />
              <button
                className="btn-secondary mt-6"
                type="button"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default GalleryPage;
