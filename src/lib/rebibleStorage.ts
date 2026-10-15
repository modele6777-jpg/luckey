import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  query
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { safeLocalStorage } from '../utils/safeStorage';
import { getPairedVaultId, pushToPairedVault } from './serverSyncClient';
import { ReBibleVerse, ReBibleStats, REBIBLE_CANONICAL_BOOKS, CanonicalReBibleBook } from '../types/rebible';

const LOCAL_STORAGE_KEY = 'prism_rebible_verses_v2';
const DELETED_KEYS_STORAGE_KEY = 'prism_rebible_deleted_verse_keys_v1';
const LEGACY_STORAGE_KEYS = ['prism_rebible_verses', 'rebible_verses'];

// 영구 삭제 대상 일자 (8월 29일)
export const PURGED_REBIBLE_DATES = ['2026-08-29'];

/**
 * 사용자가 명시적으로 삭제한 구절 ID 및 서재 키를 영구 추적하여 자동 재생성을 방지합니다.
 */
export function getDeletedVerseKeys(): Set<string> {
  const set = new Set<string>();

  // 8월 29일 모든 서재 키 영구 블랙리스트 등록
  PURGED_REBIBLE_DATES.forEach((date) => {
    set.add(date);
    REBIBLE_CANONICAL_BOOKS.forEach((b) => {
      set.add(`${date}_${b.trim()}`);
      set.add(`seed-${b}-${date}`);
      set.add(`verse-${date}-${b.replace(/\s+/g, '')}`);
    });
  });

  try {
    const raw = safeLocalStorage.getItem(DELETED_KEYS_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach((k) => set.add(k));
      }
    }
  } catch (_) {}
  return set;
}

