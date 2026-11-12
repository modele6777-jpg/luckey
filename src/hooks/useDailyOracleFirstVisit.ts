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

const BIGBANG_NAVIGATION_TARGET_KEY = "prism_bigbang_navigation_target";
const BIGBANG_NAVIGATION_TARGET_MAX_AGE_MS = 30_000;

function consumeBigBangNavigationTarget(pathname: string) {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(BIGBANG_NAVIGATION_TARGET_KEY);
    if (!raw) return false;
    const target = JSON.parse(raw);
    const age = Date.now() - Number(target?.timestamp);
    if (!target?.path || !Number.isFinite(age) || age < 0 || age > BIGBANG_NAVIGATION_TARGET_MAX_AGE_MS) {
      sessionStorage.removeItem(BIGBANG_NAVIGATION_TARGET_KEY);
      return false;
    }
    if (target.path !== pathname) return false;
    sessionStorage.removeItem(BIGBANG_NAVIGATION_TARGET_KEY);
    return true;
  } catch (_) {
    try { sessionStorage.removeItem(BIGBANG_NAVIGATION_TARGET_KEY); } catch (_) {}
    return false;
  }
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
  const checkedBigBangEntryRef = useRef(false);
  const suppressFirstVisitModalRef = useRef(false);

  useEffect(() => {
    if (!uid || !enabled || isLoading) return;

    if (!checkedBigBangEntryRef.current) {
      checkedBigBangEntryRef.current = true;
      suppressFirstVisitModalRef.current = consumeBigBangNavigationTarget(window.location.pathname);
    }

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
        if (!suppressFirstVisitModalRef.current) {
          setShowDailyModal(true);
          markOracleModalSeen(uid);
        }
      } catch (e) {
        console.warn("Error triggering first visit daily oracle modal:", e);
      }
    }
  }, [uid, enabled, historySources]);

  return {
    triggerCheck: () => {},
  };
}
