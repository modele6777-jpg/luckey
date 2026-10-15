const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function parseVersion(version) {
  const parts = String(version || '0.0.0')
    .replace(/^v/i, '')
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
  };
}

function bumpPatchVersion(version) {
  const { major, minor, patch } = parseVersion(version);
  return `${major}.${minor}.${patch + 1}`;
}

function bumpVersion(options = {}) {
  const pkgPath = path.join(repoRoot, 'package.json');
  const versionPath = path.join(repoRoot, 'public', 'version.json');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const previous = pkg.version || '0.0.0';
  const next = bumpPatchVersion(previous);
  const builtAt = new Date().toISOString();

  pkg.version = next;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const versionPayload = {
    version: next,
    builtAt,
  };
  if (options.summary) {
    versionPayload.summary = options.summary;
  }
  if (Array.isArray(options.items) && options.items.length > 0) {
    versionPayload.items = options.items;
  }
  fs.writeFileSync(versionPath, `${JSON.stringify(versionPayload, null, 2)}\n`);

  console.log(`[bump-version] ${previous} -> ${next}`);
  return { version: next, builtAt, summary: options.summary, items: options.items };
}

module.exports = { bumpVersion, bumpPatchVersion };

if (require.main === module) {
  bumpVersion();
}