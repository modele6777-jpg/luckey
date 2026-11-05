import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyLucyTarotReply, UNVERIFIED_TAROT_REPLY, type LucyTarotDraw } from '../src/lib/lucyTarotIntegrity';
import { drawLucyTarotCards } from '../src/utils/tarotDetector';

const draw: LucyTarotDraw = { source: 'app-random', id: 'test-draw', drawnAt: 1, markers: '[TAROT:swords_1:reversed]' };

test('rejects fabricated user-reported card without an app draw', () => {
  assert.equal(verifyLucyTarotReply('검에이스 역방향 카드가 나왔어.', undefined, '내앱이 호리보다 얼마나 정확하고 완성적인지'), UNVERIFIED_TAROT_REPLY);
  assert.equal(verifyLucyTarotReply('타로 한 장을 뽑았어.'), UNVERIFIED_TAROT_REPLY);
  assert.equal(verifyLucyTarotReply('[TAROT:swords_1:reversed] 카드 의미야.'), UNVERIFIED_TAROT_REPLY);
});

test('keeps explanations and ordinary chat distinct from an actual draw', () => {
  const explanation = '검 에이스 역방향의 일반적인 의미를 설명할게. 추첨이 아닌 의미 설명이야.';
  assert.equal(verifyLucyTarotReply(explanation, undefined, '검 에이스 역방향 의미 설명해줘'), explanation);
  const ordinary = '앱 정확도는 실제 평가 데이터로 비교해야 해.';
  assert.equal(verifyLucyTarotReply(ordinary), ordinary);
});

test('accepts the app draw but rejects a different card or orientation', () => {
  const valid = '검에이스 역방향 카드는 생각의 혼란을 돌아보라는 조언이야.';
  assert.equal(verifyLucyTarotReply(valid, draw), valid);
  assert.equal(verifyLucyTarotReply('검 에이스 정방향 카드가 나왔어.', draw), UNVERIFIED_TAROT_REPLY);
  assert.equal(verifyLucyTarotReply('컵 2 역방향 카드가 나왔어.', draw), UNVERIFIED_TAROT_REPLY);
  assert.equal(verifyLucyTarotReply('[TAROT:swords_1:upright] 카드야.', draw), UNVERIFIED_TAROT_REPLY);
});

test('draws distinct cards through Web Crypto without Math.random', () => {
  const original = Math.random;
  try {
    Math.random = () => { throw new Error('Math.random must not select cards'); };
    const cards = drawLucyTarotCards(3);
    assert.equal(cards.length, 3);
    assert.equal(new Set(cards.map(c => c.id)).size, 3);
  } finally { Math.random = original; }
});

test('only explicit reading requests trigger a draw, not meaning questions or accuracy comparisons', async () => {
  const { isLucyTarotDrawRequest } = await import('../src/lib/lucyTarotIntegrity');
  assert.equal(isLucyTarotDrawRequest('타로 한 장 뽑아줘'), true);
  assert.equal(isLucyTarotDrawRequest('카드 3장 뽑아줘'), true);
  assert.equal(isLucyTarotDrawRequest('검 에이스 역방향 의미 설명해줘'), false);
  assert.equal(isLucyTarotDrawRequest('타로 카드는 무엇이야?'), false);
  assert.equal(isLucyTarotDrawRequest('내 앱이 호리보다 얼마나 정확하고 완성적인지'), false);
});

test('validates bilingual card headings and checks beyond the first three mentions', () => {
  const reading = '검 에이스 (Ace of Swords) / 역방향 카드야.';
  assert.equal(verifyLucyTarotReply(reading, draw), reading);
  const three = { ...draw, markers: '[TAROT:major_0:upright] [TAROT:cups_2:upright] [TAROT:swords_1:reversed]' };
  assert.equal(verifyLucyTarotReply('타로 카드: 광대 정방향, 컵 2 정방향, 검 에이스 역방향, 황제 정방향.', three), UNVERIFIED_TAROT_REPLY);
});
