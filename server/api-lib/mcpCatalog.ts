import { getAllTarotSpreads } from '../../src/lib/trinity/utils.ts';

export const TAROT_THEME_IDS = [
  'binary_choice', 'yes_no', 'daily', 'super_money', 'lucky', 'angel', 'healing',
  'fortune_boost', 'new_year', 'saju', 'love', 'career', 'money', 'timing',
  'obstacle', 'celtic_cross', 'general',
] as const;

export function listTarotSpreads() {
  return getAllTarotSpreads().map((spread) => ({
    id: spread.id,
    name: spread.name,
    theme: spread.theme,
    cardCount: spread.cardCount,
    positions: spread.positions,
    reason: spread.reason,
  }));
}
