import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasMeaningfulMasterSession, masterSessionConcern } from '../src/lib/lucyMasterSessionCard';
import type { UnifiedMessage } from '../src/lib/chatHistorySync';

const msg = (id: string, role: 'user' | 'model', content: string): UnifiedMessage =>
  ({ id, role, content, persona: 'lucy', timestamp: Date.now() } as UnifiedMessage);

test('a card is offered only after a real consultation', () => {
  const greetingOnly = [msg('g', 'model', '어서 와 [답변선택: 루시랑 하던 얘기 이어서 | 새로 시작할래]'), msg('u0', 'user', '새로 시작할래'), msg('a0', 'model', '오늘은 어떤 고민이 있어?')];
  assert.equal(hasMeaningfulMasterSession(greetingOnly), false);
  const real = [...greetingOnly, msg('u1', 'user', '요즘 이직을 해야 할지 너무 고민돼'), msg('a1', 'model', '사주로 보면 올해는 변화의 기운이 있어')];
  assert.equal(hasMeaningfulMasterSession(real), true);
  assert.equal(masterSessionConcern(real), '요즘 이직을 해야 할지 너무 고민돼');
});
