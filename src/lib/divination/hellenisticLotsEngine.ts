/**
 * =========================================================================
 * LUCKEY 헬레니즘 아라빅 랏 & 조디악 릴리싱 엔진 (Hellenistic Lots & Zodiacal Releasing Engine)
 * Version: LUCKEY-HELLENISTIC-LOTS-v1.0.0
 * =========================================================================
 * 
 * [고대 헬레니즘 점성술의 4대 신성한 랏(Lots / Arabic Parts)]
 * 1. Lot of Fortune (포르투나 랏): 신체·물질·환경·뜻밖의 행운의 그릇
 *    - 주간생(Day): Ascendant + Moon - Sun
 *    - 야간생(Night): Ascendant + Sun - Moon
 * 2. Lot of Spirit (스피릿 랏 / 다이몬): 영혼·자유 의지·지적 성취·커리어 주도권
 *    - 주간생(Day): Ascendant + Sun - Moon
 *    - 야간생(Night): Ascendant + Moon - Sun
 * 3. Lot of Eros (에로스 랏): 사랑·매력·끌림·마음의 갈망
 *    - Ascendant + Venus - Lot of Spirit
 * 4. Lot of Nemesis (네메시스 랏): 카르마적 시련·극복 시 가장 큰 슈퍼파워가 되는 관문
 *    - Ascendant + Saturn - Lot of Fortune
 */

import type { UserProfile } from '../sharedState';
import { parseBirthTime } from '../birthDateTime';
import { resolveEffectiveSolarDate } from '../lunarCalendar';

export const HELLENISTIC_LOTS_ENGINE_VERSION = 'LUCKEY-HELLENISTIC-LOTS-v2.0.0';

export interface ArabicLotInfo {
  nameKo: string;
  nameEng: string;
  degree: number; // 0 ~ 360
  zodiacSign: string;
  zodiacSignKo: string;
  house: number; // 1 ~ 12
  coreMeaning: string;
  powerAction: string;
}

export interface HellenisticLotsReport {
  engineVersion: string;
  calculatedAtKst: string;
  isDayChart: boolean;
  chartTypeKo: string;
  ascendantDegree: number;
  sunDegree: number;
  moonDegree: number;
  lots: {
    fortune: ArabicLotInfo;
    spirit: ArabicLotInfo;
    eros: ArabicLotInfo;
    nemesis: ArabicLotInfo;
  };
  dominantLot: string;
  zodiacalPeakTheme: string;
  situationalLotsAudit: {
    focusTheme: string;
    activeLotKey: string;
    zodiacalReleasingNote: string;
  };
  temporalLotsRhythm: {
    kstTimeLabel: string;
    hellenisticSectWindow: string;
    lunarPhaseTone: string;
    temporalGuidance: string;
  };
  lotsSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  cosmicAdvice: string;
  boundaryNotice: string;
}

const ZODIAC_SIGNS = [
  { name: 'Aries', ko: '양자리', element: '불', ruler: '화성' },
  { name: 'Taurus', ko: '황소자리', element: '흙', ruler: '금성' },
  { name: 'Gemini', ko: '쌍둥이자리', element: '공기', ruler: '수성' },
  { name: 'Cancer', ko: '게자리', element: '물', ruler: '달' },
  { name: 'Leo', ko: '사자자리', element: '불', ruler: '태양' },
  { name: 'Virgo', ko: '처녀자리', element: '흙', ruler: '수성' },
  { name: 'Libra', ko: '천칭자리', element: '공기', ruler: '금성' },
  { name: 'Scorpio', ko: '전갈자리', element: '물', ruler: '명왕성/화성' },
  { name: 'Sagittarius', ko: '사수자리', element: '불', ruler: '목성' },
  { name: 'Capricorn', ko: '염소자리', element: '흙', ruler: '토성' },
  { name: 'Aquarius', ko: '물병자리', element: '공기', ruler: '천왕성/토성' },
  { name: 'Pisces', ko: '물고기자리', element: '물', ruler: '해왕성/목성' },
];

