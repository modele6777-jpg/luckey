const PIN_UNLOCK_DATE_KEY = "lu_unlocked_date";

export function getTodayDateKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function hasUnlockedPinToday(): boolean {
  try {
    return isSameDayString(localStorage.getItem(PIN_UNLOCK_DATE_KEY));
  } catch {
    return false;
  }
}

export function markPinUnlockedToday(): void {
  try {
    localStorage.setItem(PIN_UNLOCK_DATE_KEY, getTodayDateKey());
  } catch (e) {
    console.error("Error marking daily PIN unlock:", e);
  }
}

export function isSameDayString(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  return dateStr === getTodayDateKey();
}

export function getDateSeed(salt = ""): number {
  const key = `${getTodayDateKey()}${salt}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function isTimestampToday(timestamp: any): boolean {
  if (!timestamp) return false;
  const dateVal = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  if (isNaN(dateVal.getTime())) return false;
  return formatDateKey(dateVal) === getTodayDateKey();
}

export function pickDailySeededItem<T>(items: T[], seedPrefix: string): T {
  if (!items || items.length === 0) {
    throw new Error("Seeded item pick array is empty");
  }
  const dateStr = getTodayDateKey();
  const seedStr = `${seedPrefix}_${dateStr}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % items.length;
  return items[idx];
}

export function pickDailySeededCard<T>(items: T[], seedPrefix: string): T {
  return pickDailySeededItem(items, seedPrefix);
}

export function findTodayOracleInSources(history: any[], types: string[]): any {
  if (!Array.isArray(history)) return null;
  const todayStr = getTodayDateKey();

  return (
    history.find((entry) => {
      if (!entry) return false;

      // Check type
      const type = entry.type || entry.category || "";
      if (types.length > 0 && !types.includes(type)) return false;

      // Check date
      let dateVal: Date | null = null;
      const created = entry.createdAt || entry.timestamp || entry.date;
      if (created) {
        if (typeof created.toDate === "function") {
          dateVal = created.toDate();
        } else if (created.seconds) {
          dateVal = new Date(created.seconds * 1000);
        } else {
          dateVal = new Date(created);
        }
      }

      if (!dateVal || isNaN(dateVal.getTime())) return false;
      return formatDateKey(dateVal) === todayStr;
    }) || null
  );
}

export function resolveOracleVisionResult(entry: any): any {
  if (!entry) return null;
  const payload =
    entry.data && typeof entry.data === "object" && !Array.isArray(entry.data)
      ? entry.data
      : entry;
  return {
    ...payload,
    drawnCard:
      payload.drawnCard ||
      entry.drawnCard ||
      entry.card ||
      null,
    diagnosis:
      payload.diagnosis ||
      entry.diagnosis ||
      payload.analysis ||
      entry.analysis ||
      entry.reply ||
      entry.text ||
      entry.content ||
      "",
    spiritualEnergy: payload.spiritualEnergy || entry.spiritualEnergy || "",
    remedy: payload.remedy || entry.remedy || "",
    blessingMessage: payload.blessingMessage || entry.blessingMessage || "",
    focusPlaylist: payload.focusPlaylist || entry.focusPlaylist || "",
    symbol: payload.symbol || entry.symbol || "",
    frequency: payload.frequency || entry.frequency || "",
  };
}

export function getTrinityDailyResultKey(uid: string): string {
  return `trinity_daily_result_${uid}_${getTodayDateKey()}`;
}

export function getDailyAutoRanKey(appType: string, uid: string): string {
  return `lucy_autorun_${appType}_${uid}_${getTodayDateKey()}`;
}

export function markDailyAutoRan(appType: string, uid: string): void {
  try {
    localStorage.setItem(getDailyAutoRanKey(appType, uid), "true");
  } catch (e) {
    console.error("Error marking daily auto ran:", e);
  }
}

export function markOracleModalSeen(uid: string): void {
  try {
    const today = getTodayDateKey();
    localStorage.setItem(`lucy_oracle_seen_${uid}_${today}`, "true");
  } catch (e) {
    console.error("Error marking oracle modal seen:", e);
  }
}

export function hasSeenOracleModalToday(uid: string): boolean {
  try {
    const today = getTodayDateKey();
    return localStorage.getItem(`lucy_oracle_seen_${uid}_${today}`) === "true";
  } catch {
    return false;
  }
}

export const isHistoryEntryFromToday = isTimestampToday;

export function isPlaceholderOracleDiagnosis(res: any): boolean {
  if (!res) return true;
  const text = res.analysis || res.advice || res.text || "";
  return text.trim().length === 0;
}

export function clearDailyOracleRunLocks(uid: string): void {
  try {
    const today = getTodayDateKey();
    localStorage.removeItem(`limit_daily_trinity_${uid}_${today}`);
    localStorage.removeItem(`trinity_daily_result_${uid}_${today}`);
    localStorage.removeItem(`limit_daily_orange_${uid}_${today}`);
    localStorage.removeItem(`limit_daily_heal_${uid}_${today}`);
    localStorage.removeItem(`limit_daily_muse_${uid}_${today}`);
    localStorage.removeItem(getDailyAutoRanKey("trinity", uid));
    localStorage.removeItem(getDailyAutoRanKey("orange", uid));
    localStorage.removeItem(getDailyAutoRanKey("heal", uid));
    localStorage.removeItem(getDailyAutoRanKey("muse", uid));
  } catch (e) {
    console.error("Error clearing daily run locks:", e);
  }
}

export function getDailyLockKey(appType: string, uid: string): string {
  return `limit_daily_${appType}_${uid}_${getTodayDateKey()}`;
}

export const clearStaleDailyLocks = clearDailyOracleRunLocks;


