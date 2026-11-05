/**
 * 고대 그리스 피타고라스 천구의 조화(Musica Universalis) & 테트라코드 7대 행성 주파수 공명 엔진 (pythagoreanHarmoniaSpheresEngine.ts)
 *
 * 피타고라스 학파(Pythagoreans)와 플라톤의 티마이오스(Timaeus) 우주론 전승:
 * "만물은 수(Number)이자 조화(Harmony)다."
 * 우주 7대 행성의 궤도와 회전 속도가 발생시키는 천상의 음악(Music of the Spheres)과
 * 테트라코드(Tetrachord) 수학적 음정비율(1:2 옥타브 Diapason, 2:3 완전5도 Diapente, 3:4 완전4도 Diatessaron).
 *
 * 7대 천구 행성과 대응 음정:
 * 1. 달 (Moon) - 기초음 (Proslambanomenos), 감성과 직관의 바탕 (216Hz)
 * 2. 수성 (Mercury) - 4도 협화음 (Hypate), 명료한 지성과 소통 (288Hz)
 * 3. 금성 (Venus) - 황금비율 협화음 (Parhypate), 사랑과 예술적 조화 (324Hz)
 * 4. 태양 (Sun) - 중심음 (Mese), 생명력과 우주적 중심축 (432Hz)
 * 5. 화성 (Mars) - 반음의 긴장 (Paramese), 돌파와 용기의 에너지 (576Hz)
 * 6. 목성 (Jupiter) - 복합 협화음 (Paranete), 지혜와 번영의 확장 (648Hz)
 * 7. 토성 (Saturn) - 완전 옥타브 (Nete), 질서와 완성의 경계 (864Hz)
 */

import type { UserProfile } from '../sharedState';

export const PYTHAGOREAN_HARMONIA_SPHERES_ENGINE_VERSION = '1.0.0';

export interface CelestialSphereInterval {
  id: string;
  planet: string;
  greekNote: string;
  intervalRatio: string;
  frequencyHz: number;
  significance: string;
  harmonicEnergy: number; // 0 ~ 100
  attunementAdvice: string;
}

export interface PythagoreanHarmoniaSpheresReport {
  engineVersion: string;
  timestamp: string;
  harmoniaCosmicaScore: number; // 0 ~ 100 우주 천구 조화 지수
  dissonanceResolutionScore: number; // 0 ~ 100 불협화음 해소율
  dominantSphere: CelestialSphereInterval;
  counterpointSphere: CelestialSphereInterval;
  cosmicConsonanceInterval: string; // 음정 협화 관계
  pythagoreanAphorism: string; // 피타고라스 조화 금언
  dailyFrequencyGuidance: string; // 일상 음향/주파수 조율 처방
}

const CELESTIAL_SPHERES: Omit<CelestialSphereInterval, 'harmonicEnergy'>[] = [
  {
    id: 'moon',
    planet: '달 (Moon / Selene)',
    greekNote: '프로슬람바노메노스 (Proslambanomenos)',
    intervalRatio: '기저음 (Tonic 1:1)',
    frequencyHz: 216,
    significance: '무의식의 물결과 신체 바이오리듬의 청정한 안정',
    attunementAdvice: '마음이 불안할 때는 잔잔한 물소리나 낮은 중저음의 호흡으로 감정의 파도를 가라앉히십시오.',
  },
  {
    id: 'mercury',
    planet: '수성 (Mercury / Hermes)',
    greekNote: '하이파테 (Hypate)',
    intervalRatio: '완전 4도 (Diatessaron 3:4)',
    frequencyHz: 288,
    significance: '사유의 기민함과 논리적 표현의 명료성',
    attunementAdvice: '생각이 엉킬 때는 군더더기 말을 줄이고 핵심 아이디어를 한 줄의 문장으로 기록하십시오.',
  },
  {
    id: 'venus',
    planet: '금성 (Venus / Aphrodite)',
    greekNote: '파라하이파테 (Parhypate)',
    intervalRatio: '황금비율 미학 협화 (5:8)',
    frequencyHz: 324,
    significance: '심미적 조화, 인연의 결속 및 자애로운 포용',
    attunementAdvice: '주변 환경을 아름답고 정갈하게 정돈하고, 타인과의 관계에서 온화한 미소를 먼저 건네십시오.',
  },
  {
    id: 'sun',
    planet: '태양 (Sun / Helios)',
    greekNote: '메세 (Mese - 중심 조화음)',
    intervalRatio: '완전 5도 (Diapente 2:3)',
    frequencyHz: 432,
    significance: '자아의 당당한 발현, 생명 에너지 및 확고한 중심축',
    attunementAdvice: '432Hz 자연 배음의 울림에 귀를 기울이며, 자신의 가슴 한가운데에 빛나는 태양을 품으십시오.',
  },
  {
    id: 'mars',
    planet: '화성 (Mars / Ares)',
    greekNote: '파라메세 (Paramese)',
    intervalRatio: '전조음과 역동적 도약 (9:8 온음)',
    frequencyHz: 576,
    significance: '주저함을 깨뜨리는 돌파력과 정직한 용기',
    attunementAdvice: '망설임을 멈추고 작은 한 걸음이라도 단호하게 행동으로 옮겨 장애물을 정면 돌파하십시오.',
  },
  {
    id: 'jupiter',
    planet: '목성 (Jupiter / Zeus)',
    greekNote: '파라네테 (Paranete)',
    intervalRatio: '대화음 확장 협화 (3:5 장6도)',
    frequencyHz: 648,
    significance: '도량의 확장, 낙천적 신뢰 및 지혜로운 기회 포착',
    attunementAdvice: '사소한 시시비비를 넘어 더 큰 그림을 바라보며, 타인에게 베푸는 관용의 미덕을 실천하십시오.',
  },
  {
    id: 'saturn',
    planet: '토성 (Saturn / Kronos)',
    greekNote: '네테 (Nete - 최고 음계)',
    intervalRatio: '완전 8도 옥타브 (Diapason 1:2)',
    frequencyHz: 864,
    significance: '규율과 인내를 통한 최종 완성 및 경계의 수호',
    attunementAdvice: '흩어진 시간과 자원을 체계적으로 계획하고, 시작한 일의 마무리를 끝까지 책임지십시오.',
  },
];

