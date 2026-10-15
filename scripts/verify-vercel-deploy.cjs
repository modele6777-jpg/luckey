const { getDeployConfig, getExpectedVersion, sleep } = require('./deploy-config.cjs');

async function fetchDeployedVersion(productionUrl) {
  const url = `${productionUrl.replace(/\/$/, '')}/version.json?ts=${Date.now()}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  });
  if (!response.ok) {
    throw new Error(`version.json HTTP ${response.status}`);
  }
  const data = await response.json();
  return {
    version: String(data.version || '').trim(),
    builtAt: data.builtAt || null,
    summary: data.summary || null,
  };
}

function compareVersions(a, b) {
  const pa = String(a).split('.').map((n) => Number.parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

async function waitForProductionVersion(expectedVersion, options = {}) {
  const config = getDeployConfig();
  const timeoutMs = options.timeoutMs ?? config.pollTimeoutMs;
  const intervalMs = options.intervalMs ?? config.pollIntervalMs;
  const productionUrl = options.productionUrl ?? config.productionUrl;
  const startedAt = Date.now();
  let lastSeen = null;

  console.log(
    `[verify-deploy] Waiting for production v${expectedVersion} at ${productionUrl} (timeout ${Math.round(timeoutMs / 1000)}s)...`,
  );

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const deployed = await fetchDeployedVersion(productionUrl);
      lastSeen = deployed.version || 'unknown';
      if (deployed.version && compareVersions(deployed.version, expectedVersion) >= 0) {
        console.log(
          `[verify-deploy] Production is live: v${deployed.version}` +
            (deployed.builtAt ? ` (built ${deployed.builtAt})` : ''),
        );
        return { ok: true, deployed };
      }
      console.log(`[verify-deploy] Still on v${lastSeen}, expecting v${expectedVersion}...`);
    } catch (error) {
      console.warn(`[verify-deploy] Poll failed: ${error.message}`);
    }
    await sleep(intervalMs);
  }

  return {
    ok: false,
    deployed: lastSeen ? { version: lastSeen } : null,
    expectedVersion,
    productionUrl,
  };
}

async function main() {
  const expectedVersion = process.argv[2] || getExpectedVersion();
  const result = await waitForProductionVersion(expectedVersion);
  if (!result.ok) {
    const seen = result.deployed?.version || 'unknown';
    console.error(
      `[verify-deploy] Timed out: production v${seen}, expected v${expectedVersion}`,
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`[verify-deploy] ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  fetchDeployedVersion,
  waitForProductionVersion,
  compareVersions,
};