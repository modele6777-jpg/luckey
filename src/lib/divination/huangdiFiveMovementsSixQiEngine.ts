/**
 * =========================================================================
 * LUCKEY 황제명리(黃帝命理) & 오운육기(五運六氣) 천기대운 기상의학 엔진
 * (Huangdi Five Movements & Six Qi Cosmic Meteorological Medicine Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 《황제내경(黃帝內經)·소문(素問)》 천원기대론(天元紀大論), 오운행대론(五運行大論),
 * 육미지대론(六微旨大論), 기교변대론(氣交變大論) 등 운기칠편(運氣七篇) 정통 원전.
 * 
 * 대우주의 기후 변화(천기)와 인체의 오장육부 생리(인기) 사이의 필연적 상호작용 규명:
 * 1. 세운/대운 (Five Movements / 五運):
 *    - 연간(Year Stem)의 오운 화합:
 *      갑기(甲己) 토운(土), 을경(乙庚) 금운(金), 병신(丙辛) 수운(水),
 *      정임(丁壬) 목운(木), 무계(戊癸) 화운(火).
 *    - 양간(甲丙戊庚壬)은 태과(太過 - 기운이 지나침),
 *      음간(乙丁己辛癸)은 불급(不及 - 기운이 모자라 억압당함).
 * 2. 육기 사천(司天)과 재천(在泉) (Six Qi Heaven & Earth Rulers):
 *    - 연지(Year Branch)에 따른 상반기 기후주재(사천)와 하반기 기후주재(재천):
 *      자오(子午) 소음군화 사천 / 양명조금 재천
 *      축미(丑未) 태음습토 사천 / 태양한수 재천
 *      인신(寅申) 소양상화 사천 / 궐음풍목 재천
 *      묘유(卯酉) 양명조금 사천 / 소음군화 재천
 *      진술(辰戌) 태양한수 사천 / 태음습토 재천
 *      사해(巳亥) 궐음풍목 사천 / 소양상화 재천
 * 3. 기상의학적 장부(臟腑) 생체 기상 취약점 및 오행 약선·호흡 처방:
 *    - 태과/불급에 따른 승복(勝復) 병리 분석 및 자연 치유 나침반
 */

import type { UserProfile } from '../sharedState';

export const HUANGDI_YUNQI_VERSION = 'LUCKEY-HUANGDI-YUNQI-v2.0.0';

export interface FiveMovementYear {
  element: '목(木)' | '화(火)' | '토(土)' | '금(金)' | '수(水)';
  movementPolarity: '태과(太過 - 넘침)' | '불급(不及 - 모자람)';
  movementName: string;
  cosmicFeature: string;
}

export interface SixQiHeavenEarth {
  heavenRulerSiTian: string;        // 사천 (상반기 주재)
  earthRulerZaiQuan: string;        // 재천 (하반기 주재)
  climaticCharacteristics: string;  // 천기 기후 특성
}

export interface MeteorologicalMedicineRx {
  susceptibleOrgans: string;        // 주의 장부 및 경락
  pathologicalTendency: string;     // 취약 병리 증상
  dietaryPrescription: string;      // 오미(五味) 약선 식이 처방
  breathMindHarmonization: string;  // 기공 호흡 및 심신 안정법
}

export interface HuangdiFiveMovementsSixQiReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  birthYearGanZhi: string;
  fiveMovement: FiveMovementYear;
  sixQi: SixQiHeavenEarth;
  medicineRx: MeteorologicalMedicineRx;
  cosmicResilienceScore: number;     // 내부 호환용 0 ~ 100 (프롬프트 비노출)
  situationalYunqiAudit: {
    focusTheme: string;
    climateNote: string;
    careTip: string;
  };
  temporalYunqiRhythm: {
    kstTimeLabel: string;
    organWatchWindow: string;
    seasonalYunqiTone: string;
    temporalGuidance: string;
  };
  yunqiSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  boundaryNotice: string;
  synthesisMessage: string;
}

function getTemporalYunqiRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const organWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 양기 승발창 — 따뜻한 미온수로 비위(脾胃)를 깨우고 맑은 공기를 들이마시는 시간'
      : hour >= 11 && hour < 17
        ? '정오 심소장 순환창 — 과로를 피하고 오미(五味) 균형 식으로 기력을 보충하는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 신폐 수렴창 — 족욕과 호흡 이완으로 하루의 열기와 긴장을 가라앉히는 시간'
          : '심야 간담 장혈(藏血)창 — 일찍 잠들어 간과 신의 진액을 회복하는 시간';

  const seasonalYunqiTone =
    month >= 3 && month <= 5
      ? '봄 · 궐음풍목 절기 (간기 울체를 풀고 부드러운 스트레칭이 필요한 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 소음군화·태음습토 절기 (심열과 습기를 다스리며 수분을 보충하는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 양명조금 절기 (폐와 기관지 진액을 촉촉히 지키는 시기)'
          : '겨울 · 태양한수 절기 (신장의 정기를 보온하고 무리한 발한을 삼가는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    organWatchWindow,
    seasonalYunqiTone,
    temporalGuidance: `${organWatchWindow} · ${seasonalYunqiTone}의 천기에 맞추어 몸의 균형을 돌보십시오.`,
  };
}

