import type { SajuAnalysisResult } from '@/lib/sajuAnalysis';
import type { CalculationAuditItem } from '@/lib/divination/calculationAudit';
import type { ToolFact } from '@/lib/lucyMasterToolFacts';
import type { LucyActiveEngineTray } from '@/lib/lucyActiveEngineTray';
import type { DivinationToolId } from '@/lib/lucyToolRegistry';

/**
 * Lucy Master's unfolded left table listens to what Lucy is doing in the right pane:
 * the counselled person's saju and Lucy's latest answer. Data only, never instructions.
 */
export const LUCY_TABLE_EVENT = 'prism:lucy_table_update';

export interface LucyTableState {
  saju: SajuAnalysisResult | null;
  lastAnswer: string;
  lastAnswerHasTarot: boolean;
  answerVersion: number;
  /** 3단계(심층)에서 13대 도구가 어떻게 계산됐는지, 그리고 그때의 중심 고민. */
  tools: CalculationAuditItem[];
  concern: string;
  /** 도구별 실제 계산 결과 핵심 줄 (양피지 두루마리용). */
  facts: Record<string, ToolFact[]>;
  /** 도구별 계산 원자료 (전용 화면용, 계산된 도구만). */
  toolData: Record<string, unknown>;
  /** 이번 질문에 루시가 고른 기초 도구·심층 관점 중 실제로 쓴 것만 (도구함 표시용). */
  activeEngines: LucyActiveEngineTray;
  /** 이번 상담에서 손님이 마지막으로 직접 뽑은 카드 (접힌 화면 도구 창에서 다시 보기). */
  cards: Array<{ id: string; nameKo: string; reversed: boolean; imageUrl?: string; orientationKo?: string }>;
}

const EMPTY_ACTIVE_ENGINES: LucyActiveEngineTray = { foundational: [], deep: [], total: 0 };

let state: LucyTableState = { saju: null, lastAnswer: '', lastAnswerHasTarot: false, answerVersion: 0, tools: [], concern: '', facts: {}, toolData: {}, activeEngines: EMPTY_ACTIVE_ENGINES, cards: [] };

export function getLucyTableState(): LucyTableState {
  return state;
}

function emit() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(LUCY_TABLE_EVENT, { detail: state }));
}

export function publishTableSaju(saju: SajuAnalysisResult | null): void {
  if (state.saju === saju) return;
  state = { ...state, saju };
  emit();
}

export function publishTableTools(
  tools: readonly CalculationAuditItem[],
  concern: string,
  facts: Record<string, ToolFact[]> = {},
  toolData: Record<string, unknown> = {},
  activeEngines: LucyActiveEngineTray = EMPTY_ACTIVE_ENGINES,
): void {
  state = { ...state, tools: [...tools], concern, facts, toolData, activeEngines };
  emit();
}

/** 💬 일반 대화에서 루시가 고른 심층 관점만 갱신한다 (엔진함의 '이번 대화에서 쓴 관점' 표시용). */
export function publishTableActiveEngines(activeEngines: LucyActiveEngineTray, concern = ''): void {
  state = { ...state, activeEngines, concern };
  emit();
}

/** 점술모드에서 뽑은 카드 (publishLucyTarotDraw 와 같은 이벤트를 듣는다). */
const TAROT_DRAWN_EVENT = 'prism:lucy_tarot_drawn';
if (typeof window !== 'undefined') {
  window.addEventListener(TAROT_DRAWN_EVENT, (e: Event) => {
    const cards = (e as CustomEvent<{ cards?: Array<Record<string, unknown>> }>).detail?.cards;
    if (!Array.isArray(cards) || cards.length === 0) return;
    state = {
      ...state,
      cards: cards.map(c => ({ id: String(c.id ?? ''), nameKo: String(c.nameKo ?? c.name ?? ''), reversed: Boolean(c.reversed), imageUrl: typeof c.imageUrl === 'string' ? c.imageUrl : undefined, orientationKo: typeof c.orientationKo === 'string' ? c.orientationKo : undefined })),
    };
    emit();
  });
  // 점술모드에 들어가거나 나오면 지난 상담의 도구·카드는 비운다 (펼친/접힌 화면 모두).
  window.addEventListener('prism:lucy_master_mode', () => clearTableTools());
}

