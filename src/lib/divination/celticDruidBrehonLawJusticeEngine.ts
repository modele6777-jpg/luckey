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

export const CELTIC_BREHON_LAW_VERSION = 'LUCKEY-CELTIC-BREHON-LAW-v2.2.0';

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
  situationalBrehonAudit: {
    focusTheme: string;
    equityNote: string;
    tacticalStep: string;
  };
  temporalBrehonRhythm: {
    kstTimeLabel: string;
    groveCourtWindow: string;
    seasonalBrehonTone: string;
    temporalGuidance: string;
  };
  brehonSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
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

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function getTemporalBrehonRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const groveCourtWindow =
    hour >= 5 && hour < 11
      ? '아침 참나무 법정창 — 사실과 약속의 기준을 맑게 세우고 하루의 신의를 여는 시간'
      : hour >= 11 && hour < 17
        ? '정오 중재 합의창 — 상호 권리와 책임을 공정하게 조율하며 실질적 합의를 이끄는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 에릭(Éric) 균형창 — 크고 작은 빚과 감정의 잔여를 정산하고 평온을 회복하는 시간'
          : '심야 피르 플라하(Fír Flatha) 관조창 — 진실의 저울 앞에서 스스로의 중심을 돌아보는 시간';

  const seasonalBrehonTone =
    month >= 3 && month <= 5
      ? '봄 · 벨테인(Beltane) 맹세절 (새로운 신뢰와 동맹이 싹트는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 루나사(Lughnasadh) 결실절 (약속의 이행과 공정한 분배가 빛나는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 삼하인(Samhain) 정산절 (묵은 매듭을 공정히 청산하고 새 질서를 세우는 시기)'
          : '겨울 · 임볼크(Imbolc) 정화절 (명예와 내면의 원칙을 다듬으며 내실을 기르는 시기)';

  return {
    kstTimeLabel: getKstDateString(now),
    groveCourtWindow,
    seasonalBrehonTone,
    temporalGuidance: `${groveCourtWindow} · ${seasonalBrehonTone}의 법리에 맞추어 균형을 세우십시오.`,
  };
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateCelticBrehonLaw(
  profile?: UserProfile,
  nowArg?: Date,
  question?: string
): CelticBrehonLawResult {
  const now = nowArg || new Date();
  const q = (question || '').trim();
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

  const temporalBrehonRhythm = getTemporalBrehonRhythm(now);
  const situationalBrehonAudit = /계약|돈|갈등|관계|분쟁|약속/.test(q)
    ? {
        focusTheme: `${primaryBrehonVirtue.nameKo} · 상호 공정 합의 감사`,
        equityNote: resolutionPrecedent.moralWisdom,
        tacticalStep: primaryBrehonVirtue.actionableDirective,
      }
    : {
        focusTheme: `${activeJusticeRank.rankNameKo} · ${primaryBrehonVirtue.gaelic}`,
        equityNote: activeJusticeRank.jurisdictionDomain,
        tacticalStep: primaryBrehonVirtue.actionableDirective,
      };

  const brehonSynthesisMatrix = {
    coreInsight: `[${activeJusticeRank.rankNameKo}] ${primaryBrehonVirtue.nameKo}의 기준이 상황의 중심을 세웁니다.`,
    recommendedAction: primaryBrehonVirtue.actionableDirective,
    cautionNotice: resolutionPrecedent.moralWisdom,
  };

  return {
    engineVersion: CELTIC_BREHON_LAW_VERSION,
    calculatedAtKst: temporalBrehonRhythm.kstTimeLabel,
    cairdePeacePactHarmony,
    ericCompensationRestoration,
    logNEnechHonorFaceValueScore,
    firFlathaTruthSovereigntyIndex,
    brehonArbitrationClarityPower,
    activeJusticeRank,
    primaryBrehonVirtue,
    resolutionPrecedent,
    situationalBrehonAudit,
    temporalBrehonRhythm,
    brehonSynthesisMatrix,
    ritualAction: primaryBrehonVirtue.actionableDirective,
    reflectionFocus: `${situationalBrehonAudit.focusTheme}의 자리에서 상호 존중(Cairde)과 등가 회복(Éric)을 이루기 위해 오늘 내가 먼저 내놓을 진실은 무엇인가요?`,
    boundaryNotice: '본 결과는 고대 켈트 브레혼 법전의 정의와 회복 철학에 기반한 정성적 관계·합의 가이드이며, 법률 자문이나 확정적 예측이 아닙니다.',
    interpretiveBoundary: '본 결과는 고대 켈트 브레혼 법전의 정의와 회복 철학에 기반한 정성적 관계·합의 가이드이며, 법률 자문이나 확정적 예측이 아닙니다.',
  };
}

