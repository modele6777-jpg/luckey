import { safeSessionStorage } from '@/utils/safeStorage';
import { getTodayDateKey } from './dailyCache';
export type LucyChatScope = 'lucy' | 'lucy-pro';
export interface ChatForward { id: string; from: LucyChatScope; to: LucyChatScope; text: string; day: string }
const key = (account: string, target: LucyChatScope) => `lucy_chat_forward_v1:${encodeURIComponent(account)}:${target}`;
export function queueChatForward(account: string, from: LucyChatScope, text: string): ChatForward {
  const payload: ChatForward = { id: crypto.randomUUID(), from, to: from === 'lucy' ? 'lucy-pro' : 'lucy', text: text.trim(), day: getTodayDateKey() };
  safeSessionStorage.setItem(key(account, payload.to), JSON.stringify(payload));
  return payload;
}
export function takeChatForward(account: string, target: LucyChatScope): ChatForward | null {
  const storageKey = key(account, target);
  const raw = safeSessionStorage.getItem(storageKey);
  safeSessionStorage.removeItem(storageKey);
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as ChatForward;
    return value.to === target && value.from !== target && value.day === getTodayDateKey() && typeof value.text === 'string' && value.text.trim() ? value : null;
  } catch { return null; }
}
export function forwardedChatPrompt(payload: ChatForward): string {
  return `[${payload.from === 'lucy-pro' ? '루시 프로' : '일반 루시'}에서 전달한 말풍선]\n\n${payload.text}\n\n위에 전달한 내용에 이어서 이야기해 줘.`;
}
