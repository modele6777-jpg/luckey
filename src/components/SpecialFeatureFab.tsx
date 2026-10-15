import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, BookMarked, Zap } from "lucide-react";
import { safeSessionStorage } from "@/utils/safeStorage";
import { getTossRule, executeSmartToss, type ChannelTossRule } from "@/lib/prismTossRegistry";
import { useSpecialFeatureChromeHidden, SPECIAL_FEATURE_CHROME_HIDDEN_CLASS } from "@/components/SpecialFeaturePanel";
import { playAudioHaptic } from "@/lib/audioHaptics";

interface SpecialFeatureFabGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function SpecialFeatureFabGroup({ children, className = "" }: SpecialFeatureFabGroupProps) {
  const isChromeHidden = useSpecialFeatureChromeHidden();
  const validChildren = React.Children.toArray(children).filter(Boolean);
  if (validChildren.length === 0) return null;

  return (
    <div
      className={`prism-xs-fab-group fixed bottom-safe-fab right-4 sm:right-6 z-[300] flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto transition-all duration-300 ${
        isChromeHidden ? SPECIAL_FEATURE_CHROME_HIDDEN_CLASS : "opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const THEME_ACTIVE_STYLES: Record<string, string> = {
  epilogue: "ring-2 ring-purple-400/90 shadow-[0_0_16px_rgba(192,132,252,0.6)]",
  prologue: "ring-2 ring-red-400/90 shadow-[0_0_16px_rgba(239,68,68,0.6)]",
  trinity: "ring-2 ring-yellow-300/90 shadow-[0_0_16px_rgba(234,179,8,0.6)]",
  orange: "ring-2 ring-orange-300/90 shadow-[0_0_16px_rgba(249,115,22,0.6)]",
  muse: "ring-2 ring-blue-300/90 shadow-[0_0_16px_rgba(59,130,246,0.6)]",
  heal: "ring-2 ring-emerald-300/90 shadow-[0_0_16px_rgba(16,185,129,0.6)]",
  aura: "ring-2 ring-emerald-300/90 shadow-[0_0_16px_rgba(16,185,129,0.6)]",
  bluebird: "ring-2 ring-sky-300/90 shadow-[0_0_16px_rgba(14,165,233,0.6)]",
};

interface SpecialFeatureButtonProps {
  theme: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  title: string;
  tooltipLabel: string;
  iconClassName?: string;
  onClick: () => void;
}

export function SpecialFeatureButton({
  theme,
  icon: Icon,
  isActive,
  tooltipLabel,
  iconClassName = "",
  onClick,
}: SpecialFeatureButtonProps) {
  const activeStyles = THEME_ACTIVE_STYLES[theme] ?? THEME_ACTIVE_STYLES.bluebird;

  return (
    <div className="relative group flex items-center justify-end">
      <div className="absolute right-14 scale-0 origin-right group-hover:scale-100 transition-all duration-200 bg-zinc-950/85 backdrop-blur-md border border-white/10 text-white text-[10px] py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap tracking-wide font-sans pointer-events-none z-50">
        {tooltipLabel}
      </div>

      <motion.button
        type="button"
        onClick={() => {
          playAudioHaptic('tap_light');
          onClick();
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 cursor-pointer relative overflow-hidden text-white backdrop-blur-xl border border-white/25 shadow-lg transition-all bg-gradient-to-tr from-slate-900/90 via-slate-800/80 to-slate-700/70 active:scale-95 ${
          isActive ? `scale-105 ${activeStyles}` : "hover:border-white/40"
        }`}
        aria-label={tooltipLabel}
      >
        {/* Specular Highlight */}
        <div className="absolute inset-x-2 top-0.5 h-2 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
        <Icon size={18} className={`w-[18px] h-[18px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${iconClassName}`} />
      </motion.button>
    </div>
  );
}

interface ChatFabButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Lucy FAB Button
 * Exact size identical to BGM Button (w-11 h-11 / 44px)
 * Distinctive Cosmic Starlight & Celestial AI Muse aesthetic
 * Positioned in Bottom-Right quadrant
 */
export function ChatFabButton({ onClick, className = "" }: ChatFabButtonProps) {
  return (
    <div className={`relative group flex items-center justify-end ${className}`}>
      <div className="absolute right-14 top-1/2 -translate-y-1/2 scale-0 origin-right group-hover:scale-100 transition-all duration-200 bg-zinc-950/85 backdrop-blur-md border border-purple-500/20 text-white text-[10px] py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap tracking-wide font-sans pointer-events-none z-50">
        Lucy • 영혼의 AI 가이드
      </div>

      <motion.button
        type="button"
        onClick={() => {
          playAudioHaptic('tap_light');
          onClick();
        }}
        whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.92 }}
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 cursor-pointer outline-none relative text-white border border-purple-300/40 ring-1 ring-purple-400/30 shadow-[0_0_16px_rgba(168,85,247,0.45),0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_24px_rgba(236,72,153,0.6),0_6px_16px_rgba(0,0,0,0.6)] active:scale-95 transition-all bg-gradient-to-tr from-[#1e1b4b] via-[#7c3aed] to-[#ec4899] overflow-hidden"
        aria-label="Lucy Chat"
      >
        {/* Crystal Glass Curved Highlight */}
        <div className="absolute inset-x-2 top-0.5 h-2 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-10" />

        {/* Starlight Sparkles Core Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
      </motion.button>
    </div>
  );
}

export interface PrismTossFabButtonProps {
  theme: string;
  isOpen?: boolean;
  tooltipLabel?: string;
  onClick?: () => void;
  contextData?: any;
}

/**
 * Prism Smart Toss FAB Button
 * 🌟 Note: Fully merged into the central BigBangButton (OmniWarp System)
 * Kept as a clean no-op component for 100% backward compatibility across all apps.
 */
export function PrismTossFabButton(_props: PrismTossFabButtonProps) {
  return null;
}

// 🌟 Full backward compatibility alias for seamless replacement across all apps
export { PrismTossFabButton as HandbookFabButton };
export type { PrismTossFabButtonProps as HandbookFabButtonProps };

