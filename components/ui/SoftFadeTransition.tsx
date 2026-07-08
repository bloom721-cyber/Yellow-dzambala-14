'use client';

/**
 * The curtain between views — an obsidian dissolve, never a cut.
 */

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

const BREATH = [0.33, 0, 0.2, 1] as const;

export function SoftFadeTransition({
  viewKey,
  children,
}: {
  viewKey: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: BREATH }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
