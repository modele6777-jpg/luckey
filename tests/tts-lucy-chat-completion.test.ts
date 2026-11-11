import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { shouldPlayTTSCompletionChime } from '../src/lib/ttsCompletionPolicy.ts';

const ttsSource = readFileSync(new URL('../src/utils/tts.ts', import.meta.url), 'utf8');
const lucySource = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const autoTtsSource = lucySource.slice(
  lucySource.indexOf('const triggerAutoTts'),
  lucySource.indexOf('// 🌸 사용자 요청'),
);
const manualTtsSource = lucySource.slice(
  lucySource.indexOf('const handleVoicePlay = async'),
  lucySource.indexOf('// Export full conversation as Markdown'),
);

 test('chat completion chirp is quiet by default and only an explicit Lucy opt-in enables it', () => {
  assert.equal(shouldPlayTTSCompletionChime(), true);
  assert.equal(shouldPlayTTSCompletionChime({ isChatMode: true }), false);
  assert.equal(shouldPlayTTSCompletionChime({ isChatMode: true, allowChatCompletionChime: true }), true);
  assert.equal(shouldPlayTTSCompletionChime({ isChatMode: true, allowChatCompletionChime: true, skipCompletionChime: true }), false);
  assert.equal(shouldPlayTTSCompletionChime({ skipCompletionChime: true }), false);
});

test('Lucy auto and manual TTS each use one complete sequence and chirp only after its last chunk', () => {
  assert.match(ttsSource, /if \(isLastChunk\)\s*\{[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
  assert.match(autoTtsSource, /joinKakaoBubblesForTTS\([\s\S]*?playTTSInChunks\(cleanAnswer,[\s\S]*?isChatMode: true,[\s\S]*?allowChatCompletionChime: true,[\s\S]*?isAutoPlay: true/);
  assert.equal([...autoTtsSource.matchAll(/playTTSInChunks\(/g)].length, 1);
  assert.match(manualTtsSource, /playTTSInChunks\(clean,[\s\S]*?isChatMode: true,[\s\S]*?allowChatCompletionChime: true/);
  assert.equal([...manualTtsSource.matchAll(/playTTSInChunks\(/g)].length, 1);
  assert.doesNotMatch(autoTtsSource, /skipCompletionChime:\s*true/);
  assert.doesNotMatch(manualTtsSource, /skipCompletionChime:\s*true/);
});
