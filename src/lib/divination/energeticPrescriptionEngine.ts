/**
 * =========================================================================
 * LUCKEY 결핍 오행 & 바이오 에너지 맞춤 처방 엔진 (Energetic Prescription Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 결핍/과다/용신 오행 다차원 수리 연산:
 *    - 사주 4주 8자의 목·화·토·금·수 오행 분포(0~8) 및 조후·억부 용신을 정밀 분석하여
 *      완전 결핍(0개), 부족(1개), 과다(3개 이상) 오행을 산출
 * 2. 바이오 에너지 & 인체 장부·차크라 맵핑:
 *    - 오행-오장육부(간담·심소장·비위·폐대장·신방광) 및 7대 차크라와의 정밀 연계를 통해
 *      신체 활력, 피로 지점, 에너지 불균형 징후를 진단
 * 3. 1분 마이크로 개운 행동 프로토콜 (Micro-Ritual):
 *    - 바쁜 현대인이 일상에서 즉각 실천할 수 있는 60초 미세 행동(호흡, 오감 앵커링, 제스처)을
 *      결핍 기운에 맞추어 처방
 * 4. 라이프스타일 & 공간 오행 처방:
 *    - 보약 컬러(Hex), 식이 처방(오미), 힐링 아로마, 풍수 방위 및 데일리 확언 도출
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult,
  type FiveElement
} from '../sajuAnalysis';

export const ENERGETIC_PRESCRIPTION_ENGINE_VERSION = 'LUCKEY-EPE-v2.2.0';

function formatEnergeticKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type ElementBalanceStatus = '완전결핍(Void)' | '부족(Deficient)' | '적정(Balanced)' | '과다(Excess)';

export interface SingleElementDiagnosis {
  element: FiveElement;
  elementKo: string;
  count: number;
  percentage: number;
  status: ElementBalanceStatus;
  organYang: string; // 육부 (담, 소장, 위장, 대장, 방광)
  organYin: string;  // 오장 (간, 심장, 비장, 폐, 신장)
  associatedChakra: string;
  psychologicalFunction: string;
  fatigueSymptom: string;
}

export interface MicroRitualItem {
  id: string;
  title: string;
  durationSeconds: number;
  category: '호흡' | '신체움직임' | '오감앵커링' | '환경정돈';
  actionStep: string;
  expectedSensation: string;
}

export interface LifestyleRemedy {
  luckyColors: Array<{ name: string; hex: string; role: string }>;
  foodPrescription: {
    taste: string; // 산, 고, 감, 신, 함 (오미)
    keyIngredients: string[];
    drinkRecommendation: string;
  };
  aromaEssentialOils: string[];
  fengShuiDirection: string;
  spatialObject: string;
  dailyAffirmation: string;
}

export interface EnergeticPrescriptionResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  profileDigest: {
    solarDateString: string;
    gender: string;
    dayMasterGan: string;
    dayMasterElement: FiveElement;
    bodyStrength: string;
  };

  // 1. 오행 분포 및 불균형 진단
  elementDiagnosis: {
    counts: Record<FiveElement, number>;
    percentages: Record<FiveElement, number>;
    allDiagnoses: Record<FiveElement, SingleElementDiagnosis>;
    primaryLacking: FiveElement;
    secondaryLacking: FiveElement | null;
    excessElements: FiveElement[];
    therapeuticYongsin: FiveElement;
    supportiveHeeshin: FiveElement;
    balanceSummary: string;
  };

  // 2. 바이오 에너지 & 장부·차크라 정렬
  bioEnergeticAlignment: {
    vulnerableOrgans: string[];
    affectedChakra: string;
    vitalityLevel: '에너지 분산' | '에너지 위축' | '에너지 정체' | '균형 순환';
    psychologicalImbalance: string;
    vitalityRecoveryVector: string;
  };

  // 3. 1분 마이크로 개운 행동
  microRituals: MicroRitualItem[];

  // 4. 라이프스타일 & 공간 오행 처방
  lifestyleRemedy: LifestyleRemedy;

  // 5. 교차 매트릭스
  energeticSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  reflectiveQuestion?: string;
  ritualAction: string;
  reflectionFocus: string;

  interpretiveBoundary: string;
}

// 오행별 메타데이터 매핑
const ELEMENT_META: Record<FiveElement, {
  nameKo: string;
  organYang: string;
  organYin: string;
  chakra: string;
  psycho: string;
  fatigue: string;
  colors: Array<{ name: string; hex: string; role: string }>;
  taste: string;
  foods: string[];
  drink: string;
  aromas: string[];
  direction: string;
  spatial: string;
  rituals: MicroRitualItem[];
  affirmation: string;
}> = {
  목: {
    nameKo: '목(木 · 성장과 활력)',
    organYang: '담낭(쓸개)',
    organYin: '간장(간)',
    chakra: '제4 아나하타(가슴 차크라) & 제3 마니푸라',
    psycho: '새로운 시작, 추진력, 창의적 영감, 결단력, 진취성',
    fatigue: '눈 피로, 안구 건조, 어깨·목 결림, 근육 경련, 결단 우유부단, 신경성 짜증',
    colors: [
      { name: '포레스트 그린', hex: '#15803d', role: '주 기운 보충' },
      { name: '세이지 민트', hex: '#6ee7b7', role: '신경 이완 및 순환' },
      { name: '스프링 올리브', hex: '#84cc16', role: '생동감 부여' }
    ],
    taste: '산미(신맛 · 수렴 및 간기 보충)',
    foods: ['케일', '시금치', '키위', '매실', '부추', '녹두', '레몬'],
    drink: '따뜻한 레몬 슬라이스 워터 또는 로즈마리 허브티',
    aromas: ['베르가못', '유칼립투스', '파인(소나무)', '사이프러스'],
    direction: '동쪽 (East · 일출과 생명의 방위)',
    spatial: '생화 화분, 작은 몬스테라, 수경식물, 원목 트레이나 식물 오브제 배치',
    rituals: [
      {
        id: 'wood-micro-1',
        title: '척추 기립 1분 나비 스트레칭',
        durationSeconds: 60,
        category: '신체움직임',
        actionStep: '의자에 앉아 양손을 깍지 끼고 머리 위로 길게 뻗은 뒤, 숨을 들이쉬며 좌우로 부드럽게 3회 기울입니다.',
        expectedSensation: '겨드랑이와 옆구리 간 경락이 펴지며 웅크렸던 생기가 척추를 타고 상승합니다.'
      },
      {
        id: 'wood-micro-2',
        title: '초록 식물/원목 감각 앵커링',
        durationSeconds: 45,
        category: '오감앵커링',
        actionStep: '주변의 초록 잎사귀나 나무 책상을 가볍게 손바닥으로 쓰다듬으며 3번의 깊은 호흡을 머금습니다.',
        expectedSensation: '자연의 결이 손끝을 통해 접촉되며 머릿속의 복잡한 생각이 맑아집니다.'
      },
      {
        id: 'wood-micro-3',
        title: '시신경 정화 온열 팜마사지',
        durationSeconds: 60,
        category: '호흡',
        actionStep: '양 손바닥을 30초간 빠르게 비벼 열을 낸 뒤, 눈을 감고 양손으로 눈가를 살포시 덮어 온기를 전달합니다.',
        expectedSensation: '눈의 피로가 즉각 풀리며 간에 몰렸던 열감이 편안하게 가라앉습니다.'
      }
    ],
    affirmation: '나는 부드럽게 뻗어나가는 새싹처럼, 가볍고 명쾌하게 나만의 방향을 정하고 성장한다.'
  },

  화: {
    nameKo: '화(火 · 열정과 온기)',
    organYang: '소장',
    organYin: '심장',
    chakra: '제3 마니푸라(태양신경총) & 제2 스바디스타나',
    psycho: '자기표현, 열정, 카리스마, 친화력, 직관적 확신, 기쁨',
    fatigue: '가슴 답답함, 두근거림, 안면 열감, 수면 불규칙, 동기 저하, 위축감, 수족냉증',
    colors: [
      { name: '앰버 크림슨', hex: '#e11d48', role: '심장 열정 활성화' },
      { name: '선셋 코랄', hex: '#fb923c', role: '생기와 온기 확산' },
      { name: '로즈 골드', hex: '#f43f5e', role: '부드러운 카리스마' }
    ],
    taste: '고미(쓴맛 · 심열 조율 및 기운 하강)',
    foods: ['토마토', '비트', '수수', '자몽', '다크초콜릿', '구기자', '석류'],
    drink: '따뜻한 루이보스티 또는 히비스커스 티',
    aromas: ['스위트 오렌지', '시나몬', '자스민', '로즈 오토'],
    direction: '남쪽 (South · 밝은 조도와 전성기의 방위)',
    spatial: '붉은 계열 포인트 쿠션, 따뜻한 2700K 전구색 간접 조명, 캔들 오브제',
    rituals: [
      {
        id: 'fire-micro-1',
        title: '30초 창가 태양광 하베스팅',
        durationSeconds: 45,
        category: '오감앵커링',
        actionStep: '창가로 다가가 눈을 감고 따사로운 자연광을 이마와 양 뺨에 30초간 받아들입니다.',
        expectedSensation: '세로토닌 분비가 촉진되며 가슴 안쪽에 은은한 온열감이 차오릅니다.'
      },
      {
        id: 'fire-micro-2',
        title: '심장-단전 하트 코히어런스 호흡',
        durationSeconds: 60,
        category: '호흡',
        actionStep: '오른손을 가슴 정중앙(심장)에 얹고, 5초간 가슴으로 숨을 마시고 5초간 따뜻하게 내쉽니다.',
        expectedSensation: '불안했던 심장 리듬이 편안한 맥동으로 정렬되며 내면의 자신감이 회복됩니다.'
      },
      {
        id: 'fire-micro-3',
        title: '소리 내어 말하는 1문장 감사 선언',
        durationSeconds: 30,
        category: '환경정돈',
        actionStep: '오늘 하루 감사하거나 기분 좋은 일 딱 한 가지를 소리 내어 또박또박 읊조립니다.',
        expectedSensation: '음성 파동이 가슴에 공명하며 굳어 있던 표현력이 부드럽게 풀립니다.'
      }
    ],
    affirmation: '내 안의 따뜻한 빛은 주변을 밝히고, 나는 있는 그대로 빛나며 자연스럽게 환영받는다.'
  },

  토: {
    nameKo: '토(土 · 그라운딩과 중심)',
    organYang: '위장',
    organYin: '비장',
    chakra: '제1 물라다라(뿌리 차크라) & 제3 마니푸라',
    psycho: '안정감, 신뢰, 포용력, 흔들리지 않는 중심, 중재력, 현실 적응',
    fatigue: '소화불량, 더부룩함, 생각 과부하, 쓸데없는 걱정(반추), 무기력증, 뼈/관절 허약',
    colors: [
      { name: '어스 샌드', hex: '#d97706', role: '안정적 중심 유지' },
      { name: '테라코타 웜', hex: '#b45309', role: '위장 온기 보호' },
      { name: '내추럴 오트밀', hex: '#fef3c7', role: '부드러운 포용력' }
    ],
    taste: '감미(자연 단맛 · 비위 기운 보양)',
    foods: ['고구마', '단호박', '연근', '현미', '기장', '표고버섯', '대추'],
    drink: '따뜻한 작두콩차, 둥굴레차 또는 따뜻한 미온수',
    aromas: ['샌달우드(백단향)', '패출리', '베티버', '진저'],
    direction: '중앙 (Center · 사방을 조율하는 중심 방위)',
    spatial: '도자기 화병, 황토/테라코타 컵, 묵직한 스톤 페이퍼웨이트, 린넨 패브릭',
    rituals: [
      {
        id: 'earth-micro-1',
        title: '양발 어싱(Earthing) 바닥 접지',
        durationSeconds: 60,
        category: '신체움직임',
        actionStep: '신발이나 슬리퍼를 벗고 양발을 바닥에 나란히 붙인 뒤, 체중을 발뒤꿈치에 싣고 바닥의 지지력을 느낍니다.',
        expectedSensation: '붕 떠 있던 머릿속 잡념이 발바닥을 통해 땅으로 빠져나가며 안정감이 생깁니다.'
      },
      {
        id: 'earth-micro-2',
        title: '복부 단전 시계방향 1분 원형 마사지',
        durationSeconds: 60,
        category: '오감앵커링',
        actionStep: '배꼽 주위에 따뜻한 손을 얹고 시계 방향으로 천천히 원을 그리며 지그시 쓸어내립니다.',
        expectedSensation: '긴장했던 소화기 근막이 이완되며 가슴과 위의 답답한 얹힘이 사르르 풀립니다.'
      },
      {
        id: 'earth-micro-3',
        title: '따뜻한 미온수 3모금 음미',
        durationSeconds: 45,
        category: '오감앵커링',
        actionStep: '체온과 비슷한 따뜻한 물 한 컵을 준비해, 천천히 혀와 목을 적시며 세 모금에 나누어 마십니다.',
        expectedSensation: '위벽이 따뜻하게 감싸지며 초조했던 마음이 차분하게 바닥으로 내려앉습니다.'
      }
    ],
    affirmation: '나는 대지처럼 단단하고 평온하며, 내 삶의 모든 선택은 안정된 중심에서 시작된다.'
  },

  금: {
    nameKo: '금(金 · 결단과 명료함)',
    organYang: '대장',
    organYin: '폐장(폐)',
    chakra: '제5 비슈다(목 차크라) & 제6 아즈나(미간 차크라)',
    psycho: '체계화, 군더더기 제거, 명확한 기준, 결단, 절제, 핵심 요약',
    fatigue: '호흡 얕음, 피부 건조, 비염/기침, 경계선 모호(거절 못함), 산만함, 정리정돈 불가',
    colors: [
      { name: '스노우 펄 화이트', hex: '#f8fafc', role: '군더더기 없는 순결성' },
      { name: '플래티넘 실버', hex: '#94a3b8', role: '명료한 기준과 구조' },
      { name: '크리스털 아이스', hex: '#e2e8f0', role: '냉철한 판단력' }
    ],
    taste: '신미(매운맛/발산 · 폐기운 순환 및 정체 해소)',
    foods: ['배', '도라지', '무', '양파', '마늘', '백목이버섯', '콜리플라워'],
    drink: '따뜻한 배도라지차 또는 은은한 페퍼민트 티',
    aromas: ['페퍼민트', '티트리', '프랑킨센스(유향)', '클라리세이지'],
    direction: '서쪽 (West · 수확과 정돈, 일몰의 명료한 방위)',
    spatial: '금속성 메탈 볼펜/오브제, 유리 크리스털, 화이트 미니멀 데스크 패드',
    rituals: [
      {
        id: 'metal-micro-1',
        title: '4-4-6 크리스털 박스 호흡',
        durationSeconds: 60,
        category: '호흡',
        actionStep: '4초간 코로 숨을 깊게 들이쉬고, 4초간 숨을 멈추고, 6초간 입으로 가늘고 길게 내쉽니다. 4회 반복.',
        expectedSensation: '폐포 끝까지 맑은 산소가 공급되며 산만했던 머릿속이 칼처럼 명쾌해집니다.'
      },
      {
        id: 'metal-micro-2',
        title: '데스크/화면 1분 미니멀 정돈',
        durationSeconds: 60,
        category: '환경정돈',
        actionStep: '시야에 걸리는 쓰레기나 불필요한 메모지 3개를 치우고, 브라우저 탭 3개를 과감하게 닫습니다.',
        expectedSensation: '물리적 공간이 비워지면서 정신적인 여백과 선명한 집중력이 확보됩니다.'
      },
      {
        id: 'metal-micro-3',
        title: '명확한 경계선 바운더리 의식화',
        durationSeconds: 45,
        category: '오감앵커링',
        actionStep: '양손을 가슴 앞에서 살짝 밀어내듯 뻗으며, "지금 내게 불필요한 것은 정중히 사양한다"고 마음속으로 선언합니다.',
        expectedSensation: '타인의 감정에 휩쓸리지 않는 단단한 심리적 보호막이 형성됩니다.'
      }
    ],
    affirmation: '나는 나에게 진짜 중요한 본질만 명확히 남기고, 불필요한 군더더기는 가볍게 털어낸다.'
  },

  수: {
    nameKo: '수(水 · 지혜와 심층 회복)',
    organYang: '방광',
    organYin: '신장(콩팥)',
    chakra: '제2 스바디스타나(천골 차크라) & 제7 사하스라라',
    psycho: '유연성, 깊은 통찰, 회복 탄력성, 지혜, 수용성, 심층 휴식',
    fatigue: '만성 부신 피로, 허리/하체 시림, 귀 울림(이명), 두려움/공포감, 탈진, 번아웃',
    colors: [
      { name: '미드나잇 옵시디언', hex: '#0f172a', role: '심층 에너지 보존' },
      { name: '딥 사파이어', hex: '#1e3a8a', role: '고요한 통찰 촉진' },
      { name: '아쿠아 마린', hex: '#0284c7', role: '유연한 수분 순환' },
    ],
    taste: '함미(천연 짠맛 · 신장 수분 대사 조율)',
    foods: ['검은콩', '흑임자(검은깨)', '미역', '다시마', '블루베리', '목이버섯', '호두'],
    drink: '천연 미네랄 워터 또는 따뜻한 검은콩차',
    aromas: ['라벤더', '카모마일', '일랑일랑', '시더우드'],
    direction: '북쪽 (North · 고요한 축적과 지혜의 방위)',
    spatial: '미니 분수대, 물그릇 오브제, 딥블루 벨벳 패브릭, 조도를 낮춘 암막 환경',
    rituals: [
      {
        id: 'water-micro-1',
        title: '신유혈(허리 뒤 신장) 1분 온열 마찰',
        durationSeconds: 60,
        category: '신체움직임',
        actionStep: '양손 주먹을 가볍게 쥐고 등 뒤 허리 오목한 신장 부위(갈비뼈 바로 아래)를 위아래로 30회 빠르게 문지릅니다.',
        expectedSensation: '허리와 하체로 즉시 따뜻한 기운이 돌며 지쳤던 부신 에너지가 빠르게 재충전됩니다.'
      },
      {
        id: 'water-micro-2',
        title: '심해 암전 마인드 리셋',
        durationSeconds: 60,
        category: '호흡',
        actionStep: '모든 조명을 끄거나 눈을 완전히 감고, 끝없이 고요하고 평온한 심해 바닷속에 둥둥 떠 있는 상상을 합니다.',
        expectedSensation: '신경계의 과열이 꺼지며 깊은 고요와 원초적인 안도감이 차오릅니다.'
      },
      {
        id: 'water-micro-3',
        title: '미네랄 수분 천천히 씹어 마시기',
        durationSeconds: 45,
        category: '오감앵커링',
        actionStep: '상온의 미네랄 워터 한 모금을 입안에 머금고 10초간 굴린 뒤 천천히 식도로 넘깁니다.',
        expectedSensation: '마른 신체 세포 구석구석으로 생명수가 스며들며 유연성이 회복됩니다.'
      }
    ],
    affirmation: '나는 바다처럼 유연하고 깊으며, 어떤 장애물도 부드럽게 감싸 안고 유유히 흘러간다.'
  }
};

/**
 * 사용자 프로필을 바탕으로 오행 균형, 생활 습관 조언과 1분 마이크로 개운 행동을 계산합니다.
 */
