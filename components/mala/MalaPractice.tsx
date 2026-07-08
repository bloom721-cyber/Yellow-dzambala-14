'use client';

/**
 * SCREEN 5 — Mala practice: the second visual centrepiece.
 * A handcrafted digital mala on cloth: wooden beads, a gold guru bead,
 * a red tassel. Each touch advances one bead. Never a fitness tracker.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MANTRAS, MERIT_PER_RECITATION } from '@/lib/offerings';
import { playBell } from '@/lib/audio';
import { hapticCompletion, hapticSoft } from '@/lib/haptics';
import { KnotDivider } from '@/components/ui/KnotDivider';
import { CeremonialButton } from '@/components/ui/CeremonialButton';
import type { ShrineStore } from '@/hooks/useShrineState';

const BREATH = [0.33, 0, 0.2, 1] as const;

/** Beads drawn around the ring (visual density, independent of count). */
const RING_BEADS = 36;

export function MalaPractice({
  store,
  reduced,
}: {
  store: ShrineStore;
  reduced: boolean;
}) {
  const { malaLength, mantraId } = store.state.settings;
  const mantra = MANTRAS.find((m) => m.id === mantraId) ?? MANTRAS[0]!;
  const [count, setCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const sessionCount = useRef(0);

  const target = malaLength === 0 ? Infinity : malaLength;
  const remaining = Number.isFinite(target) ? target - count : null;
  const progress = Number.isFinite(target) ? count / target : 0;

  const advance = useCallback(() => {
    if (complete) return;
    hapticSoft();
    sessionCount.current += 1;
    setCount((c) => {
      const next = c + 1;
      if (next >= target) {
        setComplete(true);
        playBell('bellCompletion', 0.85);
        hapticCompletion();
      }
      return next;
    });
  }, [complete, target]);

  // Persist the session's recitations when it ends or completes.
  const commit = useCallback(() => {
    if (sessionCount.current > 0) {
      store.practice({
        kind: 'mala',
        detail: mantra.id,
        count: sessionCount.current,
        merit: sessionCount.current * MERIT_PER_RECITATION,
      });
      sessionCount.current = 0;
    }
  }, [store, mantra.id]);

  useEffect(() => {
    if (complete) commit();
  }, [complete, commit]);
  useEffect(() => () => commit(), [commit]); // leaving the room commits too

  const rest = useCallback(() => {
    setCount(0);
    setComplete(false);
  }, []);

  const beads = useMemo(() => Array.from({ length: RING_BEADS }, (_, i) => i), []);
  const litBeads = Number.isFinite(target)
    ? Math.floor(progress * RING_BEADS)
    : count % RING_BEADS;

  const todayMala = store.hydrated
    ? store.state.sessions
        .filter(
          (s) => s.kind === 'mala' && s.at.slice(0, 10) === store.state.todayDate,
        )
        .reduce((n, s) => n + s.count, 0)
    : 0;

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden">
      {/* Cloth ground */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(110% 80% at 50% 30%, #33170f 0%, #241509 48%, #120B07 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(244,231,197,0.5) 0 1px, transparent 1px 7px), repeating-linear-gradient(-45deg, rgba(244,231,197,0.35) 0 1px, transparent 1px 7px)',
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center px-6 pt-[max(2.4rem,env(safe-area-inset-top))]">
        <p className="font-display text-[11px] uppercase tracking-[0.45em] text-gold/85">
          Mala Practice
        </p>
        <p className="mt-4 max-w-xs text-center font-body text-2xl italic leading-snug text-ivory">
          {mantra.transliteration}
        </p>
        <p className="mt-1 text-center font-body text-lg text-gold/80">{mantra.tibetan}</p>
      </div>

      {/* The mala itself — one large touch surface */}
      <button
        type="button"
        onClick={advance}
        disabled={complete}
        aria-label={`Count one recitation. ${count} counted${remaining !== null ? `, ${remaining} remaining` : ''}.`}
        className="relative z-10 mt-2 flex flex-1 w-full items-center justify-center focus-visible:outline-none"
      >
        <div className="relative h-[300px] w-[300px] sm:h-[340px] sm:w-[340px]">
          {/* Progress ring — a fine gold thread, not a gauge */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(138,95,50,0.3)" strokeWidth="0.6" />
            {Number.isFinite(target) && (
              <motion.circle
                cx="50" cy="50" r="46" fill="none"
                stroke="rgba(217,164,65,0.8)" strokeWidth="0.9" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progress) }}
                transition={{ duration: reduced ? 0 : 0.9, ease: BREATH }}
              />
            )}
          </svg>

          {/* Wooden beads */}
          {beads.map((i) => {
            const angle = (i / RING_BEADS) * Math.PI * 2 - Math.PI / 2;
            const isGuru = i === 0;
            const lit = i !== 0 && i <= litBeads;
            const r = 42;
            const x = 50 + r * Math.cos(angle);
            const y = 50 + r * Math.sin(angle);
            return (
              <span
                key={i}
                aria-hidden
                className="absolute rounded-full transition-all duration-700 ease-breath"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: isGuru ? '9.5%' : '6.5%',
                  height: isGuru ? '9.5%' : '6.5%',
                  transform: 'translate(-50%, -50%)',
                  background: isGuru
                    ? 'radial-gradient(circle at 35% 30%, #E9B45B 0%, #D9A441 45%, #8A5F32 100%)'
                    : lit
                      ? 'radial-gradient(circle at 35% 30%, #7a4a26 0%, #5a3116 55%, #3a1e0c 100%)'
                      : 'radial-gradient(circle at 35% 30%, #4a2c15 0%, #33200f 55%, #241509 100%)',
                  boxShadow: isGuru
                    ? '0 0 12px rgba(217,164,65,0.5), inset 0 -1px 2px rgba(74,23,18,0.5)'
                    : lit
                      ? '0 0 8px rgba(217,164,65,0.28), inset 0 -1px 2px rgba(0,0,0,0.55)'
                      : 'inset 0 -1px 2px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)',
                }}
              />
            );
          })}

          {/* Red tassel below the guru bead */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[1%] h-[13%] w-[3.5%] -translate-x-1/2"
            style={{
              background:
                'linear-gradient(to bottom, #4A1712 0%, #6b2018 60%, transparent 100%)',
              clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)',
              transform: 'translateX(-50%) translateY(-88%)',
              opacity: 0.9,
            }}
          />

          {/* Centre — the count, engraved */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={count}
              initial={reduced ? false : { opacity: 0.4, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: BREATH }}
              className="font-utility text-6xl font-light tabular-nums text-ivory"
            >
              {count}
            </motion.span>
            <span className="mt-1 font-display text-[10px] uppercase tracking-[0.4em] text-mist">
              {remaining !== null ? `${remaining} remain` : 'unbounded'}
            </span>
          </div>
        </div>
      </button>

      <div className="relative z-10 w-full px-8 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] text-center">
        <p className="font-body italic text-ivory/65">
          Touch the mala to count each recitation
        </p>
        <p className="mt-2 font-utility text-[11px] uppercase tracking-[0.28em] text-mist">
          Today {todayMala + sessionCount.current} recitations · Lifetime merit{' '}
          {store.state.lifetimeMerit}
        </p>
      </div>

      {/* Completion — golden blessing, lotus petals, return to silence */}
      <AnimatePresence>
        {complete && (
          <motion.div
            key="mala-complete"
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: BREATH }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(65% 55% at 50% 42%, rgba(233,180,91,0.25) 0%, rgba(18,11,7,0.88) 80%)',
              }}
            />
            {!reduced && <LotusPetals />}
            <div className="relative">
              <h2 className="font-display text-lg uppercase tracking-[0.42em] text-gold">
                The Round Is Complete
              </h2>
              <p className="mt-4 max-w-xs font-body italic text-lg text-ivory/85">
                {Number.isFinite(target) ? target : count} recitations offered.
                The shrine returns to silence.
              </p>
              <KnotDivider className="my-8" />
              <CeremonialButton onClick={rest}>Begin Again</CeremonialButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Slow lotus petals drifting down — completion only, motion-safe. */
function LotusPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        left: 8 + ((i * 37) % 84),
        delay: (i * 0.9) % 5,
        duration: 9 + (i % 4) * 2,
        drift: i % 2 === 0 ? 18 : -22,
      })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-[-6%]"
          style={{ left: `${p.left}%` }}
          initial={{ y: '-8vh', opacity: 0, rotate: 0 }}
          animate={{ y: '112vh', opacity: [0, 0.8, 0.8, 0], x: p.drift, rotate: 160 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear', repeat: Infinity }}
        >
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
            <path
              d="M9 1C13 6 16 11 16 15a7 7 0 1 1-14 0C2 11 5 6 9 1z"
              fill="rgba(244,231,197,0.5)"
              stroke="rgba(217,164,65,0.5)"
            />
          </svg>
        </motion.span>
      ))}
    </div>
  );
}
