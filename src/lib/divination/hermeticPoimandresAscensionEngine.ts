/**
 * 고대 헤르메스주의 포이만드레스 7대 천계 탈각 & 옥도아드 누스 각성 엔진 (v2.0.0)
 * (hermeticPoimandresAscensionEngine.ts)
 *
 * 《코르푸스 헤르메티쿰(Corpus Hermeticum)》 제1서 《포이만드레스(Poimandres)》 기반:
 * 질문 맥락 정념 감사, KST 누스 각성 시공간 리듬, 옥도아드 상승 매트릭스를
 * 백분율/점수 노출 없이 정성적으로 제공합니다.
 */

import type { UserProfile } from '../sharedState';

export const HERMETIC_POIMANDRES_ENGINE_VERSION = '2.3.0';

export type PoimandresQuestionFocus = 'career' | 'relationship' | 'anxiety' | 'decision' | 'spiritual';

export interface HermeticPlanetarySphere {
  id: string;
  nameKo: string;
  greek: string;
  planetaryRuler: string;
  purifiedPassion: string;
  virtueIllumination: string;
  resonanceScore: number; // 0 ~ 100 내부 계산용
}

export interface SituationalPoimandresAudit {
  focus: PoimandresQuestionFocus;
  corpusHermeticumVerse: string;
  passionSheddingDiagnosis: string;
  illusionTrapWarning: string;
  nousAwakeningPractice: string;
}

export interface TemporalOgdoadRhythm {
  kstHour: number;
  ascensionWindow: string;
  seasonalLightPhase: string;
  nousClarityState: string;
  timingAdvice: string;
}

export interface PoimandresSynthesisMatrix {
  nousResonanceLabel: string;
  purificationProgressLabel: string;
  ogdoadReadinessLabel: string;
  synthesizedVerdict: string;
}

export interface HermeticPoimandresAscensionReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  questionFocus: PoimandresQuestionFocus;
  nousDivineIntellectResonanceScore: number;
  planetaryPassionsPurificationRate: number;
  ogdoadAscensionReadinessIndex: number;
  theosisDivineUnityScore: number;
  dominantSphere: HermeticPlanetarySphere;
  secondarySphere: HermeticPlanetarySphere;
  situationalPoimandresAudit: SituationalPoimandresAudit;
  temporalOgdoadRhythm: TemporalOgdoadRhythm;
  poimandresSynthesisMatrix: PoimandresSynthesisMatrix;
  poimandresHermeticGuidance: string;
  nousLightAscensionRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const HERMETIC_SPHERES_BASE: Omit<HermeticPlanetarySphere, 'resonanceScore'>[] = [
  {
    id: 'ogdoad',
    nameKo: '제8천 옥도아드 (신성 합일의 천계)',
    greek: 'Ogdoas (Ὀγδοάς)',
    planetaryRuler: '우주의 최고신 (Supreme Nous)',
    purifiedPassion: '시간과 공간, 물질의 모든 제약과 분리감의 종식',
    virtueIllumination: '우주의 거룩한 권능들과 함께 창조주를 찬양하며 영원한 신성에 합일되는 영광',
  },
  {
    id: 'sun',
    nameKo: '제4천 태양 (진정한 빛과 겸허)',
    greek: 'Helios (Ἥλιος)',
    planetaryRuler: '태양의 구체',
    purifiedPassion: '오만과 지배욕, 타인 위에 군림하려는 헛된 에고의 권력욕',
    virtueIllumination: '태양이 만물을 차별 없이 비추듯 조건 없이 베푸는 고귀한 위엄과 따스한 자애',
  },
  {
    id: 'jupiter',
    nameKo: '제6천 목성 (정의로운 풍요와 관용)',
    greek: 'Zeus (Ζεύς)',
    planetaryRuler: '목성의 구체',
    purifiedPassion: '불의한 축재와 탐욕, 끝없는 물질적 갈증과 허세',
    virtueIllumination: '세상 모든 풍요가 신의 선물임을 알고 나눔으로써 더 커지는 신성한 지혜와 너그러움',
  },
  {
    id: 'venus',
    nameKo: '제3천 금성 (신성한 아름다움과 조화)',
    greek: 'Aphrodite (Ἀφροδίτη)',
    planetaryRuler: '금성의 구체',
    purifiedPassion: '감각적 탐닉과 유혹, 왜곡된 소유욕과 집착적인 애착',
    virtueIllumination: '외형의 찰나적 껍질을 넘어 만물 속에 깃든 영원한 조화와 순수한 영혼의 미를 관조함',
  },
  {
    id: 'mercury',
    nameKo: '제2천 수성 (순수한 로고스와 명철)',
    greek: 'Hermes (Ἑρμῆς)',
    planetaryRuler: '수성의 구체',
    purifiedPassion: '교묘한 책략과 궤변, 남을 속이고 이득을 취하려는 약삭빠름',
    virtueIllumination: '진리의 말씀을 전하는 순결한 언어와 오해를 녹이는 맑고 투명한 지적 통찰력',
  },
  {
    id: 'moon',
    nameKo: '제1천 달 (초연한 평정심과 안정)',
    greek: 'Selene (Σελήνη)',
    planetaryRuler: '달의 구체',
    purifiedPassion: '차오르고 기우는 데 휘둘리는 불안감, 변덕스러운 감정의 노예 상태',
    virtueIllumination: '세상의 변화무쌍한 부침 속에서도 바다 밑바닥처럼 흔들리지 않는 깊은 내적 평화',
  },
  {
    id: 'mars',
    nameKo: '제5천 화성 (용기 있는 영적 수호)',
    greek: 'Ares (Ἄρης)',
    planetaryRuler: '화성의 구체',
    purifiedPassion: '맹목적인 분노와 충동, 무모하게 상대를 찌르는 가시 돋친 폭력성',
    virtueIllumination: '불의에 타협하지 않고 진리와 약자를 지키는 숭고하고 단단한 영적 담력',
  },
  {
    id: 'saturn',
    nameKo: '제7천 토성 (인내와 불멸의 초석)',
    greek: 'Kronos (Κρόνος)',
    planetaryRuler: '토성의 구체',
    purifiedPassion: '음습한 냉소와 의심, 고립감과 파괴적인 악의',
    virtueIllumination: '고난과 한계를 영혼의 거룩한 초석으로 승화시키는 깊은 침묵과 불멸의 인내',
  },
];

function detectPoimandresFocus(question: string): PoimandresQuestionFocus {
  const q = question.toLowerCase();
  if (/일|직장|사업|돈|재물|성공|시험|승진/.test(q)) return 'career';
  if (/사람|관계|연애|가족|친구|갈등|상처/.test(q)) return 'relationship';
  if (/불안|걱정|두려|초조|스트레스|우울|힘들/.test(q)) return 'anxiety';
  if (/선택|결정|방향|고민|시작|변화/.test(q)) return 'decision';
  return 'spiritual';
}

