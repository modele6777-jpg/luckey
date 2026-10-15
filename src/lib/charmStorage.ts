import { getTodayDateKey } from '@/lib/dailyCache';

export const PRISM_TALISMAN_CHEST_KEY = 'prism_talisman_chest_v4';
export const PRISM_EQUIPPED_CHARM_KEY = 'prism_equipped_charm';

export type SavedTalisman = {
  id: string;
  name: string;
  wishText: string;
  element: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  styleName: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  buffText: string;
  dataUrl: string;
  timestamp: number;
};

export function isCharmFromToday(charm: Pick<SavedTalisman, 'timestamp'> | null | undefined): boolean {
  if (!charm?.timestamp) return false;
  return new Date(charm.timestamp).toLocaleDateString('sv') === getTodayDateKey();
}

export function findTodayCharm(chest: SavedTalisman[]): SavedTalisman | null {
  const today = getTodayDateKey();
  return (
    chest.find((charm) => new Date(charm.timestamp).toLocaleDateString('sv') === today) ?? null
  );
}

export function loadTalismanChest(): SavedTalisman[] {
  try {
    const saved = localStorage.getItem(PRISM_TALISMAN_CHEST_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readEquippedCharm(): SavedTalisman | null {
  try {
    const raw = localStorage.getItem(PRISM_EQUIPPED_CHARM_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedTalisman;
  } catch {
    return null;
  }
}

/** 오늘 만든 부적만 장착 유효. 그 외(전날 장착 등)는 저장소에서 제거 */
export function resolveEquippedCharm(
  chest: SavedTalisman[],
): { equipped: SavedTalisman | null; todayCharm: SavedTalisman | null; hasDrawnToday: boolean } {
  const todayCharm = findTodayCharm(chest);
  const stored = readEquippedCharm();

  if (!todayCharm) {
    if (stored) {
      localStorage.removeItem(PRISM_EQUIPPED_CHARM_KEY);
    }
    return { equipped: null, todayCharm: null, hasDrawnToday: false };
  }

  if (stored && isCharmFromToday(stored) && stored.id === todayCharm.id) {
    return { equipped: stored, todayCharm, hasDrawnToday: true };
  }

  if (stored) {
    localStorage.removeItem(PRISM_EQUIPPED_CHARM_KEY);
  }

  return { equipped: null, todayCharm, hasDrawnToday: true };
}

export function persistEquippedCharm(charm: SavedTalisman | null): void {
  if (!charm) {
    localStorage.removeItem(PRISM_EQUIPPED_CHARM_KEY);
    return;
  }
  localStorage.setItem(PRISM_EQUIPPED_CHARM_KEY, JSON.stringify(charm));
}

export function notifyCharmChanged(): void {
  window.dispatchEvent(new Event('prism_charm_changed'));
  window.dispatchEvent(new CustomEvent('equipped-charm-updated'));
}