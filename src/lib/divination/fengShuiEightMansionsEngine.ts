/**
 * =========================================================================
 * LUCKEY 동양 정통 풍수 8택(八宅) 공간 에너지 & 24방위 길흉 엔진
 * (Feng Shui Eight Mansions & Spatial Energy Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 주역(周易) 8괘 수리와 황제택경(黃帝宅經), 양택삼요(陽宅三要)에 기원한
 * 동양 정통 이기풍수(理氣風水) 팔택명괘(八宅命卦) 원전.
 * 
 * 1. 본명괘(本命卦, Kua / Gua Number):
 *    - 출생연도와 생체 성별에 따른 선천 8괘(건·태·이·진·손·감·간·곤) 도출
 * 2. 동서사택(東西四宅) 대분류:
 *    - 동사택(東四宅): 감(坎, 1) · 진(震, 3) · 손(巽, 4) · 이(離, 9)
 *    - 서사택(西四宅): 곤(坤, 2) · 건(乾, 6) · 태(兌, 7) · 간(艮, 8)
 * 3. 4대 길방(Four Auspicious Directions):
 *    - 생기(生氣, Sheng Chi): 사업 번영, 활력 증진, 최고 길성(탐랑 목성)
 *    - 천의(天醫, Tien Yi): 건강 치유, 정신적 평온, 귀인 조력(거문 토성)
 *    - 연년(延年, Nien Yen): 대인관계 조화, 부부/가정 화목, 장수(무곡 금성)
 *    - 복위(伏位, Fu Wei): 내면 안정, 학업 집중, 명상과 평화(좌보 목성)
 * 4. 4대 흉방(Four Inauspicious Directions):
 *    - 절명(絕命, Chueh Ming): 기력 소진, 파재와 질병 주의(파군 금성)
 *    - 오귀(五鬼, Wu Kwei): 분쟁, 구설수, 화재 및 충돌(염정 화성)
 *    - 육살(六煞, Liu Sha): 정서적 혼란, 인간관계 트러블(문곡 수성)
 *    - 화해(禍害, Huo Hai): 사소한 장애, 피로감, 낭비(녹존 토성)
 * 5. 일상 공간 처방:
 *    - 업무 데스크 지향 방위, 침실 두침(머리 방향) 방위, 공간 명당 화살표
 */

import type { UserProfile } from '../sharedState';

export const FENG_SHUI_EIGHT_MANSIONS_VERSION = 'LUCKEY-FENG-SHUI-EIGHT-MANSIONS-v2.0.0';

export type TrigramName = '감(坎, 1궁)' | '곤(坤, 2궁)' | '진(震, 3궁)' | '손(巽, 4궁)' | '건(乾, 6궁)' | '태(兌, 7궁)' | '간(艮, 8궁)' | '이(離, 9궁)';

export interface AuspiciousDirections {
  shengChi: string; // 생기 (사업/활력 최고 길방)
  tienYi: string;   // 천의 (건강/귀인 길방)
  nienYen: string;  // 연년 (관계/화목 길방)
  fuWei: string;    // 복위 (집중/안정 길방)
}

export interface InauspiciousDirections {
  chuehMing: string; // 절명 (최대 흉방)
  wuKwei: string;    // 오귀 (구설/분쟁 흉방)
  liuSha: string;    // 육살 (갈등 흉방)
  huoHai: string;    // 화해 (피로/장애 흉방)
}

export interface SpatialArrangementPrescription {
  deskFacingDirection: string;  // 업무/학업 데스크 권장 방위
  bedHeadDirection: string;     // 숙면을 위한 침대 머리 권장 방위
  meetingSeatAdvice: string;    // 비즈니스 미팅/협상 시 유리한 좌석 위치
  remedyColorAndElement: string; // 공간 기운 조화 인테리어 소품/색상 처방
}

export interface FengShuiEightMansionsReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  kuaNumber: number;
  kuaTrigram: TrigramName;
  mansionGroup: '동사택(東四宅)' | '서사택(西四宅)';
  auspiciousDirections: AuspiciousDirections;
  inauspiciousDirections: InauspiciousDirections;
  prescription: SpatialArrangementPrescription;
  spatialEnergyVitalityScore: number; // 내부 호환용 0 ~ 100 (프롬프트 비노출)
  situationalFengShuiAudit: {
    focusTheme: string;
    spatialNote: string;
    placementTip: string;
  };
  temporalFengShuiRhythm: {
    kstTimeLabel: string;
    sunDirectionWindow: string;
    seasonalSpatialTone: string;
    temporalGuidance: string;
  };
  fengShuiSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  spatialHarmonyGuidance: string;
  boundaryNotice: string;
}

