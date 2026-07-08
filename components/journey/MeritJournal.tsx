'use client';

/**
 * SCREEN 6 — Merit journal.
 * Dedications written on handmade paper, kept in a quiet ledger.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { KnotDivider } from '@/components/ui/KnotDivider';
import { CeremonialButton } from '@/components/ui/CeremonialButton';
import type { ShrineStore } from '@/hooks/useShrineState';

const BREATH = [0.33, 0, 0.2, 1] as const;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export function MeritJournal({ store }: { store: ShrineStore }) {
  const [draft, setDraft] = useState('');

  const seal = () => {
    const text = draft.trim();
    if (!text) return;
    store.journal(text);
    setDraft('');
  };

  return (
    <div className="relative h-full w-full overflow-y-auto bg-obsidian">
      <div className="mx-auto max-w-lg px-6 pb-[max(7rem,calc(env(safe-area-inset-bottom)+6rem))] pt-[max(2.6rem,env(safe-area-inset-top))]">
        <header className="text-center">
          <h1 className="font-display text-sm uppercase tracking-[0.45em] text-gold">
            Merit Journal
          </h1>
          <p className="mt-3 font-body italic text-lg text-ivory/70">
            Words written here are dedications — offered, then kept.
          </p>
          <KnotDivider className="mt-6" />
        </header>

        {/* Handmade paper writing surface */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: BREATH }}
          className="mt-8 rounded-sm p-5"
          style={{
            background:
              'linear-gradient(174deg, rgba(244,231,197,0.10) 0%, rgba(244,231,197,0.05) 100%)',
            border: '1px solid rgba(138,95,50,0.45)',
            boxShadow: 'inset 0 1px 0 rgba(244,231,197,0.12)',
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            aria-label="Write a dedication"
            placeholder="May this practice benefit…"
            className="w-full resize-none bg-transparent font-body text-xl italic leading-relaxed text-ivory placeholder:text-mist/70 focus:outline-none"
          />
          <div className="mt-4 flex justify-end">
            <CeremonialButton onClick={seal} ariaLabel="Seal this dedication">
              Seal
            </CeremonialButton>
          </div>
        </motion.div>

        {/* The ledger */}
        <section className="mt-10" aria-label="Past dedications">
          {store.hydrated && store.state.journal.length === 0 && (
            <p className="text-center font-body italic text-mist">
              The ledger is open. Your first dedication will rest here.
            </p>
          )}
          {store.state.journal.map((entry, i) => (
            <motion.article
              key={entry.at}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: Math.min(i * 0.08, 0.5), ease: BREATH }}
              className="border-b border-bronze/25 py-6 first:border-t"
            >
              <p className="font-utility text-[10px] uppercase tracking-[0.3em] text-mist">
                {formatDate(entry.at)}
              </p>
              <p className="mt-2 font-body text-xl italic leading-relaxed text-ivory/90">
                {entry.text}
              </p>
            </motion.article>
          ))}
        </section>
      </div>
    </div>
  );
}
