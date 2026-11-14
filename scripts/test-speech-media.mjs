import assert from 'node:assert/strict';
import { primeSpeechMedia, playSpeechMedia, stopSpeechMedia, pauseSpeechMedia, resumeSpeechMedia, speechMediaProgress } from '../src/lib/speechMedia.ts';
class AudioMock extends EventTarget {
  paused = true; currentTime = 0; duration = 12; src = ''; preload = '';
  setAttribute() {} removeAttribute() { this.src = ''; } load() {}
  play() { this.paused = false; return Promise.resolve(); } pause() { this.paused = true; }
}
let player;
globalThis.Audio = class extends AudioMock { constructor() { super(); player = this; } };
const blobs = new Map(); let nextId = 0;
URL.createObjectURL = blob => { const id = 'blob:' + ++nextId; blobs.set(id, blob); return id; };
URL.revokeObjectURL = id => blobs.delete(id);
primeSpeechMedia(); const primed = player;
let started = 0;
const pending = playSpeechMedia(new Uint8Array([0, 0, 1, 0]), 'pcm', 24000, () => started++);
player.dispatchEvent(new Event('playing')); player.dispatchEvent(new Event('playing'));
assert.equal(started, 1, 'prepare next speech from media events even without animation frames');
assert.equal(player, primed, 'reuse the gesture-unlocked media element');
const wav = new DataView(await blobs.get(player.src).arrayBuffer());
assert.equal(wav.getUint32(24, true), 24000); assert.equal(wav.getUint32(40, true), 4);
player.currentTime = 3; pauseSpeechMedia(); assert.deepEqual(speechMediaProgress(), { elapsed: 3, duration: 12, paused: true });
resumeSpeechMedia(); assert.equal(speechMediaProgress().elapsed, 3); assert.equal(speechMediaProgress().paused, false);
player.dispatchEvent(new Event('ended')); await pending; assert.equal(speechMediaProgress(), null);
const old = playSpeechMedia(new Uint8Array([73, 68, 51, 0]), 'mp3', 24000);
const current = playSpeechMedia(new Uint8Array([73, 68, 51, 1]), 'mp3', 24000);
await old; assert.equal(blobs.size, 1); stopSpeechMedia(); await current; assert.equal(blobs.size, 0);
const failed = playSpeechMedia(new Uint8Array([1]), 'mp3', 24000); player.dispatchEvent(new Event('error')); await assert.rejects(failed); stopSpeechMedia();
console.log('Speech media: PCM header, same-element playback, pause/resume, completion, replacement, stop and errors passed.');

const { setTTSSessionActive, pauseTTSSession, resumeTTSSession, clearTTSSession, initTTSSessionHandlers } = await import('../src/lib/ttsMediaSession.ts');
const registeredHandlers = new Map();
const fakeMediaSession = { playbackState: 'none', metadata: null, setActionHandler: (action, handler) => registeredHandlers.set(action, handler) };
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { mediaSession: fakeMediaSession } });
let stopped = 0, pausedCount = 0, resumed = 0;
initTTSSessionHandlers(() => stopped++, () => pausedCount++, () => resumed++);
setTTSSessionActive('Test');
assert.equal(fakeMediaSession.playbackState, 'none');
pauseTTSSession();
assert.equal(fakeMediaSession.playbackState, 'none');
resumeTTSSession();
assert.equal(fakeMediaSession.playbackState, 'none');
clearTTSSession();
assert.equal(fakeMediaSession.playbackState, 'none');
assert.equal(registeredHandlers.size, 0);
assert.equal(stopped, 0); assert.equal(pausedCount, 0); assert.equal(resumed, 0);
console.log('Speech media: in-app lifecycle passed without publishing OS media controls.');
