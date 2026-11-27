/**
 * 🧭 스마트 원클릭 가이드 (Smart Big Bang Guide)
 *
 * 사용자 지시(2026-11-27): "어플이 복잡해서 뭘 해야 될지 어려울때 빅뱅 버튼을 한번 탭하면
 * 가장 추천되는 곳으로 가이드 해주는 스마트 원클릭 가이드 기능을 넣어줘"
 *
 * - 빅뱅 버튼 **한 번 탭** = 지금 이 사람에게 가장 쓸모 있는 다음 목적지 하나로 이동하고,
 *   도착한 화면에 "무엇을 하면 되는지" 짧은 가이드 배너를 띄운다.
 * - **길게 누르기(홀드)** = 어디서든 오브페이지(/voice). (이 모듈과 무관, BigBangButton에서 처리)
 * - 더블 탭·상하좌우 방향 제스처는 손대지 않는다.
 *
 * 이 파일은 화면·DOM 없이도 그대로 시험할 수 있는 순수 계산 + 읽기/쓰기 어댑터만 담는다.
 * 경로는 전부 prismRouteRegistry에 실존하는 정식 경로만 쓴다.
 */

export type SmartGuideAction = 'profile' | 'divination' | 'lucy' | 'orb' | 'key' | 'lucky' | 'trinity';

export interface SmartGuideProfileState {
  /** 사주 프로필에 생년월일이 들어 있는지 */
  hasBirthday: boolean;
  /** 출생 시간까지 들어 있는지 (없어도 추천은 하되 안내 문구만 달라진다) */
  hasBirthTime: boolean;
}

export interface SmartGuideTodayState {
  /** 오늘의 타로를 이미 뽑았는지 */
  tarotSeen: boolean;
  /** 오늘 점술모드(루시프로)를 이미 봤는지 */
  divinationSeen: boolean;
}

export interface SmartGuideHistoryEntry {
  path: string;
  at: number;
}

export interface SmartGuideState {
  /** visits·masterSeenDate가 어느 날짜의 기록인지 (YYYY-MM-DD) */
  date: string;
  /** 오늘 화면별 마지막 방문 시각 */
  visits: Record<string, number>;
  /** 점술모드를 마지막으로 본 날짜 */
  masterSeenDate?: string;
  /** 스마트 가이드가 최근에 안내한 목적지 (오래된 것 → 최신) */
  history: SmartGuideHistoryEntry[];
}

export interface SmartGuideInput {
  /** 지금 화면 경로 (쿼리·해시 포함해도 된다) */
  cleanPath: string;
  /** 루시 점술모드(루시프로)가 켜져 있는지 */
  isMasterMode: boolean;
  /** 오브 상담이 열려 있는지 */
  isOrbOpen: boolean;
  /** 지금 화면이 루시 채팅인지 */
  isLucyChat: boolean;
  profile: SmartGuideProfileState;
  today: SmartGuideTodayState;
  state: SmartGuideState;
  now?: number;
}

export interface SmartGuideResult {
  /** 이동할 정식 경로 */
  path: string;
  action: SmartGuideAction;
  /** 배너 제목: "지금 추천: ○○" */
  title: string;
  /** 왜 추천하는지 한 줄 */
  reason: string;
  /** 도착한 곳에서 무엇을 하면 되는지 한 줄 */
  ctaHint: string;
  icon: string;
  /** 루시 점술모드를 켠 채로 가야 하는지 */
  needsProMode: boolean;
  /** 화면을 옮기지 않고 지금 자리에서 모드만 바꾸는지 */
  inPlace: boolean;
}

export type SmartGuideStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const SMART_GUIDE_STORAGE_KEY = 'luckey_smart_guide_v1';
/** 배너가 저절로 사라지기까지의 시간 */
export const SMART_GUIDE_TOAST_MS = 4000;
/** 최근 안내 이력은 이만큼만 남긴다 */
export const SMART_GUIDE_MAX_HISTORY = 6;
/** 같은 목적지가 연달아 나오지 않게 피할 최근 이력 수 */
export const SMART_GUIDE_AVOID_RECENT = 3;
/** 오늘 방문 기록은 이 개수까지만 남긴다 */
export const SMART_GUIDE_MAX_VISITS = 40;

/** 루시 채팅으로 보는 경로 (접힘·펼침·프로 페이지 포함) */
export const LUCY_CHAT_PATHS = ['/', '/chat', '/lucy', '/chat/pro'];

interface GuideStop {
  action: SmartGuideAction;
  path: string;
  title: string;
  reason: string;
  ctaHint: string;
  icon: string;
}

