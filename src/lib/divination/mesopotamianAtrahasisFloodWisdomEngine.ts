/**
 * 고대 메소포타미아 아카디아 서사시 《아트라하시스(Atrahasis)》 지혜의 방주 & 우주적 절제·균형 회복 엔진
 *
 * 서기전 18세기 고대 바빌로니아 점토판 서사시 《아트라하시스(가장 현명한 자)》 원전 기반.
 * 1. 신들의 소음과 과욕으로 인한 파멸의 위기 속에서 지혜의 신 엔키(에아)가 갈대벽 너머로 전해준 신성한 경고와 생존의 방주 건조 비전.
 * 2. 4대 고대 수메르-아카디아 생존 지혜:
 *    - 갈대벽 밀담(Reed Wall Oracle): 내면의 고요한 직관과 천상의 비밀스러운 인도를 경청함.
 *    - 7일 밤낮의 정화(Seven-Day Deluge): 묵은 집착과 혼란을 씻어내는 거대한 전환기 극복.
 *    - 생명의 씨앗 보존(Ark of Living Seeds): 가장 소중한 본질과 역량을 보전하는 지혜.
 *    - 우주적 공존 서약(Sacred Equilibrium Pact): 탐욕을 버리고 세상과 조화를 이루는 절제.
 * 3. 7대 지혜의 품계 및 아트라하시스 신성 서판 조언 산출
 *
 * @version LUCKEY-ATRAHASIS-FLOOD-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const ATRAHASIS_FLOOD_VERSION = 'LUCKEY-ATRAHASIS-FLOOD-v2.1.0';

export interface AtrahasisWisdomRank {
  rankLevel: number;
  rankNameAkkadian: string;
  rankNameKo: string;
  cosmicDomain: string;
  arkPreservationBlessing: string;
}

export interface AtrahasisFloodResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  reedWallIntuitionScore: number; // 갈대벽 밀담 직관력 및 신탁 수신도
  arkCraftingResilienceForce: number; // 생명의 방주 건조력 및 위기 방어력
  sevenDayStormPurificationIndex: number; // 폭풍우 속 내면 정화 및 담대함
  seedPreservationWisdomPower: number; // 핵심 본질 보전 및 재도약 잠재력
  sacredEquilibriumPactHarmony: number; // 우주적 공존 서약 및 절제의 조화도
  // 세부 명세
  activeWisdomRank: AtrahasisWisdomRank;
  secondaryWisdomRank: AtrahasisWisdomRank;
  primaryArkVirtue: {
    virtueNameKo: string;
    akkadianMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  secondaryArkVirtue: {
    virtueNameKo: string;
    akkadianMotto: string;
    coreEssence: string;
    actionableDirective: string;
  };
  floodEpicEpiphany: {
    tabletSceneTitle: string;
    primordialWisdom: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  atrahasisSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function describeAtrahasisStage(score: number): string {
  if (score >= 86) return '생명의 방주 항해(Ark Navigation) — 갈대벽 직관과 절제의 균형이 온전히 맞물린 안정기';
  if (score >= 74) return '씨앗 보전(Seed Preservation) — 거센 소음 속에서도 본질을 지켜내며 때를 고르는 응집기';
  return '갈대벽 경청(Reed Wall Listening) — 바깥의 소란을 끄고 내면의 미세한 신호를 듣는 준비기';
}

export type AtrahasisFloodReport = AtrahasisFloodResult;

const ATRAHASIS_RANKS: AtrahasisWisdomRank[] = [
  { rankLevel: 1, rankNameAkkadian: 'Atrahasis (가장 현명한 자)', rankNameKo: '혼돈을 넘어 생명을 보전하는 최고 현자', cosmicDomain: '문명 붕괴의 위기 속에서 미래의 씨앗을 품는 대국적 혜안', arkPreservationBlessing: '어떤 파도 속에서도 침몰하지 않는 확고한 지혜' },
  { rankLevel: 2, rankNameAkkadian: 'Gish Kikkishu (갈대벽의 경청자)', rankNameKo: '하늘의 미세한 소리를 듣는 직관관', cosmicDomain: '세상의 소음에 휩쓸리지 않고 진리의 섭리를 감지함', arkPreservationBlessing: '결정적 위기 앞에서 올바른 길을 찾아내는 분별력' },
  { rankLevel: 3, rankNameAkkadian: 'Elimma (생명의 방주 장인)', rankNameKo: '단단한 안전지대를 구축하는 실천관', cosmicDomain: '체계적인 계획과 기술로 위험을 대비하는 방호벽 구축', arkPreservationBlessing: '흔들리지 않는 기반과 철저한 위기 관리 능력' },
  { rankLevel: 4, rankNameAkkadian: 'Nisaba Igisu (청금석 서판의 기록자)', rankNameKo: '과거의 교훈을 갈무리하는 기록관', cosmicDomain: '실패와 성공의 역사를 지혜로 승화시키는 통찰', arkPreservationBlessing: '같은 실수를 반복하지 않고 더 높은 단계로 도약함' },
  { rankLevel: 5, rankNameAkkadian: 'Apkallu (신성한 담수 압수의 사자)', rankNameKo: '메마른 세상에 생명수를 건네는 정화자', cosmicDomain: '갈등과 번뇌를 씻어내고 순수한 본성을 회복함', arkPreservationBlessing: '사람들의 마음을 어루만지고 상처를 치유하는 온기' },
  { rankLevel: 6, rankNameAkkadian: 'Tee Shibuti (장로들의 조언자)', rankNameKo: '공동체의 화평을 이끄는 평화 중재관', cosmicDomain: '욕망의 과잉을 다스리고 상호 존중의 규범을 세움', arkPreservationBlessing: '독단을 버리고 주변과 협력하여 난관을 돌파함' },
  { rankLevel: 7, rankNameAkkadian: 'Lullu (갓 빚어낸 순수한 영혼)', rankNameKo: '순수한 마음으로 새 지평을 여는 개척자', cosmicDomain: '겸허하게 배우며 성장의 씨앗을 틔우는 기초 연마', arkPreservationBlessing: '욕심 없는 성실함으로 내면의 토대를 다지는 힘' },
];

const ARK_VIRTUES = [
  { virtueNameKo: '내면의 미세한 직관에 귀 기울이라', akkadianMotto: 'Sheme Kikkisha (갈대벽을 들으라)', coreEssence: '바깥의 요란한 여론보다 마음속 깊은 양심과 진실을 신뢰함', actionableDirective: '소란스러운 정보에 휘둘리지 말고 조용히 내면의 소리를 따라 결단하십시오.' },
  { virtueNameKo: '가장 소중한 본질을 잃지 말고 지켜라', akkadianMotto: 'Nasir Naphisti (생명을 지키는 자)', coreEssence: '외형적인 성공보다 영혼의 순수함과 진정한 인간성을 보호함', actionableDirective: '물질적인 손실에 연연하기보다 내면의 존엄성과 도덕적 가치를 최우선에 두십시오.' },
  { virtueNameKo: '때가 무르익을 때까지 방주 속에서 인내하라', akkadianMotto: 'Kullat Nishi (함께 견딤)', coreEssence: '폭풍우가 칠 때는 무리하게 맞서지 않고 조용히 힘을 기르며 기다림', actionableDirective: '불필요한 충돌을 피하고 차분히 실력을 연마하며 새로운 아침을 준비하십시오.' },
  { virtueNameKo: '우주와 사람 앞에 겸손한 서약을 맺으라', akkadianMotto: 'Riksu Darium (영원한 계약)', coreEssence: '과도한 탐욕을 버리고 세상 만물과 조화롭게 공존하는 절제를 실천함', actionableDirective: '나 혼자만의 독식을 경계하고 주변과 과실을 나누며 지속 가능한 상생을 택하십시오.' },
];

const ATRAHASIS_EPIPHANIES = [
  { tabletSceneTitle: '갈대벽 너머로 전해진 신탁', primordialWisdom: '세상이 끝난 것처럼 보이는 막다른 골목에서도, 진실을 향해 귀를 기울이는 자에게는 반드시 열려 있는 숨구멍이 있다.' },
  { tabletSceneTitle: '칠흑 같은 어둠 속의 방주 항해', primordialWisdom: '바깥의 거센 파도는 결코 배를 침몰시키지 못하나니, 배 안으로 혼돈의 물을 들이지 않는 한 우리는 안전하다.' },
  { tabletSceneTitle: '산 정상에 닿은 비둘기의 날갯짓', primordialWisdom: '고난의 시간은 영원하지 않으며, 성실히 견뎌낸 자의 발아래에 마침내 단단한 대지가 모습을 드러낸다.' },
  { tabletSceneTitle: '무지개 향연과 영원한 공존의 향기', primordialWisdom: '절제와 자비를 아는 영혼은 신들의 축복을 받으며, 그가 일군 터전 위에서 인류의 새로운 봄이 시작된다.' },
];

function getKstDateString(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateAtrahasisFlood(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): AtrahasisFloodResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`ATRAHASIS-FLOOD-${birthdate}-${birthtime}-${name}-${query ?? ''}`);

  const reedWallIntuitionScore = (seed % 41) + 60; // 60~100
  const arkCraftingResilienceForce = ((seed >> 3) % 43) + 58; // 58~100
  const sevenDayStormPurificationIndex = ((seed >> 5) % 39) + 62; // 62~100
  const seedPreservationWisdomPower = ((seed >> 7) % 45) + 55; // 55~99
  const sacredEquilibriumPactHarmony = ((seed >> 9) % 38) + 63; // 63~100

  const rankIdx = (seed >> 2) % ATRAHASIS_RANKS.length;
  const secondaryRankIdx = (rankIdx + 1 + ((seed >> 3) % (ATRAHASIS_RANKS.length - 1))) % ATRAHASIS_RANKS.length;
  const activeWisdomRank = ATRAHASIS_RANKS[rankIdx];
  const secondaryWisdomRank = ATRAHASIS_RANKS[secondaryRankIdx];

  const virtueIdx = (seed >> 4) % ARK_VIRTUES.length;
  const secondaryVirtueIdx = (virtueIdx + 1 + ((seed >> 5) % (ARK_VIRTUES.length - 1))) % ARK_VIRTUES.length;
  const primaryArkVirtue = ARK_VIRTUES[virtueIdx];
  const secondaryArkVirtue = ARK_VIRTUES[secondaryVirtueIdx];

  const epiphanyIdx = (seed >> 6) % ATRAHASIS_EPIPHANIES.length;
  const floodEpicEpiphany = ATRAHASIS_EPIPHANIES[epiphanyIdx];

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `아트라하시스의 '${activeWisdomRank.rankNameKo}'와 보조 위상 '${secondaryWisdomRank.rankNameKo}'를 비추어 볼 때, "${trimmedQuery}"에서 갈대벽 너머의 고요한 직관으로 지켜내야 할 본질은 무엇인가요?`
    : `지금 '${primaryArkVirtue.virtueNameKo}'와 '${secondaryArkVirtue.virtueNameKo}'의 지혜를 함께 살려 소란을 가라앉히려면 무엇을 먼저 내려놓아야 할까요?`;
  const interpretiveBoundary = '이 지표는 고대 바빌로니아 점토판 서사시 《아트라하시스》의 갈대벽 직관과 생명의 방주·절제 서약 사상을 위기 대응과 내면 성찰의 거울로 해석한 것이며, 구체적 사건의 성패를 단정하는 예언이 아닙니다.';

  const composite = Math.round(
    (reedWallIntuitionScore + arkCraftingResilienceForce + sevenDayStormPurificationIndex + seedPreservationWisdomPower + sacredEquilibriumPactHarmony) / 5
  );
  const atrahasisSynthesisMatrix = {
    dominantTension: `${activeWisdomRank.rankNameKo} ↔ ${primaryArkVirtue.virtueNameKo}`,
    alignmentState: describeAtrahasisStage(composite),
    integratedAction: `${primaryArkVirtue.actionableDirective}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: ATRAHASIS_FLOOD_VERSION,
    calculatedAtKst: getKstDateString(now),
    reedWallIntuitionScore,
    arkCraftingResilienceForce,
    sevenDayStormPurificationIndex,
    seedPreservationWisdomPower,
    sacredEquilibriumPactHarmony,
    activeWisdomRank,
    secondaryWisdomRank,
    primaryArkVirtue,
    secondaryArkVirtue,
    floodEpicEpiphany,
    reflectiveQuestion,
    interpretiveBoundary,
    atrahasisSynthesisMatrix,
  };
}

export function formatAtrahasisFloodPrompt(result: AtrahasisFloodResult): string {
  const composite = Math.round(
    (result.reedWallIntuitionScore + result.arkCraftingResilienceForce + result.sevenDayStormPurificationIndex + result.seedPreservationWisdomPower + result.sacredEquilibriumPactHarmony) / 5
  );
  const lines = [
    `[🌊 고대 메소포타미아 서사시 《아트라하시스(Atrahasis)》 지혜의 방주 & 절제 리포트]`,
    `- 연산 시각: ${result.calculatedAtKst} | 엔진 버전: ${result.engineVersion}`,
    `- 방주 지혜 국면: ${describeAtrahasisStage(composite)}`,
    `- 현행 지혜의 품계: **[${result.activeWisdomRank.rankNameKo} (${result.activeWisdomRank.rankNameAkkadian})]**`,
    `- 보조 교차 품계: **[${result.secondaryWisdomRank.rankNameKo} (${result.secondaryWisdomRank.rankNameAkkadian})]**`,
    `  → 관장 영역: ${result.activeWisdomRank.cosmicDomain}`,
    `  → 방주 보전 축복: ${result.activeWisdomRank.arkPreservationBlessing}`,
    `- 최우선 방주 덕목: **[${result.primaryArkVirtue.virtueNameKo} (${result.primaryArkVirtue.akkadianMotto})]**`,
    `- 보조 교차 덕목: **[${result.secondaryArkVirtue.virtueNameKo} (${result.secondaryArkVirtue.akkadianMotto})]** — ${result.secondaryArkVirtue.actionableDirective}`,
    `  → 핵심 본질: ${result.primaryArkVirtue.coreEssence}`,
    `  → 실천 지침: ${result.primaryArkVirtue.actionableDirective}`,
    `- 점토판 신성 서판 전승: 《${result.floodEpicEpiphany.tabletSceneTitle}》`,
    `  → 원초적 지혜: "${result.floodEpicEpiphany.primordialWisdom}"`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ];
  if (result.atrahasisSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${result.atrahasisSynthesisMatrix.dominantTension} | 조율 상태: ${result.atrahasisSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${result.atrahasisSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