function buildSituationalPoimandresAudit(
  focus: PoimandresQuestionFocus,
  sphere: HermeticPlanetarySphere
): SituationalPoimandresAudit {
  switch (focus) {
    case 'career':
      return {
        focus,
        corpusHermeticumVerse: '《코르푸스 헤르메티쿰》 I.25 — "네가 물질의 구체에서 빌려 입었던 욕망과 허영의 껍질을 내려놓을 때 비로소 참된 권능이 열린다."',
        passionSheddingDiagnosis: `일과 성취의 문제는 [${sphere.nameKo}]에서 벗어야 할 [${sphere.purifiedPassion}]을 비울 때 오히려 단단해집니다.`,
        illusionTrapWarning: '타인의 인정이나 외적 지위를 내 본질과 동일시하면 영혼이 구체에 묶입니다.',
        nousAwakeningPractice: '오늘 맡은 일에서 과시나 조급함을 한 꺼풀 걷어내고, 오직 정직한 본질만 남기는 선택을 하세요.',
      };
    case 'relationship':
      return {
        focus,
        corpusHermeticumVerse: '《코르푸스 헤르메티쿰》 I.18 — "어둠의 애착에서 깨어나 서로의 안에 깃든 빛과 생명을 바라보라."',
        passionSheddingDiagnosis: `관계의 갈등은 [${sphere.nameKo}]의 [${sphere.purifiedPassion}]이 올라온 신호이며, [${sphere.virtueIllumination}]으로 건너갈 기회입니다.`,
        illusionTrapWarning: '상대를 내 뜻대로 움직이려는 집착은 달과 금성의 구체를 맴도는 그림자입니다.',
        nousAwakeningPractice: '상대의 말에 반박하기 전에 "지금 내 안에서 어떤 두려움이 반응하고 있는가"를 한 번만 먼저 물으세요.',
      };
    case 'anxiety':
      return {
        focus,
        corpusHermeticumVerse: '《코르푸스 헤르메티쿰》 I.27 — "잠에서 깨어나라, 무지와 어둠에 취한 자여. 진리의 빛이 이미 네 곁에 있느니라."',
        passionSheddingDiagnosis: `지금의 불안은 영혼이 일시적인 물질의 그림자에 취해 있을 뿐입니다. [${sphere.virtueIllumination}]의 기억을 되살릴 때입니다.`,
        illusionTrapWarning: '변덕스러운 외부 상황을 영구적인 위협으로 착각하면 달(제1천)의 요동에 휘말립니다.',
        nousAwakeningPractice: '눈을 감고 숨을 고르며 "변하는 것은 껍질이고, 내 안의 고요한 지성(Nous)은 흔들리지 않는다"고 되뇌세요.',
      };
    case 'decision':
      return {
        focus,
        corpusHermeticumVerse: '《코르푸스 헤르메티쿰》 I.6 — "너의 마음속 빛을 직시하라. 그 빛이 곧 만물을 가르는 로고스이니라."',
        passionSheddingDiagnosis: `결정의 망설임은 7대 행성 구체의 잡음이 섞였기 때문입니다. [${sphere.purifiedPassion}]을 덜어낸 자리에 명료한 답이 남습니다.`,
        illusionTrapWarning: '이익과 손해의 잔꾀(수성)만 따지다 보면 영혼이 진짜 원하는 방향을 놓칩니다.',
        nousAwakeningPractice: '선택지 앞에서 두려움과 허세를 지웠을 때 끝까지 남는 가장 담백한 한 길을 고르세요.',
      };
    case 'spiritual':
    default:
      return {
        focus: 'spiritual',
        corpusHermeticumVerse: '《코르푸스 헤르메티쿰》 I.26 — "일곱 구체의 옷을 모두 벗은 영혼은 이제 여덟 번째 본성(옥도아드)으로 들어가 빛을 노래한다."',
        passionSheddingDiagnosis: `[${sphere.nameKo}]의 정화를 통과하며 [${sphere.virtueIllumination}]을 회복하는 숭고한 상승 과정에 있습니다.`,
        illusionTrapWarning: '영적 성장을 세속의 우월감으로 바꾸는 순간 다시 태양(제4천)의 오만으로 내려옵니다.',
        nousAwakeningPractice: '하루 3분 침묵 속에서 내 안의 작은 에고가 맑은 빛 앞에 조용히 고개 숙이는 관조를 이어가세요.',
      };
  }
}

