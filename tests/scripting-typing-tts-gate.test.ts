import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { isScriptingTypingComplete } from '../src/lib/scriptingTypingPractice.ts';

const practiceSource = readFileSync(new URL('../src/components/orange/ScriptingTypingPractice.tsx', import.meta.url), 'utf8');
const ttsButtonSource = readFileSync(new URL('../src/components/TTSButton.tsx', import.meta.url), 'utf8');
const dailySecretSource = readFileSync(new URL('../src/components/orange/DailySecret.tsx', import.meta.url), 'utf8');

test('scripting practice is complete only after the entire target is typed exactly', () => {
  const target = '오늘의 문구를 정확히 입력합니다.';
  assert.equal(isScriptingTypingComplete('', target), false);
  assert.equal(isScriptingTypingComplete(target.slice(0, -1), target), false);
  assert.equal(isScriptingTypingComplete(`${target.slice(0, -2)}X.`, target), false);
  assert.equal(isScriptingTypingComplete(`${target} `, target), false);
  assert.equal(isScriptingTypingComplete(target, target), true);
  assert.equal(isScriptingTypingComplete('', ''), false);
});

test('the Kore voice control remains disabled until exact completion and does not auto-play', () => {
  assert.match(practiceSource, /voice="Kore"/);
  assert.match(practiceSource, /disabled=\{!isCompleted \|\| !isScriptingTypingComplete\(userInput, targetText\)\}/);
  assert.match(practiceSource, /if \(isScriptingTypingComplete\(value, targetText\)\)/);
  assert.match(practiceSource, /setIsCompleted\(false\)/);
  assert.doesNotMatch(practiceSource, /playTTS(?:InChunks)?\s*\(/);
  assert.match(dailySecretSource, /onCompletePractice=\{\(\) => markPracticeItem\('affirmation'\)\}/);
  assert.match(ttsButtonSource, /disabled\?: boolean/);
  assert.match(ttsButtonSource, /if \(disabled\) return;/);
  assert.match(ttsButtonSource, /disabled=\{disabled\}/);
});
