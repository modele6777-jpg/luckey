import test from 'node:test';
import assert from 'node:assert/strict';
import { splitSpeechIntoChunks } from '../src/utils/tts';
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
