import { createHash } from 'node:crypto';
import type { KnowledgeSource } from '../../src/lib/divination/knowledge/governance.js';
import type { DivinationToolId } from '../../src/lib/lucyToolRegistry.js';

export const SCHEDULED_SOURCE_COLLECTION = 'lucyKnowledgeSourceCandidates';
const topics = [
  { engineId: 'iching', query: 'Yijing Zhouyi hexagrams history Chinese divination' },
  { engineId: 'saju', query: 'Four Pillars of Destiny Bazi historical Chinese astrology' },
  { engineId: 'tarot', query: 'Tarot cards history divination tradition' },
] satisfies { engineId: DivinationToolId; query: string }[];

interface ResearchDependencies {
  readSettings(): Promise<{ researchEnabled?: boolean; scheduledResearchEnabled?: boolean } | null>;
  search(query: string, limit: number): Promise<{ candidates: KnowledgeSource[] }>;
  createCandidate(id: string, candidate: { engineId: DivinationToolId; source: KnowledgeSource; createdAt: string }): Promise<boolean>;
}

export async function runScheduledResearch(deps: ResearchDependencies, now = new Date()) {
  const settings = await deps.readSettings();
  if (settings?.researchEnabled !== true || settings.scheduledResearchEnabled !== true) return { enabled: false, added: 0 };

  // Use the Seoul calendar day so retries on the same day search the same topic.
  const seoulDay = Math.floor((now.getTime() + 9 * 3_600_000) / 86_400_000);
  const { engineId, query } = topics[seoulDay % topics.length];
  const { candidates } = await deps.search(query, 5);
  let added = 0;
  for (const candidate of candidates.slice(0, 5)) {
    const { title, authors, url, doi, publication, year, sourceKind } = candidate;
    const id = createHash('sha256').update(engineId + '\n' + (doi?.trim().toLowerCase() || url)).digest('hex');
    const source: KnowledgeSource = {
      title, authors, url, sourceKind,
      ...(doi ? { doi } : {}),
      ...(publication ? { publication } : {}),
      ...(year ? { year } : {}),
      verification: 'unreviewed',
      access: 'metadata_only',
    };
    if (await deps.createCandidate(id, { engineId, source, createdAt: now.toISOString() })) added++;
  }
  return { enabled: true, added };
}
