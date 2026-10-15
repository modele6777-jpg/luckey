import { APP_VERSION, compareVersions } from './appVersion';

export type ChangelogEntry = {
  version: string;
  summary: string;
  items?: string[];
  builtAt?: string;
};

export const UPDATE_ACK_KEY = 'prism_update_ack_version';

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
  recentCount = 50,
): ChangelogEntry[] {
  const eligible = entries
    .filter((entry) => compareVersions(entry.version, targetVersion) <= 0)
    .sort((a, b) => compareVersions(b.version, a.version));

  if (eligible.length === 0) return [];

  return eligible.slice(0, recentCount);
}