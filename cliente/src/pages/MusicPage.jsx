const tracks = [
  { title: 'Ruta de Humo', status: 'Single 2026', mood: 'Noche profunda' },
  { title: 'Amigos del Barrio', status: 'Live Session', mood: 'Hermandad' },
  { title: 'Rojo Neon', status: 'EP teaser', mood: 'Energia urbana' },
];

function MusicPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="section-title">Catalogo musical</h1>
      <p className="section-copy">
        Vista de lanzamientos con integracion futura a Spotify, YouTube Music y Apple Music.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {tracks.map((track) => (
          <article key={track.title} className="surface-card p-6">
            <p className="text-xs uppercase tracking-wider text-red-300">{track.status}</p>
            <h2 className="mt-2 text-xl font-bold">{track.title}</h2>
            <p className="mt-2 text-sm text-zinc-300">{track.mood}</p>
            <button className="btn-secondary mt-6" type="button">
              Escuchar preview
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MusicPage;
