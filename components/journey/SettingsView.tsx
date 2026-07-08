'use client';

/**
 * SCREEN 8 — Settings.
 * Brass toggles on temple wood. Quiet, legible, few.
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { KnotDivider } from '@/components/ui/KnotDivider';
import { CeremonialButton } from '@/components/ui/CeremonialButton';
import { MALA_LENGTHS, MANTRAS, malaLengthLabel } from '@/lib/offerings';
import type { MalaLength } from '@/types';
import type { ShrineStore } from '@/hooks/useShrineState';

const BREATH = [0.33, 0, 0.2, 1] as const;

function BrassToggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-6 border-b border-bronze/25 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/70"
    >
      <span>
        <span className="block font-body text-xl italic text-ivory">{label}</span>
        <span className="mt-0.5 block font-utility text-xs text-mist">{hint}</span>
      </span>
      <span
        aria-hidden
        className="relative h-[30px] w-[56px] shrink-0 rounded-full transition-colors duration-700 ease-breath"
        style={{
          background: value
            ? 'linear-gradient(168deg, #a9762b, #6f4c1d)'
            : 'rgba(36,21,9,0.9)',
          border: '1px solid rgba(138,95,50,0.6)',
          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)',
        }}
      >
        <motion.span
          className="absolute top-[3px] h-[22px] w-[22px] rounded-full"
          animate={{ left: value ? 29 : 3 }}
          transition={{ duration: 0.6, ease: BREATH }}
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #E9B45B 0%, #D9A441 50%, #8A5F32 100%)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.55), inset 0 1px 1px rgba(244,231,197,0.5)',
          }}
        />
      </span>
    </button>
  );
}

export function SettingsView({
  store,
  onReturnToArrival,
}: {
  store: ShrineStore;
  onReturnToArrival: () => void;
}) {
  const { settings } = store.state;
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="relative h-full w-full overflow-y-auto bg-obsidian">
      <div className="mx-auto max-w-lg px-6 pb-[max(7rem,calc(env(safe-area-inset-bottom)+6rem))] pt-[max(2.6rem,env(safe-area-inset-top))]">
        <header className="text-center">
          <h1 className="font-display text-sm uppercase tracking-[0.45em] text-gold">
            Settings
          </h1>
          <KnotDivider className="mt-6" />
        </header>

        <section className="mt-6" aria-label="Sound and touch">
          <BrassToggle
            label="Bells"
            hint="Tibetan bell recordings during offerings"
            value={settings.audio}
            onChange={(v) => store.patchSettings({ audio: v })}
          />
          <BrassToggle
            label="Ambient sound"
            hint="The temple's quiet atmosphere"
            value={settings.ambient}
            onChange={(v) => store.patchSettings({ ambient: v })}
          />
          <BrassToggle
            label="Haptics"
            hint="A soft pulse for each bead and blessing"
            value={settings.haptics}
            onChange={(v) => store.patchSettings({ haptics: v })}
          />
          <BrassToggle
            label="Reduce motion"
            hint="Stills the dust, quiets the flame"
            value={settings.reduceMotion}
            onChange={(v) => store.patchSettings({ reduceMotion: v })}
          />
        </section>

        <section className="mt-10" aria-label="Mala">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-gold/85">
            Mala length
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {MALA_LENGTHS.map((n) => {
              const selected = settings.malaLength === n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => store.patchSettings({ malaLength: n as MalaLength })}
                  className={[
                    'min-h-[46px] rounded-sm border px-4 font-utility text-sm transition-colors duration-500 ease-breath',
                    selected
                      ? 'border-gold/80 bg-gold/15 text-gold'
                      : 'border-bronze/40 text-ivory/70 hover:border-bronze/70',
                  ].join(' ')}
                >
                  {malaLengthLabel(n)}
                </button>
              );
            })}
          </div>

          <p className="mt-8 font-display text-[11px] uppercase tracking-[0.4em] text-gold/85">
            Mantra
          </p>
          <div className="mt-4 space-y-2">
            {MANTRAS.map((m) => {
              const selected = settings.mantraId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => store.patchSettings({ mantraId: m.id })}
                  className={[
                    'w-full rounded-sm border p-4 text-left transition-colors duration-500 ease-breath',
                    selected
                      ? 'border-gold/80 bg-gold/10'
                      : 'border-bronze/40 hover:border-bronze/70',
                  ].join(' ')}
                >
                  <span className="block font-body text-lg italic text-ivory">
                    {m.transliteration}
                  </span>
                  <span className="mt-1 block font-utility text-xs text-mist">
                    {m.meaning}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-12 text-center" aria-label="Reset">
          <KnotDivider className="mb-8" />
          <AnimatePresence mode="wait">
            {!confirmingReset ? (
              <motion.div key="ask" exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: BREATH }}>
                <CeremonialButton variant="quiet" onClick={() => setConfirmingReset(true)}>
                  Reset practice
                </CeremonialButton>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: BREATH }}
              >
                <p className="font-body italic text-ivory/80">
                  This clears all merit, history and journal entries. Settings remain.
                </p>
                <div className="mt-5 flex justify-center gap-4">
                  <CeremonialButton variant="quiet" onClick={() => setConfirmingReset(false)}>
                    Keep
                  </CeremonialButton>
                  <CeremonialButton
                    onClick={() => {
                      store.resetPractice();
                      setConfirmingReset(false);
                      onReturnToArrival();
                    }}
                  >
                    Reset
                  </CeremonialButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
