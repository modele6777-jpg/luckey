import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  buildYouTubeSearchUrl,
  resolveAppleMusicClassicalEmbedUrl,
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
