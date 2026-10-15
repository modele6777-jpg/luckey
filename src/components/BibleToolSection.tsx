import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TTSHighlightText } from '@/utils/ttsHighlight';

export interface BibleToolSectionProps {
  title: string;
  subtitle: string;
  icon: any;
  principles: string[];
  steps: string[];
  color: string;
  textColor: string;
  bgColor: string;
  onSelectStep: (step: string) => void;
}

export const BibleToolSection: React.FC<BibleToolSectionProps> = ({ title, subtitle, icon: Icon, principles, steps, color, textColor, bgColor, onSelectStep }) => {
  return (
    <div className={cn("flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6 lg:p-10 rounded-3xl sm:rounded-[36px] lg:rounded-[48px] bg-white/5 border transition-all relative overflow-hidden group hover:shadow-2xl", color, `hover:bg-white/[0.02]`)}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none opacity-50" />
      
      <div className="lg:w-1/3 relative z-10 flex flex-col gap-4 sm:gap-6">
        <div className={cn("w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] flex items-center justify-center bg-white/10 shadow-xl border border-white/10 shrink-0", textColor)}>
          <Icon className="w-7 h-7 sm:w-10 sm:h-10" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white tracking-tight break-keep">{title}</h3>
          <p className={cn("text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1.5 sm:mt-3 opacity-80", textColor)}>{subtitle}</p>
        </div>
      </div>
      
      <div className="lg:w-2/3 flex flex-col gap-6 sm:gap-8 lg:gap-10 relative z-10 lg:pl-10 lg:border-l border-white/10">
        <div className="space-y-3 sm:space-y-4">
          <h4 className={cn("text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2.5", textColor)}>
            <div className={cn("w-1 h-3.5 sm:h-4 rounded-full", bgColor, "shadow-[0_0_10px_currentColor]")} /> Core Principles
          </h4>
          <div className="space-y-2.5 sm:space-y-3">
            {principles.map((p, i) => (
              <div key={i} className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-sans break-keep break-words">
                <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0 opacity-80", bgColor)} />
                <span className="flex-1 min-w-0">
                  <TTSHighlightText text={p} />
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <h4 className={cn("text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2.5", textColor)}>
             <div className={cn("w-1 h-3.5 sm:h-4 rounded-full", bgColor, "shadow-[0_0_10px_currentColor]")} /> Action Steps
          </h4>
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => onSelectStep(s)}
                className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-5 min-h-[48px] bg-white/5 border border-white/10 rounded-2xl sm:rounded-[24px] text-left hover:border-white/30 hover:bg-white/10 transition-all group/btn active:scale-[0.99] cursor-pointer"
              >
                <span className="text-sm sm:text-base text-white/90 font-medium break-keep break-words pr-2">{s}</span>
                <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/5 group-hover/btn:bg-white/20 transition-all shrink-0", textColor)}>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-60 group-hover/btn:opacity-100 transition-all -translate-x-0.5 group-hover/btn:translate-x-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
