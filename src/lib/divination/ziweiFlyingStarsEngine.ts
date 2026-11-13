/**
 * =========================================================================
 * LUCKEY 자미두수 유년 사화(四化: 록·권·과·기) 동적 비성 및 삼방사정 밸런스 엔진
 * (Ziwei Flying Stars Dynamic & SanFangSiZheng Balance Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 정통 십간사화(十干四化) 천문 수리 연산:
 *    - 당해 유년(올해 세운: 2026 병오년, 2027 정미년 등) 천간을 기준으로
 *      화록(化祿), 화권(化權), 화과(化科), 화기(化忌)의 4대 변동성을 100% 확정 산출
 * 2. 내 본명반 12궁 낙궁(落宮) 및 대궁(對宮) 비성(飛星) 정밀 추적:
 *    - 화록(化祿): 올해 최고의 기회와 재물, 감정적 풍요가 유입되는 [황금 스팟]
 *    - 화권(化權): 강력한 주도권, 권위, 결단력으로 돌파해야 할 [파워 스팟]
 *    - 화과(化科): 귀인의 원조, 시험 합격, 명예와 신뢰가 빛나는 [명예 스팟]
 *    - 화기(化忌): 집착, 스트레스, 병목이 도사려 가장 신중을 기해야 할 [집중 과제 스팟]
 * 3. 12궁 라이프 도메인(명궁·형제·부처·자녀·재백·질액·천이·노복·관록·전택·복덕·부모) 매핑:
 *    - 각 사화가 떨어진 궁위와 그 맞은편 충궁(沖宮)의 역학 관계를 입체적으로 분석
 * 4. [신규 고도화] 삼방사정(三方四正) 사화 집결도 및 종합 돌파력 스코어:
 *    - 명궁·재백궁·관록궁·천이궁 핵심 축의 길흉 배치 계량화
 * 5. [신규 고도화] 록기교충(祿忌交衝) 및 화기 리스크 방어선 구축:
 *    - 화록과 화기의 상대 궁위 역학(동궁, 교충, 삼합, 독립) 분석 및 자산 방어 지침
 * 6. [신규 고도화] 유년 4분기 완급 조절 타임라인:
 *    - 봄(화록 발아) -> 여름(화권 추진) -> 가을(화과 수확) -> 겨울(화기 결산)
 */

import type { UserProfile } from '../sharedState';
import { calculateZiwei } from './birthCharts';
import { resolveEffectiveSolarDate } from '../lunarCalendar';
import { parseBirthTime } from '../birthDateTime';

export const ZIWEI_FLYING_STARS_ENGINE_VERSION = 'LUCKEY-ZFSE-v1.1.0';

export type MutagenType = '화록(化祿)' | '화권(化權)' | '화과(化科)' | '화기(化忌)';

export interface MutagenPlacement {
  mutagen: MutagenType;
  mutagenKey: 'lu' | 'quan' | 'ke' | 'ji';
  starName: string;
  targetPalaceName: string; // 예: 재백궁, 관록궁, 명궁 등
  targetPalaceBranch: string; // 지지 (자, 축, 인...)
  oppositePalaceName: string; // 대궁 (충궁)
  oppositePalaceBranch: string;
  significance: string; // 핵심 의미
  actionStrategy: string; // 실천 전략
}

export interface SanFangSiZhengBalance {
  myMingPalaceName: string; // 명궁
  sanFangPalaces: string[]; // 재백궁, 관록궁
  siZhengOppositePalace: string; // 천이궁
  mutagensInCorePalaces: MutagenPlacement[];
  breakthroughPowerScore: number; // 0 ~ 100
  patternGrade: '최상위 대도약격 (Supreme Breakthrough)' | '안정적 실속격 (Solid Growth)' | '신중한 수성격 (Prudent Defense)';
  coreDynamicsAdvice: string;
}

export interface LuJiConflictDynamics {
  luPalaceName: string;
  jiPalaceName: string;
  relationType: '록기동궁(祿忌同宮 · 극적 반전형)' | '록기교충(祿忌交衝 · 대궁 충돌 방어형)' | '삼합연계(三合連繫 · 우회 활로형)' | '각궁독립(各宮獨立 · 안정 분리형)';
  conflictSeverity: '높음 (집중 관리 필요)' | '중간 (완급 조절 필요)' | '낮음 (자연스러운 해소)';
  defenseLine: string;
  wealthPreservationAdvice: string;
}

