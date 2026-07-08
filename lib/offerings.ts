/**
 * The six offerings, in traditional sequence, with their meanings,
 * manifestation videos, and bell recordings.
 *
 * BELL → RITUAL MOMENT MAPPING (canonical — see CLAUDE.md):
 *   bellSoft       → water (the quietest offering opens the sequence)
 *   bellBright     → flower
 *   bellDeep       → incense
 *   bellDouble     → butter lamp (strike, then the flame catches)
 *   bellLong       → fruit
 *   bellCompletion → golden light + mala completion + dedication
 */

import type { MantraDef, OfferingDef } from '@/types';

export const OFFERINGS: readonly OfferingDef[] = [
  {
    id: 'water',
    name: 'Water',
    meaning: 'Clear as a mind without grasping.',
    videoKey: 'water',
    buttonKey: 'waterButton',
    bellKey: 'bellSoft',
  },
  {
    id: 'flower',
    name: 'Flower',
    meaning: 'Beauty offered, impermanence accepted.',
    videoKey: 'flower',
    bellKey: 'bellBright',
  },
  {
    id: 'incense',
    name: 'Incense',
    meaning: 'Discipline rising as fragrance.',
    videoKey: 'incenseLighting',
    bellKey: 'bellDeep',
  },
  {
    id: 'lamp',
    name: 'Butter Lamp',
    meaning: 'One flame against all darkness.',
    videoKey: 'lampLighting',
    bellKey: 'bellDouble',
  },
  {
    id: 'fruit',
    name: 'Fruit',
    meaning: 'The harvest of generosity.',
    videoKey: 'fruit',
    bellKey: 'bellLong',
  },
  {
    id: 'light',
    name: 'Golden Light',
    meaning: 'May all beings know abundance.',
    videoKey: 'light',
    bellKey: 'bellCompletion',
  },
] as const;

export const MERIT_PER_OFFERING = 7;
export const MERIT_PER_RECITATION = 1;

export const MANTRAS: readonly MantraDef[] = [
  {
    id: 'dzambhala',
    tibetan: 'ཨོཾ་ཛཾ་བྷ་ལ་ཛ་ལེན་དྲ་ཡེ་སྭཱ་ཧཱ།',
    transliteration: 'Om Dzambhala Dzalendraye Svaha',
    meaning: 'Invocation of Yellow Dzambhala — generosity dissolving poverty of body and mind.',
  },
  {
    id: 'mani',
    tibetan: 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།',
    transliteration: 'Om Mani Padme Hum',
    meaning: 'The jewel in the lotus — compassion for all beings.',
  },
] as const;

export const MALA_LENGTHS = [21, 27, 54, 108, 0] as const;

export const malaLengthLabel = (n: number): string =>
  n === 0 ? 'Unlimited' : `${n} beads`;
