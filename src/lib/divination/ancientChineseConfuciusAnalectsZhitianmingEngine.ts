/**
 * 고대 동양 유학 공자(孔子) 《논어(論語)》 지천명(知天命) & 극기복례(克己復禮) 군자도(君子道) 수양 엔진
 *
 * 공자의 《논어(論語)》 <위정(爲政)>, <안연(顔淵)>, <헌문(憲問)> 원전 기반.
 * 1. 생애 주기적 천명 자각(Life Stages of Wisdom): 지우학·이립·불혹·지천명·이순·종심
 * 2. 인(仁)과 예(禮): 내면의 진솔한 사랑과 공감(仁)과 그것을 격조 있게 표현하는 절도(禮)
 * 3. 극기복례(克己復禮): 사사로운 욕망을 이겨내고 본래의 도리와 예법으로 돌아감
 * 4. 군자탄탕탕(君子坦蕩蕩): 조급함과 근심을 넘어 마음에 걸림이 없는 넓고 평정한 품격
 *
 * @version LUCKEY-CONFUCIUS-ZHITIANMING-v1.1.0
 */

import type { UserProfile } from '../sharedState';

export const CONFUCIUS_ZHITIANMING_VERSION = 'LUCKEY-CONFUCIUS-ZHITIANMING-v1.1.0';

export type ConfuciusQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface ConfuciusLifeStage {
  stageKey: string;
  stageNameHanja: string;
  stageNameKo: string;
  wisdomInsight: string;
  actionGuidance: string;
}

export interface ConfuciusCoreVirtue {
  virtueHanja: string;
  virtueKo: string;
  moralFocus: string;
  cultivationCounsel: string;
}

export interface ConfuciusAnalectsZhitianmingResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: ConfuciusQuestionTopic;
  junziPosture: string;
  // 내부 계산 호환 필드 (프롬프트 비노출)
  tianmingAttunementScore: number;
  renBenevolenceCoreScore: number;
  liDecorumHarmonyScore: number;
  kejiFuliDisciplineScore: number;
  junziEquanimityScore: number;
  // 세부 명세
  activeLifeStage: ConfuciusLifeStage;
  focalVirtue: ConfuciusCoreVirtue;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
  confucianPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type ConfuciusAnalectsZhitianmingReport = ConfuciusAnalectsZhitianmingResult;

const LIFE_STAGES: ConfuciusLifeStage[] = [
  {
    stageKey: 'ZhiYuXue',
    stageNameHanja: '志于學 (지우학)',
    stageNameKo: '배움과 기초 닦음에 뜻을 두는 발심의 단계',
    wisdomInsight: '자신의 부족함을 겸허히 인정하고 배움의 본질에 순수하게 몰입하는 때입니다.',
    actionGuidance: '성급히 결과를 내려 하지 말고 지혜의 근본을 탐구하며 내적 역량을 꾸준히 축적하십시오.',
  },
  {
    stageKey: 'ErLi',
    stageNameHanja: '而立 (이립)',
    stageNameKo: '확고한 가치관과 전문성을 바탕으로 스스로 우뚝 서는 단계',
    wisdomInsight: '주변의 평가나 환경에 흔들리지 않고 자신의 중심축을 세상에 확립하는 시기입니다.',
    actionGuidance: '예(禮)에 기반하여 자신의 원칙과 경계를 명확히 세우고 굳건히 실천해 나가십시오.',
  },
  {
    stageKey: 'BuHuo',
    stageNameHanja: '不惑 (불혹)',
    stageNameKo: '세속적 유혹과 혼란을 꿰뚫어 미혹되지 않는 통찰의 단계',
    wisdomInsight: '외적인 번잡함이나 시비 속에서도 본질과 비본질을 명확히 가려내는 때입니다.',
    actionGuidance: '의심과 번민을 내려놓고 자신이 선택한 정도(正道)를 흔들림 없이 밀고 나가십시오.',
  },
  {
    stageKey: 'ZhiTianMing',
    stageNameHanja: '知天命 (지천명)',
    stageNameKo: '하늘이 부여한 사명과 우주적 순리를 겸허히 자각하는 단계',
    wisdomInsight: '인간의 작은 힘으로 억지를 부리지 않고, 주어지는 소명에 감사하며 순리에 따르는 지혜입니다.',
    actionGuidance: '결과의 성패를 하늘의 뜻에 맡기고, 오직 내가 완수해야 할 도덕적 본분에 온 힘을 다하십시오.',
  },
  {
    stageKey: 'ErShun',
    stageNameHanja: '耳順 (이순)',
    stageNameKo: '모든 소리와 의견을 거스름 없이 너그럽게 수용하는 단계',
    wisdomInsight: '타인의 비판이나 반대 의견도 감정적 저항 없이 온전히 품어내고 이해하는 경지입니다.',
    actionGuidance: '나와 다른 생각에 반박하기보다 그 사람의 처지와 배경을 깊이 헤아리는 덕을 베푸십시오.',
  },
  {
    stageKey: 'CongXin',
    stageNameHanja: '從心所欲不踰矩 (종심)',
    stageNameKo: '마음 내키는 대로 행하여도 도리와 법도에 어긋남이 없는 최고 성취 단계',
    wisdomInsight: '외적 규범이 완전히 내면화되어 자유로움과 도덕적 완성도가 완벽한 일치를 이루는 상태입니다.',
    actionGuidance: '인위적 긴장을 풀고 마음속 참된 본성을 따라 자연스럽게 행동하되 본분을 지키십시오.',
  },
];

