/**
 * =========================================================================
 * LUCKEY 정통 사주 10대 격국(格局) 성격(成格)·파격(破格) 수리 판정 엔진
 * (Geokguk Engine - Zipyeong Jinjeon 정통 격국 수리 산법)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리 결정론적 계산 (Deterministic).
 *    동일한 생년월일시 입력에는 항상 동일한 격국 판정 JSON을 산출한다.
 *
 * 2. 자평진전(子平眞詮) 정통 격국론의 알고리즘화:
 *    기존 sajuAnalysis의 단순 10정격 명칭 부여를 넘어, 격국의 성립 원천
 *    (월령 본기·중기·초기 사령 및 투간 대조)부터 성격(成格), 파격(破格),
 *    구응(救應), 상신(相神)까지 단계별 수리 산법으로 완전 판정한다.
 *
 * 3. 월령 격국 성립 원천 (月令 格局 成立):
 *    - 월지가 일간의 건록(建祿)지이면 건록격(建祿格)
 *    - 월지가 양간 일간의 제왕(帝旺)지이면 양인격(陽刃格)
 *    - 월지 지장간(지장간) 본기(정기) → 중기 → 초기(여기) 순으로 천간 투출 대조하여
 *      최초 투출 신의 십신으로 격국 성립 (본기 > 중기 > 초기 우선순위)
 *    - 투간이 없으면 월령 본기(정기)를 그대로 격으로 삼는다 (본기 비겁 시 사령 변통)
 *
 * 4. 4길신 순용(順用) vs 4흉신 역용(逆用):
 *    - 4길신(정관·재성·정인·식신): 재성/인성 보좌, 식신생재, 관인상생 등 순용 성격 점검
 *    - 4흉신(칠살·상관·편인·양인): 식신제살/살인상생, 상관패인/상관생재,
 *      편인투재, 양인가살 등 제화 역용 성격 점검
 *
 * 5. 파격(破格) 원인 및 구응(救應) 검출:
 *    - 정관격: 상관 투출(상관견관) → 인성이 상관을 제압하면 구응 성공
 *    - 재격: 비겁 난무(군겁쟁재) → 식상 통관 또는 관살 제겁으로 구응
 *    - 식신격: 편인 투간(도식) → 편재가 편인을 제어하면 구응 성공
 *    - 칠살격: 신약살왕 → 인성(살인상생)·식신(제살)·겁재(합살)로 구응
 *
 * 6. 상신(相神) 및 격국 기반 현대적 직업·사회적 재능 적성 리포트 산출.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  calculateTenGod,
  HIDDEN_STEMS,
  TWELVE_STAGES_MATRIX,
  STEM_YIN_YANG,
  STEM_KOREAN,
  BRANCH_KOREAN,
} from '../sajuAnalysis';

export const GEOKGUK_ENGINE_VERSION = 'LUCKEY-GG-v2.3.0';

export const GEOKGUK_METHOD =
  '자평진전(子平眞詮) 정통 격국 수리 산법: 월령 본기·중기·초기 사령 및 투간 대조(본기>중기>초기 우선), 월지 건록·양인 직취 판정, 4길신 순용(정관·재성·정인·식신의 재성/인성 보좌·식신생재·관인상생)과 4흉신 역용(칠살·상관·편인·양인의 식신제살·살인상생·상관패인·상관생재·재성제인·양인가살) 성격(成格) 점검, 상관견관·군겁쟁재·도식·신약살왕 등 파격(破格) 원인 및 구응(救應) 검출, 상신(相神) 식별 및 격국 기반 직업·사회적 재능 리포트 결정론적 산출';

export type GeokgukStatus = 'calculated' | 'skipped' | 'error';
export type GeokgukShinsalClass = '길신(善神) · 순용(順用)' | '흉신(惡神) · 역용(逆用)' | '중성신(中性神)';
export type GeokgukVerdict = '성격(成格)' | '구응(救應) 성공 · 성격(成格) 회복' | '파격(破格)' | '원격(原格) 성립';

export interface GeokgukMonthCommand {
  branch: string;
  branchKr: string;
  sourceKind: '월지 건록(建祿)' | '월지 양인(陽刃)' | '본기(정기) 투간' | '중기 투간' | '초기(여기) 투간' | '본기 불투출 적용' | '중기 사령 적용' | '초기(여기) 사령 적용' | '월지 제왕(음간) 겁재 직취';
  stem: string;
  stemKr: string;
  tenGodName: string;
  reason: string;
}

export interface GeokgukSeongGyeok {
  achieved: boolean;
  title: string;
  reason: string;
}

export interface GeokgukPaGyeok {
  type: string;
  title: string;
  detail: string;
}

export interface GeokgukGuEung {
  title: string;
  detail: string;
  stem: string | null;
  tenGodName: string | null;
}

export interface GeokgukSangSin {
  stem: string | null;
  tenGodName: string;
  role: string;
}

export interface GeokgukCareerReport {
  archetype: string;
  socialTalent: string;
  talents: string[];
  careers: string[];
}

export interface GeokgukResult {
  status: GeokgukStatus;
  engineVersion: string;
  calculatedAtKst?: string;
  method: string;
  dayMaster: { stem: string; korean: string } | null;
  pillarsSnapshot: { year: string; month: string; day: string; hour: string | null } | null;
  monthCommand: GeokgukMonthCommand | null;
  geokgukType: string;
  geokgukName: string;
  shinsalClass: GeokgukShinsalClass;
  yongMethod: string;
  verdict: GeokgukVerdict;
  verdictReason: string;
  seongGyeok: GeokgukSeongGyeok | null;
  paGyeok: GeokgukPaGyeok[];
  guEung: GeokgukGuEung[];
  sangSin: GeokgukSangSin | null;
  careerReport: GeokgukCareerReport | null;
  situationalGeokgukAudit?: {
    focusTheme: string;
    structuralNote: string;
    actionGuide: string;
  };
  temporalGeokgukRhythm?: {
    kstTimeLabel: string;
    commandWatchWindow: string;
    seasonalGeokgukTone: string;
    temporalGuidance: string;
  };
  geokgukSynthesisMatrix?: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  reflectiveQuestion?: string;
  ritualAction?: string;
  reflectionFocus?: string;
  boundaryNotice?: string;
  interpretiveBoundary?: string;
  note?: string;
}

function getTemporalGeokgukRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const commandWatchWindow =
    hour >= 5 && hour < 11
      ? '아침 월령 기상창 — 본래 타고난 격국의 기틀을 의식하며 하루의 방향을 세우는 시간'
      : hour >= 11 && hour < 17
        ? '정오 상신(相神) 발현창 — 격국을 돕는 상신의 재능을 현실의 일과 관계에 쓰는 시간'
        : hour >= 17 && hour < 22
          ? '황혼 구응(救應) 조율창 — 어긋난 균형을 보완하고 무리한 욕심을 덜어내는 시간'
          : '심야 성찰창 — 사회적 역할을 잠시 내려놓고 일간의 본질을 고요히 돌보는 시간';

  const seasonalGeokgukTone =
    month >= 3 && month <= 5
      ? '봄 · 인묘진(寅卯辰) 생기절 (새로운 진로·역할을 모색하기 좋은 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 사오미(巳午未) 발양절 (재능과 성취를 외부로 드러내는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 신유술(申酉戌) 결실절 (직업적 기준과 전문성을 다지는 시기)'
          : '겨울 · 해자축(亥子丑) 함장절 (실력을 갈고닦아 다음 국면을 준비하는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    commandWatchWindow,
    seasonalGeokgukTone,
    temporalGuidance: `${commandWatchWindow} · ${seasonalGeokgukTone}의 결에 맞추어 격국의 장점을 발휘하십시오.`,
  };
}

/** 판정 코어 입력 (년·월·시 천간과 월지, 신강신약 레벨) */
export interface GeokgukPillarInput {
  dayStem: string;
  monthBranch: string;
  stems: string[];
  bodyLevel: '극신강' | '신강' | '중화' | '신약' | '극신약';
}

