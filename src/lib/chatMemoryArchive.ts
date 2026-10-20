/**
 * =========================================================================
 * PRISM & Lucy: 일일 대화 초기화 및 영구 배경 지식 아카이브 엔진
 * =========================================================================
 * 매일 자정(새로운 날)마다 대화창은 상쾌하게 새로운 캔버스로 초기화되지만,
 * 지난 날에 나눈 모든 소중한 대화 내역(고민, 취향, 인사이트, 영적 탐구 등)은
 * 루시의 [영구 배경 지식 및 장기 기억(Soul Memory)]에 자동으로 요약·누적 보존됩니다.
 * 또한 인사말은 매일 '처음' 루시채팅에 들어갈 때만 표시됩니다.
 */

import { safeLocalStorage } from '../utils/safeStorage';
import { getTodayDateKey, isTimestampToday } from './dailyCache';
import {
  forceResetUnifiedChatHistory,
  createDefaultGreeting,
  isGreetingMessage,
  type UnifiedMessage,
  type PersonaType,
} from './chatHistorySync';
import { extractLocalInsights, saveChatInsight } from './chatInsightsEngine';

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
}

/**
 * 텍스트에서 주요 핵심 주제/질문 키워드 추출
 */
function extractUserTopic(content: any): string {
  const str = typeof content === 'string' ? content : (Array.isArray(content) ? content.find((c: any) => c.type === 'text')?.text || '' : JSON.stringify(content));
  if (!str) return '';
  const clean = str.replace(/!\[.*?\]\(.*?\)/g, '').replace(/[#*_]/g, '').trim();
  return clean.length > 60 ? clean.slice(0, 57) + '...' : clean;
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

  const topTopicsStr = topics.slice(0, 6).map((t, idx) => `${idx + 1}) "${t}"`).join(', ');
  const summary = `[${dateStr} 대화 요약 (총 ${userMessages.length}회 질문)]: 주요 주제: ${topTopicsStr}`;

  return {
    date: dateStr,
    timestamp: Date.now(),
    dialogueCount: userMessages.length,
    summary,
    userTopics: topics,
  };
}

/**
 * 저장된 모든 영구 메모리 목록 불러오기
 */
export function loadAllPermanentMemories(): DailyMemoryEntry[] {
  try {
    const raw = safeLocalStorage.getItem(MEMORY_STORAGE_KEYS.SOUL_ARCHIVE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('[ChatMemoryArchive] Failed to load memories:', e);
  }
  return [];
}

/**
 * 새로운 일일 기억을 영구 아카이브에 병합 저장
 */
export function saveDailyMemoryToArchive(newEntry: DailyMemoryEntry): void {
  try {
    const currentList = loadAllPermanentMemories();
    const existingIndex = currentList.findIndex((item) => item.date === newEntry.date);
    if (existingIndex >= 0) {
      currentList[existingIndex] = newEntry;
    } else {
      currentList.push(newEntry);
    }

    currentList.sort((a, b) => b.date.localeCompare(a.date));
    const pruned = currentList.slice(0, 90);

    safeLocalStorage.setItem(MEMORY_STORAGE_KEYS.SOUL_ARCHIVE, JSON.stringify(pruned));
  } catch (e) {
    console.warn('[ChatMemoryArchive] Failed to save memory entry:', e);
  }
}

/**
 * 매일 첫 방문(자정 경과) 시 대화창을 아카이빙하고 새 대화로 초기화할지 판별 및 수행
 */
export function processDailyChatArchival(
  currentMessages: UnifiedMessage[],
  userName: string = '제제'
): {
  messages: UnifiedMessage[];
  wasArchived: boolean;
  archivedDate?: string;
} {
  const todayKey = getTodayDateKey();
  const lastSessionDate = safeLocalStorage.getItem(MEMORY_STORAGE_KEYS.LAST_SESSION_DATE) || '';
  const isDateShifted = Boolean(lastSessionDate && lastSessionDate !== todayKey);

  const allMsgs = Array.isArray(currentMessages) ? currentMessages : [];
  const todayMessages: UnifiedMessage[] = [];
  const pastMessages: UnifiedMessage[] = [];

  allMsgs.forEach((m) => {
    if (!m) return;
    if (m.timestamp && isTimestampToday(m.timestamp)) {
      todayMessages.push(m);
    } else if (m.timestamp && !isTimestampToday(m.timestamp)) {
      pastMessages.push(m);
    } else {
      if (lastSessionDate === todayKey) {
        todayMessages.push(m);
      } else {
        pastMessages.push(m);
      }
    }
  });

  const hasPastUserMsgs = pastMessages.some((m) => m.role === 'user' && m.content);
  const hasPastMsgs = pastMessages.length > 0;

  // 날짜가 바뀌지 않았고 과거 메시지도 없는 경우
  if (!isDateShifted && !hasPastMsgs) {
    if (!lastSessionDate) {
      safeLocalStorage.setItem(MEMORY_STORAGE_KEYS.LAST_SESSION_DATE, todayKey);
    }
    const hasTodayUser = todayMessages.some((m) => m.role === 'user' && m.content);
    if (hasTodayUser) {
      // 실제 대화가 있으면 인사말 제거
      const withoutGreet = todayMessages.filter((m) => !isGreetingMessage(m));
      return { messages: withoutGreet, wasArchived: false };
    }
    return {
      messages: todayMessages.length > 0 ? todayMessages : [createDefaultGreeting('lucy', userName)],
      wasArchived: false,
    };
  }

  // 1. 과거 날짜의 대화를 영구 기억(Soul Memory) 및 인사이트 보드에 아카이빙
  if (hasPastUserMsgs) {
    const archiveDate = isDateShifted
      ? lastSessionDate
      : (pastMessages[0]?.timestamp ? new Date(pastMessages[0].timestamp).toLocaleDateString('sv') : lastSessionDate || '이전 대화');
    const memoryEntry = buildDailyMemorySummary(archiveDate, pastMessages);
    if (memoryEntry) {
      saveDailyMemoryToArchive(memoryEntry);
      try {
        const insight = extractLocalInsights(archiveDate, pastMessages);
        if (insight) {
          saveChatInsight(insight);
        }
      } catch (insErr) {
        console.warn('[ChatMemoryArchive] Failed to extract insight during daily archival:', insErr);
      }
    }
  }

  // 2. 세션 날짜를 오늘로 갱신
  safeLocalStorage.setItem(MEMORY_STORAGE_KEYS.LAST_SESSION_DATE, todayKey);

  // 3. 오늘 이미 나눈 실제 대화가 있다면 오늘 대화만 보존 (인사말은 제거)
  const hasTodayUserMsgs = todayMessages.some((m) => m.role === 'user' && m.content);
  if (hasTodayUserMsgs) {
    return {
      messages: todayMessages.filter((m) => !isGreetingMessage(m)),
      wasArchived: true,
      archivedDate: lastSessionDate,
    };
  }

  // 4. 오늘 실제 대화 기록이 없다면 기본 루시 인사말 표시
  const freshMorningGreeting = createDefaultGreeting('lucy', userName);
  return {
    messages: [freshMorningGreeting],
    wasArchived: true,
    archivedDate: lastSessionDate,
  };
}

/**
 * AI 시스템 프롬프트에 주입할 영구 보존 기억 마크다운 생성기
 */
export function buildPermanentMemoryPromptContext(): string {
  const memories = loadAllPermanentMemories();
  if (memories.length === 0) return '';

  const recentMemories = memories.slice(0, 10);
  const formattedList = recentMemories
    .map((m) => `- [${m.date}]: ${m.summary}`)
    .join('\n');

  return `
[📖 루시의 영구 보존 배경 지식 & 장기 기억 아카이브 (Daily Soul Memories)]:
- 루시는 대화창이 하루 단위로 산뜻하게 새로워지더라도, 과거에 사용자와 나눈 모든 대화와 교감 내용을 온전히 기억하고 있습니다.
- 사용자가 과거 이야기를 언급하거나("어제 말했던 거", "전에 추천해준 거", "그때 내가 한 말" 등) 맥락상 도움이 될 때, 이 기억들을 자연스럽게 인지하고 따뜻하게 반응하세요.

<과거 대화 기억 요약 목록>:
${formattedList}
`;
}

/**
 * 사용자가 수동으로 '대화 초기화'를 실행할 때,
 * 현재 대화를 영구 기억 아카이브에 먼저 안전하게 백업 저장한 뒤 기본 루시 인사말로 대화창을 초기화합니다.
 */
export function archiveAndResetChat(
  messages: UnifiedMessage[],
  nickname: string = '제제',
  targetPersona: PersonaType = 'lucy'
): UnifiedMessage[] {
  try {
    const todayKey = getTodayDateKey();
    const entry = buildDailyMemorySummary(todayKey, messages);
    if (entry) {
      saveDailyMemoryToArchive(entry);
    }
    const insight = extractLocalInsights(todayKey, messages);
    if (insight) {
      saveChatInsight(insight);
    }
  } catch (e) {
    console.warn('[ChatMemoryArchive] Failed to archive on manual reset:', e);
  }
  return forceResetUnifiedChatHistory(targetPersona, nickname);
}
