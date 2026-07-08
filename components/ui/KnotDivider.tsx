/**
 * The endless knot — the systematic ornament of the entire application.
 * Drawn once, used everywhere a section breathes.
 */

export function KnotDivider({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center gap-4 text-gold/70 ${className}`}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
      <svg
        width="34"
        height="34"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M14 14h12v8h8v12H22v-8h-8z" />
        <path d="M22 14h12v12h-8v8H14V22h8z" opacity="0.55" />
        <path d="M18 10c-4 0-8 4-8 8m28 20c4 0 8-4 8-8" opacity="0.35" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}
