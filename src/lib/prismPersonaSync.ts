/**
 * =========================================================================
 * PRISM & LUCY: 크로스 앱 페르소나 상태 동기화 엔진 (Persona State Synchronization)
 * =========================================================================
 * 빅뱅 버튼을 통해 앱 내 다른 화면으로 이동할 때,
 * 이전 화면에서 마지막으로 나눴던 대화 맥락(사용자 질문 + AI 응답 + 영시/타로/예술 세션)을
 * 1ms 내에 직렬화하고, 타겟 화면의 AI 페르소나가 자연스럽게 바통을 이어받아
 * 선제적으로 활동을 전개하도록 보장합니다.
 */

import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';

export interface PersonaDialogueContext {
  sourceApp: string; // 'lucy' | 'orb' | 'orange' | 'muse' | 'trinity' | 'heal' | 'bluebird' | 'epilogue' | 'hub'
  sourcePersonaName: string; // '루시', '크리스탈 오브', '오렌지 가드너', '뮤즈' 등
  targetApp?: string;
  lastUserMessage?: string;
  lastAssistantMessage?: string;
  summary?: string;
  dominantEmotionOrTheme?: string;
  recentDialoguePreview?: Array<{ role: 'user' | 'assistant' | 'model'; text: string }>;
  capturedAt: number;
}

const CROSS_APP_DIALOGUE_KEY = 'prism_cross_app_dialogues';
const LATEST_PERSONA_STATE_KEY = 'prism_latest_persona_sync_state';

/**
 * 현재 화면(경로) 및 로컬스토리지 전체에서 가장 최근 대화 맥락을 지능적으로 추출
 */
