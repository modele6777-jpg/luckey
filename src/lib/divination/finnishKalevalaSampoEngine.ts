/**
 * =========================================================================
 * LUCKEY 고대 핀란드 칼레발라(Kalevala) 신비 서사시 & 삼포(Sampo) 9대 룬가 엔진
 * (Finnish Kalevala Mystic Epic & Sampo Prosperity 9 Runolaulu Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 핀란드·카렐리야의 우랄-피노우그릭 정통 샤머니즘 구전 서사시 칼레발라(Kalevala)와
 * 무한한 번영을 갈아내는 신화적 맷돌 삼포(Sampo), 지혜의 가객 바이내뫼이넨(Väinämöinen)의 룬가 원전.
 * 
 * 1. 삼포(Sampo)의 3대 번영 날개(Flour, Salt, Gold):
 *    - 곡물의 날개 (Jauhomylly) - 일상의 풍요, 생계의 안정과 풍성한 식탁
 *    - 소금의 날개 (Suolamylly) - 생명의 보존, 지혜와 치유, 불순물의 정화
 *    - 황금의 날개 (Kultamylly) - 명예와 부, 위대한 창조적 성취와 번영
 * 2. 칼레발라 9대 신성 룬가(Runolaulu):
 *    - 만물의 기원을 노래하여 현실을 변혁하는 원초적 언어의 힘.
 * 3. 핀란드 영혼의 핵 '시수(Sisu)' 회복탄력성 지수:
 *    - 극한의 북유럽 설한풍 속에서도 꺾이지 않는 불굴의 내면 의지와 끈기.
 * 4. 타피오(Tapio, 숲의 신) & 벨라모(Vellamo, 바다의 여신)의 대자연 정령 가호:
 *    - 북극림(Taiga)과 맑은 호수의 정령들이 건네는 현실 보호막.
 */

import type { UserProfile } from '../sharedState';

export const FINNISH_KALEVALA_SAMPO_ENGINE_VERSION = '1.0.0';

export interface SampoWingsBalance {
  flourScore: number; // 곡물 (안정과 생계) 0~100
  saltScore: number; // 소금 (보존과 지혜) 0~100
  goldScore: number; // 황금 (성취와 번영) 0~100
  dominantWing: '곡물의 날개 (Jauho · 안정)' | '소금의 날개 (Suola · 지혜)' | '황금의 날개 (Kulta · 번영)';
  dominantGift: string;
}

export interface KalevalaRuno {
  runoNumber: number;
  runoTitle: string;
  mythicOrigin: string;
  loitsuChant: string; // 로이추(치유·창조의 마법 노래)
}

export interface FinnishKalevalaSampoReport {
  engineVersion: string;
  calculatedAt: string;
  sisuResilienceIndex: number; // 시수(Sisu) 회복탄력성 0~100
  sampoBalance: SampoWingsBalance;
  activeRuno: KalevalaRuno;
  guardianNatureSpirit: string; // 대자연 수호신
  forestHealingPractice: string; // 숲의 힐링 처방
  kalevalaWisdom: string;
}

