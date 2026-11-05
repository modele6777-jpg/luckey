import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LucyKakaoBubbleGroup } from '../src/components/chat/LucyKakaoBubbleGroup';
import { isLucyTarotDrawOpen, revealLucyTarotDrawCard, type LucyTarotDraw } from '../src/lib/lucyTarotIntegrity';

const initial: LucyTarotDraw = { source: 'app-random', id: 'reveal-test', drawnAt: 123, markers: '[TAROT:major_0:upright] [TAROT:swords_1:reversed]' };
const render = (draw: LucyTarotDraw) => renderToStaticMarkup(React.createElement(LucyKakaoBubbleGroup, {
  msgId: 'reveal-message', textContent: `${draw.markers}\n\n비밀 해설: 두 카드의 의미를 설명할게.`,
  verifiedTarotMarkers: draw.markers, revealedTarotCardIds: draw.revealedCardIds,
  isLatest: false, isGenerating: false, isHistorical: true, isLight: true,
  onCopy: () => {}, onVoicePlay: () => {}, onRevealTarotCard: () => {},
}));

test('initial draw shows accessible card backs without names, fronts, reading or speech actions', () => {
  const html = render(initial);
  assert.ok(html.includes('1번째 타로 카드 열기'));
  assert.ok(html.includes('2번째 타로 카드 열기'));
  for (const spoiler of ['광대', '검 에이스', 'major_0.webp', 'swords_1.webp', '비밀 해설', '연속 듣기']) assert.ok(!html.includes(spoiler), spoiler);
  assert.equal(isLucyTarotDrawOpen(initial), false);
});

test('opening one card reveals only that front and leaves the reading sealed', () => {
  const opened = revealLucyTarotDrawCard(initial, 'swords_1');
  const html = render(opened);
  assert.ok(html.includes('swords_1.webp'));
  assert.ok(html.includes('검 에이스'));
  assert.ok(html.includes('rotate-180'));
  assert.ok(!html.includes('major_0.webp'));
  assert.ok(!html.includes('비밀 해설'));
  assert.equal(isLucyTarotDrawOpen(opened), false);
  assert.equal(opened.markers, initial.markers);
  assert.equal(opened.id, initial.id);
  assert.equal(opened.drawnAt, initial.drawnAt);
});

test('all opened cards unlock the reading and speech, and remain opened on remount', () => {
  const opened = revealLucyTarotDrawCard(revealLucyTarotDrawCard(initial, 'swords_1'), 'major_0');
  const restored = JSON.parse(JSON.stringify(opened)) as LucyTarotDraw;
  const html = render(restored);
  assert.equal(isLucyTarotDrawOpen(restored), true);
  assert.ok(html.includes('비밀 해설'));
  assert.ok(html.includes('major_0.webp'));
  assert.ok(html.includes('swords_1.webp'));
  assert.equal(revealLucyTarotDrawCard(opened, 'major_0'), opened);
  assert.equal(revealLucyTarotDrawCard(opened, 'major_21'), opened);
});

test('a stale sync snapshot cannot close an opened card or replace the original draw', async () => {
  const { mergeLucyTarotDraw } = await import('../src/lib/lucyTarotIntegrity');
  const opened = revealLucyTarotDrawCard(initial, 'major_0');
  const merged = mergeLucyTarotDraw(opened, initial)!;
  assert.deepEqual(merged.revealedCardIds, ['major_0']);
  assert.equal(merged.markers, initial.markers);
  assert.equal(mergeLucyTarotDraw(opened, { ...initial, id: 'another-draw' }), opened);
});