export function extractLatestDialogueContext(activePath: string): PersonaDialogueContext | null {
  const norm = (activePath || '/').toLowerCase();
  const now = Date.now();

  // 1. 크리스탈 오브 화면일 때 (/orb, /crystal, /gateway)
  if (norm.includes('orb') || norm.includes('crystal') || norm.includes('gateway')) {
    try {
      const orbRaw = safeLocalStorage.getItem('prism_orb_latest_scrying');
      if (orbRaw) {
        const orb = JSON.parse(orbRaw);
        if (orb.query || orb.directAnswer) {
          return {
            sourceApp: 'orb',
            sourcePersonaName: '크리스탈 오브 (직관의 구슬)',
            lastUserMessage: orb.query || '내면의 길을 묻는 질문',
            lastAssistantMessage: `[직관의 해답: ${orb.keyTheme || '명료함'}] ${orb.directAnswer || ''} (실천: ${orb.actionSolution || ''})`,
            summary: `오브 직관: "${orb.keyTheme || ''}" - ${orb.directAnswer || ''}`,
            dominantEmotionOrTheme: orb.keyTheme || '직관과 결단',
            capturedAt: now,
          };
        }
      }
    } catch (_) {}
  }

  // 2. 오렌지 성찰 & 소원의 우물 화면일 때 (/orange)
  if (norm.includes('orange')) {
    try {
      const orangeRaw = safeLocalStorage.getItem('chat_history_orange');
      if (orangeRaw) {
        const list = JSON.parse(orangeRaw);
        if (Array.isArray(list) && list.length > 0) {
          const userMsgs = list.filter((m: any) => m.role === 'user');
          const modelMsgs = list.filter((m: any) => m.role === 'model' || m.role === 'assistant');
          const lastUser = userMsgs[userMsgs.length - 1]?.content || '';
          const lastModel = modelMsgs[modelMsgs.length - 1]?.content || '';
          if (lastUser || lastModel) {
            return {
              sourceApp: 'orange',
              sourcePersonaName: '오렌지 (성찰의 숲)',
              lastUserMessage: typeof lastUser === 'string' ? lastUser : '',
              lastAssistantMessage: typeof lastModel === 'string' ? lastModel.slice(0, 300) : '',
              summary: `오렌지 성찰 기록: "${String(lastUser).slice(0, 60)}"`,
              dominantEmotionOrTheme: '감정 성찰과 별에게 소원빌기',
              capturedAt: now,
            };
          }
        }
      }
    } catch (_) {}
  }

  // 3. 트리니티 오라클 화면일 때 (/trinity)
  if (norm.includes('trinity') || norm.includes('oracle')) {
    try {
      const oracleRaw = safeLocalStorage.getItem('prism_oracle_last_reading');
      if (oracleRaw) {
        const oracle = JSON.parse(oracleRaw);
        const cardNames = (oracle.cards || []).map((c: any) => c.nameKo || c.name).join(', ');
        return {
          sourceApp: 'trinity',
          sourcePersonaName: '트리니티 오라클 (타로 & 무의식)',
          lastUserMessage: oracle.question || '내면의 무의식 상징 탐색',
          lastAssistantMessage: `[뽑힌 카드: ${cardNames}] ${oracle.reading || oracle.interpretation || '무의식의 새로운 가능성'}`,
          summary: `오라클 카드 리딩: [${cardNames}]`,
          dominantEmotionOrTheme: cardNames || '무의식 탐색',
          capturedAt: now,
        };
      }
    } catch (_) {}
  }

  // 4. 뮤즈 예술처방 화면일 때 (/muse)
  if (norm.includes('muse')) {
    try {
      const museRaw = safeSessionStorage.getItem('prism_active_toss_payload') || safeLocalStorage.getItem('prism_active_toss_payload');
      if (museRaw) {
        const muse = JSON.parse(museRaw);
        if (muse.anchorArtworkTitle) {
          return {
            sourceApp: 'muse',
            sourcePersonaName: '뮤즈 (예술 감성 처방)',
            lastUserMessage: '예술적 치유와 감성 공명 감상',
            lastAssistantMessage: `[명화: "${muse.anchorArtworkTitle}"] ${muse.anchorArtQuote || muse.contextMessage || ''}`,
            summary: `뮤즈 예술 처방: "${muse.anchorArtworkTitle}"`,
            dominantEmotionOrTheme: '심미적 카타르시스',
            capturedAt: now,
          };
        }
      }
    } catch (_) {}
  }

  // 5. 파랑새 화면일 때 (/bluebird)
  if (norm.includes('bluebird')) {
    try {
      const bluebirdRaw = safeLocalStorage.getItem('chat_history_bluebird');
      if (bluebirdRaw) {
        const list = JSON.parse(bluebirdRaw);
        if (Array.isArray(list) && list.length > 0) {
          const userMsgs = list.filter((m: any) => m.role === 'user');
          const modelMsgs = list.filter((m: any) => m.role === 'model' || m.role === 'assistant');
          const lastUser = userMsgs[userMsgs.length - 1]?.content || '';
          const lastModel = modelMsgs[modelMsgs.length - 1]?.content || '';
          return {
            sourceApp: 'bluebird',
            sourcePersonaName: '파랑새 (소소한 일상 행복)',
            lastUserMessage: typeof lastUser === 'string' ? lastUser : '',
            lastAssistantMessage: typeof lastModel === 'string' ? lastModel.slice(0, 300) : '',
            summary: `파랑새 일상 감사: "${String(lastUser).slice(0, 60)}"`,
            dominantEmotionOrTheme: '소소한 감사와 평온',
            capturedAt: now,
          };
        }
      }
    } catch (_) {}
  }

  // 6. 루시 통합 대화 (/chat, /lucy, 또는 기본 대화 기록)
  try {
    const unifiedRaw = safeLocalStorage.getItem('chat_history_unified_v3') || safeLocalStorage.getItem('chat_history_unified_backup');
    if (unifiedRaw) {
      const list = JSON.parse(unifiedRaw);
      if (Array.isArray(list) && list.length > 0) {
        const userMsgs = list.filter((m: any) => m.role === 'user' && !!m.content);
        const modelMsgs = list.filter((m: any) => (m.role === 'model' || m.role === 'assistant') && !!m.content && m.id !== 'greet-main');
        
        const lastUser = userMsgs[userMsgs.length - 1]?.content || '';
        const lastModel = modelMsgs[modelMsgs.length - 1]?.content || '';

        if (lastUser || lastModel) {
          const userText = typeof lastUser === 'string' ? lastUser : JSON.stringify(lastUser);
          const modelText = typeof lastModel === 'string' ? lastModel : JSON.stringify(lastModel);
          return {
            sourceApp: norm.replace('/', '') || 'lucy',
            sourcePersonaName: '마스터 가이드 루시 (Lucy)',
            lastUserMessage: userText.slice(0, 500),
            lastAssistantMessage: modelText.slice(0, 500),
            summary: `루시 심층 대화: "${userText.slice(0, 80)}"`,
            dominantEmotionOrTheme: '내면의 성찰과 치유',
            capturedAt: now,
          };
        }
      }
    }
  } catch (_) {}

  return null;
}

