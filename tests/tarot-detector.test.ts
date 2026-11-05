import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectTarotCardsFromText, drawLucyTarotCards, stripTarotMarkers, formatTarotMarker } from '../src/utils/tarotDetector';

describe('Tarot Detector in Lucy Chat', () => {
  it('detects explicit [TAROT:card_id:orientation] tags correctly', () => {
    const text = '내가 뽑은 카드는 [TAROT:major_0:upright] 야. 새로운 시작을 의미해!';
    const detected = detectTarotCardsFromText(text);
    assert.equal(detected.length, 1);
    assert.equal(detected[0].id, 'major_0');
    assert.equal(detected[0].nameKo, '광대');
    assert.equal(detected[0].reversed, false);
    assert.equal(detected[0].orientationKo, '정방향');
    assert.equal(detected[0].imageUrl, '/oracle-decks/healing/major_0.webp');
  });

  it('detects reversed cards correctly', () => {
    const text = '이 카드는 [TAROT:major_16:reversed] 로 나왔어. 급작스러운 변화를 조심해야 해.';
    const detected = detectTarotCardsFromText(text);
    assert.equal(detected.length, 1);
    assert.equal(detected[0].id, 'major_16');
    assert.equal(detected[0].nameKo, '탑');
    assert.equal(detected[0].reversed, true);
    assert.equal(detected[0].orientationKo, '역방향');
  });

  it('detects natural language card mentions in tarot context', () => {
    const text = '타로 카드를 뽑아보니 당신의 카드는 광대 카드와 마법사 카드가 나왔어.';
    const detected = detectTarotCardsFromText(text);
    assert.equal(detected.length, 2);
    assert.equal(detected[0].id, 'major_0');
    assert.equal(detected[1].id, 'major_1');
  });

  it('drawLucyTarotCards draws requested number of cards', () => {
    const cards = drawLucyTarotCards(3);
    assert.equal(cards.length, 3);
    assert(cards[0].imageUrl.startsWith('/oracle-decks/healing/'));
    assert(typeof cards[0].reversed === 'boolean');
  });

  it('stripTarotMarkers removes markers cleanly', () => {
    const text = '[TAROT:major_0:upright] 새로운 시작을 축하해!';
    assert.equal(stripTarotMarkers(text), '새로운 시작을 축하해!');
  });

  it('formatTarotMarker formats correctly', () => {
    const card = { id: 'major_1', reversed: true } as any;
    assert.equal(formatTarotMarker(card), '[TAROT:major_1:reversed]');
  });
});
