import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { socialLinks as fallbackSocial } from '../../data/siteContent';
import { useSiteConfig } from '../../context/SiteConfigContext';

function Footer() {
  const { data: siteConfig, error: siteConfigError } = useSiteConfig();

  const socialItems = useMemo(() => {
    if (siteConfig) {
      return [...(siteConfig.socialLinks ?? [])]
        .filter((l) => l.visible !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((l) => ({
          key: `${l.platform}-${l.url}`,
          label: l.platform,
          href: l.url,
        }));
    }
    if (siteConfigError) {
      return fallbackSocial.map((l) => ({
        key: l.name,
        label: l.name,
        href: l.href,
      }));
    }
    return [];
  }, [siteConfig, siteConfigError]);

  const title = siteConfig?.siteSettings?.siteTitle?.trim() || 'Acevedo Music';
  const description =
    siteConfig?.siteSettings?.siteDescription?.trim() ||
    'Música, noche y comunidad.';

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-5 md:flex-row md:items-end md:justify-between md:py-14">
        <div className="max-w-md">
          <p className="font-display text-3xl tracking-[0.12em] text-ember-soft">{title}</p>
          <p className="mt-3 text-sm font-light text-zinc-400">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link to="/musica" className="text-zinc-300 transition hover:text-ember-soft">
              Música
            </Link>
            <Link to="/galeria" className="text-zinc-300 transition hover:text-ember-soft">
              Galería
            </Link>
            <Link to="/comunidad" className="text-zinc-300 transition hover:text-ember-soft">
              Comunidad
            </Link>
            <Link to="/contacto" className="text-zinc-300 transition hover:text-ember-soft">
              Contacto
            </Link>
          </div>
        </div>

        {socialItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {socialItems.map((link) => (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-ember/40 hover:text-ember-soft"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}

export default Footer;
