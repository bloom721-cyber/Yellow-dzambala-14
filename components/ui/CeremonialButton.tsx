'use client';

/**
 * The one button of the temple: aged gold on lacquer, engraved edge,
 * warm inner light. Never a generic mobile control.
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const BREATH = [0.33, 0, 0.2, 1] as const;

export function CeremonialButton({
  children,
  onClick,
  variant = 'gold',
  className = '',
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'gold' | 'quiet';
  className?: string;
  ariaLabel?: string;
}) {
  const gold = variant === 'gold';
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.5, ease: BREATH }}
      className={[
        'relative min-h-[52px] rounded-sm px-8 py-3',
        'font-display text-sm uppercase tracking-[0.28em]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold/70',
        gold
          ? 'text-obsidian'
          : 'border border-bronze/50 text-ivory/85 hover:border-gold/60',
        className,
      ].join(' ')}
      style={
        gold
          ? {
              background:
                'linear-gradient(168deg, #E9B45B 0%, #D9A441 42%, #A9762B 100%)',
              boxShadow:
                'inset 0 1px 0 rgba(244,231,197,0.55), inset 0 -2px 4px rgba(74,23,18,0.35), 0 6px 22px rgba(217,164,65,0.22)',
            }
          : { background: 'rgba(18,11,7,0.55)', backdropFilter: 'blur(2px)' }
      }
    >
      {children}
    </motion.button>
  );
}
