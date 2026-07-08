'use client';

/**
 * SCREEN 1 — Arrival.
 * The approach through mist before dawn. Two intro sequences play in
 * succession; the practitioner may enter at any time.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from '@/lib/assets';
import { VideoBackground } from '@/components/shrine/VideoBackground';
import { CeremonialButton } from '@/components/ui/CeremonialButton';
import { KnotDivider } from '@/components/ui/KnotDivider';
import { preloadVideos } from '@/lib/preload';

const BREATH = [0.33, 0, 0.2, 1] as const;

export function ArrivalCinematic({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<0 | 1>(0);

  // Warm the next moments of the journey while the mist drifts.
  useEffect(() => {
    preloadVideos([assets.doors.opening, assets.shrine.loop, assets.shrine.loopMobile]);
  }, []);

  return (
    <div className="relative h-full w-full">
      <VideoBackground
        src={phase === 0 ? assets.arrival.introPrimary : assets.arrival.introSecondary}
        fallbackSrc={assets.shrine.loopMobile}
        loop={phase === 1}
        onEnded={() => setPhase(1)}
        kenBurns
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-[max(4rem,env(safe-area-inset-bottom))] px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, delay: 1.4, ease: BREATH }}
          className="flex flex-col items-center"
        >
          <p className="font-body italic text-ivory/80 text-lg">
            Before dawn, in the high valley
          </p>
          <h1 className="mt-3 font-display text-2xl uppercase tracking-[0.42em] text-gold sm:text-3xl">
            Yellow Dzambhala
          </h1>
          <p className="mt-1 font-display text-[11px] uppercase tracking-[0.5em] text-ivory/60">
            Digital Shrine
          </p>
          <KnotDivider className="my-7" />
          <CeremonialButton onClick={onEnter} ariaLabel="Approach the temple doors">
            Approach
          </CeremonialButton>
        </motion.div>
      </div>
    </div>
  );
}
