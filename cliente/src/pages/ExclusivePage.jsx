import { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';

const premiumContent = [
  {
    title: 'Backstage clips',
    description: 'Videos del proceso creativo y previas de shows.',
    action: 'Ver clip',
  },
  {
    title: 'Meetups privados',
    description: 'Encuentros cerrados para fans activos.',
    action: 'Reservar cupo',
  },
  {
    title: 'Descargas premium',
    description: 'Demos, stems y material descargable.',
    action: 'Descargar pack',
  },
];

function ExclusivePage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('');

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14 lg:py-16">
      <h1 className="section-title">Zona exclusiva</h1>
      <p className="section-copy">Bienvenido, {user?.name}. Este contenido es solo para miembros registrados.</p>
      <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {premiumContent.map((item) => (
          <article key={item.title} className="surface-card p-6">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
            <button className="btn-secondary mt-6" type="button" onClick={() => setSelected(item.title)}>
              {item.action}
            </button>
          </article>
        ))}
      </div>
      <div className="surface-card mt-8 p-4 text-sm text-zinc-300 sm:p-5">
        {selected
          ? `Accion completada para "${selected}". Esta demo ya funciona como experiencia interactiva.`
          : 'Selecciona una accion premium para continuar.'}
      </div>
    </section>
  );
}

export default ExclusivePage;
