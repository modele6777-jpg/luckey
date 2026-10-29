/** One-time account-bound import. Personal values exist only in a server secret. */
export async function applyConfiguredProfileImport(account, env) {
  if (!env.DB || !env.LUCY_PROFILE_IMPORT) return;
  let data;
  try { data = JSON.parse(env.LUCY_PROFILE_IMPORT); } catch { return; }
  if (data.ownerId !== account || typeof data.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(data.id)) return;
  const source = data.profile;
  if (!source || typeof source !== 'object') return;
  const basic = {};
  for (const key of ['name','birthdate','birthtime','gender','lunarSolar']) {
    if (typeof source.basic?.[key] === 'string' && source.basic[key].length <= 100) basic[key] = source.basic[key];
  }
  const notes = source.fate?.referenceNotes;
  if (typeof notes !== 'string' || notes.length > 18000 || !Object.keys(basic).length) return;
  const patch = JSON.stringify({ basic, fate: { referenceNotes: notes } });
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS profile_import_receipts (owner_id TEXT NOT NULL, import_id TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (owner_id, import_id))').bind().all();
  // D1 batch is transactional. Replays and concurrent polls cannot reapply an import.
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO sites_sync_entries (owner_id, storage_key, value, revision)
      SELECT ?, 'userProfile', ?, 1 WHERE NOT EXISTS (SELECT 1 FROM profile_import_receipts WHERE owner_id = ? AND import_id = ?)
      ON CONFLICT(owner_id, storage_key) DO UPDATE SET
        value = json_patch(CASE WHEN json_valid(sites_sync_entries.value) THEN sites_sync_entries.value ELSE '{}' END, excluded.value),
        revision = sites_sync_entries.revision + 1`).bind(account, patch, account, data.id),
    env.DB.prepare('INSERT INTO profile_import_receipts (owner_id, import_id) VALUES (?, ?) ON CONFLICT DO NOTHING').bind(account, data.id),
  ]);
}
