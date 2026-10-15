import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  RefreshCw,
  Sparkles,
  Pause,
  Play,
  RotateCcw,
  Palette,
  BookOpen,
  Music,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getTodayDateKey } from "@/lib/dailyCache";
import { playTTS, playTTSInChunks, stopTTS, pauseTTS, resumeTTS, subscribeTTS, prefetchTTS, prefetchTTSChunks } from "@/utils/tts";
import { getTTSAudioElement, isTTSAudioPlaying } from "@/lib/audio";

type PlayerPhase = "idle" | "preparing" | "speaking" | "paused" | "done" | "error";

export interface MuseDocentArtwork {
  imageUrl: string;
  title: string;
  creator: string;
  artworkType: string;
  era: string;
  description: string;
  whyRecommended: string;
  aestheticTone?: string;
  quote?: string;
  famousPoem?: {
    title: string;
    titleOriginal?: string;
    poet: string;
    poetOriginal?: string;
    excerpt?: string;
    whyRecommended?: string;
  };
  famousSong?: {
    title: string;
    titleOriginal?: string;
    artist: string;
    artistOriginal?: string;
    listeningGuide?: string;
  };
}

interface MuseDocentAudioProps {
  artwork: MuseDocentArtwork;
}

function docentCacheKey(artwork: MuseDocentArtwork): string {
  const poem = artwork.famousPoem?.title || "poem";
  const song = artwork.famousSong?.title || "song";
  return `muse_docent_trio_v5_${getTodayDateKey()}_${artwork.title}_${poem}_${song}`;
}

function splitDocentScript(text: string): string[] {
  if (!text) return [];
  const paragraphs = text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    return paragraphs;
  }

  const sentences = text.match(/[^.!?。…]+[.!?。…]?/gu)?.map((part) => part.trim()).filter(Boolean);
  return sentences?.length ? sentences : [text.trim()];
}

async function readDocentResponse(response: Response): Promise<{ reply?: string; error?: string }> {
  const raw = await response.text();
  if (!raw.trim()) {
    throw new Error(`도슨트 서버가 빈 응답을 반환했습니다. (${response.status})`);
  }

  try {
    return JSON.parse(raw) as { reply?: string; error?: string };
  } catch {
    const snippet = raw.replace(/\s+/g, " ").trim().slice(0, 160);
    throw new Error(
      response.ok
        ? `도슨트 응답을 해석하지 못했습니다: ${snippet}`
        : `도슨트 서버 오류 (${response.status}): ${snippet}`,
    );
  }
}

