import test from 'node:test';
import assert from 'node:assert/strict';
import { retainRecentConversation, restoreLatestConversation, loadSavedUnifiedMessages, saveUnifiedMessagesSafely } from '../src/lib/chatHistorySync';
import { processDailyChatArchival } from '../src/lib/chatMemoryArchive';
import { safeLocalStorage } from '../src/utils/safeStorage';
import type { UnifiedMessage } from '../src/lib/chatHistorySync';

const now = Date.now();
const message = (id: string, ageMs: number, role: UnifiedMessage['role'] = 'user'): UnifiedMessage => ({
  id,
  role,
  content: id,
  timestamp: now - ageMs,
});

test('reopening Lucy keeps the latest saved thread, including one from yesterday', () => {
  const kept = retainRecentConversation([
    message('yesterday', 26 * 60 * 60 * 1000),
    message('today', 60 * 60 * 1000, 'assistant'),
    { id: 'greet-old', role: 'model', content: 'old hello', timestamp: now - 3 * 24 * 60 * 60 * 1000 },
  ], now);
  assert.deepEqual(kept.map((entry) => entry.id), ['yesterday', 'today']);
});

test('only the latest 80 messages stay in the visible thread', () => {
  const many = Array.from({ length: 100 }, (_, index) => message(`m-${index}`, (100 - index) * 60 * 60 * 1000));
  const kept = retainRecentConversation(many, now).filter((entry) => entry.role === 'user');
  assert.equal(kept.length, 80);
  assert.equal(kept[0].id, 'm-20');
  assert.equal(kept.at(-1)?.id, 'm-99');
});

test('a date change no longer replaces a recent conversation with a blank greeting', () => {
  safeLocalStorage.setItem('lucy_chat_session_date_v1', '2000-01-01');
  const restored = processDailyChatArchival([
    message('yesterday', 20 * 60 * 60 * 1000),
    message('reply', 19 * 60 * 60 * 1000, 'assistant'),
  ], '제제');
  assert.ok(restored.messages.some((entry) => entry.id === 'yesterday'));
  assert.ok(restored.messages.some((entry) => entry.id === 'reply'));
  assert.ok(restored.messages.some((entry) => entry.role === 'user' && entry.content === 'yesterday'));
});

test('saved history reloads the recent messages instead of only a greeting', () => {
  saveUnifiedMessagesSafely([
    message('kept-user', 2 * 24 * 60 * 60 * 1000),
    message('kept-lucy', 2 * 24 * 60 * 60 * 1000 - 1000, 'model'),
  ]);
  const loaded = loadSavedUnifiedMessages();
  assert.ok(loaded.some((entry) => entry.id === 'kept-user'));
  assert.equal(loaded.some((entry) => entry.id === 'ancient'), false);
});


test('entry restoration merges a newer saved thread even when message counts match', () => {
  const current = [message('old-user', 5000), message('old-reply', 4000, 'model')];
  const saved = [message('new-user', 2000), message('new-reply', 1000, 'model')];
  const restored = restoreLatestConversation(current, saved);
  assert.equal(restored.at(-1)?.id, 'new-reply');
  assert.ok(restored.some(entry => entry.id === 'new-user'));
});

test('restoring saved history never replaces an active reply with an older partial copy', () => {
  const user = message('stream-user', 2000);
  const current = [user, { ...message('stream-answer', 1000, 'model'), content: '현재 이어지는 더 긴 답변' }];
  const saved = [user, { ...message('stream-answer', 1000, 'model'), content: '현재' }];
  const restored = restoreLatestConversation(current, saved);
  assert.equal(restored.at(-1)?.content, '현재 이어지는 더 긴 답변');
  assert.equal(restored, current);
});
