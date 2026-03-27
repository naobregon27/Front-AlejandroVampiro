import { useAuth } from '../features/auth/AuthContext';

function ExclusivePage() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="section-title">Zona exclusiva</h1>
      <p className="section-copy">Bienvenido, {user?.name}. Este contenido es solo para miembros registrados.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <article className="surface-card p-6">
          <h2 className="text-lg font-bold">Backstage clips</h2>
          <p className="mt-2 text-sm text-zinc-300">Videos del proceso creativo y previas de shows.</p>
        </article>
        <article className="surface-card p-6">
          <h2 className="text-lg font-bold">Meetups privados</h2>
          <p className="mt-2 text-sm text-zinc-300">Encuentros cerrados para fans activos.</p>
        </article>
        <article className="surface-card p-6">
          <h2 className="text-lg font-bold">Descargas premium</h2>
          <p className="mt-2 text-sm text-zinc-300">Demos, stems y material descargable.</p>
        </article>
      </div>
    </section>
  );
}

export default ExclusivePage;
