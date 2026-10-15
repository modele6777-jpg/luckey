/**
 * 🌀 웜홀 데일리 셔플 순환 엔진 (Wormhole Daily Shuffle Bag Engine)
 * =========================================================================
 * - 웜홀 도약 시 실존하는 모든 기능/페이지를 무작위(Fisher-Yates) 셔플로 순회
 * - 하루에 한 번 자정(YYYY-MM-DD)을 기준으로 자동 초기화
 * - 그날 이미 다녀간 기능이나 페이지는 전체 풀을 한 바퀴 완주하기 전까지 다시 나오지 않음
 * - 한 바퀴를 모두 완주하면 새로운 셔플 순서로 다음 회차 순환이 매끄럽게 재시작됨
 * - safeLocalStorage를 통해 새로고침 및 앱 간 이동 시에도 당일 방문 기록 영구 보존
 * =========================================================================
 */

import { safeLocalStorage } from '@/utils/safeStorage';
import {
  getActivePrismRoutes,
  PrismRouteDefinition,
  isValidPrismPath,
  resolveCanonicalPath,
} from '@/lib/prismRouteRegistry';
import { isDisallowedWarpDestination } from './wormholeSpectrum';

export interface WormholeDestinationItem {
  id: string;
  name: string;
  subName: string;
  path: string;
  icon: string;
  runeSymbol: string;
  runeName: string;
  runeMeaning: string;
  description: string;
  themeColor: string;
  accentGlow: string;
  channelId: string;
  category: 'channel' | 'standalone' | 'hub';
  isActive: boolean;
}

/**
 * 🌌 웜홀 기본 목적지 카탈로그 (전 차원 핵심 기능 및 페이지 풀)
 * - 루시 채팅(/chat)과 크리스탈 오브(/orb), 메인 허브(/)는 특수 포털이므로 웜홀 대상에서 배제
 * - 6대 핵심 채널(트리니티, 오렌지, 아우라, 파랑새, 뮤즈, 에필로그)의 주요 특화 기능 및 페이지 수록
 */