export function MuseDocentAudio({ artwork }: MuseDocentAudioProps) {
  const [expanded, setExpanded] = useState(false);
  const [phase, setPhase] = useState<PlayerPhase>("idle");
  const [script, setScript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingTts, setIsLoadingTts] = useState(false);
  const [showFullScript, setShowFullScript] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const abortRef = useRef(false);
  const playbackRunRef = useRef(0);
  const pausedRef = useRef(false);

  const persistScript = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      localStorage.setItem(docentCacheKey(artwork), text);
    },
    [artwork],
  );

  const hasTrioContent = !!(
    artwork.famousPoem?.title
    && artwork.famousSong?.title
  );

  const fetchScript = useCallback(async () => {
    const response = await fetch("/api/muse/docent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: artwork.imageUrl,
        title: artwork.title,
        creator: artwork.creator,
        artworkType: artwork.artworkType,
        era: artwork.era,
        description: artwork.description,
        whyRecommended: artwork.whyRecommended,
        aestheticTone: artwork.aestheticTone,
        quote: artwork.quote,
        famousPoem: artwork.famousPoem,
        famousSong: artwork.famousSong,
        messages: [],
        isFirstMessage: true,
        mode: "audio",
      }),
    });

    const data = await readDocentResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "도슨트 음성 스크립트를 받지 못했습니다.");
    }
    if (!data.reply?.trim()) {
      throw new Error("도슨트 음성 스크립트가 비어 있습니다.");
    }

    return data.reply as string;
  }, [artwork]);

  const prepareScript = useCallback(
    (narration: string) => {
      setScript(narration);
      const parsed = splitDocentScript(narration);
      setParagraphs(parsed);
      persistScript(narration);

      // Pre-warm audio in background (초반 청크들을 미리 로드하여 클릭 즉시 1번째 문장부터 매끄럽게 시작)
      prefetchTTSChunks(narration, "Kore", 150, "차분");
      return parsed;
    },
    [persistScript],
  );

  // Background pre-warm on render so audio is 100% ready before user clicks!
  useEffect(() => {
    if (!hasTrioContent) return;
    const cacheKey = docentCacheKey(artwork);
    const cached = localStorage.getItem(cacheKey);
    if (cached?.trim()) {
      prepareScript(cached);
      prefetchTTSChunks(cached, "Kore", 150, "차분");
      return;
    }

    const timer = setTimeout(() => {
      fetchScript()
        .then((narration) => {
          if (narration?.trim()) {
            prepareScript(narration);
            prefetchTTSChunks(narration, "Kore", 150, "차분");
          }
        })
        .catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, [artwork.imageUrl, artwork.title, artwork.famousPoem?.title, artwork.famousSong?.title, hasTrioContent, fetchScript, prepareScript]);

  useEffect(() => {
    return subscribeTTS((state) => {
      setIsSpeaking(state.isSpeaking);
      setIsLoadingTts(state.isLoading);
      if (!state.isSpeaking && !state.isLoading && phase === "speaking" && !pausedRef.current) {
        setPhase("done");
      }
    });
  }, [phase]);

  useEffect(() => {
    abortRef.current = false;
    playbackRunRef.current += 1;
    pausedRef.current = false;
    setExpanded(false);
    setPhase("idle");
    setScript("");
    setParagraphs([]);
    setShowFullScript(false);
    setError(null);
    stopTTS();
  }, [artwork.imageUrl, artwork.title, artwork.famousPoem?.title, artwork.famousSong?.title]);

  const startAudioPlayback = useCallback(async (narrationText: string) => {
    // 1. 기존 진행 중인 모든 재생을 정지하고 세션 초기화
    stopTTS();
    pausedRef.current = false;
    abortRef.current = false;
    const playbackRun = ++playbackRunRef.current;
    setPhase("speaking");

    try {
      // 긴 도슨트 전체를 자연스러운 문장 단위(150자) 파이프라인 프리페칭 스트리밍으로 1번째 문장부터 순차 재생
      await playTTSInChunks(narrationText, "Kore", 150, "차분");
      if (playbackRunRef.current === playbackRun && !abortRef.current && !pausedRef.current) {
        setPhase("done");
      }
    } catch (err) {
      if (playbackRunRef.current !== playbackRun) return;
      console.warn("[MuseDocentAudio] playback error:", err);
      const message = err instanceof Error ? err.message : "음성 재생 오류가 발생했습니다.";
      setError(message);
      setPhase("error");
    }
  }, []);

  const startGuide = useCallback(async () => {
    if (!hasTrioContent) {
      setError("오늘의 명시·명곡 정보가 준비되면 도슨트를 들을 수 있습니다.");
      setPhase("error");
      return;
    }

    abortRef.current = false;
    pausedRef.current = false;
    playbackRunRef.current += 1;
    setExpanded(true);
    setError(null);
    stopTTS();

    try {
      const audio = getTTSAudioElement();
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
    } catch (_) {}

    const cacheKey = docentCacheKey(artwork);
    const cached = localStorage.getItem(cacheKey);

    if (cached?.trim()) {
      prepareScript(cached);
      setPhase("preparing");
      await startAudioPlayback(cached);
      return;
    }

    setPhase("preparing");

    try {
      const narration = await fetchScript();
      if (abortRef.current) return;

      prepareScript(narration);
      await startAudioPlayback(narration);
    } catch (err) {
      const message = err instanceof Error ? err.message : "음성 가이드 오류";
      setError(message);
      setPhase("error");
    }
  }, [artwork, fetchScript, hasTrioContent, prepareScript, startAudioPlayback]);

  const handlePauseResume = () => {
    const audio = getTTSAudioElement();

    if (phase === "speaking" || isSpeaking || isTTSAudioPlaying()) {
      pausedRef.current = true;
      audio.pause();
      pauseTTS();
      setPhase("paused");
      return;
    }

    if (phase === "paused" && audio.src) {
      pausedRef.current = false;
      audio.play().catch(() => {});
      resumeTTS();
      setPhase("speaking");
      return;
    }

    if (script.trim()) {
      void startAudioPlayback(script);
    }
  };

  // 🌟 '처음부터' 다시 듣기: 현재 진행 상태와 무관하게 1번째 문장부터 온전히 처음부터 낭독
  const handleReplay = async () => {
    let textToPlay = script.trim() || localStorage.getItem(docentCacheKey(artwork))?.trim() || "";

    // 1. 기존 재생 및 오디오 엘리먼트/TTS 상태 완전 중단
    stopTTS();
    pausedRef.current = false;
    abortRef.current = false;
    const playbackRun = ++playbackRunRef.current;

    try {
      const audio = getTTSAudioElement();
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    } catch (_) {}

    // 스크립트가 아직 없으면 새로 fetch
    if (!textToPlay) {
      setPhase("preparing");
      try {
        textToPlay = await fetchScript();
        if (playbackRunRef.current !== playbackRun || abortRef.current) return;
        prepareScript(textToPlay);
      } catch (e) {
        if (playbackRunRef.current !== playbackRun) return;
        setError("도슨트 음성을 불러오지 못했습니다.");
        setPhase("error");
        return;
      }
    }

    // 짧은 대기(80ms)로 이전 오디오 세션 리소스가 완전히 해제되도록 보장
    await new Promise((resolve) => setTimeout(resolve, 80));
    if (playbackRunRef.current !== playbackRun || abortRef.current) return;

    // 2. 전체 스크립트 1번째 문장부터 스트리밍 시작
    setPhase("speaking");
    try {
      await playTTSInChunks(textToPlay, "Kore", 150, "차분");
      if (playbackRunRef.current === playbackRun && !abortRef.current && !pausedRef.current) {
        setPhase("done");
      }
    } catch (err) {
      if (playbackRunRef.current !== playbackRun) return;
      console.warn("[MuseDocentAudio] replay error:", err);
      const message = err instanceof Error ? err.message : "음성 재생 오류가 발생했습니다.";
      setError(message);
      setPhase("error");
    }
  };

  const handleClose = () => {
    pausedRef.current = true;
    abortRef.current = true;
    playbackRunRef.current += 1;
    stopTTS();

    if (script.trim()) {
      persistScript(script);
    }

    setExpanded(false);
    setPhase("idle");
  };

  const isActive = phase === "speaking" || phase === "preparing" || isSpeaking || isLoadingTts;

  return (
    <div className="space-y-3">
      {!expanded && (
        <button
          onClick={() => void startGuide()}
          disabled={!hasTrioContent}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600/90 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 size={15} />
          명곡·명시·명화 음성 도슨트 (수석 큐레이터 해설)
        </button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-[24px] border border-blue-500/20 bg-gradient-to-b from-blue-950/40 to-[#060a14]/90 p-5 md:p-6 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center shrink-0">
                    <Sparkles size={16} className="text-blue-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">오디오 도슨트</p>
                    <p className="text-[10px] text-blue-300/60 break-keep break-words">국립박물관 수석 큐레이터 연속 해설 (명곡 → 명시 → 명화)</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-[10px] text-white/40 hover:text-white/70 uppercase tracking-widest font-bold cursor-pointer"
                >
                  닫기
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/15 px-3 py-2.5 text-center min-w-0">
                  <Music size={12} className="mx-auto text-rose-300 mb-1" />
                  <p className="text-[8px] font-mono text-rose-300/70 mb-0.5">1단계 · 명곡</p>
                  <p className="text-[9px] font-bold text-rose-200/90 break-words leading-snug">{artwork.famousSong?.title}</p>
                </div>
                <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/15 px-3 py-2.5 text-center min-w-0">
                  <BookOpen size={12} className="mx-auto text-indigo-300 mb-1" />
                  <p className="text-[8px] font-mono text-indigo-300/70 mb-0.5">2단계 · 명시</p>
                  <p className="text-[9px] font-bold text-indigo-200/90 break-words leading-snug">{artwork.famousPoem?.title}</p>
                </div>
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/15 px-3 py-2.5 text-center min-w-0">
                  <Palette size={12} className="mx-auto text-blue-300 mb-1" />
                  <p className="text-[8px] font-mono text-blue-300/70 mb-0.5">3단계 · 명화</p>
                  <p className="text-[9px] font-bold text-blue-200/90 break-words leading-snug">{artwork.title}</p>
                </div>
              </div>

              {/* Sound Wave Animation Visualizer (Mobile Minimalist & Sleek) */}
              <div className="relative flex flex-col items-center py-2 sm:py-4">
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
                  {phase === "speaking" && (
                    <>
                      <motion.span
                        className="absolute inset-0 rounded-full border border-blue-400/30"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.span
                        className="absolute inset-2 rounded-full border border-indigo-400/25"
                        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      />
                    </>
                  )}
                  <div
                    className={`relative w-12 h-12 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                      phase === "speaking"
                        ? "bg-gradient-to-br from-blue-500/30 to-indigo-500/30 shadow-[0_0_40px_rgba(59,130,246,0.35)]"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {phase === "preparing" || isLoadingTts ? (
                      <RefreshCw size={18} className="text-blue-300 animate-spin sm:w-6 sm:h-6" />
                    ) : phase === "speaking" ? (
                      <div className="flex items-end gap-0.5 sm:gap-1 h-5 sm:h-7">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.span
                            key={i}
                            className="w-0.5 sm:w-1 rounded-full bg-blue-300"
                            animate={{ height: ["20%", "100%", "30%"] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.12,
                              ease: "easeInOut",
                            }}
                            style={{ height: "40%" }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Volume2 size={18} className="text-blue-300/80 sm:w-6 sm:h-6" />
                    )}
                  </div>
                </div>

                <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.25em] text-blue-300/70 text-center">
                  {phase === "preparing" && "도슨트 음성 준비 중..."}
                  {phase === "speaking" && "🎙️ 큐레이터 해설 낭독 중"}
                  {phase === "paused" && "일시 정지됨"}
                  {phase === "done" && "낭독 완료"}
                  {phase === "error" && "오류 발생"}
                  {phase === "idle" && expanded && "도슨트 준비 완료"}
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-300 text-center">{error}</p>
              )}

              {/* Playback Controls */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={handlePauseResume}
                  disabled={!script && phase !== "preparing"}
                  className="px-4 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-500/90 border border-blue-400/30 text-[11px] font-bold text-white flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-md"
                >
                  {phase === "speaking" ? <Pause size={13} /> : <Play size={13} />}
                  {phase === "speaking"
                    ? "일시정지"
                    : phase === "paused"
                      ? "이어 듣기"
                      : "재생"}
                </button>
                <button
                  onClick={handleReplay}
                  disabled={!script}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-[11px] font-bold text-white/80 flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  처음부터
                </button>
                {script && (
                  <button
                    type="button"
                    onClick={() => setShowFullScript(!showFullScript)}
                    className="px-3.5 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-200 border border-blue-400/30 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <FileText size={13} />
                    <span>{showFullScript ? "대본 접기" : "전체 대본 보기"}</span>
                    {showFullScript ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                )}
              </div>

              {/* 📜 Full Script Viewer Box */}
              <AnimatePresence>
                {showFullScript && script && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="w-full rounded-2xl bg-black/60 border border-blue-400/20 p-5 space-y-3 backdrop-blur-xl transition-all shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                          <FileText size={14} className="text-blue-400" />
                          <span>도슨트 해설 전문 (전체 대본)</span>
                        </div>
                        <span className="text-[10px] text-white/40 font-mono">
                          {paragraphs.length}개 문단 구성
                        </span>
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-blue-500/30 text-xs sm:text-sm text-white/90 leading-relaxed font-sans select-text">
                        {paragraphs.map((p, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 hover:bg-white/[0.06] transition-all"
                          >
                            <p className="text-[10px] font-mono font-bold text-blue-300/70">
                              SECTION {idx + 1}
                            </p>
                            <p className="break-keep leading-relaxed text-white/85">{p}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
