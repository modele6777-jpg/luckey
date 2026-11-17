/**
 * 불교 유식학(唯識學 - Yogacara) 8식 정화 & 아뢰야식 전식득지(轉識得智) 엔진 (buddhistYogacaraEightConsciousnessEngine.ts)
 *
 * 인도 대승불교 유가행파(瑜伽行派) 미륵·무착·세친의 《유식삼십송(唯識三十頌)》 및 현장의 《성유식론(成唯識論)》 원전 기반:
 * 삼계유심 만법유식(三界唯心 萬法唯識)의 심층 심리학 체계.
 * 감각을 인지하는 전5식(안·이·비·설·신), 사유와 분별을 주관하는 제6 의식(意識),
 * 끊임없이 '나'를 움켜쥐는 제7 말나식(末那識 - 자아의식/아집),
 * 그리고 과거의 모든 카르마와 경험이 잠재 종자(Bija)로 축적되는 근본 창고인 제8 아뢰야식(阿賴耶識).
 *
 * 4대 근본번뇌(아치·아견·아만·아애)를 정화하여
 * 8가지 분별 망식을 부처의 4대 지혜로 근본 혁신하는 '전식득지(轉識得智)'의 지혜를 산출함.
 */

import type { UserProfile } from '../sharedState';

export const BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION = '2.4.0';

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}

export type YogacaraQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface YogacaraTransformedWisdom {
  id: string;
  nameKo: string;
  sanskrit: string;
  rootConsciousness: string;
  wisdomPrinciple: string;
  enlightenedAction: string;
  resonanceScore: number;
}

export interface YogacaraSituationalAudit {
  topic: YogacaraQuestionTopic;
  scriptureRef: string;
  kleshaRootPattern: string;
  bijaTransformation: string;
  mindOnlyPractice: string;
}

export interface YogacaraTemporalRhythm {
  kstWindowLabel: string;
  seasonTone: string;
  satiTransformationFocus: string;
  contemplativeCue: string;
}

export interface YogacaraSynthesisMatrix {
  alayaMirrorClarity: string;
  manasEgoRelease: string;
  actionCompletionReadiness: string;
  integrativeSummary: string;
}

export interface BuddhistYogacaraConsciousnessReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  alayaPurificationScore: number;
  manasEgoTranscendenceRate: number;
  fourWisdomsHarmonizationIndex: number;
  kleshaDefilementPurificationScore: number;
  questionTopic: YogacaraQuestionTopic;
  dominantWisdom: YogacaraTransformedWisdom;
  secondaryWisdom: YogacaraTransformedWisdom;
  yogacaraMindOnlyGuidance: string;
  mirrorMeditationRitual: string;
  situationalYogacaraAudit: YogacaraSituationalAudit;
  temporalAlayaRhythm: YogacaraTemporalRhythm;
  yogacaraSynthesisMatrix: YogacaraSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

const YOGACARA_WISDOMS_BASE: Omit<YogacaraTransformedWisdom, 'resonanceScore'>[] = [
  {
    id: 'great_round_mirror_wisdom',
    nameKo: '대원경지',
    sanskrit: 'Adarsa-jnana',
    rootConsciousness: '제8 아뢰야식(阿賴耶識)의 근본 전환',
    wisdomPrinciple: '마음의 먼지가 씻겨나가 거대한 거울처럼 우주 만물을 왜곡 없이 비추는 순수 청정심',
    enlightenedAction: '과거 기억의 후회나 미래 불안에 물들지 않고 눈앞의 현실을 투명하게 직관함',
  },
  {
    id: 'equality_nature_wisdom',
    nameKo: '평등성지',
    sanskrit: 'Samata-jnana',
    rootConsciousness: '제7 말나식(末那識)의 아집 소멸',
    wisdomPrinciple: '나만의 우월감이나 열등감을 허물고 모든 인연을 동등하고 존귀하게 바라보는 대자비',
    enlightenedAction: '자기 방어적인 고집을 내려놓고 상대방의 입장을 온전히 내 아픔처럼 공감함',
  },
  {
    id: 'sublime_contemplation_wisdom',
    nameKo: '묘관찰지',
    sanskrit: 'Pratyaveksana-jnana',
    rootConsciousness: '제6 의식(意識)의 분별 망상 타파',
    wisdomPrinciple: '선입견과 복잡한 계산 없이 사물의 이치와 본질을 한눈에 간파하는 날카로운 통찰력',
    enlightenedAction: '복잡하게 꼬인 난제 속에서 핵심 인과관계를 단번에 짚어내어 명쾌한 해답을 냄',
  },
  {
    id: 'perfect_action_wisdom',
    nameKo: '성소작지',
    sanskrit: 'Krtyanusthana-jnana',
    rootConsciousness: '전5식(안·이·비·설·신)의 감각 정화',
    wisdomPrinciple: '보고 듣고 말하고 행동하는 일상의 모든 감각과 손길이 자연스러운 선업(善業)으로 완성됨',
    enlightenedAction: '게으름과 망설임을 떨쳐내고 머리로 배운 지혜를 현실의 구체적 성과와 행동으로 구현함',
  },
];

export interface BuddhistYogacaraConsciousnessOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

function classifyYogacaraTopic(question: string): YogacaraQuestionTopic {
  if (/연애|사랑|관계|이별|갈등|상대|사람|친구|가족|부부|직장동료/.test(question)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|투자|계약|시험|진로|방향|옮길|할까|말까/.test(question)) {
    return 'decision';
  }
  if (/치유|회복|불안|지침|슬픔|분노|상처|우울|번아웃|스트레스|두려움|집착|후회/.test(question)) {
    return 'healing';
  }
  return 'reflection';
}

function buildYogacaraSituationalAudit(topic: YogacaraQuestionTopic): YogacaraSituationalAudit {
  switch (topic) {
    case 'relationship':
      return {
        topic,
        scriptureRef: '《유식삼십송》 제5~7송 (말나식의 아견·아만·아애·아치 전환)',
        kleshaRootPattern: '제7 말나식이 "내가 옳다"거나 "내가 다칠지 모른다"며 세우는 방어적 아집과 분별',
        bijaTransformation: '나와 너를 가르는 아집의 종자를 평등성지(平等性智)의 공감으로 전환합니다.',
        mindOnlyPractice: '상대의 말 뒤에 숨은 두려움을 먼저 알아보고 내 쪽의 자존심 고집을 한 겹 내려놓습니다.',
      };
    case 'decision':
      return {
        topic,
        scriptureRef: '《성유식론》 제6 의식 분별 타파와 묘관찰지(妙觀察智)',
        kleshaRootPattern: '제6 의식이 과거 실패 기억과 미래 가정을 엮어 만들어 내는 과잉 망상',
        bijaTransformation: '주관적 편견과 두려움을 걷어내고 인과의 핵심만 짚는 묘관찰지로 전환합니다.',
        mindOnlyPractice: '머릿속 시나리오를 멈추고 지금 눈앞의 사실·자원·실행 가능성 세 가지만 또렷이 적습니다.',
      };
    case 'healing':
      return {
        topic,
        scriptureRef: '《유식삼십송》 제2~4송 (아뢰야식 잠재 종자의 훈습 정화)',
        kleshaRootPattern: '아뢰야식에 묵은 상처와 후회의 종자(Bija)가 현재 상황 위에서 되살아나는 투사',
        bijaTransformation: '묵은 기억을 억누르지 않고 대원경지(大圓鏡智)의 맑은 거울 위에 있는 그대로 비춰 보냅니다.',
        mindOnlyPractice: '거울은 그림자가 스쳐 가도 흠집이 나지 않듯, 올라오는 감정을 내 실체로 붙잡지 않고 흘려보냅니다.',
      };
    default:
      return {
        topic,
        scriptureRef: '《유식삼십송》 제29~30송 (무분별지 증득과 원성실성)',
        kleshaRootPattern: '전5식과 제6 의식이 바깥 현상을 좇느라 마음의 근원 자리를 잊는 산란함',
        bijaTransformation: '보고 듣는 일상 감각을 선업의 실천으로 완성하는 성소작지(成所作智)로 전환합니다.',
        mindOnlyPractice: '지금 당장 손에 닿는 작은 일 하나를 온전한 알아차림과 정성으로 매듭짓습니다.',
      };
  }
}

