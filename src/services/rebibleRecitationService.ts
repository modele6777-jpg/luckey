import { playTTS, stopTTS } from '@/utils/tts';
import { acquireScreenWakeLock, releaseScreenWakeLock } from '@/lib/wakeLock';
import { ReBibleVerse } from '@/types/rebible';

export interface ReBibleRecitationState {
  isSpeaking: boolean;
  currentBookTitle: string;
  currentBookSubtitle: string;
  currentVerseRef: string;
  currentVerseTitle: string;
  currentIndex: number;
  totalCount: number;
  activeScriptText: string;
}

export type ReBibleRecitationListener = (state: ReBibleRecitationState) => void;

export const CANONICAL_BOOKS_ORDER: Record<string, { order: number; subtitle: string; icon: string }> = {
  '운명의 서': { order: 1, subtitle: '삶의 타이밍과 영적 이정표', icon: '🔮' },
  '정화의 서': { order: 2, subtitle: '내면의 기억을 비워낸 평온', icon: '🕊️' },
  '치유의 서': { order: 3, subtitle: '호흡과 방하착의 생명력', icon: '🌿' },
  '성찰의 서': { order: 4, subtitle: '혼란을 지혜로 바꾼 연금술', icon: '🍊' },
  '영감의 서': { order: 5, subtitle: '예술적 공명과 창조성', icon: '🎨' },
  '지혜의 서': { order: 6, subtitle: '루시와 나눈 영혼의 해답', icon: '✨' },
  '각성의 서': { order: 7, subtitle: '일상의 영적 자각과 현존', icon: '📖' },
  '통합의 서': { order: 8, subtitle: '삶의 전체성과 신성한 합일', icon: '🌌' }
};

