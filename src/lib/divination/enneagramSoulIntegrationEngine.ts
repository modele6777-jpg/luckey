/**
 * =========================================================================
 * LUCKEY 에니어그램 영혼 성격 통합 & 의식 진화 엔진 (Enneagram Soul Integration Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 고대 영성 기원의 에니어그램(Enneagram 9 Personality Types)과 사주 십신(비겁·식상·재성·관성·인성),
 * 그리고 융 심리학의 방어기제 및 초개인 심리학의 의식 성장 단계를 결합한 엔진입니다.
 * 
 * 1. 3대 에너지 중추(Triad):
 *    - 본능/장 중추 (Gut/Instinctive 8·9·1번): 분노와 자율성
 *    - 감정/가슴 중추 (Heart/Feeling 2·3·4번): 수치심과 정체성/인정
 *    - 사고/머리 중추 (Head/Thinking 5·6·7번): 두려움과 안전/통제
 * 2. 9대 성격 원형(Core Type) & 역동적 날개(Wing):
 * 3. 스트레스 시 분열(Disintegration / Direction of Stress) vs 의식 상승 시 통합(Integration / Direction of Growth):
 * 4. 영혼의 해방과 각성을 위한 핵심 참선 과제(Soul Liberation Task):
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const ENNEAGRAM_INTEGRATION_VERSION = 'LUCKEY-ENNEAGRAM-v2.2.0';

export interface EnneagramTypeDetails {
  coreNumber: number; // 1 ~ 9
  koreanTitle: string;
  triad: '본능/장 중추 (Gut)' | '감정/가슴 중추 (Heart)' | '사고/머리 중추 (Head)';
  dominantWing: string;
  coreFear: string;
  coreDesire: string;
  stressDisintegration: {
    targetType: number;
    description: string;
  };
  growthIntegration: {
    targetType: number;
    description: string;
  };
}

export interface EnneagramSoulIntegrationReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  soulType: EnneagramTypeDetails;
  egoFixation: string;             // 에고의 고착 (예: 완벽주의, 허영, 탐욕, 두려움 등)
  virtueAscension: string;         // 영혼이 회복해야 할 본연의 미덕 (예: 평정, 진실성, 자비, 용기 등)
  integrationScore: number;        // 현재 의식 수준 및 통합 지수 (내부 호환용 0 ~ 100)
  soulLiberationTask: string;      // 낡은 에고 패턴을 깨뜨리는 실천 과제
  situationalEnneagramAudit: {
    focusTheme: string;
    egoSignal: string;
    integrationStep: string;
  };
  temporalEnneagramRhythm: {
    kstTimeLabel: string;
    centerWatchWindow: string;
    seasonalIntegrationTone: string;
    temporalGuidance: string;
  };
  enneagramSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  boundaryNotice: string;
  interpretiveBoundary: string;
  reflectiveQuestion?: string;
  synthesisPromptGuidance: string;
}

function getTemporalEnneagramRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const centerWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 장중추(Gut) 각성창 — 내면의 자동 반응을 알아차리고 오늘의 의도를 바로 세우는 시간'
      : hour >= 11 && hour < 17
        ? '정오 머리중추(Head) 명료창 — 불안과 분별을 가라앉히고 본질에 집중해 실행하는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 가슴중추(Heart) 공감창 — 타인의 시선에서 벗어나 진정한 나다움을 회복하는 시간'
          : '심야 통합(Integration) 성찰창 — 하루의 에고 방어기제를 내려놓고 미덕을 되새기는 시간';

  const seasonalIntegrationTone =
    month >= 3 && month <= 5
      ? '봄 · 통합 개화기 (새로운 성장 방향의 태도를 가볍게 실험하기 좋은 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 역동 발현기 (과열된 에고 고착을 알아차리고 유연함을 더하는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 성숙 수렴기 (경험을 지혜로 통합하며 내면의 중심을 다지는 시기)'
          : '겨울 · 고요 관조기 (두려움의 뿌리를 잠잠히 비추어 평정을 기르는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm}:00+09:00 (KST)`,
    centerWatchWindow,
    seasonalIntegrationTone,
    temporalGuidance: `${centerWatchWindow} · ${seasonalIntegrationTone}의 결에 맞추어 의식적 통합 방향을 선택하십시오.`,
  };
}

export function runEnneagramSoulIntegrationEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): EnneagramSoulIntegrationReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const seed = (ganCode * 13 + targetDate.getDate() * 17 + (targetDate.getMonth() + 1) * 7) % 100;

  // 오행과 사주 기운에 기반한 핵심 에니어그램 유형 도출
  let coreNumber: number;
  let dominantWing: string;
  let triad: EnneagramTypeDetails['triad'];
  let koreanTitle: string;
  let coreFear: string;
  let coreDesire: string;
  let egoFixation: string;
  let virtueAscension: string;
  let stressTarget: number;
  let stressDesc: string;
  let growthTarget: number;
  let growthDesc: string;

  if (element === '금') {
    // 경금/신금 -> 1번 개혁가(완벽주의자) 또는 8번 도전가
    if (ganCode % 2 === 0) {
      coreNumber = 1;
      triad = '본능/장 중추 (Gut)';
      dominantWing = '1w9 (이상주의자 - 고요하고 원칙적인 평화 수호)';
      koreanTitle = '1번 유형: 개혁가 & 완벽의 기준을 세우는 원칙주의자 (The Reformer)';
      coreFear = '결함이 있거나 부패하고 불의한 존재가 되는 것에 대한 두려움';
      coreDesire = '온전함, 균형, 높은 도덕적 정직성을 유지하는 것';
      egoFixation = '분개(Resentment)와 비판적 완벽주의';
      virtueAscension = '평정(Serenity)과 불완전함에 대한 너그러운 수용';
      stressTarget = 4;
      stressDesc = '극심한 스트레스 시 4번 유형처럼 변덕스럽고 우울하며 자기연민에 빠짐';
      growthTarget = 7;
      growthDesc = '의식이 상승하고 통합될 때 7번 유형처럼 유쾌하고 낙천적이며 즉흥적인 여유를 체득함';
    } else {
      coreNumber = 8;
      triad = '본능/장 중추 (Gut)';
      dominantWing = '8w7 (독립가 - 거침없는 추진력과 대담한 비전)';
      koreanTitle = '8번 유형: 도전자 & 압도적 주도권을 쥐는 리더 (The Challenger)';
      coreFear = '타인에게 통제당하거나 약점을 잡히는 것에 대한 두려움';
      coreDesire = '자기 자신과 소중한 사람들을 지키고 주권을 행사하는 것';
      egoFixation = '복수심(Vengeance)과 과도한 지배 욕구';
      virtueAscension = '순수성(Innocence)과 약자에 대한 자애로운 보호';
      stressTarget = 5;
      stressDesc = '극심한 스트레스 시 5번 유형처럼 감정을 닫고 비밀스럽고 냉담하게 철수함';
      growthTarget = 2;
      growthDesc = '의식이 상승하고 통합될 때 2번 유형처럼 따뜻하고 헌신적인 사랑을 베풀며 신뢰를 얻음';
    }
  } else if (element === '목') {
    // 갑목/을목 -> 3번 성취자 또는 7번 열정가
    if (ganCode % 2 === 0) {
      coreNumber = 3;
      triad = '감정/가슴 중추 (Heart)';
      dominantWing = '3w4 (전문가 - 독창적인 개성과 압도적 성과의 결합)';
      koreanTitle = '3번 유형: 성취자 & 불가능을 실현하는 승부사 (The Achiever)';
      coreFear = '가치 없는 존재로 전락하거나 실패하는 것에 대한 두려움';
      coreDesire = '탁월한 역량을 인정받고 가치 있는 성공을 증명하는 것';
      egoFixation = '허영(Vanity)과 이미지 조작';
      virtueAscension = '진실성(Authenticity)과 결과 너머의 진정한 나다움';
      stressTarget = 9;
      stressDesc = '극심한 스트레스 시 9번 유형처럼 무기력하게 번아웃되어 현실을 도피함';
      growthTarget = 6;
      growthDesc = '의식이 상승하고 통합될 때 6번 유형처럼 공동체에 충실하고 팀을 진심으로 위하는 리더로 성숙함';
    } else {
      coreNumber = 7;
      triad = '사고/머리 중추 (Head)';
      dominantWing = '7w8 (현실주의자 - 강력한 파워와 즐거움을 함께 쥐는 실천가)';
      koreanTitle = '7번 유형: 열정가 & 무한한 가능성을 탐험하는 비전 메이커 (The Enthusiast)';
      coreFear = '고통과 결핍에 갇히거나 자유를 박탈당하는 것에 대한 두려움';
      coreDesire = '다채로운 경험을 누리고 온전한 자유와 행복을 만끽하는 것';
      egoFixation = '탐닉(Gluttony)과 산만함';
      virtueAscension = '절제(Sobriety)와 현재 순간에 깊이 머무는 현존';
      stressTarget = 1;
      stressDesc = '극심한 스트레스 시 1번 유형처럼 까다롭고 비판적이며 경직된 태도로 돌변함';
      growthTarget = 5;
      growthDesc = '의식이 상승하고 통합될 때 5번 유형처럼 한 분야를 깊이 있게 파고들어 마스터가 됨';
    }
  } else if (element === '화') {
    // 병화/정화 -> 2번 조력가 또는 4번 개인주의자
    coreNumber = 4;
    triad = '감정/가슴 중추 (Heart)';
    dominantWing = '4w3 (귀족 - 세련된 예술성과 대중적 영향력의 융합)';
    koreanTitle = '4번 유형: 개인주의자 & 깊은 심연을 노래하는 창조적 예술가 (The Individualist)';
    coreFear = '남들과 똑같거나 아무런 고유한 정체성이 없는 것에 대한 두려움';
    coreDesire = '자신만의 독보적 정체성과 내면의 진실을 온전히 창조하는 것';
    egoFixation = '우울(Melancholy)과 시기심';
    virtueAscension = '평정심(Equanimity)과 현재 가진 축복에 대한 감사';
    stressTarget = 2;
    stressDesc = '극심한 스트레스 시 2번 유형처럼 애정에 굶주려 상대방에게 집착하고 매달림';
    growthTarget = 1;
    growthDesc = '의식이 상승하고 통합될 때 1번 유형처럼 객관적인 원칙과 철저한 실행력으로 비전을 완성함';
  } else if (element === '토') {
    // 무토/기토 -> 9번 평화주의자 또는 6번 충실가
    coreNumber = 9;
    triad = '본능/장 중추 (Gut)';
    dominantWing = '9w1 (몽상가 - 내적 고요함과 높은 도덕적 기준의 조화)';
    koreanTitle = '9번 유형: 평화주의자 & 갈등을 치유하는 포용의 중재자 (The Peacemaker)';
    coreFear = '연결이 끊어지거나 분열과 혼란에 휘말리는 것에 대한 두려움';
    coreDesire = '내면의 평화와 조화, 안정된 연결을 유지하는 것';
    egoFixation = '태만(Indolence)과 자기 망각';
    virtueAscension = '올바른 행동(Right Action)과 자신의 욕망을 깨우는 당당함';
    stressTarget = 6;
    stressDesc = '극심한 스트레스 시 6번 유형처럼 과도하게 의심하고 불안에 떨며 방어적이 됨';
    growthTarget = 3;
    growthDesc = '의식이 상승하고 통합될 때 3번 유형처럼 자신의 가치를 명확히 알고 당당하게 목표를 성취함';
  } else {
    // 임수/계수 -> 5번 탐구자 (The Investigator)
    coreNumber = 5;
    triad = '사고/머리 중추 (Head)';
    dominantWing = '5w6 (문제 해결자 - 객관적 데이터와 철저한 위기 대응력)';
    koreanTitle = '5번 유형: 탐구자 & 본질의 법칙을 꿰뚫는 지혜의 관찰자 (The Investigator)';
    coreFear = '무능하거나 압도당하여 세상에 대처할 자원이 고갈되는 것에 대한 두려움';
    coreDesire = '완벽한 지식과 전문성을 갖추어 독립적으로 서는 것';
    egoFixation = '인색함(Avarice)과 현실 철수';
    virtueAscension = '전일성(Omniscience)과 세상을 향해 아낌없이 지혜를 나누는 참여';
    stressTarget = 7;
    stressDesc = '극심한 스트레스 시 7번 유형처럼 충동적이고 산만하게 쾌락과 자극을 좇음';
    growthTarget = 8;
    growthDesc = '의식이 상승하고 통합될 때 8번 유형처럼 지식을 현실의 강력한 리더십과 실행력으로 전환함';
  }

  const soulType: EnneagramTypeDetails = {
    coreNumber,
    koreanTitle,
    triad,
    dominantWing,
    coreFear,
    coreDesire,
    stressDisintegration: {
      targetType: stressTarget,
      description: stressDesc
    },
    growthIntegration: {
      targetType: growthTarget,
      description: growthDesc
    }
  };

  const integrationScore = 80 + ((ganCode + seed) % 19);

  const soulLiberationTask = `에고가 [${egoFixation}]의 덫에 빠질 때 멈추고 심호흡하세요. [${stressDesc}]의 경고 신호가 올 때, 의식적으로 [${growthDesc}]의 통합 방향을 선택하여 [${virtueAscension}]의 영혼 미덕을 깨우는 것이 궁극의 마스터리입니다.`;

  const q = (question || '').trim();
  const temporalEnneagramRhythm = getTemporalEnneagramRhythm(targetDate);
  const situationalEnneagramAudit = /관계|사람|소통|연애|가족/.test(q)
    ? {
        focusTheme: `${triad} 관계 방어기제 자각과 [${virtueAscension}] 회복`,
        egoSignal: `관계가 흔들릴 때 [${egoFixation}] 패턴이나 ${stressTarget}번 분열 신호가 올라올 수 있습니다.`,
        integrationStep: `${growthTarget}번 통합 방향(${growthDesc})의 태도를 의식적으로 한 번 먼저 건네십시오.`,
      }
    : /일|결정|불안|진로|실패/.test(q)
      ? {
          focusTheme: `[${coreDesire}]를 향한 건강한 실행과 스트레스 분열 예방`,
          egoSignal: `[${coreFear}]가 건드려질 때 조급해지기 쉬우니 한 호흡 멈추는 것이 중요합니다.`,
          integrationStep: soulLiberationTask,
        }
      : {
          focusTheme: `${coreNumber}번 유형(${dominantWing})의 의식 통합`,
          egoSignal: egoFixation,
          integrationStep: soulLiberationTask,
        };

  const enneagramSynthesisMatrix = {
    coreInsight: `[${coreNumber}번 · ${triad}] 에고 고착(${egoFixation})을 넘어 ${growthTarget}번 통합 방향으로 나아가는 구조입니다.`,
    recommendedAction: soulLiberationTask,
    cautionNotice: '에니어그램 유형은 나를 가두는 꼬리표가 아니라 자동 반응에서 깨어나는 거울로만 활용하십시오.',
  };

  const boundaryNotice = '본 결과는 사주 오행 상징과 에니어그램 성격 역동 모델을 결합한 정성적 자기 이해 안내이며, 임상 심리 진단이 아닙니다.';
  const qHint = (question || '').trim();
  const reflectiveQuestion = qHint
    ? `지금 "${qHint.slice(0, 36)}" 앞에서 반복되는 자동 반응(${egoFixation})을 잠시 멈추고, ${growthTarget}번 통합 방향의 미덕(${virtueAscension})으로 한 걸음 옮긴다면 어떤 선택이 보일까요?`
    : `오늘 내가 가장 지키고 싶었던 '${coreFear}'의 반대편에서, 본연의 미덕(${virtueAscension})을 선택할 수 있는 작은 장면은 무엇인가요?`;

  const synthesisPromptGuidance = `[LUCKEY 에니어그램 영혼 성격 통합 & 의식 진화 ${ENNEAGRAM_INTEGRATION_VERSION}]
- 연산 시각: ${temporalEnneagramRhythm.kstTimeLabel}
- 핵심 유형: ${koreanTitle}
- 에너지 중추: ${triad} | 주 날개: ${dominantWing}
- 핵심 두려움: ${coreFear}
- 핵심 열망: ${coreDesire}
- 에고의 고착(Fixation): [${egoFixation}] -> 영혼의 미덕(Virtue): [${virtueAscension}]
- 스트레스 분열(Disintegration): ${stressTarget}번 방향 (${stressDesc})
- 성장 통합(Integration): ${growthTarget}번 방향 (${growthDesc})
- 질문 맥락 감사 (${situationalEnneagramAudit.focusTheme}): ${situationalEnneagramAudit.egoSignal}
- KST 시공간 통합 리듬: ${temporalEnneagramRhythm.centerWatchWindow} / ${temporalEnneagramRhythm.seasonalIntegrationTone}
  * 시공간 지침: ${temporalEnneagramRhythm.temporalGuidance}
- 에니어그램 교차 매트릭스: 핵심(${enneagramSynthesisMatrix.coreInsight}) | 실행(${enneagramSynthesisMatrix.recommendedAction}) | 주의(${enneagramSynthesisMatrix.cautionNotice})
- 영혼 해방 실천 과제: ${soulLiberationTask}
- 성찰 질문: ${reflectiveQuestion}
- 해석 경계: ${boundaryNotice}`;

  return {
    engineVersion: ENNEAGRAM_INTEGRATION_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst: temporalEnneagramRhythm.kstTimeLabel,
    soulType,
    egoFixation,
    virtueAscension,
    integrationScore,
    soulLiberationTask,
    situationalEnneagramAudit,
    temporalEnneagramRhythm,
    enneagramSynthesisMatrix,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    reflectiveQuestion,
    synthesisPromptGuidance
  };
}

export type EnneagramSoulIntegrationResult = EnneagramSoulIntegrationReport;

export function calculateEnneagramSoulIntegration(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): EnneagramSoulIntegrationResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runEnneagramSoulIntegrationEngine(profile, targetDate, params?.question);
}

export function formatEnneagramSoulIntegrationPrompt(res: EnneagramSoulIntegrationResult): string {
  return res.synthesisPromptGuidance;
}
