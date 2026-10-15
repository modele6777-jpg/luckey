import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Star, 
  Filter, 
  RotateCcw, 
  BookOpen, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Layers, 
  CalendarDays, 
  ArrowRight, 
  History,
  BookMarked
} from 'lucide-react';
import { ReBibleVerse, REBIBLE_CANONICAL_BOOKS } from '../../types/rebible';
import { getLocalDateKey, getVerseDateKey } from '../../lib/rebibleStorage';
import { ReBibleVerseCard } from './ReBibleVerseCard';

interface ReBibleTimelineViewProps {
  verses: ReBibleVerse[];
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  onOpenCalendar: () => void;
  onToggleFavorite: (id: string) => void;
  onAddAnnotation: (verse: ReBibleVerse) => void;
  onDeleteAnnotation: (verseId: string, annotationId: string) => void;
}

const BOOK_THEMES: Record<string, { icon: string; subtitle: string; bgBadge: string; textBadge: string; borderColor: string; gradientBg: string; accentColor: string }> = {
  '지혜의 서': {
    icon: '✨',
    subtitle: '루시와의 영혼 문답 · 5대 지능 올인원 상담',
    bgBadge: 'bg-yellow-500/15',
    textBadge: 'text-amber-950',
    borderColor: 'border-yellow-400/80',
    gradientBg: 'from-yellow-50/90 via-[#FCFAF5] to-amber-50/50',
    accentColor: '#A16207'
  },
  '성찰의 서': {
    icon: '🍊',
    subtitle: '감정 연금술 · 별에게 소원빌기 · 제1원칙 전략 성찰',
    bgBadge: 'bg-amber-500/15',
    textBadge: 'text-amber-900',
    borderColor: 'border-amber-300/70',
    gradientBg: 'from-amber-50/80 via-[#FCFAF5] to-amber-50/40',
    accentColor: '#B45309'
  },
  '운명의 서': {
    icon: '🔮',
    subtitle: '타로 스프레드 · 사주 원국 · 점성 계시',
    bgBadge: 'bg-purple-500/15',
    textBadge: 'text-purple-900',
    borderColor: 'border-purple-300/70',
    gradientBg: 'from-purple-50/80 via-[#FCFAF5] to-purple-50/40',
    accentColor: '#7E22CE'
  },
  '치유의 서': {
    icon: '🌿',
    subtitle: '1분 호흡 명상 · 세도나 방하착 · 생체 조율',
    bgBadge: 'bg-emerald-500/15',
    textBadge: 'text-emerald-900',
    borderColor: 'border-emerald-300/70',
    gradientBg: 'from-emerald-50/80 via-[#FCFAF5] to-emerald-50/40',
    accentColor: '#047857'
  },
  '정화의 서': {
    icon: '🕊️',
    subtitle: '호오포노포노 정화 의식 · 파랑새의 비밀쪽지',
    bgBadge: 'bg-sky-500/15',
    textBadge: 'text-sky-900',
    borderColor: 'border-sky-300/70',
    gradientBg: 'from-sky-50/80 via-[#FCFAF5] to-sky-50/40',
    accentColor: '#0369A1'
  },
  '영감의 서': {
    icon: '🎨',
    subtitle: '오늘의 예술 추천 · 오디오 도슨트 · 창작 영감',
    bgBadge: 'bg-rose-500/15',
    textBadge: 'text-rose-900',
    borderColor: 'border-rose-300/70',
    gradientBg: 'from-rose-50/80 via-[#FCFAF5] to-rose-50/40',
    accentColor: '#BE123C'
  },
  '각성의 서': {
    icon: '📖',
    subtitle: '일상의 영적 자각 및 실천 여정',
    bgBadge: 'bg-stone-500/15',
    textBadge: 'text-stone-900',
    borderColor: 'border-stone-300/70',
    gradientBg: 'from-stone-100/80 via-[#FCFAF5] to-stone-50/40',
    accentColor: '#44403C'
  }
};