/**
 * 앱 간 공용 메모리(prism_cross_app_dialogues)에 최신 대화 등록
 */
export function recordCrossAppDialogue(dialogue: PersonaDialogueContext): void {
  try {
    const raw = safeLocalStorage.getItem(CROSS_APP_DIALOGUE_KEY);
    let list: any[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      } catch (_) {}
    }

    list = list.filter((item) => item.app !== dialogue.sourceApp);
    list.push({
      app: dialogue.sourceApp,
      persona: dialogue.sourcePersonaName,
      content: dialogue.lastUserMessage ? `Q: ${dialogue.lastUserMessage} | A: ${dialogue.lastAssistantMessage?.slice(0, 100)}` : dialogue.summary,
      summary: dialogue.summary,
      timestamp: dialogue.capturedAt,
    });

    if (list.length > 10) list = list.slice(-10);
    safeLocalStorage.setItem(CROSS_APP_DIALOGUE_KEY, JSON.stringify(list));
    safeLocalStorage.setItem(LATEST_PERSONA_STATE_KEY, JSON.stringify(dialogue));
  } catch (_) {}
}

/**
 * 타깃 화면의 AI 페르소나가 자연스럽게 대화와 활동을 이어갈 수 있도록
 * 완벽한 '페르소나 상태 동기화 인수인계 프롬프트(autoPrompt)' 합성
 */
