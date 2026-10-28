import {syncKey, mergeSyncText, PROFILE_SYNC_KEYS} from './sites-sync-shared.mjs';
const META = '__sites_sync_outbox_v1';
const volatile = new Set(['clientUpdatedAt','updatedAt','lastAppSyncAt','sourceApp']);
function content(value) {
  if (value === null) return null;
  try {return JSON.stringify(JSON.parse(value), (key, val) => volatile.has(key) ? undefined : val);}
  catch {return value;}
}
export class SitesSyncClient {
  constructor({storage, fetcher, capture, apply, status = () => {}}) {
    Object.assign(this, {storage, fetcher, capture, apply, status});
    this.cloud = new Map(); this.pending = new Map(); this.observed = new Map();
    this.ready = false; this.busy = false; this.etag = ''; this.account = '';
    try {const saved = JSON.parse(storage.getItem(META) || '{}'); this.account = saved.account || ''; for (const [key, value] of saved.pending || []) if (syncKey(key) === key) this.pending.set(key, value);} catch {}
  }
  persist() {
    try {this.storage.setItem(META, JSON.stringify({account:this.account,pending:[...this.pending]}));}
    catch {this.status('storage_full');}
  }
  async request(options = {}) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try {return await this.fetcher('/api/sites-sync/state', {...options,credentials:'same-origin',cache:'no-store',signal:controller.signal});}
    finally {clearTimeout(timer);}
  }
  queue(key, value) {
    const current = this.pending.get(key);
    if (current) {current.value = value;delete current.rejected;}
    else {const base = this.cloud.get(key) || {value:null,revision:0};this.pending.set(key,{base:base.value,revision:base.revision,value});}
    this.persist();
  }
  changed(rawKey, value) {
    const key = syncKey(rawKey); if (!key || !this.ready) return;
    const previous = this.observed.get(key) ?? this.cloud.get(key)?.value ?? null;
    this.observed.set(key,value);
    if (content(previous) !== content(value)) this.queue(key,value);
  }
  accept(entry) {
    const known = this.cloud.get(entry.key);
    if (known && known.revision >= entry.revision) return;
    const pending = this.pending.get(entry.key);
    this.cloud.set(entry.key,entry);
    const value = pending ? mergeSyncText(pending.base,pending.value,entry.value) : entry.value;
    if (pending) {pending.base = entry.value; pending.revision = entry.revision; pending.value = value; if (value === entry.value) this.pending.delete(entry.key);}
    this.observed.set(entry.key,value); this.apply(entry.key,value);
  }
  async poll() {
    if (this.reading || this.blocked) return false; this.reading = true;
    try {
      const headers={};
      const versions=encodeURIComponent(JSON.stringify([...this.cloud].map(([key,entry])=>[key,entry.revision])));
      if(versions.length<16000)headers['X-Sync-Versions']=versions;
      if(this.etag)headers['If-None-Match']=this.etag;
      const response = await this.request({headers});
      if (response.status === 304) return true;
      if (!response.ok) {this.status(response.status === 401 ? 'sign_in_required' : 'offline');return false;}
      const data = await response.json();
      if (!data.account || !Array.isArray(data.entries)) throw new Error('Invalid sync response');
      if (this.account && this.account !== data.account) {this.blocked = true;this.status('account_changed');return false;}
      const initial = !this.ready; const local = initial ? this.capture() : null;
      this.account = data.account;
      // Initial remote state wins scalar conflicts; local-only records and
      // independently added history entries are retained and uploaded.
      for (const entry of data.entries) if (syncKey(entry.key) === entry.key) {
        if (initial && !this.pending.has(entry.key) && local.has(entry.key) && entry.value !== null) {
          const merged = mergeSyncText(null,entry.value,local.get(entry.key));
          if (merged !== entry.value) this.pending.set(entry.key,{base:entry.value,revision:entry.revision,value:merged});
        }
        this.accept(entry);
      }
      if (initial) {
        for (const [key,value] of local) if (!this.cloud.has(key) && !this.pending.has(key)) this.queue(key,value);
        for (const [key,pending] of this.pending) {this.observed.set(key,pending.value);this.apply(key,pending.value);}
        this.ready = true;
      }
      this.etag = response.headers.get('ETag') || ''; this.persist(); this.status(this.pending.size ? 'syncing' : 'connected');return true;
    } catch {this.status('offline');return false;}
    finally {this.reading = false;}
  }
  async flush({keepalive = false} = {}) {
    if (!this.ready || this.busy || this.blocked) return; this.busy = true;
    try {
      // Bound work per cycle so another device's writes are regularly received.
      for (const [key,pending] of [...this.pending].filter(([,pending])=>!pending.rejected).slice(0,20)) {
        const sent = {...pending};
        const body = JSON.stringify({key,value:sent.value,revision:sent.revision});
        // Browsers cap unload keepalive payloads. Large records stay in the
        // durable outbox and resume on the next connection/open.
        if (keepalive && new TextEncoder().encode(body).length > 60000) continue;
        const response = await this.request({method:'POST',headers:{'Content-Type':'application/json'},body,...(keepalive ? {keepalive:true} : {})});
        if (response.status !== 409 && !response.ok) {this.status(response.status === 413 ? 'record_too_large' : 'offline');if(response.status===413){pending.rejected=true;this.persist();continue;}break;}
        const {entry} = await response.json();
        if (!entry || entry.key !== key) throw new Error('Invalid sync acknowledgment');
        if (response.status === 409) {this.accept(entry);continue;}
        this.cloud.set(key,entry);
        // Changes typed while this request was in flight must not be discarded.
        const latest = this.pending.get(key);
        if (latest && latest.value === sent.value) this.pending.delete(key);
        else if (latest) {latest.base = entry.value;latest.revision = entry.revision;}
        this.persist();
      }
      if (!this.pending.size) this.status('connected');
    } catch {this.status('offline');}
    finally {this.busy = false;}
  }
}

