import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { getTodayDateKey } from '@/lib/dailyCache';

export type DailyBgmAppId = 'trinity' | 'bluebird' | 'muse' | 'heal' | 'orange';

export type DailyBgmTrack = {
  name: string;
  url: string;
  artist: string;
  trackKey: string;
};

export type DailyBgmInput = {
  appId: DailyBgmAppId;
  focusPlaylist: string;
  frequency?: string;
  cardName?: string;
  symbol?: string;
  dateKey: string;
};

export const dailyFocusPlaylistSchema = z
  .string()
  .describe(
    "사용자의 현재 분위기·영적 상태·집중력 향상을 위해 추천하는 맞춤 사운드스케이프 이름 (예: '528Hz Healing Chime', 'Calm Ocean Meditation', 'Tibetan Singing Bowls')",
  )
  .optional();

const DAILY_BGM_ARTIST_BY_APP: Record<DailyBgmAppId, string> = {
  trinity: '오늘의 트리니티 데일리 추천',
  bluebird: '오늘의 블루버드 데일리 추천',
  muse: '오늘의 뮤즈 데일리 추천',
  heal: '오늘의 힐 데일리 추천',
  orange: '오늘의 오렌지 데일리 추천',
};

export function getDailyBgmArtist(appId: DailyBgmAppId): string {
  return DAILY_BGM_ARTIST_BY_APP[appId];
}

export const DAILY_BGM_ARTIST = DAILY_BGM_ARTIST_BY_APP.trinity;
export const DAILY_BGM_ALGO_VERSION = 2;
export const BGM_EXTRA_TRACKS_STORAGE_KEY = 'prism_bgm_extra_tracks_v1';
export const BGM_HIDDEN_TRACKS_STORAGE_KEY = 'prism_bgm_hidden_tracks_v1';
export const BGM_PURGED_TRACKS_STORAGE_KEY = 'prism_bgm_purged_tracks_v1';

export const BGM_V3_CLEAN_SLATE_KEY = 'prism_bgm_v3_clean_slate_30';

export function purgeAllLegacyBgmTracks(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(BGM_EXTRA_TRACKS_STORAGE_KEY);
    localStorage.removeItem(BGM_HIDDEN_TRACKS_STORAGE_KEY);
    localStorage.removeItem(BGM_PURGED_TRACKS_STORAGE_KEY);
    localStorage.removeItem('prism_bgm_extra_tracks');
    localStorage.setItem(BGM_V3_CLEAN_SLATE_KEY, 'true');
  } catch {
    // ignore
  }
}

export type HiddenBgmTrack = {
  id: string;
  name: string;
  url: string;
  artist?: string;
  trackKey?: string;
};

export function getBgmTrackId(track: { url: string; trackKey?: string }): string {
  return track.trackKey || track.url;
}

function normalizeHiddenBgmTrack(entry: unknown): HiddenBgmTrack | null {
  if (typeof entry === 'string' && entry.length > 0) {
    return {
      id: entry,
      name: entry.startsWith('daily:') ? '데일리 추천 BGM' : entry.replace(/^synth-/, '').replace(/-/g, ' '),
      url: entry.startsWith('daily:') ? toPersistedBgmUrl(entry) : entry,
      trackKey: entry.startsWith('daily:') ? entry : undefined,
    };
  }
  if (!entry || typeof entry !== 'object') return null;
  const row = entry as Partial<HiddenBgmTrack>;
  if (typeof row.id !== 'string' || !row.id) return null;
  return {
    id: row.id,
    name: typeof row.name === 'string' && row.name.trim() ? row.name : row.id,
    url:
      typeof row.url === 'string' && row.url
        ? row.url
        : row.id.startsWith('daily:')
          ? toPersistedBgmUrl(row.id)
          : row.id,
    artist: typeof row.artist === 'string' ? row.artist : undefined,
    trackKey: typeof row.trackKey === 'string' ? row.trackKey : undefined,
  };
}

