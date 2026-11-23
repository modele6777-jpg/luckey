import type { KnowledgeSource } from '../../src/lib/divination/knowledge/governance.js';

function metadataOnlySource(item: any): KnowledgeSource | null {
  const title = Array.isArray(item?.title) ? String(item.title[0] ?? '') : '';
  if (!title) return null;
  const authorList = Array.isArray(item.author) ? item.author : [];
  const authors = authorList.map((author: any) => [author.given, author.family].filter(Boolean).join(' ')).filter(Boolean).slice(0, 16);
  const yearParts = item.published?.['date-parts']?.[0] ?? item.created?.['date-parts']?.[0] ?? [];
  const year = yearParts[0] ? String(yearParts[0]) : undefined;
  const doi = typeof item.DOI === 'string' ? item.DOI : undefined;
  const url = doi ? `https://doi.org/${doi}` : (typeof item.URL === 'string' && item.URL.startsWith('https://') ? item.URL : '');
  if (!url) return null;
  return {
    title: title.slice(0, 240), authors, publication: Array.isArray(item['container-title']) ? String(item['container-title'][0] ?? '').slice(0, 240) : undefined,
    year, doi, url, sourceKind: item.type === 'book' ? 'book' : 'journal', verification: 'unreviewed', access: 'metadata_only',
  };
}
export async function searchKnowledgeMetadata(query: string, rows: number, fetchApi = fetch) {
  const url = new URL('https://api.crossref.org/works');
  url.searchParams.set('query', query);
  url.searchParams.set('rows', String(rows));
  url.searchParams.set('select', 'DOI,title,author,published,created,container-title,URL,type');
  const response = await fetchApi(url, { headers: { Accept: 'application/json', 'User-Agent': 'LuckeyKnowledgeResearch/1.0' }, signal: AbortSignal.timeout(7000) });
  if (!response.ok) throw new Error('Crossref request failed');
  const body = await response.json() as { message: { items: unknown[]; 'total-results'?: number } };
  if (!Array.isArray(body.message?.items)) throw new Error('Crossref response missing items');
  const candidates = body.message.items.slice(0, rows).map(metadataOnlySource).filter((source): source is KnowledgeSource => source !== null);
  return { candidates, total: Number(body.message['total-results'] ?? candidates.length) };
}
