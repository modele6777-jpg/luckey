/**
 * 고대 게일 4대 화제 축제 및 휠 오브 더 이어 계절 순환 엔진 (gaelicWheelFireFestivalsEngine.ts)
 *
 * 고대 아일랜드·스코틀랜드 게일 원전 및 켈트 캘린더 《콜리니 역법(Coligny Calendar)》 기반:
 * Samhain·Imbolc·Bealtaine·Lughnasadh 4대 화제 축제, 질문 맥락 정성 감사,
 * KST 화덕 시공간 리듬 및 교차 매트릭스를 산출합니다.
 */

import type { UserProfile } from '../sharedState';

export const GAELIC_FIRE_FESTIVALS_ENGINE_VERSION = '2.3.0';

export interface GaelicFestivalStation {
  id: 'samhain' | 'imbolc' | 'bealtaine' | 'lughnasadh';
  nameKo: string;
  gaelicName: string;
  seasonAspect: '어둠의 문턱 (Geimhreadh)' | '빛의 잉태 (Oimelc)' | '찬란한 성화 (Samradh)' | '첫 수확의 결실 (First Harvest)';
  presidingDeity: string;
  sacredElement: '영혼의 물 (Water)' | '정화의 불 (Fire)' | '대지의 곡식 (Earth)' | '새벽의 바람 (Air)';
  spiritualVirtue: string;
  ritualPrescription: string;
  seasonResonanceScore: number; // 0 ~ 100 (내부 연산용)
}

export interface GaelicSituationalAudit {
  wheelThresholdFocus: string;
  hearthVirtue: string;
  druidPrescription: string;
  emberCaution: string;
}

export interface GaelicTemporalRhythm {
  kstHour: number;
  hearthWatchWindow: string;
  colignySeasonPhase: string;
  seasonalGuidance: string;
  fireTempo: '점화' | '수호' | '안식';
}

export interface GaelicSynthesisMatrix {
  cycleHarmonyGrade: '완숙' | '순환' | '응축';
  stationElementLink: string;
  nextWheelStep: string;
}

export interface GaelicWheelFireFestivalsReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  wheelCycleHarmonyScore: number;
  celticFireVibration: number;
  tuathaDeDanannBlessing: number;
  anamCaraSoulDepth: number;
  activeStation: GaelicFestivalStation;
  situationalGaelicAudit: GaelicSituationalAudit;
  temporalGaelicRhythm: GaelicTemporalRhythm;
  gaelicSynthesisMatrix: GaelicSynthesisMatrix;
  gaelicOmenGuidance: string;
  sacredHearthfireRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
}

const GAELIC_STATIONS_BASE: Omit<GaelicFestivalStation, 'seasonResonanceScore'>[] = [
  {
    id: 'samhain',
    nameKo: '삼하인 (영혼의 안식과 성스러운 겨울맞이)',
    gaelicName: 'Samhain',
    seasonAspect: '어둠의 문턱 (Geimhreadh)',
    presidingDeity: '모리안(Morrigan) & 다그다(The Dagda)',
    sacredElement: '영혼의 물 (Water)',
    spiritualVirtue: '과거의 번뇌와 낡은 에고를 겸허히 내려놓고 고요한 어둠 속에서 영적 지혜를 충전함',
    ritualPrescription: '창가에 한 자루의 촛불을 켜고, 떠나간 것들에 깊은 감사를 보내며 내면의 심연을 정돈하십시오.',
  },
  {
    id: 'imbolc',
    nameKo: '임볼크 (브리지드의 첫 불꽃과 영감의 태동)',
    gaelicName: 'Imbolc',
    seasonAspect: '빛의 잉태 (Oimelc)',
    presidingDeity: '브리지드(Brigid) 치유와 대장간의 여신',
    sacredElement: '새벽의 바람 (Air)',
    spiritualVirtue: '얼어붙은 대지를 뚫고 솟아나는 순수한 열망, 치유와 창의적 시상의 맑은 개화',
    ritualPrescription: '아침 첫 맑은 물을 마시며 심장 중앙에 작지만 꺼지지 않는 황금빛 씨앗 불꽃을 시각화하십시오.',
  },
  {
    id: 'bealtaine',
    nameKo: '벨테인 (벨레누스의 찬란한 성화와 생명력 축복)',
    gaelicName: 'Bealtaine',
    seasonAspect: '찬란한 성화 (Samradh)',
    presidingDeity: '벨레누스(Belenus) 태양신 & 플로라',
    sacredElement: '정화의 불 (Fire)',
    spiritualVirtue: '모든 그림자를 태우는 용기, 열정적인 자기표현과 성스러운 관계의 조화로운 연합',
    ritualPrescription: '두 줄기 빛 사이를 당당히 걸어가는 마음으로, 망설이던 꿈을 세상에 활짝 선언하십시오.',
  },
  {
    id: 'lughnasadh',
    nameKo: '루그나사드 (태양 영웅 루그의 풍요로운 첫 수확제)',
    gaelicName: 'Lughnasadh',
    seasonAspect: '첫 수확의 결실 (First Harvest)',
    presidingDeity: '루그 라바다(Lugh Lámhfhada) 모든 기예의 대가',
    sacredElement: '대지의 곡식 (Earth)',
    spiritualVirtue: '땀 흘려 뿌린 정직한 씨앗의 수확, 성숙한 책임감과 타인을 향한 관대한 나눔',
    ritualPrescription: '오늘 하루 성취한 작은 결실을 하나씩 손가락으로 헤아리며, 소중한 이들과 따뜻한 양식을 나누십시오.',
  },
];

