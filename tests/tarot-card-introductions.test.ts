import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { TAROT_DECK } from '../src/data/tarotData.ts';
import {
  getTarotCardIntroduction,
  TAROT_CARD_INTRODUCTIONS,
} from '../src/data/tarotCardIntroductions.ts';

const modal = readFileSync(
  new URL('../src/components/trinity/TarotCardZoomModal.tsx', import.meta.url),
  'utf8',
);

test('every card in the 78-card tarot deck has its own concise introduction', () => {
  assert.equal(TAROT_DECK.length, 78);
  assert.equal(new Set(TAROT_DECK.map((card) => card.id)).size, 78);
  assert.deepEqual(
    Object.keys(TAROT_CARD_INTRODUCTIONS).sort(),
    TAROT_DECK.map((card) => card.id).sort(),
    'the introduction catalog must cover every card and no unknown card IDs',
  );

  for (const card of TAROT_DECK) {
    const introduction = getTarotCardIntroduction(card);
    assert.ok(introduction.length >= 20, `${card.id} should have a useful introduction`);
    assert.ok(introduction.length <= 100, `${card.id} introduction should stay concise`);
    assert.match(introduction, /[.!?]$/);
  }
});

test('the enlarged view renders the card introduction independently of orientation', () => {
  assert.match(modal, /getTarotCardIntroduction\(card\)/);
  assert.match(modal, /aria-label="카드 소개"/);
  assert.match(modal, /카드 한눈에 보기/);
  assert.ok(
    modal.indexOf('카드 한눈에 보기') < modal.indexOf('역방향 심층 상징 및 뜻'),
    'the general introduction appears separately before orientation-specific reversed details',
  );
});

test('cards supplied without a catalog ID still get a short keyword-based introduction', () => {
  assert.equal(
    getTarotCardIntroduction({ nameKo: '사용자 카드', keywords: ['희망', '회복'] }),
    '이 카드는 희망·회복의 흐름을 상징합니다.',
  );
  assert.equal(getTarotCardIntroduction(null), '');
});
