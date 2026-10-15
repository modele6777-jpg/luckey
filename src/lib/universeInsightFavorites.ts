import { useState, useEffect, useCallback, useMemo } from 'react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { UNIVERSE_INSIGHTS, type UniverseInsightItem } from '@/data/universeInsights';

export const FAVORITES_STORAGE_KEY = 'prism_universe_insight_favorites';
export const FAVORITES_EVENT_NAME = 'universe-insight-favorites-updated';

/**
 * Retrieves the list of favorited insight IDs from local storage.
 */
export function getFavoriteInsightIds(): string[] {
  try {
    const raw = safeLocalStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Checks if a specific insight ID is in favorites.
 */
export function isInsightFavorite(id: string): boolean {
  if (!id) return false;
  const list = getFavoriteInsightIds();
  return list.includes(id);
}

/**
 * Saves favorited insight IDs to local storage, dispatches event, and optionally triggers cloud sync.
 */
export function saveFavoriteInsightIds(
  ids: string[],
  updateCloud?: (ids: string[]) => void
): void {
  try {
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    safeLocalStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(uniqueIds));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT_NAME, { detail: uniqueIds }));
    }
    if (updateCloud) {
      updateCloud(uniqueIds);
    }
  } catch (e) {
    console.warn('[universeInsightFavorites] Failed to save favorites:', e);
  }
}

/**
 * Toggles a favorite status for a given insight ID.
 * Returns the new favorited boolean status (true = added, false = removed).
 */
export function toggleInsightFavorite(
  id: string,
  updateCloud?: (ids: string[]) => void,
  currentList?: string[]
): boolean {
  if (!id) return false;
  const current = Array.isArray(currentList) ? currentList : getFavoriteInsightIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  saveFavoriteInsightIds(next, updateCloud);
  return !exists;
}

/**
 * Retrieves the full UniverseInsightItem array for all favorited IDs.
 */
export function getFavoriteInsights(favoriteIds?: string[]): UniverseInsightItem[] {
  const ids = new Set(favoriteIds || getFavoriteInsightIds());
  return UNIVERSE_INSIGHTS.filter((item) => ids.has(item.id));
}

/**
 * Custom React Hook for real-time, cross-component favorite tracking.
 */
export function useUniverseInsightFavorites(
  cloudIds?: string[],
  onUpdateCloud?: (ids: string[]) => void
) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (Array.isArray(cloudIds)) {
      return cloudIds;
    }
    return getFavoriteInsightIds();
  });

  // Sync when cloudIds prop updates
  useEffect(() => {
    if (Array.isArray(cloudIds)) {
      setFavoriteIds(cloudIds);
      const local = getFavoriteInsightIds();
      if (JSON.stringify(local) !== JSON.stringify(cloudIds)) {
        try {
          safeLocalStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(cloudIds));
        } catch (_) {}
      }
    }
  }, [cloudIds]);

  // Listen to custom dispatch events from other components/tabs
  useEffect(() => {
    const handleUpdate = (e: CustomEvent<string[]>) => {
      if (Array.isArray(e.detail)) {
        setFavoriteIds(e.detail);
      } else {
        setFavoriteIds(getFavoriteInsightIds());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY) {
        setFavoriteIds(getFavoriteInsightIds());
      }
    };

    window.addEventListener(FAVORITES_EVENT_NAME as any, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(FAVORITES_EVENT_NAME as any, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const isNowFav = toggleInsightFavorite(id, onUpdateCloud, favoriteIds);
      return isNowFav;
    },
    [onUpdateCloud, favoriteIds]
  );

  const isFav = useCallback(
    (id: string) => {
      return favoriteIds.includes(id);
    },
    [favoriteIds]
  );

  const favoriteInsights = useMemo(() => {
    const idSet = new Set(favoriteIds);
    return UNIVERSE_INSIGHTS.filter((item) => idSet.has(item.id));
  }, [favoriteIds]);

  return {
    favoriteIds,
    favoriteCount: favoriteIds.length,
    favoriteInsights,
    isFavorite: isFav,
    toggleFavorite: toggle,
  };
}
