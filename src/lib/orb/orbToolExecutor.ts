/**
 * 🔮 오브 도구 실행기: 마스터가 부른 함수를 기존 계산 엔진으로 실행한다.
 *
 * - 계산은 휴대폰(브라우저) 안에서 한다: 기존 runDeterministicEngine을 그 도구 하나만(focusTools) 돌린다.
 * - 결과는 프롬프트와 같은 방식으로 줄여서(slimToolDataToBudget) 해석 카드와 함께 돌려준다.
 * - 같은 도구는 한 상담에서 한 번만 계산하고(저장된 결과 재사용), 호출 수를 제한한다.
 * - 엔진은 크므로 처음 부를 때만 불러온다(dynamic import).
 */
import { drawOrbIchingLines } from './orbDice';
import type { UserProfile } from '../sharedState';
import {
  ORB_FN_RUN_TOOL, ORB_FN_TAROT, ORB_MAX_CALLS_PER_TURN, ORB_MAX_TOOLS_PER_SESSION, ORB_TOOL_BY_ID, type OrbToolMeta,
} from './orbTools';

export interface OrbFunctionCall { id?: string; name: string; args?: Record<string, unknown> }

export interface OrbToolEvents {
  /** 도구 계산을 시작/끝낼 때 (오브 표시용). */
  onToolStart?: (toolId: string, name: string) => void;
  onToolEnd?: (toolId: string, ok: boolean) => void;
  /** 타로 섞기 화면을 연다. 이미 뽑았으면 그 카드 설명을 돌려준다. */
  openTarot?: () => { opened: boolean; alreadyPicked?: string };
}

type EngineModule = typeof import('../divination/deterministicEngine');
type SlimModule = typeof import('../divination/promptSlim');
type CardsModule = typeof import('../divination/knowledge');

export interface OrbToolLoader {
  load: () => Promise<{ engine: Pick<EngineModule, 'runDeterministicEngine'>; slim: Pick<SlimModule, 'slimToolDataToBudget'>; cards: Pick<CardsModule, 'buildKnowledgeCards'> }>;
}

const defaultLoader: OrbToolLoader = {
  load: async () => {
    const [engine, slim, cards] = await Promise.all([
      import('../divination/deterministicEngine'),
      import('../divination/promptSlim'),
      import('../divination/knowledge'),
    ]);
    return { engine, slim, cards };
  },
};

const SHARED_SCOPE: Record<string, string> = {
  iching: '지금 시각의 괘, 같은 시각이면 누구나 같음. 이번 물음의 상으로만 풀 것',
  liuren: '지금 시각의 판, 이번 일의 흐름으로만 풀 것',
  qimen: '지금 시각의 기문 판(점시), 생년월일 기반 아님',
  taiyi: '올해의 연국, 모든 사람에게 같은 시대 흐름',
};

/** 결과 크기: 음성 상담은 짧게 (도구당 약 2,400자). */
const RESULT_BUDGET = 2400;

