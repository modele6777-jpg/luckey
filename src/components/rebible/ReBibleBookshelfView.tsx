import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  BookMarked,
  Layers,
  LayoutList,
  Calendar
} from 'lucide-react';
import { ReBibleVerse, REBIBLE_CANONICAL_BOOKS } from '../../types/rebible';
import { ReBibleVerseCard } from './ReBibleVerseCard';

interface ReBibleBookshelfViewProps {
  verses: ReBibleVerse[];
  onToggleFavorite: (id: string) => void;
  onAddAnnotation: (verse: ReBibleVerse) => void;
  onDeleteAnnotation?: (verseId: string, annotationId: string) => void;
}

const BOOK_ICONS: Record<string, string> = {
  '지혜의 서': '✨',
  '성찰의 서': '🍊',
  '운명의 서': '🔮',
  '치유의 서': '🌿',
  '정화의 서': '🕊️',
  '영감의 서': '🎨',
  '각성의 서': '📖',
  '평온의 서': '🍃',
  '통합의 서': '🌟'
};

export const ReBibleBookshelfView: React.FC<ReBibleBookshelfViewProps> = ({
  verses,
  onToggleFavorite,
  onAddAnnotation,
  onDeleteAnnotation
}) => {
  const groupedBooks = React.useMemo(() => {
    const map: Record<string, ReBibleVerse[]> = {};
    verses.forEach((v) => {
      const b = v.bookTitle || '지혜의 서';
      if (!map[b]) map[b] = [];
      map[b].push(v);
    });
    return map;
  }, [verses]);

  const bookNames = React.useMemo(() => {
    return Object.keys(groupedBooks).sort((a, b) => {
      const idxA = REBIBLE_CANONICAL_BOOKS.indexOf(a as any);
      const idxB = REBIBLE_CANONICAL_BOOKS.indexOf(b as any);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [groupedBooks]);

  const ALL_BOOKS_KEY = '전권 서재 (전체)';

  // Active book selection: defaults to ALL_BOOKS_KEY or first book
  const [activeBook, setActiveBook] = useState<string>(ALL_BOOKS_KEY);
  // Current verse index per book for swipe carousel
  const [bookVerseIndices, setBookVerseIndices] = useState<Record<string, number>>({});
  // Swipe mode removed — always use list view

  // Sync activeBook if current active book is not in bookNames
  React.useEffect(() => {
    if (activeBook !== ALL_BOOKS_KEY && bookNames.length > 0 && !bookNames.includes(activeBook)) {
      setActiveBook(ALL_BOOKS_KEY);
    }
  }, [bookNames, activeBook]);

  const isAllBooks = activeBook === ALL_BOOKS_KEY;
  const currentBookVerses = isAllBooks ? verses : (groupedBooks[activeBook] || []);
  const currentVerseIndex = Math.min(
    bookVerseIndices[activeBook] || 0,
    Math.max(0, currentBookVerses.length - 1)
  );

  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      setBookVerseIndices((prev) => ({
        ...prev,
        [activeBook]: currentVerseIndex - 1
      }));
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < currentBookVerses.length - 1) {
      setBookVerseIndices((prev) => ({
        ...prev,
        [activeBook]: currentVerseIndex + 1
      }));
    }
  };


  if (bookNames.length === 0) {
    return (
      <div className="text-center py-16 px-4 space-y-3 rounded-2xl border border-dashed border-[#DFCDB2] bg-[#F9F5EC]/60">
        <BookOpen size={36} className="mx-auto text-[#854D0E]/60" />
        <h3 className="font-serif text-base font-bold text-stone-800">
          아직 서재에 보관된 경전이 없습니다
        </h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto">
          프리즘 앱(타로, 정화, 세도나 명상, 루시와의 대화)을 이용하시면 당신의 여정이 실시간으로 자동 기록되어 이곳에 보존됩니다.
        </p>
      </div>
    );
  }

  const currentVerse = currentBookVerses[currentVerseIndex];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bookshelf Shelf Tab Bar */}
      <div className="rounded-3xl border border-[#D8C7A9] bg-[#F8F3E8] p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Book Selection Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {/* All Books Full Shelf Button */}
            <button
              onClick={() => setActiveBook(ALL_BOOKS_KEY)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-serif font-bold transition whitespace-nowrap flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                activeBook === ALL_BOOKS_KEY
                  ? 'bg-[#4A321F] text-[#FAF5EB] shadow-xs ring-2 ring-amber-400/50'
                  : 'bg-[#FCFAF5] hover:bg-[#EFE6D4] text-stone-800 border border-[#DFCDB2]'
              }`}
            >
              <span>📚</span>
              <span>전권 서재 (전체)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeBook === ALL_BOOKS_KEY ? 'bg-amber-400 text-stone-900' : 'bg-[#EADDC6] text-[#4A321F]'
              }`}>
                {verses.length}
              </span>
            </button>

            {bookNames.map((bName) => {
              const count = groupedBooks[bName].length;
              const isSelected = activeBook === bName;
              return (
                <button
                  key={bName}
                  onClick={() => setActiveBook(bName)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-serif font-bold transition whitespace-nowrap flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                    isSelected
                      ? 'bg-[#4A321F] text-[#FAF5EB] shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-[#FCFAF5] hover:bg-[#EFE6D4] text-stone-800 border border-[#DFCDB2]'
                  }`}
                >
                  <span>{BOOK_ICONS[bName] || '📖'}</span>
                  <span>{bName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-amber-400 text-stone-900' : 'bg-[#EADDC6] text-[#4A321F]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode controls removed — list-only */}
          <div className="flex items-center justify-end gap-1.5">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700">전체 목록 보기</span>
          </div>
        </div>
      </div>

      {/* Main Bookshelf Area */}

        <div className="space-y-6">
          <div className="px-2 font-serif font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-between border-b border-[#DFCDB2] pb-2">
            <span>
              {isAllBooks ? '📚 리바이블 전권 서재 (전체 수록 목록)' : `《${activeBook}》 서재`}
            </span>
            <span className="text-xs text-[#854D0E] font-bold">
              총 {currentBookVerses.length}편의 경전 기록
            </span>
          </div>

          {isAllBooks ? (
            /* Render all books with categorized section headers */
            <div className="space-y-8">
              {bookNames.map((bName) => {
                const bookVersesList = groupedBooks[bName] || [];
                if (bookVersesList.length === 0) return null;
                return (
                  <div key={bName} className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EFE6D4] border border-[#DFCDB2] text-xs font-serif font-bold text-[#4A321F]">
                      <span>{BOOK_ICONS[bName] || '📖'}</span>
                      <span>《{bName}》</span>
                      <span className="text-[10px] font-sans text-stone-600">({bookVersesList.length}편)</span>
                    </div>
                    <div className="space-y-4">
                      {bookVersesList.map((verse) => (
                        <ReBibleVerseCard
                          key={verse.id}
                          verse={verse}
                          onToggleFavorite={onToggleFavorite}
                          onAddAnnotation={onAddAnnotation}
                          onDeleteAnnotation={onDeleteAnnotation}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Single Book List */
            <div className="space-y-4">
              {currentBookVerses.map((verse) => (
                <ReBibleVerseCard
                  key={verse.id}
                  verse={verse}
                  onToggleFavorite={onToggleFavorite}
                  onAddAnnotation={onAddAnnotation}
                  onDeleteAnnotation={onDeleteAnnotation}
                />
              ))}
            </div>
          )}
        </div>
      
    </div>
  );
};
