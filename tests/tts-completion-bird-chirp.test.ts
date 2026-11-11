import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  COMPLETION_BIRD_CHIRP_DURATION,
  COMPLETION_BIRD_CHIRP_PEAK,
  renderCompletionBirdChirp,
} from '../src/lib/completionBirdChirp.ts';

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

test('the completion chirp is brief, gentle, finite audio with a soft tail', () => {
  assert.equal(COMPLETION_BIRD_CHIRP_DURATION, 0.66);
  assert.ok(COMPLETION_BIRD_CHIRP_PEAK <= 0.3);
  const samples = renderCompletionBirdChirp(24000);
  assert.equal(samples.length, Math.ceil(24000 * COMPLETION_BIRD_CHIRP_DURATION));
  assert.ok(samples.every(Number.isFinite));
  const peak = Math.max(...samples.map(Math.abs));
  assert.ok(peak <= COMPLETION_BIRD_CHIRP_PEAK + 0.00001);
  assert.ok(peak > 0.25);
  assert.ok(Math.max(...samples.slice(-240).map(Math.abs)) < 0.00001);
  assert.throws(() => renderCompletionBirdChirp(0), RangeError);
});

test('a chunked reading plays one completion cue only after its final chunk', () => {
  assert.match(chunkedTtsSource, /const isLastChunk = i === chunks\.length - 1;/);
  assert.match(chunkedTtsSource, /await playTTS\(currentChunkText,[\s\S]*?sequenceSessionId, true/);
  assert.match(chunkedTtsSource, /if \(isLastChunk\)\s*\{[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
  assert.match(singleTtsSource, /ttsState\.activeSessionId === sessionToVerify && !isSequenceChunk[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
});

test('the completion haptic now uses the bird chirp on the existing shared output bus', () => {
  assert.match(hapticsSource, /import \{ playCompletionBirdChirp \} from '\.\/completionBirdChirp';/);
  assert.match(hapticsSource, /case 'ai_result_chime':\s*\{\s*playCompletionBirdChirp\(ctx, bus, volScale\);/);
  assert.match(hapticsSource, /const bus = getHapticBus\(ctx\)/);
  assert.match(ttsSource, /configureSpeechAudioSession\(\);[\s\S]*?duckAmbientAudio\(true/);
  assert.match(ttsSource, /duckAmbientAudio\(false, 1\.2\);[\s\S]*?configureAmbientAudioSession\(\)/);
});
