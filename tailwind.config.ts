import type { Config } from 'tailwindcss';

/**
 * AESTHETIC LAW — canonical tokens.
 * These values are fixed. Do not introduce new hues; derive tints
 * with opacity. See CLAUDE.md before changing anything here.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#120B07',   // ground of every screen — never pure black, never white
        walnut:   '#241509',   // deep temple wood
        temple:   '#4A1712',   // burgundy / temple red — lacquer, silk
        gold:     '#D9A441',   // antique gold — headings, ornament, halo
        ivory:    '#F4E7C5',   // lotus ivory / cream — body text
        bronze:   '#8A5F32',   // aged brass — secondary ornament, borders
        amber:    '#E9B45B',   // butter-lamp light — glow cores only
        mist:     '#8F8578',   // mist grey — muted captions, disabled states
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'serif'],            // ceremonial headings — tracked, uppercase
        body:    ['var(--font-cormorant)', 'serif'],          // reading voice — often italic
        utility: ['var(--font-inter)', 'system-ui', 'sans-serif'], // counts, settings values
      },
      transitionTimingFunction: {
        breath: 'cubic-bezier(0.33, 0, 0.2, 1)',              // the only easing in the app
      },
      keyframes: {
        'halo-breathe': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%':      { opacity: '0.9',  transform: 'scale(1.04)' },
        },
        'ken-burns': {
          '0%':   { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
        'flame-flicker': {
          '0%, 100%': { opacity: '0.85', transform: 'scaleY(1)' },
          '42%':      { opacity: '1',    transform: 'scaleY(1.05)' },
          '68%':      { opacity: '0.78', transform: 'scaleY(0.97)' },
        },
        'slow-rise': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'halo-breathe': 'halo-breathe 7s cubic-bezier(0.33, 0, 0.2, 1) infinite',
        'ken-burns':    'ken-burns 34s cubic-bezier(0.33, 0, 0.2, 1) alternate infinite',
        'flame-flicker':'flame-flicker 3.4s cubic-bezier(0.33, 0, 0.2, 1) infinite',
        'slow-rise':    'slow-rise 1.6s cubic-bezier(0.33, 0, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
