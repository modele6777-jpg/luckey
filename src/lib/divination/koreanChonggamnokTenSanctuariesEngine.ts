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

export const CHONGGAMNOK_SANCTUARIES_ENGINE_VERSION = '2.4.0';

export type ChonggamnokQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface ChonggamnokTemporalRhythm {
  kstSlot: string;
  phaseLabel: string;
  rhythmDirective: string;
}

export interface ChonggamnokSanctuary {
  id: string;
  rank: number;
  nameKo: string;
  region: string;
  mountainVein: string;
  vitalEnergyFeature: string;
  preservationPower: string;
  spiritualGuidance: string;
  vitalityScore: number; // 내부 정성 변환용
}

export interface ChonggamnokReport {
  engineVersion: string;
  calculatedAtKst: string;
  timestamp: string;
  questionTopic: ChonggamnokQuestionTopic;
  temporalSanctuaryRhythm: ChonggamnokTemporalRhythm;
  gonggongEuleulVirtueScore: number; // 내부 정성 변환용 궁궁을을 성인 지기 조화율
  threeCalamitiesImmunityScore: number; // 내부 정성 변환용 삼재불입 액운 차단력
  geomanticVitalityIndex: number; // 내부 정성 변환용 산태극 수태극 생기 충만도
  spiritualSanctuaryShield: number; // 내부 정성 변환용 난세 내면 안주 보호막
  dominantSanctuary: ChonggamnokSanctuary; // 현재 운명과 가장 깊이 공명하는 제1승지
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  koreanPropheticPrescription: string; // 정감록 처세 비결 지침
  innerRefugeMeditation: string; // 마음의 십승지 안주 명상법
  chonggamnokSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    chonggamnokCrossAxis: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatChonggamnokKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}+09:00 (KST)`;
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

function classifyChonggamnokQuestionTopic(question?: string): ChonggamnokQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/연애|사랑|사람|관계|친구|가족|동료|갈등|이별|결혼|상대/.test(q)) return 'relationship';
  if (/결정|선택|진로|이직|사업|투자|시험|공부|합격|도전|방향|계획/.test(q)) return 'decision';
  if (/불안|힘들|지치|우울|회복|위로|휴식|건강|마음|치유|고민/.test(q)) return 'healing';
  return 'reflection';
}

function buildChonggamnokTemporalRhythm(now?: Date): ChonggamnokTemporalRhythm {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const hh = String(hour).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const kstSlot = `${hh}:${mm} KST`;

  if (hour >= 5 && hour < 11) {
    return {
      kstSlot,
      phaseLabel: '산맥 서기(山脈瑞氣) · 아침 안주',
      rhythmDirective: '이른 아침 산봉우리에 맑은 기운이 모이듯, 하루의 변동 속에서도 흔들리지 않을 마음의 보금자리를 먼저 정하십시오.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstSlot,
      phaseLabel: '태극 순환(太極循環) · 유연한 보전',
      rhythmDirective: '산과 물이 서로 감싸 안는 산태극 수태극의 이치처럼, 부딪히기보다 부드럽게 흐르며 실속을 지킬 때입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstSlot,
      phaseLabel: '황혼 귀처(黃昏歸處) · 번잡함 비우기',
      rhythmDirective: '바깥의 소란을 들이지 않고 내면의 문턱을 조용히 닫아, 지친 기운을 승지의 품으로 거두어들이는 시간입니다.',
    };
  }
  return {
    kstSlot,
    phaseLabel: '궁궁을을(弓弓乙乙) · 심야 성소',
    rhythmDirective: '깊은 밤 고요한 성소 안에서 세속의 근심을 내려놓고 내면의 중심을 단단히 다지는 정적의 시간입니다.',
  };
}

function describeChonggamnokStage(score: number, high: string, mid: string, base: string): string {
  if (score >= 85) return high;
  if (score >= 72) return mid;
  return base;
}

export function calculateChonggamnokTenSanctuaries(
  profile?: UserProfile | null,
  question?: string,
  now?: Date,
): ChonggamnokReport {
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const questionTopic = classifyChonggamnokQuestionTopic(question);
  const temporalSanctuaryRhythm = buildChonggamnokTemporalRhythm(now);
  const seedStr = `${bdate}_${btime}_${name}_${questionTopic}_chonggamnok_v1`;
  const seed = djb2Hash(seedStr);

  const gonggongEuleulVirtueScore = 60 + (seed % 39);
  const threeCalamitiesImmunityScore = 62 + ((seed >> 2) % 37);
  const geomanticVitalityIndex = 58 + ((seed >> 4) % 41);
  const spiritualSanctuaryShield = 65 + ((seed >> 6) % 34);

  const topicOffset =
    questionTopic === 'healing' ? 2 :
    questionTopic === 'relationship' ? 3 :
    questionTopic === 'decision' ? 4 : 0;
  const sanctuaryIdx = (seed + topicOffset) % CHONGGAMNOK_SANCTUARIES_BASE.length;
  const base = CHONGGAMNOK_SANCTUARIES_BASE[sanctuaryIdx];
  const vitalityScore = 68 + ((seed >> 8) % 31);

  const dominantSanctuary: ChonggamnokSanctuary = {
    ...base,
    vitalityScore,
  };

  const ritualByTopic: Record<ChonggamnokQuestionTopic, string> = {
    relationship: '관계의 풍파 속에서도 내 마음의 성역을 먼저 지키며, 다투기보다 상대와 나 사이의 온화한 경계를 차분히 세우십시오.',
    decision: '조급한 이득을 좇아 험지로 나가기보다, 오래 버틸 수 있는 기반과 안전망을 먼저 점검한 뒤 한 걸음씩 옮기십시오.',
    healing: '오늘 하루만큼은 외부 알림과 소음을 줄이고, 나만의 고요한 자리에서 호흡을 깊게 가다듬으며 심신을 보전하십시오.',
    reflection: '밖에서 피난처를 찾기 전에 지금 내 마음속에서 가장 편안하고 단단한 구석이 어디인지 조용히 살펴보십시오.',
  };

  const questionByTopic: Record<ChonggamnokQuestionTopic, string> = {
    relationship: '이 관계의 흔들림 속에서 내가 끝까지 지켜야 할 내면의 평온한 자리는 어디인가요?',
    decision: '지금 내 선택은 일시적인 바람을 좇는 길인가요, 아니면 오래 안주할 수 있는 튼튼한 터전인가요?',
    healing: '오늘 내 마음을 가장 먼저 쉬게 해 줄 나만의 작은 피난처는 무엇인가요?',
    reflection: '세상의 소란이 잦아든 자리에서 지금 내 영혼이 가장 바라는 안정의 모습은 어떤 것인가요?',
  };

  const koreanPropheticPrescription = `《정감록》 감결 비결은 세속의 격랑이 거셀수록 밖으로 치닫지 않고 '궁궁을을(弓弓乙乙, 신령한 영적 마음자리)'로 돌아오는 자만이 참된 피난처를 얻는다고 전합니다. 현재 질문의 흐름(${temporalSanctuaryRhythm.phaseLabel})과 공명하는 제1승지인 [${dominantSanctuary.nameKo}]의 영맥 기운을 취하여 내면의 평온을 지키십시오.`;

  const innerRefugeMeditation = `조용한 자리에 단정히 앉아 백두대간의 굵은 산맥 줄기가 당신의 등줄기(독맥)를 타고 내려와 단전에 굳건한 태산처럼 자리 잡는 모습을 시각화하십시오. 세상의 어떤 요동 속에서도 당신의 중심은 십승지의 성역처럼 고요하고 안전합니다.`;

  const baseTime = now ?? new Date();
  const calculatedAtKst = formatChonggamnokKstTimestamp(baseTime);
  const avgScore = Math.round(
    (gonggongEuleulVirtueScore +
      threeCalamitiesImmunityScore +
      geomanticVitalityIndex +
      spiritualSanctuaryShield) /
      4,
  );
  const chonggamnokCrossAxis = `[${dominantSanctuary.nameKo}] × [${dominantSanctuary.mountainVein}] × [${temporalSanctuaryRhythm.phaseLabel}] × [${questionTopic}]`;
  const chonggamnokSynthesisMatrix = {
    dominantTension: `${dominantSanctuary.nameKo} ↔ ${temporalSanctuaryRhythm.phaseLabel}`,
    alignmentState: describeChonggamnokStage(
      avgScore,
      '궁궁을을(弓弓乙乙)의 마음자리와 십승지 영맥이 흔들림 없이 맞물리는 평온 안주기',
      '세속의 소음을 걸러내고 내면의 중심을 차분히 보전하는 안정기',
      '흩어진 기운을 거두어 나만의 고요한 피난처를 다지는 준비기',
    ),
    integratedAction: `${ritualByTopic[questionTopic]}${question?.trim() ? ` [질문 맥락: ${question.trim()}]` : ''}`,
    chonggamnokCrossAxis,
  };

  const ritualAction = `[${dominantSanctuary.nameKo}] ${ritualByTopic[questionTopic]}`;
  const reflectionFocus = questionByTopic[questionTopic];

  return {
    engineVersion: CHONGGAMNOK_SANCTUARIES_ENGINE_VERSION,
    calculatedAtKst,
    timestamp: baseTime.toISOString(),
    questionTopic,
    temporalSanctuaryRhythm,
    gonggongEuleulVirtueScore,
    threeCalamitiesImmunityScore,
    geomanticVitalityIndex,
    spiritualSanctuaryShield,
    dominantSanctuary,
    dailyPracticeRitual: ritualByTopic[questionTopic],
    reflectiveQuestion: questionByTopic[questionTopic],
    interpretiveBoundary: '정감록 십승지는 실제 지리적 이주나 길흉 예언이 아니라, 혼란한 일상 속에서 마음을 보존하고 중심을 잡는 상징적 은유입니다.',
    koreanPropheticPrescription,
    innerRefugeMeditation,
    chonggamnokSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatChonggamnokPrompt(report: ChonggamnokReport): string {
  const s = report.dominantSanctuary;
  const lines = [
    `[조선 비전 정감록 10승지 영맥 & 보신 피난처 실측 데이터 (정성 성찰)]`,
    `- 연산 시각: ${report.calculatedAtKst} | 엔진 버전: v${report.engineVersion}`,
    `- 질문 맥락 및 시공간 리듬: [${report.questionTopic}] · ${report.temporalSanctuaryRhythm.kstSlot} (${report.temporalSanctuaryRhythm.phaseLabel})`,
    `- 시공간 지침: ${report.temporalSanctuaryRhythm.rhythmDirective}`,
    `- 궁궁을을 성인 지기 조화: ${describeChonggamnokStage(report.gonggongEuleulVirtueScore, '마음자리와 바깥 기운이 흔들림 없이 맞물리는 깊은 조화', '내면의 중심을 차분히 지켜내는 안정된 조화', '흩어진 마음을 한곳으로 모으며 조화를 다지는 시기')}`,
    `- 삼재불입 평온 수호력: ${describeChonggamnokStage(report.threeCalamitiesImmunityScore, '외부의 거친 소음을 들이지 않는 견고한 평온', '불필요한 흔들림을 걸러내는 균형 잡힌 수호력', '작은 동요를 알아차리고 경계를 정돈하는 시기')}`,
    `- 산태극 수태극 생기 흐름: ${describeChonggamnokStage(report.geomanticVitalityIndex, '산과 물이 감싸 안듯 생기가 고루 순환하는 충만함', '무너지지 않는 바탕 위에서 생기가 이어지는 흐름', '지친 기운을 천천히 채우며 터전을 다지는 시기')}`,
    `- 난세 내면 안주 보호막: ${describeChonggamnokStage(report.spiritualSanctuaryShield, '어수선한 흐름 속에서도 스스로를 지키는 든든한 안식처', '일상의 쉼과 중심을 지켜내는 안정적인 보호막', '잠시 멈춰 숨을 고르며 안식처를 마련하는 시기')}`,
    `- 주재 공명 10승지 명당: ${s.nameKo} (제${s.rank}승지 · ${s.region})`,
    `  * 산맥 영맥: ${s.mountainVein}`,
    `  * 생기 형국 특성: ${s.vitalEnergyFeature}`,
    `  * 난세 보전력: ${s.preservationPower}`,
    `  * 길지 생기 공명: ${describeChonggamnokStage(s.vitalityScore, '승지의 고요하고 깊은 영맥과 선명하게 공명함', '승지의 온화한 안정 기운과 무리 없이 이어짐', '승지의 맑은 기운을 천천히 받아들이는 흐름')}`,
    `  * 승지 영적 지침: ${s.spiritualGuidance}`,
    `- 오늘의 실천 의례: ${report.dailyPracticeRitual}`,
    `- 핵심 성찰 질문: ${report.reflectiveQuestion}`,
    `- 해석 경계: ${report.interpretiveBoundary}`,
    `- 정감록 처세 비결 지침: ${report.koreanPropheticPrescription}`,
    `- 마음의 십승지 안주 명상: ${report.innerRefugeMeditation}`,
  ];
  if (report.chonggamnokSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${report.chonggamnokSynthesisMatrix.dominantTension} | 조율 상태: ${report.chonggamnokSynthesisMatrix.alignmentState}]`,
      `- 4중 교차 축: ${report.chonggamnokSynthesisMatrix.chonggamnokCrossAxis}`,
      `- 통합 실천: ${report.chonggamnokSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${report.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${report.reflectionFocus}`,
  );
  return lines.join('\n');
}
