import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";


export const SPECIAL_FEATURE_CHROME_HIDDEN_CLASS = "pointer-events-none opacity-0 select-none scale-95 duration-500 blur-sm";

type ChromeHideFlags = {
  feature: boolean;
  panel: boolean;
  drawing: boolean;
  explicit: boolean | null;
};

export function useSpecialFeatureChromeHidden(): boolean {
  const [isHidden, setIsHidden] = useState(false);
  const flagsRef = useRef<ChromeHideFlags>({
    feature: false,
    panel: false,
    drawing: false,
    explicit: null,
  });

  const syncHiddenState = useCallback(() => {
    const flags = flagsRef.current;
    if (flags.explicit !== null) {
      setIsHidden(flags.explicit);
      return;
    }
    setIsHidden(flags.feature || flags.panel || flags.drawing);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkWindowStatus = () => {
      const flags = flagsRef.current;
      flags.panel = !!(window as any).__lucy_active_panel;
      flags.drawing = (window as any).__lucy_canvas_drawing === true;
      syncHiddenState();
    };

    const handleToggle = (e: CustomEvent<boolean | { hidden: boolean }>) => {
      const flags = flagsRef.current;
      if (typeof e.detail === "boolean") {
        flags.explicit = e.detail;
      } else if (e.detail && typeof e.detail.hidden === "boolean") {
        flags.explicit = e.detail.hidden;
      } else {
        flags.explicit = null;
      }
      syncHiddenState();
    };

    const handleFeatureActive = () => {
      flagsRef.current.feature = true;
      flagsRef.current.explicit = null;
      syncHiddenState();
    };

    const handleFeatureInactive = () => {
      flagsRef.current.feature = false;
      flagsRef.current.explicit = null;
      syncHiddenState();
    };

    window.addEventListener("lucy-chrome-hidden", handleToggle as EventListener);
    window.addEventListener("tarot-active", handleFeatureActive);
    window.addEventListener("tarot-inactive", handleFeatureInactive);
    window.addEventListener("special-feature-active", handleFeatureActive);
    window.addEventListener("special-feature-inactive", handleFeatureInactive);

    checkWindowStatus();
    const interval = window.setInterval(checkWindowStatus, 1000);

    return () => {
      window.removeEventListener("lucy-chrome-hidden", handleToggle as EventListener);
      window.removeEventListener("tarot-active", handleFeatureActive);
      window.removeEventListener("tarot-inactive", handleFeatureInactive);
      window.removeEventListener("special-feature-active", handleFeatureActive);
      window.removeEventListener("special-feature-inactive", handleFeatureInactive);
      window.clearInterval(interval);
    };
  }, [syncHiddenState]);

  return isHidden;
}

interface SpecialFeatureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}

export function SpecialFeatureOverlay({
  isOpen,
  onClose,
  maxWidth = "4xl",
  children,
}: SpecialFeatureOverlayProps) {
  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Resolve max width class
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  }[maxWidth] || "max-w-4xl";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 overflow-x-hidden overflow-y-auto bg-black/80 backdrop-blur-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidthClass} bg-zinc-950/40 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl z-[125] cursor-default`}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface SpecialFeaturePanelProps {
  theme: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SpecialFeaturePanel({
  theme,
  title,
  subtitle,
  children,
}: SpecialFeaturePanelProps) {
  // Pick outline colors based on theme
  const glowColors: Record<string, string> = {
    trinity: "shadow-[0_0_50px_rgba(245,158,11,0.15)] border-amber-500/20",
    orange: "shadow-[0_0_50px_rgba(249,115,22,0.15)] border-orange-500/20",
    heal: "shadow-[0_0_50px_rgba(16,185,129,0.15)] border-emerald-500/20",
    muse: "shadow-[0_0_50px_rgba(139,92,246,0.15)] border-violet-500/20",
  };

  const currentGlow = glowColors[theme] || glowColors.trinity;

  return (
    <div className={`w-full min-h-[50vh] md:min-h-[60vh] max-h-[85vh] flex flex-col ${currentGlow}`}>
      {/* Panel Header */}
      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.01]">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-black tracking-tight text-white uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-white/40 mt-1 font-medium font-sans">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
        {children}
      </div>
    </div>
  );
}