const CORE_VIRTUES: ConfuciusCoreVirtue[] = [
  {
    virtueHanja: '仁 (인 - 어짊)',
    virtueKo: '사랑과 공감의 덕 - 사람을 아끼고 배려하는 가장 으뜸가는 심덕',
    moralFocus: '기소불욕 물시어인(己所不欲 勿施於人: 내가 바라지 않는 바를 남에게 베풀지 말라)',
    cultivationCounsel: '자기중심적 계산을 내려놓고 상대방의 입장을 먼저 헤아리는 자비로운 공감을 발휘하십시오.',
  },
  {
    virtueHanja: '義 (의 - 옳음)',
    virtueKo: '정의와 분별의 덕 - 눈앞의 이익(利)보다 마땅한 도리(義)를 앞세움',
    moralFocus: '견리사의(見利思義: 이로움을 보았을 때 그것이 도의에 부합하는가를 먼저 생각함)',
    cultivationCounsel: '쉬운 길이나 일시적 타협 대신 길게 보아 부끄러움이 없는 정도를 당당히 선택하십시오.',
  },
  {
    virtueHanja: '禮 (예 - 절도)',
    virtueKo: '절제와 질서의 덕 - 내면의 감정을 조화롭고 품격 있게 표현하는 질서',
    moralFocus: '불학례 무이립(不學禮 無以立: 예를 배우지 않으면 세상에 올바르게 설 수 없다)',
    cultivationCounsel: '말과 태도에서 지나침과 모자람이 없도록 격식을 갖추고 정중한 균형을 유지하십시오.',
  },
  {
    virtueHanja: '智 (지 - 지혜)',
    virtueKo: '명철한 앎의 덕 - 사람을 알아보고 사물의 본질을 꿰뚫는 분별력',
    moralFocus: '지지위지지 부지위부지 시지야(知之爲知之 不知爲不知 是知也: 아는 것을 안다 하고 모르는 것을 모른다 하는 것이 참된 앎이다)',
    cultivationCounsel: '스스로의 한계를 정직하게 직시하고, 겸허한 탐구를 통해 상황의 맥락을 정확히 짚어내십시오.',
  },
  {
    virtueHanja: '信 (신 - 믿음)',
    virtueKo: '신의와 성실의 덕 - 말한 바를 반드시 지켜 타인에게 신뢰를 얻음',
    moralFocus: '인무신 불립(人無信 不立: 사람에게 믿음이 없으면 사회에서 살아갈 수 없다)',
    cultivationCounsel: '작은 약속이라도 소홀히 여기지 말고 언행일치로 신뢰의 단단한 반석을 다지십시오.',
  },
];

const TOPIC_GUIDANCE: Record<ConfuciusQuestionTopic, {
  posture: string;
  practice: string;
  ritual: string;
  reflection: string;
}> = {
  relationship: {
    posture: '인(仁)의 서(恕)로 상대의 처지를 헤아리고 예(禮)로 경계를 지키는 태도',
    practice: '내 감정을 앞세우기 전에 기소불욕 물시어인(己所不欲 勿施於人)의 마음으로 상대의 입장을 한 번 더 살피십시오.',
    ritual: '대화를 시작하기 전, 상대에게 건넬 말 한마디가 존중과 절도를 담고 있는지 마음속으로 점검하기.',
    reflection: '이 관계에서 내가 지켜야 할 예의 선과, 먼저 내어줄 수 있는 따뜻한 배려는 무엇입니까?',
  },
  decision: {
    posture: '눈앞의 이로움(利)보다 오래 남아도 부끄럽지 않을 도리(義)를 가늠하는 태도',
    practice: '선택의 갈림길에서 빠르고 쉬운 길보다, 시간이 흐른 뒤에도 스스로 떳떳할 수 있는 기준을 먼저 세우십시오.',
    ritual: '결정 전 종이에 "이 선택이 나와 주변에 남기는 신뢰"를 한 줄로 적어 보기.',
    reflection: '당장의 유불리를 걷어내고 보면, 지금 마땅히 걸어야 할 정도(正道)는 어느 쪽입니까?',
  },
  healing: {
    posture: '소인의 조급한 근심(長戚戚)을 내려놓고 군자의 넓고 평정한 마음(坦蕩蕩)으로 돌아가는 태도',
    practice: '이미 지나간 일이나 남의 시선에 마음을 묶어두지 말고, 오늘 내가 돌볼 수 있는 일상의 질서부터 차분히 회복하십시오.',
    ritual: '하루를 마감하며 스스로를 탓하는 생각 대신 오늘 성실히 지킨 작은 도리 하나를 떠올려 주기.',
    reflection: '내 마음을 어지럽히는 근심 중, 내가 통제할 수 없는 결과에 대한 집착은 무엇입니까?',
  },
  reflection: {
    posture: '아는 것을 안다 하고 모르는 것을 모른다 인정하며 하루 세 번 자신을 살피는(三省) 태도',
    practice: '타인을 탓하거나 외부에서 답을 찾기 전에, 오늘 나의 말과 행동이 본래의 뜻과 어긋나지 않았는지 고요히 비추어 보십시오.',
    ritual: '잠들기 전 3분간 오늘의 언행 중 가장 마음에 걸렸던 순간과 가장 진솔했던 순간을 나란히 돌아보기.',
    reflection: '지금의 나를 더 단단한 사람으로 자라게 하기 위해 오늘 닦아야 할 기본기는 무엇입니까?',
  },
};

