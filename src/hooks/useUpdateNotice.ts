import { useCallback, useEffect, useRef, useState } from 'react';
import { APP_VERSION } from '@/lib/appVersion';
import {
  fetchChangelog,
  getManualSyncChangelogEntries,
  getUnseenChangelogEntries,
  UPDATE_ACK_KEY,
  hasPendingUpdateNotice,
  clearPendingUpdateNotice,
  type ChangelogEntry,
} from '@/lib/updateNotice';
import { safeLocalStorage } from '@/utils/safeStorage';

function bundledReleaseNotes(): ChangelogEntry[] {
  const notes = typeof __APP_RELEASE_NOTES__ === 'undefined' ? null : __APP_RELEASE_NOTES__;
  if (!notes?.version || !notes.summary) return [];
  return [notes];
}

export type UpdateNoticeMode = 'auto' | 'manual';

export function useUpdateNotice(enabled: boolean) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<UpdateNoticeMode>('auto');
  const [noticeKey, setNoticeKey] = useState(0);
  const dismissResolverRef = useRef<(() => void) | null>(null);
  const modeRef = useRef<UpdateNoticeMode>('auto');
  modeRef.current = mode;

  const openNotice = useCallback((nextEntries: ChangelogEntry[], nextMode: UpdateNoticeMode) => {
    if (nextEntries.length === 0) return Promise.resolve();

    dismissResolverRef.current?.();
    dismissResolverRef.current = null;
    setIsOpen(false);
    setEntries([]);

    return new Promise<void>((resolve) => {
      dismissResolverRef.current = resolve;
      window.setTimeout(() => {
        setMode(nextMode);
        setEntries(nextEntries);
        setNoticeKey((key) => key + 1);
        setIsOpen(true);
      }, 0);
    });
  }, []);

  useEffect(() => {
    // Login and the PIN screen must not swallow a reload that already reached a new version.
    let cancelled = false;
    let attempts = 0;

    const checkUpdates = async () => {
      const showAfterRefresh = hasPendingUpdateNotice();
      const changelog = await fetchChangelog();
      if (cancelled) return;
      const notes = changelog.length > 0 ? changelog : bundledReleaseNotes();

      if (showAfterRefresh) {
        const recent = getManualSyncChangelogEntries(notes, APP_VERSION);
        if (recent.length > 0) {
          void openNotice(recent, 'manual');
          return;
        }
        // Keep the flag when the changelog is briefly unavailable during a service-worker swap.
        if (attempts < 2) {
          attempts += 1;
          window.setTimeout(() => { if (!cancelled) void checkUpdates(); }, 1200);
        }
        return;
      }

      const ackVersion = safeLocalStorage.getItem(UPDATE_ACK_KEY);
      if (!ackVersion) {
        safeLocalStorage.setItem(UPDATE_ACK_KEY, APP_VERSION);
        return;
      }

      const unseen = getUnseenChangelogEntries(notes, APP_VERSION, ackVersion);
      if (unseen.length === 0) {
        if (notes.length === 0 && attempts < 2) {
          attempts += 1;
          window.setTimeout(() => { if (!cancelled) void checkUpdates(); }, 1200);
        }
        return;
      }

      void openNotice(unseen, 'auto');
    };

    void checkUpdates();
    return () => {
      cancelled = true;
    };
  }, [enabled, openNotice]);

  const showManualSyncNotice = useCallback(async (targetVersion?: string) => {
    const changelog = await fetchChangelog();
    const version = targetVersion || APP_VERSION;
    const nextEntries = getManualSyncChangelogEntries(changelog, version);
    return openNotice(nextEntries, 'manual');
  }, [openNotice]);

  const dismiss = useCallback(() => {
    safeLocalStorage.setItem(UPDATE_ACK_KEY, APP_VERSION);
    clearPendingUpdateNotice();
    setIsOpen(false);
    setEntries([]);
    dismissResolverRef.current?.();
    dismissResolverRef.current = null;
  }, []);

  return { isOpen, entries, mode, noticeKey, dismiss, showManualSyncNotice };
}