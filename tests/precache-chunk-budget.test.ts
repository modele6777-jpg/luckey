import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  DCE_ENGINE_CHUNK_COUNT,
  DCE_ENGINE_CHUNK_MAX_SOURCE_BYTES,
  DCE_ENGINE_FILE_SOURCE_BUDGET_BYTES,
  PRECACHE_CHUNK_BUDGET_BYTES,
  collectPrecacheFiles,
  divinationEngineChunkName,
  findPrecacheBudgetViolations,
  formatPrecacheBudgetError,
} from '../scripts/precacheChunkBudget';

const ENGINE_DIR = path.resolve('src/lib/divination');

test('divination engine chunk names stay stable and leave the orchestrator in place', () => {
  assert.equal(divinationEngineChunkName('/repo/src/lib/divination/deterministicEngine.ts'), null);
  assert.equal(divinationEngineChunkName('/repo/src/lib/divination/engineCatalog.ts'), null);
  assert.equal(divinationEngineChunkName('/repo/node_modules/src/lib/divination/kabbalahEngine.ts'), null);
  const kabbalah = divinationEngineChunkName('/repo/src/lib/divination/kabbalahEngine.ts');
  assert.equal(kabbalah, divinationEngineChunkName('C:\\repo\\src\\lib\\divination\\kabbalahEngine.ts?used'));
  assert.match(kabbalah ?? '', /^dce-engine-[0-7]$/);
});

test('leaf engine source is spread across chunks under the precache budget', () => {
  const files = fs.readdirSync(ENGINE_DIR).filter((file) => file.endsWith('Engine.ts'));
  assert.ok(files.includes('deterministicEngine.ts'));
  const buckets = new Map<string, number>();
  let leafCount = 0;
  for (const file of files) {
    const size = fs.statSync(path.join(ENGINE_DIR, file)).size;
    const chunk = divinationEngineChunkName(`/src/lib/divination/${file}`);
    if (!chunk) {
      assert.equal(file, 'deterministicEngine.ts');
      continue;
    }
    leafCount += 1;
    assert.ok(
      size < DCE_ENGINE_FILE_SOURCE_BUDGET_BYTES,
      `${file} is ${size} bytes. Split that engine module before it can fill a precache chunk.`,
    );
    buckets.set(chunk, (buckets.get(chunk) ?? 0) + size);
  }
  assert.ok(leafCount > 100);
  assert.equal(buckets.size, DCE_ENGINE_CHUNK_COUNT);
  for (const [chunk, size] of buckets) {
    assert.ok(
      size < DCE_ENGINE_CHUNK_MAX_SOURCE_BYTES,
      `${chunk} source is ${size} bytes, at the ${DCE_ENGINE_CHUNK_MAX_SOURCE_BYTES} byte group cap. Add a bucket before the next engines land in this chunk.`,
    );
  }
});

test('precache scanner flags only files Workbox would precache once they reach the budget', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'precache-budget-'));
  try {
    fs.mkdirSync(path.join(root, 'assets'));
    fs.writeFileSync(path.join(root, 'assets', 'big.js'), Buffer.alloc(PRECACHE_CHUNK_BUDGET_BYTES));
    fs.writeFileSync(path.join(root, 'assets', 'ok.js'), Buffer.alloc(32));
    fs.writeFileSync(path.join(root, 'assets', 'big.js.map'), Buffer.alloc(PRECACHE_CHUNK_BUDGET_BYTES));
    fs.writeFileSync(path.join(root, 'notes.txt'), Buffer.alloc(PRECACHE_CHUNK_BUDGET_BYTES));
    const violations = findPrecacheBudgetViolations(collectPrecacheFiles(root));
    assert.deepEqual(violations.map((file) => file.path), ['assets/big.js']);
    assert.match(formatPrecacheBudgetError(violations), /assets\/big\.js/);
    assert.match(formatPrecacheBudgetError(violations), /instead of raising the Workbox cap/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
