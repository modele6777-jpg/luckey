import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveFoldCover } from '../src/lib/duoFoldCover.ts';

test('last touch on unfolded Lucy+ cosmic room folds into the cosmic room', () => {
  for (const currentPath of ['/', '/chat', '/lucy', '/chat/pro', '/chat?mode=pro']) {
    assert.deepEqual(
      resolveFoldCover({
        lastTouched: 'left',
        currentPath,
        lastLeftChannelPath: '/key',
      }),
      { kind: 'cosmic' },
    );
  }
});

test('last touch on Lucy folds into Lucy, not the cosmic room', () => {
  assert.deepEqual(
    resolveFoldCover({
      lastTouched: 'right',
      currentPath: '/chat',
      lastLeftChannelPath: '/muse',
    }),
    { kind: 'lucy', navigateTo: null },
  );
});

test('last touch on a left channel keeps that channel', () => {
  assert.deepEqual(
    resolveFoldCover({
      lastTouched: 'left',
      currentPath: '/orange',
      lastLeftChannelPath: '/orange',
    }),
    { kind: 'channel', navigateTo: null },
  );
});
