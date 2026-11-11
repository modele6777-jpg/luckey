import React from 'react';
import { getTarotCardBackTheme } from '@/data/tarotCardBacks';

export interface TarotCardBackFaceProps {
  cardBackId?: string;
  isHovered?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'wide' | 'wheel' | 'preview';
  className?: string;
}

export const TarotCardBackFace: React.FC<TarotCardBackFaceProps> = React.memo(function TarotCardBackFace({
  cardBackId,
  isHovered = false,
  size = 'md',
  className = '',
}) {
  const theme = getTarotCardBackTheme(cardBackId);

  // Responsive scale factors & 60fps lightweight wheel mode
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isWide = size === 'wide';
  const isPreview = size === 'preview';
  const isWheelFast = size === 'wheel' || size === 'sm';

  const iconScale = isSm ? 'scale-75' : isLg || isPreview ? 'scale-110' : isWide ? 'scale-90' : 'scale-100';

  // Render thematic center glyph based on theme.id (no infinite spin/blur/shadow on 78 wheel cards)
  const renderThemeArtwork = () => {
    switch (theme.id) {
      case 'oracle_healing':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-12 h-12 flex items-center justify-center ${isWheelFast ? '' : 'drop-shadow-[0_0_10px_rgba(253,164,175,0.45)]'}`}>
              <svg viewBox="0 0 48 48" className="w-full h-full text-rose-200" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M24 41V13M24 28C17 28 13 24 12 17c7 0 12 3 12 11ZM24 23c0-8 5-13 13-14 0 8-4 14-13 16ZM24 35c-6 0-10-3-12-9 7 0 11 3 12 9ZM24 32c1-7 5-10 12-11-1 7-5 11-12 12Z" />
                <path d="M18 42h12" />
              </svg>
            </div>
            {!isWheelFast && <div className="absolute w-14 h-14 rotate-45 border border-rose-300/30 rounded-tl-2xl rounded-br-2xl" />}
          </div>
        );

      case 'oracle_growth':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-12 h-12 flex items-center justify-center ${isWheelFast ? '' : 'drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'}`}>
              <svg viewBox="0 0 48 48" className="w-full h-full text-amber-200" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
                <path d="M8 39h32M11 34h9v5M20 28h9v11M29 22h9v17" />
                <path d="m13 25 10-9 7 5 9-11M32 10h7v7" />
                <circle cx="14" cy="13" r="4" />
                <path d="M14 5V3M14 23v-2M6 13H4M24 13h-2M8.3 7.3 7 6M21 20l-1.4-1.4" />
              </svg>
            </div>
            {!isWheelFast && <div className="absolute inset-0 border border-amber-300/30 rotate-45" />}
          </div>
        );

      case 'oracle_miracle':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-12 h-12 flex items-center justify-center ${isWheelFast ? '' : 'drop-shadow-[0_0_10px_rgba(196,181,253,0.5)]'}`}>
              <svg viewBox="0 0 48 48" className="w-full h-full text-violet-200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                <path d="M24 25c-8-2-11-8-8-15 7 2 10 7 8 15ZM24 25c-1-8 3-13 10-15 3 7 0 13-10 15ZM24 25c8-2 14 1 15 8-7 4-13 1-15-8ZM24 25c7 3 9 9 5 15-7-1-10-7-5-15ZM24 25c1 8-3 13-10 15-3-7 0-13 10-15ZM24 25c-8 2-14-1-15-8 7-4 13-1 15 8Z" />
                <circle cx="24" cy="25" r="3" />
              </svg>
            </div>
            {!isWheelFast && <div className="absolute inset-0 rounded-full border border-violet-300/40 border-dashed" />}
          </div>
        );

      case 'cosmic_midnight':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            {!isWheelFast && <div className="absolute -inset-4 rounded-full bg-purple-500/20 blur-md animate-pulse" />}
            <div className={`w-9 h-9 rounded-full border border-purple-400/60 bg-gradient-to-tr from-indigo-900/80 via-purple-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_12px_rgba(168,85,247,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-200" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div className={`absolute w-12 h-12 rounded-full border border-purple-400/30 border-dashed ${isWheelFast ? '' : 'animate-[spin_12s_linear_infinite]'}`} />
          </div>
        );

      case 'mystic_moon':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-sky-300/60 bg-gradient-to-br from-sky-900/60 via-slate-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_12px_rgba(56,189,248,0.4)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-200" fill="currentColor">
                <path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 1 1.9-19.8z" />
              </svg>
            </div>
            <div className="absolute inset-0 rotate-45 border border-sky-400/40" />
          </div>
        );

      case 'cyber_quantum':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 border border-cyan-400/80 bg-black/80 flex items-center justify-center rotate-45 ${isWheelFast ? '' : 'shadow-[0_0_15px_rgba(6,182,212,0.6)]'}`}>
              <div className="w-5 h-5 border border-pink-500/80 flex items-center justify-center -rotate-45">
                <div className={`w-2 h-2 bg-cyan-300 rounded-sm ${isWheelFast ? '' : 'animate-ping'}`} />
              </div>
            </div>
            <div className="absolute w-12 h-12 border border-cyan-500/20" />
          </div>
        );

      case 'botanical_vintage':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-lime-400/60 bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_10px_rgba(132,204,22,0.3)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-lime-300" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L12 22M12 2C8 6 4 10 4 15a8 8 0 0 0 8 7M12 2c4 4 8 8 8 13a8 8 0 0 1-8 7" />
                <path d="M12 6c-2 2-3 4-3 6m3-6c2 2 3 4 3 6m-3-1c-2 2-2 4-2 6m2-6c2 2 2 4 2 6" />
              </svg>
            </div>
            <div className="absolute -inset-1.5 rounded-full border border-amber-300/40 border-double" />
          </div>
        );

      case 'mystic_cat':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-rose-400/60 bg-gradient-to-br from-purple-950 via-zinc-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_12px_rgba(244,63,94,0.4)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-300" fill="currentColor">
                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 4c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5-5 2.2-5 5zm9.5-8L19 3l-3.5 2.5C14.3 5.2 13.2 5 12 5s-2.3.2-3.5.5L5 3l2.5 3C6 7.3 5 9 5 11c0 3.9 3.1 7 7 7s7-3.1 7-7c0-2-1-3.7-2.5-5z" />
              </svg>
            </div>
            <div className="absolute inset-0 rotate-45 border border-rose-400/40" />
          </div>
        );

      case 'five_elements_emerald':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border-2 border-emerald-400/80 bg-gradient-to-tr from-emerald-950 via-teal-950 to-zinc-950 flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_14px_rgba(16,185,129,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-300" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-5.66-13.66A8 8 0 0 0 12 14a2 2 0 1 1 0-4 2 2 0 0 0 0-4 8 8 0 0 1 0 16z" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-full border border-emerald-300/40 border-dashed" />
          </div>
        );

      case 'amethyst_violet':
      case 'solfeggio_violet': // Legacy persisted card-back ID.
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-violet-400/70 bg-gradient-to-b from-purple-900/60 to-zinc-950 flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_15px_rgba(168,85,247,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-violet-200" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <span className="absolute -bottom-3 text-[6px] font-mono text-violet-300/80 font-bold">AMETHYST</span>
          </div>
        );

      case 'sedona_red_rock':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-orange-400/80 bg-gradient-to-tr from-amber-950 via-red-950 to-zinc-950 flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_15px_rgba(249,115,22,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300" fill="currentColor">
                <path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9zm-8 11l4 7h12l-5-7z" />
              </svg>
            </div>
            <div className="absolute inset-0 rotate-45 border border-amber-400/40" />
          </div>
        );

      case 'hoponopono_pearl':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border-2 border-teal-300/80 bg-gradient-to-tr from-cyan-950 via-teal-900/80 to-sky-950 flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_15px_rgba(45,212,191,0.5)]'}`}>
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-white via-teal-100 to-teal-300" />
            </div>
            <div className={`absolute -inset-1.5 rounded-full border border-teal-400/30 ${isWheelFast ? '' : 'animate-spin'}`} />
          </div>
        );

      case 'golden_scarab':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-amber-400/80 bg-gradient-to-b from-yellow-950 via-amber-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_14px_rgba(245,158,11,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-300" fill="currentColor">
                <path d="M12 2a3 3 0 0 0-3 3c0 .7.2 1.4.7 1.9C7.8 8.1 7 9.9 7 12c0 2.2.9 4 2.2 5.3-.4.6-.7 1.3-.7 2 0 1.7 1.3 3 3 3s3-1.3 3-3c0-.7-.3-1.4-.7-2 1.3-1.3 2.2-3.1 2.2-5.3 0-2.1-.8-3.9-2.7-5.1.5-.5.7-1.2.7-1.9a3 3 0 0 0-3-3z" />
              </svg>
            </div>
            <div className="absolute -inset-1 border border-amber-400/40 rotate-45" />
          </div>
        );

      case 'dark_gothic':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 border border-rose-600/70 bg-gradient-to-b from-rose-950 via-zinc-950 to-black flex items-center justify-center rotate-45 ${isWheelFast ? '' : 'shadow-[0_0_14px_rgba(225,29,72,0.4)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-300 -rotate-45" fill="currentColor">
                <path d="M11 2v7H4v4h7v9h2v-9h7V9h-7V2h-2z" />
              </svg>
            </div>
            <div className="absolute w-12 h-12 border border-rose-900/60" />
          </div>
        );

      case 'classic_waite':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 border border-blue-400/70 bg-gradient-to-br from-blue-950 via-zinc-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_12px_rgba(59,130,246,0.4)]'}`}>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute inset-0 border border-blue-300/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 border border-yellow-300/80" />
              </div>
            </div>
          </div>
        );

      case 'aurora_borealis':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-emerald-300/70 bg-gradient-to-br from-teal-900 via-emerald-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_15px_rgba(52,211,153,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 15c4-6 8-6 12 0s8 6 8 0" />
                <path d="M2 9c4-6 8-6 12 0s8 6 8 0" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-full border border-emerald-400/30 border-dashed" />
          </div>
        );

      case 'solomon_pentacle':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border-2 border-yellow-400/90 bg-gradient-to-b from-amber-950 via-zinc-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_16px_rgba(251,191,36,0.6)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-300" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
              </svg>
            </div>
            <div className="absolute -inset-1 border border-yellow-400/40 rotate-45" />
          </div>
        );

      case 'obsidian_minimal':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className="w-8 h-8 border border-slate-400/60 bg-zinc-950 flex items-center justify-center">
              <div className="w-3.5 h-3.5 border border-slate-300/80 rotate-45" />
            </div>
          </div>
        );

      case 'sacred_mandala':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-pink-400/70 bg-gradient-to-tr from-purple-950 via-rose-950 to-zinc-950 flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_14px_rgba(236,72,153,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-300" fill="currentColor">
                <path d="M12 2c1.5 2.5 1.5 5.5 0 8-1.5-2.5-1.5-5.5 0-8zm0 12c1.5 2.5 1.5 5.5 0 8-1.5-2.5-1.5-5.5 0-8zm-5-3c2.5-1.5 5.5-1.5 8 0-2.5 1.5-5.5 1.5-8 0zm-5 0c2.5-1.5 5.5-1.5 8 0-2.5 1.5-5.5 1.5-8 0z" />
              </svg>
            </div>
            <div className={`absolute -inset-1 rounded-full border border-pink-400/30 border-dotted ${isWheelFast ? '' : 'animate-spin'}`} />
          </div>
        );

      case 'alchemical_ouroboros':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border-2 border-amber-600/80 bg-gradient-to-b from-stone-900 via-amber-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_14px_rgba(217,119,6,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="8" />
                <path d="M16 8l3-3-3-3" />
              </svg>
            </div>
            <div className="absolute inset-0 rotate-45 border border-amber-500/40" />
          </div>
        );

      case 'starlight_constellation':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-blue-400/70 bg-gradient-to-tr from-sky-950 via-indigo-950 to-black flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_14px_rgba(96,165,250,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-200" fill="currentColor">
                <path d="M12 2l1.5 4.5H18l-3.8 2.8 1.5 4.7-3.7-2.7-3.7 2.7 1.5-4.7L6 6.5h4.5zM6 18l.8 2.2H9l-1.9 1.4.8 2.4-1.9-1.4-1.9 1.4.8-2.4L3 20.2h2.2zM18 18l.8 2.2H21l-1.9 1.4.8 2.4-1.9-1.4-1.9 1.4.8-2.4L15 20.2h2.2z" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-full border border-blue-400/30" />
          </div>
        );

      case 'rose_gold_angel':
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className={`w-9 h-9 rounded-full border border-rose-300/80 bg-gradient-to-b from-pink-950 via-rose-950 to-stone-950 flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_14px_rgba(251,113,133,0.5)]'}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-200" fill="currentColor">
                <path d="M12 4a3 3 0 0 0-3 3c0 1.2.7 2.3 1.7 2.8C8 11.2 5 14 5 18h14c0-4-3-6.8-5.7-8.2 1-.5 1.7-1.6 1.7-2.8a3 3 0 0 0-3-3z" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-full border border-rose-300/40 border-double" />
          </div>
        );

      case 'celestial_gold':
      default:
        return (
          <div className={`relative flex items-center justify-center ${iconScale}`}>
            <div className="absolute inset-0 rotate-45 border border-amber-500/35" />
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-400/60 bg-gradient-to-tr from-amber-600/40 to-yellow-300/40 flex items-center justify-center ${isWheelFast ? '' : 'shadow-[0_0_8px_rgba(234,179,8,0.4)]'}`}>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-yellow-200" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.6z" />
              </svg>
            </div>
          </div>
        );
    }
  };

  const accentColor = theme.accentColor || '#eab308';
  const oracleWheelBackgrounds: Record<string, string> = {
    oracle_healing: `radial-gradient(ellipse at 50% 50%, ${accentColor}55 0 8%, transparent 8.5%), repeating-linear-gradient(45deg, transparent 0 8px, ${accentColor}18 8px 9px, transparent 9px 16px), linear-gradient(145deg, #3b1726, #130a17 58%, #2d1424)`,
    oracle_growth: `radial-gradient(circle at 50% 30%, ${accentColor}66 0 11%, transparent 11.5%), repeating-conic-gradient(from 0deg at 50% 30%, ${accentColor}20 0deg 5deg, transparent 5deg 30deg), linear-gradient(145deg, #4a2c0e, #17100a 58%, #38200a)`,
    oracle_miracle: `radial-gradient(circle at 50% 50%, ${accentColor}55 0 5%, transparent 5.5% 14%, ${accentColor}30 14.5% 16%, transparent 16.5% 26%, ${accentColor}24 26.5% 28%, transparent 28.5%), repeating-conic-gradient(from 15deg at 50% 50%, ${accentColor}18 0deg 8deg, transparent 8deg 30deg), linear-gradient(145deg, #2c1c54, #100b21 58%, #211640)`,
  };
  const isOracleBack = theme.id.startsWith('oracle_');

  if (theme.artworkUrl) {
    return <div data-tarot-back={theme.id} className={`absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl select-none pointer-events-none ${className}`}
      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', boxShadow: isHovered ? 'inset 0 0 0 2px white, 0 0 16px #ffffff55' : undefined }}>
      <img src={theme.artworkUrl} alt="" draggable={false} decoding="async" className="absolute inset-0 w-full h-full object-cover" />
      {isHovered && <div className="absolute inset-0 rounded-[inherit] border-2 border-white/90" />}
    </div>;
  }

  // 🌟 78장 휠 카드 전용 초경량 단일 레이어 렌더링 (중첩 DOM·SVG 800여 개 제거 -> 60~120fps 무저항 스핀)
  if (isWheelFast) {
    return (
      <div
        className={`absolute inset-0 w-full h-full rounded-lg sm:rounded-xl flex items-center justify-center pointer-events-none select-none ${className}`}
        style={{
          border: isHovered ? '2px solid rgba(255, 255, 255, 0.96)' : `1px solid ${accentColor}88`,
          backgroundImage: oracleWheelBackgrounds[theme.id] || `radial-gradient(circle at 50% 50%, ${accentColor}33 0 3%, transparent 3.5% 17%, ${accentColor}22 17.5% 18.5%, transparent 19% 31%, ${accentColor}1f 31.5% 32.5%, transparent 33%), repeating-conic-gradient(from 22.5deg at 50% 50%, ${accentColor}12 0deg 4deg, transparent 4deg 45deg), radial-gradient(ellipse at 18% 0%, ${accentColor}30 0%, transparent 48%), linear-gradient(145deg, #211638, #090613 56%, #1b102b)`,
          boxShadow: isHovered
            ? '0 0 22px rgba(255, 255, 255, 0.58), 0 8px 24px rgba(0, 0, 0, 0.65), inset 0 0 0 1.5px rgba(255, 255, 255, 0.45)'
            : `inset 0 0 0 2px ${accentColor}22`,
          transition: 'border-color 260ms ease-out, box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {isOracleBack ? renderThemeArtwork() : (
          <span
            className="text-xl sm:text-2xl leading-none"
            style={{ color: accentColor, textShadow: `0 0 12px ${accentColor}aa` }}
          >
            ✦
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        border: isHovered ? '2px solid rgba(255, 255, 255, 0.96)' : undefined,
        boxShadow: isHovered
          ? '0 0 22px rgba(255, 255, 255, 0.58), 0 10px 28px rgba(0, 0, 0, 0.65), inset 0 0 0 1.5px rgba(255, 255, 255, 0.45)'
          : undefined,
        transition: 'border-color 260ms ease-out, box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`absolute inset-0 w-full h-full ${theme.id === 'oracle_healing' ? 'bg-gradient-to-b from-rose-950 via-[#170914] to-black' : theme.id === 'oracle_growth' ? 'bg-gradient-to-b from-amber-950 via-[#171006] to-black' : theme.id === 'oracle_miracle' ? 'bg-gradient-to-b from-violet-950 via-[#10091c] to-black' : 'bg-gradient-to-b from-[#100826] via-[#090514] to-black'} rounded-xl sm:rounded-2xl flex flex-col items-center justify-between p-1.5 sm:p-2 overflow-hidden select-none shadow-2xl ${className}`}
    >
      {/* Outer filigree border */}
      <div
        className={`absolute inset-1 sm:inset-1.5 border rounded-lg sm:rounded-xl pointer-events-none transition-colors duration-300 ${
          isHovered ? 'border-white/90' : theme.borderClass
        }`}
      />

      {/* Inner frame with moon/star motifs */}
      <div
        className="absolute inset-2 sm:inset-2.5 border rounded-md sm:rounded-lg bg-black/40 flex flex-col justify-between items-center p-1 sm:p-1.5 pointer-events-none"
        style={{ borderColor: `${accentColor}33` }}
      >
        {/* Top mode-specific emblem */}
        <div
          className="flex items-center gap-1 opacity-80 text-[6px] sm:text-[7px]"
          style={{ color: accentColor }}
        >
          {theme.id === 'oracle_healing' ? <><span>❧</span><span className="text-[7px] sm:text-[8px]">❀</span><span>❧</span></>
            : theme.id === 'oracle_growth' ? <><span>△</span><span className="text-[7px] sm:text-[8px]">☼</span><span>△</span></>
              : theme.id === 'oracle_miracle' ? <><span>✧</span><span className="text-[7px] sm:text-[8px]">❋</span><span>✧</span></>
                : <><span>☽</span><span className="text-[7px] sm:text-[8px]">✧</span><span>☾</span></>}
        </div>

        {/* Center Thematic Sacred Artwork */}
        <div className="my-auto py-1 flex items-center justify-center">
          {renderThemeArtwork()}
        </div>

        {/* Bottom mode-specific emblem */}
        <div
          className="flex items-center gap-1 opacity-80 text-[6px] sm:text-[7px] rotate-180"
          style={{ color: accentColor }}
        >
          {theme.id === 'oracle_healing' ? <><span>❧</span><span className="text-[7px] sm:text-[8px]">❀</span><span>❧</span></>
            : theme.id === 'oracle_growth' ? <><span>△</span><span className="text-[7px] sm:text-[8px]">☼</span><span>△</span></>
              : theme.id === 'oracle_miracle' ? <><span>✧</span><span className="text-[7px] sm:text-[8px]">❋</span><span>✧</span></>
                : <><span>☽</span><span className="text-[7px] sm:text-[8px]">✧</span><span>☾</span></>}
        </div>
      </div>

      {/* Shimmer light sweep - only rendered in preview or hovered state */}
      {(isPreview || isHovered) && (
        <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 pointer-events-none" />
      )}
    </div>
  );
});
