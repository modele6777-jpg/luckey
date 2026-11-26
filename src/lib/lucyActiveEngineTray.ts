import { getActuallyUsedCalculationAudit, type CalculationAuditItem } from '@/lib/divination/calculationAudit';
import { ALL_DCE_ENGINES, type DceEngineMeta } from '@/lib/divination/deterministicEngine';
import { getEngineCatalogMeaning } from '@/lib/divination/engineCatalog';
import { CONCERN_TOOL_ORDER } from '@/lib/divination/concernToolOrder';
import { detectMasterConcernTopic } from '@/lib/lucyMasterPrompts';

/**
 * 📚 점술모드 도구함(엔진함)은 등록된 515개를 늘 나열하지 않는다.
 * 루시가 이번 질문·고민에 맞춰 고른 기초 도구와 심층 관점 중, 실제로 답변에 쓴 것만 담는다.
 */
export type LucyTrayEngineStatus = 'calculated' | 'partial' | 'symbolic';

export interface LucyTrayEngineItem {
  key: string;
  nameKo: string;
  category: 'foundational' | 'deep_master';
  status: LucyTrayEngineStatus;
  /** 이 도구·관점의 한 줄 뜻 (카탈로그 기준) */
  meaning: string;
  /** 계산 한계·주의 한 줄 (있을 때만) */
  note?: string;
}

export interface LucyActiveEngineTray {
  /** 이번 질문에 실제로 쓴 기초 도구 (고민에 잘 맞는 순서) */
  foundational: LucyTrayEngineItem[];
  /** 이번 질문에 루시가 고른 심층 관점 (상징 참고) */
  deep: LucyTrayEngineItem[];
  total: number;
}

export const EMPTY_ACTIVE_ENGINE_TRAY_GUIDE = '질문을 보내면 루시가 이 고민에 맞춰 고른 도구와 관점이 여기에 표시돼요';

const ENGINE_BY_KEY: ReadonlyMap<string, DceEngineMeta> = new Map(
  ALL_DCE_ENGINES.map(engine => [engine.key, engine] as const),
);

const USED_STATUSES = new Set<LucyTrayEngineStatus>(['calculated', 'partial', 'symbolic']);

function toStatus(status: CalculationAuditItem['status']): LucyTrayEngineStatus | null {
  return USED_STATUSES.has(status as LucyTrayEngineStatus) ? status as LucyTrayEngineStatus : null;
}

function trayItem(key: string, status: LucyTrayEngineStatus, auditName?: string, note?: string): LucyTrayEngineItem {
  const engine = ENGINE_BY_KEY.get(key);
  return {
    key,
    nameKo: engine?.nameKo ?? auditName ?? key,
    category: engine?.category ?? 'deep_master',
    status,
    meaning: engine ? getEngineCatalogMeaning(engine) : '',
    ...(note ? { note } : {}),
  };
}

/** 고민 주제에 잘 맞는 도구가 앞으로 온다. 같은 고민이면 늘 같은 순서다. */
function concernRank(concern: string, id: string): number {
  const order = CONCERN_TOOL_ORDER[detectMasterConcernTopic(concern)];
  const index = (order as readonly string[]).indexOf(id);
  return index < 0 ? order.length : index;
}

/**
 * 이번 답변에 실제로 쓰인 기초 도구·심층 관점만 담은 도구함 목록을 만든다.
 * - 계산 기록(audit)에서 실제로 답변 프롬프트에 전달된 계산·부분 계산·상징 참고만 남긴다.
 * - 라우터가 고른 심층 관점 키는 계산 기록에 아직 없어도 상징 참고로 담는다(중복 제외).
 * - 비활성(미선택·미실행·오류) 도구는 담지 않는다.
 */
export function buildActiveEngineTray(params: {
  audit?: readonly CalculationAuditItem[] | null;
  /** 이번 질문에 루시가 고른 심층 관점 키 */
  insightKeys?: readonly string[];
  concern?: string;
}): LucyActiveEngineTray {
  const used = getActuallyUsedCalculationAudit(params.audit);
  const seen = new Set<string>();
  const foundational: LucyTrayEngineItem[] = [];
  const deep: LucyTrayEngineItem[] = [];

  for (const item of used) {
    const status = toStatus(item.status);
    if (!status || seen.has(item.toolId)) continue;
    seen.add(item.toolId);
    const entry = trayItem(item.toolId, status, item.name, item.note);
    (entry.category === 'foundational' ? foundational : deep).push(entry);
  }

  for (const key of params.insightKeys ?? []) {
    if (!key || seen.has(key) || !ENGINE_BY_KEY.has(key)) continue;
    seen.add(key);
    deep.push(trayItem(key, 'symbolic'));
  }

  const concern = params.concern ?? '';
  foundational.sort((a, b) => concernRank(concern, a.key) - concernRank(concern, b.key));

  return { foundational, deep, total: foundational.length + deep.length };
}

export function activeEngineTrayIsEmpty(tray: LucyActiveEngineTray | null | undefined): boolean {
  return !tray || tray.total === 0;
}

export const ACTIVE_ENGINE_TRAY_STATUS_LABELS: Record<LucyTrayEngineStatus, string> = {
  calculated: '계산 완료',
  partial: '부분 계산',
  symbolic: '상징 참고',
};
