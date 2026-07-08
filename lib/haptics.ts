/**
 * Haptics — gentle by design. A blessing, not a buzz.
 * Uses the Vibration API where present; a Capacitor Haptics bridge can
 * replace the internals later without changing call sites.
 */

let enabled = true;

export const setHapticsEnabled = (v: boolean) => {
  enabled = v;
};

const vibrate = (pattern: number | number[]) => {
  if (!enabled) return;
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* not supported — silence is acceptable */
  }
};

/** A single soft tap — bead advanced, button touched. */
export const hapticSoft = () => vibrate(8);

/** Offering received. */
export const hapticBlessing = () => vibrate([10, 60, 18]);

/** Mala completed / dedication sealed. */
export const hapticCompletion = () => vibrate([12, 80, 12, 80, 24]);
