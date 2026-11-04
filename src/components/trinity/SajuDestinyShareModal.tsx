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
  Compass,
} from 'lucide-react';
import { WorkspacePortal } from '@/components/layout/DuoWorkspace';
import {
  type SajuDestinyStoryData,
  formatSajuDestinyShareText,
  generateSajuDestinyStoryCanvas,
  downloadSajuCanvasAsPng,
  shareSajuDestinyStory,
} from '@/utils/sajuDestinyExporter';
import { playAudioHaptic } from '@/lib/audioHaptics';

export interface SajuDestinyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SajuDestinyStoryData;
}

export function SajuDestinyShareModal({ isOpen, onClose, data }: SajuDestinyShareModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [shareSuccessNotice, setShareSuccessNotice] = useState<string | null>(null);

  const cachedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setShareSuccessNotice(null);
      return;
    }

    let isMounted = true;
    setIsRenderingPreview(true);

    const render = async () => {
      try {
        const canvas = await generateSajuDestinyStoryCanvas(data);
        if (!isMounted) return;
        cachedCanvasRef.current = canvas;
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewDataUrl(dataUrl);
      } catch (err) {
        console.warn('Failed to render saju preview canvas', err);
      } finally {
        if (isMounted) setIsRenderingPreview(false);
      }
    };

    void render();

    return () => {
      isMounted = false;
    };
  }, [isOpen, data]);

  // 1. 인스타/메신저 텍스트 복사
  const handleCopyText = async () => {
    try {
      const text = formatSajuDestinyShareText(data);
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      playAudioHaptic('save_auto');
      setShareSuccessNotice('인스타 스토리용 캡션이 클립보드에 복사되었습니다! ✨');
      setTimeout(() => setIsCopied(false), 2500);
      setTimeout(() => setShareSuccessNotice(null), 3500);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  // 2. 고해상도 이미지(PNG) 저장
  const handleDownloadImage = async () => {
    try {
      setIsDownloading(true);
      let canvas = cachedCanvasRef.current;
      if (!canvas) {
        canvas = await generateSajuDestinyStoryCanvas(data);
        cachedCanvasRef.current = canvas;
      }
      const filename = `luckey_saju_story_${data.name || 'destiny'}_${new Date().toISOString().slice(0, 10)}.png`;
      await downloadSajuCanvasAsPng(canvas, filename);
      playAudioHaptic('save_success');
      setShareSuccessNotice('9:16 인스타 스토리 규격 고해상도 카드가 저장되었습니다! 🖼️');
      setTimeout(() => setShareSuccessNotice(null), 3500);
    } catch (e) {
      console.error('Failed to download image', e);
    } finally {
      setIsDownloading(false);
    }
  };

  // 3. Web Share API 기반 인스타/SNS 네이티브 공유
  const handleNativeShare = async () => {
    try {
      setIsSharing(true);
      let canvas = cachedCanvasRef.current;
      if (!canvas) {
        canvas = await generateSajuDestinyStoryCanvas(data);
        cachedCanvasRef.current = canvas;
      }
      const result = await shareSajuDestinyStory(data, canvas);
      if (result === 'shared') {
        playAudioHaptic('milestone_success');
        setShareSuccessNotice('성공적으로 공유되었습니다! 🌟');
        setTimeout(() => setShareSuccessNotice(null), 3500);
      } else if (result === 'copied') {
        setIsCopied(true);
        playAudioHaptic('save_auto');
        setShareSuccessNotice('공유 텍스트가 클립보드에 복사되었습니다! 📋');
        setTimeout(() => setIsCopied(false), 2500);
        setTimeout(() => setShareSuccessNotice(null), 3500);
      }
    } catch (e) {
      console.error('Share error', e);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <WorkspacePortal>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#181a24] via-[#12131a] to-[#0c0d12] border border-amber-500/40 p-5 sm:p-7 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col"
        >
          {/* 상단 헤더 바 */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Compass size={17} />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
                  <span>사주 만세력 인스타 공유 카드</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    9:16 STORY
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  인스타그램 스토리, 카카오톡, 피드에 딱 맞춘 1080x1920 레티나 카드
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* 성공 토스트 알림 */}
          <AnimatePresence>
            {shareSuccessNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-medium flex items-center gap-2 shrink-0"
              >
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>{shareSuccessNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 메인 미리보기 영역 (9:16 종횡비 카드) */}
          <div className="flex-1 overflow-y-auto py-4 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-[#090a0f] flex items-center justify-center">
              {isRenderingPreview ? (
                <div className="flex flex-col items-center gap-3 text-amber-300">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono">초고해상도 카드 렌더링 중...</span>
                </div>
              ) : previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Saju Destiny Story Card Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-zinc-500">미리보기 준비 중</div>
              )}
            </div>
          </div>

          {/* 하단 액션 버튼 그룹 */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            {/* 1. 네이티브 공유 */}
            <button
              onClick={handleNativeShare}
              disabled={isSharing || isRenderingPreview}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 active:scale-[0.98] text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              <Share2 size={15} />
              <span>{isSharing ? '공유 창 여는 중...' : '인스타 / SNS로 공유'}</span>
            </button>

            {/* 2. PNG 다운로드 */}
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading || isRenderingPreview}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all disabled:opacity-50"
            >
              <Download size={15} />
              <span>{isDownloading ? '저장 중...' : '고화질 PNG 저장'}</span>
            </button>

            {/* 3. 인스타 캡션 텍스트 복사 */}
            <button
              onClick={handleCopyText}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all shrink-0"
              title="인스타 캡션/메신저용 텍스트 복사"
            >
              {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{isCopied ? '복사됨!' : '캡션 복사'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </WorkspacePortal>
  );
}
