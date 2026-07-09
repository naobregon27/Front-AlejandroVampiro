import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { trackCover, trackPreview } from '../utils/content';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const playTrack = useCallback((track, list = []) => {
    const preview = trackPreview(track);
    if (!preview) return;
    setQueue(list.length ? list : [track]);
    setCurrent(track);
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (!current) return;
    setIsPlaying((prev) => !prev);
  }, [current]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrent(null);
    setProgress(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
    }
  }, []);

  const playNext = useCallback(() => {
    if (!current || queue.length < 2) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const next = queue[(idx + 1) % queue.length];
    if (next && trackPreview(next)) {
      setCurrent(next);
      setIsPlaying(true);
    }
  }, [current, queue]);

  const playPrev = useCallback(() => {
    if (!current || queue.length < 2) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const prev = queue[(idx - 1 + queue.length) % queue.length];
    if (prev && trackPreview(prev)) {
      setCurrent(prev);
      setIsPlaying(true);
    }
  }, [current, queue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return undefined;

    const src = trackPreview(current);
    if (!src) return undefined;

    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise?.catch) playPromise.catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }

    return undefined;
  }, [current, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onTime = () => setProgress(audio.currentTime || 0);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => playNext();

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playNext]);

  const seek = useCallback((value) => {
    const audio = audioRef.current;
    if (!audio || Number.isNaN(value)) return;
    audio.currentTime = value;
    setProgress(value);
  }, []);

  const value = useMemo(
    () => ({
      current,
      isPlaying,
      progress,
      duration,
      cover: current ? trackCover(current) : null,
      playTrack,
      toggle,
      stop,
      playNext,
      playPrev,
      seek,
      isCurrent: (id) => current?.id === id,
    }),
    [current, isPlaying, progress, duration, playTrack, toggle, stop, playNext, playPrev, seek]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" className="hidden" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer debe usarse dentro de PlayerProvider');
  return ctx;
}
