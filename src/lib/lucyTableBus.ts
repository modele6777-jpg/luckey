import type { SajuAnalysisResult } from '@/lib/sajuAnalysis';
import type { CalculationAuditItem } from '@/lib/divination/calculationAudit';
import type { ToolFact } from '@/lib/lucyMasterToolFacts';

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
}

let state: LucyTableState = { saju: null, lastAnswer: '', lastAnswerHasTarot: false, answerVersion: 0, tools: [], concern: '', facts: {}, toolData: {} };

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

export function publishTableTools(tools: readonly CalculationAuditItem[], concern: string, facts: Record<string, ToolFact[]> = {}, toolData: Record<string, unknown> = {}): void {
  state = { ...state, tools: [...tools], concern, facts, toolData };
  emit();
}

export function clearTableTools(): void {
  if (state.tools.length === 0 && !state.concern) return;
  state = { ...state, tools: [], concern: '', facts: {}, toolData: {} };
  emit();
}

export function publishTableAnswer(text: string): void {
  if (!text || text === state.lastAnswer) return;
  state = { ...state, lastAnswer: text, lastAnswerHasTarot: /\[TAROT:/i.test(text), answerVersion: state.answerVersion + 1 };
  emit();
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
