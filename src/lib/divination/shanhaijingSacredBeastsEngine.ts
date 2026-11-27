/**
 * =========================================================================
 * LUCKEY 고대 동양 산해경(山海經) 8방위 신성 영수(神獸) & 오행 방호 나침반 엔진
 * (Classic of Mountains and Seas [Shanhaijing] Sacred Beasts Compass Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 동양 최고(最古)의 상고시대 신화·지리 비서(祕書) 《산해경(山海經)》 원전.
 * 
 * 1. 8방위 신성 영수(Eight Directional Sacred Beasts):
 *    - 동방: 응룡 (應龍, Yinglong) - 비바람을 부르고 묵은 장벽을 허무는 날개 달린 지고의 용
 *    - 남방: 봉황 (鳳凰, Fenghuang) - 오덕(德)을 갖추고 태평성대를 여는 상서로운 신성한 새
 *    - 서방: 백택 (白澤, Baize) - 만물의 형상과 11,520 신령의 이름을 꿰뚫어 액을 물리치는 지혜의 영수
 *    - 북방: 구미호 (九尾狐, Gumiho) - 청구국의 상서로움이자 지혜로운 자손 번영과 위기 회피
 *    - 북동(귀문): 개명수 (開明獸, Kaimingshou) - 곤륜산 9대 신성한 문을 지키는 9두 호랑이 수호신
 *    - 남동(손방): 비익조 (比翼鳥, Biyiniao) - 날개와 눈을 하나씩 나누어 함께 비상하는 절대적 인연
 *    - 남서(곤방): 기린 (麒麟, Qilin) - 자비와 온덕을 품고 평화의 시대를 알리는 길상의 상징
 *    - 북서(건방): 촉룡 (燭龍, Zhulong) - 눈을 뜨면 낮이 되고 눈을 감으면 밤이 되는 우주의 시공간 주재신
 * 2. 오행(목·화·토·금·수) 수호 에너지 및 영수 공명도.
 * 3. 벽사(辟邪) 액운 차폐율 및 영적 방호 지수 (0~100).
 * 4. 산해경 길상 개운 행동 처방.
 */

import type { UserProfile } from '../sharedState';

export const SHANHAIJING_SACRED_BEASTS_ENGINE_VERSION = '2.4.0';

export interface SacredBeast {
  name: string;
  nameHanja: string;
  direction: string;
  element: string;
  mythicRole: string;
  spiritualProtection: string;
  auspiciousMessage: string;
}

export interface ShanhaijingReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  spiritualShieldingIndex: number; // 영적 방호 및 벽사 차폐율 0~100
  activeBeast: SacredBeast;
  secondaryBeast: SacredBeast;
  elementHarmony: string;
  repellingAction: string; // 벽사 개운 실천
  shanhaijingWisdom: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  shanhaijingSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    shanhaijingCrossAxis: string;
  };
}

function formatShanhaijingKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

