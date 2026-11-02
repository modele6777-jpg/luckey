import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreSpeechVoice } from '../src/utils/speechVoice';
test('female label is not rejected as male and installed premium voices win', () => {
  assert.ok(scoreSpeechVoice({ name: 'Korean Female' }) > 0);
  assert.ok(scoreSpeechVoice({ name: 'Korean Male' }) < 0);
  assert.ok(scoreSpeechVoice({ name: 'Yuna (Premium)' }) > scoreSpeechVoice({ name: 'Yuna (Enhanced)' }));
  assert.ok(scoreSpeechVoice({ name: 'Yuna (Enhanced)' }) > scoreSpeechVoice({ name: 'Yuna' }));
});
