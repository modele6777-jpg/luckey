import assert from 'node:assert/strict';
import test from 'node:test';
import { createDefaultGreeting } from '../src/lib/chatHistorySync';

const localDate = (hour: number, minute = 0) => new Date(2026, 9, 29, hour, minute);
const greetingText = (hour: number, minute = 0) => {
  const message = createDefaultGreeting('lucy', '쭈', false, false, localDate(hour, minute));
  assert.equal(typeof message.content, 'string');
  return message.content as string;
};

test('Lucy greetings follow the device-local time-of-day boundaries', () => {
  const cases = [
    [5, 59, '늦은 시간에도 반가워'],
    [6, 0, '좋은 아침'],
    [10, 59, '좋은 아침'],
    [11, 0, '안녕'],
    [17, 59, '안녕'],
    [18, 0, '좋은 저녁'],
    [21, 59, '좋은 저녁'],
    [22, 0, '늦은 시간에도 반가워'],
    [0, 0, '늦은 시간에도 반가워'],
  ] as const;

  for (const [hour, minute, expected] of cases) {
    assert.ok(greetingText(hour, minute).startsWith(`${expected}, 쭈!`), `${hour}:${minute}`);
  }
});

test('Plus and Pro welcome messages use the same local-time greeting', () => {
  const plus = createDefaultGreeting('lucy', '쭈', false, true, localDate(8));
  const pro = createDefaultGreeting('lucy', '쭈', true, false, localDate(23));

  assert.equal(typeof plus.content, 'string');
  assert.equal(typeof pro.content, 'string');
  assert.ok((plus.content as string).startsWith('좋은 아침, 쭈!'));
  assert.ok((pro.content as string).startsWith('늦은 시간에도 반가워, 쭈!'));
  assert.equal(plus.mode, 'casual');
  assert.equal(pro.mode, 'master');
});

test('the generic traveler greeting does not add an artificial name', () => {
  const message = createDefaultGreeting('lucy', '여행자', false, false, localDate(14));
  assert.equal(typeof message.content, 'string');
  assert.ok((message.content as string).startsWith('안녕!'));
});

test('Lucy Pro merge does not invent a Lucy Chat greeting', async () => {
  const { mergeUnifiedMessages, isLucyChatStyleGreeting, createDefaultGreeting } = await import('../src/lib/chatHistorySync');
  const { normalizeProHistory } = await import('../src/lib/lucyProHistory');
  const { getLucyChatDay } = await import('../src/lib/lucyChatDay');
  const casual = createDefaultGreeting('lucy', '제제', false, false, new Date(2026, 10, 29, 3, 36));
  assert.equal(isLucyChatStyleGreeting(casual), true);
  assert.match(String(casual.content), /오늘 하루는 어땠어/);
  const house = {
    id: 'tarot-house-1',
    role: 'model' as const,
    content: '어서 와, 제제, 루시의 타로 하우스에 온 걸 환영해',
    timestamp: Date.now(),
  };
  const merged = mergeUnifiedMessages([casual, house], [], { injectGreeting: false });
  assert.deepEqual(merged.map((message) => message.id), ['tarot-house-1']);
  assert.equal(mergeUnifiedMessages([], [], { injectGreeting: false }).length, 0);
  const normalized = normalizeProHistory({ day: getLucyChatDay(), messages: [casual, house] });
  assert.equal(normalized.messages.some((message) => isLucyChatStyleGreeting(message)), false);
  assert.equal(normalized.messages.some((message) => message.id === 'tarot-house-1'), true);
});
