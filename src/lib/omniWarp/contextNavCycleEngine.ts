/**
 * 🌀 contextNavCycleEngine.ts
 * =========================================================================
 * 🎯 빅뱅 버튼 드래그 전용 7대 정규 앱 엄격 순환(Non-Repeating Cycle) 추천 엔진
 * -------------------------------------------------------------------------
 * - 텍스트 선택 토스 또는 맥락 감지 드래그 시:
 *   프리즘의 7대 핵심 앱(오렌지, 트리니티, 아우라/힐, 블루버드, 뮤즈, 에필로그, 프롤로그/허브)을
 *   한 사이클 동안 '단 한 번씩만' 순환 방문하도록 엄격 보장합니다.
 * - [엄격한 사이클 순환 규칙 (Strict Non-Repeating App Cycle)]:
 *   1. 한 번 추천/방문된 앱은 남은 모든 다른 앱들을 전부 방문하기 전까지 절대로 재추천되지 않습니다.
 *      (오렌지 <-> 트리니티 간의 무한 핑퐁 왕복 원천 차단)
 *   2. 전체 7대 앱을 1바퀴 모두 순환(완주)하면 사이클 번호가 +1 증가하고,
 *      방문 이력이 리셋되어 다음 회차 사이클에서 새롭게 추천됩니다.
 *   3. 각 앱으로 이동할 때는 현재 화면/대화의 맥락(또는 선택된 텍스트)에 가장 부합하는
 *      세부 서브메뉴(39대 기능 중 최적 메뉴)를 선정하여 안내합니다.
 * =========================================================================
 */

import { safeLocalStorage } from '@/utils/safeStorage';
import {
  PRISM_ALL_APP_DESTINATIONS,
  PrismMenuDestination,
  isSameAppOrPage,
} from '@/lib/selectionContextRecommender';
import { serializeCurrentView } from './omniWarpEngine';
import { extractLatestDialogueContext } from '@/lib/prismPersonaSync';
import { isDisallowedWarpDestination } from './wormholeSpectrum';
import { resolveCanonicalPath, isValidPrismPath } from '@/lib/prismRouteRegistry';

export const PRISM_CORE_APP_IDS = [
  'orange',
  'trinity',
  'heal',
  'bluebird',
  'muse',
  'epilogue',
  'hub',
] as const;

export type PrismCoreAppId = (typeof PRISM_CORE_APP_IDS)[number];

export interface ContextCycleStats {
  visitedCount: number;
  totalCount: number;
  remainingCount: number;
  cycleIndex: number;
  isFullCycleCompleted: boolean;
  visitedAppIds: string[];
  currentAppId: string;
  nextAppId: string;
}

export interface ContextRecommendationCycleState {
  cycleIndex: number;
  visitedAppIds: string[];
  visitedSubmenuIds: string[];
  lastVisitedAppId: string | null;
  lastVisitedSubmenuId: string | null;
  lastJumpTime: number;
}

export interface ContextNextMenuResult {
  menu: PrismMenuDestination;
  reason: string;
  score: number;
  safePath: string;
  stats: ContextCycleStats;
}

const CONTEXT_CYCLE_STORAGE_KEY = 'prism_drag_context_cycle_state_v2';
const LEGACY_STORAGE_KEY = 'prism_drag_context_cycle_state_v1';

/**
 * 🗺️ 경로로부터 7대 코어 앱 ID 도출
 */
export function getAppIdFromPath(path: string): PrismCoreAppId {
  if (!path) return 'hub';
  const clean = path.split('?')[0].split('#')[0].toLowerCase();
  if (clean.startsWith('/orange')) return 'orange';
  if (clean.startsWith('/trinity')) return 'trinity';
  if (clean.startsWith('/heal')) return 'heal';
  if (clean.startsWith('/bluebird')) return 'bluebird';
  if (clean.startsWith('/muse')) return 'muse';
  if (clean.startsWith('/epilogue')) return 'epilogue';
  return 'hub';
}

/**
 * 🎯 메뉴 객체로부터 소속 코어 앱 ID 도출
 */
