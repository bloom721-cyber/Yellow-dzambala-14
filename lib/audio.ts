/**
 * Audio — real Tibetan bell recordings and the ambient temple bed.
 * Every play is best-effort: a missing or blocked asset must never
 * interrupt the ritual. All calls are safe on the server.
 */

import { assets } from '@/lib/assets';

type AudioKey = keyof typeof assets.audio;

const cache = new Map<string, HTMLAudioElement>();
let audioEnabled = true;
let ambientEnabled = true;
let ambientEl: HTMLAudioElement | null = null;

export const setAudioEnabled = (v: boolean) => {
  audioEnabled = v;
  if (!v) stopAmbient();
};

export const setAmbientEnabled = (v: boolean) => {
  ambientEnabled = v;
  if (!v) stopAmbient();
};

const getEl = (src: string): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  let el = cache.get(src);
  if (!el) {
    el = new Audio(src);
    el.preload = 'auto';
    cache.set(src, el);
  }
  return el;
};

/** Strike a bell. Overlapping strikes clone the element. */
export function playBell(key: AudioKey, volume = 0.8): void {
  if (!audioEnabled) return;
  const el = getEl(assets.audio[key]);
  if (!el) return;
  try {
    const strike = el.paused ? el : (el.cloneNode(true) as HTMLAudioElement);
    strike.volume = volume;
    strike.currentTime = 0;
    void strike.play().catch(() => undefined);
  } catch {
    /* autoplay blocked or asset missing — the ritual continues */
  }
}

export function startAmbient(volume = 0.25): void {
  if (!audioEnabled || !ambientEnabled) return;
  if (typeof window === 'undefined') return;
  if (!ambientEl) {
    ambientEl = new Audio(assets.audio.ambientTemple);
    ambientEl.loop = true;
  }
  ambientEl.volume = volume;
  void ambientEl.play().catch(() => undefined);
}

export function stopAmbient(): void {
  ambientEl?.pause();
}
