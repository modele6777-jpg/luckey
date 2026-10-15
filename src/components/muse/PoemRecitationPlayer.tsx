import React from "react";
import { Volume2, VolumeX, Square, Loader2, Sparkles, User, Waves } from "lucide-react";
import {
  usePoemRecitation,
  PoemItemForSpeech,
  PoemRecitationVoice,
} from "@/services/poemRecitationService";

interface PoemRecitationPlayerProps {
  poem: PoemItemForSpeech;
  variant?: "full" | "compact" | "inline";
  className?: string;
}

export const PoemRecitationPlayer: React.FC<PoemRecitationPlayerProps> = ({
  poem,
  variant = "full",
  className = "",
}) => {
  const {
    isSpeaking,
    isLoading,
    activePoemTitle,
    voice,
    includeInsight,
    isPoemPlaying,
    togglePoem,
    stop,
    setVoice,
    setIncludeInsight,
  } = usePoemRecitation();

  const isCurrentPoemActive = isPoemPlaying(poem.id || poem.title);
  const isThisLoading = isCurrentPoemActive && isLoading;
  const isThisSpeaking = isCurrentPoemActive && isSpeaking;

  // Inline / Small icon button (e.g. For list items)
  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          togglePoem(poem);
        }}
        title={isThisSpeaking ? "시 낭송 중지" : `"${poem.title}" 시 낭송 듣기`}
        aria-label={isThisSpeaking ? "시 낭송 중지" : `"${poem.title}" 시 낭송 듣기`}
        className={`p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
          isThisSpeaking
            ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30 animate-pulse"
            : isThisLoading
            ? "bg-emerald-500/20 text-emerald-300"
            : "text-zinc-400 hover:text-emerald-300 hover:bg-white/10"
        } ${className}`}
      >
        {isThisLoading ? (
          <Loader2 size={13} className="animate-spin text-emerald-400" />
        ) : isThisSpeaking ? (
          <Waves size={13} className="animate-bounce" />
        ) : (
          <Volume2 size={13} />
        )}
      </button>
    );
  }

  // Compact bar (e.g. for sub-headers)
  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => togglePoem(poem)}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
          isThisSpeaking
            ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/25 font-bold"
            : isThisLoading
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25"
        } ${className}`}
      >
        {isThisLoading ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span>음성 준비 중...</span>
          </>
        ) : isThisSpeaking ? (
          <>
            <Square size={12} className="fill-current" />
            <span>낭송 멈춤</span>
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-black rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-1 h-4 bg-black rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
              <span className="w-1 h-2 bg-black rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" />
            </span>
          </>
        ) : (
          <>
            <Volume2 size={13} />
            <span>시 낭송 듣기 (TTS)</span>
          </>
        )}
      </button>
    );
  }

  // Full tactile control panel (for detail views and cards)
  return (
    <div
      className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-zinc-950/90 border border-emerald-500/20 shadow-lg space-y-3 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Main Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => togglePoem(poem)}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
              isThisSpeaking
                ? "bg-emerald-400 text-black shadow-emerald-500/30 hover:bg-emerald-300"
                : isThisLoading
                ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 cursor-wait"
                : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {isThisLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>음성 합성 중...</span>
              </>
            ) : isThisSpeaking ? (
              <>
                <Square size={13} className="fill-current" />
                <span>낭송 중지</span>
              </>
            ) : (
              <>
                <Volume2 size={15} />
                <span>시 낭송 듣기 (TTS)</span>
              </>
            )}
          </button>

          {/* Sound wave / Equalizer animation when speaking */}
          {isThisSpeaking && (
            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <span className="text-[10px] font-mono text-emerald-300 mr-1 font-semibold">
                낭송 중
              </span>
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s]" />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s]" />
              <span className="w-1 h-5 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.15s]" />
            </div>
          )}
        </div>

        {/* Right: Voice Switcher & Options */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Voice Switcher (서정 여성 / 온화 여성) */}
          <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setVoice("female")}
              title="서정적 여성 음성 (SunHi / Kore)"
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                voice === "female"
                  ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>🌸</span>
              <span>서정 여성</span>
            </button>
            <button
              type="button"
              onClick={() => setVoice("female")}
              title="온화하고 맑은 여성 음성 (SunHi / Kore)"
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                voice !== "female"
                  ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>🌿</span>
              <span>온화 여성</span>
            </button>
          </div>

          {/* Insight Recitation Checkbox */}
          {poem.whyRecommended && (
            <button
              type="button"
              onClick={() => setIncludeInsight(!includeInsight)}
              title="시 본문 낭송 후 시적 배경 및 해설도 함께 듣기"
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                includeInsight
                  ? "bg-teal-500/20 text-teal-200 border-teal-500/40"
                  : "bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-300"
              }`}
            >
              <Sparkles size={11} className={includeInsight ? "text-teal-300" : "text-zinc-500"} />
              <span>해설 포함</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
