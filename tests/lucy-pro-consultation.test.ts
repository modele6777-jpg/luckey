import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LUCY_PRO_BUNDLE_CAP,
  continuesLucyProConcern,
  lucyProContinuationNote,
  nextLucyProBundle,
  resetLucyProConsultation,
  type LucyProBundle,
} from '../src/lib/lucyProConsultation';

const career: LucyProBundle = {
  concern: '이직을 해야 할까',
  topic: 'career',
  toolIds: ['saju', 'qimen', 'liuren'],
};

test('a follow-up on the same concern keeps the open tools and adds at most two', () => {
  assert.equal(continuesLucyProConcern(career, '그럼 시기는 언제야?'), true);
  const plan = nextLucyProBundle(career, '그럼 시기는 언제야?', ['saju', 'iching', 'tojeong']);
  assert.equal(plan.continued, true);
  assert.ok(plan.added.length > 0 && plan.added.length <= 2);
  assert.deepEqual(plan.bundle.toolIds.slice(plan.added.length), ['saju', 'qimen', 'liuren']);
  assert.ok(plan.added.every(id => !['saju', 'qimen', 'liuren'].includes(id)));
  assert.match(lucyProContinuationNote(plan), /심화 상담/);
});

test('a different concern resets the bundle instead of stacking tools', () => {
  assert.equal(continuesLucyProConcern(career, '다른 얘기인데 그 사람 마음이 궁금해'), false);
  const plan = nextLucyProBundle(career, '그 사람 마음이 궁금해', ['saju', 'ziwei', 'sukuyo']);
  assert.equal(plan.continued, false);
  assert.equal(plan.bundle.topic, 'love');
  assert.deepEqual(plan.bundle.toolIds, ['saju', 'ziwei', 'sukuyo']);
});

test('the bundle stops growing at the cap and deepens with the tools already open', () => {
  const full: LucyProBundle = {
    concern: '이직을 해야 할까',
    topic: 'career',
    toolIds: ['saju', 'qimen', 'liuren', 'taiyi', 'iching', 'kyusei'],
  };
  assert.equal(full.toolIds.length, LUCY_PRO_BUNDLE_CAP);
  const plan = nextLucyProBundle(full, '그럼 더 자세히 봐줘', ['saju', 'ziwei']);
  assert.equal(plan.continued, true);
  assert.deepEqual(plan.added, []);
  assert.deepEqual(plan.bundle.toolIds, full.toolIds);
});

test('resetting the consultation helper does not throw outside a previous bundle', () => {
  resetLucyProConsultation();
  assert.equal(continuesLucyProConcern(null, '이직할까'), false);
});
