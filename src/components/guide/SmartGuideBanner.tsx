/**
 * 🧭 스마트 가이드 배너 (+ 🔊 가이드 도슨트 표시·중지)
 *
 * 한 번 탭해 도착한 화면 위에 "지금 추천: ○○ / 왜 / 무엇을 하면 되는지"를 띄운다.
 * - 탭하면 닫히고, 3.5~4초 뒤 스스로 사라진다 (도슨트가 읽는 동안에는 읽기가 끝날 때까지 남는다).
 * - 도슨트가 읽는 중이면 🔴 표시와 중지 버튼이 함께 나온다.
 */
import { motion } from 'framer-motion';
import type { SmartGuideResult } from '@/lib/omniWarp/smartBigBangGuide';
import { stopGuideDouser, useGuideDouserActive } from '@/lib/omniWarp/guideDouser';

export function SmartGuideBanner({ guide, onClose }: { guide: SmartGuideResult; onClose: () => void }) {
  const douserActive = useGuideDouserActive();

  return (
    <div
      data-testid="bigbang-smart-guide"
      data-smart-guide-action={guide.action}
      data-smart-guide-path={guide.path}
      data-smart-guide-douser-active={douserActive ? 'true' : 'false'}
      role="status"
      aria-live="polite"
      onClick={onClose}
      className="fixed left-1/2 z-[9994] w-[min(92vw,420px)] -translate-x-1/2 pointer-events-auto"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + var(--duo-pane-header-height, 56px) + 6px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex items-start gap-2.5 rounded-2xl border border-cyan-300/25 bg-slate-950/88 px-3.5 py-3 text-left shadow-[0_12px_38px_rgba(8,47,73,0.55)] backdrop-blur-md"
      >
        <span className="mt-[2px] text-base leading-none" aria-hidden="true">{guide.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-cyan-100">🧭 지금 추천: {guide.title}</p>
          <p className="mt-0.5 text-[12px] leading-snug text-slate-200">{guide.reason}</p>
          <p className="mt-1 text-[11.5px] leading-snug text-cyan-200/85">{guide.ctaHint}</p>
          {douserActive && (
            <button
              type="button"
              data-smart-guide-douser-stop="true"
              onClick={(event) => { event.stopPropagation(); stopGuideDouser(); }}
              className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-100 active:scale-95"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" aria-hidden="true" />
              도슨트 읽는 중 · 멈추기
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label="스마트 가이드 닫기"
          onClick={(event) => { event.stopPropagation(); onClose(); }}
          className="mt-0.5 shrink-0 rounded-full px-1.5 text-[13px] leading-none text-slate-400 transition-colors hover:text-slate-100"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
}
