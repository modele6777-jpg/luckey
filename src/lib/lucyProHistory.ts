import { rememberChatDays } from './dailyChatMemoryStore';
import { safeLocalStorage } from '@/utils/safeStorage';
import { getLucyChatDay as getTodayDateKey, formatLucyChatDay as formatDateKey } from './lucyChatDay';
import { isLucyChatStyleGreeting, type UnifiedMessage } from './chatHistorySync';

export interface ProDailyHistory { day: string; messages: UnifiedMessage[]; resetAt?:number }
export const proHistoryKey = (account: string) => `lucy_pro_history_v1:${encodeURIComponent(account)}`;
export function freshProHistory(day = getTodayDateKey(), _now = Date.now()): ProDailyHistory {
  // 루시프로는 루시채팅식 일상 인사를 넣지 않는다. 입장은 타로 하우스 인사가 담당한다.
  return { day, messages: [] };
}
export function normalizeProHistory(raw: unknown, day = getTodayDateKey(), now = Date.now()): ProDailyHistory {
  const saved = raw as Partial<ProDailyHistory> | null;
  if (saved?.day !== day || !Array.isArray(saved.messages)) return freshProHistory(day, now);
  const resetAt=typeof saved.resetAt==='number'&&Number.isFinite(saved.resetAt)?Math.max(0,saved.resetAt):0;
  const messages = saved.messages.filter(message => message && ['user', 'model', 'assistant', 'system'].includes(message.role) && (!message.timestamp || formatDateKey(new Date(message.timestamp)) === day) && (!resetAt || (message.timestamp||0)>=resetAt) && !isLucyChatStyleGreeting(message));
  return { day, messages, ...(resetAt?{resetAt}:{}) };
}
export function loadProHistory(account: string): ProDailyHistory {
  const key = proHistoryKey(account);
  let raw: unknown = null;
  try { raw = JSON.parse(safeLocalStorage.getItem(key) || 'null'); } catch { /* Reset malformed Pro data only. */ }
  if (Array.isArray((raw as ProDailyHistory)?.messages)) rememberChatDays((raw as ProDailyHistory).messages, account);
  const current = normalizeProHistory(raw);
  if ((raw as ProDailyHistory | null)?.day !== current.day) {
    if (raw) safeLocalStorage.setItem(`${key}:previous`, JSON.stringify(raw));
    safeLocalStorage.setItem(key, JSON.stringify(current));
  }
  return current;
}
export function saveProHistory(account: string, messages: UnifiedMessage[], resetAt?:number): void {
  rememberChatDays(messages, account);
  safeLocalStorage.setItem(proHistoryKey(account), JSON.stringify(normalizeProHistory({ day: getTodayDateKey(), messages,resetAt:resetAt??loadProHistory(account).resetAt })));
}
