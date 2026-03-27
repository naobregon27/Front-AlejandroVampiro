import { socialLinks } from '../../data/siteContent';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-zinc-300">Prototype artist platform</p>
          <p className="text-xs text-zinc-500">Noche, tabaco, amistad y musica urbana.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-red-500/30 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
