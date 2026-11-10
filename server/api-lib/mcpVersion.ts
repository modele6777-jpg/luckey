import { readFileSync } from 'node:fs';
import path from 'node:path';

function readPackageVersion(): string {
  const candidates = [
    new URL('../../package.json', import.meta.url),
    new URL('../../../package.json', import.meta.url),
  ];
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
