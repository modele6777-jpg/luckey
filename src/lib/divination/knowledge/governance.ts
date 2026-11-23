import type { DivinationToolId } from '../../lucyToolRegistry';

export type KnowledgeReviewStatus = 'pending_review' | 'approved' | 'rejected' | 'superseded';
export interface KnowledgeSource {
  title: string;
  authors: string[];
  publication?: string;
  year?: string;
  doi?: string;
  url: string;
  sourceKind: 'journal' | 'book' | 'primary_text' | 'reference' | 'other';
  verification: 'unreviewed' | 'metadata_checked' | 'original_text_checked';
  access: 'full_text' | 'abstract_only' | 'metadata_only' | 'unavailable';
  school?: string;
  note?: string;
}
export interface GovernedKnowledgeCard {
  id: string;
  cardId?: string;
  engineId: DivinationToolId;
  theme: string;
  title: string;
  core: string;
  use: string;
  caution: string;
  school?: string;
  sourceIds: string[];
  sources?: KnowledgeSource[];
  status: KnowledgeReviewStatus;
  active?: boolean;
  version?: number;
  versionId?: string;
  createdAt?: string;
  approvedAt?: string;
  restoredFrom?: string;
}
export interface KnowledgeSimilarity {
  otherId: string;
  score: number;
  kind: 'duplicate' | 'possible_conflict' | 'related';
  reason: string;
}
const MAX = { title: 120, core: 700, use: 500, caution: 500, school: 120 } as const;
const KNOWN_ENGINES = new Set<DivinationToolId>([
  'saju', 'astrology', 'ziwei', 'tarot', 'sukuyo', 'mahabote', 'vedic', 'liuren', 'qimen',
  'kabbalah', 'iching', 'thai_astrology', 'tojeong', 'kyusei', 'taiyi',
]);

export function validateKnowledgeCard(value: unknown): value is GovernedKnowledgeCard {
  if (!value || typeof value !== 'object') return false;
  const card = value as Partial<GovernedKnowledgeCard>;
  if (!card.id || typeof card.id !== 'string' || card.id.length > 160) return false;
  if (!card.engineId || !KNOWN_ENGINES.has(card.engineId)) return false;
  if (!card.title || card.title.length > MAX.title) return false;
  if (!card.core || card.core.length > MAX.core) return false;
  if (!card.use || card.use.length > MAX.use) return false;
  if (!card.caution || card.caution.length > MAX.caution) return false;
  if (!Array.isArray(card.sourceIds) || card.sourceIds.length === 0 || card.sourceIds.length > 8) return false;
  if (!['pending_review', 'approved', 'rejected', 'superseded'].includes(String(card.status))) return false;
  return true;
}

export function hasVerifiedFullTextSource(sources: unknown): boolean {
  return Array.isArray(sources) && sources.some(source => Boolean(
    source && typeof source === 'object'
      && (source as Partial<KnowledgeSource>).verification === 'original_text_checked'
      && (source as Partial<KnowledgeSource>).access === 'full_text',
  ));
}

export function isConsultationEligibleCard(value: unknown): value is GovernedKnowledgeCard {
  return validateKnowledgeCard(value)
    && value.status === 'approved'
    && value.active === true
    && value.sourceIds.length > 0
    && hasVerifiedFullTextSource(value.sources);
}

function normalized(text: string): string {
  return text.toLocaleLowerCase().normalize('NFKC').replace(/[\p{P}\p{S}\s]+/gu, ' ').trim();
}
function terms(text: string): Set<string> {
  return new Set((normalized(text).match(/[\p{L}\p{N}]{2,}/gu) ?? []));
}
function jaccard(left: Set<string>, right: Set<string>): number {
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  for (const term of left) if (right.has(term)) overlap += 1;
  return overlap / (left.size + right.size - overlap);
}
function polarity(text: string): 'positive' | 'negative' | 'mixed' {
  const positive = /가능|도움|유리|권장|지지|완화|성장|촉진|적합|강화|긍정/u.test(text);
  const negative = /불가|금지|주의|위험|불리|억제|약화|저해|부적합|피해야|아니다|없다/u.test(text);
  return positive && negative ? 'mixed' : positive ? 'positive' : negative ? 'negative' : 'mixed';
}
export function compareKnowledgeCards(candidate: GovernedKnowledgeCard, existing: readonly GovernedKnowledgeCard[]): KnowledgeSimilarity[] {
  const candidateCore = normalized(`${candidate.title} ${candidate.core} ${candidate.use}`);
  const candidateTerms = terms(candidateCore);
  const result: KnowledgeSimilarity[] = [];
  for (const other of existing) {
    if (!validateKnowledgeCard(other) || candidate.id === other.id || candidate.engineId !== other.engineId) continue;
    const otherCore = normalized(`${other.title} ${other.core} ${other.use}`);
    const exact = candidateCore === otherCore;
    const score = exact ? 1 : jaccard(candidateTerms, terms(otherCore));
    if (exact || score >= 0.78) {
      result.push({ otherId: other.id, score, kind: 'duplicate', reason: exact ? '제목·핵심·사용법이 동일합니다.' : '문구와 핵심 용어가 매우 비슷합니다. 사람이 중복 여부를 확인해야 합니다.' });
    } else if (score >= 0.34 && polarity(`${candidate.core} ${candidate.use}`) !== polarity(`${other.core} ${other.use}`)) {
      result.push({ otherId: other.id, score, kind: 'possible_conflict', reason: '관련 용어가 겹치지만 권고 방향이 다를 수 있습니다. 학파·조건 차이인지 사람이 확인해야 합니다.' });
    } else if (score >= 0.34) {
      result.push({ otherId: other.id, score, kind: 'related', reason: '주제가 겹칩니다. 동일한 개념인지 확인하세요.' });
    }
  }
  return result.sort((a, b) => b.score - a.score);
}

export function selectApprovedCardsForEngine(engineId: DivinationToolId, cards: readonly unknown[], limit = 2): GovernedKnowledgeCard[] {
  return cards
    .filter(isConsultationEligibleCard)
    .filter(card => card.engineId === engineId)
    .slice(0, Math.max(0, Math.min(4, limit)));
}
