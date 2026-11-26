import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectMasterConcernTopic, getMasterDepthPrompts } from '../src/lib/lucyMasterPrompts';

test('the unified pro mode returns six distinct prompts', () => {
  const prompts = getMasterDepthPrompts(1);
  assert.equal(prompts.length, 6);
  assert.equal(new Set(prompts).size, 6);
  // 단계가 없어졌으므로 어떤 인자를 넘겨도 같은 하나의 질문 풀에서 고른다.
  const seen = new Set<string>();
  for (let i = 0; i < 20; i++) for (const q of getMasterDepthPrompts(3, 'general')) seen.add(q);
  for (const q of seen) assert.ok(getMasterDepthPrompts(1, 'love').length === 6 && typeof q === 'string');
});

test('concern topics are detected and lead the chips', () => {
  assert.equal(detectMasterConcernTopic('전 애인과 재회할 수 있을까'), 'love');
  assert.equal(detectMasterConcernTopic('요즘 이직을 해야 할지 고민돼'), 'career');
  assert.equal(detectMasterConcernTopic('대출 때문에 걱정이야'), 'money');
  assert.equal(detectMasterConcernTopic('요즘 너무 불안해'), 'mind');
  assert.equal(detectMasterConcernTopic(''), 'general');
  const love = getMasterDepthPrompts(1, 'love');
  assert.ok(/사랑|인연|놓아야/.test(love.slice(0, 3).join(' ')));
});

test('both gentle and deep prompts live in the same unified pool', () => {
  const seen = new Set<string>();
  for (let i = 0; i < 30; i++) for (const q of getMasterDepthPrompts(1, 'mind')) seen.add(q);
  assert.ok([...seen].some(q => /사주 흐름|쉼/.test(q)), 'gentle concern prompts');
  assert.ok([...seen].some(q => /내려놓아야|의미/.test(q)), 'deep reflective prompts');
});
