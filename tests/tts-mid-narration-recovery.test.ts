import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getResumableTTSChunkIndex, type TTSChunkProgress } from '../src/lib/ttsChunkResume.ts';

const source = readFileSync(new URL('../src/utils/tts.ts', import.meta.url), 'utf8');
const sequenceSource = source.slice(source.indexOf('export const playTTSInChunks'), source.indexOf('export const playConversation'));

test('a failed mid-narration chunk resumes at that chunk while completed chunks stay skipped', () => {
  const chunks = ['첫 번째 청크', '두 번째 청크', '세 번째 청크'];
  const progress: TTSChunkProgress = {
    fullText: '전체 낭독', chunkIndex: 1, totalChunks: 3, chunks, voice: 'Aoede', updatedAt: 10_000,
  };
  assert.equal(getResumableTTSChunkIndex(progress, { fullText: '전체 낭독', chunks, voice: 'Aoede', now: 10_001 }), 1);
  assert.equal(getResumableTTSChunkIndex(progress, { fullText: '다른 낭독', chunks, voice: 'Aoede', now: 10_001 }), 0);
  assert.equal(getResumableTTSChunkIndex(progress, { fullText: '전체 낭독', chunks, voice: 'Charon', now: 10_001 }), 0);
  assert.equal(getResumableTTSChunkIndex(progress, { fullText: '전체 낭독', chunks: [...chunks, '추가'], voice: 'Aoede', now: 10_001 }), 0);
  assert.equal(getResumableTTSChunkIndex(progress, { fullText: '전체 낭독', chunks, voice: 'Aoede', now: 10_000 + 15 * 60 * 1000 }), 0);
});

test('the sequence records the current chunk before requesting its audio and clears progress only after full completion', () => {
  assert.match(sequenceSource, /lastTTSProgress = \{\s*fullText: cleanText,\s*chunkIndex: i,[\s\S]*?\};[\s\S]*?await playTTS\(currentChunkText/);
  assert.match(sequenceSource, /if \(isLastChunk\)\s*\{\s*lastTTSProgress = null;/);
  assert.match(sequenceSource, /catch \(chunkErr\)[\s\S]*?throw chunkErr/);
  assert.match(sequenceSource, /const startChunkIndex = getResumableTTSChunkIndex\(lastTTSProgress/);
});
