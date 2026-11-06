/**
 * 조선 비전 정감록 10승지 영맥·궁궁을을 지기 보신 피난처 엔진 (koreanChonggamnokTenSanctuariesEngine.ts)
 *
 * 조선시대 최고 도참 비결서 《정감록(鄭鑑錄)》 감결(鑑訣) 원전 기반:
 * 난세와 급변하는 시운 속에서 신체와 영혼을 안전하게 보전하고 생기를 북돋우는
 * 삼재불입(三災不入)의 10대 명당 승지(十勝地) 영맥과 궁궁을을(弓弓乙乙) 성인 지기 수리 모델링.
 *
 * 10대 승지:
 * 1. 영주 풍기 금계촌 (소백산맥 아래 양백지간, 으뜸 복지)
 * 2. 봉화 춘양 (태백산맥 명당, 화란불입)
 * 3. 보은 속리산 증항 (사파리 사방 수려, 피난 제일)
 * 4. 남원 운봉 지리산 동점촌 (지리산 영봉 서기, 백년 안주)
 * 5. 예천 금당실 (금곡지리, 임란 격재 명당)
 * 6. 공주 유구마곡 (차령산맥 서기, 백성 보전)
 * 7. 영월 정동상류 (태백 지맥 감싸인 은둔 성소)
 * 8. 무주 무풍 북덕유산 (덕유산 명맥, 오곡 풍성)
 * 9. 부안 변산 호암 (해내제일 해관 영맥)
 * 10. 성주 가야산 만수동 (가야산 남쪽, 불로장생 길지)
 */

import type { UserProfile } from '../sharedState';

export const CHONGGAMNOK_SANCTUARIES_ENGINE_VERSION = '1.0.0';

export interface ChonggamnokSanctuary {
  id: string;
  rank: number;
  nameKo: string;
  region: string;
  mountainVein: string;
  vitalEnergyFeature: string;
  preservationPower: string;
  spiritualGuidance: string;
  vitalityScore: number; // 0 ~ 100
}

export interface ChonggamnokReport {
  engineVersion: string;
  timestamp: string;
  gonggongEuleulVirtueScore: number; // 0 ~ 100 궁궁을을 성인 지기 조화율
  threeCalamitiesImmunityScore: number; // 0 ~ 100 삼재불입 액운 차단력
  geomanticVitalityIndex: number; // 0 ~ 100 산태극 수태극 생기 충만도
  spiritualSanctuaryShield: number; // 0 ~ 100 난세 내면 안주 보호막
  dominantSanctuary: ChonggamnokSanctuary; // 현재 운명과 가장 깊이 공명하는 제1승지
  koreanPropheticPrescription: string; // 정감록 처세 비결 지침
  innerRefugeMeditation: string; // 마음의 십승지 안주 명상법
}

