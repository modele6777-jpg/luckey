import type { SharedState } from './sharedState';
import { readServerVaultPullResponse, readServerVaultPushResponse } from './serverVaultProtocol';
import { createServerVaultPollBackoff } from './serverVaultPollBackoff';

export const PAIRED_VAULT_KEY = 'prism_paired_vault_id';
export const PAIRED_SYNC_CHANNEL_NAME = 'prism_paired_realtime_sync';
const serverVaultEtags = new Map<string, string>();

export function getPairedVaultId(): string | null {
  try {
    return localStorage.getItem(PAIRED_VAULT_KEY) || null;
  } catch {
    return null;
  }
}

export function setPairedVaultId(vaultId: string | null): void {
  try {
    if (vaultId && vaultId.trim()) {
      localStorage.setItem(PAIRED_VAULT_KEY, vaultId.trim());
    } else {
      localStorage.removeItem(PAIRED_VAULT_KEY);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism:paired_vault_changed', { detail: vaultId?.trim() || null }));
    }
  } catch {
    // ignore
  }
}

function fetchWithTimeout(url: string, options: RequestInit = {}, ms = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
}

export async function pushToServerVault(uid: string, state: SharedState): Promise<boolean> {
  if (!uid) return false;
  try {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetchWithTimeout('/api/sync/vault/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ uid, payload: state }),
    }, 8000);
    return await readServerVaultPushResponse(uid, res, serverVaultEtags);
  } catch (e) {
    console.warn('[ServerVault] push failed:', e);
    return false;
  }
}

export async function pullFromServerVault(uid: string): Promise<SharedState | null> {
  if (!uid) return null;
  try {
    const token = await auth.currentUser?.getIdToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const etag = serverVaultEtags.get(uid);
    if (etag) headers['If-None-Match'] = etag;
    const res = await fetchWithTimeout('/api/sync/vault/pull/' + encodeURIComponent(uid), {
      headers,
    }, 8000);
    return await readServerVaultPullResponse(uid, res, serverVaultEtags);
  } catch (e) {
    console.warn('[ServerVault] pull failed:', e);
    return null;
  }
}

import { auth, db, doc, setDoc, getDoc, onSnapshot, serverTimestamp } from './firebase';
import { cleanFirestoreData } from './sharedStateSync';

export async function pushToPairedVault(state: SharedState): Promise<boolean> {
  const vaultId = getPairedVaultId();
  if (!vaultId) return false;

  // 1. Direct real-time push to Firestore pairedVaults collection
  try {
    const cleanPayload = cleanFirestoreData({
      ...state,
      vaultId,
      updatedAt: serverTimestamp(),
      clientUpdatedAt: state.clientUpdatedAt || Date.now(),
    });
    setDoc(doc(db, 'pairedVaults', vaultId), cleanPayload, { merge: true }).catch(() => {});
  } catch (_) {}

  // 2. Cross-tab BroadcastChannel
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(PAIRED_SYNC_CHANNEL_NAME);
      bc.postMessage({ type: 'PRISM_PAIRED_STATE_UPDATE', vaultId, state });
      bc.close();
    }
  } catch (_) {}

  // 3. Fallback to server vault
  return await pushToServerVault(vaultId, state);
}

export async function pullFromPairedVault(): Promise<SharedState | null> {
  const vaultId = getPairedVaultId();
  if (!vaultId) return null;

  // 1. Try Firestore pairedVaults first
  try {
    const snap = await getDoc(doc(db, 'pairedVaults', vaultId));
    if (snap.exists()) {
      return snap.data() as SharedState;
    }
  } catch (_) {}

  // 2. Fallback to server vault
  return await pullFromServerVault(vaultId);
}

/**
 * Subscribes to real-time updates for the active paired vault across devices (Mobile <-> PC).
 * Uses Firestore onSnapshot + BroadcastChannel + periodic polling + wakeup listener.
 */
