import { safeLocalStorage } from '@/utils/safeStorage';

export type LucyConsultMode = 'voice' | 'chat' | 'divination';

export interface LucyConsultMemory {
  id: string;
  source: LucyConsultMode;
  at: number;
  concern: string;
  advice: string;
  masterId?: string;
  masterName?: string;
  cards?: string;
}

const PREFIX = 'lucy_consult_memory_v1:';
const RETENTION_MS = 90 * 86_400_000;
const LIMIT_PER_MODE = 8;

interface MemoryState {
  enabled: Partial<Record<LucyConsultMode, boolean>>;
  entries: LucyConsultMemory[];
}

const key = (account: string) => PREFIX + (account || 'device');

function read(account: string, now = Date.now()): MemoryState {
  try {
    const value: Partial<MemoryState> = JSON.parse(safeLocalStorage.getItem(key(account)) || '{}');
    return {
      enabled: value.enabled || {},
      entries: (Array.isArray(value.entries) ? value.entries : [])
        .filter(entry => entry && typeof entry.id === 'string' && typeof entry.at === 'number' && now - entry.at < RETENTION_MS)
        .sort((a, b) => b.at - a.at),
    };
  } catch {
    return { enabled: {}, entries: [] };
  }
}

function write(account: string, state: MemoryState) {
  safeLocalStorage.setItem(key(account), JSON.stringify(state));
}

export function readLucyConsultMemory(account: string, mode: LucyConsultMode, now = Date.now()) {
  const state = read(account, now);
  const enabled = state.enabled[mode] === true;
  return { enabled, entries: state.entries.filter(entry => entry.source === mode) };
}

export function setLucyConsultMemoryEnabled(account: string, mode: LucyConsultMode, enabled: boolean, now = Date.now()) {
  const state = read(account, now);
  state.enabled[mode] = enabled;
  write(account, state);
}

export function saveLucyConsultMemory(account: string, entry: LucyConsultMemory, now = Date.now()): boolean {
  const state = read(account, now);
  if (state.enabled[entry.source] !== true || now - entry.at >= RETENTION_MS) return false;
  const sameMode = state.entries.filter(item => item.source === entry.source && item.id !== entry.id);
  state.entries = [
    ...state.entries.filter(item => item.source !== entry.source),
    ...[entry, ...sameMode].sort((a, b) => b.at - a.at).slice(0, LIMIT_PER_MODE),
  ];
  write(account, state);
  return true;
}

export function deleteLucyConsultMemory(account: string, mode: LucyConsultMode, id?: string) {
  const state = read(account);
  state.entries = state.entries.filter(entry => entry.source !== mode || (id !== undefined && entry.id !== id));
  write(account, state);
}
