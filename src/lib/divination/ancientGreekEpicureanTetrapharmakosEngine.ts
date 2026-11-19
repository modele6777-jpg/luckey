/**
 * 고대 그리스 에피쿠로스의 《테트라파르마코스(4대 치유약)》 영혼 평정 아타락시아 엔진
 *
 * 서기전 3세기 헬레니즘 철학자 에피쿠로스(Epicurus)의 정원(The Garden) 철학 원전 기반.
 * 질문 맥락별 테트라파르마코스 4대 치유약 동적 매칭, KST 정원 리듬, 욕망 3분류 자족 매트릭스를 통합합니다.
 *
 * @version LUCKEY-EPICUREAN-TETRAPHARMAKOS-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const EPICUREAN_TETRAPHARMAKOS_VERSION = 'LUCKEY-EPICUREAN-TETRAPHARMAKOS-v2.5.0';

export interface EpicureanStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  gardenDomain: string;
  serenityBlessing: string;
}

export interface EpicureanSituationalRemedy {
  remedyIndex: number; // 1..4
  classicTextSource: string;
  classicQuote: string;
  reflectionPrompt: string;
}

export interface EpicureanTemporalGardenRhythm {
  kstHour: number;
  gardenPhaseKo: string;
  practiceFocus: string;
}

export interface EpicureanDesireTaxonomyMatrix {
  naturalNecessaryRatio: number; // 자연적이고 필수적인 욕망 비율 %
  naturalUnnecessaryRatio: number; // 자연적이지만 비필수적인 욕망 비율 %
  vainEmptyRatio: number; // 헛되고 공허한 욕망 비율 %
  autarkeiaDirective: string;
}

export interface EpicureanTetrapharmakosResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  ataraxiaSoulTranquilityScore: number;
  aponiaPhysicalEaseBalance: number;
  tetrapharmakosRemedyMastery: number;
  philiaGardenFriendshipForce: number;
  katastematicPleasureClarity: number;
  // 세부 명세
  activeEpicureanStage: EpicureanStage;
  primaryTetrapharmakosPrinciple: {
    principleTitleKo: string;
    greekMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  epicureanGardenEpiphany: {
    gardenSceneTitle: string;
    peacefulWisdom: string;
  };
  // v2.0.0 질적 성찰 & 시공간 교차 검증
  situationalRemedy: EpicureanSituationalRemedy;
  temporalGardenRhythm: EpicureanTemporalGardenRhythm;
  desireTaxonomyMatrix: EpicureanDesireTaxonomyMatrix;
  epicureanSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export type EpicureanTetrapharmakosReport = EpicureanTetrapharmakosResult;

const EPICUREAN_STAGES: EpicureanStage[] = [
  { stageLevel: 1, stageNameGreek: 'Ataraxia (아타락시아)', stageNameKo: '모든 불안과 두려움의 파도가 멎은 영혼의 고요관', gardenDomain: '불필요한 욕망을 완전히 비우고 마음의 완벽한 평정을 누림', serenityBlessing: '세상의 혼란과 시련 앞에서도 잔물결조차 일지 않는 절대적 평화' },
  { stageLevel: 2, stageNameGreek: 'Aponia (아포니아)', stageNameKo: '육체의 고통을 덜고 담백한 조화를 유지하는 안녕관', gardenDomain: '과식과 과로를 피하고 자연스러운 몸의 균형을 돌봄', serenityBlessing: '가벼운 몸과 맑은 정신으로 매 순간의 편안함을 만끽하는 활력' },
  { stageLevel: 3, stageNameGreek: 'Philia (정원의 우정)', stageNameKo: '경쟁 없이 서로의 영혼을 품어주는 참된 벗의 연대관', gardenDomain: '조건 없는 신뢰와 따뜻한 대화로 삶의 두려움을 함께 녹임', serenityBlessing: '외로움 없이 든든한 지지 속에서 피어나는 깊은 심리적 안전감' },
  { stageLevel: 4, stageNameGreek: 'Autarkeia (자족)', stageNameKo: '적은 것으로도 충만함을 느끼는 소박한 지혜관', gardenDomain: '끝없는 소유욕과 세속적 허영을 멈추고 현재의 충분함에 감사함', serenityBlessing: '세상의 유행이나 결핍에 결코 쫓기지 않는 완전한 내적 자유' },
  { stageLevel: 5, stageNameGreek: 'Tetrapharmakos (4대 치유약)', stageNameKo: '미신과 죽음의 공포를 이성으로 치유한 해방관', gardenDomain: '불안을 유발하는 환상을 과학적이고 합리적인 시각으로 정화', serenityBlessing: '근거 없는 불안과 죄책감에서 벗어나 활짝 피어나는 영혼의 맑음' },
  { stageLevel: 6, stageNameGreek: 'Lathe Biosas (숨어서 살아라)', stageNameKo: '세속의 명예욕을 멀리하고 조용히 행복을 가꾸는 은둔관', gardenDomain: '권력 다툼과 남의 시선에 얽매이지 않고 소중한 일상에 몰입함', serenityBlessing: '시끄러운 소음 속에서 나만의 평화로운 정원을 지켜내는 힘' },
  { stageLevel: 7, stageNameGreek: 'Katastēma (안정의 기쁨)', stageNameKo: '갈증이 채워진 뒤 찾아오는 지속적이고 잔잔한 행복관', gardenDomain: '일시적인 자극에 중독되지 않고 잔잔한 존재 자체를 기뻐함', serenityBlessing: '기복 없이 날마다 지속되는 은은하고 따스한 행복의 정주' },
];

const TETRAPHARMAKOS_PRINCIPLES = [
  { principleTitleKo: '제1치유: 신이나 보이지 않는 운명을 두려워하지 말라', greekMotto: 'Aphobon ho theos', coreEssence: '신이나 초자연적 힘은 분노나 변덕으로 인간을 괴롭히지 않음', actionableDirective: '막연한 징벌이나 불운에 대한 미신적 공포를 떨쳐내고 이성적인 평정을 찾으십시오.' },
  { principleTitleKo: '제2치유: 죽음은 우리에게 아무것도 아니니 걱정하지 말라', greekMotto: 'Anypopton ton thanaton', coreEssence: '우리가 존재하는 한 죽음은 없고 죽음이 오면 우리는 존재하지 않음', actionableDirective: '오지 않은 미래의 종말을 미리 불안해하지 말고 오직 살아 숨 쉬는 지금에 몰입하십시오.' },
  { principleTitleKo: '제3치유: 좋은 것과 참된 행복은 쉽게 얻을 수 있다', greekMotto: 'Tagathon men euktēton', coreEssence: '생명 유지에 필수적인 것은 소박한 음식과 물, 몇 명의 진실한 벗뿐임', actionableDirective: '끝없는 물질적 욕망을 내려놓고 소박한 일상의 식사와 대화에서 충만을 맛보십시오.' },
  { principleTitleKo: '제4치유: 끔찍하고 아픈 고통은 견디기 쉬우며 지나간다', greekMotto: 'To de deinon eukarterēton', coreEssence: '격렬한 고통은 짧게 끝나고 지속되는 고통은 적응하여 견딜 수 있음', actionableDirective: '지금 겪는 고난이 영원히 지속될 것이라는 과장된 절망을 버리고 담담히 호흡하십시오.' },
];

const GARDEN_EPIPHANIES = [
  { gardenSceneTitle: '아테네 외곽 무화과나무 그늘 아래 소박한 정원의 식탁', peacefulWisdom: '치즈 한 조각과 맑은 물, 그리고 영혼을 나눌 수 있는 벗이 있다면 그곳이 곧 올림포스의 낙원이다.' },
  { gardenSceneTitle: '바람에 흩날리는 모래 알갱이처럼 쪼개어지는 고통의 물결', peacefulWisdom: '마음의 눈으로 바라보라. 네가 겪는 고통은 거대한 우주 속 한 점 티끌에 불과하니 곧 지나가리라.' },
  { gardenSceneTitle: '잔잔한 호수 위에 비친 저녁노을과 흔들림 없는 수면', peacefulWisdom: '욕망의 바람을 잠재울 때 영혼의 거울은 비로소 세상의 아름다움을 온전히 비추어 낸다.' },
  { gardenSceneTitle: '정원의 문을 닫고 등불 아래 벗들과 주고받는 따뜻한 미소', peacefulWisdom: '세상 사람들은 명예를 쫓아 서로를 헐뜯지만, 참된 지혜자는 정원에서 우정을 꽃피운다.' },
];

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

function describeEpicureanStage(score: number): string {
  if (score >= 88) return '아타락시아 심화기 (불안의 파도가 잦아들고 소박한 자족이 자리를 잡는 국면)';
  if (score >= 74) return '정원의 조율기 (필수적인 기쁨과 불필요한 비교를 차분히 가려내는 국면)';
  return '정화 휴식기 (과도한 긴장과 허영을 덜어내고 몸과 마음의 안녕을 우선할 국면)';
}

function describeDesireBalance(vainRatio: number): string {
  if (vainRatio <= 14) return '자연적이고 필수적인 욕망 중심 (소박한 자족이 안정적으로 유지되는 상태)';
  if (vainRatio <= 20) return '균형 조율 필요 (타인의 시선에서 비롯된 헛된 갈증을 조금씩 덜어낼 상태)';
  return '욕망 정돈 권고 (공허한 비교와 압박을 내려놓고 필수적 안온함으로 돌아갈 상태)';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function classifyQuestionRemedy(
  question: string,
  fallbackIdx: number,
): { principleIdx: number; remedy: EpicureanSituationalRemedy } {
  const q = question.toLowerCase();

  if (/(운명|불길|징크스|불운|미신|예감|두려움|신|불확실)/.test(q)) {
    return {
      principleIdx: 0,
      remedy: {
        remedyIndex: 1,
        classicTextSource: '《메노이케우스에게 보내는 편지》',
        classicQuote: '"신성하고 복된 존재는 스스로 괴롭지도 않고 남을 괴롭히지도 않으며, 분노나 편애에 휘둘리지 않는다."',
        reflectionPrompt: '지금 나를 위축시키는 막연한 불길함 중 실제 사실은 무엇이고, 마음이 지어낸 공포는 무엇인가요?',
      },
    };
  }
  if (/(끝|이별|상실|죽음|노후|미래|내일|종말|불안)/.test(q)) {
    return {
      principleIdx: 1,
      remedy: {
        remedyIndex: 2,
        classicTextSource: '《메노이케우스에게 보내는 편지》',
        classicQuote: '"죽음은 우리에게 아무것도 아니다. 우리가 존재하는 한 죽음은 오지 않았고, 죽음이 오면 우리는 존재하지 않는다."',
        reflectionPrompt: '아직 오지 않은 끝이나 상실을 미리 겪느라, 온전히 살아 숨 쉬는 오늘의 시간을 빼앗기고 있지는 않나요?',
      },
    };
  }
  if (/(돈|재물|명예|인정|성공|비교|부족|욕심|소비|투자)/.test(q)) {
    return {
      principleIdx: 2,
      remedy: {
        remedyIndex: 3,
        classicTextSource: '《바티칸 어록》 제68번',
        classicQuote: '"충분한 것을 적다고 여기는 자에게는 아무것도 충분하지 않다."',
        reflectionPrompt: '남들의 시선이나 비교를 지웠을 때, 오늘 내 삶을 든든하게 채우는 소박하고 필수적인 기쁨은 무엇인가요?',
      },
    };
  }
  if (/(고통|아픔|시련|버팀|힘들|압박|갈등|스트레스|위기)/.test(q)) {
    return {
      principleIdx: 3,
      remedy: {
        remedyIndex: 4,
        classicTextSource: '《주요 교설》 제4조',
        classicQuote: '"격렬한 고통은 오래 머물지 않으며, 오래 머무는 고통은 가벼워 견딜 수 있다."',
        reflectionPrompt: '지금의 어려움이 영원히 똑같은 무게로 이어질 것이라는 생각을 내려놓으면, 오늘 한 걸음 버틸 힘은 어디서 오나요?',
      },
    };
  }

  const defaults: EpicureanSituationalRemedy[] = [
    {
      remedyIndex: 1,
      classicTextSource: '《메노이케우스에게 보내는 편지》',
      classicQuote: '"신성하고 복된 존재는 스스로 괴롭지도 않고 남을 괴롭히지도 않는다."',
      reflectionPrompt: '막연한 불길함 대신 지금 손으로 만지고 확인할 수 있는 현실의 단서 하나만 붙잡아 보세요.',
    },
    {
      remedyIndex: 2,
      classicTextSource: '《메노이케우스에게 보내는 편지》',
      classicQuote: '"지혜로운 자는 삶을 거부하지도 않고, 죽음을 두려워하지도 않는다."',
      reflectionPrompt: '지나간 후회와 오지 않은 걱정을 비운 자리에 오늘 하루의 평온을 채워 넣을 수 있을까요?',
    },
    {
      remedyIndex: 3,
      classicTextSource: '《바티칸 어록》 제68번',
      classicQuote: '"충분한 것을 적다고 여기는 자에게는 아무것도 충분하지 않다."',
      reflectionPrompt: '지금 당장 더 가지지 않아도 이미 충분한 것 세 가지를 떠올려 보세요.',
    },
    {
      remedyIndex: 4,
      classicTextSource: '《주요 교설》 제4조',
      classicQuote: '"고통은 끝이 있거나 가벼워서, 우리는 그 안에서도 평정을 회복할 수 있다."',
      reflectionPrompt: '지금 겪는 불편함의 크기를 있는 그대로만 보았을 때, 과장된 두려움은 얼마나 줄어드나요?',
    },
  ];
  const idx = fallbackIdx % defaults.length;
  return { principleIdx: idx, remedy: defaults[idx] };
}

function computeTemporalGardenRhythm(now: Date): EpicureanTemporalGardenRhythm {
  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const kstHour = kst.getUTCHours();

  if (kstHour >= 5 && kstHour < 11) {
    return {
      kstHour,
      gardenPhaseKo: '아침 정원 · 필수적 욕망 정돈기',
      practiceFocus: '오늘 꼭 필요한 일과 헛된 허영을 갈라내고 가벼운 몸(Aponia)으로 하루를 여세요.',
    };
  }
  if (kstHour >= 11 && kstHour < 18) {
    return {
      kstHour,
      gardenPhaseKo: '낮 정원 · Lathe Biosas 고요한 몰입기',
      practiceFocus: '세속의 소음과 비교에서 한 발 비켜서서 나만의 페이스(숨어서 살기)로 일상에 집중하세요.',
    };
  }
  return {
    kstHour,
    gardenPhaseKo: '저녁·밤 정원 · Philia 우정과 아타락시아 휴식기',
    practiceFocus: '소박한 저녁과 믿음직한 벗(Philia)과의 온기를 떠올리며 마음의 파도를 잠재우세요.',
  };
}

export function calculateEpicureanTetrapharmakos(
  profile?: UserProfile,
  question: string = '',
  now: Date = new Date(),
): EpicureanTetrapharmakosResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const dayBucket = now.toISOString().slice(0, 10);
  const seed = hashSeed(`EPICUREAN-TETRAPHARMAKOS-${birthdate}-${birthtime}-${name}-${dayBucket}-v2`);

  const ataraxiaSoulTranquilityScore = (seed % 41) + 60;
  const aponiaPhysicalEaseBalance = ((seed >> 3) % 43) + 58;
  const tetrapharmakosRemedyMastery = ((seed >> 5) % 39) + 62;
  const philiaGardenFriendshipForce = ((seed >> 7) % 45) + 55;
  const katastematicPleasureClarity = ((seed >> 9) % 38) + 63;

  const stageIdx = (seed >> 2) % EPICUREAN_STAGES.length;
  const activeEpicureanStage = EPICUREAN_STAGES[stageIdx];

  const { principleIdx, remedy } = classifyQuestionRemedy(question, (seed >> 4) % TETRAPHARMAKOS_PRINCIPLES.length);
  const primaryTetrapharmakosPrinciple = TETRAPHARMAKOS_PRINCIPLES[principleIdx];

  const epiphanyIdx = (seed >> 6) % GARDEN_EPIPHANIES.length;
  const epicureanGardenEpiphany = GARDEN_EPIPHANIES[epiphanyIdx];

  const temporalGardenRhythm = computeTemporalGardenRhythm(now);

  const naturalNecessaryRatio = Math.min(72, Math.max(46, Math.round(katastematicPleasureClarity * 0.65)));
  const vainEmptyRatio = Math.max(8, Math.min(24, 100 - Math.round((ataraxiaSoulTranquilityScore + tetrapharmakosRemedyMastery) / 2)));
  const naturalUnnecessaryRatio = 100 - naturalNecessaryRatio - vainEmptyRatio;

  const autarkeiaDirective =
    vainEmptyRatio <= 14
      ? '공허한 욕망(명예·비교)이 잘 비워져 있습니다. 소박한 자족(Autarkeia)과 정원의 우정을 그대로 누리세요.'
      : '타인의 시선이나 과도한 성취 압박(공허한 욕망)이 스며들기 쉽습니다. 필수적인 기쁨 외에는 과감히 덜어내세요.';

  const trimmedQ = (question || '').trim();
  const epicureanSynthesisMatrix = {
    dominantTension: `${primaryTetrapharmakosPrinciple.principleTitleKo} ↔ ${describeDesireBalance(vainEmptyRatio)}`,
    alignmentState: `${activeEpicureanStage.stageNameGreek} · ${temporalGardenRhythm.gardenPhaseKo}`,
    integratedAction: `${autarkeiaDirective}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const interpretiveBoundary = '본 리포트는 에피쿠로스 정원 철학의 치유 상징에 기반한 정성적 성찰 안내이며, 의학적·심리적 진단이 아닙니다.';
  const ritualAction = primaryTetrapharmakosPrinciple.actionableDirective;
  const reflectionFocus = remedy.reflectionPrompt;
  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}'의 불안 앞에서 '${primaryTetrapharmakosPrinciple.principleTitleKo}'을 처방한다면, 지금 당장 내려놓아도 좋은 공허한 욕망은 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: EPICUREAN_TETRAPHARMAKOS_VERSION,
    calculatedAtKst: getKstDateString(now),
    ataraxiaSoulTranquilityScore,
    aponiaPhysicalEaseBalance,
    tetrapharmakosRemedyMastery,
    philiaGardenFriendshipForce,
    katastematicPleasureClarity,
    activeEpicureanStage,
    primaryTetrapharmakosPrinciple,
    epicureanGardenEpiphany,
    situationalRemedy: remedy,
    temporalGardenRhythm,
    desireTaxonomyMatrix: {
      naturalNecessaryRatio,
      naturalUnnecessaryRatio,
      vainEmptyRatio,
      autarkeiaDirective,
    },
    epicureanSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatEpicureanTetrapharmakosPrompt(result: EpicureanTetrapharmakosResult): string {
  const avgCore = Math.round((result.ataraxiaSoulTranquilityScore + result.aponiaPhysicalEaseBalance + result.tetrapharmakosRemedyMastery) / 3);
  const matrixLine = result.epicureanSynthesisMatrix
    ? `\n- 에피쿠로스 교차 매트릭스: 핵심 긴장(${result.epicureanSynthesisMatrix.dominantTension}) · 조율 상태(${result.epicureanSynthesisMatrix.alignmentState}) · 통합 실천(${result.epicureanSynthesisMatrix.integratedAction})`
    : '';
  return `[🌿 고대 그리스 에피쿠로스 《테트라파르마코스》 영혼 평정 아타락시아 리포트]
- 엔진 버전: ${result.engineVersion} | 연산 시각: ${result.calculatedAtKst}
- 아타락시아 정원 위상: **${describeEpicureanStage(avgCore)}**
- 현행 에피쿠로스적 품계: **[${result.activeEpicureanStage.stageNameKo} (${result.activeEpicureanStage.stageNameGreek})]**
  → 관장 영역: ${result.activeEpicureanStage.gardenDomain}
  → 평정의 축복: ${result.activeEpicureanStage.serenityBlessing}
- 최우선 테트라파르마코스 지침: **[${result.primaryTetrapharmakosPrinciple.principleTitleKo} (${result.primaryTetrapharmakosPrinciple.greekMotto})]**
  → 핵심 본질: ${result.primaryTetrapharmakosPrinciple.coreEssence}
  → 실천 지침: ${result.primaryTetrapharmakosPrinciple.actionableDirective}
- 질문 맥락 처방 (제${result.situationalRemedy.remedyIndex}치유 · ${result.situationalRemedy.classicTextSource}):
  → 원전 경구: ${result.situationalRemedy.classicQuote}
  → 성찰 질문: ${result.reflectiveQuestion}
- KST 정원 리듬 (${result.temporalGardenRhythm.gardenPhaseKo}): ${result.temporalGardenRhythm.practiceFocus}
- 에피쿠로스 욕망 3분류 진단: **${describeDesireBalance(result.desireTaxonomyMatrix.vainEmptyRatio)}**
  → 자족 지침: ${result.desireTaxonomyMatrix.autarkeiaDirective}
- 에피쿠로스 정원의 불멸 계시: 《${result.epicureanGardenEpiphany.gardenSceneTitle}》
  → 아타락시아 지혜: "${result.epicureanGardenEpiphany.peacefulWisdom}"
- 오늘의 작은 의례: ${result.ritualAction}
- 성찰 초점: ${result.reflectionFocus}
- 해석 경계: ${result.interpretiveBoundary}${matrixLine}`;
}
