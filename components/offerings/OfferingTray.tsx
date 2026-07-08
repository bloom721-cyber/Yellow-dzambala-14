'use client';

/**
 * The offering tray — a handcrafted ceremonial object resting at the
 * bottom of the sanctuary. Lacquered wood, brass edge, engraved
 * roundels. It never covers the shrine; it belongs to it.
 */

import { motion } from 'framer-motion';
import { OFFERINGS } from '@/lib/offerings';
import type { OfferingDef, OfferingId } from '@/types';
import { OfferingButton } from './OfferingButton';

const BREATH = [0.33, 0, 0.2, 1] as const;

export function OfferingTray({
  offered,
  activeId,
  busy,
  visible,
  onSelect,
}: {
  offered: ReadonlySet<OfferingId>;
  activeId: OfferingId | null;
  busy: boolean;
  visible: boolean;
  onSelect: (o: OfferingDef) => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 26 }}
      transition={{ duration: 1.2, ease: BREATH }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[calc(max(0.6rem,env(safe-area-inset-bottom))+4.9rem)]"
      aria-hidden={!visible}
    >
      <div
        className={`pointer-events-auto relative rounded-[26px] px-4 py-3 ${visible ? '' : 'pointer-events-none'}`}
        role="group"
        aria-label="Offering tray"
        style={{
          background:
            'linear-gradient(178deg, rgba(58,32,18,0.92) 0%, rgba(36,21,9,0.94) 55%, rgba(22,13,7,0.96) 100%)',
          border: '1px solid rgba(138,95,50,0.55)',
          boxShadow:
            'inset 0 1px 0 rgba(233,180,91,0.25), inset 0 -3px 8px rgba(0,0,0,0.55), 0 10px 34px rgba(0,0,0,0.6)',
        }}
      >
        {/* Brass filigree edge */}
        <span
          aria-hidden
          className="absolute inset-x-6 top-[3px] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />
        <span
          aria-hidden
          className="absolute inset-x-10 bottom-[3px] h-px bg-gradient-to-r from-transparent via-bronze/50 to-transparent"
        />
        <div className="flex items-center gap-3">
          {OFFERINGS.map((o) => (
            <OfferingButton
              key={o.id}
              offering={o}
              offered={offered.has(o.id)}
              active={activeId === o.id}
              disabled={busy}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