export function markVerseKeyAsDeleted(verseId: string, dateKey?: string, bookTitle?: string): void {
  try {
    const set = getDeletedVerseKeys();
    set.add(verseId);
    if (dateKey && bookTitle) {
      set.add(`${dateKey}_${bookTitle.trim()}`);
    }
    safeLocalStorage.setItem(DELETED_KEYS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (_) {}
}

export function isVerseKeyDeleted(verseId: string, dateKey?: string, bookTitle?: string): boolean {
  if (dateKey && PURGED_REBIBLE_DATES.includes(dateKey)) return true;
  if (verseId && PURGED_REBIBLE_DATES.some((d) => verseId.includes(d))) return true;
  try {
    const set = getDeletedVerseKeys();
    if (set.has(verseId)) return true;
    if (dateKey && bookTitle && set.has(`${dateKey}_${bookTitle.trim()}`)) return true;
  } catch (_) {}
  return false;
}

/**
 * 사용자 로컬 시간대 기준 YYYY-MM-DD 키를 반환합니다. (UTC 변환으로 인한 어제 날짜 오차 원천 방지)
 */
export function getLocalDateKey(dateInput?: string | number | Date): string {
  if (!dateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 구절 객체에서 로컬 날짜 키(YYYY-MM-DD)를 안전하게 추출합니다.
 * (태그 '날짜:YYYY-MM-DD' 우선 검사 -> recordedAt 로컬 변환)
 */
export function getVerseDateKey(verse: { recordedAt?: string; tags?: string[] }): string {
  const tagDate = verse.tags?.find((t) => t.startsWith('날짜:'))?.replace('날짜:', '').trim();
  if (tagDate && /^\d{4}-\d{2}-\d{2}$/.test(tagDate)) {
    return tagDate;
  }
  if (verse.recordedAt) {
    return getLocalDateKey(verse.recordedAt);
  }
  return getLocalDateKey();
}

/**
 * 기록된 여정(Fact) 텍스트에서 불필요한 날짜 서두 (예: "2026년 8월 30일 일요일, ", "2026-08-30, " 등)를 정제합니다.
 */
export function cleanFactText(fact: string | undefined): string {
  if (!fact) return '';
  return fact
    .replace(/^\d{4}년\s*\d{1,2}월\s*\d{1,2}일\s*[월화수목금토일]요일[,\s]*/, '')
    .replace(/^\d{4}년\s*\d{1,2}월\s*\d{1,2}일[,\s]*/, '')
    .replace(/^\d{4}-\d{2}-\d{2}[,\s]*/, '')
    .trim();
}

/**
 * 특정 구절이 자정(00:00)을 지나 영구 확정(봉헌 완료)된 경전인지 판별합니다.
 * - verseDateKey < 오늘 로컬 날짜(todayKey) 이거나, verse.isFinalized === true 인 경우 확정됨.
 */
export function isVerseFinalized(verse: ReBibleVerse, todayKey: string = getLocalDateKey()): boolean {
  if (verse.isFinalized) return true;
  const verseDate = getVerseDateKey(verse);
  return verseDate < todayKey;
}

/**
 * 과거 일자의 구절들을 자정 확정(isFinalized = true) 상태로 안전하게 봉인합니다.
 */
export function sealMidnightVerses(verses: ReBibleVerse[], todayKey: string = getLocalDateKey()): {
  sealedVerses: ReBibleVerse[];
  hasChanges: boolean;
} {
  let hasChanges = false;
  const sealedVerses = verses.map((v) => {
    const isPast = getVerseDateKey(v) < todayKey;
    if (isPast && !v.isFinalized) {
      hasChanges = true;
      return {
        ...v,
        isFinalized: true,
        finalizedAt: v.finalizedAt || new Date().toISOString()
      };
    }
    return v;
  });

  return { sealedVerses, hasChanges };
}

/**
 * 7개의 성스러운 서 기본 정경 초기 데이터 (각 서별 1개씩 총 7개)
 */
export function getInitialCleanVerses(dateKey?: string): ReBibleVerse[] {
  const targetDateKey = dateKey || getLocalDateKey();
  const nowIso = new Date().toISOString();

  return [
    {
      id: `seed-wisdom-${targetDateKey}`,
      bookTitle: '지혜의 서',
      chapterNumber: 1,
      verseNumber: 1,
      reference: '지혜의 서 1:1',
      title: '루시와 나눈 영혼의 대화와 조율',
      fact: '루시와의 5대 지능 올인원 상담을 통해 내면의 참된 질문을 마주하고 심도 있는 문답을 나눔. 외부의 소음에 휘둘리지 않고 내적 직관과 명쾌한 해결책을 확립함.',
      insight: '모든 답은 이미 당신의 내면에 존재하며, 질문하는 순간 우주는 온 힘을 다해 응답합니다. 5대 지능의 거울을 통해 나 자신을 온전히 마주할 때 거룩한 지혜의 성전이 완성됩니다.',
      emotions: ['통합', '자각', '사랑', '충만'],
      tags: ['루시', '영혼대화', '지혜의서', `날짜:${targetDateKey}`],
      annotations: [],
      isSacredFavorite: true,
      recordedAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: `seed-contemplation-${targetDateKey}`,
      bookTitle: '성찰의 서',
      chapterNumber: 1,
      verseNumber: 1,
      reference: '성찰의 서 1:1',
      title: '감정 연금술과 본질적 의사결정',
      fact: '오렌지 비밀의 방에서 불안의 감정을 제1원칙으로 분석하여 본질을 규명하고, 밤하늘 별에게 참된 소망을 띄우며 흔들리지 않는 내면의 중심과 결단력을 확립함.',
      insight: '삶의 혼란은 지혜를 제련하는 연금술의 도가니입니다. 두려움이라는 납을 확신이라는 황금으로 바꾸는 비결은 본질로 파고드는 데 있습니다. 별에 띄운 소망은 이미 현실로 피어날 준비를 마쳤습니다.',
      emotions: ['명료함', '통찰', '연금술', '확신'],
      tags: ['오렌지', '감정연금술', '성찰의서', `날짜:${targetDateKey}`],
      annotations: [],
      isSacredFavorite: true,
      recordedAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: `seed-destiny-${targetDateKey}`,
      bookTitle: '운명의 서',
      chapterNumber: 1,
      verseNumber: 1,
      reference: '운명의 서 1:1',
      title: '하늘의 타이밍과 영적 나침반',
      fact: '트리니티 타로와 오라클 리딩을 통해 삶의 보이지 않는 질서와 가능성을 마주하고, 조급한 계산을 내려놓으며 우주의 타이밍을 온전히 신뢰하는 내면의 나침반을 세움.',
      insight: '운명의 수레바퀴는 당신을 속박하기 위해 돌지 않으며, 더 큰 성장과 영적 자유의 문을 열어주기 위해 움직입니다. 하늘의 타이밍을 온전히 신뢰하십시오.',
      emotions: ['직관', '수용', '용기', '신뢰'],
      tags: ['트리니티', '타로리딩', '운명의서', `날짜:${targetDateKey}`],
      annotations: [],
      isSacredFavorite: true,
      recordedAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: `seed-healing-${targetDateKey}`,
      bookTitle: '치유의 서',
      chapterNumber: 1,
      verseNumber: 1,
      reference: '치유의 서 1:1',
      title: '1분 호흡과 방하착으로 되찾은 생명력',
      fact: '아우라 1분 호흡 명상과 세도나 방하착을 통해 몸과 마음에 쌓인 긴장을 내려놓음. "지금 이 순간 숨을 쉬며 완전한 조화를 누린다"는 확언과 함께 생체 에너지를 맑게 조율함.',
      insight: '육체와 마음의 긴장은 결과를 쥐고 있으려는 통제욕에서 비롯됩니다. 숨을 깊이 내쉬며 손을 펴고 흐름에 맡길 때, 몸과 마음은 본래의 완전한 조화로 스스로 치유됩니다.',
      emotions: ['치유', '이완', '생명력', '안식'],
      tags: ['아우라', '1분명상', '치유의서', `날짜:${targetDateKey}`],
      annotations: [],
      isSacredFavorite: true,
      recordedAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: `seed-purification-${targetDateKey}`,
      bookTitle: '정화의 서',
      chapterNumber: 1,
      verseNumber: 1,
      reference: '정화의 서 1:1',
      title: '모든 기억을 비워낸 내면의 평온',
      fact: '블루버드 호오포노포노 정화 의식과 파랑새 비밀쪽지를 통해 마음속 갈등과 낡은 기억의 잔재를 비워냄. "미안합니다, 용서하세요, 고맙습니다, 사랑합니다"의 4가지 진언을 새기며 맑고 순수한 백지의 평온을 회복함.',
      insight: '모든 고통과 갈등은 내 잠재의식 속에 재생되는 낡은 기억의 투사일 뿐입니다. "미안합니다, 용서하세요, 고맙습니다, 사랑합니다"의 정화 파동을 통해 내면을 비워낼 때 본래의 순수한 사랑과 평온이 회복됩니다.',
      emotions: ['정화', '용서', '해방', '평온'],
      tags: ['블루버드', '호오포노포노', '정화의서', `날짜:${targetDateKey}`],
      annotations: [],
      isSacredFavorite: true,
      recordedAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: `seed-inspiration-${targetDateKey}`,
      bookTitle: '영감의 서',
      chapterNumber: 1,
      verseNumber: 1,
      reference: '영감의 서 1:1',
      title: '예술적 공명과 창조성의 불꽃',
      fact: '뮤즈 명작 예술 도슨트와 영감 카드를 감상하며 빛과 색채의 찰나적 아름다움에 몰입함. 일상을 하나의 거룩한 작품으로 바라보는 창조적 시선과 감사의 파동을 충전함.',
      insight: '아름다움은 영혼이 신성을 기억해내는 가장 순수한 통로입니다. 예술과 음악이 전하는 숭고한 전율은 굳어 있던 가슴을 열고 잠든 창의성을 깨웁니다. 당신의 삶 자체가 위대한 예술 작품입니다.',
      emotions: ['영감', '환희', '창조', '경이'],
      tags: ['뮤즈', '예술추천', '영감의서', `날짜:${targetDateKey}`],
      annotations: [],
      isSacredFavorite: true,
      recordedAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: `seed-awakening-${targetDateKey}`,
      bookTitle: '각성의 서',
      chapterNumber: 1,
      verseNumber: 1,
      reference: '각성의 서 1:1',
      title: '일상의 영적 자각과 현존의 기쁨',
      fact: '프리즘 에코시스템 전반(운명·정화·치유·성찰·영감·지혜)을 조화롭게 순례하며 오늘의 라이프 바이탈과 소울 바이브를 정돈하고, 깨어 있는 현존의 기쁨을 삶의 중심에 온전히 뿌리내림.',
      insight: '매 순간 일어나는 모든 경험은 영혼의 각성을 위해 준비된 신성한 배움입니다. 사소해 보이는 일상의 한 걸음 속에서도 삶의 깊은 진실을 발견할 수 있습니다. 현존하는 지금 이 순간이 가장 큰 은총입니다.',
      emotions: ['각성', '현존', '감사', '성장'],
      tags: ['프리즘', '통합여정', '각성의서', `날짜:${targetDateKey}`],
      annotations: [],
      isSacredFavorite: true,
      recordedAt: nowIso,
      updatedAt: nowIso
    }
  ];
}

export const DEFAULT_SACRED_VERSES: ReBibleVerse[] = getInitialCleanVerses();

/**
 * 7개의 서에 하루에 기록 하나씩만 나오도록 중복을 제거하고 정제하는 함수
 * (Invariant: 1 Verse per Book per Date)
 */
export function deduplicateVersesByBookAndDate(verses: ReBibleVerse[]): ReBibleVerse[] {
  if (!Array.isArray(verses) || verses.length === 0) {
    return [];
  }

  const seenMap = new Map<string, ReBibleVerse>();

  // 최신 기록부터 역순 검사하여 가장 최신의 1편만 유지
  const sorted = [...verses].sort(
    (a, b) => new Date(b.updatedAt || b.recordedAt || 0).getTime() - new Date(a.updatedAt || a.recordedAt || 0).getTime()
  );

  sorted.forEach((v) => {
    const dateKey = getVerseDateKey(v);
    const bookTitle = (v.bookTitle || '지혜의 서').trim();
    const uniqueKey = `${dateKey}_${bookTitle}`;

    if (!seenMap.has(uniqueKey)) {
      seenMap.set(uniqueKey, {
        ...v,
        fact: cleanFactText(v.fact),
        reference: `${bookTitle} 1:1`,
        chapterNumber: 1,
        verseNumber: 1
      });
    }
  });

  return Array.from(seenMap.values()).sort(
    (a, b) => new Date(b.recordedAt || 0).getTime() - new Date(a.recordedAt || 0).getTime()
  );
}

/**
 * 리바이블의 모든 기존 기록을 깨끗하게 삭제하고 초기화합니다.
 */
export async function clearAllReBibleVerses(): Promise<ReBibleVerse[]> {
  try {
    safeLocalStorage.removeItem(LOCAL_STORAGE_KEY);
    safeLocalStorage.removeItem(DELETED_KEYS_STORAGE_KEY);
    LEGACY_STORAGE_KEYS.forEach((k) => safeLocalStorage.removeItem(k));
  } catch (e) {
    console.warn('LocalStorage clear error:', e);
  }

  const activeUid = auth.currentUser?.uid || (typeof window !== 'undefined' ? (localStorage.getItem('prism_auth_uid') || sessionStorage.getItem('prism_auth_uid')) : null);
  if (activeUid) {
    try {
      const versesCol = collection(db, 'rebible_verses', activeUid, 'verses');
      const snap = await getDocs(query(versesCol));
      const deletePromises = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
    } catch (e) {
      console.warn('Firestore verses bulk delete error:', e);
    }
  }

  const freshSeed = getInitialCleanVerses();
  saveLocalVerses(freshSeed);

  if (activeUid) {
    freshSeed.forEach((v) => saveVerseToFirestore(v).catch(() => {}));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rebible-verses-updated', { detail: freshSeed }));
  }

  return freshSeed;
}

export function getLocalVerses(): ReBibleVerse[] {
  try {
    const raw = safeLocalStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw === null) {
      const initial = getInitialCleanVerses();
      safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const deletedKeys = getDeletedVerseKeys();
      const filtered = parsed.filter((v) => {
        const vDate = getVerseDateKey(v);
        if (PURGED_REBIBLE_DATES.includes(vDate)) return false;
        if (v.recordedAt && PURGED_REBIBLE_DATES.some((d) => v.recordedAt.includes(d))) return false;
        if (v.id && PURGED_REBIBLE_DATES.some((d) => v.id.includes(d))) return false;
        return !deletedKeys.has(v.id) && !deletedKeys.has(`${vDate}_${(v.bookTitle || '').trim()}`);
      });
      const cleaned = deduplicateVersesByBookAndDate(filtered);
      if (cleaned.length !== parsed.length) {
        safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    const initial = getInitialCleanVerses();
    safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (e) {
    console.error('Failed to load local Re:Bible verses:', e);
    return getInitialCleanVerses();
  }
}

export const loadLocalVerses = getLocalVerses;

export function saveLocalVerses(verses: ReBibleVerse[]): void {
  try {
    const deletedKeys = getDeletedVerseKeys();
    const filtered = verses.filter((v) => {
      const vDate = getVerseDateKey(v);
      if (PURGED_REBIBLE_DATES.includes(vDate)) return false;
      if (v.recordedAt && PURGED_REBIBLE_DATES.some((d) => v.recordedAt.includes(d))) return false;
      if (v.id && PURGED_REBIBLE_DATES.some((d) => v.id.includes(d))) return false;
      return !deletedKeys.has(v.id) && !deletedKeys.has(`${vDate}_${(v.bookTitle || '').trim()}`);
    });
    const cleaned = deduplicateVersesByBookAndDate(filtered);
    safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleaned));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rebible-verses-updated', { detail: cleaned }));
    }
    if (getPairedVaultId()) {
      void pushToPairedVault({ rebibleVerses: cleaned, clientUpdatedAt: Date.now() } as any).catch(() => {});
    }
  } catch (e) {
    console.error('Failed to save local Re:Bible verses:', e);
  }
}

export async function saveVerseToFirestore(verse: ReBibleVerse): Promise<void> {
  const vDate = getVerseDateKey(verse);
  if (PURGED_REBIBLE_DATES.includes(vDate) || (verse.recordedAt && PURGED_REBIBLE_DATES.some((d) => verse.recordedAt.includes(d))) || (verse.id && PURGED_REBIBLE_DATES.some((d) => verse.id.includes(d)))) {
    return;
  }
  const activeUid = auth.currentUser?.uid || (typeof window !== 'undefined' ? (localStorage.getItem('prism_auth_uid') || sessionStorage.getItem('prism_auth_uid')) : null);
  if (!activeUid) return;
  try {
    const verseRef = doc(db, 'rebible_verses', activeUid, 'verses', verse.id);
    await setDoc(verseRef, {
      ...verse,
      userId: activeUid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore verse sync error (saved locally):', e);
  }
}

export async function deleteVerseFromFirestore(verseOrId: ReBibleVerse | string): Promise<void> {
  const verseId = typeof verseOrId === 'string' ? verseOrId : verseOrId.id;
  const dateKey = typeof verseOrId !== 'string' ? getVerseDateKey(verseOrId) : undefined;
  const bookTitle = typeof verseOrId !== 'string' ? verseOrId.bookTitle : undefined;

  markVerseKeyAsDeleted(verseId, dateKey, bookTitle);

  const activeUid = auth.currentUser?.uid || (typeof window !== 'undefined' ? (localStorage.getItem('prism_auth_uid') || sessionStorage.getItem('prism_auth_uid')) : null);
  if (!activeUid) return;
  try {
    const verseRef = doc(db, 'rebible_verses', activeUid, 'verses', verseId);
    await deleteDoc(verseRef);
  } catch (e) {
    console.warn('Firestore verse delete error:', e);
  }
}

export function subscribeToReBibleVerses(
  userId: string | undefined, 
  callback: (verses: ReBibleVerse[]) => void
): () => void {
  const localData = getLocalVerses();
  callback(localData);

  if (!userId) {
    return () => {};
  }

  try {
    const versesCol = collection(db, 'rebible_verses', userId, 'verses');
    const q = query(versesCol);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const deletedKeys = getDeletedVerseKeys();
        const cloudVerses: ReBibleVerse[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ReBibleVerse;
          const vDateKey = getVerseDateKey(data);
          const isPurged = PURGED_REBIBLE_DATES.includes(vDateKey) || 
                           docSnap.id.includes('2026-08-29') || 
                           (data.recordedAt && data.recordedAt.includes('2026-08-29'));
          
          if (isPurged) {
            deleteDoc(docSnap.ref).catch(() => {});
            return;
          }

          const isDeleted = deletedKeys.has(docSnap.id) || deletedKeys.has(`${vDateKey}_${(data.bookTitle || '').trim()}`);
          if (!isDeleted) {
            cloudVerses.push({
              ...data,
              id: docSnap.id,
              annotations: Array.isArray(data.annotations) ? data.annotations : []
            });
          }
        });

        const deduplicated = deduplicateVersesByBookAndDate(cloudVerses);
        saveLocalVerses(deduplicated);
        callback(deduplicated);
      }
    }, (error) => {
      console.warn('Re:Bible onSnapshot error (using local cache):', error);
      callback(getLocalVerses());
    });

    return unsubscribe;
  } catch (e) {
    console.warn('Error subscribing to Re:Bible Firestore:', e);
    return () => {};
  }
}

export function calculateReBibleStats(verses: ReBibleVerse[]): ReBibleStats {
  const totalVerses = verses.length;
  let totalAnnotations = 0;
  let favoriteCount = 0;
  const emotionMap: Record<string, number> = {};
  const tagMap: Record<string, number> = {};

  verses.forEach((v) => {
    if (v.isSacredFavorite) favoriteCount++;
    if (Array.isArray(v.annotations)) {
      totalAnnotations += v.annotations.length;
    }
    v.emotions?.forEach((em) => {
      if (em) emotionMap[em] = (emotionMap[em] || 0) + 1;
    });
    v.tags?.forEach((tg) => {
      if (tg) tagMap[tg] = (tagMap[tg] || 0) + 1;
    });
  });

  const topEmotions = Object.entries(emotionMap)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const topTags = Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    totalVerses,
    totalAnnotations,
    favoriteCount,
    topEmotions,
    topTags,
    transmutationRatio: totalVerses > 0 ? 100 : 0
  };
}

