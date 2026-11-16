/**
 * =========================================================================
 * LUCKEY 실시간 삼형·육충·파해 동적 트리거 엔진 (Dynamic Clash Trigger Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 사주 원국에 내재된 잠재 에너지(년/월/일/시 지지)가 '오늘의 일진' 또는 '올해의 세운'과
 * 조우할 때 발생하는 육충(六沖), 삼형살(三刑煞), 자형(自刑), 육해(六害), 육파(六破), 원진(怨嗔)의
 * 실시간 격발 여부와 에너지 강도(0~100)를 결정론적으로 산출합니다.
 * 
 * 나아가 합(육합, 삼합)과의 상호 보완 작용을 계산하여, 단순한 액운 경고가 아닌
 * "충(沖)의 강력한 파괴 에너지를 창조적 혁신과 행동 결단으로 승화시키는 전략"을 도출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  BRANCH_KOREAN,
  type SajuAnalysisResult,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
} from '../sajuAnalysis';

export const DYNAMIC_CLASH_ENGINE_VERSION = 'LUCKEY-CLASH-v2.1.0';

export type ClashType = 'six_clash' | 'three_penalties' | 'self_penalty' | 'six_harm' | 'six_destruction' | 'wonjin';
export type HarmonyType = 'six_harmony' | 'three_harmony';
export type PillarKey = 'year' | 'month' | 'day' | 'hour';

export interface ClashTriggerItem {
  id: string;
  type: ClashType;
  name: string;
  hanja: string;
  sourcePillar: PillarKey;
  sourceBranch: string;
  triggeringBranch: string;
  triggerOrigin: 'today_day' | 'current_year';
  intensity: number; // 0 ~ 100
  domain: 'mind_emotion' | 'work_career' | 'relationship' | 'health_body' | 'money_wealth';
  manifestation: string; // 현실에서의 발현 양상
  sublimationAction: string; // 에너지 승화 행동 가이드
}

export interface HarmonyTriggerItem {
  id: string;
  type: HarmonyType;
  name: string;
  hanja: string;
  sourcePillar: PillarKey;
  sourceBranch: string;
  triggeringBranch: string;
  triggerOrigin: 'today_day' | 'current_year';
  boostScore: number; // 0 ~ 100
  domain: string;
  manifestation: string;
  utilizationStrategy: string;
}

export interface DynamicClashResult {
  engineVersion: string;
  targetDateIso: string;
  calculatedAtKst: string;
  currentPillars: {
    yearZhi: string;
    monthZhi: string;
    dayZhi: string;
    dayGan: string;
    dayGanZhiKo: string;
  };
  volatilityScore: number; // 내부 호환용 (프롬프트 비노출)
  harmonyScore: number;    // 내부 호환용 (프롬프트 비노출)
  netStatus: 'explosive_change' | 'high_tension' | 'balanced_movement' | 'peaceful_flow';
  activeClashes: ClashTriggerItem[];
  activeHarmonies: HarmonyTriggerItem[];
  primaryAlert: string | null;
  todayActionMatrix: {
    doNow: string;
    avoidNow: string;
    goldenKey: string;
  };
  situationalClashAudit: {
    focusTheme: string;
    clashCue: string;
    tacticalStep: string;
  };
  temporalClashRhythm: {
    kstTimeLabel: string;
    triggerWatchWindow: string;
    seasonalClashTone: string;
    temporalGuidance: string;
  };
  clashSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  reflectiveQuestion: string;
  boundaryNotice: string;
  summary: string;
}

function getTemporalClashRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const triggerWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 충·합 점검창 — 오늘 일진과 원국의 맞부딪힘을 먼저 읽고 동선을 조율하는 시간'
      : hour >= 11 && hour < 17
        ? '정오 전환 실행창 — 충의 추진력을 새로운 시도나 정리 작업으로 승화하기 좋은 시간'
        : hour >= 17 && hour < 22
          ? '황혼 완충창 — 낮 동안 쌓인 긴장과 마찰을 호흡으로 풀고 합 기운을 챙기는 시간'
          : '심야 안정창 — 급한 결단이나 날카로운 연락을 멈추고 내일을 준비하는 시간';

  const seasonalClashTone =
    month >= 3 && month <= 5
      ? '봄 · 발산 돌파절 (묵은 관성을 깨고 새 흐름을 여는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 열기 조율절 (과열된 충돌을 냉정한 구조화로 다스릴 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 정리 결단절 (불필요한 마찰을 정리하고 핵심을 남기는 시기)'
          : '겨울 · 내실 보존절 (무리한 충돌을 피하고 에너지를 비축하는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
    triggerWatchWindow,
    seasonalClashTone,
    temporalGuidance: `${triggerWatchWindow} · ${seasonalClashTone}의 흐름에 맞추어 움직이십시오.`,
  };
}

// 6충 정의 및 해석
const SIX_CLASHES: Record<string, { partner: string; name: string; hanja: string; domain: ClashTriggerItem['domain']; desc: string; advice: string }> = {
  '子': { partner: '午', name: '자오충', hanja: '子午沖', domain: 'mind_emotion', desc: '수화상충. 감정의 급격한 분출, 억압된 아이디어 폭발, 불면 또는 신경 과민', advice: '충동적인 발언을 멈추고 냉정한 문서 작업이나 격렬한 유산소 운동으로 열기 분산' },
  '午': { partner: '子', name: '자오충', hanja: '子午沖', domain: 'mind_emotion', desc: '수화상충. 심장/시각 피로, 즉흥적 결정으로 인한 번복', advice: '주요 결정 전 10분간 심호흡하며 차분하게 팩트 체크' },
  '丑': { partner: '未', name: '축미충', hanja: '丑未沖', domain: 'work_career', desc: '토토상충. 기존 기반의 흔들림, 부동산/거처 고민, 동료 간 완고한 대립', advice: '고집을 내려놓고 중간 타협안을 수용하며 위장 건강 챙기기' },
  '未': { partner: '丑', name: '축미충', hanja: '丑未沖', domain: 'work_career', desc: '토토상충. 일상의 관성 파괴, 기존 규약의 전면 개편 요구', advice: '체계화되지 않았던 업무 프로세스를 완전히 새로 리팩토링' },
  '寅': { partner: '申', name: '인신충', hanja: '寅申沖', domain: 'work_career', desc: '금목상충. 도로상 이동수, 시스템 충돌, 기계/코드 버그, 관절/근육 긴장', advice: '작업물 자동 백업을 확인하고, 급한 이동 시 서두르지 않는 여유 확보' },
  '申': { partner: '寅', name: '인신충', hanja: '寅申沖', domain: 'work_career', desc: '금목상충. 새로운 프로젝트 급발진, 속도전과 정밀도의 충돌', advice: '속도보다 테스트 완결성에 집중하여 재작업 방지' },
  '卯': { partner: '酉', name: '묘유충', hanja: '卯酉沖', domain: 'relationship', desc: '금목상충. 인간관계의 날카로운 정리, 비밀 탄로, 감정적 이별수', advice: '상대방의 자존심을 긁는 직설적 비판을 삼가고 정중한 경계선 설정' },
  '酉': { partner: '卯', name: '묘유충', hanja: '卯酉沖', domain: 'relationship', desc: '금목상충. 계획된 약속의 급변, 결별 및 결단 압박', advice: '오래 묵은 미련을 털어내고 새로운 시스템과 인연을 맞이할 준비' },
  '辰': { partner: '戌', name: '진술충', hanja: '辰戌沖', domain: 'money_wealth', desc: '수고와 화고의 충돌. 금고가 열려 재물 지출, 창고 정리, 내면의 영성 각성', advice: '충동구매와 투자를 보류하고 불필요한 구독이나 지출 내역을 전면 정리' },
  '戌': { partner: '辰', name: '진술충', hanja: '辰戌沖', domain: 'money_wealth', desc: '수고와 화고의 충돌. 기존 투자 자산의 변동성, 내적 가치관의 대전환', advice: '외부 환경에 흔들리지 말고 본질적인 기술 자산 축적에 집중' },
  '巳': { partner: '亥', name: '사해충', hanja: '巳亥沖', domain: 'health_body', desc: '수화상충. 말실수로 인한 구설, 원거리 여행/출장, 혈압 및 두통', advice: '공식적인 커뮤니케이션에서 단어 선택을 신중히 하고 충분한 수분 섭취' },
  '亥': { partner: '巳', name: '사해충', hanja: '巳亥沖', domain: 'health_body', desc: '수화상충. 급격한 감정 롤러코스터, 이동 중 돌발 변수', advice: '야간 활동을 줄이고 일찍 귀가하여 멘탈과 체력 재충전' }
};

// 6합 정의
const SIX_HARMONIES: Record<string, { partner: string; name: string; hanja: string; boost: string; strategy: string }> = {
  '子': { partner: '丑', name: '자축합', hanja: '子丑合', boost: '토(土) 기반 안정', strategy: '묵묵히 기본을 다지며 신뢰를 쌓기 좋은 타이밍' },
  '丑': { partner: '子', name: '자축합', hanja: '子丑合', boost: '토(土) 기반 안정', strategy: '오랜 협력자와 깊은 신뢰를 나누고 장기 계획 수립' },
  '寅': { partner: '亥', name: '인해합', hanja: '寅亥合', boost: '목(木) 생장 동력', strategy: '새로운 프로젝트 런칭과 적극적인 배움에 최적' },
  '亥': { partner: '寅', name: '인해합', hanja: '寅亥合', boost: '목(木) 생장 동력', strategy: '귀인의 후원과 아이디어 발전의 최적기' },
  '卯': { partner: '戌', name: '묘술합', hanja: '卯戌合', boost: '화(火) 열정 점화', strategy: '따뜻한 감정 교류와 창의적 창작 활동 추진' },
  '戌': { partner: '卯', name: '묘술합', hanja: '卯戌合', boost: '화(火) 열정 점화', strategy: '숨겨진 끼와 예술성을 과감하게 세상에 표출' },
  '辰': { partner: '酉', name: '진유합', hanja: '辰酉合', boost: '금(金) 결실 완성', strategy: '계약 체결, 금전 회수, 시스템 완성도 극대화' },
  '酉': { partner: '辰', name: '진유합', hanja: '辰酉合', boost: '금(金) 결실 완성', strategy: '군더더기 없는 결과물을 산출하여 성과를 입증' },
  '巳': { partner: '申', name: '사신합', hanja: '巳申合', boost: '수(水) 유연성 (단, 형 동반 주의)', strategy: '기술적 타협과 영리한 솔루션 도출' },
  '申': { partner: '巳', name: '사신합', hanja: '巳申合', boost: '수(水) 유연성 (단, 형 동반 주의)', strategy: '기민한 대처와 빠른 프로토타이핑 실행' },
  '午': { partner: '未', name: '오미합', hanja: '午未合', boost: '일월(日月)의 화합', strategy: '명예와 지위 상승, 대중의 호의를 이끌어내기 유리' },
  '未': { partner: '午', name: '오미합', hanja: '午未合', boost: '일월(日月)의 화합', strategy: '따뜻한 리더십으로 팀을 결속하고 영향력 확장' }
};

// 삼합 정의
const TRI_HARMONIES: Array<{ branches: [string, string, string]; name: string; hanja: string; element: string }> = [
  { branches: ['申', '子', '辰'], name: '신자진 수국', hanja: '申子辰 水局', element: '수(水) 지혜·유동성' },
  { branches: ['亥', '卯', '未'], name: '해묘미 목국', hanja: '亥卯未 木局', element: '목(木) 성장·기획' },
  { branches: ['寅', '午', '戌'], name: '인오술 화국', hanja: '寅午戌 火局', element: '화(火) 열정·확산' },
  { branches: ['巳', '酉', '丑'], name: '사유축 금국', hanja: '巳酉丑 金局', element: '금(金) 결단·수확' }
];

// 원진살 정의
const WONJIN_PAIRS: Record<string, string> = {
  '子': '未', '未': '子',
  '丑': '午', '午': '丑',
  '寅': '酉', '酉': '寅',
  '卯': '申', '申': '卯',
  '辰': '亥', '亥': '辰',
  '巳': '戌', '戌': '巳'
};

// 육해 정의
const YUKHAE_PAIRS: Record<string, string> = {
  '子': '未', '未': '子',
  '丑': '午', '午': '丑',
  '寅': '巳', '巳': '寅',
  '卯': '辰', '辰': '卯',
  '申': '亥', '亥': '申',
  '酉': '戌', '戌': '酉'
};

// 육파 정의
const YUKPA_PAIRS: Record<string, string> = {
  '子': '酉', '酉': '子',
  '丑': '辰', '辰': '丑',
  '寅': '亥', '亥': '寅',
  '卯': '午', '午': '卯',
  '巳': '申', '申': '巳',
  '戌': '未', '未': '戌'
};

/**
 * 율리우스 적일 기반 KST 당일 간지 산출
 */
