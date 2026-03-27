import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navLinks } from '../../data/siteContent';
import { useAuth } from '../../features/auth/AuthContext';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <NavLink to="/" className="shrink-0 text-sm font-black tracking-[0.25em] text-red-400 sm:text-base">
          ACV2.MUSIC
        </NavLink>
        <nav className="hidden gap-2 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition ${
                  isActive ? 'bg-red-500/20 text-red-300' : 'text-zinc-300 hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="hidden text-xs text-zinc-400 sm:block">Hola, {user?.name}</span>
              <button className="btn-secondary" onClick={handleLogout} type="button">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-secondary">
                Iniciar sesion
              </NavLink>
              <NavLink to="/registro" className="btn-primary">
                Registro
              </NavLink>
            </>
          )}
        </div>
        <button
          className="btn-secondary px-3 py-2 lg:hidden"
          type="button"
          aria-expanded={isMenuOpen}
          aria-label="Abrir menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? 'Cerrar' : 'Menu'}
        </button>
      </div>
      {isMenuOpen ? (
        <div className="border-t border-white/10 bg-zinc-950/95 px-4 py-4 lg:hidden">
          <nav className="grid gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm transition ${
                    isActive ? 'bg-red-500/20 text-red-300' : 'text-zinc-300 hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="w-full text-xs text-zinc-400">Hola, {user?.name}</span>
                <button className="btn-secondary" onClick={handleLogout} type="button">
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-secondary">
                  Iniciar sesion
                </NavLink>
                <NavLink to="/registro" className="btn-primary">
                  Registro
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