export interface GeokgukCoreDecision {
  geokgukName: string;
  geokgukFull: string;
  chosenStem: string;
  tenGodName: string;
  sourceKind: GeokgukMonthCommand['sourceKind'];
  reason: string;
  shinsalClass: GeokgukShinsalClass;
  yongMethod: string;
  verdict: GeokgukVerdict;
  verdictReason: string;
  seongGyeok: GeokgukSeongGyeok | null;
  paGyeok: GeokgukPaGyeok[];
  guEung: GeokgukGuEung[];
  sangSin: GeokgukSangSin | null;
}

const HANJA_OF: Record<string, string> = {
  '정관격': '正官格',
  '칠살격': '七殺格',
  '정재격': '正財格',
  '편재격': '偏財格',
  '식신격': '食神格',
  '상관격': '傷官格',
  '정인격': '正印格',
  '편인격': '偏印格',
  '건록격': '建祿格',
  '양인격': '陽刃格',
  '겁재격': '劫財格',
};

function geokgukKeyFromTenGod(tenGodName: string): string {
  if (tenGodName.startsWith('정관')) return '정관격';
  if (tenGodName.startsWith('편관')) return '칠살격';
  if (tenGodName.startsWith('정재')) return '정재격';
  if (tenGodName.startsWith('편재')) return '편재격';
  if (tenGodName.startsWith('식신')) return '식신격';
  if (tenGodName.startsWith('상관')) return '상관격';
  if (tenGodName.startsWith('정인')) return '정인격';
  if (tenGodName.startsWith('편인')) return '편인격';
  return '겁재격';
}

/**
 * 격국 수리 판정 코어: 월령 사령·투간 대조 → 격국 성립 → 길신 순용/흉신 역용
 * 성격(成格)·파격(破格)·구응(救應)·상신(相神)까지 단계별 결정론 판정.
 */
