/**
 * =========================================================================
 * 챗봇 대화 기반 주요 통찰 추출 & 인사이트 요약 보드 엔진 (Chat Insights Engine)
 * =========================================================================
 * - 챗봇 메시지 기록(UnifiedMessage[] 및 과거 일일 아카이브)을 분석하여
 *   핵심 깨달음(Core Realizations), 내면 상태(Emotional State), 
 *   행동 처방(Actionable Guidance), 추천 사색 화두(Reflective Prompts)를 구조화된 인사이트로 추출합니다.
 * - AI가 즉시 분석하거나 오프라인 규칙 기반의 로컬 스마트 추출기로 100% 안정적으로 작동합니다.
 * - 날짜별 히스토리와 완벽히 연동되어, 과거 대화 아카이브 및 오늘 세션의 인사이트를 즉시 탐색/열람하고
 *   루시 대화창으로 해당 인사이트를 심층 질문(Deep Insight Consult)할 수 있습니다.
 */

import { UnifiedMessage } from './chatHistorySync';
import { loadAllPermanentMemories, DailyMemoryEntry, MEMORY_STORAGE_KEYS } from './chatMemoryArchive';
import { safeLocalStorage } from '../utils/safeStorage';
import { invokeLLM } from './ai';

export interface ChatInsightSummary {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  messageCount: number;
  userQueryCount: number;
  primaryTheme: string;
  coreInsight: string; // 한 줄 핵심 통찰
  deepRealizations: string[]; // 깊은 깨달음 리스트 (3~5개)
  emotionalShift: {
    before?: string;
    after?: string;
    description: string;
  };
  keywords: string[]; // 대표 키워드 해시태그 (e.g. #세도나_릴리징, #내면아이, #사주오행)
  actionPrescriptions: string[]; // 오늘의 구체적 행동 처방
  meditationPrompt: string; // 오늘 밤 마음에 품을 화두/명상 문장
  sourceSnippet?: string;
}

export const INSIGHTS_STORAGE_KEY = 'lucy_chat_insights_board_v1';

/**
 * 저장된 인사이트 보드 목록 불러오기
 */
export function loadSavedChatInsights(): ChatInsightSummary[] {
  try {
    const raw = safeLocalStorage.getItem(INSIGHTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => b.timestamp - a.timestamp);
      }
    }
  } catch (e) {
    console.warn('[ChatInsights] Failed to load saved insights:', e);
  }
  return [];
}

/**
 * 인사이트 보드 항목 저장/업데이트
 */
export function saveChatInsight(insight: ChatInsightSummary): void {
  try {
    const current = loadSavedChatInsights();
    const existingIdx = current.findIndex((item) => item.id === insight.id || item.date === insight.date);
    if (existingIdx >= 0) {
      current[existingIdx] = { ...current[existingIdx], ...insight };
    } else {
      current.unshift(insight);
    }
    // 최대 90개 보관
    const pruned = current.slice(0, 90);
    safeLocalStorage.setItem(INSIGHTS_STORAGE_KEY, JSON.stringify(pruned));
    // 브라우저 탭 간 동기화 이벤트
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lucy-insight-updated', { detail: insight }));
    }
  } catch (e) {
    console.warn('[ChatInsights] Failed to save chat insight:', e);
  }
}

/**
 * 텍스트에서 따옴표, 마크다운 기호 제거
 */
