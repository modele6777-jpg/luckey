import { detectTarotCardsFromText, stripTarotMarkers, type DetectedTarotCard } from '../utils/tarotDetector';

export interface LucyTarotDraw {
  source: 'app-random';
  id: string;
  drawnAt: number;
  markers: string;
}

export const TAROT_NO_DRAW_RULE = `[타로 추첨 사실성 — 다른 도구·비유 지침보다 우선]
앱이 이번 요청에 제공한 실제 추첨 기록만 추첨 사실로 말할 수 있어. 기록이 없으면 카드를 임의로 고르거나 정역방향을 정해 뽑았다·나왔다·펼쳤다고 말하지 마. 실물 카드를 손으로 섞거나 뒤집었다는 경험도 꾸며내지 마. 타로가 도움이 될 것 같으면 사용자에게 앱에서 타로를 뽑아보자고 제안만 해. 사용자가 물은 카드의 일반적 의미는 '추첨이 아닌 의미 설명'이라고 구분해. 카드로 앱의 정확도나 사실을 검증했다고 주장하지 마.`;

export const UNVERIFIED_TAROT_REPLY = '이번 응답에는 앱의 실제 추첨 기록과 맞지 않는 카드 내용이 있어 표시하지 않았어. 실제로 뽑지 않은 카드를 뽑았다고 안내할 수는 없어. 타로 리딩을 원하면 “타로 한 장 뽑아줘”라고 요청해줘.';

/** Fail closed before any generated text reaches the UI, speech, or persistence. */
export function verifyLucyTarotReply(text: string, draw?: LucyTarotDraw, userText = ''): string {
  const plain = stripTarotMarkers(text);
  const mentioned = detectTarotCardsFromText(plain);
  const modelMarkers = detectTarotCardsFromText((text.match(/\[TAROT:[^\]]+\]/gi) || []).join(' '));
  const claimsDraw = /(?:뽑(?:았|아봤|혔|힌|은|아놓)|추첨(?:했|된|한|해봤)|나온\s*카드|카드.{0,30}(?:나왔|나타났|펼쳤|선택했)|(?:drew|drawn)\b)/i.test(plain);
  if (!draw) {
    const askedAbout = new Set(detectTarotCardsFromText(`타로 카드 의미: ${userText}`).map(c => c.id));
    const introducesCard = mentioned.some(c => !askedAbout.has(c.id));
    if (modelMarkers.length || introducesCard || (claimsDraw && /타로|카드|리딩|한\s*장|세\s*장|tarot/i.test(plain))) return UNVERIFIED_TAROT_REPLY;
    return plain;
  }
  const actual = detectTarotCardsFromText(draw.markers);
  if (!actual.length) return UNVERIFIED_TAROT_REPLY;
  const byId = new Map(actual.map(c => [c.id, c]));
  if ([...mentioned, ...modelMarkers].some(c => !byId.has(c.id))) return UNVERIFIED_TAROT_REPLY;
  // Validate orientation only where the response actually states one.
  for (const card of mentioned) {
    if (hasExplicitOrientation(plain, card) && card.reversed !== byId.get(card.id)!.reversed) return UNVERIFIED_TAROT_REPLY;
  }
  if (modelMarkers.some(c => c.reversed !== byId.get(c.id)!.reversed)) return UNVERIFIED_TAROT_REPLY;
  return plain;
}

function hasExplicitOrientation(text: string, card: DetectedTarotCard): boolean {
  const cleaned = text.replace(/[*_`#\s]/g, '');
  return [card.nameKo, card.name].some(name => {
    const start = cleaned.toLowerCase().indexOf(name.replace(/\s/g, '').toLowerCase());
    return start >= 0 && /정방향|역방향|upright|reversed/i.test(cleaned.slice(start, start + name.length + 35));
  });
}

export function isLucyTarotDrawRequest(text: string): boolean {
  return /타로|카드|스프레드/i.test(text)
    && /뽑아|뽑아줘|뽑아봐|뽑기|추첨해|리딩해|리딩을?\s*해|봐줘|봐줄|한\s*장|세\s*장|[123]\s*장|쓰리카드|과거\s*현재\s*미래/i.test(text);
}
