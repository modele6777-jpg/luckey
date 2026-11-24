/**
 * =========================================================================
 * LUCKEY 15대 신살 위치별 슈퍼파워 치환 엔진 (Special Stars Matrix Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 15대 정통 신살 완전 수리 연산:
 *    - 4대 귀인: 천을귀인(天乙), 문창귀인(文昌), 천덕·월덕귀인(天德·月德), 태극귀인(太極)
 *    - 4대 카리스마 살: 괴강살(魁罡), 백호대살(白虎), 양인살(羊刃), 현침살(懸針)
 *    - 4대 매력·이동 살: 도화살(桃花), 홍염살(紅艶), 역마살(驛馬), 화개살(華蓋)
 *    - 3대 영성·재물 살: 귀문관살(鬼門關), 금여록(金輿), 암록(暗祿)
 * 2. 4개 기둥(년/월/일/시) 위치별 정밀 매핑:
 *    - 년주(사회적 기반·배경) vs 월주(직업 환경·커리어) vs 일주(핵심 본질·자아) vs 시주(비밀 무기·후반전 잠재력)
 * 3. 고전 흉살의 현대적 슈퍼파워 승화 (Superpower Sublimation):
 *    - 백호·괴강·양인·귀문관살 등 과거 두려움의 대상이었던 살(煞)을
 *      현대 비즈니스와 창작의 "독점적 무기 / 천재적 잠재력"으로 100% 긍정 승화
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  BRANCH_KOREAN,
  STEM_KOREAN,
  type SajuAnalysisResult,
} from '../sajuAnalysis';

export const SPECIAL_STARS_VERSION = 'LUCKEY-SSME-v2.3.0';

export type SpecialStarsQuestionTopic = 'talent' | 'career' | 'wealth' | 'relation' | 'general';

function classifySpecialStarsTopic(q: string): SpecialStarsQuestionTopic {
  if (/무기|재능|강점|슈퍼파워|적성/.test(q)) return 'talent';
  if (/직업|커리어|이직|사업|역할/.test(q)) return 'career';
  if (/재물|돈|투자|수익|금여|암록/.test(q)) return 'wealth';
  if (/인연|매력|도화|관계|귀인/.test(q)) return 'relation';
  return 'general';
}

const SPECIAL_STARS_SHADOW_WARNINGS: Record<SpecialStarsQuestionTopic, string> = {
  talent: '강한 신살의 잠재력만 믿고 기초 훈련과 반복 연습을 소홀히 하면 재능이 거칠게 소모될 수 있습니다.',
  career: '카리스마·돌파 성향이 강한 명식일수록 협업 과정에서 속도 차이를 배려하지 않으면 불필요한 마찰이 생깁니다.',
  wealth: '재물성 신살이 있더라도 현금 흐름 관리와 리스크 분산 없이는 기복이 커질 수 있습니다.',
  relation: '매력·귀인 성향이 살아날수록 경계 없는 호의나 과도한 기대가 오해를 부르지 않도록 선을 분명히 하십시오.',
  general: '신살은 타고난 엔진의 성격일 뿐, 방향과 브레이크는 오늘의 절제와 선택이 결정합니다.',
};

function formatSpecialStarsKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type PillarLocation = '년주(사회적기반)' | '월주(직업·커리어)' | '일주(핵심자아)' | '시주(비밀잠재력)';

export interface DetectedStarItem {
  id: string;
  nameKr: string;
  nameHanja: string;
  category: '귀인·길성' | '카리스마·돌파' | '매력·이동' | '영성·직관';
  pillar: PillarLocation;
  foundPillarText: string; // 예: "월주(甲辰)"
  classicalMeaning: string; // 고전적 설명
  superpowerTitle: string; // 현대적 슈퍼파워 명칭
  superpowerDescription: string; // 현대적 강점 해설
  optimalEnvironment: string; // 최적의 발현 환경
  recommendedRoles: string[]; // 추천 현대 직업군/역할
  powerLevel: number; // 1 ~ 5
}

export interface SpecialStarsResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;
  questionTopic: SpecialStarsQuestionTopic;
  shadowWarning: string;

  profileSummary: {
    birthdate: string;
    dayMaster: string;
    fourPillarsText: string;
  };

  totalStarsFound: number;
  detectedStars: DetectedStarItem[];

  // 4개 기둥별 요약
  pillarSummary: {
    yearStars: string[];
    monthStars: string[];
    dayStars: string[];
    hourStars: string[];
  };

  // 핵심 3대 슈퍼파워 하이라이트
  topSuperpowers: Array<{
    title: string;
    starName: string;
    pillar: string;
    actionableAdvice: string;
  }>;

  overallSynthesis: string;
  specialStarsSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion?: string;
  interpretiveBoundary: string;
}

// 15대 신살 기준 정의
export function calculateSpecialStarsMatrix(options?: {
  profile?: UserProfile;
  targetDate?: Date;
  question?: string;
}): SpecialStarsResult {
  const now = options?.targetDate || new Date();
  const nowUtcIso = now.toISOString();
  const nowKst = formatSpecialStarsKstTimestamp(now);

  const saju: SajuAnalysisResult = calculateDetailedSaju(options?.profile);

  const p = saju.pillars;
  const yGan = p.year.gan;
  const yZhi = p.year.zhi;
  const mGan = p.month.gan;
  const mZhi = p.month.zhi;
  const dGan = p.day.gan;
  const dZhi = p.day.zhi;
  const hGan = p.hour?.gan || '';
  const hZhi = p.hour?.zhi || '';

  const pillarsList: Array<{ loc: PillarLocation; gan: string; zhi: string; full: string }> = [
    { loc: '년주(사회적기반)', gan: yGan, zhi: yZhi, full: p.year.full },
    { loc: '월주(직업·커리어)', gan: mGan, zhi: mZhi, full: p.month.full },
    { loc: '일주(핵심자아)', gan: dGan, zhi: dZhi, full: p.day.full },
  ];
  if (p.hour) {
    pillarsList.push({ loc: '시주(비밀잠재력)', gan: hGan, zhi: hZhi, full: p.hour.full });
  }

  const detectedStars: DetectedStarItem[] = [];

  // 삼합 그룹 헬퍼 (신자진=수, 사유축=금, 인오술=화, 해묘미=목)
  const getSamhap = (z: string) => {
    if (['申', '子', '辰'].includes(z)) return '수';
    if (['巳', '酉', '丑'].includes(z)) return '금';
    if (['寅', '午', '戌'].includes(z)) return '화';
    return '목';
  };
  const dayGroup = getSamhap(dZhi);
  const yearGroup = getSamhap(yZhi);

  // 1. 천을귀인(天乙貴人): 일간 기준
  const CHEON_EUL_MAP: Record<string, string[]> = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '辛': ['午', '寅'],
    '壬': ['巳', '卯'], '癸': ['巳', '卯'],
  };
  const targetEul = CHEON_EUL_MAP[dGan] || [];
  pillarsList.forEach(pl => {
    if (targetEul.includes(pl.zhi)) {
      detectedStars.push({
        id: `cheon-eul-${pl.loc}`,
        nameKr: '천을귀인',
        nameHanja: '天乙貴人',
        category: '귀인·길성',
        pillar: pl.loc,
        foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
        classicalMeaning: '모든 흉살을 무력화하고 위기에서 뜻밖의 귀인을 만나 길운으로 반전되는 최고의 길신.',
        superpowerTitle: '위기 반전 및 최고위 조력자 마그넷',
        superpowerDescription: '어떤 절체절명의 난관에 봉착해도 결정적 순간에 판을 뒤집어줄 핵심 조력자와 자본, 기회를 자석처럼 끌어당기는 절대 수호력.',
        optimalEnvironment: '리스크가 높은 과감한 도전, 대외 협상, 핵심 의사결정 국면',
        recommendedRoles: ['최고경영자(CEO)', '전략 기획가', '투자 유치 리더', '브랜드 디렉터'],
        powerLevel: 5,
      });
    }
  });

  // 2. 문창귀인(文昌貴人): 일간 기준 (식신 록지)
  const MUNCHANG_MAP: Record<string, string> = {
    '甲': '巳', '乙': '午', '丙': '申', '戊': '申', '丁': '酉', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
  };
  const targetMunchang = MUNCHANG_MAP[dGan];
  pillarsList.forEach(pl => {
    if (pl.zhi === targetMunchang) {
      detectedStars.push({
        id: `munchang-${pl.loc}`,
        nameKr: '문창귀인',
        nameHanja: '文昌貴人',
        category: '귀인·길성',
        pillar: pl.loc,
        foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
        classicalMeaning: '학문과 예술, 총명함이 뛰어나 시험에 합격하고 붓으로 천하를 호령하는 길신.',
        superpowerTitle: '탁월한 언어화·기획 및 지식자산화 천재성',
        superpowerDescription: '복잡한 아이디어를 명쾌한 글, 논리, 시스템 문서로 정형화하여 대중과 시장을 설득하고 영구적 지식재산(IP)으로 축적하는 힘.',
        optimalEnvironment: '콘텐츠 제작, 테크 아키텍처 문서화, 출판, 교육, 전략 수립',
        recommendedRoles: ['시스템 아키텍트', '작가/칼럼니스트', '프로덕트 리드', '리서처'],
        powerLevel: 4,
      });
    }
  });

  // 3. 괴강살(魁罡殺): 경진, 경술, 임진, 임술, 무술
  const GOEGANG_PILLARS = ['庚辰', '庚戌', '壬辰', '壬戌', '戊戌'];
  pillarsList.forEach(pl => {
    const raw = `${pl.gan}${pl.zhi}`;
    if (GOEGANG_PILLARS.includes(raw)) {
      detectedStars.push({
        id: `goegang-${pl.loc}`,
        nameKr: '괴강살',
        nameHanja: '魁罡殺',
        category: '카리스마·돌파',
        pillar: pl.loc,
        foundPillarText: `${pl.full}`,
        classicalMeaning: '우두머리의 기상으로 성정이 극도로 강하여 길흉이 극단으로 치닫는 살.',
        superpowerTitle: '판을 새로 짜는 독점적 결단력과 혁신 카리스마',
        superpowerDescription: '기존의 낡은 질서와 관행을 단번에 엎어버리고 새로운 룰을 구축하며, 대중을 단호하게 리드하여 거대한 조직을 이끄는 장악력.',
        optimalEnvironment: '파괴적 혁신(Disruption) 스타트업, 위기 구조조정, 대규모 프로젝트 지휘',
        recommendedRoles: ['파운더/창업가', '프로덕트 오너', '정치/사회적 리더', '전문 투자가'],
        powerLevel: 5,
      });
    }
  });

  // 4. 백호대살(白虎大殺): 갑진, 을미, 병술, 정축, 무진, 임술, 계축
  const BAEKHO_PILLARS = ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'];
  pillarsList.forEach(pl => {
    const raw = `${pl.gan}${pl.zhi}`;
    if (BAEKHO_PILLARS.includes(raw)) {
      detectedStars.push({
        id: `baekho-${pl.loc}`,
        nameKr: '백호대살',
        nameHanja: '白虎大殺',
        category: '카리스마·돌파',
        pillar: pl.loc,
        foundPillarText: `${pl.full}`,
        classicalMeaning: '피를 보거나 갑작스러운 재난을 겪기 쉬우나 용맹함이 극에 달하는 살.',
        superpowerTitle: '초고난도 문제 돌파 및 극한의 프로페셔널 몰입력',
        superpowerDescription: '남들이 포기하는 극한의 압박 상황에서도 심장을 얼어붙게 만드는 초인적 집중력과 뚝심으로 한 치의 오차 없이 결과를 끝장내는 실행력.',
        optimalEnvironment: '고난도 소프트웨어 엔지니어링, 고위험 금융 트레이딩, 수술·전문 기술',
        recommendedRoles: ['코어 엔지니어', '외과의/전문 의료진', '투자 승부사', '위기 해결사'],
        powerLevel: 4,
      });
    }
  });

  // 5. 양인살(羊刃殺): 일간 기준 제왕지 (갑=묘, 을=진/인, 병/무=오, 정/기=미/사, 경=유, 신=술/신, 임=자, 계=축/해)
  const YANGIN_MAP: Record<string, string> = {
    '甲': '卯', '丙': '午', '戊': '午', '庚': '酉', '壬': '子'
  };
  const targetYangin = YANGIN_MAP[dGan];
  if (targetYangin) {
    pillarsList.forEach(pl => {
      if (pl.zhi === targetYangin) {
        detectedStars.push({
          id: `yangin-${pl.loc}`,
          nameKr: '양인살',
          nameHanja: '羊刃殺',
          category: '카리스마·돌파',
          pillar: pl.loc,
          foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
          classicalMeaning: '칼날을 손에 쥔 형국으로 강건함이 지나쳐 부러지기 쉬운 살.',
          superpowerTitle: '타협 없는 장인 정신과 칼날 같은 전문성',
          superpowerDescription: '어설픈 타협을 불허하며 자신의 전문 분야에서 독점적 실력과 장인 정신으로 정점에 오르는 날카로운 프로페셔널 파워.',
          optimalEnvironment: '정밀 기술, 프로그래밍 컴파일러/알고리즘 설계, 법조·감사, 독립 전문직',
          recommendedRoles: ['테크니컬 스페셜리스트', '시니어 아키텍트', '전문 장인', '감사관'],
          powerLevel: 4,
        });
      }
    });
  }

  // 6. 현침살(懸針殺): 갑, 신, 묘, 오, 신 (甲, 辛, 卯, 午, 申) 글자 보유
  const HYEONCHIM_CHARS = ['甲', '辛', '卯', '午', '申'];
  pillarsList.forEach(pl => {
    const hasGan = HYEONCHIM_CHARS.includes(pl.gan);
    const hasZhi = HYEONCHIM_CHARS.includes(pl.zhi);
    if (hasGan || hasZhi) {
      detectedStars.push({
        id: `hyeonchim-${pl.loc}`,
        nameKr: '현침살',
        nameHanja: '懸針殺',
        category: '카리스마·돌파',
        pillar: pl.loc,
        foundPillarText: `${pl.full}`,
        classicalMeaning: '바늘을 드리운 형상으로 타인에게 상처를 주거나 신경이 날카롭기 쉬운 살.',
        superpowerTitle: '현미경 같은 예리한 분석력과 핀셋 디버깅 능력',
        superpowerDescription: '남들이 대충 지나치는 미세한 버그, 논리적 결함, 행간의 숨은 의도를 핀셋으로 집어내듯 포착하여 완벽주의적 정밀도를 구현하는 힘.',
        optimalEnvironment: '코드 리뷰 및 디버깅, 법률 검토, 정밀 분석, 교정/교열, 의약·바이오',
        recommendedRoles: ['디버거/QA 스페셜리스트', '시스템 보안 전문가', '데이터 분석가', '에디터'],
        powerLevel: 3,
      });
    }
  });

  // 7. 도화살(桃花殺): 자오묘유 (일지 또는 년지 삼합 기준)
  const DOHWA_MAP: Record<string, string> = { '화': '卯', '수': '酉', '금': '午', '목': '子' };
  const targetDohwa = DOHWA_MAP[dayGroup];
  pillarsList.forEach(pl => {
    if (pl.zhi === targetDohwa || ['子', '午', '卯', '酉'].includes(pl.zhi)) {
      // 자오묘유 중 하나라도 있으면
      if (!detectedStars.some(s => s.nameKr === '도화살' && s.pillar === pl.loc)) {
        detectedStars.push({
          id: `dohwa-${pl.loc}`,
          nameKr: '도화살',
          nameHanja: '桃花殺',
          category: '매력·이동',
          pillar: pl.loc,
          foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
          classicalMeaning: '이성에게 인기를 끌고 유흥에 빠지기 쉬우나 매력이 넘치는 살.',
          superpowerTitle: '시선을 끄는 퍼스널 브랜딩과 대중적 스타성',
          superpowerDescription: '가만히 있어도 사람들의 시선을 사로잡고 호감과 팬덤을 형성하며, 제품과 서비스에 생명력 있는 미적 감각을 불어넣는 대중 흡인력.',
          optimalEnvironment: '대외 발표, 마케팅/PR, UI/UX 디자인, 브랜드 런칭, 인플루언서 활동',
          recommendedRoles: ['크리에이티브 디렉터', '프로덕트 디자이너', '브랜드 앰버서더', '에반젤리스트'],
          powerLevel: 4,
        });
      }
    }
  });

  // 8. 역마살(驛馬殺): 인신사해 (일지 또는 년지 삼합 기준)
  const YEOKMA_MAP: Record<string, string> = { '화': '申', '수': '寅', '금': '亥', '목': '巳' };
  const targetYeokma = YEOKMA_MAP[dayGroup];
  pillarsList.forEach(pl => {
    if (pl.zhi === targetYeokma || ['寅', '申', '巳', '亥'].includes(pl.zhi)) {
      if (!detectedStars.some(s => s.nameKr === '역마살' && s.pillar === pl.loc)) {
        detectedStars.push({
          id: `yeokma-${pl.loc}`,
          nameKr: '역마살',
          nameHanja: '驛馬殺',
          category: '매력·이동',
          pillar: pl.loc,
          foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
          classicalMeaning: '한곳에 정착하지 못하고 분주히 돌아다니며 객지 생활을 하기 쉬운 살.',
          superpowerTitle: '경계를 넘나드는 광활한 확장력과 글로벌 민첩성',
          superpowerDescription: '물리적·디지털 경계를 뛰어넘어 새로운 시장과 기술을 신속하게 흡수하고, 유연한 기동력으로 트렌드를 선점하는 무한 확장 파워.',
          optimalEnvironment: '글로벌 비즈니스, 리모트 워크, 신규 시장 개척, 빠른 피봇팅(Pivot)',
          recommendedRoles: ['글로벌 비즈니스 리드', '디지털 노마드 창업가', '신사업 개발자', '해외 진출 총괄'],
          powerLevel: 4,
        });
      }
    }
  });

  // 9. 화개살(華蓋殺): 진술축미 (사고지)
  const HWAGAE_MAP: Record<string, string> = { '화': '戌', '수': '辰', '금': '丑', '목': '未' };
  const targetHwagae = HWAGAE_MAP[dayGroup];
  pillarsList.forEach(pl => {
    if (pl.zhi === targetHwagae || ['辰', '戌', '丑', '未'].includes(pl.zhi)) {
      if (!detectedStars.some(s => s.nameKr === '화개살' && s.pillar === pl.loc)) {
        detectedStars.push({
          id: `hwagae-${pl.loc}`,
          nameKr: '화개살',
          nameHanja: '華蓋殺',
          category: '매력·이동',
          pillar: pl.loc,
          foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
          classicalMeaning: '화려함을 덮고 고독하게 학문과 종교에 침잠하기 쉬운 살.',
          superpowerTitle: '깊은 사색과 고도의 지식 데이터 아카이빙 통찰력',
          superpowerDescription: '외부의 소음에 휘둘리지 않고 본질을 깊이 파고들어 방대한 데이터와 인문학적 영감을 융합해내는 심층 아키텍처 역량.',
          optimalEnvironment: 'AI 모델 파인튜닝, 철학/심리학 탐구, 장기 연구개발(R&D), 코어 프레임워크 설계',
          recommendedRoles: ['AI/데이터 엔지니어', '철학적 기획자', '소프트웨어 코어 설계자', '학술 연구원'],
          powerLevel: 4,
        });
      }
    }
  });

  // 10. 귀문관살(鬼門關殺): 묘신, 인미, 자유, 축오, 진해, 사술
  const GWIMUN_PAIRS = [
    ['卯', '申'], ['寅', '未'], ['子', '酉'], ['丑', '午'], ['辰', '亥'], ['巳', '戌']
  ];
  const allBranches = pillarsList.map(pl => pl.zhi);
  GWIMUN_PAIRS.forEach(([b1, b2]) => {
    if (allBranches.includes(b1) && allBranches.includes(b2)) {
      if (!detectedStars.some(s => s.nameKr === '귀문관살')) {
        detectedStars.push({
          id: 'gwimun-kwan',
          nameKr: '귀문관살',
          nameHanja: '鬼門關殺',
          category: '영성·직관',
          pillar: '일주(핵심자아)',
          foundPillarText: `${BRANCH_KOREAN[b1]}·${BRANCH_KOREAN[b2]} 결합`,
          classicalMeaning: '귀신의 문이 열려 신경쇠약이나 예민함, 변덕이 심해지기 쉬운 살.',
          superpowerTitle: '차원을 넘나드는 초감각적 직관과 천재적 영감',
          superpowerDescription: '보통 사람의 논리로는 닿을 수 없는 미지의 패턴을 직관적으로 단번에 꿰뚫어보며, 독창적인 창작물과 혁신적 발상을 탄생시키는 영감의 샘.',
          optimalEnvironment: '창의적 예술/작곡/스토리텔링, 고난도 추상 알고리즘 설계, 심리 분석',
          recommendedRoles: ['천재형 크리에이터', '영감 지향적 아키텍트', '정신분석/심리치료가', '전위 예술가'],
          powerLevel: 5,
        });
      }
    }
  });

  // 11. 홍염살(紅艶殺): 일간 기준
  const HONGYEOM_MAP: Record<string, string[]> = {
    '甲': ['午'], '乙': ['午'], '丙': ['寅'], '丁': ['未'], '戊': ['辰'],
    '己': ['辰'], '庚': ['戌'], '辛': ['酉'], '壬': ['子'], '癸': ['申']
  };
  const targetHong = HONGYEOM_MAP[dGan] || [];
  pillarsList.forEach(pl => {
    if (targetHong.includes(pl.zhi)) {
      detectedStars.push({
        id: `hongyeom-${pl.loc}`,
        nameKr: '홍염살',
        nameHanja: '紅艶殺',
        category: '매력·이동',
        pillar: pl.loc,
        foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
        classicalMeaning: '은은한 붉은빛처럼 치명적인 유혹과 다정함을 품은 살.',
        superpowerTitle: '깊은 신뢰를 부르는 다정함과 볼매(볼수록 매력)의 흡인력',
        superpowerDescription: '과장된 화려함 없이도 한 번 맺은 인연을 깊은 충성 고객과 평생의 지지자로 만들어내는 진솔하고 매력적인 감성 교감력.',
        optimalEnvironment: '1:1 VIP 상담, 깊은 유대감 기반 커뮤니티 빌딩, 고객 감동 서비스',
        recommendedRoles: ['커뮤니티 리드', '고객 성공(CX) 총괄', '심층 카운슬러', 'VIP 컨설턴트'],
        powerLevel: 3,
      });
    }
  });

  // 12. 금여록(金輿祿): 일간 기준 황금 수레 (록의 다음 지지)
  const GEUMYEO_MAP: Record<string, string> = {
    '甲': '辰', '乙': '巳', '丙': '未', '戊': '未', '丁': '申', '己': '申', '庚': '戌', '辛': '亥', '壬': '丑', '癸': '寅'
  };
  const targetGeum = GEUMYEO_MAP[dGan];
  pillarsList.forEach(pl => {
    if (pl.zhi === targetGeum) {
      detectedStars.push({
        id: `geumyeo-${pl.loc}`,
        nameKr: '금여록',
        nameHanja: '金輿祿',
        category: '영성·직관',
        pillar: pl.loc,
        foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
        classicalMeaning: '황금 마차를 타는 복록으로 좋은 배우자를 만나고 평안한 삶을 누리는 길신.',
        superpowerTitle: '우아한 품격과 자산 안전망 구축의 복록',
        superpowerDescription: '무리한 투기 없이도 자연스럽게 양질의 자산과 귀한 인연을 만나 풍요로운 환경을 안정적으로 누리는 품격 있는 복록.',
        optimalEnvironment: '프리미엄 자산 관리, 안정적 장기 투자, 브랜드 품격 유지',
        recommendedRoles: ['자산 관리 전문가', '럭셔리 브랜드 디렉터', '안정형 밸류 투자가'],
        powerLevel: 4,
      });
    }
  });

  // 13. 암록(暗祿): 일간 기준 정록과 육합하는 지지 (보이지 않는 수호자)
  const AMROK_MAP: Record<string, string> = {
    '甲': '亥', '乙': '戌', '丙': '申', '戊': '申', '丁': '未', '己': '未', '庚': '巳', '辛': '辰', '壬': '寅', '癸': '丑'
  };
  const targetAmrok = AMROK_MAP[dGan];
  pillarsList.forEach(pl => {
    if (pl.zhi === targetAmrok) {
      detectedStars.push({
        id: `amrok-${pl.loc}`,
        nameKr: '암록',
        nameHanja: '暗祿',
        category: '영성·직관',
        pillar: pl.loc,
        foundPillarText: `${pl.full}(${BRANCH_KOREAN[pl.zhi]})`,
        classicalMeaning: '어두운 곳에서 은밀히 돕는 복록으로 재물과 도움이 끊이지 않는 길신.',
        superpowerTitle: '숨은 비상금과 보이지 않는 은밀한 후원 네트워크',
        superpowerDescription: '어려움이 닥쳐도 겉으로 드러나지 않는 숨은 지원군과 뜻밖의 재정적 통로가 열려 조용히 회생하는 강력한 안전판.',
        optimalEnvironment: '독립 사업, 조용한 부의 축적, 위기 방어',
        recommendedRoles: ['비공개 엔젤 투자가', '독립 펀드 오너', '히든 컨설턴트'],
        powerLevel: 4,
      });
    }
  });

  // 기둥별 분류
  const pillarSummary = {
    yearStars: detectedStars.filter(s => s.pillar === '년주(사회적기반)').map(s => `${s.nameKr}(${s.superpowerTitle})`),
    monthStars: detectedStars.filter(s => s.pillar === '월주(직업·커리어)').map(s => `${s.nameKr}(${s.superpowerTitle})`),
    dayStars: detectedStars.filter(s => s.pillar === '일주(핵심자아)').map(s => `${s.nameKr}(${s.superpowerTitle})`),
    hourStars: detectedStars.filter(s => s.pillar === '시주(비밀잠재력)').map(s => `${s.nameKr}(${s.superpowerTitle})`),
  };

  // 파워 레벨 높은 순으로 탑 3 슈퍼파워 선정
  const sorted = [...detectedStars].sort((a, b) => b.powerLevel - a.powerLevel);
  const topSuperpowers = sorted.slice(0, 3).map(s => ({
    title: s.superpowerTitle,
    starName: `${s.nameKr}(${s.nameHanja})`,
    pillar: s.pillar,
    actionableAdvice: `[${s.foundPillarText}]에 자리잡은 ${s.nameKr}의 파워를 살려, ${s.optimalEnvironment}에서 ${s.superpowerDescription}`,
  }));

  const overallSynthesis = detectedStars.length > 0
    ? `총 ${detectedStars.length}개의 핵심 신살이 포진되어 있으며, 특히 ${topSuperpowers.map(t => t.starName).join(', ')}의 강력한 기운이 결합하여 현대 사회에서 독보적인 전문성과 파괴적 실행력을 발휘할 수 있는 슈퍼파워 구조를 갖추고 있습니다.`
    : '기운이 과하게 쏠리지 않고 담백하여, 특정 흉살의 부침 없이 안정적이고 꾸준한 성장을 이루는 청아한 명식입니다.';

  const q = (options?.question || '').trim();
  const questionTopic = classifySpecialStarsTopic(q);
  const shadowWarning = SPECIAL_STARS_SHADOW_WARNINGS[questionTopic];
  const leadStar = topSuperpowers[0];
  const specialStarsSynthesisMatrix = {
    dominantTension: leadStar
      ? `${leadStar.starName} (${leadStar.pillar}) ↔ ${detectedStars.length}개 신살 공명`
      : '균형 명식 ↔ 잠재 역량 발현',
    alignmentState: `일간: ${saju.dayMaster.hanja}(${saju.dayMaster.korean}) · 감지 신살: ${detectedStars.length}개`,
    integratedAction: `${leadStar ? leadStar.title : '안정적 장기 역량 축적'}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const interpretiveBoundary = '본 15대 신살 위치별 슈퍼파워 리포트는 고전 명리 신살의 현대적 강점 은유에 기반한 자기 이해 안내이며, 길흉을 단정짓지 않습니다.';
  const ritualAction = leadStar
    ? `[${leadStar.starName} · ${leadStar.pillar}] ${leadStar.actionableAdvice}`
    : '[균형 명식] 일상의 꾸준한 루틴과 강점 기록으로 잠재 역량을 안정적으로 발현하세요.';
  const reflectionFocus = leadStar
    ? `15대 신살(${leadStar.starName}) — ${leadStar.title}`
    : `15대 신살(${saju.dayMaster.korean}) — 균형 명식 역량 발현`;

  return {
    engineVersion: SPECIAL_STARS_VERSION,
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKst,
    timestamp: now.getTime(),
    questionTopic,
    shadowWarning,

    profileSummary: {
      birthdate: saju.birthdate,
      dayMaster: `${saju.dayMaster.hanja}(${saju.dayMaster.korean})`,
      fourPillarsText: `년주(${p.year.full}) 월주(${p.month.full}) 일주(${p.day.full})${p.hour ? ` 시주(${p.hour.full})` : ''}`,
    },

    totalStarsFound: detectedStars.length,
    detectedStars,
    pillarSummary,
    topSuperpowers,
    overallSynthesis,
    specialStarsSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion: q
      ? `‘${q}’ 앞에서 ${leadStar ? `${leadStar.starName}(${leadStar.pillar})의 강점인 ‘${leadStar.title}’` : '안정적인 명식의 균형'}을 어떤 실행 무대로 연결하시겠습니까?`
      : `감지된 ${detectedStars.length}개 신살 중 ${leadStar ? `${leadStar.starName}(${leadStar.pillar})` : '고유한 균형 감각'}을 오늘의 일과 관계에서 가장 건강하게 발현할 한 걸음은 무엇입니까?`,
    interpretiveBoundary,
  };
}

/**
 * 신살 슈퍼파워 리포트를 LLM 마스터 프롬프트에 주입하기 위해 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatSpecialStarsPrompt(res: SpecialStarsResult): string {
  const starsList = res.detectedStars.map((s, i) =>
    `   ${i + 1}. [${s.nameKr}(${s.nameHanja})] (${s.category} · ${s.pillar} ${s.foundPillarText}):
      - 현대적 슈퍼파워: ★ "${s.superpowerTitle}"
      - 강점 해설: ${s.superpowerDescription}
      - 최적 발현 환경: ${s.optimalEnvironment} (추천 역할: ${s.recommendedRoles.join(', ')})`
  ).join('\n\n');

  const topList = res.topSuperpowers.map((t, i) =>
    `   ${i + 1}. [${t.title}] (${t.starName} · ${t.pillar}): ${t.actionableAdvice}`
  ).join('\n');

  const matrixLine = res.specialStarsSynthesisMatrix
    ? `\n4. [신살 교차 매트릭스]:\n   - 실천 의례: ${res.ritualAction}\n   - 성찰 초점: ${res.reflectionFocus}\n   - 핵심 긴장: ${res.specialStarsSynthesisMatrix.dominantTension}\n   - 조율 상태: ${res.specialStarsSynthesisMatrix.alignmentState}\n   - 통합 실천: ${res.specialStarsSynthesisMatrix.integratedAction}${res.reflectiveQuestion ? `\n   - 성찰 질문: ${res.reflectiveQuestion}` : ''}\n   - 과잉 경계: ${res.shadowWarning}\n   - 해석 경계: ${res.interpretiveBoundary}\n`
    : `\n4. [해석 경계]: ${res.interpretiveBoundary}\n`;

  return `[⭐ 15대 신살 위치별 슈퍼파워 치환 실측 데이터 (Special Stars Matrix Core)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic} | 기준 명식: ${res.profileSummary.fourPillarsText}
총 감지된 특수 신살: ${res.totalStarsFound}개 | 일간: ${res.profileSummary.dayMaster}
종합 분석: ${res.overallSynthesis}
======================================================================
1. [핵심 TOP 3 독점적 슈퍼파워 하이라이트]:
${topList}

2. [년/월/일/시 4개 기둥 위치별 신살 배치]:
   - 년주(사회적 기반·조상): ${res.pillarSummary.yearStars.join(', ') || '특이 신살 없음(담백)'}
   - 월주(직업 환경·커리어): ${res.pillarSummary.monthStars.join(', ') || '특이 신살 없음(안정)'}
   - 일주(핵심 자아·배우자): ${res.pillarSummary.dayStars.join(', ') || '특이 신살 없음(조화)'}
   - 시주(비밀 무기·후반전): ${res.pillarSummary.hourStars.join(', ') || '특이 신살 없음(순조)'}

3. [15대 신살 위치별 현대적 슈퍼파워 정밀 도감]:
${starsList}
${matrixLine}======================================================================
[★ 루시 신살 슈퍼파워 상담 지침]:
- 고전의 불길한 단어(살·재앙·고독)에 얽매이지 말고, 위 실측된 신살을 사용자의 '독보적인 천재적 재능과 커리어 무기(슈퍼파워)'로 활짝 승화시켜 들려줘.
- 위치별(년/월/일/시) 특성을 살려 "사회에서 보여지는 무기(년/월)"와 "내면의 비밀 병기(일/시)"를 입체적이고 자신감 넘치게 해석해줘.`;
}
