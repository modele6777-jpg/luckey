import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveChannelThemeFromPath } from '../src/contexts/ThemeContext';

test('Lucy AI and Plus entry routes use the night palette', () => {
  for (const route of ['/', '/chat', '/lucy', '/CHAT?from=home', '/lucy#latest']) {
    assert.equal(resolveChannelThemeFromPath(route), 'dark', route);
  }
});

test('navigation to existing bright channels restores their light palette', () => {
  for (const route of ['/key', '/key/history', '/calm', '/orb', '/gateway', '/crystal']) {
    assert.equal(resolveChannelThemeFromPath('/chat'), 'dark');
    assert.equal(resolveChannelThemeFromPath(route), 'light', route);
  }
});

test('other existing dark channels retain their palette', () => {
  for (const route of ['/hub', '/muse', '/bluebird', '/epilogue', '/trinity', '/handbook']) {
    assert.equal(resolveChannelThemeFromPath(route), 'dark', route);
  }
});

test('Legacy Pro links share the unified night palette', () => {
  assert.equal(resolveChannelThemeFromPath('/chat/pro'), 'dark');
});
