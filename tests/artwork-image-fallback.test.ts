import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import {
  buildDailyArtworkFallbackUrls,
  DAILY_ART_LOCAL_FALLBACK_URL,
  getArtworkImageBadgeInfo,
} from '../src/utils/artworkImage.ts';

const artViewSource = readFileSync(new URL('../src/components/muse/ArtRecommendationView.tsx', import.meta.url), 'utf8');
const fallbackAssetPath = new URL(`../public${DAILY_ART_LOCAL_FALLBACK_URL}`, import.meta.url);

test('DailyArt fallback keeps original museum URLs first and always ends with a bundled local image', () => {
  const original = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Example.jpg/800px-Example.jpg';
  const urls = buildDailyArtworkFallbackUrls(original, 'https://museum.example/art.jpg');

  assert.equal(urls[0], original);
  assert.ok(urls.includes('https://upload.wikimedia.org/wikipedia/commons/Example.jpg'));
  assert.ok(urls.includes('https://museum.example/art.jpg'));
  assert.equal(urls.at(-1), DAILY_ART_LOCAL_FALLBACK_URL);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(existsSync(fallbackAssetPath), true);
});

test('Pollinations provider URLs are never selected as DailyArt originals, cached images, or final fallbacks', () => {
  const providerErrorUrl = 'https://image.pollinations.ai/prompt/Artwork?model=turbo';
  const urls = buildDailyArtworkFallbackUrls(providerErrorUrl, providerErrorUrl);

  assert.deepEqual(urls, [DAILY_ART_LOCAL_FALLBACK_URL]);
  assert.doesNotMatch(urls.join('\n'), /pollinations/i);
});

test('the local fallback is labeled honestly and preserves the existing title, artist, source, expand, and download UI', () => {
  const badge = getArtworkImageBadgeInfo('local_fallback', DAILY_ART_LOCAL_FALLBACK_URL);
  assert.equal(badge.isAi, false);
  assert.match(badge.label, /기본 전시 아트워크/);
  assert.match(artViewSource, /recommendation\.title/);
  assert.match(artViewSource, /recommendation\.creator/);
  assert.match(artViewSource, /artworkArticleUrl/);
  assert.match(artViewSource, /<ImageOutputActions/);
  assert.match(artViewSource, /downloadImage\(effectiveImage, artworkImageFilename\)/);
  assert.match(artViewSource, /외부 이미지 연결이 원활하지 않아 기본 전시 이미지를 표시하고 있습니다/);
});
