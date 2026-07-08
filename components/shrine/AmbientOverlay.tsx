'use client';

/**
 * Composites a looping atmosphere video over the shrine using
 * mix-blend-mode: screen, so dark pixels vanish and only light —
 * candle flicker, halo pulse — remains. Fails silently.
 */

import { useState } from 'react';

interface Props {
  src: string;
  opacity?: number;
  className?: string;
}

export function AmbientOverlay({ src, opacity = 0.5, className = '' }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setFailed(true)}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`}
      style={{ mixBlendMode: 'screen', opacity }}
    />
  );
}