export function getAppIdFromMenu(menu: PrismMenuDestination): PrismCoreAppId {
  if (menu.tossTargetId && PRISM_CORE_APP_IDS.includes(menu.tossTargetId as PrismCoreAppId)) {
    return menu.tossTargetId as PrismCoreAppId;
  }
  return getAppIdFromPath(menu.basePath || menu.path);
}

/**
 * 🧠 1. 현재 화면 및 직전 활동의 맥락 텍스트 종합 추출
 */
export function extractAutoContextText(currentPath: string): string {
  const parts: string[] = [];

  // 1-1. 각 채널/루시/오브의 최근 대화 맥락 추출
  const lastDialogue = extractLatestDialogueContext(currentPath);
  if (lastDialogue) {
    if (lastDialogue.lastUserMessage) parts.push(lastDialogue.lastUserMessage);
    if (lastDialogue.dominantEmotionOrTheme) parts.push(lastDialogue.dominantEmotionOrTheme);
    if (lastDialogue.summary) parts.push(lastDialogue.summary);
    if (lastDialogue.lastAssistantMessage) parts.push(lastDialogue.lastAssistantMessage.slice(0, 160));
  }

  // 1-2. 현재 인앱 뷰의 직렬화 정보 (타이틀, 주 주제, 요약)
  const view = serializeCurrentView(currentPath);
  if (view) {
    if (view.activeTitle) parts.push(view.activeTitle);
    if (view.primarySubject) parts.push(view.primarySubject);
    if (view.summary) parts.push(view.summary);
  }

  // 1-3. 브라우저 도큐먼트 타이틀 보강
  if (typeof document !== 'undefined' && document.title) {
    parts.push(document.title);
  }

  return parts.join(' ').trim();
}

/**
 * 📊 2. 특정 메뉴에 대한 맥락 적합도 점수 산출
 */
export function scoreMenuByContext(menu: PrismMenuDestination, contextText: string): number {
  const trimmed = (contextText || '').trim().toLowerCase();
  let score = 10; // 기본 베이스 점수

  if (!trimmed) {
    return score;
  }

  // 1. 키워드 매칭
  for (const kw of menu.keywords) {
    if (trimmed.includes(kw.toLowerCase())) {
      score += Math.max(kw.length * 3, 6);
    }
  }

  // 2. 정규식 의도 매칭
  if (menu.intentRegex && menu.intentRegex.test(trimmed)) {
    score += 24;
  }

  // 3. 상황·감정별 시너지 가중치
  if (/슬프|눈물|괴로|힘들|외로|아파|상처|울적|우울/.test(trimmed)) {
    if (menu.id === 'bluebird_sanctuary' || menu.id === 'heal_hoponopono') score += 20;
    if (menu.id === 'orange_mind' || menu.id === 'muse_art' || menu.id === 'bluebird_forest') score += 15;
  }
  if (/바라|소원|성공|이루|하고 싶|꿈|목표|소망|희망/.test(trimmed)) {
    if (menu.id === 'orange_well' || menu.id === 'trinity_oracle') score += 20;
    if (menu.id === 'trinity_saju' || menu.id === 'orange_affirmation' || menu.id === 'epilogue_capsule') score += 16;
  }
  if (/돈|재물|금전|사업|투자|부자|직장|취업|월급|계약|이직/.test(trimmed)) {
    if (menu.id === 'trinity_wealth' || menu.id === 'trinity_saju') score += 26;
  }
  if (/사랑|연애|궁합|이성|남친|여친|인연|결혼|썸|헤어짐|이별/.test(trimmed)) {
    if (menu.id === 'trinity_relationship' || menu.id === 'trinity_oracle') score += 26;
  }
  if (/피곤|지쳤|숨|뻐근|목|어깨|스트레스|휴식|졸려|답답|불안/.test(trimmed)) {
    if (menu.id === 'heal_wellness' || menu.id === 'heal_breathing' || menu.id === 'hub_ecpr') score += 22;
    if (menu.id === 'heal_sedona' || menu.id === 'bluebird_sanctuary' || menu.id === 'heal_frequency') score += 16;
  }
  if (/차크라|에너지|오라|기운|명상|수련|생체/.test(trimmed)) {
    if (menu.id === 'heal_chakra' || menu.id === 'heal_frequency' || menu.id === 'hub_ecpr') score += 22;
  }
  if (/생각|정리|오늘|하루|마무리|기억|적어|일기|추억|밤/.test(trimmed)) {
    if (menu.id === 'epilogue_journal' || menu.id === 'epilogue_retrospect' || menu.id === 'epilogue_stars') score += 22;
    if (menu.id === 'trinity_daily' || menu.id === 'epilogue_diary') score += 16;
  }
  if (/노래|그림|시|글귀|예술|선율|아름다|감상|도슨트|음악/.test(trimmed)) {
    if (menu.id === 'muse_art' || menu.id === 'muse_docent' || menu.id === 'muse_poem' || menu.id === 'muse_music') score += 24;
  }
  if (/편지|전하고|메시지|우체통|글을 띄우|소통/.test(trimmed)) {
    if (menu.id === 'bluebird_letter' || menu.id === 'epilogue_capsule') score += 22;
  }

  return score;
}

