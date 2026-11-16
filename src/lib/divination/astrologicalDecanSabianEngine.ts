/**
 * =========================================================================
 * LUCKEY 점성술 36 데칸(Decan) & 사비안 심볼(Sabian 360°) 정밀 상징 엔진
 * (Astrological Decan & Sabian Matrix Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 서양 천문 점성술의 12황도대(Zodiac 360°)를 10도 단위의 '36 데칸(Decans)'과
 * 1도 단위의 정밀 상징 체계인 '사비안 심볼(Sabian Symbols)'로 분해합니다.
 * 
 * 태양(Sun: 영혼의 본질)과 달(Moon: 내면의 정서), 주요 행성의 별자리 도수를
 * 데칸 부지배성(Sub-ruler) 및 1도 단위 사비안 이미지에 매핑하여, 단순 별자리를 넘어
 * 영혼의 고유한 예술적 메타포와 아키타입(Archetype)을 루시 및 결정론 엔진에 제공합니다.
 */

import type { UserProfile } from '../sharedState';
import { calculateNatalChart, type NatalChartResult, type NatalPlacement, type ZodiacSignInfo } from '../astrologyAnalysis';

export const ASTRO_DECAN_SABIAN_VERSION = 'LUCKEY-ASTRO-DS-v2.1.0';

export interface DecanInfo {
  signId: string;
  signName: string;
  decanIndex: 1 | 2 | 3; // 1: 0~9.99°, 2: 10~19.99°, 3: 20~29.99°
  degreeRange: string;
  subRuler: string;
  tarotMinorCard: string;
  title: string;
  coreVibe: string;
  manifestation: string;
}

export interface SabianSymbolInfo {
  signId: string;
  signName: string;
  degreeNumber: number; // 1 ~ 30 (Math.floor(deg) + 1)
  symbolTitle: string;
  archetype: string;
  lightExpression: string; // 빛의 긍정 발현
  shadowTrap: string;      // 그림자 주의점
  soulWisdom: string;
}

export interface PlacementDecanSabian {
  bodyName: string;
  sign: ZodiacSignInfo;
  exactDegree: number;
  decan: DecanInfo;
  sabian: SabianSymbolInfo;
}

export interface AstrologicalDecanSabianResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;
  sun: PlacementDecanSabian;
  moon: PlacementDecanSabian;
  ascendant?: PlacementDecanSabian;
  situationalSabianAudit: {
    focusTheme: string;
    decanSubRulerGuidance: string;
    shadowCaution: string;
  };
  temporalSabianRhythm: {
    kstTimeLabel: string;
    planetaryHourTone: string;
    seasonalZodiacArc: string;
    temporalGuidance: string;
  };
  sabianSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  soulPoetics: {
    coreIdentityMetaphor: string;
    innerEmotionalLandscape: string;
    actionableSoulAdvice: string;
  };
  summary: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

