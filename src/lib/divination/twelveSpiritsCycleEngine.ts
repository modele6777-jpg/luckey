/**
 * =========================================================================
 * LUCKEY 사주 12신살(겁·재·천·지·년·월·망·장·반·역·육·화) 완전 순환 엔진
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주명리학의 삼합국(三合局) 궤도에 기반하여 지지 12글자에 부여되는
 * 12신살(Twelve Spirits Cycle)을 년지(사회적/전통)와 일지(내면/현대) 기준으로
 * 완전 연산합니다.
 * 
 * 오늘 하루의 일진(日辰)과 이번 달 월건(月建), 올해 세운(歲運)이
 * 12신살 중 어느 궤도(장성살의 주도권, 반안살의 합격/안정, 역마살의 이동,
 * 화개살의 예술 몰입, 망신살의 주목 등)에 진입했는지 0ms로 도출하여
 * 하루 전략과 페르소나 지침을 제공합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  BRANCH_KOREAN,
  type SajuAnalysisResult,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
} from '../sajuAnalysis';

export const TWELVE_SPIRITS_ENGINE_VERSION = 'LUCKEY-SPIRIT-v2.1.0';

function formatSpiritsKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type SpiritName =
  | '겁살' | '재살' | '천살' | '지살'
  | '년살' | '월살' | '망신살' | '장성살'
  | '반안살' | '역마살' | '육해살' | '화개살';

export interface SpiritMetadata {
  name: SpiritName;
  hanja: string;
  alias: string;
  category: '추진·돌파' | '보호·성찰' | '매력·확장' | '지위·안정' | '이동·변화' | '철학·창작';
  nature: '길신 성향' | '흉살 승화' | '양면성';
  superpower: string;
  trapToAvoid: string;
  dailyPersona: string;
  actionGuidance: string;
}

export const TWELVE_SPIRITS_METADATA: Record<SpiritName, SpiritMetadata> = {
  '겁살': {
    name: '겁살',
    hanja: '劫煞',
    alias: '적극적 탈환의 별',
    category: '추진·돌파',
    nature: '흉살 승화',
    superpower: '불가능해 보이던 계약 성사, 막힌 장벽 돌파, 경쟁자 압도',
    trapToAvoid: '무리한 투기나 타인에 대한 강압적 태도',
    dailyPersona: '승부사 / 위기 해결사',
    actionGuidance: '질질 끌던 난제를 오늘 단칼에 해결하는 데 에너지를 집중하세요.'
  },
  '재살': {
    name: '재살',
    hanja: '災煞',
    alias: '수옥살(囚獄煞)·지략의 별',
    category: '보호·성찰',
    nature: '흉살 승화',
    superpower: '위기 속 천재적 묘수 발견, 치밀한 두뇌 싸움 승리, 시스템 방어',
    trapToAvoid: '물리적 충돌, 관재구설, 성급한 외출',
    dailyPersona: '전략 참모 / 숨은 설계자',
    actionGuidance: '밖으로 나서지 말고 연구실이나 서재에서 기획서와 코드를 다듬으세요.'
  },
  '천살': {
    name: '천살',
    hanja: '天煞',
    alias: '천우신조(天佑神助)의 별',
    category: '보호·성찰',
    nature: '양면성',
    superpower: '불가항력의 흐름 수용, 영적 직관, 기도를 통한 돌파구 발견',
    trapToAvoid: '자연의 섭리에 억지로 맞서며 분노하는 태도',
    dailyPersona: '구도자 / 큰 그림을 보는 현자',
    actionGuidance: '통제할 수 없는 것은 하늘에 맡기고, 내가 할 수 있는 작은 일에 충실하세요.'
  },
  '지살': {
    name: '지살',
    hanja: '地煞',
    alias: '새로운 출발의 별',
    category: '이동·변화',
    nature: '길신 성향',
    superpower: '자발적 창업, 신규 프로젝트 런칭, 긍정적인 이사/출발',
    trapToAvoid: '뿌리가 내리기 전에 또 다른 곳으로 옮겨 타려는 조급증',
    dailyPersona: '스타터(Starter) / 개척자',
    actionGuidance: '새로운 명함, 새 깃허브 레포, 새로운 루틴을 오늘 시작하기에 최적입니다.'
  },
  '년살': {
    name: '년살',
    hanja: '年煞',
    alias: '도화살(桃花煞)·시선 집중의 별',
    category: '매력·확장',
    nature: '길신 성향',
    superpower: '압도적인 대중 호감도, 미적 센스 폭발, 팬덤 및 고객 유치',
    trapToAvoid: '감정적 스캔들, 과소비, 허영심',
    dailyPersona: '매력적인 인플루언서 / 프레젠터',
    actionGuidance: '나를 드러내고 발표하며, SNS나 마케팅 콘텐츠를 과감히 업로드하세요.'
  },
  '월살': {
    name: '월살',
    hanja: '月煞',
    alias: '고초살(枯焦煞)·어둠 속 달빛',
    category: '보호·성찰',
    nature: '흉살 승화',
    superpower: '뜻밖의 상속·증여·지원금 수령, 어둠 속에서 빛나는 조력자 등장',
    trapToAvoid: '우울감, 비관적 망상, 체력 고갈',
    dailyPersona: '달빛 아래 전략가 / 내실 수호자',
    actionGuidance: '보이지 않는 곳에서 자금을 정돈하고 비상 플랜을 수립하세요.'
  },
  '망신살': {
    name: '망신살',
    hanja: '亡身煞',
    alias: '파격적 노출과 스타성의 별',
    category: '매력·확장',
    nature: '흉살 승화',
    superpower: '비밀의 솔직한 공개로 폭발적인 진정성 획득, 파격적 화제 몰이',
    trapToAvoid: '술자리 실수, 말실수로 인한 구설수',
    dailyPersona: '솔직담백한 혁신가 / 파격 리더',
    actionGuidance: '감추려 하지 말고 솔직하고 투명하게 오픈소스 정신으로 대화하세요.'
  },
  '장성살': {
    name: '장성살',
    hanja: '將星煞',
    alias: '총사령관·권력의 정점',
    category: '지위·안정',
    nature: '길신 성향',
    superpower: '카리스마적 리더십, 조직 장악력, 프로젝트 완벽 통제',
    trapToAvoid: '독선, 타인의 의견 묵살, 오만',
    dailyPersona: '대장군 / 총괄 디렉터',
    actionGuidance: '책임감을 갖고 중심을 잡으며 중요한 결재와 의사결정을 주도하세요.'
  },
  '반안살': {
    name: '반안살',
    hanja: '攀鞍煞',
    alias: '금안장(金鞍裝)·합격과 출세의 별',
    category: '지위·안정',
    nature: '길신 성향',
    superpower: '자격증 취득, 시험 합격, 승진, 재물 축적, 안락한 지위 확보',
    trapToAvoid: '현실 안주, 게으름, 도전 의식 상실',
    dailyPersona: '안정된 성공자 / 자산가',
    actionGuidance: '계약서 서명, 자산 투자, 편안한 휴식과 보상을 누리기에 가장 길합니다.'
  },
  '역마살': {
    name: '역마살',
    hanja: '驛馬煞',
    alias: '글로벌 질주·초고속 이동의 별',
    category: '이동·변화',
    nature: '길신 성향',
    superpower: '원거리 출장 성과, 해외 비즈니스 개척, 빠른 피드백 반영',
    trapToAvoid: '집중력 분산, 교통 위반, 피로 누적',
    dailyPersona: '글로벌 러너 / 기민한 탐험가',
    actionGuidance: '빠르게 움직이고, 물리적 이동이나 온라인 통신망을 적극 확장하세요.'
  },
  '육해살': {
    name: '육해살',
    hanja: '六害煞',
    alias: '문지기(Gatekeeper)·영적 예지력',
    category: '보호·성찰',
    nature: '흉살 승화',
    superpower: '육감과 예지력 극대화, 리스크 사전 감지, 정밀 분석력',
    trapToAvoid: '친척/동료와의 불필요한 감정 충돌, 만성 피로',
    dailyPersona: '문지기 / 직관적 분석가',
    actionGuidance: '데이터와 직관을 교차 검증하며 위험 요소를 사전에 차단하세요.'
  },
  '화개살': {
    name: '화개살',
    hanja: '華蓋煞',
    alias: '황제의 비단 덮개·예술과 철학의 별',
    category: '철학·창작',
    nature: '길신 성향',
    superpower: '압도적 예술적 영감, 학문 연구 완성, 명예 회복, 솔로 딥워크',
    trapToAvoid: '세상과의 단절, 고독감, 과거에 대한 집착',
    dailyPersona: '장인 / 철학자 / 크리에이터',
    actionGuidance: '혼자만의 몰입 공간에서 걸작을 창작하고 지식을 체계화하세요.'
  }
};

// 12신살 정통 순환 순서 (겁재천지년월망장반역육화)
const SPIRIT_ORDER: SpiritName[] = [
  '겁살', '재살', '천살', '지살',
  '년살', '월살', '망신살', '장성살',
  '반안살', '역마살', '육해살', '화개살'
];

// 지지 12자
const BRANCHES_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 삼합국별 겁살 시작 지지 매핑
// 화국(寅午戌) -> 亥 시작
// 수국(申子辰) -> 巳 시작
// 금국(巳酉丑) -> 寅 시작
// 목국(亥卯未) -> 申 시작
function getGeobSalBranch(anchorBranch: string): string {
  if (['寅', '午', '戌'].includes(anchorBranch)) return '亥';
  if (['申', '子', '辰'].includes(anchorBranch)) return '巳';
  if (['巳', '酉', '丑'].includes(anchorBranch)) return '寅';
  return '申'; // 亥, 卯, 未
}

/**
 * 기준 지지로부터 12개 지지에 대한 12신살 맵 생성
 */