export function loadHiddenBgmTracks(): HiddenBgmTrack[] {
  if (typeof window === 'undefined') return [];
  try {
    if (localStorage.getItem(BGM_V3_CLEAN_SLATE_KEY) !== 'true') {
      purgeAllLegacyBgmTracks();
      return [];
    }
    const raw = localStorage.getItem(BGM_HIDDEN_TRACKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const tracks: HiddenBgmTrack[] = [];
    for (const entry of parsed) {
      const normalized = normalizeHiddenBgmTrack(entry);
      if (!normalized || seen.has(normalized.id)) continue;
      seen.add(normalized.id);
      tracks.push(normalized);
    }
    return tracks;
  } catch {
    return [];
  }
}

function saveHiddenBgmTracks(tracks: HiddenBgmTrack[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BGM_HIDDEN_TRACKS_STORAGE_KEY, JSON.stringify(tracks));
  } catch {
    // ignore quota errors
  }
}

export function loadHiddenBgmTrackIds(): Set<string> {
  return new Set(loadHiddenBgmTracks().map((track) => track.id));
}

export function hideBgmTrack(track: HiddenBgmTrack): void {
  if (!track.id) return;
  const hidden = loadHiddenBgmTracks();
  if (hidden.some((item) => item.id === track.id)) return;
  hidden.push(track);
  saveHiddenBgmTracks(hidden);
}

export function unhideBgmTrack(trackId: string): void {
  if (!trackId) return;
  saveHiddenBgmTracks(loadHiddenBgmTracks().filter((track) => track.id !== trackId));
}

function loadPurgedBgmTrackIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(BGM_PURGED_TRACKS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => typeof id === 'string' && id.length > 0));
  } catch {
    return new Set();
  }
}

function savePurgedBgmTrackIds(ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BGM_PURGED_TRACKS_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore quota errors
  }
}

export function isBgmTrackPurged(track: { url: string; trackKey?: string }): boolean {
  return loadPurgedBgmTrackIds().has(getBgmTrackId(track));
}

export function purgeBgmTrackId(trackId: string): void {
  if (!trackId) return;
  const purged = loadPurgedBgmTrackIds();
  purged.add(trackId);
  savePurgedBgmTrackIds(purged);
  unhideBgmTrack(trackId);
}

export function restoreBgmTrackAvailability(trackId: string): void {
  if (!trackId) return;
  unhideBgmTrack(trackId);
  const purged = loadPurgedBgmTrackIds();
  if (!purged.has(trackId)) return;
  purged.delete(trackId);
  savePurgedBgmTrackIds(purged);
}