interface TrigramDirectionTable {
  shengChi: string;
  tienYi: string;
  nienYen: string;
  fuWei: string;
  chuehMing: string;
  wuKwei: string;
  liuSha: string;
  huoHai: string;
}

const DIRECTION_MAP: Record<number, TrigramDirectionTable> = {
  1: { // 감(坎, 수) - 동사택
    shengChi: '동남쪽 (손방, 巽)',
    tienYi: '동쪽 (진방, 震)',
    nienYen: '남쪽 (이방, 離)',
    fuWei: '북쪽 (감방, 坎)',
    chuehMing: '서남쪽 (곤방, 坤)',
    wuKwei: '동북쪽 (간방, 艮)',
    liuSha: '서북쪽 (건방, 乾)',
    huoHai: '서쪽 (태방, 兌)',
  },
  2: { // 곤(坤, 토) - 서사택
    shengChi: '동북쪽 (간방, 艮)',
    tienYi: '서쪽 (태방, 兌)',
    nienYen: '서북쪽 (건방, 乾)',
    fuWei: '서남쪽 (곤방, 坤)',
    chuehMing: '북쪽 (감방, 坎)',
    wuKwei: '동남쪽 (손방, 巽)',
    liuSha: '남쪽 (이방, 離)',
    huoHai: '동쪽 (진방, 震)',
  },
  3: { // 진(震, 목) - 동사택
    shengChi: '남쪽 (이방, 離)',
    tienYi: '북쪽 (감방, 坎)',
    nienYen: '동남쪽 (손방, 巽)',
    fuWei: '동쪽 (진방, 震)',
    chuehMing: '서쪽 (태방, 兌)',
    wuKwei: '서북쪽 (건방, 乾)',
    liuSha: '동북쪽 (간방, 艮)',
    huoHai: '서남쪽 (곤방, 坤)',
  },
  4: { // 손(巽, 목) - 동사택
    shengChi: '북쪽 (감방, 坎)',
    tienYi: '남쪽 (이방, 離)',
    nienYen: '동쪽 (진방, 震)',
    fuWei: '동남쪽 (손방, 巽)',
    chuehMing: '동북쪽 (간방, 艮)',
    wuKwei: '서남쪽 (곤방, 坤)',
    liuSha: '서쪽 (태방, 兌)',
    huoHai: '서북쪽 (건방, 乾)',
  },
  6: { // 건(乾, 금) - 서사택
    shengChi: '서쪽 (태방, 兌)',
    tienYi: '동북쪽 (간방, 艮)',
    nienYen: '서남쪽 (곤방, 坤)',
    fuWei: '서북쪽 (건방, 乾)',
    chuehMing: '남쪽 (이방, 離)',
    wuKwei: '동쪽 (진방, 震)',
    liuSha: '북쪽 (감방, 坎)',
    huoHai: '동남쪽 (손방, 巽)',
  },
  7: { // 태(兌, 금) - 서사택
    shengChi: '서북쪽 (건방, 乾)',
    tienYi: '서남쪽 (곤방, 坤)',
    nienYen: '동북쪽 (간방, 艮)',
    fuWei: '서쪽 (태방, 兌)',
    chuehMing: '동쪽 (진방, 震)',
    wuKwei: '남쪽 (이방, 離)',
    liuSha: '동남쪽 (손방, 巽)',
    huoHai: '북쪽 (감방, 坎)',
  },
  8: { // 간(艮, 토) - 서사택
    shengChi: '서남쪽 (곤방, 坤)',
    tienYi: '서북쪽 (건방, 乾)',
    nienYen: '서쪽 (태방, 兌)',
    fuWei: '동북쪽 (간방, 艮)',
    chuehMing: '동남쪽 (손방, 巽)',
    wuKwei: '북쪽 (감방, 坎)',
    liuSha: '동쪽 (진방, 震)',
    huoHai: '남쪽 (이방, 離)',
  },
  9: { // 이(離, 화) - 동사택
    shengChi: '동쪽 (진방, 震)',
    tienYi: '동남쪽 (손방, 巽)',
    nienYen: '북쪽 (감방, 坎)',
    fuWei: '남쪽 (이방, 離)',
    chuehMing: '서북쪽 (건방, 乾)',
    wuKwei: '서쪽 (태방, 兌)',
    liuSha: '서남쪽 (곤방, 坤)',
    huoHai: '동북쪽 (간방, 艮)',
  },
};