export function formatCelticBrehonLawPrompt(result: CelticBrehonLawResult): string {
  const cairdeTone = result.cairdePeacePactHarmony >= 85 ? '견고한 평화 조약' : result.cairdePeacePactHarmony >= 70 ? '안정적 상호 존중' : '신뢰 재정비 필요';
  const ericTone = result.ericCompensationRestoration >= 85 ? '온전한 균형 회복' : result.ericCompensationRestoration >= 70 ? '점진적 보상 조화' : '세심한 보완 필요';
  const honorTone = result.logNEnechHonorFaceValueScore >= 85 ? '높은 신용 품격' : result.logNEnechHonorFaceValueScore >= 72 ? '단단한 신의 기반' : '명예 기준 점검 필요';
  const truthTone = result.firFlathaTruthSovereigntyIndex >= 85 ? '맑은 공의와 풍요' : result.firFlathaTruthSovereigntyIndex >= 70 ? '안정적 진실 순환' : '원칙 재정립 필요';
  const clarityTone = result.brehonArbitrationClarityPower >= 85 ? '명쾌한 중재력' : '차분한 분별 조율';

  return `[⚖️ 고대 켈트 드루이드 《브레혼 법전(Brehon Law)》 4대 우주정의 & 명예가격(Éric) 균형 리포트]
- 엔진 버전: ${result.engineVersion} | 연산 시각: ${result.calculatedAtKst}
- 카이르데(Cairde) 신성 평화 조약 기조: ${cairdeTone} (상호 존중과 신뢰의 불가침 결계)
- 에릭(Éric) 피해 복구 및 균형 기조: ${ericTone} (정당한 등가 교환과 회복)
- 로그 네네흐(Lóg n-enech) 인격 명예 기조: ${honorTone} (내면적 품위와 공적 신용도)
- 피르 플라하(Fir Flatha) 진실 통치 기조: ${truthTone} (공의로운 선택이 부르는 결실)
- 브레혼 중재 판결 기조: ${clarityTone}
- 현행 영적 판결 지위: ${result.activeJusticeRank.rankNameKo} (${result.activeJusticeRank.rankNameGaelic})
- 관할 관장 영역: ${result.activeJusticeRank.jurisdictionDomain}
- 최우선 브레혼 실천 덕목: **[${result.primaryBrehonVirtue.nameKo} (${result.primaryBrehonVirtue.gaelic})]**
  → 행동 지침: ${result.primaryBrehonVirtue.actionableDirective}
- 전승 판례 조언: 《${result.resolutionPrecedent.precedentTitle}》
  → 고대 법훈: "${result.resolutionPrecedent.moralWisdom}"
- 질문 맥락 감사 (${result.situationalBrehonAudit.focusTheme}): ${result.situationalBrehonAudit.tacticalStep}
- KST 시공간 법정 리듬: ${result.temporalBrehonRhythm.groveCourtWindow} / ${result.temporalBrehonRhythm.seasonalBrehonTone}
- 브레혼 교차 매트릭스: 핵심(${result.brehonSynthesisMatrix.coreInsight}) | 실행(${result.brehonSynthesisMatrix.recommendedAction}) | 법훈(${result.brehonSynthesisMatrix.cautionNotice})
- 해석 경계: ${result.boundaryNotice}`;
}
