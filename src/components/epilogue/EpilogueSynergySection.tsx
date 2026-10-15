import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Award,
  Volume2,
  VolumeX,
  Check,
  Copy,
  RefreshCw,
  Moon,
  Star,
  Compass,
  Zap,
  Flame,
  Feather,
  Palette,
  Shield,
  Play,
  Square,
  Share2,
  Archive,
  History,
  ChevronRight
} from 'lucide-react';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLM } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playAiResultNotification } from '@/lib/audioHaptics';
import { playTTS, stopTTS, useTTSActive } from '@/utils/tts';
import { EpilogueAchievementShareModal } from './EpilogueAchievementShareModal';
import { calculateEpilogueAchievementStats } from '@/types/epilogueAchievement';
import {
  COSMIC_FOCUS_OPTIONS,
  type CosmicFocusOption,
  type ChronicleStampData,
  getDynamicSoulChronicle,
  saveChronicleToArchive,
  loadChronicleArchive
} from '@/lib/epilogueChronicleData';

export function EpilogueSynergySection() {
  const { sharedState, updateSharedState } = useApp();
  const userProfile = getPersistentUserProfile();
  
  const [selectedFocus, setSelectedFocus] = useState<string>(COSMIC_FOCUS_OPTIONS[0].id);
  const [customInsight, setCustomInsight] = useState<string>('');
  const [activeFrequency, setActiveFrequency] = useState<number>(COSMIC_FOCUS_OPTIONS[0].frequency);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 초기값부터 사용자 프로필 및 오늘 날짜에 기반하여 동적으로 생성
  const initialChronicle = useMemo(() => {
    return getDynamicSoulChronicle(COSMIC_FOCUS_OPTIONS[0].id, COSMIC_FOCUS_OPTIONS[0].frequency, '', userProfile);
  }, []);

  const [chronicleData, setChronicleData] = useState<ChronicleStampData>(initialChronicle);
  const [isSynthesized, setIsSynthesized] = useState<boolean>(false); // 버튼을 눌러야 발행되도록 변경
  const [copied, setCopied] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [archiveHistory, setArchiveHistory] = useState<ChronicleStampData[]>([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);

  // 아카이브 기록 로드
  useEffect(() => {
    const loaded = loadChronicleArchive();
    setArchiveHistory(loaded);
  }, []);

  const achievementStats = useMemo(() => {
    let entries: any[] = [];
    try {
      const raw = localStorage.getItem('epilogue_diary_history');
      if (raw) entries = JSON.parse(raw);
    } catch {}
    if ((!entries || entries.length === 0) && Array.isArray(sharedState?.epilogueHistory)) {
      entries = sharedState.epilogueHistory;
    }
    const rawNick = userProfile?.basic?.nickname?.trim() || userProfile?.basic?.name?.trim();
    const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
    return calculateEpilogueAchievementStats(
      entries,
      nickname,
      chronicleData.soulEvolutionLevel
    );
  }, [sharedState?.epilogueHistory, userProfile, chronicleData.soulEvolutionLevel]);

  const isTTSActive = useTTSActive();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Toggle Solfeggio frequency tone generator
  const toggleFrequencyTone = (freq?: number) => {
    const targetFreq = freq || activeFrequency;
    if (isAudioPlaying) {
      try {
        oscRef.current?.stop();
        audioCtxRef.current?.close();
      } catch (e) {}
      audioCtxRef.current = null;
      oscRef.current = null;
      setIsAudioPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        setIsAudioPlaying(true);
      } catch (e) {
        console.warn('Audio synthesis error:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      try {
        oscRef.current?.stop();
        audioCtxRef.current?.close();
      } catch (e) {}
      stopTTS();
    };
  }, []);

  // 포커스 변경 시: 포커스 및 주파수 갱신 (이미 발행된 상태라면 연대기 데이터 동기화)
  const handleSelectFocus = (focus: CosmicFocusOption) => {
    setSelectedFocus(focus.id);
    setActiveFrequency(focus.frequency);
    if (isSynthesized) {
      const updated = getDynamicSoulChronicle(focus.id, focus.frequency, customInsight, userProfile);
      setChronicleData(updated);
    }
  };

  // 영혼 연대기 스탬프 & 수면 프라이밍 합성 (충분한 25초 타임아웃 및 동적 폴백)
  const handleSynthesizeChronicle = async () => {
    setIsLoading(true);
    stopTTS();

    const focusObj = COSMIC_FOCUS_OPTIONS.find((f) => f.id === selectedFocus) || COSMIC_FOCUS_OPTIONS[0];
    const mbti = userProfile?.psych?.mbti || (userProfile as any)?.psychology?.mbti || 'INFP';
    const rawNick = userProfile?.basic?.nickname?.trim() || userProfile?.basic?.name?.trim();
    const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
    const insightText = customInsight.trim() || '온 우주와 내가 하나임을 자각하는 깊은 현존';

    const systemPrompt = `당신은 PRISM 7대 우주 공간을 총괄하는 〈영혼 연대기 & 마스터 아카이브〉 대마스터입니다.
[Diary]의 밤의 내면 성찰 기록과 [Profile]의 고유 영혼 프로필(MBTI: ${mbti}, 닉네임: ${nickname}), 그리고 선택된 밤의 영혼 진화 도약 포커스("${focusObj.label}")를 완벽히 융합하여,
오늘의 고유한 영혼 진화 등급과 7대 우주 황금 봉인 스탬프, 그리고 수면 전 잠재의식 프라이밍 선언문을 발행하세요.

[필수 대원칙]
1. 정형화되거나 매일 똑같은 템플릿 문구를 절대 출력하지 마세요.
2. 사용자가 남긴 깨달음("${insightText}")과 닉네임, 선택된 영혼 테마("${focusObj.label}")를 깊이 반영하여, 가슴 벅차오르는 거룩하고 시적인 문장으로 작성하세요.
3. 주파수나 Hz 등의 물리적 수치 언급은 배제하고, 영혼의 깨달음과 내면의 평화, 의식의 진화에 집중하여 서술하세요.
4. 반드시 유효한 JSON 형식으로만 응답하세요.`;

    const userPrompt = `[양쪽 메뉴 융합: DIARY 성찰 일기 ✕ PROFILE 영혼 프로필]
[선택된 밤의 영혼 도약 포커스]: ${focusObj.label} (${focusObj.desc})
[오늘 영혼의 깨달음/메아리]: "${insightText}"
[사용자 프로필]: 닉네임(${nickname}), 성향/MBTI(${mbti})

반드시 아래 JSON 스키마로만 엄격하게 응답하세요:
{
  "title": "영혼 연대기 고유 칭호 (예: 〈${nickname}의 ${focusObj.label}〉 마스터 아카이브)",
  "soulEvolutionLevel": "오늘의 영혼 진화 등급 (예: Mastery Level XII · 다이아몬드 통합 의식)",
  "dailyCoreTheme": "오늘 하루를 관통하는 핵심 영혼 테마 1문장",
  "soulAlignmentSynthesis": "선택된 영혼 포커스와 개인의 영혼 사명이 어떻게 융합되어 진화했는지를 통찰하는 거룩하고 품격 있는 해설 (3~4문장)",
  "sevenPrismStampStatus": [
    { "space": "PROLOGUE (프롤로그)", "seal": "불굴의 멘탈 방패 각인 🛡️", "status": "SYNCHRONIZED" },
    { "space": "ORANGE (오렌지)", "seal": "양자 현실화 도약 🌲", "status": "SYNCHRONIZED" },
    { "space": "TRINITY (트리니티)", "seal": "대운 개운 & 타로 오라클 ✨", "status": "SYNCHRONIZED" },
    { "space": "AURA (오라)", "seal": "저항 0% 완전 방하착 ⚡", "status": "SYNCHRONIZED" },
    { "space": "BLUEBIRD (블루버드)", "seal": "호오포노포노 백지 환생 🐦", "status": "SYNCHRONIZED" },
    { "space": "MUSE (뮤즈)", "seal": "거장의 영감 마스터클래스 🎶", "status": "SYNCHRONIZED" },
    { "space": "EPILOGUE (에필로그)", "seal": "영혼 연대기 마스터 아카이브 🌙", "status": "SYNCHRONIZED" }
  ],
  "preSleepPrimingAffirmation": "취침 전 잠재의식을 우주와 동조시키는 수면 전 영혼 프라이밍 확언 1~2문장",
  "chronicleSealCode": "SOUL-CHRONICLE-PRISM-999-GOLD"
}`;

    // 25초 안전 타임아웃
    const safetyTimeout = new Promise<ChronicleStampData>((resolve) => {
      setTimeout(() => {
        resolve(getDynamicSoulChronicle(selectedFocus, activeFrequency, insightText, userProfile));
      }, 25000);
    });

    const runAI = async (): Promise<ChronicleStampData> => {
      try {
        const raw = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          responseFormat: { type: 'json_object' }
        });
        const parsed = typeof raw === 'string' ? JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) : raw;
        if (parsed && parsed.soulAlignmentSynthesis && parsed.dailyCoreTheme) {
          return {
            ...parsed,
            id: `chronicle_${Date.now()}`,
            timestamp: Date.now(),
            dateKey: new Date().toISOString().slice(0, 10),
          };
        }
      } catch (e) {
        console.warn('[EpilogueSynergy] invokeLLM error, using dynamic fallback:', e);
      }
      return getDynamicSoulChronicle(selectedFocus, activeFrequency, insightText, userProfile);
    };

    try {
      const result = await Promise.race([runAI(), safetyTimeout]);
      setChronicleData(result);
      setIsSynthesized(true);
      try {
        playAiResultNotification();
      } catch (_) {}

      // 아카이브에 영구 저장 및 갱신
      const updatedArchive = saveChronicleToArchive(result);
      setArchiveHistory(updatedArchive);

      recordPrismFeature({
        app: 'epilogue',
        featureName: 'Soul Chronicle Master Synergy',
        summary: result.title,
        details: { focus: focusObj.label, title: result.title }
      });
      updateSharedState({
        epilogueHistory: [result, ...(sharedState?.epilogueHistory || [])].slice(0, 30)
      }, 'EPILOGUE');
    } catch (e) {
      console.warn('Epilogue fallback error:', e);
      const fallback = getDynamicSoulChronicle(selectedFocus, activeFrequency, insightText, userProfile);
      setChronicleData(fallback);
      setIsSynthesized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoicePriming = () => {
    if (isTTSActive) {
      stopTTS();
    } else {
      const speech = `오늘의 영혼 연대기 선언입니다. 오늘의 핵심 테마: ${chronicleData.dailyCoreTheme}. 영혼 정렬 통찰: ${chronicleData.soulAlignmentSynthesis}. 수면 전 잠재의식 프라이밍 확언입니다. ${chronicleData.preSleepPrimingAffirmation}`;
      playTTS(speech, 'Kore', false, '명상');
    }
  };

  const handleCopy = () => {
    const text = `🌙 [${chronicleData.title}]\n\n✨ 등급: ${chronicleData.soulEvolutionLevel}\n\n🌟 오늘 영혼의 핵심 테마:\n"${chronicleData.dailyCoreTheme}"\n\n🕊️ 영혼 정렬 통찰:\n"${chronicleData.soulAlignmentSynthesis}"\n\n🔮 수면 전 잠재의식 프라이밍 확언:\n"${chronicleData.preSleepPrimingAffirmation}"\n\n봉인 코드: ${chronicleData.chronicleSealCode}\n- PRISM Soul Chronicle & Master Archive`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 text-white font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-purple-500/30 bg-gradient-to-br from-purple-950/50 via-zinc-950/90 to-pink-950/40 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-pink-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Sparkles size={12} className="text-purple-400 animate-pulse" />
                DIARY ✕ PROFILE FUSION
              </span>
              <span className="text-[10px] text-white/40 font-mono">SOUL HARMONY AWAKENING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Award className="text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" size={28} />
              <span>영혼 연대기 &amp; 마스터 아카이브</span>
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/70 max-w-xl leading-relaxed">
              <strong>Diary(밤의 성찰 일기)</strong>와 <strong>Profile(영혼 프로필 &amp; 사명)</strong>을 융합하여, 매일매일 새로운 영혼 진화 등급과 7대 우주 황금 봉인 스탬프, 잠재의식 프라이밍을 완성하는 마스터 아카이브입니다.
            </p>
          </div>

          {/* Ambient Meditation Sound Control */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => toggleFrequencyTone()}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
                isAudioPlaying
                  ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
              }`}
            >
              {isAudioPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{isAudioPlaying ? '수면 명상음 재생 중' : '수면 명상음 듣기'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Prism Cosmic Live Footprint Grid */}
      <div className="glass p-6 sm:p-7 rounded-[32px] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-purple-300 flex items-center gap-2 font-mono uppercase tracking-wider">
            <Compass size={16} className="text-purple-400" />
            <span>1. PRISM 7대 우주 공간 공명 현황 (Omni-Resonance Matrix)</span>
          </label>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            ALL SPACES READY
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {[
            { name: 'PROLOGUE', icon: Shield, color: 'text-sky-400', desc: '멘탈 방패 각인' },
            { name: 'ORANGE', icon: Zap, color: 'text-amber-400', desc: '양자 현실화 도약' },
            { name: 'TRINITY', icon: Star, color: 'text-yellow-400', desc: '사주 타로 개운' },
            { name: 'AURA', icon: Flame, color: 'text-emerald-400', desc: '0% 방하착 챔버' },
            { name: 'BLUEBIRD', icon: Feather, color: 'text-cyan-400', desc: '감정 백지 환생' },
            { name: 'MUSE', icon: Palette, color: 'text-pink-400', desc: '거장 마스터클래스' },
            { name: 'EPILOGUE', icon: Moon, color: 'text-purple-400', desc: '영혼 연대기 아카이브' }
          ].map((sp) => {
            const Icon = sp.icon;
            return (
              <div
                key={sp.name}
                className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-1 hover:border-purple-500/30 transition-all"
              >
                <Icon size={16} className={sp.color} />
                <span className="text-[10px] font-mono font-bold text-white/90">{sp.name}</span>
                <span className="text-[9px] text-white/40 leading-tight font-sans">{sp.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cosmic Focus Selection */}
      <div className="glass p-6 sm:p-8 rounded-[32px] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-purple-300 flex items-center gap-2 font-mono uppercase tracking-wider">
            <Moon size={16} className="text-purple-400" />
            <span>2. 오늘 밤 영혼 진화 &amp; 잠재의식 도약 테마 선택 (8대 영혼 포커스)</span>
          </label>
          <span className="text-[10px] text-white/40 font-sans">고차원 정렬</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COSMIC_FOCUS_OPTIONS.map((focus) => {
            const isSelected = selectedFocus === focus.id;
            return (
              <button
                key={focus.id}
                type="button"
                onClick={() => handleSelectFocus(focus)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                  isSelected
                    ? 'bg-purple-500/20 border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xl">{focus.icon}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}>
                    {focus.label}
                  </span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed font-sans">{focus.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Custom Insight Input (Optional) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-white/60 flex items-center justify-between font-sans">
            <span>오늘 영혼에 남은 가장 거룩한 깨달음 또는 우주의 메아리 (선택):</span>
            <span className="text-[10px] text-white/30">직접 입력 가능</span>
          </label>
          <input
            type="text"
            value={customInsight}
            onChange={(e) => setCustomInsight(e.target.value)}
            placeholder="예: 모든 상황 속에서 평온을 지켜낸 나의 본래 빛을 발견한 날..."
            className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/60 font-sans"
          />
        </div>

        {/* Synthesis Button */}
        <button
          onClick={handleSynthesizeChronicle}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin text-white" />
              <span>영혼 연대기 &amp; 마스터 아카이브 각인 중...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} className="text-yellow-300" />
              <span>〈영혼 연대기 스탬프 &amp; 수면 프라이밍〉 즉시 발행</span>
            </>
          )}
        </button>
      </div>

      {/* Output Display */}
      {isSynthesized ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black/95 border border-purple-500/30 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400">
                  SOUL CHRONICLE GOLDEN STAMP
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono font-bold">
                  {chronicleData.soulEvolutionLevel}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{chronicleData.title}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {/* Pre-Sleep TTS Voice Priming Button */}
              <button
                onClick={handleToggleVoicePriming}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTTSActive
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                }`}
              >
                {isTTSActive ? <VolumeX size={14} className="text-amber-300" /> : <Play size={14} className="text-purple-300" />}
                <span>{isTTSActive ? '음성 낭독 중지' : '수면 프라이밍 음성 낭독'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? '복사 완료' : '전체 복사'}</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 border border-purple-400/40"
                title="성취 통계 데이터 이미지 렌더링 및 커뮤니티 공유"
              >
                <Share2 size={14} className="text-amber-300" />
                <span>성취 카드 공유하기</span>
              </button>
            </div>
          </div>

          {/* Core Theme & Synthesis Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 via-zinc-900/50 to-pink-900/20 border border-purple-400/40 relative shadow-inner space-y-3">
            <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Star size={14} className="text-yellow-400" />
              오늘의 영혼 테마: {chronicleData.dailyCoreTheme}
            </span>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight break-keep">
              "{chronicleData.soulAlignmentSynthesis}"
            </p>
          </div>

          {/* 7 Space Synergy Stamp Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase font-mono tracking-wider flex items-center gap-2">
              <Award size={14} className="text-pink-400" /> PRISM 7대 우주 공간 통합 여정 황금 봉인
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {chronicleData.sevenPrismStampStatus.map((stamp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-white/90">{stamp.space}</span>
                  <span className="text-[11px] text-purple-200 font-mono font-semibold">{stamp.seal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Sleep Priming Affirmation Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-pink-950/60 border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-300 font-mono font-bold uppercase flex items-center gap-1.5">
                <Moon size={13} className="text-purple-400" /> PRE-SLEEP SUBCONSCIOUS PRIMING AFFIRMATION
              </span>
              <span className="text-[9px] text-white/40 font-mono">{chronicleData.chronicleSealCode}</span>
            </div>
            <p className="text-sm sm:text-base font-black text-white leading-relaxed">
              "{chronicleData.preSleepPrimingAffirmation}"
            </p>
          </div>

          {/* 📚 마스터 아카이브 영혼 연대기 서고 (Master Archive Vault) */}
          {archiveHistory.length > 1 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={() => setIsArchiveOpen(!isArchiveOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-purple-300 hover:text-white transition-colors cursor-pointer py-2"
              >
                <span className="flex items-center gap-2">
                  <Archive size={14} className="text-purple-400" />
                  <span>누적 마스터 아카이브 기록 서고 ({archiveHistory.length}개 보관 중)</span>
                </span>
                <span className="text-[10px] text-white/50">{isArchiveOpen ? '접기' : '펼쳐보기'}</span>
              </button>

              {isArchiveOpen && (
                <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar pr-1">
                  {archiveHistory.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      onClick={() => setChronicleData(item)}
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-purple-400/40 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-purple-400 shrink-0">{item.dateKey}</span>
                          <span className="text-[10px] font-bold text-white break-keep break-words">{item.title}</span>
                        </div>
                        <p className="text-[10px] text-white/50 font-sans break-keep break-words">
                          {item.soulEvolutionLevel} · {item.dailyCoreTheme}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-white/30 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      ) : (
        /* Standby State: Before Publishing */
        <div className="rounded-[32px] sm:rounded-[40px] border border-dashed border-white/15 bg-white/[0.02] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
            <Sparkles size={28} />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h4 className="text-base font-bold text-white">영혼 연대기 스탬프 발행 대기</h4>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              상단에서 오늘 밤 집중할 영혼 진화 포커스를 선택하고 <strong>〈영혼 연대기 스탬프 &amp; 수면 프라이밍〉 즉시 발행</strong> 버튼을 누르면,
              당신만을 위한 7대 공간 통합 황금 봉인과 수면 프라이밍이 발행됩니다.
            </p>
          </div>
        </div>
      )}

      {/* 🌟 Achievement Share Modal */}
      <EpilogueAchievementShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        stats={achievementStats}
      />
    </div>
  );
}