function buildYogacaraTemporalRhythm(now: Date): YogacaraTemporalRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  let kstWindowLabel = '새벽 아뢰야식 청정 시간대 (대원경지)';
  let satiTransformationFocus = '잠재된 종자가 가장 고요히 가라앉아 마음의 거울을 맑게 닦기 좋은 흐름';
  let contemplativeCue = '일어나자마자 과거의 걱정이나 오늘의 분주함을 붙잡기 전에 깊은 호흡 세 번으로 마음을 비우십시오.';

  if (hour >= 7 && hour < 12) {
    kstWindowLabel = '오전 의식 분별 정화 시간대 (묘관찰지)';
    satiTransformationFocus = '제6 의식의 명료함이 살아나 복잡한 일의 인과와 핵심을 짚어 내기 좋은 흐름';
    contemplativeCue = '사소한 변수에 흔들리지 말고 오늘 일의 가장 본질적인 인과 한 가지를 먼저 세우십시오.';
  } else if (hour >= 12 && hour < 18) {
    kstWindowLabel = '오후 감각·실천 전환 시간대 (성소작지)';
    satiTransformationFocus = '전5식의 감각과 손발의 움직임이 구체적인 선업과 결실로 이어지는 흐름';
    contemplativeCue = '머리로만 맴도는 생각을 작은 실행 하나로 옮겨 현실의 매듭을 풀어 가십시오.';
  } else if (hour >= 18 && hour < 23) {
    kstWindowLabel = '밤 말나식 아집 해체 시간대 (평등성지)';
    satiTransformationFocus = '낮 동안 세웠던 자존심과 방어의 갑옷을 벗고 너그러운 시선으로 돌아가는 흐름';
    contemplativeCue = '하루를 덮으며 나 자신과 타인에게 날 세웠던 마음을 부드럽게 놓아 보내십시오.';
  }

  let seasonTone = '가을의 침잠 — 흩어진 분별을 거두어 마음의 맑은 종자만 남기는 관조의 계절';
  if (month >= 3 && month <= 5) {
    seasonTone = '봄의 훈습 — 맑은 알아차림의 새 종자를 일상에 심어 키우는 계절';
  } else if (month >= 6 && month <= 8) {
    seasonTone = '여름의 정진 — 뜨거운 감정의 파동 속에서도 거울 같은 평정을 지키는 계절';
  } else if (month === 12 || month <= 2) {
    seasonTone = '겨울의 수렴 — 바깥 투사를 멈추고 깊은 내면의 아뢰야식을 정화하는 계절';
  }

  return {
    kstWindowLabel,
    seasonTone,
    satiTransformationFocus,
    contemplativeCue,
  };
}

function buildYogacaraSynthesisMatrix(
  dominant: YogacaraTransformedWisdom,
  topic: YogacaraQuestionTopic,
  temporal: YogacaraTemporalRhythm
): YogacaraSynthesisMatrix {
  const alayaMirrorClarity = dominant.id === 'great_round_mirror_wisdom' || topic === 'healing'
    ? '맑음 회복 — 과거의 기억이 현재를 덮지 않도록 한 걸음 떨어져 바라보는 거울 시선이 필요합니다.'
    : '안정 — 감정적 잔상을 크게 부풀리지 않고 사실을 차분히 비추어 볼 수 있습니다.';
  const manasEgoRelease = dominant.id === 'equality_nature_wisdom' || topic === 'relationship'
    ? '핵심 과제 — "내가 옳다"는 방어적 집착을 내려놓을수록 관계의 막힘이 풀립니다.'
    : '원활 — 자기중심적 고집보다 전체의 균형을 살필 여력이 열려 있습니다.';
  const actionCompletionReadiness = dominant.id === 'perfect_action_wisdom' || topic === 'decision'
    ? '실행 전환 — 생각을 행동으로 옮기는 작은 성소작지가 고민을 가장 빠르게 정리합니다.'
    : '차분함 — 서두르기보다 알아차림을 동반한 꾸준한 실천이 알맞습니다.';

  return {
    alayaMirrorClarity,
    manasEgoRelease,
    actionCompletionReadiness,
    integrativeSummary: `${temporal.kstWindowLabel}의 기운과 함께 ${dominant.nameKo}(${dominant.sanskrit})를 중심에 두면 분별 망상이 지혜로운 실천으로 전환됩니다.`,
  };
}

