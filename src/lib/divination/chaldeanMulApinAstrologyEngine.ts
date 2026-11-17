/**
 * 고대 메소포타미아 칼데아 12조디악 원형 & 바빌로니아 물핀(MUL.APIN) 천문 신탁 엔진 (chaldeanMulApinAstrologyEngine.ts)
 *
 * 기원전 1000년경 바빌로니아 천문 점토판 『물핀(MUL.APIN, 쟁기별)』 및 『칼데아 신탁(Chaldean Oracles)』 정통 원전 기반:
 * 엔릴·아누·에아 3대 천상로, 칼데아 7대 행성, 질문 맥락 정성 감사, KST 지구라트 천문 리듬을 교차 해독합니다.
 */

import type { UserProfile } from '../sharedState';

export const CHALDEAN_MUL_APIN_ASTROLOGY_ENGINE_VERSION = 'LUCKEY-CHALDEAN-MULAPIN-v2.3.0';

export type CelestialPath =
  | '엔릴의 길(Way of Enlil - 북천/절대원칙과 법도)'
  | '아누의 길(Way of Anu - 적도천/현실균형과 조디악)'
  | '에아의 길(Way of Ea - 남천/심연지혜와 창조성)';

export interface ChaldeanPlanet {
  nameKo: string;
  akkadianName: string;
  symbol: string;
  virtue: string;
  resonanceScore: number; // 0 ~ 100 (내부 연산용)
}

export interface ChaldeanSituationalAudit {
  celestialFocus: string;
  noeticPrinciple: string;
  tabletPrescription: string;
  eclipseWarning: string;
}

export interface ChaldeanTemporalRhythm {
  kstHour: number;
  zigguratWatch: string;
  babylonianSeason: string;
  timingGuidance: string;
  celestialTempo: '창공' | '균형' | '심연';
}

export interface ChaldeanSynthesisMatrix {
  pathResonanceGrade: '선명' | '안정' | '보완';
  planetConstellationLink: string;
  nextAstronomicalStep: string;
}

export interface ChaldeanMulApinAstrologyReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  celestialPath: CelestialPath;
  pathAlignmentScore: number;
  rulingPlanet: ChaldeanPlanet;
  mulApinConstellation: string;
  situationalMulApinAudit: ChaldeanSituationalAudit;
  temporalMulApinRhythm: ChaldeanTemporalRhythm;
  mulApinSynthesisMatrix: ChaldeanSynthesisMatrix;
  noeticFireGuidance: string;
  astronomicalActionAdvice: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
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

function getKstParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  return {
    hour: Number(parts.find((p) => p.type === 'hour')?.value || '12') % 24,
    month: Number(parts.find((p) => p.type === 'month')?.value || '1'),
  };
}

function buildSituationalAudit(question: string, planet: ChaldeanPlanet): ChaldeanSituationalAudit {
  const q = question.toLowerCase();
  if (/일|사업|직업|계약|시험|프로젝트|재물|진로/.test(q)) {
    return {
      celestialFocus: '엔릴의 법도와 나부(Nabu)의 정밀한 기록 질서',
      noeticPrinciple: `${planet.nameKo}의 덕목(${planet.virtue})을 실무 기준선으로 삼는 태도`,
      tabletPrescription: '말로만 세운 계획을 점토판에 새기듯 구체적 기한과 수치, 책임 범위를 문서화해 실행하십시오.',
      eclipseWarning: '근거 없는 낙관이나 요행에 기대어 원칙을 건너뛰면 궤도가 흔들립니다.',
    };
  }
  if (/사랑|연애|관계|배우자|결혼|사람|화해|갈등/.test(q)) {
    return {
      celestialFocus: '아누의 적도천 균형과 이슈타르(Ishtar)의 진실한 결속',
      noeticPrinciple: '상대의 궤도를 존중하면서도 자신의 중심을 잃지 않는 상호 공명',
      tabletPrescription: '감정의 안개를 걷어내고 지금 이 관계에서 서로가 진심으로 바라는 바를 투명하게 나누십시오.',
      eclipseWarning: '상대의 침묵을 최악의 시나리오로 해석하며 성급히 거리를 두지 마십시오.',
    };
  }
  if (/건강|피로|마음|치유|휴식|불안|잠/.test(q)) {
    return {
      celestialFocus: '에아(Ea)의 남천 압수(Apsu) 심연 치유와 달(Sin)의 순환',
      noeticPrinciple: '억지 강행 대신 물의 흐름에 몸을 맡겨 생명 리듬을 회복하는 지혜',
      tabletPrescription: '오늘 하루는 외부의 별자리를 쫓기보다 조용한 물과 휴식으로 내면의 수면을 잔잔히 가라앉히십시오.',
      eclipseWarning: '지친 상태에서 무리한 결단을 내리면 본래의 판단력이 흐려집니다.',
    };
  }
  return {
    celestialFocus: '엔릴·아누·에아 삼중 천상로의 조율',
    noeticPrinciple: `${planet.nameKo}이 비추는 ${planet.virtue}`,
    tabletPrescription: '별자리의 큰 흐름이 바뀔 때까지 조급히 흔들리지 말고 지금 맡은 자리를 묵묵히 정돈하십시오.',
    eclipseWarning: '사소한 징후에 일희일비하며 본래의 항로를 바꾸지 마십시오.',
  };
}

