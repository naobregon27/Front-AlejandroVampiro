import { Link } from 'react-router-dom';
import { highlights, socialLinks } from '../data/siteContent';

function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="hero-card p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.35em] text-red-300">Prototype premium</p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
          Musica, calle y una experiencia digital inolvidable
        </h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Una plataforma para presentar arte, conectar con fans y escalar a un ecosistema con backend, membresias,
          panel de administracion y contenido exclusivo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/registro">
            Quiero acceso premium
          </Link>
          <Link className="btn-secondary" to="/musica">
            Explorar lanzamientos
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="surface-card p-6">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <article className="surface-card p-6">
          <h2 className="text-xl font-bold">QR para shows y merch</h2>
          <p className="mt-3 text-sm text-zinc-300">
            En produccion: QR dinamico para entradas, playlists y promociones.
          </p>
          <div className="mt-6 grid h-40 w-40 place-items-center rounded-lg border border-red-500/30 bg-black/40 text-xs text-red-300">
            QR DEMO
          </div>
        </article>
        <article className="surface-card p-6">
          <h2 className="text-xl font-bold">Redes sociales centralizadas</h2>
          <p className="mt-3 text-sm text-zinc-300">Todas las plataformas en una sola experiencia para crecer audiencia.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <span key={link.name} className="chip">
                {link.name}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default HomePage;
