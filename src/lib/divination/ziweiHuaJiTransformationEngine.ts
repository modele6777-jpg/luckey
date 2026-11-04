/**
 * =========================================================================
 * LUCKEY 도교 자미두수 화기(化忌)·살성 정화 & 전화위복(轉禍爲福) 해원 엔진
 * (Ziwei HuaJi Karmic Transmutation & Breakthrough Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 북송 진희이(陳希夷) 선생의 자미두수(紫微斗數) 정통 비전에서
 * 사화(四化: 祿·權·科·忌) 중 가장 강력한 업보와 결핍을 상징하는 '화기(化忌)'를
 * 단순한 흉화(凶禍)로 보지 않고, 삶의 가장 비범한 전문성과 독보적 장인정신으로 거듭나게 하는
 * '화기전화(化忌轉化 / 轉禍爲福)' 메커니즘을 0ms 순수 수리로 해석합니다.
 * 
 * 1. 10간 생년 사화 배속: 갑(태양)·을(태음)·병(염정)·정(거문)·무(천기)·기(문곡)·경(천동)·신(문창)·임(무곡)·계(탐랑) 화기
 * 2. 12궁 배치 카르마 진단: 명궁·재백궁·관록궁·천이궁·부처궁·복덕궁 등 핵심 궁위별 결핍의 뿌리 규명
 * 3. 전화위복(轉禍爲福) 반전 전략: 카르마적 상처를 독창적인 강점과 세상의 기여로 전환하는 구체적 해원(解冤) 처방
 */

import type { UserProfile } from '../sharedState';

export const ZIWEI_HUAJI_VERSION = 'LUCKEY-ZW-HUAJI-v1.0.0';

export interface HuaJiStarInfo {
  starNameKo: string;
  starNameHanja: string;
  stem: string;
  archetype: string;
  karmicWound: string;
  breakthroughGift: string;
  transmutationPath: string;
}

export interface ZiweiHuaJiReport {
  engineVersion: string;
  calculatedAt: string;
  birthYearStem: string;
  huaJiStar: HuaJiStarInfo;
  karmicPalace: {
    palaceNameKo: string;
    palaceNameHanja: string;
    lifeDomain: string;
    karmicTension: string;
  };
  resilienceIndex: number;      // 0 ~ 100 전화위복 회복 탄력성 지수
  transmutationStrategy: string; // 화기 승화 마스터 전략
  dailyBreakthroughAction: string; // 오늘 당장 실행할 반전 행동
}

