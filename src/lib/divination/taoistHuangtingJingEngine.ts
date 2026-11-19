/**
 * =========================================================================
 * LUCKEY 도교 상청파 황정경(黃庭經) 신체 오장 신성좌 & 존사(存思) 내경 엔진
 * (Taoist Huangting Jing Internal Palaces & Five Viscera Guardian Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 《도장(道藏)》 상청파(上淸派) 최고 양생 경전인 《황정내경경(黃庭內景經)》과
 * 《황정외경경(黃庭外景經)》 정통 원전.
 * 
 * 인체 내부를 하나의 소우주로 보고, 삼단전과 오장육부에 깃든 신성한 빛(진신 / 眞神)을
 * 관조하고 존사(存思 / Sacred Internal Visualization)하여 무병장수와 영적 각성을 얻는 체계:
 * 
 * 1. 삼단전 삼황정 (Three Cinnabar Fields / 三丹田):
 *    - 상단전 니환궁(泥丸宮): 뇌와 영혼의 정수리, 원신(元神)의 궁전
 *    - 중단전 강궁(絳宮): 심장과 가슴 중앙, 신명(神明)과 영적 온기의 자리
 *    - 하단전 기해궁(氣海宮): 하복부 정혈의 바다, 원기(元氣)와 생명력의 원천
 * 
 * 2. 오장 진신 (Five Viscera Gods / 五臟神):
 *    - 심장신 단원(丹元): 자는 수령(守靈), 붉은 옷을 입고 심화를 다스림
 *    - 폐장신 호성(皓成): 자는 허성(虛成), 흰 옷을 입고 맑은 호흡과 백(魄)을 주관
 *    - 간장신 함명(含明): 자는 덕영(德嬰), 푸른 옷을 입고 영혼의 혼(魂)과 생기를 기금
 *    - 비장신 상재(常在): 자는 혼정(魂庭), 황금 옷을 입고 사유와 영양을 조화롭게 함
 *    - 신장신 현진(玄振): 자는 육영(育嬰), 검은 옷을 입고 선천의 원정과 지혜를 갈무리
 * 
 * 3. 황정 회광반조 양생 지수 (Huangting Inner Illumination Index - 0 ~ 100)
 */

import type { UserProfile } from '../sharedState';

export const TAOIST_HUANGTING_VERSION = 'LUCKEY-TAOIST-HUANGTING-v2.2.0';

function formatHuangtingKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface CinnabarPalaceStatus {
  upperNiwanScore: number;         // 0 ~ 100 상단전 니환궁 (정신/통찰)
  middleJiangScore: number;        // 0 ~ 100 중단전 강궁 (심장/가슴/감정)
  lowerQihaiScore: number;         // 0 ~ 100 하단전 기해궁 (원기/활력/접지)
  dominantPalace: string;
}

export interface VisceraGuardianSpirit {
  organ: string;
  spiritName: string;              // 진신 명칭
  courtesyName: string;            // 자(字)
  robedColor: string;              // 신성 의복 색상
  innerPreservationMantra: string; // 존사 및 보전 구절
}

export interface TaoistHuangtingJingReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  palaces: CinnabarPalaceStatus;
  guardianSpirit: VisceraGuardianSpirit;
  secondarySpirit: VisceraGuardianSpirit;
  illuminationScore: number;       // 0 ~ 100 회광반조 내적 조화도
  huangtingPrescription: string;   // 황정경 실천 양생법
  synthesisMessage: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  huangtingSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