export function calculateEnergeticPrescription(options: {
  profile?: UserProfile;
  currentDate?: Date;
  question?: string;
}): EnergeticPrescriptionResult {
  const now = options.currentDate || new Date();
  const nowUtcIso = now.toISOString();
  const nowKstIso = formatEnergeticKstTimestamp(now);

  const saju: SajuAnalysisResult = calculateDetailedSaju(options.profile);

  // 1. 오행 개수 및 비율 추출
  const counts = saju.elements?.counts || { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const percentages = saju.elements?.percentages || { 목: 20, 화: 20, 토: 20, 금: 20, 수: 20 };

  // 2. 단일 오행별 상태 진단
  const allDiagnoses: Record<FiveElement, SingleElementDiagnosis> = {} as any;
  const elementsList: FiveElement[] = ['목', '화', '토', '금', '수'];

  elementsList.forEach((el) => {
    const c = counts[el] ?? 0;
    const p = percentages[el] ?? 0;
    let status: ElementBalanceStatus = '적정(Balanced)';
    if (c === 0) status = '완전결핍(Void)';
    else if (c === 1) status = '부족(Deficient)';
    else if (c >= 3) status = '과다(Excess)';

    const meta = ELEMENT_META[el];
    allDiagnoses[el] = {
      element: el,
      elementKo: meta.nameKo,
      count: c,
      percentage: p,
      status,
      organYang: meta.organYang,
      organYin: meta.organYin,
      associatedChakra: meta.chakra,
      psychologicalFunction: meta.psycho,
      fatigueSymptom: meta.fatigue,
    };
  });

  // 3. 결핍 오행 랭킹 산출 (0개 최우선, 그 다음 1개)
  const sortedByScarcity = [...elementsList].sort((a, b) => {
    return (counts[a] ?? 0) - (counts[b] ?? 0);
  });

  // 용신 및 희신 참조
  const therapeuticYongsin: FiveElement = saju.yongsin?.element || sortedByScarcity[0] || '목';
  const supportiveHeeshin: FiveElement = saju.yongsinDetails?.heeshin || sortedByScarcity[1] || '화';

  // 제1 결핍: 0개인 오행이 있으면 0개인 오행 중 첫 번째, 없으면 용신 오행
  let primaryLacking: FiveElement = sortedByScarcity[0];
  if (counts[primaryLacking] > 0 && therapeuticYongsin) {
    primaryLacking = therapeuticYongsin;
  }

  // 제2 결핍: 제1 결핍과 다른 다음 후보
  let secondaryLacking: FiveElement | null = sortedByScarcity[1] !== primaryLacking ? sortedByScarcity[1] : (sortedByScarcity[2] || null);
  if (secondaryLacking && counts[secondaryLacking] >= 3) {
    secondaryLacking = null; // 과다인 경우 제2 결핍으로 삼지 않음
  }

  const excessElements = elementsList.filter((el) => (counts[el] ?? 0) >= 3);

  // 오행 진단 요약 생성
  const voidList = elementsList.filter((el) => (counts[el] ?? 0) === 0);
  const deficientList = elementsList.filter((el) => (counts[el] ?? 0) === 1);
  let balanceSummary = '';
  if (voidList.length > 0) {
    balanceSummary = `원국 내 ${voidList.join(', ')} 기운이 0개로 완전 결핍되어 있어, 보약 처방 1순위로 ${primaryLacking} 기운 충전이 시급합니다.`;
  } else if (deficientList.length > 0) {
    balanceSummary = `오행이 고루 분포하나 ${deficientList.join(', ')} 기운이 상대적으로 약해, 용신인 ${therapeuticYongsin} 기운을 활성화할 때 전체 순환이 완성됩니다.`;
  } else {
    balanceSummary = `오행이 균형 있게 흐르고 있으며, 용신 ${therapeuticYongsin}(보약)과 희신 ${supportiveHeeshin}(생기)을 돋우면 한층 최적화됩니다.`;
  }

  // 4. 바이오 에너지 및 장부·차크라 정렬
  const primaryMeta = ELEMENT_META[primaryLacking];
  const vulnerableOrgans = [primaryMeta.organYin, primaryMeta.organYang];
  if (secondaryLacking) {
    const secMeta = ELEMENT_META[secondaryLacking];
    vulnerableOrgans.push(secMeta.organYin);
  }

  let vitalityLevel: '에너지 분산' | '에너지 위축' | '에너지 정체' | '균형 순환' = '에너지 위축';
  if (excessElements.length > 0 && voidList.length > 0) vitalityLevel = '에너지 정체';
  else if (excessElements.length > 0) vitalityLevel = '에너지 분산';
  else if (voidList.length === 0 && deficientList.length <= 1) vitalityLevel = '균형 순환';

  // 5. 1분 마이크로 개운 행동 확정
  const microRituals: MicroRitualItem[] = [...primaryMeta.rituals];
  if (secondaryLacking) {
    const secMeta = ELEMENT_META[secondaryLacking];
    if (secMeta.rituals[0]) {
      microRituals.push(secMeta.rituals[0]);
    }
  }

  // 6. 라이프스타일 처방
  const lifestyleRemedy: LifestyleRemedy = {
    luckyColors: primaryMeta.colors,
    foodPrescription: {
      taste: primaryMeta.taste,
      keyIngredients: primaryMeta.foods,
      drinkRecommendation: primaryMeta.drink,
    },
    aromaEssentialOils: primaryMeta.aromas,
    fengShuiDirection: primaryMeta.direction,
    spatialObject: primaryMeta.spatial,
    dailyAffirmation: primaryMeta.affirmation,
  };

  const q = (options.question || '').trim();
  const energeticSynthesisMatrix = {
    dominantTension: `결핍 ${primaryLacking}(${counts[primaryLacking]}자) ↔ ${vitalityLevel}`,
    alignmentState: `용신 ${therapeuticYongsin} · 희신 ${supportiveHeeshin} (${primaryMeta.chakra})`,
    integratedAction: `${microRituals[0]?.title || primaryMeta.affirmation}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const reflectiveQuestion = q
    ? `‘${q}’ 앞에서 부족한 ${primaryLacking} 기운을 채우기 위해 오늘 60초 동안 바로 실천할 마이크로 루틴은 무엇입니까?`
    : `용신 ${therapeuticYongsin}과 결핍 ${primaryLacking}의 균형을 위해 오늘 몸과 공간에서 가장 먼저 돌볼 한 가지는 무엇입니까?`;
  const ritualAction = `${microRituals[0]?.title || primaryMeta.affirmation} · ${lifestyleRemedy.fengShuiDirection}`;

  return {
    engineVersion: ENERGETIC_PRESCRIPTION_ENGINE_VERSION,
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),

    profileDigest: {
      solarDateString: saju.solarEquivalentDate || saju.birthdate,
      gender: saju.gender,
      dayMasterGan: saju.dayMaster?.gan || '甲',
      dayMasterElement: saju.dayMaster?.element || '목',
      bodyStrength: saju.bodyStrength?.level || '중화',
    },

    elementDiagnosis: {
      counts,
      percentages,
      allDiagnoses,
      primaryLacking,
      secondaryLacking,
      excessElements,
      therapeuticYongsin,
      supportiveHeeshin,
      balanceSummary,
    },

    bioEnergeticAlignment: {
      vulnerableOrgans,
      affectedChakra: primaryMeta.chakra,
      vitalityLevel,
      psychologicalImbalance: primaryMeta.fatigue,
      vitalityRecoveryVector: `${primaryLacking} 기운을 보완하여 ${primaryMeta.organYin}의 정체된 에너지를 순환시키고 ${primaryMeta.psycho}의 활력을 깨움`,
    },

    microRituals,
    lifestyleRemedy,
    energeticSynthesisMatrix,
    reflectiveQuestion,
    ritualAction,
    reflectionFocus: reflectiveQuestion,
    interpretiveBoundary: '본 결핍 오행·바이오 에너지 처방은 명리 오행 균형에 기반한 일상 웰니스 성찰 안내이며, 의학적 진단이나 치료를 대신하지 않습니다.',
  };
}

/**
 * 결핍 오행 & 바이오 에너지 맞춤 처방 엔진 리포트를
 * LLM 마스터 프롬프트에 주입하기 위해 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatEnergeticPrescriptionPrompt(res: EnergeticPrescriptionResult): string {
  const d = res.elementDiagnosis;
  const b = res.bioEnergeticAlignment;
  const l = res.lifestyleRemedy;

  const ritualLines = res.microRituals.map((r, i) =>
    `   ${i + 1}. [${r.title}] (${r.durationSeconds}초, ${r.category}): ${r.actionStep} -> 기대 효과: ${r.expectedSensation}`
  ).join('\n');

  const colorLines = l.luckyColors.map(c => `${c.name}(${c.hex})[${c.role}]`).join(', ');

  return `[🧪 결핍 오행 & 바이오 에너지 맞춤 처방 실측 데이터 (Energetic Prescription Core)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 일시: ${res.calculatedAtKst}
사용자 명식 요약: 일간 ${res.profileDigest.dayMasterGan}(${res.profileDigest.dayMasterElement}) | 신강/신약: ${res.profileDigest.bodyStrength}
======================================================================
1. [오행 수리 분포 및 결핍 진단]:
   - 오행 개수: 목(${d.counts.목}자) · 화(${d.counts.화}자) · 토(${d.counts.토}자) · 금(${d.counts.금}자) · 수(${d.counts.수}자)
   - 최우선 결핍 오행: ★ [${d.primaryLacking}] 기운 ${d.counts[d.primaryLacking]}개 (${d.allDiagnoses[d.primaryLacking]?.status})
   - 보조 결핍 오행: ${d.secondaryLacking ? `[${d.secondaryLacking}] 기운` : '없음(안정)'} | 과다 오행: ${d.excessElements.length > 0 ? d.excessElements.join(', ') : '없음'}
   - 사주 용신(보약): ${d.therapeuticYongsin} | 희신(조력): ${d.supportiveHeeshin}
   - 진단 요약: ${d.balanceSummary}

2. [바이오 에너지 & 인체 장부·차크라 정렬]:
   - 취약 집중 관리 장부: ${b.vulnerableOrgans.join(', ')} (오장육부)
   - 공명 차크라: ${b.affectedChakra}
   - 활력 순환 상태: ${b.vitalityLevel}
   - 결핍 시 심신 피로 징후: ${b.psychologicalImbalance}
   - 활력 회복 벡터: ${b.vitalityRecoveryVector}

3. [1분 마이크로 개운 행동 프로토콜 (60-Second Micro-Rituals)]:
${ritualLines}

4. [라이프스타일 & 공간 오행 처방]:
   - 보약 컬러: ${colorLines}
   - 오미(五味) 식이: ${l.foodPrescription.taste} 계열 | 추천 식재료: ${l.foodPrescription.keyIngredients.join(', ')} | 추천 음료: ${l.foodPrescription.drinkRecommendation}
   - 아로마 에센셜 오일: ${l.aromaEssentialOils.join(', ')}
   - 풍수 방위 & 소품: ${l.fengShuiDirection} 방향 | 추천 오브제: ${l.spatialObject}
   - 데일리 확언 문장: "${l.dailyAffirmation}"
${res.energeticSynthesisMatrix ? `5. [교차 매트릭스]:
   - 핵심 긴장: ${res.energeticSynthesisMatrix.dominantTension}
   - 조율 상태: ${res.energeticSynthesisMatrix.alignmentState}
   - 통합 실천: ${res.energeticSynthesisMatrix.integratedAction}` : ''}
   ${res.reflectiveQuestion ? `- 성찰 질문: ${res.reflectiveQuestion}\n   ` : ''}- 해석 경계: ${res.interpretiveBoundary}
======================================================================
[★ 루시 답변 가이드]:
- 사용자가 피로, 건강, 개운, 오행, 라이프스타일을 물을 때 위 실측 데이터를 기반으로 지혜롭고 자상하게 처방해줘.
- 단순 미신이 아닌 '오행 수리 연산 × 일상 속 자기 돌봄 × 1분 초미세 행동'의 현대적 웰니스 언어로 풀어줘.`;
}