export function groupVersesByBook(verses: ReBibleVerse[]): Record<string, ReBibleVerse[]> {
  const grouped: Record<string, ReBibleVerse[]> = {};
  verses.forEach((v) => {
    const b = v.bookTitle || '지혜의 서';
    if (!grouped[b]) {
      grouped[b] = [];
    }
    grouped[b].push(v);
  });
  return grouped;
}

/**
 * 루시 상담 모드(수다, 마스터, 5대 특화 채널 및 다중 융합 모드)에 대응되는 리바이블 서재 목록을 반환합니다.
 * - 수다 모드 ('casual' | 'lucy' | 빈 배열): 지혜의 서
 * - 마스터 모드 ('master' | 5개 전체 풀가동): 각성의 서
 * - 오렌지 ('orange'): 성찰의 서
 * - 트리니티 ('trinity'): 운명의 서
 * - 아우라 ('aura' | 'heal'): 치유의 서
 * - 블루버드 ('bluebird'): 정화의 서
 * - 뮤즈 ('muse'): 영감의 서
 * - 다중 모드 (이중, 삼중 등): 선택된 모든 채널에 대응되는 서재들로 다중 분기
 */
export function resolveTargetBooksForLucyMode(
  modeOrChannels?: string | string[] | null
): CanonicalReBibleBook[] {
  if (!modeOrChannels) return ['지혜의 서'];

  const channelToBookMap: Record<string, CanonicalReBibleBook> = {
    lucy: '지혜의 서',
    casual: '지혜의 서',
    chat: '지혜의 서',
    master: '각성의 서',
    epilogue: '각성의 서',
    all: '각성의 서',
    orange: '성찰의 서',
    deepthink: '성찰의 서',
    trinity: '운명의 서',
    oracle: '운명의 서',
    aura: '치유의 서',
    heal: '치유의 서',
    vitality: '치유의 서',
    bluebird: '정화의 서',
    healing: '정화의 서',
    muse: '영감의 서',
    creative: '영감의 서'
  };

  if (typeof modeOrChannels === 'string') {
    const key = modeOrChannels.toLowerCase().trim();
    return [channelToBookMap[key] || '지혜의 서'];
  }

  if (Array.isArray(modeOrChannels)) {
    if (modeOrChannels.length === 0) {
      return ['지혜의 서']; // 💬 수다 모드
    }
    if (modeOrChannels.length >= 5) {
      return ['각성의 서']; // 👑 5대 올인원 PRO 마스터 모드
    }

    const booksSet = new Set<CanonicalReBibleBook>();
    modeOrChannels.forEach((ch) => {
      const key = String(ch).toLowerCase().trim();
      const mapped = channelToBookMap[key];
      if (mapped) {
        booksSet.add(mapped);
      }
    });

    if (booksSet.size === 0) {
      return ['지혜의 서'];
    }
    return Array.from(booksSet);
  }

  return ['지혜의 서'];
}

