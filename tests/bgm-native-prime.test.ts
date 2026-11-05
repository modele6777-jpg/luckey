import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primeNativeBgmPlayback } from '../src/lib/proceduralBgmMedia';

test('native BGM priming requires an explicit play gesture and never replaces loaded music', () => {
  let plays = 0;
  const audio = { src: '', getAttribute: () => audio.src, play: async () => { plays++; } };
  primeNativeBgmPlayback(audio as unknown as HTMLAudioElement, false);
  assert.equal(plays, 0); assert.equal(audio.src, '');
  primeNativeBgmPlayback(audio as unknown as HTMLAudioElement, true);
  assert.equal(plays, 1); assert.ok(audio.src.startsWith('blob:'));
  const primed = audio.src;
  primeNativeBgmPlayback(audio as unknown as HTMLAudioElement, true);
  assert.equal(plays, 1); assert.equal(audio.src, primed);
  audio.src = '/music.mp3';
  primeNativeBgmPlayback(audio as unknown as HTMLAudioElement, true);
  assert.equal(plays, 1); assert.equal(audio.src, '/music.mp3');
});
