import assert from 'node:assert/strict';
import { build, transform } from 'esbuild';
import fs from 'node:fs';
const bundle = await build({ entryPoints: ['src/lib/speechHighlightTiming.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { sentenceIndexAtProgress, trackSpeechHighlight } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const sentences = ['첫 문장입니다.', '다음 문장입니다.'];
assert.equal(sentenceIndexAtProgress(sentences, {elapsed: 0, duration: 10, paused: false}), 0);
assert.equal(sentenceIndexAtProgress(sentences, {elapsed: 6, duration: 10, paused: false}), 1);
assert.equal(sentenceIndexAtProgress(sentences, {elapsed: 600, duration: 1000, paused: false}), 1);
assert.equal(sentenceIndexAtProgress(sentences, {elapsed: -1, duration: 10, paused: false}), 0);
assert.equal(sentenceIndexAtProgress(sentences, {elapsed: 20, duration: 10, paused: false}), 1);
assert.equal(sentenceIndexAtProgress([], {elapsed: 0, duration: 10, paused: false}), -1);
assert.equal(sentenceIndexAtProgress(sentences, {elapsed: 0, duration: NaN, paused: false}), -1);
const nativeSet = globalThis.setInterval, nativeClear = globalThis.clearInterval;
let tick, cleared = false, current = true, progress = null;
const published = [];
globalThis.setInterval = fn => { tick = fn; return 1; };
globalThis.clearInterval = () => { cleared = true; };
try {
  const stop = trackSpeechHighlight(sentences, () => progress, () => current, text => published.push(text));
  // Arbitrarily slow network/decode produces no highlight advancement.
  for (let i = 0; i < 100; i++) tick();
  assert.deepEqual(published, []);
  progress = {elapsed: 0, duration: 10, paused: false}; tick(); tick();
  assert.deepEqual(published, [sentences[0]]);
  progress = {...progress, paused: true};
  for (let i = 0; i < 100; i++) tick();
  assert.deepEqual(published, [sentences[0]]);
  // Resume or return from a throttled background tab catches up to audio position.
  progress = {elapsed: 7, duration: 10, paused: false}; tick();
  assert.deepEqual(published, sentences);
  // A replay starts at the beginning; stale sessions never publish.
  progress.elapsed = 0; tick(); assert.equal(published.at(-1), sentences[0]);
  current = false; progress.elapsed = 8; tick();
  assert.equal(published.length, 3); assert.equal(cleared, true);
  stop();
} finally { globalThis.setInterval = nativeSet; globalThis.clearInterval = nativeClear; }
console.log('Speech highlight timing: latency, measured duration, pause, resume, replay and stale-session checks passed.');

// Exercise the actual audio position reader: no source during loading, frozen
// position on pause, rate-aware resume offset and clamping at buffer end.
const source = fs.readFileSync('src/lib/audio.ts', 'utf8');
const reader = source.slice(source.indexOf('export function getTTSPlaybackProgress'), source.indexOf('export function pauseTTSAudio'));
const js = await transform(reader.replace('export function', 'function'), {loader: 'ts'});
const readAudio = new Function('speechMediaProgress', 'ttsActiveBuffer', 'ttsActiveSource', 'ttsUserExplicitlyPaused', 'ttsPausedOffsetSec', 'ttsStartedAtCtxTime', 'ttsActiveRate', 'getSharedAudioContext', js.code + '; return getTTSPlaybackProgress();');
assert.equal(readAudio(() => null, null, null, false, 0, 0, 1, () => ({currentTime: 100, state: 'running'})), null);
const sample = (active, paused, offset, start, rate, time, state = 'running') => readAudio(() => null, {duration: 20}, active, paused, offset, start, rate, () => ({currentTime: time, state}));
assert.deepEqual(sample({}, false, 5, 100, 1, 103), {elapsed: 8, duration: 20, paused: false});
assert.deepEqual(sample(null, true, 8, 100, 1, 999), {elapsed: 8, duration: 20, paused: true});
assert.deepEqual(sample({}, false, 8, 1000, 2, 1002), {elapsed: 12, duration: 20, paused: false});
assert.deepEqual(sample({}, false, 0, 100, 1, 100, 'suspended'), {elapsed: 0, duration: 20, paused: true});
assert.equal(sample({}, false, 18, 100, 1, 105).elapsed, 20);
console.log('Audio clock: loading, pause offset, resume, rate, suspension and end clamp passed.');
