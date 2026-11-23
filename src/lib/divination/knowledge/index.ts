/**
 * 📚 해석 사전 연결: 계산된 값에 해당하는 카드만 골라 프롬프트에 붙인다.
 * (도구마다 긴 해석 문장을 프롬프트에 넣지 않고, 이번 결과에 맞는 카드 몇 장만 준다.)
 */
import { findIchingCard, formatIchingCard } from './ichingCards';
import { findSukuyoTypeCard, formatSukuyoTypeCard, formatSukuyoRelationGuide } from './sukuyoCards';
import { sukuyoMansionInfoByIndex } from '../sukuyoEngine';
import {
  KYUSEI_STAR_CARDS, LIUREN_GENERAL_CARDS, QIMEN_GATE_CARDS, QIMEN_PALACE_DIRECTION, ZIWEI_MUTAGEN_CARDS, ZIWEI_STAR_CARDS,
  findCard, formatSimpleCard,
} from './moreCards';

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
    if (tool.toolId === 'ziwei' && Array.isArray(data.palaces)) {
      // 명궁의 주성 + 타고난 사화(록·권·과·기)가 놓인 궁
      const soul = data.palaces.find((p: any) => p.branch === data.soulPalace);
      for (const star of soul?.major ?? []) {
        const c = findCard(ZIWEI_STAR_CARDS, star?.name);
        if (c) cards.push(formatSimpleCard(`자미두수 명궁 주성 ${c.key}(${c.hanja})`, c));
      }
      for (const palace of data.palaces) {
        for (const star of [...(palace.major ?? []), ...(palace.minor ?? [])]) {
          const c = findCard(ZIWEI_MUTAGEN_CARDS, star?.mutagen);
          if (c) cards.push(formatSimpleCard(`자미두수 생년 ${c.hanja}: ${palace.name}궁의 ${star.name}`, c));
        }
      }
    }
    if (tool.toolId === 'kyusei' && data.honmyosei) {
      const hon = findCard(KYUSEI_STAR_CARDS, String(data.honmyosei.star));
      if (hon) cards.push(formatSimpleCard(`구성학 본명성 ${hon.hanja}`, hon));
      const get = findCard(KYUSEI_STAR_CARDS, String(data.getmyosei?.star ?? ''));
      if (get && get !== hon) cards.push(formatSimpleCard(`구성학 월명성 ${get.hanja}`, get));
    }
    if (tool.toolId === 'liuren') {
      const names = [data.primaryGeneral?.name, ...((data.threeTransmissions ?? []).map((t: any) => t?.general))]
        .map((name: unknown) => String(name ?? '').replace(/\(.*$/, '').replace('靑', '青').trim())
        .filter(Boolean);
      for (const name of [...new Set(names)].slice(0, 3)) {
        const c = LIUREN_GENERAL_CARDS.find(card => name.includes(card.key));
        if (c) cards.push(formatSimpleCard(`육임 천장 ${c.key}(${c.hanja})`, c));
      }
    }
    if (tool.toolId === 'qimen') {
      const chart = data.chabopPointChart?.chart;
      if (chart) {
        const lead = findCard(QIMEN_GATE_CARDS, chart['值使']);
        const leadDir = QIMEN_PALACE_DIRECTION[chart['值使落宮']] ?? '';
        if (lead) cards.push(formatSimpleCard(`기문 지금 판의 직사문(值使) ${lead.hanja}(${chart['值使']})${leadDir ? ` · ${leadDir}` : ''}`, lead));
        const gates: string[] = chart['天門'] ?? [];
        const palaces: string[] = chart['方位'] ?? [];
        for (const good of ['生門', '開門']) {
          const at = gates.indexOf(good);
          const c = findCard(QIMEN_GATE_CARDS, good);
          if (at >= 0 && c && good !== chart['值使']) cards.push(formatSimpleCard(`기문 ${c.hanja}(${good}) 방위 ${QIMEN_PALACE_DIRECTION[palaces[at]] ?? palaces[at]}`, c));
        }
      }
    }
  }
  return cards;
}