function buildTemporalRhythm(now: Date): ChaldeanTemporalRhythm {
  const { hour, month } = getKstParts(now);

  let zigguratWatch = '정오 샤마슈(Shamash) 정의의 창';
  let celestialTempo: ChaldeanTemporalRhythm['celestialTempo'] = '창공';
  let timingGuidance = '태양의 빛이 정점에 있는 시간대이므로 명백한 사실 확인과 결단에 유리합니다.';

  if (hour >= 4 && hour < 9) {
    zigguratWatch = '새벽 금성 이슈타르(Ishtar) 여명 관측 창';
    celestialTempo = '창공';
    timingGuidance = '동쪽 지평선이 열리는 새벽 시간대에 오늘의 핵심 의도와 우선순위를 정하십시오.';
  } else if (hour >= 9 && hour < 16) {
    zigguratWatch = '주간 샤마슈·마르두크(Shamash–Marduk) 천상로 창';
    celestialTempo = '균형';
    timingGuidance = '현실의 과업과 협력을 차분히 진전시키되 약속된 질서를 지키는 데 힘쓰십시오.';
  } else if (hour >= 16 && hour < 21) {
    zigguratWatch = '황혼 나부(Nabu) 서기관 결산 창';
    celestialTempo = '균형';
    timingGuidance = '낮의 기록을 갈무리하고 내일로 넘길 일과 오늘 끝낼 일을 분명히 나누십시오.';
  } else {
    zigguratWatch = '심야 신(Sin) 지구라트 천문 관측 창';
    celestialTempo = '심연';
    timingGuidance = '밤하늘의 별자리처럼 깊은 고요 속에서 내면의 직관과 휴식을 회복할 시간입니다.';
  }

  let babylonianSeason = '니산누(Nisannu) 봄 춘분 새해 창';
  if (month >= 3 && month <= 5) babylonianSeason = '니산누(Nisannu) · 파종과 질서 수립기';
  else if (month >= 6 && month <= 8) babylonianSeason = '두주(Du’uzu) · 태양의 절정과 성장기';
  else if (month >= 9 && month <= 11) babylonianSeason = '티슈리투(Tashritu) · 천칭의 수확·결산기';
  else babylonianSeason = '샤바투(Shabatu) · 비와 내면 응축기';

  return {
    kstHour: hour,
    zigguratWatch,
    babylonianSeason,
    timingGuidance,
    celestialTempo,
  };
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

  const situationalMulApinAudit = buildSituationalAudit(question, rulingPlanet);
  const temporalMulApinRhythm = buildTemporalRhythm(now);

  const pathResonanceGrade: ChaldeanSynthesisMatrix['pathResonanceGrade'] =
    pathAlignmentScore >= 80 ? '선명' : pathAlignmentScore >= 65 ? '안정' : '보완';
  const planetConstellationLink = `주재 행성 ${rulingPlanet.akkadianName}의 기운이 원초 별자리 ${cMeta.name}의 성질(${cMeta.nature})과 맞물려 작동합니다.`;
  const nextAstronomicalStep = `${temporalMulApinRhythm.zigguratWatch} 리듬에 맞추어 ${situationalMulApinAudit.celestialFocus}을 우선 점검하십시오.`;

  const mulApinSynthesisMatrix: ChaldeanSynthesisMatrix = {
    pathResonanceGrade,
    planetConstellationLink,
    nextAstronomicalStep,
  };

  const noeticFireGuidance = `칼데아 신탁의 전승: "물질의 어둠에 현혹되지 말고 가슴속 신성한 지성의 불꽃(Noetic Fire)에 불을 지펴라." ` +
    `현재 당신의 기운은 [${rulingPlanet.nameKo}]과 강력히 공명하고 있습니다. ${rulingPlanet.virtue}의 덕목을 지침 삼으십시오.`;

  const astronomicalActionAdvice = `물핀 천문 점토판의 길: 지금 당신의 운명 궤적은 [${celestialPath}]을 지나고 있습니다. ` +
    `원초 별자리 [${cMeta.name}]의 수호를 받아, 잔재주보다는 원칙을 지키고 약속된 질서를 확고히 이행할 때 하늘이 길을 열어줍니다.`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const reflectiveQuestion = question
    ? `질문 "${question}"을 비추는 [${rulingPlanet.nameKo}]과 ${cMeta.name}의 천상로 앞에서, 지금 내가 타협 없이 지켜야 할 원칙은 무엇인가요?`
    : `[${rulingPlanet.nameKo}]과 ${cMeta.name}의 궤도 아래, 지금 내가 지키고자 하는 중심 질서는 무엇인가요?`;
  const interpretiveBoundary = '본 칼데아 물핀 천문 신탁 리포트는 고대 메소포타미아 천상로 상징에 기반한 정성적 지혜 안내이며, 확정적 점성 예언이 아닙니다.';

  return {
    engineVersion: CHALDEAN_MUL_APIN_ASTROLOGY_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    celestialPath,
    pathAlignmentScore,
    rulingPlanet,
    mulApinConstellation,
    situationalMulApinAudit,
    temporalMulApinRhythm,
    mulApinSynthesisMatrix,
    noeticFireGuidance,
    astronomicalActionAdvice,
    ritualAction: situationalMulApinAudit.tabletPrescription,
    reflectionFocus: reflectiveQuestion,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatChaldeanMulApinAstrologyPrompt(rep: ChaldeanMulApinAstrologyReport): string {
  return `[고대 메소포타미아 칼데아 12조디악 원형 & 바빌로니아 물핀(MUL.APIN) 천문 신탁 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | 기준 시각(KST): ${rep.calculatedAtKst}
· 천상 3대로(Celestial Path): ${rep.celestialPath}
· 칼데아 주재 행성: ${rep.rulingPlanet.nameKo} [${rep.rulingPlanet.virtue}]
· 바빌로니아 물핀 별자리: ${rep.mulApinConstellation}
· 질문 맥락 감사: ${rep.situationalMulApinAudit.celestialFocus} — ${rep.situationalMulApinAudit.noeticPrinciple}
  - 점토판 처방: ${rep.situationalMulApinAudit.tabletPrescription}
  - 경계할 식(Eclipse): ${rep.situationalMulApinAudit.eclipseWarning}
· KST 시공간 리듬 (${rep.temporalMulApinRhythm.kstHour}시): ${rep.temporalMulApinRhythm.zigguratWatch} · ${rep.temporalMulApinRhythm.babylonianSeason} (${rep.temporalMulApinRhythm.celestialTempo})
  - 시간대 지침: ${rep.temporalMulApinRhythm.timingGuidance}
· 천문 교차 매트릭스: 조응(${rep.mulApinSynthesisMatrix.pathResonanceGrade}) · ${rep.mulApinSynthesisMatrix.planetConstellationLink}
  - 다음 행동: ${rep.mulApinSynthesisMatrix.nextAstronomicalStep}
· 칼데아 지성 불꽃(Noetic Fire): ${rep.noeticFireGuidance}
· 천문학적 행동 처방: ${rep.astronomicalActionAdvice}
· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: ${rep.interpretiveBoundary}`;
}
