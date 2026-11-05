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

  // 2. 만약 명시적 마커가 없거나 부족한 경우, 타로 맥락이 담긴 텍스트에서 카드명 자연어 탐지
  const isTarotContext = /타로|스프레드|아르카나|카드|리딩|뽑[힌은은았]/i.test(text);
  if (isTarotContext && results.length === 0) {
    // 메이저 아르카나 및 별칭 검사
    for (const [alias, id] of Object.entries(ALIASES)) {
      if (seenIds.has(id)) continue;
      // 단어 경계 검사: "힘"이나 "달", "별", "탑" 같은 한 글자 단어는 "카드", "뽑", "나온" 주변 맥락이 있을 때만 인정
      const isShortWord = alias.length <= 1;
      const pattern = isShortWord
        ? new RegExp(`(?:타로|카드|뽑[은힌]|나온|당신의)\\s*['"\\s]*${alias}['"\\s]*(?:카드|\\(|\\s|$)`, 'i')
        : new RegExp(`['"\\s\\[]${alias}['"\\s\\]]|${alias}\\s*카드|${alias}\\s*\\(`, 'i');

      if (pattern.test(text)) {
        const card = TAROT_BY_ID.get(id);
        if (card) {
          // 해당 카드 언급 주변 40자 이내에 '역방향' 키워드가 있는지 검사
          const aliasIndex = text.indexOf(alias);
          const surrounding = aliasIndex >= 0 ? text.slice(Math.max(0, aliasIndex - 25), aliasIndex + alias.length + 25) : '';
          const isReversed = /역방향|뒤집|거꾸로|reversed/i.test(surrounding);

          seenIds.add(card.id);
          results.push({
            ...card,
            reversed: isReversed,
            orientationKo: isReversed ? '역방향' : '정방향',
            imageUrl: getTarotCardImageUrl(card),
            displayTitle: `${card.nameKo} (${card.name})`,
          });
          if (results.length >= 3) break;
        }
      }
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
