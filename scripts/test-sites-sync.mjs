import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import {SitesSyncClient, startSitesSync} from '../public/sites-sync-client.mjs';
import {syncKey,mergeSyncText} from '../public/sites-sync-shared.mjs';
import {handleSitesSync} from './sites-sync-worker.mjs';
const sql = new DatabaseSync(':memory:');
sql.exec(fs.readFileSync(new URL('../drizzle/0000_sites_sync.sql',import.meta.url),'utf8'));
const DB={prepare(query){return {bind(...values){return {async all(){return {results:sql.prepare(query).all(...values)};},async first(){return sql.prepare(query).get(...values)||null;}};}};},async batch(queries){return Promise.all(queries.map(q=>q.all()));}};
class MemoryStorage {constructor(){this.values=new Map();}get length(){return this.values.size;}key(i){return [...this.values.keys()][i]??null;}getItem(k){return this.values.get(k)??null;}setItem(k,v){this.values.set(String(k),String(v));}removeItem(k){this.values.delete(k);}}
const storageFor=()=>new MemoryStorage();
function device(account='same-account',storage=storageFor()) {
 const d={account,storage,online:true,seen:[],statuses:[]};
 d.fetcher=async(url,opts={})=>{if(!d.online)throw Error('offline');const h=new Headers(opts.headers);h.set('oai-authenticated-user-id',d.account);if(opts.method==='POST')h.set('Origin','https://sync.test');return handleSitesSync(new Request('https://sync.test'+url,{...opts,headers:h}),{DB});};
 d.client=new SitesSyncClient({storage,fetcher:d.fetcher,capture:()=>new Map([...storage.values].filter(([k])=>syncKey(k))),apply:(k,v)=>{if(v===null)storage.removeItem(k);else storage.setItem(k,v);d.seen.push(k);},status:s=>d.statuses.push(s)});
 d.edit=(key,value)=>{const v=value===null?null:JSON.stringify(value);if(v===null)storage.removeItem(key);else storage.setItem(key,v);d.client.changed(key,v);};
 d.read=key=>JSON.parse(storage.getItem(key)||'null');return d;
}
async function settle(...devices){for(let i=0;i<5;i++)for(const d of devices){await d.client.poll();await d.client.flush();}}
const pc=device(),mobile=device();await settle(pc,mobile);
pc.edit('userProfile',{basic:{nickname:'PC',birthCity:'Seoul'}});await settle(pc,mobile);assert.equal(mobile.read('userProfile').basic.nickname,'PC');
mobile.edit('userProfile',{basic:{nickname:'모바일',birthCity:'Seoul'}});await settle(pc,mobile);assert.equal(pc.read('userProfile').basic.nickname,'모바일');
pc.edit('userProfile',{basic:{nickname:'PC 수정',birthCity:'Seoul'}});mobile.edit('userProfile',{basic:{nickname:'모바일',birthCity:'Busan'}});await pc.client.flush();await mobile.client.flush();await settle(pc,mobile);assert.deepEqual(pc.read('userProfile'),{basic:{nickname:'PC 수정',birthCity:'Busan'}});assert.deepEqual(pc.read('userProfile'),mobile.read('userProfile'));
pc.edit('chat_history_unified_v3',[{id:'pc-message',content:'PC',timestamp:1}]);mobile.edit('chat_history_unified_v3',[{id:'mobile-message',content:'Mobile',timestamp:2}]);await pc.client.flush();await mobile.client.flush();await settle(pc,mobile);assert.deepEqual(pc.read('chat_history_unified_v3').map(m=>m.id),['pc-message','mobile-message']);
mobile.edit('chat_history_unified_v3',[{id:'mobile-message',content:'Mobile',timestamp:2}]);await settle(pc,mobile);assert.deepEqual(pc.read('chat_history_unified_v3').map(m=>m.id),['mobile-message']);
pc.edit('luckey_user_goals_v2',[{id:'goal-1',title:'운동'}]);await settle(pc,mobile);pc.edit('luckey_user_goals_v2',[]);await settle(pc,mobile);assert.deepEqual(mobile.read('luckey_user_goals_v2'),[]);
mobile.edit('userProfile',null);await settle(pc,mobile);assert.equal(pc.read('userProfile'),null);
mobile.online=false;mobile.edit('epilogue_diary_history',[{id:'offline',text:'오프라인 메모'}]);await mobile.client.flush();assert.ok(mobile.client.pending.size);const restored=device('same-account',mobile.storage);await settle(pc,restored);assert.equal(pc.read('epilogue_diary_history')[0].text,'오프라인 메모');assert.equal(restored.client.pending.size,0);
const stranger=device('another-account');await settle(stranger);assert.equal(stranger.read('epilogue_diary_history'),null);
// An edit made while its predecessor is awaiting an acknowledgment is retained.
const original=pc.client.fetcher;let release;pc.client.fetcher=async(...args)=>{const r=await original(...args);if(args[1]?.method==='POST')await new Promise(resolve=>{release=resolve;});return r;};pc.edit('luckey_user_goals_v2',[{id:'g',title:'First'}]);const flight=pc.client.flush();for(let attempt=0;!release&&attempt<100;attempt++)await new Promise(setImmediate);assert.ok(release,"write did not reach server");pc.edit('luckey_user_goals_v2',[{id:'g',title:'Second'}]);release();await flight;pc.client.fetcher=original;await settle(pc,restored);assert.equal(restored.read('luckey_user_goals_v2')[0].title,'Second');
let r=await handleSitesSync(new Request('https://sync.test/api/sites-sync/state'),{DB});assert.equal(r.status,401);
r=await handleSitesSync(new Request('https://sync.test/api/sites-sync/state',{method:'POST',headers:{'oai-authenticated-user-id':'same-account',Origin:'https://evil.test','Content-Type':'application/json'},body:'{}'}),{DB});assert.equal(r.status,403);
r=await pc.fetcher('/api/sites-sync/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'firebase_auth_token',value:'never-upload',revision:0})});assert.equal(r.status,400);
for(const key of ['developer_bypass','prism_paired_vault_id','firebase:authUser','lucy_greeting_spoken','audio_volume'])assert.equal(syncKey(key),null);
assert.equal(syncKey('lucy_state_device_uid'),'lucy_state');
assert.deepEqual(JSON.parse(mergeSyncText('["a"]','["a","b"]','["a","c"]')),['a','c','b']);
r=await pc.fetcher('/api/sites-sync/state',{headers:{'X-Sync-Versions':encodeURIComponent(JSON.stringify([...pc.client.cloud].map(([k,v])=>[k,v.revision])))}});assert.equal((await r.json()).entries.length,0);
// Switching Sites identities cannot reuse an ETag or upload the old account's data.
pc.account='another-account';await pc.client.poll();assert.ok(pc.client.blocked);assert.equal(pc.statuses.at(-1),'account_changed');
// The app's actual HTML exposes a plain-object StorageShield facade.
class FakeEvent extends Event {constructor(type,options={}){super(type);Object.assign(this,options);}}
const native=new MemoryStorage(),facade={get length(){return native.length;},key:i=>native.key(i),getItem:k=>native.getItem(k),setItem:(k,v)=>native.setItem(k,v),removeItem:k=>native.removeItem(k)};
const w=new EventTarget();Object.assign(w,{localStorage:facade,Storage:MemoryStorage,StorageEvent:FakeEvent,CustomEvent:FakeEvent,fetch:restored.fetcher,navigator:{onLine:true},document:Object.assign(new EventTarget(),{visibilityState:'visible'}),setInterval:()=>0,setTimeout:()=>0});const browser=startSitesSync(w);for(let attempt=0;!browser.ready&&attempt<100;attempt++)await new Promise(setImmediate);assert.ok(browser.ready,"browser sync did not initialize");facade.setItem('userProfile','{"basic":{"nickname":"StorageShield"}}');await browser.flush();await restored.client.poll();assert.equal(restored.read('userProfile').basic.nickname,'StorageShield');
// Remote removals must invalidate SafeStorage's in-memory fallback too.
const {stripTypeScriptTypes}=await import('node:module');const vm=await import('node:vm');
const mirroredWindow=new EventTarget();Object.assign(mirroredWindow,{localStorage:new MemoryStorage(),sessionStorage:new MemoryStorage()});
const safeCode=stripTypeScriptTypes(fs.readFileSync(new URL('../src/utils/safeStorage.ts',import.meta.url),'utf8')).replace(/^export /gm,'');
const sandbox={window:mirroredWindow};vm.runInNewContext(safeCode+';globalThis.safe=safeLocalStorage;',sandbox);
sandbox.safe.setItem('userProfile','old cached profile');mirroredWindow.localStorage.removeItem('userProfile');
mirroredWindow.dispatchEvent(new FakeEvent('prism:sites_storage_written',{detail:{key:'userProfile',value:null,canonicalKey:'userProfile'}}));assert.equal(sandbox.safe.getItem('userProfile'),null);
console.log('Passed: PC↔mobile updates, concurrent profile edits, chat append/delete, empty lists, tombstones, offline reload, in-flight edits, account isolation, origin/auth validation, incremental polling and StorageShield integration.');
