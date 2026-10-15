const { execSync, spawnSync } = require('child_process');
const path = require('path');
const { bumpVersion } = require('./bump-version.cjs');
const {
  appendChangelogEntry,
  parseCommitSummary,
  summarizeWorkingTreeChanges,
} = require('./changelog-utils.cjs');
const { getExpectedVersion } = require('./deploy-config.cjs');
const { ensureProductionDeployed } = require('./redeploy-vercel.cjs');

const repoRoot = path.resolve(__dirname, '..');
const pushOnly = process.argv.includes('--push-only');
const messageArgIdx = process.argv.indexOf('--message');
const customMessage =
  messageArgIdx >= 0 ? process.argv[messageArgIdx + 1] : null;

function run(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: opts.silent ? 'pipe' : 'inherit',
    ...opts,
  });
}

function runCapture(cmd) {
  return execSync(cmd, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function getCurrentBranch() {
  return runCapture('git rev-parse --abbrev-ref HEAD');
}

function hasChanges() {
  const status = runCapture('git status --porcelain');
  return status.length > 0;
}

function pushBranch(branch) {
  const result = spawnSync('git', ['push', 'origin', branch], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function verifyProductionDeploy(expectedVersion) {
  const skipVerify = process.argv.includes('--skip-deploy-verify');
  if (skipVerify) {
    console.log('[git-auto-push] Skipping production deploy verification.');
    return;
  }

  console.log(`[git-auto-push] Verifying production deploy for v${expectedVersion}...`);
  try {
    const result = await ensureProductionDeployed(expectedVersion);
    console.log(
      `[git-auto-push] Production live via ${result.strategy}: v${result.deployed.version}`,
    );
  } catch (error) {
    console.error(`[git-auto-push] Production deploy verification failed: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  const branch = getCurrentBranch();

  if (pushOnly) {
    console.log(`[git-auto-push] Pushing ${branch}...`);
    pushBranch(branch);
    console.log('[git-auto-push] Push complete.');
    await verifyProductionDeploy(getExpectedVersion());
    return;
  }

  if (!hasChanges()) {
    console.log('[git-auto-push] No changes to commit.');
    return;
  }

  const { summary: changeSummary, items: changeItems } = summarizeWorkingTreeChanges(customMessage);
  const bumped = bumpVersion({ summary: changeSummary, items: changeItems });
  const nextVersion = bumped.version;
  const message = `v${nextVersion}: ${changeSummary}`;
  appendChangelogEntry({
    version: nextVersion,
    summary: parseCommitSummary(message),
    items: changeItems,
    builtAt: bumped.builtAt,
  });

  console.log('[git-auto-push] Staging changes...');
  run('git add -A');

  console.log(`[git-auto-push] Committing: ${message}`);
  const commit = spawnSync('git', ['commit', '-m', message], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, GIT_AUTO_PUSH: '1' },
  });
  if (commit.status !== 0) {
    process.exit(commit.status ?? 1);
  }

  console.log(`[git-auto-push] Pushing ${branch}...`);
  pushBranch(branch);
  console.log('[git-auto-push] Push complete. Waiting for Vercel production...');
  await verifyProductionDeploy(nextVersion);
  console.log('[git-auto-push] Done.');
}

main().catch((error) => {
  console.error(`[git-auto-push] ${error.message}`);
  process.exit(1);
});