export function decideGeokgukFromPillars(input: GeokgukPillarInput): GeokgukCoreDecision {
  const { dayStem, monthBranch, stems, bodyLevel } = input;
  const hidden = HIDDEN_STEMS[monthBranch];
  const monthStage = TWELVE_STAGES_MATRIX[dayStem]?.[monthBranch] || '';
  const tenGodOf = (stem: string) => calculateTenGod(dayStem, stem);

  // 1. 월령 사령 투간 대조 (본기 > 중기 > 초기 우선순위)
  const exposed = (stem: string) => stems.includes(stem);
  let sourceKind: GeokgukMonthCommand['sourceKind'] = '본기 불투출 적용';
  let geokgukKey = '';
  let chosenStem = '';
  let reason = '';

  const candidates: Array<{ kind: GeokgukMonthCommand['sourceKind']; stem: string }> = [];
  candidates.push({ kind: '본기(정기) 투간', stem: hidden.main[0] });
  if (hidden.middle) candidates.push({ kind: '중기 투간', stem: hidden.middle[0] });
  candidates.push({ kind: '초기(여기) 투간', stem: hidden.early[0] });

  let picked: { kind: GeokgukMonthCommand['sourceKind']; stem: string } | null = null;
  for (const c of candidates) {
    if (exposed(c.stem)) {
      picked = c;
      break;
    }
  }

  // 2. 월지 건록/양인 직취 판정
  const isGeonrokMonth = monthStage === '건록';
  const isJeawangMonth = monthStage === '제왕';
  const dayIsYang = STEM_YIN_YANG[dayStem] === '양';

  const mainTenGod = tenGodOf(hidden.main[0]);
  const mainIsBigeok = mainTenGod.category === '비겁';

  if (isGeonrokMonth) {
    sourceKind = '월지 건록(建祿)';
    geokgukKey = '건록격';
    chosenStem = hidden.main[0];
    reason = `월지 ${monthBranch}가 일간 ${dayStem}의 건록지로, 월지 본기 ${hidden.main[0]}(${mainTenGod.name})를 그대로 격으로 삼는 건록격(建祿格)입니다`;
  } else if (isJeawangMonth && dayIsYang) {
    sourceKind = '월지 양인(陽刃)';
    geokgukKey = '양인격';
    chosenStem = hidden.main[0];
    reason = `월지 ${monthBranch}가 양간 ${dayStem}의 제왕지 즉 양인(陽刃)으로, 칼날의 기운을 월령에 직취하는 양인격(陽刃格)입니다`;
  } else if (picked) {
    sourceKind = picked.kind;
    chosenStem = picked.stem;
    const tg = tenGodOf(picked.stem);
    geokgukKey = geokgukKeyFromTenGod(tg.name);
    reason = `월지 ${monthBranch}의 사령 ${picked.stem}이(가) 천간에 투출하여 그 십신 ${tg.name}으로 격국을 성립합니다`;
  } else if (mainIsBigeok) {
    // 본기 비겁 + 불투출: 비겁은 격이 될 수 없으므로 중기 → 초기 사령 신으로 변통, 모두 비겁이면 겁재격 명명
    const alt =
      hidden.middle && tenGodOf(hidden.middle[0]).category !== '비겁'
        ? { stem: hidden.middle[0], kind: '중기 사령 적용' as const }
        : tenGodOf(hidden.early[0]).category !== '비겁'
          ? { stem: hidden.early[0], kind: '초기(여기) 사령 적용' as const }
          : null;
    if (alt) {
      sourceKind = alt.kind;
      chosenStem = alt.stem;
      const tg = tenGodOf(alt.stem);
      geokgukKey = geokgukKeyFromTenGod(tg.name);
      reason = `월지 ${monthBranch} 본기 ${hidden.main[0]}(${mainTenGod.name})는 비겁이라 격으로 쓰지 않고, 사령 ${alt.stem}(${tg.name})로 격국을 성립합니다`;
    } else {
      sourceKind = '월지 제왕(음간) 겁재 직취';
      chosenStem = hidden.main[0];
      geokgukKey = '겁재격';
      reason = `월지 ${monthBranch} 본기 ${hidden.main[0]}(${mainTenGod.name})가 투간되지 않아 겁재의 기운을 월령에서 직취한 겁재격(劫財格)으로 변통 판정합니다`;
    }
  } else {
    sourceKind = '본기 불투출 적용';
    chosenStem = hidden.main[0];
    geokgukKey = geokgukKeyFromTenGod(mainTenGod.name);
    reason = `월지 ${monthBranch}의 본기(정기) ${hidden.main[0]}이 천간에 투출하지 않았으나 월령 본기를 그대로 격으로 삼아 ${mainTenGod.name} 격국을 성립합니다`;
  }

  const finalTenGod =
    geokgukKey === '건록격' || geokgukKey === '양인격' || geokgukKey === '겁재격'
      ? mainTenGod
      : tenGodOf(chosenStem);

  const geokgukFull = `${geokgukKey}(${HANJA_OF[geokgukKey] || ''})`;

  // 3. 4길신 순용 vs 4흉신 역용 분류
  const shinsalMap: Record<string, GeokgukShinsalClass> = {
    '정관격': '길신(善神) · 순용(順用)',
    '정재격': '길신(善神) · 순용(順用)',
    '편재격': '길신(善神) · 순용(順用)',
    '정인격': '길신(善神) · 순용(順用)',
    '식신격': '길신(善神) · 순용(順用)',
    '칠살격': '흉신(惡神) · 역용(逆用)',
    '상관격': '흉신(惡神) · 역용(逆用)',
    '편인격': '흉신(惡神) · 역용(逆用)',
    '양인격': '흉신(惡神) · 역용(逆用)',
    '겁재격': '흉신(惡神) · 역용(逆用)',
    '건록격': '중성신(中性神)',
  };
  const shinsalClass = shinsalMap[geokgukKey];
  const yongMethod = shinsalClass.includes('순용')
    ? '길신 순용(順用): 격신의 기운을 재성·인성·식상으로 생조·보좌하여 흐름을 살림'
    : shinsalClass.includes('역용')
      ? '흉신 역용(逆用): 격신의 기운을 식신·인성·재성·관성으로 제어·화해하여 방향을 바로잡음'
      : '중성신: 비겁의 기운을 관성·식상으로 개량하여 소명으로 전환';

  // 4. 투출 십신 유틸 (년·월·시 천간 기준)
  const hasGod = (names: string[]) => stems.find((s) => names.includes(tenGodOf(s).name));
  const countGod = (names: string[]) => stems.filter((s) => names.includes(tenGodOf(s).name)).length;

  const JEONG_GWAN = ['정관(正官)'];
  const PYEON_GWAN = ['편관(偏官)'];
  const GWAN = [...JEONG_GWAN, ...PYEON_GWAN];
  const JA = ['정재(正財)', '편재(偏財)'];
  const IN = ['정인(正印)', '편인(偏印)'];
  const SIK_SANG = ['식신(食神)', '상관(傷官)'];
  const SANG_GWAN = ['상관(傷官)'];
  const SIK = ['식신(食神)'];
  const PYEON_IN = ['편인(偏印)'];
  const PYEON_JA = ['편재(偏財)'];
  const BIGEOP = ['비견(比肩)', '겁재(劫財)'];
  const GEOBJAE = ['겁재(劫財)'];

  let verdict: GeokgukVerdict = '원격(原格) 성립';
  let verdictReason = '격신이 월령에서 성립하였으나 명확한 성격(成格) 보좌도 파격 요인도 검출되지 않아 원격 상태로 유지됩니다';
  let seongGyeok: GeokgukSeongGyeok | null = null;
  const paGyeok: GeokgukPaGyeok[] = [];
  const guEung: GeokgukGuEung[] = [];
  let sangSin: GeokgukSangSin | null = null;

  // 5. 격국별 성격/파격/구응 수리 산법
  if (geokgukKey === '정관격') {
    const sangGwanStem = hasGod(SANG_GWAN);
    if (sangGwanStem) {
      paGyeok.push({
        type: '상관견관(傷官見官)',
        title: '정관격 파격 — 상관이 투출해 정관을 극함',
        detail: `투출된 ${sangGwanStem}(상관)이 정관격의 존엄과 질서를 상처 입힙니다(상관견관).`,
      });
      const inStem = hasGod(IN);
      if (inStem) {
        guEung.push({
          title: '인성제상(印星制傷) — 구응 성공',
          detail: `${inStem}(인성)이 상관을 합·제압하여 정관을 지켜내 파격을 회복했습니다.`,
          stem: inStem,
          tenGodName: tenGodOf(inStem).name,
        });
        sangSin = { stem: inStem, tenGodName: tenGodOf(inStem).name, role: '상관을 제압해 정관격을 구하는 상신' };
      }
    }
    if (hasGod(PYEON_GWAN)) {
      paGyeok.push({
        type: '관살혼잡(官殺混雜)',
        title: '정관격 파격 — 편관 혼잡',
        detail: '정관 격에 편관이 함께 투출해 관의 순수성이 훼손됩니다(관살혼잡).',
      });
      const geoStem = hasGod(GEOBJAE);
      if (geoStem) {
        guEung.push({
          title: '합살류관(合殺留官) — 구응 성공',
          detail: `${geoStem}(겁재)이 편관과 합거하여 정관만 남기는 합살류관으로 순수성을 회복했습니다.`,
          stem: geoStem,
          tenGodName: tenGodOf(geoStem).name,
        });
        sangSin = sangSin || { stem: geoStem, tenGodName: tenGodOf(geoStem).name, role: '편관을 합거하는 상신(겁재)' };
      }
    }
    if (paGyeok.length === 0) {
      const jaStem = hasGod(JA);
      const inStem2 = hasGod(IN);
      if (jaStem) {
        seongGyeok = {
          achieved: true,
          title: '재생관(財生官) — 성격(成格)',
          reason: `${jaStem}(재성)이 정관을 생조하여 관의 위광이 윤택해집니다. 명예와 재물이 함께 따르는 격국입니다.`,
        };
        sangSin = sangSin || { stem: jaStem, tenGodName: tenGodOf(jaStem).name, role: '정관을 생조하는 상신(재성)' };
      } else if (inStem2) {
        seongGyeok = {
          achieved: true,
          title: '관인상생(官印相生) — 성격(成格)',
          reason: `${inStem2}(인성)이 정관의 기운을 받아 일간으로 흘려보내는 관인상생이 이루어집니다.`,
        };
        sangSin = sangSin || { stem: inStem2, tenGodName: tenGodOf(inStem2).name, role: '관기를 일간에 전달하는 상신(인성)' };
      }
    }
  } else if (geokgukKey === '칠살격') {
    const sikStem = hasGod(SIK);
    const inStem = hasGod(IN);
    const geobjaeStem = hasGod(GEOBJAE);
    if (hasGod(JEONG_GWAN)) {
      paGyeok.push({
        type: '관살혼잡(官殺混雜)',
        title: '칠살격 파격 — 정관 혼잡',
        detail: '칠살 격에 정관이 함께 투출해 살의 기운이 순수하지 못합니다(관살혼잡).',
      });
    }
    const salWang = countGod(PYEON_GWAN) >= 2;
    const isWeak = bodyLevel === '신약' || bodyLevel === '극신약';
    if (sikStem) {
      seongGyeok = {
        achieved: true,
        title: '식신제살(食神制殺) — 성격(成格)',
        reason: `${sikStem}(식신)이 칠살을 정복하여 흉기가 반전된 결단력의 격국입니다.`,
      };
      sangSin = { stem: sikStem, tenGodName: tenGodOf(sikStem).name, role: '칠살을 제압하는 상신(식신)' };
      if (hasGod(JEONG_GWAN)) {
        guEung.push({
          title: '식신거관(食神去官) — 구응 성공',
          detail: `${sikStem}(식신)이 정관을 제거해 살의 기운만 남기는 거관류살로 혼잡을 해소했습니다.`,
          stem: sikStem,
          tenGodName: tenGodOf(sikStem).name,
        });
      }
    } else if (inStem) {
      seongGyeok = {
        achieved: true,
        title: '살인상생(殺印相生) — 성격(成格)',
        reason: `${inStem}(인성)이 칠살의 공격기를 일간에게 화재(化裁)하여 권위와 학덕으로 전환합니다.${isWeak ? ' 신약하여 살인상생은 이 격의 필수 구원입니다.' : ''}`,
      };
      sangSin = { stem: inStem, tenGodName: tenGodOf(inStem).name, role: '살기를 화재하는 상신(인성)' };
    } else if (!isWeak && geobjaeStem) {
      seongGyeok = {
        achieved: true,
        title: '합살(合殺) — 성격(成格)',
        reason: `${geobjaeStem}(겁재)이 칠살을 합거하여 부지런한 결단의 기운으로 돌립니다.`,
      };
      sangSin = { stem: geobjaeStem, tenGodName: tenGodOf(geobjaeStem).name, role: '칠살을 합거하는 상신(겁재)' };
    } else if (isWeak && salWang) {
      paGyeok.push({
        type: '신약살왕(身弱殺旺)',
        title: '칠살격 파격 — 신약살왕',
        detail: `일간이 ${bodyLevel}인데 칠살이 ${countGod(PYEON_GWAN)}개로 왕성하여 일간이 살을 감당하지 못합니다(신약살왕).`,
      });
    }
  } else if (geokgukKey === '정재격' || geokgukKey === '편재격') {
    const bigeopCount = countGod(BIGEOP);
    if (bigeopCount >= 2) {
      paGyeok.push({
        type: '군겁쟁재(群劫爭財)',
        title: `${geokgukKey} 파격 — 군겁쟁재`,
        detail: `비겁이 ${bigeopCount}개나 투출해 재성을 다투는 군겁쟁재로 재물과 배우자 운이 손상됩니다.`,
      });
      const sikSangStem = hasGod(SIK_SANG);
      const gwanStem = hasGod(GWAN);
      if (sikSangStem) {
        guEung.push({
          title: '식상통관(食傷通關) — 구응 성공',
          detail: `${sikSangStem}(식상)이 비겁의 기운을 끌어내어 재성으로 순환시켜 쟁재를 풀었습니다.`,
          stem: sikSangStem,
          tenGodName: tenGodOf(sikSangStem).name,
        });
        sangSin = { stem: sikSangStem, tenGodName: tenGodOf(sikSangStem).name, role: '비겁을 통관하는 상신(식상)' };
      } else if (gwanStem) {
        guEung.push({
          title: '관살제겁(官殺制劫) — 구응 성공',
          detail: `${gwanStem}(관성)이 비겁을 억압하여 재성을 지켜냈습니다.`,
          stem: gwanStem,
          tenGodName: tenGodOf(gwanStem).name,
        });
        sangSin = { stem: gwanStem, tenGodName: tenGodOf(gwanStem).name, role: '비겁을 제압하는 상신(관성)' };
      }
    }
    if (paGyeok.length === 0 || guEung.length > 0) {
      const sikSangStem2 = hasGod(SIK_SANG);
      const gwanStem2 = hasGod(GWAN);
      if (sikSangStem2) {
        seongGyeok = {
          achieved: true,
          title: '식상생재(食傷生財) — 성격(成格)',
          reason: `${sikSangStem2}(식상)이 재성을 생조하여 자원이 흐름으로 전환되는 발복 구조입니다.`,
        };
        sangSin = sangSin || { stem: sikSangStem2, tenGodName: tenGodOf(sikSangStem2).name, role: '재성을 생조하는 상신(식상)' };
      } else if (gwanStem2) {
        seongGyeok = {
          achieved: true,
          title: '재생관(財生官) — 성격(成格)',
          reason: `${gwanStem2}(관성)이 재성으로 생조되어 재물이 신분과 질서로 안착됩니다.`,
        };
        sangSin = sangSin || { stem: gwanStem2, tenGodName: tenGodOf(gwanStem2).name, role: '재를 호위하는 상신(관성)' };
      }
    }
  } else if (geokgukKey === '식신격') {
    const pyeonInStem = hasGod(PYEON_IN);
    if (pyeonInStem) {
      paGyeok.push({
        type: '도식(梟神奪食)',
        title: '식신격 파격 — 도식',
        detail: `${pyeonInStem}(편인)이 투출해 식신을 강탈하는 도식(梟神奪食)으로 창작·산식의 흐름이 끊깁니다.`,
      });
      const pyeonJaStem = hasGod(PYEON_JA);
      if (pyeonJaStem) {
        guEung.push({
          title: '재성제인(財星制印) — 구응 성공',
          detail: `${pyeonJaStem}(편재)이 편인을 제어하여 식신을 구해냈습니다.`,
          stem: pyeonJaStem,
          tenGodName: tenGodOf(pyeonJaStem).name,
        });
        sangSin = { stem: pyeonJaStem, tenGodName: tenGodOf(pyeonJaStem).name, role: '편인을 제어하는 상신(편재)' };
      }
    }
    if (paGyeok.length === 0 || guEung.length > 0) {
      const jaStem = hasGod(JA);
      if (jaStem) {
        seongGyeok = {
          achieved: true,
          title: '식신생재(食神生財) — 성격(成格)',
          reason: `${jaStem}(재성)이 식신의 산출을 재물로 전환하는 식신생재 발복 격국입니다.`,
        };
        sangSin = sangSin || { stem: jaStem, tenGodName: tenGodOf(jaStem).name, role: '식신을 재로 흘려보내는 상신(재성)' };
      }
    }
  } else if (geokgukKey === '편인격') {
    const pyeonJaStem = hasGod(PYEON_JA);
    if (pyeonJaStem) {
      seongGyeok = {
        achieved: true,
        title: '재성제인(財星制印) — 성격(成格)',
        reason: `${pyeonJaStem}(편재)이 편인을 제어하여 역용(逆用)이 성립, 비범한 통찰이 실용 지혜로 발현됩니다.`,
      };
      sangSin = { stem: pyeonJaStem, tenGodName: tenGodOf(pyeonJaStem).name, role: '편인을 제어하는 상신(편재)' };
    }
    const jaCount = countGod(JA);
    if (jaCount >= 2 && !hasGod(BIGEOP) && !pyeonJaStem) {
      paGyeok.push({
        type: '재다인열(財多印滅)',
        title: '편인격 파격 — 재다인열',
        detail: `재성이 ${jaCount}개로 과다하여 편인의 후원 기반이 침식됩니다(재다인열).`,
      });
    }
  } else if (geokgukKey === '상관격') {
    const inStem = hasGod(IN);
    const jaStem = hasGod(JA);
    if (inStem) {
      seongGyeok = {
        achieved: true,
        title: '상관패인(傷官配印) — 성격(成格)',
        reason: `${inStem}(인성)이 상관의 날카로움을 학문·예술의 깊이로 제어하는 상관패인 귀격입니다.`,
      };
      sangSin = { stem: inStem, tenGodName: tenGodOf(inStem).name, role: '상관을 제어하는 상신(인성)' };
    } else if (jaStem) {
      seongGyeok = {
        achieved: true,
        title: '상관생재(傷官生財) — 성격(成格)',
        reason: `${jaStem}(재성)이 상관의 재능을 실리로 전환하는 상관생재 발복 격국입니다.`,
      };
      sangSin = { stem: jaStem, tenGodName: tenGodOf(jaStem).name, role: '상관을 재로 전환하는 상신(재성)' };
    }
    const jeongGwanStem = hasGod(JEONG_GWAN);
    if (jeongGwanStem) {
      paGyeok.push({
        type: '상관견관(傷官見官)',
        title: '상관격 파격 — 상관견관',
        detail: `${jeongGwanStem}(정관)이 투출해 상관이 관을 정벌하는 상관견관으로 명예 손상 위험이 큽니다.`,
      });
      const inStem2 = hasGod(IN);
      if (inStem2) {
        guEung.push({
          title: '인성제상(印星制傷) — 구응 성공',
          detail: `${inStem2}(인성)이 상관을 제압해 정관을 지켜냈습니다.`,
          stem: inStem2,
          tenGodName: tenGodOf(inStem2).name,
        });
        sangSin = sangSin || { stem: inStem2, tenGodName: tenGodOf(inStem2).name, role: '상관을 제압하는 상신(인성)' };
      } else if (jaStem) {
        guEung.push({
          title: '재화상(財化傷) — 구응 성공',
          detail: `${jaStem}(재성)이 상관의 기운을 재물 생산으로 흘려보내 정관에 이르지 않게 했습니다.`,
          stem: jaStem,
          tenGodName: tenGodOf(jaStem).name,
        });
      }
    }
  } else if (geokgukKey === '양인격') {
    const gwanStem = hasGod(GWAN);
    if (gwanStem) {
      seongGyeok = {
        achieved: true,
        title: '관성제인(官星制刃) — 성격(成格)',
        reason: `${gwanStem}(관성)이 양인의 칼날을 제어해 카리스마가 질서 있는 지도력으로 발현됩니다.`,
      };
      sangSin = { stem: gwanStem, tenGodName: tenGodOf(gwanStem).name, role: '양인을 제어하는 상신(관성)' };
    } else {
      const jaStem = hasGod(JA);
      paGyeok.push({
        type: '신강무제(身強無制)',
        title: '양인격 파격 — 신강무제',
        detail: '관살이 불투출해 양인의 칼날을 거스를 자가 없어 파격입니다(신강무제).',
      });
      if (jaStem) {
        guEung.push({
          title: '재생관(財生官) — 구응 성공',
          detail: `${jaStem}(재성)이 관성의 근원이 되어 간접적으로 양인을 제어합니다.`,
          stem: jaStem,
          tenGodName: tenGodOf(jaStem).name,
        });
        sangSin = { stem: jaStem, tenGodName: tenGodOf(jaStem).name, role: '관성의 근원이 되는 상신(재성)' };
      }
    }
  } else if (geokgukKey === '건록격') {
    const gwanStem = hasGod(GWAN);
    const sikSangStem = hasGod(SIK_SANG);
    const bigeopCount = countGod(BIGEOP);
    if (gwanStem) {
      seongGyeok = {
        achieved: true,
        title: '관성제록(官星制祿) — 성격(成格)',
        reason: `${gwanStem}(관성)이 건록의 자주성에 질서와 명분을 부여하는 성격(成格)입니다.`,
      };
      sangSin = { stem: gwanStem, tenGodName: tenGodOf(gwanStem).name, role: '건록을 제어하는 상신(관성)' };
    } else if (sikSangStem) {
      seongGyeok = {
        achieved: true,
        title: '식상설기(食傷洩氣) — 성격(成格)',
        reason: `${sikSangStem}(식상)이 건록의 강한 기운을 생산적 산출로 흘려보내는 성격(成格)입니다.`,
      };
      sangSin = { stem: sikSangStem, tenGodName: tenGodOf(sikSangStem).name, role: '건록을 설기하는 상신(식상)' };
    } else if (bigeopCount >= 2) {
      paGyeok.push({
        type: '군겁쟁재(群劫爭財)',
        title: '건록격 파격 — 비겁 난무',
        detail: `비겁이 ${bigeopCount}개로 난무하고 관성·식상 모두 없어 파격입니다.`,
      });
    }
  } else if (geokgukKey === '정인격') {
    const gwanStem = hasGod(GWAN);
    const jaStem = hasGod(JA);
    if (gwanStem) {
      seongGyeok = {
        achieved: true,
        title: '관인상생(官印相生) — 성격(成格)',
        reason: `${gwanStem}(관성)이 인성을 생조하여 명분과 학덕이 함께 세워지는 관인상생 귀격입니다.`,
      };
      sangSin = { stem: gwanStem, tenGodName: tenGodOf(gwanStem).name, role: '인성을 생조하는 상신(관성)' };
    }
    if (jaStem && !gwanStem) {
      paGyeok.push({
        type: '재파인(財壞印)',
        title: '정인격 파격 — 재파인',
        detail: `${jaStem}(재성)이 인성을 극하여 후원·학덕의 기반이 훼손됩니다(재파인).`,
      });
      const bigeopStem = hasGod(BIGEOP);
      if (bigeopStem) {
        guEung.push({
          title: '비겁분재(比劫分財) — 구응 성공',
          detail: `${bigeopStem}(비겁)이 재성을 분산시켜 인성을 구해냈습니다.`,
          stem: bigeopStem,
          tenGodName: tenGodOf(bigeopStem).name,
        });
        sangSin = { stem: bigeopStem, tenGodName: tenGodOf(bigeopStem).name, role: '재를 분산해 인을 구하는 상신(비겁)' };
      }
    }
  }

  // 6. 최종 격국 판정
  if (paGyeok.length > 0) {
    if (guEung.length > 0) {
      verdict = '구응(救應) 성공 · 성격(成格) 회복';
      verdictReason = `${paGyeok[0].type} 파격이 있었으나 ${guEung[0].title.split(' — ')[0]}으로 구응되어 격국이 회복되었습니다`;
    } else {
      verdict = '파격(破格)';
      verdictReason = `${paGyeok[0].type} 파격이 검출되었고 이를 구원할 구응(救應)이 없어 파격으로 판정됩니다`;
    }
  } else if (seongGyeok?.achieved) {
    verdict = '성격(成格)';
    verdictReason = `${seongGyeok.title.split(' — ')[0]} 조건이 충족되어 격국이 완전히 성립되었습니다`;
  }

  // 파격(破格) 국면에서는 상신(相神)이 성립하지 않는다 (상신은 격국을 성립시키는 신)
  if (verdict === '파격(破格)') {
    sangSin = null;
  }

  return {
    geokgukName: geokgukKey,
    geokgukFull,
    chosenStem,
    tenGodName: finalTenGod.name,
    sourceKind,
    reason,
    shinsalClass,
    yongMethod,
    verdict,
    verdictReason,
    seongGyeok,
    paGyeok,
    guEung,
    sangSin,
  };
}

