const FORMAT = 'luckey-memory-backup-v1';
export const LUCY_MEMORY_BACKUP_MAX_BYTES = 8 * 1024 * 1024;

function memoryKeys(account: string) {
  const encoded = encodeURIComponent(account);
  return [
    `lucy_consult_memory_v1:${account}`,
    `orb_consult_memory_v1:${account}`,
    `lucy_master_sessions:${account}`,
    `lucy_long_term_memory_v1:${encoded}`,
    `lucy_soul_memories_archive:${encoded}`,
    `lucy_pro_history_v1:${encoded}`,
    `lucy_pro_history_v1:${encoded}:previous`,
    ...(account === 'device' ? ['lucy_soul_memories_archive'] : []),
  ];
}

export function exportLucyMemoryBackup(storage: Storage, account: string, legacy?: ReadonlyMap<string, string>) {
  const entries = Object.fromEntries(memoryKeys(account).flatMap(key => {
    const local = storage.getItem(key);
    const archived = legacy?.get(key);
    const value = archived !== undefined && (local === null || isInitialProHistory(key, local)) ? archived : local;
    return value === null ? [] : [[key, value]];
  }));
  return JSON.stringify({ format: FORMAT, account, entries });
}

function isInitialProHistory(key: string, value: string) {
  if (!key.startsWith('lucy_pro_history_v1:') || key.endsWith(':previous')) return false;
  try {
    const record = JSON.parse(value);
    return !record?.resetAt && record?.messages?.length === 1 && record.messages[0]?.id === `greet-${record.day}`;
  } catch {
    return false;
  }
}

export function restoreLucyMemoryBackup(storage: Storage, account: string, backup: string) {
  if (new Blob([backup]).size > LUCY_MEMORY_BACKUP_MAX_BYTES) throw new Error('백업 파일이 너무 큽니다.');
  const input: unknown = JSON.parse(backup);
  if (!input || typeof input !== 'object' || !('format' in input) || input.format !== FORMAT ||
      !('account' in input) || input.account !== account || !('entries' in input) ||
      !input.entries || typeof input.entries !== 'object' || Array.isArray(input.entries)) {
    throw new Error('이 계정의 루시 기억 백업 파일을 선택해 주세요.');
  }
  const allowed = new Set(memoryKeys(account));
  const entries = Object.entries(input.entries);
  for (const [key, value] of entries) {
    if (!allowed.has(key) || typeof value !== 'string') throw new Error('백업에 지원하지 않는 항목이 있습니다.');
    const decoded: unknown = JSON.parse(value);
    const isObjectRecord = key.startsWith('lucy_consult_memory_v1:') || key.startsWith('lucy_pro_history_v1:');
    if (isObjectRecord ? (!decoded || typeof decoded !== 'object' || Array.isArray(decoded)) : !Array.isArray(decoded)) {
      throw new Error('기억 데이터 형식이 올바르지 않습니다.');
    }
  }

  const changes: Array<[string, string | null]> = [];
  let skipped = 0;
  try {
    for (const [key, value] of entries) {
      const current = storage.getItem(key);
      if (current !== null && current !== '[]' && !isInitialProHistory(key, current)) {
        skipped++;
      } else {
        storage.setItem(key, value);
        changes.push([key, current]);
      }
    }
  } catch (error) {
    for (const [key, current] of changes.reverse()) {
      if (current === null) storage.removeItem(key);
      else storage.setItem(key, current);
    }
    throw error;
  }
  return { restored: changes.length, skipped };
}
