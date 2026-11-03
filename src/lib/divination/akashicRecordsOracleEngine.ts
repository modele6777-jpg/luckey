/**
 * =========================================================================
 * LUCKEY 아카식 레코드 영혼 서약 & 카르믹 청사진 엔진 (Akashic Records Oracle Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 우주 만물의 모든 기억과 파동이 보존되는 영자장(Zero-Point Holographic Field) '아카식 레코드(Akashic Records)'와
 * 사주 4주 원국, 자미두수 명궁(命宮)·신궁(身宮) 및 서양 점성술의 12하우스 영혼 카르마를 결합한 엔진입니다.
 * 
 * 1. 영혼의 기원(Soul Origin / Starseed Archetype): 플레이아데스(사랑과 예술), 시리우스(기술과 영성), 오리온(이성과 시스템), 아크투루스(치유와 진동), 지구 토착 영혼
 * 2. 환생 전 영혼의 신성한 계약(Sacred Soul Contract): 이번 생을 시작하며 서약한 핵심 과업과 배움의 테마
 * 3. 아카식 도서관 접속 만트라 & 영혼 각성 코드(Akashic Activation Code)
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const AKASHIC_RECORDS_VERSION = 'LUCKEY-AKASHIC-v1.0.0';

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

export interface AkashicRecordsOracleReport {
  engineVersion: string;
  calculatedAt: string;
  soulOrigin: SoulOriginDetails;
  soulContract: SacredSoulContract;
  soulAgeMaturity: string;       // 영혼의 성숙도 (성숙한 영혼 Mature Soul, 오래된 영혼 Old Soul, 초월적 영혼 Infinite Soul 등)
  akashicAccessMantra: string;   // 영혼의 도서관 접속 확언 만트라
  soulClarityIndex: number;      // 영혼 목적 자각 지수 (0 ~ 100)
  synthesisPromptGuidance: string;
}

export function runAkashicRecordsOracleEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): AkashicRecordsOracleReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
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
    // 수 (Water)
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

  const synthesisPromptGuidance = `[LUCKEY 아카식 레코드 영혼 서약 & 카르믹 청사진 v1.0.0]
- 영혼의 기원: [${originSystem}]
  * 본질적 파동: ${soulEssenceQuality}
  * 지상에서의 사명: ${cosmicMission}
- 영혼의 성숙도: ${soulAgeMaturity}
- 신성한 영혼 계약(Soul Contract):
  * 제1 배움 과제: ${primaryLesson}
  * 세상에 남길 선물: ${karmicGiftToWorld}
  * 경계할 영적 우회(Bypass): ${forbiddenBypass}
- 영혼 목적 자각도: ${soulClarityIndex}점
- 아카식 접속 만트라: "${akashicAccessMantra}"`;

  return {
    engineVersion: AKASHIC_RECORDS_VERSION,
    calculatedAt: targetDate.toISOString(),
    soulOrigin: {
      originSystem,
      soulEssenceQuality,
      cosmicMission
    },
    soulContract: {
      primaryLesson,
      karmicGiftToWorld,
      forbiddenBypass
    },
    soulAgeMaturity,
    akashicAccessMantra,
    soulClarityIndex,
    synthesisPromptGuidance
  };
}

export type AkashicRecordsOracleResult = AkashicRecordsOracleReport;

export function calculateAkashicRecordsOracle(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): AkashicRecordsOracleResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runAkashicRecordsOracleEngine(profile, targetDate);
}

export function formatAkashicRecordsOraclePrompt(res: AkashicRecordsOracleResult): string {
  return res.synthesisPromptGuidance;
}
