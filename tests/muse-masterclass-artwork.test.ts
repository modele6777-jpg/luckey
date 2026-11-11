import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/components/muse/MuseSynergySection.tsx', import.meta.url), 'utf8');

test('selected masterpiece thumbnail uses a stable Wikimedia URL and requests one automatic AI fallback on failure', () => {
  assert.match(source, /getWikimediaFilePathUrl\(targetArtworkImg\)/);
  assert.match(source, /resolveArtworkImage\([\s\S]*forcePollinations:\s*true/);
  assert.match(source, /onError=\{handleSelectedArtworkThumbnailError\}/);
  assert.match(source, /requestAutomaticArtworkFallback\(\)/);
  assert.match(source, /automaticArtworkFallbackRequestedRef/);
});

test('selected masterpiece thumbnail opens a full-size viewer and supports download', () => {
  assert.match(source, /setIsSelectedArtworkImageOpen\(true\)/);
  assert.match(source, /modalOnly/);
  assert.match(source, /downloadImage\(selectedArtworkPreviewUrl, selectedArtworkFilename\)/);
  assert.match(source, /aria-label=\{`\$\{selectedArtwork\.piece\} 크게 보기`\}/);
});

test('broken 639Hz oscillator and labels are removed without removing the AI docent voice', () => {
  assert.doesNotMatch(source, /639Hz|toggle639Hz|AudioContext|OscillatorNode/);
  assert.match(source, /handleSpeakMasterpiece/);
  assert.match(source, /playTTS\(text, 'Kore'/);
  assert.match(source, /거장 조언 음성 낭독/);
});