const KALEVALA_RUNOS: KalevalaRuno[] = [
  {
    runoNumber: 1,
    runoTitle: '만물과 노래의 창조 룬 (Luominen)',
    mythicOrigin: '원초의 물새가 낳은 황금 알에서 천지와 해와 달이 솟아난 태초의 기원',
    loitsuChant: '알 껍질이 하늘이 되고 노른자가 해가 되듯, 혼돈 속에서 찬란한 질서가 피어납니다.'
  },
  {
    runoNumber: 2,
    runoTitle: '신성한 불의 탄생 룬 (Tulen Synty)',
    mythicOrigin: '번개 신 우코(Ukko)의 손에서 떨어진 불씨가 칠흑 같은 어둠을 녹인 기적',
    loitsuChant: '차가운 대지를 녹이는 신성한 불꽃으로 웅크린 마음에 열정과 결단의 불을 당깁니다.'
  },
  {
    runoNumber: 3,
    runoTitle: '철의 기원과 연마 룬 (Raudan Synty)',
    mythicOrigin: '늪지대 붉은 진흙에서 캐내어 대장장이 일마리넨의 풀무질로 벼려낸 강철의 의지',
    loitsuChant: '거친 시련의 불길을 거친 뒤에야 비로소 부러지지 않는 무구한 강철이 완성됩니다.'
  },
  {
    runoNumber: 4,
    runoTitle: '칸텔레 현악기의 지혜 룬 (Kantele)',
    mythicOrigin: '거대한 파이크 물고기의 턱뼈와 처녀의 머리칼로 엮어 숲의 맹수마저 눈물짓게 한 선율',
    loitsuChant: '마음의 줄을 바르게 조율할 때, 온 세상이 고요히 당신의 목소리에 감응합니다.'
  },
  {
    runoNumber: 5,
    runoTitle: '황금 맷돌 삼포 주조 룬 (Sammon Taonta)',
    mythicOrigin: '백조의 깃털, 어린 양의 양모, 한 톨의 보리로 하룻밤 사이에 주조한 기적의 맷돌',
    loitsuChant: '지혜와 성실의 손길이 맞닿을 때, 영원히 마르지 않는 번영의 샘이 샘솟습니다.'
  },
  {
    runoNumber: 6,
    runoTitle: '신성한 숲 타피올라의 보호 룬 (Tapion Koti)',
    mythicOrigin: '침엽수림 깊은 곳에서 방랑자를 감싸 안아 지키는 숲의 왕 타피오의 푸른 망토',
    loitsuChant: '솔향기 짙은 숲의 품에 안겨 세상의 모든 번잡함과 피로를 씻어냅니다.'
  },
  {
    runoNumber: 7,
    runoTitle: '맑은 호수 벨라모의 정화 룬 (Vellamon Vesi)',
    mythicOrigin: '거울 같은 푸른 호수 아래에서 모든 상처를 부드럽게 어루만지는 물의 치유',
    loitsuChant: '티 없이 맑은 호숫물에 마음을 비추어 묵은 감정의 찌꺼기를 말끔히 흘려보냅니다.'
  },
  {
    runoNumber: 8,
    runoTitle: '불굴의 곰 오트소(Otso)의 기운 룬 (Karhun Synty)',
    mythicOrigin: '북두칠성 별자리에서 지상으로 내려온 숲의 어른 곰의 신성한 존엄과 힘',
    loitsuChant: '두려움 없이 자신의 자리를 지키는 당당한 기백으로 삶의 주권을 선포합니다.'
  },
  {
    runoNumber: 9,
    runoTitle: '태양과 달의 귀환 룬 (Päivän Päästö)',
    mythicOrigin: '포흐욜라의 어두운 바위틈에 갇혔던 해와 달을 지혜의 노래로 다시 풀어낸 광명',
    loitsuChant: '가장 짙은 어둠을 뚫고 마침내 약속된 빛이 온 세상을 환하게 비춥니다.'
  }
];

const NATURE_SPIRITS = [
  '타피오 (Tapio - 끝없는 타이가 숲의 수호자이자 은빛 이끼의 왕)',
  '벨라모 (Vellamo - 천 개의 푸른 호수와 생명의 물을 다스리는 여신)',
  '일마타르 (Ilmatar - 태초의 허공과 바람을 품어 세상을 잉태한 대기의 여신)',
  '일마리넨 (Ilmarinen - 하늘 덮개를 두드려 펴고 삼포를 빚어낸 영원한 창조의 장인)'
];

/**
 * 칼레발라 삼포 번영 및 시수(Sisu) 지수를 결정론적으로 연산합니다.
 */
