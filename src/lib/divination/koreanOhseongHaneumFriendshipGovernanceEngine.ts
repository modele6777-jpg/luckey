/**
 * 대한민국 백사 이항복(白沙 李恒福) & 한음 이덕형(漢陰 李德馨) 《오성과 한음(鰲城과 漢陰)》 지기지우 & 경세제민 지혜 엔진
 *
 * 조선 중기 임진왜란의 미증유 국난 속에서 영의정과 좌의정으로 사직과 백성을 지탱한 두 명재상,
 * 백사 이항복(1556~1618)과 한음 이덕형(1561~1613)의 《백사집(白沙集)》, 《한음집(漢陰集)》, 오성과 한음 야사 및 선비정신 원전 기반:
 * 1. 지기지우(知己之友) 평생의 상호 신뢰 및 도의적 우정 지수(Lifelong Moral Friendship & Mutual Trust Index): 평생을 서로 북돋우며 대의를 함께한 동반자적 신의.
 * 2. 국난 극복 경세제민 및 위기 대응 경륜(Crisis Governance & Practical Statesmanship Score): 전란의 참화 속에서 외교와 군량, 민심을 수습한 실전적 경륜.
 * 3. 해학·위트 및 활달한 배포 회복탄력성(Humor, Wit & Magnanimous Resilience Index): 절체절명의 위기 앞에서도 잃지 않은 유쾌한 여유와 기지.
 * 4. 당쟁 초월 공명정대 및 청백리 공심 지표(Anti-Factional Impartiality & Integrity Score): 붕당의 사리사욕을 떠나 오직 나라와 백성을 우선한 공정성.
 * 5. 불굴의 의리 및 의연한 선비 품격도(Unyielding Fidelity & Dignified Grace Index): 폐모론에 맞선 직언과 북청 유배길에서도 품격을 지킨 불굴의 기개.
 *
 * @version LUCKEY-OHSEONG-HANEUM-FRIENDSHIP-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_OHSEONG_HANEUM_VERSION = 'LUCKEY-OHSEONG-HANEUM-FRIENDSHIP-v2.3.0';

export type OhseongHaneumQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface OhseongHaneumTemporalRhythm {
  kstSlot: string;
  phaseLabel: string;
  rhythmDirective: string;
}

export interface OhseongHaneumTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface OhseongHaneumAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanOhseongHaneumFriendshipGovernanceResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: OhseongHaneumQuestionTopic;
  friendshipPhase: string;
  shadowWarning: string;
  temporalOhseongHaneumRhythm: OhseongHaneumTemporalRhythm;
  // 5대 핵심 오성과 한음 지혜 지표 (내부 정성 변환용)
  lifelongMoralFriendshipTrustIndex: number;    // 지기지우 평생 상호 신뢰 및 도의적 우정 지수 (Friendship & Mutual Trust)
  crisisGovernanceStatesmanshipScore: number;   // 국난 극복 경세제민 및 위기 대응 경륜 (Crisis Governance & Statesmanship)
  humorWitMagnanimityResilienceIndex: number;   // 해학·위트 및 활달한 배포 회복탄력성 (Humor, Wit & Magnanimous Resilience)
  antiFactionalImpartialityScore: number;       // 당쟁 초월 공명정대 및 청백리 공심 지표 (Anti-Factional Impartiality)
  unyieldingFidelityGraceIndex: number;         // 불굴의 의리 및 의연한 선비 품격도 (Unyielding Fidelity & Grace)
  // 세부 분석
  activeOhseongHaneumTheme: OhseongHaneumTheme;
  companionOhseongHaneumTheme: OhseongHaneumTheme;
  focalOhseongHaneumAphorism: OhseongHaneumAphorism;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ohseongHaneumComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  ohseongHaneumSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatOhseongHaneumKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}+09:00 (KST)`;
}

const OHSEONG_FRIENDSHIP_PHASES = [
  '지기지우(서로의 마음과 장점을 알아보고 신뢰의 다리를 놓는 시기)',
  '경세해학(무거운 위기 앞에서도 유쾌한 여유와 실질적 해법을 함께 여는 시기)',
  '공심절조(이해득실과 편 가르기를 넘어 바른 원칙과 품격을 지키는 시기)',
] as const;

const OHSEONG_SHADOW_WARNINGS = [
  '해학과 여유로 긴장을 풀되, 상대방이 진지하게 고민하는 아픔까지 가볍게 지나치지 않도록 살피세요.',
  '대의와 원칙을 세우는 데 집중하다 곁에 있는 동료의 현실적 고충과 속도를 놓치지 않도록 점검하세요.',
  '가까운 벗과의 신의를 지키는 일이 낯선 의견이나 새로운 제안을 배척하는 울타리가 되지 않도록 유의하세요.',
] as const;

export const OHSEONG_HANEUM_THEMES: OhseongHaneumTheme[] = [
  {
    themeKey: 'jigijiuMoralFriendship',
    themeTitleEn: 'Lifelong Moral Friendship & Unwavering Trust',
    themeTitleKo: '지기지우(知己之友)의 도의적 신의 — 평생을 함께하는 영혼의 동반자',
    pragmaticInsight: '진정한 벗은 이익으로 맺어지지 않고 도의와 신의로 맺어집니다. 오성과 한음처럼 서로의 장점을 알아보고 단점을 감싸며 대의를 함께할 때, 어떤 풍파도 뚫고 나아갈 수 있습니다.',
    practicalCounsel: '혼자서 모든 짐을 짊어지려 하지 마십시오. 서로를 온전히 믿고 기댈 수 있는 진실한 동반자와 마음을 터놓고 협력할 때, 두 사람의 합은 천하를 움직이는 힘이 됩니다.',
  },
  {
    themeKey: 'crisisStatesmanshipGovernance',
    themeTitleEn: 'Crisis Governance & Practical Statesmanship',
    themeTitleKo: '국난 앞의 경세제민 — 전란의 화염 속에서 사직과 백성을 살린 경륜',
    pragmaticInsight: '탁상공론은 위기 앞에서 무력합니다. 한음의 명나라 외교와 백사의 군무 총괄처럼, 위기 상황에서는 명분보다 실질적인 해결책과 백성의 삶을 구하는 구체적 실천이 최우선입니다.',
    practicalCounsel: '명분이나 형식에 얽매이지 말고 사태를 냉철하게 직시하십시오. 자원을 신속히 확보하고 막힌 혈을 뚫어내는 실전적 실행력으로 위기를 반전의 발판으로 바꾸십시오.',
  },
  {
    themeKey: 'humorousWitMagnanimity',
    themeTitleEn: 'Humor, Wit & Magnanimous Resilience',
    themeTitleKo: '해학과 활달한 배포 — 궁지에서도 잃지 않는 여유와 기지',
    pragmaticInsight: '어린 시절 감나무 일화부터 전시의 담소까지, 오성과 한음의 위트는 단순한 장난이 아닌 절체절명의 긴장을 녹이고 사람들의 마음을 하나로 묶는 고도의 지혜였습니다.',
    practicalCounsel: '상황이 엄중할수록 얼굴을 찌푸리지 말고 호방한 여유와 유쾌한 위트를 발휘하십시오. 마음의 긴장을 푸는 유머 한마디가 막혔던 대화를 열고 뜻밖의 돌파구를 열어줍니다.',
  },
  {
    themeKey: 'antiFactionalImpartiality',
    themeTitleEn: 'Anti-Factional Impartiality & Statesman Integrity',
    themeTitleKo: '당쟁을 초월한 공명정대 — 사리사욕을 버리고 오직 공심을 세우는 기개',
    pragmaticInsight: '편 가르기와 파벌 싸움은 조직과 공동체를 안으로부터 무너뜨립니다. 백사와 한음은 소론·남인의 분열 속에서도 오직 국익과 인재의 됨됨이만을 보아 공평무사하게 천거했습니다.',
    practicalCounsel: '사적인 친소 관계나 파벌 논리에 휘둘리지 마십시오. 오직 객관적인 사실과 전체의 이익을 중심에 두고 공정하게 사람과 일을 대할 때 누구도 흔들 수 없는 권위와 신망을 얻습니다.',
  },
  {
    themeKey: 'unyieldingFidelityGrace',
    themeTitleEn: 'Unyielding Fidelity & Dignified Grace in Adversity',
    themeTitleKo: '불굴의 의리와 의연한 품격 — 유배와 시련 속에서도 꺾이지 않는 절조',
    pragmaticInsight: '백사 이항복은 광해군 때 인목대비 폐모론에 홀로 목숨을 걸고 반대 상소를 올린 뒤 북청 유배길에서 생을 마감했습니다. 불의 앞에 타협하지 않는 품격이 역사의 영원한 사표가 됩니다.',
    practicalCounsel: '부당한 압박이나 일시적인 고난 앞에 비겁하게 굴복하지 마십시오. 당신의 양심과 도의가 가리키는 바른 길을 당당히 걸어갈 때, 시련은 오히려 당신의 기품을 더욱 빛나게 합니다.',
  },
];

export const OHSEONG_HANEUM_APHORISMS: OhseongHaneumAphorism[] = [
  {
    aphorismKey: 'heartKnowsFriendAphorism',
    aphorismKo: '서로를 알아주는 참된 벗은 말하지 않아도 마음이 통하고, 국가의 위태로움 앞에서는 한마음으로 뭉친다.',
    aphorismEn: 'True companions who know each other share one mind without words, standing united as one in times of peril.',
    sourceContext: '《백사집(白沙集)》 & 《한음집(漢陰集)》 지우교록',
    actionGuidance: '동료를 온전히 신뢰하고 속마음을 나누며, 공동의 목표를 향해 손을 맞잡고 거침없이 전진하십시오.',
  },
  {
    aphorismKey: 'crisisPreserveNationAphorism',
    aphorismKo: '전란의 화염 속에서도 사직과 백성을 지탱하는 것은 끝없는 정성과 사리사욕 없는 공심(公心)뿐이다.',
    aphorismEn: 'Amidst the flames of crisis, what sustains the state and people is ceaseless devotion and selfless public-mindedness.',
    sourceContext: '임진란 전시 호종록 및 경세 장계',
    actionGuidance: '사사로운 계산을 내려놓고 공동체의 안위를 최우선에 두며, 묵묵하고 헌신적인 정성을 다하십시오.',
  },
  {
    aphorismKey: 'smileThroughTroubleAphorism',
    aphorismKo: '칼날 같은 역경 앞에서도 웃음을 잃지 않는 호방한 기개가 얽힌 실타래를 푸는 최고의 지혜이다.',
    aphorismEn: 'A magnanimous spirit that retains warmth and wit before sharp adversity is the supreme wisdom that unravels tangled knots.',
    sourceContext: '오성과 한음 일화록 〈감나무와 백사·한음의 기지〉',
    actionGuidance: '어두운 그늘을 털어내고 대범한 호연지기와 유쾌한 재치로 분위기를 쇄신하며 해법을 찾으십시오.',
  },
  {
    aphorismKey: 'dutyOverFactionAphorism',
    aphorismKo: '조정의 의론은 오직 사직과 백성을 위해 바르게 서야지, 붕당의 사리사욕에 좌우되어서는 안 된다.',
    aphorismEn: 'Deliberations of state must stand upright solely for the realm and its people, never swayed by partisan self-interest.',
    sourceContext: '이덕형의 국시 구언 상소문',
    actionGuidance: '편파적인 이익이나 소모적인 파벌 갈등에 가담하지 말고, 원칙과 상식에 입각한 공정함을 견지하십시오.',
  },
  {
    aphorismKey: 'ironWillInExileAphorism',
    aphorismKo: '북청의 찬 바람이 뼛속을 파고들어도 바른 도리를 향한 충절의 불꽃은 결코 꺼지지 않는다.',
    aphorismEn: 'Though the bitter winds of exile pierce to the marrow, the flame of righteous fidelity never wavers.',
    sourceContext: '이항복 북청 유배 시조 〈철령 높은 봉에 쉬어 넘는 저 구름아〉',
    actionGuidance: '상황이 불리하거나 고립되더라도 대의에 대한 신념을 잃지 말고, 의연하고 당당한 품격을 지키십시오.',
  },
];

function classifyOhseongHaneumQuestionTopic(query?: string): OhseongHaneumQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/연애|사랑|사람|관계|친구|가족|동료|갈등|이별|결혼|상대|우정/.test(q)) return 'relationship';
  if (/결정|선택|진로|이직|사업|투자|시험|공부|합격|도전|방향|계획/.test(q)) return 'decision';
  if (/불안|힘들|지치|우울|회복|위로|휴식|건강|마음|치유|고민/.test(q)) return 'healing';
  return 'reflection';
}

function buildOhseongHaneumTemporalRhythm(now?: Date): OhseongHaneumTemporalRhythm {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const hh = String(hour).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const kstSlot = `${hh}:${mm} KST`;

  if (hour >= 5 && hour < 11) {
    return {
      kstSlot,
      phaseLabel: '조정 정론(朝廷正論) · 공정한 출발',
      rhythmDirective: '아침 첫 업무를 열 듯 편견 없이 사실을 살피고, 함께 일하는 이들과 신의를 다지기 좋은 시간입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstSlot,
      phaseLabel: '경세실천(經世實踐) · 위기 돌파',
      rhythmDirective: '명분보다 실질적인 해법을 우선하여 얽힌 과제를 과감하고 유연하게 풀어낼 때입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstSlot,
      phaseLabel: '백사담소(白沙談笑) · 해학과 우정',
      rhythmDirective: '낮의 팽팽한 긴장을 유쾌한 농담과 따뜻한 안부로 녹이며 지기지우의 온기를 나누기 좋은 저녁입니다.',
    };
  }
  return {
    kstSlot,
    phaseLabel: '북청 충절(北靑忠節) · 고요한 기개',
    rhythmDirective: '깊은 밤 외부의 시선에서 벗어나 내면의 원칙과 의리를 조용히 되새기는 시간입니다.',
  };
}

function describeOhseongStage(score: number, high: string, mid: string, base: string): string {
  if (score >= 92) return high;
  if (score >= 86) return mid;
  return base;
}

export function calculateKoreanOhseongHaneumFriendshipGovernance(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): KoreanOhseongHaneumFriendshipGovernanceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const questionTopic = classifyOhseongHaneumQuestionTopic(query);
  const temporalOhseongHaneumRhythm = buildOhseongHaneumTemporalRhythm(now);
  const seedString = `OHSEONG-HANEUM-FRIENDSHIP:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const lifelongMoralFriendshipTrustIndex = 83 + (absHash % 16);
  const crisisGovernanceStatesmanshipScore = 82 + ((absHash >> 3) % 17);
  const humorWitMagnanimityResilienceIndex = 81 + ((absHash >> 6) % 18);
  const antiFactionalImpartialityScore = 80 + ((absHash >> 9) % 19);
  const unyieldingFidelityGraceIndex = 84 + ((absHash >> 12) % 15);

  const topicOffset =
    questionTopic === 'relationship' ? 0 :
    questionTopic === 'decision' ? 1 :
    questionTopic === 'healing' ? 2 : 3;
  const themeIndex = ((absHash >> 5) + topicOffset) % OHSEONG_HANEUM_THEMES.length;
  const companionOffset = 1 + ((absHash >> 6) % (OHSEONG_HANEUM_THEMES.length - 1));
  const aphorismIndex = ((absHash >> 8) + topicOffset) % OHSEONG_HANEUM_APHORISMS.length;

  const activeOhseongHaneumTheme = OHSEONG_HANEUM_THEMES[themeIndex];
  const companionOhseongHaneumTheme = OHSEONG_HANEUM_THEMES[(themeIndex + companionOffset) % OHSEONG_HANEUM_THEMES.length];
  const focalOhseongHaneumAphorism = OHSEONG_HANEUM_APHORISMS[aphorismIndex];
  const friendshipPhase = OHSEONG_FRIENDSHIP_PHASES[(absHash >> 10) % OHSEONG_FRIENDSHIP_PHASES.length];
  const shadowWarning = OHSEONG_SHADOW_WARNINGS[(absHash >> 13) % OHSEONG_SHADOW_WARNINGS.length];

  const ritualByTopic: Record<OhseongHaneumQuestionTopic, string> = {
    relationship: '믿고 의지할 수 있는 벗이나 동료에게 짧은 안부를 전하고, 체면보다 솔직하고 유쾌한 마음 한 줄을 나누십시오.',
    decision: '편 가르기나 눈치 보기 대신, 지금 공동체와 나 모두에게 가장 실질적이고 공정한 해결책 하나를 선택하십시오.',
    healing: '스스로를 너무 무겁게 다그치지 말고, 백사 이항복처럼 고단한 순간에도 미소 지을 수 있는 작은 여유를 허용하십시오.',
    reflection: '주변의 찬반이나 이해득실이 잦아든 자리에서, 내가 끝까지 지키고 싶은 신의와 품격의 기준을 돌아보십시오.',
  };

  const questionByTopic: Record<OhseongHaneumQuestionTopic, string> = {
    relationship: '지금 내 곁에서 말없이도 마음이 통하는 진정한 동반자에게 나는 어떤 신의를 보여주고 있나요?',
    decision: '지금 고민하는 선택은 당장의 편의를 위한 것인가요, 아니면 나중에 돌아보아도 당당한 공심(公心)의 선택인가요?',
    healing: '지금 나를 짓누르는 무게를 웃음과 배포로 한 번 가볍게 털어낸다면 무엇이 가장 먼저 보일까요?',
    reflection: '어려운 형편 속에서도 내가 끝내 굽히지 않고 지켜 온 나만의 선비적 품격은 무엇인가요?',
  };

  const guidanceTitle = `오성과 한음 지혜: ${activeOhseongHaneumTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 중기 국난 극복의 두 명재상 백사 이항복과 한음 이덕형은 평생의 도의적 신의(知己之友), 위기 앞의 실전적 경세제민, 그리고 해학과 활달한 배포를 가르칩니다. ` +
    `현재 질문의 흐름(${temporalOhseongHaneumRhythm.phaseLabel})에서 가장 빛나는 핵심 덕목은 '${activeOhseongHaneumTheme.themeTitleKo}'(동반 덕목: ${companionOhseongHaneumTheme.themeTitleKo})입니다. ` +
    `${activeOhseongHaneumTheme.practicalCounsel} 오성과 한음의 교훈 "${focalOhseongHaneumAphorism.aphorismKo}"를 되새기며, ` +
    `${focalOhseongHaneumAphorism.actionGuidance}`;

  const baseTime = now ?? new Date();
  const calculatedAtKst = formatOhseongHaneumKstTimestamp(baseTime);
  const avgScore = Math.round(
    (lifelongMoralFriendshipTrustIndex +
      crisisGovernanceStatesmanshipScore +
      humorWitMagnanimityResilienceIndex +
      antiFactionalImpartialityScore +
      unyieldingFidelityGraceIndex) /
      5,
  );
  const ohseongHaneumSynthesisMatrix = {
    dominantTension: `${activeOhseongHaneumTheme.themeTitleKo} ↔ ${companionOhseongHaneumTheme.themeTitleKo} · ${temporalOhseongHaneumRhythm.phaseLabel}`,
    alignmentState: describeOhseongStage(
      avgScore,
      '지기지우의 신의와 위기 돌파 경륜·유쾌한 배포가 하나로 어우러진 원숙기',
      '공심과 품격을 잃지 않고 현실의 매듭을 풀어가는 안정기',
      '신뢰와 원칙의 기본기를 다지며 숨을 고르는 준비기',
    ),
    integratedAction: `${ritualByTopic[questionTopic]} (${friendshipPhase})${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${activeOhseongHaneumTheme.themeTitleKo.split(' — ')[0]}] ${ritualByTopic[questionTopic]} (${friendshipPhase})`;
  const reflectionFocus = `'${friendshipPhase}' 국면에서 ${questionByTopic[questionTopic]}`;

  return {
    engineVersion: KOREAN_OHSEONG_HANEUM_VERSION,
    calculatedAtKst,
    questionTopic,
    friendshipPhase,
    shadowWarning,
    temporalOhseongHaneumRhythm,
    lifelongMoralFriendshipTrustIndex,
    crisisGovernanceStatesmanshipScore,
    humorWitMagnanimityResilienceIndex,
    antiFactionalImpartialityScore,
    unyieldingFidelityGraceIndex,
    activeOhseongHaneumTheme,
    companionOhseongHaneumTheme,
    focalOhseongHaneumAphorism,
    dailyPracticeRitual: `${ritualByTopic[questionTopic]} (${friendshipPhase})`,
    reflectiveQuestion: `'${friendshipPhase}' 국면에서 ${questionByTopic[questionTopic]}`,
    interpretiveBoundary: '오성과 한음의 일화와 경륜은 인물의 우열을 점수화하지 않으며, 관계의 신의와 위기 대처의 품격을 비추는 인문적 성찰 틀로만 활용합니다.',
    ohseongHaneumComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    ohseongHaneumSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatKoreanOhseongHaneumFriendshipGovernancePrompt(
  res: KoreanOhseongHaneumFriendshipGovernanceResult,
): string {
  const lines = [
    `【오성과 한음(이항복·이덕형) 지기지우 & 경세제민 지혜 지표 (정성 성찰)】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 질문 맥락 및 시공간 리듬: [${res.questionTopic}] · ${res.temporalOhseongHaneumRhythm.kstSlot} (${res.temporalOhseongHaneumRhythm.phaseLabel})`,
    `- 지기·경세 국면: ${res.friendshipPhase}`,
    `- 시공간 지침: ${res.temporalOhseongHaneumRhythm.rhythmDirective}`,
    `- 지기지우 상호 신뢰와 우정: ${describeOhseongStage(res.lifelongMoralFriendshipTrustIndex, '말하지 않아도 뜻이 통하는 깊고 단단한 신뢰', '서로의 부족함을 감싸며 함께 걷는 온화한 신의', '진심 어린 대화로 신뢰의 다리를 놓아가는 시기')}`,
    `- 국난 극복 경세제민 경륜: ${describeOhseongStage(res.crisisGovernanceStatesmanshipScore, '명분보다 실질 해법을 세워 위기를 돌파하는 경륜', '상황을 냉철히 짚고 차분히 수습해 가는 안정감', '얽힌 실마리의 우선순위를 정돈하는 단계')}`,
    `- 해학·위트와 활달한 배포: ${describeOhseongStage(res.humorWitMagnanimityResilienceIndex, '엄중한 고비도 웃음으로 녹여내는 호탕한 여유', '긴장 속에서도 숨통을 틔우는 유연한 기지', '마음의 굳은 긴장을 조금씩 풀어내는 시기')}`,
    `- 당쟁 초월 공명정대 공심: ${describeOhseongStage(res.antiFactionalImpartialityScore, '사사로운 이해를 넘어 원칙으로 중심을 잡는 공정성', '편향에 흔들리지 않고 균형을 지키는 태도', '감정적 편 가르기를 경계하며 시야를 넓히는 시기')}`,
    `- 불굴의 의리와 선비 품격: ${describeOhseongStage(res.unyieldingFidelityGraceIndex, '어려운 자리에서도 꺾이지 않는 의연한 기품', '스스로의 도리와 원칙을 묵묵히 지키는 절조', '흔들리는 마음을 원칙 위로 다시 세우는 시기')}`,
    `- 핵심 오성과 한음 테마: ${res.activeOhseongHaneumTheme.themeTitleKo} [${res.activeOhseongHaneumTheme.themeTitleEn}]`,
    `- 동반 오성과 한음 테마: ${res.companionOhseongHaneumTheme.themeTitleKo}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 실용주의적 통찰: ${res.activeOhseongHaneumTheme.pragmaticInsight}`,
    `- 실천적 조언: ${res.activeOhseongHaneumTheme.practicalCounsel}`,
    `- 오성과 한음 원전 명언: "${res.focalOhseongHaneumAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalOhseongHaneumAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalOhseongHaneumAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalOhseongHaneumAphorism.actionGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 핵심 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 오성과 한음 경세 권면: ${res.ohseongHaneumComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.ohseongHaneumSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.ohseongHaneumSynthesisMatrix.dominantTension} | 조율 상태: ${res.ohseongHaneumSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.ohseongHaneumSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
