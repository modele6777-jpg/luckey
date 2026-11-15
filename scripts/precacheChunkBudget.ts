import fs from 'fs';
import path from 'path';

/**
 * vite-plugin-pwa precaches every js/css/html/image matched by
 * `workbox.globPatterns`. Workbox throws (it does not warn) when one of those
 * files is larger than `maximumFileSizeToCacheInBytes`.
 */
export const WORKBOX_MAXIMUM_FILE_SIZE_TO_CACHE_IN_BYTES = 5_000_000;

/**
 * Fail the build at 70% of the Workbox cap so the next engine batch cannot
 * land on the ceiling again. 3.5 MB is still far above a single engine file.
 */
export const PRECACHE_CHUNK_BUDGET_RATIO = 0.7;
export const PRECACHE_CHUNK_BUDGET_BYTES = Math.floor(
  WORKBOX_MAXIMUM_FILE_SIZE_TO_CACHE_IN_BYTES * PRECACHE_CHUNK_BUDGET_RATIO,
);

/** Extensions matched by the Workbox glob for js, mjs, css, html, ico, png, and svg. */
export const PRECACHE_EXTENSIONS = new Set(['.js', '.mjs', '.css', '.html', '.ico', '.png', '.svg']);

/**
 * Leaf divination engines are hashed into this many chunks. The orchestrator
 * (`deterministicEngine.ts`) stays with its callers so the public sync API
 * does not change; only the engine bodies move.
 */
export const DCE_ENGINE_CHUNK_COUNT = 8;

/**
 * Rolldown splits a named group again once its module bytes pass this.
 * Sized against source bytes of the engine files, which minify poorly because
 * they are mostly Korean text.
 */
export const DCE_ENGINE_CHUNK_MAX_SOURCE_BYTES = 1_500_000;

/** One engine module past this cannot be split further and would crowd a chunk. */
export const DCE_ENGINE_FILE_SOURCE_BUDGET_BYTES = 800_000;

export interface PrecacheFileSize {
  path: string;
  size: number;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(2)} kB`;
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

/**
 * Chunk name for a divination engine module, or null when the module should
 * stay in the automatic chunk (orchestrator, non-engines, other packages).
 */
export function divinationEngineChunkName(moduleId: string): string | null {
  const normalized = moduleId.replaceAll('\\', '/');
  if (normalized.includes('/node_modules/')) return null;
  const marker = '/src/lib/divination/';
  const index = normalized.lastIndexOf(marker);
  if (index < 0) return null;
  const file = normalized.slice(index + marker.length).split('?')[0].split('#')[0];
  if (!file || file.includes('/') || !file.endsWith('Engine.ts')) return null;
  if (file === 'deterministicEngine.ts') return null;
  let hash = 0;
  for (let i = 0; i < file.length; i += 1) {
    hash = (Math.imul(hash, 33) + file.charCodeAt(i)) >>> 0;
  }
  return `dce-engine-${hash % DCE_ENGINE_CHUNK_COUNT}`;
}

export function collectPrecacheFiles(root: string): PrecacheFileSize[] {
  if (!fs.existsSync(root)) return [];
  const files: PrecacheFileSize[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!PRECACHE_EXTENSIONS.has(ext)) continue;
      files.push({
        path: path.relative(root, full).split(path.sep).join('/'),
        size: fs.statSync(full).size,
      });
    }
  };
  walk(root);
  return files;
}

export function findPrecacheBudgetViolations(files: readonly PrecacheFileSize[]): PrecacheFileSize[] {
  return files
    .filter((file) => file.size >= PRECACHE_CHUNK_BUDGET_BYTES)
    .sort((a, b) => b.size - a.size);
}

export function formatPrecacheBudgetError(files: readonly PrecacheFileSize[]): string {
  const lines = files.map((file) => (
    `  - ${file.path} is ${formatBytes(file.size)} (budget ${formatBytes(PRECACHE_CHUNK_BUDGET_BYTES)}, Workbox limit ${formatBytes(WORKBOX_MAXIMUM_FILE_SIZE_TO_CACHE_IN_BYTES)})`
  ));
  return [
    'Precache chunk budget exceeded.',
    'vite-plugin-pwa fails the production build when any precached file exceeds workbox.maximumFileSizeToCacheInBytes.',
    `These files are at or above ${formatBytes(PRECACHE_CHUNK_BUDGET_BYTES)} (${Math.round(PRECACHE_CHUNK_BUDGET_RATIO * 100)}% of the ${formatBytes(WORKBOX_MAXIMUM_FILE_SIZE_TO_CACHE_IN_BYTES)} cap):`,
    ...lines,
    'Split that module out of the shared chunk (dce-engine codeSplitting groups) instead of raising the Workbox cap.',
  ].join('\n');
}
