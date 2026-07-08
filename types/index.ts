/**
 * Core types — Yellow Dzambhala Shrine.
 * The ritual is a linear journey; the tray is a shortcut mode.
 */

/** Top-level views reachable from the sanctuary. */
export type ShrineView =
  | 'arrival'          // cinematic approach — mountains, mist, distant temple
  | 'doors'            // temple doors, waiting to be opened
  | 'shrine'           // the sanctuary — always the visual hero
  | 'mala'             // mala practice
  | 'journal'          // merit journal
  | 'history'          // practice history
  | 'settings';

/** The six offerings, in traditional sequence. */
export type OfferingId =
  | 'water'
  | 'flower'
  | 'incense'
  | 'lamp'
  | 'fruit'
  | 'light';

export type BellKey =
  | 'bellSoft'
  | 'bellBright'
  | 'bellDeep'
  | 'bellDouble'
  | 'bellLong'
  | 'bellCompletion';

export type OfferingVideoKey =
  | 'water'
  | 'flower'
  | 'incenseLighting'
  | 'lampLighting'
  | 'fruit'
  | 'light';

export interface OfferingDef {
  id: OfferingId;
  /** Ceremonial name shown in Cinzel. */
  name: string;
  /** One quiet line of meaning, shown in Cormorant italic. */
  meaning: string;
  /** Semantic key into assets.offerings for the manifestation video. */
  videoKey: OfferingVideoKey;
  /** Semantic key for the tray button sprite, if a sprite exists. */
  buttonKey?: 'waterButton';
  /** Which bell recording accompanies this offering. */
  bellKey: BellKey;
}

/** Phases inside a single offering sequence. */
export type OfferingPhase =
  | 'idle'
  | 'shimmer'        // touch acknowledged — gold shimmer on the button
  | 'manifestation'  // offering video plays over the shrine
  | 'halo'           // the halo answers
  | 'settle';        // return to stillness

export type MalaLength = 21 | 27 | 54 | 108 | 0; // 0 = unlimited

export interface MantraDef {
  id: string;
  tibetan: string;
  transliteration: string;
  meaning: string;
}

export interface PracticeSession {
  /** ISO date-time the session completed. */
  at: string;
  kind: 'offering' | 'mala' | 'dedication';
  /** Offering id, or mantra id for mala sessions. */
  detail: string;
  /** Recitations counted (mala) or 1 (offering). */
  count: number;
  merit: number;
}

export interface JournalEntry {
  at: string;
  /** The practitioner's dedication, in their own words. */
  text: string;
}

export interface Settings {
  audio: boolean;
  ambient: boolean;
  haptics: boolean;
  reduceMotion: boolean;
  malaLength: MalaLength;
  mantraId: string;
}

export interface PersistedState {
  version: 3;
  lifetimeMerit: number;
  /** Merit accrued today (resets at local midnight). */
  todayMerit: number;
  todayDate: string; // YYYY-MM-DD, local
  /** Consecutive days with at least one completed practice.
   *  Stored as continuity of practice — surfaced only as quiet prose,
   *  never as a gamified streak (see CLAUDE.md, hard prohibitions). */
  continuityDays: number;
  lastPracticeDate: string; // YYYY-MM-DD, local
  sessions: PracticeSession[];
  journal: JournalEntry[];
  settings: Settings;
}
