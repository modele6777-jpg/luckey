import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const ttsSource = readFileSync(new URL('../src/utils/tts.ts', import.meta.url), 'utf8');
const hapticsSource = readFileSync(new URL('../src/lib/audioHaptics.ts', import.meta.url), 'utf8');
const completionSource = readFileSync(new URL('../src/lib/completionChime.ts', import.meta.url), 'utf8');
const completionAsset = readFileSync(new URL('../public/audio/tts-message-sent.mp3', import.meta.url));
const chunkedTtsSource = ttsSource.slice(
  ttsSource.indexOf('export const playTTSInChunks'),
  ttsSource.indexOf('export const playConversation'),
);
const singleTtsSource = ttsSource.slice(
  ttsSource.indexOf('export const playTTS = async'),
  ttsSource.indexOf('export function splitSpeechIntoSentences'),
);

test('completion cue uses the bundled message-send audio asset and removes the old synthetic snap', () => {
  assert.ok(completionAsset.length > 5000, 'generated MP3 asset should be present and non-empty');
  assert.equal(completionAsset.subarray(0, 3).toString('ascii'), 'ID3', 'asset should have an MP3 ID3 header');
  assert.match(completionSource, /COMPLETION_SOUND_URL = ["']\/audio\/tts-message-sent\.mp3/);
  assert.match(completionSource, /fetch\(COMPLETION_SOUND_URL/);
  assert.match(completionSource, /context\.decodeAudioData\(bytes\)/);
  assert.doesNotMatch(completionSource, /renderCompletionChime|BODY_FREQUENCY_HZ|createOscillator/);
});

test('a chunked reading plays one completion cue only after its final chunk', () => {
  assert.match(chunkedTtsSource, /const isLastChunk = i === chunks\.length - 1;/);
  assert.match(chunkedTtsSource, /await playTTS\(currentChunkText,[\s\S]*?sequenceSessionId, true/);
  assert.match(chunkedTtsSource, /if \(isLastChunk\)\s*\{[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
  assert.match(singleTtsSource, /ttsState\.activeSessionId === sessionToVerify && !isSequenceChunk[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
  assert.match(singleTtsSource, /preloadCompletionChime\(getSharedAudioContext\(\)\)/);
  assert.match(chunkedTtsSource, /preloadCompletionChime\(ctx\)/);
});

test('the message-send cue uses the shared output bus and leaves external music alone', () => {
  assert.match(hapticsSource, /import \{ playCompletionChime \} from '\.\/completionChime';/);
  assert.match(hapticsSource, /case 'ai_result_chime':\s*\{\s*playCompletionChime\(ctx, bus, volScale\);/);
  assert.match(hapticsSource, /label: '메시지 전송 완료 효과음'/);
  assert.match(hapticsSource, /아이폰 메시지 전송 확인음/);
  assert.doesNotMatch(hapticsSource, /TTS 완료 착|0\.15초의 짧고 또렷한 착/);
  assert.match(completionSource, /source\.connect\(gain\);\s*gain\.connect\(destination\)/);
  assert.match(hapticsSource, /const bus = getHapticBus\(ctx\)/);
  assert.match(ttsSource, /configureSpeechAudioSession\(\);[\s\S]*?duckAmbientAudio\(true/);
  assert.match(ttsSource, /duckAmbientAudio\(false, 1\.2\);[\s\S]*?configureAmbientAudioSession\(\)/);
});