const VISCERA_SPIRITS: VisceraGuardianSpirit[] = [
  {
    organ: '심장 (Heart / 絳宮)',
    spiritName: '단원 (丹元)',
    courtesyName: '수령 (守靈)',
    robedColor: '주홍빛 주사 도포 (朱衣)',
    innerPreservationMantra: '심신 단원이 심장을 편안히 감싸고 있으니, 번뇌를 내려놓고 고요한 영적 광명을 관조하라.',
  },
  {
    organ: '폐장 (Lungs / 華蓋)',
    spiritName: '호성 (皓成)',
    courtesyName: '허성 (虛成)',
    robedColor: '순백의 백옥 도포 (白衣)',
    innerPreservationMantra: '폐신 호성이 숨결마다 맑은 상서로움을 들이쉬니, 가슴을 펴고 우주의 청정한 기운을 채워라.',
  },
  {
    organ: '간장 (Liver / 蘭臺)',
    spiritName: '함명 (含明)',
    courtesyName: '덕영 (德嬰)',
    robedColor: '비취빛 청록 도포 (靑衣)',
    innerPreservationMantra: '간신 함명이 봄날의 약동하는 생명수를 기르니, 분노와 긴장을 풀고 부드러운 자비를 품어라.',
  },
  {
    organ: '비장 (Spleen / 黃庭)',
    spiritName: '상재 (常在)',
    courtesyName: '혼정 (魂庭)',
    robedColor: '황금빛 황토 도포 (黃衣)',
    innerPreservationMantra: '비신 상재가 중초의 중심을 굳건히 지키니, 과도한 걱정을 거두고 평온한 미소로 배를 따스하게 하라.',
  },
  {
    organ: '신장 (Kidneys / 玄府)',
    spiritName: '현진 (玄振)',
    courtesyName: '육영 (育嬰)',
    robedColor: '깊은 흑요석 도포 (黑衣)',
    innerPreservationMantra: '신신 현진이 깊은 원천의 생명 정수를 갈무리하니, 발끝을 덥히고 정기를 소중히 보존하라.',
  },
];