function cleanText(txt: string): string {
  return txt
    .replace(/[#*_`]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .trim();
}

/**
 * 규칙 기반 빠른 로컬 인사이트 추출기 (AI 실패 또는 오프라인/즉각 렌더링용)
 */
export function extractLocalInsights(
  dateStr: string,
  messages: UnifiedMessage[]
): ChatInsightSummary | null {
  const userMsgs = messages.filter((m) => m.role === 'user' && m.content);
  const aiMsgs = messages.filter((m) => (m.role === 'model' || m.role === 'assistant') && m.content);

  if (userMsgs.length === 0) return null;

  const userQuestions: string[] = [];
  userMsgs.forEach((m) => {
    const raw = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
    const cleaned = cleanText(raw);
    if (cleaned && cleaned.length > 5 && !userQuestions.includes(cleaned)) {
      userQuestions.push(cleaned);
    }
  });

  // AI 메시지에서 핵심 문장 발췌
  const aiSentences: string[] = [];
  aiMsgs.forEach((m) => {
    const raw = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
    const cleaned = cleanText(raw);
    // 문장 분리
    const sentences = cleaned.split(/(?<=[.!?\n])\s+/);
    sentences.forEach((s) => {
      const trimmed = s.trim();
      if (
        trimmed.length > 20 &&
        trimmed.length < 120 &&
        (trimmed.includes('있어') ||
          trimmed.includes('입니다') ||
          trimmed.includes('놓아') ||
          trimmed.includes('사랑') ||
          trimmed.includes('흐름') ||
          trimmed.includes('마음') ||
          trimmed.includes('통찰') ||
          trimmed.includes('지혜') ||
          trimmed.includes('본질') ||
          trimmed.includes('평화'))
      ) {
        if (!aiSentences.includes(trimmed)) {
          aiSentences.push(trimmed);
        }
      }
    });
  });

  // 키워드 태그 감지
  const allText = messages
    .map((m) => (typeof m.content === 'string' ? m.content : JSON.stringify(m.content)))
    .join(' ');

  const keywordMap: Record<string, string> = {
    '타로': '타로_오라클',
    '사주': '사주_명리',
    '세도나': '세도나_릴리징',
    '호오포노포노': '호오포노포노',
    '불안': '불안_이완',
    '기적수업': '기적수업_용서',
    '내면아이': '내면아이_치유',
    '관계': '관계의_지혜',
    '돈': '풍요_주파수',
    '재물': '풍요_주파수',
    '진로': '커리어_방향',
    '방하착': '방하착_놓아버림',
    '명상': '현존_마음챙김',
    '창작': '영감_창의력',
  };

  const detectedTags: string[] = [];
  Object.entries(keywordMap).forEach(([word, tag]) => {
    if (allText.includes(word) && !detectedTags.includes(`#${tag}`)) {
      detectedTags.push(`#${tag}`);
    }
  });
  if (detectedTags.length === 0) {
    detectedTags.push('#우주적_교감', '#내면의_성찰');
  }

  // 대표 테마 추출
  const firstQ = userQuestions[0] || '내면의 대화';
  const primaryTheme = firstQ.length > 35 ? firstQ.slice(0, 32) + '...' : firstQ;

  // 핵심 통찰
  const coreInsight =
    aiSentences[0] ||
    '모든 외적 흔들림 너머에는 언제나 고요하고 온전한 당신의 본질이 현존하고 있습니다.';

  // 깊은 깨달음
  const deepRealizations = aiSentences.slice(1, 4);
  if (deepRealizations.length === 0) {
    deepRealizations.push(
      '판단과 자책의 굴레를 멈추고 감정을 있는 그대로 가만히 관조할 때 참된 평화가 열립니다.',
      '외부의 인정을 구하기보다 지금 이 순간 내가 나를 온전히 수용하는 것이 가장 큰 치유입니다.',
      '당신이 겪는 모든 의문과 정체기는 영혼이 한 차원 더 깊어지기 위한 신성한 쉼표입니다.'
    );
  }

  // 구체적 행동 처방
  const actionPrescriptions = [
    '하루 세 번, 1분간 하던 일을 멈추고 가슴에 손을 얹은 채 깊은 호흡 세 번 나누기',
    '떠오르는 걱정을 붙잡지 않고 시냇물에 낙엽을 띄워 보내듯 바라보기',
    '오늘 나에게 가장 따뜻한 칭찬과 사랑의 말 한마디 건네기'
  ];

  const meditationPrompt = `"${primaryTheme}"에 대한 집착을 내려놓고, 지금 나의 숨결 속에 깃든 고요에 안식하기`;

  return {
    id: `insight-${dateStr}`,
    date: dateStr,
    timestamp: messages[messages.length - 1]?.timestamp || Date.now(),
    messageCount: messages.length,
    userQueryCount: userMsgs.length,
    primaryTheme,
    coreInsight,
    deepRealizations,
    emotionalShift: {
      before: '복잡함과 고민, 해답을 찾으려는 분주함',
      after: '수용과 안도, 중심을 잡은 고요한 확신',
      description: '생각의 소용돌이에서 벗어나 본래의 평화로운 의식 상태로 회복되었습니다.'
    },
    keywords: detectedTags.slice(0, 5),
    actionPrescriptions,
    meditationPrompt,
    sourceSnippet: userQuestions.slice(0, 3).join(' · ')
  };
}

/**
 * AI를 활용한 고차원 심층 통찰 추출 (Gemini / OpenAI Proxy)
 */
export async function extractAiChatInsights(
  dateStr: string,
  messages: UnifiedMessage[]
): Promise<ChatInsightSummary> {
  const localFallback = extractLocalInsights(dateStr, messages) || {
    id: `insight-${dateStr}`,
    date: dateStr,
    timestamp: Date.now(),
    messageCount: messages.length,
    userQueryCount: 1,
    primaryTheme: '내면 성찰과 영적 통찰',
    coreInsight: '모든 번뇌 너머에 평화가 현존합니다.',
    deepRealizations: ['마음을 고요히 비우고 순간에 머무르세요.'],
    emotionalShift: { description: '평온과 명료함' },
    keywords: ['#내면성찰', '#루시_인사이트'],
    actionPrescriptions: ['3분간 이완 호흡하기'],
    meditationPrompt: '내 안의 평화를 기억하기'
  };

  const userAndAiPairs = messages
    .filter((m) => m.role === 'user' || m.role === 'model' || m.role === 'assistant')
    .slice(-16) // 최근 핵심 16개 대화
    .map((m) => {
      const speaker = m.role === 'user' ? '사용자' : '루시(AI)';
      const raw = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      return `[${speaker}]: ${cleanText(raw).slice(0, 300)}`;
    })
    .join('\n');

  const systemPrompt = `당신은 사용자의 영적·심리적 여정을 돕는 통찰 분석가(Insight Synthesizer)입니다.
제공된 사용자와 루시 AI의 대화 기록을 분석하여, 사용자가 얻은 핵심 통찰과 마음의 변화를 JSON 형식으로 요약 추출하세요.

반드시 유효한 JSON 객체만 응답해야 하며 다른 설명 문구는 절대 금지합니다.
JSON 포맷:
{
  "primaryTheme": "대화의 핵심 주제 (간결한 1줄 제목)",
  "coreInsight": "대화에서 도출된 가장 깊은 한 줄 핵심 깨달음 (명언처럼 감동적이고 직관적인 문장)",
  "deepRealizations": ["구체적인 깨달음 1", "구체적인 깨달음 2", "구체적인 깨달음 3"],
  "emotionalShift": {
    "before": "대화 시작 시점의 심리 상태 (예: 불안, 혼란, 자책, 조급함 등)",
    "after": "대화를 마친 후 전환된 심리 상태 (예: 수용, 평화, 확신, 감사 등)",
    "description": "감정과 에너지가 어떻게 긍정적으로 전환되었는지에 대한 1~2문장 설명"
  },
  "keywords": ["#키워드1", "#키워드2", "#키워드3", "#키워드4"],
  "actionPrescriptions": ["오늘 실천할 수 있는 1번째 구체적 팁", "2번째 마음가짐 또는 루틴"],
  "meditationPrompt": "오늘 밤 마음에 품고 잠들 화두 또는 명상 확언 문장"
}`;

  try {
    const rawResult = await invokeLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `[대화 일자: ${dateStr}]\n\n대화 기록:\n${userAndAiPairs}` }
      ],
      responseFormat: { type: 'json_object' }
    });

    if (rawResult) {
      const parsed = JSON.parse(rawResult);
      if (parsed.coreInsight && parsed.primaryTheme) {
        const enriched: ChatInsightSummary = {
          id: `insight-${dateStr}`,
          date: dateStr,
          timestamp: messages[messages.length - 1]?.timestamp || Date.now(),
          messageCount: messages.length,
          userQueryCount: messages.filter((m) => m.role === 'user').length,
          primaryTheme: parsed.primaryTheme || localFallback.primaryTheme,
          coreInsight: parsed.coreInsight || localFallback.coreInsight,
          deepRealizations: Array.isArray(parsed.deepRealizations) && parsed.deepRealizations.length > 0
            ? parsed.deepRealizations
            : localFallback.deepRealizations,
          emotionalShift: {
            before: parsed.emotionalShift?.before || localFallback.emotionalShift.before,
            after: parsed.emotionalShift?.after || localFallback.emotionalShift.after,
            description: parsed.emotionalShift?.description || localFallback.emotionalShift.description,
          },
          keywords: Array.isArray(parsed.keywords) && parsed.keywords.length > 0
            ? parsed.keywords.map((k: string) => (k.startsWith('#') ? k : `#${k}`))
            : localFallback.keywords,
          actionPrescriptions: Array.isArray(parsed.actionPrescriptions) && parsed.actionPrescriptions.length > 0
            ? parsed.actionPrescriptions
            : localFallback.actionPrescriptions,
          meditationPrompt: parsed.meditationPrompt || localFallback.meditationPrompt,
          sourceSnippet: localFallback.sourceSnippet
        };

        saveChatInsight(enriched);
        return enriched;
      }
    }
  } catch (err) {
    console.warn('[ChatInsights] AI extraction failed, fallback to local heuristic insight:', err);
  }

  saveChatInsight(localFallback);
  return localFallback;
}

