import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getWikimediaFilePathUrl } from '../src/utils/artworkImage';

const routineSource = readFileSync(new URL('../src/components/hub/DailyCosmicRoutineCard.tsx', import.meta.url), 'utf8');
const catalogSource = readFileSync(new URL('../server/api-lib/museArtCatalog.ts', import.meta.url), 'utf8');

const thinkersBrokenThumbnail = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Thinker_Musee_Rodin.jpg/960px-The_Thinker_Musee_Rodin.jpg';

test('Wikimedia thumbnails are normalized to their original filename through Special:FilePath', () => {
  assert.equal(
    getWikimediaFilePathUrl(thinkersBrokenThumbnail),
    'https://commons.wikimedia.org/wiki/Special:FilePath/The_Thinker_Musee_Rodin.jpg?width=1600',
  );
});

test('morning routine artwork uses the Wikimedia file resolver and AI fallback URL when needed', () => {
  assert.match(routineSource, /getWikimediaFilePathUrl\(art\.entry\.imageUrl \|\| ''\)/);
  assert.match(routineSource, /src=\{routineArtImageUrl\}/);
});

test('morning routine artwork is clickable for enlargement and exposes download actions', () => {
  assert.match(routineSource, /<ImageOutputActions[\s\S]*?src=\{routineArtImageUrl\}[\s\S]*?isOpen=\{isRoutineArtImageOpen\}/);
  assert.match(routineSource, /aria-label=\{`\$\{art\.entry\.title\} 크게 보기`\}/);
  assert.match(routineSource, /onClick=\{\(\) => setIsRoutineArtImageOpen\(true\)\}/);
});

test('stalled morning routine images advance to a fallback and ultimately stop loading', () => {
  assert.match(routineSource, /window\.setTimeout\(\(\) => \{[\s\S]*?handleArtImageError\(\)/);
  assert.match(routineSource, /isAiFallback \? 20000 : 10000/);
});

test('a failed or missing original image requests an AI fallback instead of leaving a blank tile', () => {
  assert.match(routineSource, /resolveArtworkImage\([\s\S]*forcePollinations:\s*true/);
  assert.match(routineSource, /onError=\{handleArtImageError\}/);
  assert.match(routineSource, /if \(!art\.entry\.imageUrl\) void loadAiArtFallback\(\)/);
  assert.match(routineSource, /artFallbackRequestedRef/);
});

test('Rodin source uses the verified Commons file resolver and retains CC attribution metadata', () => {
  assert.match(catalogSource, /Special:FilePath\/The_Thinker_Musee_Rodin\.jpg\?width=960/);
  assert.match(catalogSource, /imageAttribution: "innoxiuss"/);
  assert.match(catalogSource, /imageLicenseName: "CC BY 2\.0"/);
});