async function deleteDailyBgmRecord(trackKey: string): Promise<void> {
  const cached = blobUrlCache.get(trackKey);
  if (cached) {
    URL.revokeObjectURL(cached);
    blobUrlCache.delete(trackKey);
  }

  try {
    const db = await openDailyBgmDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.delete(trackKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore IDB cleanup failures
  }
}

export async function permanentlyDeleteBgmTrack(track: HiddenBgmTrack): Promise<void> {
  const trackId = track.id || getBgmTrackId(track);
  if (!trackId) return;

  purgeBgmTrackId(trackId);

  const trackKey = track.trackKey || (trackId.startsWith('daily:') ? trackId : undefined);
  if (trackKey?.startsWith('daily:')) {
    removePersistedExtraBgmTrackByKey(trackKey);
    await deleteDailyBgmRecord(trackKey);
  }
}

export function isBgmTrackHidden(track: { url: string; trackKey?: string }): boolean {
  const id = getBgmTrackId(track);
  return loadHiddenBgmTrackIds().has(id) || isBgmTrackPurged(track);
}

export function removePersistedExtraBgmTrackByKey(trackKey: string): void {
  const extras = loadPersistedExtraBgmTracks().filter((track) => track.trackKey !== trackKey);
  savePersistedExtraBgmTracks(extras);
}

const IDB_NAME = 'prism_daily_bgm_v1';
const IDB_STORE = 'tracks';
const IDB_VERSION = 1;

const blobUrlCache = new Map<string, string>();

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function deriveFocusPlaylist(result: {
  focusPlaylist?: string;
  symbol?: string;
  frequency?: string;
  remedy?: string;
}): string {
  if (result.focusPlaylist?.trim()) return result.focusPlaylist.trim();
  const parts = [result.symbol, result.frequency].filter(Boolean);
  if (parts.length > 0) return `${parts.join(' ')} Resonance Soundscape`;
  if (result.remedy?.trim()) return `${result.remedy.slice(0, 48)} Ambient`;
  return 'Daily Resonance Soundscape';
}

export function buildDailyBgmTrackKey(input: {
  appId: DailyBgmAppId;
  focusPlaylist: string;
  dateKey: string;
  cardName?: string;
}): string {
  const slug = slugify(input.focusPlaylist) || 'daily-sound';
  const cardPart = input.cardName ? `:${slugify(input.cardName)}` : '';
  return `daily:${input.appId}:${input.dateKey}:${slug}${cardPart}`;
}

export function toPersistedBgmUrl(trackKey: string): string {
  return `idb:${trackKey}`;
}

export function isPersistedBgmRef(url: string): boolean {
  return url.startsWith('idb:');
}

export function needsBgmUrlResolution(url: string, trackKey?: string): boolean {
  if (!url) return !!trackKey;
  if (isPersistedBgmRef(url)) return true;
  if (
    trackKey?.startsWith('daily:') &&
    !url.startsWith('blob:') &&
    !url.startsWith('http') &&
    !url.startsWith('/')
  ) {
    return true;
  }
  return false;
}

function openDailyBgmDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'trackKey' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
  });
}

type DailyBgmRecord = {
  trackKey: string;
  blob: Blob;
  name: string;
  artist: string;
  savedAt: number;
  algoVersion?: number;
};

