/** Context-ranked, persistent one-stop route: visit every destination before repeating. */

import { safeLocalStorage } from '@/utils/safeStorage';
import {
  PRISM_ALL_APP_DESTINATIONS,
  PrismMenuDestination,
} from '@/lib/selectionContextRecommender';
import { serializeCurrentView } from './omniWarpEngine';
import { extractLatestDialogueContext } from '@/lib/prismPersonaSync';
import { resolveCanonicalPath, isValidPrismPath, getActivePrismRoutes } from '@/lib/prismRouteRegistry';
import { normalizeOneStopPage, ONE_STOP_PAGE_TABS } from './oneStopPages';
import { advanceOneStopCycle, normalizeOneStopState, type OneStopState } from './oneStopCycle';

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

const CONTEXT_CYCLE_STORAGE_KEY = 'prism_one_stop_cycle_v3';

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


export function getOneStopDestinations(): PrismMenuDestination[] {
  const destinations = new Map<string, PrismMenuDestination>();
  for (const menu of PRISM_ALL_APP_DESTINATIONS) {
    if (!isValidPrismPath(menu.path)) continue;
    const raw = new URL(menu.path, 'https://luckey.local');
    const tab = raw.searchParams.get('tab');
    if (tab && !ONE_STOP_PAGE_TABS[raw.pathname]?.some(([id]) => id === tab)) continue;
    const path = oneStopPageKey(menu.path);
    if (!destinations.has(path)) destinations.set(path, { ...menu, path });
  }
  for (const route of getActivePrismRoutes()) {
    const defaultMenu: PrismMenuDestination = {
      id: route.id, name: route.name, subName: route.subName,
      path: route.path, basePath: route.path, emoji: route.icon,
      badge: '원스탑 추천경로', themeColor: route.themeColor,
      buttonClass: '', textClass: '', borderClass: '',
      keywords: [route.name, route.subName], intentRegex: /$^/,
      contextReason: route.description, tossTargetId: route.id,
    };
    if (!destinations.has(route.path)) destinations.set(route.path, defaultMenu);
    for (const [tab, name] of ONE_STOP_PAGE_TABS[route.path] || []) {
      const path = oneStopPageKey(route.path + '?tab=' + tab);
      if (!destinations.has(path)) destinations.set(path, { ...defaultMenu, id: route.id + '_' + tab, path, name, subName: name, keywords: [name] });
    }
  }
  // Lucy and KEY remain available through their dedicated gestures, outside the recommendation cycle.
  return [...destinations.values()].filter(menu => !['/', '/key'].includes(oneStopPageKey(menu.path).split('?')[0]));
}

/** Ignore tracking/device parameters; aliases share a visit, distinct tabs do not. */
export function oneStopPageKey(path: string): string {
  const canonical = resolveCanonicalPath(path);
  return normalizeOneStopPage(canonical);
}

export function getContextCycleState(): ContextRecommendationCycleState & OneStopState {
  let raw: unknown;
  try { raw = JSON.parse(safeLocalStorage.getItem(CONTEXT_CYCLE_STORAGE_KEY) || 'null'); } catch { /* Recover invalid storage. */ }
  const state = normalizeOneStopState(raw, getOneStopDestinations().map(menu => menu.path), path => isValidPrismPath(path) ? oneStopPageKey(path) : path);
  return {
    ...state, visitedAppIds: state.visitedPaths, visitedSubmenuIds: state.visitedPaths,
    lastVisitedAppId: null, lastVisitedSubmenuId: null, lastJumpTime: 0,
  };
}

export function saveContextCycleState(state: OneStopState): void {
  safeLocalStorage.setItem(CONTEXT_CYCLE_STORAGE_KEY, JSON.stringify(state));
}

// Recommendations are recomputed against persisted progress, so selection/context changes cannot bypass history.
export function resetActiveContextPeek(): void {}

let lastRecordedPage = '';

export function recordOneStopPageVisit(path: string): void {
  if (!isValidPrismPath(path)) return;
  const key = oneStopPageKey(path);
  lastRecordedPage = key;
  const state = getContextCycleState();
  if (getOneStopDestinations().some(menu => menu.path === key) && !state.visitedPaths.includes(key)) {
    saveContextCycleState({ cycleIndex: state.cycleIndex, visitedPaths: [...state.visitedPaths, key] });
  }
}

export function peekNextRecommendedMenuByCycle(currentLocation?: string, overrideContextText?: string): ContextNextMenuResult {
  const curr = currentLocation || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
  let current = isValidPrismPath(curr) ? oneStopPageKey(curr) : '';
  if (lastRecordedPage && lastRecordedPage.split('?')[0] === current.split('?')[0]) current = lastRecordedPage;
  const menus = getOneStopDestinations();
  const context = overrideContextText || extractAutoContextText(curr);
  const ranked = menus.map(menu => ({ menu, score: scoreMenuByContext(menu, context) }))
    .sort((a, b) => b.score - a.score);
  const state = getContextCycleState();
  const next = advanceOneStopCycle(state, menus.map(menu => menu.path), current, ranked.map(item => item.menu.path));
  const chosen = ranked.find(item => item.menu.path === next.destination)!;
  return {
    menu: chosen.menu, reason: chosen.menu.contextReason, score: chosen.score, safePath: next.destination,
    stats: {
      visitedCount: next.state.visitedPaths.length, totalCount: menus.length,
      remainingCount: menus.length - next.state.visitedPaths.length,
      cycleIndex: next.state.cycleIndex, isFullCycleCompleted: next.restarted,
      visitedAppIds: next.state.visitedPaths,
      currentAppId: getAppIdFromPath(curr), nextAppId: getAppIdFromMenu(chosen.menu),
    },
  };
}

export function commitNextRecommendedMenuByCycle(currentLocation?: string, overrideContextText?: string): ContextNextMenuResult {
  const result = peekNextRecommendedMenuByCycle(currentLocation, overrideContextText);
  saveContextCycleState({ cycleIndex: result.stats.cycleIndex, visitedPaths: result.stats.visitedAppIds });
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('prism:context_cycle_jump', {
    detail: { destination: result.menu, ...result.stats },
  }));
  return result;
}

export function getContextCycleStats(currentLocation?: string): ContextCycleStats {
  const state = getContextCycleState();
  const menus = getOneStopDestinations();
  const curr = currentLocation || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
  let key = isValidPrismPath(curr) ? oneStopPageKey(curr) : '';
  if (lastRecordedPage && lastRecordedPage.split('?')[0] === key.split('?')[0]) key = lastRecordedPage;
  const visited = new Set(state.visitedPaths);
  if (menus.some(menu => menu.path === key)) visited.add(key);
  return {
    visitedCount: visited.size, totalCount: menus.length, remainingCount: menus.length - visited.size,
    cycleIndex: state.cycleIndex, isFullCycleCompleted: visited.size === menus.length,
    visitedAppIds: [...visited], currentAppId: getAppIdFromPath(curr), nextAppId: '',
  };
}