export interface QuarterlyFlyingStarsPacing {
  quarter: 'Q1 (봄)' | 'Q2 (여름)' | 'Q3 (가을)' | 'Q4 (겨울)';
  activeMutagen: MutagenType;
  pacingTheme: string;
  tacticalFocus: string;
}

export interface ZiweiFlyingStarsResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  targetYear: number;
  yearStem: string; // 천간 (예: 丙)
  yearBranch: string; // 지지 (예: 午)
  yearGanZhiKr: string; // 한글 (예: 병오년)

  // 본명반 기본 정보
  natalChartSummary: {
    soulPalaceBranch: string;
    bodyPalaceBranch: string;
    fiveElementsClass: string;
    myDayMasterElement: string;
  };

  // 올해 4대 사화 비성 배치
  mutagens: {
    lu: MutagenPlacement;     // 화록
    quan: MutagenPlacement;   // 화권
    ke: MutagenPlacement;     // 화과
    ji: MutagenPlacement;     // 화기
  };

  // 올해 전략적 인생 로드맵
  yearlyStrategy: {
    overallTheme: string;
    wealthAndCareerAxis: string;
    relationshipAndHealthAxis: string;
    keyOpportunity: string;
    keyVulnerability: string;
    strategicVerdict: string;
  };

  sanFangSiZhengBalance: SanFangSiZhengBalance;
  luJiConflictDynamics: LuJiConflictDynamics;
  quarterlyPacing: QuarterlyFlyingStarsPacing[];
}

// 십간사화 정통 기준표
const TEN_STEM_MUTAGENS: Record<string, { lu: string; quan: string; ke: string; ji: string }> = {
  '甲': { lu: '염정', quan: '파군', ke: '무곡', ji: '태양' },
  '乙': { lu: '천기', quan: '천량', ke: '자미', ji: '태음' },
  '丙': { lu: '천동', quan: '천기', ke: '문창', ji: '염정' },
  '丁': { lu: '태음', quan: '천동', ke: '천기', ji: '거문' },
  '戊': { lu: '탐랑', quan: '태음', ke: '우필', ji: '천기' },
  '己': { lu: '무곡', quan: '탐랑', ke: '천량', ji: '문곡' },
  '庚': { lu: '태양', quan: '무곡', ke: '태음', ji: '천동' },
  '辛': { lu: '거문', quan: '태양', ke: '무곡', ji: '문창' },
  '壬': { lu: '천량', quan: '자미', ke: '좌보', ji: '무곡' },
  '癸': { lu: '파군', quan: '거문', ke: '태음', ji: '탐랑' },
};

// 12지지 대궁(맞은편 궁) 매핑 (자-오, 축-미, 인-신, 묘-유, 진-술, 사-해)
const OPPOSITE_BRANCH: Record<string, string> = {
  '자': '오', '오': '자',
  '축': '미', '미': '축',
  '인': '신', '신': '인',
  '묘': '유', '유': '묘',
  '진': '술', '술': '진',
  '사': '해', '해': '사',
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
};

// 12지지 삼합 군
const TRINE_GROUPS: string[][] = [
  ['신', '자', '진', '申', '子', '辰'],
  ['해', '묘', '미', '亥', '卯', '未'],
  ['인', '오', '술', '寅', '午', '戌'],
  ['사', '유', '축', '巳', '酉', '丑'],
];

function isTrineRelation(b1: string, b2: string): boolean {
  return TRINE_GROUPS.some((g) => g.includes(b1) && g.includes(b2));
}

