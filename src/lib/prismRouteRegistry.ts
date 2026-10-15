/**
 * Prism Route & Feature Dynamic Registry (단일 진실 공급원)
 * - 현재 실존하는 모든 페이지와 기능들의 통합 레지스트리
 * - 사라진 페이지나 기능의 접근을 원천 차단(Sanitization & Route Guard)
 * - 앞으로 새 페이지나 기능이 추가될 때 자동/동적으로 빅뱅 버튼 및 옴니워프 경로에 즉각 반영
 */

export interface PrismRouteDefinition {
  id: string;
  name: string;
  subName: string;
  path: string; // 정식 표준 경로 (예: '/chat', '/orb', '/profile')
  aliases?: string[]; // 별칭 및 호환 경로 (예: ['/lucy'], ['/gateway', '/crystal'])
  icon: string;
  runeSymbol: string;
  runeName: string;
  runeMeaning: string;
  description: string;
  themeColor: string;
  accentGlow: string;
  isActive: boolean; // 활성 상태 여부 (사라지거나 폐기된 기능은 false 처리하여 원천 차단)
  category?: 'hub' | 'channel' | 'standalone' | 'profile' | 'archive';
}

/**
 * 프리즘에 현재 실존하는 모든 정식 페이지 및 기능 목록 (초기 시드)
 */
