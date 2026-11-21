import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectMasterConcernTopic, getMasterDepthPrompts } from '../src/lib/lucyMasterPrompts';

test('each depth returns six distinct prompts', () => {
  for (const depth of [1, 2, 3] as const) {
    const prompts = getMasterDepthPrompts(depth);
    assert.equal(prompts.length, 6);
    assert.equal(new Set(prompts).size, 6);
  }
});

test('depth pools do not overlap, so deeper levels really change the chips', () => {
  const all = (d: 1 | 2 | 3) => new Set(Array.from({ length: 30 }, () => getMasterDepthPrompts(d, 'love')).flat());
  const [one, two, three] = [all(1), all(2), all(3)];
  for (const q of three) { assert.ok(!one.has(q) && !two.has(q), q); }
  for (const q of two) { assert.ok(!one.has(q), q); }
});

test('concern topics are detected and lead the chips', () => {
  assert.equal(detectMasterConcernTopic('전 애인과 재회할 수 있을까'), 'love');
  assert.equal(detectMasterConcernTopic('요즘 이직을 해야 할지 고민돼'), 'career');
  assert.equal(detectMasterConcernTopic('대출 때문에 걱정이야'), 'money');
  assert.equal(detectMasterConcernTopic('요즘 너무 불안해'), 'mind');
  assert.equal(detectMasterConcernTopic(''), 'general');
  const love3 = getMasterDepthPrompts(3, 'love');
  assert.ok(/사랑|인연|놓아야/.test(love3.slice(0, 3).join(' ')));
});