export const CORE_WORMHOLE_DESTINATIONS: WormholeDestinationItem[] = [
  // 1. 트리니티 오라클 (Trinity)
  {
    id: 'trinity-tarot',
    name: '타로 스프레드',
    subName: '3장 타로 카드 무의식 탐색',
    path: '/trinity?tab=tarot',
    icon: '🎴',
    runeSymbol: 'ᛟ',
    runeName: 'Othala',
    runeMeaning: '무의식의 심연과 비의',
    description: '과거, 현재, 미래를 아우르는 3장의 타로 카드로 무의식의 심연을 들여다봅니다.',
    themeColor: '#ca8a04',
    accentGlow: 'rgba(202, 138, 4, 0.95)',
    channelId: 'trinity',
    category: 'channel',
    isActive: true,
  },
  {
    id: 'trinity-daily',
    name: 'SAJU',
    subName: '영혼의 설계도 사주 오행 & 만세력 리포트',
    path: '/trinity?tab=destiny',
    icon: '🧭',
    runeSymbol: 'ᛈ',
    runeName: 'Pertho',
    runeMeaning: '운명과 기회의 나침반',
    description: '생년월일시 기반 사주 4주 8자와 5대 오행 밸런스, 2026 세운을 정밀 분석합니다.',
    themeColor: '#eab308',
    accentGlow: 'rgba(234, 179, 8, 0.95)',
    channelId: 'trinity',
    category: 'channel',
    isActive: true,
  },
  {
    id: 'trinity-oracle',
    name: '트리니티 오라클',
    subName: '운명의 나침반 심층 오라클 리딩',
    path: '/trinity?tab=oracle',
    icon: '🔮',
    runeSymbol: 'ᛞ',
    runeName: 'Dagaz',
    runeMeaning: '빛의 자각과 통찰',
    description: '운명의 기로에서 가장 현명한 길을 비추는 트리니티 오라클의 계시를 마주합니다.',
    themeColor: '#facc15',
    accentGlow: 'rgba(250, 204, 21, 0.95)',
    channelId: 'trinity',
    category: 'channel',
    isActive: true,
  },

  // 2. 오렌지 성찰 & 별에게 소원빌기 (Orange)
  {
    id: 'orange-wishingWell',
    name: '별에게 소원빌기',
    subName: '밤하늘 별에 소망을 띄우는 신비한 별빛',
    path: '/orange?tab=wishingWell',
    icon: '⭐',
    runeSymbol: 'ᚷ',
    runeName: 'Gebo',
    runeMeaning: '선물과 소망의 결실',
    description: '마음 깊은 곳의 갈망과 소원을 밤하늘 별에 띄워 우주로 전송합니다.',
    themeColor: '#ea580c',
    accentGlow: 'rgba(234, 88, 12, 0.95)',
    channelId: 'orange',
    category: 'channel',
    isActive: true,
  },
  {
    id: 'orange-secret',
    name: '비밀의 방 성찰',
    subName: '내면 성찰과 솔직한 감정 고백',
    path: '/orange?tab=secret',
    icon: '🍊',
    runeSymbol: 'ᛋ',
    runeName: 'Sowilo',
    runeMeaning: '태양과 내면의 솔직한 빛',
    description: '비밀의 방에서 나만의 감정과 생각을 솔직하게 털어놓고 깊이 성찰합니다.',
    themeColor: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.95)',
    channelId: 'orange',
    category: 'channel',
    isActive: true,
  },
  {
    id: 'orange-synergy',
    name: '오렌지 시너지',
    subName: '감정 에너지와 채널 연계 촉매',
    path: '/orange?tab=synergy',
    icon: '⚡',
    runeSymbol: 'ᚲ',
    runeName: 'Kenaz',
    runeMeaning: '영감의 불꽃과 촉매',
    description: '오렌지 채널의 감정 에너지를 다른 차원들과 결합하는 촉매 작용을 가동합니다.',
    themeColor: '#fb923c',
    accentGlow: 'rgba(251, 146, 60, 0.95)',
    channelId: 'orange',
    category: 'channel',
    isActive: true,
  },

  // 3. 아우라 신체 웰니스 (Heal)
  {
    id: 'heal-meditation',
    name: '호오포노포노 명상',
    subName: '무의식 정화와 감정 흘려보내기',
    path: '/heal?tab=meditation',
    icon: '🌊',
    runeSymbol: 'ᛉ',
    runeName: 'Algiz',
    runeMeaning: '보호와 성스러운 정화',
    description: '호흡과 명상, 4마디 호오포노포노로 묵은 감정을 깨끗이 흘려보냅니다.',
    themeColor: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.95)',
    channelId: 'heal',
    category: 'channel',
    isActive: true,
  },
  {
    id: 'heal-oneMinute',
    name: '1분 생체 리듬',
    subName: '빠른 호흡 조율과 생체 에너지 회복',
    path: '/heal?tab=oneMinute',
    icon: '💓',
    runeSymbol: 'ᛏ',
    runeName: 'Tiwaz',
    runeMeaning: '의지와 생체 질서의 회복',
    description: '1분간의 집중 호흡으로 흩어진 자율신경과 생체 리듬을 즉시 바로잡습니다.',
    themeColor: '#0ea5e9',
    accentGlow: 'rgba(14, 165, 233, 0.95)',
    channelId: 'heal',
    category: 'channel',
    isActive: true,
  },

  // 4. 파랑새의 성소 (Bluebird)
  {
    id: 'bluebird-daily',
    name: '일상의 감사 안식처',
    subName: '따뜻한 하루의 축복과 평온한 안식',
    path: '/bluebird?tab=daily',
    icon: '🐦',
    runeSymbol: 'ᛒ',
    runeName: 'Berkana',
    runeMeaning: '치유와 일상의 따스한 싹',
    description: '지친 마음에 일상의 평온과 행복, 따뜻한 감사의 온기를 되찾는 안식처입니다.',
    themeColor: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.95)',
    channelId: 'bluebird',
    category: 'channel',
    isActive: true,
  },
  {
    id: 'bluebird-secretMessage',
    name: '행복의 비밀 쪽지',
    subName: '마음 깊은 곳을 울리는 위로의 편지',
    path: '/bluebird?tab=secretMessage',
    icon: '💌',
    runeSymbol: 'ᚹ',
    runeName: 'Wunjo',
    runeMeaning: '기쁨과 영혼의 위로',
    description: '파랑새가 물어온 비밀 쪽지에서 오늘 나에게 꼭 필요한 다정한 위로를 만납니다.',
    themeColor: '#0284c7',
    accentGlow: 'rgba(2, 132, 199, 0.95)',
    channelId: 'bluebird',
    category: 'channel',
    isActive: true,
  },

  // 5. 뮤즈 예술처방 (Muse)
  {
    id: 'muse-art',
    name: '삼위일체 명작 처방',
    subName: '명화·명시·명곡 감성 예술 큐레이션',
    path: '/muse?tab=artRecommendation',
    icon: '🎨',
    runeSymbol: 'ᚲ',
    runeName: 'Kenaz',
    runeMeaning: '빛나는 예술적 영감',
    description: '현재 감정 상태에 깊이 공명하는 세계적 명화, 명시, 클래식 명곡을 처방받습니다.',
    themeColor: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.95)',
    channelId: 'muse',
    category: 'channel',
    isActive: true,
  },
  {
    id: 'muse-roleModel',
    name: '영혼의 롤모델',
    subName: '위대한 예술가와 사상가의 지혜',
    path: '/muse?tab=roleModel',
    icon: '🌟',
    runeSymbol: 'ᛖ',
    runeName: 'Ehwaz',
    runeMeaning: '성장과 도약의 동반자',
    description: '역사 속 위대한 거장들의 삶과 사상에서 나의 딜레마를 풀 지혜를 얻습니다.',
    themeColor: '#9333ea',
    accentGlow: 'rgba(147, 51, 234, 0.95)',
    channelId: 'muse',
    category: 'channel',
    isActive: true,
  },

  // 6. 에필로그 밤 서재 (Epilogue)
  {
    id: 'epilogue-diary',
    name: '밤 서재 일기',
    subName: '오늘의 영감과 감정을 엮는 수필',
    path: '/epilogue?tab=diary',
    icon: '📖',
    runeSymbol: 'ᚨ',
    runeName: 'Ansuz',
    runeMeaning: '언어와 사유의 수렴',
    description: '하루 동안 마주친 생각과 감정을 한 편의 수필처럼 고요히 정리합니다.',
    themeColor: '#34d399',
    accentGlow: 'rgba(52, 211, 153, 0.95)',
    channelId: 'epilogue',
    category: 'channel',
    isActive: true,
  },
  {
    id: 'epilogue-synergy',
    name: '시너지 연대기',
    subName: '영혼의 발자취와 종합 분석',
    path: '/epilogue?tab=synergy',
    icon: '📊',
    runeSymbol: 'ᛃ',
    runeName: 'Jera',
    runeMeaning: '성장과 수확의 연대기',
    description: '모든 채널에서 축적된 데이터와 영혼의 성장 추이를 종합 분석합니다.',
    themeColor: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.95)',
    channelId: 'epilogue',
    category: 'channel',
    isActive: true,
  },
];

