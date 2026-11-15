import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';
import type { UnifiedMessage } from './chatHistorySync';
import { formatLucyChatDay, getLucyChatDay } from './lucyChatDay';

export const MEMORY_STORAGE_KEYS = {
  SOUL_ARCHIVE: 'lucy_soul_memories_archive',
  LAST_SESSION_DATE: 'lucy_chat_session_date_v1',
};

export interface DailyMemoryEntry {
  date: string; // "YYYY-MM-DD"
  timestamp: number;
  dialogueCount: number;
  summary: string;
  userTopics: string[];
  assistantExcerpts?: string[];
  assistantTurns?: { id: string; text: string }[];
}

/**
 * 텍스트에서 주요 핵심 주제/질문 키워드 추출
 */
function extractUserTopic(content: any): string {
  const str = typeof content === 'string' ? content : (Array.isArray(content) ? content.filter((c: any) => c?.type === 'text' && typeof c.text === 'string').map((c: any) => c.text).join('\n') : '');
  if (!str) return '';
  const clean = str.replace(/!\[.*?\]\(.*?\)/g, '').replace(/[#*_]/g, '').trim();
  return clean.length > 600 ? clean.slice(0, 597) + '...' : clean;
}

function describeTopics(date: string, topics: string[]): string {
  return `[${date} 사용자 발언 발췌 · 감정·사실 여부를 확정한 분석이 아님]: ${topics.slice(0, 12).map((t) => JSON.stringify(t)).join(', ')}`;
}

/**
 * 하루 동안의 대화 목록을 영구 보존용 메모리 요약본으로 변환
 */
export function buildDailyMemorySummary(dateStr: string, messages: UnifiedMessage[]): DailyMemoryEntry | null {
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const userMessages = messages.filter((m) => m.role === 'user' && m.content);
  if (userMessages.length === 0) return null;

  const topics: string[] = [];
  userMessages.forEach((m) => {
    const topic = extractUserTopic(m.content);
    if (topic && !topics.includes(topic)) {
      topics.push(topic);
    }
  });

  if (topics.length === 0) return null;
  const assistantTurns = messages.filter(message => (message.role === 'model' || message.role === 'assistant') && !String(message.id || '').startsWith('greet')).map((message,index) => ({ id: message.id || `${message.timestamp}:${index}`, text: extractUserTopic(message.content) })).filter(turn => turn.text && !turn.text.startsWith('⚠️'));
  const summary = describeTopics(dateStr, topics);

  return {
    date: dateStr,
    timestamp: Date.now(),
    dialogueCount: userMessages.length,
    summary,
    userTopics: topics,
    assistantExcerpts: assistantTurns.map(turn => turn.text),
    assistantTurns,
  };
}

/**
 * 저장된 모든 영구 메모리 목록 불러오기
 */
const currentAccount = () => safeSessionStorage.getItem('prism_auth_uid') || 'device';
const archiveKey = (account: string) => `${MEMORY_STORAGE_KEYS.SOUL_ARCHIVE}:${encodeURIComponent(account)}`;

export function loadAllPermanentMemories(account = currentAccount()): DailyMemoryEntry[] {
  try {
    const raw = safeLocalStorage.getItem(archiveKey(account)) || (account === 'device' ? safeLocalStorage.getItem(MEMORY_STORAGE_KEYS.SOUL_ARCHIVE) : null);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((entry): entry is DailyMemoryEntry =>
        entry && typeof entry.date === 'string' && typeof entry.summary === 'string' &&
        Number.isFinite(entry.timestamp) && Number.isFinite(entry.dialogueCount) &&
        Array.isArray(entry.userTopics) && entry.userTopics.every((topic: unknown) => typeof topic === 'string')
      ).map(entry => ({ ...entry, assistantExcerpts: Array.isArray(entry.assistantExcerpts) ? entry.assistantExcerpts.filter((text: unknown): text is string => typeof text === 'string') : [] })).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 90);
    }
  } catch (e) {
    console.warn('[ChatMemoryArchive] Failed to load memories:', e);
  }
  return [];
}