export function calculateFinnishKalevalaSampo(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
}): FinnishKalevalaSampoReport {
  const profile = options?.profile;
  const now = options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date();

  let seed = 1849; // 엘리아스 뢴로트 칼레발라 완결판 출간 연도

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 23 + (parts[1] || 1) * 41 + (parts[2] || 1) * 17;
  } else {
    seed += now.getFullYear() * 19 + (now.getMonth() + 1) * 37 + now.getDate() * 29;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 29 + (m || 0) * 11;
  }

  // 1. 시수(Sisu) 회복탄력성 지수 (60 ~ 99점 범위)
  const sisuResilienceIndex = 60 + (seed % 40);

  // 2. 삼포 3대 날개 점수 산출
  const flourScore = 45 + ((seed * 7 + 17) % 52);
  const saltScore = 45 + ((seed * 13 + 31) % 52);
  const goldScore = 45 + ((seed * 19 + 47) % 52);

  const wings = [
    { name: '곡물의 날개 (Jauho · 안정)' as const, score: flourScore, gift: '매일의 먹거리와 실물 기반의 든든한 일상 안정성' },
    { name: '소금의 날개 (Suola · 지혜)' as const, score: saltScore, gift: '관계와 자산을 지키는 깊은 지혜와 치유의 보존력' },
    { name: '황금의 날개 (Kulta · 번영)' as const, score: goldScore, gift: '노력의 결실을 큰 자산과 명예로 전환하는 위대한 도약' }
  ];
  wings.sort((a, b) => b.score - a.score);
  const dominantWing = wings[0];

  const sampoBalance: SampoWingsBalance = {
    flourScore,
    saltScore,
    goldScore,
    dominantWing: dominantWing.name,
    dominantGift: dominantWing.gift
  };

  // 3. 9대 룬가 중 활성 룬 선정
  const runoIdx = seed % KALEVALA_RUNOS.length;
  const activeRuno = KALEVALA_RUNOS[runoIdx];

  // 4. 대자연 수호신
  const spiritIdx = (seed + 1) % NATURE_SPIRITS.length;
  const guardianNatureSpirit = NATURE_SPIRITS[spiritIdx];

  // 5. 숲의 치유 실천
  const forestPractices = [
    '따뜻한 차 한 잔을 손에 쥐고 창밖의 나무나 식물을 5분간 바라보며 침묵하기',
    '사우나나 따뜻한 온수 샤워를 통해 북유럽식 땀 배출과 노폐물·잡념의 배출 의식',
    '주변의 작은 일상 물건 하나를 정성껏 닦거나 손질하여 장인의 정갈함 회복하기',
    '내가 가진 가장 단단한 강점 세 가지를 소리 내어 확인하는 시수(Sisu) 선언'
  ];
  const forestHealingPractice = forestPractices[seed % forestPractices.length];

  const kalevalaWisdom = `불굴의 시수(Sisu) 정신(${sisuResilienceIndex}점)과 삼포의 [${dominantWing.name}]이 공명하고 있습니다. ${activeRuno.loitsuChant}`;

  return {
    engineVersion: FINNISH_KALEVALA_SAMPO_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    sisuResilienceIndex,
    sampoBalance,
    activeRuno,
    guardianNatureSpirit,
    forestHealingPractice,
    kalevalaWisdom
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatFinnishKalevalaSampoPrompt(report: FinnishKalevalaSampoReport): string {
  const sb = report.sampoBalance;
  const r = report.activeRuno;

  return `[🌾 고대 핀란드 칼레발라(Kalevala) 삼포(Sampo) & 9대 룬가 실측 데이터]
======================================================================
엔진 버전: ${report.engineVersion} | 연산 시각: ${report.calculatedAt}
시수(Sisu) 회복탄력성 지수: ${report.sisuResilienceIndex} / 100점 | 수호 정령: ${report.guardianNatureSpirit}
======================================================================
1. [기적의 맷돌 삼포(Sampo) 3대 번영 밸런스]:
   - 주재 번영 날개: [${sb.dominantWing}]
   - 주재 축복 선물: ${sb.dominantGift}
   - 삼포 3대 날개 수치:
     * 곡물의 날개 (안정/기반): ${sb.flourScore}점
     * 소금의 날개 (지혜/보존): ${sb.saltScore}점
     * 황금의 날개 (성취/번영): ${sb.goldScore}점

2. [바이내뫼이넨의 9대 신성 룬가(Runo) 신탁]:
   - 주재 룬: 제${r.runoNumber}장 [${r.runoTitle}]
   - 신화적 기원: ${r.mythicOrigin}
   - 로이추(마법 치유 노래): "${r.loitsuChant}"

3. [북유럽식 치유 처방 & 칼레발라 지혜]:
   - 실천 처방: ${report.forestHealingPractice}
   - 칼레발라 총평: ${report.kalevalaWisdom}
======================================================================`;
}