export const INITIAL_PRISM_ROUTES: PrismRouteDefinition[] = [
  {
    id: 'hub',
    name: '프롤로그 허브',
    subName: '프리즘 우주의 중심',
    path: '/',
    aliases: ['/universe', '/ecpr', '/todo', '/mission', '/synergy', '/aegis'],
    icon: '🌌',
    runeSymbol: 'ᚠ',
    runeName: 'Fehu',
    runeMeaning: '새로운 시작과 운명의 창조',
    description: '모든 차원의 영감과 가능성이 수렴하는 우주의 시초 허브',
    themeColor: '#00f0ff',
    accentGlow: 'rgba(0, 240, 255, 0.9)',
    isActive: true,
    category: 'hub',
  },
  {
    id: 'lucy',
    name: '루시 심층 대화',
    subName: '영혼의 가이드와 1:1 대화',
    path: '/chat',
    aliases: ['/lucy'],
    icon: '✨',
    runeSymbol: 'ᛞ',
    runeName: 'Dagaz',
    runeMeaning: '새벽의 빛과 자각',
    description: '영혼의 가이드 루시와의 1:1 심층 대화 및 지혜의 조언',
    themeColor: '#c084fc',
    accentGlow: 'rgba(192, 132, 252, 0.9)',
    isActive: true,
    category: 'standalone',
  },
  {
    id: 'key',
    name: 'Key',
    subName: '40대 불안 치유 마음약방',
    path: '/key',
    aliases: ['/calm', '/pharmacy', '/orb', '/gateway', '/crystal'],
    icon: '🔑',
    runeSymbol: 'ᚲ',
    runeName: 'Kenaz',
    runeMeaning: '치유의 등불과 해법의 열쇠',
    description: '《왜 나는 불안할까》 도서 기반 40가지 체화 연습과 Dr. Z 3단계 평화 처방 마음약방',
    themeColor: '#0ea5e9',
    accentGlow: 'rgba(14, 165, 233, 0.9)',
    isActive: true,
    category: 'standalone',
  },
  {
    id: 'trinity',
    name: '트리니티 오라클',
    subName: '사주·점성술·타로 운명 나침반',
    path: '/trinity',
    aliases: ['/oracle'],
    icon: '🔮',
    runeSymbol: 'ᛈ',
    runeName: 'Pertho',
    runeMeaning: '운명과 무의식 비의',
    description: '3장의 타로 카드와 사주 데이터로 무의식의 상징과 운명 메시지 도출',
    themeColor: '#c084fc',
    accentGlow: 'rgba(192, 132, 252, 0.9)',
    isActive: true,
    category: 'channel',
  },
  {
    id: 'orange',
    name: '오렌지 성찰 & 별에게 소원빌기',
    subName: '감정 성찰과 별에게 소원빌기',
    path: '/orange',
    icon: '🍊',
    runeSymbol: 'ᛋ',
    runeName: 'Sowilo',
    runeMeaning: '태양과 내면의 빛',
    description: '불안과 감정을 성찰하고 밤하늘 별에게 소망을 띄우는 비밀의 숲',
    themeColor: '#fb923c',
    accentGlow: 'rgba(251, 146, 60, 0.9)',
    isActive: true,
    category: 'channel',
  },
  {
    id: 'heal',
    name: '아우라 신체 웰니스',
    subName: '호오포노포노 & 생체 에너지 정화',
    path: '/heal',
    aliases: ['/aura', '/hoponopono', '/lettinggo'],
    icon: '🌊',
    runeSymbol: 'ᛉ',
    runeName: 'Algiz',
    runeMeaning: '보호와 에너지 조율',
    description: '호흡과 스트레칭, 4마디 호오포노포노 감정 정화로 생체 리듬 회복',
    themeColor: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.9)',
    isActive: true,
    category: 'channel',
  },
  {
    id: 'bluebird',
    name: '파랑새의 성소',
    subName: '영혼의 상처 치유와 행복',
    path: '/bluebird',
    icon: '🐦',
    runeSymbol: 'ᛒ',
    runeName: 'Berkana',
    runeMeaning: '일상의 감사와 치유',
    description: '지친 마음에 일상의 평온과 행복, 따뜻한 감사의 온기를 되찾는 안식처',
    themeColor: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.9)',
    isActive: true,
    category: 'channel',
  },
  {
    id: 'muse',
    name: '뮤즈 예술처방',
    subName: '명화·명시·명곡 삼위일체',
    path: '/muse',
    icon: '🎨',
    runeSymbol: 'ᚹ',
    runeName: 'Wunjo',
    runeMeaning: '기쁨과 예술적 공명',
    description: '고민과 감정에 공명하는 세계적 명작 3위 일체 큐레이션',
    themeColor: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.9)',
    isActive: true,
    category: 'channel',
  },
  {
    id: 'epilogue',
    name: '에필로그 밤 서재',
    subName: '영감의 밤 서재 일기',
    path: '/epilogue',
    icon: '📖',
    runeSymbol: 'ᚨ',
    runeName: 'Ansuz',
    runeMeaning: '영감과 하루 마감',
    description: '오늘의 영감과 감정을 한 편의 수필처럼 정리하는 회고',
    themeColor: '#34d399',
    accentGlow: 'rgba(52, 211, 153, 0.9)',
    isActive: true,
    category: 'channel',
  },
  {
    id: 'chronicle',
    name: '소울 크로니클 연대기',
    subName: '하루 영혼 연대기 & 골든 스탬프',
    path: '/chronicle',
    aliases: ['/synergy'],
    icon: '✨',
    runeSymbol: 'ᛋ',
    runeName: 'Sowilo',
    runeMeaning: '영혼의 결실과 연대기 봉인',
    description: '하루의 온전한 영혼 정렬 통찰과 황금 인장을 아카이빙하는 크로니클 댑',
    themeColor: '#c084fc',
    accentGlow: 'rgba(192, 132, 252, 0.9)',
    isActive: true,
    category: 'channel',
  },
  {
    id: 'profile',
    name: '영혼 프로필 & 여정',
    subName: '내면 성향과 발자취 아카이브',
    path: '/profile',
    icon: '👤',
    runeSymbol: 'ᚠ',
    runeName: 'Fehu',
    runeMeaning: '영혼의 성장과 자산',
    description: '나의 사주 성향, 여정 데이터와 영혼의 성장 발자취를 기록하는 프로필',
    themeColor: '#a78bfa',
    accentGlow: 'rgba(167, 139, 250, 0.9)',
    isActive: true,
    category: 'profile',
  },
  {
    id: 'handbook',
    name: '지혜의 핸드북',
    subName: '영혼의 안내서 & 바이블',
    path: '/handbook',
    aliases: ['/rebible'],
    icon: '🧭',
    runeSymbol: 'ᚱ',
    runeName: 'Raidho',
    runeMeaning: '영혼의 여정과 바이블',
    description: '삶의 방향과 지혜가 담긴 프리즘 영혼의 핸드북 가이드',
    themeColor: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.9)',
    isActive: true,
    category: 'standalone',
  },
  {
    id: 'library',
    name: '영혼의 도서관',
    subName: '프리즘 지식 아카이브',
    path: '/library',
    icon: '🏛️',
    runeSymbol: 'ᛗ',
    runeName: 'Mannaz',
    runeMeaning: '인간과 영혼의 지식',
    description: '모든 기록과 사유가 축적된 영혼의 도서관 아카이브',
    themeColor: '#6366f1',
    accentGlow: 'rgba(99, 102, 241, 0.9)',
    isActive: false,
    category: 'archive',
  },
  {
    id: 'omniwarp',
    name: '옴니워프 유니버스 포털',
    subName: '시공간 초월 빅뱅 차원 도약',
    path: '/omniwarp',
    aliases: ['/bigbang'],
    icon: '🌀',
    runeSymbol: 'ᛟ',
    runeName: 'Othala',
    runeMeaning: '차원 도약과 우주 특이점',
    description: '화이트홀과 블랙홀을 교차하며 모든 사이트와 기능을 잇는 웜홀 포털',
    themeColor: '#00f0ff',
    accentGlow: 'rgba(0, 240, 255, 0.9)',
    isActive: true,
    category: 'standalone',
  },
];

// 메모리 내 동적 레지스트리 (지연 초기화로 모듈 평가 순환 참조 및 TDZ 원천 차단)
let registryMap: Map<string, PrismRouteDefinition> | null = null;

function getRegistryMap(): Map<string, PrismRouteDefinition> {
  if (!registryMap) {
    registryMap = new Map<string, PrismRouteDefinition>(
      INITIAL_PRISM_ROUTES.map((r) => [r.id, { ...r }])
    );
  }
  return registryMap;
}

