import { ALL_DCE_ENGINES, type DceEngineMeta } from './deterministicEngine';
import { DEEP_PERSPECTIVE_RESEARCH, type DeepPerspectiveResearchEntry } from './deepPerspectiveResearch';
import { FIFTEEN_DIVINATION_TOOLS, type DivinationToolId } from '../fifteenDivinationTools';

export const ENGINE_CATALOG_COUNTS = ALL_DCE_ENGINES.reduce(
  (counts, engine) => {
    counts[engine.category] += 1;
    return counts;
  },
  { foundational: 0, deep_master: 0 },
);

export const DEEP_PERSPECTIVE_RESEARCH_COUNTS = DEEP_PERSPECTIVE_RESEARCH.reduce(
  (counts, item) => {
    counts.total += 1;
    if (item.supported) counts.supported += 1;
    else counts.unsupported += 1;
    return counts;
  },
  { total: 0, supported: 0, unsupported: 0 },
);

const researchByKey: ReadonlyMap<string, DeepPerspectiveResearchEntry> = new Map(
  DEEP_PERSPECTIVE_RESEARCH.map(item => [item.key, item] as const),
);

export function getEngineCatalogResearch(engine: DceEngineMeta): DeepPerspectiveResearchEntry | undefined {
  if (engine.category !== 'deep_master') return undefined;
  return researchByKey.get(engine.key);
}

export interface EngineCatalogSource {
  title: string;
  url: string;
}

export function getEngineCatalogSources(engine: DceEngineMeta): EngineCatalogSource[] {
  const research = getEngineCatalogResearch(engine);
  if (!research?.supported || !research.sourceUrl) return [];

  const urls = research.sourceUrl.split(/\s*;\s*(?=https?:\/\/)/i).filter(Boolean);
  const titles = urls.length > 1 ? research.sourceTitle.split(/\s*;\s*/) : [research.sourceTitle];

  return urls.flatMap((rawUrl, index) => {
    try {
      const parsed = new URL(rawUrl.trim());
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return [];
      const title = titles.length === urls.length ? titles[index] : research.sourceTitle;
      return [{ title: title?.trim() || '자료', url: parsed.toString() }];
    } catch {
      return [];
    }
  });
}

export function getEngineCatalogMeaning(engine: DceEngineMeta): string {
  if (engine.category === 'foundational') {
    const tool = FIFTEEN_DIVINATION_TOOLS[engine.key as DivinationToolId];
    return tool?.bestFor ?? tool?.coreEssence ?? '질문과 필요한 입력에 따라 실제 산출 여부가 달라집니다.';
  }

  const research = getEngineCatalogResearch(engine);
  if (research) return research.meaning;
  if (engine.summary) return engine.summary;

  return `「${engine.nameKo}」에 담긴 전통과 핵심 주제를 빌려 질문을 비춰보는 심층 참고 관점입니다. 이 항목 자체가 개인별 계산·측정·예측 결과를 뜻하지는 않습니다.`;
}
