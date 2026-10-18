import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Disc, SkipForward, SkipBack, Volume2, VolumeX, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Music, Headphones, Shuffle, Repeat, Repeat1, RefreshCw, Trash2, EyeOff, RotateCcw, GripVertical, Sparkles, Maximize2, X, Sliders } from "lucide-react";
import { AudioReactive3DVisualizer } from "./AudioReactive3DVisualizer";
import {
  getSharedAudioContext,
  getAmbientAudioBus,
  getMasterAudioBus,
  createLoopingNoiseSource,
  AMBIENT_MASTER_GAIN_SCALE,
  BGM_HTML_GAIN_SCALE,
  type NoiseColor,
} from "@/lib/audio";
import { getMaxSynthVoices, shouldPreloadBgmAudio, isMobileDevice, isPerfReduced } from "@/lib/perfMode";
import {
  getBgmTrackId,
  hideBgmTrack,
  hydratePersistedBgmTracks,
  isBgmTrackHidden,
  loadHiddenBgmTracks,
  loadPersistedExtraBgmTracks,
  removePersistedExtraBgmTrackByKey,
  resolveBgmPlaybackUrl,
  savePersistedExtraBgmTracks,
  toPersistedBgmUrl,
  needsBgmUrlResolution,
  isPersistedBgmRef,
  permanentlyDeleteBgmTrack,
  restoreBgmTrackAvailability,
  unhideBgmTrack,
  purgeAllLegacyBgmTracks,
  type HiddenBgmTrack,
  type PersistedBgmTrack,
} from "@/lib/dailyBgm";

import { FLOW_AUDIO_TRACKS, FLOW_TRACK_GENERATORS, getTrackNormalizationGain } from "@/lib/proceduralBgmSuite";
import { useMoodSound } from "@/hooks/useMoodSound";
import type { MoodSoundId } from "@/lib/moodSoundEngine";

type BgmTrack = {
  name: string;
  url: string;
  artist?: string;
  trackKey?: string;
  category?: string;
};

type RepeatMode = "off" | "one" | "all";

const SYNTH_SEGMENT_SEC = 300;

const REPEAT_MODE_LABEL: Record<RepeatMode, string> = {
  off: "반복 끔",
  one: "1곡 반복",
  all: "전체 반복",
};

export const isProceduralTrack = (url: string) => url.startsWith("flow-") || url.startsWith("synth");

// The premium 30-track procedural suite
const AUDIO_TRACKS: BgmTrack[] = FLOW_AUDIO_TRACKS;

function shuffleTrackIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildNextShuffleOrder(trackCount: number, avoidIndex: number): number[] {
  let nextShuffled = shuffleTrackIndices(trackCount);
  if (trackCount > 1 && nextShuffled[0] === avoidIndex) {
    const swapWith = nextShuffled.findIndex((idx, i) => i > 0 && idx !== avoidIndex);
    if (swapWith > 0) {
      [nextShuffled[0], nextShuffled[swapWith]] = [nextShuffled[swapWith], nextShuffled[0]];
    }
  }
  return nextShuffled;
}

function buildInitialTrackLibrary(): BgmTrack[] {
  // 사용자의 요청: 기존 음악은 전부 삭제하고 어플에 맞춘 30곡으로 깨끗이 구성
  purgeAllLegacyBgmTracks();
  FLOW_AUDIO_TRACKS.forEach((track) => restoreBgmTrackAvailability(track.url));
  return [...FLOW_AUDIO_TRACKS];
}

interface LPRecordDiscProps {
  isPlaying: boolean;
  isBuffering?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function LPRecordDisc({
  isPlaying,
  isBuffering = false,
  size = 'md',
  className = '',
}: LPRecordDiscProps) {
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-11 h-11',
  }[size];

  const labelSizeClasses = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
  }[size];

  const holeSizeClasses = {
    xs: 'w-0.5 h-0.5',
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-1.5 h-1.5',
  }[size];

  return (
    <div
      className={`lp-vinyl-disc ${sizeClasses} relative flex items-center justify-center shrink-0 cursor-pointer ${className}`}
    >
      {/* Vinyl Grooves & Conic Specular Reflection Sheen */}
      <div
        className={`lp-vinyl-grooves ${
          isPlaying && !isBuffering ? 'lp-spinning' : 'lp-paused'
        }`}
      />

      {/* Decorative concentric groove rings */}
      <div className="absolute inset-1 rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute inset-2.5 rounded-full border border-white/5 pointer-events-none" />

      {/* Center Label (Prismatic Vinyl Sticker) */}
      <div
        className={`relative z-10 ${labelSizeClasses} rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center shadow-sm ${
          isPlaying && !isBuffering ? 'lp-spinning' : 'lp-paused'
        }`}
      >
        {/* Center Spindle Hole */}
        <div className={`${holeSizeClasses} rounded-full bg-zinc-950 border border-white/40 shadow-inner`} />
      </div>

      {/* Tone Arm Stylus Needle Indicator */}
      <div
        className={`absolute top-0.5 right-1 w-2.5 h-3.5 transition-transform duration-500 origin-top-right pointer-events-none z-20 ${
          isPlaying && !isBuffering
            ? 'rotate-12 translate-x-0'
            : '-rotate-25 translate-x-1 opacity-60'
        }`}
      >
        <div className="w-[1.5px] h-3 bg-gradient-to-b from-white/90 via-zinc-400 to-amber-300 rounded-full shadow-sm" />
        <div className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.9)] -ml-[1px]" />
      </div>

      {/* Buffering Indicator Overlay */}
      {isBuffering && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-full flex items-center justify-center z-30">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
        </div>
      )}
    </div>
  );
}

