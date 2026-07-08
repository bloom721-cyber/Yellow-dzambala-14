'use client';

/**
 * Controls gently auto-hide during contemplation and reappear with a
 * soft dissolve on any interaction.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export function useAutoHide(delayMs = 9000) {
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wake = useCallback(() => {
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), delayMs);
  }, [delayMs]);

  useEffect(() => {
    wake();
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'pointermove', 'keydown'];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [wake]);

  return visible;
}
