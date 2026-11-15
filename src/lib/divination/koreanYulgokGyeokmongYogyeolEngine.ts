/**
 * 조선 중기 대학자 율곡 이이(栗谷 李珥) 선생의 《격몽요결(擊蒙要訣)》 입지·혁구습·구용구사 수신 실천 엔진
 *
 * 1577년(선조 10년) 율곡 이이 선생이 해주 석담에서 학문을 시작하는 후학들을 위해 저술한 불멸의 수양서 《격몽요결》 10장 원전 기반.
 * 1. 입지(立志): 성인(聖人)을 표준으로 삼아 큰 뜻을 먼저 굳건히 세움.
 * 2. 혁구습(革舊習): 나태함, 핑계, 헛된 망상 등 몸에 밴 나쁜 옛 습관을 칼로 자르듯 혁신함.
 * 3. 지신(持身)과 구용(九容)·구사(九思):
 *    - 구용(九容): 족용중(발), 수용공(손), 목용단(눈), 구용지(입), 성용정(소리), 두용직(머리), 기용숙(기운), 입용덕(서 있는 태도), 안용장(얼굴).
 *    - 구사(九思): 시사명(봄), 청사총(들음), 색사온(표정), 모사공(태도), 언사충(말), 사사경(일), 의사문(의심), 분사난(분노), 견득사의(이익).
 * 4. 독서(讀書): 이치를 궁구하여 일상에서 실천하는 실학적 성찰.
 * 5. 사친(事親)·접인(接人)·처세(處世): 가족을 공경하고 사람을 대함에 정성을 다하는 실천궁행.
 *
 * @version LUCKEY-YULGOK-GYEOKMONG-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const YULGOK_GYEOKMONG_VERSION = 'LUCKEY-YULGOK-GYEOKMONG-v2.0.0';

export interface YulgokStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  scholarDomain: string;
  sagelyBlessing: string;
}

export interface YulgokGyeokmongResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  ipjiNobleAspirationIndex: number; // 입지 큰 뜻을 세우는 지향도
  hyeokguseupOldHabitReformForce: number; // 혁구습 묵은 습관 단절력
  guyongGusaComposureMindfulness: number; // 구용구사 몸가짐과 사유의 정밀도
  dokseoInquiryPracticalWisdom: number; // 독서 궁리 및 실천 지혜력
  jisinMoralDignitySincerity: number; // 지신 수신처세의 진정성 및 위엄
  // 세부 명세
  activeScholarStage: YulgokStage;
  primaryYulgokPrecept: {
    preceptTitleKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  gyeokmongMasteryEpiphany: {
    studySceneTitle: string;
    virtuousWisdom: string;
  };
  yulgokSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export type YulgokGyeokmongReport = YulgokGyeokmongResult;

const YULGOK_STAGES: YulgokStage[] = [
  { stageLevel: 1, stageNameHanja: '立志成聖 (입지성성)', stageNameKo: '성인을 목표로 삼아 뜻을 세우는 대의관', scholarDomain: '스스로를 낮추어 포기하지 않고 가장 높은 인격적 완성을 지향함', sagelyBlessing: '세속의 유혹에 흔들리지 않는 굳건하고 당당한 삶의 방향성' },
  { stageLevel: 2, stageNameHanja: '革舊自新 (혁구자신)', stageNameKo: '나태한 옛 습관을 단칼에 끊어내는 쇄신관', scholarDomain: '게으름과 핑계를 단호히 베어내고 일상의 규칙을 확립함', sagelyBlessing: '시간 낭비를 원천 차단하고 영혼의 활력을 되찾는 결단력' },
  { stageLevel: 3, stageNameHanja: '九容九思 (구용구사)', stageNameKo: '단정한 몸가짐과 맑은 생각으로 내면을 닦는 성찰관', scholarDomain: '앉고 서고 말하고 바라보는 모든 순간에 깨어 있는 정성을 기울임', sagelyBlessing: '조급함을 가라앉히고 언제나 차분하고 깊은 신뢰를 주는 품격' },
  { stageLevel: 4, stageNameHanja: '讀書窮理 (독서궁리)', stageNameKo: '책을 읽어 사물의 이치를 밝히고 삶에 적용하는 지혜관', scholarDomain: '지식의 암기에 머물지 않고 배운 바를 일상의 행동으로 증명함', sagelyBlessing: '복잡한 문제의 본질을 단번에 꿰뚫어 보는 명쾌한 판단력' },
  { stageLevel: 5, stageNameHanja: '誠意正心 (성의정심)', stageNameKo: '뜻을 참되게 하고 마음을 바르게 하는 순수관', scholarDomain: '남이 보지 않는 곳에서도 스스로를 속이지 않는 신독(愼獨)의 실천', sagelyBlessing: '한 점 부끄러움 없는 맑은 양심이 뿜어내는 도덕적 위엄' },
  { stageLevel: 6, stageNameHanja: '和順接人 (화순접인)', stageNameKo: '화평하고 순한 마음으로 사람을 대우하는 포용관', scholarDomain: '오만과 편견을 버리고 모든 사람에게 공경과 진실한 예우를 다함', sagelyBlessing: '적대감을 녹이고 주변 사람들의 진심 어린 화합을 이끄는 덕망' },
  { stageLevel: 7, stageNameHanja: '實踐躬行 (실천궁행)', stageNameKo: '말보다 행동을 앞세워 묵묵히 소임을 완수하는 완성관', scholarDomain: '말잔치에 그치지 않고 구체적인 현실의 열매로 삶을 증명함', sagelyBlessing: '어려운 국면에서도 공동체를 지탱하는 믿음직한 기둥의 힘' },
];

const YULGOK_PRECEPTS = [
  { preceptTitleKo: '입지(立志): 스스로 한계를 긋지 말고 큰 뜻을 품으라', hanjaMotto: '初學 先須立志 必以聖人自期', coreEssence: '나 같은 사람이 어찌 큰일을 하겠느냐며 물러서지 말고 당당히 정진함', actionableDirective: '자신의 잠재력을 과소평가하지 말고 가장 높은 목표를 향해 오늘 첫걸음을 떼십시오.' },
  { preceptTitleKo: '혁구습(革舊習): 게으름과 헛된 잡념을 단칼에 베어내라', hanjaMotto: '奮發一刀 截斷根株', coreEssence: '내일부터 하겠다는 핑계를 버리고 나쁜 습관의 뿌리를 지금 당장 잘라냄', actionableDirective: '작은 미루기나 불필요한 스마트폰 중독 등 반복되는 악습을 즉각 중단하십시오.' },
  { preceptTitleKo: '구용구사(九容九思): 몸가짐을 무겁게 하고 사유를 맑게 하라', hanjaMotto: '足容重 手容恭 目容端 口容止', coreEssence: '발걸음은 무겁게 손은 공손하게 눈빛은 바르게 하여 중심을 지킴', actionableDirective: '불안하게 서두르지 말고 몸의 자세를 바로잡고 심호흡하며 차분하게 임하십시오.' },
  { preceptTitleKo: '견득사의(見得思義): 이익을 보거든 그것이 의로운지 먼저 생각하라', hanjaMotto: '見得思義 見危授命', coreEssence: '눈앞의 사소한 이익에 눈이 멀어 양심과 원칙을 저버리지 않음', actionableDirective: '달콤한 유혹 앞에서 정당한 절차와 도덕적 기준에 부합하는지 냉정히 검토하십시오.' },
];

const GYEOKMONG_EPIPHANIES = [
  { studySceneTitle: '석담서원 청계천 물소리 속 새벽 등불 아래의 사유', virtuousWisdom: '배움이란 특별한 재주가 아니라 날마다 나의 모난 구석을 깎아내고 바른 본성을 회복하는 일이다.' },
  { studySceneTitle: '칼날로 얽힌 잡초 뿌리를 내리치는 결단의 순간', virtuousWisdom: '과거의 허물에 얽매여 자책하지 말라. 마음을 새롭게 먹는 그 순간이 곧 새로운 운명의 시작이다.' },
  { studySceneTitle: '거울 앞에 서서 옷깃을 여미고 눈빛을 정돈하는 선비', virtuousWisdom: '겉모습이 단정하면 내면의 혼란도 자연히 가라앉나니, 몸가짐 하나에도 지극한 정성을 다하라.' },
  { studySceneTitle: '거친 비바람 속에서도 꼿꼿이 서 있는 석담의 소나무', virtuousWisdom: '세상이 나를 알아주지 않아도 실망하지 말라. 홀로 있어도 스스로를 속이지 않는 자는 천하에 부끄러움이 없다.' },
];

function getKstDateString(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeYulgokStage(score: number): string {
  if (score >= 85) return '실천궁행(實踐躬行) — 입지와 구용구사가 일상의 태도로 무르익은 성숙기';
  if (score >= 75) return '혁구자신(革舊自新) — 묵은 습관을 털어내고 배움의 중심을 세우는 정돈기';
  return '초학입지(初學立志) — 큰 뜻을 먼저 세우고 일상의 작은 정성부터 다지는 출발기';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateYulgokGyeokmong(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): YulgokGyeokmongResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`YULGOK-GYEOKMONG-${birthdate}-${birthtime}-${name}`);

  const ipjiNobleAspirationIndex = (seed % 41) + 60; // 60~100
  const hyeokguseupOldHabitReformForce = ((seed >> 3) % 43) + 58; // 58~100
  const guyongGusaComposureMindfulness = ((seed >> 5) % 39) + 62; // 62~100
  const dokseoInquiryPracticalWisdom = ((seed >> 7) % 45) + 55; // 55~99
  const jisinMoralDignitySincerity = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % YULGOK_STAGES.length;
  const activeScholarStage = YULGOK_STAGES[stageIdx];

  const preceptIdx = (seed >> 4) % YULGOK_PRECEPTS.length;
  const primaryYulgokPrecept = YULGOK_PRECEPTS[preceptIdx];

  const epiphanyIdx = (seed >> 6) % GYEOKMONG_EPIPHANIES.length;
  const gyeokmongMasteryEpiphany = GYEOKMONG_EPIPHANIES[epiphanyIdx];

  const avgScore = Math.round(
    (ipjiNobleAspirationIndex +
      hyeokguseupOldHabitReformForce +
      guyongGusaComposureMindfulness +
      dokseoInquiryPracticalWisdom +
      jisinMoralDignitySincerity) /
      5,
  );
  const yulgokSynthesisMatrix = {
    dominantTension: `${activeScholarStage.stageNameKo} ↔ ${primaryYulgokPrecept.preceptTitleKo}`,
    alignmentState: describeYulgokStage(avgScore),
    integratedAction: `${primaryYulgokPrecept.actionableDirective}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: YULGOK_GYEOKMONG_VERSION,
    calculatedAtKst: getKstDateString(now),
    ipjiNobleAspirationIndex,
    hyeokguseupOldHabitReformForce,
    guyongGusaComposureMindfulness,
    dokseoInquiryPracticalWisdom,
    jisinMoralDignitySincerity,
    activeScholarStage,
    primaryYulgokPrecept,
    gyeokmongMasteryEpiphany,
    yulgokSynthesisMatrix,
  };
}

export function formatYulgokGyeokmongPrompt(result: YulgokGyeokmongResult): string {
  const avgScore = Math.round(
    (result.ipjiNobleAspirationIndex +
      result.hyeokguseupOldHabitReformForce +
      result.guyongGusaComposureMindfulness +
      result.dokseoInquiryPracticalWisdom +
      result.jisinMoralDignitySincerity) /
      5,
  );
  const lines = [
    `[📖 조선 율곡 이이(栗谷 李珥) 《격몽요결(擊蒙要訣)》 입지·구용구사 수신 리포트]`,
    `- 연산 시각: ${result.calculatedAtKst} | 엔진: ${result.engineVersion}`,
    `- 수양 국면: ${describeYulgokStage(avgScore)}`,
    `- 현행 수양적 품계: **[${result.activeScholarStage.stageNameKo} (${result.activeScholarStage.stageNameHanja})]**`,
    `  → 관장 영역: ${result.activeScholarStage.scholarDomain}`,
    `  → 성현의 축복: ${result.activeScholarStage.sagelyBlessing}`,
    `- 최우선 격몽 지침: **[${result.primaryYulgokPrecept.preceptTitleKo} (${result.primaryYulgokPrecept.hanjaMotto})]**`,
    `  → 핵심 본질: ${result.primaryYulgokPrecept.coreEssence}`,
    `  → 실천 지침: ${result.primaryYulgokPrecept.actionableDirective}`,
    `- 격몽요결 불멸의 가르침: 《${result.gyeokmongMasteryEpiphany.studySceneTitle}》`,
    `  → 율곡 선생의 지혜: "${result.gyeokmongMasteryEpiphany.virtuousWisdom}"`,
  ];
  if (result.yulgokSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${result.yulgokSynthesisMatrix.dominantTension} | 조율 상태: ${result.yulgokSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${result.yulgokSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
