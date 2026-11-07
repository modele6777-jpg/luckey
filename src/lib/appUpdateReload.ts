/** One navigation per open page when an update reloads the running app. */

export const APP_UPDATE_RELOAD_KEY = 'luckey-update-viewport';

type StorageWriter = { setItem(key: string, value: string): void };
type StorageReader = { getItem(key: string): string | null; removeItem(key: string): void };

export function markAppUpdateReload(storage: StorageWriter | null | undefined): void {
  try {
    storage?.setItem(APP_UPDATE_RELOAD_KEY, '1');
  } catch {
    // Private mode can reject sessionStorage. The navigation-type fallback still runs.
  }
}

export function isAppUpdateReloadMarked(storage: { getItem(key: string): string | null } | null | undefined): boolean {
  try {
    return storage?.getItem(APP_UPDATE_RELOAD_KEY) === '1';
  } catch {
    return false;
  }
}

export function consumeAppUpdateReload(storage: StorageReader | null | undefined): boolean {
  if (!isAppUpdateReloadMarked(storage)) return false;
  try {
    storage?.removeItem(APP_UPDATE_RELOAD_KEY);
  } catch {
    // The mark was already observed.
  }
  return true;
}

export function createSingleFlight(action: () => void): () => void {
  let started = false;
  return () => {
    if (started) return;
    started = true;
    action();
  };
}

export function installSingleAppReload(win: Window): void {
  const location = win.location as Location & { reload: () => void };
  const original = location.reload.bind(location);
  const once = createSingleFlight(() => {
    markAppUpdateReload(win.sessionStorage);
    original();
  });
  try {
    location.reload = once;
  } catch {
    // Some webviews expose a non-writable Location.reload.
  }
}
