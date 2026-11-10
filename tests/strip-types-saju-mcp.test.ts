import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { promisify } from 'node:util';
import ts from 'typescript';

const execFileAsync = promisify(execFile);
const repo = path.resolve(import.meta.dirname, '..');
const roots = [
  'server/api-lib/sajuChartRoute.ts',
  'server/api-lib/mcpHandler.ts',
  'server/api-lib/dailyTarotRoute.ts',
  'api/index.ts',
];

function resolveSpec(from: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null;
  const base = path.resolve(path.dirname(from), spec);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.mjs`, path.join(base, 'index.ts')];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function runtimeSpecs(text: string): string[] {
  const specs: string[] = [];
  const fromPattern = /(?:^|\n)\s*(import|export)\s+(type\s+)?([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
  for (const match of text.matchAll(fromPattern)) {
    if (match[2]) continue;
    const clause = match[3] || '';
    if (match[1] === 'import' && /^\s*\{[^}]*\}\s*$/.test(clause)) {
      const inner = clause.slice(clause.indexOf('{') + 1, clause.lastIndexOf('}'));
      const parts = inner.split(',').map((part) => part.trim()).filter(Boolean);
      if (parts.length && parts.every((part) => part.startsWith('type '))) continue;
    }
    specs.push(match[4]);
  }
  for (const match of text.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) specs.push(match[1]);
  return specs;
}

function runtimeGraph(): string[] {
  const seen = new Set<string>();
  const queue = roots.map((file) => path.join(repo, file));
  while (queue.length) {
    const file = queue.pop();
    if (!file || seen.has(file) || !file.endsWith('.ts')) continue;
    seen.add(file);
    const text = readFileSync(file, 'utf8');
    for (const spec of runtimeSpecs(text)) {
      const resolved = resolveSpec(file, spec);
      if (resolved?.endsWith('.ts')) queue.push(resolved);
    }
  }
  return [...seen];
}

test('saju and MCP source is erasable TypeScript', () => {
  const files = runtimeGraph();
  assert.ok(files.some((file) => file.endsWith('sajuInput.ts')));
  assert.ok(files.some((file) => file.endsWith('readingApiClient.ts')));
  const options: ts.CompilerOptions = {
    noEmit: true,
    erasableSyntaxOnly: true,
    noResolve: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    strict: false,
  };
  const program = ts.createProgram(files, options);
  const blocked = ts.getPreEmitDiagnostics(program).filter((diagnostic) => diagnostic.code === 1294);
  assert.deepEqual(blocked.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')), []);
});

test('Node type stripping serves saju and MCP', async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    '--experimental-strip-types',
    '--no-experimental-transform-types',
    path.join(repo, 'tests/strip-types-saju-mcp.mjs'),
  ], { cwd: repo, timeout: 20000 });
  assert.match(stdout, /strip-types saju and MCP ok/);
});
