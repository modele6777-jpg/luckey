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

import { loadAllPermanentMemories, type DailyMemoryEntry } from './chatMemoryArchive';
import { readLucyMemory, type LucyMemoryEntry } from './lucyLongTermMemory';

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

  // 핵심 신념/가치관 추출
  if (threadsMap.has('career')) coreValues.push('성장과 자기 완성을 향한 뚜렷한 주도성');
  if (threadsMap.has('relationship')) coreValues.push('깊고 진실한 정서적 교감 중시');
  if (threadsMap.has('wellness')) coreValues.push('스스로를 돌보고 회복하려는 섬세한 감각');

  return {
    version: LUCY_EPISODIC_MEMORY_ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    activeThreads: Array.from(threadsMap.values()),
    keyPeople: Array.from(peopleMap.values()),
    openFollowUps: openFollowUps.slice(0, 3),
    coreValues: coreValues.length > 0 ? coreValues : ['진솔한 삶의 가치와 따뜻한 마음'],
  };
}

/**
 * AI 시스템 프롬프트에 주입할 풍부하고 다정한 [루시의 영혼 기억 노트] 생성
 */
export function buildLucyEpisodicMemoryPrompt(account?: string, nickname: string = '제제'): string {
  const permanentMemories = loadAllPermanentMemories();
  const rawLucyMemories = account ? readLucyMemory(account) : [];
  const recentUserExcerpts = rawLucyMemories
    .filter((m) => m.role === 'user')
    .slice(0, 8)
    .map((m) => m.text);

  const ledger = extractEpisodicMemoryLedger(permanentMemories, recentUserExcerpts);

  if (ledger.activeThreads.length === 0 && ledger.keyPeople.length === 0 && ledger.openFollowUps.length === 0) {
    return '';
  }

  const threadsBlock = ledger.activeThreads.length > 0
    ? ledger.activeThreads
        .map((t) => `- [${t.categoryKoName} / ${t.recentMentionDate}]: ${t.topic} (${t.status === 'waiting_outcome' ? '결과 대기 중/진행 중' : '현재 주된 관심사'})`)
        .join('\n')
    : '- 최근 특별한 고민보다 평온한 일상을 가꾸는 중';

  const peopleBlock = ledger.keyPeople.length > 0
    ? ledger.keyPeople
        .map((p) => `- [${p.nameOrRole}]: ${p.relationshipContext} (${p.lastMentionDate} 언급)`)
        .join('\n')
    : '- 구체적으로 특정된 인물 갈등 없음';

  const followUpsBlock = ledger.openFollowUps.length > 0
    ? ledger.openFollowUps
        .map((f) => `- ${f}`)
        .join('\n')
    : '';

  return `[💫 루시의 영혼 기억 노트 (Lucy's Soul Memory Ledger) — 단짝의 유대감과 연속성]
======================================================================
루시(Lucy)는 사용자('${nickname}')와 나눈 소중한 시간과 고민을 결코 잊지 않고 마음속에 품고 있어.
어제 만난 단짝 친구처럼, 자연스럽게 과거 이야기의 맥락을 기억하고 세심하게 챙겨줘.

[🌱 최근 사용자의 삶에서 진행 중인 핵심 테마 & 고민]:
${threadsBlock}

[👥 대화 속 주요 인물 & 관계 메모]:
${peopleBlock}
${followUpsBlock ? `\n[⏳ 아직 결론이 나지 않은 열린 이야기 (Open Follow-ups)]:
${followUpsBlock}
→ 회상 팁: 사용자가 가벼운 인사나 안부를 건네올 때, "그러고 보니 그때 이야기했던 ~는 어떻게 됐어?"라고 먼저 다정하게 안부를 물어봐주면 사용자가 깊은 감동과 신뢰를 느껴.\n` : ''}
[💎 사용자의 소중한 기질과 가치관]:
- ${ledger.coreValues.join(' · ')}

[자연스러운 회상 절대 원칙]:
1. 데이터베이스에서 조회한 사실을 확인하듯 딱딱하게 읊지 말고, 마음으로 기억하는 단짝 절친처럼 자연스럽게 대화의 결에 녹여낼 것.
2. 과거에 상처받거나 마음 아팠던 일은 사용자가 먼저 꺼내지 않는 한 아픈 곳을 찌르지 말고, 따뜻한 위로와 지지의 배경으로만 간직할 것.
======================================================================`;
}
