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
 *
 * 4대 전식득지 지혜(Four Yogacara Transformed Wisdoms):
 * 1. 대원경지(大圓鏡智) - 제8 아뢰야식 전환: 번뇌의 티끌이 사라져 만유를 있는 그대로 비추는 크고 둥근 거울의 지혜
 * 2. 평등성지(平等性智) - 제7 말나식 전환: 나와 남의 분별과 아만을 녹여 모든 생명을 한 몸으로 품는 자비의 지혜
 * 3. 묘관찰지(妙觀察智) - 제6 의식 전환: 주관적 편견 없이 사물의 본성과 인과를 명징하게 꿰뚫는 통찰의 지혜
 * 4. 성소작지(成所作智) - 전5식 전환: 신체와 감각의 모든 행동이 세상을 이롭게 하는 실천적 완성의 지혜
 */

import type { UserProfile } from '../sharedState';

export const BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION = '1.0.0';

export interface YogacaraTransformedWisdom {
  id: string;
  nameKo: string;
  sanskrit: string;
  rootConsciousness: string; // 전환 근본 의식 (제8식, 제7식 등)
  wisdomPrinciple: string;
  enlightenedAction: string;
  resonanceScore: number; // 0 ~ 100 공명도
}

export interface BuddhistYogacaraConsciousnessReport {
  engineVersion: string;
  timestamp: string;
  alayaPurificationScore: number; // 0 ~ 100 아뢰야식 근본종자 맑음도
  manasEgoTranscendenceRate: number; // 0 ~ 100 말나식 아집(我執) 탈각율
  fourWisdomsHarmonizationIndex: number; // 0 ~ 100 4대 지혜 조화도
  kleshaDefilementPurificationScore: number; // 0 ~ 100 4대 근본번뇌(아치·아견·아만·아애) 정화 지수
  dominantWisdom: YogacaraTransformedWisdom; // 가장 강렬하게 꽃피는 주재 지혜
  secondaryWisdom: YogacaraTransformedWisdom; // 보조 발현 지혜
  yogacaraMindOnlyGuidance: string; // 유식유심 실천 지침
  mirrorMeditationRitual: string; // 대원경지 거울 명상 리추얼
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

  const yogacaraMindOnlyGuidance = `세상의 모든 고통과 번뇌는 바깥 대상에 있는 것이 아니라 내 마음식(識)의 분별 투사에서 비롯됩니다. 지금 당신에게 개화하는 지혜는 [${dominantWisdom.nameKo}(${dominantWisdom.sanskrit})]입니다. ${dominantWisdom.enlightenedAction}에 집중할 때 망상이 걷히고 성취의 길이 맑아집니다.`;
  const mirrorMeditationRitual = `조용히 호흡을 고르고 가슴 중심에 티끌 없는 거울이 떠오르는 모습을 관상하십시오: "삼계유심 만법유식(三界唯心 萬法唯識), 오고 가는 모든 현상은 거울에 비친 그림자일 뿐 나를 물들이지 못한다."`;

  return {
    engineVersion: BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION,
    timestamp: now.toISOString(),
    alayaPurificationScore,
    manasEgoTranscendenceRate,
    fourWisdomsHarmonizationIndex,
    kleshaDefilementPurificationScore,
    dominantWisdom,
    secondaryWisdom,
    yogacaraMindOnlyGuidance,
    mirrorMeditationRitual,
  };
}

export function formatBuddhistYogacaraConsciousnessPrompt(rep: BuddhistYogacaraConsciousnessReport): string {
  return `[불교 유식학 8식 정화 & 아뢰야식 전식득지(轉識得智) 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 아뢰야식 종자 맑음도: ${rep.alayaPurificationScore}/100 | 말나식 아집 탈각율: ${rep.manasEgoTranscendenceRate}/100
· 4대 지혜 조화도: ${rep.fourWisdomsHarmonizationIndex}/100 | 4대 근본번뇌 정화 지수: ${rep.kleshaDefilementPurificationScore}/100
· 주재 전식득지 지혜: [${rep.dominantWisdom.nameKo} (${rep.dominantWisdom.sanskrit})] — 공명도 ${rep.dominantWisdom.resonanceScore}%
  - 근본 전환: ${rep.dominantWisdom.rootConsciousness}
  - 지혜 원리: ${rep.dominantWisdom.wisdomPrinciple}
  - 해탈 실천: ${rep.dominantWisdom.enlightenedAction}
· 보조 지혜: [${rep.secondaryWisdom.nameKo} (${rep.secondaryWisdom.sanskrit})] — 공명도 ${rep.secondaryWisdom.resonanceScore}%
· 유식유심 실천 지침: ${rep.yogacaraMindOnlyGuidance}
· 대원경지 거울 명상 리추얼: ${rep.mirrorMeditationRitual}`;
}
