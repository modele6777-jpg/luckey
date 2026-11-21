import type { CalculationAuditItem } from './divination/calculationAudit';
import { mergeLucyTarotDraw, type LucyTarotDraw } from './lucyTarotIntegrity';
import { ALL_DCE_ENGINES } from './divination/deterministicEngine';
import { LUCY_PRO_CATALOG_DUPLICATE_KEYS } from './divination/catalogDuplicateKeys';
/**
 * =========================================================================
 * PRISM & LUCY PRO: 통합 대화 기록 동기화 & 일일 초기화 엔진 (Smart Chat Sync)
 * =========================================================================
 * - 대화창은 하루 단위(자정 기준)로 초기화되며, 이전 날짜의 메시지가 백업이나 클라우드에서
 *   다시 섞여 들어오지 않도록 오늘 날짜(isTimestampToday) 메시지만 유지합니다.
 * - 루시 인사말은 매일 '처음' 루시채팅에 들어갈 때만 표시·낭독됩니다.
 */

import { safeLocalStorage } from '../utils/safeStorage';
import { getLucyChatDay as getTodayDateKey, isLucyTimestampToday as isTimestampToday, formatLucyChatDay } from './lucyChatDay';
import { getLucyDayPeriod } from './lucyDayTheme';
import { rememberChatDays } from './dailyChatMemoryStore';

export type PersonaType = 'lucy' | 'orange' | 'trinity' | 'aura' | 'bluebird' | 'muse';

export interface UnifiedMessage {
  tarotDraw?: LucyTarotDraw;
  id?: string;
  role: 'system' | 'user' | 'model' | 'assistant';
  content: string | any[];
  timestamp?: number;
  persona?: PersonaType;
  channel?: string;
  channels?: string[];
  mode?: string;
  usedTools?: string[];
  calculationAudit?: CalculationAuditItem[];
  divinationContext?: string;
}

export const STORAGE_KEYS = {
  PRIMARY_V3: 'chat_history_unified_v3',
  BACKUP_V3: 'chat_history_unified_backup',
  LEGACY_OBJECT: 'chat_history_unified',
  LEGACY_LUCY: 'chat_history_lucy',
  DAILY_FIRST_ENTRY_DATE: 'lucy_daily_first_entry_date_v1',
  DAILY_FIRST_VISIT_DONE_DATE: 'lucy_daily_first_visit_done_date_v1',
  DAILY_GREETING_SPOKEN_DATE: 'lucy_daily_greeting_spoken_date_v1',
};

function getSavedNickname(): string {
  try {
    const saved = safeLocalStorage.getItem('userProfile');
    if (saved) {
      const parsed = JSON.parse(saved);
      const nick = parsed?.basic?.nickname?.trim() || parsed?.basic?.name?.trim();
      if (nick && nick !== '여행자' && nick !== '사용자' && nick !== '박주형') return nick;
    }
  } catch (_) {}
  return '제제';
}

/**
 * 오늘 이미 루시채팅에 처음 진입했는지 여부 확인
 */
const dailyScopeKey = (key: string, scope: 'lucy' | 'lucy-pro') => scope === 'lucy-pro' ? `${key}:pro` : key;

export function hasEnteredLucyChatToday(scope: 'lucy' | 'lucy-pro' = 'lucy'): boolean {
  try {
    return safeLocalStorage.getItem(dailyScopeKey(STORAGE_KEYS.DAILY_FIRST_ENTRY_DATE, scope)) === getTodayDateKey();
  } catch (_) {
    return false;
  }
}

/**
 * 오늘 루시채팅 첫 진입 기록
 */
export function markLucyChatEnteredToday(scope: 'lucy' | 'lucy-pro' = 'lucy'): void {
  try {
    safeLocalStorage.setItem(dailyScopeKey(STORAGE_KEYS.DAILY_FIRST_ENTRY_DATE, scope), getTodayDateKey());
  } catch (_) {}
}

