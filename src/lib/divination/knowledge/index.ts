/**
 * 📚 해석 사전 연결: 계산된 값에 해당하는 카드만 골라 프롬프트에 붙인다.
 * (도구마다 긴 해석 문장을 프롬프트에 넣지 않고, 이번 결과에 맞는 카드 몇 장만 준다.)
 */
import { findIchingCard, formatIchingCard } from './ichingCards';
import { findSukuyoTypeCard, formatSukuyoTypeCard, formatSukuyoRelationGuide } from './sukuyoCards';
import { sukuyoMansionInfoByIndex } from '../sukuyoEngine';

interface ToolLike { toolId: string; status: string; data?: unknown }

export function buildKnowledgeCards(tools: readonly ToolLike[]): string[] {
  const cards: string[] = [];
  for (const tool of tools) {
    if (tool.status !== 'calculated' || !tool.data || typeof tool.data !== 'object') continue;
    const data = tool.data as Record<string, any>;
    if (tool.toolId === 'iching') {
      const primary = findIchingCard(data.primary?.name);
      const moving = Array.isArray(data.movingLines) && data.movingLines.length > 0;
      const changed = moving ? findIchingCard(data.changed?.name) : null;
      if (primary) cards.push(formatIchingCard(primary, '주역 본괘'));
      if (changed && changed.number !== primary?.number) cards.push(formatIchingCard(changed, `주역 지괘(${data.movingLines.join('·')}효 변)`));
    }
    if (tool.toolId === 'sukuyo' && Number.isInteger(data.index)) {
      try {
        const info = sukuyoMansionInfoByIndex(data.index);
        const card = findSukuyoTypeCard(info.shukguk);
        if (card) {
          cards.push(formatSukuyoTypeCard(card, `${info.fullName ?? data.mansion}`));
          cards.push(formatSukuyoRelationGuide());
        }
      } catch { /* 카드 없이 계산값만 쓴다 */ }
    }
  }
  return cards;
}