/**
 * 과거 일일 아카이브 메모리(DailyMemoryEntry)로부터 인사이트 보드 항목 생성 및 동기화
 */
export function syncInsightsFromDailyMemories(): ChatInsightSummary[] {
  const memories: DailyMemoryEntry[] = loadAllPermanentMemories();
  const existingInsights = loadSavedChatInsights();
  const existingDates = new Set(existingInsights.map((i) => i.date));

  let hasNew = false;
  memories.forEach((mem) => {
    if (!existingDates.has(mem.date) && mem.userTopics && mem.userTopics.length > 0) {
      const tags = mem.userTopics.slice(0, 3).map((t) => `#${t.slice(0, 8).replace(/\s+/g, '_')}`);
      const fallback: ChatInsightSummary = {
        id: `insight-${mem.date}`,
        date: mem.date,
        timestamp: mem.timestamp || Date.now(),
        messageCount: mem.dialogueCount * 2,
        userQueryCount: mem.dialogueCount,
        primaryTheme: mem.userTopics[0] || '영적 대화와 일일 성찰',
        coreInsight: `${mem.date}에 나눈 ${mem.dialogueCount}회의 진솔한 대화 속에서 내면의 지혜와 고요를 확인했습니다.`,
        deepRealizations: mem.userTopics.slice(0, 4).map((topic) => `"${topic}"에 관한 탐구를 통해 마음의 짐을 덜어내고 본질에 다가섰습니다.`),
        emotionalShift: {
          before: '고민과 의문',
          after: '안도와 지혜',
          description: '루시와의 대화를 통해 내면의 혼란을 가라앉히고 명료한 시선을 얻었습니다.'
        },
        keywords: tags.length > 0 ? tags : ['#영혼의_여정', '#일일_성찰'],
        actionPrescriptions: ['지난 대화에서 얻은 통찰을 일상에서 실천해보기', '마음이 소란할 때마다 루시와의 대화를 회상하기'],
        meditationPrompt: `"${mem.userTopics[0] || '내면의 평화'}"를 감사함으로 품기`,
        sourceSnippet: mem.userTopics.join(' · ')
      };
      existingInsights.push(fallback);
      hasNew = true;
    }
  });

  if (hasNew) {
    existingInsights.sort((a, b) => b.timestamp - a.timestamp);
    safeLocalStorage.setItem(INSIGHTS_STORAGE_KEY, JSON.stringify(existingInsights));
  }

  return existingInsights;
}
