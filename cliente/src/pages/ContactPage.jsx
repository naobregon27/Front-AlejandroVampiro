function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="section-title">Contacto</h1>
      <p className="section-copy">Formulario base para contrataciones, colaboraciones y propuestas de prensa.</p>
      <form className="surface-card mt-8 space-y-4 p-6">
        <input className="input-field" placeholder="Nombre completo" type="text" />
        <input className="input-field" placeholder="Email" type="email" />
        <input className="input-field" placeholder="Asunto" type="text" />
        <textarea className="input-field min-h-32" placeholder="Contanos tu propuesta..." />
        <button className="btn-primary w-full" type="button">
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}

export default ContactPage;
