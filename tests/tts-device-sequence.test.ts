import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playTTSInChunks, stopTTS, pauseTTS, resumeTTS, getCurrentTTSState, splitSpeechIntoChunks, normalizeTextForSpeech } from '../src/utils/tts';

test('device fallback completes each chunk before advancing, stays on device, and cancels promptly', async () => {
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
  const tick = () => new Promise(resolve => setTimeout(resolve, 5));
  const waitFor = async (condition: () => boolean) => { for (let i = 0; i < 400 && !condition(); i++) await tick(); assert.ok(condition()); };
  try {
    const text = Array.from({ length: 18 }, (_, i) => `${i + 1}번째 문장이야. 차분하게 호흡하며 오늘의 마음을 돌아보고 작은 실천을 준비해 보자.`).join(' ');
    const chunks = splitSpeechIntoChunks(normalizeTextForSpeech(text), 240);
    assert.ok(chunks.length > 2);
    let completed = false;
    const reading = playTTSInChunks(text, 'Aoede', 240, undefined, undefined, { skipCompletionChime: true }).then(() => { completed = true; });
    await waitFor(() => current !== null);
    assert.equal(getCurrentTTSState().activeText, chunks[0]);
    assert.equal(serverRequests, 1);
    assert.equal(completed, false);
    pauseTTS();
    const first = current!; current = null; first.onend!();
    await tick();
    assert.equal(current, null, 'a manual pause must hold the next sentence');
    resumeTTS();
    await waitFor(() => current !== null);
    for (let i = 0; i < 200 && !completed; i++) {
      const unit = current;
      if (unit) { current = null; unit.onend!(); }
      await tick();
    }
    await reading;
    assert.equal(serverRequests, 1, 'later chunks must not requery an unavailable server');
    assert.equal(abortedUtterances, 0, 'normal transitions must not cancel an active device utterance');
    assert.equal(spoken.join('').replace(/\s/g, ''), normalizeTextForSpeech(text).replace(/\s/g, ''));
    assert.equal(getCurrentTTSState().activeSessionId, null);

    const oldReading = playTTSInChunks('새로운 낭독이 시작되면 종료되어야 하는 이전 낭독이야.', 'Aoede', 240, undefined, undefined, { skipCompletionChime: true });
    await waitFor(() => current !== null);
    const replacement = playTTSInChunks('사용자가 선택한 새로운 낭독은 이전 종료 처리에 취소되면 안 돼.', 'Aoede', 240, undefined, undefined, { skipCompletionChime: true });
    await oldReading;
    await waitFor(() => current !== null);
    assert.ok(getCurrentTTSState().activeText?.includes('사용자가 선택한'));
    stopTTS();
    await replacement;
    assert.equal(current, null); assert.equal(getCurrentTTSState().activeSessionId, null);
  } finally {
    stopTTS();
    for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