/**
 * 새로운 일일 기억을 영구 아카이브에 병합 저장
 */
export function saveDailyMemoryToArchive(newEntry: DailyMemoryEntry, account = currentAccount()): void {
  try {
    const currentList = loadAllPermanentMemories(account);
    const existingIndex = currentList.findIndex((item) => item.date === newEntry.date);
    if (existingIndex >= 0) {
      const previous = currentList[existingIndex];
      const topics = [...new Set([...previous.userTopics, ...newEntry.userTopics])];
      const turns = new Map<string, {id:string; text:string}>();
      const validTurns = (entry:DailyMemoryEntry) => Array.isArray(entry.assistantTurns) ? entry.assistantTurns.filter(turn => typeof turn?.id === 'string' && typeof turn.text === 'string') : [];
      for (const turn of [...validTurns(previous), ...validTurns(newEntry)]) {
        if (!turns.has(turn.id) || turns.get(turn.id)!.text.length < turn.text.length) turns.set(turn.id,turn);
      }
      const assistantTurns = [...turns.values()];
      const assistantExcerpts = [...new Set([...(previous.assistantTurns ? [] : previous.assistantExcerpts || []), ...assistantTurns.map(turn => turn.text)])];
      if (topics.length === previous.userTopics.length && JSON.stringify(assistantExcerpts) === JSON.stringify(previous.assistantExcerpts || []) && newEntry.dialogueCount <= previous.dialogueCount) return;
      currentList[existingIndex] = {
        ...newEntry,
        userTopics: topics,
        assistantExcerpts,
        assistantTurns,
        dialogueCount: Math.max(previous.dialogueCount, newEntry.dialogueCount, topics.length),
        summary: describeTopics(newEntry.date, topics),
      };
    } else {
      currentList.push(newEntry);
    }

    currentList.sort((a, b) => b.date.localeCompare(a.date));
    const pruned = currentList.slice(0, 90);

    safeLocalStorage.setItem(archiveKey(account), JSON.stringify(pruned));
  } catch (e) {
    console.warn('[ChatMemoryArchive] Failed to save memory entry:', e);
  }
}

/** Changes only the archived context; current chat and insight notes remain separate. */
export function updatePermanentMemory(date: string, text: string): void {
  const topics = text.split('\n').map((line) => line.trim()).filter(Boolean).slice(0, 50).map((line) => line.slice(0, 600));
  if (topics.length === 0) return;
  const memories = loadAllPermanentMemories().map((entry) => entry.date === date
    ? { ...entry, userTopics: topics, summary: describeTopics(date, topics), timestamp: Date.now() }
    : entry);
  safeLocalStorage.setItem(archiveKey(currentAccount()), JSON.stringify(memories));
}

export function deletePermanentMemory(date: string): void {
  safeLocalStorage.setItem(archiveKey(currentAccount()),
    JSON.stringify(loadAllPermanentMemories().filter((entry) => entry.date !== date)));
}


/** Save dated user excerpts before any visible-history filtering or trimming. */
export function rememberChatDays(messages: readonly UnifiedMessage[], account = currentAccount()): void {
  const days = new Map<string, UnifiedMessage[]>();
  for (const message of messages) {
    if (!message || !['user','assistant','model'].includes(message.role)) continue;
    const date = message.timestamp ? formatLucyChatDay(new Date(message.timestamp)) : safeLocalStorage.getItem(MEMORY_STORAGE_KEYS.LAST_SESSION_DATE) || getLucyChatDay();
    if (!date) continue;
    const list = days.get(date) || [];
    list.push(message);
    days.set(date,list);
  }
  for (const [date,list] of days) {
    const entry = buildDailyMemorySummary(date,list);
    if (entry) saveDailyMemoryToArchive(entry, account);
  }
}
