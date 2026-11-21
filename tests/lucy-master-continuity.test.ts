import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  archiveMasterSession,
  buildDepthContinuityContext,
  buildDepthLinkedLucyContext,
  buildPastMasterSessionsContext,
} from '../src/lib/lucyMasterContinuity';
import type { UnifiedMessage } from '../src/lib/chatHistorySync';

const msg = (id: string, role: 'user' | 'model', content: string, timestamp = Date.now()): UnifiedMessage =>
  ({ id, role, content, persona: 'lucy', timestamp } as UnifiedMessage);

const session = [
  msg('g', 'model', '어서 와, 타로 하우스에 온 걸 환영해 [답변선택: 루시랑 하던 얘기 이어서 | 새로 시작할래]'),
  msg('u0', 'user', '새로 시작할래'),
  msg('u1', 'user', '요즘 이직을 해야 할지 너무 고민돼'),
  msg('a1', 'model', '사주로 보면 올해는 변화의 기운이 있어. 언제부터 고민했어?'),
  msg('u2', 'user', '석 달 전부터'),
];

test('depth 1 adds no continuity; depth 2 and 3 carry the earlier turns', () => {
  assert.equal(buildDepthContinuityContext(session, 1), '');
  const two = buildDepthContinuityContext(session, 2);
  assert.match(two, /지금 2단계/);
  assert.match(two, /이직을 해야 할지/);
  assert.match(two, /중심 고민/);
  assert.doesNotMatch(two, /새로 시작할래/);
  assert.doesNotMatch(two, /답변선택/);
  assert.doesNotMatch(two, /타로 하우스에 온 걸/);
});

test('past Master sessions are archived per account and exclude the current one', () => {
  archiveMasterSession('acct-a', session);
  archiveMasterSession('acct-a', session); // same session twice → one entry
  const past = buildPastMasterSessionsContext('acct-a');
  assert.match(past, /지난 점술모드 상담 기록/);
  assert.equal(past.match(/상담 — 고민/g)?.length, 1);
  assert.equal(buildPastMasterSessionsContext('acct-b'), '');
  assert.equal(buildPastMasterSessionsContext('acct-a', 'u0'), '');
  // A session with only a greeting is not archived.
  archiveMasterSession('acct-c', [session[0]]);
  assert.equal(buildPastMasterSessionsContext('acct-c'), '');
});

test('depth 3 links recent regular Lucy turns as reference', () => {
  const linked = buildDepthLinkedLucyContext([msg('r1', 'user', '오늘 회사에서 상사랑 부딪혔어'), msg('r2', 'model', '많이 속상했겠다')]);
  assert.match(linked, /3단계 연결/);
  assert.match(linked, /상사랑 부딪혔어/);
  assert.equal(buildDepthLinkedLucyContext([]), '');
});
