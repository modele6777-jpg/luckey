/**
 * =========================================================================
 * PRISM & LUCY PRO: 통합 대화 기록 동기화 & 영구 보존 엔진 (Smart Chat Sync)
 * =========================================================================
 * 프리즘 루시 채팅과 루시 프로(Standalone) 간의 전환 시 발생할 수 있는
 * 대화 내역 초기화 및 유실을 100% 원천 차단하고,
 * 로컬스토리지, 브로드캐스트 채널, Firestore 클라우드를 스마트 머지(Smart Merge)합니다.
 */

import { safeLocalStorage } from '../utils/safeStorage';

export type PersonaType = 'lucy' | 'orange' | 'trinity' | 'aura' | 'bluebird' | 'muse';

export interface UnifiedMessage {
  id?: string;
  role: 'system' | 'user' | 'model' | 'assistant';
  content: string | any[];
  timestamp?: number;
  persona?: PersonaType;
  channel?: string;
  channels?: string[];
  mode?: string;
}

export const STORAGE_KEYS = {
  PRIMARY_V3: 'chat_history_unified_v3',
  BACKUP_V3: 'chat_history_unified_backup',
  LEGACY_OBJECT: 'chat_history_unified',
  LEGACY_LUCY: 'chat_history_lucy'
};

function getSavedNickname(): string {
  try {
    const saved = safeLocalStorage.getItem('userProfile');
    if (saved) {
      const parsed = JSON.parse(saved);
      const nick = parsed?.basic?.nickname?.trim() || parsed?.basic?.name?.trim();
      if (nick && nick !== '여행자') return nick;
    }
  } catch (_) {}
  return '제제';
}

/**
 * 기본 환영 메시지 생성자 (수다 모드 친근한 구어체)
 */
export function createDefaultGreeting(targetPersona: PersonaType = 'lucy', userName?: string): UnifiedMessage {
  const nick = userName || getSavedNickname();
  const nameLabel = nick && nick !== '여행자' ? `${nick}! ` : '';
  return {
    id: 'greet-main',
    role: 'model',
    content: `안녕, ${nameLabel}오늘 하루는 어땠어? ㅎㅎ 사소한 일상 이야기나 오늘 있었던 일, 나누고 싶은 생각 뭐든 편하게 들려줘. 언제든 친구처럼 다정하게 수다 떨 준비되어 있어! 💬✨`,
    timestamp: Date.now(),
    persona: targetPersona,
    mode: 'casual',
    channels: [],
  };
}

/**
 * 메시지 목록에 실제 사용자의 대화가 포함되어 있는지 검증
 */
export function hasRealUserConversation(messages: UnifiedMessage[] | null | undefined): boolean {
  if (!Array.isArray(messages) || messages.length === 0) return false;
  return messages.some((m) => m.role === 'user' && !!m.content);
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
  const time = Math.floor(Number(m.timestamp || 0) / 1000); // 1초 단위 노멀라이즈
  return `${m.role}_${time}_${contentStr.slice(0, 50)}`;
}

/**
 * 두 개 이상의 대화 기록 목록을 스마트하게 병합 (Smart Deduplicating Merge)
 * - 실제 대화가 존재할 경우 불필요한 단독 인사말(greet-main, greet-*) 제거
 * - 타임스탬프 순서 보장
 * - 빈 목록이나 greet-main 단독 목록으로 기존 대화가 덮어씌워지는 것 완벽 방지
 */
export function mergeUnifiedMessages(
  primary: UnifiedMessage[],
  incoming: UnifiedMessage[]
): UnifiedMessage[] {
  const cleanPrimary = (Array.isArray(primary) ? primary : []).filter((m) => !isErrorMessage(m));
  const cleanIncoming = (Array.isArray(incoming) ? incoming : []).filter((m) => !isErrorMessage(m));

  const hasPrimaryUser = hasRealUserConversation(cleanPrimary);
  const hasIncomingUser = hasRealUserConversation(cleanIncoming);

  // 둘 다 유효한 대화가 없고 하나만 greet가 있는 경우
  if (!hasPrimaryUser && !hasIncomingUser) {
    if (cleanPrimary.length > 0) return cleanPrimary;
    if (cleanIncoming.length > 0) return cleanIncoming;
    return [createDefaultGreeting()];
  }

  // 병합용 맵
  const map = new Map<string, UnifiedMessage>();

  // 유저 대화가 있을 때는 순수 greet-main / greet-*은 제외하고 병합
  const shouldFilterGreet = hasPrimaryUser || hasIncomingUser;

  [...cleanPrimary, ...cleanIncoming].forEach((msg) => {
    if (shouldFilterGreet && (msg.id === 'greet-main' || msg.id === 'greet' || msg.id?.startsWith('greet-'))) {
      return;
    }
    const sig = getMessageSignature(msg);
    if (!map.has(sig)) {
      map.set(sig, msg);
    } else {
      // 기존 메시지보다 더 상세한 정보(예: persona, id 등)가 있다면 업데이트
      const existing = map.get(sig)!;
      map.set(sig, { ...existing, ...msg });
    }
  });

  const merged = Array.from(map.values());
  merged.sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));

  return merged.length > 0 ? merged : [createDefaultGreeting()];
}

