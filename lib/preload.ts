/**
 * Preloader — warms upcoming screens with detached media elements so the
 * next moment of the ritual is already resident when it arrives.
 */

const warmed = new Set<string>();

export function preloadVideo(src: string): void {
  if (typeof window === 'undefined' || warmed.has(src)) return;
  warmed.add(src);
  const v = document.createElement('video');
  v.preload = 'auto';
  v.muted = true;
  v.playsInline = true;
  v.src = src;
  v.load();
}

export function preloadVideos(srcs: readonly string[]): void {
  srcs.forEach(preloadVideo);
}

export function preloadAudio(src: string): void {
  if (typeof window === 'undefined' || warmed.has(src)) return;
  warmed.add(src);
  const a = new Audio();
  a.preload = 'auto';
  a.src = src;
  a.load();
}