export function startSitesSync(win) {
  // A same-origin embedded channel shares the parent storage and coordinator.
  if (win.top && win.top !== win) return;
  if (win.__sitesSyncStarted) return; win.__sitesSyncStarted = true;
  let storage; try {storage = win.localStorage;storage.getItem(META);} catch {return;}
  // The app's StorageShield can expose a plain-object facade instead of a
  // native Storage instance. Keep its bound methods rather than invoking native
  // Storage.prototype methods on that facade (which throws Illegal invocation).
  const nativeStorage = storage instanceof win.Storage;
  const nativeSet = storage.setItem.bind(storage), nativeRemove = storage.removeItem.bind(storage);
  let applying = false, flushTimer, notifyPending = false;
  const changedKeys=new Set();
  const notify = key => {
    changedKeys.add(key);
    if(notifyPending)return;notifyPending=true;
    (win.queueMicrotask || queueMicrotask)(()=>{notifyPending=false;const keys=[...changedKeys];changedKeys.clear();win.dispatchEvent(new win.CustomEvent('prism:sites_storage_applied',{detail:{keys}}));});
  };
  const status = state => win.dispatchEvent(new win.CustomEvent('prism:sites_sync_status',{detail:state}));
  const capture = () => {
    const values = new Map(); let newest = -1, newestProfile = -1;
    for (let i=0;i<storage.length;i++) {
      const rawKey=storage.key(i),key=syncKey(rawKey);if(!key)continue;
      let value=storage.getItem(rawKey);if(value===null)continue;
      if(key==='prism_user_avatar_permanent') value=storage.getItem('prism_user_avatar_permanent') || value;
      if(key==='lucy_state') {let ts=0;try{ts=Number(JSON.parse(value).clientUpdatedAt)||0;}catch{}if(ts<newest)continue;newest=ts;}
      if(key==='userProfile') {let ts=0;try{const p=JSON.parse(value);ts=Number(p.updatedAt||p.completedAt)||0;}catch{}if(ts<newestProfile)continue;newestProfile=ts;}
      values.set(key,value);
    }
    return values;
  };
  const apply = (key,value) => {
    const keys = key === 'lucy_state' ? [...new Set(['lucy_state_guest',...Array.from({length:storage.length},(_,i)=>storage.key(i)).filter(k=>k?.startsWith('lucy_state_'))])] : key==='userProfile' ? PROFILE_SYNC_KEYS : key==='prism_user_avatar_permanent' ? ['prism_user_avatar_permanent','prism_user_avatar_backup'] : [key];
    let changed=false;applying=true;
    try {for(const localKey of keys) {const oldValue=storage.getItem(localKey);if(oldValue===value)continue;value===null?nativeRemove(localKey):nativeSet(localKey,value);changed=true;win.dispatchEvent(new win.CustomEvent('prism:sites_storage_written',{detail:{key:localKey,value,canonicalKey:key}}));win.dispatchEvent(new win.StorageEvent('storage',{key:localKey,oldValue,newValue:value,...(nativeStorage?{storageArea:storage}:{})}));}}
    catch {status('storage_full');}
    finally {applying=false;}
    if(changed)notify(key);
  };
  const client = new SitesSyncClient({storage,fetcher:win.fetch.bind(win),capture,apply,status});
  const schedule = () => {if(!flushTimer)flushTimer=win.setTimeout(()=>{flushTimer=null;void client.flush();},200);};
  if(nativeStorage){
    const set=win.Storage.prototype.setItem,remove=win.Storage.prototype.removeItem;
    win.Storage.prototype.setItem=function(key,value){const result=set.call(this,key,value);if(this===storage&&!applying){client.changed(String(key),String(value));schedule();}return result;};
    win.Storage.prototype.removeItem=function(key){const result=remove.call(this,key);if(this===storage&&!applying){client.changed(String(key),null);schedule();}return result;};
  }else{
    storage.setItem=(key,value)=>{nativeSet(key,value);if(!applying){client.changed(String(key),String(value));schedule();}};
    storage.removeItem=key=>{nativeRemove(key);if(!applying){client.changed(String(key),null);schedule();}};
  }
  win.addEventListener('storage',event=>{if((!nativeStorage||event.storageArea===storage)&&!applying&&event.key){client.changed(event.key,event.newValue);schedule();}});
  const tick = async () => {if(win.document.visibilityState==='hidden'||win.navigator.onLine===false)return;await client.poll();await client.flush();};
  win.setInterval(()=>void tick(),1000);
  win.addEventListener('pagehide',()=>void client.flush({keepalive:true}));
  win.addEventListener('online',()=>void tick());win.addEventListener('pageshow',()=>void tick());
  win.document.addEventListener('visibilitychange',()=>{if(win.document.visibilityState==='visible')void tick();});
  void tick();
  return client;
}
if (typeof window !== 'undefined') startSitesSync(window);
