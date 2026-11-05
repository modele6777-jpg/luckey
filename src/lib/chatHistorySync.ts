import { type LucyTarotDraw } from './lucyTarotIntegrity';
/**
 * =========================================================================
 * PRISM & LUCY PRO: 통합 대화 기록 동기화 & 일일 초기화 엔진 (Smart Chat Sync)
 * =========================================================================
 * - 대화창은 하루 단위(자정 기준)로 초기화되며, 이전 날짜의 메시지가 백업이나 클라우드에서
 *   다시 섞여 들어오지 않도록 오늘 날짜(isTimestampToday) 메시지만 유지합니다.
 * - 루시 인사말은 매일 '처음' 루시채팅에 들어갈 때만 표시·낭독됩니다.
 */

import { safeLocalStorage } from '../utils/safeStorage';
import { getTodayDateKey, isTimestampToday } from './dailyCache';

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
      text.includes('나랑 가볍게 수다 떨자! 💬✨')
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

/**
 * 기본 환영 메시지 생성자 (매일 처음 루시채팅 들어갈 때만 표시)
 */
export function createDefaultGreeting(targetPersona: PersonaType = 'lucy', userName?: string, isMaster = false): UnifiedMessage {
  const nick = userName || getSavedNickname();
  const nameLabel = nick && nick !== '여행자' ? `${nick}! ` : '';
  const todayKey = getTodayDateKey();
  if (isMaster) {
    return {
      id: `greet-${todayKey}`,
      role: 'model',
      content: `안녕, ${nameLabel}루시 플러스 15대 운명학 올인원 마스터 모드야. 7대 테마와 동서양 15가지 운명학 도구를 전원 총동원해서 깊이 있는 통찰과 해답을 풀어줄게. 어떤 고민이든 편하게 물어봐! 👑🔮`,
      timestamp: Date.now(),
      persona: targetPersona,
      mode: 'master',
      channels: ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'],
      usedTools: ['사주명리', '점성술', '자미두수', '타로', '숙요점성술', '마하보테', '베딕점성술', '육임', '홍국기문', '카발라', '주역', '태국점성술', '토정비결', '구성학', '태을신수'],
    };
  }
  return {
    id: `greet-${todayKey}`,
    role: 'model',
    content: `안녕, ${nameLabel}오늘 하루는 어땠어? ㅎㅎ 사소한 일상 이야기나 오늘 있었던 일, 나누고 싶은 생각 뭐든 편하게 들려줘. 언제든 친구처럼 다정하게 수다 떨 준비되어 있어! 💬✨`,
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
  return messages.some((m) => m.role === 'user' && !!m.content && isMessageFromToday(m));
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
  const cleanPrimary = (Array.isArray(primary) ? primary : []).filter(
    (m) => !isErrorMessage(m) && !isEmptyPlaceholder(m) && isMessageFromToday(m)
  );
  const cleanIncoming = (Array.isArray(incoming) ? incoming : []).filter(
    (m) => !isErrorMessage(m) && !isEmptyPlaceholder(m) && isMessageFromToday(m)
  );

  const hasPrimaryUser = hasRealUserConversation(cleanPrimary);
  const hasIncomingUser = hasRealUserConversation(cleanIncoming);

  // 오늘 실제 유저 대화가 아직 없는 경우: 항상 기본 루시 인사말 표시
  if (!hasPrimaryUser && !hasIncomingUser) {
    if (cleanPrimary.length > 0) return cleanPrimary;
    if (cleanIncoming.length > 0) return cleanIncoming;
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
        id: existing.id || msg.id,
        timestamp: existing.timestamp || msg.timestamp,
        persona: msg.persona || existing.persona,
        role: existing.role || msg.role,
        channel: msg.channel || existing.channel,
        channels: (Array.isArray(msg.channels) && msg.channels.length > 0) ? msg.channels : existing.channels,
        mode: msg.mode || existing.mode,
        usedTools: msg.usedTools || existing.usedTools,
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
export function loadSavedUnifiedMessages(): UnifiedMessage[] {
  try {
    // 1. Primary V3
    const savedV3 = safeLocalStorage.getItem(STORAGE_KEYS.PRIMARY_V3);
    if (savedV3) {
      const parsed = JSON.parse(savedV3);
      if (Array.isArray(parsed)) {
        const todayOnly = parsed.filter((m) => !isErrorMessage(m) && isMessageFromToday(m));
        if (todayOnly.length > 0) {
          return todayOnly;
        }
      }
    }

    // 2. Backup V3 (오늘 대화만 허용)
    const savedBackup = safeLocalStorage.getItem(STORAGE_KEYS.BACKUP_V3);
    if (savedBackup) {
      const parsed = JSON.parse(savedBackup);
      if (Array.isArray(parsed)) {
        const todayOnly = parsed.filter((m) => !isErrorMessage(m) && isMessageFromToday(m));
        if (todayOnly.length > 0) {
          return todayOnly;
        }
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
                if (!isErrorMessage(m) && !isGreetingMessage(m) && isMessageFromToday(m)) {
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
    const todayFiltered = messages.filter((m) => !isErrorMessage(m) && isMessageFromToday(m));
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