const GAN_LIST = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const ZHI_LIST = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

export function calculateHuangdiFiveMovementsSixQi(
  profile?: UserProfile,
  nowArg?: Date,
  question?: string
): HuangdiFiveMovementsSixQiReport {
  const now = nowArg || new Date();
  const q = (question || '').trim();
  const birthStr = profile?.basic?.birthdate || '1990-01-01';
  const parts = birthStr.split('-');
  const year = parseInt(parts[0], 10) || 1990;

  // 간지 계산 (서기 4년이 갑자년)
  const offset = (year - 4) % 60;
  const ganIdx = ((offset % 10) + 10) % 10;
  const zhiIdx = ((offset % 12) + 12) % 12;
  const gan = GAN_LIST[ganIdx];
  const zhi = ZHI_LIST[zhiIdx];
  const birthYearGanZhi = `${gan}${zhi}년 (${year})`;

  // 1. 오운 (Five Movements) 분석
  let element: FiveMovementYear['element'] = '토(土)';
  if (gan === '갑' || gan === '기') element = '토(土)';
  else if (gan === '을' || gan === '경') element = '금(金)';
  else if (gan === '병' || gan === '신') element = '수(水)';
  else if (gan === '정' || gan === '임') element = '목(木)';
  else if (gan === '무' || gan === '계') element = '화(火)';

  const isYangGan = ['갑', '병', '무', '경', '임'].includes(gan);
  const movementPolarity: FiveMovementYear['movementPolarity'] = isYangGan ? '태과(太過 - 넘침)' : '불급(不及 - 모자람)';

  let movementName = `${element}운 ${movementPolarity}`;
  let cosmicFeature = '';
  if (element === '목(木)') {
    cosmicFeature = isYangGan
      ? '풍기(風氣)가 태과하여 만물이 거세게 약동하며 비토(脾土)를 극하기 쉬운 천기'
      : '목기가 불급하여 조금(燥金)의 침범을 받기 쉬우며 간담의 기운이 위축되는 천기';
  } else if (element === '화(火)') {
    cosmicFeature = isYangGan
      ? '열기(熱氣)가 태과하여 화염이 맹렬하고 폐금(肺金)을 억압하기 쉬운 천기'
      : '화기가 불급하여 한수(寒水)의 억압을 받아 심양(心陽)이 허해지기 쉬운 천기';
  } else if (element === '토(土)') {
    cosmicFeature = isYangGan
      ? '습기(濕氣)가 태과하여 대지에 습열이 가득 차고 신수(腎水)를 침범하기 쉬운 천기'
      : '토기가 불급하여 풍목(風木)의 극을 받아 소화 비위가 연약해지기 쉬운 천기';
  } else if (element === '금(金)') {
    cosmicFeature = isYangGan
      ? '조기(燥氣)가 태과하여 숙살지기가 서늘하게 간목(肝木)을 쳐내기 쉬운 천기'
      : '금기가 불급하여 염화(炎火)의 침범을 받아 호흡기와 피부가 건조해지기 쉬운 천기';
  } else {
    cosmicFeature = isYangGan
      ? '한기(寒氣)가 태과하여 엄동설한의 냉기가 심화(心火)를 끄기 쉬운 천기'
      : '수기가 불급하여 습토(濕土)의 침범을 받아 신장과 방광 수액대사가 막히기 쉬운 천기';
  }

  // 2. 육기 사천/재천 (Six Qi)
  let heavenRulerSiTian = '';
  let earthRulerZaiQuan = '';
  let climaticCharacteristics = '';

  if (zhi === '자' || zhi === '오') {
    heavenRulerSiTian = '소음군화(少陰君火) 사천';
    earthRulerZaiQuan = '양명조금(陽明燥金) 재천';
    climaticCharacteristics = '상반기는 따스한 열기가 주도하고, 하반기는 청량하고 건조한 숙살지기가 감싸는 기후';
  } else if (zhi === '축' || zhi === '미') {
    heavenRulerSiTian = '태음습토(太陰濕土) 사천';
    earthRulerZaiQuan = '태양한수(太陽寒水) 재천';
    climaticCharacteristics = '상반기는 눅눅한 안개와 습기가 머물고, 하반기는 차가운 냉기가 응결되는 기후';
  } else if (zhi === '인' || zhi === '신') {
    heavenRulerSiTian = '소양상화(少陽相火) 사천';
    earthRulerZaiQuan = '궐음풍목(厥陰風木) 재천';
    climaticCharacteristics = '상반기는 불꽃같은 상화가 치솟고, 하반기는 변화무쌍한 바람과 파동이 일어나는 기후';
  } else if (zhi === '묘' || zhi === '유') {
    heavenRulerSiTian = '양명조금(陽明燥金) 사천';
    earthRulerZaiQuan = '소음군화(少陰君火) 재천';
    climaticCharacteristics = '상반기는 메마르고 서늘한 조기가 지배하고, 하반기는 잔잔한 온열이 스며드는 기후';
  } else if (zhi === '진' || zhi === '술') {
    heavenRulerSiTian = '태양한수(太陽寒水) 사천';
    earthRulerZaiQuan = '태음습토(太陰濕土) 재천';
    climaticCharacteristics = '상반기는 차가운 비와 한기가 엄습하고, 하반기는 묵직한 대지 습기가 응축되는 기후';
  } else {
    heavenRulerSiTian = '궐음풍목(厥陰風木) 사천';
    earthRulerZaiQuan = '소양상화(少陽相火) 재천';
    climaticCharacteristics = '상반기는 만물을 흔드는 풍목이 약동하고, 하반기는 더운 열기가 지속되는 기후';
  }

  // 3. 기상의학적 처방
  let susceptibleOrgans = '';
  let pathologicalTendency = '';
  let dietaryPrescription = '';
  let breathMindHarmonization = '';

  if (element === '목(木)') {
    susceptibleOrgans = '간(肝)·담(膽) 및 비위(脾胃)';
    pathologicalTendency = isYangGan ? '간양상항, 두통, 어지럼증, 신경성 소화불량' : '간혈허, 안구 건조, 근육 경련, 만성 피로';
    dietaryPrescription = '단맛(甘味: 대추, 찹쌀, 꿀)으로 간기를 완화하고 구기자차와 녹황색 채소 섭취';
    breathMindHarmonization = '허사(噓詞) 호흡법으로 간의 울화를 내쉬고 숲길 산책을 통한 시각적 이완';
  } else if (element === '화(火)') {
    susceptibleOrgans = '심(心)·소장(小腸) 및 폐(肺)';
    pathologicalTendency = isYangGan ? '심화 항진, 가슴 두근거림, 불면증, 구내염' : '심양 허약, 손발 냉증, 가슴 답답함, 기력 저하';
    dietaryPrescription = '신맛(酸味: 오미자, 매실)으로 심기를 수렴하고 쓴맛 채소 및 맥문동차 음용';
    breathMindHarmonization = '가사(呵詞) 호흡법으로 심열을 다스리고 미온수 족욕과 저녁 명상';
  } else if (element === '토(土)') {
    susceptibleOrgans = '비(脾)·위(胃) 및 신(腎)';
    pathologicalTendency = isYangGan ? '복부 팽만, 수액 정체, 붓기, 무거운 피로감' : '식욕 부진, 연변, 만성 위염, 기허 무력감';
    dietaryPrescription = '매운맛(辛味)으로 습을 날리고 생각차, 율무, 단호박으로 비위 중초 보강';
    breathMindHarmonization = '호사(呼詞) 호흡법으로 비토를 안정시키고 식후 가벼운 15분 평지 보행';
  } else if (element === '금(金)') {
    susceptibleOrgans = '폐(肺)·대장(大腸) 및 간(肝)';
    pathologicalTendency = isYangGan ? '마른 기침, 피부 가려움, 변비, 인후 건조' : '호흡기 면역 저하, 잦은 감기, 맑은 콧물, 무기력';
    dietaryPrescription = '쓴맛(苦味)으로 화기를 맑히고 도라지, 배, 백목이버섯으로 진액 보충';
    breathMindHarmonization = '이사(呬詞) 호흡법으로 폐기를 맑히고 복식 호흡을 통한 폐활량 증진';
  } else {
    susceptibleOrgans = '신(腎)·방광(膀胱) 및 심(心)';
    pathologicalTendency = isYangGan ? '하복부 냉증, 요통, 부종, 관절 시림' : '신음 부족, 식은땀, 이명, 만성 번아웃';
    dietaryPrescription = '단맛(甘味)과 짠맛을 조화시키며 검은콩, 흑임자, 호두, 구기자 섭취';
    breathMindHarmonization = '취사(吹詞) 호흡법으로 신수를 데우고 허리 명문혈 온열 찜질';
  }

  const cosmicResilienceScore = 78 + (year % 19);

  const synthesisMessage = `당신의 선천 천기는 [${movementName}]과 [${heavenRulerSiTian} / ${earthRulerZaiQuan}]의 기운을 타고났습니다. ${susceptibleOrgans}의 조화에 유의하며, "${dietaryPrescription}"을 실천할 때 천인합일(天人合一)의 강건함을 누립니다.`;

  const temporalYunqiRhythm = getTemporalYunqiRhythm(now);
  const situationalYunqiAudit = /건강|피곤|몸|수면|식단/.test(q)
    ? {
        focusTheme: `${susceptibleOrgans} 중심 운기 섭생`,
        climateNote: cosmicFeature,
        careTip: dietaryPrescription,
      }
    : {
        focusTheme: `${movementName} · ${heavenRulerSiTian}`,
        climateNote: climaticCharacteristics,
        careTip: breathMindHarmonization,
      };

  const yunqiSynthesisMatrix = {
    coreInsight: `[${birthYearGanZhi}] 선천 천기는 ${movementName}과 ${heavenRulerSiTian}/${earthRulerZaiQuan}의 결을 따릅니다.`,
    recommendedAction: `${dietaryPrescription} · ${breathMindHarmonization}`,
    cautionNotice: `태과·불급으로 인한 취약 경향(${pathologicalTendency})을 미리 살피어 무리하지 마십시오.`,
  };

  return {
    engineVersion: HUANGDI_YUNQI_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalYunqiRhythm.kstTimeLabel,
    birthYearGanZhi,
    fiveMovement: {
      element,
      movementPolarity,
      movementName,
      cosmicFeature,
    },
    sixQi: {
      heavenRulerSiTian,
      earthRulerZaiQuan,
      climaticCharacteristics,
    },
    medicineRx: {
      susceptibleOrgans,
      pathologicalTendency,
      dietaryPrescription,
      breathMindHarmonization,
    },
    cosmicResilienceScore,
    situationalYunqiAudit,
    temporalYunqiRhythm,
    yunqiSynthesisMatrix,
    boundaryNotice: '본 결과는 황제내경 운기칠편(오운육기)의 전통 섭생 철학에 기반한 정성적 건강 리듬 안내이며, 의학적 진단이 아닙니다.',
    synthesisMessage,
  };
}

