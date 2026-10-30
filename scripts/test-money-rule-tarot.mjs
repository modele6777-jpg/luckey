import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const dir = await mkdtemp(join(tmpdir(), 'luckey-money-rule-'));
try {
  await build({ stdin: { contents: "export * from './src/lib/moneyRuleTarot'; export { TAROT_DECK } from './src/data/tarotData';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'reading.mjs'), logLevel: 'silent' });
  const m = await import(pathToFileURL(join(dir, 'reading.mjs')));
  for (const card of m.TAROT_DECK) {
    for (const reversed of [false, true]) {
      for (let position = 0; position < 3; position++) {
        const text = m.moneyRuleReading({ ...card, reversed }, position);
        assert(text.includes(card.nameKo));
        assert(!text.includes('undefined'));
        assert.equal(text.includes('역방향은'), reversed);
        assert(text.length > 60);
      }
    }
  }
  const session = { version: 1, createdAt: Date.now(), question: '가치를 수입으로 연결하려면?', cards: m.TAROT_DECK.slice(0, 3).map(c => ({ ...c, reversed: false })) };
  assert(m.isMoneyRuleSession(JSON.parse(JSON.stringify(session))));
  assert(m.moneyRuleNarration(session).includes(session.question));
  const lines = m.moneyRuleSummaryLines(session);
  assert.equal(lines.length, 3);
  lines.forEach((line, index) => {
    assert(line.startsWith(`[${m.MONEY_RULE_POSITIONS[index]}]`));
    assert(line.includes(session.cards[index].nameKo));
    assert(line.endsWith('.'));
    assert(!line.includes('undefined'));
  });
  for (const bad of [null, {}, { ...session, cards: [null, null, null] }, { ...session, cards: [session.cards[0], session.cards[0], session.cards[1]] }, { ...session, cards: session.cards.map(c => ({ ...c, id: 'invalid' })) }]) assert.equal(m.isMoneyRuleSession(bad), false);
  console.log(`${m.TAROT_DECK.length} cards × two orientations × three positions, narration and restored-session validation passed.`);
} finally { await rm(dir, { recursive: true, force: true }); }