export function createOrbToolExecutor(options: {
  profile?: UserProfile | null;
  events?: OrbToolEvents;
  loader?: OrbToolLoader;
}) {
  const loader = options.loader || defaultLoader;
  const cache = new Map<string, Record<string, unknown>>();
  const inFlight = new Map<string, Promise<Record<string, unknown>>>();
  let modules: ReturnType<OrbToolLoader['load']> | undefined;
  const load = () => modules ??= loader.load().catch(error => {
    modules = undefined;
    throw error;
  });
  let callsThisTurn = 0;
  const log: Array<{ tool: string; status: string; ms: number }> = [];

  const hasBirthdate = Boolean(options.profile?.basic?.birthdate?.trim());

  async function runTool(toolId: string, reason: string, dice = false): Promise<Record<string, unknown>> {
    const meta = ORB_TOOL_BY_ID.get(toolId);
    if (!meta) return { ok: false, error: 'unknown_tool', message: '없는 도구입니다. 목록에 있는 도구만 쓰세요.' };
    const cacheKey = dice ? 'iching:dice' : toolId;
    const cached = cache.get(cacheKey);
    if (cached) return { ...cached, cached: true };
    const pending = inFlight.get(cacheKey);
    if (pending) return { ...await pending, cached: true };
    if (callsThisTurn >= ORB_MAX_CALLS_PER_TURN) {
      return { ok: false, error: 'turn_limit', message: '이번 질문에는 도구를 충분히 썼습니다. 지금 있는 결과로 상담을 이어 가세요.' };
    }
    if (cache.size + inFlight.size >= ORB_MAX_TOOLS_PER_SESSION) {
      return { ok: false, error: 'session_limit', message: '이번 상담에서는 도구를 충분히 썼습니다. 이미 받은 결과로 종합하세요.' };
    }
    if (meta.needs === 'birthdate' && !hasBirthdate) {
      return {
        ok: false, error: 'needs_birthdate', tool: meta.name,
        message: '생년월일이 없어 계산하지 못했습니다. 마이 페이지에 생년월일을 넣으면 볼 수 있다고 안내하고, 생년월일 없이 되는 도구(주역·육임·기문·태을·타로)나 대화로 이어 가세요.',
      };
    }
    callsThisTurn += 1;
    options.events?.onToolStart?.(toolId, meta.name);
    const pendingCalculation = calculate(meta, reason, dice, cacheKey);
    inFlight.set(cacheKey, pendingCalculation);
    try { return await pendingCalculation; }
    finally { inFlight.delete(cacheKey); }
  }

  async function calculate(meta: OrbToolMeta, reason: string, dice: boolean, cacheKey: string) {
    const toolId = meta.id;
    const started = performance.now();
    try {
      const { engine, slim, cards } = await load();
      const report = engine.runDeterministicEngine({
        profile: options.profile || null,
        question: reason,
        forceAllTools: true,
        focusTools: [toolId],
        coreOnly: true,
        ...(dice ? { ichingLines: drawOrbIchingLines() } : {}),
      });
      const envelope = Object.values(report.tools || {}).find(tool => tool?.toolId === toolId);
      const calculated = envelope?.status === 'calculated' && envelope.data != null;
      const result: Record<string, unknown> = {
        ok: calculated,
        tool: meta.name,
        status: envelope?.status || 'skipped',
        ...(dice ? { scope: '이번 질문의 무작위 괘', casting: '두 주사위 육효 변형 (동전 3개 방식과 같은 확률)' } : SHARED_SCOPE[toolId] ? { scope: SHARED_SCOPE[toolId] } : {}),
        ...(envelope?.method ? { method: envelope.method } : {}),
        ...(envelope?.note ? { note: envelope.note } : {}),
        ...(Array.isArray(envelope?.limitations) && envelope.limitations.length ? { limitations: envelope.limitations.slice(0, 2) } : {}),
        ...(calculated ? { data: slim.slimToolDataToBudget(envelope.data, RESULT_BUDGET) } : {}),
        ...(calculated ? { cards: cards.buildKnowledgeCards([envelope]) } : {}),
        calculatedAtKst: report.calculatedAtKst,
      };
      if (!calculated) result.message = '이 도구는 지금 계산되지 않았습니다. 계산된 것처럼 말하지 말고 다른 방법으로 이어 가세요.';
      cache.set(cacheKey, result);
      log.push({ tool: toolId, status: String(result.status), ms: performance.now() - started });
      options.events?.onToolEnd?.(toolId, calculated);
      return result;
    } catch {
      log.push({ tool: toolId, status: 'error', ms: performance.now() - started });
      options.events?.onToolEnd?.(toolId, false);
      return { ok: false, error: 'engine_error', tool: meta.name, message: '계산 중 오류가 났습니다. 계산값 없이 솔직하게 말하고 대화로 이어 가세요.' };
    }
  }

  return {
    prewarm() { return load().then(() => undefined, () => undefined); },
    /** 손님이 새로 말하면(새 질문) 한 차례 호출 수를 다시 센다. */
    newTurn() { callsThisTurn = 0; },
    /** 이번 상담에서 계산한 도구 기록 (품질·비용 확인용). */
    history() { return log.slice(); },
    async execute(call: OrbFunctionCall): Promise<Record<string, unknown>> {
      const args = call.args || {};
      const reason = typeof args.reason === 'string' ? args.reason.slice(0, 200) : '';
      if (call.name === ORB_FN_RUN_TOOL) return runTool(String(args.tool || ''), reason, args.tool === 'iching' && args.ichingMethod === 'dice');
      if (call.name === ORB_FN_TAROT) {
        const state = options.events?.openTarot?.() || { opened: false };
        if (state.alreadyPicked) return { ok: true, alreadyPicked: state.alreadyPicked, message: '이번 상담의 카드는 이미 뽑았습니다. 그 세 장으로 이어 가세요.' };
        return state.opened
          ? { ok: true, message: '카드 섞기 화면을 열었습니다. 끌리는 순간 멈춰라고 말하거나 화면을 누르면 한 장씩, 세 번이면 세 장이 나온다고 짧게 안내하세요. 전부 멈춰라고 하면 한 번에 뽑힙니다. [카드 선택] 메시지가 오기 전에는 카드 이름을 말하지 마세요.' }
          : { ok: false, message: '지금은 카드 화면을 열 수 없습니다. 다른 방법으로 이어 가세요.' };
      }
      return { ok: false, error: 'unknown_function', message: '없는 기능입니다.' };
    },
  };
}

export type OrbToolExecutor = ReturnType<typeof createOrbToolExecutor>;
