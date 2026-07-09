import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { getErrorMessage } from '../api/apiErrors';

function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    try {
      await register(form.name, form.email, form.password);
      navigate('/exclusivo', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo crear la cuenta. Intentá nuevamente.'));
    }
  };

  return (
    <section className="page-shell max-w-md">
      <p className="section-kicker">Comunidad</p>
      <h1 className="section-title mt-2">Unirme</h1>
      <p className="section-copy">Creá tu cuenta y pedí acceso al material exclusivo.</p>
      <form className="surface-card mt-8 space-y-4 p-5 sm:p-6" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block text-xs text-zinc-400" htmlFor="name">
            Nombre completo
          </label>
          <input
            id="name"
            className="input-field"
            placeholder="Tu nombre"
            type="text"
            name="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
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
            Contraseña{' '}
            <span className="text-zinc-500">(mín. 8 caracteres)</span>
          </label>
          <input
            id="password"
            className="input-field"
            placeholder="••••••••"
            type="password"
            name="password"
            required
            autoComplete="new-password"
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
          {isLoading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
        <p className="text-sm text-zinc-400">
          ¿Ya tenés cuenta?{' '}
          <Link className="text-red-300 hover:text-red-200" to="/login">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterPage;
