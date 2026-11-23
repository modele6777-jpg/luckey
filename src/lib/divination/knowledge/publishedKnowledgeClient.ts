import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { clearApprovedKnowledgeSnapshot, setApprovedKnowledgeSnapshot } from './approvedCardsStore';

/** Approved cards only; the Firestore rules separately deny every draft/version collection to clients. */
export function startPublishedKnowledgeSync(): () => void {
  if (typeof window === 'undefined') return () => {};
  let stopSnapshot: (() => void) | null = null;
  const stopAuth = onAuthStateChanged(auth, (user) => {
    stopSnapshot?.();
    stopSnapshot = null;
    clearApprovedKnowledgeSnapshot();
    if (!user) return;
    const cardsQuery = query(collection(db, 'lucyKnowledgePublished'), limit(500));
    stopSnapshot = onSnapshot(cardsQuery, (snapshot) => {
      setApprovedKnowledgeSnapshot(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    }, (error) => {
      console.warn('[LucyKnowledge] Approved knowledge unavailable; continuing with built-in cards only.', error?.code || error?.message || error);
      clearApprovedKnowledgeSnapshot();
    });
  });
  return () => {
    stopSnapshot?.();
    stopAuth();
    clearApprovedKnowledgeSnapshot();
  };
}