function getKstDailyPillars(date: Date) {
  const kstMs = date.getTime() + 9 * 3600 * 1000;
  const kst = new Date(kstMs);
  const y = kst.getUTCFullYear();
  const m = kst.getUTCMonth() + 1;
  const d = kst.getUTCDate();
  
  // 연도 지지 (입춘 기준 간이 산출: 2026 = 丙午)
  const yi = (y - 4) % 60;
  const yZhi = EARTHLY_BRANCHES[(yi % 12 + 12) % 12];

  // 월 지지 (대략적 매핑)
  const mZhi = EARTHLY_BRANCHES[(m + 1) % 12];

  // 일 지지 (율리우스 적일)
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  const jd = d + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  const di = (jd + 49) % 60;
  const dGan = HEAVENLY_STEMS[(di % 10 + 10) % 10];
  const dZhi = EARTHLY_BRANCHES[(di % 12 + 12) % 12];

  return {
    yearZhi: yZhi,
    monthZhi: mZhi,
    dayGan: dGan,
    dayZhi: dZhi,
    dayGanZhiKo: `${dGan}${dZhi}(${BRANCH_KOREAN[dZhi] || dZhi})`
  };
}

/**
 * 실시간 삼형·육충·파해 동적 트리거 연산 메인 함수
 */
