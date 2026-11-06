/**
 * 발리 힌두교 트리 히타 카라나(3대 우주 조화) 및 트리 카야 파리수다 3업 정화 엔진 (balineseTriHitaKaranaHarmonyEngine.ts)
 *
 * 유네스코 인류무형문화유산 등재 발리 힌두 고유 철학 《트리 히타 카라나(Tri Hita Karana)》 원전 기반:
 * 행복과 번영(Sukham)을 이끄는 3대 우주적 조화의 축(신성 Parhyangan · 인간 Pawongan · 자연 Palemahan)과
 * 신체·언어·마음의 3대 업을 정화하는 《트리 카야 파리수다(Tri Kaya Parisudha)》 수리 모델링.
 *
 * 3대 우주 조화:
 * 1. Parhyangan: 상향 위디 와사(Ida Sang Hyang Widhi Wasa) 우주 최고신 및 조상신과의 영적 합일.
 * 2. Pawongan: 타트 트밤 아시(Tat Twam Asi, '네가 곧 나이다')에 입각한 인간 간의 깊은 자비와 유대.
 * 3. Palemahan: 대지모신 이부 페르티위(Ibu Pertiwi)와 수박(Subak) 수자원 체계가 상징하는 생태적 공존.
 */

import type { UserProfile } from '../sharedState';

export const BALINESE_TRI_HITA_KARANA_ENGINE_VERSION = '1.0.0';

export interface BalineseSacredSanctuary {
  id: string;
  nameKo: string;
  balineseName: string;
  cardinalDirection: '북동 (Kaja-Kangin, 중심 영성)' | '동 (Kangin, 빛과 태양)' | '남 (Kelod, 바다와 번개)' | '서 (Kauh, 일몰과 안식)' | '중앙 (Center, 우주 축)';
  guardianAspect: string;
  spiritualResonanceVirtue: string;
  canangSariRitualOffering: string;
  sanctuaryResonanceScore: number; // 0 ~ 100
}

export interface BalineseTriHitaKaranaReport {
  engineVersion: string;
  timestamp: string;
  parhyanganDivineHarmony: number; // 0 ~ 100 신성 영적 조화율 (Parhyangan)
  pawonganHumanityEmpathy: number; // 0 ~ 100 인간 상호 공감 및 자비도 (Pawongan)
  palemahanEcologyBalance: number; // 0 ~ 100 자연 생태 공존 밸런스 (Palemahan)
  triKayaPurificationIndex: number; // 0 ~ 100 트리 카야 파리수다 3업(생각·말·행동) 정화도
  activeSanctuary: BalineseSacredSanctuary; // 현재 운명과 공명하는 발리 대성소
  balineseCosmicGuidance: string; // 트리 히타 카라나 지혜 처방
  tirtaHolyWaterBlessing: string; // 성수(Tirta) 정화 명상 지침
}