const STOPS: Record<SmartGuideAction, GuideStop> = {
  profile: {
    action: 'profile',
    path: '/profile',
    title: '사주 프로필',
    reason: '생년월일만 넣으면 사주·운세·타로 풀이가 훨씬 정확해져요.',
    ctaHint: '프로필에서 생년월일을 입력하고 저장해 주세요.',
    icon: '🎂',
  },
  divination: {
    action: 'divination',
    path: '/',
    title: '루시 점술모드',
    reason: '오늘 아직 운세를 안 봤어요. 오늘 흐름부터 짚어볼까요?',
    ctaHint: '들어가면 사주 원국·타로·13개 도구를 한자리에서 봐요.',
    icon: '🔮',
  },
  lucy: {
    action: 'lucy',
    path: '/',
    title: '루시와 대화',
    reason: '지금 마음에 걸리는 걸 말로 꺼내면 루시가 같이 봐 줘요.',
    ctaHint: '입력창에 고민을 한 줄만 적어도 충분해요.',
    icon: '💬',
  },
  orb: {
    action: 'orb',
    path: '/voice',
    title: '오브 음성 상담',
    reason: '타이핑 없이 말로 바로 상담하고 싶을 때 좋아요.',
    ctaHint: '주사위를 굴리거나 마스터를 고른 뒤 말을 걸어 보세요.',
    icon: '🌀',
  },
  key: {
    action: 'key',
    path: '/key',
    title: 'Key 마음 리추얼',
    reason: '마음이 복잡할 땐 1분이면 되는 실천 도구가 있어요.',
    ctaHint: '오감 도구함의 "1분 SOS 즉시 진정"부터 해 보세요.',
    icon: '🔑',
  },
  lucky: {
    action: 'lucky',
    path: '/lucky',
    title: 'Luckey 7대 채널',
    reason: '오늘 기분에 맞는 채널을 한눈에 골라 볼 수 있어요.',
    ctaHint: '7개 채널 카드 중 끌리는 곳을 눌러 들어가 보세요.',
    icon: '🍀',
  },
  trinity: {
    action: 'trinity',
    path: '/trinity',
    title: '트리니티 오라클',
    reason: '사주와 타로로 오늘을 한 장씩 비춰 볼 수 있어요.',
    ctaHint: '카드 세 장을 뽑아 오늘의 흐름을 읽어 보세요.',
    icon: '🃏',
  },
};

/** 루시 화면에서 다음으로 권할 곳: 같은 화면을 다시 권하지 않고 돌아가며 안내한다. */
const LUCY_CONTEXT_ORDER: SmartGuideAction[] = ['orb', 'key', 'lucky', 'trinity'];
/** 복잡한 채널·서브페이지에서 권할 핵심 기능 */
const CHANNEL_CONTEXT_ORDER: SmartGuideAction[] = ['lucy', 'orb', 'key', 'lucky'];

export const SMART_GUIDE_STOPS = STOPS;

/** 화면 경로에서 쿼리·해시·끝 슬래시를 걷어낸다 */
export function cleanGuidePath(raw: string | null | undefined): string {
  if (!raw) return '/';
  const path = String(raw).split('?')[0].split('#')[0].trim();
  if (!path) return '/';
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : '/';
}

