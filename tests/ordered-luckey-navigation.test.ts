import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getOrderedLuckeyPageKeys,
  getLuckeyPageKeys,
  getOrderedLuckeyPageKeysForCurrentApp,
  nextOrderedLuckeyPage,
  previousOrderedLuckeyPage,
  normalizeOneStopPage,
} from '../src/lib/omniWarp/oneStopPages';

test('the ordered listing covers every Luckey internal page exactly once', () => {
  const pages = getOrderedLuckeyPageKeys();
  assert.equal(pages[0], '/prologue');
  assert.equal(pages.at(-1), '/profile');
  assert.deepEqual(new Set(pages), new Set(getLuckeyPageKeys()));
  assert.equal(pages.length, new Set(pages).size);
});

test('horizontal navigation cycles only within the current top-level app', () => {
  for (const path of getOrderedLuckeyPageKeys()) {
    const pages = getOrderedLuckeyPageKeysForCurrentApp(path);
    const current = normalizeOneStopPage(path);
    const index = pages.indexOf(current);
    assert.notEqual(index, -1, `${path} belongs to one app's internal page list`);
    assert.equal(normalizeOneStopPage(nextOrderedLuckeyPage(path)), pages[(index + 1) % pages.length]);
    assert.equal(normalizeOneStopPage(previousOrderedLuckeyPage(path)), pages[(index - 1 + pages.length) % pages.length]);
  }
});

test('app boundaries wrap locally and unsupported routes do not jump to another app', () => {
  assert.equal(nextOrderedLuckeyPage('/prologue?tab=universe'), '/ecpr');
  assert.equal(nextOrderedLuckeyPage('/prologue?tab=ecpr'), '/todo');
  assert.equal(nextOrderedLuckeyPage('/todo'), '/prologue?tab=universe');
  assert.equal(previousOrderedLuckeyPage('/prologue?tab=universe'), '/todo');
  assert.equal(previousOrderedLuckeyPage('/todo'), '/ecpr');

  assert.equal(nextOrderedLuckeyPage('/orange?tab=synergy'), '/orange?tab=secret');
  assert.equal(previousOrderedLuckeyPage('/orange?tab=secret'), '/orange?tab=synergy');
  assert.equal(nextOrderedLuckeyPage('/muse?tab=synergy'), '/muse?tab=artRecommendation');
  assert.equal(nextOrderedLuckeyPage('/epilogue?tab=profile'), '/epilogue?tab=diary');
  assert.equal(previousOrderedLuckeyPage('/epilogue?tab=profile'), '/chronicle');
  assert.equal(nextOrderedLuckeyPage('/chat/pro'), '/chat/pro');
  assert.equal(previousOrderedLuckeyPage('/chat/pro'), '/chat/pro');
});

test('route-backed tabs show the same destination channel identity as the menu', async () => {
  const { getDestinationChannel, CHANNEL_MENU_ICONS } = await import('../src/lib/channelMenuIcons');
  for (const path of ['/profile', '/chronicle', '/epilogue?tab=diary']) {
    assert.equal(getDestinationChannel(path).icon, CHANNEL_MENU_ICONS.epilogue);
  }
  for (const path of ['/ecpr', '/todo', '/prologue?tab=universe']) {
    assert.equal(getDestinationChannel(path).icon, CHANNEL_MENU_ICONS.prologue);
  }
  assert.equal(getDestinationChannel('/muse?tab=roleModel').icon, CHANNEL_MENU_ICONS.muse);
});
