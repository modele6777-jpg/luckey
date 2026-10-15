const { execSync, spawnSync } = require('child_process');
const path = require('path');
const { getDeployConfig, getExpectedVersion } = require('./deploy-config.cjs');
const { waitForProductionVersion } = require('./verify-vercel-deploy.cjs');

const repoRoot = path.resolve(__dirname, '..');

function runCapture(cmd) {
  return execSync(cmd, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function getCurrentBranch() {
  return runCapture('git rev-parse --abbrev-ref HEAD');
}

async function triggerDeployHook(deployHookUrl) {
  console.log('[redeploy-vercel] Triggering Vercel deploy hook...');
  const response = await fetch(deployHookUrl, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Deploy hook HTTP ${response.status}`);
  }
  const body = await response.text();
  console.log(`[redeploy-vercel] Deploy hook accepted${body ? `: ${body.slice(0, 120)}` : ''}.`);
}

function triggerEmptyCommitPush(expectedVersion) {
  const branch = getCurrentBranch();
  const message = `chore: redeploy v${expectedVersion}`;
  console.log(`[redeploy-vercel] Creating empty commit (${message})...`);
  const commit = spawnSync('git', ['commit', '--allow-empty', '-m', message], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, GIT_AUTO_PUSH: '1' },
  });
  if (commit.status !== 0) {
    throw new Error('Empty redeploy commit failed');
  }
  console.log(`[redeploy-vercel] Pushing ${branch}...`);
  const push = spawnSync('git', ['push', 'origin', branch], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (push.status !== 0) {
    throw new Error('Redeploy push failed');
  }
}

function triggerVercelCli() {
  console.log('[redeploy-vercel] Falling back to `vercel deploy --prod`...');
  const result = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vercel', 'deploy', '--prod', '--yes'],
    { cwd: repoRoot, stdio: 'inherit' },
  );
  if (result.status !== 0) {
    throw new Error('Vercel CLI deploy failed');
  }
}

async function redeployProduction(expectedVersion = getExpectedVersion()) {
  const config = getDeployConfig();
  const errors = [];

  if (config.deployHookUrl) {
    try {
      await triggerDeployHook(config.deployHookUrl);
      return 'deploy-hook';
    } catch (error) {
      errors.push(`deploy-hook: ${error.message}`);
    }
  }

  try {
    triggerEmptyCommitPush(expectedVersion);
    return 'empty-commit';
  } catch (error) {
    errors.push(`empty-commit: ${error.message}`);
  }

  try {
    triggerVercelCli();
    return 'vercel-cli';
  } catch (error) {
    errors.push(`vercel-cli: ${error.message}`);
  }

  throw new Error(errors.join(' | '));
}

async function ensureProductionDeployed(expectedVersion = getExpectedVersion()) {
  const config = getDeployConfig();
  let first = await waitForProductionVersion(expectedVersion, {
    timeoutMs: config.pollTimeoutMs,
  });
  if (first.ok) {
    return { ok: true, strategy: 'webhook', deployed: first.deployed };
  }

  console.warn(
    `[redeploy-vercel] Production still on v${first.deployed?.version || 'unknown'} after initial wait. Starting fallback redeploy...`,
  );

  const strategy = await redeployProduction(expectedVersion);
  const second = await waitForProductionVersion(expectedVersion, {
    timeoutMs: config.redeployPollTimeoutMs,
  });
  if (!second.ok) {
    throw new Error(
      `Production deploy failed after ${strategy}. Expected v${expectedVersion}, saw v${second.deployed?.version || 'unknown'}.`,
    );
  }

  return { ok: true, strategy, deployed: second.deployed };
}

async function main() {
  const expectedVersion = process.argv[2] || getExpectedVersion();
  const result = await ensureProductionDeployed(expectedVersion);
  console.log(
    `[redeploy-vercel] Done via ${result.strategy}: production v${result.deployed.version}`,
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`[redeploy-vercel] ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  redeployProduction,
  ensureProductionDeployed,
};