/**
 * 로컬스토리지의 모든 키에서 가장 온전한 대화 기록을 복원
 */
export function loadSavedUnifiedMessages(): UnifiedMessage[] {
  try {
    // 1. Primary V3
    const savedV3 = safeLocalStorage.getItem(STORAGE_KEYS.PRIMARY_V3);
    if (savedV3) {
      const parsed = JSON.parse(savedV3);
      if (Array.isArray(parsed) && hasRealUserConversation(parsed)) {
        return parsed.filter((m) => !isErrorMessage(m));
      }
    }

    // 2. Backup V3
    const savedBackup = safeLocalStorage.getItem(STORAGE_KEYS.BACKUP_V3);
    if (savedBackup) {
      const parsed = JSON.parse(savedBackup);
      if (Array.isArray(parsed) && hasRealUserConversation(parsed)) {
        return parsed.filter((m) => !isErrorMessage(m));
      }
    }

    // 3. Legacy Object structure
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
                if (!isErrorMessage(m) && m.id !== 'greet') {
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

    // 4. If primary V3 had at least greetings
    if (savedV3) {
      const parsed = JSON.parse(savedV3);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((m) => {
          if (m.id === 'greet-main' || (typeof m.content === 'string' && m.content.includes("통합 AI 마스터 가이드 '루시'야"))) {
            return createDefaultGreeting(m.persona || 'lucy');
          }
          return m;
        });
      }
    }
  } catch (e) {
    console.error('[ChatSync] Failed to load chat history:', e);
  }

  return [createDefaultGreeting()];
}

/**
 * 대화 기록을 로컬스토리지 및 백업 키들에 안전하게 다중 저장
 */
export function saveUnifiedMessagesSafely(messages: UnifiedMessage[]): void {
  if (!Array.isArray(messages) || messages.length === 0) return;

  try {
    const jsonStr = JSON.stringify(messages);
    safeLocalStorage.setItem(STORAGE_KEYS.PRIMARY_V3, jsonStr);

    // 실제 대화가 있을 때만 백업 키 갱신 (초기화 방지용 방어벽)
    if (hasRealUserConversation(messages)) {
      safeLocalStorage.setItem(STORAGE_KEYS.BACKUP_V3, jsonStr);
    }

    // 레거시 호환 객체 구조도 동기화
    safeLocalStorage.setItem(STORAGE_KEYS.LEGACY_OBJECT, JSON.stringify({
      lucy: messages,
      orange: messages,
      trinity: messages,
      aura: messages,
      bluebird: messages,
      muse: messages,
    }));
  } catch (e) {
    console.warn('[ChatSync] Failed to save messages to storage:', e);
  }
}

/**
 * 대화 기록을 완전히 초기화하고 새 환영 메시지만 로컬 및 백업 스토리지에 설정
 */
export function forceResetUnifiedChatHistory(targetPersona: PersonaType = 'lucy'): UnifiedMessage[] {
  const greeting = [createDefaultGreeting(targetPersona)];
  const jsonStr = JSON.stringify(greeting);
  try {
    safeLocalStorage.setItem(STORAGE_KEYS.PRIMARY_V3, jsonStr);
    safeLocalStorage.setItem(STORAGE_KEYS.BACKUP_V3, jsonStr);
    safeLocalStorage.setItem(STORAGE_KEYS.LEGACY_OBJECT, JSON.stringify({
      lucy: greeting,
      orange: greeting,
      trinity: greeting,
      aura: greeting,
      bluebird: greeting,
      muse: greeting,
    }));
    safeLocalStorage.removeItem(STORAGE_KEYS.LEGACY_LUCY);
  } catch (e) {
    console.warn('[ChatSync] Failed to force reset chat history in storage:', e);
  }
  return greeting;
}
