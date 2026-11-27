import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const publicRoot = new URL('../public/', import.meta.url);
const guideSource = readFileSync(new URL('../src/components/guide/PageGuide.tsx', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../public/manifest.json', import.meta.url), 'utf8')) as {
  icons: Array<{ src: string; sizes: string; type: string; purpose: string }>;
};
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function publicPath(urlPath: string) {
  return fileURLToPath(new URL(urlPath.replace(/^\//, ''), publicRoot));
}

test('header guide buttons show only the book icon and retain accessible naming', () => {
  const marker = 'data-page-guide-button={guide.id}';
  const markerIndex = guideSource.indexOf(marker);
  assert.notEqual(markerIndex, -1, 'header guide button marker exists');
  const start = guideSource.lastIndexOf('<button', markerIndex);
  const end = guideSource.indexOf('</button>', markerIndex) + '</button>'.length;
  const button = guideSource.slice(start, end);

  assert.match(button, /aria-label=\{`\$\{guide\.title\} 가이드 열기`\}/);
  assert.match(button, /title="가이드"/);
  assert.match(button, /<BookOpen size=\{16\} aria-hidden="true" \/>/);
  assert.doesNotMatch(button, />\s*가이드\s*<\/button>/, 'visible guide text is removed');
});

test('main PWA, browser, and iOS icon references use the Lucky Key artwork', async () => {
  const expected = [
    { src: '/luckey-key-v4-192.png', sizes: '192x192', purpose: 'any' },
    { src: '/luckey-key-v4-512.png', sizes: '512x512', purpose: 'any' },
    { src: '/luckey-key-v4-512.png', sizes: '512x512', purpose: 'maskable' },
    { src: '/luckey-key-v4-180.png', sizes: '180x180', purpose: 'any' },
    { src: '/luckey-key-v4.svg', sizes: 'any', purpose: 'any' },
  ];
  const actual = manifest.icons
    .filter(icon => icon.src.includes('luckey-key-v4'))
    .map(({ src, sizes, purpose }) => ({ src, sizes, purpose }));
  assert.deepEqual(actual, expected);
  for (const icon of expected) assert.ok(existsSync(publicPath(icon.src)), `${icon.src} exists`);

  for (const [name, size] of [
    ['luckey-key-v4-64.png', 64],
    ['luckey-key-v4-192.png', 192],
    ['luckey-key-v4-180.png', 180],
    ['luckey-key-v4-512.png', 512],
  ] as const) {
    const metadata = await sharp(fileURLToPath(new URL(name, publicRoot))).metadata();
    assert.equal(metadata.width, size, `${name} width`);
    assert.equal(metadata.height, size, `${name} height`);
  }

  const keySvg = readFileSync(new URL('../public/luckey-key-v4.svg', import.meta.url), 'utf8');
  assert.match(keySvg, /id="keyHead"/);
  assert.match(keySvg, /id="keyTeeth"/);
  assert.match(keySvg, /4-LEAF CLOVER/);
  for (const path of [
    '/luckey-key-v4-64.png',
    '/luckey-key-v4-192.png',
    '/luckey-key-v4-512.png',
    '/luckey-key-v4.svg',
    '/luckey-key-v4-180.png',
  ]) assert.ok(html.includes(`href="${path}"`), `index.html references ${path}`);
  assert.doesNotMatch(html, /icon-clover-v3|icon-192-v3|icon-512-v3|apple-touch-icon-v3/);

  const version = JSON.parse(readFileSync(new URL('../public/version.json', import.meta.url), 'utf8')) as { version: string };
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
  const packageLock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8')) as {
    version: string;
    packages: { '': { version: string } };
  };
  assert.equal(packageJson.version, version.version);
  assert.equal(packageLock.version, version.version);
  assert.equal(packageLock.packages[''].version, version.version);
});