/** 사용자 시간대 기준 YYYY-MM-DD */
export function guideDateKey(now: number = Date.now()): string {
  const date = new Date(now);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function emptySmartGuideState(now: number = Date.now()): SmartGuideState {
  return { date: guideDateKey(now), visits: {}, history: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 저장된 기록을 읽는다. 날짜가 바뀌었으면 오늘 기록만 남기고 새로 시작한다. */
export function readSmartGuideState(storage: SmartGuideStorage | null | undefined, now: number = Date.now()): SmartGuideState {
  const date = guideDateKey(now);
  const fresh = emptySmartGuideState(now);
  if (!storage) return fresh;
  let parsed: unknown = null;
  try {
    const raw = storage.getItem(SMART_GUIDE_STORAGE_KEY);
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    return fresh;
  }
  if (!isRecord(parsed)) return fresh;

  const state: SmartGuideState = {
    date,
    visits: {},
    history: [],
  };
  if (parsed.date === date && isRecord(parsed.visits)) {
    for (const [path, at] of Object.entries(parsed.visits)) {
      if (typeof at === 'number' && Number.isFinite(at)) state.visits[cleanGuidePath(path)] = at;
    }
  }
  if (typeof parsed.masterSeenDate === 'string') state.masterSeenDate = parsed.masterSeenDate;
  if (Array.isArray(parsed.history)) {
    state.history = parsed.history
      .filter((entry): entry is { path: string; at: number } => isRecord(entry) && typeof entry.path === 'string')
      .map(entry => ({ path: cleanGuidePath(entry.path), at: typeof entry.at === 'number' ? entry.at : 0 }))
      .slice(-SMART_GUIDE_MAX_HISTORY);
  }
  return state;
}

function writeSmartGuideState(storage: SmartGuideStorage | null | undefined, state: SmartGuideState): void {
  if (!storage) return;
  try {
    storage.setItem(SMART_GUIDE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* 저장 공간이 막혀도 화면 흐름은 계속된다 */
  }
}

/** 화면에 들어올 때마다 오늘 방문 기록(과 점술모드 사용)을 남긴다. */
export function recordSmartGuideVisit(
  storage: SmartGuideStorage | null | undefined,
  path: string,
  options: { masterMode?: boolean } = {},
  now: number = Date.now(),
): SmartGuideState {
  const state = readSmartGuideState(storage, now);
  const clean = cleanGuidePath(path);
  state.visits[clean] = now;
  if (options.masterMode) {
    state.masterSeenDate = state.date;
  }
  const entries = Object.entries(state.visits).sort((a, b) => b[1] - a[1]).slice(0, SMART_GUIDE_MAX_VISITS);
  state.visits = Object.fromEntries(entries);
  writeSmartGuideState(storage, state);
  return state;
}

/** 스마트 가이드가 안내한 목적지를 짧게 기억한다 (같은 곳만 맴돌지 않게). */
export function recordSmartGuideRecommendation(
  storage: SmartGuideStorage | null | undefined,
  path: string,
  now: number = Date.now(),
): SmartGuideState {
  const state = readSmartGuideState(storage, now);
  const clean = cleanGuidePath(path);
  state.history = [...state.history.filter(entry => entry.path !== clean), { path: clean, at: now }]
    .slice(-SMART_GUIDE_MAX_HISTORY);
  writeSmartGuideState(storage, state);
  return state;
}

/** 오늘의 타로를 이미 뽑았는지 (트리니티 저장 키) */
export function hasSeenTodayTarot(storage: SmartGuideStorage | null | undefined, now: number = Date.now()): boolean {
  if (!storage) return false;
  try {
    return Boolean(storage.getItem(`trinity_saved_daily_tarot_${guideDateKey(now)}`));
  } catch {
    return false;
  }
}

/** 가이드 도슨트가 읽을 문장 (배너의 이유 + 할 일을 그대로 말로) */
export function buildSmartGuideSpeech(guide: SmartGuideResult): string {
  const action = guide.inPlace ? '지금 이 화면에서' : `${guide.title}로`;
  return [
    `${action} 안내할게요.`,
    guide.reason,
    guide.ctaHint,
  ].join(' ');
}

function stopResult(stop: GuideStop, extra: Partial<SmartGuideResult> = {}): SmartGuideResult {
  return {
    path: stop.path,
    action: stop.action,
    title: stop.title,
    reason: stop.reason,
    ctaHint: stop.ctaHint,
    icon: stop.icon,
    needsProMode: stop.action === 'divination',
    inPlace: false,
    ...extra,
  };
}

/**
 * 지금 이 화면·이 사람에게 가장 쓸모 있는 다음 한 곳을 고른다.
 * 1) 생년월일이 없으면 프로필부터
 * 2) 오늘 아직 점술모드를 안 봤으면 루시 점술모드 (루시 화면이면 이 자리에서 모드만 켠다)
 * 3) 루시 화면·점술모드에서는 오브 → Key → Luckey → 트리니티 순환
 * 4) 그 밖의 복잡한 채널·서브페이지에서는 루시 → 오브 → Key → Luckey 순환
 * 언제나 지금 서 있는 곳은 후보에서 빼고, 최근에 안내한 곳은 가능하면 피한다.
 */
export function resolveSmartBigBangGuide(input: SmartGuideInput): SmartGuideResult {
  const now = input.now ?? Date.now();
  const current = cleanGuidePath(input.cleanPath);
  const today = guideDateKey(now);
  const history = (input.state?.history ?? []).map(entry => cleanGuidePath(entry.path));
  const recent = new Set(history.slice(-SMART_GUIDE_AVOID_RECENT));

  const todayTarot = Boolean(input.today?.tarotSeen);
  const seenDivinationToday =
    Boolean(input.isMasterMode) ||
    Boolean(input.today?.divinationSeen) ||
    input.state?.masterSeenDate === today;

  // 1) 사주 프로필의 생년월일이 비어 있으면 무엇보다 먼저
  if (!input.profile?.hasBirthday && current !== STOPS.profile.path) {
    return stopResult(STOPS.profile);
  }

  // 2) 프로필이 있고 오늘 아직 점술모드/운세를 안 봤으면 루시 점술모드
  if (input.profile?.hasBirthday && !input.isMasterMode && !seenDivinationToday && !todayTarot) {
    if (input.isLucyChat || LUCY_CHAT_PATHS.includes(current)) {
      // 이미 루시와 대화 중이면 화면을 옮기지 않고 그 자리에서 점술모드로 바꾼다.
      return stopResult(STOPS.divination, {
        inPlace: true,
        ctaHint: '지금 대화창이 점술모드로 바뀌어요. 오늘 흐름부터 물어보세요.',
      });
    }
    return stopResult(STOPS.divination);
  }

  // 3·4) 지금 화면을 뺀 나머지에서, 최근 안내한 곳을 피해 고른다.
  const lucyContext = Boolean(input.isLucyChat) || input.isMasterMode || LUCY_CHAT_PATHS.includes(current);
  const order = lucyContext ? LUCY_CONTEXT_ORDER : CHANNEL_CONTEXT_ORDER;
  const candidates = order
    .map(action => STOPS[action])
    .filter(stop => stop.path !== current);
  if (candidates.length) {
    const fresh = candidates.filter(stop => !recent.has(stop.path));
    return stopResult((fresh.length ? fresh : candidates)[0]);
  }

  // 어떤 이유로든 후보가 비면 루시로 (지금 루시라면 오브로)
  return stopResult(current === STOPS.orb.path ? STOPS.lucy : STOPS.orb);
}
