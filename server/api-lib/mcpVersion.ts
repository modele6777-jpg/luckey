import { readFileSync } from 'node:fs';
import path from 'node:path';

function readPackageVersion(): string {
  // The production CJS bundle has no import.meta.url. Keep the working-directory
  // fallback reachable instead of throwing before the per-file read guards.
  let candidates: URL[] = [];
  try {
    candidates = [
      new URL('../../package.json', import.meta.url),
      new URL('../../../package.json', import.meta.url),
    ];
  } catch { /* bundled CommonJS: try the working-directory package below */ }
  for (const url of candidates) {
    try {
      const pkg = JSON.parse(readFileSync(url, 'utf8')) as { version?: string };
      if (pkg.version) return pkg.version;
    } catch { /* compiled output may not sit next to package.json */ }
  }
  try {
    const pkg = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')) as { version?: string };
    if (pkg.version) return pkg.version;
  } catch { /* version stays unknown */ }
  return '0.0.0';
}

export const MCP_SERVER_VERSION = readPackageVersion();