// 10대 정통 격국별 현대적 직업·사회적 재능 적성 아키타입
const CAREER_ARCHETYPES: Record<string, { archetype: string; socialTalent: string; talents: string[]; careers: string[] }> = {
  '정관격': {
    archetype: '공직·대기업 조직 리더형',
    socialTalent: '질서와 명분 위에서 책임을 짊어지는 대표적인 조직 신뢰형 리더십',
    talents: ['원칙과 규율 준수', '책임감 있는 의사결정', '조직 조율과 중재력', '공신력 있는 평판 관리'],
    careers: ['공무원·공기업 임원', '대기업 관리자·경영직', '법무·감사·준법감시', '금융 심사역·공공기술직'],
  },
  '칠살격': {
    archetype: '위기 돌파·전략 액션 리더형',
    socialTalent: '위기와 경쟁 구도에서 강한 카리스마로 조직을 이끄는 결단형 리더십',
    talents: ['위기 상황 결단력', '경쟁 구도 분석', '강한 추진력과 규율화', '갈등 정면 돌파'],
    careers: ['경영 전략·컨설팅', '세일즈 조직 총괄', '특수 전문 기관장', '스타트업 액션 리더'],
  },
  '정재격': {
    archetype: '재무·운영 관리 전문가형',
    socialTalent: '성실한 축적과 정확한 관리로 신뢰를 얻는 실속형 전문가 기질',
    talents: ['정밀한 자산 관리', '체계적 운영 능력', '약속과 신용 유지', '현실 감각 있는 판단'],
    careers: ['재무·회계 전문가', '운영·품질 관리자', '부동산·임대 실속 사업', '공공 재정 관리직'],
  },
  '편재격': {
    archetype: '플랫폼 사업·투자형',
    socialTalent: '기회를 넓게 포착해 스케일을 키우는 사업 감각과 유통형 인맥',
    talents: ['기회 포착 속도', '대형 거래 감각', '유통·네트워크 구축', '위험 분산 투자'],
    careers: ['플랫폼·유통 사업', '투자·자산운용', '무역·도소매 스케일업', '창업 후 매각(엑시트) 전략'],
  },
  '식신격': {
    archetype: '전문 기술·스타트업 개척형',
    socialTalent: '꾸준한 산출과 장인정신으로 전문 영역을 개척하는 실체적 재능',
    talents: ['깊이 있는 기술 연구', '지속적 산출 능력', '맛·콘텐츠 감각', '건강한 운영 리듬'],
    careers: ['기술 전문가·아키텍트', '스타트업 창업(기술 기반)', '요리·제작·공방 운영', '콘텐츠 제작·강의'],
  },
  '상관격': {
    archetype: '혁신 크리에이터·콘텐츠 개척형',
    socialTalent: '기성 질서를 뒤집는 창의와 언변으로 화제를 만드는 혁신가 기질',
    talents: ['파격적 아이디어', '설득력 있는 언변', '기존 규범의 재해석', '예술적 표현력'],
    careers: ['크리에이터·방송인', '혁신 제품 기획자', '변호사·논객형 전문가', '에이전시·브랜딩 창업'],
  },
  '정인격': {
    archetype: '학문·교육·정책 설계형',
    socialTalent: '깊은 학덕과 자비로 사람을 가르치고 길러내는 스승의 기질',
    talents: ['체계적 지식 정리', '후배 양성과 멘토링', '윤리적 판단력', '장기 설계 능력'],
    careers: ['연구자·교수', '교육자·멘토', '정책 기획·법제 전문가', '종교·상담 지도자'],
  },
  '편인격': {
    archetype: '기획·전략·특수 전문 기술형',
    socialTalent: '남이 보지 못하는 통찰로 특수 영역을 파고드는 전략가 기질',
    talents: ['비범한 통찰과 직관', '특수 기술·암묵지 습득', '독립적 기획력', '심층 분석 능력'],
    careers: ['전략 기획자·애널리스트', '의료·법률·기술 특수직', '리서치·데이터 과학', '독립 컨설턴트'],
  },
  '건록격': {
    archetype: '자수성가·독립 개척형',
    socialTalent: '타깃 없이 스스로 일으켜 세우는 자립형 개척자의 기상',
    talents: ['강한 자주성·주체성', '몸으로 부딪히는 실행력', '가문·조직의 수장 기질', '위기에서의 복원력'],
    careers: ['스타트업 창업가', '1인 전문 사업가', '프리랜서 전문가', '가업·조직의 후계 수장'],
  },
  '양인격': {
    archetype: '경쟁 돌파·개척 리더형',
    socialTalent: '칼을 쥔 듯한 결단으로 난관을 돌파하는 영웅적 기상',
    talents: ['강인한 담력과 카리스마', '난관 돌파 결단력', '경쟁 구도 승부사 기질', '개혁 추진력'],
    careers: ['스포츠·군경·수사 전문가', '개혁형 경영자', '외과·응급 의료 전문가', '경쟁 산업 개척 창업'],
  },
  '겁재격': {
    archetype: '수금(收金)·경쟁 개척형',
    socialTalent: '경쟁 속에서 자원을 모아 회수하는 강한 집요함과 승부 기질',
    talents: ['자원 동원력', '승부처 집요함', '동료 장악력', '빠른 회복탄력성'],
    careers: ['영업 총괄·수금 전문', '경매·회수 전문가', '동업 사업 운영', '경쟁 입찰·수주 전문가'],
  },
};

