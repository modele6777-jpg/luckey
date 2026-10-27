import React from "react";
import { Clover } from "lucide-react";

interface LucKeyLogoTextProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * 🍀🗝️ LucKeyLogoText
 * 
 * Expresses the 3-in-1 synthesis of LUCY · LUCKY · KEY in the 6-letter brand word "LUCKEY":
 * - LUC (LUCY): Luminous Starlight Pure White & Soft Diamond Glow
 * - KE (KEY / LUCK): Radiant Imperial Gold of Destiny & Solar Energy
 * - Y (CLOVER / SEED): Sacred Emerald Jade of Hope, Life & Miraculous Luck
 */
export function LucKeyLogoText({
  className = "",
  size = "md",
}: LucKeyLogoTextProps) {
  const sizeClasses = {
    sm: "text-base tracking-tighter",
    md: "text-lg md:text-xl tracking-tighter",
    lg: "text-2xl md:text-3xl tracking-tight",
    xl: "text-3xl sm:text-4xl tracking-[0.24em]",
  }[size];

  return (
    <span
      className={`font-display font-black uppercase leading-tight inline-flex items-center select-none ${sizeClasses} ${className}`}
      title="LUCKEY · LUCY · LUCKY · KEY"
    >
      {/* LUCK: Radiant Emerald Green (L, U, C, K 초록색) */}
      <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(52,211,153,0.85)]">
        LUCK
      </span>
      {/* E: Radiant Imperial Gold & Solar Yellow (E만 노란색) */}
      <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(251,191,36,0.85)]">
        E
      </span>
      {/* Y: Radiant Emerald Green (Y 초록색) */}
      <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(52,211,153,0.85)]">
        Y
      </span>
      <Clover
        aria-hidden="true"
        className="luckey-logo-clover shrink-0 text-emerald-400"
        style={{ width: "0.65em", height: "0.65em", marginLeft: "0.28em" }}
        strokeWidth={1.8}
      />
    </span>
  );
}

export default LucKeyLogoText;