/**
 * 오늘 루시채팅의 첫 방문(인사말 노출 세션)이 이미 완료되었는지 여부
 */
export function hasCompletedFirstLucyVisitToday(scope: 'lucy' | 'lucy-pro' = 'lucy'): boolean {
  try {
    return safeLocalStorage.getItem(dailyScopeKey(STORAGE_KEYS.DAILY_FIRST_VISIT_DONE_DATE, scope)) === getTodayDateKey();
  } catch (_) {
    return false;
  }
}

/**
 * 오늘 루시채팅 첫 방문 완료 기록 (이후 재진입 시 인사말 미노출)
 */
export function markFirstLucyVisitCompletedToday(scope: 'lucy' | 'lucy-pro' = 'lucy'): void {
  try {
    const today = getTodayDateKey();
    safeLocalStorage.setItem(dailyScopeKey(STORAGE_KEYS.DAILY_FIRST_ENTRY_DATE, scope), today);
    safeLocalStorage.setItem(dailyScopeKey(STORAGE_KEYS.DAILY_FIRST_VISIT_DONE_DATE, scope), today);
  } catch (_) {}
}

/**
 * 오늘 인사말 TTS가 이미 재생되었는지 여부
 */
export function hasSpokenDailyGreetingToday(scope: 'lucy' | 'lucy-pro' = 'lucy'): boolean {
  try {
    return safeLocalStorage.getItem(dailyScopeKey(STORAGE_KEYS.DAILY_GREETING_SPOKEN_DATE, scope)) === getTodayDateKey();
  } catch (_) {
    return false;
  }
}

/**
 * 오늘 인사말 TTS 재생 완료 기록
 */
export function markDailyGreetingSpokenToday(scope: 'lucy' | 'lucy-pro' = 'lucy'): void {
  try {
    safeLocalStorage.setItem(dailyScopeKey(STORAGE_KEYS.DAILY_GREETING_SPOKEN_DATE, scope), getTodayDateKey());
  } catch (_) {}
}

/**
 * 메시지가 인사말(greet) 메시지인지 판별
 */
export function isGreetingMessage(m: UnifiedMessage | null | undefined): boolean {
  if (!m) return false;
  if (m.role === 'user') return false;
  const id = String(m.id || '');
  if (id === 'greet' || id === 'greet-main' || id.startsWith('greet-')) return true;
  if (typeof m.content === 'string') {
    const text = m.content.trim();
    if (
      text.includes("통합 AI 마스터 가이드 '루시'야") ||
      text.includes('언제든 친구처럼 다정하게 수다 떨 준비되어 있어') ||
      text.includes('나랑 가볍게 수다 떨자! 💬✨') ||
      text.includes('올인원 마스터 모드야') ||
      text.includes('마스터 모드야')
    ) {
      return true;
    }
  }
  return false;
}

/**
 * 메시지가 오늘(자정 이후) 생성된 메시지인지 판별
 */
export function isMessageFromToday(m: UnifiedMessage | null | undefined): boolean {
  if (!m) return false;
  const todayKey = getTodayDateKey();
  const id = String(m.id || '');
  if (id.startsWith('greet-') && id !== 'greet-main') {
    return id === `greet-${todayKey}`;
  }
  if (m.timestamp && typeof m.timestamp === 'number') {
    return isTimestampToday(m.timestamp);
  }
  const lastSessionDate = safeLocalStorage.getItem('lucy_chat_session_date_v1');
  return lastSessionDate === todayKey;
}

/** The visible Lucy thread is the latest saved exchange, not only the current calendar day. */
export const RECENT_CONVERSATION_LIMIT = 80;

