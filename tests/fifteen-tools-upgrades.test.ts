import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDetailedSaju, sajuHourOffsetMinutes } from '../src/lib/sajuAnalysis.ts';
import { calculateNatalChart } from '../src/lib/astrologyAnalysis.ts';
import { liurenPersonalPositions } from '../src/lib/divination/liurenMasterEngine.ts';

const base = { birthdate: '1990-05-15', gender: 'female', lunarSolar: 'solar' } as const;

test('saju hour pillar: default −30 min convention, opt-in true solar time by city longitude + equation of time', () => {
  assert.equal(sajuHourOffsetMinutes({ trueSolarTime: false, birthCity: '부산' }, 1990, 5, 15), -30);
  assert.equal(sajuHourOffsetMinutes({ trueSolarTime: true, birthCity: '서울' }, 1990, 5, 15), -28);
  assert.equal(sajuHourOffsetMinutes({ trueSolarTime: true, birthCity: '부산' }, 1990, 5, 15), -20);
  const plain = calculateDetailedSaju({ basic: { ...base, birthtime: '13:20', birthCity: '부산' } } as any)!;
  const solar = calculateDetailedSaju({ basic: { ...base, birthtime: '13:20', birthCity: '부산', trueSolarTime: true } } as any)!;
  assert.equal(plain.pillars.hour?.zhi, '午');
  assert.equal(solar.pillars.hour?.zhi, '未');
  assert.match(solar.timePolicy.summary, /진태양시/);
});

test('western natal chart adds outer planets, whole-sign houses and aspects', () => {
  const r = calculateNatalChart({ basic: { ...base, birthtime: '14:30', birthCity: '서울' } } as any)!;
  assert.equal(r.uranus?.sign.name, '염소자리');
  assert.equal(r.pluto?.sign.name, '전갈자리');
  assert.equal(r.houses?.byBody['태양'], 9);
  assert.equal(r.houses?.byBody['MC'], 10);
  assert.ok(r.majorAspects.some(a => a.bodyA === '목성' && a.bodyB === '천왕성'));
  const noTime = calculateNatalChart({ basic: { ...base, birthCity: '서울' } } as any)!;
  assert.equal(noTime.houses, null);
});

test('liuren places the guest\'s birth-year branch and travelling year on the asking-time board', () => {
  const at = new Date('2026-11-23T11:49:00Z');
  assert.equal(liurenPersonalPositions(at, '午', 1990, 'female')?.xingnian, '丙申');
  assert.equal(liurenPersonalPositions(at, '午', 1990, 'male')?.xingnian, '壬寅');
  assert.equal(liurenPersonalPositions(at, '午', 1990, undefined), null);
});
