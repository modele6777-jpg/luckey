import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { TAROT_DECK } from '../src/data/tarotData';
import { detectTarotCardsFromText } from '../src/utils/tarotDetector';
import { cleanAssistantMessageDisplay } from '../src/utils/cleanMessage';

test('all 78 cards render from Korean or English Markdown readings without markers', () => {
  for (const card of TAROT_DECK) {
    for (const name of [card.nameKo, card.name]) {
      const cards = detectTarotCardsFromText(`뽑은 타로 카드: **${name} (역방향)**`);
      assert.ok(cards.some(c => c.id === card.id && c.reversed), `${card.id}: ${name}`);
      assert.ok(existsSync(`public${cards.find(c => c.id === card.id)!.imageUrl}`));
    }
  }
});

test('minor arcana aliases preserve reading order and orientation', () => {
  const cards = detectTarotCardsFromText('타로 리딩\n**컵 2 (정방향)**\n**소드 10 (역방향)**\n**동전 에이스 (정방향)**');
  assert.deepEqual(cards.map(c => [c.id, c.reversed]), [['cups_2', false], ['swords_10', true], ['pent_1', false]]);
});

test('everyday single-character words do not become tarot images', () => {
  assert.deepEqual(detectTarotCardsFromText('카드 결제는 다음 달에 하고 힘 내서 별 생각 없이 쉬어.'), []);
});

test('explicit draw is retained through display cleaning and overrides incidental names', () => {
  const text = cleanAssistantMessageDisplay('[TAROT:cups_2:reversed]\n\n마법사 카드와는 다른 흐름이야.', true);
  assert.deepEqual(detectTarotCardsFromText(text).map(c => [c.id, c.reversed]), [['cups_2', true]]);
});

test('user-reported app comparison reading shows 검에이스 역방향 without draw markers', () => {
  for (const reading of ['검에이스 역방향', '**검 에이스 (역방향)**', '뽑힌 카드는 검에이스 역방향이야.']) {
    const cards = detectTarotCardsFromText(`내앱이 호리보다 얼마나 정확하고 완성적인지\n${reading}`);
    assert.deepEqual(cards.map(c => [c.id, c.reversed]), [['swords_1', true]]);
    assert.equal(cards[0].imageUrl, '/oracle-decks/healing/swords_1.webp');
  }
});
