/**
 * 한국 고려 보조국사 지눌(知訥) 《수심결(修心訣)》 정혜쌍수(定慧雙修) & 돈오점수(頓悟漸修) 선학 지혜 엔진
 *
 * 12세기 고려 불교의 중흥조이자 조계종의 종조 보조국사 지눌(1158~1210)의 명저 원전 기반:
 * 1. 돈오점수(頓悟漸修):
 *    - 돈오(頓悟): "마음이 곧 부처임을 단박에 깨닫는 것(自心是佛)." 범부의 미혹된 생각이 본래 공적(空寂)함을 알아차림.
 *    - 점수(漸修): "비록 본래 부처임을 깨달았으나 오랜 겁 동안 쌓인 습기(習氣)는 갑자기 사라지지 않으므로 차츰 닦아나가는 것." 얼음이 연못의 물인 줄 알았으나 봄바람에 서서히 녹아내리듯 닦음.
 * 2. 정혜쌍수(定慧雙修):
 *    - 정(定): 마음에 번뇌가 일어나지 않는 본래의 체(體)이자 침묵의 고요함.
 *    - 혜(慧): 어둡지 않고 모든 것을 바르게 비추는 본래의 용(用)이자 통찰의 밝음.
 *    - "정(定) 없는 혜(慧)는 미친 바람 앞의 등불 같고, 혜(慧) 없는 정(定)은 어두운 골짜기의 죽은 물과 같다." 두 바퀴처럼 균등히 닦음.
 * 3. 성적등지(惺寂等持):
 *    - 적적(寂寂): 망상이 끊어져 고요하되 무기공(혼침)에 빠지지 않음.
 *    - 성성(惺惺): 맑고 또렷하게 깨어있되 들뜸(도거)에 흔들리지 않음.
 *    - 성성적적(惺惺寂寂)의 평형 상태가 참마음의 항상한 본체.
 * 4. 공적영지(空寂靈知):
 *    - 모양도 자취도 없이 텅 비었으나(空寂), 마주하는 모든 것을 신령하게 알아차리고 작용하는(靈知) 본래 마음.
 *
 * @version LUCKEY-JINUL-JEONGHYE-SSANGSU-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const JINUL_JEONGHYE_SSANGSU_VERSION = 'LUCKEY-JINUL-JEONGHYE-SSANGSU-v2.2.0';

export interface SusimgyeolCorePrinciple {
  principleKey: string;
  principleHanja: string;
  principleNameKo: string;
  zenMeaning: string;
  cultivationAdvice: string;
}

export interface JinulZenMetaphor {
  metaphorKey: string;
  metaphorTitleKo: string;
  metaphorSourceText: string;
  insight: string;
  practicalAction: string;
}

export interface JinulJeonghyeSsangsuResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  donohInsightScore: number;             // 돈오(頓悟) 본래면목 단박 자각도
  jeomsuCultivationScore: number;        // 점수(漸修) 습기 정화 및 지속적 정진력
  jeonghyeBalanceScore: number;          // 정혜쌍수(定慧雙修) 고요함과 지혜의 평형도
  seongjeokEquanimityScore: number;      // 성적등지(惺寂等持) 깨어있음과 평정 지수
  gongjeokYeongjiScore: number;          // 공적영지(空寂靈知) 텅 빈 앎의 순수 직관력
  // 세부 체계
  activeCorePrinciple: SusimgyeolCorePrinciple;
  secondaryCorePrinciple: SusimgyeolCorePrinciple;
  focalZenMetaphor: JinulZenMetaphor;
  secondaryZenMetaphor: JinulZenMetaphor;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  jinulMindCounsel: {
    counselTitle: string;
    mindPurificationGuidance: string;
  };
  jinulSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatJinulKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeJinulStage(score: number): string {
  if (score >= 88) return '성적등지(惺寂等持) — 맑은 깨어있음과 흔들림 없는 적적이 조화를 이루는 경지';
  if (score >= 78) return '정혜쌍수(定慧雙修) — 고요한 안정과 명철한 통찰을 두 바퀴처럼 아우르는 국면';
  return '돈오점수(頓悟漸修) — 본래 면목을 비추며 일상의 습기를 차분히 녹여가는 정진기';
}

export type JinulJeonghyeSsangsuReport = JinulJeonghyeSsangsuResult;

const SUSIMGYEOL_PRINCIPLES: SusimgyeolCorePrinciple[] = [
  {
    principleKey: 'DonohJeomsu',
    principleHanja: '頓悟漸修 (돈오점수)',
    principleNameKo: '단박의 깨침과 차분한 일상 닦음',
    zenMeaning: '근본 성품이 완전함을 먼저 직관하고(돈오), 오랜 습관과 에고의 미세한 관성을 매일의 일상 속에서 끈기 있게 다스려가는(점수) 지혜입니다.',
    cultivationAdvice: '한 번의 통찰에 안주하여 방심하지 마십시오. 깨달음의 빛을 일상의 말투, 태도, 업무의 성실함으로 꾸준히 길러내는 것이 진짜 공부입니다.',
  },
  {
    principleKey: 'JeonghyeSsangsu',
    principleHanja: '定慧雙修 (정혜쌍수)',
    principleNameKo: '고요한 평정과 명철한 지혜의 병행',
    zenMeaning: '마음의 요동침을 잠재우는 고요함(정)과 상황을 투명하게 꿰뚫어 보는 총명함(혜)이 어느 한쪽으로 치우치지 않는 균형입니다.',
    cultivationAdvice: '생각만 복잡하게 굴려 지치거나, 아무 생각 없이 멍하니 머물러 있지 마십시오. 차분히 호흡을 가다듬고 명료하게 현실을 직시하십시오.',
  },
  {
    principleKey: 'SeongjeokDeungji',
    principleHanja: '惺寂等持 (성적등지)',
    principleNameKo: '맑은 깨어있음과 흔들림 없는 적적',
    zenMeaning: '잠에 취한 듯 흐리멍덩하지 않고 맑게 깨어있으면서도(성성), 바깥 소란에 휩쓸리지 않고 깊이 고요한(적적) 마음의 중심 상태입니다.',
    cultivationAdvice: '외부 자극이 거세질수록 내면의 맑은 거울을 떠올리십시오. 거울은 온갖 풍경을 또렷이 비추되 그 어떤 상에도 물들지 않습니다.',
  },
  {
    principleKey: 'GongjeokYeongji',
    principleHanja: '空寂靈知 (공적영지)',
    principleNameKo: '텅 빈 고요 속의 신령한 알아차림',
    zenMeaning: '어떤 고정된 관념이나 편견도 없이 텅 비어 있으나, 상황의 옳고 그름과 흐름을 저절로 알아차리는 내면의 순수한 각성입니다.',
    cultivationAdvice: '미리 짐작하고 재단하는 선입견을 털어내십시오. 마음을 텅 비우고 마주할 때 비로소 가장 지혜로운 직관이 저절로 솟아납니다.',
  },
];

const ZEN_METAPHORS: JinulZenMetaphor[] = [
  {
    metaphorKey: 'IceWaterSpringBreeze',
    metaphorTitleKo: '얼음이 곧 물이나 봄바람을 만나야 녹는다',
    metaphorSourceText: '氷池之水 雖知是水 假陽氣而方融 (얼어붙은 연못 물이 비록 물인 줄 아나 봄기운을 입어야 녹아내린다)',
    insight: '이치를 머리로 아는 것과 몸과 마음에 밴 굳은 습관이 완전히 부드러워지는 것 사이에는 따뜻하고 지속적인 정진의 시간이 필요합니다.',
    practicalAction: '자신의 부족함을 질책하며 조급해하지 마십시오. 따뜻한 봄바람처럼 스스로를 온화하게 대하며 매일 조금씩 습기를 녹여가십시오.',
  },
  {
    metaphorKey: 'LoverOxTaming',
    metaphorTitleKo: '고삐를 쥐고 거친 소를 길들이듯',
    metaphorSourceText: '如牧牛人 執杖視之 不令犯人苗稼 (소를 먹이는 이가 막대를 쥐고 살펴 남의 곡식을 짓밟지 못하게 하듯)',
    insight: '마음이 탐욕이나 분노의 잡초밭으로 제멋대로 뛰쳐나가지 않도록, 늘 알아차림의 고삐를 부드럽게 쥐고 살펴보는 관조의 힘입니다.',
    practicalAction: '감정이 솟구치거나 충동이 일어날 때 즉각 반응하지 마십시오. 한 발짝 물러서서 마음의 움직임을 다정하게 지켜보고 다독이십시오.',
  },
  {
    metaphorKey: 'MirrorReflectingDust',
    metaphorTitleKo: '거울 본래의 맑음과 닦아냄',
    metaphorSourceText: '明鏡本淨 拭拂塵埃 (맑은 거울은 본래 깨끗하니 티끌과 먼지를 털어낼 따름이다)',
    insight: '당신의 본래 인격과 가치는 이미 완전하고 결함이 없으며, 일상의 스트레스와 불안은 단지 거울 표면에 앉은 가벼운 먼지일 뿐입니다.',
    practicalAction: '자신을 무가치하다고 비하하지 마십시오. 조용한 호흡과 함께 번뇌의 먼지를 털어내면 본래의 빛나는 자존감이 그대로 드러납니다.',
  },
  {
    metaphorKey: 'LampInTheWind',
    metaphorTitleKo: '바람 속의 등불과 정혜의 조화',
    metaphorSourceText: '如風中燈 搖蕩不定 破暗無功 (바람 속 등불은 흔들려 어둠을 밝히지 못하니 바람을 막아야 비춘다)',
    insight: '지혜로운 판단력도 마음이 차분히 안정되지 않으면 산만해져 효력을 잃습니다. 고요한 안정(정)이 확보되어야 지혜(혜)가 빛을 발합니다.',
    practicalAction: '중요한 결정을 앞두고 있을수록 번잡한 활동을 줄이고 마음을 고요히 가라앉히십시오. 안정이 찾아왔을 때 가장 정확한 길이 보입니다.',
  },
];

export function calculateJinulJeonghyeSsangsu(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): JinulJeonghyeSsangsuResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    (query ?? '') +
    'JinulJeonghyeSsangsu';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const donohInsightScore = 67 + (absHash % 32);
  const jeomsuCultivationScore = 66 + ((absHash >> 3) % 33);
  const jeonghyeBalanceScore = 68 + ((absHash >> 6) % 31);
  const seongjeokEquanimityScore = 65 + ((absHash >> 9) % 34);
  const gongjeokYeongjiScore = 69 + ((absHash >> 12) % 30);

  const principleIndex = (absHash >> 4) % SUSIMGYEOL_PRINCIPLES.length;
  const secondaryPrincipleIndex = (principleIndex + 1 + ((absHash >> 5) % (SUSIMGYEOL_PRINCIPLES.length - 1))) % SUSIMGYEOL_PRINCIPLES.length;
  const metaphorIndex = (absHash >> 7) % ZEN_METAPHORS.length;
  const secondaryMetaphorIndex = (metaphorIndex + 1 + ((absHash >> 10) % (ZEN_METAPHORS.length - 1))) % ZEN_METAPHORS.length;

  const activeCorePrinciple = SUSIMGYEOL_PRINCIPLES[principleIndex];
  const secondaryCorePrinciple = SUSIMGYEOL_PRINCIPLES[secondaryPrincipleIndex];
  const focalZenMetaphor = ZEN_METAPHORS[metaphorIndex];
  const secondaryZenMetaphor = ZEN_METAPHORS[secondaryMetaphorIndex];

  const reflectiveQuestion = query?.trim()
    ? `'${query.trim()}' 앞에서 ${activeCorePrinciple.principleNameKo}과 ${secondaryCorePrinciple.principleNameKo} 가운데 지금 당신의 마음을 가장 먼저 고요히 비추는 거울은 어느 쪽인가요?`
    : `지금 일상에서 ${activeCorePrinciple.principleNameKo}과 ${secondaryCorePrinciple.principleNameKo} 중 더 오래 다독여야 할 습기는 무엇인가요?`;
  const interpretiveBoundary =
    '이 지눌 《수심결》 선학 지표는 돈오점수·정혜쌍수의 사유를 비추는 정성적 성찰 프레임이며, 심리·의료적 진단이나 확정적 길흉 예언이 아닙니다.';

  const counselTitle = `보조국사 수심결 선학: ${activeCorePrinciple.principleHanja}`;
  const mindPurificationGuidance = `고려 보조국사 지눌의 선학 지혜는 본래 면목의 완전함을 믿고 일상에서 정혜를 고르게 닦아 참된 자유를 얻도록 이끕니다. ` +
    `현재 당신의 수양과 삶의 맥락은 '${activeCorePrinciple.principleNameKo}(${activeCorePrinciple.principleHanja})'의 가르침과 맞닿아 있습니다. ` +
    `${activeCorePrinciple.cultivationAdvice} 또한 《수심결》의 비유인 '${focalZenMetaphor.metaphorTitleKo}'를 마음에 새겨, ` +
    `${focalZenMetaphor.practicalAction}`;

  const calculatedAtKst = formatJinulKstTimestamp(now);
  const avgScore = Math.round(
    (donohInsightScore +
      jeomsuCultivationScore +
      jeonghyeBalanceScore +
      seongjeokEquanimityScore +
      gongjeokYeongjiScore) /
      5,
  );
  const jinulSynthesisMatrix = {
    dominantTension: `${activeCorePrinciple.principleHanja} ↔ ${focalZenMetaphor.metaphorTitleKo}`,
    alignmentState: describeJinulStage(avgScore),
    integratedAction: `${focalZenMetaphor.practicalAction}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${activeCorePrinciple.principleNameKo}] ${focalZenMetaphor.practicalAction}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: JINUL_JEONGHYE_SSANGSU_VERSION,
    calculatedAtKst,
    donohInsightScore,
    jeomsuCultivationScore,
    jeonghyeBalanceScore,
    seongjeokEquanimityScore,
    gongjeokYeongjiScore,
    activeCorePrinciple,
    secondaryCorePrinciple,
    focalZenMetaphor,
    secondaryZenMetaphor,
    reflectiveQuestion,
    interpretiveBoundary,
    jinulMindCounsel: {
      counselTitle,
      mindPurificationGuidance,
    },
    jinulSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatJinulJeonghyeSsangsuPrompt(res: JinulJeonghyeSsangsuResult): string {
  const avgScore = Math.round(
    (res.donohInsightScore +
      res.jeomsuCultivationScore +
      res.jeonghyeBalanceScore +
      res.seongjeokEquanimityScore +
      res.gongjeokYeongjiScore) /
      5,
  );
  const lines = [
    `【보조국사 수심결 & 정혜쌍수·돈오점수 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 선학 수양 국면: ${describeJinulStage(avgScore)}`,
    `- 핵심 수심결 원리: ${res.activeCorePrinciple.principleNameKo} [${res.activeCorePrinciple.principleHanja}]`,
    `- 보조 교차 원리: ${res.secondaryCorePrinciple.principleNameKo} [${res.secondaryCorePrinciple.principleHanja}]`,
    `- 선학적 의미: ${res.activeCorePrinciple.zenMeaning}`,
    `- 실천적 수양 조언: ${res.activeCorePrinciple.cultivationAdvice}`,
    `- 핵심 선적 비유: ${res.focalZenMetaphor.metaphorTitleKo}`,
    `- 보조 교차 비유: ${res.secondaryZenMetaphor.metaphorTitleKo}`,
    `- 원전 구절: "${res.focalZenMetaphor.metaphorSourceText}"`,
    `- 비유의 통찰: ${res.focalZenMetaphor.insight}`,
    `- 마음 수양 행동 지침: ${res.jinulMindCounsel.mindPurificationGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.jinulSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.jinulSynthesisMatrix.dominantTension} | 조율 상태: ${res.jinulSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.jinulSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