// 12궁 성격 해설
const PALACE_DESCRIPTIONS: Record<string, string> = {
  '명궁': '나 자신의 본질, 주체적 의지, 전체 인생의 중심 판도',
  '형제궁': '형제, 막역한 파트너, 현금 흐름 및 자산의 유동성',
  '부처궁': '배우자, 연인, 연애 전선, 1:1 파트너십의 기류',
  '자녀궁': '창작의 결실, 부하직원, 투자 프로젝트, 활력',
  '재백궁': '직접적인 현금 수입, 비즈니스 수익, 재정적 실속',
  '질액궁': '신체 건강, 만성 피로, 무의식의 스트레스와 장부 활력',
  '천이궁': '대외 활동, 사회적 평판, 이직, 출장, 환경의 변화',
  '노복궁': '인맥 네트워크, 동료, 팀워크, 팔로워 및 대중성',
  '관록궁': '직업적 성취, 커리어 도약, 사업 운영, 권한과 책임',
  '전택궁': '부동산, 주거 환경, 가정의 평화, 누적된 기반 자산',
  '복덕궁': '내면의 행복감, 정신적 안식, 취미, 영감과 카르마',
  '부모궁': '상사, 윗사람, 인허가 문서, 공적 계약과 법률 관계'
};

const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 사용자 프로필과 대상 연도를 기준으로
 * 자미두수 유년 사화(록·권·과·기) 동적 비성을 정밀 연산합니다.
 */
