import { useState } from 'react';
import { contactService } from '../services/contactService';
import { getErrorMessage } from '../api/apiErrors';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await contactService.sendMessage(form);
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      const msg = getErrorMessage(err, 'No se pudo enviar el mensaje. Intentá más tarde.');
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  return (
    <section className="page-shell max-w-3xl">
      <p className="section-kicker">Escribinos</p>
      <h1 className="section-title mt-2">Contacto</h1>
      <p className="section-copy">
        Contrataciones, colaboraciones y propuestas de prensa.
      </p>

      {status === 'success' ? (
        <div className="surface-card mt-8 p-8 text-center">
          <p className="font-display text-4xl tracking-wide text-emerald-300">¡Mensaje enviado!</p>
          <p className="mt-2 text-sm text-zinc-300">
            Recibimos tu mensaje. Te respondemos pronto.
          </p>
          <button
            className="btn-secondary mt-6"
            type="button"
            onClick={() => setStatus('idle')}
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form className="surface-card mt-8 space-y-4 p-5 sm:p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
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
                maxLength={120}
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
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-zinc-400" htmlFor="subject">
              Asunto
            </label>
            <input
              id="subject"
              className="input-field"
              placeholder="Propuesta de show / colaboración / prensa..."
              type="text"
              name="subject"
              required
              maxLength={200}
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-zinc-400" htmlFor="message">
              Mensaje
            </label>
            <textarea
              id="message"
              className="input-field min-h-36"
              placeholder="Contanos tu propuesta con todos los detalles..."
              name="message"
              required
              maxLength={8000}
              value={form.message}
              onChange={handleChange}
            />
            <p className="text-right text-xs text-zinc-500">
              {form.message.length}/8000
            </p>
          </div>

          {status === 'error' ? (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {errorMsg}
            </p>
          ) : null}

          <button
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      )}
    </section>
  );
}

export default ContactPage;
