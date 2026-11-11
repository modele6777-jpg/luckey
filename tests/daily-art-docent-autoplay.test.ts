import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const artViewSource = readFileSync(new URL('../src/components/muse/ArtRecommendationView.tsx', import.meta.url), 'utf8');
const docentSource = readFileSync(new URL('../src/components/muse/MuseDocentAudio.tsx', import.meta.url), 'utf8');

test('successful and fallback DailyArt results request docent playback immediately', () => {
  assert.match(artViewSource, /setRecommendation\(enriched\);\s*requestDocentAutoPlayFor\(enriched\);/);
  assert.match(artViewSource, /setRecommendation\(genericFallback\);\s*requestDocentAutoPlayFor\(genericFallback\);/);
  assert.match(artViewSource, /const requestId = \+\+autoPlayDocentSequenceRef\.current;\s*setAutoPlayDocentRequestId\(requestId\);/);
});

test('cached and cloud-restored DailyArt results also request docent playback once per artwork', () => {
  assert.match(artViewSource, /setRecommendation\(cachedRec\);\s*requestDocentAutoPlayFor\(cachedRec\);/);
  assert.match(artViewSource, /setRecommendation\(rec\);\s*requestDocentAutoPlayFor\(rec\);/);
  assert.match(artViewSource, /autoPlayedDocentFingerprintRef\.current === fingerprint/);
});

test('a stalled DailyArt browser image cycles to the next candidate and ends after the final candidate', () => {
  assert.match(artViewSource, /loadedImageUrl === effectiveImage/);
  assert.match(artViewSource, /fallbackUrls\.length[\s\S]*?setImageLoadError\(true\)/);
  assert.match(artViewSource, /\}, 10000\)/);
});

test('the DailyArt auto-play request reaches the docent and starts only once per request', () => {
  assert.match(
    artViewSource,
    /<MuseDocentAudio\s+autoPlayRequestId=\{autoPlayDocentRequestId\}\s+onAutoPlayConsumed=\{consumeDocentAutoPlay\}/,
  );
  assert.match(
    docentSource,
    /if \(autoPlayRequestId === null \|\| autoPlayRequestedRef\.current === autoPlayRequestId\) return;\s*autoPlayRequestedRef\.current = autoPlayRequestId;\s*void startGuide\(true\);\s*onAutoPlayConsumed\?\.\(autoPlayRequestId\);/,
  );
});
