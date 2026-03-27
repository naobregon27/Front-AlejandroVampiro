import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    register(form);
    navigate('/exclusivo', { replace: true });
  };

  return (
    <section className="mx-auto max-w-md px-4 py-10 sm:px-5 sm:py-14 lg:py-16">
      <h1 className="section-title">Crear cuenta</h1>
      <form className="surface-card mt-8 space-y-4 p-5 sm:p-6" onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="Nombre y apellido"
          type="text"
          required
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
        <input
          className="input-field"
          placeholder="Password"
          type="password"
          required
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
        <button className="btn-primary w-full" type="submit">
          Registrarme
        </button>
        <p className="text-sm text-zinc-400">
          Ya tenes cuenta?{' '}
          <Link className="text-red-300 hover:text-red-200" to="/login">
            Inicia sesion
          </Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterPage;
