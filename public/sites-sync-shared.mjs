const forbidden = /(?:token|auth|firebase|api.?key|session|device|paired|sync_|vault_id|backup|bypass|unlock|voice|volume|mute|audio|playing|autoplay|scroll|active_tab|greeting_spoken|speech|theme)/i;
export const PROFILE_SYNC_KEYS = ['userProfile','user_profile','lucy_user_profile','prism_user_profile','prism_user_profile_vault','prism_user_profile_backup_v1','prism_user_profile_backup_v2','prism_user_profile_secure','prism_user_profile_cloud_cache','lucy_user_profile_v1','lucy_user_profile_permanent','prism_soul_profile_master'];
export function syncKey(key) {
  if (typeof key !== 'string' || key.length > 200) return null;
  if (PROFILE_SYNC_KEYS.includes(key)) return 'userProfile';
  if (key === 'lucy_state' || key.startsWith('lucy_state_')) return 'lucy_state';
  if (forbidden.test(key)) return null;
  return /^(?:userProfile$|user_profile|prism_|lucy_|luckey_|trinity_|orange_|bluebird_|heal_|muse_|epilogue_|sedona_|chat_history|calm_|rebible_|prologue_|hoponopono_|daily_|soul_)/.test(key) ? key : null;
}
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const unsafe = key => ['__proto__', 'prototype', 'constructor'].includes(key);
function identity(value) {
  if (object(value) && (typeof value.id === 'string' || typeof value.id === 'number')) return String(value.id);
  if (object(value)) for (const key of ['date','timestamp','createdAt']) if (typeof value[key] === 'string' || typeof value[key] === 'number') return key + ':' + value[key];
  return null;
}
// Three-way reconciliation preserves independent edits and deletions. Only a
// conflict on the same scalar chooses the pending local user action.
export function mergeSyncValue(base, local, remote, depth = 0) {
  if (equal(local, base)) return remote;
  if (equal(remote, base) || equal(local, remote)) return local;
  if (depth > 40) return local;
  if (local === undefined || remote === undefined) return local === undefined ? undefined : local;
  if (object(local) && object(remote) && (base === undefined || object(base))) {
    const result = {};
    for (const key of new Set([...Object.keys(base || {}), ...Object.keys(remote), ...Object.keys(local)])) {
      if (unsafe(key)) continue;
      const merged = mergeSyncValue(base?.[key], local[key], remote[key], depth + 1);
      if (merged !== undefined) result[key] = merged;
    }
    return result;
  }
  if (Array.isArray(local) && Array.isArray(remote) && (base === undefined || Array.isArray(base))) {
    const all = [...local, ...remote, ...(base || [])];
    if (all.every(item=>typeof item==='string'||typeof item==='number'||typeof item==='boolean')) {
      const b=new Set(base||[]),l=new Set(local),r=new Set(remote);
      return [...new Set([...remote,...local])].filter(item=>!b.has(item)||(l.has(item)&&r.has(item)));
    }
    if (all.length && all.every(item => identity(item) !== null)) {
      const map = list => new Map((list || []).map(item => [identity(item), item]));
      const b = map(base), l = map(local), r = map(remote), result = [];
      for (const id of new Set([...r.keys(), ...l.keys(), ...b.keys()])) {
        const merged = mergeSyncValue(b.get(id), l.get(id), r.get(id), depth + 1);
        if (merged !== undefined) result.push(merged);
      }
      if (result.every(item => Number.isFinite(item.timestamp))) result.sort((a, b) => a.timestamp - b.timestamp || String(a.id).localeCompare(String(b.id)));
      return result;
    }
  }
  return local;
}
export function mergeSyncText(base, local, remote) {
  if (local === base) return remote;
  if (remote === base || local === remote) return local;
  if (local === null || remote === null) return local;
  try { return JSON.stringify(mergeSyncValue(base === null ? undefined : JSON.parse(base), JSON.parse(local), JSON.parse(remote))); }
  catch { return local; }
}