export function messageTime(message: UnifiedMessage | null | undefined): number {
  const timestamp = message?.timestamp as unknown;
  if (typeof timestamp === 'number' && Number.isFinite(timestamp)) return timestamp;
  if (typeof timestamp === 'string' && timestamp.trim() && Number.isFinite(Number(timestamp))) return Number(timestamp);
  if (timestamp && typeof timestamp === 'object') {
    const record = timestamp as { seconds?: number; toMillis?: () => number; toDate?: () => Date };
    if (typeof record.toMillis === 'function') {
      const millis = record.toMillis();
      if (Number.isFinite(millis)) return millis;
    }
    if (typeof record.seconds === 'number') return record.seconds * 1000;
    if (typeof record.toDate === 'function') {
      const date = record.toDate();
      if (date instanceof Date && Number.isFinite(date.getTime())) return date.getTime();
    }
  }
  return 0;
}

export function isVisibleConversationMessage(m: UnifiedMessage | null | undefined, now = Date.now()): boolean {
  if (!m || isErrorMessage(m) || isEmptyPlaceholder(m)) return false;
  if (isGreetingMessage(m)) return isMessageFromToday({ ...m, timestamp: messageTime(m) || m.timestamp });
  const time = messageTime(m);
  if (!time) return isMessageFromToday(m);
  return time <= now + 60_000 && formatLucyChatDay(new Date(time)) === getTodayDateKey(now);
}

export function retainRecentConversation(
  messages: UnifiedMessage[] | null | undefined,
  now = Date.now(),
  preserveAssistantOnly = false,
): UnifiedMessage[] {
  const source = Array.isArray(messages) ? messages : [];
  rememberChatDays(source);
  const visible = source
    .filter((message) => isVisibleConversationMessage(message, now))
    .map((message) => {
      const time = messageTime(message);
      return time && time !== message.timestamp ? { ...message, timestamp: time } : message;
    })
    .sort((a, b) => messageTime(a) - messageTime(b));
  const greeting = visible.find((message) => isGreetingMessage(message));
  const conversation = visible.filter((message) => !isGreetingMessage(message)).slice(-RECENT_CONVERSATION_LIMIT);
  if (!preserveAssistantOnly && !conversation.some((message) => message.role === 'user' && message.content)) {
    return greeting ? [greeting] : [];
  }
  return greeting ? [greeting, ...conversation] : conversation;
}

/**
 * 기본 환영 메시지 생성자 (매일 처음 루시채팅 들어갈 때만 표시)
 */
export function createDefaultGreeting(
  targetPersona: PersonaType = 'lucy',
  userName?: string,
  isMaster = false,
  isPlus = false,
  now = new Date()
): UnifiedMessage {
  const nick = userName || getSavedNickname();
  const localHour = now.getHours();
  const timeGreeting = getLucyDayPeriod(now) === 'morning'
    ? '좋은 아침'
    : getLucyDayPeriod(now) === 'day'
      ? '안녕'
      : localHour >= 18 && localHour < 22
        ? '좋은 저녁'
        : '늦은 시간에도 반가워';
  const nameSuffix = nick && nick !== '여행자' ? `, ${nick}` : '';
  const greetingLead = `${timeGreeting}${nameSuffix}!`;
  const todayKey = getTodayDateKey();
  const visibleCatalogEngines = ALL_DCE_ENGINES.filter(engine => !LUCY_PRO_CATALOG_DUPLICATE_KEYS.has(engine.key));
  const engineCount = visibleCatalogEngines.length;
  // 👑 프로 모드에서는 등록된 카탈로그 중 질문에 맞는 관점과 계산 결과를 선별합니다.
  if (isMaster) {
    return {
      id: `greet-${todayKey}`,
      role: 'model',
      content: `${greetingLead} 루시 프로의 ${engineCount}개 카탈로그를 바탕으로 7대 테마 중 질문에 맞는 관점과 실제 계산 결과를 선별해 함께 살펴볼게. 어떤 고민이든 편하게 물어봐! 👑🔮`,
      timestamp: Date.now(),
      persona: targetPersona,
      mode: 'master',
      channels: ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'],
    };
  }
  if (isPlus) {
    return {
      id: `greet-${todayKey}`,
      role: 'model',
      content: `${greetingLead} 오늘 하루는 어땠어? ㅎㅎ 사소한 일상 이야기나 오늘 있었던 일, 나누고 싶은 생각 뭐든 편하게 들려줘. 좌측 화면을 보면서 언제든 다정하게 수다 떨 준비되어 있어! 💬✨`,
      timestamp: Date.now(),
      persona: targetPersona,
      mode: 'casual',
      channels: [],
    };
  }
  return {
    id: `greet-${todayKey}`,
    role: 'model',
    content: `${greetingLead} 오늘 하루는 어땠어? ㅎㅎ 사소한 일상 이야기나 오늘 있었던 일, 나누고 싶은 생각 뭐든 편하게 들려줘. 언제든 친구처럼 다정하게 수다 떨 준비되어 있어! 💬✨`,
    timestamp: Date.now(),
    persona: targetPersona,
    mode: 'casual',
    channels: [],
  };
}