const BALINESE_SANCTUARIES_BASE: Omit<BalineseSacredSanctuary, 'sanctuaryResonanceScore'>[] = [
  {
    id: 'pura-besakih',
    nameKo: '푸라 베사키 (아궁산 대어머니 사원, 우주 영성의 최고 정점)',
    balineseName: 'Pura Besakih',
    cardinalDirection: '북동 (Kaja-Kangin, 중심 영성)',
    guardianAspect: '발리의 성산 아궁(Agung) 화산 중턱에 솟은 모든 사원의 어머니이자 시바·비슈누·브라흐마 삼신 일체 성소',
    spiritualResonanceVirtue: '세속의 번잡함을 단숨에 정화하는 장엄한 우주적 근원의 빛과 완전한 내면 평정심',
    canangSariRitualOffering: '흰 연꽃잎과 향기로운 프란지파니 꽃을 올리며 절대적 신성 앞에 에고를 낮추는 기도를 바치십시오.',
  },
  {
    id: 'pura-lempuyang',
    nameKo: '푸라 렘푸양 루후르 (천국의 문과 동쪽 여명의 찬란한 계시)',
    balineseName: 'Pura Lempuyang Luhur',
    cardinalDirection: '동 (Kangin, 빛과 태양)',
    guardianAspect: '태양의 신 이스바라(Iswara)가 주재하며 빛의 문을 통해 내면의 무명을 몰아내는 여명의 성소',
    spiritualResonanceVirtue: '새로운 시대를 여는 맑은 영감, 투명한 영적 직관 및 진실을 똑바로 응시하는 용기',
    canangSariRitualOffering: '동쪽을 향해 아침 첫 햇살을 손바닥에 모아 가슴 중앙 아나하타 차크라로 이끄십시오.',
  },
  {
    id: 'pura-uluwatu',
    nameKo: '푸라 울루와투 (남쪽 해안 절벽 바다의 수호 성역)',
    balineseName: 'Pura Luhur Uluwatu',
    cardinalDirection: '남 (Kelod, 바다와 번개)',
    guardianAspect: '인도양의 파도가 부서지는 70미터 석회암 절벽 위에서 해양의 신 루드라(Rudra)가 주재하는 수호 성소',
    spiritualResonanceVirtue: '거센 감정의 폭풍 속에서도 흔들리지 않는 굳건한 영적 방패와 직관적 분별력',
    canangSariRitualOffering: '밀려오는 파도의 숨결에 맞춰 날숨으로 깊은 독소를 토해내고 바다의 무한한 회복력을 들이마시십시오.',
  },
  {
    id: 'pura-tanah-lot',
    nameKo: '푸라 타나 롯 (바다 암초 위 조석의 신비로운 성채)',
    balineseName: 'Pura Tanah Lot',
    cardinalDirection: '서 (Kauh, 일몰과 안식)',
    guardianAspect: '밀물에는 섬이 되고 썰물에는 육지가 되는 조석의 리듬 속에서 바다 신 바루나(Baruna)의 서기가 감도는 성소',
    spiritualResonanceVirtue: '변화무쌍한 삶의 기복 속에서 중심을 잃지 않는 적응력과 유연한 지혜',
    canangSariRitualOffering: '황혼의 붉은 노을을 바라보며 지나간 하루의 모든 인연과 감정에 깊은 감사의 합장을 올리십시오.',
  },
  {
    id: 'pura-batukaru',
    nameKo: '푸라 바투카루 (원시 밀림 속 대지모신의 고요한 치유처)',
    balineseName: 'Pura Luhur Batukaru',
    cardinalDirection: '서 (Kauh, 일몰과 안식)',
    guardianAspect: '바투카루 화산 기슭의 깊은 열대 원시림에 둘러싸여 대지와 숲의 정령 마하데와(Mahadewa)가 주재하는 치유 성소',
    spiritualResonanceVirtue: '뿌리 깊은 고요함, 지친 신경계의 전면적 이완과 자연 생명력과의 깊은 세포적 합일',
    canangSariRitualOffering: '맨발로 대지를 딛고 서서 푸른 나무들의 뿌리가 당신의 발바닥을 통해 온몸을 회복시키는 감각을 느끼십시오.',
  },
  {
    id: 'pura-ulun-danu-bratan',
    nameKo: '푸라 울룬 다누 브라탄 (호수 위 물의 여신 다누의 풍요 성소)',
    balineseName: 'Pura Ulun Danu Bratan',
    cardinalDirection: '중앙 (Center, 우주 축)',
    guardianAspect: '안개 낀 브라탄 칼데라 호수 위에 떠 있는 수상 사원으로 물의 여신 데위 다누(Dewi Danu)가 관장하는 생명수 성소',
    spiritualResonanceVirtue: '모든 막힌 흐름을 부드럽게 틔워주는 풍요로운 감수성과 자비로운 치유 에너지',
    canangSariRitualOffering: '맑은 생수를 손등에 세 번 적시며 생각·말·행동의 세 가지 업장이 눈 녹듯 정화됨을 선언하십시오.',
  },
];

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateBalineseTriHitaKarana(profile: UserProfile): BalineseTriHitaKaranaReport {
  const seedStr = `${profile.birthDate || '1994-01-24'}_${profile.birthTime || '12:00'}_${profile.name || 'zeZE'}_balinese_tri_hita_v1`;
  const seed = djb2Hash(seedStr);

  const parhyanganDivineHarmony = 62 + (seed % 37);
  const pawonganHumanityEmpathy = 59 + ((seed >> 2) % 40);
  const palemahanEcologyBalance = 63 + ((seed >> 4) % 36);
  const triKayaPurificationIndex = 65 + ((seed >> 6) % 34);

  const sanctuaryIdx = seed % BALINESE_SANCTUARIES_BASE.length;
  const base = BALINESE_SANCTUARIES_BASE[sanctuaryIdx];
  const sanctuaryResonanceScore = 67 + ((seed >> 8) % 32);

  const activeSanctuary: BalineseSacredSanctuary = {
    ...base,
    sanctuaryResonanceScore,
  };

  const balineseCosmicGuidance = `발리 힌두 《트리 히타 카라나》의 법도는 우주 신성(Parhyangan), 인간 이웃(Pawongan), 자연 대지(Palemahan)의 삼위일체가 균형을 이룰 때 진정한 행복(Sukham)이 꽃핀다고 가르칩니다. 현재 [${activeSanctuary.nameKo}]의 수호 서기와 공명하여 바른 생각(Manacika), 바른 말(Wacika), 바른 행동(Kayika)의 3업을 정화하십시오.`;

  const tirtaHolyWaterBlessing = `손에 깨끗한 물을 담아 이마(마음의 정화), 입술(말의 정화), 가슴(행위의 정화)에 세 방울씩 가볍게 얹으며 '티르타(Tirta, 성스러운 생명수)'가 모든 해묵은 피로와 부정적 에너지를 말끔히 씻어냄을 명상하십시오.`;

  return {
    engineVersion: BALINESE_TRI_HITA_KARANA_ENGINE_VERSION,
    timestamp: new Date().toISOString(),
    parhyanganDivineHarmony,
    pawonganHumanityEmpathy,
    palemahanEcologyBalance,
    triKayaPurificationIndex,
    activeSanctuary,
    balineseCosmicGuidance,
    tirtaHolyWaterBlessing,
  };
}

