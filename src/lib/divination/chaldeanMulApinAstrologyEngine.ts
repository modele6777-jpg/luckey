/**
 * 고대 메소포타미아 칼데아 12조디악 원형 & 바빌로니아 물핀(MUL.APIN) 천문 신탁 엔진 (chaldeanMulApinAstrologyEngine.ts)
 *
 * 기원전 1000년경 바빌로니아 천문 점토판 『물핀(MUL.APIN, 쟁기별)』 및 『칼데아 신탁(Chaldean Oracles)』 정통 원전:
 * 인류 최초의 체계적 천문학 관측 기록이자 서양 점성술의 근원.
 * 밤하늘을 3대 신성 천상로(Three Celestial Paths)로 삼분하여 신들의 섭리를 관측함:
 * 1. 엔릴의 길(Way of Enlil) - 북천 33개 별자리, 최고의 법도와 영적 질서, 통솔의 권능
 * 2. 아누의 길(Way of Anu) - 적도천 23개 별자리, 황도 12조디악의 원형, 지상과 천상의 균형
 * 3. 에아의 길(Way of Ea) - 남천 15개 별자리, 심연의 담수 압수(Apsu), 무의식적 창조성과 치유
 *
 * 칼데아 질서(Chaldean Order)의 7대 행성(토-목-화-일-금-수-월)과
 * 신성한 영적 불꽃 '노에틱 파이어(Noetic Fire)'에 기반한 현실 개운 통찰.
 */

import type { UserProfile } from '../sharedState';

export const CHALDEAN_MUL_APIN_ASTROLOGY_ENGINE_VERSION = '1.0.0';

export type CelestialPath =
  | '엔릴의 길(Way of Enlil - 북천/절대원칙과 법도)'
  | '아누의 길(Way of Anu - 적도천/현실균형과 조디악)'
  | '에아의 길(Way of Ea - 남천/심연지혜와 창조성)';

export interface ChaldeanPlanet {
  nameKo: string;
  akkadianName: string;
  symbol: string;
  virtue: string;
  resonanceScore: number; // 0 ~ 100
}

export interface ChaldeanMulApinAstrologyReport {
  engineVersion: string;
  timestamp: string;
  celestialPath: CelestialPath;
  pathAlignmentScore: number; // 0 ~ 100 천상로 조응도
  rulingPlanet: ChaldeanPlanet;
  mulApinConstellation: string; // 바빌로니아 원초 별자리
  noeticFireGuidance: string; // 칼데아 신탁의 지성 불꽃
  astronomicalActionAdvice: string; // 천문학적 시기 포착 및 현실 처방
}

const BABYLONIAN_CONSTELLATIONS = [
  { name: '구안나 (GU.AN.NA - 하늘의 황소)', nature: '불굴의 생산력과 물질적 기반 구축' },
  { name: '마슈타바 (MASH.TAB.BA - 위대한 쌍둥이)', nature: '기민한 지적 소통과 다각적 협상' },
  { name: '알룰라 (AL.LUL - 게자리 심연)', nature: '내면의 보호와 감정적 연대감 형성' },
  { name: '우르굴라 (UR.GU.LA - 거대한 사자)', nature: '당당한 자기표현과 리더십 발휘' },
  { name: '압신 (AB.SIN - 이삭을 든 고결한 처녀)', nature: '정밀한 계획 수립과 세심한 실무 완성' },
  { name: '지바니투 (ZI.BA.AN.NA - 천상의 저울)', nature: '공정한 시시비비와 균형 잡힌 중재' },
  { name: '기르탑 (GIR.TAB - 전갈)', nature: '강력한 정화력과 심층적 변용의 에너지' },
  { name: '파빌삭 (PA.BIL.SAG - 천궁의 궁수)', nature: '원대한 비전을 향한 거침없는 도약' },
  { name: '수후르마슈 (SUHUR.MASH - 염소물고기)', nature: '현실적 성취와 깊은 직관의 결합' },
  { name: '굴라 (GU.LA - 물을 붓는 거인)', nature: '창의적 지식의 전파와 집단적 혁신' },
  { name: '심마후 (SIM.MAH - 거대한 제비/물고기)', nature: '영적 해방과 경계를 허무는 포용' },
  { name: '훈가 (HUN.GA - 용맹한 양치기)', nature: '새로운 시대를 여는 개척자적 용기' },
];