export interface ConsecrateResult {
  verses: ReBibleVerse[];
  primaryVerse: ReBibleVerse;
  referencesText: string;
  reference: string;
  title: string;
}

const BOOK_CONSECRATE_EMOTIONS: Record<CanonicalReBibleBook, string[]> = {
  '지혜의 서': ['통합', '자각', '사랑', '충만'],
  '성찰의 서': ['명료함', '통찰', '연금술', '확신'],
  '운명의 서': ['직관', '수용', '용기', '신뢰'],
  '치유의 서': ['치유', '이완', '생명력', '안식'],
  '정화의 서': ['정화', '용서', '해방', '평온'],
  '영감의 서': ['영감', '환희', '창조', '경이'],
  '각성의 서': ['각성', '현존', '감사', '성장']
};

/**
 * 문장 단위로 중복되거나 매우 유사한 내용을 필터링하고 고유 문장들만 유지하는 헬퍼
 */
function cleanAndDeduplicateSentences(sentences: string[]): string[] {
  const result: string[] = [];
  const seenFingerprints = new Set<string>();

  for (const raw of sentences) {
    const s = raw.trim();
    if (!s || s.length < 3) continue;

    // 공백 및 구두점 제거 후 앞 16자로 유사 중복 감지
    const fp = s.replace(/[\s\p{P}]/gu, '').slice(0, 16);
    if (seenFingerprints.has(fp)) continue;

    seenFingerprints.add(fp);
    result.push(s.endsWith('.') || s.endsWith('!') || s.endsWith('?') ? s : `${s}.`);
  }

  return result;
}

