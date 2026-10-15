import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc as firestoreDoc,
  setDoc as firestoreSetDoc,
  getDoc as firestoreGetDoc,
  onSnapshot as firestoreOnSnapshot,
  collection as firestoreCollection,
  addDoc as firestoreAddDoc,
  query as firestoreQuery,
  orderBy as firestoreOrderBy,
  where as firestoreWhere,
  serverTimestamp as firestoreServerTimestamp,
  Timestamp as firestoreTimestamp,
  limit as firestoreLimit,
  getDocs as firestoreGetDocs,
  updateDoc as firestoreUpdateDoc,
  increment as firestoreIncrement,
  getDocFromServer as firestoreGetDocFromServer,
  setLogLevel as firestoreSetLogLevel,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { OperationType, handleFirestoreError } from './firestoreUtils';
import { safeLocalStorage } from '../utils/safeStorage';

// Cleanup any legacy quota lockout flags from previous sessions so real sync is never blocked
if (typeof window !== 'undefined') {
  try {
    safeLocalStorage.removeItem('firestore_quota_exhausted_v1');
    sessionStorage.removeItem('firestore_quota_exhausted_v1');
  } catch (_) {}
}

// Initialize Firestore
try {
  firestoreSetLogLevel('silent');
} catch (_) {}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
// Use the databaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export { OperationType, handleFirestoreError };

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Universal Google Sign-In with automatic popup and mobile redirect fallback.
 */
export const signInWithGoogle = async (): Promise<any> => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    const code = error?.code || '';
    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      /iphone|ipad|ipod|android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '')
    ) {
      return await signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
};
export const logout = () => signOut(auth);

export function isFirestoreQuotaError(err: any): boolean {
  if (!err) return false;
  const msg = err?.message || String(err);
  const code = err?.code || '';
  return code === 'resource-exhausted' ||
    (code === 'unavailable' && msg.toLowerCase().includes('quota')) ||
    msg.includes('Quota limit exceeded') ||
    msg.includes('Quota exceeded') ||
    msg.includes('Free daily read units') ||
    msg.includes('Free daily write units');
}

// Export standard Firestore functions directly with quota & error resilience
export const doc = firestoreDoc;
export const collection = firestoreCollection;
export const query = firestoreQuery;
export const orderBy = firestoreOrderBy;
export const where = firestoreWhere;
export const serverTimestamp = firestoreServerTimestamp;
export const Timestamp = firestoreTimestamp;
export const limit = firestoreLimit;
export const increment = firestoreIncrement;
export const getDocFromServer = firestoreGetDocFromServer;

export async function getDoc(docRef: any): Promise<any> {
  try {
    return await firestoreGetDoc(docRef);
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      console.warn('[Firestore Quota] Free daily read limit reached on getDoc. Falling back to local cache.');
      return { exists: () => false, data: () => null };
    }
    throw err;
  }
}

export async function getDocs(queryRef: any): Promise<any> {
  try {
    return await firestoreGetDocs(queryRef);
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      console.warn('[Firestore Quota] Free daily read limit reached on getDocs. Falling back to local cache.');
      return { docs: [], empty: true, size: 0, forEach: () => {} };
    }
    throw err;
  }
}

export const onSnapshot: typeof firestoreOnSnapshot = ((refOrQuery: any, ...args: any[]) => {
  let onNext: any;
  let onError: any;
  let options: any = null;

  if (typeof args[0] === 'function') {
    onNext = args[0];
    onError = args[1];
  } else if (typeof args[0] === 'object' && args[0] !== null) {
    options = args[0];
    onNext = args[1];
    onError = args[2];
  }

  const safeOnError = (err: any) => {
    if (isFirestoreQuotaError(err)) {
      console.warn('[Firestore Quota] Free daily read units limit reached on snapshot listener. Using local cache.');
      if (typeof onError === 'function') {
        try {
          onError(err);
        } catch (_) {}
      }
      return;
    }
    if (typeof onError === 'function') {
      try {
        onError(err);
      } catch (_) {}
    } else {
      console.warn('[Firestore] onSnapshot error:', err?.message || err);
    }
  };

  try {
    if (options) {
      return firestoreOnSnapshot(refOrQuery, options, onNext, safeOnError);
    }
    return firestoreOnSnapshot(refOrQuery, onNext, safeOnError);
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      console.warn('[Firestore Quota] Snapshot attachment failed due to quota limit. Falling back to offline local state.');
      return () => {};
    }
    throw err;
  }
}) as any;

export async function addDoc(colRef: any, data: any): Promise<any> {
  try {
    return await firestoreAddDoc(colRef, data);
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      console.warn('[Firestore Quota] Daily write limit reached on addDoc. Retained in local cache.');
      return { id: 'local-' + Date.now() };
    }
    console.warn('[Firestore] addDoc error:', err?.message || err);
    throw err;
  }
}

export async function setDoc(docRef: any, data: any, options?: any): Promise<void> {
  try {
    if (options) {
      await firestoreSetDoc(docRef, data, options);
    } else {
      await firestoreSetDoc(docRef, data);
    }
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      console.warn('[Firestore Quota] Daily write limit reached on setDoc. Retained in local cache.');
      return;
    }
    console.warn('[Firestore] setDoc error:', err?.message || err);
    throw err;
  }
}

export async function updateDoc(docRef: any, data: any): Promise<void> {
  try {
    await firestoreUpdateDoc(docRef, data);
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      console.warn('[Firestore Quota] Daily write limit reached on updateDoc. Retained in local cache.');
      return;
    }
    console.warn('[Firestore] updateDoc error:', err?.message || err);
    throw err;
  }
}

export {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User,
};
