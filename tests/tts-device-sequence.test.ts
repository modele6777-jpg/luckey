import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playTTSInChunks, stopTTS, getCurrentTTSState } from '../src/utils/tts';

test('server failure stops reading and never uses device speech', async () => {
  const originals = new Map(['window', 'document', 'navigator', 'Audio', 'SpeechSynthesisUtterance', 'fetch'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const parameter = () => ({ value: 1, setValueAtTime() {}, cancelScheduledValues() {}, linearRampToValueAtTime() {}, setTargetAtTime() {} });
  const node = () => ({ connect() {}, disconnect() {}, gain: parameter(), threshold: parameter(), knee: parameter(), ratio: parameter(), attack: parameter(), release: parameter() });
  class Context {
    state = 'running'; currentTime = 0; sampleRate = 24000; destination = {};
    addEventListener() {} createGain = node; createDynamicsCompressor = node; createAnalyser = node;
    createBuffer(_channels: number, length: number, rate: number) { return { duration: length / rate, getChannelData: () => new Float32Array(length) }; }
    createBufferSource() { return { ...node(), buffer: null, start() {}, stop() {} }; }
    async resume() {}
  }
  class Media extends EventTarget {
    src = ''; paused = true; currentTime = 0; duration = 0;
    setAttribute() {} getAttribute() { return this.src; }
    removeAttribute() { this.src = ''; } load() {} pause() { this.paused = true; }
    async play() { this.paused = false; }
  }
  class Utterance {
    onend: (() => void) | null = null; onerror: (() => void) | null = null;
    constructor(public text: string) {}
  }
  let current: Utterance | null = null, abortedUtterances = 0, serverRequests = 0;
  const spoken: string[] = [];
  const synth = {
    paused: false,
    getVoices: () => [{ name: 'Test Korean', lang: 'ko-KR', localService: true }],
    speak: (unit: Utterance) => { assert.equal(current, null, 'the previous utterance must finish first'); current = unit; spoken.push(unit.text); },
    cancel: () => { if (current) abortedUtterances++; current = null; },
    pause() { this.paused = true; }, resume() { this.paused = false; },
  };
  const win = Object.assign(new EventTarget(), { AudioContext: Context, speechSynthesis: synth });
  const doc = Object.assign(new EventTarget(), { visibilityState: 'visible' });
  const globals: Record<string, unknown> = {
    window: win, document: doc, navigator: { userAgent: 'test', userActivation: { isActive: false }, audioSession: { type: 'ambient' } }, Audio: Media, SpeechSynthesisUtterance: Utterance,
    fetch: async () => { serverRequests++; return new Response(JSON.stringify({ code: 'TTS_PROVIDER_UNAVAILABLE' }), { status: 503, headers: { 'Content-Type': 'application/json' } }); },
  };
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  try {
    const text = Array.from({ length: 18 }, (_, i) => `${i + 1}번째 문장이야. 서버 음성으로만 읽어야 해.`).join(' ');
    await assert.rejects(playTTSInChunks(text, 'Aoede', 240, undefined, undefined, { skipCompletionChime: true }));
    assert.equal(serverRequests, 1, 'provider rejection must stop without repeated chunk requests');
    assert.deepEqual(spoken, [], 'device speech must never be used');
    assert.equal(current, null);
    assert.equal(getCurrentTTSState().activeSessionId, null);
    assert.equal(getCurrentTTSState().isLoading, false);
    assert.equal(getCurrentTTSState().isSpeaking, false);
  } finally {
    stopTTS();
    for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
