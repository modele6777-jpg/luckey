import { ALL_DCE_ENGINES, type DceEngineMeta } from './deterministicEngine';
import { FIFTEEN_DIVINATION_TOOLS, type DivinationToolId } from '../fifteenDivinationTools';

export const ENGINE_CATALOG_COUNTS = ALL_DCE_ENGINES.reduce(
  (counts, engine) => {
    counts[engine.category] += 1;
    return counts;
  },
  { foundational: 0, deep_master: 0 },
);

export function getEngineCatalogMeaning(engine: DceEngineMeta): string {
  if (engine.category === 'foundational') {
    const tool = FIFTEEN_DIVINATION_TOOLS[engine.key as DivinationToolId];
    return tool?.bestFor ?? tool?.coreEssence ?? '질문과 필요한 입력에 따라 실제 산출 여부가 달라집니다.';
  }

  if (engine.summary) return engine.summary;

  return `「${engine.nameKo}」에 담긴 전통과 핵심 주제를 빌려 질문을 비춰보는 심층 참고 관점입니다. 이 항목 자체가 개인별 계산·측정·예측 결과를 뜻하지는 않습니다.`;
}
