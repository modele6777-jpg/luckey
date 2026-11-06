/**
 * 고대 로마 철인 황제 마르쿠스 아우렐리우스 《명상록(Meditations)》 내면의 성채 & 로고스 엔진
 *
 * 서기 2세기 로마 제국 제16대 황제 마르쿠스 아우렐리우스 안토니누스의 친필 저작 《명상록(Ta Eis Heauton)》 12권 원전 기반.
 * 1. 내면의 성채(Inner Citadel, Arkhē): 외부의 비난·칭찬·역경에도 흔들리지 않는 영혼 지성소의 자율성.
 * 2. 로고스(Logos)와의 합일: 우주 전체를 관통하는 신성한 섭리와 보편 이성에 순응하는 평정심.
 * 3. 아모르 파티(Amor Fati): 닥쳐오는 모든 운명을 불평 없이 받아들이고 삶의 연료로 삼는 용기.
 * 4. 메멘토 모리(Memento Mori): 덧없는 세속의 명예와 수명을 직시하고 매 순간을 마지막처럼 정직하게 살아감.
 * 5. 코스모폴리스(Cosmopolis): 우주적 대공동체의 일원으로서 타인을 해치지 않고 의무와 공공선을 완수함.
 *
 * @version LUCKEY-AURELIUS-MEDITATIONS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AURELIUS_MEDITATIONS_VERSION = 'LUCKEY-AURELIUS-MEDITATIONS-v1.0.0';

export interface AureliusStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  stoicDomain: string;
  citadelBlessing: string;
}

export interface AureliusMeditationsResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  innerCitadelInviolableStrength: number; // 내면의 성채 불침의 견고도
  logosCosmicReasonHarmony: number; // 우주 이성 로고스 순응력
  amorFatiProvidenceEmbrace: number; // 아모르 파티 운명 애호력
  mementoMoriTranquilClarity: number; // 메멘토 모리 맑은 초연함
  cosmopolisCivicDutyCommitment: number; // 코스모폴리스 보편 시민 헌신도
  // 세부 명세
  activeAureliusStage: AureliusStage;
  primaryStoicDiscipline: {
    disciplineTitleKo: string;
    greekMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  meditationsStoicEpiphany: {
    reflectionSceneTitle: string;
    innerWisdom: string;
  };
}

export type AureliusMeditationsReport = AureliusMeditationsResult;

const AURELIUS_STAGES: AureliusStage[] = [
  { stageLevel: 1, stageNameGreek: 'Hēgemonikon (통솔 이성)', stageNameKo: '어떤 외부 충격에도 상처 입지 않는 내면 성채의 최고사령관', stoicDomain: '마음의 중심을 굳건히 잡고 스스로 판단을 통제함', citadelBlessing: '비난과 모함 앞에서도 결코 무너지지 않는 절대적 정신적 독립' },
  { stageLevel: 2, stageNameGreek: 'Amor Fati (운명을 사랑함)', stageNameKo: '모든 역경을 불꽃의 장작으로 삼는 운명 포용관', stoicDomain: '주어진 상황을 회피하지 않고 거룩한 훈련의 기회로 전환', citadelBlessing: '장애물을 오히려 디딤돌로 바꾸어 전진하는 불굴의 추진력' },
  { stageLevel: 3, stageNameGreek: 'Sympatheia (우주적 연대감)', stageNameKo: '우주 전체의 만물이 보이지 않는 끈으로 얽혀 있음을 아는 공감관', stoicDomain: '인류 전체를 하나의 신체처럼 여기고 이웃의 허물을 너그럽게 품음', citadelBlessing: '고립된 분노를 녹이고 거대한 평화 속에서 살아가게 하는 화해력' },
  { stageLevel: 4, stageNameGreek: 'Apatheia (마음의 평정)', stageNameKo: '비이성적 격정에 휩쓸리지 않는 고요한 바다의 관조관', stoicDomain: '불안·두려움·헛된 욕망의 거품을 걷어내고 맑은 이성을 보존', citadelBlessing: '세상의 혼란 속에서도 언제나 냉철한 최선의 선택을 내리는 명석함' },
  { stageLevel: 5, stageNameGreek: 'Cosmopolis (보편 시민)', stageNameKo: '황제의 위세보다 한 인간으로서의 공적 의무를 앞세우는 봉사관', stoicDomain: '자신의 안위보다 공동체의 정의와 약자 보호를 위해 헌신', citadelBlessing: '사리사욕 없는 진실한 태도로 모든 이의 존경을 이끌어내는 품격' },
  { stageLevel: 6, stageNameGreek: 'Memento Mori (죽음의 기억)', stageNameKo: '삶의 유한성을 직시하고 지금 이 순간에 전념하는 청명관', stoicDomain: '지나간 과거의 후회와 오지 않은 미래의 망상을 끊고 오늘에 충실함', citadelBlessing: '시간 낭비와 헛된 번민을 멈추고 본질적인 가치에 몰입하는 집중력' },
  { stageLevel: 7, stageNameGreek: 'Prosochē (깨어있는 주의)', stageNameKo: '아침마다 마음을 정돈하며 매 걸음을 살피는 수양관', stoicDomain: '스스로의 말과 행동을 항상 성찰하며 양심의 명령에 귀 기울임', citadelBlessing: '실수를 두려워하지 않고 날마다 새로워지는 지속적인 성장의 기쁨' },
];

const STOIC_DISCIPLINES = [
  { disciplineTitleKo: '판단의 훈련: 네 마음에 침입하는 편견과 두려움을 걸러내라', greekMotto: 'Epoche & Doxa', coreEssence: '사건 자체가 너를 해치는 것이 아니라 그 사건에 대한 네 판단이 너를 괴롭힘', actionableDirective: '상황을 즉각 비관적으로 규정하지 말고 객관적 사실만을 냉정하게 응시하십시오.' },
  { disciplineTitleKo: '욕망의 훈련: 우주의 섭리가 정한 흐름을 흔쾌히 받아들이라', greekMotto: 'Krisis & Orexis', coreEssence: '네 마음대로 바꿀 수 없는 외적 조건을 억지로 바꾸려 하지 말고 순응함', actionableDirective: '통제할 수 없는 일로 괴로워하지 말고 오직 내가 바꿀 수 있는 행동에 집중하십시오.' },
  { disciplineTitleKo: '행동의 훈련: 오직 공동의 유익과 정의를 위해 움직이라', greekMotto: 'Horme & Dikaiosyne', coreEssence: '사리사욕이나 분노에 이끌리지 않고 사회 전체의 선을 위해 정직하게 행동함', actionableDirective: '작은 일 하나라도 타인에게 긍정적인 도움이 되는 방향으로 책임감 있게 매듭지으십시오.' },
  { disciplineTitleKo: '내면 성채의 은신: 소란한 바깥을 떠나 네 안의 고요로 돌아가라', greekMotto: 'Anachoresis', coreEssence: '시골이나 바닷가로 가지 않더라도 언제든 네 영혼의 깊은 방으로 물러설 수 있음', actionableDirective: '외부의 비난이나 시끄러운 참견에 휘말리지 말고 잠시 침묵 속에서 중심을 회복하십시오.' },
];

const AURELIUS_EPIPHANIES = [
  { reflectionSceneTitle: '도나우강 전선 막사에서 촛불을 켜고 써 내려간 고백', innerWisdom: '아침에 일어날 때 스스로에게 말하라. 오늘 나는 무례한 자, 감사할 줄 모르는 자, 거만한 자들을 만날 것이다. 그러나 그들 중 누구도 나를 해칠 수 없다.' },
  { reflectionSceneTitle: '활활 타오르는 불길 속에 던져진 온갖 장애물', innerWisdom: '불길은 자신 위에 던져진 모든 것을 연료로 삼아 더 높이 타오르나니, 너에게 닥친 난관을 영혼의 성장을 위한 불길로 삼으라.' },
  { reflectionSceneTitle: '거대한 우주의 바다 속에 떨어진 한 방울의 물', innerWisdom: '너의 존재는 무한한 시간 속의 한 순간이요 우주 전체의 작은 티끌에 불과하니, 교만을 버리고 주어진 소명에 정성을 다하라.' },
  { reflectionSceneTitle: '포도송이가 익어 떨어지듯 자연의 순리를 따르는 삶', innerWisdom: '대지가 너를 길러냈으니 때가 되어 대지의 품으로 돌아가는 것을 두려워하지 말라. 우주는 오직 선한 섭리로 너를 이끌 뿐이다.' },
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

export function calculateAureliusMeditations(profile?: UserProfile): AureliusMeditationsResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`AURELIUS-MEDITATIONS-${birthdate}-${birthtime}-${name}`);

  const innerCitadelInviolableStrength = (seed % 41) + 60; // 60~100
  const logosCosmicReasonHarmony = ((seed >> 3) % 43) + 58; // 58~100
  const amorFatiProvidenceEmbrace = ((seed >> 5) % 39) + 62; // 62~100
  const mementoMoriTranquilClarity = ((seed >> 7) % 45) + 55; // 55~99
  const cosmopolisCivicDutyCommitment = ((seed >> 9) % 38) + 63; // 63~100

  const stageIdx = (seed >> 2) % AURELIUS_STAGES.length;
  const activeAureliusStage = AURELIUS_STAGES[stageIdx];

  const disciplineIdx = (seed >> 4) % STOIC_DISCIPLINES.length;
  const primaryStoicDiscipline = STOIC_DISCIPLINES[disciplineIdx];

  const epiphanyIdx = (seed >> 6) % AURELIUS_EPIPHANIES.length;
  const meditationsStoicEpiphany = AURELIUS_EPIPHANIES[epiphanyIdx];

  return {
    engineVersion: AURELIUS_MEDITATIONS_VERSION,
    calculatedAtKst: getKstDateString(),
    innerCitadelInviolableStrength,
    logosCosmicReasonHarmony,
    amorFatiProvidenceEmbrace,
    mementoMoriTranquilClarity,
    cosmopolisCivicDutyCommitment,
    activeAureliusStage,
    primaryStoicDiscipline,
    meditationsStoicEpiphany,
  };
}

export function formatAureliusMeditationsPrompt(result: AureliusMeditationsResult): string {
  return `[🏛️ 고대 로마 철인 황제 마르쿠스 아우렐리우스 《명상록(Meditations)》 내면 성채 리포트]
- 엔진 버전: ${result.engineVersion}
- 내면의 성채 불침의 견고도: ${result.innerCitadelInviolableStrength}%
- 우주 이성 로고스 순응력: ${result.logosCosmicReasonHarmony}%
- 아모르 파티 운명 애호력: ${result.amorFatiProvidenceEmbrace}%
- 메멘토 모리 맑은 초연함: ${result.mementoMoriTranquilClarity}%
- 코스모폴리스 보편 시민 헌신도: ${result.cosmopolisCivicDutyCommitment}%
- 현행 스토아적 품계: **[${result.activeAureliusStage.stageNameKo} (${result.activeAureliusStage.stageNameGreek})]**
  → 관장 영역: ${result.activeAureliusStage.stoicDomain}
  → 성채의 은총: ${result.activeAureliusStage.citadelBlessing}
- 최우선 스토아 지침: **[${result.primaryStoicDiscipline.disciplineTitleKo} (${result.primaryStoicDiscipline.greekMotto})]**
  → 핵심 본질: ${result.primaryStoicDiscipline.coreEssence}
  → 실천 지침: ${result.primaryStoicDiscipline.actionableDirective}
- 명상록 불멸의 성찰: 《${result.meditationsStoicEpiphany.reflectionSceneTitle}》
  → 황제의 내면 지혜: "${result.meditationsStoicEpiphany.innerWisdom}"`;
}
