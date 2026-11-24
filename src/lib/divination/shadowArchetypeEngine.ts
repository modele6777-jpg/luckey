/**
 * =========================================================================
 * LUCKEY 그림자 자아 & 골든 섀도우 연금술 엔진 (Shadow Archetype & Golden Alchemy Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 칼 융(Carl Jung)의 분석심리학 원형 이론과 사주 명리학의 4대 흉신(편관·상관·편인·겁재) 및
 * 서양 점성술 8하우스(변형/심연)·12하우스(무의식) 수리를 결합한 결정론적 무의식 분석 엔진입니다.
 * 억압된 흉신의 파괴적 트리거를 역추적하여, 그 이면에 봉인된 천재적 잠재력(골든 섀도우)으로
 * 승화(Transmutation)시키는 실전적 내면 통합 가이드를 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SHADOW_ARCHETYPE_VERSION = 'LUCKEY-SHADOW-v2.3.0';

export type ShadowQuestionTopic = 'emotion' | 'career' | 'relation' | 'growth' | 'general';

function classifyShadowTopic(q: string): ShadowQuestionTopic {
  if (/감정|불안|분노|우울|상처|스트레스/.test(q)) return 'emotion';
  if (/일|직장|커리어|성공|성과|경쟁/.test(q)) return 'career';
  if (/관계|사람|가족|연애|갈등/.test(q)) return 'relation';
  if (/성장|치유|통합|내면|변화/.test(q)) return 'growth';
  return 'general';
}

const SHADOW_WARNINGS: Record<ShadowQuestionTopic, string> = {
  emotion: '그림자 감정이 올라올 때 억지로 지우려 하면 반발이 커지니, 먼저 몸의 긴장을 풀고 사실과 감정을 분리해 보십시오.',
  career: '경쟁심이나 인정 욕구가 과열될수록 단기 성과에 매몰되어 핵심 원칙을 놓치기 쉽습니다.',
  relation: '상대에게 강하게 거슬리는 지점은 내 안의 미해결 과제를 비추는 거울일 수 있으니 즉각 반박을 한 박자 늦추십시오.',
  growth: '내면 통합은 하루아침에 완성되지 않으므로, 완벽한 변화를 강박하기보다 오늘의 작은 선택 하나를 바꾸는 데 집중하십시오.',
  general: '그림자는 없애야 할 적이 아니라 아직 길들여지지 않은 에너지입니다. 파괴가 아닌 창작과 책임으로 방향을 돌리십시오.',
};

export type ShadowArchetypeName = 
  | '파괴적 검투사 (The Fierce Gladiator · 편관형)'
  | '냉소적 반역자 (The Cynical Rebel · 상관형)'
  | '고립된 은둔자 (The Isolated Mystic · 편인형)'
  | '탐욕적 포식자 (The Relentless Hunter · 겁재형)';

export interface ShadowArchetypeDetail {
  archetype: ShadowArchetypeName;
  dominantTenGod: '편관(七殺)' | '상관(傷官)' | '편인(偏印)' | '겁재(劫財)';
  coreWound: string;             // 무의식에 자리 잡은 근원 상처
  shadowTrigger: string;          // 그림자가 폭발하는 현실적 자극
  toxicPattern: string;           // 통제력 상실 시 나타나는 자기파괴적 방어기제
}

export interface GoldenShadowDetail {
  goldenGift: string;             // 그림자 이면에 봉인된 본질적 축복
  hiddenGeniusPower: string;      // 각성 시 발휘되는 압도적 초능력
  highestPotential: string;       // 궁극의 완성형 자아 상태
}

export interface ShadowArchetypeReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: ShadowQuestionTopic;
  shadowWarning: string;
  primaryShadow: ShadowArchetypeDetail;
  goldenShadow: GoldenShadowDetail;
  shadowIntegrationScore: number;  // 그림자 통합 성숙도 (0 ~ 100)
  subconsciousDepth: number;       // 무의식 심연 감응도 (0 ~ 100)
  transmutationRitual: {
    dailyPrompt: string;           // 매일 아침 그림자를 마주하는 성찰 질문
    mindsetShield: string;         // 트리거 발생 시 즉각 발동하는 멘탈 방패
    integrationAction: string;     // 행동으로 그림자를 승화시키는 액션
  };
  synthesisPromptGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion?: string;
  shadowSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatShadowKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:00+09:00 (KST)`;
}

export function runShadowArchetypeEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): ShadowArchetypeReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const dateSeed = (targetDate.getFullYear() * 5 + (targetDate.getMonth() + 1) * 11 + targetDate.getDate() * 17 + ganCode) % 100;

  // 4대 그림자 원형 결정
  const archetypeIndex = (ganCode + targetDate.getDate()) % 4;

  let primaryShadow: ShadowArchetypeDetail;
  let goldenShadow: GoldenShadowDetail;

  if (archetypeIndex === 0) {
    primaryShadow = {
      archetype: '파괴적 검투사 (The Fierce Gladiator · 편관형)',
      dominantTenGod: '편관(七殺)',
      coreWound: '약점을 보이면 짓밟히거나 버림받을 것이라는 원초적 공포',
      shadowTrigger: '타인의 무례한 선 넘기, 통제권 강탈, 스스로의 무력감을 느낄 때',
      toxicPattern: '스스로를 한계까지 몰아붙여 번아웃에 빠지거나 상대방을 가차 없이 응징하려는 공격성'
    };
    goldenShadow = {
      goldenGift: '절대적 카리스마 & 난세 극복의 결단력',
      hiddenGeniusPower: '모두가 패닉에 빠진 절체절명의 위기에서 냉철하게 칼을 휘둘러 승리를 쟁취하는 지휘관의 권능',
      highestPotential: '나와 동료들을 어떤 외압으로부터도 완벽히 수호하는 무결점의 보호자'
    };
  } else if (archetypeIndex === 1) {
    primaryShadow = {
      archetype: '냉소적 반역자 (The Cynical Rebel · 상관형)',
      dominantTenGod: '상관(傷官)',
      coreWound: '이해받지 못하고 사회적 틀에 억압되어 독창성을 거세당했다는 박탈감',
      shadowTrigger: '비효율적인 꼰대적 관습, 위선적인 태도, 나의 아이디어가 무시당할 때',
      toxicPattern: '상대방의 논리적 모순을 잔인하게 조롱하고 관계의 다리를 불태워버리는 고립화'
    };
    goldenShadow = {
      goldenGift: '패러다임을 파괴하는 급진적 혁신성',
      hiddenGeniusPower: '낡고 썩은 시스템의 허점을 단숨에 꿰뚫어 보고 10배 뛰어난 새로운 창작물을 빚어내는 아방가르드 천재성',
      highestPotential: '시대의 침묵을 깨우고 대중의 심장에 불을 지피는 위대한 오피니언 리더'
    };
  } else if (archetypeIndex === 2) {
    primaryShadow = {
      archetype: '고립된 은둔자 (The Isolated Mystic · 편인형)',
      dominantTenGod: '편인(偏印)',
      coreWound: '세상과 타인은 결코 나를 온전히 수용하지 않는다는 깊은 결핍과 의심',
      shadowTrigger: '천박하고 시끄러운 현실의 요구, 감정적 에너지 착취, 지나친 세속적 잣대',
      toxicPattern: '현실의 문을 닫아걸고 환상이나 잡념의 요새로 도피하며 기회를 스스로 유폐시킴'
    };
    goldenShadow = {
      goldenGift: '심연을 꿰뚫는 초감각적 직관과 형이상학적 통찰',
      hiddenGeniusPower: '보이지 않는 패턴과 미래의 징후를 읽어내어 누구도 생각지 못한 해법을 도출하는 현자의 혜안',
      highestPotential: '영혼의 상처를 치유하고 본질적 진리를 세상에 번역해 전하는 위대한 힐러'
    };
  } else {
    primaryShadow = {
      archetype: '탐욕적 포식자 (The Relentless Hunter · 겁재형)',
      dominantTenGod: '겁재(劫財)',
      coreWound: '남에게 빼앗기면 나에게는 아무것도 남지 않는다는 원초적 박탈 공포',
      shadowTrigger: '동료의 갑작스러운 성공, 자원의 희소성, 뒤처지고 있다는 불안감',
      toxicPattern: '경쟁 상대를 지나치게 의식하며 시기하거나 무리한 승부수를 던져 주변 자원을 소진함'
    };
    goldenShadow = {
      goldenGift: '한계를 모르는 압도적 에너지와 승부욕',
      hiddenGeniusPower: '불가능해 보이는 목표를 설정하고 맨땅에서 자원을 그러모아 기어이 현실로 빚어내는 야생의 개척력',
      highestPotential: '모두가 불가능하다고 여긴 영역에서 새로운 제국을 세우고 풍요를 나누는 위대한 챔피언'
    };
  }

  const shadowIntegrationScore = 74 + (dateSeed % 24); // 74 ~ 97점
  const subconsciousDepth = 78 + ((targetDate.getDate() * 7 + targetDate.getHours() * 3 + (ganCode % 11)) % 21); // 78 ~ 98점

  const transmutationRitual = {
    dailyPrompt: `오늘 내가 타인에게 가장 분노하거나 혐오감을 느낀 지점은 나의 어떤 억압된 ${primaryShadow.dominantTenGod} 그림자를 비추고 있는가?`,
    mindsetShield: `분노나 냉소가 치밀 때 3초간 멈추고 속으로 외치기: "이것은 적이 아니라 나의 거대한 골든 섀도우 에너지다."`,
    integrationAction: `그림자가 뿜어내는 거친 에너지를 억누르지 말고, [${goldenShadow.goldenGift}]의 창작 및 비즈니스 돌파 실행으로 즉각 치환하기`
  };

  const calculatedAtKst = formatShadowKstTimestamp(targetDate);
  const shadowSynthesisMatrix = {
    dominantTension: `${primaryShadow.archetype} ↔ ${goldenShadow.goldenGift}`,
    alignmentState: `${primaryShadow.dominantTenGod} 트리거 통찰 → ${goldenShadow.highestPotential}`,
    integratedAction: transmutationRitual.integrationAction,
  };

  const interpretiveBoundary = '본 그림자 자아 & 골든 섀도우 리포트는 분석심리학 원형과 십신 상징에 기반한 정성적 자기 성찰 안내이며, 임상 심리·정신의학적 진단을 대신하지 않습니다.';
  const ritualAction = `[${primaryShadow.dominantTenGod}] ${transmutationRitual.mindsetShield}`;
  const reflectionFocus = `골든 섀도우 연금술(${primaryShadow.archetype}) — ${goldenShadow.goldenGift}`;
  const qHint = (question || '').trim();
  const questionTopic = classifyShadowTopic(qHint);
  const shadowWarning = SHADOW_WARNINGS[questionTopic];
  const reflectiveQuestion = qHint
    ? `지금 "${qHint.slice(0, 36)}" 앞에서 올라오는 불편함이나 방어심 이면에, 내가 아직 인정하지 않은 [${goldenShadow.goldenGift}]의 어떤 힘이 숨어 있을까요?`
    : transmutationRitual.dailyPrompt;

  const synthesisPromptGuidance = `[LUCKEY 융 심리학 그림자 자아 & 골든 섀도우 연금술 v2.3.0 | 연산 시각: ${calculatedAtKst} | 질문 맥락: ${questionTopic}]
- 그림자 원형: [${primaryShadow.archetype}] (지배 십신: ${primaryShadow.dominantTenGod})
- 내면 근원 상처: ${primaryShadow.coreWound}
- 무의식 폭발 트리거: ${primaryShadow.shadowTrigger}
- 주의해야 할 독성 패턴: ${primaryShadow.toxicPattern}
- 각성된 골든 섀도우 권능: [${goldenShadow.goldenGift}] ${goldenShadow.hiddenGeniusPower}
- 궁극의 완성형 자아: ${goldenShadow.highestPotential}
- 교차 매트릭스 [핵심 긴장: ${shadowSynthesisMatrix.dominantTension} | 조율 상태: ${shadowSynthesisMatrix.alignmentState}]
  * 통합 실천: ${shadowSynthesisMatrix.integratedAction}
- 실전 연금술 리추얼: ${transmutationRitual.integrationAction}
- 실천 의례: ${ritualAction}
- 성찰 초점: ${reflectionFocus}
- 성찰 질문: ${reflectiveQuestion}
- 과잉 경계: ${shadowWarning}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: SHADOW_ARCHETYPE_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    questionTopic,
    shadowWarning,
    primaryShadow,
    goldenShadow,
    shadowIntegrationScore,
    subconsciousDepth,
    transmutationRitual,
    synthesisPromptGuidance,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    shadowSynthesisMatrix,
    interpretiveBoundary,
  };
}

export type ShadowArchetypeResult = ShadowArchetypeReport;

export function calculateShadowArchetype(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): ShadowArchetypeResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runShadowArchetypeEngine(profile, targetDate, params?.question);
}

export function formatShadowArchetypePrompt(res: ShadowArchetypeResult): string {
  return res.synthesisPromptGuidance;
}