export function calculateTaoistHuangtingJing(
  profile?: UserProfile,
  options?: { targetDate?: Date; question?: string }
): TaoistHuangtingJingReport {
  const now = options?.targetDate || new Date();
  const calculatedAtKst = formatHuangtingKstTimestamp(now);
  const q = (options?.question || '').trim();
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const nameStr = profile?.basic?.name || 'Huangting';

  let seed = 0;
  for (let i = 0; i < birthStr.length; i++) seed = (seed * 31 + birthStr.charCodeAt(i)) & 0x7fffffff;
  for (let i = 0; i < nameStr.length; i++) seed = (seed * 23 + nameStr.charCodeAt(i)) & 0x7fffffff;

  const upperNiwanScore = 70 + ((seed * 3 + now.getUTCHours() * 7) % 28);
  const middleJiangScore = 68 + ((seed * 5 + now.getUTCDate() * 9) % 31);
  const lowerQihaiScore = 72 + ((seed * 7 + now.getUTCDay() * 11) % 27);

  let dominantPalace = '하단전 기해궁 (강인한 원기와 생체 접지력)';
  const maxScore = Math.max(upperNiwanScore, middleJiangScore, lowerQihaiScore);
  if (maxScore === upperNiwanScore) dominantPalace = '상단전 니환궁 (총명한 통찰과 높은 영적 직관)';
  else if (maxScore === middleJiangScore) dominantPalace = '중단전 강궁 (온화한 가슴과 풍부한 공감력)';

  const spiritIdx = (seed + now.getUTCDate()) % VISCERA_SPIRITS.length;
  const guardianSpirit = VISCERA_SPIRITS[spiritIdx];
  const secondarySpirit = VISCERA_SPIRITS[(spiritIdx + 1) % VISCERA_SPIRITS.length];

  const illuminationScore = Math.round((upperNiwanScore + middleJiangScore + lowerQihaiScore) / 3);

  const huangtingPrescription = `황정경 존사법: 숨을 들이쉴 때 [${guardianSpirit.robedColor}]의 신성한 빛이 [${guardianSpirit.organ}]을 가득 채우는 것을 마음의 눈으로 바라보며(존사), "${guardianSpirit.innerPreservationMantra}"를 가만히 묵상하세요.`;

  const synthesisMessage = `황정내경경 원전에 따라, 당신의 삼단전 중 [${dominantPalace}]이 중심을 잡고 있으며 오늘 주재하는 내장신은 [${guardianSpirit.spiritName}]입니다.`;
  const ritualAction = `[${guardianSpirit.organ} · ${guardianSpirit.spiritName}] ${guardianSpirit.innerPreservationMantra}`;
  const reflectionFocus = `상청파 황정경(${dominantPalace}) — ${guardianSpirit.spiritName}`;

  const reflectiveQuestion = q
    ? `"${q}"의 고비를 넘길 때, ${guardianSpirit.organ}의 진신 ${guardianSpirit.spiritName}과 보조 ${secondarySpirit.organ}의 ${secondarySpirit.spiritName} 가운데 지금 내 몸이 먼저 요청하는 휴식은 무엇입니까?`
    : `오늘 ${dominantPalace}의 기운을 고르게 유지하면서 ${guardianSpirit.spiritName}의 잠언을 실천하기 위해, 가장 먼저 내려놓을 긴장은 무엇입니까?`;

  const interpretiveBoundary =
    '도교 상청파 황정경 삼단전·오장 진신(眞神) 상징은 심신의 호흡과 내면의 균형을 살피기 위한 은유적 관점이며, 단정적 미래 예측이나 의학·법률·재무 판단을 대체하지 않습니다.';

  const huangtingSynthesisMatrix = {
    dominantTension: `${dominantPalace} ↔ ${guardianSpirit.organ}`,
    alignmentState: `진신: ${guardianSpirit.spiritName} (${guardianSpirit.courtesyName}) · 보조: ${secondarySpirit.spiritName} · ${guardianSpirit.robedColor}`,
    integratedAction: `${guardianSpirit.innerPreservationMantra}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: TAOIST_HUANGTING_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    palaces: {
      upperNiwanScore,
      middleJiangScore,
      lowerQihaiScore,
      dominantPalace,
    },
    guardianSpirit,
    secondarySpirit,
    illuminationScore,
    huangtingPrescription,
    synthesisMessage,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    huangtingSynthesisMatrix,
  };
}

export function formatTaoistHuangtingJingPrompt(report: TaoistHuangtingJingReport): string {
  const matrixLine = report.huangtingSynthesisMatrix
    ? `\n- **황정 교차 매트릭스**: 핵심 긴장(${report.huangtingSynthesisMatrix.dominantTension}) · 조율 상태(${report.huangtingSynthesisMatrix.alignmentState}) · 통합 실천(${report.huangtingSynthesisMatrix.integratedAction})`
    : '';
  return `### ☯️ 도교 상청파 황정경(黃庭經) 신체 오장 신성좌 & 존사 엔진 (${TAOIST_HUANGTING_VERSION} | ${report.calculatedAtKst})
- **삼단전(三丹田) 신체 궁전 균형**:
  - 현재 주도 단전: **${report.palaces.dominantPalace}**
- **오장 주재 진신(眞神)**: **${report.guardianSpirit.organ} - ${report.guardianSpirit.spiritName}** (자: ${report.guardianSpirit.courtesyName})
  - 신성 복식: ${report.guardianSpirit.robedColor}
  - 오장신 존사 잠언: "${report.guardianSpirit.innerPreservationMantra}"
- **보조 교차 진신**: **${report.secondarySpirit.organ} - ${report.secondarySpirit.spiritName}** (${report.secondarySpirit.robedColor})
- **황정경 내관 양생 처방**: ${report.huangtingPrescription}
- **황정 통합 나침반**: ${report.synthesisMessage}${matrixLine}
- **실천 의례**: ${report.ritualAction}
- **성찰 초점**: ${report.reflectionFocus}
- **성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: ${report.interpretiveBoundary}`;
}
