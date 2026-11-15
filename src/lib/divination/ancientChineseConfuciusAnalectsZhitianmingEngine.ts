/**
 * 고대 동양 유학 공자(孔子) 《논어(論語)》 지천명(知天命) & 극기복례(克己復禮) 군자도(君子道) 수양 엔진
 *
 * 공자의 《논어(論語)》 <학이(學而)>, <위정(爲政)>, <이인(里仁)>, <안연(顔淵)>, <헌문(憲問)> 원전 기반.
 * 1. 생애 주기적 천명 자각(Life Stages of Wisdom): 지우학 → 이립 → 불혹 → 지천명 → 이순 → 종심소욕불유구
 * 2. 인(仁)과 예(禮): 내면의 진솔한 사랑과 공감(仁)과 그것을 격조 있게 표현하는 절도(禮).
 * 3. 극기복례(克己復禮): 사사로운 욕망을 이겨내고 본래의 도리와 예법으로 돌아감.
 * 4. 군자탄탕탕(君子坦蕩蕩): 소인의 조급하고 궁색한 근심(小人長戚戚)을 벗어나 마음에 걸림이 없는 넓고 평정한 품격.
 *
 * @version LUCKEY-CONFUCIUS-ZHITIANMING-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const CONFUCIUS_ZHITIANMING_VERSION = 'LUCKEY-CONFUCIUS-ZHITIANMING-v2.1.0';

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

export interface SituationalAnalects {
  themeKo: string;
  chapterCitation: string;
  classicalQuote: string;
  modernInsight: string;
  reflectionPrompt: string;
}

export interface TemporalJunziRhythm {
  kstPhaseLabel: string;
  seasonContext: string;
  liHarmonyIndex: number;
  dailyCultivationPractice: string;
}

export interface JunziCultivationMatrix {
  renLiCohesion: number;
  kejiRestraint: number;
  tianmingAcceptance: number;
  priorityVirtueFocus: string;
  dailyThreeReflections: string;
}

export interface ConfuciusAnalectsZhitianmingResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  tianmingAttunementScore: number;    // 지천명(知天命) 하늘의 섭리 통찰도
  renBenevolenceCoreScore: number;    // 인(仁) 사람을 사랑하는 도덕적 본질도
  liDecorumHarmonyScore: number;      // 예(禮) 사회적 질서와 분절 조화도
  kejiFuliDisciplineScore: number;    // 극기복례(克己復禮) 사욕 절제 및 본연 복원력
  junziEquanimityScore: number;       // 군자탄탕탕(君子坦蕩蕩) 의연한 평정심
  // 세부 명세
  activeLifeStage: ConfuciusLifeStage;
  focalVirtue: ConfuciusCoreVirtue;
  confucianPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  // v2.0.0 질적 성찰 & 시공간·다차원 교차 검증
  situationalAnalects: SituationalAnalects;
  temporalJunziRhythm: TemporalJunziRhythm;
  junziCultivationMatrix: JunziCultivationMatrix;
  // v2.1.0 순수 정성 실천·경계 필드
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
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

function getKstComponents(now: Date): { hour: number; month: number; isoKst: string } {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  return {
    hour: kstDate.getUTCHours(),
    month: kstDate.getUTCMonth() + 1,
    isoKst: kstDate.toISOString().replace('Z', '+09:00'),
  };
}

function analyzeSituationalAnalects(question: string | undefined, focalVirtue: ConfuciusCoreVirtue): SituationalAnalects {
  const q = (question ?? '').trim();
  if (/사람|관계|친구|가족|동료|배신|서운|믿음|갈등/.test(q)) {
    return {
      themeKo: '화이부동(和而不同)과 신의(信義)의 관계학',
      chapterCitation: '《논어》 〈자로(子路)〉 23 · 〈학이(學而)〉 4',
      classicalQuote: '군자화이부동 소인동이불화 (君子和而不同 小人同而不和)',
      modernInsight: '참된 유대는 억지로 뜻을 맞추는 동조가 아니라, 서로의 다름을 존중하면서도 도리 안에서 조화를 이루는 데 있습니다.',
      reflectionPrompt: '상대와 나의 다름을 틀림으로 단정하지 않으면서도 내가 지켜야 할 예(禮)의 선은 어디입니까?',
    };
  }
  if (/돈|이익|직장|사업|성공|선택|유혹|승진|결정/.test(q)) {
    return {
      themeKo: '견리사의(見利思義)와 정명(正名)의 결단',
      chapterCitation: '《논어》 〈헌문(憲問)〉 12 · 〈이인(里仁)〉 16',
      classicalQuote: '견리사의 견위수명 (見利思義 見危授命)',
      modernInsight: '눈앞의 이익이 보일수록 그것이 마땅한 도의에 부합하는지 먼저 묻는 사람이 결국 가장 오래가는 신뢰를 얻습니다.',
      reflectionPrompt: '지금 눈앞의 유익이 1년 뒤 나의 이름과 양심에 부끄러움 없이 어울리는 선택입니까?',
    };
  }
  if (/불안|조급|실패|힘들|지치|포기|운명|답답/.test(q)) {
    return {
      themeKo: '인부지이불온(人不知而不慍)과 군자탄탕탕',
      chapterCitation: '《논어》 〈학이(學而)〉 1 · 〈술이(述而)〉 36',
      classicalQuote: '군자탄탕탕 소인장척척 (君子坦蕩蕩 小人長戚戚)',
      modernInsight: '남이 나를 알아주지 않아도 노여워하지 않고 내 실력과 덕을 닦는 사람은 마음이 넓고 평정합니다.',
      reflectionPrompt: '결과에 대한 조급함(장척척)을 내려놓고 오늘 내가 오롯이 책임질 수 있는 작은 본분은 무엇입니까?',
    };
  }
  if (/공부|배움|성장|진로|꿈|목표|소명|시작/.test(q)) {
    return {
      themeKo: '학이시습(學而時習)과 불치하문(不恥下問)',
      chapterCitation: '《논어》 〈공야장(公冶長)〉 15 · 〈위정(爲政)〉 15',
      classicalQuote: '학이불사칙망 사이불학칙태 (學而不思則罔 思而不學則殆)',
      modernInsight: '배우기만 하고 깊이 사유하지 않으면 어둡고, 생각만 하고 배우지 않으면 위태로워집니다.',
      reflectionPrompt: '지금 내게 부족한 것은 새로운 정보입니까, 아니면 이미 배운 것을 삶에 익히는(시습) 실천입니까?',
    };
  }

  return {
    themeKo: `${focalVirtue.virtueHanja} 중심의 극기복례 수양`,
    chapterCitation: '《논어》 〈안연(顔淵)〉 1 · 〈위정(爲政)〉 4',
    classicalQuote: '극기복례위인 (克己復禮爲仁)',
    modernInsight: focalVirtue.moralFocus,
    reflectionPrompt: focalVirtue.cultivationCounsel,
  };
}

function buildTemporalJunziRhythm(hour: number, month: number, liScore: number): TemporalJunziRhythm {
  let kstPhaseLabel = '';
  let phaseBonus = 0;
  let dailyCultivationPractice = '';

  if (hour >= 4 && hour < 9) {
    kstPhaseLabel = '신독(愼獨) 새벽 정좌기 (04~09시)';
    phaseBonus = 8;
    dailyCultivationPractice = '홀로 있을 때도 도리에 어긋남이 없는지 마음을 단정히 씻고 오늘의 지천명(知天命)을 가다듬는 시간입니다.';
  } else if (hour >= 9 && hour < 14) {
    kstPhaseLabel = '정명(正名) 오전 실천기 (09~14시)';
    phaseBonus = 5;
    dailyCultivationPractice = '맡은 자리와 이름에 걸맞은 책임과 언행일치(信)를 또렷하게 세워 움직이기에 가장 좋은 때입니다.';
  } else if (hour >= 14 && hour < 19) {
    kstPhaseLabel = '화이부동(和而不同) 오후 교류기 (14~19시)';
    phaseBonus = 4;
    dailyCultivationPractice = '타인의 시선과 다른 의견을 너그럽게 수용(이순)하되 예(禮)의 품격을 잃지 않는 소통의 시간입니다.';
  } else {
    kstPhaseLabel = '일일삼성(一日三省) 밤 성찰기 (19~04시)';
    phaseBonus = 7;
    dailyCultivationPractice = '남을 위해 도모함에 진심을 다했는가, 벗과 사귐에 신의가 있었는가, 배운 바를 익혔는가 세 가지를 고요히 돌아보십시오.';
  }

  let seasonContext = '겨울(Winter · 내덕 함양기)';
  if (month >= 3 && month <= 5) seasonContext = '봄(Spring · 인의 발아기)';
  else if (month >= 6 && month <= 8) seasonContext = '여름(Summer · 예절 정진기)';
  else if (month >= 9 && month <= 11) seasonContext = '가을(Autumn · 지천명 결실기)';

  return {
    kstPhaseLabel,
    seasonContext,
    liHarmonyIndex: Math.min(99, Math.max(45, liScore + phaseBonus)),
    dailyCultivationPractice,
  };
}

export function calculateConfuciusAnalectsZhitianming(
  profile: UserProfile,
  question?: string,
  now: Date = new Date()
): ConfuciusAnalectsZhitianmingResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
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

  const { hour, month, isoKst } = getKstComponents(now);
  const situationalAnalects = analyzeSituationalAnalects(question, focalVirtue);
  const temporalJunziRhythm = buildTemporalJunziRhythm(hour, month, liDecorumHarmonyScore);

  const renLiCohesion = Math.round(renBenevolenceCoreScore * 0.55 + temporalJunziRhythm.liHarmonyIndex * 0.45);
  const kejiRestraint = Math.round(kejiFuliDisciplineScore * 0.6 + liDecorumHarmonyScore * 0.4);
  const tianmingAcceptance = Math.round(tianmingAttunementScore * 0.55 + junziEquanimityScore * 0.45);

  const minAxis = Math.min(renLiCohesion, kejiRestraint, tianmingAcceptance);
  let priorityVirtueFocus = '인(仁)과 예(禮)의 내외 조화 확충';
  let dailyThreeReflections = '오늘 사람을 대함에 있어 진심(忠)과 예의 절도를 함께 갖추었는지 살피십시오.';
  if (minAxis === kejiRestraint) {
    priorityVirtueFocus = '극기복례(克己復禮) 사욕 절제 집중';
    dailyThreeReflections = '순간의 조급함이나 사사로운 집착에 중심을 내어준 순간이 있었는지 정직히 점검하십시오.';
  } else if (minAxis === tianmingAcceptance) {
    priorityVirtueFocus = '지천명(知天命) 순리 수용과 평정심 회복';
    dailyThreeReflections = '내가 통제할 수 없는 결과의 성패를 하늘의 순리에 맡기고 내 본분에만 몰입했는지 돌아보십시오.';
  }

  const junziCultivationMatrix: JunziCultivationMatrix = {
    renLiCohesion,
    kejiRestraint,
    tianmingAcceptance,
    priorityVirtueFocus,
    dailyThreeReflections,
  };

  const counselTitle = `공자 논어 지천명: ${activeLifeStage.stageNameHanja}`;
  const philosophicalGuidance =
    `군자는 마음이 넓고 평정하며(君子坦蕩蕩), 소인은 늘 근심하고 조급해합니다(小人長戚戚). ` +
    `현재 당신의 질문('${situationalAnalects.themeKo}')은 '${activeLifeStage.stageNameKo}'에 조응합니다. ${activeLifeStage.actionGuidance} ` +
    `특히 ${focalVirtue.virtueKo}의 덕목을 지키며 "${situationalAnalects.classicalQuote}"의 정신을 되새기십시오.`;

  const dailyPracticeRitual =
    `${temporalJunziRhythm.dailyCultivationPractice} (${junziCultivationMatrix.dailyThreeReflections})`;
  const reflectiveQuestion = situationalAnalects.reflectionPrompt;
  const interpretiveBoundary =
    '이 관점은 점수가 아니라 공자 《논어》의 인·의·예·지·신과 군자도(君子道) 수양 틀로 현재 질문의 도리와 태도를 비추는 상징적 성찰입니다.';

  return {
    engineVersion: CONFUCIUS_ZHITIANMING_VERSION,
    calculatedAtKst: isoKst,
    tianmingAttunementScore,
    renBenevolenceCoreScore,
    liDecorumHarmonyScore,
    kejiFuliDisciplineScore,
    junziEquanimityScore,
    activeLifeStage,
    focalVirtue,
    confucianPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    situationalAnalects,
    temporalJunziRhythm,
    junziCultivationMatrix,
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

function describeConfuciusStage(score: number): string {
  if (score >= 88) return '완숙한 발현(원숙하고 흔들림 없는 결)';
  if (score >= 76) return '안정된 축적(꾸준히 무르익는 흐름)';
  return '기초 다짐(일상에서 길러 가는 싹)';
}

export function formatConfuciusAnalectsZhitianmingPrompt(res: ConfuciusAnalectsZhitianmingResult): string {
  return [
    `【공자 논어 지천명 & 극기복례 군자도 성찰 (${res.engineVersion})】`,
    `- 내면 덕목 결: 지천명 통찰 [${describeConfuciusStage(res.tianmingAttunementScore)}] | 인(仁) [${describeConfuciusStage(res.renBenevolenceCoreScore)}] | 예(禮) [${describeConfuciusStage(res.liDecorumHarmonyScore)}]`,
    `- 수양 태도: 극기복례 절제 [${describeConfuciusStage(res.kejiFuliDisciplineScore)}] | 군자탄탕탕 평정심 [${describeConfuciusStage(res.junziEquanimityScore)}]`,
    `- 조응하는 생애 마디: ${res.activeLifeStage.stageNameHanja} (${res.activeLifeStage.stageNameKo})`,
    `- 질문 맥락 논어 처방(${res.situationalAnalects.chapterCitation}): ${res.situationalAnalects.themeKo}`,
    `  · 원전 경구: "${res.situationalAnalects.classicalQuote}" — ${res.situationalAnalects.modernInsight}`,
    `  · 성찰 물음: ${res.reflectiveQuestion}`,
    `- KST 시공간 리듬: ${res.temporalJunziRhythm.kstPhaseLabel} · ${res.temporalJunziRhythm.seasonContext} (예절 조화: ${describeConfuciusStage(res.temporalJunziRhythm.liHarmonyIndex)})`,
    `- 일일 수양 의례: ${res.dailyPracticeRitual}`,
    `- 군자 수양 방향: 인예 일치 [${describeConfuciusStage(res.junziCultivationMatrix.renLiCohesion)}] / 극기 절제 [${describeConfuciusStage(res.junziCultivationMatrix.kejiRestraint)}] / 천명 수용 [${describeConfuciusStage(res.junziCultivationMatrix.tianmingAcceptance)}] → [${res.junziCultivationMatrix.priorityVirtueFocus}]`,
    `- 핵심 수양 덕목: ${res.focalVirtue.virtueKo}`,
    `- 철학적 수양 지침: ${res.confucianPhilosophicalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