const SACRED_BEASTS: SacredBeast[] = [
  {
    name: '응룡',
    nameHanja: '應龍 (Yinglong)',
    direction: '정동방 (震宮 · 木)',
    element: '목(木)과 수(水) · 뇌우의 권능',
    mythicRole: '황제(黃帝)와 치우의 대전에서 천둥과 폭우를 다스리고 황하의 물길을 터 만물을 구원한 지고의 날개 달린 용',
    spiritualProtection: '답답하게 정체된 현실의 둑을 단숨에 터뜨리고 강력한 돌파구를 열어주는 비상의 기운',
    auspiciousMessage: '때를 만나면 날개를 펼쳐 구름을 뚫고 솟구치니, 눈앞의 작은 장애에 주저하지 말고 웅지를 펼치십시오.'
  },
  {
    name: '봉황',
    nameHanja: '鳳凰 (Fenghuang)',
    direction: '정남방 (離宮 · 火)',
    element: '화(火)와 양명(陽明) · 오덕의 결정체',
    mythicRole: '머리는 덕(德), 날개는 의(義), 등은 예(禮), 가슴은 인(仁), 배는 신(信)을 품고 태평성대에만 날아드는 신조',
    spiritualProtection: '원망과 갈등을 녹여 화합을 부르고, 고귀한 명예와 품격 있는 번영을 이끄는 광명의 수호',
    auspiciousMessage: '오동나무가 아니면 깃들지 않고 대나무 열매가 아니면 먹지 않듯, 올곧은 원칙을 지킬 때 지고의 길상이 찾아옵니다.'
  },
  {
    name: '백택',
    nameHanja: '白澤 (Baize)',
    direction: '정서방 (兌宮 · 金)',
    element: '금(金)과 설백(雪白) · 통찰의 지혜',
    mythicRole: '동해의 성스러운 산에 살며 인간의 말을 하고 만물의 정체와 11,520종 모든 요괴·사귀의 이름을 꿰뚫는 지혜의 짐승',
    spiritualProtection: '사기(詐欺), 음해, 거짓된 유혹의 실체를 백일하에 드러내어 단 한 치의 사기(邪氣)도 침범치 못하게 하는 통찰의 방패',
    auspiciousMessage: '어둠의 실체를 알고 이름을 부르면 두려움은 저절로 사라집니다. 본질을 꿰뚫는 예리한 안목을 견지하십시오.'
  },
  {
    name: '구미호',
    nameHanja: '九尾狐 (Gumiho)',
    direction: '정북방 (坎宮 · 水)',
    element: '수(水)와 음유(陰柔) · 상서로운 지혜',
    mythicRole: '청구국(靑丘國)에 사는 신수로 아홉 개의 꼬리는 자손의 번창을, 빼어난 지략은 위기 속 생존과 번영을 상징',
    spiritualProtection: '예측 불허의 복잡한 환경에서 기민하게 수를 읽고 위기를 기회로 역전시키는 상서로운 유연성',
    auspiciousMessage: '강한 힘보다 유연한 지략이 승리를 낳습니다. 상황의 물결을 거스르지 말고 지혜롭게 타고 넘으십시오.'
  },
  {
    name: '개명수',
    nameHanja: '開明獸 (Kaimingshou)',
    direction: '북동방 (艮宮 · 土 / 곤륜의 귀문)',
    element: '토(土)와 금(金) · 천문의 수호',
    mythicRole: '신들의 거처인 곤륜산 9대 관문을 지키며 호랑이의 몸에 아홉 사람의 얼굴을 지녀 사방을 동시에 감시하는 수문장',
    spiritualProtection: '경계선과 문턱에서 발생하는 모든 부정적 에너지와 기운의 혼란을 원천 차단하는 철벽의 수호',
    auspiciousMessage: '새로운 영역으로 나아갈 때 문을 단단히 지키십시오. 기초를 확고히 다진 자만이 신성한 세계로 진입합니다.'
  },
  {
    name: '비익조',
    nameHanja: '比翼鳥 (Biyiniao)',
    direction: '남동방 (巽宮 · 木)',
    element: '목(木)과 풍(風) · 화합의 날개',
    mythicRole: '남방의 숭오산에 살며 눈과 날개가 각각 하나뿐이라 암수가 나란히 몸을 맞대어야만 하늘을 나는 인연의 신조',
    spiritualProtection: '독단을 경계하고 동반자와의 완벽한 신뢰를 구축하여 혼자서는 이룰 수 없는 원대한 비상을 가능케 함',
    auspiciousMessage: '진정한 성공은 협력에서 피어납니다. 곁에 있는 파트너의 가치를 귀히 여기고 날개를 맞대어 비상하십시오.'
  },
  {
    name: '기린',
    nameHanja: '麒麟 (Qilin)',
    direction: '남서방 (坤宮 · 土)',
    element: '토(土)와 모성 · 자비의 지혜',
    mythicRole: '살아있는 풀을 밟지 않고 살아있는 벌레를 해치지 않으며 어진 성인(聖人)이 세상에 출현할 때 나타나는 인덕의 영수',
    spiritualProtection: '불필요한 살기(殺氣)와 공격성을 무력화하고 평화로운 결실과 대지의 풍요로운 안정을 안배함',
    auspiciousMessage: '자비와 온유함이 가장 단단한 갑옷입니다. 겸허한 덕을 베풀 때 만인이 자발적으로 머리를 숙입니다.'
  },
  {
    name: '촉룡',
    nameHanja: '燭龍 (Zhulong)',
    direction: '북서방 (乾宮 · 金 / 종산의 천문)',
    element: '화(火)와 금(金) · 시공간의 통어',
    mythicRole: '종산(鍾山)에 거하며 인간의 얼굴에 뱀의 몸을 지녀 눈을 뜨면 낮이 되고 감으면 밤이 되며 입김을 불면 겨울이 되는 태초의 영신',
    spiritualProtection: '시간의 흐름과 타이밍을 아군으로 만들고 혼돈의 암흑 속에서도 꺼지지 않는 횃불(燭)의 조명력',
    auspiciousMessage: '지금은 어둠 속에서 등불을 켜고 호흡을 고를 때입니다. 당신이 눈을 뜨는 순간 새로운 새벽이 밝아옵니다.'
  }
];

