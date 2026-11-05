import { TAROT_DECK, TarotCard, getTarotCardImageUrl, rollTarotReversed } from '../data/tarotData';

export interface DetectedTarotCard extends TarotCard {
  reversed: boolean;
  orientationKo: string;
  imageUrl: string;
  displayTitle: string;
}

const TAROT_BY_ID = new Map<string, TarotCard>();
const TAROT_BY_NAME_KO = new Map<string, TarotCard>();
const TAROT_BY_NAME_EN = new Map<string, TarotCard>();

for (const card of TAROT_DECK) {
  TAROT_BY_ID.set(card.id, card);
  TAROT_BY_NAME_KO.set(card.nameKo.replace(/\s+/g, '').toLowerCase(), card);
  TAROT_BY_NAME_EN.set(card.name.toLowerCase(), card);
}

// 별칭 매핑 (자주 불리는 대체 명칭)
const ALIASES: Record<string, string> = {
  '바보': 'major_0',
  '광대': 'major_0',
  '더풀': 'major_0',
  '마법사': 'major_1',
  '매지션': 'major_1',
  '여사제': 'major_2',
  '고위여사제': 'major_2',
  '여황제': 'major_3',
  '임프레스': 'major_3',
  '황제': 'major_4',
  '엠페러': 'major_4',
  '교황': 'major_5',
  '사제': 'major_5',
  '연인': 'major_6',
  '러버스': 'major_6',
  '연인들': 'major_6',
  '전차': 'major_7',
  '채리엇': 'major_7',
  '힘': 'major_8',
  '스트렝스': 'major_8',
  '은둔자': 'major_9',
  '허밋': 'major_9',
  '운명의수레바퀴': 'major_10',
  '운명의바퀴': 'major_10',
  '수레바퀴': 'major_10',
  '정의': 'major_11',
  '저스티스': 'major_11',
  '매달린사람': 'major_12',
  '행드맨': 'major_12',
  '매달린자': 'major_12',
  '죽음': 'major_13',
  '데스': 'major_13',
  '절제': 'major_14',
  '템퍼런스': 'major_14',
  '악마': 'major_15',
  '데빌': 'major_15',
  '탑': 'major_16',
  '타워': 'major_16',
  '별': 'major_17',
  '스타': 'major_17',
  '달': 'major_18',
  '문': 'major_18',
  '태양': 'major_19',
  '선': 'major_19',
  '심판': 'major_20',
  '저지먼트': 'major_20',
  '세계': 'major_21',
  '월드': 'major_21',
};

/**
 * 텍스트에서 명시적 [TAROT:card_id:orientation] 태그 또는 타로 카드 언급을 감지합니다.
 */
