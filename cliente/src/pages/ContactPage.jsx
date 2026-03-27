import { useState } from 'react';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-14 lg:py-16">
      <h1 className="section-title">Contacto</h1>
      <p className="section-copy">Formulario base para contrataciones, colaboraciones y propuestas de prensa.</p>
      <form className="surface-card mt-8 space-y-4 p-5 sm:p-6" onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="Nombre completo"
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
          placeholder="Asunto"
          type="text"
          required
          value={form.subject}
          onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
        />
        <textarea
          className="input-field min-h-32"
          placeholder="Contanos tu propuesta..."
          required
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
        />
        <button className="btn-primary w-full" type="submit">
          Enviar mensaje
        </button>
        {isSent ? <p className="text-sm text-emerald-300">Mensaje enviado con exito. Te respondemos pronto.</p> : null}
      </form>
    </section>
  );
}

export default ContactPage;
