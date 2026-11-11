import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const artViewSource = readFileSync(new URL('../src/components/muse/ArtRecommendationView.tsx', import.meta.url), 'utf8');
const docentSource = readFileSync(new URL('../src/components/muse/MuseDocentAudio.tsx', import.meta.url), 'utf8');

test('successful and fallback DailyArt results request docent playback immediately', () => {
  assert.match(artViewSource, /setRecommendation\(enriched\);\s*requestDocentAutoPlay\(\);/);
  assert.match(artViewSource, /setRecommendation\(genericFallback\);\s*requestDocentAutoPlay\(\);/);
  assert.match(artViewSource, /const requestId = \+\+autoPlayDocentSequenceRef\.current;\s*setAutoPlayDocentRequestId\(requestId\);/);
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