const CHALDEAN_PLANETS = [
  { nameKo: '샤마슈 (태양 - Shamash)', akkadianName: 'Shamash', symbol: '☀️', virtue: '정의와 명료한 진실, 절대적 위엄' },
  { nameKo: '신 (달 - Sin)', akkadianName: 'Sin', symbol: '🌙', virtue: '지혜로운 시간의 흐름, 직관적 영감' },
  { nameKo: '네르갈 (화성 - Nergal)', akkadianName: 'Nergal', symbol: '♂️', virtue: '단호한 결단력과 역경 돌파의 패기' },
  { nameKo: '나부 (수성 - Nabu)', akkadianName: 'Nabu', symbol: '☿', virtue: '기록과 지혜의 서기관, 정밀한 계산' },
  { nameKo: '마르두크 (목성 - Marduk)', akkadianName: 'Marduk', symbol: '♃', virtue: '통솔력과 광활한 번영, 우주적 자비' },
  { nameKo: '이슈타르 (금성 - Ishtar)', akkadianName: 'Ishtar', symbol: '♀️', virtue: '사랑과 풍요, 매혹과 결속의 힘' },
  { nameKo: '니누르타 (토성 - Ninurta)', akkadianName: 'Ninurta', symbol: '♄', virtue: '흔들리지 않는 규율과 영구한 질서' },
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateChaldeanMulApinAstrology(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): ChaldeanMulApinAstrologyReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  const bdate = profile?.basic?.birthdate || (profile as any)?.birthDate || (profile as any)?.birthdate || '1992-07-20';
  const btime = profile?.basic?.birthtime || (profile as any)?.birthTime || (profile as any)?.birthtime || '18:00';
  const seedStr = `${bdate}_${btime}_${question || 'mulapin'}_${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const seed = simpleHash(seedStr);

  const pathIdx = seed % 3;
  let celestialPath: CelestialPath;
  if (pathIdx === 0) {
    celestialPath = '엔릴의 길(Way of Enlil - 북천/절대원칙과 법도)';
  } else if (pathIdx === 1) {
    celestialPath = '아누의 길(Way of Anu - 적도천/현실균형과 조디악)';
  } else {
    celestialPath = '에아의 길(Way of Ea - 남천/심연지혜와 창조성)';
  }

  const pathAlignmentScore = 55 + (seed % 43);

  const planetIdx = (seed >> 3) % CHALDEAN_PLANETS.length;
  const pMeta = CHALDEAN_PLANETS[planetIdx];
  const resonanceScore = 50 + ((seed >> 5) % 48);

  const rulingPlanet: ChaldeanPlanet = {
    nameKo: pMeta.nameKo,
    akkadianName: pMeta.akkadianName,
    symbol: pMeta.symbol,
    virtue: pMeta.virtue,
    resonanceScore,
  };

  const constelIdx = (seed >> 2) % BABYLONIAN_CONSTELLATIONS.length;
  const cMeta = BABYLONIAN_CONSTELLATIONS[constelIdx];
  const mulApinConstellation = `${cMeta.name} (${cMeta.nature})`;

  const noeticFireGuidance = `칼데아 신탁의 전승: "물질의 어둠에 현혹되지 말고 가슴속 신성한 지성의 불꽃(Noetic Fire)에 불을 지펴라." ` +
    `현재 당신의 기운은 [${rulingPlanet.nameKo}]과 강력히 공명하고 있습니다. ${rulingPlanet.virtue}의 덕목을 지침 삼으십시오.`;

  const astronomicalActionAdvice = `물핀 천문 점토판의 길: 지금 당신의 운명 궤적은 [${celestialPath}]을 지나고 있습니다. ` +
    `원초 별자리 [${cMeta.name}]의 수호를 받아, 잔재주보다는 원칙을 지키고 약속된 질서를 확고히 이행할 때 하늘이 길을 열어줍니다.`;

  return {
    engineVersion: CHALDEAN_MUL_APIN_ASTROLOGY_ENGINE_VERSION,
    timestamp: now.toISOString(),
    celestialPath,
    pathAlignmentScore,
    rulingPlanet,
    mulApinConstellation,
    noeticFireGuidance,
    astronomicalActionAdvice,
  };
}

export function formatChaldeanMulApinAstrologyPrompt(rep: ChaldeanMulApinAstrologyReport): string {
  return `[고대 메소포타미아 칼데아 12조디악 원형 & 바빌로니아 물핀(MUL.APIN) 천문 신탁 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 천상 3대로(Celestial Path): ${rep.celestialPath} (조응도: ${rep.pathAlignmentScore}/100)
· 칼데아 주재 행성: ${rep.rulingPlanet.nameKo} [${rep.rulingPlanet.virtue}] (공명도: ${rep.rulingPlanet.resonanceScore}/100)
· 바빌로니아 물핀 별자리: ${rep.mulApinConstellation}
· 칼데아 지성 불꽃(Noetic Fire): ${rep.noeticFireGuidance}
· 천문학적 행동 처방: ${rep.astronomicalActionAdvice}`;
}
