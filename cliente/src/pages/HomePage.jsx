import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';
import { usePlayer } from '../context/PlayerContext';
import { useQuery } from '../hooks/useQuery';
import { musicService } from '../services/musicService';
import { galleryService } from '../services/galleryService';
import { communityService } from '../services/communityService';
import { sortByOrder } from '../utils/media';
import { galleryThumb, trackCover, trackPreview, TYPE_LABEL } from '../utils/content';
import { highlights as staticHighlights } from '../data/siteContent';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

function formatEventDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  });
}

function HomePage() {
  const { data: siteConfig, error: siteConfigError } = useSiteConfig();
  const { playTrack, isCurrent, isPlaying, toggle } = usePlayer();

  const { data: musicData, loading: musicLoading } = useQuery(musicService.getMusicTracks);
  const { data: galleryData, loading: galleryLoading } = useQuery(galleryService.getGallery);
  const { data: eventsData } = useQuery(communityService.getCommunityEvents);

  const tracks = useMemo(() => sortByOrder(musicData?.items ?? []), [musicData?.items]);
  const gallery = useMemo(() => sortByOrder(galleryData?.items ?? []).slice(0, 6), [galleryData?.items]);
  const events = useMemo(() => {
    const items = sortByOrder(eventsData?.items ?? []);
    return [...items]
      .sort((a, b) => new Date(a.startsAt || 0) - new Date(b.startsAt || 0))
      .slice(0, 3);
  }, [eventsData?.items]);

  const featured = tracks[0] ?? null;
  const featuredCover = featured ? trackCover(featured) : null;
  const featuredPreview = featured ? trackPreview(featured) : null;

  const heroImage =
    siteConfig?.siteSettings?.defaultOgImageUrl?.trim() ||
    featuredCover ||
    galleryThumb(gallery[0]) ||
    null;

  const siteTitle = siteConfig?.siteSettings?.siteTitle?.trim() || 'Acevedo Music';
  const siteDescription =
    siteConfig?.siteSettings?.siteDescription?.trim() ||
    'Sonido crudo, noches largas y una comunidad que vibra con cada drop.';

  const highlights = useMemo(() => {
    if (siteConfig) {
      return [...(siteConfig.highlights ?? [])]
        .filter((h) => h.visible !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }
    return siteConfigError ? staticHighlights : [];
  }, [siteConfig, siteConfigError]);

  const socialLinks = useMemo(() => {
    if (!siteConfig?.socialLinks) return [];
    return [...siteConfig.socialLinks]
      .filter((l) => l.visible !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [siteConfig?.socialLinks]);

  const handleFeaturedPlay = () => {
    if (!featured || !featuredPreview) return;
    if (isCurrent(featured.id)) toggle();
    else playTrack(featured, tracks);
  };

  return (
    <div>
      {/* HERO full-bleed */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt=""
              className="h-full w-full scale-105 object-cover mask-fade-b"
              loading="eager"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-ink-800 via-ink-950 to-ember-deep/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-5 sm:pb-20 lg:pb-24">
          <motion.p
            className="section-kicker"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
          >
            Plataforma oficial
          </motion.p>
          <motion.h1
            className="mt-4 max-w-4xl font-display text-6xl leading-[0.9] tracking-[0.04em] text-white sm:text-7xl md:text-8xl lg:text-9xl"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
          >
            {siteTitle}
          </motion.h1>
          <motion.p
            className="mt-5 max-w-xl text-base font-light text-zinc-300 sm:text-lg"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
          >
            {siteDescription}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
          >
            {featuredPreview ? (
              <button type="button" className="btn-primary" onClick={handleFeaturedPlay}>
                {isCurrent(featured.id) && isPlaying ? 'Pausar' : 'Escuchar ahora'}
              </button>
            ) : (
              <Link className="btn-primary" to="/musica">
                Explorar música
              </Link>
            )}
            <Link className="btn-secondary" to="/galeria">
              Ver galería
            </Link>
          </motion.div>

          {featured ? (
            <motion.div
              className="mt-10 flex max-w-md items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                {featuredCover ? (
                  <img src={featuredCover} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-ember-soft">
                  En rotación
                </p>
                <p className="truncate font-semibold text-white">{featured.title}</p>
                <p className="truncate text-xs text-zinc-400">
                  {TYPE_LABEL[featured.type] ?? featured.type}
                  {featured.mood ? ` · ${featured.mood}` : ''}
                </p>
              </div>
              {featuredPreview ? (
                <button
                  type="button"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ember text-ink-950"
                  onClick={handleFeaturedPlay}
                  aria-label="Play"
                >
                  {isCurrent(featured.id) && isPlaying ? '❚❚' : '▶'}
                </button>
              ) : null}
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* HIGHLIGHTS del admin */}
      {highlights.length > 0 ? (
        <section className="page-shell-wide">
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item, i) => (
              <motion.article
                key={`${item.title}-${item.sortOrder ?? i}`}
                className="surface-card p-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ember/70">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl tracking-wide">{item.title}</h3>
                <p className="mt-2 text-sm font-light text-zinc-400">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </section>
      ) : null}

      {/* CATÁLOGO */}
      <section className="page-shell-wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Discografía</p>
            <h2 className="section-title mt-2">Escuchá los lanzamientos</h2>
            <p className="section-copy">Singles, lives y EPs publicados desde el estudio.</p>
          </div>
          <Link to="/musica" className="btn-secondary !py-2 text-xs">
            Ver todo
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {musicLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="surface-card animate-pulse p-4">
                  <div className="aspect-square rounded-xl bg-white/5" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-white/10" />
                </div>
              ))
            : tracks.slice(0, 8).map((track, i) => {
                const cover = trackCover(track);
                const preview = trackPreview(track);
                const playingHere = isCurrent(track.id) && isPlaying;
                return (
                  <motion.article
                    key={track.id}
                    className="group surface-card overflow-hidden p-3"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-20px' }}
                    custom={i % 4}
                  >
                    <div className="relative">
                      {cover ? (
                        <img
                          src={cover}
                          alt={`Portada de ${track.title}`}
                          className="media-cover transition duration-500 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="media-cover grid place-items-center text-zinc-600">♪</div>
                      )}
                      {preview ? (
                        <button
                          type="button"
                          className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-ember text-ink-950 opacity-0 shadow-glow transition group-hover:opacity-100"
                          onClick={() =>
                            isCurrent(track.id) ? toggle() : playTrack(track, tracks)
                          }
                          aria-label={`Reproducir ${track.title}`}
                        >
                          {playingHere ? '❚❚' : '▶'}
                        </button>
                      ) : null}
                    </div>
                    <div className="mt-3 px-1 pb-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-ember-soft/80">
                        {TYPE_LABEL[track.type] ?? track.type}
                      </p>
                      <h3 className="mt-1 truncate font-semibold text-zinc-50">{track.title}</h3>
                      <p className="truncate text-xs text-zinc-500">
                        {[track.mood, track.duration].filter(Boolean).join(' · ') || 'Nuevo'}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
        </div>

        {!musicLoading && tracks.length === 0 ? (
          <p className="mt-8 text-sm text-zinc-500">Pronto llegan los primeros lanzamientos.</p>
        ) : null}
      </section>

      {/* GALERÍA PREVIEW */}
      <section className="page-shell-wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Visuales</p>
            <h2 className="section-title mt-2">Shows & backstage</h2>
            <p className="section-copy">Fotos y videos del universo Acevedo.</p>
          </div>
          <Link to="/galeria" className="btn-secondary !py-2 text-xs">
            Abrir galería
          </Link>
        </div>

        <div className="mt-8 grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
          {galleryLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5" />
              ))
            : gallery.map((item, i) => {
                const thumb = galleryThumb(item);
                const span =
                  i === 0
                    ? 'md:col-span-2 md:row-span-2'
                    : i === 3
                      ? 'md:col-span-2'
                      : '';
                return (
                  <Link
                    key={item.id}
                    to="/galeria"
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800 ${span}`}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.title ?? 'Visual'}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-zinc-600">Visual</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-ember-soft">
                        {item.category === 'backstage' ? 'Backstage' : 'Show'}
                      </p>
                      <p className="truncate text-sm font-medium text-white">{item.title}</p>
                    </div>
                  </Link>
                );
              })}
        </div>

        {!galleryLoading && gallery.length === 0 ? (
          <p className="mt-8 text-sm text-zinc-500">La galería se llena desde el panel admin.</p>
        ) : null}
      </section>

      {/* EVENTOS + CTA */}
      <section className="page-shell-wide grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-6 sm:p-8">
          <p className="section-kicker">Agenda</p>
          <h2 className="mt-2 font-display text-4xl tracking-wide">Próximas fechas</h2>
          {events.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">
              Todavía no hay shows publicados. Seguí la comunidad para enterarte primero.
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-zinc-100">{event.title}</p>
                    <p className="text-xs text-zinc-500">{event.city ?? event.location}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-ember/30 px-3 py-1 text-xs text-ember-soft">
                    {formatEventDate(event.startsAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/comunidad" className="btn-secondary mt-6 !py-2 text-xs">
            Ver comunidad
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-ember/20 bg-gradient-to-br from-ember-deep/40 via-ink-900 to-ink-950 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember/20 blur-3xl" />
          <p className="section-kicker">Zona exclusiva</p>
          <h2 className="mt-2 font-display text-4xl tracking-wide text-white">
            Acceso premium
          </h2>
          <p className="mt-3 text-sm font-light text-zinc-300">
            Material inédito, descargas y contenido solo para la comunidad cercana.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/registro" className="btn-primary">
              Crear cuenta
            </Link>
            <Link to="/exclusivo" className="btn-secondary">
              Entrar a exclusivo
            </Link>
          </div>
          {socialLinks.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={`${link.platform}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
