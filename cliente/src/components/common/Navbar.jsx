import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navLinks as fallbackNavLinks } from '../../data/siteContent';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useAuth } from '../../features/auth/AuthContext';

function Navbar() {
  const { data: siteConfig } = useSiteConfig();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = useMemo(() => {
    if (siteConfig?.navLinks) {
      return [...siteConfig.navLinks]
        .filter((l) => l.visible !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((l) => ({
          key: `${l.path ?? ''}-${l.label}`,
          to: l.path,
          label: l.label,
          external: typeof l.path === 'string' && /^https?:\/\//i.test(l.path),
        }));
    }
    return fallbackNavLinks.map((l) => ({
      key: l.to,
      to: l.to,
      label: l.label,
      external: false,
    }));
  }, [siteConfig?.navLinks]);

  const brandTitle = siteConfig?.siteSettings?.siteTitle?.trim() || 'ACEVEDO MUSIC';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-ember/15 text-ember-soft'
        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink-950/85 shadow-stage backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <NavLink
          to="/"
          className="shrink-0 font-display text-xl tracking-[0.18em] text-ember-soft sm:text-2xl"
        >
          {brandTitle}
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((link) =>
            link.external ? (
              <a
                key={link.key}
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <NavLink key={link.key} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="hidden text-xs text-zinc-400 xl:block">Hola, {user?.name}</span>
              <button className="btn-secondary !px-4 !py-2 text-xs" onClick={handleLogout} type="button">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-secondary !px-4 !py-2 text-xs">
                Entrar
              </NavLink>
              <NavLink to="/registro" className="btn-primary !px-4 !py-2 text-xs">
                Unirme
              </NavLink>
            </>
          )}
        </div>

        <button
          className="btn-secondary !px-3 !py-2 lg:hidden"
          type="button"
          aria-expanded={isMenuOpen}
          aria-label="Abrir menú"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? 'Cerrar' : 'Menú'}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-white/10 bg-ink-950/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <nav className="grid gap-1">
            {navItems.map((link) =>
              link.external ? (
                <a
                  key={link.key}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl px-3 py-3 text-sm text-zinc-300"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink key={link.key} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              )
            )}
          </nav>
          <div className="mt-4 flex flex-wrap gap-2">
            {isAuthenticated ? (
              <button className="btn-secondary" onClick={handleLogout} type="button">
                Salir
              </button>
            ) : (
              <>
                <NavLink to="/login" className="btn-secondary">
                  Entrar
                </NavLink>
                <NavLink to="/registro" className="btn-primary">
                  Unirme
                </NavLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
