import assert from 'node:assert/strict';
import { test } from 'node:test';
import { withTimeout } from '../src/lib/asyncTimeout.ts';
import { buildYouTubeSearchUrl, resolveYouTubeVideoId } from '../src/components/muse/MuseSongAppleMusicPlayer.tsx';

test('withTimeout returns work that settles before the deadline', async () => {
  const result = await withTimeout(Promise.resolve('ready'), 50, 'timed out');
  assert.equal(result, 'ready');
});

test('withTimeout rejects work that never settles', async () => {
  const stalled = new Promise<string>(() => {});
  await assert.rejects(
    withTimeout(stalled, 5, 'Daily ART request timed out'),
    /Daily ART request timed out/,
  );
});

test('YouTube fallback opens search results for the curated song and artist', () => {
  const url = new URL(buildYouTubeSearchUrl('Salut d’Amour', 'Edward Elgar'));
  assert.equal(url.hostname, 'www.youtube.com');
  assert.equal(url.pathname, '/results');
  assert.match(url.searchParams.get('search_query') || '', /Salut/);
  assert.match(url.searchParams.get('search_query') || '', /Edward Elgar/);
});

test('known unavailable YouTube video IDs fall back to song search rather than a broken embed', () => {
  assert.equal(resolveYouTubeVideoId("Salut d'Amour", 'Edward Elgar', 'MreT_U00zI8'), '');
  assert.equal(resolveYouTubeVideoId("Salut d'Amour", 'Edward Elgar'), '');
});

test('Apple Music tab has no YouTube link or switch action', async () => {
  const fs = await import('node:fs');
  const source = fs.readFileSync(new URL('../src/components/muse/MuseSongAppleMusicPlayer.tsx', import.meta.url), 'utf8');
  const appleTab = source.split('{activeTab === "applemusic" && (')[1]?.split('{activeTab === "youtube" && (')[0] || '';
  assert.doesNotMatch(appleTab, /href=\{openYoutubeUrl\}|setActiveTab\("youtube"\)/i);
});
