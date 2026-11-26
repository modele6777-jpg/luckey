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
  // 계산값은 남는다 (이번 고민에 고른 도구만)
  assert.ok(prompt.includes('"gan":"庚"') && prompt.includes('"zhi":"午"'), 'saju pillars kept');
  assert.ok(prompt.includes('자미두수'), 'the concern-matched tool is carried');
  assert.ok(prompt.includes('명궁'), 'ziwei chart kept');
  assert.ok(prompt.length > 0 && !prompt.includes('우타라아샤다'), 'tools outside this turn\'s selection are not injected');
});

test('slimToolData drops interpretive keys and keeps facts', () => {
  const slim = slimToolData({ star: 1, name: '일백수성', ritualAction: 'x', kyuseiSynthesisMatrix: { a: 1 }, harmonyScore: 80, nested: { deep: { deeper: { deepest: { value: 3, long: 'y'.repeat(500) } } } } }) as any;
  assert.equal(slim.star, 1);
  assert.equal(slim.name, '일백수성');
  assert.equal(slim.ritualAction, undefined);
  assert.equal(slim.kyuseiSynthesisMatrix, undefined);
  assert.equal(slim.harmonyScore, undefined);
});
