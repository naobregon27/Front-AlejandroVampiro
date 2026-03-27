import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', name: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    login(form);
    navigate(location.state?.from || '/exclusivo', { replace: true });
  };

  return (
    <section className="mx-auto max-w-md px-4 py-10 sm:px-5 sm:py-14 lg:py-16">
      <h1 className="section-title">Iniciar sesion</h1>
      <form className="surface-card mt-8 space-y-4 p-5 sm:p-6" onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="Tu nombre"
          type="text"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <input
          className="input-field"
          placeholder="Email"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <button className="btn-primary w-full" type="submit">
          Acceder
        </button>
        <p className="text-sm text-zinc-400">
          No tenes cuenta?{' '}
          <Link className="text-red-300 hover:text-red-200" to="/registro">
            Registrate
          </Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
