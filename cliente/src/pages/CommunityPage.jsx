import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import { useQuery } from '../hooks/useQuery';
import { communityService } from '../services/communityService';
import { pollService } from '../services/pollService';
import { getErrorMessage } from '../api/apiErrors';
import { sortByOrder } from '../utils/media';

const POLL_ID = import.meta.env.VITE_POLL_ID;

function formatDate(isoDate, timeZone) {
  if (!isoDate) return null;
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  if (timeZone) options.timeZone = timeZone;
  return new Date(isoDate).toLocaleString('es-AR', options);
}

function formatPercent(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '0.0';
  return n.toFixed(1);
}

function PollSection({ pollId }) {
  const { isAuthenticated } = useAuth();
  const [voted, setVoted] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [isVoting, setIsVoting] = useState(false);

  const fetchPoll = useCallback(() => pollService.getPoll(pollId), [pollId]);
  const { data: poll, loading, error, refetch } = useQuery(fetchPoll, [pollId]);

  const handleVote = async (optionId) => {
    if (!isAuthenticated) return;
    setVoteError('');
    setIsVoting(true);
    try {
      await pollService.vote(pollId, optionId);
      setVoted(true);
      refetch();
    } catch (err) {
      const code = err?.response?.data?.code;
      if (code === 'ALREADY_VOTED') {
        setVoted(true);
        setVoteError('');
        refetch();
      } else {
        setVoteError(getErrorMessage(err, 'No se pudo registrar tu voto.'));
      }
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="surface-card animate-pulse p-6">
        <div className="h-4 w-1/2 rounded bg-white/10" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface-card p-6 text-sm text-zinc-400">
        La encuesta no está disponible en este momento.
      </div>
    );
  }

  return (
    <article className="surface-card p-6 sm:p-7">
      <p className="section-kicker">Votación</p>
      <h2 className="mt-2 font-display text-3xl tracking-wide">{poll.title}</h2>
      <p className="mt-2 text-xs text-zinc-500">
        {poll.totalVotes} {poll.totalVotes === 1 ? 'voto' : 'votos'}
        {poll.endsAt ? ` · Cierra ${formatDate(poll.endsAt)}` : ''}
      </p>

      <div className="mt-5 space-y-3">
        {poll.options.map((option) => (
          <div key={option.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-zinc-100">{option.label}</p>
              <span className="text-xs text-ember-soft">
                {formatPercent(option.percentage)}%
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ember-deep to-ember transition-all duration-500"
                style={{ width: `${option.percentage}%` }}
              />
            </div>
            {!voted && isAuthenticated ? (
              <button
                className="btn-secondary mt-3 !px-3 !py-1.5 text-xs disabled:opacity-50"
                type="button"
                disabled={isVoting}
                onClick={() => handleVote(option.id)}
              >
                {isVoting ? 'Votando...' : 'Votar'}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {voted ? (
        <p className="mt-4 text-sm text-emerald-300">¡Tu voto fue registrado!</p>
      ) : null}
      {voteError ? <p className="mt-4 text-sm text-red-300">{voteError}</p> : null}
      {!isAuthenticated ? (
        <p className="mt-5 text-sm text-zinc-400">
          <Link className="text-ember-soft hover:underline" to="/login">
            Iniciá sesión
          </Link>{' '}
          para votar.
        </p>
      ) : null}
    </article>
  );
}

function CommunityPage() {
  const {
    data: eventsData,
    loading: eventsLoading,
    error: eventsError,
  } = useQuery(communityService.getCommunityEvents);

  const events = useMemo(() => {
    const items = sortByOrder(eventsData?.items ?? []);
    return [...items].sort((a, b) => {
      const ta = a.startsAt ? new Date(a.startsAt).getTime() : Number.MAX_SAFE_INTEGER;
      const tb = b.startsAt ? new Date(b.startsAt).getTime() : Number.MAX_SAFE_INTEGER;
      if (ta !== tb) return ta - tb;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });
  }, [eventsData?.items]);

  return (
    <div>
      <section className="page-shell-wide pb-4">
        <p className="section-kicker">Fans & gira</p>
        <h1 className="section-title mt-2">Comunidad</h1>
        <p className="section-copy">
          Fechas, votaciones y el pulso de la gente que sigue el proyecto.
        </p>
      </section>

      <section className="page-shell-wide grid gap-6 pt-4 lg:grid-cols-2">
        <motion.article
          className="surface-card p-6 sm:p-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="section-kicker">Agenda</p>
          <h2 className="mt-2 font-display text-3xl tracking-wide">Próximos shows</h2>

          {eventsLoading ? (
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : eventsError ? (
            <p className="mt-6 text-sm text-red-300">No se pudo cargar la agenda.</p>
          ) : events.length === 0 ? (
            <p className="mt-6 text-sm text-zinc-500">
              No hay eventos publicados por el momento.
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {events.map((event) => {
                const place = event.city ?? event.location;
                return (
                  <li
                    key={event.id}
                    className="rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-ember/30"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-zinc-50">{event.title}</p>
                        {place ? <p className="text-sm text-zinc-400">{place}</p> : null}
                      </div>
                      {event.startsAt ? (
                        <span className="chip shrink-0">
                          {formatDate(event.startsAt, event.timezone)}
                        </span>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.article>

        <div>
          {POLL_ID ? (
            <PollSection pollId={POLL_ID} />
          ) : (
            <div className="surface-card p-6 sm:p-7">
              <p className="section-kicker">Votación</p>
              <h2 className="mt-2 font-display text-3xl tracking-wide">Setlist</h2>
              <p className="mt-4 text-sm text-zinc-500">
                No hay encuesta activa. Cuando el admin publique una, aparece acá.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CommunityPage;
