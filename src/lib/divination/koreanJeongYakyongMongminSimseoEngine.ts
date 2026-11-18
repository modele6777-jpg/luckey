/**
 * 다산 정약용 선생 《목민심서(牧民心書)》 율기수신 & 애민청렴 공평무사 엔진
 *
 * 조선 후기 1818년 다산 정약용 선생이 강진 유배지 다산초당에서 저술한 불멸의 명저 《목민심서(牧民心書)》 12편 원전 기반.
 * 1. "청렴은 목민관의 본무요, 모든 선의 근원이요, 모든 덕의 뿌리다 (廉者 牧之本務 萬善之源 諸德之根)".
 * 2. 4대 목민 실천 철학:
 *    - 율기(律己): 먼저 자기 자신을 엄격히 다스리고 사리사욕을 멀리함.
 *    - 봉공(奉公): 사적인 인연을 배제하고 공적인 임무에 헌신함.
 *    - 애민(愛民): 힘없고 가난한 약자를 내 가족처럼 지극정성으로 보살핌.
 *    - 진황(賑荒): 재난과 위기 상황에서 지체 없이 자원을 투입해 사람을 살림.
 * 3. 7대 청백리 품계 및 다산초당 친필 성찰 조언 산출
 *
 * @version LUCKEY-JEONG-YAKYONG-MONGMIN-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const JEONG_YAKYONG_MONGMIN_VERSION = 'LUCKEY-JEONG-YAKYONG-MONGMIN-v2.2.0';

export interface MongminOfficialStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  governanceDomain: string;
  integrityBlessing: string;
}

export interface JeongYakyongMongminResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  cheongnyeomIntegrityPurityScore: number; // 청렴결백(淸廉潔白) 사심 배제 및 결백도
  yulgiSelfDisciplineForce: number; // 율기(律己) 내면 수양 및 엄격한 자기 절제력
  aeminCompassionWelfarePower: number; // 애민(愛民) 약자 보살핌 및 구휼 자비력
  bonggongPublicDutyLoyaltyIndex: number; // 봉공(奉公) 공평무사 및 원칙 준수도
  jinhwangCrisisManagementResilience: number; // 진황(賑荒) 위기 대처 및 민생 안정력
  // 세부 명세
  activeOfficialStage: MongminOfficialStage;
  secondaryOfficialStage: MongminOfficialStage;
  primaryMongminVirtue: {
    virtueNameKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  secondaryMongminVirtue: {
    virtueNameKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  dasanChodangLegacy: {
    manuscriptChapterTitle: string;
    practicalWisdom: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  mongminSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function describeMongminStage(score: number): string {
  if (score >= 88) return '청백리 율기(淸白吏 律己) — 사심을 비우고 공정함과 애민의 도리를 바로 세운 원숙기';
  if (score >= 76) return '봉공 애민(奉公 愛民) — 원칙을 지키며 어려운 이의 숨통을 틔우는 안정기';
  return '초심 수신(初心 修身) — 작은 일상의 절제와 성찰부터 다져 나가는 준비기';
}

export type JeongYakyongMongminReport = JeongYakyongMongminResult;

const MONGMIN_STAGES: MongminOfficialStage[] = [
  { stageLevel: 1, stageNameHanja: 'Cheongbaengni (淸白吏)', stageNameKo: '사심 없이 만인의 신망을 받는 청백리', governanceDomain: '사리사욕을 초월하여 공명정대하게 세상을 다스리는 최고 경지', integrityBlessing: '어떤 재물이나 권력의 유혹에도 한 점 부끄러움이 없는 당당함' },
  { stageLevel: 2, stageNameHanja: 'Yulgi Cheongsim (律己淸心)', stageNameKo: '마음을 맑게 씻고 몸가짐을 삼가는 수신관', governanceDomain: '엄격한 자기 규율과 솔선수범으로 신뢰를 쌓음', integrityBlessing: '타인을 탓하기 전에 스스로를 먼저 돌아보는 높은 자존감' },
  { stageLevel: 3, stageNameHanja: 'Aemin Guhyul (愛民救恤)', stageNameKo: '가난하고 외로운 백성을 보살피는 목민관', governanceDomain: '사회적 약자의 고통에 깊이 공감하고 현실적인 복지를 실천', integrityBlessing: '따뜻한 온기와 정성으로 사람들의 마음을 얻는 덕망' },
  { stageLevel: 4, stageNameHanja: 'Gongpyeong Musa (公平無私)', stageNameKo: '편파적 치우침 없이 시비를 가리는 공정관', governanceDomain: '연줄과 청탁을 배제하고 법도와 원칙을 세움', integrityBlessing: '공정한 잣대로 갈등을 해결하고 질서를 바로잡는 위엄' },
  { stageLevel: 5, stageNameHanja: 'Jinhwang Daeryak (賑荒大略)', stageNameKo: '위기 속에서 침착하게 활로를 여는 대책관', governanceDomain: '재난과 난관 앞에서 발 빠르게 자원을 배분하고 극복함', integrityBlessing: '당황하지 않고 현실적인 대안을 실행하는 위기관리 능력' },
  { stageLevel: 6, stageNameHanja: 'Ijeon Jeongbon (吏典正本)', stageNameKo: '업무의 절차와 장부를 투명하게 정돈하는 실무관', governanceDomain: '체계적인 기록 관리와 낭비 요소 제거', integrityBlessing: '작은 디테일까지 소홀히 하지 않는 꼼꼼한 성실성' },
  { stageLevel: 7, stageNameHanja: 'Chosim Buim (初審赴任)', stageNameKo: '초심을 가슴에 품고 첫걸음을 내딛는 공직자', governanceDomain: '겸허하게 현장의 소리를 듣고 배우는 시작', integrityBlessing: '깨끗한 첫 다짐을 잃지 않고 묵묵히 성장하는 정직함' },
];

const MONGMIN_VIRTUES = [
  { virtueNameKo: '청렴은 모든 선의 근원이요 덕의 뿌리다', hanjaMotto: '廉者 牧之本務 萬善之源', coreEssence: '욕심을 버려야 지혜가 밝아지고 비로소 공정한 판단이 가능해짐', actionableDirective: '공짜 점심이나 부당한 편의를 탐하지 말고 떳떳하고 결백하게 행동하십시오.' },
  { virtueNameKo: '남을 다스리기 전에 먼저 나 자신을 엄격히 다스리라', hanjaMotto: '先律其己 乃能律人', coreEssence: '자신에게는 엄격하고 타인에게는 너그러운 진정한 수양', actionableDirective: '타인의 허물을 지적하기에 앞서 오늘 내 언행에 잘못이 없었는지 성찰하십시오.' },
  { virtueNameKo: '사사로운 인연에 얽매이지 말고 공평무사하게 대하라', hanjaMotto: '去私行公 天下爲公', coreEssence: '친소관계나 감정에 휘둘리지 않고 공공의 원칙을 지킴', actionableDirective: '가까운 사람이라고 특혜를 주거나 미운 사람이라고 불이익을 주지 마십시오.' },
  { virtueNameKo: '위기일수록 가장 취약한 곳부터 먼저 보살피라', hanjaMotto: '救荒爲急 活人第一', coreEssence: '형식적인 절차보다 사람의 생명을 살리는 일에 최우선 가치를 둠', actionableDirective: '어려움에 처한 동료나 이웃을 외면하지 말고 즉각적인 도움의 손길을 건네십시오.' },
];

const DASAN_LEGACIES = [
  { manuscriptChapterTitle: '다산초당 벼루에 고인 새벽 먹물', practicalWisdom: '선비가 세상에 태어나 벼슬을 하든 초야에 묻히든, 오직 백성을 이롭게 하는 실사구시(實事求是)의 정신만이 영원히 남는다.' },
  { manuscriptChapterTitle: '목민심서 권두에 쓴 다산의 탄식', practicalWisdom: '털끝 하나인들 병들지 않은 것이 없으니 어찌 고치지 않겠는가. 오늘 내가 고친 작은 불합리가 내일의 큰 희망이 된다.' },
  { manuscriptChapterTitle: '귀양지 18년의 고난과 학문의 꽃', practicalWisdom: '세상이 나를 버렸다고 해서 나 스스로를 버리지 말라. 가장 혹독한 유배지가 가장 찬란한 지혜의 산실이 될 수 있다.' },
  { manuscriptChapterTitle: '두 아들에게 보낸 하피첩의 편지', practicalWisdom: '가난은 부끄러운 것이 아니나 뜻이 없는 것은 부끄러운 것이니, 책을 읽고 농사를 지으며 떳떳한 영혼으로 살아가라.' },
];

function getKstDateString(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateJeongYakyongMongmin(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): JeongYakyongMongminResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`JEONG-YAKYONG-MONGMIN-${birthdate}-${birthtime}-${name}-${query ?? ''}`);

  const cheongnyeomIntegrityPurityScore = (seed % 41) + 60; // 60~100
  const yulgiSelfDisciplineForce = ((seed >> 3) % 43) + 58; // 58~100
  const aeminCompassionWelfarePower = ((seed >> 5) % 39) + 62; // 62~100
  const bonggongPublicDutyLoyaltyIndex = ((seed >> 7) % 45) + 55; // 55~99
  const jinhwangCrisisManagementResilience = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % MONGMIN_STAGES.length;
  const secondaryStageIdx = (stageIdx + 1 + ((seed >> 4) % (MONGMIN_STAGES.length - 1))) % MONGMIN_STAGES.length;
  const activeOfficialStage = MONGMIN_STAGES[stageIdx];
  const secondaryOfficialStage = MONGMIN_STAGES[secondaryStageIdx];

  const virtueIdx = (seed >> 4) % MONGMIN_VIRTUES.length;
  const secondaryVirtueIdx = (virtueIdx + 1 + ((seed >> 6) % (MONGMIN_VIRTUES.length - 1))) % MONGMIN_VIRTUES.length;
  const primaryMongminVirtue = MONGMIN_VIRTUES[virtueIdx];
  const secondaryMongminVirtue = MONGMIN_VIRTUES[secondaryVirtueIdx];

  const legacyIdx = (seed >> 6) % DASAN_LEGACIES.length;
  const dasanChodangLegacy = DASAN_LEGACIES[legacyIdx];

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `《목민심서》의 '${primaryMongminVirtue.virtueNameKo}'와 '${secondaryMongminVirtue.virtueNameKo}'를 비추어 볼 때, "${trimmedQuery}"에서 사사로운 편의를 끊고 공명정대하게 지켜야 할 원칙은 무엇인가요?`
    : `지금 맡은 역할과 판단 앞에서, '${primaryMongminVirtue.virtueNameKo}'의 율기와 '${secondaryMongminVirtue.virtueNameKo}'의 애민을 함께 세우려면 무엇을 먼저 바로잡아야 할까요?`;

  const interpretiveBoundary = '이 지표는 다산 정약용 선생의 《목민심서》 율기·봉공·애민·진황 원칙을 공적·윤리적 선택과 자기 절제를 성찰하는 정성적 거울로 해석한 결과이며, 실제 법률·행정 판단이나 미래 결과를 단정하는 확정 예측이 아닙니다.';

  const calculatedAtKst = getKstDateString(now);
  const avgScore = Math.round(
    (cheongnyeomIntegrityPurityScore +
      yulgiSelfDisciplineForce +
      aeminCompassionWelfarePower +
      bonggongPublicDutyLoyaltyIndex +
      jinhwangCrisisManagementResilience) /
      5,
  );
  const mongminSynthesisMatrix = {
    dominantTension: `${activeOfficialStage.stageNameKo} ↔ ${primaryMongminVirtue.virtueNameKo}`,
    alignmentState: describeMongminStage(avgScore),
    integratedAction: `${primaryMongminVirtue.actionableDirective}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${activeOfficialStage.stageNameKo}] ${primaryMongminVirtue.actionableDirective}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: JEONG_YAKYONG_MONGMIN_VERSION,
    calculatedAtKst,
    cheongnyeomIntegrityPurityScore,
    yulgiSelfDisciplineForce,
    aeminCompassionWelfarePower,
    bonggongPublicDutyLoyaltyIndex,
    jinhwangCrisisManagementResilience,
    activeOfficialStage,
    secondaryOfficialStage,
    primaryMongminVirtue,
    secondaryMongminVirtue,
    dasanChodangLegacy,
    reflectiveQuestion,
    interpretiveBoundary,
    mongminSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatJeongYakyongMongminPrompt(result: JeongYakyongMongminResult): string {
  const avgScore = Math.round(
    (result.cheongnyeomIntegrityPurityScore +
      result.yulgiSelfDisciplineForce +
      result.aeminCompassionWelfarePower +
      result.bonggongPublicDutyLoyaltyIndex +
      result.jinhwangCrisisManagementResilience) /
      5,
  );
  const lines = [
    `[📜 다산 정약용 선생 《목민심서(牧民心書)》 율기수신 & 애민청렴 리포트]`,
    `- 연산 시각: ${result.calculatedAtKst} | 엔진 버전: ${result.engineVersion}`,
    `- 목민 성찰 국면: ${describeMongminStage(avgScore)}`,
    `- 현행 청백리 품계: **[${result.activeOfficialStage.stageNameKo} (${result.activeOfficialStage.stageNameHanja})]**`,
    `- 보조 교차 품계: **[${result.secondaryOfficialStage.stageNameKo} (${result.secondaryOfficialStage.stageNameHanja})]**`,
    `  → 관장 영역: ${result.activeOfficialStage.governanceDomain}`,
    `  → 청렴 실천 축복: ${result.activeOfficialStage.integrityBlessing}`,
    `- 최우선 목민 덕목: **[${result.primaryMongminVirtue.virtueNameKo} (${result.primaryMongminVirtue.hanjaMotto})]**`,
    `- 보조 교차 덕목: **[${result.secondaryMongminVirtue.virtueNameKo} (${result.secondaryMongminVirtue.hanjaMotto})]**`,
    `  → 핵심 본질: ${result.primaryMongminVirtue.coreEssence}`,
    `  → 실천 지침: ${result.primaryMongminVirtue.actionableDirective}`,
    `- 다산초당 실학의 불멸 유산: 《${result.dasanChodangLegacy.manuscriptChapterTitle}》`,
    `  → 실사구시 불멸 지혜: "${result.dasanChodangLegacy.practicalWisdom}"`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ];
  if (result.mongminSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${result.mongminSynthesisMatrix.dominantTension} | 조율 상태: ${result.mongminSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${result.mongminSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${result.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${result.reflectionFocus}`,
  );
  return lines.join('\n');
}