/**
 * 메시지 목록에 실제 사용자의 오늘 대화가 포함되어 있는지 검증
 */
export function hasRealUserConversation(messages: UnifiedMessage[] | null | undefined): boolean {
  if (!Array.isArray(messages) || messages.length === 0) return false;
  return messages.some((m) => m.role === 'user' && !!m.content && isVisibleConversationMessage(m));
}

/**
 * 레거시 에러 메시지 필터
 */
function isErrorMessage(m: UnifiedMessage): boolean {
  if (!m || !m.content) return false;
  const str = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
  return str.includes('[AI 응답 지연]') || str.includes('API_KEY_INVALID') || str.includes('Error in sendUnifiedMessage');
}

/**
 * 고유 메시지 시그니처 생성 (ID 또는 타임스탬프+역할+내용 기반 중복 제거)
 */
function getMessageSignature(m: UnifiedMessage): string {
  if (m.id) {
    return String(m.id);
  }
  const contentStr = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
  const time = Math.floor(Number(m.timestamp || 0) / 1000);
  return `${m.role}_${time}_${contentStr.slice(0, 50)}`;
}

function getMessageFallbackKey(m: UnifiedMessage): string {
  const contentStr = typeof m.content === 'string' ? m.content.trim() : JSON.stringify(m.content);
  const time = Math.floor(Number(m.timestamp || 0) / 3000);
  return `${m.role}_${time}_${contentStr.slice(0, 80)}`;
}

function isEmptyPlaceholder(m: UnifiedMessage): boolean {
  if (!m) return true;
  if (m.role === 'model' || m.role === 'assistant') {
    if (!m.content) return true;
    if (typeof m.content === 'string' && m.content.trim() === '') return true;
  }
  return false;
}

/**
 * 두 개 이상의 대화 기록 목록을 스마트하게 병합 (Smart Deduplicating Merge)
 * - 오늘 날짜(isMessageFromToday)가 아닌 과거 메시지는 철저히 필터링하여 일일 초기화 보장
 * - 실제 대화가 존재하거나 이미 오늘 첫 루시채팅 방문을 마친 경우 단독 인사말(greet-*) 제거
 */