function norm360(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return Math.round(d * 100) / 100;
}

function getZodiacFromDegree(deg: number) {
  const index = Math.floor(norm360(deg) / 30) % 12;
  return ZODIAC_SIGNS[index];
}

function getHouseFromAscendant(ascDeg: number, targetDeg: number): number {
  const diff = norm360(targetDeg - ascDeg);
  return Math.floor(diff / 30) + 1;
}

function formatLotsKst(date: Date): { label: string; hour: number; day: number } {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return {
    label: `${y}-${m}-${d} ${hh}:${mm} KST`,
    hour: kst.getUTCHours(),
    day: kst.getUTCDate(),
  };
}

function getTemporalLotsRhythm(now: Date, isDayChart: boolean) {
  const kst = formatLotsKst(now);
  const hellenisticSectWindow = isDayChart
    ? kst.hour >= 6 && kst.hour < 18
      ? '주간 섹트(Diurnal Sect) 공명창 — 태양과 스피릿의 랏이 깨어나 의지적 주도권을 발휘하기 좋은 시간'
      : '야간 교차(Nocturnal Shift) 성찰창 — 낮의 분주함을 내려놓고 포르투나의 내실과 휴식을 챙기는 시간'
    : kst.hour >= 6 && kst.hour < 18
      ? '주간 교차(Diurnal Shift) 조율창 — 현실적 환경(포르투나)과 주변의 협력을 차분히 살피는 시간'
      : '야간 섹트(Nocturnal Sect) 공명창 — 달과 직관의 랏이 깊어지며 핵심 통찰이 선명해지는 시간';

  const lunarPhaseTone =
    kst.day <= 10
      ? '상현 전반부 — 스피릿의 랏이 가리키는 방향으로 첫 발을 내딛기 좋은 개시 리듬'
      : kst.day <= 20
        ? '만월 절정기 — 포르투나와 에로스의 랏이 결실과 관계의 빛을 드러내는 확장 리듬'
        : '하현 수렴기 — 네메시스의 랏이 비추는 낡은 과제를 정리하고 비우는 정화 리듬';

  return {
    kstTimeLabel: kst.label,
    hellenisticSectWindow,
    lunarPhaseTone,
    temporalGuidance: `${hellenisticSectWindow} · ${lunarPhaseTone}에 맞추어 오늘 집중할 랏을 선택하십시오.`,
  };
}

function getSituationalLotsAudit(
  question: string | undefined,
  lots: HellenisticLotsReport['lots']
) {
  const q = (question || '').trim();
  if (/돈|재물|사업|투자|직장|커리어|승진|이직/.test(q)) {
    return {
      focusTheme: '현실 복록(포르투나)과 커리어 주도권(스피릿)',
      activeLotKey: `${lots.spirit.nameKo} & ${lots.fortune.nameKo}`,
      zodiacalReleasingNote: `${lots.spirit.zodiacSignKo}(${lots.spirit.house}하우스)의 주체적 결단과 ${lots.fortune.zodiacSignKo}(${lots.fortune.house}하우스)의 현실 기반을 나란히 맞물려 움직이십시오.`,
    };
  }
  if (/사랑|연애|관계|결혼|사람|매력|인연/.test(q)) {
    return {
      focusTheme: '영혼의 끌림(에로스)과 관계의 조화',
      activeLotKey: lots.eros.nameKo,
      zodiacalReleasingNote: `${lots.eros.zodiacSignKo}(${lots.eros.house}하우스)의 솔직한 매력과 온기를 자연스럽게 드러낼 때 인연의 문이 열립니다.`,
    };
  }
  if (/불안|시련|막힘|갈등|두려움|극복|고민/.test(q)) {
    return {
      focusTheme: '카르마 관문 돌파(네메시스)',
      activeLotKey: lots.nemesis.nameKo,
      zodiacalReleasingNote: `${lots.nemesis.zodiacSignKo}(${lots.nemesis.house}하우스)가 가리키는 두려움의 지점을 회피하지 않고 마주할 때 오히려 가장 큰 돌파력이 생깁니다.`,
    };
  }
  return {
    focusTheme: '4대 랏(포르투나·스피릿·에로스·네메시스)의 균형 조율',
    activeLotKey: `${lots.fortune.nameKo} & ${lots.spirit.nameKo}`,
    zodiacalReleasingNote: '환경적 복록(포르투나)과 내면의 의지(스피릿)가 어긋나지 않도록 오늘의 우선순위를 단순화하십시오.',
  };
}

