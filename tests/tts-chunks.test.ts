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

test('playback keeps the established chunk count (one provider request per chunk)', async () => {
  const { planTTSChunks } = await import('../src/utils/tts');
  const text = '오늘은 마음이 조금 무거운 날일 수 있어요, 그래도 괜찮아요. 천천히 숨을 고르고 지금 할 수 있는 한 가지만 생각해 봐요. 사주로 보면 올해는 변화의 기운이 강해서 서두르기보다 준비하는 게 좋아요. 이번 주에는 원하는 조건 세 가지를 적어 보세요.';
  const chunks = planTTSChunks(text);
  assert.ok(chunks.every(chunk => chunk.length <= 180));
  assert.ok(chunks.length <= 2, `too many requests: ${chunks.length}`);
  assert.equal(chunks.join('').replace(/\s/g, ''), text.replace(/\s/g, ''));
});

test('prefetch and playback plan identical chunks for any chunk-length argument', async () => {
  const { planTTSChunks } = await import('../src/utils/tts');
  const text = ('루시가 오늘의 흐름을 천천히 읽어 줄게요. ').repeat(12);
  assert.deepEqual(planTTSChunks(text, 240), planTTSChunks(text, 110));
  assert.deepEqual(planTTSChunks(text), planTTSChunks(text, 150));
});
