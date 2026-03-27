function GalleryPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="section-title">Galeria visual</h1>
      <p className="section-copy">Espacio para fotos de estudio, shows y material visual con identidad cinematica.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`gallery-${index + 1}`}
            className="surface-card grid aspect-video place-items-center text-sm text-zinc-400"
          >
            Visual {index + 1}
          </div>
        ))}
      </div>
    </section>
  );
}

export default GalleryPage;
