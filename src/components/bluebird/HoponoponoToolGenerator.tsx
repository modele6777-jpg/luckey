import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Droplets,
  Key,
  Wind,
  Eraser,
  Sparkles,
  RefreshCw,
  Trash2,
  Package,
  Heart,
  BookOpen,
  Coffee,
  Sun,
  ShieldCheck,
  Flame,
  LifeBuoy,
} from 'lucide-react';
import { TTSButton } from '@/components/TTSButton';
import { ImageOutputActions } from '@/components/ImageOutputActions';
import { playAudioHaptic } from '@/lib/audioHaptics';
import {
  HOPONOPONO_TOOL_CATALOG,
  getHoponoponoToolFallbackImageUrl,
  type HoponoponoToolId,
  type SavedHoponoponoTool,
  type HoponoponoToolCatalogItem,
} from '@/lib/hoponoponoTools';

const TOOL_ICONS: Record<HoponoponoToolId, React.ReactNode> = {
  blue_solar_water: <Droplets size={16} />,
  ceeport: <Key size={16} />,
  ha: <Wind size={16} />,
  eraser: <Eraser size={16} />,
  salt_water: <Package size={16} />,
  strawberries: <span className="text-sm">🍓</span>,
  pancakes: <span className="text-sm">🥞</span>,
  m_and_ms: <span className="text-sm">🍫</span>,
  blueberries: <span className="text-sm">🫐</span>,
  candy_canes: <span className="text-sm">🦯</span>,
  coconut: <span className="text-sm">🥥</span>,
  hot_chocolate: <Coffee size={16} />,
  vanilla_ice_cream: <span className="text-sm">🍨</span>,
  jellybeans: <span className="text-sm">🍬</span>,
  lifesavers: <LifeBuoy size={16} />,
  pretzels: <span className="text-sm">🥨</span>,
  toast: <span className="text-sm">🍞</span>,
  bubble_gum: <span className="text-sm">🫧</span>,
  auto: <Sparkles size={16} />,
};

type HoponoponoToolPickerProps = {
  selectedToolId: HoponoponoToolId;
  onSelect: (toolId: HoponoponoToolId) => void;
};

export function HoponoponoToolPicker({
  selectedToolId,
  onSelect,
}: HoponoponoToolPickerProps) {
  const [filterCategory, setFilterCategory] = useState<'all' | 'food' | 'classic'>('all');

  const displayedTools = HOPONOPONO_TOOL_CATALOG.filter((tool) => {
    if (filterCategory === 'all') return true;
    return tool.category === filterCategory || tool.id === 'auto';
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
        <div className="space-y-0.5">
          <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-sans">
            <Droplets size={14} /> 함께 받을 정화 도구 선택
          </span>
          <p className="text-xs text-white/50 break-keep font-sans">
            정화 개시와 함께 블루솔라워터, 딸기, 핫초콜릿 등 실제 정화 도구 처방을 받습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
            filterCategory === 'all'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
              : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
          }`}
        >
          전체 ({HOPONOPONO_TOOL_CATALOG.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterCategory('food')}
          className={`px-3 py-1 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
            filterCategory === 'food'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
              : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
          }`}
        >
          🍓 13가지 음식 도구
        </button>
        <button
          type="button"
          onClick={() => setFilterCategory('classic')}
          className={`px-3 py-1 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
            filterCategory === 'classic'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
              : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
          }`}
        >
          💧 클래식 도구
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-h-[220px] sm:max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
        {displayedTools.map((tool: HoponoponoToolCatalogItem) => {
          const isActive = selectedToolId === tool.id;
          return (
            <motion.button
              key={tool.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playAudioHaptic('card_snap');
                onSelect(tool.id);
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                isActive
                  ? 'bg-sky-500/15 border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/30'
                  : 'bg-white/[0.02] border-white/5 hover:border-sky-500/20 hover:bg-white/[0.05]'
              }`}
            >
              <div>
                <div className={`mb-1 flex items-center justify-between ${isActive ? 'text-sky-300' : 'text-white/50'}`}>
                  <span>{TOOL_ICONS[tool.id]}</span>
                  <span className="text-[9px] font-mono opacity-50 uppercase">{tool.category}</span>
                </div>
                <p className="text-xs font-bold text-white font-sans break-keep break-words">{tool.emoji} {tool.name}</p>
              </div>
              <p className="text-[10px] text-white/50 mt-1 break-keep break-words leading-tight font-sans">{tool.summary}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

