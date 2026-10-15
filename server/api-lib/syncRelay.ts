import fs from 'fs';
import path from 'path';
import os from 'os';

// In-memory + temporary server-side storage for zero-config cross-device synchronization
interface VaultEntry {
  data: any;
  updatedAt: number;
}

interface RelayEntry {
  payload: any;
  vaultId: string;
  expiresAt: number;
}

const vaultStore = new Map<string, VaultEntry>();
const relayStore = new Map<string, RelayEntry>();

// Cache directory in writable OS temp directory (works seamlessly on Vercel Serverless /tmp, Linux, Windows, Mac)
const cacheDir = path.join(os.tmpdir(), 'prism-sync');
try {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
} catch (_) {}

function getDiskFilePath(uid: string) {
  const safeName = encodeURIComponent(uid).replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(cacheDir, `vault_${safeName}.json`);
}

// Purge expired entries periodically (unref so serverless lambdas can drain cleanly)
const purgeTimer = setInterval(() => {
  const now = Date.now();
  for (const [code, entry] of relayStore.entries()) {
    if (entry.expiresAt < now) {
      relayStore.delete(code);
    }
  }
}, 60000);
if (purgeTimer.unref) {
  purgeTimer.unref();
}

export function saveVaultData(uid: string, data: any): { success: boolean; updatedAt: number } {
  if (!uid) return { success: false, updatedAt: 0 };
  const updatedAt = Date.now();
  vaultStore.set(uid, { data, updatedAt });
  try {
    fs.writeFileSync(getDiskFilePath(uid), JSON.stringify({ data, updatedAt }), 'utf8');
  } catch (_) {}
  return { success: true, updatedAt };
}

export function getVaultData(uid: string): { success: boolean; data: any; updatedAt: number } {
  if (!uid) {
    return { success: false, data: null, updatedAt: 0 };
  }
  if (vaultStore.has(uid)) {
    const entry = vaultStore.get(uid)!;
    return { success: true, data: entry.data, updatedAt: entry.updatedAt };
  }
  try {
    const file = getDiskFilePath(uid);
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed?.data) {
        vaultStore.set(uid, parsed);
        return { success: true, data: parsed.data, updatedAt: parsed.updatedAt || Date.now() };
      }
    }
  } catch (_) {}
  return { success: false, data: null, updatedAt: 0 };
}

export async function createRelayCode(payload: any, existingVaultId?: string): Promise<{ code: string; vaultId: string; expiresAt: number }> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const vaultId = (existingVaultId && existingVaultId.trim()) 
    ? existingVaultId.trim() 
    : `pair_${code}_${Date.now().toString(36)}`;
  const expiresAt = Date.now() + 60 * 60 * 1000; // 60 minutes pairing window
  
  const entry: RelayEntry = { payload, vaultId, expiresAt };
  relayStore.set(code, entry);
  saveVaultData(vaultId, payload);
  saveVaultData(`pin_${code}`, payload);

  // Cross-container cloud relay backup via cl1p.net (allows different Vercel Serverless instances to fetch code)
  try {
    const serialized = JSON.stringify({ code, vaultId, expiresAt, payload });
    fetch(`https://api.cl1p.net/prism_relay_${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: serialized
    }).catch(() => {});
  } catch (_) {}

  return { code, vaultId, expiresAt };
}

export async function getRelayData(code: string): Promise<{ success: boolean; payload: any; vaultId?: string }> {
  const cleanCode = (code || '').trim().replace(/[^0-9]/g, '');
  if (!cleanCode) {
    return { success: false, payload: null };
  }

  // 1. In-memory check
  if (relayStore.has(cleanCode)) {
    const entry = relayStore.get(cleanCode)!;
    if (entry.expiresAt >= Date.now()) {
      const latestVault = getVaultData(entry.vaultId);
      const effectivePayload = latestVault.success && latestVault.data ? latestVault.data : entry.payload;
      return { success: true, payload: effectivePayload, vaultId: entry.vaultId };
    }
    relayStore.delete(cleanCode);
  }

  // 2. Fallback to /tmp disk-persisted pin vault
  const pinVault = getVaultData(`pin_${cleanCode}`);
  if (pinVault.success && pinVault.data) {
    return { success: true, payload: pinVault.data, vaultId: `pin_${cleanCode}` };
  }

  // 3. Fallback to cloud bridge (handles cross-container requests across separate Vercel Lambdas)
  try {
    const cloudRes = await fetch(`https://api.cl1p.net/prism_relay_${cleanCode}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (cloudRes.ok) {
      const raw = (await cloudRes.text()).trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.payload) {
          const expiresAt = parsed.expiresAt || (Date.now() + 60 * 60 * 1000);
          if (expiresAt >= Date.now()) {
            const vaultId = parsed.vaultId || `pair_${cleanCode}_cloud`;
            // Cache locally in this instance
            relayStore.set(cleanCode, { payload: parsed.payload, vaultId, expiresAt });
            saveVaultData(vaultId, parsed.payload);
            saveVaultData(`pin_${cleanCode}`, parsed.payload);

            // Re-post to cl1p.net so subsequent requests from other devices/tabs stay active
            fetch(`https://api.cl1p.net/prism_relay_${cleanCode}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: raw
            }).catch(() => {});

            return { success: true, payload: parsed.payload, vaultId };
          }
        }
      }
    }
  } catch (err) {
    console.warn('[syncRelay] Cloud bridge fallback error:', err);
  }

  return { success: false, payload: null };
}