export function mergeUnifiedMessages(
  primary: UnifiedMessage[],
  incoming: UnifiedMessage[]
): UnifiedMessage[] {
  const cleanPrimary = retainRecentConversation(primary, Date.now(), true);
  const cleanIncoming = retainRecentConversation(incoming, Date.now(), true);

  const hasPrimaryUser = hasRealUserConversation(cleanPrimary);
  const hasIncomingUser = hasRealUserConversation(cleanIncoming);

  // 오늘 실제 유저 대화가 아직 없는 경우: 항상 기본 루시 인사말 표시
  if (!hasPrimaryUser && !hasIncomingUser && cleanPrimary.length === 0 && cleanIncoming.length === 0) {
    return [createDefaultGreeting()];
  }

  // 병합용 맵
  const map = new Map<string, UnifiedMessage>();
  const fallbackToKey = new Map<string, string>();
  let greetingKept: UnifiedMessage | null = null;

  [...cleanPrimary, ...cleanIncoming].forEach((msg) => {
    if (isGreetingMessage(msg)) {
      if (!greetingKept) {
        greetingKept = msg;
      }
      return;
    }

    const sig = getMessageSignature(msg);
    const fbKey = getMessageFallbackKey(msg);

    let targetKey = map.has(sig) ? sig : null;
    if (!targetKey && fallbackToKey.has(fbKey)) {
      targetKey = fallbackToKey.get(fbKey) || null;
    }

    if (!targetKey) {
      map.set(sig, msg);
      fallbackToKey.set(fbKey, sig);
    } else {
      const existing = map.get(targetKey)!;
      const hasContent = (c: any) => c && (typeof c !== 'string' || c.trim() !== '');
      const preferredContent = hasContent(msg.content) ? msg.content : existing.content;

      map.set(targetKey, {
        ...existing,
        ...msg,
        content: preferredContent,
        tarotDraw: mergeLucyTarotDraw(existing.tarotDraw, msg.tarotDraw),
        id: existing.id || msg.id,
        timestamp: existing.timestamp || msg.timestamp,
        persona: msg.persona || existing.persona,
        role: existing.role || msg.role,
        channel: msg.channel || existing.channel,
        channels: (Array.isArray(msg.channels) && msg.channels.length > 0) ? msg.channels : existing.channels,
        mode: msg.mode || existing.mode,
        usedTools: msg.usedTools || existing.usedTools,
        calculationAudit: msg.calculationAudit || existing.calculationAudit,
        divinationContext: msg.divinationContext || existing.divinationContext,
      });
    }
  });

  const merged = Array.from(map.values());
  merged.sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));

  if (greetingKept) {
    const firstTs = merged.length > 0 ? Number(merged[0].timestamp || Date.now()) : Date.now();
    const greetMsg: UnifiedMessage = {
      ...(greetingKept as UnifiedMessage),
      timestamp: Math.min(Number((greetingKept as UnifiedMessage).timestamp || firstTs), firstTs - 1000),
    };
    return [greetMsg, ...merged];
  }

  if (merged.length > 0) return merged;
  return [createDefaultGreeting()];
}

/**
 * 로컬스토리지에서 오늘의 대화 기록만 복원 (대화 기록이 없으면 기본 루시 인사말 반환)
 */
/** Restore newly saved messages even when the stored/current counts are equal.
 * Current overlapping messages win so an in-flight streamed reply cannot regress. */
export function restoreLatestConversation(current: UnifiedMessage[], saved: UnifiedMessage[]): UnifiedMessage[] {
  const merged = retainRecentConversation(mergeUnifiedMessages(saved, current), Date.now(), true);
  if (merged.length === current.length && merged.every((message, index) =>
    message === current[index] || JSON.stringify(message) === JSON.stringify(current[index]))) return current;
  return merged;
}

