import { APP_VERSION, compareVersions } from './appVersion';

export type ChangelogEntry = {
  version: string;
  summary: string;
  items?: string[];
  builtAt?: string;
};

export const REFRESH_NOTICE_KEY = 'prism_refresh_update_notice';

export const UPDATE_ACK_KEY = 'prism_update_ack_version';

/** Survives the iOS standalone reload that drops sessionStorage. */
export const PENDING_UPDATE_NOTICE_KEY = 'prism_pending_update_notice';

function writeNoticeFlag(storage: Storage | null | undefined): void {
  try {
    storage?.setItem(REFRESH_NOTICE_KEY, '1');
    storage?.setItem(PENDING_UPDATE_NOTICE_KEY, '1');
  } catch {
    // Private mode can reject storage. The other store may still work.
  }
}

/** Ask the next page load to show the changelog, even if this document reloads twice. */
export function markPendingUpdateNotice(): void {
  if (typeof window === 'undefined') return;
  writeNoticeFlag(window.sessionStorage);
  writeNoticeFlag(window.localStorage);
}

export function hasPendingUpdateNotice(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(REFRESH_NOTICE_KEY) === '1'
      || window.sessionStorage.getItem(PENDING_UPDATE_NOTICE_KEY) === '1'
      || window.localStorage.getItem(REFRESH_NOTICE_KEY) === '1'
      || window.localStorage.getItem(PENDING_UPDATE_NOTICE_KEY) === '1';
  } catch {
    return false;
  }
}

export function clearPendingUpdateNotice(): void {
  if (typeof window === 'undefined') return;
  for (const storage of [window.sessionStorage, window.localStorage]) {
    try {
      storage.removeItem(REFRESH_NOTICE_KEY);
      storage.removeItem(PENDING_UPDATE_NOTICE_KEY);
    } catch {
      // The dialog can still close if storage is blocked.
    }
  }
}

export async function fetchChangelog(): Promise<ChangelogEntry[]> {
  try {
    const response = await fetch(`/changelog.json?ts=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((entry): entry is ChangelogEntry => {
        return Boolean(entry?.version && entry?.summary);
      })
      .map((entry) => ({
        version: String(entry.version).trim(),
        summary: String(entry.summary).trim(),
        items: Array.isArray(entry.items)
          ? entry.items.map((item: unknown) => String(item).trim()).filter(Boolean)
          : undefined,
        builtAt: entry.builtAt,
      }));
  } catch {
    return [];
  }
}

export function getUnseenChangelogEntries(
  entries: ChangelogEntry[],
  currentVersion: string = APP_VERSION,
  ackVersion?: string | null,
): ChangelogEntry[] {
  if (!ackVersion) return [];

  return entries
    .filter((entry) => {
      return (
        compareVersions(entry.version, ackVersion) > 0
        && compareVersions(entry.version, currentVersion) <= 0
      );
    })
    .sort((a, b) => compareVersions(a.version, b.version));
}

export function getManualSyncChangelogEntries(
  entries: ChangelogEntry[],
  targetVersion: string = APP_VERSION,
  recentCount = 12,
): ChangelogEntry[] {
  const eligible = entries
    .filter((entry) => compareVersions(entry.version, targetVersion) <= 0)
    .sort((a, b) => compareVersions(b.version, a.version));

  if (eligible.length === 0) return [];

  return eligible.slice(0, recentCount);
}