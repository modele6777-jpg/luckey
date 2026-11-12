/** URL-addressable tabs supported by the current page components, default first. */
export const ONE_STOP_PAGE_TABS: Record<string, readonly [string, string][]> = {
  '/trinity': [['destiny', '사주 운명'], ['tarot', '타로'], ['oracle', '오라클'], ['synergy', '트리니티 시너지']],
  '/orange': [['secret', '오렌지 마음 성찰'], ['wishingWell', '소원 우물'], ['synergy', '오렌지 시너지']],
  '/heal': [['meditation', '아우라 명상'], ['oneMinute', '1분 웰니스'], ['synergy', '아우라 시너지'], ['mission', '아우라 미션']],
  '/bluebird': [['daily', '파랑새 데일리'], ['secretMessage', '비밀 메시지'], ['synergy', '파랑새 시너지']],
  '/muse': [['artRecommendation', '뮤즈 예술 추천'], ['roleModel', '롤모델'], ['synergy', '뮤즈 시너지']],
  '/epilogue': [['diary', '에필로그 일기'], ['profile', '내 프로필'], ['synergy', '에필로그 시너지']],
  '/prologue': [['universe', '프롤로그'], ['ecpr', '마음처방'], ['todo', '투두']],
};

const LUCKEY_CHANNEL_ORDER = ['/prologue', '/orange', '/trinity', '/heal', '/bluebird', '/muse', '/epilogue'];

const HORIZONTAL_PAGE_ALIASES: Record<string, string> = {
  // Aura mission is a sheet inside the one-minute view, not one of its swipe tabs.
  '/heal?tab=mission': '/heal?tab=oneMinute',
};

function getOrderedChannelPageKeys(channelPath: string): string[] {
  const tabs = [...(ONE_STOP_PAGE_TABS[channelPath] || [])];
  if (channelPath === '/epilogue') {
    tabs.sort(([a], [b]) => Number(a === 'profile') - Number(b === 'profile'));
  }
  return tabs.map(([tab]) => normalizeOneStopPage(channelPath + '?tab=' + encodeURIComponent(tab)));
}

function getOrderedHorizontalChannelPageKeys(channelPath: string): string[] {
  return getOrderedChannelPageKeys(channelPath).filter((page) =>
    !(channelPath === '/heal' && page === '/heal?tab=mission')
  );
}

export function normalizeOneStopPage(canonical: string): string {
  const url = new URL(canonical, 'https://luckey.local');
  let tab = url.searchParams.get('tab') || '';
  if (url.pathname === '/trinity') {
    tab = ({ daily: 'destiny', fusion: 'oracle', wealth: 'tarot', relationship: 'tarot' } as Record<string, string>)[tab] || tab;
  }
  if (url.pathname === '/epilogue' && tab === 'profile') return '/profile';
  if (url.pathname === '/epilogue' && tab === 'synergy') return '/chronicle';
  if (url.pathname === '/prologue' && tab === 'ecpr') return '/ecpr';
  if (url.pathname === '/prologue' && tab === 'todo') return '/todo';
  const tabs = ONE_STOP_PAGE_TABS[url.pathname];
  if (!tabs || !tabs.some(([id]) => id === tab) || tab === tabs[0][0]) return url.pathname;
  return url.pathname + '?tab=' + encodeURIComponent(tab);
}

/** Explicit defaults prevent a previously selected tab in sessionStorage reopening the wrong screen. */
export function oneStopNavigationPath(page: string): string {
  const url = new URL(page, 'https://luckey.local');
  const defaultTab = ONE_STOP_PAGE_TABS[url.pathname]?.[0]?.[0];
  return !url.search && defaultTab ? page + '?tab=' + defaultTab : page;
}

export function getLuckeyPageKeys(): string[] {
  return [...new Set(Object.entries(ONE_STOP_PAGE_TABS).flatMap(([path, tabs]) =>
    tabs.map(([tab]) => normalizeOneStopPage(path + '?tab=' + encodeURIComponent(tab)))
  ))];
}

/** Flattened app/tab order for catalogs and completeness checks; horizontal navigation uses per-app pages. */
export function getOrderedLuckeyPageKeys(): string[] {
  return LUCKEY_CHANNEL_ORDER.flatMap(getOrderedChannelPageKeys);
}

/** Returns only the internal pages belonging to the current top-level app. */
export function getOrderedLuckeyPageKeysForCurrentApp(current: string): string[] {
  const normalizedPage = normalizeOneStopPage(current || '/');
  const currentPage = HORIZONTAL_PAGE_ALIASES[normalizedPage] || normalizedPage;
  for (const channelPath of LUCKEY_CHANNEL_ORDER) {
    const pages = getOrderedHorizontalChannelPageKeys(channelPath);
    if (pages.includes(currentPage)) return pages;
  }
  return [];
}

function moveWithinCurrentApp(current: string, offset: -1 | 1): string {
  const normalizedPage = normalizeOneStopPage(current || '/');
  const currentPage = HORIZONTAL_PAGE_ALIASES[normalizedPage] || normalizedPage;
  const pages = getOrderedLuckeyPageKeysForCurrentApp(currentPage);
  const index = pages.indexOf(currentPage);
  if (index < 0) return oneStopNavigationPath(currentPage);
  return oneStopNavigationPath(pages[(index + offset + pages.length) % pages.length]);
}

/** Horizontal right movement wraps inside the current app and never switches apps. */
export function nextOrderedLuckeyPage(current: string): string {
  return moveWithinCurrentApp(current, 1);
}

/** Horizontal left movement wraps inside the current app and never switches apps. */
export function previousOrderedLuckeyPage(current: string): string {
  return moveWithinCurrentApp(current, -1);
}
