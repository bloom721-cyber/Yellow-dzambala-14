'use client';

/**
 * The single stateful heart of the application.
 * Loads persisted state after mount (hydration-safe), saves on change,
 * and exposes ritual actions.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PersistedState, PracticeSession, Settings } from '@/types';
import {
  addJournalEntry,
  emptyState,
  loadState,
  recordPractice,
  saveState,
  updateSettings,
} from '@/lib/state';
import { setAudioEnabled, setAmbientEnabled } from '@/lib/audio';
import { setHapticsEnabled } from '@/lib/haptics';

export function useShrineState() {
  const [state, setState] = useState<PersistedState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
    setAudioEnabled(state.settings.audio);
    setAmbientEnabled(state.settings.ambient);
    setHapticsEnabled(state.settings.haptics);
  }, [state, hydrated]);

  const practice = useCallback((session: Omit<PracticeSession, 'at'>) => {
    setState((s) => recordPractice(s, session));
  }, []);

  const journal = useCallback((text: string) => {
    setState((s) => addJournalEntry(s, text));
  }, []);

  const patchSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => updateSettings(s, patch));
  }, []);

  const resetPractice = useCallback(() => {
    setState((s) => ({
      ...emptyState(),
      settings: s.settings,
    }));
  }, []);

  return { state, hydrated, practice, journal, patchSettings, resetPractice };
}

export type ShrineStore = ReturnType<typeof useShrineState>;
