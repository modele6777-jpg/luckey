import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const calmApp = readFileSync(new URL('../public/calm/app.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('Calm never uses or cancels browser-native speech synthesis', () => {
  assert.doesNotMatch(calmApp, /speechSynthesis|SpeechSynthesisUtterance|browserTtsInterval|activeUtterance/);
});

test('Calm narration stays on the server-generated audio route', () => {
  assert.match(calmApp, /fetch\('\/api\/ai\/tts'/);
  assert.match(calmApp, /naturalVoiceUrl\(data\)/);
});

test('unused translator, HTTP and ZIP packages are not kept as project dependencies', () => {
  assert.equal(packageJson.dependencies?.['google-tts-api'], undefined);
  assert.equal(packageJson.dependencies?.axios, undefined);
  assert.equal(packageJson.dependencies?.['adm-zip'], undefined);
});
