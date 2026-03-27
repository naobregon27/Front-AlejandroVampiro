import { useMemo, useState } from 'react';

const tracks = [
  { title: 'Ruta de Humo', status: 'Single 2026', mood: 'Noche profunda', duration: '2:41', type: 'single' },
  { title: 'Amigos del Barrio', status: 'Live Session', mood: 'Hermandad', duration: '3:10', type: 'live' },
  { title: 'Rojo Neon', status: 'EP teaser', mood: 'Energia urbana', duration: '2:58', type: 'ep' },
  { title: 'Asfalto y Luna', status: 'Single 2025', mood: 'Melancolia', duration: '3:22', type: 'single' },
];

function MusicPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [playingTrack, setPlayingTrack] = useState('');

  const filteredTracks = useMemo(
    () => (activeFilter === 'all' ? tracks : tracks.filter((track) => track.type === activeFilter)),
    [activeFilter]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14 lg:py-16">
      <h1 className="section-title">Catalogo musical</h1>
      <p className="section-copy">
        Vista de lanzamientos con integracion futura a Spotify, YouTube Music y Apple Music.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          className={activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}
          type="button"
          onClick={() => setActiveFilter('all')}
        >
          Todo
        </button>
        <button
          className={activeFilter === 'single' ? 'btn-primary' : 'btn-secondary'}
          type="button"
          onClick={() => setActiveFilter('single')}
        >
          Singles
        </button>
        <button
          className={activeFilter === 'live' ? 'btn-primary' : 'btn-secondary'}
          type="button"
          onClick={() => setActiveFilter('live')}
        >
          Live
        </button>
        <button
          className={activeFilter === 'ep' ? 'btn-primary' : 'btn-secondary'}
          type="button"
          onClick={() => setActiveFilter('ep')}
        >
          EP
        </button>
      </div>
      <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredTracks.map((track) => (
          <article key={track.title} className="surface-card p-6">
            <p className="text-xs uppercase tracking-wider text-red-300">{track.status}</p>
            <h2 className="mt-2 text-xl font-bold">{track.title}</h2>
            <p className="mt-2 text-sm text-zinc-300">{track.mood}</p>
            <p className="mt-2 text-xs text-zinc-500">Duracion: {track.duration}</p>
            <button
              className="btn-secondary mt-6 w-full sm:w-auto"
              type="button"
              onClick={() => setPlayingTrack(track.title)}
            >
              Escuchar preview
            </button>
          </article>
        ))}
      </div>
      <div className="surface-card mt-8 p-4 text-sm text-zinc-300 sm:p-5">
        {playingTrack ? `Reproduciendo preview de "${playingTrack}"` : 'Selecciona un track para iniciar preview.'}
      </div>
    </section>
  );
}

export default MusicPage;
