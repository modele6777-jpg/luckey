const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { bumpVersion } = require('./bump-version.cjs');
const { appendChangelogEntry, summarizeWorkingTreeChanges } = require('./changelog-utils.cjs');

const repoRoot = path.resolve(__dirname, '..');

if (process.env.GIT_AUTO_PUSH === '1' || process.env.GIT_PRE_COMMIT === '1') {
  process.exit(0);
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { cwd: repoRoot, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

// Check if there are any modifications in git
const status = runCapture('git status --porcelain');
if (!status) {
  process.exit(0);
}

const changedFiles = status
  .split('\n')
  .map((line) => line.slice(3).trim().replace(/\\/g, '/'))
  .filter(Boolean);

const nonVersionChanges = changedFiles.filter(
  (f) =>
    f &&
    !['package.json', 'package-lock.json', 'public/changelog.json', 'public/version.json', 'dist/changelog.json', 'dist/version.json'].includes(f)
);

if (nonVersionChanges.length === 0) {
  // Only version files changed, don't do another bump
  process.exit(0);
}

console.log('[git-pre-commit] Local changes detected. Bumping version & updating changelog...');

try {
  // Generate summaries of the modified files
  const { summary, items } = summarizeWorkingTreeChanges();
  
  // Bump the patch version in package.json and public/version.json
  const bumped = bumpVersion({ summary, items });
  
  // Append to public/changelog.json
  appendChangelogEntry({
    version: bumped.version,
    summary,
    items,
    builtAt: bumped.builtAt,
  });

  // Stage the version-related files so they are part of the current commit
  execSync('git add package.json public/version.json public/changelog.json', {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, GIT_PRE_COMMIT: '1' },
  });

  console.log(`[git-pre-commit] Success! Bumped to v${bumped.version} and updated changelog.`);
} catch (error) {
  console.error('[git-pre-commit] Error during automatic version bump:', error.message);
  // Do not block the commit on failure, let it proceed
}

process.exit(0);
