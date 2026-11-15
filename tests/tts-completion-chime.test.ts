import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  COMPLETION_CHIME_DURATION,
  COMPLETION_CHIME_PEAK,
  COMPLETION_CHIME_NOTES,
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
  // Goertzel: energy at one frequency, cheap enough to sweep a few dozen bands.
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

test('the completion chime is a muted two-note ding-dong', () => {
  assert.equal(COMPLETION_CHIME_DURATION, 1);
  assert.ok(COMPLETION_CHIME_PEAK <= 0.16, '완료음은 새소리(0.3)보다 확실히 옅어야 한다');
  assert.equal(COMPLETION_CHIME_NOTES.length, 2, '띵-동 두 음만 울린다');
  const [lower, higher] = [...COMPLETION_CHIME_NOTES].sort((a, b) => a.frequency - b.frequency);
  assert.ok(higher.frequency / lower.frequency < 1.5, '두 음은 한 옥타브 안에서 문안하게 이어진다');
  assert.ok(higher.frequency < 700, '쨍한 고음이 아니라 낮고 따뜻한 음역이어야 한다');

  const samples = renderCompletionChime(24000);
  assert.equal(samples.length, Math.ceil(24000 * COMPLETION_CHIME_DURATION));
  assert.ok(samples.every(Number.isFinite));
  const peak = Math.max(...samples.map(Math.abs));
  assert.ok(peak <= COMPLETION_CHIME_PEAK + 0.00001);
  assert.ok(peak > COMPLETION_CHIME_PEAK * 0.9, '정규화 피크가 실제로 채워져 들리는 크기를 가진다');
  assert.ok(Math.max(...samples.slice(-240).map(Math.abs)) < 0.0001, '끝은 완전히 잦아들어 클릭이 없다');
  const centroid = spectralCentroid(samples, 24000);
  assert.ok(centroid < 1100, `옅고 둥근 톤이어야 한다 (중심 주파수 ${Math.round(centroid)}Hz)`);
  assert.throws(() => renderCompletionChime(0), RangeError);
});

test('rendering the chime is deterministic so the shared buffer stays identical', () => {
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

test('the completion haptic plays the muted ding-dong on the existing shared output bus', () => {
  assert.match(hapticsSource, /import \{ playCompletionChime \} from '\.\/completionChime';/);
  assert.match(hapticsSource, /case 'ai_result_chime':\s*\{\s*playCompletionChime\(ctx, bus, volScale\);/);
  assert.doesNotMatch(hapticsSource, /completionBirdChirp|playCompletionBirdChirp/);
  assert.match(hapticsSource, /const bus = getHapticBus\(ctx\)/);
  // 외부 음악 공존: 완료음은 세션을 승격하지 않고, TTS 종료 뒤 ambient로 돌아온다.
  assert.match(ttsSource, /configureSpeechAudioSession\(\);[\s\S]*?duckAmbientAudio\(true/);
  assert.match(ttsSource, /duckAmbientAudio\(false, 1\.2\);[\s\S]*?configureAmbientAudioSession\(\)/);
});