function classifyQuestionTopic(question?: string): ConfuciusQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/연애|사랑|결혼|이별|사람|관계|친구|가족|부모|동료|상사|갈등|화해|소통|신뢰/.test(q)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|사업|계약|투자|진로|시험|합격|갈림길|해야|말아야|방향/.test(q)) {
    return 'decision';
  }
  if (/지치|힘들|불안|걱정|우울|슬픔|상처|회복|위로|휴식|번아웃|건강|잠/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function formatKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}

export function calculateConfuciusAnalectsZhitianming(
  profile: UserProfile,
  now: Date = new Date(),
  question?: string,
): ConfuciusAnalectsZhitianmingResult {
  const kstDate = getKstDateString(now);
  const questionTopic = classifyQuestionTopic(question);
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    kstDate +
    (question ?? '') +
    'ConfuciusAnalectsZhitianming';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const tianmingAttunementScore = 66 + (absHash % 33);
  const renBenevolenceCoreScore = 63 + ((absHash >> 3) % 36);
  const liDecorumHarmonyScore = 60 + ((absHash >> 6) % 39);
  const kejiFuliDisciplineScore = 62 + ((absHash >> 9) % 37);
  const junziEquanimityScore = 65 + ((absHash >> 12) % 34);

  const stageIndex = (absHash >> 4) % LIFE_STAGES.length;
  const virtueIndex = (absHash >> 7) % CORE_VIRTUES.length;

  const activeLifeStage = LIFE_STAGES[stageIndex];
  const focalVirtue = CORE_VIRTUES[virtueIndex];
  const topicGuide = TOPIC_GUIDANCE[questionTopic];

  const counselTitle = `공자 논어 지천명: ${activeLifeStage.stageNameHanja}`;
  const philosophicalGuidance = `군자는 마음이 넓고 평정하며(君子坦蕩蕩), 소인은 늘 근심하고 조급해합니다(小人長戚戚). ` +
    `현재 당신이 마주한 삶의 마디는 '${activeLifeStage.stageNameKo}'에 조응합니다. ${activeLifeStage.actionGuidance} ` +
    `특히 ${focalVirtue.virtueKo}의 덕목을 지키십시오. ${focalVirtue.moralFocus}의 정신으로 ${focalVirtue.cultivationCounsel}`;

  const counselNote = `${activeLifeStage.stageNameHanja}의 마디와 ${focalVirtue.virtueHanja}의 덕목이 만나, 지금의 질문을 '${topicGuide.posture}'로 비추고 있습니다.`;
  const boundaryNotice = '이 관점은 《논어》의 수양 철학을 바탕으로 한 상징적 성찰 안내이며, 점술적 길흉이나 확정적 미래 예언이 아닙니다.';

  return {
    engineVersion: CONFUCIUS_ZHITIANMING_VERSION,
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    junziPosture: topicGuide.posture,
    tianmingAttunementScore,
    renBenevolenceCoreScore,
    liDecorumHarmonyScore,
    kejiFuliDisciplineScore,
    junziEquanimityScore,
    activeLifeStage,
    focalVirtue,
    practiceGuidance: topicGuide.practice,
    ritualAction: topicGuide.ritual,
    reflectionFocus: topicGuide.reflection,
    counselNote,
    boundaryNotice,
    confucianPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatConfuciusAnalectsZhitianmingPrompt(res: ConfuciusAnalectsZhitianmingResult): string {
  return [
    `【공자 논어 지천명 & 극기복례 군자도 지표】`,
    `- 질문 맥락 초점: ${res.questionTopic} | 군자의 태도: ${res.junziPosture}`,
    `- 조응하는 생애 마디: ${res.activeLifeStage.stageNameHanja} (${res.activeLifeStage.stageNameKo})`,
    `- 지혜의 통찰: ${res.activeLifeStage.wisdomInsight}`,
    `- 실천적 행동 지침: ${res.activeLifeStage.actionGuidance}`,
    `- 핵심 수양 덕목: ${res.focalVirtue.virtueKo}`,
    `- 도덕적 훈계: ${res.focalVirtue.moralFocus}`,
    `- 맥락별 수양 조언: ${res.practiceGuidance}`,
    `- 오늘의 작은 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectionFocus}`,
    `- 핵심 조언 요약: ${res.counselNote}`,
    `- 해석 경계: ${res.boundaryNotice}`,
    `- 철학적 수양 지침: ${res.confucianPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