function buildTemporalOgdoadRhythm(now: Date): TemporalOgdoadRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  let ascensionWindow = '심야 옥도아드 침묵 시간 (22:00~05:59)';
  let nousClarityState = '세속의 소음이 잠들고 누스(Nous)의 내적 빛이 가장 또렷해지는 시간';
  let timingAdvice = '감각적 자극을 줄이고 내면의 정념을 조용히 내려놓기 좋습니다.';

  if (kstHour >= 6 && kstHour < 12) {
    ascensionWindow = '여명·오전 로고스 각성 시간 (06:00~11:59)';
    nousClarityState = '맑은 이성과 말씀(Logos)이 하루의 질서를 세우는 시간';
    timingAdvice = '핵심 기준을 세우고 명료한 판단이 필요한 일을 처리하세요.';
  } else if (kstHour >= 12 && kstHour < 18) {
    ascensionWindow = '정오·오후 구체 연단 시간 (12:00~17:59)';
    nousClarityState = '현실 세계 속에서 분노·탐욕·오만을 직접 비추어 정화하는 시험의 시간';
    timingAdvice = '일과 관계에서 올라오는 즉각적 감정을 한 박자 늦춰 다스리세요.';
  } else if (kstHour >= 18 && kstHour < 22) {
    ascensionWindow = '황혼 탈각(Purification) 시간 (18:00~21:59)';
    nousClarityState = '하루 동안 묻은 세속의 껍질을 벗고 평정심으로 돌아가는 시간';
    timingAdvice = '하루의 집착을 씻어내고 가벼운 마음으로 저녁을 마무리하세요.';
  }

  let seasonalLightPhase = '겨울 침잠 — 내면의 불꽃(Nous)을 깊이 품고 인내를 닦는 계절';
  if (kstMonth >= 3 && kstMonth <= 5) {
    seasonalLightPhase = '봄 각성 — 잠에서 깨어나 새로운 빛을 향해 상승을 시작하는 계절';
  } else if (kstMonth >= 6 && kstMonth <= 8) {
    seasonalLightPhase = '여름 정오 — 열정과 에고의 오만을 겸허로 정제하는 계절';
  } else if (kstMonth >= 9 && kstMonth <= 11) {
    seasonalLightPhase = '가을 증류 — 헛된 껍질을 털어내고 본질만 남기는 계절';
  }

  return {
    kstHour,
    ascensionWindow,
    seasonalLightPhase,
    nousClarityState,
    timingAdvice,
  };
}