export interface DailyWormholeShuffleState {
  date: string; // "YYYY-MM-DD"
  visitedIds: string[]; // 당일 현재 회차에서 이미 방문한 목적지 ID 목록
  shuffledOrder: string[]; // 당일 현재 회차의 전체 셔플 순서
  cycleIndex: number; // 당일 몇 번째 바퀴인지 (1, 2, 3...)
  lastVisitedId?: string;
  lastJumpTime?: number;
}

const STORAGE_KEY = 'prism_wormhole_daily_shuffle_state_v1';

/**
 * 당일 로컬 날짜 키 반환 (YYYY-MM-DD)
 */
export function getTodayDateKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Fisher-Yates 무작위 셔플 알고리즘
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * 현재 활성화된 전체 웜홀 목적지 풀 종합 반환
 * - 기본 카탈로그 + 동적으로 등록된 추가 라우트 자동 포함
 */
export function getAllWormholePool(): WormholeDestinationItem[] {
  const isBanned = (id: string, path: string) => {
    if (isDisallowedWarpDestination(id) || isDisallowedWarpDestination(path)) return true;
    const rawId = (id || '').toLowerCase();
    const rawPath = (path || '').toLowerCase();
    return (
      rawId.includes('orb') ||
      rawId.includes('crystal') ||
      rawId.includes('gateway') ||
      rawId.includes('chat') ||
      rawId.includes('lucy') ||
      rawPath.includes('orb') ||
      rawPath.includes('crystal') ||
      rawPath.includes('gateway') ||
      rawPath.includes('chat') ||
      rawPath.includes('lucy')
    );
  };

  const pool = CORE_WORMHOLE_DESTINATIONS.filter(
    (item) => item.isActive && !isBanned(item.id, item.path)
  );
  const existingPaths = new Set(pool.map((p) => p.path.toLowerCase().split('?')[0]));

  // 혹시 동적으로 등록된 라우트 중 누락된 유효 채널이 있다면 안전하게 확장
  try {
    const activeRoutes = getActivePrismRoutes();
    for (const r of activeRoutes) {
      const normP = r.path.toLowerCase().split('?')[0];
      if (
        r.isActive &&
        !existingPaths.has(normP) &&
        !isBanned(r.id, r.path)
      ) {
        pool.push({
          id: r.id,
          name: r.name,
          subName: r.subName,
          path: r.path,
          icon: r.icon,
          runeSymbol: r.runeSymbol,
          runeName: r.runeName,
          runeMeaning: r.runeMeaning,
          description: r.description,
          themeColor: r.themeColor,
          accentGlow: r.accentGlow,
          channelId: r.id,
          category: r.category as any,
          isActive: true,
        });
        existingPaths.add(normP);
      }
    }
  } catch (_) {}

  return pool.filter((item) => item.isActive && !isBanned(item.id, item.path));
}

