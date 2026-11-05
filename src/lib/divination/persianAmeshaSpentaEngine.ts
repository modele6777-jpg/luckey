/**
 * =========================================================================
 * LUCKEY 고대 페르시아 바르숨(Baresman) & 6대 아메샤 스펜타 조화 엔진
 * (Persian Baresman & Amesha Spenta Six Immortals Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 페르시아 조로아스터교 최고 경전인 《아베스타(Avesta)》 가타(Gathas)와
 * 야스나(Yasna) 의례 정통 원전.
 * 
 * 1. 6대 신성 불멸자 아메샤 스펜타 (Six Amesha Spenta / Holy Immortals):
 *    - 보후 마나 (Vohu Manah): 선한 마음(Good Mind), 지혜와 온유함, 모든 피조물과의 공감
 *    - 아샤 바히쉬타 (Asha Vahishta): 최상의 진리(Highest Truth), 신성한 불과 도덕적 질서
 *    - 흐샤트라 바이랴 (Khshathra Vairya): 이상적 주권(Desirable Dominion), 영적 권능과 실행력
 *    - 스펜타 아르마이티 (Spenta Armaiti): 거룩한 헌신(Holy Devotion), 겸손과 대지의 평화
 *    - 하우르바타트 (Haurvatat): 전인적 완전함(Wholeness / Health), 치유와 맑은 물의 재생
 *    - 아메레타트 (Ameretat): 불멸(Immortality), 시공간을 초월한 영혼의 영속성과 생명나무
 * 
 * 2. 바르숨(Baresman) 성스러운 가지 묶음 (Sacred Twigs of Harmony):
 *    - 야스나 의례에서 사제가 쥐는 신성한 석류나무/대추야자 가지 묶음으로,
 *      흩어진 오감과 분열된 에고를 하나의 정결한 중심선으로 정렬하는 통합력.
 * 
 * 3. 아베스타 신성 광휘 지수 (Avesta Divine Radiance Score - 0 ~ 100)
 */

import type { UserProfile } from '../sharedState';

export const PERSIAN_AMESHA_SPENTA_VERSION = 'LUCKEY-PERSIAN-AMESHA-SPENTA-v1.0.0';

export interface AmeshaSpentaImmortal {
  avestanName: string;
  koreanName: string;
  sacredAttribute: string;         // 관장 신성 미덕
  guardianDominion: string;        // 자연 및 우주 관할 영역
  contemplativeMantra: string;     // 일상 가타 명상 구절
}

export interface BaresmanAlignment {
  mindConcentrationScore: number;  // 0 ~ 100 정신의 단일 집중도
  emotionalHarmonyScore: number;   // 0 ~ 100 감정의 순도
  spiritualRadianceScore: number;  // 0 ~ 100 영적 광휘 지수
  twigsHarmonicState: string;
}

export interface PersianAmeshaSpentaReport {
  engineVersion: string;
  calculatedAt: string;
  patronImmortal: AmeshaSpentaImmortal;
  baresman: BaresmanAlignment;
  totalRadianceScore: number;
  avestanGuidance: string;
  synthesisMessage: string;
}

const SIX_IMMORTALS: AmeshaSpentaImmortal[] = [
  {
    avestanName: '보후 마나 (Vohu Manah)',
    koreanName: '선한 생각과 지혜의 보후 마나',
    sacredAttribute: '분별과 편견을 벗겨내고 만물에 깃든 신성을 자비롭게 알아보는 맑은 지성',
    guardianDominion: '동물계 및 인간의 양심적 사고',
    contemplativeMantra: '내 생각의 샘물이 언제나 맑고 선하여 세상 모든 생명에 따스한 축복이 되게 하소서.',
  },
  {
    avestanName: '아샤 바히쉬타 (Asha Vahishta)',
    koreanName: '최상의 진리와 정의의 불꽃 아샤',
    sacredAttribute: '거짓과 타협하지 않고 우주의 영원한 도덕적 질서를 밝히는 꺼지지 않는 성화',
    guardianDominion: '신성한 불(Atar) 및 우주의 근본 법칙',
    contemplativeMantra: '오 오직 진리만이 유일한 선이니, 불의와 유혹 앞에서도 당당히 진실의 빛으로 서게 하소서.',
  },
  {
    avestanName: '흐샤트라 바이랴 (Khshathra Vairya)',
    koreanName: '신성한 권능과 주권의 흐샤트라',
    sacredAttribute: '어려운 상황을 타개하고 선한 목적을 현실에 단단하게 구현해내는 불굴의 리더십',
    guardianDominion: '금속계 및 정당한 통치권과 행동력',
    contemplativeMantra: '나약함을 부수고 신성한 힘을 내 손에 쥐어 세상을 이롭게 하는 바른 일을 완수하게 하소서.',
  },
  {
    avestanName: '스펜타 아르마이티 (Spenta Armaiti)',
    koreanName: '거룩한 헌신과 자비의 아르마이티',
    sacredAttribute: '불안을 잠재우고 내면에 평화의 대지를 깔아주는 깊은 인내심과 헌신적인 사랑',
    guardianDominion: '어머니 대지(Earth) 및 신실한 신앙',
    contemplativeMantra: '대지처럼 너그럽고 겸손한 마음으로 모든 시련을 품어내며 흔들림 없는 평안을 누리게 하소서.',
  },
  {
    avestanName: '하우르바타트 (Haurvatat)',
    koreanName: '완전함과 전인적 치유의 하우르바타트',
    sacredAttribute: '상처 입은 몸과 마음을 본래의 완전무결한 상태로 회복시키는 생명수의 청량함',
    guardianDominion: '신성한 물(Water) 및 영육의 완전성',
    contemplativeMantra: '맑은 생명수가 내 온몸과 영혼을 적시어 모든 결핍과 질병을 온전히 씻어내게 하소서.',
  },
  {
    avestanName: '아메레타트 (Ameretat)',
    koreanName: '불멸과 영원한 생명의 아메레타트',
    sacredAttribute: '유한한 시간의 굴레를 초월하여 시들지 않는 영혼의 불멸과 결실을 보장함',
    guardianDominion: '식물계(Plants) 및 영원한 생명나무',
    contemplativeMantra: '내 영혼이 시간의 파도에 흔들리지 않고 영원한 신성의 나무처럼 푸르게 서 있게 하소서.',
  },
];

