import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveChannelThemeFromPath } from '../src/contexts/ThemeContext';
import { getLucyDayPeriod } from '../src/lib/lucyDayTheme';
const at = (hour: number, minute = 0) => new Date(2026, 9, 29, hour, minute);

test('local morning, blue daytime and night change at their exact boundaries', () => {
  for (const [hour, minute, expected] of [[5,59,'night'],[6,0,'morning'],[10,59,'morning'],[11,0,'day'],[17,59,'day'],[18,0,'night'],[23,59,'night'],[0,0,'night']] as const) {
    assert.equal(getLucyDayPeriod(at(hour, minute)), expected);
  }
});
test('all unified Lucy entry routes follow the device-local clock', () => {
  for (const route of ['/', '/chat', '/lucy', '/CHAT?from=home', '/lucy#latest', '/chat/pro']) {
    assert.equal(resolveChannelThemeFromPath(route, at(8)), 'light', route);
    assert.equal(resolveChannelThemeFromPath(route, at(14)), 'light', route);
    assert.equal(resolveChannelThemeFromPath(route, at(20)), 'dark', route);
  }
});
test('other channel palettes remain unchanged across time periods', () => {
  for (const hour of [8,14,20]) {
    for (const route of ['/key', '/key/history', '/calm', '/orb', '/gateway', '/crystal']) assert.equal(resolveChannelThemeFromPath(route, at(hour)), 'light');
    for (const route of ['/hub', '/muse', '/bluebird', '/epilogue', '/trinity', '/handbook']) assert.equal(resolveChannelThemeFromPath(route, at(hour)), 'dark');
  }
});
