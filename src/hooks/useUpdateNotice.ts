import { useCallback, useEffect, useRef, useState } from 'react';
import { APP_VERSION } from '@/lib/appVersion';
import {
  fetchChangelog,
  getManualSyncChangelogEntries,
  getUnseenChangelogEntries,
  UPDATE_ACK_KEY,
  type ChangelogEntry,
} from '@/lib/updateNotice';
import { safeLocalStorage } from '@/utils/safeStorage';

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
    if (!enabled) return;

    let cancelled = false;

    const checkUpdates = async () => {
      const ackVersion = safeLocalStorage.getItem(UPDATE_ACK_KEY);

      if (!ackVersion) {
        safeLocalStorage.setItem(UPDATE_ACK_KEY, APP_VERSION);
        return;
      }

      const changelog = await fetchChangelog();
      if (cancelled) return;

      const unseen = getUnseenChangelogEntries(changelog, APP_VERSION, ackVersion);
      if (unseen.length === 0) return;

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
    if (modeRef.current === 'auto') {
      safeLocalStorage.setItem(UPDATE_ACK_KEY, APP_VERSION);
    }
    setIsOpen(false);
    setEntries([]);
    dismissResolverRef.current?.();
    dismissResolverRef.current = null;
  }, []);

  return { isOpen, entries, mode, noticeKey, dismiss, showManualSyncNotice };
}