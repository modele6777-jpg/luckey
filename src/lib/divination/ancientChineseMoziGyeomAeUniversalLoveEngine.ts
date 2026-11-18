/**
 * 춘추전국시대 묵가(墨家) 묵자(墨子) 겸애교리(兼愛交利) & 비공절용(非攻節用) 실천 엔진
 *
 * 서기전 5세기 춘추전국시대 사상가 묵자(墨子)의 원전 기반.
 * 1. 겸상애 교상리(兼相愛 交相利): 차별 없는 사랑(겸애)과 서로에게 이로움을 주는 공존공영(교리)
 * 2. 비공(非攻): 부당한 침략과 무력 갈등을 철저히 막아내고 평화를 수호하는 방어 철학
 * 3. 절용(節用) 및 절장(節葬): 허례허식과 낭비를 없애고 본질과 실용에 집중함
 * 4. 상현(尙賢) 및 천지(天志): 신분을 초월한 능력주의 인재 등용과 하늘의 공평무사한 정의 실천
 *
 * @version LUCKEY-MOZI-GYEOM-AE-v2.2.0
 */

import type { UserProfile } from '../sharedState';

export const MOZI_GYEOM_AE_VERSION = 'LUCKEY-MOZI-GYEOM-AE-v2.4.0';

export type MoziQuestionTopic = 'relationship' | 'decision' | 'simplicity' | 'reflection';

export interface MohistStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  ethicalDomain: string;
  mohistVirtueBlessing: string;
}

export interface MoziSituationalAudit {
  topic: MoziQuestionTopic;
  moziTextRef: string;
  exclusionTrap: string;
  reciprocalShift: string;
  practicalDirective: string;
}

export interface MoziTemporalRhythm {
  kstWindowLabel: string;
  seasonTone: string;
  gyeomAePracticeFocus: string;
  dailyCue: string;
}

export interface MoziSynthesisMatrix {
  gyeomAeOpenness: string;
  gyoRiReciprocity: string;
  biGongJeolYongDiscipline: string;
  integrativeSummary: string;
}

