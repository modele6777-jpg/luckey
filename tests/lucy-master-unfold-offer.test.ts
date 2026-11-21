import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTarotOfferOnUnfold, shouldOfferTarotOnUnfold } from '../src/lib/lucyMasterMode';

const msg = (role: 'user' | 'model', content: string) => ({ id: `${role}-${content.length}`, role, content, timestamp: 0 }) as any;
const greeting = msg('model', '안녕. 일반 루시랑 나눴던 이야기를 이어서 가져올까, 아니면 새로 시작할까?\n[답변선택: 루시랑 하던 얘기 이어서 | 새로 시작할래]');

test('no tarot offer while the carry-over question is unanswered', () => {
  assert.equal(shouldOfferTarotOnUnfold([greeting], 'undecided'), false);
  assert.equal(shouldOfferTarotOnUnfold([greeting], 'fresh'), false);
});

test('no tarot offer while Lucy waits on any answer choice', () => {
  const asks = msg('model', '어떤 쪽이 궁금해?\n[답변선택: 연애 | 일]');
  assert.equal(shouldOfferTarotOnUnfold([greeting, msg('user', '새로 시작할래'), asks], 'fresh'), false);
});

test('offer once the conversation is underway', () => {
  const answer = msg('model', '요즘 일 흐름은 이렇게 보여.');
  const list = [greeting, msg('user', '새로 시작할래'), answer];
  assert.equal(shouldOfferTarotOnUnfold(list, 'fresh'), true);
  assert.equal(shouldOfferTarotOnUnfold([...list, createTarotOfferOnUnfold()], 'fresh'), false);
});