/**
 * 로컬스토리지에서 당일 셔플 상태 로드 (날짜 만료 시 자동 초기화)
 */
export function getDailyWormholeShuffleState(): DailyWormholeShuffleState {
  const today = getTodayDateKey();
  const pool = getAllWormholePool();
  const allIds = pool.map((item) => item.id);

  try {
    const raw = safeLocalStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DailyWormholeShuffleState = JSON.parse(raw);
      // 당일 날짜가 일치하고 데이터 구조가 유효한 경우 반환
      if (parsed && parsed.date === today && Array.isArray(parsed.visitedIds) && Array.isArray(parsed.shuffledOrder)) {
        // 프로필 등 삭제/차단된 ID 즉시 정제
        parsed.shuffledOrder = parsed.shuffledOrder.filter(
          (id) => allIds.includes(id) && !isDisallowedWarpDestination(id)
        );
        parsed.visitedIds = parsed.visitedIds.filter(
          (id) => allIds.includes(id) && !isDisallowedWarpDestination(id)
        );

        // 혹시 풀이 확장되어 신규 ID가 추가되었다면 셔플 순서에 보완
        const missingIds = allIds.filter((id) => !parsed.shuffledOrder.includes(id));
        if (missingIds.length > 0) {
          parsed.shuffledOrder = [...parsed.shuffledOrder, ...shuffleArray(missingIds)];
        }
        saveDailyWormholeShuffleState(parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[WormholeShuffle] State load error, creating fresh state:', err);
  }

  // 자정이 지났거나 최초 실행인 경우: 당일 신규 셔플 상태 생성 및 저장
  const freshState: DailyWormholeShuffleState = {
    date: today,
    visitedIds: [],
    shuffledOrder: shuffleArray(allIds),
    cycleIndex: 1,
  };
  saveDailyWormholeShuffleState(freshState);
  return freshState;
}

/**
 * 셔플 상태 저장
 */
function saveDailyWormholeShuffleState(state: DailyWormholeShuffleState): void {
  try {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[WormholeShuffle] State save error:', err);
  }
}

// 터치 홀드 시 프레임마다 깜빡이지 않도록 홀드 세션 동안 유지되는 후보 캐시
let activeSessionCandidate: {
  dest: WormholeDestinationItem;
  stats: { visitedCount: number; totalCount: number; cycleIndex: number };
} | null = null;

/**
 * 홀드 세션 후보 캐시 초기화 (터치 시작 및 종료 시 호출)
 */
export function resetActiveWormholePeek(): void {
  activeSessionCandidate = null;
}

/**
 * 경로 정규화 비교 유틸
 */
function isSameRouteLocation(destPath: string, currentLoc: string): boolean {
  if (!currentLoc) return false;
  const cleanDest = destPath.trim().toLowerCase();
  const cleanLoc = currentLoc.trim().toLowerCase();

  // 1. 쿼리 파라미터(?tab=...)까지 완벽 일치하는 경우
  if (cleanDest === cleanLoc) return true;

  // 2. 기본 경로 및 탭 파라미터 추출 비교
  try {
    const destUrl = new URL(destPath, 'https://prism.local');
    const locUrl = new URL(currentLoc, 'https://prism.local');
    if (destUrl.pathname === locUrl.pathname) {
      const destTab = destUrl.searchParams.get('tab');
      const locTab = locUrl.searchParams.get('tab');
      if (!destTab || !locTab || destTab === locTab) {
        return true;
      }
    }
  } catch (_) {
    if (cleanDest.split('?')[0] === cleanLoc.split('?')[0]) {
      return true;
    }
  }

  return false;
}

/**
 * 🌀 웜홀 다음 도약 후보 미리보기 (Preview/Peek - 상태 변경 없음)
 * - 현재 셔플 덱에서 당일 아직 방문하지 않은 기능/페이지를 순서대로 탐색
 * - 현재 사용자가 머물고 있는 위치는 배제
 * - 홀드하는 동안 프레임마다 결과가 바뀌지 않도록 동일 터치 세션 동안 안정적으로 캐싱
 */
export function peekShuffledWormholeDestination(currentLocation?: string): {
  dest: WormholeDestinationItem;
  stats: { visitedCount: number; totalCount: number; cycleIndex: number; isRecycled: boolean };
} {
  if (activeSessionCandidate) {
    return {
      dest: activeSessionCandidate.dest,
      stats: { ...activeSessionCandidate.stats, isRecycled: false },
    };
  }

  const pool = getAllWormholePool();
  const state = getDailyWormholeShuffleState();
  const poolMap = new Map(pool.map((p) => [p.id, p]));
  const totalCount = pool.length;

  // 1. 당일 아직 방문하지 않은 ID 목록 확인
  let unvisitedIds = state.shuffledOrder.filter((id) => !state.visitedIds.includes(id));
  let isRecycled = false;

  // 2. 만약 모든 목적지를 다 방문했다면? "한 바퀴 완주!" -> 새 셔플 사이클 준비
  if (unvisitedIds.length === 0) {
    isRecycled = true;
    const allIds = pool.map((p) => p.id);
    unvisitedIds = shuffleArray(allIds);
  }

  // 3. 현재 위치를 피해서 첫 번째 유효 후보 선택
  const curr = currentLocation || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
  let chosenId = unvisitedIds.find((id) => {
    const item = poolMap.get(id);
    if (!item) return false;
    return !isSameRouteLocation(item.path, curr);
  });

  // 혹시 남은 후보가 현재 위치 하나뿐이라면 어쩔 수 없이 해당 후보 선택
  if (!chosenId && unvisitedIds.length > 0) {
    chosenId = unvisitedIds[0];
  }

  const chosenItem = (chosenId ? poolMap.get(chosenId) : null) || pool[0];
  const visitedCount = state.visitedIds.length;

  const result = {
    dest: chosenItem,
    stats: {
      visitedCount,
      totalCount,
      cycleIndex: state.cycleIndex,
      isRecycled,
    },
  };

  activeSessionCandidate = {
    dest: chosenItem,
    stats: {
      visitedCount,
      totalCount,
      cycleIndex: state.cycleIndex,
    },
  };

  return result;
}

/**
 * 🚀 웜홀 차원 도약 확정 및 방문 기록 (Commit & Advance)
 * - 사용자가 웜홀 버튼에서 손을 떼어 실제 도약이 일어났을 때 호출
 * - 선택된 기능/페이지를 당일 방문 목록(visitedIds)에 영구 기록
 * - 한 바퀴(모든 풀)를 완주한 경우 다음 회차(cycleIndex++)로 자동 전환 및 신규 셔플 재생성
 */
export function commitShuffledWormholeDestination(currentLocation?: string): {
  dest: WormholeDestinationItem;
  safePath: string;
  stats: { visitedCount: number; totalCount: number; cycleIndex: number; isFullCycleCompleted: boolean };
} {
  const peeked = peekShuffledWormholeDestination(currentLocation);
  const chosenDest = peeked.dest;
  const pool = getAllWormholePool();
  const totalCount = pool.length;

  const state = getDailyWormholeShuffleState();
  let isFullCycleCompleted = false;

  // 방문 목록에 추가
  if (!state.visitedIds.includes(chosenDest.id)) {
    state.visitedIds.push(chosenDest.id);
  }
  state.lastVisitedId = chosenDest.id;
  state.lastJumpTime = Date.now();

  // 만약 전체 풀을 모두 다녀갔다면 ("한 바퀴 완주!")
  // 당일 다음 회차를 위해 visitedIds를 초기화하고 새로운 셔플 순서를 생성
  if (state.visitedIds.length >= totalCount) {
    isFullCycleCompleted = true;
    state.cycleIndex += 1;
    state.visitedIds = [];
    const allIds = pool.map((p) => p.id);
    state.shuffledOrder = shuffleArray(allIds);
  }

  saveDailyWormholeShuffleState(state);
  resetActiveWormholePeek();

  // 글로벌 이벤트 발송 (다른 위젯이나 통계 UI가 실시간으로 수신 가능)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('prism:wormhole_shuffle_jump', {
        detail: {
          destination: chosenDest,
          date: state.date,
          visitedCount: isFullCycleCompleted ? totalCount : state.visitedIds.length,
          totalCount,
          cycleIndex: state.cycleIndex,
          isFullCycleCompleted,
        },
      })
    );
  }

  const safePath = resolveCanonicalPath(chosenDest.path);

  return {
    dest: chosenDest,
    safePath,
    stats: {
      visitedCount: isFullCycleCompleted ? totalCount : state.visitedIds.length,
      totalCount,
      cycleIndex: state.cycleIndex,
      isFullCycleCompleted,
    },
  };
}