function buildTwelveSpiritsMap(anchorBranch: string): Record<string, SpiritName> {
  const geobBranch = getGeobSalBranch(anchorBranch);
  const geobIdx = BRANCHES_ORDER.indexOf(geobBranch);
  
  const map: Record<string, SpiritName> = {};
  for (let i = 0; i < 12; i++) {
    const branch = BRANCHES_ORDER[(geobIdx + i) % 12];
    map[branch] = SPIRIT_ORDER[i];
  }
  return map;
}

export interface TwelveSpiritsResult {
  engineVersion: string;
  targetDateIso: string;
  calculatedAtKst: string;
  anchorYearBranch: string;
  anchorDayBranch: string;
  
  // 사주 원국 각 기둥(년/월/일/시) 12신살 매핑 (년지 기준 & 일지 기준)
  natalPillarsSpirits: {
    year: { branch: string; yearBase: SpiritMetadata; dayBase: SpiritMetadata };
    month: { branch: string; yearBase: SpiritMetadata; dayBase: SpiritMetadata };
    day: { branch: string; yearBase: SpiritMetadata; dayBase: SpiritMetadata };
    hour?: { branch: string; yearBase: SpiritMetadata; dayBase: SpiritMetadata };
  };

  // 오늘의 일진(Day Zhi) 12신살
  todayDaySpirit: {
    branch: string;
    branchKo: string;
    yearBase: SpiritMetadata;
    dayBase: SpiritMetadata;
  };