export function detectTarotCardsFromText(text: string): DetectedTarotCard[] {
  if (!text || typeof text !== 'string') return [];
  const results: DetectedTarotCard[] = [];
  const seenIds = new Set<string>();

  // 1. 명시적 마커 검사: [TAROT:major_0:upright] 또는 [TAROT:major_0:reversed]
  const markerRegex = /\[TAROT:([a-zA-Z0-9_]+)(?::(upright|reversed|정방향|역방향))?\]/gi;
  let match: RegExpExecArray | null;
  while ((match = markerRegex.exec(text)) !== null) {
    const cardId = match[1];
    const orientation = match[2]?.toLowerCase();
    const isReversed = orientation === 'reversed' || orientation === '역방향';
    const card = TAROT_BY_ID.get(cardId);
    if (card && !seenIds.has(card.id)) {
      seenIds.add(card.id);
      results.push({
        ...card,
        reversed: isReversed,
        orientationKo: isReversed ? '역방향' : '정방향',
        imageUrl: getTarotCardImageUrl(card),
        displayTitle: `${card.nameKo} (${card.name})`,
      });
    }
  }

  // Older replies and model-initiated draws may have no explicit marker.
  // Match all 78 Korean/English names, including Markdown headings and bold text.
  const normalized = text.replace(/[*_`#]/g, '').replace(/\s+/g, ' ');
  const isTarotContext = /타로|스프레드|아르카나|카드|리딩|정방향|역방향|tarot|upright|reversed/i.test(normalized);
  if (isTarotContext && results.length === 0) {
    const candidates: { card: TarotCard; index: number; reversed: boolean }[] = [];
    const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const names = new Map<string, TarotCard>();
    for (const card of TAROT_DECK) {
      names.set(card.nameKo, card);
      names.set(card.name, card);
      if (card.type === 'pentacles') {
        names.set(card.nameKo.replace('펜타클', '동전'), card);
        names.set(card.nameKo.replace('펜타클', '펜타클스'), card);
      }
      if (card.type === 'wands') names.set(card.nameKo.replace('지팡이', '완드'), card);
      if (card.type === 'swords') names.set(card.nameKo.replace('검', '소드'), card);
    }
    for (const [name, id] of Object.entries(ALIASES)) {
      const card = TAROT_BY_ID.get(id);
      if (card) names.set(name, card);
    }
    for (const [name, card] of names) {
      const flexibleName = escapeRegex(name).replace(/\s+/g, '\\s*');
      const pattern = new RegExp(`(^|[^가-힣a-zA-Z0-9])(${flexibleName})(?=$|[^가-힣a-zA-Z0-9]|카드|정방향|역방향)`, 'gi');
      let found: RegExpExecArray | null;
      while ((found = pattern.exec(normalized)) !== null) {
        const index = found.index + found[1].length;
        const after = normalized.slice(index + found[2].length, index + found[2].length + 35);
        const before = normalized.slice(Math.max(0, index - 15), index);
        // Avoid everyday uses of single-character names such as 힘, 별 and 달.
        if (name.length === 1 && !/^\s*[)'”"’:\-–—]*\s*(?:카드|[（(]?\s*(?:정방향|역방향|upright|reversed))/i.test(after)
          && !/(?:뽑은|뽑힌|나온|선택한)\s*['"‘“]?\s*$/.test(before)) continue;
        const orientation = after.match(/^[\s()（）:'"‘’“”\-–—]*(정방향|역방향|upright|reversed)/i)
          || before.match(/(정방향|역방향|upright|reversed)[\s()（）:'"‘’“”\-–—]*$/i);
        candidates.push({ card, index, reversed: /역방향|reversed/i.test(orientation?.[1] || '') });
      }
    }
    candidates.sort((left, right) => left.index - right.index);
    for (const { card, reversed } of candidates) {
      if (seenIds.has(card.id)) continue;
      seenIds.add(card.id);
      results.push({ ...card, reversed, orientationKo: reversed ? '역방향' : '정방향', imageUrl: getTarotCardImageUrl(card), displayTitle: `${card.nameKo} (${card.name})` });
      if (results.length >= 3) break;
    }
  }

  return results;
}

/**
 * 78장 덱에서 무작위 또는 사용자 시드 기반으로 타로 카드를 드로우합니다.
 */
export function drawLucyTarotCards(count: number = 1): DetectedTarotCard[] {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.max(1, Math.min(count, 3)));

  return selected.map((card) => {
    const reversed = rollTarotReversed();
    return {
      ...card,
      reversed,
      orientationKo: reversed ? '역방향' : '정방향',
      imageUrl: getTarotCardImageUrl(card),
      displayTitle: `${card.nameKo} (${card.name})`,
    };
  });
}

/**
 * 말풍선 본문에서 UI 렌더링용 [TAROT:...] 마커를 제거하여 깨끗한 텍스트로 정리합니다.
 */
export function stripTarotMarkers(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/\[TAROT:[a-zA-Z0-9_]+(?::(?:upright|reversed|정방향|역방향))?\]\s*/gi, '').trim();
}

/**
 * 타로 카드 마커 태그를 생성합니다.
 */
export function formatTarotMarker(card: TarotCard | DetectedTarotCard): string {
  const orientation = card.reversed ? 'reversed' : 'upright';
  return `[TAROT:${card.id}:${orientation}]`;
}
