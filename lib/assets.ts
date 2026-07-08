/**
 * ASSET MANIFEST — the single source of truth for every remote asset.
 *
 * RULES (see CLAUDE.md):
 *  - Every Blob asset is declared exactly once, here.
 *  - Never hardcode a Blob URL anywhere else in the codebase.
 *  - Semantic names, organised by ritual purpose, not by filename.
 *  - Every video consumer must pass `poster` and accept failure:
 *    all media components divert to procedural fallbacks on error.
 *
 * If an asset is renamed or added in the Blob store, this file is the
 * only place that changes.
 */

const BLOB = 'https://bxlgznpbzulekzpa.public.blob.vercel-storage.com';

const url = (path: string) => `${BLOB}/${path}`;

// Shared across groups — still a single declaration.
const HALO_PULSE_LOOP = url('yellow-dzambhala-halo-pulse-loop.mp4');

export const assets = {
  arrival: {
    /** Approach through mist — first cinematic. */
    introPrimary: url('intro-sequence-2.mp4'),
    /** Continuation — closer to the temple. */
    introSecondary: url('intro-sequence-3.mp4'),
  },

  hero: {
    /** Deity halo hero still / plate. */
    halo: url('halo-hero.mp4'),
    haloPulseLoop: HALO_PULSE_LOOP,
  },

  shrine: {
    /** The sanctuary loop — always the visual hero. */
    loop: url('yellow-dzambhala-shrine-loop.mp4'),
    /** Lighter variant; also the desktop loop's error fallback. */
    loopMobile: url('main-shrine-loop-mobile.mp4'),
  },

  doors: {
    /** Temple doors opening sequence. */
    opening: url('temple-door-opening.mp4'),
  },

  offerings: {
    water: url('wateraltar.mp4'),
    waterButton: url('water_offering_button.mp4'),
    flower: url('flower-bloom.mp4'),
    incenseLighting: url('incense-lighting.mp4'),
    incenseLoop: url('incense-loop.mp4'),
    lampLighting: url('butter-lamp-lighting.mp4'),
    lampLoop: url('butter-lamp-loop.mp4'),
    fruit: url('fruit-offering.mp4'),
    light: url('golden-light-blessing.mp4'),
  },

  effects: {
    /** Composited with mix-blend-mode: screen — dark pixels vanish. */
    candleFlicker: url('candle-flicker-loop.mp4'),
    haloPulse: HALO_PULSE_LOOP,
  },

  audio: {
    /** Real Tibetan bell recordings, FFmpeg-normalised.
     *  Mapping of bell → ritual moment lives in lib/offerings.ts. */
    bellDeep: url('audio/bell-deep-resonant.mp3'),
    bellBright: url('audio/bell-bright-clear.mp3'),
    bellSoft: url('audio/bell-soft-distant.mp3'),
    bellDouble: url('audio/bell-double-strike.mp3'),
    bellLong: url('audio/bell-long-decay.mp3'),
    bellCompletion: url('audio/bell-completion.mp3'),
    /** Ambient bed for the sanctuary. */
    ambientTemple: url('audio/ambient-temple-loop.mp3'),
  },
} as const;

export type AssetManifest = typeof assets;
