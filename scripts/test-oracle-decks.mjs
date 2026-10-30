import { build } from 'esbuild';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const dir = await mkdtemp(join(tmpdir(), 'luckey-oracle-decks-'));
try {
  await build({ stdin: { contents: "export * from './src/data/oracleDecks';export * from './src/lib/moneyRuleTarot';export { getTarotCardImageUrl, TAROT_DECK } from './src/data/tarotData';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'decks.mjs'), logLevel: 'silent' });
  const m = await import(pathToFileURL(join(dir, 'decks.mjs')));
  const provenance = JSON.parse(await readFile('src/data/oracleDeckAssets.json', 'utf8'));
  const urls = new Set();
  for (const [mode, count] of Object.entries({ healing: 78, miracle: 22, growth: 22, money: 21 })) {
    const deck = m.ORACLE_DECKS[mode];
    assert.equal(deck.cards.length, count);
    assert.equal(new Set(deck.cards.map(c => c.id)).size, count);
    for (const card of deck.cards) {
      const url = m.getTarotCardImageUrl(card);
      assert.equal(url, card.imageUrl);
      assert(!urls.has(url), 'modes must have distinct front artwork'); urls.add(url);
      assert.equal(m.getTarotCardImageUrl(JSON.parse(JSON.stringify(card))), url);
      const record = provenance.find(p => p.imageUrl === url);
      assert(record && /public domain/i.test(record.license));
      assert(record.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:'));
      const metadata = await sharp('public' + url).metadata();
      assert.equal(metadata.format, 'webp'); assert(metadata.height > metadata.width);
      assert(!/upside down/.test(record.title));
    }
  }
  for (const mode of ['growth', 'miracle']) {
    const cards = m.ORACLE_DECKS[mode].cards;
    assert.match(cards.find(c => c.id === 'major_11').historicalTitle, /(?:M08|08 La Justice)/);
    assert.match(cards.find(c => c.id === 'major_8').historicalTitle, /(?:M11|11 La Force)/);
  }
  const session = { version: 1, createdAt: Date.now(), question: '풍요를 위한 습관', cards: m.ORACLE_DECKS.money.cards.slice(0,3).map(c => ({ ...c, reversed: false })) };
  assert(m.isMoneyRuleSession(JSON.parse(JSON.stringify(session))));
  for (const card of m.ORACLE_DECKS.money.cards) for (const reversed of [false,true]) {
    const text = m.moneyRuleReading({ ...card, reversed }, 0); assert(!text.includes('undefined')); assert(text.includes(card.readingHint));
  }
  assert(m.oracleDeckPrompt('miracle', [m.TAROT_DECK[0]]).includes('라이더'));
  assert(!m.getTarotCardImageUrl(m.TAROT_DECK[0]).includes('/oracle-decks/'), 'ordinary/legacy tarot unchanged');
  console.log('143 historical fronts, license records, dimensions, mapping, restore and Money Rule readings passed.');
} finally { await rm(dir, { recursive: true, force: true }); }
