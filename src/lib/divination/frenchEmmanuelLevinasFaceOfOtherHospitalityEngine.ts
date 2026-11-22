/**
 * 프랑스 에마뉘엘 레비나스(Emmanuel Levinas) 《전체성과 무한》 & 《존재와 다르게》 타자의 얼굴(Visage)·무조건적 환대·무한한 윤리적 책임 지혜 엔진
 *
 * 20세기 윤리 제일철학의 거장 에마뉘엘 레비나스(1906~1995)의 원전 기반:
 * 1. 타자의 얼굴 대면 및 탈자기중심성 지표 (Face of the Other & De-Centering Score): 나만의 욕망과 편견의 감옥을 벗어나, 상대방의 고유하고 상처받기 쉬운 실존의 얼굴(Visage)을 온전히 응시하는 감응력.
 * 2. 무한한 책임 및 윤리적 주체성 지수 (Infinite Responsibility & Ethical Agency Index): 타인의 어려움과 고통에 핑계를 대지 않고 먼저 짐을 나누어 지는 성숙하고 자발적인 주체적 책임감.
 * 3. 무조건적 환대 및 타자성 포용 지표 (Unconditional Hospitality & Alterity Embracing Score): 낯선 타인과 예측 불가능한 운명의 변화를 경계하거나 내치지 않고, 너른 품으로 맞아들이는 열린 환대의 미덕.
 * 4. 전체성 탈피 및 무한 지향 지수 (Beyond Totality & Transcendence of Infinity Index): 인간과 세계를 획일적인 효율성이나 계산된 손익의 전체성(Totalité)에 가두지 않고, 무한(Infini)의 신비로 열어두는 비판적 통찰.
 * 5. 취약성 응답 및 비폭력 수호 지표 (Vulnerability Protection & Non-Violent Care Score): 약자의 눈물과 벌거벗은 취약함 앞에 폭력성과 오만을 거두고, 생명을 보살피는 평화적 연대와 배려의 힘.
 *
 * @version LUCKEY-EMMANUEL-LEVINAS-ETHICS-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_EMMANUEL_LEVINAS_ETHICS_VERSION = 'LUCKEY-EMMANUEL-LEVINAS-ETHICS-v2.3.0';

export type LevinasQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface LevinasTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  ethicsTone: string;
  rhythmDirective: string;
}

export interface LevinasTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface LevinasAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchEmmanuelLevinasFaceOfOtherHospitalityResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 레비나스 핵심 지표 (0~100)
  faceOfOtherEncounterScore: number;          // 타자의 얼굴 대면 및 탈자기중심성 지표 (Face of the Other Encounter)
  infiniteResponsibilityIndex: number;        // 무한한 책임 및 윤리적 주체성 지수 (Infinite Responsibility Index)
  unconditionalHospitalityScore: number;      // 무조건적 환대 및 타자성 포용 지표 (Unconditional Hospitality Score)
  beyondTotalityInfinityIndex: number;        // 전체성 탈피 및 무한 지향 지수 (Beyond Totality Infinity Index)
  vulnerabilityProtectionScore: number;       // 취약성 응답 및 비폭력 수호 지표 (Vulnerability Protection Score)
  // 세부 분석
  questionTopic: LevinasQuestionTopic;
  hospitalityPhase: string;
  shadowWarning: string;
  temporalLevinasRhythm: LevinasTemporalRhythm;
  activeLevinasTheme: LevinasTheme;
  companionLevinasTheme: LevinasTheme;
  focalLevinasAphorism: LevinasAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  levinasSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  levinasComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

const LEVINAS_HOSPITALITY_PHASES = [
  '얼굴 대면(상대를 내 편리한 이미지에 가두지 않고 고유한 타자로 마주하는 시기)',
  '먼저 응답(누구의 잘못인지 따지기 앞서 내가 감당할 몫을 먼저 건네는 시기)',
  '문턱 개방(낯선 변화와 타인의 다름을 방어벽 대신 환대의 여백으로 품는 시기)',
] as const;

const LEVINAS_SHADOW_WARNINGS = [
  '타인의 짐을 먼저 지려는 책임감이 지나쳐 나 자신의 건강한 경계와 돌봄까지 소진하지 않도록 살피세요.',
  '무조건적 환대와 포용을 택하느라 분명히 짚어야 할 부당함이나 사실의 선까지 흐리지 않도록 점검하세요.',
  '상대의 취약함에 조심스러워하다 꼭 필요한 솔직한 대화와 요청의 타이밍을 놓치지 않도록 유의하세요.',
] as const;

export const LEVINAS_THEMES: LevinasTheme[] = [
  {
    themeKey: 'faceOfOther',
    themeTitleEn: 'Encounter with the Face: Gazing upon the Irreducible Alterity of the Other',
    themeTitleKo: '타자의 얼굴과의 만남 — 나의 잣대로 재단할 수 없는 고유한 타자성 존중하기',
    pragmaticInsight: '레비나스 철학에서 타자의 얼굴(Visage)은 내가 소유하거나 규정할 수 없는 절대적인 신비입니다. 상대방을 나의 목적을 위한 수단으로 보지 않고 그 자체로 존엄한 존재로 마주할 때 진정한 관계가 시작됩니다.',
    practicalCounsel: '상대방을 당신의 선입견이나 편리한 틀에 끼워 맞추려 하지 마십시오. 그 사람의 눈빛과 표정, 벌거벗은 얼굴이 건네는 고유한 목소리에 귀를 기울이고 그 차이를 온전히 존중하십시오.',
  },
  {
    themeKey: 'infiniteResponsibility',
    themeTitleEn: 'Infinite Responsibility: Becoming an Ethical Agent Who Answers First',
    themeTitleKo: '무한한 책임의 주체 — 핑계를 대지 않고 타인의 아픔에 먼저 손 내밀기',
    pragmaticInsight: '레비나스에게 주체성은 타인에 대한 무한한 책임(Responsabilité infinie) 속에서 피어납니다. "남들도 안 하는데 왜 나만?"이라는 변명을 내려놓고 먼저 타인의 짐을 나누어 지는 자가 진정한 어른입니다.',
    practicalCounsel: '누군가 당신에게 도움을 청하거나 침묵으로 고통을 호소할 때 고개를 돌리지 마십시오. 계산을 앞세우지 않고 먼저 건네는 따뜻한 책임의 응답이 당신을 그 누구도 흔들 수 없는 주체로 만듭니다.',
  },
  {
    themeKey: 'unconditionalHospitality',
    themeTitleEn: 'Unconditional Hospitality: Opening Doors to the Stranger Without Fear',
    themeTitleKo: '무조건적 환대의 개방 — 낯선 사람과 예기치 못한 운명의 변화를 너그럽게 품기',
    pragmaticInsight: '환대(Hospitalité)는 나에게 익숙하고 안전한 문을 열어 낯선 손님을 나의 안방으로 맞아들이는 용기입니다. 낯섦을 두려워하여 성벽을 높이 쌓으면 영혼은 메마르고 고립될 뿐입니다.',
    practicalCounsel: '새로운 사람이나 낯선 환경, 예상치 못한 변화가 다가올 때 방어적으로 벽을 치지 마십시오. 마음의 문을 활짝 열고 넉넉한 환대의 태도를 취할 때 뜻밖의 축복과 은혜가 찾아옵니다.',
  },
  {
    themeKey: 'beyondTotality',
    themeTitleEn: 'Beyond Totality: Shattering Closed Systems for the Transcendence of Infinity',
    themeTitleKo: '전체성의 폭력 극복 — 획일적인 효율성과 손익의 감옥을 깨고 무한으로 열리기',
    pragmaticInsight: '세상은 종종 모든 인간을 하나의 톱니바퀴나 숫자로 환원하는 거대한 전체성(Totalité)의 폭력을 행사합니다. 레비나스는 닫힌 체계를 깨뜨리고 환원 불가능한 무한(Infini)의 가치를 수호하라고 권고합니다.',
    practicalCounsel: '상황을 오직 손해와 이익, 효율성의 관점으로만 좁게 재단하지 마십시오. 규격화된 틀을 훌쩍 뛰어넘는 영혼의 자유와 무한한 가능성을 믿고, 계산을 넘어서는 가치에 베팅하십시오.',
  },
  {
    themeKey: 'vulnerabilityProtection',
    themeTitleEn: 'Vulnerability Protection: Lowering Weapons Before the Fragility of Life',
    themeTitleKo: '취약성의 평화적 수호 — 연약한 생명 앞에 무기를 내려놓고 살림의 연대 실천하기',
    pragmaticInsight: '타자의 얼굴은 세상에서 가장 연약하고 무방비한 취약함으로 나타나며, 역설적이게도 그 연약함이야말로 "나를 해치지 말라"는 가장 준엄한 도덕적 명령을 내립니다.',
    practicalCounsel: '상대방의 약점이나 실수를 발견했을 때 그것을 공격의 무기로 삼지 마십시오. 상대의 취약함을 부드럽게 감싸 안고 보호할 때, 갈등의 악순환이 끊어지고 평화로운 신뢰가 싹틉니다.',
  },
];

export const LEVINAS_APHORISMS: LevinasAphorism[] = [
  {
    aphorismKey: 'faceCommandThouShaltNotKill',
    aphorismKo: '타자의 얼굴은 나에게 말을 건넨다. 그 얼굴이 전하는 최초의 언어는 바로 "너는 살인하지 말라"는 절대적 호소이다.',
    aphorismFrench: 'Le visage me parle et par là m\'invite à une relation... La première parole du visage est: "Tu ne tueras point."',
    sourceContext: '에마뉘엘 레비나스 《전체성과 무한(Totalité et Infini)》',
    actionGuidance: '상대방의 존엄을 짓밟거나 상처 입히는 언행을 멈추십시오. 타인의 존재 그 자체를 경외심으로 대면하십시오.',
  },
  {
    aphorismKey: 'hostageResponsibility',
    aphorismKo: '책임이란 타인을 위해 인질이 되는 것이다. 나는 타인에 대한 무한한 책임을 짊어짐으로써 비로소 유일무이한 주체가 된다.',
    aphorismFrench: 'La responsabilité pour autrui... c\'est être otage. C\'est par là que le moi est irremplaçable.',
    sourceContext: '에마뉘엘 레비나스 《존재와 다르게 또는 본질의 저편(Autrement qu\'être)》',
    actionGuidance: '남 탓이나 상황 탓으로 책임을 회피하지 마십시오. 기꺼이 타인을 위한 책임을 감당할 때 비로소 참된 리더십이 탄생합니다.',
  },
  {
    aphorismKey: 'ethicsAsFirstPhilosophy',
    aphorismKo: '윤리는 존재론에 앞선 제일철학이다. 세계를 지배하고 소유하려는 이성보다, 타자의 고통에 응답하는 마음이 먼저다.',
    aphorismFrench: 'L\'éthique est la philosophie première. La relation avec autrui ne se réduit pas à une connaissance.',
    sourceContext: '에마뉘엘 레비나스 《윤리와 무한(Éthique et Infini)》',
    actionGuidance: '지식과 계산으로 상대를 장악하려 하지 마십시오. 타인의 마음에 공감하고 배려하는 따뜻한 도덕적 태도를 가장 앞자리에 두십시오.',
  },
  {
    aphorismKey: 'hospitalityBread',
    aphorismKo: '진정한 환대란 나의 문을 열어 낯선 이에게 나의 거처와 내 손의 빵을 기꺼이 나누어 주는 것이다.',
    aphorismFrench: 'L\'hospitalité consiste à ouvrir sa porte et à donner le pain de sa propre bouche à l\'étranger.',
    sourceContext: '에마뉘엘 레비나스 《어려운 자유(Difficile liberté)》',
    actionGuidance: '가진 것을 혼자 독차지하지 마십시오. 당신의 거처와 시간과 마음의 여백을 낯선 이와 약자를 위해 기꺼이 나누어 주십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function classifyLevinasQuestionTopic(query?: string): LevinasQuestionTopic {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return 'reflection';
  if (/(사랑|연애|관계|배우자|친구|가족|동료|갈등|화해|인연|사람|대화|소통)/.test(q)) return 'relationship';
  if (/(선택|결정|이직|창업|투자|계약|진로|시험|합격|도전|시작|포기|방향)/.test(q)) return 'decision';
  if (/(불안|우울|지침|피곤|회복|치유|휴식|스트레스|상처|위로|두려움|혼란)/.test(q)) return 'healing';
  return 'reflection';
}

function buildLevinasTemporalRhythm(now?: Date): LevinasTemporalRhythm {
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstDateLabel = kst.toISOString().slice(0, 10);
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 12) {
    return {
      kstDateLabel,
      timeWindowKo: '오전 열린 환대와 응답의 시간 (05:00~12:00 KST)',
      ethicsTone: '선입견 내려놓기',
      rhythmDirective: '오늘 만나는 낯선 상황과 사람에게 방어벽 대신 열린 문으로 응답하기 좋은 시간입니다.',
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      kstDateLabel,
      timeWindowKo: '오후 책임 있는 연대와 실천의 시간 (12:00~17:00 KST)',
      ethicsTone: '주체적 책임 응답',
      rhythmDirective: '이해득실 계산을 앞세우기보다 맡은 자리에서 먼저 손을 내밀어 신뢰를 세우는 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstDateLabel,
      timeWindowKo: '저녁 타자의 얼굴 경청의 시간 (17:00~22:00 KST)',
      ethicsTone: '고유한 타자성 존중',
      rhythmDirective: '내 기준의 재단을 멈추고 상대방의 표정과 말 너머의 진심을 고요히 듣는 시간입니다.',
    };
  }
  return {
    kstDateLabel,
    timeWindowKo: '심야 전체성 탈피와 무한 성찰의 시간 (22:00~05:00 KST)',
    ethicsTone: '비폭력과 평화의 성찰',
    rhythmDirective: '효율과 비교의 잣대를 내려놓고 나와 타인의 존엄을 조용히 되새기는 시간입니다.',
  };
}

function buildLevinasTopicGuidance(topic: LevinasQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '상대를 내 기대나 틀에 맞추려 하기보다, 내가 아직 다 알지 못하는 고유한 타자로 온전히 존중하십시오.',
      ritualAction: '오늘 대화에서 상대의 말을 끊거나 평가하지 않고 끝까지 들은 뒤 한 문장만 공감해 주기',
      reflectionFocus: '지금 나는 상대의 얼굴을 보고 있는가, 아니면 내가 만든 이미지와 싸우고 있는가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '단기적 손익과 전체성의 효율만 따지기보다, 이 선택이 약자와 주변의 존엄을 지키는 방향인지 살피십시오.',
      ritualAction: '결정 전 이 선택이 영향을 미칠 한 사람의 입장을 떠올려 보고 무리한 요구가 없는지 점검하기',
      reflectionFocus: '계산을 걷어내고 보았을 때 내가 기꺼이 책임질 수 있는 윤리적 방향은 무엇인가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '자신의 취약함과 상처를 부끄러워하지 마십시오. 연약함이야말로 타인과 연결되고 살림의 연대를 여는 자리입니다.',
      ritualAction: '스스로를 몰아세우는 내면의 비판적 목소리를 멈추고 따뜻한 말 한 마디 건네기',
      reflectionFocus: '내가 지금 내 약함을 공격하는 데 에너지를 쓰고 있는가, 돌보는 데 쓰고 있는가?',
    };
  }
  return {
    practiceGuidance: '익숙한 내 세계의 중심에서 한 발 비켜서서, 타인의 호소와 낯선 가능성에 마음의 문을 열어 두십시오.',
    ritualAction: '오늘 하루 누군가에게 대가나 핑계 없이 먼저 작은 배려 하나 건네기',
    reflectionFocus: '나의 편안함을 잠시 내려놓고 응답할 수 있는 오늘의 작은 환대는 무엇인가?',
  };
}

export function calculateFrenchEmmanuelLevinasFaceOfOtherHospitality(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): FrenchEmmanuelLevinasFaceOfOtherHospitalityResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalLevinasRhythm = buildLevinasTemporalRhythm(now);
  const questionTopic = classifyLevinasQuestionTopic(query);
  const topicGuidance = buildLevinasTopicGuidance(questionTopic);

  const seedString = `EMMANUEL-LEVINAS-ETHICS:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalLevinasRhythm.kstDateLabel}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const faceOfOtherEncounterScore = 88 + ((absHash >> 1) % 11);
  const infiniteResponsibilityIndex = 89 + ((absHash >> 4) % 10);
  const unconditionalHospitalityScore = 87 + ((absHash >> 7) % 12);
  const beyondTotalityInfinityIndex = 89 + ((absHash >> 10) % 10);
  const vulnerabilityProtectionScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % LEVINAS_THEMES.length;
  const companionOffset = 1 + ((absHash >> 6) % (LEVINAS_THEMES.length - 1));
  const aphorismIndex = (absHash >> 8) % LEVINAS_APHORISMS.length;

  const activeLevinasTheme = LEVINAS_THEMES[themeIndex];
  const companionLevinasTheme = LEVINAS_THEMES[(themeIndex + companionOffset) % LEVINAS_THEMES.length];
  const focalLevinasAphorism = LEVINAS_APHORISMS[aphorismIndex];
  const hospitalityPhase = LEVINAS_HOSPITALITY_PHASES[(absHash >> 11) % LEVINAS_HOSPITALITY_PHASES.length];
  const shadowWarning = LEVINAS_SHADOW_WARNINGS[(absHash >> 14) % LEVINAS_SHADOW_WARNINGS.length];

  const guidanceTitle = `에마뉘엘 레비나스 타자의 얼굴과 무한한 책임의 지혜: ${activeLevinasTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 윤리 제일철학의 거장 에마뉘엘 레비나스 선생은 《전체성과 무한》과 《존재와 다르게》를 통해 ` +
    `내 욕망의 감옥을 부수고 상대방의 고유한 존재를 직시하는 '타자의 얼굴(Visage)', 계산과 핑계를 넘어선 '무한한 책임(Responsabilité infinie)', ` +
    `그리고 닫힌 전체성의 폭력을 극복하고 낯선 이를 품어내는 '무조건적 환대(Hospitalité)'의 길을 밝혔습니다. ` +
    `현재 당신이 마주한 인간관계와 갈등의 해법은 바로 '${activeLevinasTheme.themeTitleKo}'(동반 테마: ${companionLevinasTheme.themeTitleKo})에 있습니다. ` +
    `${activeLevinasTheme.practicalCounsel} ${topicGuidance.practiceGuidance} 레비나스의 숭고한 윤리적 명제 "${focalLevinasAphorism.aphorismKo}" (${focalLevinasAphorism.aphorismFrench})를 깊이 묵상하며, ` +
    `${focalLevinasAphorism.actionGuidance}`;

  const boundaryNotice = '에마뉘엘 레비나스 윤리 해석은 타자와의 관계·환대·책임의 태도를 돌아보는 상징·성찰 관점이며, 법률·의학 진단이나 확정 예언이 아닙니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${temporalLevinasRhythm.kstDateLabel}T${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')}:00+09:00 (KST)`;
  const qText = (query ?? '').trim();
  const reflectiveQuestion = qText
    ? `‘${qText}’ 앞에서 '${hospitalityPhase}' 국면으로 볼 때, 내 계산과 잣대를 내려놓고 상대의 고유한 얼굴(Visage)에 건넬 첫 환대는 무엇입니까?`
    : `'${hospitalityPhase}' 국면에서 ${topicGuidance.reflectionFocus}`;
  const levinasSynthesisMatrix = {
    coreInsight: `${activeLevinasTheme.themeTitleKo} (동반: ${companionLevinasTheme.themeTitleKo})`,
    recommendedAction: `${topicGuidance.practiceGuidance} (${hospitalityPhase})`,
    cautionNotice: shadowWarning,
  };

  return {
    engineVersion: FRENCH_EMMANUEL_LEVINAS_ETHICS_VERSION,
    calculatedAtKst: kstTimeLabel,
    faceOfOtherEncounterScore,
    infiniteResponsibilityIndex,
    unconditionalHospitalityScore,
    beyondTotalityInfinityIndex,
    vulnerabilityProtectionScore,
    questionTopic,
    hospitalityPhase,
    shadowWarning,
    temporalLevinasRhythm,
    activeLevinasTheme,
    companionLevinasTheme,
    focalLevinasAphorism,
    practiceGuidance: `${topicGuidance.practiceGuidance} (동반 테마: ${companionLevinasTheme.themeTitleKo})`,
    ritualAction: `${topicGuidance.ritualAction} (${hospitalityPhase})`,
    reflectionFocus: reflectiveQuestion,
    reflectiveQuestion,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    levinasSynthesisMatrix,
    levinasComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchEmmanuelLevinasFaceOfOtherHospitalityPrompt(
  res: FrenchEmmanuelLevinasFaceOfOtherHospitalityResult,
): string {
  return [
    `【에마뉘엘 레비나스 《전체성과 무한》 타자의 얼굴·무한한 책임 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- 환대 국면: ${res.hospitalityPhase}`,
    `- KST 시공간 리듬: ${res.temporalLevinasRhythm.kstDateLabel} · ${res.temporalLevinasRhythm.timeWindowKo} (${res.temporalLevinasRhythm.ethicsTone}) — ${res.temporalLevinasRhythm.rhythmDirective}`,
    `- 핵심 레비나스 테마: ${res.activeLevinasTheme.themeTitleKo} [${res.activeLevinasTheme.themeTitleEn}]`,
    `- 동반 레비나스 테마: ${res.companionLevinasTheme.themeTitleKo}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 실천적 통찰: ${res.activeLevinasTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeLevinasTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.levinasSynthesisMatrix.coreInsight}) | 실행(${res.levinasSynthesisMatrix.recommendedAction}) | 주의(${res.levinasSynthesisMatrix.cautionNotice})`,
    `- 레비나스 원전 격언: "${res.focalLevinasAphorism.aphorismKo}" (${res.focalLevinasAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalLevinasAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalLevinasAphorism.actionGuidance}`,
    `- 종합 레비나스 권면: ${res.levinasComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
