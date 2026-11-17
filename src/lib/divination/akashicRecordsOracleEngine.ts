/**
 * =========================================================================
 * LUCKEY 아카식 레코드 영혼 서약 & 카르믹 청사진 엔진 (Akashic Records Oracle Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 우주 만물의 모든 기억과 파동이 보존되는 영자장(Zero-Point Holographic Field) '아카식 레코드(Akashic Records)'와
 * 사주 4주 원국, 질문 맥락 정성 감사 및 KST 시공간 리듬을 결합한 엔진입니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const AKASHIC_RECORDS_VERSION = 'LUCKEY-AKASHIC-v2.2.0';

export interface SoulOriginDetails {
  originSystem: string;          // 영혼 기원 항성계 / 아키타입
  soulEssenceQuality: string;    // 본질적 영혼 파동
  cosmicMission: string;         // 지구에 가져온 우주적 사명
}

export interface SacredSoulContract {
  primaryLesson: string;         // 이번 생 반드시 마스터해야 할 제1 영혼 배움
  karmicGiftToWorld: string;     // 고통과 시련을 통과한 후 세상에 선물할 영적 유산
  forbiddenBypass: string;       // 영적 우월감이나 현실 도피로 빠지지 않기 위한 경고
}

export interface AkashicSituationalAudit {
  contractMirrorAxis: string;
  karmicAnchor: string;
  groundingPractice: string;
  bypassWarning: string;
}

export interface AkashicTemporalRhythm {
  kstHour: number;
  akashicAccessWindow: string;
  seasonalEvolutionPhase: string;
  timingGuidance: string;
  libraryTempo: '개방열람' | '현실정박' | '심층통합';
}

export interface AkashicSynthesisMatrix {
  clarityState: '명료' | '숙성' | '정화중';
  originContractLink: string;
  nextContractStep: string;
}

export interface AkashicRecordsOracleReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  soulOrigin: SoulOriginDetails;
  soulContract: SacredSoulContract;
  soulAgeMaturity: string;
  akashicAccessMantra: string;
  soulClarityIndex: number;      // 내부 연산용
  situationalAkashicAudit: AkashicSituationalAudit;
  temporalAkashicRhythm: AkashicTemporalRhythm;
  akashicSynthesisMatrix: AkashicSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  synthesisPromptGuidance: string;
}

function getKstAkashicParts(now: Date): { hour: number; month: number } {
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

function buildAkashicSituationalAudit(
  question: string,
  contract: SacredSoulContract,
  originSystem: string
): AkashicSituationalAudit {
  const q = question.toLowerCase();
  if (/일|진로|사업|이직|선택|계약|목표/.test(q)) {
    return {
      contractMirrorAxis: '지상 사명 구현 및 현실적 책임과 이상 조율',
      karmicAnchor: `${originSystem}의 영감을 일상의 구체적 결과물로 번역`,
      groundingPractice: '거창한 소명 의식보다 오늘 바로 실행할 수 있는 작은 현실 과업 한 가지를 완수하십시오.',
      bypassWarning: contract.forbiddenBypass,
    };
  }
  if (/관계|사랑|연애|가족|갈등|인연|사람/.test(q)) {
    return {
      contractMirrorAxis: '영혼 계약 거울 — 타인을 통한 자기 인식',
      karmicAnchor: contract.primaryLesson,
      groundingPractice: '상대의 행동이 내 안의 어떤 오래된 감정을 건드리는지 먼저 관찰하고 솔직히 표현하십시오.',
      bypassWarning: '상대를 가르치려 들거나 영적 거리두기로 대화를 회피하지 마십시오.',
    };
  }
  return {
    contractMirrorAxis: '영혼 서약 재정렬 및 내면 통합',
    karmicAnchor: contract.karmicGiftToWorld,
    groundingPractice: '조용히 숨을 고르며 지금 내가 반복하고 있는 패턴 중 내려놓을 한 가지를 적어 보십시오.',
    bypassWarning: contract.forbiddenBypass,
  };
}

function buildAkashicTemporalRhythm(now: Date): AkashicTemporalRhythm {
  const { hour, month } = getKstAkashicParts(now);

  let akashicAccessWindow = '새벽 아카식 서고 여명 열람 창';
  let libraryTempo: AkashicTemporalRhythm['libraryTempo'] = '개방열람';
  let timingGuidance = '잡념이 적은 시간대이므로 직관적인 통찰을 기록하기 알맞습니다.';

  if (hour >= 5 && hour < 10) {
    akashicAccessWindow = '여명 영자장 명료 열람 창 (05~10시)';
    libraryTempo = '개방열람';
    timingGuidance = '하루를 시작하기 전 영혼의 우선순위와 오늘의 태도를 차분히 정돈하십시오.';
  } else if (hour >= 10 && hour < 17) {
    akashicAccessWindow = '주간 지상 서약 정박 창 (10~17시)';
    libraryTempo = '현실정박';
    timingGuidance = '영감을 머릿속에만 두지 말고 실제 행동, 대화, 창작물로 구현할 시간입니다.';
  } else if (hour >= 17 && hour < 21) {
    akashicAccessWindow = '황혼 카르마 회고 창 (17~21시)';
    libraryTempo = '심층통합';
    timingGuidance = '오늘 마주친 사건과 감정이 나에게 어떤 배움을 주었는지 가볍게 정리하십시오.';
  } else {
    akashicAccessWindow = '심야 영혼 기록 통합 창 (21~05시)';
    libraryTempo = '심층통합';
    timingGuidance = '의식적 분석을 내려놓고 깊은 수면 속에서 내면의 기억이 정돈되도록 맡기십시오.';
  }

  let seasonalEvolutionPhase = '봄 · 새 순환 개시절';
  if (month >= 3 && month <= 5) seasonalEvolutionPhase = '봄 · 새로운 영혼 주제 발아절';
  else if (month >= 6 && month <= 8) seasonalEvolutionPhase = '여름 · 지상 사명 실행절';
  else if (month >= 9 && month <= 11) seasonalEvolutionPhase = '가을 · 배움의 수확 및 정리절';
  else seasonalEvolutionPhase = '겨울 · 침잠과 서약 재점검절';

  return {
    kstHour: hour,
    akashicAccessWindow,
    seasonalEvolutionPhase,
    timingGuidance,
    libraryTempo,
  };
}

export function runAkashicRecordsOracleEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question: string = ''
): AkashicRecordsOracleReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const seed = (ganCode * 19 + targetDate.getFullYear() * 7 + (targetDate.getMonth() + 1) * 11) % 100;

  let originSystem: string;
  let soulEssenceQuality: string;
  let cosmicMission: string;
  let primaryLesson: string;
  let karmicGiftToWorld: string;
  let forbiddenBypass: string;

  if (element === '목') {
    originSystem = '플레이아데스 항성계 (Pleiadean Lightworker)';
    soulEssenceQuality = '무조건적인 사랑, 생명력의 폭발적 개화, 공감과 치유의 파동';
    cosmicMission = '어둡고 굳어버린 세상에 부드러운 생명과 희망의 초록빛 에너지를 불어넣는 것';
    primaryLesson = '스스로를 소진시키지 않고, 자신을 향한 자비(Self-Compassion)를 먼저 확립하기';
    karmicGiftToWorld = '지친 이들을 온전히 회복시키고 잠재력을 깨우는 생명 중심의 공동체와 창조물';
    forbiddenBypass = '모두를 구원해야 한다는 영적 메시아 콤플렉스와 경계선 상실';
  } else if (element === '화') {
    originSystem = '시리우스 A/B 항성계 (Sirian Visionary & Grid-Keeper)';
    soulEssenceQuality = '고차원 지혜와 신성한 기술의 융합, 변혁의 불꽃과 카리스마';
    cosmicMission = '지구의 낡은 패러다임을 혁파하고 진화된 문명 시스템과 영적 비전을 정박시키는 것';
    primaryLesson = '조급함을 내려놓고 세상의 진화 속도를 인내심 있게 기다려주는 지혜';
    karmicGiftToWorld = '시대의 의식을 퀀텀 도약시키는 혁신적 아이디어와 사람들의 가슴을 울리는 영감';
    forbiddenBypass = '타인의 무지를 비난하거나 특별해지고 싶어 하는 에고의 오만함';
  } else if (element === '토') {
    originSystem = '지구의 수호자 원초 영혼 (Earth Custodian / Gaia Anchor)';
    soulEssenceQuality = '뿌리 깊은 대지의 안정감, 흔들리지 않는 보호와 거대한 수용력';
    cosmicMission = '급변하는 우주적 전환기 속에서도 인류가 발을 디딜 수 있는 안전한 터전과 시스템을 지탱하는 것';
    primaryLesson = '물질과 소유에 대한 집착을 내려놓고, 우주의 무한한 공급을 신뢰하기';
    karmicGiftToWorld = '세대와 세대를 이어주며 모두에게 풍요와 안식을 보장하는 견고한 인프라';
    forbiddenBypass = '변화와 진보를 거부하고 안전지대에 안주하려는 영적 나태';
  } else if (element === '금') {
    originSystem = '오리온 및 안드로메다 항성계 (Orion-Andromedan Truth Bringer)';
    soulEssenceQuality = '면도날처럼 예리한 진실의 식별력, 독립성과 초월적 해방감';
    cosmicMission = '왜곡된 거짓과 환상의 베일을 단칼에 베어내고 본질의 구조와 명료한 진실을 선포하는 것';
    primaryLesson = '차가운 비판과 완벽주의를 넘어, 온기 어린 사랑으로 진실을 전하는 통합의 길';
    karmicGiftToWorld = '불합리와 모순을 일거에 해체하고 최고의 효율과 자유를 선사하는 궁극의 해법';
    forbiddenBypass = '지적 우월감에 갇혀 마음의 문을 닫고 고립되는 냉소주의';
  } else {
    originSystem = '아크투루스 고차원 의식 (Arcturian Master Mystic)';
    soulEssenceQuality = '차원 간 통로를 넘나드는 심오한 직관, 다차원 에너지 조율과 초월적 평화';
    cosmicMission = '인간 내면의 심연과 우주 의식을 연결하여 영혼의 깊은 상처를 정화하는 것';
    primaryLesson = '물질 세계의 물리적 한계를 온전히 인정하고 지상에 단단히 그라운딩하기';
    karmicGiftToWorld = '영혼의 본향을 잊고 방황하는 사람들에게 삶의 신성한 목적을 비춰주는 등대';
    forbiddenBypass = '현실의 의무를 회피하고 사색과 공상 속으로 숨어버리는 영적 도피';
  }

  const soulAges = [
    '성숙한 영혼 후기 (Mature Soul - 깊은 공감과 관계의 본질 탐구)',
    '오래된 영혼 전기 (Old Soul - 세속적 야망을 초월하여 영적 자유를 추구)',
    '오래된 영혼 정점 (Ancient Master Soul - 지상에서의 마지막 환생 주기 완성을 목표)',
    '변혁의 인도자 영혼 (Transpersonal Catalyst - 문명 전환기 닻을 내린 영혼)'
  ];
  const soulAgeMaturity = soulAges[seed % soulAges.length];
  const akashicAccessMantra = `나는 우주의 영원한 사랑과 지혜의 장에 접속합니다. 나의 모든 과거와 현재, 미래는 온전하며, 오늘 나는 이번 생의 영혼 서약을 기쁨으로 이행합니다.`;
  const soulClarityIndex = 84 + (seed % 15);

  const soulOrigin: SoulOriginDetails = {
    originSystem,
    soulEssenceQuality,
    cosmicMission,
  };
  const soulContract: SacredSoulContract = {
    primaryLesson,
    karmicGiftToWorld,
    forbiddenBypass,
  };

  const situationalAkashicAudit = buildAkashicSituationalAudit(question, soulContract, originSystem);
  const temporalAkashicRhythm = buildAkashicTemporalRhythm(targetDate);
  const clarityState: AkashicSynthesisMatrix['clarityState'] =
    soulClarityIndex >= 93 ? '명료' : soulClarityIndex >= 87 ? '숙성' : '정화중';
  const akashicSynthesisMatrix: AkashicSynthesisMatrix = {
    clarityState,
    originContractLink: `${originSystem}의 파동이 ${temporalAkashicRhythm.akashicAccessWindow} (${temporalAkashicRhythm.libraryTempo}) 리듬과 이어집니다.`,
    nextContractStep: situationalAkashicAudit.groundingPractice,
  };

  const kst = new Date(targetDate.getTime() + 9 * 3600 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;

  const interpretiveBoundary = '본 리포트는 아카식 레코드 상징 아키타입에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.';
  const ritualAction = situationalAkashicAudit.groundingPractice;
  const reflectionFocus = `${situationalAkashicAudit.contractMirrorAxis} 맥락에서 오늘 내가 "${primaryLesson}"을 일상에 정박시키기 위해 내려놓을 한 가지는 무엇인가요?`;

  const synthesisPromptGuidance = `[LUCKEY 아카식 레코드 영혼 서약 & 카르믹 청사진 v2.2.0]
- 연산 시각: ${calculatedAtKst}
- 영혼의 기원: [${originSystem}]
  * 본질적 파동: ${soulEssenceQuality}
  * 지상에서의 사명: ${cosmicMission}
- 영혼의 성숙도: ${soulAgeMaturity} (자각 상태: ${clarityState})
- 신성한 영혼 계약(Soul Contract):
  * 제1 배움 과제: ${primaryLesson}
  * 세상에 남길 선물: ${karmicGiftToWorld}
  * 경계할 영적 우회(Bypass): ${forbiddenBypass}
- 질문 맥락 감사: ${situationalAkashicAudit.contractMirrorAxis} · 닻(${situationalAkashicAudit.karmicAnchor})
  * 그라운딩 실천: ${situationalAkashicAudit.groundingPractice}
- KST 시공간 리듬 (${temporalAkashicRhythm.kstHour}시): ${temporalAkashicRhythm.akashicAccessWindow} · ${temporalAkashicRhythm.seasonalEvolutionPhase} (${temporalAkashicRhythm.libraryTempo})
  * 시간대 지침: ${temporalAkashicRhythm.timingGuidance}
- 아카식 교차 매트릭스: ${akashicSynthesisMatrix.originContractLink}
- 아카식 접속 만트라: "${akashicAccessMantra}"
- 해석 경계: 본 리포트는 아카식 레코드 상징 아키타입에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.`;

  return {
    engineVersion: AKASHIC_RECORDS_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    soulOrigin,
    soulContract,
    soulAgeMaturity,
    akashicAccessMantra,
    soulClarityIndex,
    situationalAkashicAudit,
    temporalAkashicRhythm,
    akashicSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    interpretiveBoundary,
    synthesisPromptGuidance
  };
}

export type AkashicRecordsOracleResult = AkashicRecordsOracleReport;

export function calculateAkashicRecordsOracle(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): AkashicRecordsOracleResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  const question = params?.question || '';
  return runAkashicRecordsOracleEngine(profile, targetDate, question);
}

export function formatAkashicRecordsOraclePrompt(res: AkashicRecordsOracleResult): string {
  return res.synthesisPromptGuidance;
}
