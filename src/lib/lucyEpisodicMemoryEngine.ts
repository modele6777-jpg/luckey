/**
 * =========================================================================
 * LUCKEY 루시 장기 에피소딕 기억 회상 엔진 (Lucy Episodic Memory Engine)
 * Version: LUCKEY-EPISODIC-MEMORY-v1.0.0
 * =========================================================================
 * 
 * [핵심 철학 및 기능]
 * 1. 단순 단어 매칭이나 원시 JSON 나열에 그쳤던 기존 장기 기억 체계를 초월하여,
 *    사용자의 과거 대화로부터 '진행 중인 삶의 고민(Active Life Threads)',
 *    '주요 인물 및 관계(Key People & Dynamics)', '열린 미결 사건(Open Threads)'을
 *    의미론적으로 추출·구조화합니다.
 * 2. 날짜가 바뀌어 대화창이 리셋되더라도, 루시가 진짜 단짝 친구처럼
 *    "그때 준비하던 프로젝트는 잘 됐어?", "그 친구랑은 연락해봤어?"라고
 *    먼저 다정하게 챙길 수 있는 [루시의 영혼 기억 노트 (Soul Memory Ledger)]를
 *    AI 프롬프트에 유기적으로 주입합니다.
 */

import type { DailyMemoryEntry } from './chatMemoryArchive';
import { readLucyMemory, buildLucyLongTermPrompt } from './lucyLongTermMemory';

export const LUCY_EPISODIC_MEMORY_ENGINE_VERSION = 'LUCKEY-EPISODIC-MEMORY-v1.0.0';

export interface EpisodicLifeThread {
  category: 'career_project' | 'relationship_love' | 'vitality_wellness' | 'finance_money' | 'life_decision';
  categoryKoName: string;
  topic: string;
  recentMentionDate: string;
  status: 'active_concern' | 'waiting_outcome' | 'ongoing_journey';
}

export interface KeyPersonProfile {
  nameOrRole: string;
  relationshipContext: string;
  lastMentionDate: string;
}

export interface EpisodicMemoryLedger {
  version: string;
  generatedAt: string;
  activeThreads: EpisodicLifeThread[];
  keyPeople: KeyPersonProfile[];
  openFollowUps: string[];
  coreValues: string[];
}

const CAREER_REGEX = /이직|퇴사|취업|구직|면접|연봉|직무|승진|진로|커리어|시험|합격|고시|자격증|회사|업무|부서|상사|팀장|동료|사수|야근|프로젝트|앱|개발|출시|런칭|깃허브|코드|배포|서비스/;
const LOVE_RELATION_REGEX = /연애|사랑|결혼|남친|여친|남자친구|여자친구|배우자|이성|썸|짝사랑|재회|이별|차였|헤어|호감|속마음|인연|와이프|아내|남편|그\s*사람|그녀|동창|친구|엄마|아빠|부모님|가족|형|누나|오빠|동생/;
const WELLNESS_REGEX = /피로|피곤|체력|방전|번아웃|지침|수면|잠|불면|몸|아파|스트레스|두통|우울|불안|병원|약|건강|호흡|명상|다이어트|운동/;
const FINANCE_REGEX = /재물|돈|금전|부자|자산|투자|주식|코인|부동산|사업|창업|매출|수익|적자|흑자|대출|소비|전세|월세|이사|계약/;
const OPEN_THREAD_INDICATOR = /할까\s*봐|해볼까|하기로\s*했|예정|다음\s*주|내일|이번\s*주|기다리는\s*중|결과\s*나오면|연락\s*해볼|준비\s*중|고민\s*중|생각\s*중/;

const PERSON_ROLE_MATCHERS = [
  { role: '팀장님/직장상사', regex: /팀장|상사|부장|파트장|디렉터|사수|대표/ },
  { role: '연인/이성/썸', regex: /남친|남자친구|여친|여자친구|그\s*사람|그녀|썸남|썸녀|짝사랑|전남친|전여친/ },
  { role: '가족(부모/형제)', regex: /엄마|어머니|아빠|아버지|부모님|동생|형|누나|오빠/ },
  { role: '친구/지인', regex: /친구|동창|지인|룸메/ },
  { role: '동료/파트너', regex: /동료|팀원|후배|동업자|파트너/ },
];