/**
 * 정통 사주 10대 격국 성격(成格)·파격(破格) 수리 판정 엔진 진입점
 */
export function calculateGeokguk(params: {
  profile?: UserProfile | null;
  now?: Date;
  question?: string;
}): GeokgukResult {
  const profile = params.profile;
  const now = params.now || new Date();
  const question = (params.question || '').trim();
  const birthdateStr = profile?.basic?.birthdate?.trim() || '';

  if (!profile || !birthdateStr) {
    return {
      status: 'skipped',
      engineVersion: GEOKGUK_ENGINE_VERSION,
      method: GEOKGUK_METHOD,
      dayMaster: null,
      pillarsSnapshot: null,
      monthCommand: null,
      geokgukType: '',
      geokgukName: '',
      shinsalClass: '중성신(中性神)',
      yongMethod: '',
      verdict: '원격(原格) 성립',
      verdictReason: '',
      seongGyeok: null,
      paGyeok: [],
      guEung: [],
      sangSin: null,
      careerReport: null,
      note: '사용자 생년월일이 입력되지 않아 정통 격국 수리 판정을 건너뜁니다.',
    };
  }

  try {
    const saju = calculateDetailedSaju(profile);
    if (!saju) {
      return {
        status: 'error',
        engineVersion: GEOKGUK_ENGINE_VERSION,
        method: GEOKGUK_METHOD,
        dayMaster: null,
        pillarsSnapshot: null,
        monthCommand: null,
        geokgukType: '',
        geokgukName: '',
        shinsalClass: '중성신(中性神)',
        yongMethod: '',
        verdict: '원격(原格) 성립',
        verdictReason: '',
        seongGyeok: null,
        paGyeok: [],
        guEung: [],
        sangSin: null,
        careerReport: null,
        note: '사주 원국 산출 실패로 격국 판정을 진행할 수 없습니다.',
      };
    }

    const dayStem = saju.pillars.day.gan;
    const monthBranch = saju.pillars.month.zhi;
    const stems = [saju.pillars.year.gan, saju.pillars.month.gan, saju.pillars.hour?.gan].filter(
      (s): s is string => Boolean(s)
    );

    const decision = decideGeokgukFromPillars({
      dayStem,
      monthBranch,
      stems,
      bodyLevel: saju.bodyStrength.level,
    });

    const archetype = CAREER_ARCHETYPES[decision.geokgukName] || null;
    const temporalGeokgukRhythm = getTemporalGeokgukRhythm(now);
    const situationalGeokgukAudit = /직업|진로|적성|이직|사업|일/.test(question)
      ? {
          focusTheme: `${decision.geokgukFull} · ${archetype?.archetype || '적성'} 진로 활용`,
          structuralNote: decision.verdictReason,
          actionGuide: archetype ? `핵심 강점(${archetype.talents.slice(0, 2).join(', ')})을 살리는 역할에 집중하십시오.` : decision.yongMethod,
        }
      : {
          focusTheme: `${decision.geokgukFull} (${decision.verdict})`,
          structuralNote: decision.verdictReason,
          actionGuide: decision.sangSin ? `상신 [${decision.sangSin.tenGodName}]의 균형 역할을 의식하십시오.` : decision.yongMethod,
        };

    const geokgukSynthesisMatrix = {
      coreInsight: `[${decision.geokgukFull}] ${decision.verdict} — ${decision.shinsalClass}`,
      recommendedAction: decision.sangSin
        ? `상신 ${decision.sangSin.tenGodName}(${decision.sangSin.role}) 활용`
        : decision.yongMethod,
      cautionNotice: decision.paGyeok.length > 0
        ? `${decision.paGyeok[0].type} 요인을 의식해 조율하는 태도가 필요합니다.`
        : '격국 명칭 자체보다 자신의 강점을 현실에 맞게 쓰는 태도가 더 중요합니다.',
    };

    const boundaryNotice = '본 결과는 자평진전 월령 사령·투간 수리에 기반한 정성적 성향·적성 안내이며, 우열이나 확정적 진로 판정이 아닙니다.';
    const reflectiveQuestion = question
      ? `"${question}"의 문제를 풀 때 내 ${decision.geokgukFull} 구조의 강점과 상신(${decision.sangSin?.tenGodName ?? '조율 축'})을 어떤 역할로 먼저 세우시겠어요?`
      : `${decision.geokgukFull}(${decision.verdict})이 일과 관계에서 가장 자연스럽게 힘을 발휘할 수 있는 무대는 어디라고 느끼시나요?`;

    return {
      status: 'calculated',
      engineVersion: GEOKGUK_ENGINE_VERSION,
      ritualAction: geokgukSynthesisMatrix.recommendedAction,
      reflectionFocus: reflectiveQuestion,
      calculatedAtKst: temporalGeokgukRhythm.kstTimeLabel,
      method: GEOKGUK_METHOD,
      dayMaster: { stem: dayStem, korean: STEM_KOREAN[dayStem] || dayStem },
      pillarsSnapshot: {
        year: saju.pillars.year.full || `${saju.pillars.year.gan}${saju.pillars.year.zhi}`,
        month: saju.pillars.month.full || `${saju.pillars.month.gan}${saju.pillars.month.zhi}`,
        day: saju.pillars.day.full || `${saju.pillars.day.gan}${saju.pillars.day.zhi}`,
        hour: saju.pillars.hour ? `${saju.pillars.hour.gan}${saju.pillars.hour.zhi}` : null,
      },
      monthCommand: {
        branch: monthBranch,
        branchKr: BRANCH_KOREAN[monthBranch] || monthBranch,
        sourceKind: decision.sourceKind,
        stem: decision.chosenStem,
        stemKr: STEM_KOREAN[decision.chosenStem] || decision.chosenStem,
        tenGodName: decision.tenGodName,
        reason: decision.reason,
      },
      geokgukType: decision.geokgukFull,
      geokgukName: decision.geokgukName,
      shinsalClass: decision.shinsalClass,
      yongMethod: decision.yongMethod,
      verdict: decision.verdict,
      verdictReason: decision.verdictReason,
      seongGyeok: decision.seongGyeok,
      paGyeok: decision.paGyeok,
      guEung: decision.guEung,
      sangSin: decision.sangSin,
      careerReport: archetype
        ? {
            archetype: archetype.archetype,
            socialTalent: archetype.socialTalent,
            talents: [...archetype.talents],
            careers: [...archetype.careers],
          }
        : null,
      situationalGeokgukAudit,
      temporalGeokgukRhythm,
      geokgukSynthesisMatrix,
      reflectiveQuestion,
      boundaryNotice,
      interpretiveBoundary: boundaryNotice,
    };
  } catch (err: any) {
    return {
      status: 'error',
      engineVersion: GEOKGUK_ENGINE_VERSION,
      method: GEOKGUK_METHOD,
      dayMaster: null,
      pillarsSnapshot: null,
      monthCommand: null,
      geokgukType: '',
      geokgukName: '',
      shinsalClass: '중성신(中性神)',
      yongMethod: '',
      verdict: '원격(原格) 성립',
      verdictReason: '',
      seongGyeok: null,
      paGyeok: [],
      guEung: [],
      sangSin: null,
      careerReport: null,
      note: err?.message || '격국 수리 판정 오류',
    };
  }
}


