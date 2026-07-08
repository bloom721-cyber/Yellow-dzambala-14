'use client';

/**
 * SCREEN 7 — Practice history.
 * A monastery record book, not analytics: quiet prose and a simple
 * ledger of days. Continuity is stated in one sentence, never gamified.
 */

import { useMemo } from 'react';
import { KnotDivider } from '@/components/ui/KnotDivider';
import { OFFERINGS, MANTRAS } from '@/lib/offerings';
import type { ShrineStore } from '@/hooks/useShrineState';

const nameFor = (kind: string, detail: string): string => {
  if (kind === 'offering')
    return `${OFFERINGS.find((o) => o.id === detail)?.name ?? 'Offering'} offered`;
  if (kind === 'mala') {
    const m = MANTRAS.find((x) => x.id === detail);
    return `Mala — ${m ? m.transliteration : 'recitation'}`;
  }
  return 'Merit dedicated';
};

export function PracticeHistory({ store }: { store: ShrineStore }) {
  const { state, hydrated } = store;

  const byDay = useMemo(() => {
    const map = new Map<string, typeof state.sessions>();
    for (const s of [...state.sessions].reverse()) {
      const day = s.at.slice(0, 10);
      const list = map.get(day) ?? [];
      list.push(s);
      map.set(day, list);
    }
    return Array.from(map.entries());
  }, [state.sessions]);

  const continuityLine =
    state.continuityDays > 1
      ? `Practice has continued, unbroken, for ${state.continuityDays} days.`
      : state.continuityDays === 1
        ? 'Practice began today.'
        : 'The record book is open.';

  return (
    <div className="relative h-full w-full overflow-y-auto bg-obsidian">
      <div className="mx-auto max-w-lg px-6 pb-[max(7rem,calc(env(safe-area-inset-bottom)+6rem))] pt-[max(2.6rem,env(safe-area-inset-top))]">
        <header className="text-center">
          <h1 className="font-display text-sm uppercase tracking-[0.45em] text-gold">
            Practice History
          </h1>
          <p className="mt-3 font-body italic text-lg text-ivory/70">{continuityLine}</p>
          <KnotDivider className="mt-6" />
        </header>

        <div className="mt-8 flex justify-center gap-12 text-center">
          <div>
            <p className="font-utility text-3xl font-light tabular-nums text-ivory">
              {hydrated ? state.todayMerit : '—'}
            </p>
            <p className="mt-1 font-display text-[10px] uppercase tracking-[0.35em] text-mist">
              Merit today
            </p>
          </div>
          <div>
            <p className="font-utility text-3xl font-light tabular-nums text-gold">
              {hydrated ? state.lifetimeMerit : '—'}
            </p>
            <p className="mt-1 font-display text-[10px] uppercase tracking-[0.35em] text-mist">
              Lifetime merit
            </p>
          </div>
        </div>

        <section className="mt-10" aria-label="Record of practice">
          {hydrated && byDay.length === 0 && (
            <p className="text-center font-body italic text-mist">
              When you make your first offering, it will be recorded here.
            </p>
          )}
          {byDay.map(([day, sessions]) => (
            <div key={day} className="border-b border-bronze/25 py-5 first:border-t">
              <p className="font-utility text-[10px] uppercase tracking-[0.3em] text-gold/80">
                {new Date(`${day}T12:00:00`).toLocaleDateString(undefined, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
              <ul className="mt-3 space-y-2">
                {sessions.map((s) => (
                  <li key={s.at} className="flex items-baseline justify-between gap-4">
                    <span className="font-body text-lg italic text-ivory/85">
                      {nameFor(s.kind, s.detail)}
                      {s.kind === 'mala' ? ` · ${s.count}` : ''}
                    </span>
                    <span className="shrink-0 font-utility text-xs tabular-nums text-mist">
                      +{s.merit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