export function synthesizePersonaHandoffPrompt(
  dialogue: PersonaDialogueContext | null,
  targetApp: string,
  extraContext?: string
): string {
  const normTarget = (targetApp || 'lucy').toLowerCase().replace('/', '');
  const sourceName = dialogue?.sourcePersonaName || '이전 채널';
  const lastUser = dialogue?.lastUserMessage ? `"${dialogue.lastUserMessage}"` : '';
  const lastAi = dialogue?.lastAssistantMessage ? `"${dialogue.lastAssistantMessage.slice(0, 200)}..."` : '';

  // 1. 타깃이 루시 (Lucy Standalone)일 때
  if (normTarget.includes('lucy') || normTarget.includes('chat')) {
    if (dialogue?.sourceApp === 'orb') {
      return `루시야, 방금 [크리스탈 오브]에서 직관의 해답을 마주하고 빅뱅 웜홀을 타고 건너왔어:
• 내 질문: ${lastUser || '직관 확인'}
• 오브가 비춰준 해답: ${lastAi}
이 직관의 의미를 깊이 풀이해주고, 오늘 내가 현실에서 바로 실천할 수 있는 3단계 행동 가이드를 들려줘.`;
    }
    if (dialogue?.sourceApp === 'orange') {
      return `루시야, 방금 [오렌지 비밀의 숲]에서 감정을 성찰하고 별에게 소원을 빌다 건너왔어.
• 나눴던 생각: ${lastUser || lastAi}
이 마음의 여정에 이어서, 내 영혼에 따뜻한 조언과 지혜를 들려줘.`;
    }
    if (dialogue?.sourceApp === 'trinity') {
      return `루시야, 방금 [트리니티 오라클]에서 타로 카드의 상징을 마주했어:
• 무의식 상징: ${lastAi}
이 상징이 내 현재 삶의 흐름과 어떻게 연결되는지 깊은 통찰을 들려줘.`;
    }
    if (dialogue?.sourceApp === 'muse') {
      return `루시야, 방금 [뮤즈]에서 명작의 예술 처방을 마주하고 감동을 품은 채 건너왔어:
• 예술적 울림: ${lastAi}
이 아름다운 감성을 이어받아 내 마음에 힘이 되는 이야기를 들려줘.`;
    }
    if (lastUser) {
      return `루시야, 방금 [${sourceName}]에서 다음 대화를 나누다 빅뱅 웜홀을 타고 건너왔어:
• 나의 질문/고민: ${lastUser}
${lastAi ? `• 나눴던 답변: ${lastAi}\n` : ''}이 맥락을 그대로 이어받아, 당신의 깊은 통찰과 다음 지혜를 편안하게 들려줘.`;
    }
    return `루시야, 방금 [${sourceName}]에서 빅뱅 웜홀을 타고 건너왔어. 방금 마주한 영감의 맥락을 이어서 깊이 있는 대화를 이어줘.`;
  }

  // 2. 타깃이 오렌지 (Orange)일 때 - 불필요한 강제 5분 대화 발화 없이 소원의 우물 및 메인 화면으로 온전히 진입
  if (normTarget.includes('orange')) {
    return '';
  }

  // 3. 타깃이 크리스탈 오브 (Orb)일 때
  if (normTarget.includes('orb')) {
    if (lastUser) {
      return lastUser.replace(/"/g, '').trim();
    }
    return '지금 내 마음이 나아가야 할 가장 올바른 길은 무엇인가요?';
  }

  // 4. 타깃이 뮤즈 예술처방 (Muse)일 때
  if (normTarget.includes('muse')) {
    if (lastUser || lastAi) {
      return `뮤즈님, 방금 [${sourceName}]에서 다음과 같은 생각과 감정을 느꼈어요:
"${(lastUser || lastAi).slice(0, 120)}"
이 마음의 주파수를 어루만져 주고 깊은 카타르시스를 줄 명화와 음악 처방을 열어주세요.`;
    }
    return `마음의 평온과 영감을 북돋워 줄 아름다운 명화와 예술 처방을 열어주세요.`;
  }

  // 5. 타깃이 호오포노포노 치유 (Heal)일 때
  if (normTarget.includes('heal')) {
    if (lastUser) {
      return `방금 [${sourceName}]에서 마주한 내면의 무거운 짐과 상처: "${lastUser}". 이 기억과 감정을 깨끗이 정화할 수 있도록 4마디 호오포노포노 치유 의식으로 인도해줘.`;
    }
    return `내면의 상처와 부정적인 기억을 정화하는 평화의 의식으로 안내해줘.`;
  }

  // 6. 타깃이 에필로그 밤 서재 (Epilogue)일 때
  if (normTarget.includes('epilogue')) {
    if (lastUser || lastAi) {
      return `오늘 [${sourceName}]에서 나눈 소중한 대화:
• 질문: ${lastUser}
• 답변: ${lastAi}
오늘 하루 동안의 고뇌와 영감을 갈무리하는 따뜻하고 서정적인 밤의 수필로 엮어줘.`;
    }
    return `오늘 하루 동안 내가 걸어온 내면의 발자취를 갈무리하는 밤의 수필을 들려줘.`;
  }

  return extraContext || `방금 [${sourceName}]에서 건너온 맥락을 이어받아 활동을 시작해줘.`;
}
