import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import { useQuery } from '../hooks/useQuery';
import { premiumService } from '../services/premiumService';
import {
  externalVideoEmbedUrl,
  isDirectMediaFile,
  isLikelyAudioUrl,
  isLikelyVideoUrl,
} from '../utils/media';

const CONTENT_TYPE_LABEL = {
  video: 'Video',
  link: 'Enlace',
  download: 'Descarga',
  info: 'Info',
};

function PremiumMediaActions({ item }) {
  const { contentType, mediaUrl, externalUrl, downloadUrl, ctaLabel } = item;

  if (contentType === 'video') {
    const embed = mediaUrl ? externalVideoEmbedUrl(mediaUrl) : null;
    if (embed) {
      return (
        <iframe
          title={item.title ?? 'Video premium'}
          src={embed}
          className="mt-4 aspect-video w-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    if (mediaUrl && isDirectMediaFile(mediaUrl)) {
      return (
        <video className="mt-4 w-full rounded-xl" controls playsInline src={mediaUrl} />
      );
    }
    if (externalUrl) {
      const extEmbed = externalVideoEmbedUrl(externalUrl);
      if (extEmbed) {
        return (
          <iframe
            title={item.title ?? 'Video premium'}
            src={extEmbed}
            className="mt-4 aspect-video w-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
      return (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4 inline-flex text-sm"
        >
          {ctaLabel || 'Ver video'}
        </a>
      );
    }
  }

  if (contentType === 'download' && downloadUrl) {
    return (
      <a
        href={downloadUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 inline-flex text-sm"
      >
        {ctaLabel || 'Descargar'}
      </a>
    );
  }

  if (contentType === 'link' && externalUrl) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 inline-flex text-sm"
      >
        {ctaLabel || 'Acceder'}
      </a>
    );
  }

  if (contentType === 'info') {
    return (
      <p className="mt-4 text-xs text-zinc-500">{ctaLabel || 'Material de referencia'}</p>
    );
  }

  if (mediaUrl) {
    if (isLikelyAudioUrl(mediaUrl)) {
      return <audio className="mt-4 w-full" controls src={mediaUrl} />;
    }
    if (isLikelyVideoUrl(mediaUrl) || isDirectMediaFile(mediaUrl)) {
      const embed = externalVideoEmbedUrl(mediaUrl);
      if (embed) {
        return (
          <iframe
            title={item.title ?? 'Contenido'}
            src={embed}
            className="mt-4 aspect-video w-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
      return (
        <video className="mt-4 w-full rounded-xl" controls playsInline src={mediaUrl} />
      );
    }
    return (
      <a
        href={mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 inline-flex text-sm"
      >
        {ctaLabel || 'Ver contenido'}
      </a>
    );
  }

  if (externalUrl) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 inline-flex text-sm"
      >
        {ctaLabel || 'Acceder'}
      </a>
    );
  }

  if (downloadUrl) {
    return (
      <a
        href={downloadUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 inline-flex text-sm"
      >
        {ctaLabel || 'Descargar'}
      </a>
    );
  }

  return <span className="text-xs text-zinc-500">{ctaLabel || 'Próximamente'}</span>;
}

function ContentSkeleton() {
  return (
    <div className="surface-card animate-pulse p-6">
      <div className="h-3 w-16 rounded bg-white/10" />
      <div className="mt-3 h-5 w-2/3 rounded bg-white/10" />
      <div className="mt-2 h-3 w-full rounded bg-white/5" />
      <div className="mt-6 h-8 w-28 rounded bg-white/10" />
    </div>
  );
}

function PremiumContent() {
  const { data, loading, error } = useQuery(premiumService.getPremiumContent);
  const items = data?.items ?? [];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ContentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="surface-card p-5 text-sm text-red-300">{error}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="surface-card p-6 text-sm text-zinc-400">
        Aún no hay contenido premium publicado.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, i) => (
        <motion.article
          key={item.id}
          className="surface-card flex flex-col p-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <p className="section-kicker">
            {CONTENT_TYPE_LABEL[item.contentType] ?? item.contentType ?? 'Premium'}
          </p>
          <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
          {item.description ? (
            <p className="mt-2 text-sm font-light text-zinc-400">{item.description}</p>
          ) : null}
          <div className="mt-auto pt-4">
            <PremiumMediaActions item={item} />
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function PreviewContent() {
  const { data, loading } = useQuery(premiumService.getPremiumPreview);
  const items = data?.items ?? [];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ContentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="surface-card p-6 text-sm text-zinc-400">
        Todavía no hay vista previa de contenido premium.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="surface-card relative flex flex-col overflow-hidden p-6"
        >
          <div className="absolute inset-0 grid place-items-center bg-ink-950/70 backdrop-blur-[2px]">
            <div className="text-center">
              <p className="font-display text-2xl tracking-wide text-ember-soft">VIP</p>
              <p className="mt-1 text-xs text-zinc-400">Acceso premium requerido</p>
            </div>
          </div>
          <p className="section-kicker">
            {CONTENT_TYPE_LABEL[item.contentType] ?? item.contentType ?? 'Premium'}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-200">{item.title}</h2>
          {item.description ? (
            <p className="mt-2 text-sm text-zinc-500">{item.description}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function ExclusivePage() {
  const { user, hasPremiumAccess } = useAuth();

  return (
    <div>
      <section className="page-shell-wide pb-4">
        <p className="section-kicker">Inner circle</p>
        <h1 className="section-title mt-2">Zona exclusiva</h1>
        <p className="section-copy">
          Hola, <span className="text-zinc-100">{user?.name}</span>.{' '}
          {hasPremiumAccess
            ? 'Tenés acceso completo al material premium.'
            : 'Pedí acceso premium para desbloquear todo.'}
        </p>
      </section>

      <section className="page-shell-wide pt-4">
        {hasPremiumAccess ? (
          <PremiumContent />
        ) : (
          <>
            <div className="surface-card flex flex-col items-start gap-4 border-l-4 border-ember p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-zinc-50">Tu cuenta aún no es premium</p>
                <p className="mt-1 text-sm text-zinc-400">
                  El admin puede habilitarte. Escribinos y pedí el acceso.
                </p>
              </div>
              <Link to="/contacto" className="btn-primary shrink-0 text-sm">
                Solicitar acceso
              </Link>
            </div>
            <div className="mt-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Vista previa
              </p>
              <PreviewContent />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ExclusivePage;
