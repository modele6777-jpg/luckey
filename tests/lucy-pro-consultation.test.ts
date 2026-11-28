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

test('when going deeper Lucy adds a new tool only if it actually helps', () => {
  const already = nextLucyProBundle(career, '더 깊게 봐줘', ['saju', 'iching']);
  assert.equal(already.continued, true);
  assert.deepEqual(already.added, [], '핵심 도구가 이미 켜져 있으면 유지');
  assert.match(lucyProContinuationNote(already), /유리하지 않다/);

  const thin: LucyProBundle = { concern: '이직을 해야 할까', topic: 'career', toolIds: ['saju'] };
  const opened = nextLucyProBundle(thin, '더 깊게 봐줘', ['saju', 'iching']);
  assert.deepEqual(opened.added, ['qimen', 'liuren']);

  const named = nextLucyProBundle(career, '더 깊게 자미두수로도 봐줘', ['saju']);
  assert.deepEqual(named.added, ['ziwei']);
});

test('the same concern can keep adding tools until all 15 are open', () => {
  assert.equal(LUCY_PRO_BUNDLE_CAP, 15);
  const six: LucyProBundle = {
    concern: '이직을 해야 할까',
    topic: 'career',
    toolIds: ['saju', 'qimen', 'liuren', 'taiyi', 'iching', 'kyusei'],
  };
  const plan = nextLucyProBundle(six, '그럼 다른 도구도 봐줘', ['saju']);
  assert.equal(plan.continued, true);
  assert.equal(plan.added.length, 2);
  assert.equal(plan.bundle.toolIds.length, 8);
  assert.deepEqual(plan.bundle.toolIds.slice(2), six.toolIds);
});

test('resetting the consultation helper does not throw outside a previous bundle', () => {
  resetLucyProConsultation();
  assert.equal(continuesLucyProConcern(null, '이직할까'), false);
});
