import assert from 'node:assert/strict';
import test from 'node:test';
import { routeAndExecute } from '../src/lib/divination/smartAgentRouter.ts';
import { slimToolData } from '../src/lib/divination/promptSlim.ts';

const profile: any = { basic: { birthdate: '1990-05-15', birthtime: '14:30', birthTimeAccuracy: 'exact', gender: 'female', lunarSolar: 'solar', birthCity: '서울' } };

test('Lucy Pro level 3 sends compact calculated facts, not 200k characters of app prose', () => {
  const r = routeAndExecute({ text: '이직을 해야 할지 고민이에요', profile, isMasterRequested: true, divinationMode: { base: 'tarot_saju' } });
  const prompt = r.promptInjection;
  assert.ok(prompt.length < 60000, `prompt length ${prompt.length}`);
  for (const removed of ['timelineCards', 'ritualAction', 'SynthesisMatrix', 'reflectiveQuestion', 'interpretiveBoundary', '\n  "']) {
    assert.ok(!prompt.includes(removed), removed);
  }
  // 계산값은 남는다
  assert.ok(prompt.includes('"gan":"庚"') && prompt.includes('"zhi":"午"'), 'saju pillars kept');
  assert.ok(prompt.includes('우타라아샤다'), 'vedic nakshatra kept');
  assert.ok(prompt.includes('lord=라후'), 'current mahadasha kept');
  // 시각·연도 공통 판 표시
  assert.ok(prompt.includes('지금 시각의 괘'));
  assert.ok(prompt.includes('올해의 연국'));
});

test('slimToolData drops interpretive keys and keeps facts', () => {
  const slim = slimToolData({ star: 1, name: '일백수성', ritualAction: 'x', kyuseiSynthesisMatrix: { a: 1 }, harmonyScore: 80, nested: { deep: { deeper: { deepest: { value: 3, long: 'y'.repeat(500) } } } } }) as any;
  assert.equal(slim.star, 1);
  assert.equal(slim.name, '일백수성');
  assert.equal(slim.ritualAction, undefined);
  assert.equal(slim.kyuseiSynthesisMatrix, undefined);
  assert.equal(slim.harmonyScore, undefined);
});