  // 올해 세운(Year Zhi) 12신살
  annualSeunSpirit: {
    branch: string;
    branchKo: string;
    yearBase: SpiritMetadata;
    dayBase: SpiritMetadata;
  };

  // 오늘의 행동 전략 및 페르소나 리포트
  todayStrategy: {
    recommendedPersona: string;
    superpowerToUse: string;
    trapToAvoid: string;
    coreAdvice: string;
  };

  summary: string;
  secondarySpirit?: SpiritMetadata;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  twelveSpiritsSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

/**
 * 율리우스 적일 기반 KST 당일 지지 산출
 */
function getTodayZhi(date: Date): { dayZhi: string; yearZhi: string } {
  const kstMs = date.getTime() + 9 * 3600 * 1000;
  const kst = new Date(kstMs);
  const y = kst.getUTCFullYear();
  const m = kst.getUTCMonth() + 1;
  const d = kst.getUTCDate();
  
  const yi = (y - 4) % 60;
  const yearZhi = EARTHLY_BRANCHES[(yi % 12 + 12) % 12];

  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  const jd = d + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  const di = (jd + 49) % 60;
  const dayZhi = EARTHLY_BRANCHES[(di % 12 + 12) % 12];

  return { dayZhi, yearZhi };
}

/**
 * 12신살 완전 순환 엔진 메인 함수
 */
export function calculateTwelveSpiritsCycle(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): TwelveSpiritsResult {
  const now = params?.targetDate || new Date();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);
  const { dayZhi: todayZhi, yearZhi: seunZhi } = getTodayZhi(now);

