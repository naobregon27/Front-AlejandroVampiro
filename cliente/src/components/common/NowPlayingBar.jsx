import { usePlayer } from '../../context/PlayerContext';

function formatTime(sec) {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function NowPlayingBar() {
  const {
    current,
    isPlaying,
    progress,
    duration,
    cover,
    toggle,
    stop,
    playNext,
    playPrev,
    seek,
  } = usePlayer();

  if (!current) return null;

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-white/10 bg-ink-900/95 p-3 shadow-stage backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-800 ${
              isPlaying ? 'ring-2 ring-ember/50' : ''
            }`}
          >
            {cover ? (
              <img
                src={cover}
                alt=""
                className={`h-full w-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs text-zinc-500">♪</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-50">{current.title}</p>
            <p className="truncate text-xs text-zinc-400">
              {[current.type, current.mood, current.duration].filter(Boolean).join(' · ') ||
                'Preview'}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:max-w-md">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="text-zinc-400 transition hover:text-white"
              onClick={playPrev}
              aria-label="Anterior"
            >
              ‹‹
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-ember text-ink-950 transition hover:bg-ember-soft"
              onClick={toggle}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button
              type="button"
              className="text-zinc-400 transition hover:text-white"
              onClick={playNext}
              aria-label="Siguiente"
            >
              ››
            </button>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <span className="w-8 tabular-nums">{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-ember"
              style={{
                background: `linear-gradient(to right, #e85d04 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
              }}
              aria-label="Progreso"
            />
            <span className="w-8 tabular-nums text-right">{formatTime(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          className="self-end text-xs text-zinc-500 transition hover:text-zinc-200 sm:self-center"
          onClick={stop}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default NowPlayingBar;
