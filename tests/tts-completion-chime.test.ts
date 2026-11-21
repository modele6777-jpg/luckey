import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  COMPLETION_CHIME_DURATION,
  COMPLETION_CHIME_PEAK,
  renderCompletionChime,
} from '../src/lib/completionChime.ts';

const ttsSource = readFileSync(new URL('../src/utils/tts.ts', import.meta.url), 'utf8');
const hapticsSource = readFileSync(new URL('../src/lib/audioHaptics.ts', import.meta.url), 'utf8');
const chunkedTtsSource = ttsSource.slice(
  ttsSource.indexOf('export const playTTSInChunks'),
  ttsSource.indexOf('export const playConversation'),
);
const singleTtsSource = ttsSource.slice(
  ttsSource.indexOf('export const playTTS = async'),
  ttsSource.indexOf('export function splitSpeechIntoSentences'),
);

function bandEnergy(samples: Float32Array, sampleRate: number, frequency: number): number {
  const omega = (2 * Math.PI * frequency) / sampleRate;
  const coefficient = 2 * Math.cos(omega);
  let previous = 0;
  let beforePrevious = 0;
  for (let index = 0; index < samples.length; index++) {
    const current = samples[index] + coefficient * previous - beforePrevious;
    beforePrevious = previous;
    previous = current;
  }
  return Math.max(0, previous * previous + beforePrevious * beforePrevious - coefficient * previous * beforePrevious);
}

function spectralCentroid(samples: Float32Array, sampleRate: number): number {
  let total = 0;
  let weighted = 0;
  for (let frequency = 100; frequency <= 4000; frequency += 100) {
    const energy = bandEnergy(samples, sampleRate, frequency);
    total += energy;
    weighted += energy * frequency;
  }
  return weighted / Math.max(total, 0.0001);
}

function rms(samples: Float32Array): number {
  const energy = samples.reduce((sum, value) => sum + value * value, 0);
  return Math.sqrt(energy / Math.max(1, samples.length));
}

test('the TTS completion cue is a very short, crisp snap rather than a bell or bird chirp', () => {
  assert.equal(COMPLETION_CHIME_DURATION, 0.15);
  assert.ok(COMPLETION_CHIME_DURATION <= 0.2, '완료음은 짧게 끝나야 한다');
  assert.ok(COMPLETION_CHIME_PEAK <= 0.15, '완료음은 과하게 크지 않아야 한다');

  const samples = renderCompletionChime(24000);
  assert.equal(samples.length, Math.ceil(24000 * COMPLETION_CHIME_DURATION));
  assert.ok(samples.every(Number.isFinite));
  const peak = Math.max(...samples.map(Math.abs));
  assert.ok(peak <= COMPLETION_CHIME_PEAK + 0.00001);
  assert.ok(peak > COMPLETION_CHIME_PEAK * 0.9, '정규화 피크가 실제로 또렷하게 들릴 크기를 가진다');
  assert.equal(samples[samples.length - 1], 0, '끝은 정확히 0으로 닫혀 클릭이 없다');
  assert.ok(Math.max(...samples.slice(-240).map(Math.abs)) < 0.0001, '마지막 10ms는 잔향 없이 잦아든다');

  const centroid = spectralCentroid(samples, 24000);
  assert.ok(centroid >= 600 && centroid <= 2600, `짧고 선명하되 쨍하지 않아야 한다 (중심 주파수 ${Math.round(centroid)}Hz)`);
  const earlyRms = rms(samples.slice(0, 960));
  const lateRms = rms(samples.slice(1920));
  assert.ok(earlyRms > 0.02, '처음 40ms에 알아차릴 수 있는 스냅이 있다');
  assert.ok(lateRms < earlyRms * 0.2, '효과음이 빠르게 사라져 낭독 뒤에 오래 남지 않는다');
  assert.throws(() => renderCompletionChime(0), RangeError);
});

test('rendering the snap is deterministic so the shared buffer stays identical', () => {
  const first = renderCompletionChime(16000);
  const second = renderCompletionChime(16000);
  assert.deepEqual(Array.from(first), Array.from(second));
});

test('a chunked reading plays one completion cue only after its final chunk', () => {
  assert.match(chunkedTtsSource, /const isLastChunk = i === chunks\.length - 1;/);
  assert.match(chunkedTtsSource, /await playTTS\(currentChunkText,[\s\S]*?sequenceSessionId, true/);
  assert.match(chunkedTtsSource, /if \(isLastChunk\)\s*\{[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
  assert.match(singleTtsSource, /ttsState\.activeSessionId === sessionToVerify && !isSequenceChunk[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
});

test('the completion cue uses the shared output bus and leaves external music alone', () => {
  assert.match(hapticsSource, /import \{ playCompletionChime \} from '\.\/completionChime';/);
  assert.match(hapticsSource, /case 'ai_result_chime':\s*\{\s*playCompletionChime\(ctx, bus, volScale\);/);
  assert.match(hapticsSource, /label: 'TTS 완료 착 소리'/);
  assert.match(hapticsSource, /0\.15초의 짧고 또렷한 착 소리/);
  assert.doesNotMatch(hapticsSource, /completionBirdChirp|playCompletionBirdChirp/);
  assert.match(hapticsSource, /const bus = getHapticBus\(ctx\)/);
  assert.match(ttsSource, /configureSpeechAudioSession\(\);[\s\S]*?duckAmbientAudio\(true/);
  assert.match(ttsSource, /duckAmbientAudio\(false, 1\.2\);[\s\S]*?configureAmbientAudioSession\(\)/);
});
