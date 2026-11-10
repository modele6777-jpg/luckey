import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repo = path.resolve(import.meta.dirname, '..');
const roots = ['api', 'server', 'src'];
const source = /\.(?:ts|tsx|js|mjs|cjs)$/;
const literalKey = /AIza[0-9A-Za-z_-]{10,}|AQ\.Ab8RN6Ktg9/;

async function filesUnder(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'coverage') return [];
    if (entry.isDirectory()) return filesUnder(full);
    return source.test(entry.name) ? [full] : [];
  }));
  return nested.flat();
}

test('api, server, and client source do not embed a literal API key', async () => {
  const files = (await Promise.all(roots.map((root) => filesUnder(path.join(repo, root))))).flat();
  const hits: string[] = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    if (literalKey.test(text)) hits.push(path.relative(repo, file));
  }
  assert.deepEqual(hits, []);
});