/**
 * 프롬프트 주입용 정통 격국 판정 포맷터
 */
export function formatGeokgukPrompt(result: GeokgukResult): string {
  if (result.status !== 'calculated' || !result.monthCommand) {
    return result.note ? `[정통 격국: ${result.note}]` : '';
  }

  const lines: string[] = [];
  lines.push(`[정통 사주 10대 격국(格局) 성격·파격 수리 판정 리포트 (${GEOKGUK_ENGINE_VERSION})]`);
  if (result.calculatedAtKst) lines.push(`- 연산 시각: ${result.calculatedAtKst}`);
  lines.push(`- 일간: ${result.dayMaster?.korean ?? ''}${result.dayMaster?.stem ?? ''} | 원국: ${result.pillarsSnapshot?.year ?? '?'} ${result.pillarsSnapshot?.month ?? '?'} ${result.pillarsSnapshot?.day ?? '?'} ${result.pillarsSnapshot?.hour ? result.pillarsSnapshot.hour : '(생시 미입력)'}`);
  lines.push(`- 격국: ${result.geokgukType} (${result.shinsalClass})`);
  lines.push(`- 격국 성립 원천: ${result.monthCommand.sourceKind} — 월지 ${result.monthCommand.branch}(${result.monthCommand.branchKr}) 사령 ${result.monthCommand.tenGodName}`);
  lines.push(`  * 성립 근거: ${result.monthCommand.reason}`);
  lines.push(`- 운용 원칙: ${result.yongMethod}`);

  if (result.seongGyeok?.achieved) {
    lines.push(`- 성격(成格): ${result.seongGyeok.title}`);
    lines.push(`  * ${result.seongGyeok.reason}`);
  }

  if (result.paGyeok.length > 0) {
    lines.push(`- 파격(破格) 검출: ${result.paGyeok.map((p) => p.type).join(', ')}`);
    result.paGyeok.forEach((p) => lines.push(`  * ${p.title}: ${p.detail}`));
  }

  if (result.guEung.length > 0) {
    lines.push(`- 구응(救應): ${result.guEung.map((g) => g.title).join(', ')}`);
    result.guEung.forEach((g) => lines.push(`  * ${g.title}: ${g.detail}`));
  }

  lines.push(`- 최종 판정: ${result.verdict} — ${result.verdictReason}`);

  if (result.sangSin) {
    lines.push(`- 상신(相神): ${result.sangSin.tenGodName}${result.sangSin.stem ? `(${result.sangSin.stem})` : ''} — ${result.sangSin.role}`);
  }

  if (result.situationalGeokgukAudit) {
    lines.push(`- 질문 맥락 감사 (${result.situationalGeokgukAudit.focusTheme}): ${result.situationalGeokgukAudit.structuralNote} / ${result.situationalGeokgukAudit.actionGuide}`);
  }

  if (result.temporalGeokgukRhythm) {
    lines.push(`- KST 시공간 격국 리듬: ${result.temporalGeokgukRhythm.commandWatchWindow} / ${result.temporalGeokgukRhythm.seasonalGeokgukTone}`);
    lines.push(`  * 시공간 지침: ${result.temporalGeokgukRhythm.temporalGuidance}`);
  }

  if (result.geokgukSynthesisMatrix) {
    lines.push(`- 격국 교차 매트릭스: 핵심(${result.geokgukSynthesisMatrix.coreInsight}) | 실행(${result.geokgukSynthesisMatrix.recommendedAction}) | 주의(${result.geokgukSynthesisMatrix.cautionNotice})`);
  }

  if (result.careerReport) {
    lines.push(`- 격국 기반 현대적 적성 리포트:`);
    lines.push(`  * 사회적 재능 유형: ${result.careerReport.archetype}`);
    lines.push(`  * 재능 설명: ${result.careerReport.socialTalent}`);
    lines.push(`  * 핵심 재능: ${result.careerReport.talents.join(' · ')}`);
    lines.push(`  * 추천 진로: ${result.careerReport.careers.join(', ')}`);
  }

  if (result.boundaryNotice) lines.push(`- 해석 경계: ${result.boundaryNotice}`);
  if ((result as GeokgukResult & { reflectiveQuestion?: string }).reflectiveQuestion) {
    lines.push(`- 성찰 질문: ${(result as GeokgukResult & { reflectiveQuestion?: string }).reflectiveQuestion}`);
  }
  lines.push(`- [AI 해석 절대 지침]: 본 리포트는 자평진전(子平眞詮) 월령 사령·투간 수리로 결정론 산출된 격국 판정입니다. 격국 명칭, 성격(成格)/파격(破格)/구응(救應) 판정, 상신을 임의 변경하지 말고, 이를 축으로 성격·재능·직업 방향 상담을 전개하십시오.`);

  return lines.join('\n');
}
