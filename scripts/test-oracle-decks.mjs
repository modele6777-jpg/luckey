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
  for (const [mode, count] of Object.entries({ healing: 78, miracle: 78, growth: 78, money: 78 })) {
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
  for (const mode of ['healing', 'miracle', 'growth', 'money']) {
    const cards = m.ORACLE_DECKS[mode].cards;
    for (const [type, count] of Object.entries({ major: 22, wands: 14, cups: 14, swords: 14, pentacles: 14 })) assert.equal(cards.filter(c => c.type === type).length, count, `${mode} ${type}`);
  }
  const dodal = m.ORACLE_DECKS.growth.cards;
  assert.match(dodal.find(c => c.id === 'major_11').historicalTitle, /M08/);
  assert.match(dodal.find(c => c.id === 'major_8').historicalTitle, /M11/);
  const vieville = m.ORACLE_DECKS.miracle.cards;
  for (const [id, label] of [['major_11', '07_La_Justice'], ['major_7', '08_Le_Chariot'], ['major_8', '09_La_Force'], ['major_9', '11_L_Ermite']]) assert(vieville.find(c => c.id === id).historicalTitle.includes(label));
  const oldWirth = m.LEGACY_ORACLE_DECKS.miracle.cards;
  assert.equal(oldWirth.length, 22);
  assert.equal(m.getOracleReadingDeck('miracle', oldWirth).cards.length, 22);
  assert(m.oracleDeckPrompt('miracle', oldWirth).includes('비르트'));
  assert.equal(m.LEGACY_ORACLE_DECKS.money.cards.length, 21);
  assert(m.isMoneyRuleSession({ version: 1, createdAt: Date.now(), question: '이전', cards: m.LEGACY_ORACLE_DECKS.money.cards.slice(0,3).map(c => ({ ...c, reversed: false })) }));
  for (const record of provenance.filter(r => r.mode === 'money_grimaud')) {
    assert.equal(record.printedNumber, Number(record.id.split('_')[1]));
    assert(![71, 72].includes(record.sourceScan), 'plain backs must never enter the reading deck');
  }
  for (const [number, scan] of [[49, 49], [61, 73], [63, 75], [67, 79], [68, 80], [78, 70]]) assert.equal(provenance.find(r => r.mode === 'money_grimaud' && r.id === `etteilla_${number}`).sourceScan, scan);
  const session = { version: 1, createdAt: Date.now(), question: '풍요를 위한 습관', cards: m.ORACLE_DECKS.money.cards.slice(0,3).map(c => ({ ...c, reversed: false })) };
  assert(m.isMoneyRuleSession(JSON.parse(JSON.stringify(session))));
  for (const card of m.ORACLE_DECKS.money.cards) for (const reversed of [false,true]) {
    const text = m.moneyRuleReading({ ...card, reversed }, 0); assert(!text.includes('undefined')); assert(text.includes(card.readingHint));
  }
  assert(m.oracleDeckPrompt('miracle', [m.TAROT_DECK[0]]).includes('기존 웨이트'));
  assert.equal(m.getTarotCardImageUrl(m.TAROT_DECK[0]), '/oracle-decks/healing/major_0.webp', 'standard Tarot uses its configured default local artwork');
  console.log('Four complete 78-card decks: all images, licenses, suit counts, numbering, legacy restore and Money Rule readings passed.');
} finally { await rm(dir, { recursive: true, force: true }); }