const TRIGRAM_NAMES: Record<number, TrigramName> = {
  1: '감(坎, 1궁)',
  2: '곤(坤, 2궁)',
  3: '진(震, 3궁)',
  4: '손(巽, 4궁)',
  6: '건(乾, 6궁)',
  7: '태(兌, 7궁)',
  8: '간(艮, 8궁)',
  9: '이(離, 9궁)',
};

function getTemporalFengShuiRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const sunDirectionWindow =
    hour >= 5 && hour < 11
      ? '동방 묘시(卯時) 채광창 — 동쪽·동남쪽의 맑은 아침 기운으로 공간을 환기하는 시간'
      : hour >= 11 && hour < 17
        ? '남방 오시(午時) 활발창 — 밝은 조명과 정돈된 책상 배치로 집중력을 높이는 시간'
        : hour >= 17 && hour < 22
          ? '서방 유시(酉時) 정돈창 — 하루의 흐름을 갈무리하며 소지품을 제자리에 정리하는 시간'
          : '북방 자시(子時) 안식창 — 불필요한 빛을 줄이고 천의·연년 방위로 숙면을 취하는 시간';

  const seasonalSpatialTone =
    month >= 3 && month <= 5
      ? '봄 · 동방 생기 발흥기 (창문 환기와 푸른 식물로 공간의 막힘을 푸는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 남방 광명 확산기 (시원한 동선 확보와 과열된 기운의 조율이 필요한 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 서방 수렴 정돈기 (불필요한 물건을 비워 맑은 기운을 들이는 시기)'
          : '겨울 · 북방 온기 비축기 (따뜻한 조명과 포근한 배치로 내실을 지키는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    sunDirectionWindow,
    seasonalSpatialTone,
    temporalGuidance: `${sunDirectionWindow} · ${seasonalSpatialTone}의 흐름에 맞추어 머무는 자리의 방향을 가볍게 살피십시오.`,
  };
}