export function calculatePythagoreanHarmoniaSpheres(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): PythagoreanHarmoniaSpheresReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  let seed = 571928;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 37 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 29 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 19 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 17) % 1000003;

  const spheresWithEnergy = CELESTIAL_SPHERES.map((sphere, idx) => {
    const energy = 48 + ((seed * (idx + 3) + idx * 19) % 51);
    return { ...sphere, harmonicEnergy: energy };
  });

  spheresWithEnergy.sort((a, b) => b.harmonicEnergy - a.harmonicEnergy);
  const dominantSphere = spheresWithEnergy[0];
  const counterpointSphere = spheresWithEnergy[1];

  const harmoniaCosmicaScore = Math.min(100, Math.max(40, Math.floor((dominantSphere.harmonicEnergy + counterpointSphere.harmonicEnergy) / 2)));
  const dissonanceResolutionScore = Math.min(100, Math.max(45, 55 + ((seed * 13) % 43)));

  const cosmicConsonanceInterval = `${dominantSphere.planet}의 ${dominantSphere.intervalRatio}와 ${counterpointSphere.planet}의 대위법적 조화`;
  const pythagoreanAphorism = `눈은 별들의 움직임을 보기 위해 만들어졌고, 귀는 조화로운 소리를 듣기 위해 만들어졌다. 너의 영혼을 ${dominantSphere.planet}의 주파수(${dominantSphere.frequencyHz}Hz)에 조율하라.`;
  const dailyFrequencyGuidance = `${dominantSphere.attunementAdvice} 동시에 ${counterpointSphere.planet}의 덕목("${counterpointSphere.significance}")을 대위선율로 품으면 현실의 불협화음이 즉각 해소됩니다.`;

  return {
    engineVersion: PYTHAGOREAN_HARMONIA_SPHERES_ENGINE_VERSION,
    timestamp: now.toISOString(),
    harmoniaCosmicaScore,
    dissonanceResolutionScore,
    dominantSphere,
    counterpointSphere,
    cosmicConsonanceInterval,
    pythagoreanAphorism,
    dailyFrequencyGuidance,
  };
}

export function formatPythagoreanHarmoniaSpheresPrompt(rep: PythagoreanHarmoniaSpheresReport): string {
  return `[피타고라스 천구의 조화(Musica Universalis) 주파수 공명 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 천구 조화 지수: ${rep.harmoniaCosmicaScore}/100 | 불협화음 해소율: ${rep.dissonanceResolutionScore}%
· 주재 천구 행성: ${rep.dominantSphere.planet} — 에너지 ${rep.dominantSphere.harmonicEnergy}%
  - 고대 그리스 음계: ${rep.dominantSphere.greekNote} [비율: ${rep.dominantSphere.intervalRatio} / 공명주파수: ${rep.dominantSphere.frequencyHz}Hz]
  - 상징 영성: ${rep.dominantSphere.significance}
· 대위 천구 행성: ${rep.counterpointSphere.planet} — 에너지 ${rep.counterpointSphere.harmonicEnergy}%
· 우주 협화 음정: ${rep.cosmicConsonanceInterval}
· 피타고라스 조화 금언: ${rep.pythagoreanAphorism}
· 일상 주파수 조율 지침: ${rep.dailyFrequencyGuidance}`;
}