export interface HermeticPoimandresOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateHermeticPoimandres(
  optionsOrProfile?: HermeticPoimandresOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): HermeticPoimandresAscensionReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as HermeticPoimandresOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 91873;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 43) % 1000003;

  const spheres: HermeticPlanetarySphere[] = HERMETIC_SPHERES_BASE.map((sph, idx) => {
    const score = 46 + ((seed * (idx + 5) + idx * 29) % 53);
    return { ...sph, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  spheres.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantSphere = spheres[0];
  const secondarySphere = spheres[1];

  const nousDivineIntellectResonanceScore = Math.min(100, Math.max(45, 53 + ((seed * 29) % 45)));
  const planetaryPassionsPurificationRate = Math.min(100, Math.max(42, 51 + ((seed * 23) % 47)));
  const ogdoadAscensionReadinessIndex = Math.min(100, Math.max(44, 52 + ((seed * 19) % 46)));
  const theosisDivineUnityScore = Math.min(100, Math.max(46, Math.floor(nousDivineIntellectResonanceScore * 0.5 + ogdoadAscensionReadinessIndex * 0.5)));

  const questionFocus = detectPoimandresFocus(question);
  const situationalPoimandresAudit = buildSituationalPoimandresAudit(questionFocus, dominantSphere);
  const temporalOgdoadRhythm = buildTemporalOgdoadRhythm(now);

  const poimandresSynthesisMatrix: PoimandresSynthesisMatrix = {
    nousResonanceLabel:
      nousDivineIntellectResonanceScore >= 78
        ? '누스(신성 지성)의 직관적 통찰이 선명하게 깨어 있는 상태'
        : '세속 정념의 안개를 걷고 내적 지성을 다시 깨워야 하는 상태',
    purificationProgressLabel: `[${dominantSphere.nameKo}] 중심 탈각 및 [${secondarySphere.nameKo}] 보조 정화 진행 중`,
    ogdoadReadinessLabel:
      ogdoadAscensionReadinessIndex >= 76
        ? '제8천 옥도아드의 평온과 조화에 가까워진 상승 흐름'
        : '작은 집착부터 하나씩 내려놓으며 기초 정화를 다질 흐름',
    synthesizedVerdict: `${dominantSphere.nameKo}의 [${dominantSphere.purifiedPassion}]을 비우고 ${temporalOgdoadRhythm.ascensionWindow}에 맞춰 고요히 정렬하세요.`,
  };

  const poimandresHermeticGuidance = `포이만드레스는 말합니다: "잠에서 깨어나라, 진리의 빛을 보고 너 자신이 불멸의 영혼임을 기억하라." 현재 정화의 중심축은 [${dominantSphere.nameKo}]입니다. ${dominantSphere.purifiedPassion}을 던져버리고, ${dominantSphere.virtueIllumination}의 옷을 입으십시오. 7대 천계의 껍질을 벗을 때 옥도아드의 찬란한 영광이 열립니다.`;
  const nousLightAscensionRitual = `머리 위에서 찬란하게 빛나는 신성한 불꽃을 상상하며 심호흡하십시오: "거룩하신 누스여, 거짓된 유혹의 굴레를 벗고 순수한 영적 지성의 빛으로 충만하노니, 내 영혼이 만유의 거룩한 생명과 합일된다."`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19).replace('T', ' ')} +09:00 KST`;

  return {
    engineVersion: HERMETIC_POIMANDRES_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    questionFocus,
    nousDivineIntellectResonanceScore,
    planetaryPassionsPurificationRate,
    ogdoadAscensionReadinessIndex,
    theosisDivineUnityScore,
    dominantSphere,
    secondarySphere,
    situationalPoimandresAudit,
    temporalOgdoadRhythm,
    poimandresSynthesisMatrix,
    poimandresHermeticGuidance,
    nousLightAscensionRitual,
    reflectiveQuestion: question.trim()
      ? `"${question.trim()}"의 고민에서 [${dominantSphere.nameKo}]의 껍질(${dominantSphere.purifiedPassion})을 한 꺼풀 벗고 나면 끝까지 남는 순수한 본질은 무엇입니까?`
      : `[${dominantSphere.nameKo}]의 정화 문턱에서 오늘 내 안의 누스(Nous)가 조용히 내려놓고 싶어 하는 집착은 무엇입니까?`,
    interpretiveBoundary: '본 리포트는 《코르푸스 헤르메티쿰》 포이만드레스 상징에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.',
  };
}

export function formatHermeticPoimandresPrompt(rep: HermeticPoimandresAscensionReport): string {
  return `[고대 헤르메스주의 포이만드레스 7대 천계 탈각 & 옥도아드 각성 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 연산 시각: ${rep.calculatedAtKst}
· 누스·옥도아드 정성 상태: ${rep.poimandresSynthesisMatrix.nousResonanceLabel} (${rep.poimandresSynthesisMatrix.ogdoadReadinessLabel})
· 주재 정화 천계: [${rep.dominantSphere.nameKo} (${rep.dominantSphere.greek})]
  - 주재자: ${rep.dominantSphere.planetaryRuler}
  - 탈각되는 세속 정념: ${rep.dominantSphere.purifiedPassion}
  - 회복되는 신성 덕목: ${rep.dominantSphere.virtueIllumination}
· 보조 천계: [${rep.secondarySphere.nameKo} (${rep.secondarySphere.greek})]
· 질문 맥락 포이만드레스 감사 (${rep.situationalPoimandresAudit.focus}):
  - 원전 구절: ${rep.situationalPoimandresAudit.corpusHermeticumVerse}
  - 정념 탈각 진단: ${rep.situationalPoimandresAudit.passionSheddingDiagnosis}
  - 환영 주의: ${rep.situationalPoimandresAudit.illusionTrapWarning}
  - 누스 각성 실천: ${rep.situationalPoimandresAudit.nousAwakeningPractice}
· KST 옥도아드 시공간 리듬 (${rep.temporalOgdoadRhythm.ascensionWindow}):
  - 누스 명료도: ${rep.temporalOgdoadRhythm.nousClarityState}
  - 계절 빛 리듬: ${rep.temporalOgdoadRhythm.seasonalLightPhase}
  - 시의성 지침: ${rep.temporalOgdoadRhythm.timingAdvice}
· 포이만드레스 교차 종합: ${rep.poimandresSynthesisMatrix.synthesizedVerdict}
· 포이만드레스 신성 지혜 지침: ${rep.poimandresHermeticGuidance}
· 누스 빛의 상승 리추얼: ${rep.nousLightAscensionRitual}
· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: 본 리포트는 《코르푸스 헤르메티쿰》 포이만드레스 상징에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.`;
}