export function calculateFengShuiEightMansions(
  profileOrParams: UserProfile | null | undefined | { profile?: UserProfile | null; contextText?: string; now?: Date },
  contextText?: string
): FengShuiEightMansionsReport {
  const profile = (profileOrParams && 'profile' in profileOrParams) ? profileOrParams.profile : (profileOrParams as UserProfile | null | undefined);
  const effectiveContextText = contextText || (profileOrParams && 'contextText' in profileOrParams ? profileOrParams.contextText : '');
  const now = (profileOrParams && 'now' in profileOrParams && profileOrParams.now) ? profileOrParams.now : new Date();
  const birthYear = profile?.basic?.birthdate ? parseInt(profile.basic.birthdate.slice(0, 4), 10) || 1990 : 1990;
  const isFemale = profile?.basic?.gender === 'female';

  // 정통 본명괘(Kua Number) 수리 공식
  // 출생연도 마지막 두 자리 합산
  const lastTwoDigits = birthYear % 100;
  const sumDigits = Math.floor(lastTwoDigits / 10) + (lastTwoDigits % 10);
  const singleDigitSum = sumDigits > 9 ? Math.floor(sumDigits / 10) + (sumDigits % 10) : sumDigits;

  let kua = 1;
  if (isFemale) {
    // 여성: 4를 더한 후 9로 나눈 나머지
    kua = (singleDigitSum + 4) % 9;
    if (kua === 0) kua = 9;
    if (kua === 5) kua = 8; // 여성 5는 8궁(간)으로 대체
  } else {
    // 남성: 10(또는 11)에서 뺀 후 9로 나눈 나머지
    const raw = (11 - (singleDigitSum % 9)) % 9;
    kua = raw === 0 ? 9 : raw;
    if (kua === 5) kua = 2; // 남성 5는 2궁(곤)으로 대체
  }

  // 안전 보정
  if (!DIRECTION_MAP[kua]) {
    kua = 1;
  }

  const trigramName = TRIGRAM_NAMES[kua];
  const isEastGroup = kua === 1 || kua === 3 || kua === 4 || kua === 9;
  const mansionGroup = isEastGroup ? '동사택(東四宅)' : '서사택(西四宅)';

  const table = DIRECTION_MAP[kua];
  const auspiciousDirections: AuspiciousDirections = {
    shengChi: table.shengChi,
    tienYi: table.tienYi,
    nienYen: table.nienYen,
    fuWei: table.fuWei,
  };

  const inauspiciousDirections: InauspiciousDirections = {
    chuehMing: table.chuehMing,
    wuKwei: table.wuKwei,
    liuSha: table.liuSha,
    huoHai: table.huoHai,
  };

  const deskFacingDirection = `${auspiciousDirections.shengChi} 또는 ${auspiciousDirections.fuWei}`;
  const bedHeadDirection = `${auspiciousDirections.tienYi} 또는 ${auspiciousDirections.nienYen}`;
  const meetingSeatAdvice = `상대방을 마주 볼 때 등을 견고한 벽에 기대고, 시선은 당신의 생기 방향인 [${auspiciousDirections.shengChi}]을 향하도록 착석하십시오.`;

  let remedyColorAndElement = '따뜻한 우드 톤 가구와 싱그러운 관엽식물 (목 기운 보강)';
  if (kua === 1) remedyColorAndElement = '단정한 화이트/메탈릭 소품과 맑은 수경 분수 (금생수 조화)';
  else if (kua === 2 || kua === 8) remedyColorAndElement = '도자기 화병과 은은한 황토/테라코타 웜톤 조명 (토 기운 안정)';
  else if (kua === 6 || kua === 7) remedyColorAndElement = '천연 원석 크리스털과 깔끔한 메탈 프레임 (토생금 결단력)';
  else if (kua === 9) remedyColorAndElement = '풍성한 녹색 식물과 생동감 넘치는 온화한 조명 (목생화 광채)';

  const prescription: SpatialArrangementPrescription = {
    deskFacingDirection,
    bedHeadDirection,
    meetingSeatAdvice,
    remedyColorAndElement,
  };

  const textHash = (effectiveContextText || '').length * 7;
  const spatialEnergyVitalityScore = 78 + ((birthYear + textHash) % 20); // 78 ~ 97점

  const spatialHarmonyGuidance = `당신의 타고난 본명괘는 [${trigramName}]으로 [${mansionGroup}]에 속합니다. 업무 시에는 [${auspiciousDirections.shengChi}]을 향해 앉아 왕성한 추진력을 얻고, 취침 시 머리는 [${bedHeadDirection}]으로 두어 심신의 치유와 인간관계 안정을 도모하십시오. 반면 [${inauspiciousDirections.chuehMing}] 방향은 정면 응시나 장시간 휴식을 피하는 것이 길합니다.`;

  const temporalFengShuiRhythm = getTemporalFengShuiRhythm(now);
  const q = (effectiveContextText || '').trim();
  const situationalFengShuiAudit = /이사|집|방|자리|책상|일|사업|공부/.test(q)
    ? {
        focusTheme: '생기·복위 방위 기반 업무 및 거주 공간 최적화',
        spatialNote: `책상이나 주된 시선은 [${auspiciousDirections.shengChi}] 또는 [${auspiciousDirections.fuWei}]를 향하게 두는 것이 유리합니다.`,
        placementTip: prescription.remedyColorAndElement,
      }
    : /잠|건강|피곤|휴식|관계|가족/.test(q)
      ? {
          focusTheme: '천의·연년 방위 기반 회복과 관계 조화',
          spatialNote: `휴식과 숙면 시 머리 방향은 [${bedHeadDirection}]으로 두어 기운을 보충하십시오.`,
          placementTip: '침대 주변의 뾰족한 모서리나 어수선한 짐을 정리해 부드러운 동선을 유지하십시오.',
        }
      : {
          focusTheme: `[${mansionGroup}] 본명괘 8방위 일상 조화`,
          spatialNote: spatialHarmonyGuidance,
          placementTip: prescription.remedyColorAndElement,
        };

  const fengShuiSynthesisMatrix = {
    coreInsight: `[${trigramName} · ${mansionGroup}] 체질에 맞춘 4길방(${auspiciousDirections.shengChi} 등) 활용이 핵심입니다.`,
    recommendedAction: `업무 시 [${auspiciousDirections.shengChi}], 휴식 시 [${bedHeadDirection}] 지향 + ${prescription.remedyColorAndElement}`,
    cautionNotice: `장시간 정면 응시나 침대 머리 방향이 [${inauspiciousDirections.chuehMing}]에 고정되지 않도록만 가볍게 피하십시오.`,
  };

  return {
    engineVersion: FENG_SHUI_EIGHT_MANSIONS_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalFengShuiRhythm.kstTimeLabel,
    kuaNumber: kua,
    kuaTrigram: trigramName,
    mansionGroup,
    auspiciousDirections,
    inauspiciousDirections,
    prescription,
    spatialEnergyVitalityScore,
    situationalFengShuiAudit,
    temporalFengShuiRhythm,
    fengShuiSynthesisMatrix,
    spatialHarmonyGuidance,
    boundaryNotice: '본 결과는 동양 팔택명괘(八宅命卦) 방위 원리를 활용한 정성적 공간 배치 참고용이며, 확정적 길흉 판정이 아닙니다.',
  };
}