export function formatHuangdiFiveMovementsSixQiPrompt(report: HuangdiFiveMovementsSixQiReport): string {
  const resilienceTone =
    report.cosmicResilienceScore >= 90 ? '안정적 천기 순응' : report.cosmicResilienceScore >= 82 ? '완만한 조화' : '세심한 섭생 필요';

  return `### 📜 황제명리(黃帝命理) & 오운육기(五運六氣) 천기 기상의학 엔진 (${HUANGDI_YUNQI_VERSION})
- **연산 시각**: ${report.calculatedAtKst}
- **선천 천기 간지**: **${report.birthYearGanZhi}** (천인합일 기조: ${resilienceTone})
- **오운(五運) 대운 분석**: **${report.fiveMovement.movementName}**
  - 대우주 천기 특성: ${report.fiveMovement.cosmicFeature}
- **육기(六氣) 사천·재천 기상장**:
  - 상반기 주재: **${report.sixQi.heavenRulerSiTian}** | 하반기 주재: **${report.sixQi.earthRulerZaiQuan}**
  - 기후학적 장세: ${report.sixQi.climaticCharacteristics}
- **질문 맥락 감사 (${report.situationalYunqiAudit.focusTheme})**: ${report.situationalYunqiAudit.climateNote} / ${report.situationalYunqiAudit.careTip}
- **KST 시공간 운기 리듬**: ${report.temporalYunqiRhythm.organWatchWindow} / ${report.temporalYunqiRhythm.seasonalYunqiTone}
  - 시공간 지침: ${report.temporalYunqiRhythm.temporalGuidance}
- **운기 교차 매트릭스**: 핵심(${report.yunqiSynthesisMatrix.coreInsight}) | 실행(${report.yunqiSynthesisMatrix.recommendedAction}) | 주의(${report.yunqiSynthesisMatrix.cautionNotice})
- **기상의학적 생체 나침반 (황제내경 운기 처방)**:
  - 주의 장부/경락: ${report.medicineRx.susceptibleOrgans}
  - 취약 병리 성향: ${report.medicineRx.pathologicalTendency}
  - 오미(五味) 약선 식이: ${report.medicineRx.dietaryPrescription}
  - 기공 호흡/심신 조화: ${report.medicineRx.breathMindHarmonization}
- **오운육기 통합 총평**: ${report.synthesisMessage}
- **해석 경계**: ${report.boundaryNotice}`;
}