function getKstGaelicParts(now: Date): { hour: number; month: number } {
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

function buildGaelicSituationalAudit(question: string, station: GaelicFestivalStation): GaelicSituationalAudit {
  const q = question.toLowerCase();
  if (/새로|시작|일|프로젝트|목표|시험|도전/.test(q)) {
    return {
      wheelThresholdFocus: '임볼크·벨테인 점화 문턱 — 씨앗의 현실 발아',
      hearthVirtue: `${station.presidingDeity}의 불씨를 일상 루틴으로 옮기는 꾸준함`,
      druidPrescription: '거창한 선언보다 오늘 당장 손에 잡히는 첫 작은 과업 하나를 끝내어 화덕의 불씨를 살리십시오.',
      emberCaution: '불꽃만 키우고 연료(체력과 준비)를 채우지 않으면 금세 식습니다.',
    };
  }
  if (/관계|사랑|인연|사람|가족|화해|친구/.test(q)) {
    return {
      wheelThresholdFocus: '아남 카라(Anam Cara · 영혼의 벗) 연대 문턱',
      hearthVirtue: '따뜻한 난로불처럼 서로의 체온을 나누는 진실한 환대',
      druidPrescription: '상대를 바꾸려 들기보다 먼저 따뜻한 말 한 마디와 안부로 마음의 난로 곁에 자리를 내어주십시오.',
      emberCaution: '서운함을 묵혀 두면 작은 불씨가 냉기로 변합니다.',
    };
  }
  if (/휴식|피로|건강|마음|치유|정리|이별/.test(q)) {
    return {
      wheelThresholdFocus: '삼하인(Samhain) 내려놓음과 겨울 안식 문턱',
      hearthVirtue: '지나간 계절의 짐을 고요히 놓아주고 내면의 땅을 쉬게 하는 지혜',
      druidPrescription: '오늘 하루는 새로운 일을 더하기보다 불필요한 약속과 걱정을 하나 비워내며 쉼을 허락하십시오.',
      emberCaution: '겨울의 문턱에서 봄의 수확을 재촉하면 마음이 지칩니다.',
    };
  }
  return {
    wheelThresholdFocus: `${station.gaelicName} 순환 절기 조율`,
    hearthVirtue: station.spiritualVirtue,
    druidPrescription: station.ritualPrescription,
    emberCaution: '계절의 순서를 건너뛰어 성급한 결실을 요구하지 마십시오.',
  };
}

function buildGaelicTemporalRhythm(now: Date): GaelicTemporalRhythm {
  const { hour, month } = getKstGaelicParts(now);

  let hearthWatchWindow = '새벽 브리지드(Brigid) 첫 불씨 창';
  let fireTempo: GaelicTemporalRhythm['fireTempo'] = '점화';
  let seasonalGuidance = '하루의 첫 불꽃을 피우는 시간대이므로 새로운 다짐과 창의적 구상에 알맞습니다.';

  if (hour >= 5 && hour < 10) {
    hearthWatchWindow = '새벽 브리지드(Brigid) 첫 불씨 창 (05~10시)';
    fireTempo = '점화';
    seasonalGuidance = '맑은 아침 기운과 함께 오늘 집중할 핵심 한 가지를 정하기 좋습니다.';
  } else if (hour >= 10 && hour < 17) {
    hearthWatchWindow = '정오 벨레누스(Belenus) 성화 수호 창 (10~17시)';
    fireTempo = '수호';
    seasonalGuidance = '햇살 아래 활동력과 결단력이 극대화되므로 실행과 소통에 힘을 실으십시오.';
  } else if (hour >= 17 && hour < 21) {
    hearthWatchWindow = '황혼 루그(Lugh) 수확 결산 창 (17~21시)';
    fireTempo = '수호';
    seasonalGuidance = '하루 동안 거둔 작은 성취를 돌아보고 감사로 마무리하기 좋은 시간입니다.';
  } else {
    hearthWatchWindow = '심야 삼하인(Samhain) 안식 화덕 창 (21~05시)';
    fireTempo = '안식';
    seasonalGuidance = '화덕의 불씨를 재로 덮어 보존하듯 조용한 휴식으로 내일을 준비할 시간입니다.';
  }

  let colignySeasonPhase = '게일 겨울 반기(Geimhreadh · 삼하인~임볼크)';
  if (month >= 2 && month <= 4) colignySeasonPhase = '임볼크~벨테인(Oimelc) · 빛의 잉태기';
  else if (month >= 5 && month <= 7) colignySeasonPhase = '벨테인~루그나사드(Samradh) · 빛의 반기';
  else if (month >= 8 && month <= 10) colignySeasonPhase = '루그나사드~삼하인 · 첫 수확과 결산기';
  else colignySeasonPhase = '삼하인~임볼크(Geimhreadh) · 어둠의 안식과 재생기';

  return {
    kstHour: hour,
    hearthWatchWindow,
    colignySeasonPhase,
    seasonalGuidance,
    fireTempo,
  };
}

export function calculateGaelicWheelFireFestivals(
  profile?: UserProfile | null,
  referenceDate = new Date(),
  question = ''
): GaelicWheelFireFestivalsReport {
  const seedString = `${profile?.basic?.birthdate || '1994-01-24'}_${profile?.basic?.birthtime || '12:00'}_${profile?.basic?.name || 'zeZE'}_${question}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0;
  }

  const month = referenceDate.getMonth() + 1;
  const day = referenceDate.getDate();
  const dayOfYear = month * 30 + day;

  const stations: GaelicFestivalStation[] = GAELIC_STATIONS_BASE.map((st, idx) => {
    const baseOffset = (hash + idx * 79 + dayOfYear * 13) % 43;
    const score = Math.min(100, Math.max(30, 55 + baseOffset));
    return {
      ...st,
      seasonResonanceScore: score,
    };
  });

  stations.sort((a, b) => b.seasonResonanceScore - a.seasonResonanceScore);
  const activeStation = stations[0];

  const wheelCycleHarmonyScore = 65 + ((hash ^ (dayOfYear * 7)) % 32);
  const celticFireVibration = 62 + (((hash >> 3) ^ (day * 17)) % 35);
  const tuathaDeDanannBlessing = 68 + (((hash >> 5) ^ (month * 23)) % 31);
  const anamCaraSoulDepth = 70 + (((hash >> 7) ^ (dayOfYear * 3)) % 29);

  const situationalGaelicAudit = buildGaelicSituationalAudit(question, activeStation);
  const temporalGaelicRhythm = buildGaelicTemporalRhythm(referenceDate);

  const cycleHarmonyGrade: GaelicSynthesisMatrix['cycleHarmonyGrade'] =
    wheelCycleHarmonyScore >= 84 ? '완숙' : wheelCycleHarmonyScore >= 72 ? '순환' : '응축';
  const stationElementLink = `[${activeStation.gaelicName}] 절기의 ${activeStation.sacredElement} 기운이 ${temporalGaelicRhythm.colignySeasonPhase} 흐름과 맞물립니다.`;
  const nextWheelStep = `${temporalGaelicRhythm.hearthWatchWindow} (${temporalGaelicRhythm.fireTempo}) 리듬에 맞추어 ${situationalGaelicAudit.druidPrescription}`;

  const gaelicSynthesisMatrix: GaelicSynthesisMatrix = {
    cycleHarmonyGrade,
    stationElementLink,
    nextWheelStep,
  };

  const gaelicOmenGuidance = `고대 켈트 순환의 휠에 따르면, 현재 당신의 영혼은 [${activeStation.nameKo}]의 파동권에 머물고 있습니다. ${activeStation.spiritualVirtue}.`;
  const sacredHearthfireRitual = `[게일 난로불 리추얼]: ${activeStation.ritualPrescription} 성스러운 수호신 [${activeStation.presidingDeity}]의 기운이 당신의 안식을 지켜줍니다.`;

  const kst = new Date(referenceDate.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = kst.toISOString().replace('T', ' ').substring(0, 19) + ' +09:00 KST';

  return {
    engineVersion: GAELIC_FIRE_FESTIVALS_ENGINE_VERSION,
    timestamp: referenceDate.toISOString(),
    calculatedAtKst,
    wheelCycleHarmonyScore,
    celticFireVibration,
    tuathaDeDanannBlessing,
    anamCaraSoulDepth,
    activeStation,
    situationalGaelicAudit,
    temporalGaelicRhythm,
    gaelicSynthesisMatrix,
    gaelicOmenGuidance,
    sacredHearthfireRitual,
    ritualAction: situationalGaelicAudit.druidPrescription,
    reflectionFocus: activeStation.spiritualVirtue,
    interpretiveBoundary: '게일 4대 화제 축제와 콜리니 역법 상징을 빌린 정성적 계절 순환 참고 관점이며, 개인 점수나 확정 예언이 아닙니다.',
  };
}

export function formatGaelicWheelFireFestivalsPrompt(report: GaelicWheelFireFestivalsReport): string {
  return `### 휠 오브 더 이어 켈트 4대 화제 축제 상징 관점 (v${report.engineVersion})
- **기준 시각**: ${report.calculatedAtKst}
- **주재 화제 절기**: ${report.activeStation.nameKo} (${report.activeStation.gaelicName})
- **계절 국면**: ${report.activeStation.seasonAspect} (${report.gaelicSynthesisMatrix.cycleHarmonyGrade})
- **수호 신격**: ${report.activeStation.presidingDeity}
- **성스러운 원소**: ${report.activeStation.sacredElement}
- **질문 맥락 감사**: ${report.situationalGaelicAudit.wheelThresholdFocus} · 화덕 덕목(${report.situationalGaelicAudit.hearthVirtue})
  - 드루이드 처방: ${report.situationalGaelicAudit.druidPrescription}
  - 불씨 경계: ${report.situationalGaelicAudit.emberCaution}
- **KST 시공간 리듬 (${report.temporalGaelicRhythm.kstHour}시)**: ${report.temporalGaelicRhythm.hearthWatchWindow} · ${report.temporalGaelicRhythm.colignySeasonPhase} (${report.temporalGaelicRhythm.fireTempo})
  - 시간대 지침: ${report.temporalGaelicRhythm.seasonalGuidance}
- **순환 교차 매트릭스**: ${report.gaelicSynthesisMatrix.stationElementLink}
- **켈트 드루이드 지혜 지침**: ${report.gaelicOmenGuidance}
- **성스러운 난로불 리추얼**: ${report.sacredHearthfireRitual}
- **해석 경계**: 게일 4대 화제 축제와 콜리니 역법 상징을 빌린 정성적 계절 순환 참고 관점이며, 개인 점수나 확정 예언이 아닙니다.`;
}
