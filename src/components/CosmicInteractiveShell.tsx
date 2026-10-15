import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Square, Copy, Check, Volume2, Wind, Sparkles, RefreshCw, Music, 
  ChevronRight, Sparkle
} from 'lucide-react';

interface MirrorRecord {
  id: string;
  source: 'trinity' | 'muse' | 'orange' | 'bluebird' | 'heal';
  sourceLabel: string;
  type: string;
  title: string;
  content: string;
  timestamp: Date;
  classification: 'rituals' | 'chats' | 'daily' | 'soul_spec';
  metadata?: any;
}

interface CosmicInteractiveShellProps {
  record: MirrorRecord;
}

export function CosmicInteractiveShell({ record }: CosmicInteractiveShellProps) {
  // --- STATE FOR INSPIRATIONAL QUOTE ---
  const [detectedQuote, setDetectedQuote] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // --- STATE FOR RECOMMENDED MUSIC ---
  const [detectedMusic, setDetectedMusic] = useState<{ name: string; url: string } | null>(null);

  // --- STATE FOR INTERACTIVE BREATHING ---
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'holdIn' | 'exhale' | 'holdOut'>('inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathCount, setBreathCount] = useState(0);
  const [breatheWithSound, setBreatheWithSound] = useState(false);
  const breathAudioCtxRef = useRef<AudioContext | null>(null);
  const breathOscRef = useRef<OscillatorNode | null>(null);
  const breathGainRef = useRef<GainNode | null>(null);

  // 1. REGEX SCAN TO RETRIEVE QUOTES & BREATH DIRECTIVES INDEPENDENTLY
  useEffect(() => {
    if (!record) return;

    // Detect quotes only
    const quotePattern = /["“'‘]([^"”“'‘.]{12,})["”'’]/;
    const qMatch = (record.content || '').match(quotePattern);
    if (qMatch) {
      setDetectedQuote(qMatch[1].trim());
    } else {
      setDetectedQuote('');
    }

    // Detect music references for YouTube link recommendation
    const contentLower = (record.content || '').toLowerCase();
    let musicData: { name: string; url: string } | null = null;

    if (contentLower.includes('짐노페디') || contentLower.includes('gymnopedie') || contentLower.includes('gymnopédie') || contentLower.includes('사티')) {
      musicData = {
        name: "에릭 사티 - 짐노페디 1번 (Erik Satie - Gymnopédie No.1)",
        url: "https://www.youtube.com/watch?v=S-Xm7s9e96Y"
      };
    } else if (contentLower.includes('달빛') || contentLower.includes('드뷔시') || contentLower.includes('debussy')) {
      musicData = {
        name: "클로드 드뷔시 - 달빛 (Claude Debussy - Clair de Lune)",
        url: "https://www.youtube.com/watch?v=WNcsUNKlAKw"
      };
    } else if (contentLower.includes('녹턴') || contentLower.includes('쇼팽') || contentLower.includes('chopin')) {
      musicData = {
        name: "프레데리크 쇼팽 - 야상곡 2번 (Frédéric Chopin - Nocturne Op.9 No.2)",
        url: "https://www.youtube.com/watch?v=tV5U8dB_tgI"
      };
    } else if (contentLower.includes('오르골') || contentLower.includes('musicbox')) {
      musicData = {
        name: "우주의 축복을 전하는 치유의 오르골(Celestial Music Box)",
        url: "https://www.youtube.com/watch?v=F_S9V9SAsYI"
      };
    } else if (contentLower.includes('g선상') || contentLower.includes('바흐') || contentLower.includes('bach')) {
      musicData = {
        name: "요한 제바스티안 바흐 - G선상의 아리아 (J.S. Bach - Air on the G String)",
        url: "https://www.youtube.com/watch?v=FZ_7bV3S42g"
      };
    } else if (contentLower.includes('월광') || contentLower.includes('베토벤') || contentLower.includes('beethoven')) {
      musicData = {
        name: "루트비히 판 베토벤 - 월광 소나타 1악장 (Beethoven - Moonlight Sonata)",
        url: "https://www.youtube.com/watch?v=4Tr0otuiQuU"
      };
    } else if (contentLower.includes('사계') || contentLower.includes('비발디')) {
      musicData = {
        name: "안토니오 비발디 - 사계 '봄' (Antonio Vivaldi - The Four Seasons 'Spring')",
        url: "https://www.youtube.com/watch?v=mFWQgxXM_b8"
      };
    } else if (contentLower.includes('피아노') || contentLower.includes('선율') || contentLower.includes('라디오') || contentLower.includes('체르니') || contentLower.includes('바이엘')) {
      const rx = /([가-힣\s]{2,15})(?:피아노|선율|라디오|음악|곡)/i;
      const match = (record.content || '').match(rx);
      const queryText = match ? `${match[1].trim()} 피아노 명상 선율` : "힐링 클래식 피아노 음악";
      musicData = {
        name: `성찰록 맞춤 쾌적 선율: ${queryText}`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(queryText)}`
      };
    }

    setDetectedMusic(musicData);
  }, [record]);

  // Clean-up playing sounds on unmount
  useEffect(() => {
    return () => {
      stopBreathSound();
    };
  }, []);


  // --- BREATHING ENGINE (SAMSARA BREATH HARMONY) ---
  // Inhale (4s) -> Hold In (2s) -> Exhale (4s) -> Hold Out (2s)
  useEffect(() => {
    let intervalId: any;
    if (isBreathingActive) {
      intervalId = setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            // Trigger state transition
            setBreathPhase(curr => {
              if (curr === 'inhale') {
                if (breatheWithSound) sweepBreathPitch('holdIn');
                return 'holdIn';
              }
              if (curr === 'holdIn') {
                if (breatheWithSound) sweepBreathPitch('exhale');
                return 'exhale';
              }
              if (curr === 'exhale') {
                if (breatheWithSound) sweepBreathPitch('holdOut');
                return 'holdOut';
              }
              // Return to inhale
              setBreathCount(c => c + 1);
              if (breatheWithSound) sweepBreathPitch('inhale');
              return 'inhale';
            });
            // Reset timers for next step: inhale:4, holdIn:2, exhale:4, holdOut:2
            return 1; // Transitioning will re-trigger and we compute duration below
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathTimer(4);
      setBreathPhase('inhale');
    }

    return () => clearInterval(intervalId);
  }, [isBreathingActive, breatheWithSound]);

  // Handle phase specific durations
  useEffect(() => {
    if (!isBreathingActive) return;
    if (breathPhase === 'inhale' || breathPhase === 'exhale') {
      setBreathTimer(4);
    } else {
      setBreathTimer(2);
    }
  }, [breathPhase, isBreathingActive]);

  // --- BREATHING SOUND SWEETENER ---
  const startBreathSound = () => {
    try {
      stopBreathSound();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      breathAudioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      
      // Gentle soft frequency
      const initialHz = breathPhase === 'inhale' ? 150 : (breathPhase === 'exhale' ? 240 : 190);
      osc.frequency.setValueAtTime(initialHz, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime); // very thin soft cosmic background wave
      
      // Connect
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      breathOscRef.current = osc;
      breathGainRef.current = gain;

      // Trigger first pitch sweep
      sweepBreathPitch(breathPhase);
    } catch (e) {
      console.warn("Breath synth fail:", e);
    }
  };

  const stopBreathSound = () => {
    try {
      if (breathOscRef.current) {
        breathOscRef.current.stop();
        breathOscRef.current.disconnect();
      }
      if (breathAudioCtxRef.current) {
        breathAudioCtxRef.current.close();
      }
    } catch (_) {}
    breathOscRef.current = null;
    breathAudioCtxRef.current = null;
  };

  const sweepBreathPitch = (phase: 'inhale' | 'holdIn' | 'exhale' | 'holdOut') => {
    const osc = breathOscRef.current;
    const gain = breathGainRef.current;
    const ctx = breathAudioCtxRef.current;
    if (!osc || !gain || !ctx) return;

    const now = ctx.currentTime;
    if (phase === 'inhale') {
      // Inhale: frequency rises from 140Hz up to 260Hz like a deep inhalation breath, and volume inflates
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 4.0);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 4.0);
    } else if (phase === 'holdIn') {
      // Hold high: static light frequency and solid volume
      osc.frequency.setValueAtTime(260, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 2.0);
    } else if (phase === 'exhale') {
      // Exhale: frequency fades from 260Hz down to 130Hz and volume deflates
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 4.0);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.005, now + 4.0);
    } else {
      // Hold empty: absolute whisper
      osc.frequency.setValueAtTime(130, now);
      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 2.0);
    }
  };

  useEffect(() => {
    if (isBreathingActive && breatheWithSound) {
      startBreathSound();
    } else {
      stopBreathSound();
    }
  }, [isBreathingActive, breatheWithSound]);


  // --- WISDOM QUOTE COPIER ---
  const handleCopyQuote = () => {
    if (!detectedQuote) return;
    navigator.clipboard.writeText(`"${detectedQuote}" - ${record.sourceLabel} 의식 성찰록 중에서`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full pt-4">
      {/* DYNAMIC BREATHING EXERCISE (SAMSARA BREATH COACH) */}
      {(record.type === 'meditation' || (record.content || '').includes('명상') || record.source === 'heal') && (
        <div className="p-6 rounded-3xl bg-emerald-950/15 border border-emerald-550/20 backdrop-blur-sm space-y-5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Wind size={18} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-emerald-200">생체 주기 동기화 메커니즘 (마음 챙김)</h4>
                <p className="text-[10px] text-white/50 font-cute mt-0.5">기록에 새겨진 치유 진동수에 호흡의 심연적 리듬을 조율합니다.</p>
              </div>
            </div>

            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-4 py-2 rounded-xl text-[11px] font-cute font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                isBreathingActive 
                  ? 'bg-slate-800 border border-white/10 text-white/80 hover:bg-slate-700' 
                  : 'bg-emerald-600 border border-emerald-500/30 text-white hover:bg-emerald-550'
              }`}
            >
              {isBreathingActive ? '명상 가이드 일시중지' : '명상 수련 시작하기'}
            </button>
          </div>

          <AnimatePresence>
            {isBreathingActive && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-4"
              >
                {/* Breathing Visualizer Sandbox */}
                <div className="flex flex-col items-center justify-center py-6 bg-black/40 rounded-2xl relative border border-white/5">
                  
                  {/* Dynamic pulsing circle */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <motion.div 
                      animate={{
                        scale: breathPhase === 'inhale' ? 1.4 :
                               breathPhase === 'holdIn' ? 1.4 :
                               breathPhase === 'exhale' ? 0.95 : 0.95,
                        backgroundColor: breathPhase === 'inhale' ? 'rgba(16, 185, 129, 0.25)' :
                                         breathPhase === 'holdIn' ? 'rgba(56, 189, 248, 0.25)' :
                                         breathPhase === 'exhale' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                        borderColor: breathPhase === 'inhale' ? '#10b981' :
                                     breathPhase === 'holdIn' ? '#38bdf8' :
                                     breathPhase === 'exhale' ? '#a855f7' : '#64748b'
                      }}
                      transition={{ 
                        duration: breathPhase === 'inhale' || breathPhase === 'exhale' ? 4 : 2, 
                        ease: "easeInOut" 
                      }}
                      className="absolute rounded-full w-24 h-24 border-2 shadow-[0_0_25px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center z-10"
                    />

                    {/* Ripple effects */}
                    {breathPhase === 'inhale' && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 border border-emerald-500/30 rounded-full"
                      />
                    )}

                    <div className="z-20 text-center pointer-events-none select-none">
                      <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                        {breathPhase === 'inhale' ? 'Inhale' :
                         breathPhase === 'holdIn' ? 'Hold' :
                         breathPhase === 'exhale' ? 'Exhale' : 'Rest'}
                      </p>
                      <p className="text-xl font-bold text-white font-mono mt-1">
                        {breathTimer}
                      </p>
                    </div>
                  </div>

                  <div className="text-center space-y-1.5 mt-4 z-10">
                    <h5 className="text-xs font-cute font-bold text-emerald-300">
                      {breathPhase === 'inhale' && '🌿 마음을 열어 생명의 에너지를 가득 채웁니다 (들숨)'}
                      {breathPhase === 'holdIn' && '🌌 우주의 호흡과 온전히 일체되어 머무릅니다 (숨참음)'}
                      {breathPhase === 'exhale' && '🍃 내면의 묵은 불안과 상념을 우주로 내려놓습니다 (날숨)'}
                      {breathPhase === 'holdOut' && '✨ 무한한 정화의 공허 속에서 고요히 안착합니다 (숨참음)'}
                    </h5>
                    <p className="text-[10px] text-white/40 font-cute">
                      현재 수련 경과: {breathCount} 사이클 완료
                    </p>
                  </div>
                </div>

                {/* Ambient Synthesizer Option */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-cute text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Music size={12} />
                    동조 피치 사운드 가동 (호흡 압력 동기화 음향)
                  </span>
                  <button 
                    onClick={() => setBreatheWithSound(!breatheWithSound)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      breatheWithSound 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-white/5 text-white/30 border border-white/5'
                    }`}
                  >
                    {breatheWithSound ? 'SOUND ON' : 'SOUND OFF'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3. SIMPLIFIED WISDOM QUOTE INFO */}
      {detectedQuote && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-left space-y-2">
          <p className="text-[10px] font-mono tracking-widest text-[#a855f7] uppercase font-bold flex items-center gap-1.5">
            🔑 세션 속 중요 구절 및 명언 (Wisdom Insight)
          </p>
          <blockquote className="text-sm font-serif italic text-white/80 leading-relaxed pl-3 border-l-2 border-purple-500/40">
            “{detectedQuote}”
          </blockquote>
        </div>
      )}

      {/* 4. RECOMMENDED MUSIC YOUTUBE CARD */}
      {detectedMusic && (
        <div className="p-5 rounded-2xl bg-sky-950/20 border border-sky-500/20 text-left space-y-3">
          <p className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold flex items-center gap-1.5">
            🎵 맞춤 치유 음악 가이드 (Musical Recommendation)
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
            <div className="space-y-1">
              <p className="text-xs font-cute text-sky-200/95 font-bold">
                {detectedMusic.name}
              </p>
              <p className="text-[10px] text-white/40 font-cute leading-relaxed">
                성찰록에 소개된 선율을 깊은 주파수 안정을 위해 YouTube에서 즉시 감상하실 수 있습니다.
              </p>
              <p className="text-[9px] text-sky-400/80 font-mono select-all break-all">
                {detectedMusic.url}
              </p>
            </div>
            <a 
              href={detectedMusic.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-cute text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1.5 shrink-0 shadow-md hover:scale-105 active:scale-95"
            >
              YouTube 바로가기
              <ChevronRight size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
