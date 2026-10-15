const { execSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

try {
  execSync('git rev-parse --is-inside-work-tree', {
    cwd: repoRoot,
    stdio: 'pipe',
  });
} catch {
  console.warn('[setup-git-hooks] Not a git repository. Skipping hook setup.');
  process.exit(0);
}

execSync('git config core.hooksPath .githooks', {
  cwd: repoRoot,
  stdio: 'inherit',
});

console.log('[setup-git-hooks] core.hooksPath set to .githooks');