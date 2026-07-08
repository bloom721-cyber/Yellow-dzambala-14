'use client';

/**
 * A sacred ritual object, not a toolbar icon: an engraved brass roundel
 * with a hand-drawn emblem, warm bevel, and a gold shimmer when touched.
 */

import { motion } from 'framer-motion';
import type { OfferingDef } from '@/types';

const BREATH = [0.33, 0, 0.2, 1] as const;

/** Hand-drawn line emblems — one per offering, engraved in gold. */
function Emblem({ id }: { id: OfferingDef['id'] }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (id) {
    case 'water':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" {...common}>
          <path d="M10 13c0-2 2.5-3.5 6-3.5s6 1.5 6 3.5M9 13h14l-1.6 9.5a3 3 0 0 1-3 2.5h-4.8a3 3 0 0 1-3-2.5z" />
          <path d="M13 17.5c1 .8 2 .8 3 0s2-.8 3 0" opacity="0.7" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" {...common}>
          <path d="M16 22c-5 0-8-3-9-6 3-1 6 0 7.5 1.5C14 14 15 10.5 16 8c1 2.5 2 6 1.5 9.5C19 16 22 15 25 16c-1 3-4 6-9 6z" />
          <path d="M16 22v3" opacity="0.7" />
        </svg>
      );
    case 'incense':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" {...common}>
          <path d="M12 25h8M14 25l1.6-11M18 25l-1.6-11" />
          <path d="M16 12c-1.6-1.8 1.6-3 0-5" opacity="0.7" />
          <path d="M16 6.5c-.8-.9.8-1.5 0-2.5" opacity="0.45" />
        </svg>
      );
    case 'lamp':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" {...common}>
          <path d="M10 18h12l-1.6 4.5a3 3 0 0 1-2.8 2h-3.2a3 3 0 0 1-2.8-2zM13 18c0-1.5 1-2.5 3-2.5s3 1 3 2.5" />
          <path d="M16 13.5c-1.8-1.6 1.8-3.2 0-5.5-1 1.6.9 2.6 0 5.5z" opacity="0.8" />
        </svg>
      );
    case 'fruit':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" {...common}>
          <circle cx="12.5" cy="19" r="4.5" />
          <circle cx="19.5" cy="19" r="4.5" opacity="0.75" />
          <circle cx="16" cy="13" r="4.5" opacity="0.55" />
        </svg>
      );
    case 'light':
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" {...common}>
          <circle cx="16" cy="16" r="4.5" />
          <path d="M16 6v3M16 23v3M6 16h3M23 16h3M9 9l2 2M21 21l2 2M23 9l-2 2M11 21l-2 2" opacity="0.7" />
        </svg>
      );
  }
}

export function OfferingButton({
  offering,
  offered,
  active,
  disabled,
  onSelect,
}: {
  offering: OfferingDef;
  /** Already made in this visit — glows quietly. */
  offered: boolean;
  /** Currently manifesting. */
  active: boolean;
  disabled: boolean;
  onSelect: (o: OfferingDef) => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={`Offer ${offering.name.toLowerCase()}`}
      aria-pressed={offered}
      disabled={disabled}
      onClick={() => onSelect(offering)}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ duration: 0.45, ease: BREATH }}
      className={[
        'relative flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/70',
        disabled && !active ? 'opacity-45' : '',
        offered ? 'text-amber' : 'text-gold/90',
      ].join(' ')}
      style={{
        background:
          'radial-gradient(circle at 32% 26%, #3a2412 0%, #241509 55%, #160d07 100%)',
        boxShadow: [
          'inset 0 1px 1px rgba(233,180,91,0.35)',
          'inset 0 -2px 4px rgba(0,0,0,0.6)',
          offered
            ? '0 0 18px rgba(217,164,65,0.35)'
            : '0 3px 10px rgba(0,0,0,0.5)',
        ].join(', '),
        border: '1px solid rgba(138,95,50,0.65)',
      }}
    >
      {/* Engraved ring */}
      <span
        aria-hidden
        className="absolute inset-[5px] rounded-full border border-bronze/40"
      />
      <Emblem id={offering.id} />
      {/* Gold shimmer when touched / manifesting */}
      {active && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0] }}
          transition={{ duration: 1.8, ease: BREATH }}
          style={{
            background:
              'radial-gradient(circle, rgba(233,180,91,0.55) 0%, rgba(217,164,65,0.15) 55%, transparent 75%)',
          }}
        />
      )}
    </motion.button>
  );
}