export function calculatePersianAmeshaSpenta(profile?: UserProfile): PersianAmeshaSpentaReport {
  const now = new Date();
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Avesta';

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 29 + nameStr.charCodeAt(i)) & 0x7fffffff;

  const immortalIdx = (seed + now.getUTCDay()) % SIX_IMMORTALS.length;
  const patronImmortal = SIX_IMMORTALS[immortalIdx];

  const mindConcentrationScore = 74 + ((seed * 3 + now.getUTCHours() * 7) % 25);
  const emotionalHarmonyScore = 72 + ((seed * 5 + now.getUTCDate() * 9) % 27);
  const spiritualRadianceScore = 76 + ((seed * 7 + now.getUTCMonth() * 11) % 23);

  const totalRadianceScore = Math.round(
    (mindConcentrationScore * 0.33) + (emotionalHarmonyScore * 0.33) + (spiritualRadianceScore * 0.34)
  );

  let twigsHarmonicState = '바르숨의 성스러운 나뭇가지들이 흐트러짐 없이 하나로 묶여 우주적 진리와 온전히 공명하고 있습니다.';
  if (totalRadianceScore > 88) {
    twigsHarmonicState = '신성한 광휘가 극대화되어 어떤 혼탁한 기운도 당신의 올곧은 중심을 흔들 수 없는 절대 조화의 상태입니다.';
  }

  const avestanGuidance = `오늘의 수호 불멸자 [${patronImmortal.koreanName}]의 은총 아래 "${patronImmortal.sacredAttribute}"를 마음에 새기며, "${patronImmortal.contemplativeMantra}"를 실천하세요.`;

  const synthesisMessage = `아베스타 가타 원전에 따라, 당신의 영혼은 6대 아메샤 스펜타 중 [${patronImmortal.koreanName}]의 신성한 가호를 받습니다 (신성 광휘 지수: ${totalRadianceScore}점).`;

  return {
    engineVersion: PERSIAN_AMESHA_SPENTA_VERSION,
    calculatedAt: now.toISOString(),
    patronImmortal,
    baresman: {
      mindConcentrationScore,
      emotionalHarmonyScore,
      spiritualRadianceScore,
      twigsHarmonicState,
    },
    totalRadianceScore,
    avestanGuidance,
    synthesisMessage,
  };
}

export function formatPersianAmeshaSpentaPrompt(report: PersianAmeshaSpentaReport): string {
  return `### 🔥 고대 페르시아 바르숨 & 6대 아메샤 스펜타 조화 엔진 (${PERSIAN_AMESHA_SPENTA_VERSION})
- **아메샤 스펜타 수호 불멸자**: **${report.patronImmortal.koreanName}** (${report.patronImmortal.avestanName})
  - 신성 미덕: ${report.patronImmortal.sacredAttribute}
  - 관할 영역: ${report.patronImmortal.guardianDominion}
  - 가타 명상 잠언: "${report.patronImmortal.contemplativeMantra}"
- **바르숨(Baresman) 정렬 지수 (신성 광휘도: ${report.totalRadianceScore}점)**:
  - 정신 집중: ${report.baresman.mindConcentrationScore}점 | 감정 순도: ${report.baresman.emotionalHarmonyScore}점 | 영적 광휘: ${report.baresman.spiritualRadianceScore}점
  - 정렬 상태: ${report.baresman.twigsHarmonicState}
- **아베스타 일일 나침반**: ${report.avestanGuidance}
- **아메샤 스펜타 통합 결론**: ${report.synthesisMessage}`;
}