/**
 * 텍스트 목록에서 의미론적 에피소딕 기억을 정밀하게 추출하고 구조화합니다.
 */
export function extractEpisodicMemoryLedger(
  dailyMemories: DailyMemoryEntry[],
  recentExcerpts: string[] = []
): EpisodicMemoryLedger {
  const threadsMap = new Map<string, EpisodicLifeThread>();
  const peopleMap = new Map<string, KeyPersonProfile>();
  const openFollowUps: string[] = [];
  const coreValues: string[] = [];

  // 날짜 역순(최신순) 정렬
  const sortedMemories = [...dailyMemories].sort((a, b) => b.date.localeCompare(a.date));

  // 1. 일일 영구 메모리 순회 분석
  for (const day of sortedMemories) {
    const date = day.date;
    const texts = day.userTopics || [];

    for (const rawText of texts) {
      const clean = rawText.trim();
      if (clean.length < 5) continue;

      // 1) 커리어 & 프로젝트 스레드 탐지
      if (CAREER_REGEX.test(clean) && !threadsMap.has('career')) {
        threadsMap.set('career', {
          category: 'career_project',
          categoryKoName: '커리어 & 프로젝트 도전',
          topic: clean.length > 70 ? clean.slice(0, 67) + '...' : clean,
          recentMentionDate: date,
          status: OPEN_THREAD_INDICATOR.test(clean) ? 'waiting_outcome' : 'active_concern',
        });
      }

      // 2) 연애 & 인연 스레드 탐지
      if (LOVE_RELATION_REGEX.test(clean) && !threadsMap.has('relationship')) {
        threadsMap.set('relationship', {
          category: 'relationship_love',
          categoryKoName: '연애 & 마음속 인연',
          topic: clean.length > 70 ? clean.slice(0, 67) + '...' : clean,
          recentMentionDate: date,
          status: OPEN_THREAD_INDICATOR.test(clean) ? 'waiting_outcome' : 'ongoing_journey',
        });
      }

      // 3) 웰니스 & 멘탈 스레드 탐지
      if (WELLNESS_REGEX.test(clean) && !threadsMap.has('wellness')) {
        threadsMap.set('wellness', {
          category: 'vitality_wellness',
          categoryKoName: '신체 활력 & 마음 챙김',
          topic: clean.length > 70 ? clean.slice(0, 67) + '...' : clean,
          recentMentionDate: date,
          status: 'active_concern',
        });
      }

      // 4) 재물 & 계약 스레드 탐지
      if (FINANCE_REGEX.test(clean) && !threadsMap.has('finance')) {
        threadsMap.set('finance', {
          category: 'finance_money',
          categoryKoName: '재물 & 현실적 계약/자산',
          topic: clean.length > 70 ? clean.slice(0, 67) + '...' : clean,
          recentMentionDate: date,
          status: OPEN_THREAD_INDICATOR.test(clean) ? 'waiting_outcome' : 'ongoing_journey',
        });
      }

      // 5) 인물 관계 탐지
      for (const matcher of PERSON_ROLE_MATCHERS) {
        if (matcher.regex.test(clean) && !peopleMap.has(matcher.role)) {
          peopleMap.set(matcher.role, {
            nameOrRole: matcher.role,
            relationshipContext: clean.length > 60 ? clean.slice(0, 57) + '...' : clean,
            lastMentionDate: date,
          });
        }
      }

      // 6) 열린 미결 사건(후속 안부 트리거) 수집
      if (OPEN_THREAD_INDICATOR.test(clean) && openFollowUps.length < 3) {
        const shortFollowUp = `[${date}] "${clean.length > 50 ? clean.slice(0, 47) + '...' : clean}"`;
        if (!openFollowUps.includes(shortFollowUp)) {
          openFollowUps.push(shortFollowUp);
        }
      }
    }
  }

  // 최근 실시간 발화 발췌분 추가 분석
  for (const excerpt of recentExcerpts) {
    if (OPEN_THREAD_INDICATOR.test(excerpt) && openFollowUps.length < 4) {
      const line = `[최근] "${excerpt.length > 50 ? excerpt.slice(0, 47) + '...' : excerpt}"`;
      if (!openFollowUps.includes(line)) {
        openFollowUps.unshift(line);
      }
    }
  }

  // Topic mentions do not establish a user's personality or core values.

  return {
    version: LUCY_EPISODIC_MEMORY_ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    activeThreads: Array.from(threadsMap.values()),
    keyPeople: Array.from(peopleMap.values()),
    openFollowUps: openFollowUps.slice(0, 3),
    coreValues,
  };
}

