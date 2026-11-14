import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const audioSource = readFileSync(new URL('../src/lib/audio.ts', import.meta.url), 'utf8');
const ttsSource = readFileSync(new URL('../src/utils/tts.ts', import.meta.url), 'utf8');
const speechMediaSource = readFileSync(new URL('../src/lib/speechMedia.ts', import.meta.url), 'utf8');
const lifecycleSource = audioSource.slice(
  audioSource.indexOf('export function initTTSAudioLifecycle'),
  audioSource.indexOf('export function playStarWishSound'),
);
const recoverySource = audioSource.slice(
  audioSource.indexOf('function launchWebAudioTTSSource'),
  audioSource.indexOf('export function getTTSPlaybackProgress'),
);

test('background return resumes only a native interruption, without a silent keepalive or external focus claim', () => {
  assert.match(audioSource, /Never start a silent HTML media element/);
  assert.match(audioSource, /function startTTSKeepAlive\(\) \{ configureSpeechAudioSession\(\); \}/);
  assert.match(lifecycleSource, /handleSpeechPageVisibility\(false\)/);
  assert.match(lifecycleSource, /handleSpeechPageVisibility\(true\)/);
  assert.doesNotMatch(lifecycleSource, /resumeTTSAudio|\.resume\(\)/);
  assert.match(speechMediaSource, /if \(!active \|\| paused \|\| !player \|\| player\.ended \|\| !player\.paused\) return;/);
  assert.match(speechMediaSource, /resumeSpeechMedia\(\);/);
});

test('hidden pages do not enter a repeated AudioContext resume loop; interruption stops cleanly for manual continuation', () => {
  assert.match(recoverySource, /const visible = typeof document === 'undefined' \|\| document\.visibilityState !== 'hidden';/);
  assert.match(recoverySource, /if \(!visible[\s\S]*?onSourceEnded\(\);[\s\S]*?return;/);
  assert.match(recoverySource, /ttsContextRecoveryAttempts >= 1[\s\S]*?recoverStalledOutput\(\)/);
  assert.match(recoverySource, /if \(visible && \+\+ttsEarlyEndRetries <= 1\)/);
  assert.match(audioSource, /ttsEarlyEndRetries = 0;\s*ttsContextRecoveryAttempts = 0;/);
  assert.match(ttsSource, /const startChunkIndex = getResumableTTSChunkIndex\(lastTTSProgress/);
});