  const yearAnchor = saju.pillars.year.zhi;
  const dayAnchor = saju.pillars.day.zhi;

  const yearBaseMap = buildTwelveSpiritsMap(yearAnchor);
  const dayBaseMap = buildTwelveSpiritsMap(dayAnchor);

  const makeSpiritPair = (branch: string) => {
    const ySpiritName = yearBaseMap[branch] || '장성살';
    const dSpiritName = dayBaseMap[branch] || '장성살';
    return {
      branch,
      yearBase: TWELVE_SPIRITS_METADATA[ySpiritName],
      dayBase: TWELVE_SPIRITS_METADATA[dSpiritName]
    };
  };

  const natalPillarsSpirits = {
    year: makeSpiritPair(saju.pillars.year.zhi),
    month: makeSpiritPair(saju.pillars.month.zhi),
    day: makeSpiritPair(saju.pillars.day.zhi),
    hour: saju.pillars.hour ? makeSpiritPair(saju.pillars.hour.zhi) : undefined
  };

  const todayDaySpirit = {
    branch: todayZhi,
    branchKo: BRANCH_KOREAN[todayZhi] || todayZhi,
    yearBase: TWELVE_SPIRITS_METADATA[yearBaseMap[todayZhi] || '장성살'],
    dayBase: TWELVE_SPIRITS_METADATA[dayBaseMap[todayZhi] || '장성살']
  };

  const annualSeunSpirit = {
    branch: seunZhi,
    branchKo: BRANCH_KOREAN[seunZhi] || seunZhi,
    yearBase: TWELVE_SPIRITS_METADATA[yearBaseMap[seunZhi] || '장성살'],
    dayBase: TWELVE_SPIRITS_METADATA[dayBaseMap[seunZhi] || '장성살']
  };

  // 오늘의 핵심 페르소나는 일지 기준(내면 심리)과 년지 기준(사회적 무대)을 종합
  const primarySpirit = todayDaySpirit.dayBase;
  const secondarySpirit = todayDaySpirit.yearBase;

  const todayStrategy = {
    recommendedPersona: `${primarySpirit.dailyPersona} (사회적: ${secondarySpirit.dailyPersona})`,
    superpowerToUse: primarySpirit.superpower,
    trapToAvoid: primarySpirit.trapToAvoid,
    coreAdvice: primarySpirit.actionGuidance
  };

  const summary = `[12신살 궤도] 오늘 일진(${todayDaySpirit.branchKo})은 내면 [${primarySpirit.name}(${primarySpirit.hanja})] · 사회적 [${secondarySpirit.name}(${secondarySpirit.hanja})] 국면입니다. 추천 페르소나: ${primarySpirit.dailyPersona}. 핵심 무기: ${primarySpirit.superpower}.`;

