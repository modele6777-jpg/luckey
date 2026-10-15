import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  TodayTarotShareData,
  formatTodayTarotShareText,
  generateTodayTarotCardCanvas,
  downloadCanvasAsPng,
  shareTodayTarot,
} from '@/utils/todayTarotExporter';
import { playAudioHaptic } from '@/lib/audioHaptics';

export interface TodayTarotShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TodayTarotShareData;
}

export function TodayTarotShareModal({ isOpen, onClose, data }: TodayTarotShareModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [shareSuccessNotice, setShareSuccessNotice] = useState<string | null>(null);

  const cachedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate preview image when modal opens
  useEffect(() => {
    if (!isOpen) {
      setShareSuccessNotice(null);
      return;
    }

    let isMounted = true;
    setIsRenderingPreview(true);

    const render = async () => {
      try {
        const canvas = await generateTodayTarotCardCanvas(data);
        if (!isMounted) return;
        cachedCanvasRef.current = canvas;
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewDataUrl(dataUrl);
      } catch (err) {
        console.warn('Failed to render preview canvas', err);
      } finally {
        if (isMounted) setIsRenderingPreview(false);
      }
    };

    void render();

    return () => {
      isMounted = false;
    };
  }, [isOpen, data]);

  // Handle 1: Copy Text to Clipboard
  const handleCopyText = async () => {
    try {
      const text = formatTodayTarotShareText(data);
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setShareSuccessNotice('타로 결과 텍스트가 클립보드에 복사되었습니다! ✨');
      setTimeout(() => setIsCopied(false), 2500);
      setTimeout(() => setShareSuccessNotice(null), 3500);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  // Handle 2: Save as Image (PNG)
  const handleDownloadImage = async () => {
    try {
      setIsDownloading(true);
      let canvas = cachedCanvasRef.current;
      if (!canvas) {
        canvas = await generateTodayTarotCardCanvas(data);
        cachedCanvasRef.current = canvas;
      }
      const cardName = (data.card?.nameKo || 'tarot').replace(/\s+/g, '_');
      const dateKey = (data.dateStr || new Date().toISOString().slice(0, 10)).replace(/[^\d]/g, '');
      const filename = `prism_today_tarot_${dateKey}_${cardName}.png`;

      await downloadCanvasAsPng(canvas, filename);
      playAudioHaptic('save_success');
      setShareSuccessNotice('고해상도 카드 이미지가 저장되었습니다! 🖼️');
      setTimeout(() => setShareSuccessNotice(null), 3500);
    } catch (e) {
      console.error('Failed to download image', e);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle 3: Native Web Share (Mobile / SNS)
  const handleNativeShare = async () => {
    try {
      setIsSharing(true);
      let canvas = cachedCanvasRef.current;
      if (!canvas) {
        canvas = await generateTodayTarotCardCanvas(data);
        cachedCanvasRef.current = canvas;
      }
      const result = await shareTodayTarot(data, canvas);
      if (result === 'shared') {
        setShareSuccessNotice('공유가 성공적으로 완료되었습니다! 🚀');
        setTimeout(() => setShareSuccessNotice(null), 3500);
      } else if (result === 'copied') {
        setIsCopied(true);
        setShareSuccessNotice('클립보드에 텍스트가 복사되었습니다! ✨');
        setTimeout(() => setIsCopied(false), 2500);
        setTimeout(() => setShareSuccessNotice(null), 3500);
      }
    } catch (e) {
      console.error('Share failed', e);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  const cards = (data.cards && data.cards.length > 0) ? data.cards : (data.card ? [data.card] : []);
  const cardNames = cards.map((c) => c.nameKo).join(', ') || '타로 카드';
  const isDaily = /(?:오늘의?\s*타로|오늘의?\s*운세|오늘의?\s*카드|오늘\s*타로|오늘\s*운세|데일리\s*타로|데일리\s*오라클|일일\s*타로)/i.test(
    `${data.title || ''} ${data.concern || ''} ${data.spreadName || ''}`
  );
  const displayTitle = data.title || (isDaily ? '오늘의 데일리 타로' : (cards.length > 1 ? '78장 타로 마스터 비전' : '오늘의 데일리 타로'));
  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[#0e0c18] border border-yellow-500/35 p-5 sm:p-6 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col space-y-4"
        >
          {/* Subtle Ambient Cosmic Glow */}
          <div
            className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-[80px] opacity-25 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #eab308 0%, #a855f7 50%, transparent 80%)' }}
          />

          {/* Header Title & Close Button */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex flex-col justify-start gap-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-400 font-mono">
                <Sparkles size={12} className="text-yellow-400 animate-pulse shrink-0" />
                <span>TAROT RESULT SHARE</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 truncate">
                <span>{displayTitle} 결과 공유 & 소장</span>
              </h2>
              <p className="text-xs text-white/60 font-sans truncate">
                선택된 카드 <strong>[{cardNames}]</strong> 결과 저장 및 공유
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="닫기"
            >
              <X size={18} />
            </button>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {shareSuccessNotice && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-medium flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>{shareSuccessNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Preview Area */}
          <div className="relative w-full rounded-2xl bg-black/60 border border-yellow-500/25 p-3 flex flex-col items-center justify-center overflow-hidden">
            <div className="text-[10px] text-yellow-300/80 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 self-start">
              <Eye size={12} />
              <span>고해상도 카드 미리보기 (1080x1560)</span>
            </div>

            <div className="relative w-48 sm:w-56 aspect-[9/13] rounded-xl overflow-hidden border border-yellow-400/40 shadow-xl bg-zinc-950 flex items-center justify-center">
              {isRenderingPreview ? (
                <div className="flex flex-col items-center gap-2 text-yellow-400/70 p-4 text-center">
                  <div className="w-6 h-6 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                  <span className="text-[11px] font-sans">카드 생성 중...</span>
                </div>
              ) : previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="오늘의 타로 카드 미리보기"
                  className="w-full h-full object-cover select-none"
                />
              ) : (
                <div className="text-xs text-white/40">미리보기를 불러올 수 없습니다</div>
              )}
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* 1. 이미지 카드로 저장 (PNG) */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isDownloading || isRenderingPreview}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.25)] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-sans"
            >
              <Download size={15} className="shrink-0" />
              <span>{isDownloading ? '이미지 생성 중...' : '이미지 카드로 저장 (PNG)'}</span>
            </button>

            {/* 2. 텍스트로 복사 */}
            <button
              type="button"
              onClick={handleCopyText}
              className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-sans ${
                isCopied
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
              }`}
            >
              {isCopied ? <Check size={15} className="text-emerald-400 shrink-0" /> : <Copy size={15} className="shrink-0" />}
              <span>{isCopied ? '복사 완료! ✨' : '텍스트로 전체 복사'}</span>
            </button>
          </div>

          {/* 3. 모바일 / SNS 네이티브 공유 버튼 (Web Share) */}
          {hasNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={isSharing}
              className="w-full px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-sans"
            >
              <Smartphone size={14} className="text-purple-300" />
              <Share2 size={14} className="text-purple-300" />
              <span>{isSharing ? '공유 창 여는 중...' : '카카오톡 · 인스타 · 모바일 공유'}</span>
            </button>
          )}

          {/* Footer note */}
          <div className="pt-2 border-t border-white/10 text-center">
            <p className="text-[11px] text-white/40 font-sans leading-relaxed">
              저장된 이미지는 인스타그램 스토리, 카카오톡 프로필, 스마트폰 배경화면으로 아름답게 활용하실 수 있습니다.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 🌟 어디서든 배치 가능한 원스톱 공유 버튼 컴포넌트
 */
export interface TodayTarotShareButtonProps {
  data: TodayTarotShareData;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact' | 'icon';
  label?: string;
}

export function TodayTarotShareButton({
  data,
  className = '',
  variant = 'secondary',
  label = '결과 공유',
}: TodayTarotShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'icon') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer ${className}`}
          title="오늘의 타로 결과 복사 및 이미지 저장"
        >
          <Share2 size={14} className="text-yellow-400" />
        </button>
        <TodayTarotShareModal isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 ${className}`}
          title="오늘의 타로 결과 복사 및 이미지 저장"
        >
          <Share2 size={12} className="text-yellow-400" />
          <span>{label}</span>
        </button>
        <TodayTarotShareModal isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
      </>
    );
  }

  if (variant === 'primary') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`px-3.5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(234,179,8,0.25)] transition-all cursor-pointer active:scale-95 ${className}`}
          title="오늘의 타로 결과 복사 및 이미지 저장"
        >
          <Share2 size={13} className="text-black" />
          <span>{label}</span>
        </button>
        <TodayTarotShareModal isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${className}`}
        title="오늘의 타로 결과 복사 및 이미지 저장"
      >
        <Share2 size={13} className="text-yellow-400" />
        <span>{label}</span>
      </button>
      <TodayTarotShareModal isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
    </>
  );
}

export { TodayTarotShareModal as TarotResultShareModal };
export { TodayTarotShareButton as TarotResultShareButton };

