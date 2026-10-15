import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Maximize2, X, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { isMobileDevice, isPerfReduced } from '@/lib/perfMode';
import { useTTSCurrentSentence, renderWithSentenceHighlight } from '@/utils/ttsHighlight';

interface LucyProTypewriterProps {
  content: string;
  isLatest?: boolean;
  isGenerating?: boolean;
  typewriterSpeed?: number;
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
      <div className="my-3 overflow-hidden rounded-2xl border border-slate-200 shadow-md group relative bg-slate-100/80 transition-all duration-300">
        {/* Placeholder skeleton while loading */}
        {!isLoaded && !hasError && (
          <div className="w-full h-56 sm:h-72 flex flex-col items-center justify-center gap-2 bg-gradient-to-tr from-slate-100 via-amber-50/40 to-slate-100 text-slate-400 animate-pulse">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <span className="text-xs text-slate-500 font-medium">루시 AI 이미지를 불러오는 중...</span>
          </div>
        )}

        {hasError ? (
          <div className="w-full h-40 flex flex-col items-center justify-center gap-2 bg-rose-50 text-rose-500 p-4 text-center">
            <ImageIcon size={28} />
            <span className="text-xs font-bold">이미지를 불러오지 못했습니다.</span>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] underline text-rose-600 flex items-center gap-1"
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
          <motion.div
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function LucyProTypewriter({
  content,
  isLatest = false,
  isGenerating = false,
  typewriterSpeed = 32,
}: LucyProTypewriterProps) {
  const isMobile = typeof window !== 'undefined' && (isMobileDevice() || isPerfReduced());
  // On mobile, render streamed content directly to prevent 80-markdown-parses-per-second CPU lag.
  // The LLM stream already provides natural live chunking!
  const shouldAnimate = !isMobile && (isLatest || isGenerating);
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

  const displayedText = useMemo(() => {
    if (!shouldAnimate || displayedLength >= content.length) {
      return content;
    }
    return content.slice(0, displayedLength);
  }, [content, displayedLength, shouldAnimate]);

  const { isSpeaking, activeSentence, activeFullText } = useTTSCurrentSentence();

  const isCurrentlyRead = useMemo(() => {
    if (!isSpeaking || !activeSentence) return false;
    if (content.includes(activeSentence)) return true;
    if (activeFullText) {
      const cleanContent = content.replace(/[.!?。！？\s]/g, '');
      const cleanFull = activeFullText.replace(/[.!?。！？\s]/g, '');
      if (cleanFull.includes(cleanContent) || cleanContent.includes(cleanFull)) {
        return true;
      }
    }
    const cleanContent = content.replace(/[.!?。！？\s]/g, '');
    const cleanSentence = activeSentence.replace(/[.!?。！？\s]/g, '');
    return cleanContent.includes(cleanSentence);
  }, [isSpeaking, activeSentence, activeFullText, content]);

  const targetSentence = isCurrentlyRead ? activeSentence : null;

  const isTyping = isGenerating || (shouldAnimate && displayedLength < content.length);

  return (
    <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed font-sans [&_h1]:text-slate-900 [&_h1]:font-bold [&_h1]:text-lg [&_h1]:mb-2 [&_h2]:text-slate-900 [&_h2]:font-bold [&_h2]:text-base [&_h2]:mb-2 [&_h3]:text-slate-900 [&_h3]:font-semibold [&_h3]:text-sm [&_h3]:mb-1.5 [&_strong]:text-amber-900 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-2 [&_code]:bg-amber-50 [&_code]:text-amber-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-3.5 [&_pre]:rounded-xl [&_p]:mb-2.5 [&_p:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, children, ...props }) => (
            <div className="mb-2.5 last:mb-0 leading-relaxed font-sans" {...props}>
              {renderWithSentenceHighlight(children, targetSentence, true)}
            </div>
          ),
          li: ({ node, children, ...props }) => (
            <li className="mb-1" {...props}>
              {renderWithSentenceHighlight(children, targetSentence, true)}
            </li>
          ),
          h1: ({ children }) => <h1 className="text-slate-900 font-bold text-lg mb-2">{renderWithSentenceHighlight(children, targetSentence, true, true)}</h1>,
          h2: ({ children }) => <h2 className="text-slate-900 font-bold text-base mb-2">{renderWithSentenceHighlight(children, targetSentence, true, true)}</h2>,
          h3: ({ children }) => <h3 className="text-slate-900 font-semibold text-sm mb-1.5">{renderWithSentenceHighlight(children, targetSentence, true, true)}</h3>,
          h4: ({ children }) => <h4 className="text-slate-900 font-semibold text-xs mb-1.5">{renderWithSentenceHighlight(children, targetSentence, true, true)}</h4>,
          h5: ({ children }) => <h5 className="text-slate-900 font-medium text-xs mb-1">{renderWithSentenceHighlight(children, targetSentence, true, true)}</h5>,
          h6: ({ children }) => <h6 className="text-slate-900 font-medium text-[11px] mb-1">{renderWithSentenceHighlight(children, targetSentence, true, true)}</h6>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-400 pl-3 italic text-slate-600 my-2">{renderWithSentenceHighlight(children, targetSentence, true, false)}</blockquote>,
          th: ({ children }) => <th className="px-2.5 py-1.5 text-left font-bold text-xs border-b border-slate-200">{renderWithSentenceHighlight(children, targetSentence, true, false)}</th>,
          td: ({ children }) => <td className="px-2.5 py-1.5 text-xs border-b border-slate-100">{renderWithSentenceHighlight(children, targetSentence, true, false)}</td>,
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

