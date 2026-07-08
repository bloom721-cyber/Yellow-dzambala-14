'use client';

/**
 * SCREEN 3 & 4 — The sanctuary and offering practice.
 * The shrine is always the visual hero: static camera, living light.
 * The tray offers the six offerings in any order; when all six have
 * been made, the blessing descends and merit may be dedicated.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assets } from '@/lib/assets';
import { MERIT_PER_OFFERING, OFFERINGS } from '@/lib/offerings';
import type { OfferingDef, OfferingId, OfferingPhase } from '@/types';
import { VideoBackground } from '@/components/shrine/VideoBackground';
import { AmbientOverlay } from '@/components/shrine/AmbientOverlay';
import { DustParticles } from '@/components/shrine/DustParticles';
import { OfferingTray } from '@/components/offerings/OfferingTray';
import { OfferingSequence } from '@/components/offerings/OfferingSequence';
import { CeremonialButton } from '@/components/ui/CeremonialButton';
import { KnotDivider } from '@/components/ui/KnotDivider';
import { playBell } from '@/lib/audio';
import { hapticBlessing, hapticCompletion, hapticSoft } from '@/lib/haptics';
import { preloadVideos } from '@/lib/preload';
import type { ShrineStore } from '@/hooks/useShrineState';

const BREATH = [0.33, 0, 0.2, 1] as const;

type Ceremony = 'practice' | 'blessing' | 'dedication' | 'complete';

export function ShrineSanctuary({
  store,
  reduced,
  chromeVisible,
}: {
  store: ShrineStore;
  reduced: boolean;
  chromeVisible: boolean;
}) {
  const [offered, setOffered] = useState<Set<OfferingId>>(new Set());
  const [current, setCurrent] = useState<OfferingDef | null>(null);
  const [phase, setPhase] = useState<OfferingPhase>('idle');
  const [ceremony, setCeremony] = useState<Ceremony>('practice');
  const [dedication, setDedication] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Warm the offering videos while the practitioner settles.
  useEffect(() => {
    preloadVideos(Object.values(assets.offerings));
  }, []);

  const busy = phase !== 'idle' || ceremony !== 'practice';

  const beginOffering = useCallback(
    (o: OfferingDef) => {
      if (busy) return;
      setCurrent(o);
      setPhase('shimmer');
      hapticSoft();
      later(() => {
        setPhase('manifestation');
        playBell(o.bellKey, 0.8);
      }, 700);
    },
    [busy, later],
  );

  const onManifestationEnded = useCallback(() => {
    setPhase('halo');
    hapticBlessing();
    later(() => {
      setPhase('settle');
      setOffered((prev) => {
        const next = new Set(prev);
        if (current) next.add(current.id);
        return next;
      });
      if (current) {
        store.practice({
          kind: 'offering',
          detail: current.id,
          count: 1,
          merit: MERIT_PER_OFFERING,
        });
      }
      later(() => {
        setPhase('idle');
        setCurrent(null);
      }, 1400);
    }, 3600);
  }, [current, later, store]);

  // When all six offerings are made, the blessing descends.
  useEffect(() => {
    if (ceremony !== 'practice') return;
    if (offered.size === OFFERINGS.length && phase === 'idle') {
      setCeremony('blessing');
      playBell('bellCompletion', 0.85);
      hapticCompletion();
    }
  }, [offered, phase, ceremony]);

  const sealDedication = useCallback(() => {
    const text = dedication.trim();
    if (text) store.journal(text);
    store.practice({ kind: 'dedication', detail: 'six-offerings', count: 1, merit: 12 });
    setCeremony('complete');
    playBell('bellLong', 0.7);
    later(() => {
      setOffered(new Set());
      setDedication('');
      setCeremony('practice');
    }, 7000);
  }, [dedication, store, later]);

  const meritLine = useMemo(
    () =>
      store.hydrated
        ? `Today ${store.state.todayMerit} · Lifetime ${store.state.lifetimeMerit}`
        : '',
    [store.hydrated, store.state.todayMerit, store.state.lifetimeMerit],
  );

  return (
    <div className="relative h-full w-full">
      {/* The sanctuary — always the hero. */}
      <VideoBackground
        src={assets.shrine.loop}
        fallbackSrc={assets.shrine.loopMobile}
        kenBurns={false}
      />
      <AmbientOverlay src={assets.effects.candleFlicker} opacity={0.4} />
      <AmbientOverlay src={assets.effects.haloPulse} opacity={0.28} />
      {/* Offerings that keep burning: once lit, they stay with the shrine. */}
      {offered.has('incense') && (
        <AmbientOverlay src={assets.offerings.incenseLoop} opacity={0.3} />
      )}
      {offered.has('lamp') && (
        <AmbientOverlay src={assets.offerings.lampLoop} opacity={0.35} />
      )}
      <DustParticles reduced={reduced} />

      {/* Offering flow overlay */}
      <OfferingSequence
        offering={current}
        phase={phase}
        onVideoEnded={onManifestationEnded}
      />

      {/* Quiet merit line — top, out of the shrine's way */}
      <AnimatePresence>
        {chromeVisible && ceremony === 'practice' && meritLine && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: BREATH }}
            className="absolute inset-x-0 top-[max(1.1rem,env(safe-area-inset-top))] z-20 text-center font-utility text-[11px] uppercase tracking-[0.3em] text-ivory/55"
          >
            {meritLine}
          </motion.p>
        )}
      </AnimatePresence>

      {/* The offering tray */}
      {ceremony === 'practice' && (
        <OfferingTray
          offered={offered}
          activeId={phase === 'idle' ? null : current?.id ?? null}
          busy={busy}
          visible={chromeVisible}
          onSelect={beginOffering}
        />
      )}

      {/* Blessing → dedication → completion */}
      <AnimatePresence>
        {ceremony === 'blessing' && (
          <motion.div
            key="blessing"
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
                  'radial-gradient(70% 60% at 50% 40%, rgba(233,180,91,0.28) 0%, rgba(18,11,7,0.82) 78%)',
              }}
            />
            <div className="relative">
              <h2 className="font-display text-xl uppercase tracking-[0.42em] text-gold">
                The Blessing Descends
              </h2>
              <p className="mt-4 max-w-sm font-body italic text-lg leading-relaxed text-ivory/85">
                Six offerings rest upon the altar. The halo brightens; the
                sanctuary receives your generosity.
              </p>
              <KnotDivider className="my-8" />
              <CeremonialButton onClick={() => setCeremony('dedication')}>
                Dedicate the Merit
              </CeremonialButton>
            </div>
          </motion.div>
        )}

        {ceremony === 'dedication' && (
          <motion.div
            key="dedication"
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: BREATH }}
          >
            <div aria-hidden className="absolute inset-0 bg-obsidian/85" />
            <div className="relative w-full max-w-md text-center">
              <h2 className="font-display text-base uppercase tracking-[0.4em] text-gold">
                Dedication of Merit
              </h2>
              <p className="mt-3 font-body italic text-ivory/75">
                For whom, and for what, is this practice offered?
              </p>
              <textarea
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                rows={4}
                aria-label="Your dedication"
                placeholder="May all beings be free from poverty of body and mind…"
                className="mt-6 w-full resize-none rounded-sm border border-bronze/50 bg-walnut/60 p-4 font-body text-lg italic text-ivory placeholder:text-mist/70 focus:border-gold/70 focus:outline-none"
              />
              <div className="mt-6 flex justify-center gap-4">
                <CeremonialButton variant="quiet" onClick={sealDedication}>
                  Offer in Silence
                </CeremonialButton>
                <CeremonialButton onClick={sealDedication}>Seal</CeremonialButton>
              </div>
            </div>
          </motion.div>
        )}

        {ceremony === 'complete' && (
          <motion.div
            key="complete"
            className="absolute inset-0 z-30 flex items-center justify-center px-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: BREATH }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 50% at 50% 42%, rgba(217,164,65,0.2) 0%, rgba(18,11,7,0.7) 80%)',
              }}
            />
            <div className="relative">
              <KnotDivider className="mb-6" />
              <p className="max-w-sm font-body italic text-xl leading-relaxed text-ivory/90">
                The merit is dedicated. The shrine returns to silence.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
