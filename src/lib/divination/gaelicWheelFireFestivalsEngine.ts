/**
 * 고대 게일 4대 화제 축제 및 휠 오브 더 이어 계절 순환 엔진 (gaelicWheelFireFestivalsEngine.ts)
 *
 * 고대 아일랜드·스코틀랜드 게일 원전 및 켈트 캘린더 《콜리니 역법(Coligny Calendar)》 기반:
 * 한 해를 빛의 반기(Samradh)와 어둠의 반기(Geimhreadh)로 양분하고,
 * 4대 화제 축제(Four Fire Festivals)를 통해 영혼의 죽음·정화·점화·결실을 순환하는 비전 체계.
 *
 * 4대 화제 축제:
 * 1. Samhain (삼하인, 11월 1일): 새해의 시작이자 베일이 얇아지는 어둠의 문턱, 선조령과의 교감과 에고의 성스러운 죽음.
 * 2. Imbolc (임볼크, 2월 1일): 대지모신 브리지드(Brigid)의 성스러운 불길, 겨울 눈 속 첫 젖줄과 새로운 영감의 싹트임.
 * 3. Bealtaine (벨테인, 5월 1일): 태양신 벨레누스(Belenus)의 정화의 두 불길, 생명력의 폭발과 아니마-아니무스의 성혼.
 * 4. Lughnasadh (루그나사드, 8월 1일): 태양 영웅 루그(Lugh)의 첫 곡식 수확제, 헌신적 노력의 결실과 공동체적 나눔.
 */

import type { UserProfile } from '../sharedState';

export const GAELIC_FIRE_FESTIVALS_ENGINE_VERSION = '1.0.0';

export interface GaelicFestivalStation {
  id: 'samhain' | 'imbolc' | 'bealtaine' | 'lughnasadh';
  nameKo: string;
  gaelicName: string;
  seasonAspect: '어둠의 문턱 (Geimhreadh)' | '빛의 잉태 (Oimelc)' | '찬란한 성화 (Samradh)' | '첫 수확의 결실 (First Harvest)';
  presidingDeity: string;
  sacredElement: '영혼의 물 (Water)' | '정화의 불 (Fire)' | '대지의 곡식 (Earth)' | '새벽의 바람 (Air)';
  spiritualVirtue: string;
  ritualPrescription: string;
  seasonResonanceScore: number; // 0 ~ 100
}

export interface GaelicWheelFireFestivalsReport {
  engineVersion: string;
  timestamp: string;
  wheelCycleHarmonyScore: number; // 0 ~ 100 휠 오브 더 이어 계절 조화율
  celticFireVibration: number; // 0 ~ 100 켈트 성스러운 불길 활성도
  tuathaDeDanannBlessing: number; // 0 ~ 100 투아하 데 다난 신족 축복 지수
  anamCaraSoulDepth: number; // 0 ~ 100 아남 카라(영혼의 벗) 깊이
  activeStation: GaelicFestivalStation; // 현재 주재하는 화제 축제 절기
  gaelicOmenGuidance: string; // 켈트 드루이드 지혜 지침
  sacredHearthfireRitual: string; // 성스러운 난로불 점화 리추얼
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

export function calculateGaelicWheelFireFestivals(
  profile?: UserProfile | null,
  referenceDate = new Date()
): GaelicWheelFireFestivalsReport {
  const seedString = `${profile?.basic?.birthdate || '1994-01-24'}_${profile?.basic?.birthtime || '12:00'}_${profile?.basic?.name || 'zeZE'}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0;
  }

  const month = referenceDate.getMonth() + 1;
  const day = referenceDate.getDate();
  const dayOfYear = month * 30 + day;

  // Station weights calculation
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

  const gaelicOmenGuidance = `고대 켈트 순환의 휠에 따르면, 현재 당신의 영혼은 [${activeStation.nameKo}]의 파동권에 머물고 있습니다. ${activeStation.spiritualVirtue}.`;
  const sacredHearthfireRitual = `[게일 난로불 리추얼]: ${activeStation.ritualPrescription} 성스러운 수호신 [${activeStation.presidingDeity}]의 기운이 당신의 안식을 지켜줍니다.`;

  return {
    engineVersion: GAELIC_FIRE_FESTIVALS_ENGINE_VERSION,
    timestamp: referenceDate.toISOString(),
    wheelCycleHarmonyScore,
    celticFireVibration,
    tuathaDeDanannBlessing,
    anamCaraSoulDepth,
    activeStation,
    gaelicOmenGuidance,
    sacredHearthfireRitual,
  };
}

export function formatGaelicWheelFireFestivalsPrompt(report: GaelicWheelFireFestivalsReport): string {
  return `### 휠 오브 더 이어 켈트 4대 화제 축제 실측 데이터 (v${report.engineVersion})
- **주재 화제 절기**: ${report.activeStation.nameKo} (${report.activeStation.gaelicName})
- **계절 국면**: ${report.activeStation.seasonAspect}
- **수호 신격**: ${report.activeStation.presidingDeity}
- **성스러운 원소**: ${report.activeStation.sacredElement}
- **계절 공명 점수**: ${report.activeStation.seasonResonanceScore}/100
- **휠 오브 더 이어 계절 조화율**: ${report.wheelCycleHarmonyScore}/100
- **켈트 성화 진동 지수**: ${report.celticFireVibration}/100
- **투아하 데 다난 축복도**: ${report.tuathaDeDanannBlessing}/100
- **아남 카라 영혼 깊이**: ${report.anamCaraSoulDepth}/100
- **켈트 드루이드 지혜 지침**: ${report.gaelicOmenGuidance}
- **성스러운 난로불 리추얼**: ${report.sacredHearthfireRitual}`;
}

