import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-0 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
