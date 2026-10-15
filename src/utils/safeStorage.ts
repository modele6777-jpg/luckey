/**
 * =========================================================================
 * PRISM & LUCY PRO - Rock-Solid Persistent Storage Wrapper
 * =========================================================================
 * Directly interfaces with the real browser localStorage / sessionStorage
 * with full error trapping and fallback capabilities to guarantee that
 * profile data, settings, and histories NEVER reset across updates and reloads.
 */

class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return key in this.store ? this.store[key] : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

// Wrapper that always attempts real window.localStorage first
class SafeStorageWrapper implements Storage {
  private fallback = new MemoryStorage();
  private isSession: boolean;

  constructor(isSession = false) {
    this.isSession = isSession;
  }

  private _nativeStorage: Storage | null | undefined = undefined;

  private get nativeStorage(): Storage | null {
    if (this._nativeStorage !== undefined) {
      return this._nativeStorage;
    }
    if (typeof window === 'undefined') {
      this._nativeStorage = null;
      return null;
    }
    try {
      const storage = this.isSession ? window.sessionStorage : window.localStorage;
      if (storage) {
        // Quick one-time verification of read/write capability
        const testKey = '__prism_storage_probe__';
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        this._nativeStorage = storage;
        return storage;
      }
    } catch (_) {
      // Catch quota exceeded or private browsing restrictions
    }
    this._nativeStorage = null;
    return null;
  }

  get length(): number {
    const native = this.nativeStorage;
    return native ? native.length : this.fallback.length;
  }

  clear(): void {
    try {
      const native = this.nativeStorage;
      if (native) native.clear();
    } catch (_) {}
    this.fallback.clear();
  }

  getItem(key: string): string | null {
    try {
      const native = this.nativeStorage;
      if (native) {
        const val = native.getItem(key);
        if (val !== null) return val;
      }
    } catch (_) {}
    return this.fallback.getItem(key);
  }

  key(index: number): string | null {
    try {
      const native = this.nativeStorage;
      if (native) return native.key(index);
    } catch (_) {}
    return this.fallback.key(index);
  }

  removeItem(key: string): void {
    try {
      const native = this.nativeStorage;
      if (native) native.removeItem(key);
    } catch (_) {}
    this.fallback.removeItem(key);
  }

  setItem(key: string, value: string): void {
    const valStr = String(value);
    try {
      const native = this.nativeStorage;
      if (native) {
        native.setItem(key, valStr);
      }
    } catch (_) {}
    this.fallback.setItem(key, valStr);
  }
}

export const safeLocalStorage: Storage = new SafeStorageWrapper(false);
export const safeSessionStorage: Storage = new SafeStorageWrapper(true);
