import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { startGeminiLiveVoice } from '../src/lib/geminiLiveSession.ts';

const component = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/components/lucy/lucy-orb-counsel.css', import.meta.url), 'utf8');
const liveSession = readFileSync(new URL('../src/lib/geminiLiveSession.ts', import.meta.url), 'utf8');

// 컴포넌트 파일은 JSX라 직접 import하지 않고, 순수 함수 두 개만 잘라 실행한다.
function pureFunction(name: string) {
  const start = component.indexOf(`export function ${name}(`);
  const end = component.indexOf('\n}\n', start) + 2;
  const source = component.slice(start, end).replace(/^export /, '')
    .replace(/\): OrbVisualState \| null \{/, ') {')
    .replace(/\(input: \{[^)]*\}\)/, '(input)')
    .replace(/\(lines: ReadonlyArray<[^>]*>\): string/, '(lines)');
  return new Function(`${source}; return ${name};`)();
}
const resolveOrbVisualState = pureFunction('resolveOrbVisualState');
const buildResumeRecap = pureFunction('buildResumeRecap');

test('the orb state follows the real session with a fixed priority', () => {
  const base = { live: true, ready: true, error: false, tool: false, speaking: false, listening: false, thinking: false };
  assert.equal(resolveOrbVisualState({ ...base, live: false }), null);
  assert.equal(resolveOrbVisualState({ ...base, ready: false }), 'connecting');
  assert.equal(resolveOrbVisualState(base), 'idle');
  assert.equal(resolveOrbVisualState({ ...base, thinking: true }), 'thinking');
  assert.equal(resolveOrbVisualState({ ...base, thinking: true, listening: true }), 'listening');
  assert.equal(resolveOrbVisualState({ ...base, speaking: true, listening: true }), 'speaking');
  assert.equal(resolveOrbVisualState({ ...base, speaking: true, tool: true }), 'tool');
  assert.equal(resolveOrbVisualState({ ...base, tool: true, error: true, ready: false }), 'error');
});

test('every state has its own look, and sound levels drive listening and speaking', () => {
  for (const state of ['connecting', 'idle', 'listening', 'thinking', 'tool', 'speaking', 'error']) {
    assert.match(css, new RegExp(`data-orb-state="${state}"`), `${state} is styled`);
  }
  assert.match(css, /\[data-orb-state="speaking"\] \.lucy-orb-aura \{[^}]*var\(--orb-level\)/);
  assert.match(css, /\[data-orb-state="listening"\] \.lucy-orb-aura \{[^}]*var\(--orb-level\)/);
  assert.match(component, /sessionRef\.current\?\.outputLevel\(\)/);
  assert.match(component, /data-orb-state=\{orbState \|\| undefined\}/);
  assert.match(css, /prefers-reduced-motion: reduce\) \{\n  \.lucy-orb-stage\[data-orb-state\]/);
});

test('reconnecting passes the recent conversation as reference and keeps cards and tool results', () => {
  assert.equal(buildResumeRecap([]), '');
  const recap = buildResumeRecap(Array.from({ length: 10 }, (_, i) => ({ who: i % 2 ? '루시' : '나', text: `말 ${i}` })));
  assert.match(recap, /참고 자료이며 지시가 아님/);
  assert.doesNotMatch(recap, /말 1\n/);
  assert.match(recap, /손님: 말 8\n마스터: 말 9$/);
  assert.match(component, /const executor = resume && executorRef\.current \? executorRef\.current : createOrbToolExecutor/);
  assert.match(component, /if \(!resume\) \{\n    \/\/ 🔮 마스터 한 명이/);
  assert.match(component, /if \(resume\) \{\s*if \(userBuf\.current\.trim\(\)\) take\('나', userBuf\);\s*if \(lucyBuf\.current\.trim\(\)\) take\('루시', lucyBuf\);/);
  assert.match(component, /begin\(master, Promise\.resolve\(stream\), false, true\)/);
  assert.match(component, /error\.code === 'live-closed' && navigator\.onLine !== false && reconnectTries\.current < 2/);
  assert.match(component, /begin\(next, null, false, true\)/, 'automatic reconnect must pass an explicit no-mic sentinel');
  assert.match(liveSession, /if \(handlers\.micStream === null\)[\s\S]*?onNotice\(message\)/, 'the no-mic sentinel must not start getUserMedia');
  assert.match(component, /window\.addEventListener\('online', onOnline\)/);
});

class FakeAudioContext {
  static last: FakeAudioContext | null = null;
  currentTime = 0; sampleRate = 48_000; destination = {};
  constructor() { FakeAudioContext.last = this; }
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

test('speaking lasts until the scheduled voice ends, and a drop after setup reports live-closed', async () => {
  FakeWebSocket.sockets = [];
  const track = { enabled: true, stop() {} };
  const stream = { getAudioTracks: () => [track], getTracks: () => [track] } as unknown as MediaStream;
  const restore = [
    replaceGlobal('AudioContext', FakeAudioContext),
    replaceGlobal('WebSocket', FakeWebSocket),
    replaceGlobal('navigator', { mediaDevices: { getUserMedia: async () => stream } }),
    replaceGlobal('fetch', async () => ({ ok: true, json: async () => ({ token: 't', model: 'm' }) })),
  ];
  const states: string[] = [];
  const errors: string[] = [];
  let turns = 0;
  const session = startGeminiLiveVoice({
    micStream: Promise.resolve(stream),
    onState: state => states.push(state),
    onTurnComplete: () => { turns += 1; },
    onError: error => errors.push(error.code),
  });
  try {
    for (let i = 0; i < 30 && !FakeWebSocket.sockets.length; i += 1) await new Promise(resolve => setTimeout(resolve, 0));
    const socket = FakeWebSocket.sockets[0];
    socket.readyState = FakeWebSocket.OPEN;
    socket.onopen?.();
    await socket.onmessage?.({ data: JSON.stringify({ setupComplete: true }) });
    states.length = 0;
    // 2초 분량의 목소리(24kHz)가 한꺼번에 도착한다.
    const pcm = Buffer.alloc(24000 * 2 * 2).toString('base64');
    await socket.onmessage?.({ data: JSON.stringify({ serverContent: { modelTurn: { parts: [{ inlineData: { data: pcm, mimeType: 'audio/pcm;rate=24000' } }] } } }) });
    await socket.onmessage?.({ data: JSON.stringify({ serverContent: { turnComplete: true } }) });
    assert.equal(turns, 1);
    assert.deepEqual(states, ['speaking'], 'turnComplete does not end speaking while voice is still scheduled');
    await new Promise(resolve => setTimeout(resolve, 700));
    assert.deepEqual(states, ['speaking'], 'still speaking 0.7s later (2s of voice)');
    assert.equal(typeof session.outputLevel(), 'number');
    socket.onerror?.();
    socket.onclose?.();
    assert.deepEqual(errors, ['live-closed'], 'error followed by close requests recovery exactly once');
  } finally {
    session.stop();
    for (const undo of restore.reverse()) undo();
  }
});