export function formatBalineseTriHitaKaranaPrompt(report: BalineseTriHitaKaranaReport): string {
  const s = report.activeSanctuary;
  return `[발리 힌두교 트리 히타 카라나 3대 우주 조화 & 3업 정화 실측 데이터]
- 엔진 버전: v${report.engineVersion}
- 파르향안(Parhyangan) 신성 영적 조화율: ${report.parhyanganDivineHarmony}/100
- 파웡안(Pawongan) 인간 상호 공감·자비도: ${report.pawonganHumanityEmpathy}/100
- 팔레마한(Palemahan) 자연 생태 공존 밸런스: ${report.palemahanEcologyBalance}/100
- 트리 카야 파리수다(Tri Kaya Parisudha) 3업 정화도: ${report.triKayaPurificationIndex}/100
- 주재 공명 발리 대성소: ${s.nameKo} (${s.balineseName} / ${s.cardinalDirection})
  * 수호 서기: ${s.guardianAspect}
  * 영적 공명 미덕: ${s.spiritualResonanceVirtue}
  * 성소 공명도: ${s.sanctuaryResonanceScore}/100
  * 차낭 사리(Canang Sari) 봉헌 리추얼: ${s.canangSariRitualOffering}
- 트리 히타 카라나 우주 지혜 지침: ${report.balineseCosmicGuidance}
- 티르타(Tirta) 성수 정화 명상: ${report.tirtaHolyWaterBlessing}`;
}
