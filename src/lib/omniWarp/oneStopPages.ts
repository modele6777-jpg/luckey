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
