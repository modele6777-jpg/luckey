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
