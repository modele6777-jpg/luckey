import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

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
const runtime = `
export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  const synced = await handleSitesSync(request, env);
  if (synced) return synced;
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
   if (!env.LUCKEY_API_ORIGIN) return Response.json({error:'AI 서버 연결이 아직 설정되지 않았습니다.'}, {status:503});
   const upstream = new URL(env.LUCKEY_API_ORIGIN);
   if (upstream.protocol !== 'https:' || upstream.origin === url.origin) return Response.json({error:'서버 주소 설정을 확인해주세요.'},{status:503});
   upstream.pathname = url.pathname; upstream.search = url.search;
   const headers = new Headers(request.headers);
   for (const name of ['host','cookie','oai-sites-authorization','cf-access-jwt-assertion']) headers.delete(name);
   return fetch(upstream, {method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual'});
  }
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  let key = url.pathname;
  if (/^\\/(chat|lucy)(\\/|$)/.test(key)) key='/chat.html';
  else if (/^\\/handbook(\\/|$)/.test(key)) key='/handbook.html';
  else if (!assets[key] && !key.split('/').pop().includes('.')) key='/index.html';
  const asset=assets[key];
  if (!asset) return new Response('Not found',{status:404});
  const bytes=Uint8Array.from(atob(asset[1]),c=>c.charCodeAt(0));
  return new Response(request.method==='HEAD'?null:new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')), {headers:{'Content-Type':asset[0],'Cache-Control':key.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache','X-Content-Type-Options':'nosniff'}});
 }
};
`;
const shared = readFileSync('public/sites-sync-shared.mjs', 'utf8').replace(/^export /gm, '');
const syncWorker = readFileSync('scripts/sites-sync-worker.mjs', 'utf8').replace(/^import .*;\r?\n/m, '').replace(/^export /gm, '');
const output = `${shared}\n${syncWorker}\nconst assets=${JSON.stringify(assets)};\n${runtime}`;
writeFileSync('dist/server/index.js', output);
console.log(`Sites Worker: ${Object.keys(assets).length} assets, ${(Buffer.byteLength(output)/1024/1024).toFixed(2)} MB`);