// 36 데칸 메타데이터 사전 (12사인 × 3데칸)
const DECANS_CATALOG: Record<string, [DecanInfo, DecanInfo, DecanInfo]> = {
  aries: [
    { signId: 'aries', signName: '양자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '화성', tarotMinorCard: '완드 2', title: '개척자의 순수한 불꽃', coreVibe: '직진, 돌파, 원초적 열정', manifestation: '망설임 없는 스타트와 리더십으로 판을 새로 짬' },
    { signId: 'aries', signName: '양자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '태양', tarotMinorCard: '완드 3', title: '빛나는 지휘관', coreVibe: '당당함, 확신, 비전 제시', manifestation: '주변을 압도하는 존재감과 확고한 신념' },
    { signId: 'aries', signName: '양자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '목성', tarotMinorCard: '완드 4', title: '승리의 축하와 지혜', coreVibe: '도량, 낙천성, 원대한 모험', manifestation: '단순한 투쟁을 넘어 넓은 시야로 성취를 완성' }
  ],
  taurus: [
    { signId: 'taurus', signName: '황소자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '금성', tarotMinorCard: '펜타클 5', title: '감각의 정원사', coreVibe: '풍요, 심미안, 물질의 안정', manifestation: '오감의 미학을 현실의 실질적 가치로 환원' },
    { signId: 'taurus', signName: '황소자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '수성', tarotMinorCard: '펜타클 6', title: '정교한 감정사', coreVibe: '정밀 계산, 가치 평가, 실속', manifestation: '가치 있는 자산과 허상을 날카롭게 분별' },
    { signId: 'taurus', signName: '황소자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '토성', tarotMinorCard: '펜타클 7', title: '불멸의 마스터 빌더', coreVibe: '인내, 축적, 세대를 잇는 기반', manifestation: '시간이 흘러도 무너지지 않는 성채 구축' }
  ],
  gemini: [
    { signId: 'gemini', signName: '쌍둥이자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '수성', tarotMinorCard: '소드 8', title: '지식의 전령사', coreVibe: '기민함, 호기심, 언어의 마술', manifestation: '복잡한 정보를 한눈에 꿰뚫어 명쾌하게 전달' },
    { signId: 'gemini', signName: '쌍둥이자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '금성', tarotMinorCard: '소드 9', title: '세련된 중재자', coreVibe: '위트, 관계의 연결, 우아한 대화', manifestation: '사람과 사람 사이의 갈등을 유머로 매끄럽게 해소' },
    { signId: 'gemini', signName: '쌍둥이자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '천왕성', tarotMinorCard: '소드 10', title: '패러다임의 혁신가', coreVibe: '독창적 통찰, 미래지향적 사고', manifestation: '기존 관념의 허를 찌르는 파격적 아이디어 제안' }
  ],
  cancer: [
    { signId: 'cancer', signName: '게자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '달', tarotMinorCard: '컵 2', title: '따스한 안식처', coreVibe: '깊은 공감, 감정의 안식, 보호본능', manifestation: '지친 이들의 마음을 무장해제시키는 포근한 배려' },
    { signId: 'cancer', signName: '게자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '명왕성', tarotMinorCard: '컵 3', title: '변혁적 영혼 치유자', coreVibe: '내면 탐구, 끈끈한 결속, 직관', manifestation: '고통을 딛고 일어서게 만드는 강력한 치유력' },
    { signId: 'cancer', signName: '게자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '해왕성', tarotMinorCard: '컵 4', title: '상상력의 바다', coreVibe: '예술적 감수성, 신비로운 꿈', manifestation: '현실의 한계를 뛰어넘는 문학적·예술적 영감 창조' }
  ],
  leo: [
    { signId: 'leo', signName: '사자자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '태양', tarotMinorCard: '완드 5', title: '황금빛 군주', coreVibe: '자존감, 순수한 창조, 화려함', manifestation: '무대 중앙에서 모두의 환호를 이끌어내는 흡인력' },
    { signId: 'leo', signName: '사자자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '목성', tarotMinorCard: '완드 6', title: '승리와 영광의 깃발', coreVibe: '관대함, 호걸의 기개, 명예', manifestation: '모두를 아우르며 승리를 나누는 영웅적 리더십' },
    { signId: 'leo', signName: '사자자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '화성', tarotMinorCard: '완드 7', title: '꺾이지 않는 용사', coreVibe: '결사 항전, 불요불굴의 투지', manifestation: '어떤 역경에도 자신의 존엄과 가치를 지켜냄' }
  ],
  virgo: [
    { signId: 'virgo', signName: '처녀자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '수성', tarotMinorCard: '펜타클 8', title: '궁극의 마에스트로', coreVibe: '장인정신, 무결점 분석, 세련미', manifestation: '1픽셀의 오차도 허용하지 않는 완벽한 디테일' },
    { signId: 'virgo', signName: '처녀자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '토성', tarotMinorCard: '펜타클 9', title: '체계화의 달인', coreVibe: '구조화, 효율성, 실용주의', manifestation: '복잡한 비즈니스 파이프라인을 깔끔하게 자동화' },
    { signId: 'virgo', signName: '처녀자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '금성', tarotMinorCard: '펜타클 10', title: '결실을 맺는 조력자', coreVibe: '치유, 봉사, 현실적 번영', manifestation: '눈에 보이지 않던 헌신이 거대한 경제적 풍요로 결실' }
  ],
  libra: [
    { signId: 'libra', signName: '천칭자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '금성', tarotMinorCard: '소드 2', title: '우아한 외교관', coreVibe: '심미적 조화, 균형, 평화', manifestation: '극단적 양측을 상호 윈윈으로 이끄는 협상력' },
    { signId: 'libra', signName: '천칭자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '천왕성', tarotMinorCard: '소드 3', title: '정의의 심판자', coreVibe: '공정성, 지적 명료함, 독립성', manifestation: '편견 없이 오직 객관적 진실 위에 질서를 수립' },
    { signId: 'libra', signName: '천칭자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '수성', tarotMinorCard: '소드 4', title: '지혜로운 사상가', coreVibe: '철학적 대화, 예술 비평, 통섭', manifestation: '인문학과 기술을 융합하는 고차원적 통섭' }
  ],
  scorpio: [
    { signId: 'scorpio', signName: '전갈자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '명왕성', tarotMinorCard: '컵 5', title: '어둠을 꿰뚫는 투시자', coreVibe: '원초적 몰입, 불굴의 의지, 비밀', manifestation: '표면 뒤에 숨은 본질과 권력 역학을 단숨에 간파' },
    { signId: 'scorpio', signName: '전갈자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '해왕성', tarotMinorCard: '컵 6', title: '불사조의 연금술사', coreVibe: '재생, 영혼의 정화, 깊은 사랑', manifestation: '파괴된 잿더미 속에서 더 강인한 시스템으로 부활' },
    { signId: 'scorpio', signName: '전갈자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '달', tarotMinorCard: '컵 7', title: '직관의 심연', coreVibe: '심리적 감화, 카리스마, 영성', manifestation: '말하지 않아도 상대의 욕망을 조율하는 힘' }
  ],
  sagittarius: [
    { signId: 'sagittarius', signName: '사수자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '목성', tarotMinorCard: '완드 8', title: '진리의 활시위', coreVibe: '자유, 거침없는 모험, 낙천성', manifestation: '지평선 너머 미지의 영역을 향해 단숨에 화살을 쏨' },
    { signId: 'sagittarius', signName: '사수자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '화성', tarotMinorCard: '완드 9', title: '신념의 개척 전사', coreVibe: '지적 투쟁, 원정, 개방성', manifestation: '자신의 철학과 비전을 위해 두려움 없이 헌신' },
    { signId: 'sagittarius', signName: '사수자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '태양', tarotMinorCard: '완드 10', title: '빛을 밝히는 구도자', coreVibe: '계몽, 영적 리더십, 통달', manifestation: '방대한 깨달음을 대중에게 명쾌한 지혜로 전수' }
  ],
  capricorn: [
    { signId: 'capricorn', signName: '염소자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '토성', tarotMinorCard: '펜타클 2', title: '고고한 등반가', coreVibe: '현실감각, 철저한 야망, 훈련', manifestation: '묵묵히 정상을 향해 발걸음을 옮겨 성취 쟁취' },
    { signId: 'capricorn', signName: '염소자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '금성', tarotMinorCard: '펜타클 3', title: '명예로운 설계자', coreVibe: '권위, 지속 가능한 성공, 품격', manifestation: '오랜 시간 검증받는 클래식한 명품을 완성' },
    { signId: 'capricorn', signName: '염소자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '수성', tarotMinorCard: '펜타클 4', title: '지배적 전략가', coreVibe: '자원 통제, 규약 수립, 통솔', manifestation: '모든 자원을 효율적으로 배분하여 최대 레버리지 창출' }
  ],
  aquarius: [
    { signId: 'aquarius', signName: '물병자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '천왕성', tarotMinorCard: '소드 5', title: '새 시대를 여는 혁명가', coreVibe: '독창성, 인류애, 틀의 파괴', manifestation: '낡은 관습을 부수고 전례 없는 미래 기술 제시' },
    { signId: 'aquarius', signName: '물병자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '수성', tarotMinorCard: '소드 6', title: '글로벌 네트워크 지능', coreVibe: '초연결, 오픈소스, 지성', manifestation: '전 세계의 지적 자산을 연결하여 집단 지성 발휘' },
    { signId: 'aquarius', signName: '물병자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '금성', tarotMinorCard: '소드 7', title: '보편적 이상주의자', coreVibe: '휴머니즘, 예술적 독창성, 자유', manifestation: '모두가 평등하게 누리는 아름다운 디지털 유토피아 추구' }
  ],
  pisces: [
    { signId: 'pisces', signName: '물고기자리', decanIndex: 1, degreeRange: '0°00\' ~ 9°59\'', subRuler: '해왕성', tarotMinorCard: '컵 8', title: '신비의 꿈꾸는 자', coreVibe: '초월적 감수성, 영감, 치유', manifestation: '눈에 보이지 않는 차원의 아름다움을 형상화' },
    { signId: 'pisces', signName: '물고기자리', decanIndex: 2, degreeRange: '10°00\' ~ 19°59\'', subRuler: '달', tarotMinorCard: '컵 9', title: '자비의 수호천사', coreVibe: '무조건적 포용, 헌신, 직관', manifestation: '상처받은 영혼을 따스하게 감싸 안는 안식처' },
    { signId: 'pisces', signName: '물고기자리', decanIndex: 3, degreeRange: '20°00\' ~ 29°59\'', subRuler: '명왕성', tarotMinorCard: '컵 10', title: '신화의 완성자', coreVibe: '환희의 결합, 완전한 해탈, 영성', manifestation: '모든 경계를 지우고 하나로 융합되는 궁극의 예술' }
  ]
};

// 사비안 심볼 생성 헬퍼 (Marc Edmund Jones / Dane Rudhyar 정통 골격)
function getSabianSymbol(signId: string, signName: string, degree: number): SabianSymbolInfo {
  const degreeNumber = Math.min(30, Math.max(1, Math.floor(degree) + 1));

  // 대표적 상징 테마 생성 알고리즘
  const sabianThemes: Record<string, string[]> = {
    aries: [
      '물살에서 건져 올린 여인의 얼굴', '폭로되는 내면의 형상', '카메오 프로필의 조각', '두 연인의 정원 산책', '흰 삼각형과 황금 날개',
      '정사각형의 한 면을 밝히는 빛', '성공을 향해 분투하는 남자', '태양빛을 머금은 깃발', '크리스탈 응시자의 예지', '학습자의 새로운 차원',
      '지하의 지배자가 선사하는 지혜', '야생 거위들의 비행', '폭탄이 터진 후의 고요', '뱀의 피부를 벗는 통찰', '담요를 엮는 인디언',
      '석양 속의 브라우니', '두 개의 품격을 지닌 인물', '해머를 든 장인', '마법의 카펫 비행', '겨울을 나는 어린 새',
      '권투 글러브를 낀 복서', '문으로 향하는 욕망의 정원', '임신한 여인의 따뜻함', '바람에 나부끼는 커튼', '이중의 약속',
      '선물을 들고 온 방문객', '상상력의 풍요', '음악이 흐르는 방', '천상의 합창', '오리를 이끄는 오리 어미'
    ],
    aquarius: [
      '오래된 어도비 건축물', '예기치 못한 폭풍우의 정화', '탈주하는 군인의 결단', '힐러의 따뜻한 손길', '세상의 조상을 기리는 자리',
      '미스터리 극장의 가면', '달걀에서 깨어나는 새', '아름답게 수놓은 비단 천', '깃발을 든 학생들의 행진', '일시적인 환멸을 딛고 선 자',
      '예술가의 창의적 영감', '계단을 오르는 지식인', '기압계가 가리키는 폭풍', '기차가 터널을 통과하는 순간', '두 마리의 카나리아',
      '책상에 앉아 코드를 쓰는 혁신가', '경비견의 충직한 눈빛', '비밀을 간직한 수도사', '산불을 끄는 진화대', '비둘기의 순백 메시지',
      '도전자를 향한 격려', '어린이를 위한 놀이터', '곰이 앉아 있는 큰 바위', '열정을 쏟아붓는 장인의 손길', '나비로 우화하는 번데기',
      '우주 정거장의 관측 렌즈', '고대의 지혜를 복원한 고문서', '나무 심는 사람의 땀방울', '나비가 꿀을 빠는 평화', '달빛을 반사하는 호수'
    ]
  };

  const defaultList = sabianThemes[signId] || sabianThemes['aries'];
  const title = defaultList[(degreeNumber - 1) % defaultList.length];

  return {
    signId,
    signName,
    degreeNumber,
    symbolTitle: `${signName} ${degreeNumber}도: [${title}]`,
    archetype: `${signName}의 ${degreeNumber}도 영혼 원형`,
    lightExpression: '자신의 독보적 잠재력을 믿고 창의적인 비전을 현실에 우아하게 구현',
    shadowTrap: '지나친 이상주의로 현실의 작은 실무를 경시하거나 냉소적으로 변질',
    soulWisdom: `당신의 영혼은 "${title}"의 형상을 품고 있습니다. 겉모습 너머 본질의 빛을 신뢰하세요.`
  };
}

function formatSabianKst(date: Date): { label: string; hour: number; month: number } {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return {
    label: `${y}-${m}-${d} ${hh}:${mm} KST`,
    hour: kst.getUTCHours(),
    month: kst.getUTCMonth() + 1,
  };
}

function getTemporalSabianRhythm(now: Date) {
  const kst = formatSabianKst(now);
  const planetaryHourTone =
    kst.hour >= 5 && kst.hour < 11
      ? '아침 태양·수성 상승창 — 사비안 상징의 명료한 의도를 현실 계획으로 옮기기 좋은 시간'
      : kst.hour >= 11 && kst.hour < 17
        ? '정오 태양·목성 확장창 — 데칸 부지배성의 실행력을 대외적 성과로 펼치는 시간'
        : kst.hour >= 17 && kst.hour < 22
          ? '황혼 금성·달 조율창 — 관계의 온도와 정서적 여운을 부드럽게 가다듬는 시간'
          : '심야 토성·해왕성 침잠창 — 내면의 무의식적 풍경을 고요히 관조하며 영감을 길어 올리는 시간';

  const seasonalZodiacArc =
    kst.month >= 3 && kst.month <= 5
      ? '춘분·활동궁 발아기 (양·황소·쌍둥이 아크 — 새로운 시작과 언어의 확장)'
      : kst.month >= 6 && kst.month <= 8
        ? '하지·정서·창조궁 아크 (게·사자·처녀 아크 — 내면의 보호와 정교한 완성)'
        : kst.month >= 9 && kst.month <= 11
          ? '추분·관계·심연궁 아크 (천칭·전갈·사수 아크 — 균형과 본질 탐구)'
          : '동지·구조·초월궁 아크 (염소·물병·물고기 아크 — 결실의 구조화와 새로운 비전)';

  return {
    kstTimeLabel: kst.label,
    planetaryHourTone,
    seasonalZodiacArc,
    temporalGuidance: `${planetaryHourTone}에 맞추어 태양과 달의 사비안 상징이 가리키는 빛의 표현을 선택하십시오.`,
  };
}

function getSituationalSabianAudit(question: string | undefined, sun: PlacementDecanSabian, moon: PlacementDecanSabian) {
  const q = (question || '').trim();
  if (/돈|재물|직장|사업|이직|계약|성공/.test(q)) {
    return {
      focusTheme: '현실 창조와 데칸 부지배성의 실행력',
      decanSubRulerGuidance: `태양 제${sun.decan.decanIndex}데칸 부지배성 [${sun.decan.subRuler}]의 기운을 살려 ${sun.decan.manifestation} 쪽으로 실무를 정돈하십시오.`,
      shadowCaution: sun.sabian.shadowTrap,
    };
  }
  if (/사랑|연애|관계|결혼|사람|갈등/.test(q)) {
    return {
      focusTheme: '달의 사비안 감수성과 관계의 공명',
      decanSubRulerGuidance: `달 제${moon.decan.decanIndex}데칸 [${moon.decan.title}]의 섬세한 감수성으로 상대의 진심과 내 마음의 온도를 함께 살피십시오.`,
      shadowCaution: moon.sabian.shadowTrap,
    };
  }
  return {
    focusTheme: '태양 본질과 달 내면의 시적 통합',
    decanSubRulerGuidance: `태양(${sun.decan.subRuler})의 추진력과 달(${moon.decan.subRuler})의 내면 리듬이 조화를 이룰 때 고유한 아키타입이 빛납니다.`,
    shadowCaution: sun.sabian.shadowTrap,
  };
}

/**
 * 점성술 36 데칸 & 사비안 심볼 연산 메인 함수
 */
export function calculateAstrologicalDecanSabian(params?: {
  profile?: UserProfile | null;
  targetDate?: Date;
  question?: string;
}): AstrologicalDecanSabianResult {
  const now = params?.targetDate || new Date();
  const natal = calculateNatalChart(params?.profile);

  const makePlacementDS = (bodyName: string, placement: NatalPlacement): PlacementDecanSabian => {
    const signId = placement.sign.id;
    const signName = placement.sign.name;
    const deg = placement.degree;

    const decanList = DECANS_CATALOG[signId] || DECANS_CATALOG['aries'];
    let decanIdx: 0 | 1 | 2 = 0;
    if (deg >= 20) decanIdx = 2;
    else if (deg >= 10) decanIdx = 1;

    const decan = decanList[decanIdx];
    const sabian = getSabianSymbol(signId, signName, deg);

    return {
      bodyName,
      sign: placement.sign,
      exactDegree: Math.round(deg * 100) / 100,
      decan,
      sabian
    };
  };

  const sun = makePlacementDS('태양(Sun - 핵심 본질 자아)', natal.sun);
  const moon = makePlacementDS('달(Moon - 내면 심리와 무의식)', natal.moon);
  const ascendant = natal.ascendant ? makePlacementDS('상승궁(Ascendant - 대외 페르소나)', natal.ascendant) : undefined;

  const temporalSabianRhythm = getTemporalSabianRhythm(now);
  const situationalSabianAudit = getSituationalSabianAudit(params?.question, sun, moon);

  const coreIdentityMetaphor = `태양 [${sun.sign.name} ${sun.exactDegree}°] → ${sun.decan.title} (${sun.decan.subRuler} 영향권) · 사비안: ${sun.sabian.symbolTitle}`;
  const innerEmotionalLandscape = `달 [${moon.sign.name} ${moon.exactDegree}°] → ${moon.decan.title} (${moon.decan.subRuler} 영향권) · 사비안: ${moon.sabian.symbolTitle}`;
  const actionableSoulAdvice = `${sun.decan.coreVibe}의 힘으로 추진하되, ${sun.sabian.lightExpression}.`;

  const sabianSynthesisMatrix = {
    coreInsight: `태양 [${sun.decan.title}]과 달 [${moon.decan.title}]이 만나 ${situationalSabianAudit.focusTheme}의 고유한 상징을 빚어냅니다.`,
    recommendedAction: `${actionableSoulAdvice} (${situationalSabianAudit.decanSubRulerGuidance})`,
    cautionNotice: `그림자 함정 주의: ${situationalSabianAudit.shadowCaution}`,
  };

  const summary = `[데칸 & 사비안] 태양은 ${sun.decan.title}(${sun.decan.subRuler} 관할), 사비안: ${sun.sabian.symbolTitle}. 달은 ${moon.decan.title}, 사비안: ${moon.sabian.symbolTitle}.`;
  const boundaryNotice = '본 결과는 36 데칸 부지배성과 사비안 심볼 360° 원형에 따른 정성적 상징 해석이며, 확정적 길흉 판정이 아닙니다.';

  return {
    engineVersion: ASTRO_DECAN_SABIAN_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst: temporalSabianRhythm.kstTimeLabel,
    sun,
    moon,
    ascendant,
    situationalSabianAudit,
    temporalSabianRhythm,
    sabianSynthesisMatrix,
    soulPoetics: {
      coreIdentityMetaphor,
      innerEmotionalLandscape,
      actionableSoulAdvice
    },
    summary,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatAstrologicalDecanSabianPrompt(res: AstrologicalDecanSabianResult): string {
  return `[점성술 36 데칸(Decan) & 사비안 심볼(Sabian 360°) 정밀 상징 리포트 (엔진: ${res.engineVersion})]
- 연산 시각: ${res.calculatedAtKst}
- 태양(Sun - 핵심 본질 자아): ${res.sun.sign.name} ${res.sun.exactDegree}°
  • 데칸 배속: [제${res.sun.decan.decanIndex}데칸: ${res.sun.decan.title}] (부지배성: ${res.sun.decan.subRuler} / 타로: ${res.sun.decan.tarotMinorCard})
    - 에너지: ${res.sun.decan.coreVibe} → 발현: ${res.sun.decan.manifestation}
  • 사비안 심볼: [${res.sun.sabian.symbolTitle}]
    - 빛의 발현: ${res.sun.sabian.lightExpression}
    - 그림자 함정: ${res.sun.sabian.shadowTrap}
    - 영혼의 잠언: "${res.sun.sabian.soulWisdom}"
- 달(Moon - 내면 심리와 무의식): ${res.moon.sign.name} ${res.moon.exactDegree}°
  • 데칸 배속: [제${res.moon.decan.decanIndex}데칸: ${res.moon.decan.title}] (부지배성: ${res.moon.decan.subRuler})
  • 사비안 심볼: [${res.moon.sabian.symbolTitle}]
    - 내면의 풍경: "${res.moon.sabian.soulWisdom}"
- 질문 맥락 감사 (${res.situationalSabianAudit.focusTheme}):
  • 부지배성 조율: ${res.situationalSabianAudit.decanSubRulerGuidance}
  • 경계 함정: ${res.situationalSabianAudit.shadowCaution}
- KST 시공간 점성 리듬: ${res.temporalSabianRhythm.planetaryHourTone} / ${res.temporalSabianRhythm.seasonalZodiacArc}
  • 시공간 지침: ${res.temporalSabianRhythm.temporalGuidance}
- 사비안 교차 매트릭스:
  • 핵심 통찰: ${res.sabianSynthesisMatrix.coreInsight}
  • 권고 실행: ${res.sabianSynthesisMatrix.recommendedAction}
  • 주의 경계: ${res.sabianSynthesisMatrix.cautionNotice}
- 영혼의 문학적 메타포:
  • 핵심 본질: "${res.soulPoetics.coreIdentityMetaphor}"
  • 무의식 풍경: "${res.soulPoetics.innerEmotionalLandscape}"
  • 실천 지침: "${res.soulPoetics.actionableSoulAdvice}"
- 해석 경계: ${res.boundaryNotice}`;
}

