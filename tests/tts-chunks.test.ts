import test from 'node:test';
import assert from 'node:assert/strict';
import { splitSpeechIntoChunks, getTTSCacheKey } from '../src/utils/tts';
test('a long report without punctuation or spaces fits the speech request limit without loss', () => {
  const text = '가'.repeat(5001);
  const chunks = splitSpeechIntoChunks(text, 240);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every(chunk => chunk.length > 0 && chunk.length <= 240));
  assert.equal(chunks.join('').replace(/[.,!?\s]/g, ''), text);
});
test('long ordinary paragraphs retain their words across bounded chunks', () => {
  const text = ('오늘 하루를 편안하게 돌아보고 내일을 준비해 보세요. ').repeat(100);
  const chunks = splitSpeechIntoChunks(text, 240);
  assert.ok(chunks.every(chunk => chunk.length <= 240));
  assert.equal(chunks.join(' ').replace(/\s/g, ''), text.replace(/\s/g, ''));
});


test('the same chat text uses separate cached audio for user and Lucy voices', () => {
  const text = '반가워요. 오늘도 함께해요.';
  assert.notEqual(getTTSCacheKey(text, 'Charon'), getTTSCacheKey(text, 'Aoede'));
  assert.equal(getTTSCacheKey(text, 'Kore'), getTTSCacheKey(text, 'Aoede'));
});
