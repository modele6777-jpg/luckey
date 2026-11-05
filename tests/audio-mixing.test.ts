import test from 'node:test';
import assert from 'node:assert/strict';
import { configureAmbientAudioSession, initTTSAudioLifecycle, playTTSAudio, pauseTTSAudio, resumeTTSAudio, stopTTSPlayback, getTTSPlaybackProgress, getSharedAudioContext } from '../src/lib/audio';
import { getSpeechMediaElement, primeSpeechMedia } from '../src/lib/speechMedia';

test('explicit native speech owns playback while idle and manually paused speech release it', async () => {
  let type = 'auto', plays = 0, loads = 0, contexts = 0;
  const param = () => ({ value: 1, setValueAtTime() {} });
  const node = () => ({ connect() {}, disconnect() {}, gain: param(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() });
  class Context {
    state = 'suspended'; currentTime = 0; sampleRate = 24000; destination = {};
    constructor() { contexts++; }
    addEventListener() {}
    createGain = node; createDynamicsCompressor = node;
    createBuffer(_channels: number, length: number, rate: number) { return { duration: length / rate, getChannelData: () => new Float32Array(length) }; }
    createBufferSource() { return { ...node(), buffer: null, start() {}, stop() {} }; }
    async resume() { this.state = 'running'; }
  }
  class Media extends EventTarget {
    src = ''; paused = true; currentTime = 0; duration = 3; playbackRate = 1;
    setAttribute() {}
    getAttribute(key: string) { return key === 'src' ? this.src : null; }
    removeAttribute() { this.src = ''; }
    load() { loads++; }
    pause() { this.paused = true; }
    async play() { plays++; this.paused = false; queueMicrotask(() => this.dispatchEvent(new Event('playing'))); }
  }
  const doc = Object.assign(new EventTarget(), { visibilityState: 'visible' });
  const win = Object.assign(new EventTarget(), { AudioContext: Context });
  const originals = new Map(['window', 'navigator', 'document', 'Audio'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { audioSession: { get type() { return type; }, set type(value) { type = value; } }, userActivation: { isActive: false } } });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: win });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: doc });
  Object.defineProperty(globalThis, 'Audio', { configurable: true, value: Media });
  try {
    initTTSAudioLifecycle(); configureAmbientAudioSession(); primeSpeechMedia(false);
    assert.equal(type, 'ambient'); assert.equal(contexts, 0); assert.equal(plays, 0);
    const audio = getSpeechMediaElement() as unknown as Media;
    const first = playTTSAudio(Buffer.alloc(48000).toString('base64'), 'pcm', 24000, undefined, true);
    assert.equal(type, 'playback'); assert.equal(plays, 1); assert.equal(loads, 0);
    audio.currentTime = 1.25;
    pauseTTSAudio();
    assert.equal(type, 'ambient'); assert.equal(audio.paused, true);
    doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(plays, 1, 'returning must not override an explicit user pause');
    resumeTTSAudio();
    assert.equal(type, 'playback'); assert.equal(audio.currentTime, 1.25);
    const ctx = getSharedAudioContext(); assert.equal(ctx.state, 'suspended');
    assert.equal(getTTSPlaybackProgress()?.elapsed, 1.25);
    audio.dispatchEvent(new Event('ended')); await first;
    const second = playTTSAudio(Buffer.alloc(48000).toString('base64'), 'pcm', 24000, undefined, true);
    assert.equal(getSpeechMediaElement() as unknown, audio);
    assert.equal(loads, 0, 'chunk transitions must not clear/load the shared native element');
    audio.pause();
    doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(audio.paused, false, 'a system interruption may recover if user play intent remains active');
    stopTTSPlayback(); await second;
    assert.equal(type, 'ambient'); assert.equal(audio.paused, true); assert.equal(audio.src, '');
  } finally {
    stopTTSPlayback();
    for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
