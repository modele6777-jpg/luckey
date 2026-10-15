const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const localConfigPath = path.join(repoRoot, 'scripts', 'deploy.local.json');

const DEFAULTS = {
  productionUrl: 'https://prism-universe.vercel.app',
  pollIntervalMs: 15_000,
  pollTimeoutMs: 4 * 60_000,
  redeployPollTimeoutMs: 6 * 60_000,
};

function readLocalConfig() {
  try {
    if (!fs.existsSync(localConfigPath)) return {};
    return JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
  } catch {
    return {};
  }
}

function getDeployConfig() {
  const local = readLocalConfig();
  return {
    productionUrl: process.env.PRISM_PRODUCTION_URL || local.productionUrl || DEFAULTS.productionUrl,
    deployHookUrl: process.env.VERCEL_DEPLOY_HOOK_URL || local.deployHookUrl || null,
    pollIntervalMs: Number(process.env.PRISM_DEPLOY_POLL_MS) || DEFAULTS.pollIntervalMs,
    pollTimeoutMs: Number(process.env.PRISM_DEPLOY_TIMEOUT_MS) || DEFAULTS.pollTimeoutMs,
    redeployPollTimeoutMs:
      Number(process.env.PRISM_REDEPLOY_TIMEOUT_MS) || DEFAULTS.redeployPollTimeoutMs,
  };
}

function getExpectedVersion() {
  const pkgPath = path.join(repoRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return String(pkg.version || '').trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  getDeployConfig,
  getExpectedVersion,
  sleep,
  localConfigPath,
};