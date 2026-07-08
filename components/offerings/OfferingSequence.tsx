'use client';

/**
 * The offering flow, over the living shrine:
 * touch → gold shimmer → manifestation video → halo answers →
 * merit increases → return to calm.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assets } from '@/lib/assets';
import type { OfferingDef, OfferingPhase } from '@/types';
import { AmbientOverlay } from '@/components/shrine/AmbientOverlay';

const BREATH = [0.33, 0, 0.2, 1] as const;

export function OfferingSequence({
  offering,
  phase,
  onVideoEnded,
}: {
  offering: OfferingDef | null;
  phase: OfferingPhase;
  onVideoEnded: () => void;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  useEffect(() => setVideoFailed(false), [offering?.id]);

  // If the manifestation video fails, keep ritual time honest anyway.
  useEffect(() => {
    if (phase !== 'manifestation' || !videoFailed) return;
    const t = setTimeout(onVideoEnded, 3600);
    return () => clearTimeout(t);
  }, [phase, videoFailed, onVideoEnded]);

  if (!offering) return null;
  const src = assets.offerings[offering.videoKey];

  return (
    <AnimatePresence>
      {phase === 'manifestation' && (
        <motion.div
          key={`video-${offering.id}`}
          className="absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: BREATH }}
        >
          {!videoFailed && (
            <video
              src={src}
              autoPlay
              muted
              playsInline
              onEnded={onVideoEnded}
              onError={() => setVideoFailed(true)}
              className="h-full w-full object-cover"
              style={{ mixBlendMode: 'screen' }}
            />
          )}
          {/* Procedural glow accompanies (or replaces) the video. */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.25] }}
            transition={{ duration: 3.2, ease: BREATH }}
            style={{
              background:
                'radial-gradient(60% 45% at 50% 42%, rgba(233,180,91,0.4) 0%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      )}

      {phase === 'halo' && (
        <motion.div
          key="halo"
          className="absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: BREATH }}
        >
          <AmbientOverlay src={assets.effects.haloPulse} opacity={0.7} />
          <motion.div
            aria-hidden
            className="absolute inset-0"
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 4.5, ease: BREATH }}
            style={{
              background:
                'radial-gradient(50% 38% at 50% 36%, rgba(217,164,65,0.45) 0%, transparent 72%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      )}

      {(phase === 'manifestation' || phase === 'halo') && (
        <motion.div
          key={`caption-${offering.id}`}
          className="pointer-events-none absolute inset-x-0 top-[12%] z-20 px-10 text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: BREATH }}
        >
          <h2 className="font-display text-base uppercase tracking-[0.4em] text-gold">
            {offering.name}
          </h2>
          <p className="mt-2 font-body italic text-lg text-ivory/85">
            {offering.meaning}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
