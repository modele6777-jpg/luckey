import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  BookMarked,
  CheckCircle2
} from 'lucide-react';
import { ReBibleVerse } from '../../types/rebible';
import { getLocalDateKey, getVerseDateKey } from '../../lib/rebibleStorage';

interface ReBibleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDateStr: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  verses: ReBibleVerse[];
}

export const ReBibleCalendarModal: React.FC<ReBibleCalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDateStr,
  onSelectDate,
  verses
}) => {
  // Parse initial year/month from selectedDateStr or current date
  const initialDate = useMemo(() => {
    if (selectedDateStr) {
      const d = new Date(selectedDateStr);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [selectedDateStr]);

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Map of dateStr (YYYY-MM-DD) -> list of verses recorded on that day
  const versesByDate = useMemo(() => {
    const map: Record<string, ReBibleVerse[]> = {};
    verses.forEach((v) => {
      const dStr = getVerseDateKey(v);
      if (!map[dStr]) map[dStr] = [];
      map[dStr].push(v);
    });
    return map;
  }, [verses]);

  // Check milestones (1 month, 3 months, 1 year, 3 years) for all verses
  const milestoneVersesByDate = useMemo(() => {
    const map: Record<string, { verse: ReBibleVerse; milestoneLabel: string }[]> = {};
    
    verses.forEach((v) => {
      if (!v.recordedAt) return;
      const orig = new Date(v.recordedAt);
      if (isNaN(orig.getTime())) return;

      const addMilestone = (months: number, years: number, label: string) => {
        const target = new Date(orig);
        if (years > 0) {
          target.setFullYear(target.getFullYear() + years);
        }
        if (months > 0) {
          target.setMonth(target.getMonth() + months);
        }
        const targetStr = getLocalDateKey(target);
        if (!map[targetStr]) map[targetStr] = [];
        map[targetStr].push({ verse: v, milestoneLabel: label });
      };

      addMilestone(1, 0, '1개월 후 성찰');
      addMilestone(3, 0, '3개월 후 통찰');
      addMilestone(0, 1, '1년 후 성찰');
      addMilestone(0, 3, '3년 후의 나');
    });

    return map;
  }, [verses]);

  // Today YYYY-MM-DD
  const todayStr = getLocalDateKey();

  // Navigate Months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    onSelectDate(todayStr);
  };

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{
      dayNum: number;
      dateStr: string;
      isCurrentMonth: boolean;
      versesCount: number;
      milestones: { verse: ReBibleVerse; milestoneLabel: string }[];
    }> = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDate - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        versesCount: versesByDate[dateStr]?.length || 0,
        milestones: milestoneVersesByDate[dateStr] || []
      });
    }

    // Current month days
    for (let d = 1; d <= lastDate; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: true,
        versesCount: versesByDate[dateStr]?.length || 0,
        milestones: milestoneVersesByDate[dateStr] || []
      });
    }

    // Next month padding to fill complete weeks (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      days.push({
        dayNum: n,
        dateStr,
        isCurrentMonth: false,
        versesCount: versesByDate[dateStr]?.length || 0,
        milestones: milestoneVersesByDate[dateStr] || []
      });
    }

    return days;
  }, [currentYear, currentMonth, versesByDate, milestoneVersesByDate]);

  if (!isOpen) return null;

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg flex flex-col rounded-3xl border border-[#D8C6A5] bg-[#FAF6EE] text-stone-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8DFC8] bg-[#F4EDE0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4A321F] text-[#FAF5EB] flex items-center justify-center font-bold shadow-xs">
              <CalendarIcon size={16} />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <span>경전 일자 달력</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EADDC6] text-[#3D2812] border border-[#D8C7A9]">
                  3-Year Chronicle
                </span>
              </h2>
              <p className="text-[11px] text-stone-600">
                기록이 있는 날과 1·3년 성찰 시점을 확인하고 이동합니다
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition hover:bg-[#EAE0CD] text-stone-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Month Navigation & Jump Buttons */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl border border-[#DFCDB2] bg-[#FCFAF5] hover:bg-[#EFE6D4] text-stone-700 transition active:scale-95"
                title="이전 달"
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 px-2 min-w-[120px] text-center">
                {currentYear}년 {currentMonth + 1}월
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl border border-[#DFCDB2] bg-[#FCFAF5] hover:bg-[#EFE6D4] text-stone-700 transition active:scale-95"
                title="다음 달"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleJumpToToday}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-[#D5C2A3] bg-[#FCFAF5] hover:bg-[#EFE6D4] text-stone-800 transition shadow-2xs"
              >
                오늘
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-stone-500 pb-1">
            {weekdays.map((w, idx) => (
              <div 
                key={w} 
                className={`py-1 ${idx === 0 ? 'text-rose-600' : idx === 6 ? 'text-blue-600' : ''}`}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, idx) => {
              const isSelected = cell.dateStr === selectedDateStr;
              const isToday = cell.dateStr === todayStr;
              const hasVerses = cell.versesCount > 0;
              const hasMilestone = cell.milestones.length > 0;

              return (
                <button
                  key={`${cell.dateStr}-${idx}`}
                  onClick={() => {
                    onSelectDate(cell.dateStr);
                    onClose();
                  }}
                  className={`relative min-h-[52px] sm:min-h-[58px] p-1.5 rounded-2xl flex flex-col items-center justify-between border transition-all text-xs active:scale-95 ${
                    isSelected
                      ? 'bg-[#4A321F] text-[#FAF5EB] border-[#4A321F] font-bold shadow-md ring-2 ring-[#854D0E]'
                      : isToday
                      ? 'bg-[#F2E7D3] border-[#C8B28D] text-stone-900 font-bold'
                      : cell.isCurrentMonth
                      ? 'bg-[#FCFAF5] border-[#E8DFC8] text-stone-800 hover:bg-[#F4ECE0]'
                      : 'bg-[#F7F2E6]/40 border-transparent text-stone-400 hover:bg-[#EFE6D4]/50'
                  }`}
                >
                  {/* Day Number */}
                  <span className={`text-[11px] sm:text-xs ${
                    isSelected 
                      ? 'text-white' 
                      : idx % 7 === 0 
                      ? 'text-rose-600' 
                      : idx % 7 === 6 
                      ? 'text-blue-600' 
                      : ''
                  }`}>
                    {cell.dayNum}
                  </span>

                  {/* Badges / Dots */}
                  <div className="flex items-center gap-1 mt-0.5">
                    {/* Verse Dot / Count */}
                    {hasVerses && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded-md font-bold flex items-center gap-0.5 ${
                          isSelected
                            ? 'bg-[#FAF5EB] text-[#4A321F]'
                            : 'bg-[#854D0E] text-white shadow-2xs'
                        }`}
                        title={`기록 ${cell.versesCount}편`}
                      >
                        <BookMarked size={8} />
                        <span>{cell.versesCount}</span>
                      </span>
                    )}

                    {/* Milestone indicator (e.g. 3년 후의 나 성찰 도래) */}
                    {hasMilestone && (
                      <span
                        className={`text-[9px] p-0.5 rounded-full ${
                          isSelected
                            ? 'bg-amber-300 text-[#4A321F]'
                            : 'bg-amber-600 text-white animate-pulse'
                        }`}
                        title={cell.milestones.map((m) => m.milestoneLabel).join(', ')}
                      >
                        <Clock size={9} />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend Guide */}
          <div className="pt-3 border-t border-[#E8DFC8] flex items-center justify-between text-[11px] text-stone-600">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#854D0E]" />
                <span>당일 기록 있음</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span>성찰 시점 도래 (1·3년)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-md bg-[#4A321F]" />
                <span>현재 선택된 날</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
