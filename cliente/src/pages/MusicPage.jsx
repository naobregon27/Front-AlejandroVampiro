import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '../hooks/useQuery';
import { usePlayer } from '../context/PlayerContext';
import { musicService } from '../services/musicService';
import { sortByOrder } from '../utils/media';
import { trackCover, trackPreview, TYPE_LABEL } from '../utils/content';

const FILTERS = [
  { value: 'all', label: 'Todo' },
  { value: 'single', label: 'Singles' },
  { value: 'live', label: 'Live' },
  { value: 'ep', label: 'EP' },
];

function TrackSkeleton() {
  return (
    <div className="surface-card animate-pulse overflow-hidden p-3">
      <div className="aspect-square rounded-xl bg-white/5" />
      <div className="mt-4 h-4 w-3/4 rounded bg-white/10" />
      <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
    </div>
  );
}

function MusicPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { playTrack, toggle, isCurrent, isPlaying } = usePlayer();
  const { data, loading, error } = useQuery(musicService.getMusicTracks);

  const tracks = useMemo(() => sortByOrder(data?.items ?? []), [data?.items]);

  const filteredTracks = useMemo(
    () => (activeFilter === 'all' ? tracks : tracks.filter((t) => t.type === activeFilter)),
    [tracks, activeFilter]
  );

  const featured = filteredTracks[0] ?? tracks[0] ?? null;
  const featuredCover = featured ? trackCover(featured) : null;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          {featuredCover ? (
            <img
              src={featuredCover}
              alt=""
              className="h-full w-full scale-110 object-cover opacity-35 blur-2xl"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/80 to-ink-950" />
        </div>

        <div className="page-shell-wide relative">
          <p className="section-kicker">Catálogo</p>
          <h1 className="section-title mt-2">Música</h1>
          <p className="section-copy">
            Reproducí previews, abrí Spotify / YouTube y explorá cada lanzamiento.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`filter-pill ${activeFilter === f.value ? 'filter-pill-active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell-wide pt-8">
        {error ? (
          <div className="surface-card p-5 text-sm text-red-300">
            No se pudo cargar el catálogo. Intentá más tarde.
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <TrackSkeleton key={i} />)
            : filteredTracks.map((track, i) => {
                const cover = trackCover(track);
                const preview = trackPreview(track);
                const playingHere = isCurrent(track.id) && isPlaying;
                const meta = [track.mood, track.status, track.duration].filter(Boolean);

                return (
                  <motion.article
                    key={track.id}
                    className="group surface-card flex flex-col overflow-hidden p-3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <div className="relative">
                      {cover ? (
                        <img
                          src={cover}
                          alt={`Portada de ${track.title}`}
                          className="media-cover transition duration-500 group-hover:brightness-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="media-cover grid place-items-center text-zinc-600">♪</div>
                      )}
                      {preview ? (
                        <button
                          type="button"
                          className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-ember text-lg text-ink-950 opacity-95 shadow-glow transition hover:scale-105 sm:opacity-0 sm:group-hover:opacity-100"
                          onClick={() =>
                            isCurrent(track.id) ? toggle() : playTrack(track, filteredTracks)
                          }
                          aria-label={`Reproducir ${track.title}`}
                        >
                          {playingHere ? '❚❚' : '▶'}
                        </button>
                      ) : null}
                      {playingHere ? (
                        <span className="absolute left-3 top-3 chip bg-ember/20">Sonando</span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-1 flex-col px-1 pb-2">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-ember-soft">
                        {TYPE_LABEL[track.type] ?? track.type}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold leading-tight text-zinc-50">
                        {track.title}
                      </h2>
                      {meta.length > 0 ? (
                        <p className="mt-1 text-xs text-zinc-500">{meta.join(' · ')}</p>
                      ) : null}

                      <div className="mt-auto flex flex-wrap gap-2 pt-4">
                        {track.spotifyUrl ? (
                          <a
                            href={track.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="filter-pill !px-3 !py-1 text-xs"
                          >
                            Spotify
                          </a>
                        ) : null}
                        {track.youtubeUrl ? (
                          <a
                            href={track.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="filter-pill !px-3 !py-1 text-xs"
                          >
                            YouTube
                          </a>
                        ) : null}
                        {track.appleMusicUrl ? (
                          <a
                            href={track.appleMusicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="filter-pill !px-3 !py-1 text-xs"
                          >
                            Apple
                          </a>
                        ) : null}
                        {!preview &&
                        !track.spotifyUrl &&
                        !track.youtubeUrl &&
                        !track.appleMusicUrl ? (
                          <span className="text-xs text-zinc-600">Próximamente</span>
                        ) : null}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
        </div>

        {!loading && !error && filteredTracks.length === 0 ? (
          <div className="surface-card mt-8 p-8 text-center text-sm text-zinc-400">
            No hay tracks en esta categoría todavía.
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default MusicPage;