const CHONGGAMNOK_SANCTUARIES_BASE: Omit<ChonggamnokSanctuary, 'vitalityScore'>[] = [
  {
    id: 'punggi-geumgye',
    rank: 1,
    nameKo: '영주 풍기 금계촌 (양백지간 으뜸 복지)',
    region: '경북 영주시 풍기읍',
    mountainVein: '소백산 비로봉 남쪽 기슭',
    vitalEnergyFeature: '태백산과 소백산이 맞닿아 신령한 금계가 알을 품은 금계포란형(金鷄抱卵形)',
    preservationPower: '어떤 큰 혼란에도 병화와 기근이 침범하지 못하는 천혜의 안정력',
    spiritualGuidance: '마음의 중심을 소백산처럼 우뚝 세우고, 외부 소음에 흔들리지 않는 태연함을 지키십시오.',
  },
  {
    id: 'bonghwa-chunyang',
    rank: 2,
    nameKo: '봉화 춘양 (태백산맥 소나무 명당)',
    region: '경북 봉화군 춘양면',
    mountainVein: '태백산맥 문수산·옥석산 지맥',
    vitalEnergyFeature: '금강송의 청아한 솔향과 태백산의 굳건한 바위기운이 감싸 안은 청정 길지',
    preservationPower: '세속의 탐욕과 조급증을 맑은 솔바람으로 씻어내어 심신을 온전히 보존함',
    spiritualGuidance: '천년의 춘양목처럼 곧고 의연한 태도로 눈앞의 작은 손익을 초월해 대도를 걸어가십시오.',
  },
  {
    id: 'boeun-songnisan',
    rank: 3,
    nameKo: '보은 속리산 증항 (만수동 은자 피난처)',
    region: '충북 보은군 속리산면',
    mountainVein: '속리산 문장대·천황봉 영맥',
    vitalEnergyFeature: '구름이 머물고 바위가 겹겹이 두른 연꽃 형상의 속세 이탈 명당',
    preservationPower: '풍파 속에서도 깊은 사색과 자아 성찰을 통해 화를 피하고 복을 짓는 지혜',
    spiritualGuidance: '세속의 복잡한 인간관계를 잠시 내려놓고 고요한 침묵 속에서 진정한 자아를 마주하십시오.',
  },
  {
    id: 'namwon-unbong',
    rank: 4,
    nameKo: '남원 운봉 지리산 동점촌 (지리 영봉 천년 복지)',
    region: '전북 남원시 운봉읍',
    mountainVein: '지리산 바래봉·만복대 서맥',
    vitalEnergyFeature: '지리산 노고단과 반야봉의 장엄한 모성적 대지 서기가 서려 있는 고원 길지',
    preservationPower: '천하의 기운을 포용하는 넓은 도량으로 닥쳐오는 고난을 복덕으로 승화함',
    spiritualGuidance: '지리산의 깊은 품처럼 타인을 품어 안는 자비심을 기를 때 하늘의 큰 가호가 깃듭니다.',
  },
  {
    id: 'yecheon-geumdangsil',
    rank: 5,
    nameKo: '예천 금당실 (연화부수형 평화 명당)',
    region: '경북 예천군 용문면',
    mountainVein: '소백산맥 매봉산·백마산 지맥',
    vitalEnergyFeature: '물 위에 연꽃이 활짝 핀 형국으로 은은한 학문과 덕망이 끊이지 않는 복지',
    preservationPower: '부드러움으로 강함을 제압하며, 임진왜란 때도 유일하게 병화를 면한 격재 피난력',
    spiritualGuidance: '겉으로 다투지 않고 안으로 실력을 연마하는 유연한 외유내강의 처세를 유지하십시오.',
  },
  {
    id: 'gongju-yugumagok',
    rank: 6,
    nameKo: '공주 유구마곡 (차령산맥 태극수 영맥)',
    region: '충남 공주시 유구읍·사곡면 마곡',
    mountainVein: '차령산맥 태화산·광덕산 기슭',
    vitalEnergyFeature: '산태극 수태극의 완벽한 음양 조화가 이루어져 전란 속에서도 수만 가구를 보존한 복지',
    preservationPower: '생명의 끈을 질기게 이어주며 물질과 식량이 궁핍하지 않도록 돕는 수호력',
    spiritualGuidance: '흐르는 물처럼 유연하게 변화에 적응하며 이웃과 나누는 온정을 잃지 마십시오.',
  },
  {
    id: 'yeongwol-jeongdong',
    rank: 7,
    nameKo: '영월 정동상류 (태백 동맥 깊은 은둔 성소)',
    region: '강원 영월군 상동읍·중동면',
    mountainVein: '태백산맥 백운산·장산 협곡',
    vitalEnergyFeature: '깊은 계곡과 청정한 암반수가 흐르며 바깥세상과 단절된 신비의 피세처',
    preservationPower: '잡념과 번뇌를 급류에 흘려보내고 내면의 맑은 영안을 밝히는 은둔 수호력',
    spiritualGuidance: '세상의 인정이나 평가에 연연하지 말고 당신만의 고결한 영적 가치를 지켜내십시오.',
  },
  {
    id: 'muju-mupung',
    rank: 8,
    nameKo: '무주 무풍 북덕유산 (덕유산 만덕 고원)',
    region: '전북 무주군 무풍면',
    mountainVein: '덕유산 향적봉 북쪽 지맥',
    vitalEnergyFeature: '덕유산의 넉넉한 덕성과 비옥한 평지가 어우러져 오곡이 풍성하고 온화한 기운',
    preservationPower: '물질적 궁핍을 몰아내고 내면의 영양을 든든히 채워주는 풍요로운 안식처',
    spiritualGuidance: '감사하는 마음으로 현재 주어진 것들을 축복할 때 결핍의 두려움이 말끔히 사라집니다.',
  },
  {
    id: 'buan-byeonsan',
    rank: 9,
    nameKo: '부안 변산 호암 (서해 관문 기암 복지)',
    region: '전북 부안군 변산면',
    mountainVein: '변산반도 의상봉·관음봉 영맥',
    vitalEnergyFeature: '바다와 기암괴석이 어우러져 용왕의 서기와 불보살의 가피가 충만한 해내제일 명승',
    preservationPower: '험난한 파도를 가르는 바위처럼 세파의 역경을 당당히 이겨내는 강인한 정신력',
    spiritualGuidance: '망망대해를 바라보는 열린 시야로 시련을 한 단계 높은 도약의 발판으로 삼으십시오.',
  },
  {
    id: 'seongju-gayasan',
    rank: 10,
    nameKo: '성주 가야산 만수동 (해인 성지 불로장생 길지)',
    region: '경북 성주군 가천면·수륜면',
    mountainVein: '가야산 칠불봉·상왕봉 남맥',
    vitalEnergyFeature: '해인사의 팔만대장경 법보 서기와 가야산의 화강암 신령 기운이 깃든 장수 명당',
    preservationPower: '모든 악업과 마장을 부처의 지혜 검으로 베어내고 본래의 불성을 온전히 드러냄',
    spiritualGuidance: '내면의 팔만대장경 같은 참된 지혜를 믿고 오롯이 정의롭고 순수한 길을 걸어가십시오.',
  },
];

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateChonggamnokTenSanctuaries(profile: UserProfile): ChonggamnokReport {
  const seedStr = `${profile.birthDate || '1994-01-24'}_${profile.birthTime || '12:00'}_${profile.name || 'zeZE'}_chonggamnok_v1`;
  const seed = djb2Hash(seedStr);

  const gonggongEuleulVirtueScore = 60 + (seed % 39);
  const threeCalamitiesImmunityScore = 62 + ((seed >> 2) % 37);
  const geomanticVitalityIndex = 58 + ((seed >> 4) % 41);
  const spiritualSanctuaryShield = 65 + ((seed >> 6) % 34);

  const sanctuaryIdx = seed % CHONGGAMNOK_SANCTUARIES_BASE.length;
  const base = CHONGGAMNOK_SANCTUARIES_BASE[sanctuaryIdx];
  const vitalityScore = 68 + ((seed >> 8) % 31);

  const dominantSanctuary: ChonggamnokSanctuary = {
    ...base,
    vitalityScore,
  };

  const koreanPropheticPrescription = `《정감록》 감결 비결은 세속의 격랑이 거셀수록 밖으로 치닫지 않고 '궁궁을을(弓弓乙乙, 신령한 영적 마음자리)'로 돌아오는 자만이 참된 피난처를 얻는다고 전합니다. 현재 공명하는 제1승지인 [${dominantSanctuary.nameKo}]의 영맥 기운을 취하여 삼재를 물리치십시오.`;

  const innerRefugeMeditation = `조용한 자리에 단정히 앉아 백두대간의 굵은 산맥 줄기가 당신의 등줄기(독맥)를 타고 내려와 단전에 굳건한 태산처럼 자리 잡는 모습을 시각화하십시오. 세상의 어떤 요동 속에서도 당신의 중심은 십승지의 성역처럼 고요하고 안전합니다.`;

  return {
    engineVersion: CHONGGAMNOK_SANCTUARIES_ENGINE_VERSION,
    timestamp: new Date().toISOString(),
    gonggongEuleulVirtueScore,
    threeCalamitiesImmunityScore,
    geomanticVitalityIndex,
    spiritualSanctuaryShield,
    dominantSanctuary,
    koreanPropheticPrescription,
    innerRefugeMeditation,
  };
}

export function formatChonggamnokPrompt(report: ChonggamnokReport): string {
  const s = report.dominantSanctuary;
  return `[조선 비전 정감록 10승지 영맥 & 보신 피난처 실측 데이터]
- 엔진 버전: v${report.engineVersion}
- 궁궁을을 성인 지기 조화율: ${report.gonggongEuleulVirtueScore}/100
- 삼재불입 액운 차단력: ${report.threeCalamitiesImmunityScore}/100
- 산태극 수태극 생기 충만도: ${report.geomanticVitalityIndex}/100
- 난세 내면 안주 보호막: ${report.spiritualSanctuaryShield}/100
- 주재 공명 10승지 명당: ${s.nameKo} (제${s.rank}승지 / ${s.region})
  * 산맥 영맥: ${s.mountainVein}
  * 생기 형국 특성: ${s.vitalEnergyFeature}
  * 난세 보전력: ${s.preservationPower}
  * 길지 생기 공명도: ${s.vitalityScore}/100
  * 승지 영적 지침: ${s.spiritualGuidance}
- 정감록 처세 비결 지침: ${report.koreanPropheticPrescription}
- 마음의 십승지 안주 명상: ${report.innerRefugeMeditation}`;
}
