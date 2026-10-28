import test from 'node:test';
import assert from 'node:assert/strict';
import { configureAmbientAudioSession, configureSpeechAudioSession, configurePlaybackAudioSession, initTTSAudioLifecycle, primeTTSAudioElement, playTTSAudio, pauseTTSAudio, resumeTTSAudio, stopTTSAudio, isTTSAudioPlaying } from '../src/lib/audio';
import { initTTSSessionHandlers, setTTSSessionActive, clearTTSSession } from '../src/lib/ttsMediaSession';

test('app entry, TTS priming, playback, pause and resume preserve a mixable session without native media playback', async () => {
  const types: string[] = [];
  let type = 'auto';
  let nativePlayers = 0;
  let mediaClaims = 0;
  let contexts = 0;
  let contextInstance: any;
  const sources: any[] = [];
  const param = () => ({ value: 1, setValueAtTime() {} });
  const node = () => ({ connect() {}, disconnect() {}, gain: param(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() });
  class Context {
    state = 'running'; currentTime = 0; sampleRate = 24000; destination = {};
    constructor() { contexts++; contextInstance = this; }
    addEventListener() {}
    createGain = node;
    createDynamicsCompressor = node;
    createBuffer(_channels: number, length: number, rate: number) { return { duration: length / rate, getChannelData: () => new Float32Array(length) }; }
    createBufferSource() { const source = { ...node(), buffer: null, playbackRate: param(), start() {}, stop() {}, onended: null }; sources.push(source); return source; }
    async resume() {}
    async decodeAudioData() { return this.createBuffer(1, 24000, 24000); }
  }
  const originals = new Map(['window', 'navigator', 'document', 'Audio'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { audioSession: { get type() { return type; }, set type(value) { type = value; types.push(value); } }, get mediaSession() { mediaClaims++; return {}; } } });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { AudioContext: Context, addEventListener() {} } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { addEventListener() {} } });
  Object.defineProperty(globalThis, 'Audio', { configurable: true, value: class { constructor() { nativePlayers++; } } });
  try {
    initTTSAudioLifecycle();
    assert.equal(contexts, 0, 'opening the app must not activate an audio context');
    configureAmbientAudioSession(); configureSpeechAudioSession(); configurePlaybackAudioSession();
    primeTTSAudioElement();
    assert.equal(nativePlayers, 0, 'priming must not start a silent native player');
    const pending = playTTSAudio(Buffer.alloc(48000).toString('base64'), 'pcm');
    assert(isTTSAudioPlaying());
    pauseTTSAudio(); assert(!isTTSAudioPlaying());
    resumeTTSAudio(); assert(isTTSAudioPlaying());
    sources.at(-1).onended(); await pending;
    assert(!isTTSAudioPlaying());
    const compressed = playTTSAudio(Buffer.from('ID3-test-audio').toString('base64'), 'mp3');
    await new Promise(resolve => setImmediate(resolve));
    assert(isTTSAudioPlaying(), 'compressed TTS also uses Web Audio');
    stopTTSAudio(); await compressed;
    assert(!isTTSAudioPlaying());
    contextInstance.state = 'interrupted';
    const sourceCount = sources.length;
    await assert.rejects(playTTSAudio(Buffer.alloc(48000).toString('base64'), 'pcm'), /음성 출력이 중단/);
    assert.equal(sources.length, sourceCount, 'a blocked audio context must not silently start an inaudible source');
    contextInstance.state = 'running';
    initTTSSessionHandlers(() => {}); setTTSSessionActive('test'); clearTTSSession();
    assert.equal(mediaClaims, 0, 'external music keeps OS media controls');
    assert.equal(nativePlayers, 0);
    assert(types.length > 0 && types.every(value => value === 'ambient'));
  } finally {
    stopTTSAudio();
    for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
