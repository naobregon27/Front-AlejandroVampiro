import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SiteConfigProvider } from '../context/SiteConfigContext';
import { PlayerProvider } from '../context/PlayerContext';
import { useQuery } from '../hooks/useQuery';
import { siteConfigService } from '../services/siteConfigService';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import NowPlayingBar from '../components/common/NowPlayingBar';

function DocumentMeta({ siteConfig }) {
  useEffect(() => {
    const settings = siteConfig?.siteSettings;
    const title = settings?.siteTitle?.trim();
    const description = settings?.siteDescription?.trim();
    const ogImage = settings?.defaultOgImageUrl?.trim();

    if (title) document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    if (ogImage) {
      let og = document.querySelector('meta[property="og:image"]');
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', 'og:image');
        document.head.appendChild(og);
      }
      og.setAttribute('content', ogImage);
    }
  }, [siteConfig?.siteSettings]);

  return null;
}

function MainLayout() {
  const siteConfigQuery = useQuery(siteConfigService.getSiteConfig);

  return (
    <SiteConfigProvider value={siteConfigQuery}>
      <PlayerProvider>
        <DocumentMeta siteConfig={siteConfigQuery.data} />
        <div className="relative flex min-h-screen flex-col text-zinc-100">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-ember/10 blur-3xl animate-pulse-soft" />
            <div className="absolute -right-16 bottom-40 h-80 w-80 rounded-full bg-ember-deep/20 blur-3xl" />
          </div>
          <Navbar />
          <main className="relative z-10 flex-1 pb-28">
            <Outlet />
          </main>
          <Footer />
          <NowPlayingBar />
        </div>
      </PlayerProvider>
    </SiteConfigProvider>
  );
}

export default MainLayout;