/**
 * LucyMemoryEntry 목록에서 일자별 그룹화를 통해 EpisodicMemoryLedger를 추출합니다.
 */
export function extractEpisodicLedgerFromMemoryEntries(
  entries: readonly { timestamp: number; text: string; role: string }[]
): EpisodicMemoryLedger {
  const userEntries = entries.filter(e => e.role === 'user' && typeof e.text === 'string' && e.text.trim().length >= 4);
  const dailyGroups = new Map<string, string[]>();
  for (const entry of userEntries) {
    const dateStr = new Date(entry.timestamp).toISOString().slice(0, 10);
    const list = dailyGroups.get(dateStr) || [];
    list.push(entry.text.trim());
    dailyGroups.set(dateStr, list);
  }
  const dailyMemories: DailyMemoryEntry[] = Array.from(dailyGroups.entries()).map(([date, texts]) => ({
    date,
    timestamp: new Date(date).getTime(),
    dialogueCount: texts.length,
    summary: texts[0] || '',
    userTopics: texts,
  }));
  return extractEpisodicMemoryLedger(dailyMemories);
}

/**
 * EpisodicMemoryLedger를 읽기 쉬운 다정한 [루시의 영혼 기억 노트] 프롬프트 블록으로 변환합니다.
 */
export function formatEpisodicSoulMemory(ledger: EpisodicMemoryLedger): string {
  const parts: string[] = [];
  if (ledger.activeThreads.length > 0) {
    parts.push('진행 중인 삶의 스레드:\n' + ledger.activeThreads.map(t => `- [${t.categoryKoName}] "${t.topic}" (최근 언급: ${t.recentMentionDate})`).join('\n'));
  }
  if (ledger.keyPeople.length > 0) {
    parts.push('마음에 둔 주요 인물/관계:\n' + ledger.keyPeople.map(p => `- [${p.nameOrRole}] ${p.relationshipContext}`).join('\n'));
  }
  if (ledger.openFollowUps.length > 0) {
    parts.push('챙겨줄 열린 미결 사건:\n' + ledger.openFollowUps.map(f => `- ${f}`).join('\n'));
  }
  if (parts.length === 0) return '';
  return `[루시의 영혼 기억 노트 (Soul Memory Ledger)]\n${parts.join('\n\n')}\n\n[영혼 기억 연동 가이드]:
- 사용자가 진행 중인 스레드나 인물을 언급할 때는 지난 맥락을 다정하게 기억하고 이어받아줘.
- 당면 질문에 먼저 명쾌하게 답하되, 대화의 결에 맞춰 열린 미결 사건의 안부를 단짝 친구처럼 따뜻하게 물어봐줘.`;
}

/**
 * AI 시스템 프롬프트에 주입할 풍부하고 다정한 [루시의 영혼 기억 노트] 생성
 */
/** Compatibility adapter. Never read the unscoped legacy archive into an account. */
export function buildLucyEpisodicMemoryPrompt(account?: string, _nickname = '제제', question = ''): string {
  return account && question.trim() ? buildLucyLongTermPrompt(account, readLucyMemory(account), question) : '';
}