type HoponoponoToolResultCardProps = {
  tool: SavedHoponoponoTool;
  imageLoading?: boolean;
  onImageLoad?: () => void;
  onDelete?: () => void;
  compact?: boolean;
};

export function HoponoponoToolResultCard({
  tool,
  imageLoading = false,
  onImageLoad,
  onDelete,
  compact = false,
}: HoponoponoToolResultCardProps) {
  const [currentImgSrc, setCurrentImgSrc] = useState<string>(tool.imageUrl || '');
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  React.useEffect(() => {
    setCurrentImgSrc(tool.imageUrl || '');
    setImgFailed(false);
  }, [tool.imageUrl, tool.toolId]);

  const handleImgError = () => {
    const fallback = getHoponoponoToolFallbackImageUrl(tool.toolId);
    if (currentImgSrc !== fallback) {
      setCurrentImgSrc(fallback);
    } else {
      setImgFailed(true);
    }
    if (onImageLoad) onImageLoad();
  };

  return (
    <div
      className={`rounded-3xl bg-[#0d1512]/70 border border-sky-500/20 overflow-hidden ${
        compact ? 'p-4 space-y-4' : 'p-6 md:p-8 space-y-6'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider font-sans">
            실제 정화 도구 처방
          </span>
          <h4 className="text-xl font-black text-white font-sans">{tool.toolName}</h4>
          <p className="text-xs text-white/50 font-sans">{tool.toolSubtitle}</p>
          <p className="text-xs text-white/50 break-keep font-sans mt-1">{tool.whyThisTool}</p>
        </div>
        {onDelete && !compact && (
          <button
            type="button"
            onClick={() => {
              playAudioHaptic('delete_discard');
              onDelete();
            }}
            className="self-start px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 text-white/40 hover:text-rose-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 size={12} />
            삭제
          </button>
        )}
      </div>

      {!compact && (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[4/3] w-full flex items-center justify-center">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
              <RefreshCw size={20} className="animate-spin text-sky-400" />
            </div>
          )}
          {currentImgSrc && !imgFailed ? (
            <>
              <ImageOutputActions
                src={currentImgSrc}
                alt={tool.toolName}
                filename={`hoponopono-${tool.toolId}`}
              />
              <img
                src={currentImgSrc}
                alt={tool.toolName}
                referrerPolicy="no-referrer"
                onLoad={onImageLoad}
                onError={handleImgError}
                className="w-full h-full object-cover"
              />
            </>
          ) : (
            <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-teal-950/40 via-sky-950/40 to-emerald-950/40 border border-sky-500/20">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-300 mb-3 shadow-lg">
                {TOOL_ICONS[tool.toolId as HoponoponoToolId] || <Sparkles size={24} />}
              </div>
              <h5 className="text-base font-bold text-white font-sans">{tool.toolName}</h5>
              <p className="text-xs text-sky-300/80 font-sans mt-1">{tool.toolSubtitle}</p>
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-[10px] text-sky-300 font-mono">
                <Sparkles size={10} /> HO&apos;OPONOPONO SACRED TOOL
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left space-y-2">
          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider font-sans">준비물</span>
          <ul className="space-y-1.5">
            {tool.materials.map((item) => (
              <li key={item} className="text-xs text-white/75 flex items-start gap-2 font-sans">
                <span className="text-sky-400 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left space-y-2">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-sans">만드는 순서</span>
          <ol className="space-y-1.5">
            {tool.steps.map((step, idx) => (
              <li key={step} className="text-xs text-white/75 flex items-start gap-2 font-sans">
                <span className="text-emerald-400/80 font-mono shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#09100e]/80 border border-sky-500/15 text-center space-y-3">
        <span className="text-[10px] font-black tracking-widest text-sky-300 uppercase font-mono block">
          사용할 때 읊을 주문
        </span>
        <p className="text-sm text-white/90 whitespace-pre-line italic leading-relaxed font-sans">
          {tool.usageMantra}
        </p>
        <TTSButton
          text={tool.usageMantra}
          voice="Kore"
          className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-xl text-xs text-sky-300"
        />
      </div>

      <p className="text-xs text-white/55 text-left break-keep font-sans border-t border-white/5 pt-4">
        <span className="text-sky-400 font-bold">오늘의 습관 · </span>
        {tool.dailyPractice}
      </p>
    </div>
  );
}