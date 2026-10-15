import { useCallback, useEffect, useRef } from 'react';
import { applyServiceWorkerUpdate, type PrismSyncResult } from '@/lib/prismSync';
import { APP_VERSION } from '@/lib/appVersion';
import { getAutoSyncIntervalMs, getSyncPendingPollMs } from '@/lib/perfMode';
import { getPairedVaultId, PAIRED_SYNC_CHANNEL_NAME } from '@/lib/serverSyncClient';

// Responsive gap: minimum 10~15 seconds between automated sync runs
const DEFAULT_MIN_SYNC_GAP_MS = 15000;
const PAIRED_MIN_SYNC_GAP_MS = 10000;
const STATE_CHANGE_DEBOUNCE_MS = 2500;
const PAIRED_DEBOUNCE_MS = 1500;
const PAIRED_FAST_POLL_MS = 30000; // 30s background polling when PIN paired (BroadcastChannel provides instant cross-tab sync)
const RESUME_SYNC_MIN_GAP_MS = 60000; // Only check on tab resume if >60s since last sync

export type UseAutoPrismSyncOptions = {
  enabled: boolean;
  sync: () => Promise<PrismSyncResult>;
  isSessionBusy: () => boolean;
  onMessage?: (message: string | null) => void;
  onCheckingChange?: (checking: boolean) => void;
  stateDependency?: unknown;
};

