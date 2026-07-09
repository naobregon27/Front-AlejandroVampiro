import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { getErrorMessage } from '../api/apiErrors';

function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/exclusivo', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo iniciar sesión. Intentá nuevamente.'));
    }
  };

  return (
    <section className="page-shell max-w-md">
      <p className="section-kicker">Cuenta</p>
      <h1 className="section-title mt-2">Entrar</h1>
      <p className="section-copy">Accedé a la zona exclusiva y votá en la comunidad.</p>
      <form className="surface-card mt-8 space-y-4 p-5 sm:p-6" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block text-xs text-zinc-400" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="input-field"
            placeholder="tu@email.com"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-zinc-400" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            className="input-field"
            placeholder="••••••••"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {error ? (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-sm text-zinc-400">
          ¿No tenés cuenta?{' '}
          <Link className="text-red-300 hover:text-red-200" to="/registro">
            Registrate
          </Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