/**
 * 기존 PrismRouteDefinition 규격과의 100% 호환 변환 어댑터
 */
export function destinationToPrismRoute(item: WormholeDestinationItem): PrismRouteDefinition {
  return {
    id: item.id,
    name: item.name,
    subName: item.subName,
    path: item.path,
    icon: item.icon,
    runeSymbol: item.runeSymbol,
    runeName: item.runeName,
    runeMeaning: item.runeMeaning,
    description: item.description,
    themeColor: item.themeColor,
    accentGlow: item.accentGlow,
    isActive: item.isActive,
    category: item.category as any,
  };
}

/**
 * 당일 웜홀 셔플 진행 상황 통계 반환
 */
export function getDailyWormholeStats(): {
  date: string;
  visitedCount: number;
  totalCount: number;
  remainingCount: number;
  cycleIndex: number;
  visitedList: string[];
} {
  const state = getDailyWormholeShuffleState();
  const pool = getAllWormholePool();
  const totalCount = pool.length;
  const visitedCount = state.visitedIds.length;
  const remainingCount = Math.max(0, totalCount - visitedCount);

  return {
    date: state.date,
    visitedCount,
    totalCount,
    remainingCount,
    cycleIndex: state.cycleIndex,
    visitedList: state.visitedIds,
  };
}

/**
 * 🌀 웜홀(Wormhole) 전용 데일리 셔플 순환 목적지 반환
 * - 하루에 한 번 자정(YYYY-MM-DD)을 기준으로 자동 초기화
 * - 그날 이미 다녀간 기능이나 페이지는 전체 풀을 한 바퀴 완주하기 전까지 다시 나오지 않음
 * - 안전 캐싱을 통해 홀드 중 프레임 깜빡임 없이 동일 목적지를 안정적으로 유지
 */
export function getRandomWormholeDestination(currentLocation?: string): PrismRouteDefinition {
  try {
    const { dest } = peekShuffledWormholeDestination(currentLocation);
    return destinationToPrismRoute(dest);
  } catch (err) {
    console.warn('[WormholeRegistry] Shuffle peek failed, falling back to static oracle:', err);
    return {
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
    };
  }
}

