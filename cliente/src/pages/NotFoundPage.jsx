import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="page-shell grid max-w-2xl place-items-center text-center">
      <p className="font-display text-8xl tracking-wide text-ember">404</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide">Página no encontrada</h1>
      <p className="mt-3 text-zinc-400">Esa ruta no existe en Acevedo Music.</p>
      <Link className="btn-primary mt-8" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}

export default NotFoundPage;
