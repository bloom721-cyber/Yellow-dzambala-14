'use client';

/**
 * Reduced motion, honoured three ways:
 *  1. system prefers-reduced-motion
 *  2. the in-app setting (passed in)
 * The combined value is also written to <html data-motion> so global
 * CSS can quiet every keyframe at once.
 */

import { useEffect, useState } from 'react';

export function useReducedMotion(appSetting: boolean): boolean {
  const [system, setSystem] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystem(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const reduced = system || appSetting;

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  }, [reduced]);

  return reduced;
}
