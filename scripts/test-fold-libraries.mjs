import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'node_modules/.cache/fold-library-integration.test.mjs');
try {
  execFileSync(path.join(root, 'node_modules/.bin/esbuild'), [
    'tests/fold-library-integration.test.tsx', '--bundle', '--platform=node', '--format=esm', '--packages=external', '--loader:.css=empty', `--outfile=${output}`,
  ], { cwd: root, stdio: 'inherit' });
  execFileSync(process.execPath, ['--test', output], { cwd: root, stdio: 'inherit' });
} catch (error) { process.exit(error.status || 1); }
