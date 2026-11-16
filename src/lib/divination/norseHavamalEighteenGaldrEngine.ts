/**
 * 고대 노르웨이 고에다 하바말 오딘의 18대 게알드르 룬 비전 주문 엔진 (norseHavamalEighteenGaldrEngine.ts)
 *
 * 13세기 아이슬란드 《고에다(Poetic Edda)》 원전 《하바말(Hávamál, 높은 분의 말씀)》 제146~163절 기반:
 * 오딘이 위그드라실(Yggdrasil)에 9일 밤낮을 거꾸로 매달려 제련해 낸 18대 성스러운 룬 주문(Eighteen Galdr Charms).
 * 슬픔의 치유, 검과 화살의 무력화, 적의 족쇄 해방, 풍랑의 진정, 죽은 자와의 영적 교감에 이르는
 * 북유럽 전사·지혜자의 불굴의 의지력과 자아 초월 비전 체계.
 */

import type { UserProfile } from '../sharedState';

export const NORSE_HAVAMAL_GALDR_ENGINE_VERSION = '2.1.0';

export interface HavamalGaldrCharm {
  orderNumber: number;
  charmName: string;
  norseTitle: string;
  primaryRune: string;
  runeName: string;
  magicalDomain: '위로와 치유' | '방어와 승리' | '결박 해제' | '파도 진정' | '화해와 결속' | '불사의 지혜';
  spiritualMastery: string;
  activationMantra: string;
  resonanceDegree: number; // 0 ~ 100
}

export interface NorseHavamalEighteenGaldrReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  yggdrasilWisdomDepth: number; // 0 ~ 100 위그드라실 세계수 영지 심도
  odinRuneMasteryIndex: number; // 0 ~ 100 오딘 룬 장악 지수
  valkyrieShieldIntegrity: number; // 0 ~ 100 발키리 영혼 방패 온전성
  fateWyrdResilience: number; // 0 ~ 100 우르드 운명 극복 복원력
  dominantGaldrCharm: HavamalGaldrCharm; // 현재 가장 강하게 공명하는 18대 게알드르
  secondaryGaldrCharm: HavamalGaldrCharm; // 보조 교차 공명 게알드르
  havamalElderGuidance: string; // 하바말 고대 지혜 잠언
  norseRunicGaldrChant: string; // 게알드르 수호 창팅
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  havamalSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatHavamalKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:00+09:00 (KST)`;
}

function describeHavamalStage(score: number): string {
  if (score >= 85) return '오딘의 영지(Odin Mastery) — 위그드라실의 시련을 통과해 룬의 주권과 방패가 온전히 선 시기';
  if (score >= 72) return '게알드르 조율(Galdr Attunement) — 주문의 힘으로 흔들리는 감정을 가라앉히고 중심을 세우는 시기';
  return '침묵의 인내(Silent Endurance) — 외부의 공세를 멈추고 내면의 회복력을 모으는 준비기';
}

const EIGHTEEN_GALDR_BASE: Omit<HavamalGaldrCharm, 'resonanceDegree'>[] = [
  {
    orderNumber: 1,
    charmName: '제1주문: 모든 슬픔과 번뇌의 즉시 치유 (Hjálp)',
    norseTitle: 'Hjálp',
    primaryRune: 'ᚢ',
    runeName: 'Uruz (우루즈, 야생 황소의 생명력)',
    magicalDomain: '위로와 치유',
    spiritualMastery: '마음의 깊은 상처와 실의를 근원적 대지의 생명력으로 즉시 수복하고 원기를 복원함',
    activationMantra: 'Uruz wyrd hjálpa, 내면의 생명수여 솟아올라 상처를 덮으라.',
  },
  {
    orderNumber: 3,
    charmName: '제3주문: 적들의 칼날과 위협의 무력화 (Deyfa Eggjar)',
    norseTitle: 'Deyfa Eggjar',
    primaryRune: 'ᛏ',
    runeName: 'Tiwaz (티와즈, 정의와 승리의 별)',
    magicalDomain: '방어와 승리',
    spiritualMastery: '부당한 비난과 외부의 공격성을 날카로움 없이 무디게 만들어 내면의 평화를 수호함',
    activationMantra: 'Tiwaz stefna, 어떠한 비수도 정의로운 영혼의 방패를 뚫지 못하리라.',
  },
  {
    orderNumber: 4,
    charmName: '제4주문: 사지와 마음을 얽맨 족쇄의 해방 (Leysa Fjötur)',
    norseTitle: 'Leysa Fjötur',
    primaryRune: 'ᚦ',
    runeName: 'Thurisaz (투리사즈, 가시와 저항 파쇄)',
    magicalDomain: '결박 해제',
    spiritualMastery: '자신을 옭아매던 두려움의 밧줄과 타인의 통제망을 단숨에 부수고 절대 자유를 회복함',
    activationMantra: 'Thurisaz brjóta, 얽매임의 사슬은 스러지고 오직 당당한 걸음만이 남는다.',
  },
  {
    orderNumber: 6,
    charmName: '제6주문: 거친 풍랑과 파도의 고요한 진정 (Stilla Vind)',
    norseTitle: 'Stilla Vind',
    primaryRune: 'ᛚ',
    runeName: 'Laguz (라구즈, 바다와 깊은 직관)',
    magicalDomain: '파도 진정',
    spiritualMastery: '감정의 격랑과 예측 불허의 혼란 속에서도 바다의 깊은 수심처럼 절대 고요를 유지함',
    activationMantra: 'Laguz logn, 요동치는 파도여 잠잠하라, 깊은 바다는 언제나 평온하다.',
  },
  {
    orderNumber: 8,
    charmName: '제8주문: 반목하는 이들 사이의 깊은 화해 (Sætta Hatur)',
    norseTitle: 'Sætta Hatur',
    primaryRune: 'ᚷ',
    runeName: 'Gebo (게보, 선물과 대등한 교환)',
    magicalDomain: '화해와 결속',
    spiritualMastery: '오랜 오해와 반목을 존중과 신뢰의 선물로 전환하여 진정한 영혼의 동맹을 맺음',
    activationMantra: 'Gebo sátt, 대립의 벽이 허물어지고 신성한 상호 존중이 빛을 발하리라.',
  },
  {
    orderNumber: 18,
    charmName: '제18주문: 오직 스스로 깨닫는 최후의 비전 영지 (Ljóð)',
    norseTitle: 'Ljóð',
    primaryRune: 'ᛞ',
    runeName: 'Dagaz (다가즈, 새벽빛과 대각성)',
    magicalDomain: '불사의 지혜',
    spiritualMastery: '언어로 전달할 수 없는 내면의 빛, 밤을 지나 영원한 새벽으로 도약하는 불멸의 자각',
    activationMantra: 'Dagaz ljós, 어둠의 터널 끝에서 태양의 황금빛이 영혼을 온전히 비춘다.',
  },
];

export function calculateNorseHavamalEighteenGaldr(
  profile?: UserProfile | null,
  referenceDate = new Date(),
  query?: string,
): NorseHavamalEighteenGaldrReport {
  const seedString = `${profile?.basic?.birthdate || '1994-01-24'}_${profile?.basic?.birthtime || '12:00'}_${profile?.basic?.name || 'zeZE'}_${query ?? ''}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash * 33 + seedString.charCodeAt(i)) >>> 0;
  }

  const day = referenceDate.getDate();
  const hours = referenceDate.getHours();

  const charms: HavamalGaldrCharm[] = EIGHTEEN_GALDR_BASE.map((ch, idx) => {
    const score = Math.min(100, Math.max(35, 60 + ((hash + idx * 83 + day * 11 + hours * 3) % 38)));
    return {
      ...ch,
      resonanceDegree: score,
    };
  });

  charms.sort((a, b) => b.resonanceDegree - a.resonanceDegree);
  const dominantGaldrCharm = charms[0];
  const secondaryGaldrCharm = charms[1] ?? charms[0];

  const yggdrasilWisdomDepth = 68 + ((hash ^ (day * 13)) % 30);
  const odinRuneMasteryIndex = 64 + (((hash >> 2) ^ (hours * 19)) % 34);
  const valkyrieShieldIntegrity = 72 + (((hash >> 4) ^ (day * 7)) % 27);
  const fateWyrdResilience = 70 + (((hash >> 6) ^ (day * 23)) % 29);

  const havamalElderGuidance = `《하바말》 고대의 잠언: "상처를 두려워하는 자는 결코 지혜의 룬을 얻지 못한다." 현재 당신을 수호하는 룬은 [${dominantGaldrCharm.runeName}]이며, [${dominantGaldrCharm.charmName}]의 힘이 당신의 여정을 호위합니다.`;
  const norseRunicGaldrChant = `[게알드르 룬 창팅]: "${dominantGaldrCharm.activationMantra}" ${dominantGaldrCharm.spiritualMastery}.`;

  const calculatedAtKst = formatHavamalKstTimestamp(referenceDate);
  const composite = Math.round(
    (yggdrasilWisdomDepth + odinRuneMasteryIndex + valkyrieShieldIntegrity + fateWyrdResilience) / 4
  );
  const trimmedQ = query?.trim() || '';
  const reflectiveQuestion = trimmedQ
    ? `"${trimmedQ}"라는 물음 앞에서 ${dominantGaldrCharm.norseTitle}(${dominantGaldrCharm.magicalDomain})과 ${secondaryGaldrCharm.norseTitle}(${secondaryGaldrCharm.magicalDomain}) 중 지금 내 마음을 지키는 데 더 필요한 주문의 태도는 무엇인가요?`
    : `${dominantGaldrCharm.norseTitle}의 의지와 ${secondaryGaldrCharm.norseTitle}의 지혜가 함께 가리키는 오늘의 내적 수호 기준은 무엇인가요?`;
  const interpretiveBoundary =
    '이 리포트는 아이슬란드 《고에다》 〈하바말〉의 18대 게알드르 룬 비전 상징을 바탕으로 내면의 회복력과 의지를 비추는 성찰용 비유이며, 확정된 미래 예언이나 의학·법률·재무적 판단을 대신하지 않습니다.';

  const havamalSynthesisMatrix = {
    dominantTension: `${dominantGaldrCharm.norseTitle} (${dominantGaldrCharm.magicalDomain}) ↔ ${secondaryGaldrCharm.norseTitle} (${secondaryGaldrCharm.runeName})`,
    alignmentState: describeHavamalStage(composite),
    integratedAction: `${dominantGaldrCharm.spiritualMastery}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: NORSE_HAVAMAL_GALDR_ENGINE_VERSION,
    timestamp: referenceDate.toISOString(),
    calculatedAtKst,
    yggdrasilWisdomDepth,
    odinRuneMasteryIndex,
    valkyrieShieldIntegrity,
    fateWyrdResilience,
    dominantGaldrCharm,
    secondaryGaldrCharm,
    havamalElderGuidance,
    norseRunicGaldrChant,
    reflectiveQuestion,
    interpretiveBoundary,
    havamalSynthesisMatrix,
  };
}

export function formatNorseHavamalEighteenGaldrPrompt(report: NorseHavamalEighteenGaldrReport): string {
  const composite = Math.round(
    (report.yggdrasilWisdomDepth + report.odinRuneMasteryIndex + report.valkyrieShieldIntegrity + report.fateWyrdResilience) / 4
  );
  const lines = [
    `### ᚱ 고에다 하바말 오딘의 18대 게알드르 룬 비전 주문 실측 데이터 (v${report.engineVersion})`,
    `- **연산 시각**: ${report.calculatedAtKst} | **비전 주문 국면**: ${describeHavamalStage(composite)}`,
    `- **주재 게알드르 주문**: ${report.dominantGaldrCharm.charmName} (${report.dominantGaldrCharm.norseTitle})`,
    `- **보조 공명 주문**: ${report.secondaryGaldrCharm.charmName} (${report.secondaryGaldrCharm.norseTitle})`,
    `- **상응 룬 문자**: ${report.dominantGaldrCharm.primaryRune} - ${report.dominantGaldrCharm.runeName}`,
    `- **비전 마법 영역**: ${report.dominantGaldrCharm.magicalDomain}`,
    `- **영적 달성 핵심**: ${report.dominantGaldrCharm.spiritualMastery}`,
    `- **하바말 고대 지혜 잠언**: ${report.havamalElderGuidance}`,
    `- **게알드르 룬 창팅**: ${report.norseRunicGaldrChant}`,
  ];
  if (report.havamalSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.havamalSynthesisMatrix.dominantTension} | 조율 상태: ${report.havamalSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.havamalSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- **성찰 질문**: ${report.reflectiveQuestion}`,
    `- **해석 경계**: ${report.interpretiveBoundary}`,
  );
  return lines.join('\n');
}