/**
 * 사용자 프로필 및 타임스탬프를 기반으로
 * 산해경 8방위 신수와 오행 방호 지수를 결정론적으로 연산합니다.
 */
export function calculateShanhaijingSacredBeasts(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
  question?: string;
  now?: Date;
}): ShanhaijingReport {
  const profile = options?.profile;
  const now = options?.now ?? (options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date());
  const q = options?.question?.trim() || '';

  let seed = 3388; // 산해경 원전 상징수
  for (let i = 0; i < q.length; i++) {
    seed = (seed * 31 + q.charCodeAt(i)) % 1000003;
  }

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 17 + (parts[1] || 1) * 31 + (parts[2] || 1) * 19;
  } else {
    seed += now.getFullYear() * 11 + (now.getMonth() + 1) * 23 + now.getDate() * 29;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 31 + (m || 0) * 5;
  }

  // 1. 영적 방호 및 벽사 차폐율 (60 ~ 99점 범위)
  const spiritualShieldingIndex = 60 + (seed % 40);

  // 2. 8방위 신수 선정
  const beastIdx = seed % SACRED_BEASTS.length;
  const secondaryBeastIdx = (beastIdx + 1 + ((seed >> 3) % (SACRED_BEASTS.length - 1))) % SACRED_BEASTS.length;
  const activeBeast = SACRED_BEASTS[beastIdx];
  const secondaryBeast = SACRED_BEASTS[secondaryBeastIdx];

  // 3. 오행 조화도
  const elementHarmonies = [
    '목생화(木生火)의 약동하는 상생 활력장 형성',
    '화생토(火生土)의 굳건한 현실 안정 및 신뢰 기반 구축',
    '토생금(土生金)의 결실과 명확한 결단의 결속력 강화',
    '금생수(金生水)의 깊은 지혜와 유연한 직관적 흐름',
    '수생목(水生木)의 끊임없는 배움과 생명력의 순환'
  ];
  const elementHarmony = elementHarmonies[seed % elementHarmonies.length];

  // 4. 벽사 개운 실천
  const repellingActions = [
    '동쪽 창문을 활짝 열고 아침 햇살을 마주하며 깊은 호흡으로 탁기를 뱉어내는 토고납신(吐故納新)',
    '현관문 안쪽이나 신발장을 정갈히 정돈하여 외부로부터 유입되는 혼탁한 기운을 차단하기',
    '붉은색 계열의 작은 소품이나 따뜻한 온도의 음료로 심장의 양기를 보강하는 벽사 의식',
    '복잡한 잡념이 일어날 때마다 백택의 신성한 이름을 마음속으로 되뇌며 생각의 본질 살피기'
  ];
  const repellingAction = repellingActions[seed % repellingActions.length];

  const shanhaijingWisdom = `산해경 주재 영수 [${activeBeast.name}(${activeBeast.nameHanja})]의 가호 아래 방호 결계가 형성되었습니다. ${activeBeast.auspiciousMessage}`;
  const calculatedAtKst = formatShanhaijingKstTimestamp(now);
  const shanhaijingCrossAxis = `[${activeBeast.name}] × [${secondaryBeast.name}] × [${activeBeast.direction}] × [${elementHarmony.split('의')[0]}]`;
  const shanhaijingSynthesisMatrix = {
    dominantTension: `${activeBeast.name} (${activeBeast.direction}) ↔ ${secondaryBeast.name} (${elementHarmony})`,
    alignmentState: `${activeBeast.spiritualProtection}`,
    integratedAction: `${repellingAction}${q ? ` [질문 맥락: ${q}]` : ''}`,
    shanhaijingCrossAxis,
  };
  const ritualAction = `[${activeBeast.name} · ${activeBeast.direction}] ${repellingAction}`;
  const reflectionFocus = `산해경 8방위 영수(${activeBeast.name}) — ${elementHarmony}`;
  const reflectiveQuestion = q
    ? `지금 마주하신 '${q}'의 자리에서, '${activeBeast.name}'의 수호 기운을 빌려 과감히 지켜내거나 돌파해야 할 경계는 무엇입니까?`
    : `오늘 내 마음이 흔들리는 틈으로 들어오는 불필요한 소음을 막고 '${activeBeast.name}'의 덕목을 세울 한 가지는 무엇입니까?`;
  const interpretiveBoundary = '이 리포트는 《산해경》 8방위 신성 영수와 오행 방호 상징을 바탕으로 한 자기 성찰 비유이며, 초자연적 길흉 단정이나 의학적 조언이 아닙니다.';

  return {
    engineVersion: SHANHAIJING_SACRED_BEASTS_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    spiritualShieldingIndex,
    activeBeast,
    secondaryBeast,
    elementHarmony,
    repellingAction,
    shanhaijingWisdom,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    shanhaijingSynthesisMatrix,
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatShanhaijingSacredBeastsPrompt(report: ShanhaijingReport): string {
  const b = report.activeBeast;

  return `[🐉 고대 동양 산해경(山海經) 8방위 신성 영수(神獸) & 오행 방호 실측 데이터]
======================================================================
엔진 버전: v${report.engineVersion} | 연산 시각: ${report.calculatedAtKst}
오행 상생: ${report.elementHarmony}
======================================================================
1. [주재 신성 영수 (Sacred Beast)]:
   - 영수명: [${b.name}] (${b.nameHanja}) | 보조 교차 영수: [${report.secondaryBeast.name}] (${report.secondaryBeast.direction})
   - 주재 방위: ${b.direction} | 원소: ${b.element}
   - 신화적 위격: ${b.mythicRole}
   - 영적 수호력: ${b.spiritualProtection}
   - 길상 전언: "${b.auspiciousMessage}"

2. [벽사(辟邪) 개운 실천 & 교차 매트릭스]:
   - 벽사 행동 처방: ${report.repellingAction}
   - 종합 수호 조언: ${report.shanhaijingWisdom}${report.shanhaijingSynthesisMatrix ? `\n   - 교차 매트릭스 [핵심 긴장: ${report.shanhaijingSynthesisMatrix.dominantTension} | 조율 상태: ${report.shanhaijingSynthesisMatrix.alignmentState}]\n   - 4중 교차 축: ${report.shanhaijingSynthesisMatrix.shanhaijingCrossAxis}\n   - 통합 실천: ${report.shanhaijingSynthesisMatrix.integratedAction}` : ''}
   - 실천 의례: ${report.ritualAction}
   - 성찰 초점: ${report.reflectionFocus}
   - 성찰 질문: ${report.reflectiveQuestion}
   - 해석 경계: ${report.interpretiveBoundary}
======================================================================`;
}