export function subscribeToPairedVault(onUpdate: (state: SharedState) => void): () => void {
  const vaultId = getPairedVaultId();
  if (!vaultId || typeof window === 'undefined') {
    return () => {};
  }

  let isDestroyed = false;
  let lastReceivedTs = 0;
  let firestoreConnected = false;
  let polling = false;
  let lastPayload = '';
  const pollBackoff = createServerVaultPollBackoff();
  let pollTimer: number | null = null;

  function scheduleNextPoll(delayMs = pollBackoff.current()): void {
    if (isDestroyed || firestoreConnected || document.visibilityState !== 'visible') return;
    if (pollTimer !== null) window.clearTimeout(pollTimer);
    pollTimer = window.setTimeout(() => {
      pollTimer = null;
      void pollServerVault();
    }, delayMs);
  }

  const deliver = (state: SharedState) => {
    const payload = JSON.stringify(state);
    if (payload === lastPayload) return;
    lastPayload = payload;
    pollBackoff.reset();
    lastReceivedTs = Math.max(lastReceivedTs, state.clientUpdatedAt || 0);
    onUpdate(state);
  };

  async function pollServerVault(): Promise<void> {
    if (isDestroyed || firestoreConnected || polling) return;
    if (document.visibilityState !== 'visible') return;
    polling = true;
    let serverState: SharedState | null = null;
    try {
      serverState = await pullFromServerVault(vaultId);
      if (serverState && !isDestroyed && !firestoreConnected) {
        const ts = serverState.clientUpdatedAt || 0;
        if (ts > lastReceivedTs) deliver(serverState);
      }
    } finally {
      polling = false;
      if (!isDestroyed) scheduleNextPoll(pollBackoff.afterPoll(Boolean(serverState)));
    }
  }

  // 1. Real-time Firestore onSnapshot Listener
  let unsubFirestore: (() => void) | null = null;
  try {
    const docRef = doc(db, 'pairedVaults', vaultId);
    unsubFirestore = onSnapshot(docRef, { includeMetadataChanges: true }, (snap) => {
      if (isDestroyed) return;
      firestoreConnected = !snap.metadata.fromCache && snap.exists();
      if (firestoreConnected) {
        if (pollTimer !== null) window.clearTimeout(pollTimer);
        pollTimer = null;
      } else {
        scheduleNextPoll();
      }
      if (!snap.exists()) return;
      if (snap.metadata.hasPendingWrites) return;
      deliver(snap.data() as SharedState);
    }, (err) => {
      firestoreConnected = false;
      console.warn('[PairedVault] onSnapshot notice (falling back to continuous sync):', err?.message || err);
      scheduleNextPoll();
    });
  } catch (_) {}

  // 2. Cross-tab BroadcastChannel
  let bc: BroadcastChannel | null = null;
  try {
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel(PAIRED_SYNC_CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (isDestroyed) return;
        if (event?.data?.type === 'PRISM_PAIRED_STATE_UPDATE' && event?.data?.vaultId === vaultId && event?.data?.state) {
          deliver(event.data.state);
        }
      };
    }
  } catch (_) {}

  // 3. Adaptive background polling while Firestore realtime is unavailable.
  const handleWakeup = () => {
    if (document.visibilityState === 'visible') {
      pollBackoff.reset();
      if (pollTimer !== null) window.clearTimeout(pollTimer);
      pollTimer = null;
      void pollServerVault();
    }
  };
  document.addEventListener('visibilitychange', handleWakeup);
  window.addEventListener('focus', handleWakeup);
  window.addEventListener('online', handleWakeup);
  scheduleNextPoll();

  return () => {
    isDestroyed = true;
    if (unsubFirestore) unsubFirestore();
    if (bc) bc.close();
    if (pollTimer !== null) window.clearTimeout(pollTimer);
    document.removeEventListener('visibilitychange', handleWakeup);
    window.removeEventListener('focus', handleWakeup);
    window.removeEventListener('online', handleWakeup);
  };
}

export async function generatePairingCode(state: SharedState): Promise<{ code: string; vaultId?: string; expiresAt: number } | null> {
  try {
    const currentVaultId = getPairedVaultId();
    const res = await fetchWithTimeout('/api/sync/relay/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: state, vaultId: currentVaultId || undefined }),
    }, 15000);
    
    let assignedVaultId = currentVaultId;
    let json: any = null;

    if (res.ok) {
      json = await res.json();
      if (json?.vaultId) {
        assignedVaultId = json.vaultId;
        setPairedVaultId(json.vaultId);
      }
    } else {
      // Client-side fallback pairing code if serverless relay is cold
      const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
      assignedVaultId = currentVaultId || `pin_${fallbackCode}`;
      setPairedVaultId(assignedVaultId);
      json = { code: fallbackCode, vaultId: assignedVaultId, expiresAt: Date.now() + 60 * 60 * 1000 };
    }

    // Direct Firestore backup so both devices can pair via Firestore in real time
    if (json?.code && assignedVaultId) {
      try {
        const cleanPayload = cleanFirestoreData({
          ...state,
          vaultId: assignedVaultId,
          code: json.code,
          updatedAt: serverTimestamp(),
          clientUpdatedAt: Date.now(),
        });
        setDoc(doc(db, 'pairedVaults', assignedVaultId), cleanPayload, { merge: true }).catch(() => {});
        setDoc(doc(db, 'pairedVaults', `pin_${json.code}`), cleanPayload, { merge: true }).catch(() => {});
      } catch (_) {}
    }

    return json;
  } catch (e) {
    console.warn('[PairingRelay] generate failed:', e);
    return null;
  }
}

export async function importWithPairingCode(code: string): Promise<SharedState | null> {
  try {
    const cleanCode = (code || '').trim().replace(/[^0-9]/g, '');
    if (!cleanCode || cleanCode.length !== 6) {
      console.warn('[PairingRelay] Invalid code format (must be 6 digits):', cleanCode);
      return null;
    }

    // 1. Try Firestore direct first (sub-second pairing)
    try {
      const pinSnap = await getDoc(doc(db, 'pairedVaults', `pin_${cleanCode}`));
      if (pinSnap.exists()) {
        const payload = pinSnap.data() as SharedState;
        const assignedVaultId = (payload as any).vaultId || `pin_${cleanCode}`;
        setPairedVaultId(assignedVaultId);
        return payload;
      }
    } catch (_) {}

    // 2. Relay endpoint
    const res = await fetchWithTimeout('/api/sync/relay/consume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: cleanCode }),
    }, 15000);
    if (!res.ok) {
      console.warn('[PairingRelay] consume response not ok:', res.status);
      return null;
    }
    const json = await res.json();
    if (json?.success && json?.payload) {
      const assignedVaultId = json.vaultId || `pin_${cleanCode}`;
      setPairedVaultId(assignedVaultId);
      // Dual-sync to Firestore for subsequent real-time updates
      try {
        const cleanPayload = cleanFirestoreData({
          ...json.payload,
          vaultId: assignedVaultId,
          updatedAt: serverTimestamp(),
          clientUpdatedAt: Date.now(),
        });
        setDoc(doc(db, 'pairedVaults', assignedVaultId), cleanPayload, { merge: true }).catch(() => {});
      } catch (_) {}
      return json.payload as SharedState;
    }
    console.warn('[PairingRelay] consume returned unsuccess payload:', json);
    return null;
  } catch (e) {
    console.warn('[PairingRelay] consume failed:', e);
    return null;
  }
}
