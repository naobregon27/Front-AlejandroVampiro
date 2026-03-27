import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="mx-auto grid max-w-2xl place-items-center px-5 py-20 text-center">
      <p className="text-6xl font-black text-red-500">404</p>
      <h1 className="mt-2 text-3xl font-bold">Pagina no encontrada</h1>
      <p className="mt-3 text-zinc-400">La ruta que buscas no existe en este prototipo.</p>
      <Link className="btn-primary mt-8" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}

export default NotFoundPage;