function buildDetailedConsecratedFact(
  bookTitle: CanonicalReBibleBook,
  cleanQuestion: string,
  coreInsightSummary: string
): string {
  const shortQuestion = cleanQuestion
    ? `"${cleanQuestion.slice(0, 100)}${cleanQuestion.length > 100 ? '...' : ''}"`
    : '삶의 방향성과 내면의 진실에 관한 물음';

  switch (bookTitle) {
    case '지혜의 서':
      return `루시와의 영혼 문답을 통해 ${shortQuestion}(이)라는 본질적 질문을 나눔. 5대 지능의 거울에 비추어 내적 중심을 점검하고, ${coreInsightSummary || '외부의 소음에 흔들리지 않는 내적 직관과 참된 지혜의 나침반을 명확히 확립함'}.`;

    case '성찰의 서':
      return `오렌지 감정 연금술과 제1원칙 전략 성찰을 통해 ${shortQuestion}의 본질적 핵을 분석함. 막연한 불안과 복잡한 생각을 1원칙의 명료한 논리로 규명하고, ${coreInsightSummary || '밤하늘 별에게 참된 소망을 띄우며 흔들림 없는 결단력과 실천 로드맵을 확립함'}.`;

    case '운명의 서':
      return `트리니티 사주 원국과 타로 오라클 리딩을 통해 ${shortQuestion}에 얽힌 삶의 보이지 않는 질서와 타이밍을 마주함. 조급한 계산을 내려놓고, ${coreInsightSummary || '하늘의 타이밍과 우주의 섭리를 온전히 신뢰하며 주도적인 영적 나침반을 세움'}.`;

    case '치유의 서':
      return `아우라 1분 호흡 명상과 세도나 방하착을 통해 ${shortQuestion}와 관련된 신체와 감정의 긴장을 부드럽게 이완함. 억지로 통제하려는 애씀을 깊은 숨으로 비워내고, ${coreInsightSummary || '자연스러운 생명력과 본래의 조화로운 생체 리듬을 온전히 회복함'}.`;

    case '정화의 서':
      return `블루버드 호오포노포노 정화 의식과 파랑새 비밀쪽지를 통해 ${shortQuestion}에 얽힌 잠재의식의 낡은 기억과 감정의 잔재를 마주함. "미안합니다, 용서하세요, 고맙습니다, 사랑합니다"의 4가지 진언을 새기며, ${coreInsightSummary || '모든 기억을 맑게 비워내고 순수한 백지의 평온을 회복함'}.`;

    case '영감의 서':
      return `뮤즈 명작 예술 도슨트와 창작 영감을 통해 ${shortQuestion}의 주제를 예술적 시선과 상상력으로 확장함. 일상의 찰나를 거룩한 작품으로 바라보며, ${coreInsightSummary || '가슴 뛰는 창조적 안목과 아름다움의 파동을 마음에 충전함'}.`;

    case '각성의 서':
    default:
      return `루시 올인원 PRO 마스터 풀가동을 통해 운명·성찰·치유·정화·영감의 5대 영역을 총망라하여 ${shortQuestion}를 심도 있게 진단함. 분절된 자아를 하나의 온전한 전체로 통합하고, ${coreInsightSummary || '깨어 있는 현존의 기쁨을 삶의 중심에 온전히 확립함'}.`;
  }
}

