'use client';

/**
 * Primary navigation — anchored to the bottom safe area, expanding
 * upward. Engraved brass marks, not tabs. It auto-hides with the rest
 * of the chrome during contemplation.
 */

import { AnimatePresence, motion } from 'framer-motion';
import type { ShrineView } from '@/types';

const BREATH = [0.33, 0, 0.2, 1] as const;

const ITEMS: { view: ShrineView; label: string }[] = [
  { view: 'shrine', label: 'Shrine' },
  { view: 'mala', label: 'Mala' },
  { view: 'journal', label: 'Journal' },
  { view: 'history', label: 'History' },
  { view: 'settings', label: 'Settings' },
];

function Mark({ view, active }: { view: ShrineView; active: boolean }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-6 w-6',
    style: { opacity: active ? 1 : 0.75 },
  };
  switch (view) {
    case 'shrine': // temple silhouette
      return (
        <svg viewBox="0 0 28 28" {...common}>
          <path d="M6 22h16M8 22V13h12v9M10 13l4-6 4 6M12 22v-4.5h4V22" />
        </svg>
      );
    case 'mala': // bead circle
      return (
        <svg viewBox="0 0 28 28" {...common}>
          <circle cx="14" cy="14" r="8" strokeDasharray="2.4 3.2" />
          <circle cx="14" cy="5.5" r="2" />
        </svg>
      );
    case 'journal': // folded paper
      return (
        <svg viewBox="0 0 28 28" {...common}>
          <path d="M8 5h9l4 4v14H8zM17 5v4h4" />
          <path d="M11 14h7M11 18h7" opacity="0.7" />
        </svg>
      );
    case 'history': // record scroll
      return (
        <svg viewBox="0 0 28 28" {...common}>
          <path d="M9 6h11v16H9a2.5 2.5 0 0 1 0-5h11" />
          <path d="M12 10h5" opacity="0.7" />
        </svg>
      );
    case 'settings': // dharma wheel hub
      return (
        <svg viewBox="0 0 28 28" {...common}>
          <circle cx="14" cy="14" r="3" />
          <path d="M14 6v3M14 19v3M6 14h3M19 14h3M8.5 8.5l2 2M17.5 17.5l2 2M19.5 8.5l-2 2M10.5 17.5l-2 2" opacity="0.8" />
        </svg>
      );
    default:
      return null;
  }
}

export function BottomNav({
  view,
  visible,
  onNavigate,
}: {
  view: ShrineView;
  visible: boolean;
  onNavigate: (v: ShrineView) => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="nav"
          aria-label="Shrine navigation"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 1.1, ease: BREATH }}
          className="absolute inset-x-0 bottom-0 z-40 flex justify-center pb-[max(0.6rem,env(safe-area-inset-bottom))]"
        >
          <div
            className="flex items-center gap-1 rounded-full px-3 py-1.5"
            style={{
              background: 'rgba(18,11,7,0.72)',
              border: '1px solid rgba(138,95,50,0.4)',
              backdropFilter: 'blur(6px)',
              boxShadow: 'inset 0 1px 0 rgba(233,180,91,0.15), 0 8px 26px rgba(0,0,0,0.55)',
            }}
          >
            {ITEMS.map((item) => {
              const active = view === item.view;
              return (
                <button
                  key={item.view}
                  type="button"
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => onNavigate(item.view)}
                  className={[
                    'flex min-h-[50px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-full px-2',
                    'transition-colors duration-700 ease-breath',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/70',
                    active ? 'text-gold' : 'text-ivory/60 hover:text-ivory/85',
                  ].join(' ')}
                >
                  <Mark view={item.view} active={active} />
                  <span className="font-display text-[8px] uppercase tracking-[0.24em]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
