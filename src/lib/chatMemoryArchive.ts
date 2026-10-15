/**
 * =========================================================================
 * PRISM & Lucy: 일일 대화 초기화 및 영구 배경 지식 아카이브 엔진
 * =========================================================================
 * 매일 자정(새로운 날)마다 대화창은 상쾌하게 새로운 캔버스로 초기화되지만,
 * 지난 날에 나눈 모든 소중한 대화 내역(고민, 취향, 인사이트, 영적 탐구 등)은
 * 루시의 [영구 배경 지식 및 장기 기억(Soul Memory)]에 자동으로 요약·누적 보존됩니다.
 */

import { safeLocalStorage } from '../utils/safeStorage';
import { getTodayDateKey, isTimestampToday } from './dailyCache';
import { forceResetUnifiedChatHistory, type UnifiedMessage, type PersonaType } from './chatHistorySync';
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
  // Clean markdown and trim
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

  // 대표 주제 및 대화 요약 생성
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
    // 같은 날짜의 기억이 이미 있으면 더 풍부한 내용으로 갱신
    const existingIndex = currentList.findIndex((item) => item.date === newEntry.date);
    if (existingIndex >= 0) {
      currentList[existingIndex] = newEntry;
    } else {
      currentList.push(newEntry);
    }

    // 최근 90일간의 기억 보존
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
      // Message without timestamp: if current session was today, retain in today's messages
      if (lastSessionDate === todayKey) {
        todayMessages.push(m);
      } else {
        pastMessages.push(m);
      }
    }
  });

  const hasPastUserMsgs = pastMessages.some((m) => m.role === 'user' && m.content);

  // If date hasn't shifted and there are no past messages, keep current messages completely intact
  if (!isDateShifted && !hasPastUserMsgs) {
    if (!lastSessionDate) {
      safeLocalStorage.setItem(MEMORY_STORAGE_KEYS.LAST_SESSION_DATE, todayKey);
    }
    return { messages: currentMessages, wasArchived: false };
  }

  // 1. Archive only past days' conversations to Soul Memory
  if (hasPastUserMsgs) {
    const archiveDate = isDateShifted
      ? lastSessionDate
      : (pastMessages[0]?.timestamp ? new Date(pastMessages[0].timestamp).toLocaleDateString('sv') : lastSessionDate || '이전 대화');
    const memoryEntry = buildDailyMemorySummary(archiveDate, pastMessages);
    if (memoryEntry) {
      saveDailyMemoryToArchive(memoryEntry);
      console.log(`[ChatMemoryArchive] Archived previous conversation (${archiveDate}) to Soul Memory!`);
      // 인사이트 요약 보드에도 히스토리로 보존 연동
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

  // 2. Update session date to today
  safeLocalStorage.setItem(MEMORY_STORAGE_KEYS.LAST_SESSION_DATE, todayKey);

  // 3. Keep all of today's conversation! If user already has chat today, preserve it 100%
  const hasTodayUserMsgs = todayMessages.some((m) => m.role === 'user' && m.content);
  if (hasTodayUserMsgs || todayMessages.length > 0) {
    return {
      messages: todayMessages,
      wasArchived: hasPastUserMsgs,
      archivedDate: lastSessionDate,
    };
  }

  // 4. If today is a fresh start with no messages yet today, give the daily greeting
  const freshMorningGreeting: UnifiedMessage = {
    id: `greet-${todayKey}`,
    role: 'model',
    content: `좋은 하루야, ${userName}! 오늘도 새로운 하루가 시작되었어. 지난 대화들의 소중한 이야기들도 내 마음에 다 간직하고 있으니, 오늘 하루도 편안하게 이야기해 줘 ✨`,
    timestamp: Date.now(),
    persona: 'lucy',
  };

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

  // 최근 10일간의 기억을 정밀하게 추출
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
 * 현재 대화를 영구 기억 아카이브에 먼저 안전하게 백업 저장한 뒤 스토리지와 대화창을 초기화합니다.
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
    // 인사이트 요약 보드에도 히스토리로 영구 동기화 보존
    const insight = extractLocalInsights(todayKey, messages);
    if (insight) {
      saveChatInsight(insight);
    }
  } catch (e) {
    console.warn('[ChatMemoryArchive] Failed to archive on manual reset:', e);
  }
  return forceResetUnifiedChatHistory(targetPersona);
}