export function clearTableTools(): void {
  const alreadyEmpty = state.tools.length === 0 && !state.concern && state.cards.length === 0
    && state.activeEngines.total === 0;
  if (alreadyEmpty) return;
  state = { ...state, tools: [], concern: '', facts: {}, toolData: {}, activeEngines: EMPTY_ACTIVE_ENGINES, cards: [] };
  emit();
}

export function publishTableAnswer(text: string): void {
  if (!text || text === state.lastAnswer) return;
  state = { ...state, lastAnswer: text, lastAnswerHasTarot: /\[TAROT:/i.test(text), answerVersion: state.answerVersion + 1 };
  emit();
}

/* ─────────────────────────────────────────────────────────────
 * 💬 답변 끝 버튼 → 함 이동
 * - 관점 버튼: 엔진함을 열고 그 관점 설명으로 스크롤·하이라이트
 * - 도구 버튼: 점술 도구함을 열고 그 도구 탭을 바로 선택
 * 요청은 모듈에 남겨 두어, 창이 나중에 마운트되어도 같은 항목으로 이동한다.
 * ───────────────────────────────────────────────────────────── */

export interface LucyEngineFocusRequest {
  engineKey: string;
  requestId: number;
}

export interface LucyDivinationToolRequest {
  toolId: DivinationToolId;
  requestId: number;
}

/** 엔진함을 열어 달라는 요청 (관점 버튼). */
export const LUCY_ENGINE_BOX_OPEN_EVENT = 'prism:lucy_engine_box_open';
/** 엔진함 안에서 이 관점으로 이동해 달라는 요청. */
export const LUCY_ENGINE_FOCUS_EVENT = 'prism:lucy_engine_focus';
/** 점술 도구함을 열어 달라는 요청 (도구 버튼). */
export const LUCY_DIVINATION_TOOL_EVENT = 'prism:lucy_divination_tool';

let engineFocus: LucyEngineFocusRequest | null = null;
let divinationTool: LucyDivinationToolRequest | null = null;
let requestSequence = 0;

function dispatchToWindow(name: string, detail: unknown) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(name, { detail }));
}

/** 관점 버튼: 엔진함을 열고 그 관점 설명으로 이동한다. */
export function openEngineAtPerspective(engineKey: string): void {
  if (!engineKey) return;
  engineFocus = { engineKey, requestId: ++requestSequence };
  dispatchToWindow(LUCY_ENGINE_FOCUS_EVENT, engineFocus);
  dispatchToWindow(LUCY_ENGINE_BOX_OPEN_EVENT, engineFocus);
}

/** 도구 버튼: 점술 도구함을 열고 그 도구 탭을 고른다. */
export function openDivinationToolTab(toolId: DivinationToolId): void {
  if (!toolId) return;
  divinationTool = { toolId, requestId: ++requestSequence };
  dispatchToWindow(LUCY_DIVINATION_TOOL_EVENT, divinationTool);
}

export function getLastEngineFocus(): LucyEngineFocusRequest | null {
  return engineFocus;
}

export function clearEngineFocus(): void {
  engineFocus = null;
}

export function getLastDivinationToolRequest(): LucyDivinationToolRequest | null {
  return divinationTool;
}

export function clearDivinationToolRequest(): void {
  divinationTool = null;
}

/** Which parts of the chart Lucy's answer talks about, so the board can light them up. */

export function sajuFocusFromAnswer(text: string): { pillars: Set<'year' | 'month' | 'day' | 'hour'>; elements: Set<string>; daeun: boolean } {
  const pillars = new Set<'year' | 'month' | 'day' | 'hour'>();
  const elements = new Set<string>();
  const clean = text || '';
  if (/년주|연주|태어난\s*해/.test(clean)) pillars.add('year');
  if (/월주|태어난\s*달|월지/.test(clean)) pillars.add('month');
  if (/일주|일간|일지|본원|나\s*자신의\s*기운/.test(clean)) pillars.add('day');
  if (/시주|태어난\s*시/.test(clean)) pillars.add('hour');
  for (const [element, pattern] of [
    ['목', /목\(木\)|목\s*기운|나무\s*기운|木/],
    ['화', /화\(火\)|화\s*기운|불\s*기운|火/],
    ['토', /토\(土\)|토\s*기운|흙\s*기운|土/],
    ['금', /금\(金\)|금\s*기운|쇠\s*기운|金/],
    ['수', /수\(水\)|수\s*기운|물\s*기운|水/],
  ] as const) if (pattern.test(clean)) elements.add(element);
  return { pillars, elements, daeun: /대운|10년\s*운|십년\s*운/.test(clean) };
}