export function BgMusicPlayer() {
  // --- PLAYER STATES ---
  const [tracks, setTracks] = useState(buildInitialTrackLibrary);
  const [shuffledIndices, setShuffledIndices] = useState(() =>
    shuffleTrackIndices(buildInitialTrackLibrary().length),
  );
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => {
    try {
      const saved = localStorage.getItem('prism_bgm_playing');
      if (saved !== null) return saved === 'true';
      if (isMobileDevice() || isPerfReduced()) return false;
      return true;
    } catch {
      return false;
    }
  });
  const isPlayingRef = useRef(isPlaying);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('prism_bgm_volume');
      return saved !== null ? parseFloat(saved) : 1.0;
    } catch {
      return 1.0;
    }
  });
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem('prism_bgm_muted') === 'true';
    } catch {
      return false;
    }
  });
  
  // Custom Controls
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [isShuffle, setIsShuffle] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showHiddenTracks, setShowHiddenTracks] = useState(false);
  const [hiddenTracks, setHiddenTracks] = useState<HiddenBgmTrack[]>(() => loadHiddenBgmTracks());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isPanelActive, setIsPanelActive] = useState(() => !!(window as any).__lucy_active_panel);
  const [show3DVisualizerStage, setShow3DVisualizerStage] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDetailMenuOpen, setIsDetailMenuOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoldTriggeredRef = useRef(false);
  const holdStartPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleNavState = (e: any) => {
      if (typeof e?.detail?.isOpen === 'boolean') {
        setIsNavOpen(e.detail.isOpen);
        if (e.detail.isOpen) {
          setIsDetailMenuOpen(false);
        }
      }
    };
    window.addEventListener('left-sidebar-state', handleNavState);
    return () => window.removeEventListener('left-sidebar-state', handleNavState);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDetailMenuOpen) {
        setIsDetailMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailMenuOpen]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  // Unified Mood Sound Integration (빗소리 · 백색소음 · 숲속소리 등)
  const {
    isPlaying: isMoodPlaying,
    activeMood,
    volume: moodVolume,
    isPickerOpen: isMoodPickerOpen,
    presets: moodPresets,
    currentPreset: currentMoodPreset,
    togglePlay: toggleMoodPlay,
    setMood: setMoodSound,
    setVolume: setMoodVolume,
    closePicker: closeMoodPicker,
  } = useMoodSound();

  const [activeMediaTab, setActiveMediaTab] = useState<'bgm' | 'mood'>('bgm');

  // 외부(예: 옴니워프나 명상 모듈)에서 무드 사운드 피커 열기를 요청하면 플레이어를 펼치고 무드 탭으로 전환
  useEffect(() => {
    if (isMoodPickerOpen) {
      setIsCollapsed(false);
      setShowPlaylist(true);
      setActiveMediaTab('mood');
    }
  }, [isMoodPickerOpen]);

  // Position & Edge Docking State (Default: Edge Mode always on)
  const [bgmPos, setBgmPos] = useState<{ y: number; dockSide: "right" | "left"; isDocked: boolean }>(() => {
    try {
      const saved = localStorage.getItem("prism_bgm_dock_pos_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.y === "number" && (parsed.dockSide === "right" || parsed.dockSide === "left")) {
          return {
            y: Math.max(10, Math.min(window.innerHeight - 80, parsed.y)),
            dockSide: parsed.dockSide,
            isDocked: true, // Always start in Edge Mode
          };
        }
      }
    } catch {}
    return { y: 120, dockSide: "right", isDocked: true }; // Always default to Edge Mode
  });

  const bgmPosRef = useRef(bgmPos);
  bgmPosRef.current = bgmPos;

  // Dragging state (X and Y coordinates for 4-way dragging: 상하좌우)
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragJustEndedRef = useRef(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dragPosRef = useRef<{ x: number; y: number } | null>(null);
  dragPosRef.current = dragPos;

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  } | null>(null);

  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const saveBgmPos = useCallback((newPos: { y: number; dockSide: "right" | "left"; isDocked: boolean }) => {
    setBgmPos(newPos);
    try {
      localStorage.setItem("prism_bgm_dock_pos_v2", JSON.stringify(newPos));
    } catch {}
  }, []);

  const handleCollapse = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowPlaylist(false);
    setShowVolumeSlider(false);
    setIsCollapsed(true);
    saveBgmPos({
      ...bgmPosRef.current,
      isDocked: true,
    });
  }, [saveBgmPos]);

  const handleExpandPlayer = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isDraggingRef.current || dragJustEndedRef.current) return;
    setIsCollapsed(false);
    setShowPlaylist(true);
    setShowVolumeSlider(false);

    // Ensure expanded card (~300px height) stays fully inside screen bounds
    const maxSafeY = Math.max(10, window.innerHeight - 330);
    const safeY = Math.min(bgmPosRef.current.y, maxSafeY);

    saveBgmPos({
      ...bgmPosRef.current,
      y: safeY,
      isDocked: false,
    });
  }, [saveBgmPos]);

  const toggleDock = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (bgmPosRef.current.isDocked) {
      handleExpandPlayer(e);
    } else {
      handleCollapse(e);
    }
  }, [handleExpandPlayer, handleCollapse]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only left click / touch starts dragging
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = playerContainerRef.current?.getBoundingClientRect();
    const initialX = rect ? rect.left : (bgmPosRef.current.dockSide === "right" ? window.innerWidth - 120 : 0);
    const initialY = rect ? rect.top : bgmPosRef.current.y;

    dragStartRef.current = {
      startX,
      startY,
      initialX,
      initialY,
      hasMoved: false,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;
      if (!dragStartRef.current.hasMoved && Math.hypot(dx, dy) > 5) {
        dragStartRef.current.hasMoved = true;
        setIsDragging(true);
        isDraggingRef.current = true;
      }
      if (dragStartRef.current.hasMoved) {
        const width = playerContainerRef.current?.offsetWidth || 85;
        const height = playerContainerRef.current?.offsetHeight || 44;
        const minX = 0;
        const maxX = Math.max(0, window.innerWidth - width);
        const minY = 10;
        const maxY = Math.max(10, window.innerHeight - height - 10);

        const newX = Math.max(minX, Math.min(maxX, dragStartRef.current.initialX + dx));
        const newY = Math.max(minY, Math.min(maxY, dragStartRef.current.initialY + dy));

        const nextPos = { x: newX, y: newY };
        setDragPos(nextPos);
        dragPosRef.current = nextPos;
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);

      if (dragStartRef.current) {
        if (dragStartRef.current.hasMoved && dragPosRef.current) {
          const finalX = dragPosRef.current.x;
          const finalY = dragPosRef.current.y;
          const side: "left" | "right" = (finalX + 40) < window.innerWidth / 2 ? "left" : "right";
          const clampedY = Math.max(10, Math.min(window.innerHeight - 70, finalY));

          saveBgmPos({
            y: clampedY,
            dockSide: side,
            isDocked: true, // Always dock to edge mode on release
          });

          dragJustEndedRef.current = true;
          setTimeout(() => {
            setIsDragging(false);
            isDraggingRef.current = false;
            setDragPos(null);
            dragPosRef.current = null;
            setTimeout(() => {
              dragJustEndedRef.current = false;
            }, 100);
          }, 60);
        } else {
          setIsDragging(false);
          isDraggingRef.current = false;
          setDragPos(null);
          dragPosRef.current = null;
        }
        dragStartRef.current = null;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
  }, [saveBgmPos]);

  useEffect(() => {
    const handlePanelChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPanelActive(!!customEvent.detail);
    };
    window.addEventListener("lucy-active-panel-change", handlePanelChange);
    return () => {
      window.removeEventListener("lucy-active-panel-change", handlePanelChange);
    };
  }, []);

  // --- REFS ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedUrlRef = useRef<string>("");
  const isPlayInitiatedRef = useRef<string>("");
  const masterGainRef = useRef<GainNode | null>(null);
  const currentTrackNormGainRef = useRef<number>(1.0);
  const htmlGainRef = useRef<GainNode | null>(null);
  const htmlSourceConnectedRef = useRef(false);
  const activeNodesRef = useRef<any[]>([]);
  const activeVoiceCountRef = useRef(0);
  const synthIntervalRef = useRef<any>(null);
  const secondarySynthIntervalRef = useRef<any>(null);
  const synthAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatModeRef = useRef<RepeatMode>("all");
  const isShuffleRef = useRef(true);
  const queueIndexRef = useRef(0);
  const handleTrackEndedRef = useRef<() => void>(() => {});
  const volumeRef = useRef<HTMLDivElement | null>(null);
  const tracksRef = useRef(tracks);
  const shuffledIndicesRef = useRef(shuffledIndices);
  const activeTrackIndexRef = useRef(0);
  const handleSelectTrackRef = useRef<(trackIndex: number) => void>(() => {});
  const queueAndPlayTrackRef = useRef<(trackIndex: number) => void>(() => {});
  const resolvePlaybackUrlRef = useRef<(url: string, trackKey?: string) => Promise<string | null>>(
    async (url) => url,
  );
  const playbackGenerationRef = useRef(0);
  const skipUnresolvableTrackRef = useRef<(trackIndex: number) => void>(() => {});

  const getActiveTrack = () =>
    tracksRef.current[activeTrackIndexRef.current] || tracksRef.current[0];

  const isTrackAlreadyPlaying = (trackIndex: number): boolean => {
    if (!isPlayingRef.current) return false;
    if (activeTrackIndexRef.current !== trackIndex) return false;

    const track = tracksRef.current[trackIndex];
    if (!track) return false;

    if (isProceduralTrack(track.url)) {
      return (
        isPlayInitiatedRef.current === track.url &&
        (masterGainRef.current !== null || synthIntervalRef.current !== null || secondarySynthIntervalRef.current !== null || activeNodesRef.current.length > 0)
      );
    }

    const audio = audioRef.current;
    if (!audio) return false;
    return (
      !audio.paused &&
      loadedUrlRef.current.length > 0 &&
      isPlayInitiatedRef.current === loadedUrlRef.current
    );
  };

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    shuffledIndicesRef.current = shuffledIndices;
  }, [shuffledIndices]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    queueIndexRef.current = queueIndex;
  }, [queueIndex]);

  useEffect(() => {
    if (repeatMode === "one") {
      clearSynthAdvanceTimer();
      return;
    }
    if (isPlayingRef.current && isProceduralTrack(getActiveTrack().url)) {
      scheduleSynthAdvance();
    }
  }, [repeatMode]);

  useEffect(() => {
    if (showPlaylist) {
      setHiddenTracks(loadHiddenBgmTracks());
    } else {
      setShowHiddenTracks(false);
    }
  }, [showPlaylist]);

  // Get current active track (UI may lag one frame behind activeTrackIndexRef)
  const currentTrackIndex = shuffledIndices[queueIndex] ?? activeTrackIndexRef.current;
  const currentTrack = tracks[currentTrackIndex] || getActiveTrack();

  // --- SHUFFLE HELPER ---
  const shuffleList = (length: number, excludeIndex: number) => {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    if (excludeIndex >= 0) {
      const currentPos = indices.indexOf(excludeIndex);
      if (currentPos >= 0) {
        indices.splice(currentPos, 1);
        indices.unshift(excludeIndex);
      }
    }
    return indices;
  };

  const handleToggleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShuffle(prev => {
      const next = !prev;
      if (next) {
        setShuffledIndices(shuffleList(tracks.length, currentTrackIndex));
        setQueueIndex(0);
      } else {
        const originalIndices = tracks.map((_, i) => i);
        setShuffledIndices(originalIndices);
        setQueueIndex(currentTrackIndex);
      }
      return next;
    });
  };

  // handleCollapse and handleExpandPlayer are defined above with saveBgmPos

  const handleToggleRepeat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRepeatMode((prev) => {
      if (prev === "off") return "one";
      if (prev === "one") return "all";
      return "off";
    });
  };

  const createNoiseNode = (ctx: AudioContext, type: NoiseColor) => {
    return createLoopingNoiseSource(ctx, type, 10);
  };

  const clearSynthAdvanceTimer = () => {
    if (synthAdvanceTimerRef.current) {
      clearTimeout(synthAdvanceTimerRef.current);
      synthAdvanceTimerRef.current = null;
    }
  };

  const scheduleSynthAdvance = () => {
    clearSynthAdvanceTimer();
    if (!isPlayingRef.current || repeatModeRef.current === "one") return;

    synthAdvanceTimerRef.current = setTimeout(() => {
      if (!isPlayingRef.current) return;
      handleTrackEndedRef.current();
    }, SYNTH_SEGMENT_SEC * 1000);
  };

  // --- PROCEDURAL SOUND OVERHAUL ---
  const stopProceduralSynth = () => {
    clearSynthAdvanceTimer();
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (secondarySynthIntervalRef.current) {
      clearInterval(secondarySynthIntervalRef.current);
      secondarySynthIntervalRef.current = null;
    }

    activeNodesRef.current.forEach((node) => {
      try {
        if (typeof (node as any).stop === 'function') (node as any).stop(0);
      } catch (_) {}
      try {
        if (typeof (node as any).disconnect === 'function') (node as any).disconnect();
      } catch (_) {}
    });
    activeNodesRef.current = [];
    activeVoiceCountRef.current = 0;

    if (masterGainRef.current) {
      try {
        const ctx = getSharedAudioContext();
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        const oldMasterGain = masterGainRef.current;
        window.setTimeout(() => {
          try {
            oldMasterGain.disconnect();
          } catch (_) {}
        }, 60);
      } catch (_) {}
      masterGainRef.current = null;
    }
  };

  const pausePlayback = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsBuffering(false);
    isPlayInitiatedRef.current = "";
    try {
      localStorage.setItem('prism_bgm_playing', 'false');
    } catch (_) {}

    const audio = audioRef.current;
    if (audio) {
      try {
        if (!audio.paused) audio.pause();
      } catch (_) {}
    }
    if (htmlGainRef.current) {
      try {
        const ctx = getSharedAudioContext();
        htmlGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        htmlGainRef.current.gain.setValueAtTime(0, ctx.currentTime);
      } catch (_) {}
    }
    stopProceduralSynth();
  };

  const startProceduralSynth = (type: string) => {
    stopProceduralSynth();
    if (!isPlayingRef.current) return;

    try {
      const ctx = getSharedAudioContext();
      const ambientBus = getAmbientAudioBus();

      const registerDynamicVoice = (nodes: AudioNode[], stopDelaySeconds: number) => {
        if (!isPlayingRef.current || activeVoiceCountRef.current >= getMaxSynthVoices()) {
          nodes.forEach((node) => {
            try {
              if ('stop' in node) (node as AudioBufferSourceNode).stop(0);
            } catch (_) {}
            try {
              node.disconnect();
            } catch (_) {}
          });
          return;
        }

        activeVoiceCountRef.current += 1;
        activeNodesRef.current.push(...nodes);

        window.setTimeout(() => {
          nodes.forEach((node) => {
            try {
              if ('stop' in node) (node as AudioBufferSourceNode).stop(0);
            } catch (_) {}
            try {
              node.disconnect();
            } catch (_) {}
            activeNodesRef.current = activeNodesRef.current.filter((n) => n !== node);
          });
          activeVoiceCountRef.current = Math.max(0, activeVoiceCountRef.current - 1);
        }, (stopDelaySeconds + 0.35) * 1000);
      };

      if (!masterGainRef.current || masterGainRef.current.context !== ctx) {
        masterGainRef.current = ctx.createGain();
      }
      const masterGain = masterGainRef.current;
      masterGain.disconnect();

      const softLimiter = ctx.createDynamicsCompressor();
      softLimiter.threshold.setValueAtTime(-20, ctx.currentTime);
      softLimiter.knee.setValueAtTime(12, ctx.currentTime);
      softLimiter.ratio.setValueAtTime(2, ctx.currentTime);
      softLimiter.attack.setValueAtTime(0.008, ctx.currentTime);
      softLimiter.release.setValueAtTime(0.2, ctx.currentTime);

      masterGain.connect(softLimiter);
      softLimiter.connect(ambientBus);
      activeNodesRef.current.push(softLimiter);

      const normGain = getTrackNormalizationGain(type);
      currentTrackNormGainRef.current = normGain;

      const targetVol = isMuted ? 0 : volume;
      const targetGain = targetVol * AMBIENT_MASTER_GAIN_SCALE * normGain;
      masterGain.gain.setValueAtTime(targetGain, ctx.currentTime);

      // --- ADVANCED AUDIO ROUTING UTILITIES ---

      // 1. Spacious Stereo Auto-Panner with dynamic LFO sweep
      const createAutoPanner = (speedHz: number, panDepth: number) => {
        if (!ctx.createStereoPanner) return masterGain;
        const panner = ctx.createStereoPanner();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        lfo.frequency.setValueAtTime(speedHz, ctx.currentTime);
        lfoGain.gain.setValueAtTime(panDepth, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(panner.pan);
        panner.connect(masterGain);
        lfo.start();

        activeNodesRef.current.push(panner, lfo, lfoGain);
        return panner;
      };

      // 2. High-Fidelity Feedback Delay Matrix
      const createDelay = (delayTime: number, feedback: number, wet: number) => {
        const delayNode = ctx.createDelay(2.0);
        delayNode.delayTime.setValueAtTime(delayTime, ctx.currentTime);

        const feedbackGain = ctx.createGain();
        feedbackGain.gain.setValueAtTime(feedback, ctx.currentTime);

        const wetGain = ctx.createGain();
        wetGain.gain.setValueAtTime(wet, ctx.currentTime);

        // Feedback routing
        delayNode.connect(feedbackGain);
        feedbackGain.connect(delayNode);

        // Routing path to master output
        delayNode.connect(wetGain);
        wetGain.connect(masterGain);

        activeNodesRef.current.push(delayNode, feedbackGain, wetGain);
        return delayNode;
      };

      // --- PROCEDURAL SYNTHESIZER MODELS (LUCKEY FLOW 30-TRACK SUITE) ---
      const generator = FLOW_TRACK_GENERATORS[type];
      if (generator) {
        generator(ctx, masterGain, {
          createAutoPanner,
          createDelay,
          createNoiseNode,
          registerDynamicVoice,
          activeNodesRef,
          synthIntervalRef,
          secondarySynthIntervalRef,
        });
      } else {
        const fallbackGen = FLOW_TRACK_GENERATORS[FLOW_AUDIO_TRACKS[0].url];
        if (fallbackGen) {
          fallbackGen(ctx, masterGain, {
            createAutoPanner,
            createDelay,
            createNoiseNode,
            registerDynamicVoice,
            activeNodesRef,
            synthIntervalRef,
            secondarySynthIntervalRef,
          });
        }
      }

      setIsBuffering(false);
      scheduleSynthAdvance();
    } catch (err) {
      console.warn("Synthesizer failed to start:", err);
    }
  };

  const isSameActiveTrack = (track: BgmTrack) => {
    const active = getActiveTrack();
    return active.url === track.url && active.trackKey === track.trackKey;
  };

  const setHtmlBgmGain = (targetVol: number) => {
    const ctx = getSharedAudioContext();
    const now = ctx.currentTime;
    const normalizedGain = targetVol * BGM_HTML_GAIN_SCALE;

    if (htmlGainRef.current) {
      try {
        htmlGainRef.current.gain.cancelScheduledValues(now);
        htmlGainRef.current.gain.setTargetAtTime(normalizedGain, now, 0.05);
      } catch {
        htmlGainRef.current.gain.setValueAtTime(normalizedGain, now);
      }
      if (audioRef.current) audioRef.current.volume = 1;
      return;
    }
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, normalizedGain));
    }
  };

  const ensureHtmlAudioRouting = () => {
    const audio = audioRef.current;
    if (!audio || htmlSourceConnectedRef.current) return;

    try {
      const ctx = getSharedAudioContext();
      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      gain.connect(getAmbientAudioBus());
      source.connect(gain);
      htmlGainRef.current = gain;
      htmlSourceConnectedRef.current = true;
      audio.volume = 1;
      setHtmlBgmGain(isMuted ? 0 : volume);
    } catch (err) {
      console.warn("HTML BGM WebAudio routing unavailable, using element volume:", err);
    }
  };

  const playHtmlBgmAudio = (resolvedUrl: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlayingRef.current) {
      stopProceduralSynth();
      if (!audio.paused) {
        try { audio.pause(); } catch (_) {}
      }
      setIsBuffering(false);
      isPlayInitiatedRef.current = "";
      return;
    }

    stopProceduralSynth();
    ensureHtmlAudioRouting();
    setHtmlBgmGain(isMuted ? 0 : volume);

    if (loadedUrlRef.current !== resolvedUrl) {
      loadedUrlRef.current = resolvedUrl;
      audio.src = resolvedUrl;
      audio.load();
      isPlayInitiatedRef.current = "";
    }

    setIsBuffering(true);
    isPlayInitiatedRef.current = resolvedUrl;
    audio
      .play()
      .then(() => {
        if (!isPlayingRef.current) {
          audio.pause();
          setIsBuffering(false);
          isPlayInitiatedRef.current = "";
          return;
        }
        setIsBuffering(false);
        setRetryCount(0);
      })
      .catch((err) => {
        console.warn("HTML BGM play failed/deferred:", err);
        setIsBuffering(false);
        isPlayInitiatedRef.current = "";
      });
  };

  const skipUnresolvableTrack = (trackIndex: number) => {
    const current = [...tracksRef.current];
    const failed = current[trackIndex];
    if (!failed || current.length <= 1) {
      setIsBuffering(false);
      pausePlayback();
      return;
    }

    if (failed.trackKey?.startsWith("daily:")) {
      removePersistedExtraBgmTrackByKey(failed.trackKey);
    }

    const newTracks = current.filter((_, idx) => idx !== trackIndex);
    const oldShuffled = [...shuffledIndicesRef.current];
    const removedQueuePos = oldShuffled.indexOf(trackIndex);
    const newShuffled = oldShuffled
      .filter((idx) => idx !== trackIndex)
      .map((idx) => (idx > trackIndex ? idx - 1 : idx));

    let newQueueIndex = queueIndex;
    if (removedQueuePos >= 0 && removedQueuePos < queueIndex) {
      newQueueIndex = Math.max(0, queueIndex - 1);
    } else if (removedQueuePos === queueIndex) {
      newQueueIndex = Math.min(queueIndex, Math.max(0, newShuffled.length - 1));
    }

    const nextPlayIdx = newShuffled[newQueueIndex] ?? newShuffled[0] ?? 0;
    tracksRef.current = newTracks;
    shuffledIndicesRef.current = newShuffled.length > 0 ? newShuffled : shuffleTrackIndices(newTracks.length);
    setTracks(newTracks);
    setShuffledIndices(shuffledIndicesRef.current);
    setQueueIndex(newQueueIndex);
    if (isPlayingRef.current) {
      playTrackDirectly(nextPlayIdx);
    }
  };

  skipUnresolvableTrackRef.current = skipUnresolvableTrack;

  const resolveAndPlayHtmlBgm = (track: BgmTrack, generation: number) => {
    const finish = (resolvedUrl: string | null) => {
      if (generation !== playbackGenerationRef.current) return;
      if (!isPlayingRef.current) return;
      if (!isSameActiveTrack(track)) return;

      if (!resolvedUrl) {
        console.warn("Failed to resolve BGM url:", track.url, track.trackKey);
        skipUnresolvableTrackRef.current(activeTrackIndexRef.current);
        return;
      }

      playHtmlBgmAudio(resolvedUrl);
    };

    if (needsBgmUrlResolution(track.url, track.trackKey)) {
      setIsBuffering(true);
      resolvePlaybackUrlRef
        .current(track.url, track.trackKey)
        .then(finish)
        .catch((err) => {
          console.warn("BGM resolve failed:", err);
          finish(null);
        });
      return;
    }

    finish(track.url);
  };

  // --- DIRECT SYNCHRONOUS PLAY ENGINE ---
  const playTrackDirectly = (trackIndex: number, force = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isPlayingRef.current && !force) {
      stopProceduralSynth();
      if (!audio.paused) {
        try { audio.pause(); } catch (_) {}
      }
      return;
    }
    if (!force && isTrackAlreadyPlaying(trackIndex)) return;

    const generation = ++playbackGenerationRef.current;
    activeTrackIndexRef.current = trackIndex;
    const track = tracksRef.current[trackIndex] || tracksRef.current[0];
    const targetUrl = track.url;

    if (isProceduralTrack(targetUrl)) {
      try {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      } catch (_) {}
      loadedUrlRef.current = "";
      isPlayInitiatedRef.current = targetUrl;
      startProceduralSynth(targetUrl);
      return;
    }

    stopProceduralSynth();
    resolveAndPlayHtmlBgm(track, generation);
  };

  // --- AUDIO ACTION HANDLERS ---
  const advanceToNextTrack = () => {
    if (!isPlayingRef.current) return;
    setRetryCount(0);
    const shuffled = [...shuffledIndicesRef.current];
    const trackCount = tracksRef.current.length;
    if (trackCount === 0 || !shuffled.length) return;

    const prev = queueIndexRef.current;
    const currentIdx = shuffled[prev] ?? activeTrackIndexRef.current;
    let nextQueuePos = prev + 1;
    let nextTrackIdx = 0;

    if (nextQueuePos >= shuffled.length) {
      if (repeatModeRef.current === "off") {
        pausePlayback();
        return;
      }

      if (isShuffleRef.current) {
        const nextShuffled = buildNextShuffleOrder(trackCount, currentIdx);
        shuffledIndicesRef.current = nextShuffled;
        setShuffledIndices(nextShuffled);
        nextTrackIdx = nextShuffled[0];
      } else {
        nextTrackIdx = shuffled[0];
      }
      nextQueuePos = 0;
    } else {
      nextTrackIdx = shuffled[nextQueuePos];
    }

    setQueueIndex(nextQueuePos);
    playTrackDirectly(nextTrackIdx);
    isPlayingRef.current = true;
    setIsPlaying(true);
    try {
      localStorage.setItem('prism_bgm_playing', 'true');
    } catch (_) {}
  };

  const handleNextTrack = () => {
    advanceToNextTrack();
  };

  const handlePrevTrack = () => {
    setRetryCount(0);
    const shuffled = shuffledIndicesRef.current;
    if (!shuffled.length) return;

    const prev = queueIndexRef.current;
    const nextQueuePos = prev - 1 < 0 ? shuffled.length - 1 : prev - 1;
    const prevTrackIdx = shuffled[nextQueuePos];
    setQueueIndex(nextQueuePos);
    playTrackDirectly(prevTrackIdx);
    isPlayingRef.current = true;
    setIsPlaying(true);
  };

  const handleTrackEnded = () => {
    if (!isPlayingRef.current) return;

    if (repeatModeRef.current === "one") {
      playTrackDirectly(activeTrackIndexRef.current);
      return;
    }

    if (repeatModeRef.current === "off") {
      const shuffled = shuffledIndicesRef.current;
      if (queueIndexRef.current >= shuffled.length - 1) {
        pausePlayback();
        return;
      }
    }

    advanceToNextTrack();
  };

  handleTrackEndedRef.current = handleTrackEnded;

  const handlePlayToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isDraggingRef.current || dragJustEndedRef.current) return;
    if (isPlayingRef.current) {
      pausePlayback();
      return;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    try {
      localStorage.setItem('prism_bgm_playing', 'true');
    } catch (_) {}

    const audio = audioRef.current;
    const currentIdx = shuffledIndicesRef.current[queueIndexRef.current] ?? activeTrackIndexRef.current;
    const track = tracksRef.current[currentIdx] || tracksRef.current[0];
    if (audio && !isProceduralTrack(track.url) && audio.src && !audio.ended && audio.currentTime > 0) {
      ensureHtmlAudioRouting();
      setHtmlBgmGain(isMuted ? 0 : volume);
      audio.play().catch(() => {
        playTrackDirectly(currentIdx);
      });
      return;
    }

    playTrackDirectly(currentIdx);
  };

  const handlePlayToggleRef = useRef(handlePlayToggle);
  handlePlayToggleRef.current = handlePlayToggle;
  const advanceToNextTrackRef = useRef(advanceToNextTrack);
  advanceToNextTrackRef.current = advanceToNextTrack;

  // --- LP DISC HOLD & INTERACTION HANDLERS ---
  const handleLpPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isHoldTriggeredRef.current = false;
    holdStartPosRef.current = { x: e.clientX, y: e.clientY };
    setIsHolding(true);

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }

    holdTimerRef.current = setTimeout(() => {
      isHoldTriggeredRef.current = true;
      setIsHolding(false);
      holdTimerRef.current = null;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(35);
        } catch (_) {}
      }
      setIsDetailMenuOpen(true);
    }, 400);
  };

  const handleLpPointerMove = (e: React.PointerEvent) => {
    if (!holdStartPosRef.current || !holdTimerRef.current) return;
    const dx = Math.abs(e.clientX - holdStartPosRef.current.x);
    const dy = Math.abs(e.clientY - holdStartPosRef.current.y);
    if (dx > 10 || dy > 10) {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      setIsHolding(false);
    }
  };

  const handleLpPointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
  };

  const handleLpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isHoldTriggeredRef.current) {
      isHoldTriggeredRef.current = false;
      return;
    }
    handlePlayToggle(e);
  };

  const handleLpContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    setIsDetailMenuOpen((prev) => !prev);
  };

  const queueAndPlayTrack = (trackIndex: number) => {
    const qIdx = shuffledIndicesRef.current.indexOf(trackIndex);
    if (qIdx >= 0) {
      setQueueIndex(qIdx);
    } else {
      const newIndices = [...shuffledIndicesRef.current, trackIndex];
      shuffledIndicesRef.current = newIndices;
      setShuffledIndices(newIndices);
      setQueueIndex(newIndices.length - 1);
    }
    playTrackDirectly(trackIndex);
    isPlayingRef.current = true;
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const handleSelectTrack = (trackIndex: number) => {
    queueAndPlayTrack(trackIndex);
  };

  handleSelectTrackRef.current = handleSelectTrack;

  const handleRemoveTrack = (trackIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = [...tracksRef.current];
    if (current.length <= 1) return;

    const removed = current[trackIndex];
    if (!removed) return;

    const trackId = getBgmTrackId(removed);
    const persistedUrl =
      removed.trackKey && (removed.url.startsWith("blob:") || !removed.url.startsWith("idb:"))
        ? toPersistedBgmUrl(removed.trackKey)
        : removed.url;
    hideBgmTrack({
      id: trackId,
      name: removed.name,
      url: persistedUrl,
      artist: removed.artist,
      trackKey: removed.trackKey,
    });
    setHiddenTracks(loadHiddenBgmTracks());
    if (removed.trackKey?.startsWith("daily:")) {
      removePersistedExtraBgmTrackByKey(removed.trackKey);
    }

    const newTracks = current.filter((_, i) => i !== trackIndex);
    const wasPlaying = activeTrackIndexRef.current === trackIndex;
    const oldShuffled = [...shuffledIndicesRef.current];
    const removedQueuePos = oldShuffled.indexOf(trackIndex);

    const newShuffled = oldShuffled
      .filter((idx) => idx !== trackIndex)
      .map((idx) => (idx > trackIndex ? idx - 1 : idx));

    let newQueueIndex = queueIndex;
    if (removedQueuePos >= 0) {
      if (removedQueuePos < queueIndex) {
        newQueueIndex = Math.max(0, queueIndex - 1);
      } else if (removedQueuePos === queueIndex) {
        newQueueIndex = Math.min(queueIndex, Math.max(0, newShuffled.length - 1));
      }
    }

    const nextShuffled =
      newShuffled.length > 0 ? newShuffled : shuffleTrackIndices(newTracks.length);
    const boundedQueueIndex = Math.min(newQueueIndex, Math.max(0, nextShuffled.length - 1));

    tracksRef.current = newTracks;
    shuffledIndicesRef.current = nextShuffled;
    setTracks(newTracks);
    setShuffledIndices(nextShuffled);
    setQueueIndex(boundedQueueIndex);

    if (wasPlaying) {
      const nextPlayIdx = nextShuffled[boundedQueueIndex] ?? 0;
      playTrackDirectly(nextPlayIdx);
    }
  };

  const refreshHiddenTracks = () => {
    setHiddenTracks(loadHiddenBgmTracks());
  };

  const handleRestoreTrack = (hidden: HiddenBgmTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    unhideBgmTrack(hidden.id);

    const restoredTrack: BgmTrack = {
      name: hidden.name,
      url: hidden.url,
      artist: hidden.artist || "Lucy Procedural Suite",
      trackKey: hidden.trackKey,
    };

    if (hidden.trackKey?.startsWith("daily:")) {
      const extras = loadPersistedExtraBgmTracks();
      if (!extras.some((track) => track.trackKey === hidden.trackKey)) {
        savePersistedExtraBgmTracks([
          ...extras,
          {
            name: hidden.name,
            url: hidden.url,
            artist: hidden.artist,
            trackKey: hidden.trackKey,
          },
        ]);
      }
    }

    const current = [...tracksRef.current];
    const existingIdx = current.findIndex((track) => getBgmTrackId(track) === hidden.id);
    if (existingIdx < 0) {
      const trackIndex = current.length;
      current.push(restoredTrack);
      const nextShuffled = [...shuffledIndicesRef.current, trackIndex];
      tracksRef.current = current;
      shuffledIndicesRef.current = nextShuffled;
      setTracks(current);
      setShuffledIndices(nextShuffled);
    }

    setHiddenTracks(loadHiddenBgmTracks());
  };

  const handleToggleHiddenTracks = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHiddenTracks((prev) => {
      const next = !prev;
      if (next) refreshHiddenTracks();
      return next;
    });
  };

  const handleResetToCurated30Tracks = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    purgeAllLegacyBgmTracks();
    FLOW_AUDIO_TRACKS.forEach((track) => restoreBgmTrackAvailability(track.url));
    const freshTracks = [...FLOW_AUDIO_TRACKS];
    tracksRef.current = freshTracks;
    const newShuffled = shuffleTrackIndices(freshTracks.length);
    shuffledIndicesRef.current = newShuffled;
    setTracks(freshTracks);
    setShuffledIndices(newShuffled);
    setHiddenTracks([]);
    setShowHiddenTracks(false);
    setSelectedCategory("all");
    setQueueIndex(0);
    if (isPlayingRef.current) {
      playTrackDirectly(newShuffled[0]);
    }
  };

  const handlePermanentDeleteTrack = async (hidden: HiddenBgmTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `"${hidden.name}"을(를) 영원히 삭제할까요?\n복원하거나 다시 추가할 수 없습니다.`,
    );
    if (!confirmed) return;

    const current = [...tracksRef.current];
    const removeIdx = current.findIndex((track) => getBgmTrackId(track) === hidden.id);
    const wasPlaying = removeIdx >= 0 && activeTrackIndexRef.current === removeIdx;

    await permanentlyDeleteBgmTrack(hidden);

    if (removeIdx >= 0) {
      const newTracks = current.filter((_, i) => i !== removeIdx);
      const oldShuffled = [...shuffledIndicesRef.current];
      const removedQueuePos = oldShuffled.indexOf(removeIdx);
      const newShuffled = oldShuffled
        .filter((idx) => idx !== removeIdx)
        .map((idx) => (idx > removeIdx ? idx - 1 : idx));

      let newQueueIndex = queueIndex;
      if (removedQueuePos >= 0) {
        if (removedQueuePos < queueIndex) {
          newQueueIndex = Math.max(0, queueIndex - 1);
        } else if (removedQueuePos === queueIndex) {
          newQueueIndex = Math.min(queueIndex, Math.max(0, newShuffled.length - 1));
        }
      }

      const nextShuffled =
        newShuffled.length > 0 ? newShuffled : shuffleTrackIndices(newTracks.length);
      const boundedQueueIndex = Math.min(newQueueIndex, Math.max(0, nextShuffled.length - 1));

      tracksRef.current = newTracks;
      shuffledIndicesRef.current = nextShuffled;
      setTracks(newTracks);
      setShuffledIndices(nextShuffled);
      setQueueIndex(boundedQueueIndex);

      if (wasPlaying) {
        if (newTracks.length === 0) {
          pausePlayback();
        } else {
          playTrackDirectly(nextShuffled[boundedQueueIndex] ?? 0);
        }
      }
    }

    const nextHidden = loadHiddenBgmTracks();
    setHiddenTracks(nextHidden);
    if (nextHidden.length === 0) {
      setShowHiddenTracks(false);
    }
  };

  // --- MUTED & VOLUME HANDLERS ---
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const muted = val === 0;
    setIsMuted(muted);
    try {
      localStorage.setItem('prism_bgm_volume', String(val));
      localStorage.setItem('prism_bgm_muted', muted ? 'true' : 'false');
    } catch (_) {}
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => {
      const next = !prev;
      try {
        localStorage.setItem('prism_bgm_muted', next ? 'true' : 'false');
      } catch (_) {}
      const targetVol = next ? 0 : volume;
      setHtmlBgmGain(targetVol);
      if (masterGainRef.current) {
        const ctx = getSharedAudioContext();
        const now = ctx.currentTime;
        const targetGain = targetVol * AMBIENT_MASTER_GAIN_SCALE * currentTrackNormGainRef.current;
        try {
          masterGainRef.current.gain.cancelScheduledValues(now);
          masterGainRef.current.gain.setTargetAtTime(targetGain, now, 0.05);
        } catch {
          masterGainRef.current.gain.setValueAtTime(targetGain, now);
        }
      }
      return next;
    });
  };

  queueAndPlayTrackRef.current = queueAndPlayTrack;
  resolvePlaybackUrlRef.current = resolveBgmPlaybackUrl;

  useEffect(() => {
    let cancelled = false;
    const persisted = loadPersistedExtraBgmTracks();
    if (!persisted.length) return;

    hydratePersistedBgmTracks(persisted).then((hydrated) => {
      if (cancelled) return;
      const current = [...tracksRef.current];
      let changed = false;

      const hydratedKeys = new Set(
        hydrated.map((track) => track.trackKey).filter((trackKey): trackKey is string => !!trackKey),
      );

      persisted.forEach((savedTrack) => {
        if (!savedTrack.trackKey || isBgmTrackHidden(savedTrack)) return;
        if (isPersistedBgmRef(savedTrack.url) && !hydratedKeys.has(savedTrack.trackKey)) {
          removePersistedExtraBgmTrackByKey(savedTrack.trackKey);
          const staleIdx = current.findIndex((track) => track.trackKey === savedTrack.trackKey);
          if (staleIdx >= 0) {
            current.splice(staleIdx, 1);
            changed = true;
          }
        }
      });

      hydrated.forEach((savedTrack) => {
        if (!savedTrack.trackKey || isBgmTrackHidden(savedTrack)) return;
        const idx = current.findIndex((track) => track.trackKey === savedTrack.trackKey);
        if (idx >= 0) {
          if (current[idx].url !== savedTrack.url) {
            current[idx] = { ...current[idx], ...savedTrack };
            changed = true;
          }
        } else {
          current.push({
            name: savedTrack.name,
            url: savedTrack.url,
            artist: savedTrack.artist,
            trackKey: savedTrack.trackKey,
          });
          changed = true;
        }
      });

      if (!changed) return;
      tracksRef.current = current;
      setTracks(current);
      setShuffledIndices((prev) => {
        const missing = current
          .map((_, idx) => idx)
          .filter((idx) => !prev.includes(idx));
        return missing.length ? [...prev, ...missing] : prev;
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const upsertCustomBgmTrack = (detail: {
    name: string;
    url: string;
    artist?: string;
    trackKey?: string;
    persist?: boolean;
  }): number => {
    const { name, url, artist, trackKey, persist = false } = detail;
    if (!url) return 0;
    if (isBgmTrackHidden({ url, trackKey })) return -1;

    const current = [...tracksRef.current];
    let trackIndex = -1;

    if (trackKey) {
      trackIndex = current.findIndex((track) => track.trackKey === trackKey);
    }
    if (trackIndex < 0) {
      trackIndex = current.findIndex(
        (track) =>
          track.trackKey &&
          track.name === name &&
          track.url === url &&
          track.artist === (artist || track.artist),
      );
    }

    const nextTrack: BgmTrack = {
      name,
      url,
      artist: artist || "Custom Track",
      trackKey: trackKey || `custom:${url}:${name}`,
    };

    if (trackIndex >= 0) {
      current[trackIndex] = { ...current[trackIndex], ...nextTrack };
    } else {
      trackIndex = current.length;
      current.push(nextTrack);
      const nextShuffle = [...shuffledIndicesRef.current, trackIndex];
      shuffledIndicesRef.current = nextShuffle;
      setShuffledIndices(nextShuffle);
    }

    tracksRef.current = current;
    setTracks(current);

    if (persist) {
      const persisted = current
        .filter(
          (track) =>
            !!track.trackKey &&
            track.trackKey.startsWith("daily:") &&
            !isBgmTrackHidden(track),
        )
        .map(
          (track): PersistedBgmTrack => ({
            name: track.name,
            url: track.trackKey ? toPersistedBgmUrl(track.trackKey) : track.url,
            artist: track.artist || "Custom Track",
            trackKey: track.trackKey!,
          }),
        );
      savePersistedExtraBgmTracks(persisted);
    }

    return trackIndex;
  };

  // --- CUSTOM BGM EVENTS ---
  useEffect(() => {
    const handleCustomBgmEvent = (e: Event, shouldPlay: boolean) => {
      const customEvent = e as CustomEvent;
      const { name, url, artist, trackKey, persist = true } = customEvent.detail || {};
      if (!url || !name) return;

      try {
        getSharedAudioContext();
      } catch (_) {}

      const trackIndex = upsertCustomBgmTrack({
        name,
        url,
        artist,
        trackKey,
        persist,
      });

      if (shouldPlay && trackIndex >= 0 && isPlayingRef.current) {
        queueAndPlayTrackRef.current(trackIndex);
      }
    };

    const handlePlayCustomBgm = (e: Event) => handleCustomBgmEvent(e, true);
    const handleRegisterCustomBgm = (e: Event) => handleCustomBgmEvent(e, false);

    const handleUnlockAudio = () => {
      try {
        const ctx = getSharedAudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      } catch (_) {}
      if (isPlayingRef.current) {
        const curTrackIndex = shuffledIndicesRef.current[queueIndexRef.current] ?? activeTrackIndexRef.current;
        try {
          playTrackDirectly(curTrackIndex, false);
        } catch (_) {}
      }
    };

    window.addEventListener("play-custom-bgm", handlePlayCustomBgm);
    window.addEventListener("register-custom-bgm", handleRegisterCustomBgm);
    window.addEventListener("unlock-bgm-audio", handleUnlockAudio);
    return () => {
      window.removeEventListener("play-custom-bgm", handlePlayCustomBgm);
      window.removeEventListener("register-custom-bgm", handleRegisterCustomBgm);
      window.removeEventListener("unlock-bgm-audio", handleUnlockAudio);
    };
  }, []);

  // Global event listeners for BGM controls from BigBang East button
  useEffect(() => {
    const handlePrismToggleBgm = () => {
      handlePlayToggleRef.current();
    };
    const handlePrismOpenBgmMenu = () => {
      setIsDetailMenuOpen(true);
    };
    const handlePrismToggleBgmMenu = () => {
      setIsDetailMenuOpen((prev) => !prev);
    };
    const handlePrismNextBgmTrack = () => {
      advanceToNextTrackRef.current();
    };

    window.addEventListener("prism:toggle_bgm", handlePrismToggleBgm);
    window.addEventListener("prism:open_bgm_menu", handlePrismOpenBgmMenu);
    window.addEventListener("prism:toggle_bgm_menu", handlePrismToggleBgmMenu);
    window.addEventListener("prism:next_bgm_track", handlePrismNextBgmTrack);
    return () => {
      window.removeEventListener("prism:toggle_bgm", handlePrismToggleBgm);
      window.removeEventListener("prism:open_bgm_menu", handlePrismOpenBgmMenu);
      window.removeEventListener("prism:toggle_bgm_menu", handlePrismToggleBgmMenu);
      window.removeEventListener("prism:next_bgm_track", handlePrismNextBgmTrack);
    };
  }, []);

  // Broadcast BGM playback state to BigBang button and other consumers
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("prism:bgm_state_change", {
        detail: {
          isPlaying,
          trackName: currentTrack?.name,
        },
      })
    );
  }, [isPlaying, currentTrack?.name]);

  // --- CLICK OUTSIDE TO COLLAPSE EXPANDED PLAYER & VOLUME SLIDER ---
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const targetNode = e.target as Node;
      if (volumeRef.current && !volumeRef.current.contains(targetNode)) {
        setShowVolumeSlider(false);
      }
      if (!bgmPos.isDocked && playerContainerRef.current && !playerContainerRef.current.contains(targetNode)) {
        handleCollapse();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [bgmPos.isDocked, handleCollapse]);

  // --- AUTOPLAY UNLOCKER ---
  useEffect(() => {
    let unlocked = false;
    const unlockAudioContext = () => {
      if (unlocked) return;
      try {
        const ctx = getSharedAudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        unlocked = true;
      } catch (_) {}
    };

    window.addEventListener("click", unlockAudioContext, { passive: true, once: true });
    window.addEventListener("touchstart", unlockAudioContext, { passive: true, once: true });
    window.addEventListener("keydown", unlockAudioContext, { passive: true, once: true });

    return () => {
      window.removeEventListener("click", unlockAudioContext);
      window.removeEventListener("touchstart", unlockAudioContext);
      window.removeEventListener("keydown", unlockAudioContext);
    };
  }, []);

  // --- REACTIVE AUDIO SYNC (Single source of truth for playback synchronization) ---
  useEffect(() => {
    const audio = audioRef.current;

    if (!isPlaying) {
      if (audio) {
        try {
          if (!audio.paused) audio.pause();
        } catch (_) {}
      }
      stopProceduralSynth();
      isPlayInitiatedRef.current = "";
      setIsBuffering(false);
      return;
    }

    const currentIdx = shuffledIndices[queueIndex] ?? activeTrackIndexRef.current;
    if (isTrackAlreadyPlaying(currentIdx)) {
      setIsBuffering(false);
      return;
    }

    playTrackDirectly(currentIdx);
  }, [isPlaying, queueIndex, tracks.length, shuffledIndices]);

  useEffect(() => {
    const targetVol = isMuted ? 0 : volume;
    setHtmlBgmGain(targetVol);
    if (masterGainRef.current) {
      const ctx = getSharedAudioContext();
      const now = ctx.currentTime;
      const targetGain = targetVol * AMBIENT_MASTER_GAIN_SCALE * currentTrackNormGainRef.current;
      try {
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setTargetAtTime(targetGain, now, 0.05);
      } catch {
        masterGainRef.current.gain.setValueAtTime(targetGain, now);
      }
    }
  }, [volume, isMuted]);

  // --- AUDIO EXCEPTION RETRY FRAMEWORK ---
  const handleAudioError = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const err = audio.error;
    if (err) {
      console.warn("HTML5 Audio Error details:", { code: err.code, message: err.message });
      if (err.code === 1) {
        console.warn("Audio abort detected (normally due to track change). Ignoring.");
        return;
      }
    }

    setIsBuffering(false);
    const failedTrack = getActiveTrack();
    const maxRetries = 2;

    const retryPlayback = async () => {
      if (!audioRef.current || !isPlayingRef.current) return;
      const resolvedUrl = await resolvePlaybackUrlRef.current(failedTrack.url, failedTrack.trackKey);
      const targetUrl = resolvedUrl || failedTrack.url;
      if (needsBgmUrlResolution(targetUrl, failedTrack.trackKey) && !resolvedUrl) {
        skipUnresolvableTrackRef.current(activeTrackIndexRef.current);
        return;
      }
      audioRef.current.src = targetUrl;
      audioRef.current.load();
      audioRef.current.play().catch((playErr) => {
        console.warn("Retry play failed (expected in test/headless environments):", playErr);
      });
    };

    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      setTimeout(() => {
        void retryPlayback();
      }, 1500);
      return;
    }

    setRetryCount(0);
    const fallbackSynthIdx = tracksRef.current.findIndex((t) => isProceduralTrack(t.url));
    if (failedTrack.url.startsWith("/music/") && fallbackSynthIdx >= 0) {
      console.warn("Legacy MP3 failed to load. Falling back to procedural synth.");
      handleSelectTrackRef.current(fallbackSynthIdx);
      return;
    }

    if (needsBgmUrlResolution(failedTrack.url, failedTrack.trackKey)) {
      skipUnresolvableTrackRef.current(activeTrackIndexRef.current);
      return;
    }

    if (activeTrackIndexRef.current !== 0) {
      console.warn("Track failed to load. Falling back to default synth.");
      handleSelectTrackRef.current(0);
    }
  };

  const handleAudioWaiting = () => setIsBuffering(true);
  const handleAudioPlaying = () => setIsBuffering(false);

  // --- RENDER COMPONENT (메뉴 버튼 상단 동일 크기 고정 LP판 플레이어) ---
  return (
    <>
      {/* Invisible HTML5 Audio Node for Legacy MP3s */}
      <audio
        ref={audioRef}
        onEnded={repeatMode === "one" ? undefined : handleTrackEnded}
        onError={handleAudioError}
        onWaiting={handleAudioWaiting}
        onPlaying={handleAudioPlaying}
        loop={repeatMode === "one"}
        preload={shouldPreloadBgmAudio() ? "auto" : "none"}
      />

      {/* Detailed Menu Modal Popup (LP판 홀드시 노출되는 프리미엄 상세메뉴) */}
      <AnimatePresence>
        {isDetailMenuOpen && !isNavOpen && (
          <>
            {/* Backdrop Dimmer Overlay (가벼운 오버레이로 외부 터치 시 즉시 닫힘) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsDetailMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[410]"
            />

            {/* Floating Quick Popover Card (LP판 바로 위 플로팅 퀵 팝오버) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed bottom-safe-music-menu z-[420] w-[calc(100vw-1.75rem)] sm:w-[380px] max-w-[380px] max-h-[78vh] flex flex-col rounded-3xl bg-neutral-950/95 border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white overflow-hidden select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0 bg-neutral-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center">
                    <LPRecordDisc isPlaying={isPlaying && !isBuffering} size="xs" />
                    {isPlaying && !isBuffering && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black tracking-wider text-amber-200">
                      LUCKEY 퀵 플레이어
                    </span>
                    <span className="text-[10px] text-white/50">
                      LP 플로팅 퀵 팝오버 · 음악 & 자연 사운드
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="퀵 메뉴 닫기"
                >
                  <X size={14} className="text-white/80" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                {/* Hero Now-Playing Track Card */}
                <div className="p-3 mx-3 mt-3 rounded-2xl bg-gradient-to-br from-amber-500/15 via-neutral-900/80 to-black/90 border border-amber-500/25 shrink-0 shadow-lg">
                  <div className="flex items-center gap-3">
                    <LPRecordDisc
                      isPlaying={isPlaying && !isBuffering}
                      isBuffering={isBuffering}
                      size="md"
                      className="shrink-0 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {currentTrack?.category && (
                          <span className="px-2 py-0.5 rounded-full text-[8.5px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                            {currentTrack.category}
                          </span>
                        )}
                        <span className="text-[9.5px] text-white/40 truncate">
                          {currentTrack?.artist || "Lucy Procedural Suite"}
                        </span>
                      </div>
                      <h4 className="text-[13px] font-bold text-white/95 truncate leading-tight">
                        {currentTrack?.name || "선택된 트랙 없음"}
                      </h4>
                    </div>

                    {/* Equalizer animation bars or Buffer spinner */}
                    <div className="shrink-0 flex items-center">
                      {isBuffering ? (
                        <RefreshCw size={15} className="animate-spin text-amber-300" />
                      ) : isPlaying ? (
                        <div className="flex items-end gap-0.5 h-4 px-1">
                          <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-3" />
                          <span className="w-0.5 bg-amber-300 rounded-full animate-pulse h-4 delay-75" />
                          <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2 delay-150" />
                          <span className="w-0.5 bg-amber-200 rounded-full animate-pulse h-3.5 delay-100" />
                        </div>
                      ) : (
                        <span className="text-[9px] text-white/40 font-mono">PAUSED</span>
                      )}
                    </div>
                  </div>

                  {/* 3D Visualizer Fullscreen Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailMenuOpen(false);
                      setShow3DVisualizerStage(true);
                    }}
                    className="w-full mt-2.5 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/30 text-amber-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Sparkles size={12} className="text-amber-300 animate-pulse" />
                    <span>3D 비주얼라이저 무대 열기</span>
                  </button>
                </div>

                {/* Primary Playback Controls Row */}
                <div className="flex items-center justify-between px-6 py-2.5 shrink-0">
                  {/* Shuffle Button */}
                  <button
                    type="button"
                    onClick={handleToggleShuffle}
                    className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                      isShuffle
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                        : "text-white/40 border-transparent hover:text-white/80 hover:bg-white/5"
                    }`}
                    title={isShuffle ? "랜덤 셔플 On" : "순차 재생"}
                  >
                    <Shuffle size={16} />
                  </button>

                  {/* Previous Track */}
                  <button
                    type="button"
                    onClick={handlePrevTrack}
                    className="p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                    title="이전 곡"
                  >
                    <SkipBack size={18} />
                  </button>

                  {/* Play / Pause Toggle Button */}
                  <button
                    type="button"
                    onClick={handlePlayToggle}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-200 text-neutral-950 font-bold flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title={isPlaying ? "일시정지" : "재생"}
                  >
                    {isPlaying && !isBuffering ? (
                      <Pause size={20} className="fill-neutral-950" />
                    ) : (
                      <Play size={20} className="fill-neutral-950 ml-0.5" />
                    )}
                  </button>

                  {/* Next Track */}
                  <button
                    type="button"
                    onClick={handleNextTrack}
                    className="p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                    title="다음 곡"
                  >
                    <SkipForward size={18} />
                  </button>

                  {/* Repeat Mode */}
                  <button
                    type="button"
                    onClick={handleToggleRepeat}
                    className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
                      repeatMode !== "off"
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                        : "text-white/40 border-transparent hover:text-white/80 hover:bg-white/5"
                    }`}
                    title={`반복 모드: ${REPEAT_MODE_LABEL[repeatMode]}`}
                  >
                    {repeatMode === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
                  </button>
                </div>

                {/* Master Volume Slider Row */}
                <div className="flex items-center gap-2.5 px-4 py-2 shrink-0 bg-white/[0.02] border-y border-white/5">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="p-1 rounded-lg text-white/60 hover:text-amber-300 hover:bg-white/5 transition-colors cursor-pointer"
                    title={isMuted ? "음소거 해제" : "음소거"}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    aria-label="볼륨 조절"
                  />
                  <span className="text-[10px] text-white/50 font-mono w-8 text-right">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>

                {/* Media Tab Selector: BGM vs Mood */}
                <div className="flex items-center gap-1 px-3 pt-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('bgm')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeMediaTab === 'bgm'
                        ? "bg-amber-400/20 text-amber-200 border border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.15)]"
                        : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Music size={13} />
                    <span>BGM 음악 ({tracks.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('mood')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeMediaTab === 'mood'
                        ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.15)]"
                        : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Headphones size={13} />
                    <span>자연의 소리 {isMoodPlaying ? "· 켜짐" : ""}</span>
                  </button>
                </div>

                {/* Tab 1: BGM Playlist */}
                {activeMediaTab === 'bgm' && (
                  <div className="flex flex-col p-3 pt-2">
                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
                      {[
                        { id: "all", label: "전체", count: tracks.length },
                        { id: "사주·오행", label: "사주·오행", count: tracks.filter((t) => t.category === "사주·오행").length },
                        { id: "오라클 타로", label: "오라클 타로", count: tracks.filter((t) => t.category === "오라클 타로").length },
                        { id: "솔페지오", label: "솔페지오", count: tracks.filter((t) => t.category === "솔페지오").length },
                        { id: "세도나 방하착", label: "세도나 방하착", count: tracks.filter((t) => t.category === "세도나 방하착").length },
                        { id: "호오포노포노", label: "호오포노포노", count: tracks.filter((t) => t.category === "호오포노포노").length },
                        { id: "양자·뮤즈", label: "양자·뮤즈", count: tracks.filter((t) => t.category === "양자·뮤즈").length },
                      ].map((cat) => {
                        const isCatActive = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-2 py-1 rounded-full text-[9px] font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                              isCatActive
                                ? "bg-amber-400/25 text-amber-300 border border-amber-400/40 shadow-[0_0_6px_rgba(251,191,36,0.2)]"
                                : "text-white/45 hover:text-white/80 hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            {cat.label} ({cat.count})
                          </button>
                        );
                      })}
                    </div>

                    {/* Tracks List */}
                    <div className="max-h-[220px] overflow-y-auto no-scrollbar flex flex-col gap-1 pr-0.5">
                      {showHiddenTracks ? (
                        hiddenTracks.length > 0 ? (
                          hiddenTracks.map((hidden) => (
                            <div
                              key={hidden.id}
                              className="flex items-center gap-1.5 w-full rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all px-2.5 py-1.5"
                            >
                              <div className="flex flex-1 min-w-0 flex-col">
                                <span className="text-[11px] text-white/80 truncate">{hidden.name}</span>
                                <span className="text-[9px] text-white/30 truncate">
                                  {hidden.artist || "숨김 처리됨"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleRestoreTrack(hidden, e)}
                                className="shrink-0 p-1.5 rounded-lg text-white/40 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all cursor-pointer"
                                title="목록에 다시 추가"
                              >
                                <RotateCcw size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => void handlePermanentDeleteTrack(hidden, e)}
                                className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer"
                                title="영구 삭제"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="px-2 py-8 text-[11px] text-white/35 text-center">
                            숨겨진 곡이 없습니다.
                          </p>
                        )
                      ) : (
                        tracks
                          .map((track, idx) => ({ track, idx }))
                          .filter(({ track }) => selectedCategory === "all" || track.category === selectedCategory)
                          .map(({ track, idx }) => {
                            const isActive = shuffledIndices[queueIndex] === idx;
                            const rowKey = getBgmTrackId(track);
                            return (
                              <div
                                key={rowKey}
                                className={`flex items-center gap-1.5 w-full rounded-xl transition-all duration-150 ${
                                  isActive
                                    ? "bg-amber-400/15 border border-amber-400/35 shadow-[0_0_10px_rgba(251,191,36,0.15)]"
                                    : "hover:bg-white/5 border border-transparent"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectTrack(idx)}
                                  className={`flex flex-1 min-w-0 items-center justify-between text-left px-2.5 py-1.5 transition-all cursor-pointer ${
                                    isActive ? "text-amber-200 font-semibold" : "text-white/70 hover:text-white"
                                  }`}
                                >
                                  <div className="flex flex-col min-w-0 max-w-[85%]">
                                    <span className="text-[11px] truncate flex items-center gap-1.5">
                                      {track.name}
                                      {isActive && isPlaying && !isBuffering && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                                      )}
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {track.category && (
                                        <span className="px-1.5 py-0.2 rounded text-[7.5px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 shrink-0">
                                          {track.category}
                                        </span>
                                      )}
                                      <span className="text-[8.5px] text-white/40 truncate">{track.artist}</span>
                                    </div>
                                  </div>
                                  {isActive && (
                                    <span className="text-[9px] text-amber-300 font-mono shrink-0 font-bold">
                                      PLAYING
                                    </span>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveTrack(idx, e)}
                                  disabled={tracks.length <= 1}
                                  className="shrink-0 p-1.5 mr-1 rounded-lg text-white/25 hover:text-rose-300 hover:bg-rose-500/10 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer"
                                  title="목록에서 숨기기"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            );
                          })
                      )}
                    </div>

                    {/* Playlist Footer Actions */}
                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handleResetToCurated30Tracks}
                        className="text-[10px] text-white/45 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw size={10} />
                        <span>30곡 원본 전체 복원</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleHiddenTracks}
                        className="text-[10px] text-white/45 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <EyeOff size={10} />
                        <span>{showHiddenTracks ? "음악 목록 보기" : `숨긴 곡 (${hiddenTracks.length})`}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Mood Sounds (자연의 소리 & 백색소음) */}
                {activeMediaTab === 'mood' && (
                  <div className="flex flex-col p-3 pt-2 gap-3">
                    {/* Master Mood Controls Row */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currentMoodPreset.emoji}</span>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-white">
                            {currentMoodPreset.name}
                          </span>
                          <span className="text-[9px] text-white/40">
                            {isMoodPlaying ? "현재 앰비언트 재생 중" : "일시정지됨"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleMoodPlay()}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          isMoodPlaying
                            ? "bg-emerald-400 text-neutral-950 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {isMoodPlaying ? "앰비언트 끄기" : "앰비언트 켜기"}
                      </button>
                    </div>

                    {/* Independent Mood Sound Volume Slider */}
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <Headphones size={14} className="text-emerald-400 shrink-0" />
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between text-[10px] text-white/60 mb-1">
                          <span>자연의 소리 독립 볼륨 (BGM과 동시 믹싱)</span>
                          <span className="font-mono text-emerald-300 font-bold">
                            {Math.round(moodVolume * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={moodVolume}
                          onChange={(e) => setMoodVolume(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {moodPresets.map((preset) => {
                        const isPresetActive = isMoodPlaying && activeMood === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              if (activeMood === preset.id && isMoodPlaying) {
                                toggleMoodPlay();
                              } else {
                                setMoodSound(preset.id);
                                if (!isMoodPlaying) {
                                  toggleMoodPlay(preset.id);
                                }
                              }
                            }}
                            className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              isPresetActive
                                ? `bg-gradient-to-br ${preset.accentClass} shadow-[0_0_12px_rgba(52,211,153,0.2)]`
                                : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5 text-white/70"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xl">{preset.emoji}</span>
                              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">
                                {preset.badge}
                              </span>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-white leading-tight">
                                {preset.name}
                              </p>
                              <p className="text-[8.5px] text-white/40 truncate mt-0.5">
                                {preset.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Hint */}
              <div className="px-4 py-2 border-t border-white/10 bg-black/50 text-center shrink-0">
                <p className="text-[10px] text-white/40">
                  💡 LP판 탭: 재생/일시정지 · 더블탭: 다음곡 · 꾹 누르기(홀드): 상세메뉴
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Immersive 3D Audio Visualizer Stage */}
      {show3DVisualizerStage && (
        <AudioReactive3DVisualizer
          mode="stage"
          isPlaying={isPlaying && !isBuffering}
          trackCategory={currentTrack?.category}
          trackName={currentTrack?.name}
          trackArtist={currentTrack?.artist}
          onCloseStage={() => setShow3DVisualizerStage(false)}
        />
      )}
    </>
  );
}