/**
 * 신규 기능 또는 페이지 동적 등록 API
 * - 앞으로 기능이나 페이지가 추가되면 이 함수를 호출하거나 위 목록에 추가하기만 하면
 *   빅뱅 버튼과 웜홀 스펙트럼, 룬 매핑, 내비게이션 경로가 자동으로 확장됩니다.
 */
export function registerPrismRoute(route: PrismRouteDefinition): void {
  getRegistryMap().set(route.id, { ...route, isActive: route.isActive ?? true });
  // 리스너나 이벤트가 필요한 경우 글로벌 이벤트 발송
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('prism:route_registered', { detail: route })
    );
  }
}

/**
 * 기능 또는 페이지 비활성화 / 제거 API
 * - 사라진 페이지나 기능의 ID를 비활성화하여 빅뱅 버튼의 도약 대상에서 원천 배제합니다.
 */
export function deactivatePrismRoute(id: string): void {
  const existing = getRegistryMap().get(id);
  if (existing) {
    existing.isActive = false;
  }
}

/**
 * 현재 활성화된 실존 정식 페이지/기능 목록 반환
 */
export function getActivePrismRoutes(): PrismRouteDefinition[] {
  return Array.from(getRegistryMap().values()).filter((r) => r.isActive);
}

/**
 * 정규화된 경로 추출 유틸
 */
function normalizePath(rawPath: string): string {
  if (!rawPath) return '/';
  const clean = rawPath.trim().split('?')[0].split('#')[0].toLowerCase();
  return clean === '' ? '/' : clean.startsWith('/') ? clean : `/${clean}`;
}

/**
 * 특정 경로가 현재 프리즘에 실존하는 유효 페이지인지 검증
 */
export function isValidPrismPath(rawPath: string): boolean {
  const norm = normalizePath(rawPath);
  const activeRoutes = getActivePrismRoutes();

  for (const r of activeRoutes) {
    if (normalizePath(r.path) === norm) return true;
    if (r.aliases && r.aliases.some((a) => normalizePath(a) === norm)) return true;
  }

  return false;
}

/**
 * 경로 정제 & 캐노니컬 변환 (Route Guard / Sanitizer)
 * - 만약 사라지거나 폐기된 경로(존재하지 않는 페이지)가 전달되면 가장 안전한 프롤로그 허브('/')로 안전하게 정제합니다.
 * - 별칭(예: /lucy -> /chat, /gateway -> /orb)은 정식 표준 경로로 자동 승격합니다.
 */
export function resolveCanonicalPath(rawPath: string): string {
  if (!rawPath) return '/';
  const qIdx = rawPath.indexOf('?');
  const hIdx = rawPath.indexOf('#');
  const splitIdx = qIdx !== -1 && hIdx !== -1 ? Math.min(qIdx, hIdx) : qIdx !== -1 ? qIdx : hIdx;
  const pathOnly = splitIdx !== -1 ? rawPath.substring(0, splitIdx) : rawPath;
  const suffix = splitIdx !== -1 ? rawPath.substring(splitIdx) : '';

  const norm = normalizePath(pathOnly);
  const activeRoutes = getActivePrismRoutes();

  for (const r of activeRoutes) {
    if (normalizePath(r.path) === norm) return r.path + suffix;
    if (r.aliases && r.aliases.some((a) => normalizePath(a) === norm)) return r.path + suffix;
  }

  // 매칭되는 활성 라우트가 없을 경우 (사라진 페이지 방어)
  console.warn(`[PrismRouteGuard] Route '${rawPath}' does not exist or was removed. Safely redirecting to hub '/'.`);
  return '/';
}

/**
 * 경로 또는 ID로 라우트 정의 객체 조회
 */
export function getPrismRouteByPathOrId(pathOrId: string): PrismRouteDefinition | undefined {
  if (!pathOrId) return undefined;
  const norm = normalizePath(pathOrId);
  const idNorm = pathOrId.toLowerCase().replace('/', '');
  const activeRoutes = getActivePrismRoutes();

  // 1. ID 매칭
  const byId = getRegistryMap().get(idNorm);
  if (byId && byId.isActive) return byId;

  // 2. 경로 및 별칭 매칭
  for (const r of activeRoutes) {
    if (normalizePath(r.path) === norm) return r;
    if (r.aliases && r.aliases.some((a) => normalizePath(a) === norm)) return r;
  }

  return undefined;
}

/**
 * 🌀 웜홀(Wormhole) 전용 데일리 셔플 순환 목적지 반환 (기본 폴백 어댑터)
 */
export function getRandomWormholeDestination(currentLocation?: string): PrismRouteDefinition {
  const routes = getActivePrismRoutes();
  const oracleFallback = routes.find((r) => r.id === 'trinity' && r.isActive);
  return oracleFallback || routes[0] || INITIAL_PRISM_ROUTES[3];
}
