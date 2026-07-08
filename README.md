# Yellow Dzambhala — Digital Shrine (v3.0)

A cinematic digital shrine inspired by Vajrayana practice and the
monasteries of Ladakh. Entering the app should feel like entering a
temple before dawn.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → ./out
```

## Deployment

**Vercel** — push the repository and import it; the static export
builds with zero configuration changes.

**Capacitor (iOS / Android)** — `npm run build`, then point Capacitor's
`webDir` at `./out`. The app is a single client experience with no
server dependencies.

## The journey

Arrival cinematic → Temple doors (touch to open) → the Sanctuary.
From the offering tray, make the six offerings — water, flower,
incense, butter lamp, fruit, golden light — in any order. When all six
rest on the altar, the Blessing descends, merit may be dedicated in
your own words, and the shrine returns to silence.

The bottom rail opens the Mala practice (21 / 27 / 54 / 108 /
unlimited), the Merit Journal, Practice History, and Settings. Chrome
auto-hides during contemplation and returns with a soft dissolve on any
touch.

## Assets

Every remote asset is declared exactly once in `lib/assets.ts`
(semantic names, Vercel Blob). If a filename in the Blob store differs
from the manifest, correct it there — nowhere else. Every media
component carries a full fallback ladder (`fallbackSrc → poster →
procedural gradient`), so a missing asset degrades gracefully and never
blanks the screen or halts the ritual.

## Architecture notes

- Next.js 14 App Router · TypeScript strict · Tailwind · Framer Motion
- `output: 'export'` — deploys to Vercel and wraps in Capacitor
- One state machine (`components/journey/ShrineApp.tsx`); every passage
  is a 1.1 s obsidian dissolve on the single easing curve
  `cubic-bezier(0.33, 0, 0.2, 1)`
- Persistence in localStorage (`lib/state.ts`): sessions, journal,
  daily & lifetime merit, continuity of practice, settings
- Reduced motion honoured via system preference, in-app setting, and
  non-initialising particles

See `CLAUDE.md` for the full aesthetic law and decisions of record.