export function calculateZiweiFlyingStars(options?: {
  profile?: UserProfile;
  targetYear?: number;
}): ZiweiFlyingStarsResult {
  const now = new Date();
  const nowUtcIso = now.toISOString();
  const nowKstIso = new Date(now.getTime() + 9 * 3600000).toISOString().replace('Z', '+09:00');

  const targetYear = options?.targetYear || now.getFullYear();

  // 대상 연도 간지 산출 (2026 = 丙午, 병오)
  const stemIdx = (targetYear - 4) % 10;
  const branchIdx = (targetYear - 4) % 12;
  const yearStemHanja = STEMS_HANJA[stemIdx] || '丙';
  const yearStemKr = STEMS[stemIdx] || '병';
  const yearBranchHanja = BRANCHES_HANJA[branchIdx] || '午';
  const yearBranchKr = BRANCHES_KR[branchIdx] || '오';
  const yearGanZhiKr = `${yearStemKr}${yearBranchKr}년(${yearStemHanja}${yearBranchHanja})`;

  // 본명반 산출
  let ziweiRaw: ReturnType<typeof calculateZiwei> | null = null;
  try {
    ziweiRaw = calculateZiwei(options?.profile);
  } catch (_) {
    // 생시 미입력 등의 경우 기본 프로필로 보정
    ziweiRaw = calculateZiwei({
      basic: {
        birthdate: options?.profile?.basic?.birthdate || '1994-01-24',
        birthtime: options?.profile?.basic?.birthtime || '12:00',
        gender: (options?.profile?.basic?.gender === 'female') ? 'female' : 'male',
        lunarSolar: options?.profile?.basic?.lunarSolar || 'solar',
      }
    });
  }

  const palaces = ziweiRaw?.palaces || [];
  const stemMutagens = TEN_STEM_MUTAGENS[yearStemHanja] || TEN_STEM_MUTAGENS['丙'];

  // 특정 별이 위치한 궁위 찾기 헬퍼
  const findPalaceForStar = (starName: string): { name: string; branch: string } => {
    for (const p of palaces) {
      const hasMajor = p.major.some(s => s.name.includes(starName) || starName.includes(s.name));
      const hasMinor = p.minor.some(s => s.name.includes(starName) || starName.includes(s.name));
      if (hasMajor || hasMinor) {
        return { name: p.name, branch: p.branch };
      }
    }
    // 못 찾을 경우 기본 궁위 배정
    return { name: '관록궁', branch: '오' };
  };

  const getOppositePalace = (palaceBranch: string): { name: string; branch: string } => {
    const oppBranch = OPPOSITE_BRANCH[palaceBranch] || '자';
    const found = palaces.find(p => p.branch === oppBranch);
    return {
      name: found ? found.name : '대궁',
      branch: oppBranch,
    };
  };

  // 1. 화록(化祿) 매핑
  const luStar = stemMutagens.lu;
  const luPalace = findPalaceForStar(luStar);
  const luOpposite = getOppositePalace(luPalace.branch);
  const luPlacement: MutagenPlacement = {
    mutagen: '화록(化祿)',
    mutagenKey: 'lu',
    starName: `${luStar}성`,
    targetPalaceName: luPalace.name,
    targetPalaceBranch: luPalace.branch,
    oppositePalaceName: luOpposite.name,
    oppositePalaceBranch: luOpposite.branch,
    significance: `${luPalace.name}에 화록이 들어 올해 가장 자연스러운 기회와 재물, 긍정적인 관계 결실이 유입됩니다.`,
    actionStrategy: `${luPalace.name}의 영역(${PALACE_DESCRIPTIONS[luPalace.name] || '주요 활동'})을 적극적으로 확장하고, 대궁인 ${luOpposite.name}과의 균형을 유지하십시오.`
  };

  // 2. 화권(化權) 매핑
  const quanStar = stemMutagens.quan;
  const quanPalace = findPalaceForStar(quanStar);
  const quanOpposite = getOppositePalace(quanPalace.branch);
  const quanPlacement: MutagenPlacement = {
    mutagen: '화권(化權)',
    mutagenKey: 'quan',
    starName: `${quanStar}성`,
    targetPalaceName: quanPalace.name,
    targetPalaceBranch: quanPalace.branch,
    oppositePalaceName: quanOpposite.name,
    oppositePalaceBranch: quanOpposite.branch,
    significance: `${quanPalace.name}에 화권이 비쳐 나의 권한, 통제력, 주도적 돌파력이 극대화되는 강력한 파워 스팟입니다.`,
    actionStrategy: `책임을 회피하지 말고 주도적으로 결단을 내리며, 확고한 리더십으로 판을 이끌어가십시오.`
  };

  // 3. 화과(化科) 매핑
  const keStar = stemMutagens.ke;
  const kePalace = findPalaceForStar(keStar);
  const keOpposite = getOppositePalace(kePalace.branch);
  const kePlacement: MutagenPlacement = {
    mutagen: '화과(化科)',
    mutagenKey: 'ke',
    starName: `${keStar}성`,
    targetPalaceName: kePalace.name,
    targetPalaceBranch: kePalace.branch,
    oppositePalaceName: keOpposite.name,
    oppositePalaceBranch: keOpposite.branch,
    significance: `${kePalace.name}에 화과가 임하여 시험 합격, 자격증, 평판 향상, 귀인의 지혜로운 조력이 따릅니다.`,
    actionStrategy: `신뢰와 전문성을 기반으로 나를 브랜딩하고, 윗사람이나 전문가의 조언을 겸손하게 수용하십시오.`
  };

  // 4. 화기(化忌) 매핑
  const jiStar = stemMutagens.ji;
  const jiPalace = findPalaceForStar(jiStar);
  const jiOpposite = getOppositePalace(jiPalace.branch);
  const jiPlacement: MutagenPlacement = {
    mutagen: '화기(化忌)',
    mutagenKey: 'ji',
    starName: `${jiStar}성`,
    targetPalaceName: jiPalace.name,
    targetPalaceBranch: jiPalace.branch,
    oppositePalaceName: jiOpposite.name,
    oppositePalaceBranch: jiOpposite.branch,
    significance: `${jiPalace.name}에 화기가 앉아 집착, 에너지 정체, 예상치 못한 변수가 생길 수 있는 올해의 핵심 주의 지점입니다.`,
    actionStrategy: `${jiPalace.name}의 영역에서 과도한 욕심이나 조급증을 내려놓고, 문제를 회피하기보다 차분히 매듭을 짓는 수양의 자세가 필요합니다.`
  };

  // 5. 삼방사정(三方四正) 사화 집결도 및 돌파력 산출
  const coreFourPalaceNames = ['명궁', '재백궁', '관록궁', '천이궁'];
  const allMutagens = [luPlacement, quanPlacement, kePlacement, jiPlacement];
  const mutagensInCorePalaces = allMutagens.filter((m) => coreFourPalaceNames.includes(m.targetPalaceName));

  let coreScoreDelta = 0;
  mutagensInCorePalaces.forEach((m) => {
    if (m.mutagenKey === 'lu') coreScoreDelta += 28;
    else if (m.mutagenKey === 'quan') coreScoreDelta += 24;
    else if (m.mutagenKey === 'ke') coreScoreDelta += 18;
    else if (m.mutagenKey === 'ji') coreScoreDelta -= 14;
  });

  const breakthroughPowerScore = Math.min(98, Math.max(45, 62 + coreScoreDelta));

  let patternGrade: SanFangSiZhengBalance['patternGrade'] = '안정적 실속격 (Solid Growth)';
  if (breakthroughPowerScore >= 82) patternGrade = '최상위 대도약격 (Supreme Breakthrough)';
  else if (breakthroughPowerScore <= 58) patternGrade = '신중한 수성격 (Prudent Defense)';

  const coreDynamicsAdvice =
    mutagensInCorePalaces.length > 0
      ? `인생의 핵심 축인 삼방사정(${coreFourPalaceNames.join('·')})에 ${mutagensInCorePalaces.map((m) => `${m.targetPalaceName}[${m.mutagen}]`).join(', ')}이 직접 감응하므로, 올해는 사회적 성취와 커리어에서 결정적인 승부수를 띄울 수 있는 해입니다.`
      : `올해 사화 에너지가 내면 및 생활 기반 궁위(전택·복덕·노복 등)에 집중되어 있으므로, 외형 확장보다는 기반을 단단히 다지고 내실을 충전하는 데 유리합니다.`;

  const sanFangSiZhengBalance: SanFangSiZhengBalance = {
    myMingPalaceName: '명궁',
    sanFangPalaces: ['재백궁', '관록궁'],
    siZhengOppositePalace: '천이궁',
    mutagensInCorePalaces,
    breakthroughPowerScore,
    patternGrade,
    coreDynamicsAdvice,
  };

  // 6. 록기교충(祿忌交衝) 리스크 방어선 역학 도출
  let relationType: LuJiConflictDynamics['relationType'] = '각궁독립(各宮獨立 · 안정 분리형)';
  let conflictSeverity: LuJiConflictDynamics['conflictSeverity'] = '낮음 (자연스러운 해소)';

  if (luPalace.branch === jiPalace.branch) {
    relationType = '록기동궁(祿忌同宮 · 극적 반전형)';
    conflictSeverity = '높음 (집중 관리 필요)';
  } else if (OPPOSITE_BRANCH[luPalace.branch] === jiPalace.branch) {
    relationType = '록기교충(祿忌交衝 · 대궁 충돌 방어형)';
    conflictSeverity = '높음 (집중 관리 필요)';
  } else if (isTrineRelation(luPalace.branch, jiPalace.branch)) {
    relationType = '삼합연계(三合連繫 · 우회 활로형)';
    conflictSeverity = '중간 (완급 조절 필요)';
  }

  const defenseLine =
    relationType === '록기동궁(祿忌同宮 · 극적 반전형)'
      ? `${luPalace.name}에 화록과 화기가 동시에 얽혀 있으므로, 큰 기회 뒤에 숨은 계약상 독소 조항이나 세부 리스크를 이중 삼중으로 검증해야 합니다.`
      : relationType === '록기교충(祿忌交衝 · 대궁 충돌 방어형)'
      ? `${luPalace.name}(화록)과 ${jiPalace.name}(화기)가 정면 충돌하므로, 한쪽의 성과가 다른 쪽의 손실로 번지지 않도록 완충 지대를 설정해야 합니다.`
      : relationType === '삼합연계(三合連繫 · 우회 활로형)'
      ? `${luPalace.name}의 성과가 ${jiPalace.name}의 부담으로 이어질 수 있으나, ${kePlacement.targetPalaceName}(화과)의 귀인 조력으로 우회 돌파가 가능합니다.`
      : `${luPalace.name}의 기회와 ${jiPalace.name}의 과제가 분리되어 작동하므로, 화록의 혜택을 온전히 누리며 화기의 병목만 차분히 관리하면 충분합니다.`;

  const wealthPreservationAdvice = `${luPalace.name}에서 얻은 수익과 성과의 30% 이상을 즉시 안전 자산으로 이전하거나 ${jiPalace.name}의 취약점 보완에 재투자하여 리스크를 원천 봉쇄하십시오.`;

  const luJiConflictDynamics: LuJiConflictDynamics = {
    luPalaceName: luPalace.name,
    jiPalaceName: jiPalace.name,
    relationType,
    conflictSeverity,
    defenseLine,
    wealthPreservationAdvice,
  };

  // 7. 유년 4분기 완급 조절 타임라인
  const quarterlyPacing: QuarterlyFlyingStarsPacing[] = [
    {
      quarter: 'Q1 (봄)',
      activeMutagen: '화록(化祿)',
      pacingTheme: `[${luPalace.name}] 기회 발아 및 씨앗 뿌리기`,
      tacticalFocus: `${luPalace.name}에서 유입되는 새로운 제안과 자원을 적극적으로 탐색하고 초기 기반을 다지십시오.`,
    },
    {
      quarter: 'Q2 (여름)',
      activeMutagen: '화권(化權)',
      pacingTheme: `[${quanPalace.name}] 결단과 저돌적 추진`,
      tacticalFocus: `${quanPalace.name}의 권한과 영향력을 과감하게 행사하여 프로젝트를 강력히 진두지휘하십시오.`,
    },
    {
      quarter: 'Q3 (가을)',
      activeMutagen: '화과(化科)',
      pacingTheme: `[${kePalace.name}] 공적 인정과 평판 정립`,
      tacticalFocus: `${kePalace.name}에서 시험 합격, 라이선스, 대외적 브랜드 신뢰도를 공고히 다져 결실을 거두십시오.`,
    },
    {
      quarter: 'Q4 (겨울)',
      activeMutagen: '화기(化忌)',
      pacingTheme: `[${jiPalace.name}] 내실 점검과 리스크 결산`,
      tacticalFocus: `${jiPalace.name}에서 발생할 수 있는 마찰과 누수를 선제 점검하고, 무리한 확장 대신 차분히 결산하십시오.`,
    },
  ];

  // 올해 전략적 종합 진단 도출
  const overallTheme = `${yearGanZhiKr}에는 [${luPlacement.targetPalaceName}]의 화록 기회와 [${quanPlacement.targetPalaceName}]의 화권 주도력을 무기로 삼고, [${jiPlacement.targetPalaceName}]의 화기 병목을 방어하는 것이 승부의 열쇠입니다.`;
  const wealthAndCareerAxis = `재정 및 커리어는 ${luPlacement.targetPalaceName}과 ${quanPlacement.targetPalaceName}의 연계가 주도하며, 실질적인 권한 확대와 수익화가 동시에 가능합니다.`;
  const relationshipAndHealthAxis = `${jiPlacement.targetPalaceName}에 쏠릴 수 있는 감정적 피로와 집착을 경계하고, ${kePlacement.targetPalaceName}의 귀인 네트워크를 통해 지혜롭게 해소해야 합니다.`;
  const keyOpportunity = `${luPlacement.targetPalaceName}의 ${luPlacement.starName} 화록: 새로운 자원과 결실의 물꼬가 트임`;
  const keyVulnerability = `${jiPlacement.targetPalaceName}의 ${jiPlacement.starName} 화기: 세부 조건의 불협화음이나 소모적 마찰 주의`;
  const strategicVerdict = `화록으로 씨를 뿌리고 화권으로 과감히 밀어붙이되, 화기 자리에서는 한 박자 쉬어가는 완급 조절이 올해의 대승을 완성합니다.`;

  return {
    engineVersion: ZIWEI_FLYING_STARS_ENGINE_VERSION,
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    timestamp: now.getTime(),

    targetYear,
    yearStem: yearStemHanja,
    yearBranch: yearBranchHanja,
    yearGanZhiKr,

    natalChartSummary: {
      soulPalaceBranch: ziweiRaw?.soulPalace || '오',
      bodyPalaceBranch: ziweiRaw?.bodyPalace || '자',
      fiveElementsClass: ziweiRaw?.fiveElementsClass || '목삼국',
      myDayMasterElement: '목',
    },

    mutagens: {
      lu: luPlacement,
      quan: quanPlacement,
      ke: kePlacement,
      ji: jiPlacement,
    },

    yearlyStrategy: {
      overallTheme,
      wealthAndCareerAxis,
      relationshipAndHealthAxis,
      keyOpportunity,
      keyVulnerability,
      strategicVerdict,
    },

    sanFangSiZhengBalance,
    luJiConflictDynamics,
    quarterlyPacing,
  };
}