export function loadSavedUnifiedMessages(): UnifiedMessage[] {
  try {
    // 1. Primary V3
    const savedV3 = safeLocalStorage.getItem(STORAGE_KEYS.PRIMARY_V3);
    if (savedV3) {
      const parsed = JSON.parse(savedV3);
      if (Array.isArray(parsed)) {
        const recent = retainRecentConversation(parsed, Date.now(), true);
        if (recent.length > 0) return recent;
      }
    }

    // 2. Backup V3 (최근 대화만 허용)
    const savedBackup = safeLocalStorage.getItem(STORAGE_KEYS.BACKUP_V3);
    if (savedBackup) {
      const parsed = JSON.parse(savedBackup);
      if (Array.isArray(parsed)) {
        const recent = retainRecentConversation(parsed, Date.now(), true);
        if (recent.length > 0) return recent;
      }
    }

    // 3. Legacy Object structure (오늘 대화만 허용)
    const savedOld = safeLocalStorage.getItem(STORAGE_KEYS.LEGACY_OBJECT);
    if (savedOld) {
      const parsedOld = JSON.parse(savedOld);
      if (typeof parsedOld === 'object' && parsedOld !== null) {
        let allMsgs: UnifiedMessage[] = [];
        if (Array.isArray(parsedOld)) {
          allMsgs = parsedOld;
        } else {
          Object.entries(parsedOld).forEach(([personaKey, msgs]) => {
            if (Array.isArray(msgs)) {
              msgs.forEach((m: UnifiedMessage) => {
                if (isVisibleConversationMessage(m) && !isGreetingMessage(m)) {
                  allMsgs.push({
                    ...m,
                    persona: (m.persona || personaKey) as PersonaType,
                  });
                }
              });
            }
          });
        }
        if (hasRealUserConversation(allMsgs)) {
          allMsgs.sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));
          return allMsgs;
        }
      }
    }
  } catch (e) {
    console.error('[ChatSync] Failed to load chat history:', e);
  }

  return [createDefaultGreeting()];
}

/**
 * 대화 기록을 로컬스토리지 및 백업 키들에 안전하게 동기화 저장
 * (빈 배열이거나 초기화된 상태도 백업 키에 즉시 반영하여 과거 날짜 대화가 부활하는 현상 차단)
 */
export function saveUnifiedMessagesSafely(messages: UnifiedMessage[]): void {
  if (!Array.isArray(messages)) return;

  try {
    const todayFiltered = retainRecentConversation(messages);
    const jsonStr = JSON.stringify(todayFiltered);
    safeLocalStorage.setItem(STORAGE_KEYS.PRIMARY_V3, jsonStr);
    safeLocalStorage.setItem(STORAGE_KEYS.BACKUP_V3, jsonStr);
    safeLocalStorage.setItem('prism_unified_chat_history', jsonStr);

    safeLocalStorage.setItem(STORAGE_KEYS.LEGACY_OBJECT, JSON.stringify({
      lucy: todayFiltered,
      orange: todayFiltered,
      trinity: todayFiltered,
      aura: todayFiltered,
      bluebird: todayFiltered,
      muse: todayFiltered,
    }));
  } catch (e) {
    console.warn('[ChatSync] Failed to save messages to storage:', e);
  }
}

/**
 * 사용자가 수동으로 대화 기록을 초기화할 때 스토리지를 비우고 기본 루시 인사말로 복원
 */
export function forceResetUnifiedChatHistory(
  targetPersona: PersonaType = 'lucy',
  userName?: string
): UnifiedMessage[] {
  markFirstLucyVisitCompletedToday();
  markDailyGreetingSpokenToday();
  const defaultList: UnifiedMessage[] = [createDefaultGreeting(targetPersona, userName)];
  const jsonStr = JSON.stringify(defaultList);
  try {
    safeLocalStorage.setItem(STORAGE_KEYS.PRIMARY_V3, jsonStr);
    safeLocalStorage.setItem(STORAGE_KEYS.BACKUP_V3, jsonStr);
    safeLocalStorage.setItem('prism_unified_chat_history', jsonStr);
    safeLocalStorage.setItem(STORAGE_KEYS.LEGACY_OBJECT, JSON.stringify({
      lucy: defaultList,
      orange: defaultList,
      trinity: defaultList,
      aura: defaultList,
      bluebird: defaultList,
      muse: defaultList,
    }));
    safeLocalStorage.removeItem(STORAGE_KEYS.LEGACY_LUCY);
  } catch (e) {
    console.warn('[ChatSync] Failed to force reset chat history in storage:', e);
  }
  return defaultList;
}
