import {applyConfiguredProfileImport} from './sites-profile-import.mjs';
import {syncKey} from '../public/sites-sync-shared.mjs';
const syncJson = (value, status = 200, headers = {}) => Response.json(value, {status, headers: {'Cache-Control':'private, no-store', ...headers}});
export async function handleSitesSync(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/sites-sync/state') return null;
  const account = request.headers.get('oai-authenticated-user-id');
  if (!account) return syncJson({error:'ChatGPT 로그인이 필요합니다.'}, 401);
  if (!env.DB) return syncJson({error:'동기화 저장소를 준비 중입니다.'}, 503);
  if (request.method === 'GET') {
    await applyConfiguredProfileImport(account, env);
    const metadata = await env.DB.prepare('SELECT storage_key, revision FROM sites_sync_entries WHERE owner_id = ? ORDER BY storage_key').bind(account).all();
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify({account,entries:metadata.results})));
    const etag = '"' + [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2,'0')).join('') + '"';
    if (request.headers.get('If-None-Match') === etag) return new Response(null, {status:304, headers:{ETag:etag,'Cache-Control':'private, no-store'}});
    let known = new Map();
    try {const header=request.headers.get('X-Sync-Versions') || '';if(header.length<32000)known=new Map(JSON.parse(decodeURIComponent(header || '%5B%5D')));}catch{}
    const changedKeys=metadata.results.filter(row=>known.get(row.storage_key)!==row.revision).map(row=>row.storage_key);
    const queries=[];
    for(let i=0;i<changedKeys.length;i+=80){const keys=changedKeys.slice(i,i+80);queries.push(env.DB.prepare('SELECT storage_key AS key, value, revision FROM sites_sync_entries WHERE owner_id = ? AND storage_key IN ('+keys.map(()=>'?').join(',')+') ORDER BY storage_key').bind(account,...keys));}
    const rows={results:queries.length?(await env.DB.batch(queries)).flatMap(result=>result.results):[]};
    // Metadata and data are separate reads. Omit the ETag if a concurrent write
    // changed their revisions, so the next read cannot skip that write.
    const expected=new Map(metadata.results.map(r=>[r.storage_key,r.revision]));
    const consistent=rows.results.length===changedKeys.length&&rows.results.every(r=>expected.get(r.key)===r.revision);
    return syncJson({account, entries:rows.results}, 200, consistent ? {ETag:etag} : {});
  }
  if (request.method !== 'POST') return syncJson({error:'Method not allowed'}, 405, {Allow:'GET, POST'});
  if (request.headers.get('Origin') !== url.origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') return syncJson({error:'잘못된 요청 출처입니다.'}, 403);
  if (!request.headers.get('Content-Type')?.includes('application/json')) return syncJson({error:'JSON required'}, 415);
  let input;
  try {
    const reader = request.body.getReader(); let size = 0; const chunks = [];
    for (;;) {const {done,value} = await reader.read(); if (done) break; size += value.length; if (size > 2 * 1024 * 1024) {await reader.cancel();return syncJson({error:'데이터가 너무 큽니다.'},413);} chunks.push(value);}
    const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.length;}
    input = JSON.parse(new TextDecoder().decode(bytes));
  } catch {return syncJson({error:'잘못된 동기화 요청입니다.'},400);}
  const {key,value,revision} = input || {};
  if (typeof value === 'string' && new TextEncoder().encode(value).length > 1500000) return syncJson({error:'개별 저장 항목이 너무 큽니다.'},413);
  if (!key || syncKey(key) !== key || !(value === null || typeof value === 'string') || !Number.isSafeInteger(revision) || revision < 0) return syncJson({error:'잘못된 동기화 데이터입니다.'},400);
  const changed = revision === 0
    ? await env.DB.prepare('INSERT INTO sites_sync_entries (owner_id, storage_key, value, revision) VALUES (?, ?, ?, 1) ON CONFLICT (owner_id, storage_key) DO NOTHING RETURNING storage_key AS key, value, revision').bind(account,key,value).first()
    : await env.DB.prepare('UPDATE sites_sync_entries SET value = ?, revision = revision + 1 WHERE owner_id = ? AND storage_key = ? AND revision = ? RETURNING storage_key AS key, value, revision').bind(value,account,key,revision).first();
  if (changed) return syncJson({entry:changed});
  const current = await env.DB.prepare('SELECT storage_key AS key, value, revision FROM sites_sync_entries WHERE owner_id = ? AND storage_key = ?').bind(account,key).first();
  return syncJson({entry:current || {key,value:null,revision:0}},409);
}