/**
 * 💾 3. 사이클 방문 상태 영구 보존 및 로드
 */
export function getContextCycleState(): ContextRecommendationCycleState {
  try {
    const raw = safeLocalStorage.getItem(CONTEXT_CYCLE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.cycleIndex === 'number' && Array.isArray(parsed.visitedAppIds)) {
        return {
          cycleIndex: parsed.cycleIndex || 1,
          visitedAppIds: parsed.visitedAppIds,
          visitedSubmenuIds: Array.isArray(parsed.visitedSubmenuIds) ? parsed.visitedSubmenuIds : [],
          lastVisitedAppId: parsed.lastVisitedAppId || null,
          lastVisitedSubmenuId: parsed.lastVisitedSubmenuId || null,
          lastJumpTime: parsed.lastJumpTime || 0,
        };
      }
    }

    // 마이그레이션: 구 버전 키 호환
    const legacyRaw = safeLocalStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const parsedLegacy = JSON.parse(legacyRaw);
      if (parsedLegacy && typeof parsedLegacy.cycleIndex === 'number') {
        const legacyVisited = Array.isArray(parsedLegacy.visitedIds) ? parsedLegacy.visitedIds : [];
        const migratedAppIds = Array.from(
          new Set(
            legacyVisited
              .map((id: string) => {
                const found = PRISM_ALL_APP_DESTINATIONS.find((d) => d.id === id);
                return found ? getAppIdFromMenu(found) : null;
              })
              .filter(Boolean)
          )
        ) as string[];

        return {
          cycleIndex: parsedLegacy.cycleIndex || 1,
          visitedAppIds: migratedAppIds,
          visitedSubmenuIds: legacyVisited,
          lastVisitedAppId: null,
          lastVisitedSubmenuId: parsedLegacy.lastVisitedId || null,
          lastJumpTime: parsedLegacy.lastJumpTime || 0,
        };
      }
    }
  } catch (_) {}

  return {
    cycleIndex: 1,
    visitedAppIds: [],
    visitedSubmenuIds: [],
    lastVisitedAppId: null,
    lastVisitedSubmenuId: null,
    lastJumpTime: 0,
  };
}

