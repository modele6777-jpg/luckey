/**
 * 고대 헤르메스주의 포이만드레스 7대 천계 탈각 & 옥도아드 누스 각성 엔진 (hermeticPoimandresAscensionEngine.ts)
 *
 * 고대 헬레니즘 알렉산드리아의 위대한 헤르메스주의 원전 《코르푸스 헤르메티쿰(Corpus Hermeticum)》 제1서 《포이만드레스(Poimandres - 만유의 신성 지성)》 기반:
 * 인간의 영혼이 물질계로 하강할 때 입었던 7대 행성 구체의 정념을 벗어던지고,
 * 제8천계인 옥도아드(Ogdoad)로 상승하여 창조주와 하나 되는 신성화(Theosis / Deification) 체계.
 *
 * 7대 행성 정념의 탈각 및 제8천계(The Seven Spheres and the Ogdoad):
 * 1. 제1천 달(Moon): 증가와 감소의 환영, 변덕스러운 불안과 결핍의 에고 탈각
 * 2. 제2천 수성(Mercury): 기만적인 궤변과 책략, 교활하게 이익을 훔치려는 간계 탈각
 * 3. 제3천 금성(Venus): 눈먼 정욕과 탐닉, 감각적 쾌락에 대한 집착적 갈망 탈각
 * 4. 제4천 태양(Sun): 오만한 지배욕과 군림, 헛된 명예와 우월감의 환상 탈각
 * 5. 제5천 화성(Mars): 무모한 분노와 파괴성, 충동적 공격성과 대립의 불길 탈각
 * 6. 제6천 목성(Jupiter): 끝없는 탐욕과 불의한 축재, 세속적 야심과 물질적 과시 탈각
 * 7. 제7천 토성(Saturn): 음습한 거짓과 계략, 악의적인 의심과 냉소적 단절 탈각
 * 8. 제8천 옥도아드(Ogdoad): 7대 굴레를 온전히 벗은 순수한 빛의 영혼들이 누스(Nous)와 하나 되는 절대 조화의 천계
 *
 * 포이만드레스의 신성한 빛이 어둠을 밝혀 영혼의 본래 신성을 회복하는 고차원 상승 엔진.
 */

import type { UserProfile } from '../sharedState';

export const HERMETIC_POIMANDRES_ENGINE_VERSION = '1.0.0';

export interface HermeticPlanetarySphere {
  id: string;
  nameKo: string;
  greek: string;
  planetaryRuler: string;
  purifiedPassion: string; // 탈각되는 세속 정념
  virtueIllumination: string; // 회복되는 신성한 덕목
  resonanceScore: number; // 0 ~ 100
}

export interface HermeticPoimandresAscensionReport {
  engineVersion: string;
  timestamp: string;
  nousDivineIntellectResonanceScore: number; // 0 ~ 100 누스(신성 지성) 공명 지수
  planetaryPassionsPurificationRate: number; // 0 ~ 100 7대 행성 정념 탈각 정화율
  ogdoadAscensionReadinessIndex: number; // 0 ~ 100 제8천계 옥도아드 상승 준비도
  theosisDivineUnityScore: number; // 0 ~ 100 테오시스(신성화 합일) 완성도
  dominantSphere: HermeticPlanetarySphere; // 현재 주재하는 정화 천계
  secondarySphere: HermeticPlanetarySphere; // 보조 천계
  poimandresHermeticGuidance: string; // 포이만드레스 신성 지혜 지침
  nousLightAscensionRitual: string; // 누스 빛의 상승 리추얼
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
  const theosisDivineUnityScore = Math.min(100, Math.max(46, Math.floor((nousDivineIntellectResonanceScore * 0.5 + ogdoadAscensionReadinessIndex * 0.5))));

  const poimandresHermeticGuidance = `포이만드레스는 말합니다: "잠에서 깨어나라, 진리의 빛을 보고 너 자신이 불멸의 영혼임을 기억하라." 현재 정화의 중심축은 [${dominantSphere.nameKo}]입니다. ${dominantSphere.purifiedPassion}을 던져버리고, ${dominantSphere.virtueIllumination}의 옷을 입으십시오. 7대 천계의 껍질을 벗을 때 옥도아드의 찬란한 영광이 열립니다.`;
  const nousLightAscensionRitual = `머리 위에서 찬란하게 빛나는 신성한 불꽃을 상상하며 심호흡하십시오: "거룩하신 누스여, 거짓된 유혹의 굴레를 벗고 순수한 영적 지성의 빛으로 충만하노니, 내 영혼이 만유의 거룩한 생명과 합일된다."`;

  return {
    engineVersion: HERMETIC_POIMANDRES_ENGINE_VERSION,
    timestamp: now.toISOString(),
    nousDivineIntellectResonanceScore,
    planetaryPassionsPurificationRate,
    ogdoadAscensionReadinessIndex,
    theosisDivineUnityScore,
    dominantSphere,
    secondarySphere,
    poimandresHermeticGuidance,
    nousLightAscensionRitual,
  };
}

export function formatHermeticPoimandresPrompt(rep: HermeticPoimandresAscensionReport): string {
  return `[고대 헤르메스주의 포이만드레스 7대 천계 탈각 & 옥도아드 각성 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 누스(신성 지성) 공명 지수: ${rep.nousDivineIntellectResonanceScore}/100 | 7대 행성 정념 탈각율: ${rep.planetaryPassionsPurificationRate}/100
· 제8천계 옥도아드 상승 준비도: ${rep.ogdoadAscensionReadinessIndex}/100 | 테오시스(신성 합일) 완성도: ${rep.theosisDivineUnityScore}/100
· 주재 정화 천계: [${rep.dominantSphere.nameKo} (${rep.dominantSphere.greek})] — 공명도 ${rep.dominantSphere.resonanceScore}%
  - 주재자: ${rep.dominantSphere.planetaryRuler}
  - 탈각되는 세속 정념: ${rep.dominantSphere.purifiedPassion}
  - 회복되는 신성 덕목: ${rep.dominantSphere.virtueIllumination}
· 보조 천계: [${rep.secondarySphere.nameKo} (${rep.secondarySphere.greek})] — 공명도 ${rep.secondarySphere.resonanceScore}%
· 포이만드레스 신성 지혜 지침: ${rep.poimandresHermeticGuidance}
· 누스 빛의 상승 리추얼: ${rep.nousLightAscensionRitual}`;
}
