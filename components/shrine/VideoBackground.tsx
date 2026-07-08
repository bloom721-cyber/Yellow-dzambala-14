'use client';

/**
 * Dual-layer crossfading video background with full fallback ladder:
 *   src → fallbackSrc → poster → procedural obsidian gradient.
 * Load failure must never show a blank screen; the shrine always has
 * ground beneath it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  /** Played if the primary source fails (e.g. mobile variant). */
  fallbackSrc?: string;
  poster?: string;
  loop?: boolean;
  /** Called when a non-looping video finishes. */
  onEnded?: () => void;
  /** Slow ken-burns drift when motion is allowed. */
  kenBurns?: boolean;
  className?: string;
}

export function VideoBackground({
  src,
  fallbackSrc,
  poster,
  loop = true,
  onEnded,
  kenBurns = false,
  className = '',
}: Props) {
  const [activeSrc, setActiveSrc] = useState(src);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const triedFallback = useRef(false);

  useEffect(() => {
    setActiveSrc(src);
    setReady(false);
    setFailed(false);
    triedFallback.current = false;
  }, [src]);

  const handleError = useCallback(() => {
    if (fallbackSrc && !triedFallback.current) {
      triedFallback.current = true;
      setActiveSrc(fallbackSrc);
      return;
    }
    setFailed(true);
  }, [fallbackSrc]);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-obsidian ${className}`}>
      {/* Procedural ground — always present beneath the media. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 38%, #241509 0%, #120B07 62%, #0B0704 100%)',
        }}
      />
      {poster && !ready && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {!failed && (
        <video
          key={activeSrc}
          src={activeSrc}
          poster={poster}
          autoPlay
          muted
          playsInline
          loop={loop}
          onEnded={onEnded}
          onError={handleError}
          onCanPlay={() => setReady(true)}
          className={[
            'absolute inset-0 h-full w-full object-cover',
            'transition-opacity duration-[1400ms] ease-breath',
            ready ? 'opacity-100' : 'opacity-0',
            kenBurns ? 'motion-safe-ken-burns' : '',
          ].join(' ')}
        />
      )}
      {/* Warmth vignette so UI text always sits on quiet ground. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(18,11,7,0.42) 0%, rgba(18,11,7,0) 26%, rgba(18,11,7,0) 58%, rgba(18,11,7,0.66) 100%)',
        }}
      />
    </div>
  );
}
