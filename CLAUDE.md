# CLAUDE.md — Standing Mandate · Yellow Dzambhala Shrine (v3.0)

Read this before touching anything. It is the canonical source of
aesthetic law and architecture decisions. Update it at the end of every
significant build session.

## What this is

A cinematic digital shrine for Yellow Dzambhala. Entering the app must
feel like entering a Himalayan monastery before dawn — never like using
software. The ritual journey is linear: Arrival → Temple Doors →
Sanctuary → six offerings → Blessing → Dedication of Merit → Completion.
The sanctuary also opens onto Mala practice, the Merit Journal, Practice
History and Settings via the bottom rail.

## Aesthetic law (hard rules)

- Palette (Tailwind tokens, `tailwind.config.ts`): obsidian `#120B07`,
  walnut `#241509`, temple `#4A1712`, gold `#D9A441`, ivory `#F4E7C5`,
  bronze `#8A5F32`, amber `#E9B45B`, mist `#8F8578`. No new hues; derive
  tints with opacity.
- Typography: Cormorant Garamond (body, often italic) · Cinzel
  (ceremonial headings, uppercase, tracked ≥ 0.24em) · Inter (utility:
  counts, captions, settings values).
- Motion: slow and organic only — ken-burns, halo breathing, breath
  easing. The only easing curve in the app is
  `cubic-bezier(0.33, 0, 0.2, 1)` (Tailwind: `ease-breath`).
- **Prohibited, always**: gamification, streak UI, badges, confetti,
  grids of cards, blank white screens, glassmorphism, neon, fast or
  arcade animations, generic mobile controls.
- The endless-knot SVG (`components/ui/KnotDivider.tsx`) is the
  systematic ornament. Use it wherever a section breathes.
- The shrine is always the visual hero. Static camera. UI never covers
  the deity or altar; chrome auto-hides during contemplation
  (`useAutoHide`) and returns with a soft dissolve.

## Decisions of record

- **"Streaks"** (requested in the v3 brief's STATE section) are
  persisted as `continuityDays` and surfaced only as one line of quiet
  prose in Practice History ("Practice has continued, unbroken, for N
  days."). Never a flame, never a badge, never a counter chip. This
  reconciles the brief with the standing prohibition on gamification.
- **"Dark mode"** setting was intentionally omitted: the temple has one
  light. A light theme would violate the no-blank-white-screens law.
  The obsidian ground *is* the theme.
- **Single client experience, no route changes**: the whole app is one
  state machine (`components/journey/ShrineApp.tsx`) rendered via
  `dynamic(..., { ssr: false })`. Every passage is a soft dissolve;
  routes would flash. This also keeps `output: 'export'` trivial for
  Capacitor.
- Offerings may be made in any order from the tray; when all six are
  present, the Blessing → Dedication → Completion sequence begins.

## Architecture

- `lib/assets.ts` — the **only** place a Blob URL may appear. Semantic
  names, organised by ritual purpose. Base URL:
  `https://bxlgznpbzulekzpa.public.blob.vercel-storage.com`.
  Filenames in the manifest are the expected canonical names; if the
  Blob store uses different filenames/extensions, correct them here and
  nowhere else.
- `components/shrine/VideoBackground.tsx` — dual-layer ground with a
  full fallback ladder: `src → fallbackSrc → poster → procedural
  obsidian gradient`. The desktop shrine loop falls back to the mobile
  variant on load failure. Nothing may ever show a blank screen.
- `components/shrine/AmbientOverlay.tsx` — atmosphere loops composited
  with `mix-blend-mode: screen` (dark pixels vanish; only light
  remains). Fails silently by unmounting.
- `lib/audio.ts` — best-effort bell playback; a missing or blocked
  asset must never interrupt the ritual.
- `lib/preload.ts` — detached video/audio elements warm the next
  moments of the journey (Arrival warms doors + shrine; the sanctuary
  warms all offering videos).
- State: `hooks/useShrineState.ts` + `lib/state.ts`, localStorage key
  `dzambhala-shrine-v3`. Persisted: sessions, journal, daily/lifetime
  merit, continuity, settings.

## Bell → ritual moment mapping (canonical)

| Bell             | Moment                                        |
| ---------------- | --------------------------------------------- |
| `bellSoft`       | Water offering                                |
| `bellBright`     | Flower offering                               |
| `bellDeep`       | Incense offering · opening the temple doors   |
| `bellDouble`     | Butter lamp                                   |
| `bellLong`       | Fruit offering · sealing the dedication       |
| `bellCompletion` | Golden light · mala completion · blessing     |

## Hydration & motion safety

- Anything with randomness, Web Audio, canvas or localStorage is
  `"use client"`; the app root mounts with `ssr: false`.
- Reduced motion is honoured three ways: system
  `prefers-reduced-motion`, the in-app setting (written to
  `<html data-motion>`, quieting all keyframes via `globals.css`), and
  canvas particles that simply do not initialise.

## Asset pipeline conventions

- Textures → WebP via ImageMagick `mogrify`.
- Audio → FFmpeg normalise + semantic rename before upload.
- Video atmosphere layers must be authored on black for
  `mix-blend-mode: screen` compositing.
- Semantic filenames from the start; UUID names have caused rework.

## Multi-deity future

The architecture anticipates a namespace of shrines (White Tara,
Mahakala, Medicine Buddha…). Adding one requires: a sibling asset group
in `lib/assets.ts`, an offerings/mantra set in `lib/offerings.ts`, and a
registry entry — no component changes.

## Working style (Yiannis)

Terse directives; full autonomous multi-step execution expected; no
per-step confirmation. Deliverables are complete ZIP archives. Audit
your own output against the brief's Final Quality Gate before
delivering, and close gaps in a follow-up pass.