export interface MoziGyeomAeResult {
  engineVersion: string;
  calculatedAtKst: string;
  gyeomAeUniversalLoveScore: number;
  gyoRiMutualBenefitIndex: number;
  biGongPeaceShieldForce: number;
  jeolYongSimplicityPurity: number;
  tianZhiCosmicJusticeScore: number;
  questionTopic: MoziQuestionTopic;
  activeMohistStage: MohistStage;
  primaryMohistPrecept: {
    preceptTitleKo: string;
    hanjaMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  moziFortressWisdom: {
    fortressTitle: string;
    strategicCounsel: string;
  };
  situationalMohistAudit: MoziSituationalAudit;
  temporalMohistRhythm: MoziTemporalRhythm;
  mohistSynthesisMatrix: MoziSynthesisMatrix;
  boundaryNotice: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export type MoziGyeomAeReport = MoziGyeomAeResult;

const MOHIST_STAGES: MohistStage[] = [
  { stageLevel: 1, stageNameHanja: '天志順應 (천지순응)', stageNameKo: '하늘의 공평무사한 정의를 삶의 나침반으로 삼는 경지', ethicalDomain: '사사로운 편견을 버리고 만인에게 이로운 보편적 선을 추구함', mohistVirtueBlessing: '공정함과 정의로움으로 모든 사람의 깊은 신뢰를 얻는 덕망' },
  { stageLevel: 2, stageNameHanja: '兼相愛 (겸상애)', stageNameKo: '남을 내 몸처럼 아끼고 차별 없이 포용하는 자비관', ethicalDomain: '배타적 울타리를 허물고 곤경에 처한 이들을 따뜻하게 보살핌', mohistVirtueBlessing: '편 가르기를 극복하고 거대한 연대와 화합을 이끌어내는 힘' },
  { stageLevel: 3, stageNameHanja: '交相利 (교상리)', stageNameKo: '나와 상대방이 함께 번영하는 호혜적 상생관', ethicalDomain: '일방적인 희생이나 착취 없이 지속 가능한 윈윈 구조를 만듦', mohistVirtueBlessing: '서로를 살리는 협력으로 공동의 결실을 풍요롭게 거두는 지혜' },
  { stageLevel: 4, stageNameHanja: '非攻守禦 (비공수어)', stageNameKo: '소모적 공격을 거두고 소중한 본질을 철통같이 지켜내는 수호관', ethicalDomain: '외부의 부당한 침해와 갈등을 예방하고 철저한 대비책을 세움', mohistVirtueBlessing: '위기를 사전에 차단하고 평화와 안전을 확고히 지키는 실력' },
  { stageLevel: 5, stageNameHanja: '節用躬行 (절용궁행)', stageNameKo: '불필요한 군더더기를 걷어내고 실천과 본질에 전념하는 청정관', ethicalDomain: '형식적인 낭비를 줄이고 실질적인 가치를 창출하는 데 몰입함', mohistVirtueBlessing: '소박하고 단단한 삶으로 군더더기 없이 소명을 완수하는 담대함' },
];

const MOHIST_PRECEPTS = [
  { preceptTitleKo: '남의 나라를 내 나라처럼, 남의 가족을 내 가족처럼 대하라', hanjaMotto: '視人之國 若視其國 視人之家 若視其家', coreEssence: '차별과 편견을 내려놓을 때 세상의 모든 전쟁과 반목이 사라집니다.', actionableDirective: '경쟁 상대를 적으로 규정하지 말고, 함께 세상을 가꾸는 동반자로 존중하십시오.' },
  { preceptTitleKo: '말로만 사랑하지 말고 구체적인 이익을 서로 나누라', hanjaMotto: '兼相愛 交相利', coreEssence: '실천 없는 말은 공허하며, 진정한 자비는 상대방의 삶을 실질적으로 이롭게 합니다.', actionableDirective: '추상적인 약속 대신 상대방에게 구체적으로 도움이 되는 행동과 혜택을 제공하십시오.' },
  { preceptTitleKo: '부당한 침략에는 단 한 치도 굴복하지 말고 평화를 지켜내라', hanjaMotto: '非攻以守', coreEssence: '남을 먼저 해치지 않되, 정의와 평화를 지키기 위한 방어 역량은 빈틈없이 갖추어야 합니다.', actionableDirective: '공격적인 분쟁은 피하되 원칙과 자신의 소중한 사람들을 지키는 대비는 철저히 하십시오.' },
  { preceptTitleKo: '쓸데없는 낭비를 줄이고 오직 백성의 쓸모에 충실하라', hanjaMotto: '去無用之費 聖王之道', coreEssence: '화려한 겉치레와 과시를 버리고 진정으로 가치 있는 곳에 자원을 집중하십시오.', actionableDirective: '비효율적인 절차와 불필요한 지출을 과감히 정리하고 본질적인 과업에 집중하십시오.' },
];

const FORTRESS_WISDOMS = [
  { fortressTitle: '송나라 성벽을 지켜낸 묵자의 모형 방어전', strategicCounsel: '상대방의 모든 공격 수단을 미리 파악하고 지혜로 막아내어 싸우지 않고도 적의 침략 의지를 꺾으십시오.' },
  { fortressTitle: '뒤꿈치가 닳도록 평화를 위해 달린 묵자의 발걸음', strategicCounsel: '자신의 안일함을 뒤로하고 이웃의 평화를 위해 헌신할 때, 역사는 당신의 이름을 빛나는 수호자로 기록할 것입니다.' },
  { fortressTitle: '군더더기를 깎아낸 수레바퀴의 단단함', strategicCounsel: '치장보다 견고함이 중요하니, 삶의 모든 영역에서 거품을 걷어내고 내실을 굳건히 다지십시오.' },
  { fortressTitle: '차별 없이 만물을 비추는 하늘의 태양', strategicCounsel: '사람의 외모나 신분으로 차별하지 않고 오직 성실함과 진실됨으로 사람을 대하면 천하가 당신과 함께할 것입니다.' },
];

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' +09:00 (KST)';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function classifyMoziTopic(question: string): MoziQuestionTopic {
  if (/연애|사랑|관계|갈등|다툼|상대|사람|가족|친구|동료|협력|신뢰/.test(question)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|계약|협상|경쟁|진로|일|프로젝트|전략/.test(question)) {
    return 'decision';
  }
  if (/돈|지출|낭비|절약|정리|단순|피로|소모|체면|효율|회복/.test(question)) {
    return 'simplicity';
  }
  return 'reflection';
}

function buildMoziSituationalAudit(topic: MoziQuestionTopic): MoziSituationalAudit {
  switch (topic) {
    case 'relationship':
      return {
        topic,
        moziTextRef: '《묵자》〈겸애(兼愛)〉 — 남의 집을 내 집처럼 보라(視人之家 若視其家)',
        exclusionTrap: '내 편과 남의 편을 가르고 상대의 손해를 감수한 채 내 입장만 세우려는 별애(別愛)',
        reciprocalShift: '상대와 내가 함께 숨 쉬고 득을 나누는 호혜적 질문("둘 다에게 이로운 길은 무엇인가")으로 시선을 옮깁니다.',
        practicalDirective: '감정적 공방을 멈추고 상대의 실제 어려움을 한 가지 덜어 주는 구체적 행동부터 먼저 건네십시오.',
      };
    case 'decision':
      return {
        topic,
        moziTextRef: '《묵자》〈비공(非攻)〉·〈상현(尙賢)〉 — 싸우지 않고 지키는 실질의 방어',
        exclusionTrap: '소모적인 기싸움이나 외형적 체면에 자원을 낭비하며 본질의 수호를 놓치는 무모함',
        reciprocalShift: '공격보다 튼튼한 대비(수어)와 실질적 효용을 기준으로 선택지를 재정렬합니다.',
        practicalDirective: '갈등을 키우는 선택을 피하고, 나와 동료가 모두 지치지 않게 지킬 수 있는 방어선과 실익을 먼저 확보하십시오.',
      };
    case 'simplicity':
      return {
        topic,
        moziTextRef: '《묵자》〈절용(節用)〉 — 쓸모없는 낭비를 거두어 본질에 쓰라(去無用之費)',
        exclusionTrap: '남의 시선과 체면을 맞추기 위해 시간·돈·기력을 과도하게 소모하는 허례허식',
        reciprocalShift: '보여주기식 조건을 덜어내고 삶의 실제 쓸모와 회복에 자원을 집중합니다.',
        practicalDirective: '오늘 당장 불필요한 약속·지출·절차 하나를 과감히 줄여 가장 중요한 일에 여력을 돌리십시오.',
      };
    default:
      return {
        topic,
        moziTextRef: '《묵자》〈천지(天志)〉 — 공평무사한 저울(義)로 자기 삶을 비춤',
        exclusionTrap: '말과 다짐만 앞세운 채 일상 속 구체적 실천과 검증을 미루는 공허함',
        reciprocalShift: '추상적 고민을 구체적으로 누구에게, 무엇에 이로운가로 바꿔 묻습니다.',
        practicalDirective: '큰 결심보다 오늘 내 손이 닿는 자리에서 낭비를 줄이고 한 사람에게라도 실질적 도움을 주는 선택을 하십시오.',
      };
  }
}

function buildMoziTemporalRhythm(now: Date): MoziTemporalRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  let kstWindowLabel = '새벽 절용·대비 시간대 (실질 점검)';
  let gyeomAePracticeFocus = '군더더기를 덜어내고 오늘 지켜야 할 핵심 원칙과 방어선을 단단히 세우는 시간';
  let dailyCue = '분주해지기 전에 불필요한 소모를 줄이고 오늘 반드시 지킬 우선순위 하나만 남기십시오.';

  if (hour >= 7 && hour < 12) {
    kstWindowLabel = '오전 교리·협력 시간대 (상생 실행)';
    gyeomAePracticeFocus = '나와 타인이 함께 이득을 얻는 호혜적 협력과 명확한 실무가 힘있게 굴러가는 흐름';
    dailyCue = '협의와 소통에서 내 몫만 챙기기보다 상대방이 얻는 실질적 이익을 함께 짚어 주십시오.';
  } else if (hour >= 12 && hour < 18) {
    kstWindowLabel = '오후 비공·수어 시간대 (평화 수호)';
    gyeomAePracticeFocus = '불필요한 마찰을 미리 막고 약한 고리를 보강해 공동의 안정을 지켜 내는 흐름';
    dailyCue = '날 선 말로 맞서기보다 차분한 대비책으로 갈등의 소지를 먼저 가라앉히십시오.';
  } else if (hour >= 18 && hour < 23) {
    kstWindowLabel = '밤 천지·성찰 시간대 (공정 회고)';
    gyeomAePracticeFocus = '오늘의 언행이 편견 없이 공정하고 실질적으로 쓰였는지 고요히 돌아보는 흐름';
    dailyCue = '하루의 지출과 감정을 점검하며 과했던 허례와 불필요한 긴장을 조용히 내려놓으십시오.';
  }

  let seasonTone = '가을의 수확 — 거품을 걷어내고 알곡과 실질만 단단히 거두는 절용의 계절';
  if (month >= 3 && month <= 5) {
    seasonTone = '봄의 파종 — 차별 없는 연대와 호혜의 씨앗을 널리 심는 겸애의 계절';
  } else if (month >= 6 && month <= 8) {
    seasonTone = '여름의 수어 — 과열된 갈등을 식히고 소중한 터전을 흔들림 없이 지키는 비공의 계절';
  } else if (month === 12 || month <= 2) {
    seasonTone = '겨울의 비축 — 낭비를 멈추고 내실과 방어 역량을 묵묵히 다지는 절용의 계절';
  }

  return {
    kstWindowLabel,
    seasonTone,
    gyeomAePracticeFocus,
    dailyCue,
  };
}

function buildMoziSynthesisMatrix(
  stage: MohistStage,
  topic: MoziQuestionTopic,
  temporal: MoziTemporalRhythm
): MoziSynthesisMatrix {
  const gyeomAeOpenness = topic === 'relationship'
    ? '확장 필요 — 내 편과 남의 편을 나누는 경계를 허물고 상대의 처지를 먼저 살필 때 막힘이 풀립니다.'
    : '안정적 — 편견 없이 전체의 선과 공존을 바라볼 여력이 갖춰져 있습니다.';
  const gyoRiReciprocity = topic === 'decision'
    ? '핵심 축 — 일방적 승부가 아니라 서로에게 실질적 이로움이 남는 구조를 설계해야 오래갑니다.'
    : '양호 — 말보다 구체적 도움과 실행으로 신뢰가 쌓이는 흐름입니다.';
  const biGongJeolYongDiscipline = stage.stageLevel >= 4 || topic === 'simplicity'
    ? '최우선 — 불필요한 소모전과 체면 낭비를 멈추고 본질 방어에 자원을 모아야 합니다.'
    : '균형 — 겉치레를 줄이고 핵심 과업에 집중할수록 일의 단단함이 살아납니다.';

  return {
    gyeomAeOpenness,
    gyoRiReciprocity,
    biGongJeolYongDiscipline,
    integrativeSummary: `${temporal.kstWindowLabel}에서는 허례를 줄이는 절용과 서로를 살리는 교상리가 맞물릴 때 가장 든든한 해법이 열립니다.`,
  };
}

export function calculateMoziGyeomAe(
  profile?: UserProfile,
  question = '',
  now: Date = new Date()
): MoziGyeomAeResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seed = hashSeed(`MOZI-GYEOM-AE-${birthdate}-${birthtime}-${name}-${kstDate}-${question}`);

