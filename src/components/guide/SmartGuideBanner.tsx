/**
 * 🧭 스마트 가이드 배너 (+ 🔊 가이드 도슨트 표시·중지)
 *
 * 한 번 탭해 도착한 화면 위에 "지금 추천: ○○ / 왜 / 무엇을 하면 되는지"를 띄운다.
 * - 탭하면 닫히고, 3.5~4초 뒤 스스로 사라진다 (도슨트가 읽는 동안에는 읽기가 끝날 때까지 남는다).
 * - 도슨트가 읽는 중이면 🔴 표시와 중지 버튼이 함께 나온다.
 *
 * 사용자 지시(2026-11-28):
 *  - "가이드 발동 시 안내팝업을 사이드메뉴를 제외한 본문에만 나오게 해주고"
 *    → 사이드바(.sites-pinned-sidebar)를 뺀 본문 캔버스 기준으로만 중앙 정렬·최대 폭을 잡는다.
 *  - "가이드 안내 팝업안에 글자의 시인성 때문에 잘 안보여"
 *    → 밝은 테마(html.light) 전역 글자색 규칙이 덮어쓰지 못하게 data-theme-dark-island로 격리하고,
 *      불투명에 가까운 남색 배경 + 고명도 텍스트 색을 명시한다.
 *  - "빅뱅 탭으로 가이드 이동시 안내 팝업에 그 페이지의 가이드로 바로 연결할수 있는 버튼을 안내해줘"
 *    → 배너 안 "📘 이 페이지 가이드 보기" 버튼이 지금 화면(도착한 페이지)의 가이드 창을 바로 연다.
 */
import { motion } from 'framer-motion';
import type { SmartGuideResult } from '@/lib/omniWarp/smartBigBangGuide';
import { stopGuideDouser, useGuideDouserActive } from '@/lib/omniWarp/guideDouser';
import { useMainOverlayViewport } from '@/hooks/useMainOverlayViewport';

const TEXT_TITLE = '#ecfeff';
const TEXT_BODY = '#e2e8f0';
const TEXT_HINT = '#a5f3fc';

export function SmartGuideBanner({ guide, onClose, onOpenPageGuide }: {
  guide: SmartGuideResult;
  onClose: () => void;
  /** 배너를 닫고 지금 화면(도착한 페이지)의 페이지 가이드 창을 연다. */
  onOpenPageGuide?: () => void;
}) {
  const douserActive = useGuideDouserActive();
  // 본문 캔버스만 사용한다 (오른쪽·아래 사이드메뉴를 침범하지 않는다).
  const viewport = useMainOverlayViewport('main');
  const paneWidth = Number(viewport.width) || 0;
  const paneHeight = Number(viewport.height) || 0;
  const confined = paneWidth >= 48 && paneHeight >= 48;

  return (
    <div
      data-testid="bigbang-smart-guide"
      data-smart-guide-action={guide.action}
      data-smart-guide-path={guide.path}
      data-smart-guide-douser-active={douserActive ? 'true' : 'false'}
      data-smart-guide-confined={confined ? 'true' : 'false'}
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed z-[9994]"
      style={confined
        ? { left: `${viewport.left}px`, top: `${viewport.top}px`, width: `${viewport.width}px`, height: `${viewport.height}px` }
        : { left: 0, top: 0, right: 0, bottom: 0 }}
    >
      <div
        className="pointer-events-auto absolute"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          top: 'calc(env(safe-area-inset-top, 0px) + var(--duo-pane-header-height, 56px) + 6px)',
          width: 'min(420px, calc(100% - 20px))',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          data-theme-dark-island="true"
          onClick={onClose}
          className="flex items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-left shadow-[0_12px_38px_rgba(2,6,23,0.72)] backdrop-blur-md"
          style={{
            colorScheme: 'dark',
            color: TEXT_BODY,
            borderColor: 'rgba(103,232,249,0.38)',
            background: 'linear-gradient(158deg, rgba(8,15,36,0.97) 0%, rgba(3,7,24,0.96) 100%)',
          }}
        >
          <span className="mt-[2px] text-base leading-none" aria-hidden="true">{guide.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold" style={{ color: TEXT_TITLE, textShadow: '0 1px 2px rgba(2,6,23,0.85)' }}>
              🧭 지금 추천: {guide.title}
            </p>
            <p className="mt-0.5 text-[12px] leading-snug [overflow-wrap:anywhere]" style={{ color: TEXT_BODY }}>{guide.reason}</p>
            <p className="mt-1 text-[11.5px] leading-snug [overflow-wrap:anywhere]" style={{ color: TEXT_HINT }}>{guide.ctaHint}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {onOpenPageGuide && (
                <button
                  type="button"
                  data-smart-guide-page-guide="true"
                  aria-label={`${guide.title} 페이지 가이드 바로 보기`}
                  onClick={(event) => { event.stopPropagation(); onOpenPageGuide(); }}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11.5px] font-bold active:scale-95"
                  style={{ borderColor: 'rgba(103,232,249,0.5)', backgroundColor: 'rgba(34,211,238,0.18)', color: '#e0faff' }}
                >
                  📘 이 페이지 가이드 보기
                </button>
              )}
              {douserActive && (
                <button
                  type="button"
                  data-smart-guide-douser-stop="true"
                  onClick={(event) => { event.stopPropagation(); stopGuideDouser(); }}
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold active:scale-95"
                  style={{ borderColor: 'rgba(103,232,249,0.4)', backgroundColor: 'rgba(34,211,238,0.14)', color: '#e0faff' }}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" aria-hidden="true" />
                  도슨트 읽는 중 · 멈추기
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="스마트 가이드 닫기"
            onClick={(event) => { event.stopPropagation(); onClose(); }}
            className="mt-0.5 shrink-0 rounded-full px-1.5 text-[13px] leading-none transition-colors"
            style={{ color: 'rgba(226,232,240,0.75)' }}
          >
            ✕
          </button>
        </motion.div>
      </div>
    </div>
  );
}