export const ReBibleTimelineView: React.FC<ReBibleTimelineViewProps> = ({
  verses,
  selectedDateStr,
  onSelectDate,
  onOpenCalendar,
  onToggleFavorite,
  onAddAnnotation,
  onDeleteAnnotation
}) => {
  const [selectedEmotionFilter, setSelectedEmotionFilter] = useState<string | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // All unique dates from verses (YYYY-MM-DD), sorted newest first
  const allRecordDates = useMemo(() => {
    const set = new Set<string>();
    verses.forEach((v) => {
      set.add(getVerseDateKey(v));
    });
    // Add today if not present
    const today = getLocalDateKey();
    set.add(today);
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [verses]);

  // Extract all unique emotions and tags from verses
  const { allEmotions, allTags } = useMemo(() => {
    const emSet = new Set<string>();
    const tgSet = new Set<string>();
    verses.forEach((v) => {
      v.emotions?.forEach((e) => emSet.add(e));
      v.tags?.forEach((t) => tgSet.add(t));
    });
    return {
      allEmotions: Array.from(emSet),
      allTags: Array.from(tgSet)
    };
  }, [verses]);

  // Milestone verses calculation for selectedDateStr (1개월, 3개월, 1년, 3년 전 기록)
  const milestoneVersesForDate = useMemo(() => {
    if (!selectedDateStr) return [];
    const targetDate = new Date(selectedDateStr);
    if (isNaN(targetDate.getTime())) return [];

    const results: Array<{
      verse: ReBibleVerse;
      label: string;
      horizonName: string;
      diffYearsOrMonths: string;
    }> = [];

    verses.forEach((v) => {
      if (!v.recordedAt) return;
      const vDate = new Date(v.recordedAt);
      if (isNaN(vDate.getTime())) return;
      const vDateStr = getVerseDateKey(v);
      if (vDateStr === selectedDateStr) return; // Same day entries are already in the main list

      // Helper to check same month & day or exact offset
      const checkDiff = (target: Date, orig: Date) => {
        const yDiff = target.getFullYear() - orig.getFullYear();
        const mDiff = (target.getFullYear() - orig.getFullYear()) * 12 + (target.getMonth() - orig.getMonth());
        const isSameDayOfMonth = target.getDate() === orig.getDate();

        if (yDiff === 3 && target.getMonth() === orig.getMonth() && isSameDayOfMonth) {
          return { label: '3년 전 오늘', horizonName: '3년 후의 나', diffYearsOrMonths: '3년 전' };
        }
        if (yDiff === 1 && target.getMonth() === orig.getMonth() && isSameDayOfMonth) {
          return { label: '1년 전 오늘', horizonName: '1년 후의 성찰', diffYearsOrMonths: '1년 전' };
        }
        if (mDiff === 3 && isSameDayOfMonth) {
          return { label: '3개월 전 오늘', horizonName: '3개월 후의 통찰', diffYearsOrMonths: '3개월 전' };
        }
        if (mDiff === 1 && isSameDayOfMonth) {
          return { label: '1개월 전 오늘', horizonName: '1개월 후의 성찰', diffYearsOrMonths: '1개월 전' };
        }
        return null;
      };

      const match = checkDiff(targetDate, vDate);
      if (match) {
        results.push({
          verse: v,
          label: match.label,
          horizonName: match.horizonName,
          diffYearsOrMonths: match.diffYearsOrMonths
        });
      }
    });

    return results;
  }, [verses, selectedDateStr]);

  // Current page verses strictly for selectedDateStr
  const displayedVerses = useMemo(() => {
    return verses.filter((v) => {
      if (getVerseDateKey(v) !== selectedDateStr) {
        return false;
      }
      if (onlyFavorites && !v.isSacredFavorite) return false;
      if (selectedEmotionFilter && !v.emotions?.includes(selectedEmotionFilter)) return false;
      if (selectedTagFilter && !v.tags?.includes(selectedTagFilter)) return false;
      return true;
    });
  }, [verses, selectedDateStr, onlyFavorites, selectedEmotionFilter, selectedTagFilter]);

  // Group displayed verses strictly by Book (서) category for clear section bundling & separation
  const groupedVersesByBook = useMemo(() => {
    const map = new Map<string, ReBibleVerse[]>();
    displayedVerses.forEach((v) => {
      const b = v.bookTitle || '지혜의 서';
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(v);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => {
        const idxA = REBIBLE_CANONICAL_BOOKS.indexOf(a as any);
        const idxB = REBIBLE_CANONICAL_BOOKS.indexOf(b as any);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      })
      .map(([bookTitle, bookVerses]) => ({
        bookTitle,
        bookVerses,
        theme: BOOK_THEMES[bookTitle] || {
          icon: '📖',
          subtitle: '인생 여정 및 영적 성찰',
          bgBadge: 'bg-stone-500/15',
          textBadge: 'text-stone-900',
          borderColor: 'border-stone-300/70',
          gradientBg: 'from-[#FAF5EB] to-[#F5EFE0]',
          accentColor: '#854D0E'
        }
      }));
  }, [displayedVerses]);

  // Pagination navigation helpers
  const currentDateIndex = allRecordDates.indexOf(selectedDateStr);
  const hasPrevDate = currentDateIndex < allRecordDates.length - 1; // Older date
  const hasNextDate = currentDateIndex > 0; // Newer date

  const handleGoToPrevDate = () => {
    if (hasPrevDate) {
      onSelectDate(allRecordDates[currentDateIndex + 1]);
    }
  };

  const handleGoToNextDate = () => {
    if (hasNextDate) {
      onSelectDate(allRecordDates[currentDateIndex - 1]);
    }
  };

  const formattedSelectedDate = useMemo(() => {
    const d = new Date(selectedDateStr);
    if (isNaN(d.getTime())) return selectedDateStr;
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  }, [selectedDateStr]);

  const todayStr = getLocalDateKey();
  const isToday = selectedDateStr === todayStr;

  const hasActiveFilters = onlyFavorites || !!selectedEmotionFilter || !!selectedTagFilter;

  const resetFilters = () => {
    setOnlyFavorites(false);
    setSelectedEmotionFilter(null);
    setSelectedTagFilter(null);
  };

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Date-by-Date Page Navigator Bar */}
      <div className="rounded-3xl border border-[#D8C7A9] bg-[#F8F3E8] p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Prev Date Button (Older Page) */}
          <button
            onClick={handleGoToPrevDate}
            disabled={!hasPrevDate}
            className={`px-3 py-2 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
              hasPrevDate
                ? 'bg-[#FCFAF5] border-[#DFCDB2] text-[#4A321F] hover:bg-[#EFE6D4] active:scale-95'
                : 'bg-transparent border-transparent text-stone-300 cursor-not-allowed opacity-40'
            }`}
            title="이전 기록 일자 (이전 페이지)"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">이전 일자</span>
          </button>

          {/* Current Date Display Card (Clicking opens calendar) */}
          <button
            onClick={onOpenCalendar}
            className="flex-1 flex items-center justify-center gap-2.5 px-4 py-2 rounded-2xl bg-[#FCFAF5] hover:bg-[#F3EBDB] border border-[#DFCDB2] shadow-2xs transition active:scale-[0.99] group cursor-pointer"
            title="달력 열기 및 일자 조회"
          >
            <CalendarDays size={18} className="text-[#854D0E] group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <div className="font-serif font-black text-xs sm:text-sm text-stone-950 flex items-center justify-center gap-1.5">
                <span>{formattedSelectedDate}</span>
                {isToday && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#854D0E] text-white">
                    오늘
                  </span>
                )}
              </div>
              <div className="text-[10px] text-stone-600 font-mono flex items-center justify-center gap-1.5 flex-wrap">
                <span className="font-bold text-amber-900">
                  총 {displayedVerses.length}편의 여정 (서재 {groupedVersesByBook.length}개 분야 분류)
                </span>
                {milestoneVersesForDate.length > 0 && (
                  <span className="text-amber-700 font-bold">• 성찰 시점 {milestoneVersesForDate.length}건 도래</span>
                )}
                <span className="text-[10px] text-[#854D0E] font-sans underline hidden sm:inline">
                  (달력 변경)
                </span>
              </div>
            </div>
          </button>

          {/* Next Date Button (Newer Page) */}
          <button
            onClick={handleGoToNextDate}
            disabled={!hasNextDate}
            className={`px-3 py-2 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
              hasNextDate
                ? 'bg-[#FCFAF5] border-[#DFCDB2] text-[#4A321F] hover:bg-[#EFE6D4] active:scale-95'
                : 'bg-transparent border-transparent text-stone-300 cursor-not-allowed opacity-40'
            }`}
            title="다음 기록 일자 (다음 페이지)"
          >
            <span className="hidden sm:inline">다음 일자</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Filter Pill Bar */}
      <div className="p-3 rounded-2xl border border-[#E3D6BE] bg-[#F7F2E6]/90 flex flex-wrap items-center gap-2 text-xs shadow-2xs">
        <div className="flex items-center gap-1 font-bold text-[#854D0E] mr-1 text-[11px]">
          <Filter size={12} />
          <span>분류:</span>
        </div>

        {/* Favorites only */}
        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 border cursor-pointer ${
            onlyFavorites
              ? 'bg-[#4A321F] text-[#FAF5EB] border-[#4A321F] font-bold'
              : 'bg-[#FCFAF5] border-[#DFCDB2] text-stone-700 hover:bg-[#EFE6D4]'
          }`}
        >
          <Star size={11} className={onlyFavorites ? 'fill-amber-400 text-amber-400' : ''} />
          <span>황금구절만</span>
        </button>

        {/* Emotion Pills */}
        {allEmotions.slice(0, 4).map((emotion) => {
          const isSelected = selectedEmotionFilter === emotion;
          return (
            <button
              key={emotion}
              onClick={() => setSelectedEmotionFilter(isSelected ? null : emotion)}
              className={`px-2.5 py-1 rounded-xl transition text-[11px] border cursor-pointer ${
                isSelected
                  ? 'bg-[#854D0E] text-white border-[#854D0E] font-bold'
                  : 'bg-[#FCFAF5] border-[#DFCDB2] text-stone-700 hover:bg-[#EFE6D4]'
              }`}
            >
              #{emotion}
            </button>
          );
        })}

        {/* Tag Pills */}
        {allTags.slice(0, 4).map((tag) => {
          const isSelected = selectedTagFilter === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(isSelected ? null : tag)}
              className={`px-2 py-1 rounded-xl transition text-[11px] border cursor-pointer ${
                isSelected
                  ? 'bg-[#854D0E] text-white border-[#854D0E] font-bold'
                  : 'bg-[#FCFAF5] border-[#DFCDB2] text-stone-600 hover:bg-[#EFE6D4]'
              }`}
            >
              🏷️ {tag}
            </button>
          );
        })}

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto text-[11px] font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#EFE6D4] transition cursor-pointer"
          >
            <RotateCcw size={11} />
            <span>초기화</span>
          </button>
        )}
      </div>

      {/* Special Section: Milestone Reflection Arrival (성찰 시점 도래한 과거 기록 - 3년 후의 나 등) */}
      {milestoneVersesForDate.length > 0 && (
        <div className="rounded-3xl border-2 border-[#D8C29D] bg-gradient-to-br from-[#FDF9F0] via-[#F7EFE1] to-[#F2E7D3] p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E3D4B9] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Clock size={16} />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>시간을 건너온 성찰 시점 도래</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-2xs">
                    Q&A 3년 다이어리
                  </span>
                </h3>
                <p className="text-xs text-stone-600">
                  과거 같은 날 기록되었던 구절이 오늘의 성찰 시점에 도달했습니다
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {milestoneVersesForDate.map(({ verse, label, horizonName }) => (
              <div key={`milestone-${verse.id}`} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#854D0E] bg-[#EFE3CA] px-3 py-1.5 rounded-xl border border-[#D8C49E]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="fill-[#854D0E]" />
                    <span>⏳ {label}의 기록 ({verse.reference} 《{verse.title}》) ➔ '{horizonName}' 작성 시점!</span>
                  </span>
                  <span className="text-[11px] font-mono text-stone-600">
                    원문: {new Date(verse.recordedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <ReBibleVerseCard
                  verse={verse}
                  onToggleFavorite={onToggleFavorite}
                  onAddAnnotation={onAddAnnotation}
                  onDeleteAnnotation={onDeleteAnnotation}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Day Verses Grouped by Book Sections */}
      {groupedVersesByBook.length === 0 && milestoneVersesForDate.length === 0 ? (
        <div className="text-center py-16 px-4 space-y-3 rounded-2xl border border-dashed border-[#DFCDB2] bg-[#F9F5EC]/60">
          <BookOpen size={36} className="mx-auto text-[#854D0E]/60" />
          <h3 className="font-serif text-base font-bold text-stone-800">
            {formattedSelectedDate}에 기록된 경전이 없습니다
          </h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            달력 버튼을 눌러 기록이 있는 다른 일자를 선택하거나 이전/다음 일자 페이지로 이동해 보세요.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={onOpenCalendar}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4A321F] text-[#FAF5EB] hover:bg-[#382515] transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar size={13} />
              <span>달력에서 기록일 찾기</span>
            </button>
            {hasPrevDate && (
              <button
                onClick={handleGoToPrevDate}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[#DFCDB2] bg-[#FCFAF5] text-stone-800 hover:bg-[#EFE6D4] transition cursor-pointer"
              >
                최근 기록일로 이동
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">
          {groupedVersesByBook.map(({ bookTitle, bookVerses, theme }) => (
            <section
              key={`book-section-${bookTitle}`}
              className={`rounded-3xl border-2 ${theme.borderColor} bg-gradient-to-b ${theme.gradientBg} p-4 sm:p-6 shadow-sm space-y-4 relative overflow-hidden transition-all duration-300`}
            >
              {/* Sacred Book Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#4A321F] text-[#FAF5EB] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    {theme.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-black text-base sm:text-lg text-stone-950 tracking-tight">
                        {bookTitle}
                      </h3>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${theme.bgBadge} ${theme.textBadge} border border-black/10 shadow-2xs`}>
                        {bookVerses.length}편의 여정 수록
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-sans">
                      {theme.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-stone-500 self-start sm:self-center font-semibold bg-white/70 px-2.5 py-1 rounded-xl border border-black/5">
                  총 {bookVerses.length}절 수록
                </div>
              </div>

              {/* Sub-Verses under this Book */}
              <div className="space-y-4">
                {bookVerses.map((verse) => (
                  <ReBibleVerseCard
                    key={verse.id}
                    verse={verse}
                    onToggleFavorite={onToggleFavorite}
                    onAddAnnotation={onAddAnnotation}
                    onDeleteAnnotation={onDeleteAnnotation}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
