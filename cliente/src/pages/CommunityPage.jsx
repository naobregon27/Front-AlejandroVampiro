import { useState } from 'react';

const events = [
  { city: 'Buenos Aires', name: 'Session acustica', date: '10 Abril' },
  { city: 'Cordoba', name: 'Show nocturno', date: '22 Abril' },
  { city: 'Rosario', name: 'Encuentro VIP', date: '03 Mayo' },
];

function CommunityPage() {
  const [votes, setVotes] = useState({
    'Ruta de Humo': 42,
    'Rojo Neon': 37,
    'Amigos del Barrio': 29,
  });

  const voteTrack = (trackName) => {
    setVotes((prev) => ({ ...prev, [trackName]: prev[trackName] + 1 }));
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14 lg:py-16">
      <h1 className="section-title">Comunidad</h1>
      <p className="section-copy">
        Fan hub para noticias, sorteos, experiencias post show y votacion de canciones para proximos eventos.
      </p>
      <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2">
        <article className="surface-card p-6">
          <h2 className="text-xl font-bold">Agenda de eventos</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            {events.map((event) => (
              <li key={event.city} className="flex items-center justify-between gap-2 rounded-md border border-white/10 p-3">
                <span>
                  {event.city} - {event.name}
                </span>
                <span className="text-xs text-red-300">{event.date}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="surface-card p-6">
          <h2 className="text-xl font-bold">Votacion de setlist</h2>
          <p className="mt-2 text-sm text-zinc-300">Vota tu track favorito para el proximo show.</p>
          <div className="mt-4 space-y-3">
            {Object.entries(votes).map(([track, total]) => (
              <div key={track} className="rounded-md border border-white/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-zinc-200">{track}</p>
                  <span className="text-xs text-red-300">{total} votos</span>
                </div>
                <button className="btn-secondary mt-3" type="button" onClick={() => voteTrack(track)}>
                  Votar
                </button>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default CommunityPage;