export function calculateDynamicClashTrigger(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): DynamicClashResult {
  const now = params?.targetDate || new Date();
  const q = (params?.question || '').trim();
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);
  const currentPillars = getKstDailyPillars(now);

  const activeClashes: ClashTriggerItem[] = [];
  const activeHarmonies: HarmonyTriggerItem[] = [];

  const userPillarsList: Array<{ key: PillarKey; zhi: string; name: string }> = [
    { key: 'year', zhi: saju.pillars.year.zhi, name: '년지(사회적 무대/가문)' },
    { key: 'month', zhi: saju.pillars.month.zhi, name: '월지(직장/부모/환경)' },
    { key: 'day', zhi: saju.pillars.day.zhi, name: '일지(배우자/나의 본질)' },
  ];
  if (saju.pillars.hour) {
    userPillarsList.push({ key: 'hour', zhi: saju.pillars.hour.zhi, name: '시지(자녀/취미/야망)' });
  }

  const triggeringList: Array<{ zhi: string; origin: 'today_day' | 'current_year'; label: string; weight: number }> = [
    { zhi: currentPillars.dayZhi, origin: 'today_day', label: '오늘의 일진', weight: 1.0 },
    { zhi: currentPillars.yearZhi, origin: 'current_year', label: '올해의 세운', weight: 0.8 }
  ];

  let rawVolatility = 0;
  let rawHarmony = 0;

  // 1. 육충(Six Clashes) 대조
  for (const up of userPillarsList) {
    for (const tr of triggeringList) {
      const clashInfo = SIX_CLASHES[up.zhi];
      if (clashInfo && clashInfo.partner === tr.zhi) {
        const intensity = Math.round(75 * tr.weight + (up.key === 'day' ? 20 : up.key === 'month' ? 15 : 10));
        activeClashes.push({
          id: `clash-${up.key}-${tr.origin}`,
          type: 'six_clash',
          name: `${up.name}와 ${tr.label}의 ${clashInfo.name}`,
          hanja: clashInfo.hanja,
          sourcePillar: up.key,
          sourceBranch: up.zhi,
          triggeringBranch: tr.zhi,
          triggerOrigin: tr.origin,
          intensity: Math.min(100, intensity),
          domain: clashInfo.domain,
          manifestation: clashInfo.desc,
          sublimationAction: clashInfo.advice
        });
        rawVolatility += intensity;
      }
    }
  }

  // 2. 삼형살(Three Penalties) & 자형(Self Penalty) 대조
  // 원국 지지 모음
  const allUserZhis = userPillarsList.map(p => p.zhi);
  for (const tr of triggeringList) {
    const combined = [...allUserZhis, tr.zhi];
    // 인사신 (무은지형)
    const hasYin = combined.includes('寅');
    const hasSi = combined.includes('巳');
    const hasShen = combined.includes('申');
    const penaltyCount = (hasYin ? 1 : 0) + (hasSi ? 1 : 0) + (hasShen ? 1 : 0);

    if (penaltyCount === 3 && (tr.zhi === '寅' || tr.zhi === '巳' || tr.zhi === '申')) {
      activeClashes.push({
        id: `penalty-yinsishen-${tr.origin}`,
        type: 'three_penalties',
        name: `인사신(寅巳申) 무은지형(無恩之刑) 격발`,
        hanja: '寅巳申 無恩之刑',
        sourcePillar: 'day',
        sourceBranch: userPillarsList.find(p => ['寅','巳','申'].includes(p.zhi))?.zhi || '寅',
        triggeringBranch: tr.zhi,
        triggerOrigin: tr.origin,
        intensity: 95,
        domain: 'work_career',
        manifestation: '사법, 의료, 칼날 같은 결단, 배신수 또는 일방적 계약 파기 주의, 강력한 업무 추진력',
        sublimationAction: '군더더기 없는 냉정한 시스템 구축, 수술/미용 시술, 혹은 결재라인 즉시 정리에 활용'
      });
      rawVolatility += 95;
    } else if (penaltyCount === 2 && (tr.zhi === '寅' || tr.zhi === '巳' || tr.zhi === '申')) {
      activeClashes.push({
        id: `half-penalty-yinsishen-${tr.origin}`,
        type: 'three_penalties',
        name: `인사/사신 준(準)삼형 작용`,
        hanja: '準三刑',
        sourcePillar: 'month',
        sourceBranch: userPillarsList.find(p => ['寅','巳','申'].includes(p.zhi))?.zhi || '巳',
        triggeringBranch: tr.zhi,
        triggerOrigin: tr.origin,
        intensity: 65,
        domain: 'work_career',
        manifestation: '작은 마찰과 기계/소프트웨어 오류 발생 가능성',
        sublimationAction: '철저한 이중 검수와 계약서 문구 재확인'
      });
      rawVolatility += 60;
    }

    // 축술미 (지세지형)
    const hasChou = combined.includes('丑');
    const hasXu = combined.includes('戌');
    const hasWei = combined.includes('未');
    const chouXuWeiCount = (hasChou ? 1 : 0) + (hasXu ? 1 : 0) + (hasWei ? 1 : 0);

    if (chouXuWeiCount === 3 && (tr.zhi === '丑' || tr.zhi === '戌' || tr.zhi === '未')) {
      activeClashes.push({
        id: `penalty-chouxuwei-${tr.origin}`,
        type: 'three_penalties',
        name: `축술미(丑戌未) 지세지형(持勢之刑) 격발`,
        hanja: '丑戌未 持勢之刑',
        sourcePillar: 'day',
        sourceBranch: userPillarsList.find(p => ['丑','戌','未'].includes(p.zhi))?.zhi || '丑',
        triggeringBranch: tr.zhi,
        triggerOrigin: tr.origin,
        intensity: 90,
        domain: 'relationship',
        manifestation: '믿었던 세력이나 자금의 지연, 자만심으로 인한 대인 갈등',
        sublimationAction: '겸양의 태도로 경청하고, 자만하지 않으며 묵묵히 내실 다지기'
      });
      rawVolatility += 90;
    }

    // 자형 (辰辰, 午午, 酉酉, 亥亥)
    for (const up of userPillarsList) {
      if (up.zhi === tr.zhi && ['辰', '午', '酉', '亥'].includes(up.zhi)) {
        activeClashes.push({
          id: `self-penalty-${up.key}-${tr.origin}`,
          type: 'self_penalty',
          name: `${up.name}의 ${up.zhi}${tr.zhi} 자형(自刑)`,
          hanja: `${up.zhi}${tr.zhi} 自刑`,
          sourcePillar: up.key,
          sourceBranch: up.zhi,
          triggeringBranch: tr.zhi,
          triggerOrigin: tr.origin,
          intensity: 70,
          domain: 'mind_emotion',
          manifestation: '스스로를 채찍질하는 자책감, 고집으로 인한 자기 함정, 우울감',
          sublimationAction: '완벽주의를 내려놓고 오늘 완성한 작은 성과를 스스로 칭찬하기'
        });
        rawVolatility += 65;
      }
    }
  }

  // 3. 원진살 & 육해 & 육파 대조
  for (const up of userPillarsList) {
    for (const tr of triggeringList) {
      // 원진
      if (WONJIN_PAIRS[up.zhi] === tr.zhi) {
        activeClashes.push({
          id: `wonjin-${up.key}-${tr.origin}`,
          type: 'wonjin',
          name: `${up.name}와 ${tr.label}의 원진(怨嗔)`,
          hanja: '怨嗔煞',
          sourcePillar: up.key,
          sourceBranch: up.zhi,
          triggeringBranch: tr.zhi,
          triggerOrigin: tr.origin,
          intensity: 55,
          domain: 'relationship',
          manifestation: '이유 없는 서운함, 대화 중 삐침, 까다로운 감정 소모',
          sublimationAction: '중요한 대화는 내일로 미루고 혼자만의 사색 시간 확보'
        });
        rawVolatility += 45;
      }
      // 육해
      if (YUKHAE_PAIRS[up.zhi] === tr.zhi) {
        activeClashes.push({
          id: `yukhae-${up.key}-${tr.origin}`,
          type: 'six_harm',
          name: `${up.name}와 ${tr.label}의 육해(六害)`,
          hanja: '六害',
          sourcePillar: up.key,
          sourceBranch: up.zhi,
          triggeringBranch: tr.zhi,
          triggerOrigin: tr.origin,
          intensity: 45,
          domain: 'health_body',
          manifestation: '은근한 방해 요인, 소화기 피로, 피로 누적',
          sublimationAction: '몸의 신호에 귀 기울이고 미지근한 물 자주 마시기'
        });
        rawVolatility += 35;
      }
      // 육파
      if (YUKPA_PAIRS[up.zhi] === tr.zhi) {
        activeClashes.push({
          id: `yukpa-${up.key}-${tr.origin}`,
          type: 'six_destruction',
          name: `${up.name}와 ${tr.label}의 육파(六破)`,
          hanja: '六破',
          sourcePillar: up.key,
          sourceBranch: up.zhi,
          triggeringBranch: tr.zhi,
          triggerOrigin: tr.origin,
          intensity: 40,
          domain: 'work_career',
          manifestation: '약속 변경, 사소한 부품이나 기기 트러블',
          sublimationAction: '일정을 넉넉하게 잡고 변동 가능성을 미리 열어두기'
        });
        rawVolatility += 30;
      }
    }
  }

  // 4. 육합(Six Harmonies) 대조
  for (const up of userPillarsList) {
    for (const tr of triggeringList) {
      const harm = SIX_HARMONIES[up.zhi];
      if (harm && harm.partner === tr.zhi) {
        const boost = Math.round(70 * tr.weight + (up.key === 'day' ? 20 : 10));
        activeHarmonies.push({
          id: `harmony-${up.key}-${tr.origin}`,
          type: 'six_harmony',
          name: `${up.name}와 ${tr.label}의 ${harm.name}`,
          hanja: harm.hanja,
          sourcePillar: up.key,
          sourceBranch: up.zhi,
          triggeringBranch: tr.zhi,
          triggerOrigin: tr.origin,
          boostScore: Math.min(100, boost),
          domain: harm.boost,
          manifestation: '사람들과의 호흡이 부드럽고 상호 간의 공감대가 자연스럽게 형성됨',
          utilizationStrategy: harm.strategy
        });
        rawHarmony += boost;
      }
    }
  }

  // 5. 삼합국(Tri-Harmonies) 대조
  for (const tri of TRI_HARMONIES) {
    for (const tr of triggeringList) {
      if (tri.branches.includes(tr.zhi)) {
        const userMatches = userPillarsList.filter(p => tri.branches.includes(p.zhi));
        if (userMatches.length >= 2) {
          activeHarmonies.push({
            id: `tri-harmony-${tri.name}-${tr.origin}`,
            type: 'three_harmony',
            name: `${tri.name} 완전 삼합 결성`,
            hanja: tri.hanja,
            sourcePillar: userMatches[0].key,
            sourceBranch: userMatches.map(m => m.zhi).join('·'),
            triggeringBranch: tr.zhi,
            triggerOrigin: tr.origin,
            boostScore: 90,
            domain: tri.element,
            manifestation: `운에서 ${tr.zhi}가 들어와 삼합국(${tri.element})이 완성되며 거대한 시너지 폭발`,
            utilizationStrategy: '미뤄왔던 대형 기획을 발표하거나 큰 결정을 단행하기에 가장 길한 순간'
          });
          rawHarmony += 90;
        } else if (userMatches.length === 1) {
          activeHarmonies.push({
            id: `half-tri-harmony-${tri.name}-${tr.origin}`,
            type: 'three_harmony',
            name: `${tri.name} 반합(半合) 기운 형성`,
            hanja: '半合',
            sourcePillar: userMatches[0].key,
            sourceBranch: userMatches[0].zhi,
            triggeringBranch: tr.zhi,
            triggerOrigin: tr.origin,
            boostScore: 50,
            domain: tri.element,
            manifestation: `목표를 향해 한 걸음 전진하는 부드러운 협력의 바람`,
            utilizationStrategy: '협업 파트너와 미팅을 갖고 새로운 아이디어를 발전시키기'
          });
          rawHarmony += 45;
        }
      }
    }
  }

  // 종합 점수 정규화 (0~100)
  const volatilityScore = Math.min(100, Math.round(rawVolatility));
  const harmonyScore = Math.min(100, Math.round(rawHarmony));

  let netStatus: DynamicClashResult['netStatus'] = 'peaceful_flow';
  if (volatilityScore >= 75 && harmonyScore < 50) {
    netStatus = 'explosive_change';
  } else if (volatilityScore >= 50) {
    netStatus = 'high_tension';
  } else if (volatilityScore >= 30 || harmonyScore >= 40) {
    netStatus = 'balanced_movement';
  } else {
    netStatus = 'peaceful_flow';
  }

  // 대표 경고 및 행동 매트릭스 도출
  const primaryClash = activeClashes.sort((a, b) => b.intensity - a.intensity)[0] || null;
  const primaryHarm = activeHarmonies.sort((a, b) => b.boostScore - a.boostScore)[0] || null;

  const primaryAlert = primaryClash
    ? `${primaryClash.name} (${primaryClash.hanja}) 영향으로 ${primaryClash.manifestation}`
    : null;

  const todayActionMatrix = {
    doNow: primaryHarm ? primaryHarm.utilizationStrategy : (primaryClash ? primaryClash.sublimationAction : '일상의 평온한 리듬을 유지하며 개인 연구 몰입'),
    avoidNow: primaryClash ? primaryClash.manifestation : '근거 없는 불안감에 사로잡혀 서두르는 태도',
    goldenKey: primaryClash
      ? `충(沖)은 기회다: 깨진 껍질 사이로 새로운 아이디어가 탄생하듯, 기존 틀을 깨는 용기`
      : `합(合)의 흐름: 사람들과 따뜻하게 교류하며 시스템의 내실을 다지는 안정감`
  };

  const summary = `[오늘의 동적 충합] 상태: ${netStatus}. ` +
    (primaryClash ? `주요 트리거: ${primaryClash.name}. ` : '특이 충형살 없음. ') +
    (primaryHarm ? `지원 합: ${primaryHarm.name}.` : '');

  const temporalClashRhythm = getTemporalClashRhythm(now);
  const situationalClashAudit = {
    focusTheme: q ? `${currentPillars.dayGanZhiKo} · 질문 맥락 충합 감사` : `${currentPillars.dayGanZhiKo} · 일진 충합 흐름`,
    clashCue: primaryClash ? `${primaryClash.name}: ${primaryClash.manifestation}` : '특이 충형 격발 없음',
    tacticalStep: todayActionMatrix.doNow,
  };
  const clashSynthesisMatrix = {
    coreInsight: todayActionMatrix.goldenKey,
    recommendedAction: todayActionMatrix.doNow,
    cautionNotice: todayActionMatrix.avoidNow,
  };

  return {
    engineVersion: DYNAMIC_CLASH_ENGINE_VERSION,
    targetDateIso: now.toISOString(),
    calculatedAtKst: temporalClashRhythm.kstTimeLabel,
    currentPillars,
    volatilityScore,
    harmonyScore,
    netStatus,
    activeClashes,
    activeHarmonies,
    primaryAlert,
    todayActionMatrix,
    situationalClashAudit,
    temporalClashRhythm,
    clashSynthesisMatrix,
    reflectiveQuestion: q
      ? `‘${q}’ 상황에서 오늘의 충·합 파동(${primaryClash ? primaryClash.name : '평온 흐름'})을 어떤 창조적 결단이나 조율 행동으로 전환하시겠습니까?`
      : `오늘 일진(${currentPillars.dayGanZhiKo})이 건네는 긴장과 합의 기운 속에서 가장 먼저 내려놓을 관성과 붙잡을 행동은 무엇입니까?`,
    boundaryNotice: '본 결과는 사주 지지 충·합 상징에 기반한 정성적 리듬 안내이며, 흉살 예언이나 확정적 예측이 아닙니다.',
    summary
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatDynamicClashPrompt(res: DynamicClashResult): string {
  const statusLabel =
    res.netStatus === 'explosive_change'
      ? '강한 변동·돌파 국면'
      : res.netStatus === 'high_tension'
        ? '긴장·조율 국면'
        : res.netStatus === 'balanced_movement'
          ? '균형 이동 국면'
          : '평온한 순행 국면';

  const clashList = res.activeClashes.length > 0
    ? res.activeClashes.map(c => {
        const tone = c.intensity >= 80 ? '강한 자극' : c.intensity >= 60 ? '뚜렷한 파동' : '잔잔한 주의';
        return `  • [${c.type.toUpperCase()}] ${c.name}: ${c.manifestation} (${tone}) → 행동 승화: ${c.sublimationAction}`;
      }).join('\n')
    : '  • 오늘 격발된 부정적 충/형/파/해 없음 (평온한 흐름)';

  const harmList = res.activeHarmonies.length > 0
    ? res.activeHarmonies.map(h => {
        const tone = h.boostScore >= 80 ? '강력한 시너지' : '부드러운 협력';
        return `  • [${h.type.toUpperCase()}] ${h.name}: ${h.manifestation} (${tone}) → 활용 전략: ${h.utilizationStrategy}`;
      }).join('\n')
    : '  • 특별한 합국 형성 없음';

  return `[실시간 삼형·육충·파해 동적 트리거 리포트 (엔진: ${res.engineVersion})]
- 연산 시각: ${res.calculatedAtKst}
- 오늘 일진: ${res.currentPillars.dayGanZhiKo} | 세운: ${res.currentPillars.yearZhi}년
- 오늘의 충·합 기조: **${statusLabel}** (${res.netStatus})
- 활성 충/형/파/해(Clashes & Penalties):
${clashList}
- 활성 합(Harmonies):
${harmList}
- 오늘의 액션 가이드:
  • 집중할 행동(Do): ${res.todayActionMatrix.doNow}
  • 피할 함정(Avoid): ${res.todayActionMatrix.avoidNow}
  • 골든 마인드셋: "${res.todayActionMatrix.goldenKey}"
- 질문 맥락 감사 (${res.situationalClashAudit.focusTheme}): ${res.situationalClashAudit.clashCue}
- KST 시공간 리듬: ${res.temporalClashRhythm.triggerWatchWindow} / ${res.temporalClashRhythm.seasonalClashTone}
- 교차 매트릭스: 핵심(${res.clashSynthesisMatrix.coreInsight}) | 실행(${res.clashSynthesisMatrix.recommendedAction}) | 주의(${res.clashSynthesisMatrix.cautionNotice})
- 성찰 질문: ${res.reflectiveQuestion}
- 해석 경계: ${res.boundaryNotice}
※ 루시 지침: 충(沖)이나 형(刑)이 발생했다고 해서 불길한 액운으로 겁주지 마십시오. 충은 낡은 껍질을 깨고 새로운 아이디어를 분출시키는 강력한 에너지입니다. 사용자가 오늘 마주할 수 있는 감정적/업무적 파동을 짚어주고, 이를 창조적 결단으로 승화할 수 있도록 실용적으로 안내하십시오.`;
}

