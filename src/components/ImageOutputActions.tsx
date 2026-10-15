import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Maximize2, RefreshCw, X } from "lucide-react";

interface ImageOutputActionsProps {
  src: string;
  alt: string;
  filename?: string;
  showDownload?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modalOnly?: boolean;
}

const safeFilename = (value: string) => value
  .replace(/[\\/:*?"<>|]+/g, "-")
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 80) || "prism-image";

export async function downloadImage(src: string, filename: string) {
  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Image download failed: ${response.status}`);
    const blob = await response.blob();
    const extension = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `${safeFilename(filename)}.${extension}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.warn("[ImageOutput] Blob download failed, using direct download.", error);
    const anchor = document.createElement("a");
    anchor.href = src;
    anchor.download = `${safeFilename(filename)}.png`;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();
  }
}

export function ImageOutputActions({
  src,
  alt,
  filename = alt,
  showDownload = true,
  isOpen: controlledOpen,
  onOpenChange,
  modalOnly = false,
}: ImageOutputActionsProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return;
    setIsImageLoading(true);
    setHasImageError(false);
  }, [isOpen, src]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const lightbox = isOpen && createPortal(
        <div className="fixed inset-0 z-[2500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label={`${alt} 크게 보기`}>
          <div className="relative flex items-center justify-center w-full h-full max-w-[min(96vw,720px)] max-h-[88dvh]" onClick={(event) => event.stopPropagation()}>
            {isImageLoading && !hasImageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70">
                <RefreshCw size={28} className="animate-spin text-white/80" />
                <span className="text-xs font-bold tracking-widest uppercase">이미지 불러오는 중...</span>
              </div>
            )}
            {hasImageError ? (
              <div className="flex flex-col items-center justify-center gap-3 text-center px-6">
                <span className="text-sm font-bold text-white/80">이미지를 불러오지 못했습니다.</span>
                <button
                  type="button"
                  onClick={() => {
                    setHasImageError(false);
                    setIsImageLoading(true);
                  }}
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <img
                src={src}
                alt={alt}
                className={`max-w-full max-h-[88dvh] w-auto h-auto object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
                referrerPolicy="no-referrer"
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setIsImageLoading(false);
                  setHasImageError(true);
                }}
              />
            )}
          </div>
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 flex items-center gap-2">
            {showDownload && (
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); void downloadImage(src, filename); }}
                className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer"
                title="이미지 다운로드"
                aria-label="이미지 다운로드"
              >
                <Download size={16} />
                <span className="hidden sm:inline">다운로드</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xl backdrop-blur-md cursor-pointer active:scale-95"
              title="크게 보기 닫기"
              aria-label="크게 보기 닫기"
            >
              <X size={18} />
              <span>닫기</span>
            </button>
          </div>

          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-2.5 rounded-full bg-zinc-900/90 hover:bg-black border border-white/25 text-white text-xs font-bold shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              title="크게 보기 닫기"
            >
              <X size={16} />
              <span>닫기</span>
            </button>
          </div>
        </div>,
        document.body,
      );

  if (modalOnly) {
    return lightbox;
  }

  return (
    <>
      <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
        <button type="button" onClick={(event) => { event.stopPropagation(); setOpen(true); }} className="p-1.5 sm:p-2 rounded-xl bg-black/70 border border-white/15 text-white/80 hover:text-white hover:bg-black/90 backdrop-blur-md transition-all shadow-lg" title="이미지 크게 보기" aria-label="이미지 크게 보기">
          <Maximize2 size={14} />
        </button>
        {showDownload && (
          <button type="button" onClick={(event) => { event.stopPropagation(); void downloadImage(src, filename); }} className="p-1.5 sm:p-2 rounded-xl bg-black/70 border border-white/15 text-white/80 hover:text-white hover:bg-black/90 backdrop-blur-md transition-all shadow-lg" title="이미지 다운로드" aria-label="이미지 다운로드">
            <Download size={14} />
          </button>
        )}
      </div>
      {lightbox}
    </>
  );
}