/**
 * 헬레니즘 아라빅 랏 및 운명 타임로드 계산
 */
export function calculateHellenisticLots(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
  question?: string;
}): HellenisticLotsReport {
  const now = params.targetDate || new Date();
  const profile = params.profile;
  const basic = profile?.basic;
  let year = 1995, month = 5, day = 15, hour = 12, minute = 0;

  if (basic?.birthdate) {
    try {
      const res = resolveEffectiveSolarDate(basic.birthdate, basic.lunarSolar, basic.isLeapMonth ?? false);
      year = res.solarDate.year;
      month = res.solarDate.month;
      day = res.solarDate.day;
      const t = parseBirthTime(basic.birthtime);
      if (t) {
        hour = t.hour;
        minute = t.minute;
      }
    } catch (_) {}
  }

  // 주간생 / 야간생 판별 (오전 6시 ~ 오후 18시 주간생, 그 외 야간생)
  const isDayChart = hour >= 6 && hour < 18;

  // 천문 시드 도수 산출 (안정적 결정론 알고리즘)
  const dayOfYear = (month - 1) * 30.5 + day;
  const sunDeg = norm360(dayOfYear * (360 / 365.25) - 80); // 대략적인 황경
  const ascDeg = norm360(sunDeg + (hour + minute / 60) * 15 - 90);
  const moonDeg = norm360(sunDeg + ((day * 13.2 + hour * 0.55) % 360));
  const venusDeg = norm360(sunDeg + 28);
  const saturnDeg = norm360((year * 12.2 + dayOfYear * 0.033) % 360);

  // 1. Lot of Fortune (포르투나)
  // Day: Asc + Moon - Sun / Night: Asc + Sun - Moon
  const fortuneDeg = isDayChart
    ? norm360(ascDeg + moonDeg - sunDeg)
    : norm360(ascDeg + sunDeg - moonDeg);

  // 2. Lot of Spirit (스피릿)
  // Day: Asc + Sun - Moon / Night: Asc + Moon - Sun
  const spiritDeg = isDayChart
    ? norm360(ascDeg + sunDeg - moonDeg)
    : norm360(ascDeg + moonDeg - sunDeg);

  // 3. Lot of Eros (에로스)
  // Asc + Venus - Spirit
  const erosDeg = norm360(ascDeg + venusDeg - spiritDeg);

  // 4. Lot of Nemesis (네메시스)
  // Asc + Saturn - Fortune
  const nemesisDeg = norm360(ascDeg + saturnDeg - fortuneDeg);

  const fortuneSign = getZodiacFromDegree(fortuneDeg);
  const spiritSign = getZodiacFromDegree(spiritDeg);
  const erosSign = getZodiacFromDegree(erosDeg);
  const nemesisSign = getZodiacFromDegree(nemesisDeg);

  const fortuneHouse = getHouseFromAscendant(ascDeg, fortuneDeg);
  const spiritHouse = getHouseFromAscendant(ascDeg, spiritDeg);
  const erosHouse = getHouseFromAscendant(ascDeg, erosDeg);
  const nemesisHouse = getHouseFromAscendant(ascDeg, nemesisDeg);

  const lots = {
    fortune: {
      nameKo: '포르투나의 랏 (Lot of Fortune)',
      nameEng: 'Lot of Fortune',
      degree: fortuneDeg,
      zodiacSign: fortuneSign.name,
      zodiacSignKo: fortuneSign.ko,
      house: fortuneHouse,
      coreMeaning: `${fortuneSign.ko}(${fortuneHouse}하우스)에 깃든 물질적 그릇과 환경적 복록. 예상치 못한 귀인의 도움이나 현실적 결실이 맺히는 핵심 통로.`,
      powerAction: `${fortuneSign.element} 원소의 강점을 살려 주변 환경을 정돈하고 구체적인 실물 결과물을 만드세요.`,
    },
    spirit: {
      nameKo: '스피릿의 랏 (Lot of Spirit)',
      nameEng: 'Lot of Spirit',
      degree: spiritDeg,
      zodiacSign: spiritSign.name,
      zodiacSignKo: spiritSign.ko,
      house: spiritHouse,
      coreMeaning: `${spiritSign.ko}(${spiritHouse}하우스)에 위치한 영혼의 의지와 직업적 성취. 타인에게 휘둘리지 않고 스스로 판을 짤 때 폭발하는 천재성.`,
      powerAction: `남의 기준이 아닌 나의 내면 비전(${spiritSign.ko})에 따라 주도권을 쥐고 먼저 제안하세요.`,
    },
    eros: {
      nameKo: '에로스의 랏 (Lot of Eros)',
      nameEng: 'Lot of Eros',
      degree: erosDeg,
      zodiacSign: erosSign.name,
      zodiacSignKo: erosSign.ko,
      house: erosHouse,
      coreMeaning: `${erosSign.ko}(${erosHouse}하우스)에 맺힌 영혼의 이끌림과 매력 포인트. 사람들의 마음을 단번에 사로잡는 마성의 오라.`,
      powerAction: `가장 나다운 솔직한 감정 표현과 취향을 숨기지 말고 드러낼 때 인연의 운이 트입니다.`,
    },
    nemesis: {
      nameKo: '네메시스의 랏 (Lot of Nemesis)',
      nameEng: 'Lot of Nemesis',
      degree: nemesisDeg,
      zodiacSign: nemesisSign.name,
      zodiacSignKo: nemesisSign.ko,
      house: nemesisHouse,
      coreMeaning: `${nemesisSign.ko}(${nemesisHouse}하우스)의 카르마적 시련. 회피하지 않고 마주했을 때 인생 최대의 슈퍼파워로 변환되는 돌파구.`,
      powerAction: `불안과 완벽주의를 내려놓고, 가장 두려워했던 한 걸음을 오늘 가볍게 내딛으세요.`,
    },
  };

  const dominantLot = isDayChart ? '스피릿(의지와 커리어)' : '포르투나(직관과 물질적 환경)';
  const zodiacalPeakTheme = `${spiritSign.ko} ${spiritHouse}하우스 중심의 창조적 도약 사이클`;
  const cosmicAdvice = `당신은 ${isDayChart ? '태양의 빛을 타고난 주간 차트' : '달의 신비를 품은 야간 차트'}의 소유자입니다. 포르투나(${fortuneSign.ko})의 현실적 그릇 위에 스피릿(${spiritSign.ko})의 대담한 의지를 얹을 때 우주가 당신의 길을 가장 강력하게 엽니다.`;

  const temporalLotsRhythm = getTemporalLotsRhythm(now, isDayChart);
  const situationalLotsAudit = getSituationalLotsAudit(params.question, lots);
  const lotsSynthesisMatrix = {
    coreInsight: `${isDayChart ? '주간 섹트' : '야간 섹트'} 구조 위에서 [${situationalLotsAudit.activeLotKey}]가 ${situationalLotsAudit.focusTheme}을 비춥니다.`,
    recommendedAction: `${situationalLotsAudit.zodiacalReleasingNote} (${lots.spirit.powerAction})`,
    cautionNotice: `네메시스의 랏(${nemesisSign.ko} ${nemesisHouse}하우스)이 가리키는 완벽주의와 회피 심리를 경계하십시오.`,
  };

  return {
    engineVersion: HELLENISTIC_LOTS_ENGINE_VERSION,
    calculatedAtKst: temporalLotsRhythm.kstTimeLabel,
    isDayChart,
    chartTypeKo: isDayChart ? '주간생 (Day Chart / 태양 주도)' : '야간생 (Night Chart / 달 주도)',
    ascendantDegree: ascDeg,
    sunDegree: sunDeg,
    moonDegree: moonDeg,
    lots,
    dominantLot,
    zodiacalPeakTheme,
    situationalLotsAudit,
    temporalLotsRhythm,
    lotsSynthesisMatrix,
    cosmicAdvice,
    boundaryNotice: '본 결과는 헬레니즘 점성술 4대 아라빅 랏과 섹트 원리에 따른 정성적 상징 해석이며, 확정적 길흉 판정이 아닙니다.',
  };
}