export function formatFengShuiEightMansionsPrompt(report: FengShuiEightMansionsReport): string {
  return `### 🧭 동양 정통 풍수 8택(八宅) 공간 에너지 & 24방위 길흉 엔진 (${FENG_SHUI_EIGHT_MANSIONS_VERSION})
- **연산 시각**: ${report.calculatedAtKst}
- **선천 본명괘(本命卦)**: ${report.kuaTrigram} [${report.mansionGroup}]
- **4대 길방(Auspicious Directions)**:
  - 🌟 생기(生氣, 최고 활력/사업): ${report.auspiciousDirections.shengChi}
  - 🕊️ 천의(天醫, 건강/귀인 원조): ${report.auspiciousDirections.tienYi}
  - 🤝 연년(延年, 관계 화목/장수): ${report.auspiciousDirections.nienYen}
  - 🧘 복위(伏位, 집중력/내면 안정): ${report.auspiciousDirections.fuWei}
- **4대 흉방(Inauspicious Directions - 주의 요망)**:
  - ⚠️ 절명(絕命, 기력 소진 방위): ${report.inauspiciousDirections.chuehMing} | 오귀(五鬼, 구설/분쟁): ${report.inauspiciousDirections.wuKwei}
  - ⚠️ 육살(六煞, 갈등/혼란 방위): ${report.inauspiciousDirections.liuSha} | 화해(禍害, 피로/장애): ${report.inauspiciousDirections.huoHai}
- **질문 맥락 감사 (${report.situationalFengShuiAudit.focusTheme})**: ${report.situationalFengShuiAudit.spatialNote} / 팁: ${report.situationalFengShuiAudit.placementTip}
- **KST 시공간 방위 리듬**: ${report.temporalFengShuiRhythm.sunDirectionWindow} / ${report.temporalFengShuiRhythm.seasonalSpatialTone}
  - *시공간 지침*: ${report.temporalFengShuiRhythm.temporalGuidance}
- **팔택 교차 매트릭스**: 핵심(${report.fengShuiSynthesisMatrix.coreInsight}) | 실행(${report.fengShuiSynthesisMatrix.recommendedAction}) | 주의(${report.fengShuiSynthesisMatrix.cautionNotice})
- **일상 공간 배치 처방(Spatial Arrangement)**:
  - 업무/학업 데스크 지향 방위: ${report.prescription.deskFacingDirection}
  - 침대 두침(머리 방향) 권장 방위: ${report.prescription.bedHeadDirection}
  - 비즈니스 협상 좌석 가이드: ${report.prescription.meetingSeatAdvice}
  - 공간 보완 인테리어: ${report.prescription.remedyColorAndElement}
- **풍수 공간 조화 나침반**: ${report.spatialHarmonyGuidance}
- **해석 경계**: ${report.boundaryNotice}`;
}