/**
 * 기존 '기록된 여정(fact)'과 새로운 루시 상담 내용을 자연스럽게 융합하고 중복 문장을 말끔히 제거합니다.
 */
function mergeAndDeduplicateFact(
  bookTitle: CanonicalReBibleBook,
  existingFact: string | undefined,
  cleanQuestion: string,
  coreInsightSummary: string
): string {
  const shortQuestion = cleanQuestion
    ? `"${cleanQuestion.slice(0, 100)}${cleanQuestion.length > 100 ? '...' : ''}"`
    : '';

  // 1. 기본 시드 구절이거나 비어 있는 경우 -> 새롭고 구체적인 단일 서사 생성
  const isDefaultSeed = !existingFact || 
    existingFact.includes('올인원 상담을 통해 내면의 참된 질문') || 
    existingFact.includes('기본 정경 초기 데이터') ||
    existingFact.includes('우주의 5대 지능과 첫 대화를 나누며') ||
    existingFact.includes('오늘 하루 나에게 주어진 모든 경험');

  if (isDefaultSeed) {
    return buildDetailedConsecratedFact(bookTitle, cleanQuestion, coreInsightSummary);
  }

  // 2. 기존 fact를 문장 단위로 분해 및 상투적 중복 마무리구 필터링
  const rawSentences = existingFact
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => {
      return s.length > 0 && 
        !s.includes('깨어 있는 현존의 기쁨을 삶의 중심에') &&
        !s.includes('외부의 소음에 흔들리지 않는 내적 직관') &&
        !s.includes('본래의 순수한 사랑과 평온') &&
        !s.includes('하늘의 타이밍과 우주의 섭리를 온전히');
    });

  // 3. 중복 질문 및 키워드 검사
  const existingCombined = rawSentences.join(' ');
  const isQuestionAlreadyPresent = shortQuestion && 
    existingCombined.includes(shortQuestion.replace(/["']/g, '').slice(0, 15));

  // 4. 서재별 고유한 대화 융합 문장 생성
  let dialogueSentence = '';
  if (shortQuestion && !isQuestionAlreadyPresent) {
    dialogueSentence = `이에 더해 루시와 ${shortQuestion}에 관해 심층 문답을 나누며, ${coreInsightSummary || '핵심 해법과 실천 지침을 정립함'}`;
  } else if (coreInsightSummary && !existingCombined.includes(coreInsightSummary.slice(0, 20))) {
    dialogueSentence = `루시와의 상담 가이드를 통해 ${coreInsightSummary}`;
  }

  // 5. 서재별 본질적 결단 및 수용 마무리 문장
  let closureSentence = '';
  switch (bookTitle) {
    case '지혜의 서':
      closureSentence = '외부의 소음에 흔들리지 않는 내적 직관과 참된 지혜의 나침반을 확고히 세움.';
      break;
    case '성찰의 서':
      closureSentence = '1원칙의 명료한 논리로 흔들림 없는 결단력과 실천 로드맵을 확립함.';
      break;
    case '운명의 서':
      closureSentence = '우주의 타이밍과 보이지 않는 질서를 온전히 신뢰하며 주도적인 영적 중심을 확립함.';
      break;
    case '치유의 서':
      closureSentence = '통제하려는 애씀을 깊은 숨으로 비워내고 자연스러운 생명력과 본래의 조화를 회복함.';
      break;
    case '정화의 서':
      closureSentence = '잠재의식의 낡은 기억을 맑게 비워내고 순수한 백지의 평온을 온전히 회복함.';
      break;
    case '영감의 서':
      closureSentence = '일상의 찰나를 거룩한 작품으로 바라보는 창조적 안목과 감사의 파동을 마음에 충전함.';
      break;
    case '각성의 서':
    default:
      closureSentence = '분절된 자아를 온전한 전체로 통합하고 깨어 있는 현존의 기쁨을 삶의 중심에 확립함.';
      break;
  }

  const allSentences: string[] = [];
  if (rawSentences.length > 0) {
    allSentences.push(...rawSentences);
  }
  if (dialogueSentence) {
    allSentences.push(dialogueSentence.endsWith('.') ? dialogueSentence : `${dialogueSentence}.`);
  }
  allSentences.push(closureSentence);

  const deduplicated = cleanAndDeduplicateSentences(allSentences);
  return deduplicated.join(' ');
}

/**
 * 지혜의 구절(insight)의 마크다운 기호 및 중복 문장을 정돈하고 경전 규격으로 정제합니다.
 */
function mergeAndDeduplicateInsight(
  bookTitle: CanonicalReBibleBook,
  existingInsight: string | undefined,
  cleanContent: string
): string {
  const cleanNew = cleanContent
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\[EMOTION:[^\]]+\]/gi, '')
    .replace(/^[-*•]\s+/gm, '')
    .trim();

  const isDefaultSeed = !existingInsight || 
    existingInsight.includes('5대 지능의 거울을 통해 나 자신을 온전히 마주할 때') ||
    existingInsight.includes('오늘 하루 나에게 주어진 모든 경험은');

  if (isDefaultSeed || !cleanNew) {
    return cleanNew || `${bookTitle}의 본질적 계시와 지혜`;
  }

  const paragraphs = cleanNew.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const dedupedParagraphs = Array.from(new Set(paragraphs));

  return dedupedParagraphs.join('\n\n');
}

