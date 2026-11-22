import test from 'node:test';
import assert from 'node:assert/strict';
import { collectSpeechTranscript, createEndOfSpeechWatcher, speechKey } from '../src/lib/speechAutoSend';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('joins every recognition result so earlier words are kept', () => {
  const results = [
    Object.assign([{ transcript: '요즘 ' }], { isFinal: true }),
    Object.assign([{ transcript: '잠이 안 와' }], { isFinal: false }),
  ];
  assert.deepEqual(collectSpeechTranscript(results), { text: '요즘 잠이 안 와', interim: '잠이 안 와' });
});

test('spacing and punctuation changes count as the same words', () => {
  assert.equal(speechKey('요즘 잠이 안 와.'), speechKey('요즘 잠이 안와'));
});

test('sends once after silence even while iOS repeats the same result', async () => {
  const sent: string[] = [];
  const watcher = createEndOfSpeechWatcher({ silenceMs: 200, onSend: text => sent.push(text) });
  watcher.heard('요즘 잠이');
  await wait(80);
  watcher.heard('요즘 잠이 안 와');
  // 조용한 동안 같은 결과(문장부호만 다른 것 포함)가 계속 와도 타이머가 밀리지 않는다.
  for (let i = 0; i < 6; i++) {
    await wait(50);
    watcher.heard(i % 2 ? '요즘 잠이 안 와.' : '요즘 잠이 안 와');
  }
  await wait(250);
  assert.equal(sent.length, 1);
  assert.match(sent[0], /^요즘 잠이 안 와/);
  assert.equal(watcher.heard('또 말함'), false);
  watcher.dispose();
});

test('waits while sending is not allowed and flush sends what was heard', async () => {
  let allowed = false;
  const sent: string[] = [];
  const watcher = createEndOfSpeechWatcher({ silenceMs: 50, canSend: () => allowed, onSend: text => sent.push(text) });
  watcher.heard('안녕');
  await wait(150);
  assert.equal(sent.length, 0);
  allowed = true;
  assert.equal(watcher.flush(), true);
  assert.deepEqual(sent, ['안녕']);
  assert.equal(watcher.flush(), false);
  watcher.dispose();
});

test('a one-syllable answer like "야" or "응" is sent too', async () => {
  const sent: string[] = [];
  const watcher = createEndOfSpeechWatcher({ silenceMs: 60, onSend: text => sent.push(text) });
  watcher.heard('야');
  await wait(200);
  assert.deepEqual(sent, ['야']);
  watcher.dispose();
});
