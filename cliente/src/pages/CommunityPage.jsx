function CommunityPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="section-title">Comunidad</h1>
      <p className="section-copy">
        Fan hub para noticias, sorteos, experiencias post show y votacion de canciones para proximos eventos.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="surface-card p-6">
          <h2 className="text-xl font-bold">Agenda de eventos</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            <li>Buenos Aires - Session acustica</li>
            <li>Cordoba - Show nocturno</li>
            <li>Rosario - Encuentro VIP</li>
          </ul>
        </article>
        <article className="surface-card p-6">
          <h2 className="text-xl font-bold">Muro de fans</h2>
          <p className="mt-4 text-sm text-zinc-300">
            Integracion futura con comentarios moderados desde panel admin y reacciones en tiempo real.
          </p>
        </article>
      </div>
    </section>
  );
}

export default CommunityPage;
