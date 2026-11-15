/**
 * 메소아메리카 믹스테크(Mixtec) 영웅 군주 8-사슴 재규어 발톱(Eight Deer Jaguar Claw) 연맹 결성 & 260일 성력 통일 엔진
 *
 * 11세기 믹스테크 고문서 《코덱스 조체 누탈(Codex Zouche-Nuttall)》 및 《코덱스 콜롬비노》 원전 기반.
 * 1. 믹스테크 사상 가장 위대한 전략가이자 군주 이야 나쿠아 테유시 냐냐(Iya Nacuaa Teyusi Ñaña, 8-사슴 재규어 발톱).
 * 2. 4대 전략적 우주 원칙:
 *    - 260일 토날포왈리/성력(Ñuu Tnoo) 영웅 일진의 불굴의 결의
 *    - 신성한 뼈바늘(Bone Awl) 피의 자기 헌신과 정화
 *    - 9-갈대 대여사제와의 신성 동맹 및 평화 협정력
 *    - 틸란통고(Tilantongo)와 투투테펙(Tututepec)을 잇는 산과 해안의 대통합
 * 3. 7대 전술적 품계 및 믹스테크 신성 서판 조언 산출
 *
 * @version LUCKEY-MIXTEC-EIGHT-DEER-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const MIXTEC_EIGHT_DEER_VERSION = 'LUCKEY-MIXTEC-EIGHT-DEER-v2.0.0';

export interface EightDeerHeroRank {
  rankLevel: number;
  rankNameMixtec: string;
  rankNameKo: string;
  territorialDomain: string;
  strategicSuperpower: string;
}

export interface MixtecEightDeerResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  jaguarClawCourageForce: number; // 재규어 발톱의 용기 및 결단력
  sacredAllianceUnificationScore: number; // 신성 동맹 결성 및 네트워크 통합력
  ancestralCaveOracleClarity: number; // 조상 동굴 신탁 영적 명료도
  mountainCoastSynthesisBalance: number; // 산악과 해안의 자원 조화율
  turquoiseNoseOrnamentHonor: number; // 터키석 코 장신구의 주권적 영예
  // 세부 명세
  activeHeroRank: EightDeerHeroRank;
  primaryStrategicVirtue: {
    virtueNameKo: string;
    mixtecTitle: string;
    coreEssence: string;
    actionableDirective: string;
  };
  codexNuttallScene: {
    sceneTitle: string;
    historicWisdom: string;
  };
  mixtecSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function describeMixtecStage(score: number): string {
  if (score >= 86) return '틸란통고 대통합(Grand Alliance) — 용기와 동맹·산해의 자원이 한 줄기로 맞물린 도약기';
  if (score >= 74) return '코덱스 균형(Codex Balance) — 명분과 실리 사이에서 우군을 확보하며 나아가는 안정기';
  return '조상 동굴 성찰(Cave Oracle) — 내면의 직관을 고르고 다음 동맹을 준비하는 정돈기';
}

export type MixtecEightDeerReport = MixtecEightDeerResult;

const EIGHT_DEER_RANKS: EightDeerHeroRank[] = [
  { rankLevel: 1, rankNameMixtec: 'Iya Nacuaa (대군주 8-사슴)', rankNameKo: '만방을 통합하는 대동맹의 패자', territorialDomain: '산악과 해양을 아우르는 광대한 영토와 자원 통합', strategicSuperpower: '이질적인 세력들을 하나로 묶어내는 압도적 포용력' },
  { rankLevel: 2, rankNameMixtec: 'Teyusi Ñaña (재규어 발톱 전사)', rankNameKo: '돌파구를 여는 불굴의 선봉장', territorialDomain: '결정적 승리를 쟁취하는 전진 기지', strategicSuperpower: '어떤 난관 앞에서도 주저하지 않고 돌진하는 용맹' },
  { rankLevel: 3, rankNameMixtec: 'Yoco Yuta (신성한 계곡의 통치자)', rankNameKo: '풍요로운 협곡의 평화 수호관', territorialDomain: '비옥한 농경지와 물길의 공정한 관리', strategicSuperpower: '갈등하는 부족들 사이의 공평무사한 자원 중재' },
  { rankLevel: 4, rankNameMixtec: 'Tee Yucunany (언덕 위의 전략가)', rankNameKo: '지세를 꿰뚫어 보는 혜안의 책사', territorialDomain: '장기적 요충지 구축과 방어 결계', strategicSuperpower: '상대의 수를 미리 읽고 불필요한 충돌을 피하는 지략' },
  { rankLevel: 5, rankNameMixtec: 'Ñuu Dzutoo (사제의 동반자)', rankNameKo: '하늘의 뜻을 묻는 신성 외교관', territorialDomain: '신전과 왕궁을 잇는 신의 조화', strategicSuperpower: '도덕적 명분을 확보하여 적의 의지를 무너뜨리는 정당성' },
  { rankLevel: 6, rankNameMixtec: 'Chaani (신뢰의 동맹 사절)', rankNameKo: '우호의 선물을 전하는 평화 사절', territorialDomain: '교역로 개척과 상호 신뢰 축적', strategicSuperpower: '정직한 거래와 약속 이행으로 우군을 확보하는 신용' },
  { rankLevel: 7, rankNameMixtec: 'Tay Ita (첫 꽃을 피우는 청년)', rankNameKo: '미래를 개척하는 순수한 도전자', territorialDomain: '기초 기술 연마와 내면적 힘의 축적', strategicSuperpower: '겸손하게 배우며 결정적 때를 기다리는 인내' },
];

const STRATEGIC_VIRTUES = [
  { virtueNameKo: '상호 호혜의 동맹 결성', mixtecTitle: 'Ñani Ita (형제의 꽃)', coreEssence: '독불장군이 되지 않고 신뢰할 수 있는 우군을 만듦', actionableDirective: '혼자 모든 짐을 지려 하지 말고 능력 있는 협력자와 뜻을 합치십시오.' },
  { virtueNameKo: '결정적 기회의 과감한 포착', mixtecTitle: 'Tee Ndoo (순간의 벼락)', coreEssence: '하늘이 준 타이밍에 망설임 없이 전력을 투구함', actionableDirective: '준비가 끝났다면 뒤를 돌아보지 말고 목표를 향해 단호히 행동하십시오.' },
  { virtueNameKo: '사사로운 원한의 초월', mixtecTitle: 'Yoco Tachi (바람의 너그러움)', coreEssence: '과거의 작은 충돌에 얽매이지 않고 큰 판을 봄', actionableDirective: '사소한 감정싸움에 에너지를 낭비하지 말고 대의를 위해 품을 넓히십시오.' },
  { virtueNameKo: '스스로를 낮추는 성실한 헌신', mixtecTitle: 'Tee Yaha (독수리의 절제)', coreEssence: '진정한 힘은 겸손한 자기 정화와 절제에서 비롯됨', actionableDirective: '자랑하기보다 실질적인 역량을 채우며 내실을 다지십시오.' },
];

const NUTTALL_SCENES = [
  { sceneTitle: '조상 동굴에서의 신탁 수여', historicWisdom: '가장 깊은 어둠 속에서 내면의 목소리를 경청할 때, 그 어떤 폭풍우도 꺾지 못할 명료한 비전이 밝아온다.' },
  { sceneTitle: '터키석 코 장신구 수여식', historicWisdom: '외부의 인정이나 권위는 내면의 성실함과 진실된 실천이 쌓였을 때 자연스럽게 주어지는 왕관이다.' },
  { sceneTitle: '호수 위의 신성한 평화 조약', historicWisdom: '칼로 맺은 복종은 영원하지 않으나, 진심과 상호 이익으로 맺은 동맹은 산하를 넘나들며 번영한다.' },
  { sceneTitle: '산악과 해안의 대행진', historicWisdom: '서로 다른 재능과 배경을 가진 이들이 하나의 꿈 아래 모일 때, 그 누구도 넘보지 못할 거대한 역사가 된다.' },
];

function getKstDateString(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateMixtecEightDeer(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): MixtecEightDeerResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`MIXTEC-EIGHT-DEER-${birthdate}-${birthtime}-${name}-${query ?? ''}`);

  const jaguarClawCourageForce = (seed % 41) + 60; // 60~100
  const sacredAllianceUnificationScore = ((seed >> 3) % 43) + 58; // 58~100
  const ancestralCaveOracleClarity = ((seed >> 5) % 39) + 62; // 62~100
  const mountainCoastSynthesisBalance = ((seed >> 7) % 45) + 55; // 55~99
  const turquoiseNoseOrnamentHonor = ((seed >> 9) % 38) + 63; // 63~100

  const rankIdx = (seed >> 2) % EIGHT_DEER_RANKS.length;
  const activeHeroRank = EIGHT_DEER_RANKS[rankIdx];

  const virtueIdx = (seed >> 4) % STRATEGIC_VIRTUES.length;
  const primaryStrategicVirtue = STRATEGIC_VIRTUES[virtueIdx];

  const sceneIdx = (seed >> 6) % NUTTALL_SCENES.length;
  const codexNuttallScene = NUTTALL_SCENES[sceneIdx];

  const composite = Math.round(
    (jaguarClawCourageForce + sacredAllianceUnificationScore + ancestralCaveOracleClarity + mountainCoastSynthesisBalance + turquoiseNoseOrnamentHonor) / 5
  );
  const mixtecSynthesisMatrix = {
    dominantTension: `${activeHeroRank.rankNameKo} ↔ ${primaryStrategicVirtue.virtueNameKo}`,
    alignmentState: describeMixtecStage(composite),
    integratedAction: `${primaryStrategicVirtue.actionableDirective}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: MIXTEC_EIGHT_DEER_VERSION,
    calculatedAtKst: getKstDateString(now),
    jaguarClawCourageForce,
    sacredAllianceUnificationScore,
    ancestralCaveOracleClarity,
    mountainCoastSynthesisBalance,
    turquoiseNoseOrnamentHonor,
    activeHeroRank,
    primaryStrategicVirtue,
    codexNuttallScene,
    mixtecSynthesisMatrix,
  };
}

export function formatMixtecEightDeerPrompt(result: MixtecEightDeerResult): string {
  const composite = Math.round(
    (result.jaguarClawCourageForce + result.sacredAllianceUnificationScore + result.ancestralCaveOracleClarity + result.mountainCoastSynthesisBalance + result.turquoiseNoseOrnamentHonor) / 5
  );
  const lines = [
    `[🐆 메소아메리카 믹스테크 《8-사슴 재규어 발톱(Eight Deer)》 연맹 결성 & 통일 리포트]`,
    `- 연산 시각: ${result.calculatedAtKst} | 엔진 버전: ${result.engineVersion}`,
    `- 전략 통합 국면: ${describeMixtecStage(composite)}`,
    `- 현행 전술적 품계: **[${result.activeHeroRank.rankNameKo} (${result.activeHeroRank.rankNameMixtec})]**`,
    `  → 관장 영역: ${result.activeHeroRank.territorialDomain}`,
    `  → 전략적 강점: ${result.activeHeroRank.strategicSuperpower}`,
    `- 최우선 전략 덕목: **[${result.primaryStrategicVirtue.virtueNameKo} (${result.primaryStrategicVirtue.mixtecTitle})]**`,
    `  → 핵심 본질: ${result.primaryStrategicVirtue.coreEssence}`,
    `  → 실천 지침: ${result.primaryStrategicVirtue.actionableDirective}`,
    `- 코덱스 조체-누탈 전승 장면: 《${result.codexNuttallScene.sceneTitle}》`,
    `  → 역사적 지혜: "${result.codexNuttallScene.historicWisdom}"`,
  ];
  if (result.mixtecSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${result.mixtecSynthesisMatrix.dominantTension} | 조율 상태: ${result.mixtecSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${result.mixtecSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
