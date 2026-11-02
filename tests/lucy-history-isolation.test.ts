import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProHistory, loadProHistory, saveProHistory } from '../src/lib/lucyProHistory';
import { safeLocalStorage, safeSessionStorage } from '../src/utils/safeStorage';
import { queueChatForward, takeChatForward, forwardedChatPrompt } from '../src/lib/lucyChatForward';
import { hasEnteredLucyChatToday, markLucyChatEnteredToday, hasSpokenDailyGreetingToday, markDailyGreetingSpokenToday } from '../src/lib/chatHistorySync';

test('Pro history persists separately and does not read or overwrite the regular transcript', () => {
  const regular = JSON.stringify([{ id: 'regular-secret', role: 'user', content: 'normal only', timestamp: Date.now() }]);
  safeLocalStorage.setItem('chat_history_unified_v3', regular);
  const initial = loadProHistory('isolation-test');
  assert(!JSON.stringify(initial).includes('normal only'));
  saveProHistory('isolation-test', [...initial.messages, { id: 'pro-secret', role: 'user', content: 'pro only', timestamp: Date.now() }]);
  assert(loadProHistory('isolation-test').messages.some(message => message.content === 'pro only'));
  assert.equal(safeLocalStorage.getItem('chat_history_unified_v3'), regular);
  assert(!JSON.stringify(loadProHistory('different-account')).includes('pro only'));
});

test('date rollover clears Pro once, while reopening the same day preserves new messages', () => {
  const now = new Date(2026, 9, 28, 0, 1).getTime();
  const today = '2026-10-28';
  const old = { day: '2026-10-27', messages: [{ id: 'yesterday', role: 'user', content: 'old', timestamp: now - 120000 }] };
  const reset = normalizeProHistory(old, today, now);
  assert(!JSON.stringify(reset).includes('yesterday'));
  const sent = { id: 'today', role: 'user' as const, content: 'new', timestamp: now };
  const sameDay = normalizeProHistory({ ...reset, messages: [...reset.messages, sent] }, today, now);
  assert(sameDay.messages.some(message => message.id === 'today'));
  assert.deepEqual(normalizeProHistory(sameDay, today, now), sameDay);
});

test('daily visit and spoken-greeting markers are independent for both pages', () => {
  markLucyChatEnteredToday('lucy');
  markDailyGreetingSpokenToday('lucy');
  assert(hasEnteredLucyChatToday('lucy'));
  assert(hasSpokenDailyGreetingToday('lucy'));
  assert(!hasEnteredLucyChatToday('lucy-pro'));
  assert(!hasSpokenDailyGreetingToday('lucy-pro'));
  markLucyChatEnteredToday('lucy-pro');
  assert(hasEnteredLucyChatToday('lucy-pro'));
});

test('explicit bubble forwarding is targeted, one-time, account-isolated, and expires next day', () => {
  const payload = queueChatForward('forward-test', 'lucy', 'selected bubble only');
  assert.equal(takeChatForward('forward-test', 'lucy'), null);
  assert.equal(takeChatForward('another-account', 'lucy-pro'), null);
  assert.deepEqual(takeChatForward('forward-test', 'lucy-pro'), payload);
  assert.equal(takeChatForward('forward-test', 'lucy-pro'), null);
  assert(forwardedChatPrompt(payload).includes('selected bubble only'));
  safeSessionStorage.setItem('lucy_chat_forward_v1:forward-test:lucy', JSON.stringify({ ...payload, from: 'lucy-pro', to: 'lucy', day: '2000-01-01' }));
  assert.equal(takeChatForward('forward-test', 'lucy'), null);
  const back = queueChatForward('forward-test', 'lucy-pro', 'answer from pro');
  assert.equal(takeChatForward('forward-test', 'lucy')?.text, back.text);
});
