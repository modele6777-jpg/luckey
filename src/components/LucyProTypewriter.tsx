import { ScreenPortal } from '@/components/layout/ScreenPortal';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Maximize2, X, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { isMobileDevice, isPerfReduced } from '@/lib/perfMode';
import { useTTSCurrentSentence, renderWithSentenceHighlight } from '@/utils/ttsHighlight';
import { cleanSentenceForMatching, isSentenceActive } from '@/components/common/TTSHighlightedText';
import { useTheme } from '@/contexts/ThemeContext';

interface LucyProTypewriterProps {
  content: string;
  isLatest?: boolean;
  isGenerating?: boolean;
  typewriterSpeed?: number;
  instantReveal?: boolean;
  enableTTSHighlight?: boolean;
}

function LucyProImageItem({ src, alt }: { src?: string; alt?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageLoaded = () => {
    setIsLoaded(true);
    // Notify container to auto-scroll without cutting off image
    window.dispatchEvent(new CustomEvent('lucy-chat-content-resized'));
  };

  if (!src) return null;

  return (
    <>
      <div className="my-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/15 shadow-md group relative bg-slate-100/80 dark:bg-slate-900/80 transition-all duration-300">
        {/* Placeholder skeleton while loading */}
        {!isLoaded && !hasError && (
          <div className="w-full h-56 sm:h-72 flex flex-col items-center justify-center gap-2 bg-gradient-to-tr from-slate-100 via-amber-50/40 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-400 animate-pulse">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <span className="text-xs text-slate-500 dark:text-slate-300 font-medium">루시 AI 이미지를 불러오는 중...</span>
          </div>
        )}

        {hasError ? (
          <div className="w-full h-40 flex flex-col items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-300 p-4 text-center">
            <ImageIcon size={28} />
            <span className="text-xs font-bold">이미지를 불러오지 못했습니다.</span>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] underline text-rose-600 dark:text-rose-300 flex items-center gap-1"
            >
              <ExternalLink size={12} /> 새 창에서 열기
            </a>
          </div>
        ) : (
          <img
            src={src}
            alt={alt || '루시 AI 생성 이미지'}
            onLoad={handleImageLoaded}
            onError={() => setHasError(true)}
            onClick={() => setIsModalOpen(true)}
            className={`w-full h-auto object-cover max-h-[500px] rounded-2xl cursor-zoom-in transition-all duration-300 ${
              isLoaded ? 'opacity-100 block' : 'opacity-0 absolute inset-0'
            }`}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Action Overlay */}
        {isLoaded && !hasError && (
          <div className="absolute top-2.5 right-2.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md rounded-xl p-1 flex items-center gap-1 shadow-lg z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white hover:text-amber-300 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="크게 확대해서 보기 (전체화면)"
            >
              <Maximize2 size={14} />
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              download="lucy-pro-art.jpg"
              className="text-white hover:text-amber-300 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="고화질 원본 다운로드"
            >
              <Download size={14} />
              <span className="text-[11px] pr-1">저장</span>
            </a>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full Uncropped Image View */}
      <AnimatePresence>
        {isModalOpen && (
          <ScreenPortal><motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center select-none"
          >
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 z-20">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                download="lucy-pro-art.jpg"
                onClick={(e) => e.stopPropagation()}
                className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md"
              >
                <Download size={14} />
                <span>저장하기</span>
              </a>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
                title="닫기"
              >
                <X size={16} />
                <span>닫기</span>
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-white/10"
            >
              <img
                src={src}
                alt={alt || '루시 AI 생성 이미지 원본'}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              />
            </motion.div>

            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-zinc-900/90 hover:bg-black border border-white/25 text-white text-xs font-bold shadow-2xl backdrop-blur-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                title="닫기"
              >
                <X size={16} />
                <span>닫기</span>
              </button>
            </div>
          </motion.div></ScreenPortal>
        )}
      </AnimatePresence>
    </>
  );
}

function formatLucyMarkdown(content: string): string {
  if (!content) return '';
  let formatted = content;
  // 1. 헤더(#) 앞에 붙은 불릿이나 대시는 헤더 내부로 일원화 (예: "• ### 소제목" -> "### • 소제목")
  formatted = formatted.replace(/^(?:[-*•·]\s*)?(#{1,6})\s*(?:[•·]\s*)?([^\n]+)$/gm, '$1 • $2');

  // 2. 불릿 뒤에 바로 줄바꿈이 오는 결함(• \n소제목)을 한 줄로 병합하여 소제목 바로 옆에 불릿 배치
  formatted = formatted.replace(/^[•·]\s*\n+([^\n]+)/gm, '• $1');

  // 3. 인라인으로 연달아 붙은 불릿( • )을 줄바꿈 분리하되, 소제목 옆에 불릿(• )이 나란히 오도록 유지
  formatted = formatted.replace(/([^\n])\s*[•·]\s+/g, '$1\n\n• ');

  // 4. 불릿 뒤의 레이블 형태 (예: "• 실천할 행동: ...")를 굵게 강조하여 가독성 강화
  formatted = formatted.replace(/^[•·]\s*([가-힣A-Za-z0-9\s]{2,16}:)\s*/gm, '• **$1** ');

  // 5. 마크다운 리스트 대시 뒤에 불릿이 중복되거나 소제목이 오면 소제목 옆 불릿으로 일원화
  formatted = formatted.replace(/^[\t ]*-\s*[•·]\s*/gm, '• ');
  return formatted;
}

export function LucyProTypewriter({
  content,
  isLatest = false,
  isGenerating = false,
  typewriterSpeed = 32,
  instantReveal = false,
  enableTTSHighlight = false,
}: LucyProTypewriterProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const isMobile = typeof window !== 'undefined' && (isMobileDevice() || isPerfReduced());
  // On mobile or in KakaoTalk bubble pop-in mode, render bubble content directly while keeping TTS sentence highlighting
  const shouldAnimate = !instantReveal && !isMobile && (isLatest || isGenerating);
  const [displayedLength, setDisplayedLength] = useState<number>(() => {
    return shouldAnimate ? 0 : content.length;
  });

  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedLength(content.length);
      return;
    }

    if (displayedLength < content.length) {
      const remainder = content.length - displayedLength;
      
      // If we encounter an image markdown `![`, jump forward past the closing `)` so image renders and loads without glitching
      const nextImgIdx = content.indexOf('![', displayedLength);
      if (nextImgIdx === displayedLength) {
        const endImgIdx = content.indexOf(')', nextImgIdx);
        if (endImgIdx !== -1) {
          setDisplayedLength(endImgIdx + 1);
          return;
        }
      }

      // Adaptive chunk sizing for smooth typing cadence without CPU bottleneck
      let chunkSize = 4;
      if (remainder > 300) {
        chunkSize = 16;
      } else if (remainder > 150) {
        chunkSize = 8;
      } else if (remainder > 50) {
        chunkSize = 6;
      }

      const timer = setTimeout(() => {
        setDisplayedLength((prev) => Math.min(content.length, prev + chunkSize));
      }, Math.max(typewriterSpeed, 28));

      return () => clearTimeout(timer);
    }
  }, [content, displayedLength, shouldAnimate, typewriterSpeed]);

  // When generation finishes, immediately reveal 100% of the completed response to avoid cutoffs or frozen typing
  useEffect(() => {
    if (!isGenerating && displayedLength < content.length) {
      setDisplayedLength(content.length);
    }
  }, [isGenerating, content.length, displayedLength]);

  const displayedText = useMemo(() => {
    if (!shouldAnimate || displayedLength >= content.length) {
      return formatLucyMarkdown(content);
    }
    return formatLucyMarkdown(content.slice(0, displayedLength));
  }, [content, displayedLength, shouldAnimate]);

  const { isSpeaking, activeSentence } = useTTSCurrentSentence(true);

  const isContentMatching = useMemo(() => {
    if (!isSpeaking || !activeSentence || !content) return false;
    const cleanC = cleanSentenceForMatching(content);
    const cleanA = cleanSentenceForMatching(activeSentence);
    if (!cleanC || !cleanA) return false;
    return cleanC.includes(cleanA) || isSentenceActive(content, activeSentence);
  }, [isSpeaking, activeSentence, content]);

  const targetSentence =
    isSpeaking && activeSentence && enableTTSHighlight && isContentMatching
      ? activeSentence
      : null;

  const isTyping = isGenerating || (shouldAnimate && displayedLength < content.length);

  return (
    <div
      className={`min-w-0 max-w-full overflow-x-hidden break-words [overflow-wrap:anywhere] leading-relaxed font-sans [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2.5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2.5 [&_ol]:space-y-1.5 [&_li]:mb-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:break-words [&_pre]:bg-slate-900 [&_pre]:text-white [&_pre]:p-3.5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full [&_p]:mb-2.5 [&_p:last-child]:mb-0 ${
        isLight
          ? 'text-slate-800 [&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-900 [&_strong]:text-amber-900 [&_blockquote]:text-slate-600 [&_code]:bg-amber-50 [&_code]:text-amber-800'
          : 'text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-amber-200 [&_strong]:text-amber-300 [&_blockquote]:text-white/90 [&_code]:bg-amber-950/60 [&_code]:text-amber-200'
      }`}
      style={{ color: isLight ? '#1e293b' : '#ffffff' }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, children, ...props }) => (
            <div
              className={`mb-3 last:mb-0 leading-relaxed font-sans whitespace-pre-line ${isLight ? 'text-slate-800' : 'text-white'}`}
              style={{ color: isLight ? '#1e293b' : '#ffffff' }}
              {...props}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight)}
            </div>
          ),
          li: ({ node, children, ...props }) => (
            <li
              className={`mb-1.5 last:mb-0 leading-relaxed pl-1 whitespace-pre-line ${isLight ? 'text-slate-800' : 'text-white'} [&>div]:inline [&>p]:inline [&>h1]:inline [&>h2]:inline [&>h3]:inline [&>h4]:inline`}
              style={{ color: isLight ? '#1e293b' : '#ffffff' }}
              {...props}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight)}
            </li>
          ),
          h1: ({ children }) => (
            <h1
              className={`font-bold text-lg mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, true)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={`font-bold text-base mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, true)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={`font-semibold text-sm mb-1.5 ${isLight ? 'text-slate-900' : 'text-amber-100'}`}
              style={{ color: isLight ? '#0f172a' : '#fef3c7' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, true)}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              className={`font-semibold text-xs mb-1.5 ${isLight ? 'text-slate-900' : 'text-amber-100'}`}
              style={{ color: isLight ? '#0f172a' : '#fef3c7' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, true)}
            </h4>
          ),
          h5: ({ children }) => (
            <h5
              className={`font-medium text-xs mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, true)}
            </h5>
          ),
          h6: ({ children }) => (
            <h6
              className={`font-medium text-[11px] mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, true)}
            </h6>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={`border-l-4 border-amber-400 pl-3 italic my-2 ${isLight ? 'text-slate-600' : 'text-white/90'}`}
              style={{ color: isLight ? '#475569' : 'rgba(255, 255, 255, 0.92)' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, false)}
            </blockquote>
          ),
          th: ({ children }) => (
            <th
              className={`px-2.5 py-1.5 text-left font-bold text-xs border-b ${
                isLight ? 'border-slate-200 text-slate-900' : 'border-white/15 text-white'
              }`}
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, false)}
            </th>
          ),
          td: ({ children }) => (
            <td
              className={`px-2.5 py-1.5 text-xs border-b ${
                isLight ? 'border-slate-100 text-slate-800' : 'border-white/10 text-white'
              }`}
              style={{ color: isLight ? '#1e293b' : '#ffffff' }}
            >
              {renderWithSentenceHighlight(children, targetSentence, isLight, false)}
            </td>
          ),
          img: ({ node, ...props }) => (
            <LucyProImageItem src={props.src} alt={props.alt} />
          ),
        }}
      >
        {displayedText}
      </ReactMarkdown>

      {/* 🌟 Glowing Typewriter Cursor Indicator */}
      {isTyping && (
        <span
          className="inline-block w-1.5 h-4 ml-1 bg-amber-500 rounded-xs animate-pulse align-middle shadow-xs"
          title="루시가 답변을 작성 중입니다..."
        />
      )}
    </div>
  );
}


