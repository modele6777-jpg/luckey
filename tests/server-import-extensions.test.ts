import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repo = path.resolve(import.meta.dirname, '..');
const roots = ['api', 'server'];
const source = /\.(?:ts|tsx|js|mjs|cjs)$/;
const specifier = /(?:\bfrom\s*|import\s*\(\s*)['"](\.[^'"]+)['"]/g;

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

function extensionless(spec: string): boolean {
  const clean = spec.split('?')[0].split('#')[0];
  return !path.posix.basename(clean).includes('.');
}

test('api and server relative imports include a file extension', async () => {
  const files = (await Promise.all(roots.map((root) => filesUnder(path.join(repo, root))))).flat();
  const hits: string[] = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    for (const match of text.matchAll(specifier)) {
      const spec = match[1];
      if (extensionless(spec)) hits.push(`${path.relative(repo, file)} -> ${spec}`);
    }
  }
  assert.deepEqual(hits, []);
});
