import { useState } from 'react';

const visuals = Array.from({ length: 9 }).map((_, index) => ({
  id: index + 1,
  title: `Visual ${index + 1}`,
  type: index % 2 === 0 ? 'Show' : 'Backstage',
}));

function GalleryPage() {
  const [selectedVisual, setSelectedVisual] = useState(null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14 lg:py-16">
      <h1 className="section-title">Galeria visual</h1>
      <p className="section-copy">Espacio para fotos de estudio, shows y material visual con identidad cinematica.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {visuals.map((visual) => (
          <button
            key={visual.id}
            className="surface-card grid aspect-video content-between p-4 text-left transition hover:scale-[1.01]"
            type="button"
            onClick={() => setSelectedVisual(visual)}
          >
            <span className="text-xs uppercase tracking-wider text-red-300">{visual.type}</span>
            <span className="self-end text-sm text-zinc-300">{visual.title}</span>
          </button>
        ))}
      </div>
      {selectedVisual ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 px-4">
          <div className="surface-card w-full max-w-xl p-6">
            <p className="text-xs uppercase tracking-wider text-red-300">{selectedVisual.type}</p>
            <h2 className="mt-2 text-2xl font-black">{selectedVisual.title}</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Vista ampliada tipo lightbox. Aqui luego puedes conectar imagen real o video.
            </p>
            <button className="btn-secondary mt-6" type="button" onClick={() => setSelectedVisual(null)}>
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default GalleryPage;
