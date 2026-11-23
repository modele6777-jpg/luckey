import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CAPTION_CHAR_MS, advanceCaption, captionSteps } from '../src/lib/orb/orbCaption.ts';
import { startGeminiLiveVoice } from '../src/lib/geminiLiveSession.ts';

// 운영 서버(사주 마스터)에서 실제로 받은 말 조각 순서.
const FRAGMENTS = ['올해는 사회적인 ', '책임과', ' 역할이 커지면서', ' 커리어의 새로운', ' 전기를 맞이할 수', ' 있는 시기입니다.', ' 본래', ' 단단한 결단력과', ' 추진력을', ' 가지고 계시니, 변화를', ' 두려워하지', ' 않고 어려움을', ' 돌파할 힘이', ' 충분합니다. 다만', ' 책임감이'];

test('captions fill from the start of the sentence like TV subtitles, never showing only the tail', () => {
  const shown: string[] = [];
  let page = '';
  for (const fragment of FRAGMENTS) {
    const result = captionSteps(page, fragment);
    page = result.page;
    shown.push(...result.steps.map(step => step.page));
    assert.equal(result.steps[0].afterChars, 0, 'the first step of a fragment shows at once');
  }
  assert.deepEqual(shown, [
    '올해는 사회적인',
    '올해는 사회적인 책임과',
    '올해는 사회적인 책임과 역할이 커지면서',
    '올해는 사회적인 책임과 역할이 커지면서 커리어의 새로운',
    '올해는 사회적인 책임과 역할이 커지면서 커리어의 새로운 전기를 맞이할 수',
    '있는 시기입니다.',
    '본래',
    '본래 단단한 결단력과',
    '본래 단단한 결단력과 추진력을',
    '본래 단단한 결단력과 추진력을 가지고 계시니, 변화를',
    '본래 단단한 결단력과 추진력을 가지고 계시니, 변화를 두려워하지',
    '본래 단단한 결단력과 추진력을 가지고 계시니, 변화를 두려워하지 않고',
    '어려움을',
    '어려움을 돌파할 힘이',
    '어려움을 돌파할 힘이 충분합니다.',
    '다만',
    '다만 책임감이',
  ]);
  for (const line of shown) assert.ok(line.length <= 40, `"${line}" fits two lines`);
  // 한 조각 안에서 쪽이 바뀌면 뒤쪽은 앞 글자를 말한 뒤에 나온다.
  const split = captionSteps('어려움을 돌파할 힘이', ' 충분합니다. 다만');
  assert.deepEqual(split.steps, [{ page: '어려움을 돌파할 힘이 충분합니다.', afterChars: 0 }, { page: '다만', afterChars: 8 }]);
  assert.ok(8 * CAPTION_CHAR_MS >= 900, 'about the time it takes to say the words before it');
  // 단어 중간에서 끊겨 온 조각은 앞 단어에 붙는다.
  assert.equal(advanceCaption('잠시만요, 사주명', '리로').trim(), '잠시만요, 사주명리로');
});

test('the Orb shows captions from the timed onCaption, not from the raw transcript', () => {
  const component = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
  assert.match(component, /onCaption: \(text\) => \{\n\s*const \{ steps, page \} = captionSteps\(captionPageRef\.current, text\);/);
  assert.match(component, /step\.afterChars \* CAPTION_CHAR_MS/);
  assert.doesNotMatch(component, /captionLine\(/);
});

class FakeAudioContext {
  currentTime = 0; sampleRate = 48_000; destination = {};
  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
  createMediaStreamSource() { return { connect() {}, disconnect() {} }; }
  createScriptProcessor() { return { onaudioprocess: null, connect() {}, disconnect() {} }; }
  createGain() { return { gain: { value: 1 }, connect() {} }; }
  createBuffer(_c: number, length: number, rate: number) { const data = new Float32Array(length); return { duration: length / rate, getChannelData: () => data }; }
  createBufferSource() { return { buffer: null, connect() {}, start() {}, stop() {}, onended: null }; }
}
class FakeWebSocket {
  static OPEN = 1; static sockets: FakeWebSocket[] = [];
  readyState = 0; sent: string[] = [];
  onopen: (() => void) | null = null; onmessage: ((event: { data: string }) => void | Promise<void>) | null = null;
  onerror: (() => void) | null = null; onclose: (() => void) | null = null;
  constructor() { FakeWebSocket.sockets.push(this); }
  send(message: string) { this.sent.push(message); }
  close() { this.readyState = 3; }
}
function replaceGlobal(name: string, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  return () => { if (previous) Object.defineProperty(globalThis, name, previous); else Reflect.deleteProperty(globalThis, name); };
}

test('each caption fragment is released when its voice chunk starts playing, and interruption drops the rest', async () => {
  FakeWebSocket.sockets = [];
  const track = { enabled: true, stop() {} };
  const stream = { getAudioTracks: () => [track], getTracks: () => [track] } as unknown as MediaStream;
  const restore = [
    replaceGlobal('AudioContext', FakeAudioContext),
    replaceGlobal('WebSocket', FakeWebSocket),
    replaceGlobal('navigator', { mediaDevices: { getUserMedia: async () => stream } }),
    replaceGlobal('fetch', async () => ({ ok: true, json: async () => ({ token: 't', model: 'm' }) })),
  ];
  const shown: Array<[string, number]> = [];
  const raw: string[] = [];
  let resets = 0;
  const t0 = Date.now();
  const session = startGeminiLiveVoice({
    micStream: Promise.resolve(stream),
    onLucyText: text => raw.push(text),
    onCaption: text => shown.push([text, Date.now() - t0]),
    onCaptionReset: () => { resets += 1; },
  });
  try {
    for (let i = 0; i < 30 && !FakeWebSocket.sockets.length; i += 1) await new Promise(resolve => setTimeout(resolve, 0));
    const socket = FakeWebSocket.sockets[0];
    socket.readyState = FakeWebSocket.OPEN;
    socket.onopen?.();
    await socket.onmessage?.({ data: JSON.stringify({ setupComplete: true }) });
    const second = Buffer.alloc(24000 * 2 * 0.4).toString('base64'); // 0.4초 분량
    const chunk = (text: string) => socket.onmessage?.({ data: JSON.stringify({ serverContent: { modelTurn: { parts: [{ inlineData: { data: second, mimeType: 'audio/pcm;rate=24000' } }] }, outputTranscription: { text } } }) });
    // 세 조각이 한꺼번에 도착한다 (목소리 1.2초 분량).
    await chunk('하나');
    await chunk(' 둘');
    await chunk(' 셋');
    assert.deepEqual(raw, ['하나', ' 둘', ' 셋'], 'the transcript itself still arrives at once');
    assert.equal(shown.length, 1, 'only the first fragment is shown right away');
    await new Promise(resolve => setTimeout(resolve, 480));
    assert.equal(shown.length, 2, 'the second appears when its voice starts (~0.4s)');
    assert.ok(shown[1][1] >= 350, `second caption waited for its voice (${shown[1][1]}ms)`);
    socket.onmessage?.({ data: JSON.stringify({ serverContent: { interrupted: true } }) });
    await new Promise(resolve => setTimeout(resolve, 500));
    assert.equal(shown.length, 2, 'interruption drops captions that were never heard');
    assert.equal(resets, 1);
  } finally {
    session.stop();
    for (const undo of restore.reverse()) undo();
  }
});