export function formatHellenisticLotsPrompt(report: HellenisticLotsReport): string {
  return `[🏛️ 고대 헬레니즘 아라빅 랏 & 조디악 릴리싱 (Lots of Fortune & Spirit) 실측 데이터]
======================================================================
엔진 버전: ${report.engineVersion} | 연산 시각: ${report.calculatedAtKst}
차트 유형: ${report.chartTypeKo}
주도 랏(Dominant Lot): ${report.dominantLot}
도약 테마: ${report.zodiacalPeakTheme}
----------------------------------------------------------------------
1. 🌟 [포르투나의 랏 (Lot of Fortune)]:
   - 위치: ${report.lots.fortune.zodiacSignKo} (${report.lots.fortune.degree}° / ${report.lots.fortune.house}하우스)
   - 의미: ${report.lots.fortune.coreMeaning}
   - 개운 행동: ${report.lots.fortune.powerAction}

2. 🔥 [스피릿의 랏 (Lot of Spirit)]:
   - 위치: ${report.lots.spirit.zodiacSignKo} (${report.lots.spirit.degree}° / ${report.lots.spirit.house}하우스)
   - 의미: ${report.lots.spirit.coreMeaning}
   - 커리어 지침: ${report.lots.spirit.powerAction}

3. 💖 [에로스의 랏 (Lot of Eros)]:
   - 위치: ${report.lots.eros.zodiacSignKo} (${report.lots.eros.degree}° / ${report.lots.eros.house}하우스)
   - 매력과 인연: ${report.lots.eros.coreMeaning}

4. 🛡️ [네메시스의 랏 (Lot of Nemesis)]:
   - 위치: ${report.lots.nemesis.zodiacSignKo} (${report.lots.nemesis.degree}° / ${report.lots.nemesis.house}하우스)
   - 카르마 돌파구: ${report.lots.nemesis.coreMeaning}

5. 🧭 [질문 맥락 감사 & KST 시공간 리듬]:
   - 초점 테마: ${report.situationalLotsAudit.focusTheme} (${report.situationalLotsAudit.activeLotKey})
   - 조디악 릴리싱 조언: ${report.situationalLotsAudit.zodiacalReleasingNote}
   - KST 섹트 시간창: ${report.temporalLotsRhythm.hellenisticSectWindow} / ${report.temporalLotsRhythm.lunarPhaseTone}
   - 시공간 지침: ${report.temporalLotsRhythm.temporalGuidance}

6. 🏛️ [아라빅 랏 교차 매트릭스]:
   - 핵심 통찰: ${report.lotsSynthesisMatrix.coreInsight}
   - 권고 실행: ${report.lotsSynthesisMatrix.recommendedAction}
   - 주의 경계: ${report.lotsSynthesisMatrix.cautionNotice}

★ 조디악 릴리싱 핵심 전언:
"${report.cosmicAdvice}"
- 해석 경계: ${report.boundaryNotice}
======================================================================`;
}
