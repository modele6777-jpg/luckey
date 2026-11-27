import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { type PageGuide, type PageGuideSection } from '@/lib/pageGuides';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

/** 📘 Simple guide dialog (사용 가이드 / 활용 팁 두 탭). */
export function PageGuideDialog({ guide, onClose }: { guide: PageGuide; onClose: () => void }) {
  const [section, setSection] = useState<PageGuideSection>('guide');
  const close = onClose;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const switchSection = (next: PageGuideSection) => {
    if (next !== section) setSection(next);
  };

  return (
    <ScreenPortal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]" onClick={close}>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`page-guide-title-${guide.id}`}
          data-page-guide={guide.id}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={event => event.stopPropagation()}
          className="flex w-full max-w-[400px] max-h-[calc(var(--overlay-height,100dvh)-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl"
          style={{ colorScheme: 'light' }}
        >
          <div className="flex shrink-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><BookOpen size={20} /></span>
            <div className="min-w-0 flex-1">
              <h2 id={`page-guide-title-${guide.id}`} className="text-base font-black text-slate-900">{guide.title}</h2>
              <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600 break-keep">{guide.intro}</p>
            </div>
            <button type="button" onClick={close} aria-label="가이드 닫기" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"><X size={18} /></button>
          </div>

          <div className="mt-3.5 grid shrink-0 grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="가이드 보기">
            {([['guide', '📖', '사용 가이드'], ['tips', '💡', '활용 팁'], ['uses', '🎯', '추천 활용']] as const).map(([id, icon, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={section === id}
                data-page-guide-section={id}
                onClick={() => switchSection(id)}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[12px] font-bold whitespace-nowrap transition-colors ${section === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              ><span className="text-base leading-none" aria-hidden="true">{icon}</span>{label}</button>
            ))}
          </div>

          {section === 'guide' ? (
            <ol className="-mx-1 mt-3.5 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-1" data-page-guide-steps>
              {guide.steps.map((step, index) => (
                <li key={index} className="flex gap-3 rounded-2xl bg-slate-50 px-3.5 py-2.5">
                  <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-slate-950">{index + 1}</span>
                  <span className="text-[13.5px] leading-relaxed text-slate-700 break-keep">{step}</span>
                </li>
              ))}
            </ol>
          ) : section === 'uses' ? (
            <ul className="-mx-1 mt-3.5 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-1" data-page-guide-uses>
              {guide.uses.map((use, index) => (
                <li key={index} className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2.5">
                  <span className="text-lg leading-none" aria-hidden="true">{use.icon}</span>
                  <span className="min-w-0 break-keep">
                    <span className="block text-[13px] font-bold leading-snug text-slate-900">{use.when}</span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-slate-700">→ {use.how}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="-mx-1 mt-3.5 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-1" data-page-guide-tips>
              {guide.tips.map((tip, index) => (
                <li key={index} className="flex gap-3 rounded-2xl bg-amber-50/70 px-3.5 py-2.5">
                  <span className="text-lg leading-none" aria-hidden="true">{tip.icon}</span>
                  <span className="text-[13.5px] leading-relaxed text-slate-700 break-keep">{tip.text}</span>
                </li>
              ))}
            </ul>
          )}

          <button type="button" onClick={close} className="mt-3 shrink-0 rounded-full border border-slate-200 py-2.5 text-sm font-bold text-slate-700 active:scale-95">확인</button>
        </motion.div>
      </div>
    </ScreenPortal>
  );
}

/** Round "가이드" button for page headers (top right). */
export function PageGuideButton({ guide, resolve, tone = 'dark', className = '', unboxed = false }: { guide: PageGuide; resolve?: () => PageGuide; tone?: 'dark' | 'light'; className?: string; unboxed?: boolean }) {
  // 누르는 순간 지금 화면(dApp)에 맞는 가이드를 고른다.
  const [openGuide, setOpenGuide] = useState<PageGuide | null>(null);
  return (
    <>
      <button
        type="button"
        data-page-guide-button={guide.id}
        aria-label={`${guide.title} 가이드 열기`}
        title="가이드"
        onClick={() => { triggerHaptic('whitehole'); setOpenGuide(resolve ? resolve() : guide); }}
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full active:scale-95 ${unboxed
          ? `${tone === 'light' ? 'text-slate-700' : 'text-white/90'} border-0 bg-transparent`
          : `border backdrop-blur-md ${tone === 'light'
            ? 'border-slate-300/80 bg-white/80 text-slate-700'
            : 'border-white/20 bg-white/10 text-white/90'}`} ${className}`}
      >
        <BookOpen size={15} aria-hidden="true" />
      </button>
      {openGuide && <PageGuideDialog guide={openGuide} onClose={() => setOpenGuide(null)} />}
    </>
  );
}
