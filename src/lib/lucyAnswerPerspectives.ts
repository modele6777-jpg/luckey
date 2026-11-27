import { getActuallyUsedCalculationAudit, type CalculationAuditItem } from '@/lib/divination/calculationAudit';
import { ALL_DCE_ENGINES, type DceEngineMeta } from '@/lib/divination/deterministicEngine';
import { DIVINATION_TOOL_TAB_ORDER } from '@/lib/divination/trayTabs';
import type { DivinationToolId } from '@/lib/lucyToolRegistry';

/**
 * 💬 메시지 끝 "이 답변 관점/도구" 버튼이 읽는, 답변마다 저장된 메타데이터.
 * 새 답변은 deepPerspectiveKeys·calculationAudit을 메시지에 남기고, 예전 답변도 있다면 그대로 읽는다.
 */
export interface MessageEngineSource {
  /** 이 답변에서 루시가 골라 쓴 심층 관점 키 (계산 기록이 없어도 상징 참고로 쓴 것). */
  deepPerspectiveKeys?: readonly string[] | null;
  /** 이 답변에 실제로 전달된 계산 기록 (상태: calculated·partial·symbolic만 사용으로 본다). */
  calculationAudit?: readonly CalculationAuditItem[] | null;
  /** 앱이 실제로 뽑은 카드가 있는 답변은 타로 도구를 쓴 것으로 본다. */
  tarotDraw?: { markers?: string; revealedCardIds?: readonly string[] } | null;
}

export type LucyAnswerEngineStatus = 'calculated' | 'partial' | 'symbolic';

export interface LucyAnswerEngineRef {
  key: string;
  nameKo: string;
  icon: string;
  category: 'foundational' | 'deep_master';
  status: LucyAnswerEngineStatus;
  /** 점술 도구함의 탭으로 바로 열 수 있는 15대 기초 도구일 때만 채워진다. */
  toolId?: DivinationToolId;
}

export interface LucyAnswerEngines {
  /** 이 답변에 쓰인 기초 도구 (사주·타로·13대 도구). 점술모드 메시지 끝에서 '도구' 버튼이 된다. */
  tools: LucyAnswerEngineRef[];
  /** 이 답변의 심층 관점. 일반 채팅·점술모드 모두 '관점' 버튼이 된다. */
  perspectives: LucyAnswerEngineRef[];
  /** 도구 + 관점 (중복 없이, 쓰인 순서 그대로). */
  all: LucyAnswerEngineRef[];
}

export const EMPTY_ANSWER_ENGINES: LucyAnswerEngines = { tools: [], perspectives: [], all: [] };

const ENGINE_BY_KEY: ReadonlyMap<string, DceEngineMeta> = new Map(
  ALL_DCE_ENGINES.map(engine => [engine.key, engine] as const),
);

const TOOL_TAB_IDS = new Set<string>(DIVINATION_TOOL_TAB_ORDER);

const USED_STATUSES = new Set<string>(['calculated', 'partial', 'symbolic']);

function toUsedStatus(status: CalculationAuditItem['status']): LucyAnswerEngineStatus | null {
  return USED_STATUSES.has(status) ? status as LucyAnswerEngineStatus : null;
}

function engineRef(
  key: string,
  status: LucyAnswerEngineStatus,
  fallbackName?: string,
): LucyAnswerEngineRef | null {
  const engine = ENGINE_BY_KEY.get(key);
  if (!engine) return null;
  const ref: LucyAnswerEngineRef = {
    key,
    nameKo: engine.nameKo || fallbackName || key,
    icon: engine.icon || '✨',
    category: engine.category,
    status,
  };
  if (engine.category === 'foundational' && TOOL_TAB_IDS.has(key)) ref.toolId = key as DivinationToolId;
  return ref;
}

/**
 * 한 답변의 도구·관점 목록.
 * - 계산 기록(audit)에서 실제로 답변에 전달된 계산·부분 계산·상징 참고만 사용으로 본다.
 * - 심층 관점 키는 계산 기록에 없어도 '상징 참고'로 담는다(중복 제외).
 * - 앱이 실제로 뽑은 타로 카드가 있으면 타로를 도구로 담는다.
 */
export function resolveMessagePerspectives(
  msg: MessageEngineSource | null | undefined,
): LucyAnswerEngines {
  if (!msg) return EMPTY_ANSWER_ENGINES;

  const used = new Map<string, LucyAnswerEngineRef>();
  const order: string[] = [];
  const push = (ref: LucyAnswerEngineRef | null) => {
    if (!ref || used.has(ref.key)) return;
    used.set(ref.key, ref);
    order.push(ref.key);
  };

  for (const item of getActuallyUsedCalculationAudit(msg.calculationAudit)) {
    const status = toUsedStatus(item.status);
    if (!status) continue;
    push(engineRef(item.toolId, status, item.name));
  }

  for (const key of msg.deepPerspectiveKeys ?? []) {
    if (!key || used.has(key)) continue;
    push(engineRef(key, 'symbolic'));
  }

  if (msg.tarotDraw && !used.has('tarot')) {
    const drawn = Boolean(msg.tarotDraw.markers && msg.tarotDraw.markers.trim())
      || (msg.tarotDraw.revealedCardIds?.length ?? 0) > 0;
    if (drawn) push(engineRef('tarot', 'calculated'));
  }

  const all = order.map(key => used.get(key)!).filter(Boolean);
  return {
    tools: all.filter(item => item.category === 'foundational'),
    perspectives: all.filter(item => item.category === 'deep_master'),
    all,
  };
}

/**
 * 엔진함이 이전 스크롤 위치를 복원할지.
 * 답변 끝 관점 버튼으로 열린 창은 그 관점 카드로 가야 하므로 복원(0 포함)으로 덮어쓰지 않는다.
 */
export function shouldRestoreCatalogScroll(isOpen: boolean, focusEngineKey: string): boolean {
  return isOpen && !focusEngineKey;
}

/** 메시지 끝 버튼을 그릴지: 사용자 메시지·인사말·생성 중에는 그리지 않는다. */
export function shouldShowAnswerEngines(params: {
  role?: string | null;
  isGreeting?: boolean;
  isGenerating?: boolean;
  engines: LucyAnswerEngines;
}): boolean {
  if (params.role === 'user' || params.role === 'system') return false;
  if (params.isGreeting || params.isGenerating) return false;
  return params.engines.all.length > 0;
}

export const ANSWER_ENGINE_STATUS_LABELS: Record<LucyAnswerEngineStatus, string> = {
  calculated: '계산 완료',
  partial: '부분 계산',
  symbolic: '상징 참고',
};
