import assert from 'node:assert/strict';
import test from 'node:test';
import { getOrderedLuckeyPageKeys, getLuckeyPageKeys, nextOrderedLuckeyPage, normalizeOneStopPage } from '../src/lib/omniWarp/oneStopPages';

test('the tour starts at Universe, covers every Luckey dapp exactly once and ends at Profile', () => {
  const pages = getOrderedLuckeyPageKeys();
  assert.equal(pages[0], '/prologue');
  assert.equal(pages.at(-1), '/profile');
  assert.deepEqual(new Set(pages), new Set(getLuckeyPageKeys()));
  assert.equal(pages.length, new Set(pages).size);
  const visited: string[] = [];
  let path = '/chat';
  for (let i = 0; i < pages.length; i++) {
    path = nextOrderedLuckeyPage(path);
    visited.push(normalizeOneStopPage(path));
  }
  assert.deepEqual(visited, pages);
  assert.equal(nextOrderedLuckeyPage(path), '/prologue?tab=universe');
});
test('channel boundaries, route-backed tabs and explicit defaults retain the intended order', () => {
  assert.equal(nextOrderedLuckeyPage('/chat/pro'), '/prologue?tab=universe');
  assert.equal(nextOrderedLuckeyPage('/prologue?tab=universe'), '/ecpr');
  assert.equal(nextOrderedLuckeyPage('/prologue?tab=ecpr'), '/todo');
  assert.equal(nextOrderedLuckeyPage('/todo'), '/orange?tab=secret');
  assert.equal(nextOrderedLuckeyPage('/orange?tab=synergy'), '/trinity?tab=destiny');
  assert.equal(nextOrderedLuckeyPage('/muse?tab=synergy'), '/epilogue?tab=diary');
  assert.equal(nextOrderedLuckeyPage('/epilogue'), '/chronicle');
  assert.equal(nextOrderedLuckeyPage('/chronicle'), '/profile');
  assert.equal(nextOrderedLuckeyPage('/epilogue?tab=profile'), '/prologue?tab=universe');
});