  const calculatedAtKst = formatSpiritsKstTimestamp(now);
  const q = (params?.question || '').trim();
  const reflectiveQuestion = q
    ? `‘${q}’ 앞에서 오늘 내면의 ${primarySpirit.name}(${primarySpirit.hanja})과 대외적 ${secondarySpirit.name}(${secondarySpirit.hanja})의 기운 중 어느 쪽 역할에 더 무게를 두고 움직이겠습니까?`
    : `오늘 ${primarySpirit.name}(${primarySpirit.hanja})이 열어 주는 힘과 ${secondarySpirit.name}(${secondarySpirit.hanja})이 비추는 무대 사이에서 가장 먼저 선택할 행동은 무엇입니까?`;
  const interpretiveBoundary =
    '해석 경계: 12신살은 삼합 궤도와 일진·세운의 지지 순환을 통해 오늘의 태도와 행동 역할을 비추는 명리적·상징적 나침반이며, 개인의 자유 의지나 구체적 성패를 단정하지 않습니다.';
  const twelveSpiritsSynthesisMatrix = {
    dominantTension: `${primarySpirit.name}(${primarySpirit.hanja}) ↔ ${secondarySpirit.name}(${secondarySpirit.hanja})`,
    alignmentState: `${primarySpirit.nature} · ${todayDaySpirit.branchKo} 일진`,
    integratedAction: `${primarySpirit.actionGuidance}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: TWELVE_SPIRITS_ENGINE_VERSION,
    targetDateIso: now.toISOString(),
    calculatedAtKst,
    anchorYearBranch: yearAnchor,
    anchorDayBranch: dayAnchor,
    natalPillarsSpirits,
    todayDaySpirit,
    annualSeunSpirit,
    todayStrategy,
    summary,
    secondarySpirit,
    reflectiveQuestion,
    interpretiveBoundary,
    twelveSpiritsSynthesisMatrix,
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatTwelveSpiritsPrompt(res: TwelveSpiritsResult): string {
  const dSpirit = res.todayDaySpirit.dayBase;
  const ySpirit = res.todayDaySpirit.yearBase;
  const matrixLine = res.twelveSpiritsSynthesisMatrix
    ? `\n- 12신살 교차 매트릭스: 핵심 긴장(${res.twelveSpiritsSynthesisMatrix.dominantTension}) · 조율 상태(${res.twelveSpiritsSynthesisMatrix.alignmentState}) · 통합 실천(${res.twelveSpiritsSynthesisMatrix.integratedAction})`
    : '';

  return `[사주 12신살(겁재천지년월망장반역육화) 완전 순환 궤도 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]
- 오늘 일진(${res.todayDaySpirit.branchKo}) 배속:
  • 내면/심리 궤도(일지 기준): [${dSpirit.name}(${dSpirit.hanja})] - ${dSpirit.alias} (${dSpirit.nature})
  • 대외/사회 궤도(년지 기준): [${ySpirit.name}(${ySpirit.hanja})] - ${ySpirit.alias} (${ySpirit.nature})
- 오늘 추천 페르소나: ${res.todayStrategy.recommendedPersona}
- 오늘 발휘할 슈퍼파워: ${res.todayStrategy.superpowerToUse}
- 피해야 할 함정: ${res.todayStrategy.trapToAvoid}
- 하루 실천 지침: ${res.todayStrategy.coreAdvice}${matrixLine}
- 성찰 질문: ${res.reflectiveQuestion}
- ${res.interpretiveBoundary}
※ 루시 지침: 12신살은 하루하루 운의 파도 속에서 내가 어떤 역할을 맡아야 가장 자연스럽고 강력한지를 알려주는 행동 나침반입니다. 오늘 사용자가 발휘해야 할 '슈퍼파워'와 조심할 '함정'을 자연스러운 조언으로 녹여내세요.`;
}

