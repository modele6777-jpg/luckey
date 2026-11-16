/**
 * 한국 근대 동학농민혁명 녹두장군 전봉준 《사발통문(沙鉢通文)》 & 백산 창의 4대 강령 의기 결집 엔진
 *
 * 1894년 갑오동학농민혁명 주모자 식별 방지 《사발통문》 및 고부·백산 창의 격문 원전 기반.
 * 1. 녹두장군 전봉준의 평등과 연대의 상징인 원형 서명 '사발통문(沙鉢通文)' 정신: 수평적 연대와 상호 신뢰.
 * 2. 백산 창의 4대 행동강령:
 *    - 제폭구민(除暴救民): 포학한 것을 물리치고 억울하고 고통받는 백성을 구원함.
 *    - 보국안민(輔國安民): 나라의 근본을 바로잡고 모든 공동체 구성원을 편안하게 함.
 *    - 척왜척양(斥倭斥洋): 외세의 부당한 간섭과 억압을 배격하고 자주성을 수호함.
 *    - 진멸권귀(盡滅權貴): 사리사욕에 눈먼 부패한 기득권의 악습을 타파함.
 * 3. 7대 의기(義氣) 결집 품계 및 새야 새야 파랑새 청포도 민중 소생력 산출
 *
 * @version LUCKEY-JEON-BONGJUN-NOKDU-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const JEON_BONGJUN_NOKDU_VERSION = 'LUCKEY-JEON-BONGJUN-NOKDU-v2.1.0';

export interface NokduGeneralStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  righteousDomain: string;
  peasantResilienceBlessing: string;
}

export interface JeonBongjunNokduResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  sabalTongmunHorizontalSolidarity: number; // 사발통문 원형 수평연대 지수
  baeksanRighteousForce: number; // 백산 창의 대의명분 및 의기 결집력
  jepokGuminSalvationPower: number; // 제폭구민의 약자 보호 및 구원력
  bogukAnminPeaceStabilityScore: number; // 보국안민의 삶의 터전 안정도
  cheongpodoSpringResilience: number; // 엄동설한을 뚫는 청포도 봄 소생력
  // 세부 명세
  activeNokduStage: NokduGeneralStage;
  primaryRighteousManifesto: {
    manifestoTitleKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  secondaryRighteousManifesto: {
    manifestoTitleKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  donghakPeasantLegacy: {
    legacyTitle: string;
    historicalWisdom: string;
  };
  nokduSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatNokduKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeNokduStage(score: number): string {
  if (score >= 88) return '백산창의(白山倡義) — 수평적 연대와 대의의 기개가 흔들림 없이 맞물린 결집기';
  if (score >= 76) return '사발통문(沙鉢通文) — 서로의 뜻을 둥글게 모아 일상의 터전을 지키는 상생기';
  return '녹두신아(綠豆新芽) — 추운 땅 밑에서 꺾이지 않고 새봄의 기운을 다지는 준비기';
}

export type JeonBongjunNokduReport = JeonBongjunNokduResult;

const NOKDU_STAGES: NokduGeneralStage[] = [
  { stageLevel: 1, stageNameHanja: 'Baeksan Changui (白山倡義)', stageNameKo: '모두가 주인 되어 일어서는 백산의 함성', righteousDomain: '억압을 뚫고 새로운 대안을 제시하는 시대적 개척', peasantResilienceBlessing: '두려움을 넘어 대의를 위해 당당히 나서는 용기' },
  { stageLevel: 2, stageNameHanja: 'Sabal Tongmun (沙鉢通文)', stageNameKo: '둥글게 뜻을 모으는 수평적 원형 연대', righteousDomain: '상하 위계 없이 서로를 신뢰하는 동지적 결속', peasantResilienceBlessing: '혼자가 아니라 믿을 수 있는 이들과 어깨를 나란히 함' },
  { stageLevel: 3, stageNameHanja: 'Gobu Gyeokmun (古阜檄文)', stageNameKo: '거짓과 부조리를 고발하는 정의의 외침', righteousDomain: '왜곡된 관행을 거부하고 상식을 회복하는 정론', peasantResilienceBlessing: '옳고 그름을 명확히 가려내는 올곧은 분별력' },
  { stageLevel: 4, stageNameHanja: 'Hwangtojae Seungjeon (黃土峴勝捷)', stageNameKo: '불리한 지세를 극복하는 지혜로운 승리', righteousDomain: '지형과 상황을 유리하게 전환하는 실전 전략', peasantResilienceBlessing: '역경 속에서도 반전의 기회를 만들어내는 지략' },
  { stageLevel: 5, stageNameHanja: 'Jipgangso Jachi (執綱所自治)', stageNameKo: '생활 터전을 스스로 일구는 자치와 상생', righteousDomain: '자율적인 질서 수립과 폐정 개혁의 실천', peasantResilienceBlessing: '남에게 의존하지 않고 스스로 문제를 해결하는 자생력' },
  { stageLevel: 6, stageNameHanja: 'Ugeumchi Jeolgae (牛禁峙節槪)', stageNameKo: '마지막 순간까지 꺾이지 않는 고결한 지조', righteousDomain: '결과의 성패를 떠나 신념을 지키는 숭고한 정신', peasantResilienceBlessing: '세속의 유혹에 영혼을 팔지 않는 당당한 자존감' },
  { stageLevel: 7, stageNameHanja: 'Nokdu Saessak (綠豆新芽)', stageNameKo: '얼어붙은 땅에서 다시 돋아나는 푸른 새싹', righteousDomain: '시련 뒤에 반드시 찾아오는 새로운 세대의 희망', peasantResilienceBlessing: '꺾이지 않고 끊임없이 이어지는 생명력의 재생' },
];

const RIGHTEOUS_MANIFESTOS = [
  { manifestoTitleKo: '제폭구민(除暴救民): 부당한 억압을 걷어내고 약자를 지켜라', hanjaMotto: '除暴救民', coreEssence: '약자를 착취하는 불합리한 구조를 바로잡고 사람을 살림', actionableDirective: '주변의 부당한 처우에 침묵하지 말고 억울한 이를 따스하게 보호하십시오.' },
  { manifestoTitleKo: '보국안민(輔國安民): 공동체의 근본을 바로 세워 백성을 평안케 하라', hanjaMotto: '輔國安民', coreEssence: '기초적인 신뢰와 안정을 구축하여 모두가 안심하고 살게 함', actionableDirective: '공동의 약속과 기본 원칙을 성실히 지켜 평화로운 일상을 만드십시오.' },
  { manifestoTitleKo: '척왜척양(斥倭斥洋): 외풍에 흔들리지 말고 자주적 주체성을 지켜라', hanjaMotto: '斥倭斥洋', coreEssence: '타인의 강요나 부당한 영향력에 휘둘리지 않고 독립성을 유지함', actionableDirective: '남의 눈치나 외부의 압력에 굴하지 않고 내 삶의 주권을 확고히 지키십시오.' },
  { manifestoTitleKo: '진멸권귀(盡滅權貴): 오만과 탐욕의 낡은 관습을 과감히 청산하라', hanjaMotto: '盡滅權貴', coreEssence: '사리사욕으로 물든 낡은 습관과 오만을 내면에서부터 불태움', actionableDirective: '특권 의식이나 게으름을 버리고 성실함과 겸양으로 새 출발을 하십시오.' },
];

const DONGHAK_LEGACIES = [
  { legacyTitle: '사발통문의 둥근 서명', historicalWisdom: '우두머리가 따로 없이 모두가 둥글게 둘러앉을 때, 진정한 신뢰와 평등의 연대가 완성된다.' },
  { legacyTitle: '백산에 나부끼는 대의의 깃발', historicalWisdom: '정의로운 뜻이 세상을 울릴 때, 흩어져 있던 선한 마음들이 거대한 강물이 되어 모여든다.' },
  { legacyTitle: '집강소의 상생 개혁', historicalWisdom: '진정한 개혁은 파괴가 아니라, 이웃과 함께 스스로의 삶터를 평등하고 따뜻하게 고쳐나가는 일이다.' },
  { legacyTitle: '녹두장군의 마지막 눈빛', historicalWisdom: '몸은 비록 묶일지라도 진리를 향한 영혼의 외침은 영원히 살아 숨 쉬어 봄날의 청포도로 다시 피어난다.' },
];

function getKstDateString(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateJeonBongjunNokdu(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): JeonBongjunNokduResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`JEON-BONGJUN-NOKDU-${birthdate}-${birthtime}-${name}-${query ?? ''}`);

  const sabalTongmunHorizontalSolidarity = (seed % 41) + 60; // 60~100
  const baeksanRighteousForce = ((seed >> 3) % 43) + 58; // 58~100
  const jepokGuminSalvationPower = ((seed >> 5) % 39) + 62; // 62~100
  const bogukAnminPeaceStabilityScore = ((seed >> 7) % 45) + 55; // 55~99
  const cheongpodoSpringResilience = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % NOKDU_STAGES.length;
  const activeNokduStage = NOKDU_STAGES[stageIdx];

  const manifestoIdx = (seed >> 4) % RIGHTEOUS_MANIFESTOS.length;
  const primaryRighteousManifesto = RIGHTEOUS_MANIFESTOS[manifestoIdx];
  const secondaryManifestoIdx = (manifestoIdx + 1 + ((seed >> 11) % (RIGHTEOUS_MANIFESTOS.length - 1))) % RIGHTEOUS_MANIFESTOS.length;
  const secondaryRighteousManifesto = RIGHTEOUS_MANIFESTOS[secondaryManifestoIdx];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'를 혼자 짊어지지 않고 사발통문처럼 나란히 손잡고 함께 풀어 갈 동료나 연대의 방식은 무엇인가요?`
    : `지금 내가 윗사람이나 눈치에 기대지 않고 동학의 수평 연대 정신으로 당당히 세워야 할 원칙 하나는 무엇인가요?`;
  const interpretiveBoundary = '녹두장군 전봉준 사발통문·백산 창의 관점은 길흉 예단이 아니라, 수평적 연대와 대의의 용기를 비추는 역사 성찰 렌즈입니다.';

  const legacyIdx = (seed >> 6) % DONGHAK_LEGACIES.length;
  const donghakPeasantLegacy = DONGHAK_LEGACIES[legacyIdx];

  const calculatedAtKst = formatNokduKstTimestamp(now);
  const avgScore = Math.round(
    (sabalTongmunHorizontalSolidarity +
      baeksanRighteousForce +
      jepokGuminSalvationPower +
      bogukAnminPeaceStabilityScore +
      cheongpodoSpringResilience) /
      5,
  );
  const nokduSynthesisMatrix = {
    dominantTension: `${activeNokduStage.stageNameKo} ↔ ${primaryRighteousManifesto.hanjaMotto}`,
    alignmentState: describeNokduStage(avgScore),
    integratedAction: `${primaryRighteousManifesto.actionableDirective}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: JEON_BONGJUN_NOKDU_VERSION,
    calculatedAtKst,
    sabalTongmunHorizontalSolidarity,
    baeksanRighteousForce,
    jepokGuminSalvationPower,
    bogukAnminPeaceStabilityScore,
    cheongpodoSpringResilience,
    activeNokduStage,
    primaryRighteousManifesto,
    secondaryRighteousManifesto,
    reflectiveQuestion,
    interpretiveBoundary,
    donghakPeasantLegacy,
    nokduSynthesisMatrix,
  };
}

export function formatJeonBongjunNokduPrompt(result: JeonBongjunNokduResult): string {
  const avgScore = Math.round(
    (result.sabalTongmunHorizontalSolidarity +
      result.baeksanRighteousForce +
      result.jepokGuminSalvationPower +
      result.bogukAnminPeaceStabilityScore +
      result.cheongpodoSpringResilience) /
      5,
  );
  const lines = [
    `[🌾 한국 근대 동학농민혁명 《녹두장군 전봉준》 사발통문 & 백산 창의 4대 강령 리포트]`,
    `- 연산 시각: ${result.calculatedAtKst} | 엔진 버전: ${result.engineVersion}`,
    `- 의기 결집 국면: ${describeNokduStage(avgScore)}`,
    `- 현행 의기(義氣) 결집 품계: **[${result.activeNokduStage.stageNameKo} (${result.activeNokduStage.stageNameHanja})]**`,
    `  → 관장 영역: ${result.activeNokduStage.righteousDomain}`,
    `  → 민중 회복력 축복: ${result.activeNokduStage.peasantResilienceBlessing}`,
    `- 최우선 행동 강령: **[${result.primaryRighteousManifesto.manifestoTitleKo}]**`,
    `- 보조 교차 강령: **[${result.secondaryRighteousManifesto.manifestoTitleKo}]** (${result.secondaryRighteousManifesto.hanjaMotto})`,
    `  → 핵심 본질: ${result.primaryRighteousManifesto.coreEssence}`,
    `  → 실천 지침: ${result.primaryRighteousManifesto.actionableDirective}`,
    `- 동학농민혁명 불멸의 유산: 《${result.donghakPeasantLegacy.legacyTitle}》`,
    `  → 역사적 지혜: "${result.donghakPeasantLegacy.historicalWisdom}"`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ];
  if (result.nokduSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${result.nokduSynthesisMatrix.dominantTension} | 조율 상태: ${result.nokduSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${result.nokduSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
