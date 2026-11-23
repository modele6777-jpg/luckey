import assert from 'node:assert/strict';
import test from 'node:test';
import { meihuaTimeCast, calculateIchingMaster } from '../src/lib/divination/ichingMasterEngine.ts';

test('I Ching uses Meihua year-month-day-hour casting (year branch + lunar month/day + hour branch)', () => {
  // 2026-11-23 20:49 KST → 서울 태양시 20:17 = 술시(11) · 丙午년(오=7) · 음력 10월 15일
  const cast = meihuaTimeCast(new Date('2026-11-23T11:49:00Z'));
  assert.deepEqual({ upper: cast.upper, lower: cast.lower, moving: cast.moving }, { upper: 8, lower: 3, moving: 1 });
  const r = calculateIchingMaster(new Date('2026-11-23T11:49:00Z'));
  assert.equal(r.primary.name.replace(/\s.*/, ''), '지화명이');
  assert.deepEqual(r.movingLines, [1]);
  assert.match(r.casting ?? '', /매화역수/);
});

test('23:00 solar time belongs to the next day\'s 子 hour', () => {
  // 2026-11-23 23:40 KST → 23:08 태양시 → 다음 날(음력 10/16) 자시(1)
  const cast = meihuaTimeCast(new Date('2026-11-23T14:40:00Z'));
  assert.match(cast.note, /10월 16일/);
  assert.match(cast.note, /자시\(1\)/);
});

test('thrown lines are used as-is', () => {
  const r = calculateIchingMaster([7, 7, 7, 8, 8, 8]);
  assert.equal(r.casting, '직접 던진 효(六爻)');
});