async function readDailyBgmRecord(trackKey: string): Promise<DailyBgmRecord | null> {
  try {
    const db = await openDailyBgmDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(trackKey);
      req.onsuccess = () => {
        const row = req.result as DailyBgmRecord | undefined;
        resolve(row?.blob ? row : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function writeDailyBgmRecord(
  trackKey: string,
  blob: Blob,
  meta: { name: string; artist: string },
): Promise<void> {
  const db = await openDailyBgmDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put({
      trackKey,
      blob,
      name: meta.name,
      artist: meta.artist,
      savedAt: Date.now(),
      algoVersion: DAILY_BGM_ALGO_VERSION,
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteDailyBgmRecordByKey(trackKey: string): Promise<void> {
  const cached = blobUrlCache.get(trackKey);
  if (cached) {
    URL.revokeObjectURL(cached);
    blobUrlCache.delete(trackKey);
  }
  await deleteDailyBgmRecord(trackKey);
}

function isCurrentDailyBgmRecord(record: DailyBgmRecord | null): record is DailyBgmRecord {
  return !!record && (record.algoVersion ?? 1) >= DAILY_BGM_ALGO_VERSION;
}

export async function getDailyBgmBlobUrl(trackKey: string): Promise<string | null> {
  const cached = blobUrlCache.get(trackKey);
  if (cached) return cached;

  const record = await readDailyBgmRecord(trackKey);
  if (!isCurrentDailyBgmRecord(record)) return null;

  const blobUrl = URL.createObjectURL(record.blob);
  blobUrlCache.set(trackKey, blobUrl);
  return blobUrl;
}

export async function resolveBgmPlaybackUrl(url: string, trackKey?: string): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('idb:')) {
    return getDailyBgmBlobUrl(url.slice(4));
  }
  if (url.startsWith('blob:') || url.startsWith('http') || url.startsWith('/')) {
    return url;
  }
  if (trackKey) {
    return getDailyBgmBlobUrl(trackKey);
  }
  return null;
}

function base64ToBlob(base64: string, mime = 'audio/wav'): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export async function ensureDailyBgmGenerated(input: DailyBgmInput): Promise<DailyBgmTrack> {
  const name = input.focusPlaylist.trim() || '데일리 추천 사운드';
  const artist = getDailyBgmArtist(input.appId);
  const trackKey = buildDailyBgmTrackKey(input);

  const cachedRecord = await readDailyBgmRecord(trackKey);
  if (cachedRecord && !isCurrentDailyBgmRecord(cachedRecord)) {
    await deleteDailyBgmRecordByKey(trackKey);
  } else {
    const cachedUrl = await getDailyBgmBlobUrl(trackKey);
    if (cachedUrl) {
      return {
        name,
        url: cachedUrl,
        artist,
        trackKey,
      };
    }
  }

  const response = await fetch('/api/ai/daily-bgm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      focusPlaylist: input.focusPlaylist,
      frequency: input.frequency,
      cardName: input.cardName,
      symbol: input.symbol,
      dateKey: input.dateKey,
      trackKey,
    }),
  });

  if (!response.ok) {
    throw new Error(`Daily BGM generation failed (${response.status})`);
  }

  const data = await response.json();
  if (!data?.audioContent) {
    throw new Error('Daily BGM response missing audio');
  }

  const blob = base64ToBlob(data.audioContent, data.encoding === 'wav' ? 'audio/wav' : 'audio/wav');
  await writeDailyBgmRecord(trackKey, blob, { name, artist });

  const blobUrl = URL.createObjectURL(blob);
  blobUrlCache.set(trackKey, blobUrl);

  return {
    name,
    url: blobUrl,
    artist,
    trackKey,
  };
}

export type PersistedBgmTrack = {
  name: string;
  url: string;
  artist?: string;
  trackKey?: string;
};

export function loadPersistedExtraBgmTracks(): PersistedBgmTrack[] {
  if (typeof window === 'undefined') return [];
  try {
    if (localStorage.getItem(BGM_V3_CLEAN_SLATE_KEY) !== 'true') {
      purgeAllLegacyBgmTracks();
      return [];
    }
    const raw = localStorage.getItem(BGM_EXTRA_TRACKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item.name === 'string' && typeof item.url === 'string',
    );
  } catch {
    return [];
  }
}

export function savePersistedExtraBgmTracks(tracks: PersistedBgmTrack[]): void {
  if (typeof window === 'undefined') return;
  try {
    const serializable = tracks.map((track) => ({
      name: track.name,
      artist: track.artist,
      trackKey: track.trackKey,
      url:
        track.trackKey && (track.url.startsWith('blob:') || !track.url.startsWith('idb:'))
          ? toPersistedBgmUrl(track.trackKey)
          : track.url,
    }));
    localStorage.setItem(BGM_EXTRA_TRACKS_STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // ignore quota errors
  }
}

export async function hydratePersistedBgmTracks(
  tracks: PersistedBgmTrack[],
): Promise<PersistedBgmTrack[]> {
  const hydrated: PersistedBgmTrack[] = [];
  for (const track of tracks) {
    if (isPersistedBgmRef(track.url)) {
      const trackKey = track.trackKey || track.url.slice(4);
      const blobUrl = await getDailyBgmBlobUrl(trackKey);
      if (blobUrl) {
        hydrated.push({ ...track, trackKey, url: blobUrl });
      }
      continue;
    }
    if (track.trackKey) {
      const blobUrl = await getDailyBgmBlobUrl(track.trackKey);
      if (blobUrl) {
        hydrated.push({ ...track, url: blobUrl });
        continue;
      }
    }
    hydrated.push(track);
  }
  return hydrated;
}

export function dispatchRegisterDailyBgm(track: DailyBgmTrack): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('register-custom-bgm', {
      detail: { ...track, persist: true, play: false },
    }),
  );
}

export function dispatchPlayDailyBgm(track: DailyBgmTrack): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('unlock-bgm-audio'));
  window.dispatchEvent(
    new CustomEvent('play-custom-bgm', {
      detail: { ...track, persist: true, play: true },
    }),
  );
}

