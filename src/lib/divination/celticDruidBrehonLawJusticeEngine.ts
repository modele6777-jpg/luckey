/**
 * 고대 켈트 드루이드 브레혼 법전(Brehon Law / Senchas Már) 4대 우주정의 & 명예가격 에릭(Éric) 균형 엔진
 *
 * 서기전 1천년경 고대 게일 아일랜드 브레혼(Brehon, 법관) 전통의 최고 법전 《센하스 마르(Senchas Már)》 원전 기반.
 * 1. 4대 우주적 정의 원칙:
 *    - Cairde (카이르데: 신성한 상호 평화 계약)
 *    - Éric (에릭: 피해에 상응하는 우주적 보상 및 균형 회복률)
 *    - Lóg n-enech (로그 네네흐: 인격과 신용의 명예 가격 Face Value)
 *    - Fir Flatha (피르 플라하: 군주의 진실과 공의가 가져오는 대지의 풍요)
 * 2. 7등급 인격 가치 조화율 및 카르마적 분쟁 종결력 산출
 *
 * @version LUCKEY-CELTIC-BREHON-LAW-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const CELTIC_BREHON_LAW_VERSION = 'LUCKEY-CELTIC-BREHON-LAW-v1.0.0';

export interface BrehonJusticeRank {
  rankLevel: number;
  rankNameGaelic: string;
  rankNameKo: string;
  honorHonorariumMultiplier: number;
  jurisdictionDomain: string;
}

export interface CelticBrehonLawResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  cairdePeacePactHarmony: number; // 카이르데 신성 평화 조약 조화율
  ericCompensationRestoration: number; // 에릭 우주적 피해 복구 및 카르마 청산율
  logNEnechHonorFaceValueScore: number; // 로그 네네흐 인격 명예 자산 가치
  firFlathaTruthSovereigntyIndex: number; // 피르 플라하 진실 통치 및 대지 풍요율
  brehonArbitrationClarityPower: number; // 브레혼 중재 판결 명료도
  // 세부 명세
  activeJusticeRank: BrehonJusticeRank;
  primaryBrehonVirtue: {
    gaelic: string;
    nameKo: string;
    actionableDirective: string;
  };
  resolutionPrecedent: {
    precedentTitle: string;
    moralWisdom: string;
  };
}

export type CelticBrehonLawReport = CelticBrehonLawResult;

const BREHON_RANKS: BrehonJusticeRank[] = [
  { rankLevel: 1, rankNameGaelic: 'Rí Térma (경계의 왕)', rankNameKo: '주권적 경계 수호관', honorHonorariumMultiplier: 7.0, jurisdictionDomain: '부족 간 대평화 및 우주 조화 협약' },
  { rankLevel: 2, rankNameGaelic: 'Aire Forgill (최상위 귀족)', rankNameKo: '진실 증언의 대현자', honorHonorariumMultiplier: 5.5, jurisdictionDomain: '영예로운 신의 서약 및 중대 재산 판결' },
  { rankLevel: 3, rankNameGaelic: 'Aire Túise (지도자 귀족)', rankNameKo: '선도적 공동체 조정관', honorHonorariumMultiplier: 4.0, jurisdictionDomain: '가문 간 협력 및 자원 분배 중재' },
  { rankLevel: 4, rankNameGaelic: 'Aire Échta (행동의 수호자)', rankNameKo: '정의로운 실천 수호자', honorHonorariumMultiplier: 3.0, jurisdictionDomain: '피해자 즉각 구제 및 정의 집행' },
  { rankLevel: 5, rankNameGaelic: 'Bóaire (소유 농민)', rankNameKo: '자립적 성실 협정관', honorHonorariumMultiplier: 2.0, jurisdictionDomain: '정직한 노동 및 계약 상호 이행' },
  { rankLevel: 6, rankNameGaelic: 'Óen-chairde (단독 동맹자)', rankNameKo: '신뢰의 동반자', honorHonorariumMultiplier: 1.5, jurisdictionDomain: '사소한 오해의 상호 관용적 종결' },
  { rankLevel: 7, rankNameGaelic: 'Féne (자유민)', rankNameKo: '공정의 대지인', honorHonorariumMultiplier: 1.0, jurisdictionDomain: '진실에 근거한 동등한 발언권 보장' },
];

const BREHON_VIRTUES = [
  { gaelic: 'Fír (진실)', nameKo: '불변의 객관적 진실', actionableDirective: '왜곡 없는 사실만을 테이블 위에 올려 신뢰를 회복하십시오.' },
  { gaelic: 'Cóir (공정)', nameKo: '상호적 비례의 공정함', actionableDirective: '내가 받은 만큼 돌려주고, 상대방의 권리를 내 권리만큼 존중하십시오.' },
  { gaelic: 'Dliged (도리)', nameKo: '자연과 인간의 마땅한 도리', actionableDirective: '상황의 유리함에 흔들리지 말고 근본적인 인간적 책임을 지키십시오.' },
  { gaelic: 'Enclann (명예)', nameKo: '오염되지 않은 내면의 명예', actionableDirective: '눈앞의 작은 이익 때문에 오랜 시간 쌓아온 인격의 얼굴을 깎아먹지 마십시오.' },
];

const BREHON_PRECEDENTS = [
  { precedentTitle: '참나무 아래의 판결 (Judgment of the Sacred Oak)', moralWisdom: '분노가 가라앉고 양측이 같은 참나무 그늘을 공유할 때 비로소 영원한 합의가 싹튼다.' },
  { precedentTitle: '황금 소의 배상령 (Restoration of the Dun Cow)', moralWisdom: '상처 입은 자에게는 말뿐인 사과가 아니라 실질적이고 구체적인 회복이 주어져야 한다.' },
  { precedentTitle: '세 샘물의 정화 맹세 (Oath of the Three Springs)', moralWisdom: '흐르는 물처럼 과거의 과실을 씻어내고 묵은 원한의 장부를 불태울 때 운이 열린다.' },
  { precedentTitle: '추수의 첫 자루 봉헌 (Offering of the First Sheaf)', moralWisdom: '풍요의 몫을 타인과 먼저 나눌 때 자연의 신성과 법이 나의 권리를 영구히 보증한다.' },
];

function getKstDateString(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateCelticBrehonLaw(profile?: UserProfile): CelticBrehonLawResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`CELTIC-BREHON-LAW-${birthdate}-${birthtime}-${name}`);

  const cairdePeacePactHarmony = (seed % 41) + 60; // 60~100
  const ericCompensationRestoration = ((seed >> 3) % 43) + 58; // 58~100
  const logNEnechHonorFaceValueScore = ((seed >> 5) % 39) + 62; // 62~100
  const firFlathaTruthSovereigntyIndex = ((seed >> 7) % 45) + 55; // 55~99
  const brehonArbitrationClarityPower = ((seed >> 9) % 38) + 63; // 63~100

  const rankIdx = (seed >> 2) % BREHON_RANKS.length;
  const activeJusticeRank = BREHON_RANKS[rankIdx];

  const virtueIdx = (seed >> 4) % BREHON_VIRTUES.length;
  const primaryBrehonVirtue = BREHON_VIRTUES[virtueIdx];

  const precedentIdx = (seed >> 6) % BREHON_PRECEDENTS.length;
  const resolutionPrecedent = BREHON_PRECEDENTS[precedentIdx];

  return {
    engineVersion: CELTIC_BREHON_LAW_VERSION,
    calculatedAtKst: getKstDateString(),
    cairdePeacePactHarmony,
    ericCompensationRestoration,
    logNEnechHonorFaceValueScore,
    firFlathaTruthSovereigntyIndex,
    brehonArbitrationClarityPower,
    activeJusticeRank,
    primaryBrehonVirtue,
    resolutionPrecedent,
  };
}

export function formatCelticBrehonLawPrompt(result: CelticBrehonLawResult): string {
  return `[⚖️ 고대 켈트 드루이드 《브레혼 법전(Brehon Law)》 4대 우주정의 & 명예가격(Éric) 균형 리포트]
- 엔진 버전: ${result.engineVersion}
- 카이르데(Cairde) 신성 평화 조약 조화율: ${result.cairdePeacePactHarmony}% (상호 존중과 신뢰의 불가침 결계)
- 에릭(Éric) 우주적 피해 복구 및 카르마 청산율: ${result.ericCompensationRestoration}% (정당한 등가 교환과 보상)
- 로그 네네흐(Lóg n-enech) 인격 명예 자산 가치: ${result.logNEnechHonorFaceValueScore}점 (내면적 품위와 공적 신용도)
- 피르 플라하(Fir Flatha) 진실 통치 및 대지 풍요율: ${result.firFlathaTruthSovereigntyIndex}% (공의로운 선택이 부르는 결실)
- 브레혼 중재 판결 명료도: ${result.brehonArbitrationClarityPower}%
- 현행 영적 판결 지위: ${result.activeJusticeRank.rankNameKo} (${result.activeJusticeRank.rankNameGaelic}) [배상 배수: x${result.activeJusticeRank.honorHonorariumMultiplier}]
- 관할 관장 영역: ${result.activeJusticeRank.jurisdictionDomain}
- 최우선 브레혼 실천 덕목: **[${result.primaryBrehonVirtue.nameKo} (${result.primaryBrehonVirtue.gaelic})]**
  → 행동 지침: ${result.primaryBrehonVirtue.actionableDirective}
- 전승 판례 조언: 《${result.resolutionPrecedent.precedentTitle}》
  → 고대 법훈: "${result.resolutionPrecedent.moralWisdom}"`;
}
