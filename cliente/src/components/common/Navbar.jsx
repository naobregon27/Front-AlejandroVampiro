import { NavLink, useNavigate } from 'react-router-dom';
import { navLinks } from '../../data/siteContent';
import { useAuth } from '../../features/auth/AuthContext';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="text-lg font-black tracking-widest text-red-400">
          NAHUEL.MUSIC
        </NavLink>
        <nav className="hidden gap-2 md:flex">
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
        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}

export default Navbar;