  const gyeomAeUniversalLoveScore = (seed % 41) + 60;
  const gyoRiMutualBenefitIndex = ((seed >> 3) % 43) + 58;
  const biGongPeaceShieldForce = ((seed >> 5) % 39) + 62;
  const jeolYongSimplicityPurity = ((seed >> 7) % 45) + 55;
  const tianZhiCosmicJusticeScore = ((seed >> 9) % 38) + 63;

  const stageIdx = (seed >> 2) % MOHIST_STAGES.length;
  const activeMohistStage = MOHIST_STAGES[stageIdx];

  const preceptIdx = (seed >> 4) % MOHIST_PRECEPTS.length;
  const primaryMohistPrecept = MOHIST_PRECEPTS[preceptIdx];

  const wisdomIdx = (seed >> 6) % FORTRESS_WISDOMS.length;
  const moziFortressWisdom = FORTRESS_WISDOMS[wisdomIdx];

  const questionTopic = classifyMoziTopic(question);
  const situationalMohistAudit = buildMoziSituationalAudit(questionTopic);
  const temporalMohistRhythm = buildMoziTemporalRhythm(now);
  const mohistSynthesisMatrix = buildMoziSynthesisMatrix(activeMohistStage, questionTopic, temporalMohistRhythm);
  const boundaryNotice = '이 풀이는 묵자 겸애·비공·절용 사상을 오늘의 선택과 관계에 비추어 보는 정성적 실천 지침이며, 수치 우열이나 확정적 예언이 아닙니다.';
  const ritualAction = situationalMohistAudit.practicalDirective;
  const reflectionFocus = `오늘 내가 피해야 할 '${situationalMohistAudit.exclusionTrap}' 대신, 나와 상대를 함께 살리는 교상리(${activeMohistStage.stageNameHanja})의 첫걸음은 무엇일까요?`;
  const trimmedQ = question.trim();
  const reflectiveQuestion = trimmedQ
    ? `‘${trimmedQ}’라는 물음 앞에서 소모적 다툼과 허례를 내려놓고, 나와 상대에게 모두 실질적 이로움이 남는 교상리(${activeMohistStage.stageNameHanja})의 한 걸음은 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: MOZI_GYEOM_AE_VERSION,
    calculatedAtKst: getKstDateString(now),
    gyeomAeUniversalLoveScore,
    gyoRiMutualBenefitIndex,
    biGongPeaceShieldForce,
    jeolYongSimplicityPurity,
    tianZhiCosmicJusticeScore,
    questionTopic,
    activeMohistStage,
    primaryMohistPrecept,
    moziFortressWisdom,
    situationalMohistAudit,
    temporalMohistRhythm,
    mohistSynthesisMatrix,
    boundaryNotice,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary: boundaryNotice,
  };
}

export function formatMoziGyeomAePrompt(result: MoziGyeomAeResult): string {
  return `[🛡️ 춘추전국시대 묵가(墨家) 묵자(墨子) 겸애교리(兼愛交利) & 비공절용 실천 리포트]
- 엔진 버전: ${result.engineVersion}
- 연산 시각: ${result.calculatedAtKst}
- 현행 묵가적 도덕 지평: **[${result.activeMohistStage.stageNameKo} (${result.activeMohistStage.stageNameHanja})]**
  → 관장 영역: ${result.activeMohistStage.ethicalDomain}
  → 실천의 축복: ${result.activeMohistStage.mohistVirtueBlessing}
- 질문 맥락 감사(${result.situationalMohistAudit.moziTextRef}): 함정(${result.situationalMohistAudit.exclusionTrap}) → 전환(${result.situationalMohistAudit.reciprocalShift}) / 실천(${result.situationalMohistAudit.practicalDirective})
- KST 시공간 리듬(${result.temporalMohistRhythm.kstWindowLabel} · ${result.temporalMohistRhythm.seasonTone}): ${result.temporalMohistRhythm.gyeomAePracticeFocus} (${result.temporalMohistRhythm.dailyCue})
- 묵가 교차 매트릭스: 겸애(${result.mohistSynthesisMatrix.gyeomAeOpenness}) | 교리(${result.mohistSynthesisMatrix.gyoRiReciprocity}) | 비공·절용(${result.mohistSynthesisMatrix.biGongJeolYongDiscipline})
- 최우선 묵가 실천 계율: **[${result.primaryMohistPrecept.preceptTitleKo} (${result.primaryMohistPrecept.hanjaMotto})]**
  → 핵심 본질: ${result.primaryMohistPrecept.coreEssence}
  → 실천 지침: ${result.primaryMohistPrecept.actionableDirective}
- 묵자의 철옹성 지혜: 《${result.moziFortressWisdom.fortressTitle}》
  → 전략적 조언: "${result.moziFortressWisdom.strategicCounsel}"
- 성찰 질문: ${result.reflectiveQuestion}
- 해석 경계: ${result.boundaryNotice}`;
}
