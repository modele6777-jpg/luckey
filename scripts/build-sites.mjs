import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { build } from 'esbuild';
import { createSitesWorker } from './sites/runtime.mjs';

// Package the Vite output into a portable Worker without exposing server secrets.
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const assets = {};
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) { if (!['server', '.openai'].includes(entry.name)) collect(filename); continue; }
    if (/server\.cjs|\.map$/.test(entry.name)) continue;
    const key = '/' + path.relative('dist', filename).split(path.sep).join('/');
    const data = path.extname(filename) === '.html'
      ? Buffer.from(readFileSync(filename, 'utf8').replace('</head>', '<script type="module" src="/sites-sync-client.mjs"></script></head>'))
      : readFileSync(filename);
    assets[key] = [mime[path.extname(filename)] || 'application/octet-stream', gzipSync(data).toString('base64')];
  }
}
collect('dist');
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
writeFileSync('dist/.openai/hosting.json', readFileSync('.openai/hosting.json'));
const firebaseAuthOrigin = `https://${JSON.parse(readFileSync('firebase-applet-config.json', 'utf8')).authDomain}`;
const syncBundle = await build({ entryPoints: ['scripts/sites-sync-worker.mjs'], bundle: true, write: false, platform: 'browser', format: 'iife', globalName: 'sitesSyncApi', target: 'es2022' });
const apiBundle = await build({ entryPoints: ['server/sites-api.ts'], bundle: true, write: false, platform: 'browser', format: 'iife', globalName: 'sitesNativeApi', target: 'es2022' });
const nativeApi = apiBundle.outputFiles[0].text;
if (/\bBuffer\.|\bprocess\.env|require\(["']node:/.test(nativeApi)) throw new Error('Sites API bundle contains a Node-only runtime dependency.');
const output = `${syncBundle.outputFiles[0].text}\n${nativeApi}\nconst assets=${JSON.stringify(assets)};\nconst createSitesWorker=${createSitesWorker.toString()};\nexport default createSitesWorker({assets,firebaseAuthOrigin:${JSON.stringify(firebaseAuthOrigin)},sitesSyncApi,sitesNativeApi});`;
writeFileSync('dist/server/index.js', output);
execFileSync(process.execPath, ['--check', 'dist/server/index.js'], { stdio: 'pipe' });
console.log(`Sites Worker: ${Object.keys(assets).length} assets, ${(Buffer.byteLength(output)/1024/1024).toFixed(2)} MB`);
