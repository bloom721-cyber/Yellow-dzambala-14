'use client';

/**
 * Gentle gold dust drifting through the sanctuary air.
 * Canvas-based; initialised only after mount and only when motion is
 * allowed (hydration-safe — no randomness during render).
 */

import { useEffect, useRef } from 'react';

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  tw: number;
}

export function DustParticles({
  reduced,
  count = 26,
}: {
  reduced: boolean;
  count?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return; // particles simply do not initialise
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let motes: Mote[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (): Mote => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 40,
      r: (0.6 + Math.random() * 1.6) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.12 * devicePixelRatio,
      vy: -(0.05 + Math.random() * 0.16) * devicePixelRatio,
      a: 0.12 + Math.random() * 0.3,
      tw: Math.random() * Math.PI * 2,
    });

    motes = Array.from({ length: count }, () => {
      const m = spawn();
      m.y = Math.random() * canvas.height; // seed mid-air
      return m;
    });

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const m of motes) {
        m.x += m.vx + Math.sin(t + m.tw) * 0.06;
        m.y += m.vy;
        if (m.y < -10) Object.assign(m, spawn());
        const alpha = m.a * (0.7 + 0.3 * Math.sin(t * 2 + m.tw));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 164, 65, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, count]);

  if (reduced) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