function cleanScriptureText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[#*`_~[\]()]/g, ' ')
    .replace(/날짜:[^\s]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

class ReBibleRecitationService {
  private state: ReBibleRecitationState = {
    isSpeaking: false,
    currentBookTitle: '',
    currentBookSubtitle: '',
    currentVerseRef: '',
    currentVerseTitle: '',
    currentIndex: 0,
    totalCount: 0,
    activeScriptText: ''
  };

  private listeners: Set<ReBibleRecitationListener> = new Set();
  private playbackSessionId: string = '';

  public getState(): ReBibleRecitationState {
    return { ...this.state };
  }

  public subscribe(listener: ReBibleRecitationListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('[ReBibleRecitationService] listener error:', err);
      }
    });
  }

  public stopRecitation() {
    this.playbackSessionId = '';
    stopTTS();
    releaseScreenWakeLock().catch(() => {});

    this.state = {
      isSpeaking: false,
      currentBookTitle: '',
      currentBookSubtitle: '',
      currentVerseRef: '',
      currentVerseTitle: '',
      currentIndex: 0,
      totalCount: 0,
      activeScriptText: ''
    };
    this.notify();
  }

  public async toggleRecitation(verses: ReBibleVerse[]): Promise<void> {
    if (this.state.isSpeaking) {
      this.stopRecitation();
      return;
    }
    await this.startRecitation(verses);
  }

  public async startRecitation(verses: ReBibleVerse[]): Promise<void> {
    if (!verses || verses.length === 0) return;

    // Invalidate any previous playback session
    const sessionId = `rebible_recitation_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.playbackSessionId = sessionId;

    stopTTS();
    await acquireScreenWakeLock();

    // 1. Group target verses by Book (서재 분류)
    const bookMap = new Map<string, ReBibleVerse[]>();
    verses.forEach((v) => {
      const b = v.bookTitle || '지혜의 서';
      if (!bookMap.has(b)) bookMap.set(b, []);
      bookMap.get(b)!.push(v);
    });

    // 2. Sort Books by Canonical Scripture Order
    const orderedBooks = Array.from(bookMap.entries()).sort(([a], [b]) => {
      const orderA = CANONICAL_BOOKS_ORDER[a]?.order ?? 99;
      const orderB = CANONICAL_BOOKS_ORDER[b]?.order ?? 99;
      return orderA - orderB;
    });

    // 3. Within each Book, sort verses from OLDEST to NEWEST (오래된 순서부터)
    const preparedGroups = orderedBooks.map(([bookTitle, bVerses]) => {
      const sorted = [...bVerses].sort((a, b) => {
        const timeA = new Date(a.recordedAt || 0).getTime();
        const timeB = new Date(b.recordedAt || 0).getTime();
        if (timeA !== timeB) return timeA - timeB; // Oldest first
        return (a.verseNumber || 0) - (b.verseNumber || 0);
      });
      const meta = CANONICAL_BOOKS_ORDER[bookTitle] || {
        order: 99,
        subtitle: '인생 여정 및 영적 성찰',
        icon: '📖'
      };
      return { bookTitle, meta, verses: sorted };
    });

    const totalReciteCount = verses.length;
    let globalIndex = 0;

    this.state = {
      isSpeaking: true,
      currentBookTitle: '리바이블 인생 경전',
      currentBookSubtitle: '삶의 서사 집대성',
      currentVerseRef: '서문',
      currentVerseTitle: '성서 낭독 개시',
      currentIndex: 0,
      totalCount: totalReciteCount,
      activeScriptText: '낭독 준비 중...'
    };
    this.notify();

    try {
      // (1) Introductory Holy Annunciation
      const introScript = `삶의 인생 경전, 리바이블 성서 낭독을 시작합니다. 총 ${preparedGroups.length}권의 서와, ${totalReciteCount}편의 지혜를 오래된 말씀부터 차례대로 낭독합니다.`;
      this.state.activeScriptText = introScript;
      this.notify();
      await playTTS(introScript, 'Kore', true);

      if (this.playbackSessionId !== sessionId) return;

      // (2) Recite each Book and its verses in chronological sequence (성경 낭독 스타일)
      for (let bIdx = 0; bIdx < preparedGroups.length; bIdx++) {
        if (this.playbackSessionId !== sessionId) break;
        const group = preparedGroups[bIdx];

        // Book Header Announcement (e.g. "제 1권. 운명의 서. 삶의 타이밍과 영적 이정표. 총 2절의 말씀입니다.")
        const bookAnnounce = `제 ${bIdx + 1}권. ${group.bookTitle}. ${group.meta.subtitle}. 총 ${group.verses.length}절의 말씀입니다.`;
        this.state = {
          ...this.state,
          currentBookTitle: group.bookTitle,
          currentBookSubtitle: group.meta.subtitle,
          currentVerseRef: `제 ${bIdx + 1}권`,
          currentVerseTitle: group.meta.subtitle,
          currentIndex: globalIndex,
          activeScriptText: bookAnnounce
        };
        this.notify();
        await playTTS(bookAnnounce, 'Kore', true);

        if (this.playbackSessionId !== sessionId) break;

        // Verses within this book in chronological order
        for (let vIdx = 0; vIdx < group.verses.length; vIdx++) {
          if (this.playbackSessionId !== sessionId) break;
          globalIndex++;
          const v = group.verses[vIdx];

          const cleanFact = cleanScriptureText(v.fact);
          const cleanInsight = cleanScriptureText(v.insight);
          const cleanTitle = cleanScriptureText(v.title);
          const chapterNum = v.chapterNumber || 1;
          const verseNum = v.verseNumber || vIdx + 1;

          let dateAnnouncement = '';
          if (v.recordedAt) {
            const d = new Date(v.recordedAt);
            if (!isNaN(d.getTime())) {
              dateAnnouncement = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일의 기록.`;
            }
          }

          const verseScript = `제 ${chapterNum}장 ${verseNum}절. 《${cleanTitle}》. ${dateAnnouncement} 기록된 여정: ${cleanFact}. 루시의 관점, 지혜의 구절: ${cleanInsight}.`;

          this.state = {
            ...this.state,
            currentBookTitle: group.bookTitle,
            currentBookSubtitle: group.meta.subtitle,
            currentVerseRef: `${group.bookTitle} ${chapterNum}:${verseNum}`,
            currentVerseTitle: v.title,
            currentIndex: globalIndex,
            activeScriptText: verseScript
          };
          this.notify();

          await playTTS(verseScript, 'Kore', true);
        }
      }

      // (3) Concluding Blessing
      if (this.playbackSessionId === sessionId) {
        const outroScript = `이상으로 리바이블 인생 경전 낭독을 모두 마칩니다. 기록된 모든 여정이 당신의 삶에 평화와 빛이 되기를 축복합니다.`;
        this.state.activeScriptText = outroScript;
        this.notify();
        await playTTS(outroScript, 'Kore', true);
      }
    } catch (err) {
      console.warn('[ReBibleRecitationService] Recitation finished or interrupted:', err);
    } finally {
      if (this.playbackSessionId === sessionId) {
        this.stopRecitation();
      }
    }
  }
}

export const rebibleRecitationService = new ReBibleRecitationService();