export function buildDailyBgmInputFromResult(
  appId: DailyBgmAppId,
  result: {
    focusPlaylist?: string;
    frequency?: string;
    symbol?: string;
    remedy?: string;
    drawnCard?: { name?: string; nameKo?: string };
    dateKey?: string;
  } | null | undefined,
): DailyBgmInput | null {
  if (!result) return null;
  const focusPlaylist = deriveFocusPlaylist(result);
  return {
    appId,
    focusPlaylist,
    frequency: result.frequency,
    cardName: result.drawnCard?.name || result.drawnCard?.nameKo,
    symbol: result.symbol,
    dateKey: result.dateKey || getTodayDateKey(),
  };
}

export async function resolveDailyResultBgm(
  appId: DailyBgmAppId,
  daily: {
    focusPlaylist?: string;
    focusBgmTrackKey?: string;
    frequency?: string;
    symbol?: string;
    remedy?: string;
    drawnCard?: { name?: string; nameKo?: string };
    dateKey?: string;
  } | null | undefined,
): Promise<DailyBgmTrack | null> {
  const input = buildDailyBgmInputFromResult(appId, daily);
  if (!input) return null;

  if (daily?.focusBgmTrackKey) {
    const cachedUrl = await getDailyBgmBlobUrl(daily.focusBgmTrackKey);
    if (cachedUrl) {
      return {
        name: input.focusPlaylist,
        url: cachedUrl,
        artist: getDailyBgmArtist(appId),
        trackKey: daily.focusBgmTrackKey,
      };
    }
  }

  return ensureDailyBgmGenerated(input);
}

export function useDailyBgm(
  appId: DailyBgmAppId,
  dailyResult: {
    focusPlaylist?: string;
    focusBgmTrackKey?: string;
    focusBgmUrl?: string;
    frequency?: string;
    symbol?: string;
    remedy?: string;
    drawnCard?: { name?: string; nameKo?: string };
    dateKey?: string;
  } | null | undefined,
  options?: {
    persistResult?: (next: Record<string, unknown>) => void;
  },
) {
  const [loading, setLoading] = useState(false);
  const genRef = useRef<string | null>(null);

  const generateAndRegister = useCallback(
    async (result: NonNullable<typeof dailyResult>) => {
      const input = buildDailyBgmInputFromResult(appId, result);
      if (!input) return;

      const seed = `${input.appId}:${input.dateKey}:${input.focusPlaylist}:${input.cardName || ''}`;
      if (genRef.current === seed) return;
      genRef.current = seed;
      setLoading(true);

      try {
        const track = await ensureDailyBgmGenerated(input);
        const patch = {
          focusBgmTrackKey: track.trackKey,
          focusBgmUrl: toPersistedBgmUrl(track.trackKey),
          focusBgmReady: true,
          focusPlaylist: input.focusPlaylist,
          dateKey: input.dateKey,
        };
        options?.persistResult?.(patch);
        dispatchRegisterDailyBgm(track);
      } catch (err) {
        console.warn(`[daily-bgm:${appId}] generation failed:`, err);
        genRef.current = null;
      } finally {
        setLoading(false);
      }
    },
    [appId, options],
  );

  useEffect(() => {
    if (!dailyResult) return;
    void generateAndRegister(dailyResult);
  }, [
    dailyResult?.focusPlaylist,
    dailyResult?.frequency,
    dailyResult?.symbol,
    dailyResult?.remedy,
    dailyResult?.drawnCard?.name,
    dailyResult?.drawnCard?.nameKo,
    dailyResult?.dateKey,
    generateAndRegister,
  ]);

  const playDailyBgm = useCallback(async () => {
    if (!dailyResult) return;
    setLoading(true);
    try {
      const track = await resolveDailyResultBgm(appId, dailyResult);
      if (track) dispatchPlayDailyBgm(track);
    } catch (err) {
      console.warn(`[daily-bgm:${appId}] play failed:`, err);
    } finally {
      setLoading(false);
    }
  }, [appId, dailyResult]);

  return {
    loading,
    playDailyBgm,
    focusPlaylist: dailyResult ? deriveFocusPlaylist(dailyResult) : '',
  };
}