import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  onDateSelect: (date: Date | null) => void;
  selectedDate: Date | null;
  highlightDates: Date[]; // Dates that have records
  color?: string; // Theme color
}

export function CalendarView({ onDateSelect, selectedDate, highlightDates, color = '#fbbf24' }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Fill previous month padding
    const firstDayIndex = date.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Fill actual days
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  }, [currentMonth]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return selectedDate && 
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const hasRecord = (date: Date) => {
    return highlightDates.some(d => {
      if (!d || isNaN(d.getTime())) return false;
      return d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear();
    });
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="glass border border-white/5 rounded-3xl p-4 w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
          <CalendarIcon size={12} />
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`weekday-${i}`} className="text-[9px] font-bold text-white/20 text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, i) => (
          <div key={date ? `date-${date.toISOString()}` : `empty-${i}`} className="aspect-square flex items-center justify-center p-0.5">
            {date ? (
              <button
                onClick={() => isSelected(date) ? onDateSelect(null) : onDateSelect(date)}
                className={`w-full h-full rounded-xl text-[10px] relative transition-all flex items-center justify-center
                  ${isSelected(date) ? 'bg-white/10 text-white font-bold' : 'text-white/40 hover:bg-white/5'}
                  ${isToday(date) ? 'border border-white/10' : ''}
                `}
                style={isSelected(date) ? { color: color, borderColor: `${color}40` } : {}}
              >
                {date.getDate()}
                {hasRecord(date) && (
                  <div 
                    className="absolute bottom-1 w-0.5 h-0.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
              </button>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        ))}
      </div>
      
      {selectedDate && (
        <motion.button
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onDateSelect(null)}
          className="mt-3 w-full py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors"
        >
          Clear Filter
        </motion.button>
      )}
    </div>
  );
}
