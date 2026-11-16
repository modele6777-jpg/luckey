/**
 * 고대 그리스 엘레우시스 밀의 트리프톨레모스(Triptolemos) 황금 날개 용 전차 & 농경 문명 전파 3대 율법 엔진
 *
 * 서기전 6세기 아테네 엘레우시스 비전 밀의 데메테르 대지모신 하사 원전 기반.
 * 1. 데메테르 여신의 황금 날개 달린 뱀/용 전차를 타고 전 세계에 인류 최초의 밀알과 농경 문화를 전파한 문화 영웅 트리프톨레모스.
 * 2. 제노크라테스가 전하는 트리프톨레모스의 3대 근본 율법:
 *    - 부모를 공경하라 (Honour thy parents)
 *    - 신들에게 첫 수확의 과실을 바쳐라 (Honour the gods with the fruits of the earth)
 *    - 살아있는 짐승을 해치지 말라 (Hurt not animals)
 * 3. 질문 맥락 감사·KST 데메테르 계절 리듬·교차 매트릭스 산출
 *
 * @version LUCKEY-ELEUSINIAN-TRIPTOLEMOS-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const ELEUSINIAN_TRIPTOLEMOS_VERSION = 'LUCKEY-ELEUSINIAN-TRIPTOLEMOS-v2.1.0';

export interface TriptolemosChariotStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  chariotDomain: string;
  civilizationBlessing: string;
}

export interface EleusinianSituationalAudit {
  contextTheme: string;
  homericHymnCitation: string;
  sowingDiagnosis: string;
  chariotPrescription: string;
}

export interface EleusinianTemporalRhythm {
  kstHour: number;
  eleusisFlightWindow: string;
  demeterAgriculturalCycle: string;
  harvestReadinessIndex: number;
  timingAdvice: string;
}

export interface TriptolemosSynthesisMatrix {
  rootLawAxis: string;
  sowingActionAxis: string;
  harvestCycleAxis: string;
  synthesizedVerdict: string;
}

export interface EleusinianTriptolemosResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 내부 계산 호환 필드 (프롬프트 비노출)
  goldenChariotFlightIndex: number;
  sacredWheatCivilizationForce: number;
  demeterBlessingPurityScore: number;
  threeLawsHarmonyEquilibrium: number;
  seedSowingAbundancePower: number;
  // 세부 명세
  activeChariotStage: TriptolemosChariotStage;
  primaryTriadicLaw: {
    lawTitleKo: string;
    greekVirtue: string;
    coreEssence: string;
    actionableDirective: string;
  };
  eleusinianEpiphany: {
    visionTitle: string;
    spiritualWisdom: string;
  };
  situationalEleusisAudit: EleusinianSituationalAudit;
  temporalEleusisRhythm: EleusinianTemporalRhythm;
  triptolemosSynthesisMatrix: TriptolemosSynthesisMatrix;
}

export type EleusinianTriptolemosReport = EleusinianTriptolemosResult;

const TRIPTOLEMOS_STAGES: TriptolemosChariotStage[] = [
  { stageLevel: 1, stageNameGreek: 'Ouranios Karpos (천상의 황금 열매)', stageNameKo: '만방에 풍요를 전파하는 황금 사절', chariotDomain: '세계적 지평 확장 및 보편적 지혜 공유', civilizationBlessing: '어둠의 황무지에 풍요의 밀밭을 일구는 개척력' },
  { stageLevel: 2, stageNameGreek: 'Drakon Pterotos (날개 달린 용의 전차)', stageNameKo: '지평선을 넘나드는 신성한 비행관', chariotDomain: '경계를 허물고 기회를 연결하는 이동성', civilizationBlessing: '막힌 관성을 뚫고 새로운 영역으로 나아가는 추진력' },
  { stageLevel: 3, stageNameGreek: 'Gê Phytoforos (생명을 잉태하는 대지)', stageNameKo: '풍요로운 씨앗을 품은 대지의 관리관', chariotDomain: '장기적 자산 구축 및 기초 체력 안정화', civilizationBlessing: '단단한 뿌리와 지속 가능한 생명력' },
  { stageLevel: 4, stageNameGreek: 'Hieros Arotos (신성한 쟁기질)', stageNameKo: '마음의 밭을 일구는 정직한 경작자', chariotDomain: '성실한 노동과 기술적 숙달', civilizationBlessing: '거짓 없는 땀방울이 가져오는 정당한 대가' },
  { stageLevel: 5, stageNameGreek: 'Puros Thêke (황금 밀알의 곳간)', stageNameKo: '지혜의 양식을 갈무리하는 수호관', chariotDomain: '가치 있는 경험과 자원의 안전한 보존', civilizationBlessing: '위기 속에서도 흔들리지 않는 내면의 풍요' },
  { stageLevel: 6, stageNameGreek: 'Kistophoros (신비의 바구니 봉헌자)', stageNameKo: '자연의 섭리를 경외하는 순례자', chariotDomain: '영적 감사와 신성한 겸손', civilizationBlessing: '탐욕을 내려놓을 때 열리는 우주적 은총' },
  { stageLevel: 7, stageNameGreek: 'Neos Sporos (갓 틔운 새싹)', stageNameKo: '새로운 가능성을 품은 희망의 싹', chariotDomain: '새로운 프로젝트와 인연의 순수한 시작', civilizationBlessing: '작은 시작 속에 깃든 무한한 결실의 약속' },
];

const TRIADIC_LAWS = [
  { lawTitleKo: '부모와 선조를 공경하라', greekVirtue: 'Honour thy parents', coreEssence: '나를 있게 한 근원적 뿌리에 감사하고 공경함', actionableDirective: '나를 길러준 근본적인 바탕을 소중히 여기고 가족 간의 화목을 도모하십시오.' },
  { lawTitleKo: '대지의 첫 수확으로 하늘을 기려라', greekVirtue: 'Honour the gods with earth fruits', coreEssence: '내가 얻은 성과의 첫 몫을 세상과 더 높은 가치에 나눔', actionableDirective: '성공의 결실을 독점하지 말고 주변과 먼저 나누어 감사함을 표현하십시오.' },
  { lawTitleKo: '살아있는 생명을 함부로 해치지 말라', greekVirtue: 'Hurt not animals', coreEssence: '모든 생명체에 대한 깊은 자비와 비폭력의 실천', actionableDirective: '말과 행동으로 타인에게 상처를 주지 않고 모든 생명을 따스하게 보살피십시오.' },
  { lawTitleKo: '진리의 밀알을 차별 없이 뿌려라', greekVirtue: 'Sow wisdom without bias', coreEssence: '배운 지혜와 이로움을 모든 이에게 아낌없이 베풂', actionableDirective: '사사로운 편견을 버리고 만나는 모든 사람에게 정직하고 선한 영향력을 건네십시오.' },
];

const ELEUSINIAN_EPIPHANIES = [
  { visionTitle: '데메테르의 황금 이삭 수여', spiritualWisdom: '겨울의 메마른 땅 속에서도 밀알은 죽지 않고 부활을 준비하듯, 고난 뒤에는 찬란한 번영이 기다린다.' },
  { visionTitle: '용 전차의 밤하늘 비행', spiritualWisdom: '세상의 좁은 울타리에 갇히지 말고 더 높은 하늘의 시선으로 삶의 행로를 넓게 바라보라.' },
  { visionTitle: '신비의 바구니 개봉', spiritualWisdom: '진정한 비밀은 감추어진 지식이 아니라 일상 속에서 타인과 나눌 때 저절로 꽃피는 사랑이다.' },
  { visionTitle: '첫 수확의 잔치', spiritualWisdom: '성실히 뿌린 땀은 결코 땅에 떨어지지 않으니, 때가 이르면 마땅히 풍성한 결실을 거두게 된다.' },
];

function buildSituationalAudit(question: string, law: typeof TRIADIC_LAWS[number]): EleusinianSituationalAudit {
  const q = question.toLowerCase();
  if (/연애|관계|가족|부모|사람|갈등|상처/.test(q)) {
    return {
      contextTheme: '근본 뿌리·비폭력 자비 감사',
      homericHymnCitation: '《호메로스 데메테르 찬가》 — 생명을 해치지 않고 뿌리를 공경하는 자의 집에는 풍요가 마르지 않는다.',
      sowingDiagnosis: `관계의 긴장 속에서 상처를 주지 않는 절제와 뿌리에 대한 감사가 필요한 때입니다. '${law.lawTitleKo}'을 우선하십시오.`,
      chariotPrescription: '상대를 이기려는 날 선 말 대신, 서로를 살리는 따뜻한 배려의 한 마디를 먼저 건네십시오.',
    };
  }
  if (/결정|선택|사업|일|직장|진로|투자|개척/.test(q)) {
    return {
      contextTheme: '신성한 파종·전차 개척 감사',
      homericHymnCitation: '《엘레우시스 비전》 — 트리프톨레모스는 좁은 성벽을 넘어 미지의 땅에 첫 밀알을 심었다.',
      sowingDiagnosis: `단기 수확만 쫓기보다 오래 남을 토양을 고를 시점입니다. '${law.lawTitleKo}'의 원칙으로 지평을 넓히십시오.`,
      chariotPrescription: '당장 큰 열매를 따려 하기보다, 묵묵히 밭을 갈고 정직한 씨앗 하나를 심는 실행에 집중하십시오.',
    };
  }
  if (/지침|불안|겨울|정체|회복|치유|외로/.test(q)) {
    return {
      contextTheme: '겨울 땅속의 밀알·재생 감사',
      homericHymnCitation: '《엘레우시스 밀의》 — 땅속에 묻힌 한 알의 밀은 썩는 것이 아니라 봄의 부활을 준비한다.',
      sowingDiagnosis: `겉으로 드러나는 성과가 없어 조급해지기 쉬운 겨울 국면입니다. '${law.lawTitleKo}'이 버팀목이 됩니다.`,
      chariotPrescription: '조바심을 내려놓고 뿌리가 물을 빨아들이듯 조용히 휴식하며 내면의 양식을 채우십시오.',
    };
  }
  return {
    contextTheme: '데메테르 3대 율법·나눔 감사',
    homericHymnCitation: '《제노크라테스 전승》 — 세 가지 단순한 율법을 지키는 자가 곧 신의 축복을 전하는 사절이다.',
    sowingDiagnosis: `일상의 작은 태도가 결국 내일의 수확을 결정합니다. '${law.lawTitleKo}'을 마음에 새기십시오.`,
    chariotPrescription: law.actionableDirective,
  };
}

function buildTemporalRhythm(now: Date, seed: number): EleusinianTemporalRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  let eleusisFlightWindow = '백주 경작·성실 파종 창 (오전~오후)';
  let timingAdvice = '햇살 아래 밭을 갈듯 오늘 맡은 과업을 정직하고 꾸준하게 일구십시오.';
  if (kstHour >= 5 && kstHour < 10) {
    eleusisFlightWindow = '새벽 용 전차 이륙 창 (이른 아침)';
    timingAdvice = '새로운 시선으로 오늘 뿌릴 가장 가치 있는 씨앗 한 가지를 선택하십시오.';
  } else if (kstHour >= 18 && kstHour < 22) {
    eleusisFlightWindow = '황혼 첫 수확 봉헌 창 (저녁)';
    timingAdvice = '오늘 거둔 작은 성과에 감사하며 주변과 온기를 나누고 하루를 갈무리하십시오.';
  } else if (kstHour >= 22 || kstHour < 5) {
    eleusisFlightWindow = '심야 대지 휴면·뿌리 축적 창 (밤~새벽)';
    timingAdvice = '겨울 밤의 대지처럼 모든 분주함을 멈추고 내면의 생명력을 고요히 회복하십시오.';
  }

  let demeterAgriculturalCycle = '대지모신 사계절 순환';
  if (month >= 3 && month <= 5) demeterAgriculturalCycle = '춘분 페르세포네 귀환기 — 새싹이 돋고 희망이 열리는 계절';
  else if (month >= 6 && month <= 8) demeterAgriculturalCycle = '하지 황금 이삭 생장기 — 성실한 땀이 열매로 여무는 계절';
  else if (month >= 9 && month <= 11) demeterAgriculturalCycle = '추분 엘레우시스 대제(Greater Mysteries) — 감사와 수확 나눔의 계절';
  else demeterAgriculturalCycle = '동지 대지 침잠기 — 깊은 뿌리를 내리고 내일을 기약하는 계절';

  const harvestReadinessIndex = 63 + ((seed + kstHour * 5 + month * 3) % 36);

  return {
    kstHour,
    eleusisFlightWindow,
    demeterAgriculturalCycle,
    harvestReadinessIndex,
    timingAdvice,
  };
}

function buildSynthesisMatrix(
  stage: TriptolemosChariotStage,
  law: typeof TRIADIC_LAWS[number],
  audit: EleusinianSituationalAudit,
  temporal: EleusinianTemporalRhythm,
): TriptolemosSynthesisMatrix {
  const rootLawAxis = `근본 율법: ${law.lawTitleKo} (${audit.contextTheme})`;
  const sowingActionAxis = `전차 품계: ${stage.stageNameKo}`;
  const harvestCycleAxis = `대지 시의: ${temporal.eleusisFlightWindow} · ${temporal.demeterAgriculturalCycle}`;
  const synthesizedVerdict = `'${temporal.eleusisFlightWindow}'의 흐름 속에서 '${stage.stageNameKo}'의 자리로 '${law.lawTitleKo}'을 실천할 때, 헛되지 않은 풍성한 결실이 무르익습니다.`;

  return {
    rootLawAxis,
    sowingActionAxis,
    harvestCycleAxis,
    synthesizedVerdict,
  };
}

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' +09:00 KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateEleusinianTriptolemos(
  profile?: UserProfile,
  question = '',
  now: Date = new Date(),
): EleusinianTriptolemosResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const kstDay = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seed = hashSeed(`ELEUSINIAN-TRIPTOLEMOS-${birthdate}-${birthtime}-${name}-${kstDay}-${question}`);

  const goldenChariotFlightIndex = (seed % 41) + 60;
  const sacredWheatCivilizationForce = ((seed >> 3) % 43) + 58;
  const demeterBlessingPurityScore = ((seed >> 5) % 39) + 62;
  const threeLawsHarmonyEquilibrium = ((seed >> 7) % 45) + 55;
  const seedSowingAbundancePower = ((seed >> 9) % 38) + 63;

  const stageIdx = (seed >> 2) % TRIPTOLEMOS_STAGES.length;
  const activeChariotStage = TRIPTOLEMOS_STAGES[stageIdx];

  const lawIdx = (seed >> 4) % TRIADIC_LAWS.length;
  const primaryTriadicLaw = TRIADIC_LAWS[lawIdx];

  const epiphanyIdx = (seed >> 6) % ELEUSINIAN_EPIPHANIES.length;
  const eleusinianEpiphany = ELEUSINIAN_EPIPHANIES[epiphanyIdx];

  const situationalEleusisAudit = buildSituationalAudit(question, primaryTriadicLaw);
  const temporalEleusisRhythm = buildTemporalRhythm(now, seed);
  const triptolemosSynthesisMatrix = buildSynthesisMatrix(activeChariotStage, primaryTriadicLaw, situationalEleusisAudit, temporalEleusisRhythm);

  return {
    engineVersion: ELEUSINIAN_TRIPTOLEMOS_VERSION,
    calculatedAtKst: getKstDateString(now),
    goldenChariotFlightIndex,
    sacredWheatCivilizationForce,
    demeterBlessingPurityScore,
    threeLawsHarmonyEquilibrium,
    seedSowingAbundancePower,
    activeChariotStage,
    primaryTriadicLaw,
    eleusinianEpiphany,
    situationalEleusisAudit,
    temporalEleusisRhythm,
    triptolemosSynthesisMatrix,
  };
}

export function formatEleusinianTriptolemosPrompt(result: EleusinianTriptolemosResult): string {
  return `[🌾 고대 그리스 엘레우시스 밀의 《트리프톨레모스(Triptolemos)》 황금 전차 & 농경 3대 율법 리포트]
- 엔진 버전: ${result.engineVersion} | 기준 시각: ${result.calculatedAtKst}
- 현행 전차 비행 품계: **[${result.activeChariotStage.stageNameKo} (${result.activeChariotStage.stageNameGreek})]**
  → 관장 영역: ${result.activeChariotStage.chariotDomain}
  → 문명 축복: ${result.activeChariotStage.civilizationBlessing}
- 최우선 실천 율법: **[${result.primaryTriadicLaw.lawTitleKo} (${result.primaryTriadicLaw.greekVirtue})]**
  → 핵심 본질: ${result.primaryTriadicLaw.coreEssence}
  → 실천 지침: ${result.primaryTriadicLaw.actionableDirective}
- 상황 맥락 감사(${result.situationalEleusisAudit.contextTheme}): ${result.situationalEleusisAudit.homericHymnCitation}
  → 파종 진단: ${result.situationalEleusisAudit.sowingDiagnosis}
  → 전차 처방: ${result.situationalEleusisAudit.chariotPrescription}
- 시공간 대지 리듬: ${result.temporalEleusisRhythm.eleusisFlightWindow} · ${result.temporalEleusisRhythm.demeterAgriculturalCycle}
  → 시의 조언: ${result.temporalEleusisRhythm.timingAdvice}
- 트리프톨레모스 교차 매트릭스: ${result.triptolemosSynthesisMatrix.synthesizedVerdict}
- 엘레우시스 신비 비전: 《${result.eleusinianEpiphany.visionTitle}》
  → 영적 지혜: "${result.eleusinianEpiphany.spiritualWisdom}"
- 해석 경계: 엘레우시스 밀의 트리프톨레모스 3대 율법 상징을 빌린 정성적 성찰 관점이며, 개인 평가나 미래 단정이 아닙니다.`;
}