function buildConsecratedVerseTitle(
  bookTitle: CanonicalReBibleBook,
  cleanContent: string,
  contextQuestion?: string
): string {
  const lines = cleanContent.split('\n').map((l) => l.trim()).filter(Boolean);
  let candidate = '';
  for (const line of lines) {
    const cleaned = line.replace(/^[-*•1-9.)#\s]+/, '').trim();
    if (cleaned.length >= 4 && cleaned.length <= 32 && !cleaned.includes('http') && !cleaned.startsWith('안녕')) {
      candidate = cleaned;
      break;
    }
  }

  if (contextQuestion && contextQuestion.trim()) {
    const qClean = contextQuestion.trim().replace(/[?.,!]+$/, '');
    const shortQ = qClean.length > 16 ? qClean.slice(0, 14) + '...' : qClean;
    if (candidate) {
      return `[${shortQ}] ${candidate.slice(0, 20)}`;
    }
    return `[${shortQ}] ${bookTitle}의 본질적 계시`;
  }

  if (candidate) {
    return candidate;
  }

  const defaultTitles: Record<CanonicalReBibleBook, string> = {
    '지혜의 서': '루시와 나눈 영혼의 대화와 조율',
    '성찰의 서': '감정 연금술과 1원칙의 결단',
    '운명의 서': '하늘의 타이밍과 영적 나침반',
    '치유의 서': '1분 호흡과 방하착의 안식',
    '정화의 서': '모든 기억을 비워낸 내면의 평온',
    '영감의 서': '예술적 공명과 창조성의 불꽃',
    '각성의 서': '일상의 영적 자각과 현존의 기쁨'
  };

  return defaultTitles[bookTitle] || `${bookTitle}의 본질적 통찰`;
}

/**
 * 루시와의 채팅 메시지를 해당 모드(수다, 마스터, 단일/이중/삼중 특화 모드)에 맞는 서재(들)에 구절로 봉헌/갱신합니다.
 */
export function consecrateChatMessageToVerse(
  messageContent: string,
  contextQuestion?: string,
  modeOrChannels: string | string[] = 'lucy'
): ConsecrateResult {
  const currentVerses = loadLocalVerses();
  const todayDateKey = getLocalDateKey();
  
  const cleanContent = messageContent
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\[EMOTION:[^\]]+\]/gi, '')
    .trim();

  const paragraphs = cleanContent.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const coreInsightSummary = paragraphs.length > 0
    ? paragraphs[0].replace(/^[-*•1-9.)\s]+/, '').slice(0, 110)
    : '';

  const cleanQuestion = (contextQuestion || '').trim();
  const targetBooks = resolveTargetBooksForLucyMode(modeOrChannels);
  const nowIso = new Date().toISOString();

  const channelTag = Array.isArray(modeOrChannels)
    ? (modeOrChannels.length === 0 ? 'casual' : modeOrChannels.join('+'))
    : modeOrChannels;

  const createdVerses: ReBibleVerse[] = targetBooks.map((bookTitle) => {
    // 해당 서재의 오늘 기존 구절이 있다면 가져옴
    const existingVerse = currentVerses.find(
      (v) => getVerseDateKey(v) === todayDateKey && (v.bookTitle || '').trim() === bookTitle.trim()
    );

    const title = buildConsecratedVerseTitle(bookTitle, cleanContent, cleanQuestion);
    const fact = mergeAndDeduplicateFact(bookTitle, existingVerse?.fact, cleanQuestion, coreInsightSummary);
    const insight = mergeAndDeduplicateInsight(bookTitle, existingVerse?.insight, cleanContent);
    const emotions = BOOK_CONSECRATE_EMOTIONS[bookTitle] || ['깨달음', '평화', '자유', '빛'];

    return {
      id: existingVerse?.id || `verse-consecrated-${todayDateKey}-${bookTitle.replace(/\s+/g, '')}`,
      bookTitle,
      chapterNumber: 1,
      verseNumber: 1,
      reference: `${bookTitle} 1:1`,
      title,
      fact,
      insight,
      emotions,
      tags: [channelTag, '대화봉헌', '루시의지혜', 'Sync:Echo', `날짜:${todayDateKey}`],
      annotations: existingVerse?.annotations || [],
      isSacredFavorite: existingVerse?.isSacredFavorite ?? true,
      recordedAt: existingVerse?.recordedAt || nowIso,
      updatedAt: nowIso
    };
  });

  const targetBookTitles = new Set(targetBooks.map((b) => b.trim()));
  const updatedVerses = [
    ...createdVerses,
    ...currentVerses.filter((v) => {
      const isSameDate = getVerseDateKey(v) === todayDateKey;
      const isTargetBook = targetBookTitles.has((v.bookTitle || '').trim());
      const isReplacedId = createdVerses.some((cv) => cv.id === v.id);
      return !(isSameDate && isTargetBook) && !isReplacedId;
    })
  ];

  saveLocalVerses(updatedVerses);
  createdVerses.forEach((cv) => saveVerseToFirestore(cv));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rebible-verses-updated', { 
      detail: { createdVerses, totalCount: updatedVerses.length } 
    }));
  }

  const referencesText = createdVerses.map((cv) => `《${cv.bookTitle}》`).join(', ');
  const primaryVerse = createdVerses[0];

  return {
    verses: createdVerses,
    primaryVerse,
    referencesText,
    reference: primaryVerse.reference,
    title: primaryVerse.title
  };
}

/**
 * 리바이블의 모든 구절 풀(Pool)에서 지혜의 구절을 무작위 셔플하여 반환합니다.
 */
export function getDailyMannaVerse(verses: ReBibleVerse[], excludeId?: string): ReBibleVerse | null {
  const pool = (verses && verses.length > 0) ? verses : getInitialCleanVerses();
  const validVerses = pool.filter((v) => v.insight && v.insight.trim().length > 0);
  if (validVerses.length === 0) return null;

  if (validVerses.length === 1) return validVerses[0];

  let candidates = validVerses;
  if (excludeId) {
    const filtered = validVerses.filter((v) => v.id !== excludeId);
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
