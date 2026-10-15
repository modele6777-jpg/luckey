export type PrismDeviceType = 'desktop' | 'mobile' | 'tablet';

export type ClientAppVersions = Partial<Record<PrismDeviceType, string>>;

declare const __APP_VERSION__: string;

export const APP_VERSION =
  typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';

export function getDeviceType(): PrismDeviceType {
  const width = window.innerWidth;
  const ua = navigator.userAgent || '';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (width >= 768 && width < 1024 && /Android/i.test(ua))) {
    return 'tablet';
  }
  if (width < 768 || /Mobi|Android|iPhone|iPod/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function compareVersions(a: string, b: string): number {
  const parse = (value: string) =>
    value
      .trim()
      .replace(/^v/i, '')
      .split('.')
      .map((part) => Number.parseInt(part, 10) || 0);

  const left = parse(a);
  const right = parse(b);
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i += 1) {
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function pickNewestVersion(...versions: Array<string | undefined | null>): string | undefined {
  return versions.reduce<string | undefined>((best, current) => {
    if (!current) return best;
    if (!best || compareVersions(current, best) > 0) return current;
    return best;
  }, undefined);
}

export async function fetchDeployedAppVersion(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(`/version.json?ts=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const data = await response.json() as { version?: string };
    return data.version?.trim() || null;
  } catch {
    return null;
  }
}

export function formatDeviceLabel(device: PrismDeviceType): string {
  if (device === 'mobile') return '모바일';
  if (device === 'tablet') return '태블릿';
  return 'PC';
}