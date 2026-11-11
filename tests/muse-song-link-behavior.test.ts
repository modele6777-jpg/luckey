import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  buildYouTubeSearchUrl,
  buildAppleMusicClassicalSearchUrl,
  resolveAppleMusicClassicalEmbedUrl,
  resolveAppleMusicClassicalSongUrl,
  resolveAppleMusicClassicalTrackUrl,
  resolveYouTubeVideoId,
} from '../src/components/muse/MuseSongAppleMusicPlayer';

const playerSource = readFileSync(new URL('../src/components/muse/MuseSongAppleMusicPlayer.tsx', import.meta.url), 'utf8');
const appleTabStart = playerSource.indexOf('{activeTab === "applemusic" && (');
const youtubeTabStart = playerSource.indexOf('{activeTab === "youtube" && (');
const appleTabSource = playerSource.slice(appleTabStart, youtubeTabStart);
const youtubeTabSource = playerSource.slice(youtubeTabStart);

test('Apple Music tab embeds and links only to Apple Music destinations', () => {
  assert.ok(appleTabStart >= 0 && youtubeTabStart > appleTabStart);
  assert.match(appleTabSource, /src=\{embedAppleUrl\}/);
  assert.match(appleTabSource, /href=\{openAppleUrl\}/);
  assert.doesNotMatch(appleTabSource, /openYoutubeUrl|embedYoutubeUrl|youtube-nocookie|youtube\.com/);
  assert.equal(
    resolveAppleMusicClassicalEmbedUrl('https://classical.music.apple.com/kr/album/example/123'),
    'https://embed.music.apple.com/kr/album/example/123',
  );
  assert.equal(resolveAppleMusicClassicalEmbedUrl('https://www.youtube.com/watch?v=example'), undefined);
  assert.match(playerSource, /useState<"applemusic" \| "youtube">\("applemusic"\)/);
  assert.match(playerSource, /Apple Music Classical에서 곡 검색/);
  assert.match(appleTabSource, /href=\{appleMusicSearchUrl\}/);
  assert.doesNotMatch(appleTabSource, /openYoutubeUrl|embedYoutubeUrl|youtube-nocookie|youtube\.com/);
});

test('Apple Music Classical opens only track-specific links and searches by title otherwise', () => {
  const trackUrl = 'https://classical.music.apple.com/kr/album/example/123?i=456';
  assert.equal(resolveAppleMusicClassicalTrackUrl(trackUrl), trackUrl);
  assert.equal(resolveAppleMusicClassicalSongUrl(trackUrl, 'Moonlight', 'Debussy'), trackUrl);
  assert.equal(
    resolveAppleMusicClassicalTrackUrl('https://classical.music.apple.com/kr/song/moonlight/456'),
    'https://classical.music.apple.com/kr/song/moonlight/456',
  );
  assert.equal(resolveAppleMusicClassicalTrackUrl('https://classical.music.apple.com/kr/album/example/123'), undefined);
  assert.equal(resolveAppleMusicClassicalTrackUrl('https://classical.music.apple.com/kr/search?term=Moonlight&i=456'), undefined);
  assert.equal(
    resolveAppleMusicClassicalSongUrl('https://classical.music.apple.com/kr/album/example/123', 'Moonlight', 'Debussy'),
    buildAppleMusicClassicalSearchUrl('Moonlight', 'Debussy'),
  );
  assert.equal(
    resolveAppleMusicClassicalSongUrl('https://example.com/song/456', 'Moonlight', 'Debussy'),
    buildAppleMusicClassicalSearchUrl('Moonlight', 'Debussy'),
  );
});

test('missing and unavailable YouTube videos open a search for the song instead of an iframe', () => {
  assert.equal(resolveYouTubeVideoId('Unknown Piece', 'Unknown Artist'), '');
  assert.equal(resolveYouTubeVideoId("Salut d'Amour", 'Elgar'), '');
  assert.equal(resolveYouTubeVideoId('Any Song', 'Any Artist', 'MreT_U00zI8'), '');
  assert.equal(
    buildYouTubeSearchUrl('Nocturne', 'Chopin'),
    'https://www.youtube.com/results?search_query=Chopin%20Nocturne',
  );
  assert.match(playerSource, /const embedYoutubeUrl = useMemo\([\s\S]*?resolvedYtId\s*\?/);
  assert.match(playerSource, /youtube-nocookie\.com\/embed/);
  assert.match(youtubeTabSource, /embedYoutubeUrl\s*\?/);
  assert.match(youtubeTabSource, /등록 영상이 없거나 현재 재생할 수 없습니다[\s\S]*?곡명으로 검색/);
  assert.match(youtubeTabSource, /href=\{openYoutubeUrl\}/);
});