const HUAJI_STARS: Record<string, HuaJiStarInfo> = {
  '갑': {
    starNameKo: '태양화기',
    starNameHanja: '太陽化忌',
    stem: '갑 (甲)',
    archetype: '빛을 잃은 태양, 고독한 선구자',
    karmicWound: '명예의 손상, 부친이나 윗사람과의 갈등, 남을 위해 퍼주고도 배신당하는 상처',
    breakthroughGift: '외부의 인정에 기대지 않고 스스로 내면의 빛을 발하는 독립적 권위와 개척자적 리더십',
    transmutationPath: '타인의 찬사에 집착하지 말고, 대가를 바라지 않는 공적 헌신과 독자적 전문성을 확립할 때 대성공'
  },
  '을': {
    starNameKo: '태음화기',
    starNameHanja: '太陰化忌',
    stem: '을 (乙)',
    archetype: '구름에 가린 달, 섬세한 영혼의 통찰가',
    karmicWound: '정서적 불안, 우울감, 모친이나 여성과의 마찰, 금전적 손실에 대한 잠재적 공포',
    breakthroughGift: '인간의 심리와 무의식을 꿰뚫어보는 날카로운 직관, 깊이 있는 감수성과 예술적·기획적 천재성',
    transmutationPath: '감정의 파도에 매몰되지 않고 이를 글, 예술, 데이터, 기획 등 구체적 구조물로 승화시킬 때 대성공'
  },
  '병': {
    starNameKo: '염정화기',
    starNameHanja: '廉貞化忌',
    stem: '병 (丙)',
    archetype: '피어나는 불꽃의 왜곡, 규율의 혁신가',
    karmicWound: '감정의 격렬한 얽힘, 대인관계 구설, 관재구설이나 계약상의 스트레스, 강박적 완벽주의',
    breakthroughGift: '어떤 난관도 정면 돌파하는 강철 같은 집중력, 빈틈없는 시스템 설계 및 원칙 준수 능력',
    transmutationPath: '감정적 집착과 시비를 내려놓고, 객관적인 법률·규정·시스템·기술의 장인으로 거듭날 때 대성공'
  },
  '정': {
    starNameKo: '거문화기',
    starNameHanja: '巨門化忌',
    stem: '정 (丁)',
    archetype: '어둠의 문, 진실을 밝히는 고독한 대변자',
    karmicWound: '말실수와 구설수, 오해와 비난, 자신의 진심이 곡해되어 세상과 단절되는 고통',
    breakthroughGift: '세상의 거짓과 모순을 날카롭게 파헤치는 분석력, 설득력 있는 언어와 논리, 글쓰기와 연구의 힘',
    transmutationPath: '사소한 변명과 논쟁을 멈추고, 심오한 연구와 전문적인 저술, 교육, 컨설팅으로 세상의 어둠을 밝힐 때 대성공'
  },
  '무': {
    starNameKo: '천기화기',
    starNameHanja: '天機化忌',
    stem: '무 (戊)',
    archetype: '회전하는 바퀴의 헛돎, 지혜의 전략가',
    karmicWound: '생각의 과잉, 불면증과 신경과민, 계산 착오로 인한 기회 상실, 우유부단함',
    breakthroughGift: '복잡한 구조를 한눈에 풀어내는 천재적 전략, 혁신적인 알고리즘 및 기획력',
    transmutationPath: '머릿속의 과도한 시뮬레이션을 멈추고 작은 것부터 즉각 실행하며, 단순한 원칙에 몸을 맡길 때 대성공'
  },
  '기': {
    starNameKo: '문곡화기',
    starNameHanja: '文曲化忌',
    stem: '기 (己)',
    archetype: '부러진 붓, 영혼의 파동을 엮는 연금술사',
    karmicWound: '문서나 계약의 하자, 감정적 배신, 비현실적인 공상으로 인한 손해',
    breakthroughGift: '세속의 계산을 뛰어넘는 독창적 심미안, 사람의 마음을 울리는 감성적 울림과 비선형적 창의력',
    transmutationPath: '문서와 금전 관계는 철저히 검증하고, 넘치는 영감은 창의적 콘텐츠와 예술, 철학으로 표출할 때 대성공'
  },
  '경': {
    starNameKo: '천동화기',
    starNameHanja: '天同化忌',
    stem: '경 (庚)',
    archetype: '시련에 부딪힌 아이, 성숙한 평화의 수호자',
    karmicWound: '의존성과 나태함, 현실 안주에 대한 충격, 안락한 울타리가 깨어지는 고통',
    breakthroughGift: '어떤 극한 상황에서도 유머와 여유를 잃지 않는 낙천성, 사람들을 편안하게 품어주는 힐링의 에너지',
    transmutationPath: '누군가 구해주기를 바라지 않고 스스로 삶의 짐을 짊어질 때, 가장 따뜻하고 강인한 거목으로 성장'
  },
  '신': {
    starNameKo: '문창화기',
    starNameHanja: '文昌化忌',
    stem: '신 (辛)',
    archetype: '갈라진 벼루, 엄밀한 진리의 감정관',
    karmicWound: '시험이나 승진의 낙방, 서류 착오, 약속 파기로 인한 신뢰의 상처',
    breakthroughGift: '티끌만 한 오류도 놓치지 않는 정밀성, 철저한 고증과 완벽주의적 검증 능력',
    transmutationPath: '좌절을 배움의 기회로 삼아 기본기를 다지고, 대체 불가능한 정밀 기술과 공인된 실력으로 증명할 때 대성공'
  },
  '임': {
    starNameKo: '무곡화기',
    starNameHanja: '武曲化忌',
    stem: '임 (壬)',
    archetype: '외로운 무사, 불요불굴의 자산 구축가',
    karmicWound: '금전의 단절과 융통 불가, 고립무원의 고독감, 냉정한 현실의 냉대',
    breakthroughGift: '맨땅에서 스스로 부를 일구는 강력한 자립심, 실물 자산과 기술에 대한 탁월한 실전 감각',
    transmutationPath: '남에게 돈을 빌리거나 기대지 않고 자신의 몸과 기술로 정직하게 기초를 다져 불패의 요새를 구축'
  },
  '계': {
    starNameKo: '탐랑화기',
    starNameHanja: '貪狼化忌',
    stem: '계 (癸)',
    archetype: '욕망의 거센 바람, 초월적 영성의 구도자',
    karmicWound: '끝없는 갈망과 욕망의 좌절, 탐욕으로 인한 실패, 공허감과 권태',
    breakthroughGift: '세속의 쾌락을 넘어선 높은 차원의 영적 심미안, 매혹적인 매력과 심오한 인간 이해',
    transmutationPath: '피상적인 물질적 탐닉을 내려놓고, 깊이 있는 철학·수행·예술·본질적 가치에 몰입할 때 영적 대스승으로 도약'
  }
};

