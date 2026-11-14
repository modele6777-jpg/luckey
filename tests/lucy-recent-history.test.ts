import test from 'node:test';
import assert from 'node:assert/strict';
import { retainRecentConversation, loadSavedUnifiedMessages, saveUnifiedMessagesSafely } from '../src/lib/chatHistorySync';
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

test('reopening Lucy keeps the recent thread and drops month-old messages', () => {
  const kept = retainRecentConversation([
    message('yesterday', 26 * 60 * 60 * 1000),
    message('today', 60 * 60 * 1000, 'assistant'),
    message('ancient', 30 * 24 * 60 * 60 * 1000),
    { id: 'greet-old', role: 'model', content: 'old hello', timestamp: now - 3 * 24 * 60 * 60 * 1000 },
  ], now);
  assert.deepEqual(kept.map((entry) => entry.id), ['yesterday', 'today']);
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
