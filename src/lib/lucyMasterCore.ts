import type { runDeterministicEngine } from './divination/deterministicEngine';
import { isLucyToolId } from './lucyToolRegistry';

export const LUCY_COUNSEL_GROUNDING = '실제 산출값과 참고 해석을 구분하고, 결과에 없는 계산값을 지어내지 마세요. 해석으로 미래 결과를 보장하지 마세요.';

type LucyEngine = typeof runDeterministicEngine;
type LucyCalculationRequest = Omit<Parameters<LucyEngine>[0], 'coreOnly' | 'forceAllTools'>;

/** Execute the selected real tools through the calculations common to the three Lucy modes. */
export function runLucyCoreCalculation(engine: LucyEngine, request: LucyCalculationRequest) {
  const focusTools = request.focusTools?.filter(isLucyToolId);
  if (request.focusTools?.length && !focusTools?.length) throw new Error('No registered Lucy tool was selected');
  return engine({ ...request, focusTools, forceAllTools: true, coreOnly: true });
}
