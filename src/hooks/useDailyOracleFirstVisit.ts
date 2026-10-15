import { useEffect, useRef } from "react";
import {
  getTodayDateKey,
  hasSeenOracleModalToday,
  markOracleModalSeen,
  findTodayOracleInSources,
  resolveOracleVisionResult,
} from "../lib/dailyCache";

interface UseDailyOracleFirstVisitProps {
  appPrefix: string;
  featureKey: string;
  appLockPrefix: string;
  limitKeyPrefix: string;
  uid: string | undefined;
  enabled: boolean;
  lastSync: number | undefined;
  dailyResult: any;
  setDailyResult: (res: any) => void;
  isLoading: boolean;
  historySources: any[];
  oracleTypes?: string[];
  setShowDailyModal: (show: boolean) => void;
  onPrepare: () => boolean | void;
  runOracle: (runOpts?: any) => Promise<any> | any;
}

export function useDailyOracleFirstVisit({
  appPrefix,
  featureKey,
  appLockPrefix,
  limitKeyPrefix,
  uid,
  enabled,
  lastSync,
  dailyResult,
  setDailyResult,
  isLoading,
  historySources,
  oracleTypes = ["DAILY_ORACLE"],
  setShowDailyModal,
  onPrepare,
  runOracle,
}: UseDailyOracleFirstVisitProps) {
  const preparedSessionKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!uid || !enabled || isLoading) return;

    const sessionKey = `${appPrefix}:${uid}:${getTodayDateKey()}`;

    // 1. See if there is already a result today in the history
    const entry = findTodayOracleInSources(historySources, oracleTypes);
    const resolved = entry ? resolveOracleVisionResult(entry) : null;

    if (resolved) {
      try {
        setDailyResult(resolved);
      } catch (e) {
        console.warn("Error setting daily result from cached today oracle:", e);
      }
      preparedSessionKeyRef.current = sessionKey;
      return;
    }

    // 2. Prepare card once per day — not again when unrelated history (e.g. tarot) updates
    if (preparedSessionKeyRef.current !== sessionKey) {
      try {
        const didPrepare = onPrepare();
        if (didPrepare !== false) {
          preparedSessionKeyRef.current = sessionKey;
        }
      } catch (e) {
        console.warn("Error in onPrepare during first visit:", e);
      }
    }

    // 3. Show drawing modal if first visit today and no result is yet available
    const hasSeen = hasSeenOracleModalToday(uid);
    if (!hasSeen && !dailyResult && !resolved) {
      try {
        setShowDailyModal(true);
        markOracleModalSeen(uid);
      } catch (e) {
        console.warn("Error triggering first visit daily oracle modal:", e);
      }
    }
  }, [uid, enabled, historySources]);

  return {
    triggerCheck: () => {},
  };
}
