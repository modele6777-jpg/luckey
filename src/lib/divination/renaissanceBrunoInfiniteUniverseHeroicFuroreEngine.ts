/**
 * 이탈리아 르네상스 조르다노 브루노(Giordano Bruno) 무한우주론 & 영웅적 열정(Gli eroici furori) 비상 엔진
 *
 * 16세기 르네상스 자연철학자·사상가 조르다노 브루노(1548~1600)의 대화편 원전 기반:
 * 1. 무한 우주와 중심의 다원성 (De l'infinito, universo e mondi, 1584):
 *    - "우주는 무한하며, 따라서 중심은 어디에나 있고 경계는 어디에도 없다(Il centro è dappertutto e la circonferenza in nessun luogo)."
 *    - 폐쇄된 아리스토텔레스-프톨레마이오스식 천동설의 수정 구체(Spheres)를 부수고 무한한 우주 공간으로 인간 정신을 해방함.
 * 2. 영웅적 열정 (De gli eroici furori, 1585):
 *    - 세속적 욕망이나 저열한 광기가 아닌, 무한한 진리와 지적 아름다움을 향해 영혼이 비상하는 숭고한 지적 불꽃(Furore eroico).
 *    - "나는 내 날개를 활짝 펴고 높이 솟구쳐 올랐다. 수정의 구체는 내 비상을 가로막지 못한다."
 * 3. 자연 안의 신성(Deus in rebus / Mens insita omnibus):
 *    - 신은 초월적인 지배자가 아니라, 우주 모든 원자와 별들 속에 약동하는 내재적 생명력(Anima Mundi).
 * 4. 악타이온(Actaeon)의 지적 변용:
 *    - 숲속에서 신성한 디아나(진리)를 추구하던 사냥꾼 악타이온이 자신의 사냥개들에게 쫓기는 사슴으로 변신하듯, 진리를 열망하던 주체가 마침내 자신이 찾던 진리 그 자체와 하나로 융합되는 지적 도약.
 * 5. 정신의 절대적 자율과 용기:
 *    - 권위와 도그마에 무릎 꿇지 않고, 화형대의 불길 앞에서도 양심의 자유와 진리의 무한함을 수호한 불굴의 영혼.
 *
 * @version LUCKEY-BRUNO-INFINITE-UNIVERSE-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const BRUNO_INFINITE_UNIVERSE_VERSION = 'LUCKEY-BRUNO-INFINITE-UNIVERSE-v2.3.0';

export type BrunoQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface BrunoCosmicAspect {
  aspectKey: string;
  aspectLatinOrItalian: string;
  aspectNameKo: string;
  cosmicMeaning: string;
  heroicCounsel: string;
}

export interface BrunoFuroreMetaphor {
  metaphorKey: string;
  metaphorTitleKo: string;
  italianVerseSummary: string;
  philosophicalInsight: string;
  sovereignAction: string;
}

export interface RenaissanceBrunoInfiniteUniverseResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: BrunoQuestionTopic;
  furorePhase: string;
  shadowWarning: string;
  // 5대 핵심 지표 (0~100)
  infiniteCosmosVisionScore: number;       // 무한우주적 시야 및 경계 돌파력
  heroicFurorePassionScore: number;        // 영웅적 열정(Eroico Furore) 지적 비상도
  immanentDivineResonanceScore: number;    // 내재적 생명력(Anima Mundi) 교명도
  actaeonTransformationScore: number;      // 진리 추구와 자아 초월 변모력
  unboundedAutonomyScore: number;          // 권위·도그마 탈피 독자적 정신 주권도
  // 세부 체계
  activeCosmicAspect: BrunoCosmicAspect;
  secondaryCosmicAspect: BrunoCosmicAspect;
  focalFuroreMetaphor: BrunoFuroreMetaphor;
  brunoHeroicCounsel: {
    counselTitle: string;
    heroicFlightGuidance: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  brunoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatBrunoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeBrunoStage(score: number): string {
  if (score >= 88) return '수정 구체 돌파(Flight Beyond Spheres) — 폐쇄된 틀을 깨고 무한 우주의 자유로운 지평으로 비상하는 도약기';
  if (score >= 76) return '영웅적 열정 점화(Eroico Furore) — 내재적 생명력(Anima Mundi)과 교명하며 소신을 단단히 세우는 실천기';
  return '양심의 불꽃 응시(Libera Coscienza) — 낡은 도그마를 걷어내고 본래의 정신 주권을 되찾는 자각기';
}

export type RenaissanceBrunoInfiniteUniverseReport = RenaissanceBrunoInfiniteUniverseResult;

const BRUNO_FURORE_PHASES = [
  '구체 해체(익숙하지만 답답한 낡은 틀과 타인의 기준을 먼저 비워내는 시기)',
  '영웅적 비상(두려움 대신 내면의 지적 열정과 호기심에 날개를 달아 도약하는 시기)',
  '중심 자각(외부 서열에 흔들리지 않고 지금 내가 선 자리를 우주의 중심으로 세우는 시기)',
] as const;

const BRUNO_SHADOW_WARNINGS = [
  '무한한 지평을 향한 비상이 지금 당장 발 딛고 선 현실의 책임과 약속을 건너뛰는 조급함이 되지 않도록 살피세요.',
  '영웅적 열정이 주변의 신중한 조언이나 속도가 다른 동료를 답답하게 몰아붙이는 독선으로 흐르지 않도록 점검하세요.',
  '도그마를 거부하는 정신의 자율성이 스스로를 고립시키는 고집으로 굳지 않도록 열린 대화를 유지하세요.',
] as const;

function classifyBrunoQuestionTopic(query?: string): BrunoQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/연애|사랑|사람|관계|친구|가족|동료|갈등|이별|결혼|상대/.test(q)) return 'relationship';
  if (/결정|선택|진로|이직|사업|투자|시험|공부|합격|도전|방향|계획|틀/.test(q)) return 'decision';
  if (/불안|힘들|지치|우울|회복|위로|휴식|건강|마음|치유|고민/.test(q)) return 'healing';
  return 'reflection';
}

const BRUNO_COSMIC_ASPECTS: BrunoCosmicAspect[] = [
  {
    aspectKey: 'InfiniteWorlds',
    aspectLatinOrItalian: 'Infiniti Mondi (무한한 세계들)',
    aspectNameKo: '경계 없는 무한 우주의 지평 확장',
    cosmicMeaning: '우주에는 중심도 끝도 없으며 수많은 별과 행성이 저마다의 생명으로 약동하듯, 인간의 가능성 또한 그 어떤 한계선에도 갇히지 않습니다.',
    heroicCounsel: '스스로를 낡은 규범이나 작은 틀에 가두지 마십시오. 당신의 정신은 별들 사이를 유영하듯 무한히 넓은 지평을 향해 뻗어나갈 권리가 있습니다.',
  },
  {
    aspectKey: 'CenterEverywhere',
    aspectLatinOrItalian: 'Centro dappertutto (어디에나 있는 중심)',
    aspectNameKo: '모든 존재의 동등한 주권과 존엄성',
    cosmicMeaning: '무한한 우주에서는 어느 한곳만 특권적 중심이 될 수 없으며, 모든 생명과 사물이 저마다 우주의 심장이자 존엄한 중심입니다.',
    heroicCounsel: '타인의 시선이나 세속적 서열에 주눅 들지 마십시오. 당신이 서 있는 바로 그 자리가 우주의 정중앙이며 가장 소중한 출발점입니다.',
  },
  {
    aspectKey: 'AnimaMundi',
    aspectLatinOrItalian: 'Anima del Mondo (세계 영혼의 내재)',
    aspectNameKo: '만물 속에 살아 숨 쉬는 신성한 생명력',
    cosmicMeaning: '진리와 신성은 저 먼 하늘 너머에 고립되어 있는 것이 아니라, 자연의 바람과 숲, 인간의 심장과 생각 속에 생생하게 맥박 치고 있습니다.',
    heroicCounsel: '특별한 외부 기적을 구걸하지 마십시오. 당신의 심장박동과 지적인 직관 속에 이미 온 우주를 움직이는 거대한 생명력이 살아 숨 쉬고 있습니다.',
  },
  {
    aspectKey: 'SovereignConscience',
    aspectLatinOrItalian: 'Libera Coscienza (자유로운 양심의 불꽃)',
    aspectNameKo: '도그마와 위협에 굴하지 않는 정신 주권',
    cosmicMeaning: '어떤 권위주의나 맹목적인 교조도 진리를 스스로 탐구하고 깨달은 영혼의 자유로운 양심을 강제로 꺾을 수는 없습니다.',
    heroicCounsel: '다수의 압력이나 편견에 휩쓸려 스스로의 소신을 배반하지 마십시오. 고결한 진실을 향한 정직한 용기가 당신을 불멸의 빛으로 이끕니다.',
  },
];

const FURORE_METAPHORS: BrunoFuroreMetaphor[] = [
  {
    metaphorKey: 'ActaeonHounds',
    metaphorTitleKo: '진리를 쫓다가 진리 그 자체가 된 사냥꾼 악타이온',
    italianVerseSummary: 'I cani de l\'eroico cacciatore diventan la sua preda (영웅적 사냥꾼의 사냥개가 그 자신을 진리로 빚어낸다)',
    philosophicalInsight: '진리를 열망하여 모든 정열을 쏟아붓는 탐구자는 마침내 좁은 자아의 껍질을 벗고 자신이 열망하던 고결한 이상 그 자체로 변모합니다.',
    sovereignAction: '원하는 목표를 단순한 외적 소유물로 보지 말고, 당신의 인격과 삶 전체가 그 숭고한 목표의 품격에 도달하도록 전 존재를 던지십시오.',
  },
  {
    metaphorKey: 'FlightThroughSpheres',
    metaphorTitleKo: '수정 구체를 깨뜨리고 비상한 이카로스의 영웅적 날개',
    italianVerseSummary: 'Fendendo i cieli a l\'infinito m\'ergo (하늘을 가르고 무한 속으로 치솟아 오르도다)',
    philosophicalInsight: '추락을 두려워하여 웅크리는 안주보다, 무한한 태양을 향해 날개를 펴고 비상하는 숭고한 용기가 영혼을 영원히 빛나게 합니다.',
    sovereignAction: '실패에 대한 소심한 불안을 떨치십시오. 원대한 꿈과 이상을 향해 과감하게 첫 날갯짓을 시작할 때 두려움의 장벽은 산산이 부서집니다.',
  },
  {
    metaphorKey: 'PhoenixOfTruth',
    metaphorTitleKo: '진리의 불길 속에서 다시 솟구치는 불사조',
    italianVerseSummary: 'Dalle mie ceneri risorge una fiamma più pura (내 잿더미 속에서 더 순수한 불꽃이 피어오른다)',
    philosophicalInsight: '시련과 고난의 불길은 참된 정신을 태워 없애는 것이 아니라, 헛된 불순물을 정화하여 더욱 순수하고 단단한 영혼으로 부활시킵니다.',
    sovereignAction: '지금 겪는 고난을 성장의 도가니로 받아들이십시오. 시련을 당당히 통과한 영혼은 그 무엇으로도 꺾을 수 없는 위대한 지혜를 얻습니다.',
  },
  {
    metaphorKey: 'UniversalShadowOfIdeas',
    metaphorTitleKo: '관념들의 그림자와 우주 기억의 궁전',
    italianVerseSummary: 'De umbris idearum (관념의 그림자 속에서 진리의 원형을 읽다)',
    philosophicalInsight: '세상의 혼란스러운 현상들 속에서도 질서와 상호 연결의 신비로운 기억을 꿰뚫어 볼 때 최고의 통찰이 탄생합니다.',
    sovereignAction: '잡다한 사건들의 파편에 휘둘리지 말고, 배후에 흐르는 본질적인 원리와 구조를 관찰하십시오. 사물의 이치가 한눈에 꿰뚫립니다.',
  },
];

export function calculateRenaissanceBrunoInfiniteUniverse(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): RenaissanceBrunoInfiniteUniverseResult {
  const questionTopic = classifyBrunoQuestionTopic(query);
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    questionTopic +
    (query ?? '') +
    'BrunoInfiniteUniverseFurore';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const infiniteCosmosVisionScore = 69 + (absHash % 30);
  const heroicFurorePassionScore = 68 + ((absHash >> 3) % 31);
  const immanentDivineResonanceScore = 66 + ((absHash >> 6) % 33);
  const actaeonTransformationScore = 67 + ((absHash >> 9) % 32);
  const unboundedAutonomyScore = 70 + ((absHash >> 12) % 29);

  const aspectIndex = (absHash >> 4) % BRUNO_COSMIC_ASPECTS.length;
  const secondaryAspectIndex = (aspectIndex + 1 + ((absHash >> 5) % (BRUNO_COSMIC_ASPECTS.length - 1))) % BRUNO_COSMIC_ASPECTS.length;
  const metaphorIndex = (absHash >> 7) % FURORE_METAPHORS.length;

  const activeCosmicAspect = BRUNO_COSMIC_ASPECTS[aspectIndex];
  const secondaryCosmicAspect = BRUNO_COSMIC_ASPECTS[secondaryAspectIndex];
  const focalFuroreMetaphor = FURORE_METAPHORS[metaphorIndex];
  const furorePhase = BRUNO_FURORE_PHASES[(absHash >> 10) % BRUNO_FURORE_PHASES.length];
  const shadowWarning = BRUNO_SHADOW_WARNINGS[(absHash >> 13) % BRUNO_SHADOW_WARNINGS.length];

  const counselTitle = `브루노 무한우주론 & 영웅적 비상: ${activeCosmicAspect.aspectNameKo}`;
  const heroicFlightGuidance = `조르다노 브루노의 르네상스 우주철학은 폐쇄된 경계를 허물고 무한한 진리와 지적 아름다움을 향해 날아오르도록 독려합니다. ` +
    `현재 당신의 정신적 지향은 '${activeCosmicAspect.aspectNameKo}(${activeCosmicAspect.aspectLatinOrItalian})'의 통찰과 울림을 공유합니다. ` +
    `${activeCosmicAspect.heroicCounsel} 또한 브루노의 영웅적 상징인 '${focalFuroreMetaphor.metaphorTitleKo}'를 가슴에 품고, ` +
    `${focalFuroreMetaphor.sovereignAction}`;

  const calculatedAtKst = formatBrunoKstTimestamp(now);
  const q = query?.trim() || '';
  const reflectiveQuestion = q
    ? `'${q}' 앞에서 나를 가두던 낡은 수정 구체를 깨뜨리고, '${activeCosmicAspect.aspectNameKo}'와 '${secondaryCosmicAspect.aspectNameKo}' 중 지금 먼저 비상할 지평은 어디입니까?`
    : `오늘 '${focalFuroreMetaphor.metaphorTitleKo}'의 열정으로 내면의 주권을 세우기 위해 내려놓을 타인의 시선은 무엇입니까?`;
  const interpretiveBoundary =
    '이 리딩은 조르다노 브루노의 무한우주론과 영웅적 열정(Eroico Furore) 철학 상징에 빗댄 정성 성찰 비유이며, 미래 사건의 단정적 예측이 아닙니다.';
  const composite = Math.round(
    (infiniteCosmosVisionScore + heroicFurorePassionScore + immanentDivineResonanceScore + actaeonTransformationScore + unboundedAutonomyScore) / 5
  );
  const brunoSynthesisMatrix = {
    dominantTension: `${activeCosmicAspect.aspectNameKo} ↔ ${secondaryCosmicAspect.aspectNameKo} ↔ ${focalFuroreMetaphor.metaphorTitleKo}`,
    alignmentState: describeBrunoStage(composite),
    integratedAction: `${focalFuroreMetaphor.sovereignAction} (${furorePhase})${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: BRUNO_INFINITE_UNIVERSE_VERSION,
    calculatedAtKst,
    questionTopic,
    furorePhase,
    shadowWarning,
    infiniteCosmosVisionScore,
    heroicFurorePassionScore,
    immanentDivineResonanceScore,
    actaeonTransformationScore,
    unboundedAutonomyScore,
    activeCosmicAspect,
    secondaryCosmicAspect,
    focalFuroreMetaphor,
    brunoHeroicCounsel: {
      counselTitle,
      heroicFlightGuidance,
    },
    ritualAction: `[${activeCosmicAspect.aspectNameKo}]의 지평을 넓히기 위해 '${focalFuroreMetaphor.sovereignAction}'의 첫 행동을 오늘 바로 실행하세요. (${furorePhase})`,
    reflectionFocus: `브루노 무한우주론(${activeCosmicAspect.aspectNameKo} ↔ ${secondaryCosmicAspect.aspectNameKo} · ${furorePhase}) — ${focalFuroreMetaphor.metaphorTitleKo}`,
    reflectiveQuestion,
    interpretiveBoundary,
    brunoSynthesisMatrix,
  };
}

export function formatRenaissanceBrunoInfiniteUniversePrompt(res: RenaissanceBrunoInfiniteUniverseResult): string {
  const composite = Math.round(
    (res.infiniteCosmosVisionScore + res.heroicFurorePassionScore + res.immanentDivineResonanceScore + res.actaeonTransformationScore + res.unboundedAutonomyScore) / 5
  );
  const lines = [
    `【브루노 무한우주론 & 영웅적 열정(Eroico Furore) 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진 버전: ${res.engineVersion} | 질문 맥락: ${res.questionTopic}`,
    `- 영웅적 비상 국면: ${describeBrunoStage(composite)}`,
    `- 무한우주 실천 국면: ${res.furorePhase}`,
    `- 핵심 우주론적 관점: ${res.activeCosmicAspect.aspectNameKo} [${res.activeCosmicAspect.aspectLatinOrItalian}]`,
    `- 보조 교차 관점: ${res.secondaryCosmicAspect.aspectNameKo} [${res.secondaryCosmicAspect.aspectLatinOrItalian}]`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 우주론적 의미: ${res.activeCosmicAspect.cosmicMeaning}`,
    `- 영웅적 비상 조언: ${res.activeCosmicAspect.heroicCounsel}`,
    `- 핵심 영웅적 비유: ${res.focalFuroreMetaphor.metaphorTitleKo}`,
    `- 원전 명제 요약: "${res.focalFuroreMetaphor.italianVerseSummary}"`,
    `- 상징적 통찰: ${res.focalFuroreMetaphor.philosophicalInsight}`,
    `- 정신 주권 실천 지침: ${res.brunoHeroicCounsel.heroicFlightGuidance}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
  ];
  if (res.brunoSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.brunoSynthesisMatrix.dominantTension} | 조율 상태: ${res.brunoSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.brunoSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 해석 경계: ${res.interpretiveBoundary}`);
  return lines.join('\n');
}