export function saveContextCycleState(state: ContextRecommendationCycleState): void {
  try {
    safeLocalStorage.setItem(CONTEXT_CYCLE_STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

/**
 * 🔒 터치 세션 동안 반복 I/O 및 프레임 흔들림 방지를 위한 활성 캐시
 */
let activeSessionResult: ContextNextMenuResult | null = null;

export function resetActiveContextPeek(): void {
  activeSessionResult = null;
}

/**
 * 🔮 4. 다음 추천 1위 메뉴 미리보기 (Preview / Peek)
 * - 7대 앱 중 이번 사이클에서 아직 방문하지 않은 앱을 맥락 점수 1순위로 선별합니다.
 * - 이미 이번 사이클에서 방문한 앱은 절대 중복 추천되지 않습니다.
 * - 모든 7대 앱을 방문한 경우 이번 사이클 완주 처리 및 새 사이클 1순위를 안내합니다.
 */
export function peekNextRecommendedMenuByCycle(
  currentLocation?: string,
  overrideContextText?: string
): ContextNextMenuResult {
  const curr = currentLocation || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');

  if (activeSessionResult) {
    if (
      isSameAppOrPage(activeSessionResult.menu.path, curr) ||
      isSameAppOrPage(activeSessionResult.menu.basePath, curr)
    ) {
      activeSessionResult = null;
    } else {
      return activeSessionResult;
    }
  }

  const currentAppId = getAppIdFromPath(curr);
  const state = getContextCycleState();
  const contextText = overrideContextText || extractAutoContextText(curr);

  // 현재 위치한 앱은 이번 사이클의 출발점/방문점으로 반드시 포함
  let effectiveVisited = [...state.visitedAppIds];
  if (!effectiveVisited.includes(currentAppId)) {
    effectiveVisited.push(currentAppId);
  }

  let isFullCycleCompleted = false;

  // 1. 이번 사이클에서 아직 방문하지 않은 앱 후보군 (현재 앱 제외)
  let candidateAppIds = PRISM_CORE_APP_IDS.filter(
    (appId) => appId !== currentAppId && !effectiveVisited.includes(appId)
  );

  // 2. 만약 모든 앱을 이미 다 방문했다면 (7대 앱 1사이클 완주!)
  //    -> 사이클 완료 플래그 활성화 및 현재 앱을 제외한 전체 앱을 다시 후보군으로 초기화
  if (candidateAppIds.length === 0) {
    isFullCycleCompleted = true;
    effectiveVisited = [currentAppId];
    candidateAppIds = PRISM_CORE_APP_IDS.filter((appId) => appId !== currentAppId);
  }

  // 3. 각 후보 앱별로 최적의 서브메뉴(39대 목적지 중) 선정 및 맥락 점수 산출
  const scoredApps: Array<{
    appId: PrismCoreAppId;
    bestMenu: PrismMenuDestination;
    score: number;
    reason: string;
    safePath: string;
  }> = [];

  for (const appId of candidateAppIds) {
    const appMenus = PRISM_ALL_APP_DESTINATIONS.filter((menu) => {
      if (isDisallowedWarpDestination(menu.id) || isDisallowedWarpDestination(menu.path)) {
        return false;
      }
      if (menu.path === '/universe') return false;
      // 🛡️ 루시(/chat) 및 Key(/key)는 사용자 지정 제스처에 배정되므로 추천 1순위 후보에서 엄격 배제
      const menuPathLower = (menu.path || '').toLowerCase();
      const menuIdLower = (menu.id || '').toLowerCase();
      if (
        menuPathLower.includes('chat') ||
        menuPathLower.includes('lucy') ||
        menuPathLower.includes('key') ||
        menuPathLower.includes('calm') ||
        menuIdLower.includes('lucy') ||
        menuIdLower.includes('key')
      ) {
        return false;
      }
      const targetApp = getAppIdFromMenu(menu);
      return targetApp === appId;
    });

    if (appMenus.length === 0) continue;

    // 해당 앱의 서브메뉴 채점 (아직 방문하지 않은 서브메뉴에 신선도 가산점 부여)
    const scoredMenus = appMenus.map((menu) => {
      let score = scoreMenuByContext(menu, contextText);
      if (!state.visitedSubmenuIds.includes(menu.id)) {
        score += 8; // 아직 안 가본 서브메뉴 우선 탐색 보너스
      }
      return {
        menu,
        score,
        reason: menu.contextReason,
        safePath: resolveCanonicalPath(menu.path),
      };
    });

    scoredMenus.sort((a, b) => b.score - a.score);
    const topMenu = scoredMenus[0];

    scoredApps.push({
      appId,
      bestMenu: topMenu.menu,
      score: topMenu.score,
      reason: topMenu.reason,
      safePath: topMenu.safePath,
    });
  }

  // 점수가 가장 높은 후보 앱 1위 선택
  scoredApps.sort((a, b) => b.score - a.score);
  const chosen = scoredApps[0] || {
    appId: candidateAppIds[0] || 'trinity',
    bestMenu: PRISM_ALL_APP_DESTINATIONS[0],
    score: 10,
    reason: '새로운 차원으로 안내합니다.',
    safePath: '/trinity',
  };

  const totalCount = PRISM_CORE_APP_IDS.length; // 7개 정규 앱
  const visitedCount = isFullCycleCompleted ? 2 : effectiveVisited.length + 1;
  const remainingCount = Math.max(0, totalCount - visitedCount);
  const cycleIndex = state.cycleIndex + (isFullCycleCompleted ? 1 : 0);

  const result: ContextNextMenuResult = {
    menu: chosen.bestMenu,
    reason: chosen.reason,
    score: chosen.score,
    safePath: chosen.safePath,
    stats: {
      visitedCount: Math.min(visitedCount, totalCount),
      totalCount,
      remainingCount,
      cycleIndex,
      isFullCycleCompleted,
      visitedAppIds: effectiveVisited,
      currentAppId,
      nextAppId: chosen.appId,
    },
  };

  activeSessionResult = result;
  return result;
}

/**
 * 🚀 5. 다음 추천 1위 메뉴 도약 확정 및 사이클 방문 기록 (Commit & Advance)
 * - 사용자가 빅뱅 버튼을 드래그 후 뗐을 때 호출됩니다.
 * - 선택된 앱(및 세부 메뉴)을 이번 사이클의 방문 목록에 영구 기록합니다.
 * - 전체 7대 앱이 완주되면 사이클 번호를 올리고 방문 목록을 갱신합니다.
 */
export function commitNextRecommendedMenuByCycle(
  currentLocation?: string,
  overrideContextText?: string
): ContextNextMenuResult {
  const result = peekNextRecommendedMenuByCycle(currentLocation, overrideContextText);
  const state = getContextCycleState();
  const currentAppId = result.stats.currentAppId;
  const chosenAppId = result.stats.nextAppId;
  const chosenMenuId = result.menu.id;

  if (result.stats.isFullCycleCompleted) {
    // 1바퀴 완주 후 새 사이클 진입
    state.cycleIndex += 1;
    state.visitedAppIds = [currentAppId, chosenAppId];
    state.visitedSubmenuIds = [chosenMenuId];
  } else {
    if (!state.visitedAppIds.includes(currentAppId)) {
      state.visitedAppIds.push(currentAppId);
    }
    if (!state.visitedAppIds.includes(chosenAppId)) {
      state.visitedAppIds.push(chosenAppId);
    }
    if (!state.visitedSubmenuIds.includes(chosenMenuId)) {
      state.visitedSubmenuIds.push(chosenMenuId);
    }
  }

  state.lastVisitedAppId = chosenAppId;
  state.lastVisitedSubmenuId = chosenMenuId;
  state.lastJumpTime = Date.now();
  saveContextCycleState(state);

  // 글로벌 이벤트 브로드캐스트
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('prism:context_cycle_jump', {
        detail: {
          destination: result.menu,
          appId: chosenAppId,
          visitedCount: result.stats.visitedCount,
          totalCount: result.stats.totalCount,
          cycleIndex: state.cycleIndex,
          isFullCycleCompleted: result.stats.isFullCycleCompleted,
        },
      })
    );
  }

  resetActiveContextPeek();
  return result;
}

/**
 * 📈 6. 현재 사이클 진행 통계 조회
 */
export function getContextCycleStats(currentLocation?: string): ContextCycleStats {
  const state = getContextCycleState();
  const curr = currentLocation || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
  const currentAppId = getAppIdFromPath(curr);

  let visitedAppIds = [...state.visitedAppIds];
  if (!visitedAppIds.includes(currentAppId)) {
    visitedAppIds.push(currentAppId);
  }

  const totalCount = PRISM_CORE_APP_IDS.length;
  const visitedCount = Math.min(visitedAppIds.length, totalCount);
  const remainingCount = Math.max(0, totalCount - visitedCount);

  return {
    visitedCount,
    totalCount,
    remainingCount,
    cycleIndex: state.cycleIndex,
    isFullCycleCompleted: visitedCount >= totalCount,
    visitedAppIds,
    currentAppId,
    nextAppId: '',
  };
}