export function calculateBuddhistYogacaraConsciousness(
  optionsOrProfile?: BuddhistYogacaraConsciousnessOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): BuddhistYogacaraConsciousnessReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as BuddhistYogacaraConsciousnessOptions;
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

  let seed = 91823;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 43) % 1000003;

  const wisdoms: YogacaraTransformedWisdom[] = YOGACARA_WISDOMS_BASE.map((w, idx) => {
    const score = 48 + ((seed * (idx + 4) + idx * 29) % 51);
    return { ...w, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  wisdoms.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantWisdom = wisdoms[0];
  const secondaryWisdom = wisdoms[1];

  const alayaPurificationScore = Math.min(100, Math.max(44, 52 + ((seed * 19) % 45)));
  const manasEgoTranscendenceRate = Math.min(100, Math.max(42, 50 + ((seed * 23) % 47)));
  const kleshaDefilementPurificationScore = Math.min(100, Math.max(45, 54 + ((seed * 29) % 44)));
  const fourWisdomsHarmonizationIndex = Math.min(100, Math.max(48, Math.floor((alayaPurificationScore * 0.4 + manasEgoTranscendenceRate * 0.3 + kleshaDefilementPurificationScore * 0.3))));

  const questionTopic = classifyYogacaraTopic(question);
  const situationalYogacaraAudit = buildYogacaraSituationalAudit(questionTopic);
  const temporalAlayaRhythm = buildYogacaraTemporalRhythm(now);
  const yogacaraSynthesisMatrix = buildYogacaraSynthesisMatrix(dominantWisdom, questionTopic, temporalAlayaRhythm);
  const boundaryNotice = '이 풀이는 유식학의 전식득지 상징을 빌려 마음의 분별과 집착을 돌아보는 정성적 성찰이며, 우열의 점수나 확정적 예언이 아닙니다.';

  const yogacaraMindOnlyGuidance = `세상의 모든 고통과 번뇌는 바깥 대상에 있는 것이 아니라 내 마음식(識)의 분별 투사에서 비롯됩니다. 지금 당신에게 개화하는 지혜는 [${dominantWisdom.nameKo}(${dominantWisdom.sanskrit})]입니다. ${dominantWisdom.enlightenedAction}에 집중할 때 망상이 걷히고 성취의 길이 맑아집니다.`;
  const mirrorMeditationRitual = `조용히 호흡을 고르고 가슴 중심에 티끌 없는 거울이 떠오르는 모습을 관상하십시오: "삼계유심 만법유식(三界唯心 萬法唯識), 오고 가는 모든 현상은 거울에 비친 그림자일 뿐 나를 물들이지 못한다."`;

  const reflectiveQuestion = question.trim()
    ? `질문 "${question.trim()}" 앞에서, ${situationalYogacaraAudit.kleshaRootPattern}이 일으키는 분별을 알아차리고 [${dominantWisdom.nameKo}]의 거울로 비춰 보면 무엇이 가장 먼저 가벼워지나요?`
    : `${situationalYogacaraAudit.kleshaRootPattern} 앞에서 내가 붙들고 있는 분별은 무엇이며, ${dominantWisdom.nameKo}의 관점으로 어떻게 놓아줄 수 있나요?`;

  return {
    engineVersion: BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst: toKstIso(now),
    alayaPurificationScore,
    manasEgoTranscendenceRate,
    fourWisdomsHarmonizationIndex,
    kleshaDefilementPurificationScore,
    questionTopic,
    dominantWisdom,
    secondaryWisdom,
    yogacaraMindOnlyGuidance,
    mirrorMeditationRitual,
    situationalYogacaraAudit,
    temporalAlayaRhythm,
    yogacaraSynthesisMatrix,
    ritualAction: mirrorMeditationRitual,
    reflectionFocus: reflectiveQuestion,
    reflectiveQuestion,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
  };
}

export function formatBuddhistYogacaraConsciousnessPrompt(rep: BuddhistYogacaraConsciousnessReport): string {
  return `[불교 유식학 8식 정화 & 아뢰야식 전식득지(轉識得智) 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 연산 시각: ${rep.calculatedAtKst}
· 주재 전식득지 지혜: [${rep.dominantWisdom.nameKo} (${rep.dominantWisdom.sanskrit})]
  - 근본 전환: ${rep.dominantWisdom.rootConsciousness}
  - 지혜 원리: ${rep.dominantWisdom.wisdomPrinciple}
  - 해탈 실천: ${rep.dominantWisdom.enlightenedAction}
· 보조 지혜: [${rep.secondaryWisdom.nameKo} (${rep.secondaryWisdom.sanskrit})] — ${rep.secondaryWisdom.rootConsciousness}
· 질문 맥락 감사(${rep.situationalYogacaraAudit.scriptureRef}): 번뇌 패턴(${rep.situationalYogacaraAudit.kleshaRootPattern}) → 종자 전환(${rep.situationalYogacaraAudit.bijaTransformation}) / 유심 실천(${rep.situationalYogacaraAudit.mindOnlyPractice})
· KST 시공간 리듬(${rep.temporalAlayaRhythm.kstWindowLabel} · ${rep.temporalAlayaRhythm.seasonTone}): ${rep.temporalAlayaRhythm.satiTransformationFocus} (${rep.temporalAlayaRhythm.contemplativeCue})
· 유식 교차 매트릭스: 대원경지(${rep.yogacaraSynthesisMatrix.alayaMirrorClarity}) | 평등성지(${rep.yogacaraSynthesisMatrix.manasEgoRelease}) | 성소작지(${rep.yogacaraSynthesisMatrix.actionCompletionReadiness})
· 유식유심 실천 지침: ${rep.yogacaraMindOnlyGuidance}
· 대원경지 거울 명상 리추얼: ${rep.mirrorMeditationRitual}
· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: ${rep.boundaryNotice}`;
}
