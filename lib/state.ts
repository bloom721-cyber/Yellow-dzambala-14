/**
 * Persistence — practice history, merit, journal, settings.
 * localStorage only; safe on the server (all reads are guarded),
 * safe under Capacitor.
 */

import type {
  JournalEntry,
  PersistedState,
  PracticeSession,
  Settings,
} from '@/types';

const KEY = 'dzambhala-shrine-v3';

export const defaultSettings: Settings = {
  audio: true,
  ambient: true,
  haptics: true,
  reduceMotion: false,
  malaLength: 108,
  mantraId: 'dzambhala',
};

const todayLocal = (): string => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const yesterdayLocal = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const emptyState = (): PersistedState => ({
  version: 3,
  lifetimeMerit: 0,
  todayMerit: 0,
  todayDate: todayLocal(),
  continuityDays: 0,
  lastPracticeDate: '',
  sessions: [],
  journal: [],
  settings: { ...defaultSettings },
});

export function loadState(): PersistedState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed.version !== 3) return emptyState();
    // Roll the daily counter at local midnight.
    if (parsed.todayDate !== todayLocal()) {
      parsed.todayDate = todayLocal();
      parsed.todayMerit = 0;
    }
    parsed.settings = { ...defaultSettings, ...parsed.settings };
    return parsed;
  } catch {
    return emptyState();
  }
}

export function saveState(state: PersistedState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — practice continues regardless */
  }
}

/** Record a completed practice and accrue merit. Returns the new state. */
export function recordPractice(
  state: PersistedState,
  session: Omit<PracticeSession, 'at'>,
): PersistedState {
  const today = todayLocal();
  const next: PersistedState = {
    ...state,
    sessions: [...state.sessions, { ...session, at: new Date().toISOString() }].slice(-500),
    lifetimeMerit: state.lifetimeMerit + session.merit,
    todayMerit:
      (state.todayDate === today ? state.todayMerit : 0) + session.merit,
    todayDate: today,
  };
  // Continuity of practice — quiet bookkeeping, never gamified in the UI.
  if (state.lastPracticeDate !== today) {
    next.continuityDays =
      state.lastPracticeDate === yesterdayLocal()
        ? state.continuityDays + 1
        : 1;
    next.lastPracticeDate = today;
  }
  return next;
}

export function addJournalEntry(
  state: PersistedState,
  text: string,
): PersistedState {
  const entry: JournalEntry = { at: new Date().toISOString(), text };
  return { ...state, journal: [entry, ...state.journal].slice(0, 300) };
}

export function updateSettings(
  state: PersistedState,
  patch: Partial<Settings>,
): PersistedState {
  return { ...state, settings: { ...state.settings, ...patch } };
}