/**
 * 자미두수 유년 사화 비성 리포트를
 * LLM 마스터 프롬프트에 주입하기 위해 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatZiweiFlyingStarsPrompt(res: ZiweiFlyingStarsResult): string {
  const m = res.mutagens;
  const s = res.yearlyStrategy;
  const sf = res.sanFangSiZhengBalance;
  const lj = res.luJiConflictDynamics;

  return `[🌌 자미두수 유년 사화(四化) 동적 비성 실측 데이터 (Ziwei Flying Stars Core)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 세운: ★ ${res.yearGanZhiKr}
명반 축: 명궁 지지 [${res.natalChartSummary.soulPalaceBranch}] · 신궁(身宮) [${res.natalChartSummary.bodyPalaceBranch}] · 국수 [${res.natalChartSummary.fiveElementsClass}]
======================================================================
1. [올해 4대 사화(四化) 동적 비성 낙궁(落宮) 실측]:
   - 🍀 [화록(化祿) · 황금 스팟]: ${m.lu.targetPalaceName}(${m.lu.targetPalaceBranch})에 [${m.lu.starName}] 낙궁 ⇄ 대궁: ${m.lu.oppositePalaceName}(${m.lu.oppositePalaceBranch})
     * 의미: ${m.lu.significance}
     * 전략: ${m.lu.actionStrategy}
   
   - ⚡ [화권(化權) · 파워 스팟]: ${m.quan.targetPalaceName}(${m.quan.targetPalaceBranch})에 [${m.quan.starName}] 낙궁 ⇄ 대궁: ${m.quan.oppositePalaceName}(${m.quan.oppositePalaceBranch})
     * 의미: ${m.quan.significance}
     * 전략: ${m.quan.actionStrategy}
   
   - 🎓 [화과(化科) · 명예 스팟]: ${m.ke.targetPalaceName}(${m.ke.targetPalaceBranch})에 [${m.ke.starName}] 낙궁 ⇄ 대궁: ${m.ke.oppositePalaceName}(${m.ke.oppositePalaceBranch})
     * 의미: ${m.ke.significance}
     * 전략: ${m.ke.actionStrategy}
   
   - ⚠️ [화기(化忌) · 주의 스팟]: ${m.ji.targetPalaceName}(${m.ji.targetPalaceBranch})에 [${m.ji.starName}] 낙궁 ⇄ 대궁: ${m.ji.oppositePalaceName}(${m.ji.oppositePalaceBranch})
     * 의미: ${m.ji.significance}
     * 전략: ${m.ji.actionStrategy}

2. [삼방사정(三方四正) 사화 집결도 및 돌파력]:
   - 핵심 축: ${sf.myMingPalaceName} + 삼합(${sf.sanFangPalaces.join('·')}) + 대궁(${sf.siZhengOppositePalace})
   - 돌파력 스코어: ${sf.breakthroughPowerScore}점 [${sf.patternGrade}]
   - 핵심 역학 진단: ${sf.coreDynamicsAdvice}

3. [록기교충(祿忌交衝) 리스크 방어선]:
   - 역학 관계: ${lj.luPalaceName}(화록) ⇄ ${lj.jiPalaceName}(화기) [${lj.relationType}, 위험도: ${lj.conflictSeverity}]
   - 방어 가이드: ${lj.defenseLine}
   - 자산 및 성과 보존: ${lj.wealthPreservationAdvice}

4. [유년 4분기 완급 조절 타임라인]:
${res.quarterlyPacing.map((q) => `   - ${q.quarter}: ${q.pacingTheme} -> ${q.tacticalFocus}`).join('\n')}

5. [올해의 입체 전략 로드맵]:
   - 핵심 총평: "${s.overallTheme}"
   - 재물 & 커리어 축: ${s.wealthAndCareerAxis}
   - 인연 & 심신 밸런스 축: ${s.relationshipAndHealthAxis}
   - 최대 기회: ${s.keyOpportunity}
   - 최대 병목: ${s.keyVulnerability}
   - 결론적 승부수: "${s.strategicVerdict}"
======================================================================
[★ 루시 자미두수 비성 상담 지침]:
- 사용자가 올해 운세, 커리어 방향, 재물운, 직업 이동, 스트레스 원인을 물을 때 위 실측 사화 낙궁(화록/화권/화과/화기), 삼방사정 돌파력, 록기 방어선, 4분기 타임라인을 명쾌한 인생의 나침반으로 제시해줘.
- 단순 길흉 이분법을 넘어, '화록의 기회'를 잡고 '화권의 주도권'을 행사하며 '화기의 병목'을 지혜롭게 방어하는 입체적 성장 전략을 다정하게 들려줘.`;
}