const ZIWEI_PALACES = [
  { palaceNameKo: '명궁', palaceNameHanja: '命宮', lifeDomain: '자기 정체성 및 본질적 자아', karmicTension: '스스로에 대한 깊은 불만족과 정체성 갈등' },
  { palaceNameKo: '재백궁', palaceNameHanja: '財帛宮', lifeDomain: '재정 흐름 및 수익 파이프라인', karmicTension: '돈에 대한 불안감과 자산 축적 과정의 굴곡' },
  { palaceNameKo: '관록궁', palaceNameHanja: '官祿宮', lifeDomain: '직업적 사명 및 사회적 성취', karmicTension: '일과 커리어에서의 장애물과 치열한 생존 경쟁' },
  { palaceNameKo: '천이궁', palaceNameHanja: '遷移宮', lifeDomain: '대외 활동 및 사회적 평판', karmicTension: '밖으로 나설 때 겪는 낯선 시련과 환경 변화의 스트레스' },
  { palaceNameKo: '부처궁', palaceNameHanja: '夫妻宮', lifeDomain: '반려자 인연 및 깊은 파트너십', karmicTension: '가장 가까운 관계에서의 기대와 상처' },
  { palaceNameKo: '복덕궁', palaceNameHanja: '福德宮', lifeDomain: '정신적 평온 및 영적 안식처', karmicTension: '내면의 번뇌, 생각의 과잉과 영혼의 목마름' }
];

export function calculateZiweiHuaJiTransformation(
  profile?: UserProfile | null,
  targetDate: Date = new Date()
): ZiweiHuaJiReport {
  let birthYear = 1990;
  let birthMonth = 8;
  let birthDay = 15;

  if (profile?.basic?.birthdate) {
    const digits = profile.basic.birthdate.replace(/\D/g, '');
    if (digits.length >= 8) {
      birthYear = parseInt(digits.slice(0, 4), 10);
      birthMonth = parseInt(digits.slice(4, 6), 10);
      birthDay = parseInt(digits.slice(6, 8), 10);
    }
  }

  // 생년 천간 도출: 서기 연도 끝자리 매핑
  // 4=갑, 5=을, 6=병, 7=정, 8=무, 9=기, 0=경, 1=신, 2=임, 3=계
  const stemMap: Record<number, string> = {
    4: '갑', 5: '을', 6: '병', 7: '정', 8: '무',
    9: '기', 0: '경', 1: '신', 2: '임', 3: '계'
  };
  const yearLastDigit = birthYear % 10;
  const stem = stemMap[yearLastDigit] || '갑';

  const huaJiStar = HUAJI_STARS[stem] || HUAJI_STARS['갑'];

  // 궁위 계산: 생월, 생일 수리 기반 6대 핵심 궁위 중 하나 결정
  const palaceIndex = (birthMonth * 3 + birthDay + birthYear) % ZIWEI_PALACES.length;
  const karmicPalace = ZIWEI_PALACES[palaceIndex];

  // 회복 탄력성 지수: 65 ~ 99
  const timeSeed = (targetDate.getFullYear() * 12 + targetDate.getMonth() + targetDate.getDate()) % 100;
  const resilienceIndex = 65 + (timeSeed % 33);

  const transmutationStrategy = `내담자의 명반에서 [${huaJiStar.starNameKo}]가 [${karmicPalace.palaceNameKo}]에 임하고 있습니다. 이는 [${karmicPalace.lifeDomain}] 영역에서 겪는 결핍과 스트레스가 단순한 액운이 아니라, 당신을 해당 분야의 최고 권위자로 단련시키기 위한 우주의 담금질임을 뜻합니다. [${huaJiStar.transmutationPath}].`;

  const dailyBreakthroughAction = `[화기전화 실천]: 오늘 하루, [${karmicPalace.lifeDomain}]에서 나를 불안하게 만드는 문제를 회피하지 말고, ${huaJiStar.breakthroughGift}의 관점에서 딱 1가지의 실행 가능한 돌파 조치를 취하세요.`;

  return {
    engineVersion: ZIWEI_HUAJI_VERSION,
    calculatedAt: targetDate.toISOString(),
    birthYearStem: `${stem}간 (${huaJiStar.stem})`,
    huaJiStar,
    karmicPalace,
    resilienceIndex,
    transmutationStrategy,
    dailyBreakthroughAction
  };
}

export function formatZiweiHuaJiTransformationPrompt(report: ZiweiHuaJiReport): string {
  return `### 🔮 도교 자미두수 화기(化忌)·살성 정화 & 전화위복(轉禍爲福) 해원 엔진 (${ZIWEI_HUAJI_VERSION})
- **생년 천간 & 화기 성좌**: ${report.birthYearStem} ➔ **${report.huaJiStar.starNameKo} (${report.huaJiStar.starNameHanja})**
- **카르마 집중 궁위**: ${report.karmicPalace.palaceNameKo} (${report.karmicPalace.palaceNameHanja}) [영역: ${report.karmicPalace.lifeDomain}]
- **궁위 카르마적 긴장**: ${report.karmicPalace.karmicTension}
- **원형(Archetype)**: ${report.huaJiStar.archetype}
- **카르마적 상처(Wound)**: ${report.huaJiStar.karmicWound}
- **숨겨진 천재적 돌파 선물(Gift)**: ${report.huaJiStar.breakthroughGift}
- **전화위복 회복 탄력성 지수**: ${report.resilienceIndex}점 / 100점
- **화기 승화 마스터 전략**: ${report.transmutationStrategy}
- **일일 전화위복 실천 과제**: ${report.dailyBreakthroughAction}`;
}