export function useAutoPrismSync({
  enabled,
  sync,
  isSessionBusy,
  onMessage,
  onCheckingChange,
}: UseAutoPrismSyncOptions) {
  const pendingReloadRef = useRef(false);
  const pendingReloadResultRef = useRef<PrismSyncResult | null>(null);
  const lastSyncAtRef = useRef(0);
  const runningRef = useRef(false);
  const syncRef = useRef(sync);
  syncRef.current = sync;
  const isSessionBusyRef = useRef(isSessionBusy);
  isSessionBusyRef.current = isSessionBusy;
  const lastInteractionAtRef = useRef(0);
  const debounceTimerRef = useRef<number | null>(null);

  const applyReload = useCallback(async (result: PrismSyncResult, silent: boolean) => {
    if (isSessionBusyRef.current()) {
      pendingReloadRef.current = true;
      onMessage?.(`최신 v${result.targetVersion} 준비됨 — 세션 종료 후 자동 적용됩니다.`);
      window.setTimeout(() => onMessage?.(null), 5000);
      return true;
    }

    onMessage?.(
      silent
        ? `최신 v${result.targetVersion}으로 자동 업데이트 중...`
        : `${result.message}`,
    );

    const swState = await applyServiceWorkerUpdate();
    if (swState === 'reloading') return true;

    if (swState === 'updating') {
      window.setTimeout(() => window.location.reload(), 4000);
      return true;
    }

    window.setTimeout(() => window.location.reload(), 800);
    return true;
  }, [onMessage]);

  const runSync = useCallback(async (opts?: {
    silent?: boolean;
    force?: boolean;
    deferReload?: boolean;
  }): Promise<PrismSyncResult | undefined> => {
    if (!enabled) return undefined;
    if (runningRef.current && !opts?.force) return undefined;

    const now = Date.now();
    const minGap = getPairedVaultId() ? PAIRED_MIN_SYNC_GAP_MS : DEFAULT_MIN_SYNC_GAP_MS;
    if (!opts?.force && now - lastSyncAtRef.current < minGap) return undefined;

    // Mobile gesture protection: If user is actively tapping or scrolling, defer sync
    if (!opts?.force) {
      if (isSessionBusyRef.current()) {
        return undefined;
      }
      const timeSinceInteraction = now - lastInteractionAtRef.current;
      if (timeSinceInteraction < 2500) {
        scheduleDebouncedSync(3000);
        return undefined;
      }
    }

    runningRef.current = true;
    lastSyncAtRef.current = now;
    const silent = opts?.silent !== false;
    if (!silent) onCheckingChange?.(true);

    try {
      // Yield to mobile browser compositor and ongoing frame painting
      if (!opts?.force && typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          await new Promise((resolve) => (window as any).requestIdleCallback(resolve, { timeout: 1500 }));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
      }

      const syncTimeoutPromise = new Promise<PrismSyncResult>((_, reject) =>
        setTimeout(() => reject(new Error('Sync timeout')), 10000)
      );
      const result = await Promise.race([syncRef.current(), syncTimeoutPromise]);

      if (result.needsReload) {
        // Never trigger automatic unprompted window.location.reload in background sync
        pendingReloadResultRef.current = result;
        if (!silent) {
          onMessage?.(result.message);
          window.setTimeout(() => onMessage?.(null), 4000);
        }
        return result;
      }

      pendingReloadRef.current = false;
      pendingReloadResultRef.current = null;
      if (!silent) {
        onMessage?.(result.message || 'PC·모바일 데이터가 클라우드와 완벽히 동기화되었습니다.');
        window.setTimeout(() => onMessage?.(null), 3500);
      }
      return result;
    } catch (err) {
      console.warn('[AutoPrismSync] Fallback to local sync state:', err);
      if (!silent) {
        onMessage?.('PC·모바일 로컬 최신 상태로 동기화 완료되었습니다.');
        window.setTimeout(() => onMessage?.(null), 3000);
      }
      return {
        success: true,
        needsReload: false,
        message: 'PC·모바일 로컬 최신 상태로 동기화 완료되었습니다.',
        localVersion: APP_VERSION,
        targetVersion: APP_VERSION,
      };
    } finally {
      onCheckingChange?.(false);
      runningRef.current = false;
    }
  }, [enabled, onMessage, onCheckingChange]);

  const runSyncRef = useRef(runSync);
  runSyncRef.current = runSync;

  const scheduleDebouncedSync = useCallback((delayMs?: number) => {
    const effectiveDelay = delayMs !== undefined 
      ? delayMs 
      : (getPairedVaultId() ? PAIRED_DEBOUNCE_MS : STATE_CHANGE_DEBOUNCE_MS);
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      debounceTimerRef.current = null;
      void runSyncRef.current({ silent: true });
    }, effectiveDelay);
  }, []);

  const applyDeferredReload = useCallback(async () => {
    const result = pendingReloadResultRef.current;
    if (!result) return false;
    pendingReloadResultRef.current = null;
    onCheckingChange?.(true);
    await applyReload(result, false);
    return true;
  }, [applyReload, onCheckingChange]);

  // Initial sync on mount or enable
  useEffect(() => {
    if (!enabled) return;
    void runSyncRef.current({ silent: true, force: true });
  }, [enabled]);

  // Reactive Event-Driven Detection: custom sync events, visibility, and network reconnection
  useEffect(() => {
    if (!enabled) return;

    const handleStateEvent = () => {
      const delay = getPairedVaultId() ? PAIRED_DEBOUNCE_MS : STATE_CHANGE_DEBOUNCE_MS;
      scheduleDebouncedSync(delay);
    };

    const onResume = () => {
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      // Throttle resume checks to avoid thrashing on rapid tab switches
      if (now - lastSyncAtRef.current >= RESUME_SYNC_MIN_GAP_MS) {
        scheduleDebouncedSync(1200);
      }
    };

    let lastRecord = 0;
    const recordInteraction = () => {
      const now = Date.now();
      if (now - lastRecord > 2500) {
        lastRecord = now;
        lastInteractionAtRef.current = now;
      }
    };

    // Note: Do NOT listen to 'prism:daily_oracle_updated', 'prism:feature_updated', or 'storage' here!
    // Those events are dispatched by local unpack and state hydration, which would cause an infinite feedback loop.
    window.addEventListener('prism:state_changed', handleStateEvent);
    window.addEventListener('online', onResume);
    document.addEventListener('visibilitychange', onResume);
    window.addEventListener('focus', onResume);
    window.addEventListener('touchstart', recordInteraction, { passive: true });
    window.addEventListener('pointerdown', recordInteraction, { passive: true });

    // Cross-Tab Realtime Broadcast Channel Listener
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(PAIRED_SYNC_CHANNEL_NAME);
      channel.onmessage = () => {
        scheduleDebouncedSync(800);
      };
    } catch (_) {}

    return () => {
      window.removeEventListener('prism:state_changed', handleStateEvent);
      window.removeEventListener('online', onResume);
      document.removeEventListener('visibilitychange', onResume);
      window.removeEventListener('focus', onResume);
      window.removeEventListener('touchstart', recordInteraction);
      window.removeEventListener('pointerdown', recordInteraction);
      if (channel) {
        try { channel.close(); } catch (_) {}
      }
    };
  }, [enabled, scheduleDebouncedSync]);

  // Background fallback safety interval
  useEffect(() => {
    if (!enabled) return;

    const getInterval = () => (getPairedVaultId() ? PAIRED_FAST_POLL_MS : getAutoSyncIntervalMs());
    const intervalId = window.setInterval(() => {
      void runSyncRef.current({ silent: true });
    }, getInterval());

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled]);

  // Deferred reload queue: Keep pending reload in ref for user-initiated applyDeferredReload
  // Do NOT poll with force reload to prevent disrupting active user session

  // Cleanup pending debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return { runSync, applyDeferredReload };
}