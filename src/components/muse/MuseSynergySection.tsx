import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Palette, Volume2, VolumeX, Check, Copy, RefreshCw, 
  User, Feather, Lightbulb, Image as ImageIcon, Eye, X, Download, BookOpen,
  Maximize2, Music, Quote, FileText, ChevronRight
} from 'lucide-react';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLM } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playTTS, stopTTS, useTTSActive } from '@/utils/tts';
import { getTodayDateKey } from '@/lib/dailyCache';
import {
  getSafeArtworkUrl,
  buildPollinationsArtUrl,
  isAiArtworkUrl,
  getArtworkImageBadgeInfo,
} from '@/utils/artworkImage';
import { ImageOutputActions, downloadImage } from '@/components/ImageOutputActions';
import { MuseSongYouTubePlayer } from '@/components/muse/MuseSongYouTubePlayer';
import {
  MASTERS_CATALOG,
  type MasterItem,
  type MasterArtwork,
  type MasterpieceDialogueData,
  type MasterpieceCategory,
  getMasterAllArtworks,
  getMasterpieceDynamicDialogue
} from '@/lib/museMasterclassData';

export function MuseSynergySection() {
  const { updateSharedState } = useApp();
  const userProfile = getPersistentUserProfile();
  
  // 1. 거장 선택 상태
  const [selectedMaster, setSelectedMaster] = useState<MasterItem>(MASTERS_CATALOG[0]);
  const availableArtworks = useMemo(() => {
    return getMasterAllArtworks(selectedMaster);
  }, [selectedMaster]);

  // 1-1. 거장의 세부 예술작품 선택 상태 (항시 랜덤 선정, 목록 숨김)
  const [selectedArtwork, setSelectedArtwork] = useState<MasterArtwork>(() => {
    const initialList = getMasterAllArtworks(MASTERS_CATALOG[0]);
    const randomIndex = Math.floor(Math.random() * initialList.length);
    return initialList[randomIndex] || (MASTERS_CATALOG[0] as unknown as MasterArtwork);
  });

  const [userCreativeDilemma, setUserCreativeDilemma] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🌟 오늘의 데일리아트 필수 확인 여부 감지 (고민 입력 및 결과 수신 전제 조건)
  const [isDailyArtConfirmed, setIsDailyArtConfirmed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`prism_daily_art_confirmed_${getTodayDateKey()}`) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleDailyArtConfirmed = () => {
      try {
        setIsDailyArtConfirmed(localStorage.getItem(`prism_daily_art_confirmed_${getTodayDateKey()}`) === 'true');
      } catch {
        setIsDailyArtConfirmed(false);
      }
    };
    window.addEventListener('prism:daily_art_confirmed', handleDailyArtConfirmed);
    return () => window.removeEventListener('prism:daily_art_confirmed', handleDailyArtConfirmed);
  }, []);

  // 2. 동적 마스터클래스 대화 데이터 (초기값도 거장별/작품별/날짜별 동적 계산)
  const initialDialogue = useMemo(() => {
    const list = getMasterAllArtworks(MASTERS_CATALOG[0]);
    const initArt = selectedArtwork || list[0];
    return getMasterpieceDynamicDialogue(MASTERS_CATALOG[0], '', userProfile, undefined, initArt);
  }, []);

  const [dialogueData, setDialogueData] = useState<MasterpieceDialogueData>(initialDialogue);
  const [isSynthesized, setIsSynthesized] = useState<boolean>(false); // 생성 버튼을 명시적으로 눌러야 마스터클래스 대화가 시작되도록 변경
  const [copied, setCopied] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const isTTSActive = useTTSActive();

  // 3. 미술 작품 이미지 상태 (원작 우선 구성 + 저작권/실패 시에만 AI 재현)
  const [imageFallbackIndex, setImageFallbackIndex] = useState<number>(0);
  const [loadingArtwork, setLoadingArtwork] = useState<boolean>(true);
  const [artworkLoadError, setArtworkLoadError] = useState<boolean>(false);
  const [isArtImageOpen, setIsArtImageOpen] = useState<boolean>(false);
  const [customArtworkUrl, setCustomArtworkUrl] = useState<string>('');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);

  // 거장, 선택 작품 또는 대화 내용이 바뀔 때 이미지 로딩 및 상태 초기화
  useEffect(() => {
    setImageFallbackIndex(0);
    setArtworkLoadError(false);
    setLoadingArtwork(true);
  }, [selectedMaster.id, selectedArtwork?.id, dialogueData.masterpieceName, customArtworkUrl]);

  // ★ 원작 최우선 구성: 미술관 공식 소장본 원작 스캔을 최우선으로 배치하고, 실패/저작권 차단 시에만 AI 재현
  const fallbackUrls = useMemo(() => {
    const list: string[] = [];

    // 1. 사용자가 버튼을 눌러 명시적으로 AI 재생성을 요청한 경우에만 customArtworkUrl 최우선
    if (customArtworkUrl) {
      list.push(customArtworkUrl);
    }

    // 2. [★ 최우선 대원칙] 거장의 공식 미술관 소장 원작 스캔본 (선택 작품의 이미지 또는 거장 기본 이미지)
    const targetArtworkImg = selectedArtwork?.imageUrl || selectedMaster.imageUrl;
    if (targetArtworkImg && !isAiArtworkUrl(targetArtworkImg)) {
      list.push(getSafeArtworkUrl(targetArtworkImg));
      list.push(encodeURI(targetArtworkImg));
    }

    // 3. 고화질 미학 AI 재현 URL (원작 로드 실패 또는 저작권 보호 시 자동 폴백)
    const faithfulUrl = buildPollinationsArtUrl(
      {
        title: dialogueData.masterpieceName,
        creator: dialogueData.masterName,
        artworkType: dialogueData.masterpieceMedium || selectedArtwork?.medium || '명화 회화',
        era: selectedArtwork?.originalMuseum || selectedMaster.title || '고전 명작',
        description: dialogueData.masterpieceInsight || 'Masterpiece artwork',
        aestheticTone: dialogueData.colorPalette?.join(', ') || 'classical museum fine art',
      },
      1024,
      768
    );
    list.push(faithfulUrl);

    // 4. 고호환성 초간단 명화 프롬프트
    const simplePrompt = encodeURIComponent(
      `Masterpiece museum fine art oil painting of "${dialogueData.masterpieceName}" by ${dialogueData.masterName}, museum photograph, ultra detailed canvas`
    );
    list.push(`https://image.pollinations.ai/prompt/${simplePrompt}?width=1024&height=768&nologo=true&seed=42`);

    return [...new Set(list.filter(Boolean))];
  }, [customArtworkUrl, selectedMaster, selectedArtwork, dialogueData]);

  const effectiveArtworkImage = fallbackUrls[imageFallbackIndex] || fallbackUrls[0] || '';
  const artworkFilename = `masterpiece-${dialogueData.masterpieceName.replace(/[^a-zA-Z0-9가-힣]/g, '_')}-${dialogueData.masterName.replace(/[^a-zA-Z0-9가-힣]/g, '_')}`;

  // 수동 AI 이미지 재생성 요청
  const handleRegenerateArtwork = () => {
    setLoadingArtwork(true);
    setArtworkLoadError(false);
    setImageFallbackIndex(0);
    const seed = Math.floor(Math.random() * 900000) + 100000;
    const prompt = encodeURIComponent(
      `Faithful fine art museum reproduction of "${dialogueData.masterpieceName}" by ${dialogueData.masterName}, ${dialogueData.masterpieceMedium}, rich authentic brushwork, museum gallery lighting, ultra high resolution masterpiece`
    );
    const newUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=768&nologo=true&seed=${seed}&model=turbo`;
    setCustomArtworkUrl(newUrl);
    setIsAiGenerated(true);
  };

  // 639Hz 솔페지오 주파수 사운드 합성
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const toggle639Hz = () => {
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
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(639, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.2);

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

  const handleSpeakMasterpiece = () => {
    if (isTTSActive) {
      stopTTS();
    } else {
      const categoryNotice = dialogueData.category === 'music'
        ? `오늘의 명곡 ${dialogueData.masterpieceName}입니다. ${dialogueData.musicListeningGuide || ''}`
        : dialogueData.category === 'poem'
        ? `${dialogueData.poet || dialogueData.masterName}의 시, ${dialogueData.masterpieceName}입니다. ${dialogueData.poemText ? dialogueData.poemText.slice(0, 150) : ''}`
        : dialogueData.category === 'quote'
        ? `${dialogueData.masterName}의 명언입니다. ${dialogueData.quoteText || ''}`
        : `오늘의 명화 ${dialogueData.masterpieceName}입니다.`;

      const text = `거장의 예술적 영감 마스터클래스입니다. ${categoryNotice} ${dialogueData.masterName}의 1대1 조언: ${dialogueData.masterDirectAdvice}. 작품 통찰: ${dialogueData.masterpieceInsight}. 영감 확언: ${dialogueData.inspirationAffirmation}`;
      playTTS(text, 'Kore', false, '치유');
    }
  };

  // 거장 선택 시: 거장의 전체 수록 예술작품 중 1편을 항시 랜덤으로 자동 선정 및 즉시 전환
  const handleSelectMaster = (master: MasterItem) => {
    setSelectedMaster(master);
    const artworks = getMasterAllArtworks(master);
    const randomIndex = Math.floor(Math.random() * artworks.length);
    const randomArt = artworks[randomIndex] || (master as unknown as MasterArtwork);
    setSelectedArtwork(randomArt);
    setCustomArtworkUrl('');
    setIsAiGenerated(false);
    setImageFallbackIndex(0);
    setArtworkLoadError(false);
    setLoadingArtwork(true);

    const freshDialogue = getMasterpieceDynamicDialogue(master, userCreativeDilemma, userProfile, undefined, randomArt);
    setDialogueData(freshDialogue);
    // 거장을 새로 선택했을 때도 생성 버튼을 눌러야 결과가 생성되도록 초기화
    setIsSynthesized(false);
  };

  // 🎲 다른 작품 랜덤 추천: 거장의 모든 수록 작품 풀에서 무작위 다른 대표작으로 전환 (목록 비노출)
  const handleRollRandomArtwork = () => {
    const artworks = getMasterAllArtworks(selectedMaster);
    if (artworks.length <= 1) return;
    const currentId = selectedArtwork?.id || selectedArtwork?.piece;
    const otherArtworks = artworks.filter((a) => (a.id || a.piece) !== currentId);
    const pool = otherArtworks.length > 0 ? otherArtworks : artworks;
    const nextArt = pool[Math.floor(Math.random() * pool.length)];
    setSelectedArtwork(nextArt);
    setCustomArtworkUrl('');
    setIsAiGenerated(false);
    setImageFallbackIndex(0);
    setArtworkLoadError(false);
    setLoadingArtwork(true);

    const freshDialogue = getMasterpieceDynamicDialogue(selectedMaster, userCreativeDilemma, userProfile, undefined, nextArt);
    setDialogueData(freshDialogue);
  };

  // 거장의 1:1 심층 마스터클래스 AI 생성 시작 (선택된 세부 작품 반영)
  const handleStartMasterclass = async () => {
    // 🌟 오늘의 데일리아트 필수 확인 가드: 미확인 시 데일리아트 탭으로 안내
    if (!isDailyArtConfirmed) {
      window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: 'artRecommendation' } }));
      return;
    }

    setIsLoading(true);

    const rawNick = userProfile?.basic?.nickname?.trim() || userProfile?.basic?.name?.trim();
    const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
    const mbti = (userProfile as any)?.psychology?.mbti || 'INFP';
    const dilemma = userCreativeDilemma.trim() || '영감의 고갈과 방향성에 대한 깊은 고민';
    const targetPieceName = selectedArtwork?.piece || selectedMaster.piece;
    const targetMedium = selectedArtwork?.medium || selectedMaster.medium;

    const systemPrompt = `당신은 PRISM 뮤즈의 예술 거장 마스터클래스 멘토입니다.
역사적 거장인 "${selectedMaster.name}"(${selectedMaster.title})로서 1인칭으로 빙의하여, 사용자의 창작/인생 정체기를 단번에 돌파시키는 거룩하고 따뜻하며 구체적인 1:1 마스터클래스 조언을 생성하세요.

[필수 대원칙]
1. 절대로 뻔하거나 상투적인 템플릿 문구를 반복하지 마세요.
2. 사용자가 제시한 고민("${dilemma}")과 닉네임("${nickname}"), 성향("${mbti}")을 깊이 경청하고, 거장의 이번 마스터클래스 선정작("${targetPieceName}")에 담긴 창작 비화와 철학을 결합하여 가슴을 울리는 1:1 맞춤 조언을 건네세요.
3. 거장이 화가, 음악가, 시인, 철학자 중 어떤 분야인지("${selectedMaster.category}")에 걸맞은 전문 어휘와 감각(붓질, 선율, 여백, 문장, 호흡)을 자연스럽게 구사하세요.
4. 반드시 유효한 JSON 형식으로만 응답하세요.`;

    const userPrompt = `[거장 정보]
이름: ${selectedMaster.name} (${selectedMaster.title})
선정 대표작: ${targetPieceName}
분야/매체: ${targetMedium} (카테고리: ${selectedMaster.category})
[사용자 고민]: "${dilemma}"
[사용자 닉네임]: "${nickname}"

아래 JSON 스키마를 엄격히 준수하여 응답하세요:
{
  "title": "마스터클래스 고유 명칭 (예: ${selectedMaster.name}의 영혼 돌파 마스터클래스)",
  "masterName": "${selectedMaster.name}",
  "masterTitle": "${selectedMaster.title}",
  "masterpieceName": "${targetPieceName}",
  "masterpieceMedium": "${targetMedium}",
  "masterpieceInsight": "이 작품에 깃든 심오한 창조적 비밀과 철학적 통찰 (3~4문장으로 깊이 있게 서술)",
  "masterDirectAdvice": "거장이 1인칭으로 ${nickname}님에게 직접 건네는 따뜻하고 가슴 벅찬 1:1 예술적 돌파 조언 (4~5문장)",
  "creativeSparkTechnique": "오늘 당장 작업이나 일상에 적용할 수 있는 거장 고유의 창작/마인드셋 기법 1가지",
  "colorPalette": [
    "영감 색상 코드 1 (설명)",
    "영감 색상 코드 2 (설명)",
    "영감 색상 코드 3 (설명)"
  ],
  "inspirationAffirmation": "창조성을 일깨우는 1인칭 예술 확언문 (1~2문장)"
}`;

    // 25초 안전 타임아웃
    const safetyTimeout = new Promise<MasterpieceDialogueData>((resolve) => {
      setTimeout(() => {
        resolve(getMasterpieceDynamicDialogue(selectedMaster, dilemma, userProfile, undefined, selectedArtwork));
      }, 25000);
    });

    const runAI = async (): Promise<MasterpieceDialogueData> => {
      try {
        const raw = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          responseFormat: { type: 'json_object' }
        });
        const parsed = typeof raw === 'string' ? JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) : raw;
        if (parsed && parsed.masterDirectAdvice && parsed.masterpieceInsight) {
          return {
            ...parsed,
            category: selectedMaster.category,
            musicVideoId: selectedArtwork?.musicVideoId || selectedMaster.musicVideoId,
            musicArtist: selectedArtwork?.musicArtist || selectedMaster.musicArtist,
            musicListeningGuide: selectedArtwork?.musicListeningGuide || selectedMaster.musicListeningGuide,
            poemText: selectedArtwork?.poemText || selectedMaster.poemText,
            poet: selectedArtwork?.poet || selectedMaster.poet,
            quoteText: selectedArtwork?.quoteText || selectedMaster.quoteText,
            quoteSource: selectedArtwork?.quoteSource || selectedMaster.quoteSource,
            originalMuseum: selectedArtwork?.originalMuseum || selectedMaster.originalMuseum,
          };
        }
      } catch (e) {
        console.warn('[MuseSynergy] invokeLLM error, using dynamic fallback:', e);
      }
      return getMasterpieceDynamicDialogue(selectedMaster, dilemma, userProfile, undefined, selectedArtwork);
    };

    try {
      const result = await Promise.race([runAI(), safetyTimeout]);
      setDialogueData(result);
      setCustomArtworkUrl('');
      setIsAiGenerated(false);
      setImageFallbackIndex(0);
      setArtworkLoadError(false);
      setLoadingArtwork(true);
      setIsSynthesized(true);

      recordPrismFeature({
        app: 'muse',
        featureName: 'Muse Masterpiece Dialogue Synergy',
        summary: result.title,
        details: { master: selectedMaster.name, title: result.title }
      });
      updateSharedState({}, 'MUSE');
    } catch (e) {
      console.warn('Muse fallback error:', e);
      const fallback = getMasterpieceDynamicDialogue(selectedMaster, dilemma, userProfile, undefined, selectedArtwork);
      setDialogueData(fallback);
      setIsSynthesized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    let specificContent = '';
    if (dialogueData.category === 'music' && dialogueData.musicListeningGuide) {
      specificContent = `\n🎵 감상 가이드: ${dialogueData.musicListeningGuide}`;
    } else if (dialogueData.category === 'poem' && dialogueData.poemText) {
      specificContent = `\n📜 시 전문:\n${dialogueData.poemText}`;
    } else if (dialogueData.category === 'quote' && dialogueData.quoteText) {
      specificContent = `\n💬 명언 원문:\n"${dialogueData.quoteText}"\n(${dialogueData.quoteSource || ''})`;
    }

    const text = `🎨 [${dialogueData.title}]\n\n👤 거장: ${dialogueData.masterName} (${dialogueData.masterTitle})\n🖼️ 대표작: ${dialogueData.masterpieceName}${specificContent}\n\n💡 작품에 깃든 창조적 비밀과 통찰:\n"${dialogueData.masterpieceInsight}"\n\n💬 거장의 1:1 직접 조언:\n"${dialogueData.masterDirectAdvice}"\n\n⚡ 거장의 창작 돌파 기법: ${dialogueData.creativeSparkTechnique}\n\n🌟 CREATIVE SPARK AFFIRMATION:\n"${dialogueData.inspirationAffirmation}"\n\n- PRISM MUSE Masterpiece Dialogue`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 text-white font-sans">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-blue-500/30 bg-gradient-to-br from-blue-950/50 via-zinc-950/90 to-violet-950/40 shadow-[0_0_50px_rgba(59,130,246,0.15)] backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Sparkles size={12} className="text-blue-400 animate-pulse" />
                ART ✕ MATE FUSION
              </span>
              <span className="text-[10px] text-white/40 font-mono">639Hz HARMONY TONE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Palette className="text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" size={28} />
              <span>거장의 예술적 영감 마스터클래스</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/70 max-w-xl leading-relaxed">
              <strong>Art(명작 큐레이션)</strong>과 <strong>MATE(거장 1:1 대화)</strong>를 융합하여, 명화·명곡·명시·명언을 통해 거장이 당신에게 건네는 1:1 심층 예술 마스터클래스입니다.
            </p>
          </div>

          <button
            onClick={toggle639Hz}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
              isAudioPlaying
                ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
            }`}
          >
            {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isAudioPlaying ? '639Hz 영감 주파수 재생 중' : '639Hz 주파수 켜기'}</span>
          </button>
        </div>
      </motion.div>

      {/* Master Selection Form */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="glass p-6 sm:p-8 rounded-[32px] border border-white/10 space-y-6"
      >
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-blue-300 flex items-center gap-2 font-mono uppercase tracking-wider">
            <User size={16} className="text-blue-400" />
            <span>1. 마스터클래스를 진행할 예술 거장 선택 (명화 · 명곡 · 명시 · 명언)</span>
          </label>
          <span className="text-[10px] text-white/40 font-sans">12대 거장 컬렉션</span>
        </div>

        {/* Categories Tab Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {MASTERS_CATALOG.map((master) => {
            const isSelected = selectedMaster.id === master.id;
            const categoryBadge = master.category === 'music'
              ? '🎵 명곡'
              : master.category === 'poem'
              ? '📜 명시'
              : master.category === 'quote'
              ? '💬 명언'
              : '🎨 명화';

            return (
              <button
                key={master.id}
                type="button"
                onClick={() => handleSelectMaster(master)}
                className={`relative overflow-hidden p-3.5 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-blue-500/25 border-blue-400/80 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-lg">{master.icon}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono font-bold">
                    {categoryBadge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate relative z-10">{master.name.split('(')[0].trim()}</h4>
                <p className="text-[10px] text-white/60 truncate font-serif relative z-10">{master.piece.split('(')[0].trim()}</p>
              </button>
            );
          })}
        </div>

        {/* 2. 거장의 예술작품: 항시 랜덤 설정 (목록 숨김) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <label className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
              오늘의 선정 명작 · 항시 랜덤 큐레이션 (총 {availableArtworks.length}작품 수록)
            </label>
          </div>

          <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/10">
            {selectedArtwork.imageUrl ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0 relative">
                <img
                  src={getSafeArtworkUrl(selectedArtwork.imageUrl)}
                  alt={selectedArtwork.piece}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-xl text-white/80">
                {selectedMaster.category === 'music' ? '🎵' : selectedMaster.category === 'poem' ? '📜' : selectedMaster.category === 'quote' ? '💬' : '🎨'}
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {selectedMaster.category === 'music' ? '명곡' : selectedMaster.category === 'poem' ? '명시' : selectedMaster.category === 'quote' ? '명언' : '명화'} · 랜덤 선정
                </span>
                <span className="text-[10px] text-white/50 font-sans truncate">
                  {selectedArtwork.originalMuseum || selectedMaster.title}
                </span>
              </div>
              <h5 className="text-sm font-bold text-white truncate leading-snug">
                {selectedArtwork.piece.split('(')[0].trim()}
              </h5>
              <p className="text-[11px] text-white/60 truncate font-serif">
                {selectedArtwork.medium}
              </p>
            </div>
          </div>
        </div>

        {!isDailyArtConfirmed ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-black border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <Sparkles size={14} className="text-yellow-400 shrink-0" />
                <span>오늘의 데일리아트 필수 확인 필요</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                거장에게 창작 고민을 입력하고 1:1 맞춤 조언을 받으시려면, 먼저 오늘 큐레이션된 <strong>오늘의 데일리아트(명곡·명시·명화)</strong>를 확인해 주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: 'artRecommendation' } }));
              }}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles size={13} className="text-yellow-300" />
              <span>오늘의 데일리아트 확인하러 가기</span>
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-[11px] text-white/50 mb-2 font-medium">
              거장에게 조언받고 싶은 현재의 창작 고민이나 인생의 막막함을 적어주세요 (선택):
            </label>
            <input
              type="text"
              value={userCreativeDilemma}
              onChange={(e) => setUserCreativeDilemma(e.target.value)}
              placeholder="예: 새로운 아이디어가 떠오르지 않고 완성할 자신감이 떨어졌어요..."
              className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/60 font-sans"
            />
          </div>
        )}

        <button
          onClick={handleStartMasterclass}
          disabled={isLoading}
          className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw size={15} className="animate-spin text-white shrink-0" />
              <span className="truncate">
                <span className="sm:hidden">1:1 마스터클래스 대화 생성 중...</span>
                <span className="hidden sm:inline">〈{selectedArtwork?.piece?.split('(')[0]?.trim() || selectedMaster.name.split('(')[0]}〉 1:1 맞춤 영감 마스터클래스 생성 중...</span>
              </span>
            </>
          ) : !isDailyArtConfirmed ? (
            <>
              <Sparkles size={16} className="text-yellow-300 shrink-0" />
              <span>오늘의 데일리아트 먼저 확인하고 마스터클래스 시작하기</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="text-yellow-300 shrink-0" />
              <span className="truncate">
                <span className="sm:hidden">〈{selectedMaster.name.split('(')[0].trim()}〉 1:1 영감 대화 시작</span>
                <span className="hidden sm:inline">〈{selectedMaster.name.split('(')[0].trim()} × '{selectedArtwork?.piece?.split('(')[0]?.trim() || selectedMaster.piece.split('(')[0]}' 1:1 맞춤 영감 마스터클래스 대화〉 시작하기</span>
              </span>
            </>
          )}
        </button>
      </motion.div>

      {/* Synthesized Masterclass Output */}
      {isSynthesized ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black/95 border border-blue-500/30 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400">
                  MASTERPIECE DIALOGUE DIPLOMA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                  {dialogueData.masterTitle}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{dialogueData.title}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleSpeakMasterpiece}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTTSActive
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 animate-pulse'
                    : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30'
                }`}
              >
                {isTTSActive ? <VolumeX size={14} className="text-amber-300" /> : <Volume2 size={14} className="text-blue-300" />}
                <span>{isTTSActive ? '낭독 중단' : '거장 조언 음성 낭독'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? '복사 완료' : '전체 복사'}</span>
              </button>
            </div>
          </div>

          {/* 선정된 명작 정보 바 (목록 숨김) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5 text-xs text-white/80">
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span>
              현재 선정 명작: <strong className="text-white font-bold">{selectedArtwork.piece.split('(')[0].trim()}</strong>
              <span className="text-white/40 ml-1.5 font-sans text-[11px]">({selectedMaster.name.split('(')[0].trim()}의 {availableArtworks.length}개 대표작 중 항시 랜덤 큐레이션)</span>
            </span>
          </div>

          {/* 🌟 명곡 / 명시 / 명언 / 명화 분야별 맞춤 감상 섹션 */}
          {dialogueData.category === 'music' ? (
            /* 1. 명곡(Music)일 때: 실제 음악 플레이어 및 감상 가이드 표출 */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-rose-950/30 via-zinc-900 to-black border border-rose-500/30 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-400/30 text-[11px] font-black uppercase tracking-widest text-rose-300 flex items-center gap-1.5 shadow-sm">
                    <Music size={13} />
                    🎵 거장의 명곡 · MASTERPIECE SONG
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-medium tracking-wide text-white/50">
                    {dialogueData.masterpieceMedium}
                  </span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-rose-300/80 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
                  AUDIO RESONANCE
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {dialogueData.masterpieceName}
                </h4>
                <p className="text-xs sm:text-sm text-rose-300 font-bold flex items-center gap-1.5">
                  <Feather size={14} />
                  {dialogueData.musicArtist || dialogueData.masterName}
                </p>
                {dialogueData.musicListeningGuide && (
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans pt-1">
                    💡 {dialogueData.musicListeningGuide}
                  </p>
                )}
              </div>

              {/* 실제 음악 재생 플레이어 (YouTube) */}
              <div className="rounded-2xl overflow-hidden border border-rose-500/20 bg-black/60 p-2">
                <MuseSongYouTubePlayer
                  title={dialogueData.masterpieceName}
                  artist={dialogueData.musicArtist || dialogueData.masterName}
                  youtubeVideoId={dialogueData.musicVideoId}
                />
              </div>
            </motion.div>
          ) : dialogueData.category === 'poem' ? (
            /* 2. 명시(Poem)일 때: 시 원문 글귀가 그대로 온전히 표출 */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-emerald-950/30 via-zinc-900 to-black border border-emerald-500/30 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-black uppercase tracking-widest text-emerald-300 flex items-center gap-1.5 shadow-sm">
                    <FileText size={13} />
                    📜 거장의 명시 · MASTERPIECE POEM
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-medium tracking-wide text-white/50">
                    {dialogueData.masterpieceMedium}
                  </span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-emerald-300/80 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                  POETIC VIBRATION
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {dialogueData.masterpieceName}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-300 font-bold flex items-center gap-1.5">
                  <Feather size={14} />
                  {dialogueData.poet || dialogueData.masterName}
                </p>
              </div>

              {/* 시 원문 글귀 그대로 표출 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border-l-4 border-emerald-400/80 space-y-3">
                <p className="text-sm sm:text-base text-white/95 font-serif italic leading-relaxed whitespace-pre-line tracking-wide">
                  {dialogueData.poemText}
                </p>
              </div>
            </motion.div>
          ) : dialogueData.category === 'quote' ? (
            /* 3. 명언(Quote)일 때: 명언 글귀 원문이 그대로 온전히 표출 */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-amber-950/30 via-zinc-900 to-black border border-amber-500/30 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-[11px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5 shadow-sm">
                    <Quote size={13} />
                    💬 거장의 명언 · MASTERPIECE QUOTE
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-medium tracking-wide text-white/50">
                    {dialogueData.masterpieceMedium}
                  </span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                  PHILOSOPHY
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {dialogueData.masterpieceName}
                </h4>
                <p className="text-xs sm:text-sm text-amber-300 font-bold flex items-center gap-1.5">
                  <Feather size={14} />
                  {dialogueData.masterName} · {dialogueData.quoteSource}
                </p>
              </div>

              {/* 명언 글귀 원문 그대로 표출 */}
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                <Quote size={24} className="text-amber-400 mx-auto opacity-70" />
                <p className="text-base sm:text-lg font-serif font-bold text-amber-100 italic leading-relaxed whitespace-pre-line px-2">
                  "{dialogueData.quoteText}"
                </p>
                <span className="text-[11px] text-amber-300/70 font-mono block">
                  — {dialogueData.quoteSource}
                </span>
              </div>
            </motion.div>
          ) : (
            /* 4. 명화(Painting)일 때: 원작 우선 구성 + 저작권/실패 시 AI 재현 */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-blue-500/30 shadow-2xl backdrop-blur-2xl space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-xl bg-blue-500/15 border border-blue-400/30 text-[11px] font-black uppercase tracking-widest text-blue-300 flex items-center gap-1.5 shadow-sm">
                    <Palette size={13} />
                    🎨 거장의 원작 명화 · MASTERPIECE ARTWORK
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-medium tracking-wide text-white/50">
                    {dialogueData.masterpieceMedium}
                  </span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#a5b4fc]/80 bg-[#a5b4fc]/5 border border-[#a5b4fc]/10 px-3 py-1.5 rounded-xl">
                  ENERGY FREQUENCY: 639Hz Sync
                </div>
              </div>

              {/* Title & Creator */}
              <div className="space-y-1.5 text-center sm:text-left">
                <h4 className="text-xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                  {dialogueData.masterpieceName}
                </h4>
                <p className="text-xs sm:text-sm text-blue-400 font-bold flex items-center justify-center sm:justify-start gap-1.5">
                  <Feather size={14} />
                  {dialogueData.masterName} · {dialogueData.originalMuseum || dialogueData.masterTitle}
                </p>
              </div>

              {/* Canvas Area */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 aspect-[4/3] w-full max-w-lg mx-auto flex flex-col items-center justify-center group shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:border-blue-400/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.25)]"
              >
                {loadingArtwork && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 text-white/50 text-xs p-4 sm:p-6 text-center bg-black/60 z-10 transition-all">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-yellow-500/40 animate-spin absolute inset-0" />
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-t-yellow-400 border-r-transparent animate-spin relative" />
                    </div>
                    <span className="font-mono tracking-wider sm:tracking-widest uppercase animate-pulse text-[9px] sm:text-[10px] text-yellow-300 font-bold sm:font-black">
                      [ 🏛️ 세계 미술관 공식 원작 소장본 불러오는 중... ]
                    </span>
                  </div>
                )}

                {effectiveArtworkImage && !artworkLoadError ? (
                  <>
                    <ImageOutputActions
                      src={effectiveArtworkImage}
                      alt={`${dialogueData.masterpieceName} — ${dialogueData.masterName}`}
                      filename={artworkFilename}
                      isOpen={isArtImageOpen}
                      onOpenChange={setIsArtImageOpen}
                    />
                    <img
                      key={effectiveArtworkImage}
                      src={effectiveArtworkImage}
                      alt={`${dialogueData.masterpieceName} — ${dialogueData.masterName}`}
                      referrerPolicy="no-referrer"
                      onLoad={() => {
                        setLoadingArtwork(false);
                        setArtworkLoadError(false);
                        if (isAiArtworkUrl(effectiveArtworkImage) || imageFallbackIndex >= 2) {
                          setIsAiGenerated(true);
                        }
                      }}
                      onError={() => {
                        // 원작 로드 실패 시에만 다음 단계(AI 미학 재현)로 자동 폴백
                        if (imageFallbackIndex + 1 < fallbackUrls.length) {
                          const nextIndex = imageFallbackIndex + 1;
                          setImageFallbackIndex(nextIndex);
                          const nextUrl = fallbackUrls[nextIndex];
                          if (isAiArtworkUrl(nextUrl) || nextIndex >= 2) {
                            setIsAiGenerated(true);
                          }
                        } else {
                          setLoadingArtwork(false);
                          setArtworkLoadError(true);
                        }
                      }}
                      onClick={() => setIsArtImageOpen(true)}
                      className={`w-full h-full object-cover cursor-zoom-in transition-all duration-700 ease-out hover:scale-105 ${
                        loadingArtwork ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
                      }`}
                    />
                    {(() => {
                      const badge = getArtworkImageBadgeInfo(
                        isAiGenerated ? 'pollinations' : ((selectedArtwork?.imageUrl || selectedMaster.imageUrl) ? 'wikimedia' : 'pollinations'),
                        effectiveArtworkImage,
                        imageFallbackIndex
                      );
                      return (
                        <div className={`absolute bottom-3 right-3 px-3 py-1.5 backdrop-blur-md rounded-xl border ${badge.borderClass} flex items-center gap-2 shadow-lg z-20 pointer-events-none`}>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${badge.dotClass} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${badge.dotClass}`}></span>
                          </span>
                          <span className={`text-[9px] font-black tracking-widest ${badge.textClass} uppercase font-mono`}>
                            {badge.label}
                          </span>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div className="relative w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-amber-950/40 via-zinc-900 to-indigo-950/40 border border-amber-400/20">
                    <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-3 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                      <Palette size={26} />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400/80 font-bold mb-1">
                      🏛️ MUSEUM MASTERPIECE ARCHIVE
                    </span>
                    <h4 className="text-lg md:text-xl font-serif font-extrabold text-white mb-1 px-4 leading-tight">
                      {dialogueData.masterpieceName}
                    </h4>
                    <p className="text-xs text-amber-200/70 font-medium mb-4">
                      {dialogueData.masterName} · {dialogueData.originalMuseum || selectedArtwork?.originalMuseum || dialogueData.masterpieceMedium}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImageFallbackIndex(0);
                          setArtworkLoadError(false);
                          setLoadingArtwork(true);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md"
                      >
                        <RefreshCw size={12} className={loadingArtwork ? 'animate-spin' : ''} />
                        원작 이미지 다시 불러오기
                      </button>
                      <button
                        type="button"
                        onClick={handleRegenerateArtwork}
                        className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md"
                      >
                        <Sparkles size={12} />
                        AI 명화 재현
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Bar & Buttons */}
              {effectiveArtworkImage && !loadingArtwork && (
                <>
                  <p className="text-[10px] text-white/40 text-center -mt-2">
                    그림을 탭하거나 버튼으로 크게 보기 · 다운로드 · AI 재생성
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 -mt-2">
                    <button
                      type="button"
                      onClick={() => setIsArtImageOpen(true)}
                      className="px-3.5 py-1.5 rounded-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/25 text-blue-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                      <Maximize2 size={13} />
                      크게 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => void downloadImage(effectiveArtworkImage, artworkFilename)}
                      className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                      <Download size={13} />
                      다운로드
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateArtwork}
                      disabled={loadingArtwork}
                      className="px-3.5 py-1.5 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/25 text-indigo-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-sm"
                    >
                      <Sparkles size={13} className={loadingArtwork ? 'animate-spin' : ''} />
                      작품 AI 이미지 재생성
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* 💡 작품에 깃든 창조적 비밀과 통찰 (동적 생성 및 거장별 고유 통찰) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/25 space-y-2"
          >
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={13} />
              작품에 깃든 창조적 비밀과 통찰
            </span>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-sans">
              "{dialogueData.masterpieceInsight}"
            </p>
          </motion.div>

          {/* 💬 거장의 1:1 직접 조언 (동적 생성 및 사용자 고민 맞춤 반영) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900/30 via-zinc-900/50 to-indigo-900/20 border border-blue-400/40 relative shadow-inner space-y-3"
          >
            <span className="text-[10px] font-mono text-blue-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sparkles size={14} className="text-yellow-400" />
              {dialogueData.masterName}의 1:1 직접 조언 (Direct Advice)
            </span>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight break-keep">
              "{dialogueData.masterDirectAdvice}"
            </p>
          </motion.div>

          {/* Technique & Palette Grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <Lightbulb size={12} /> 거장의 창작 돌파 기법
              </span>
              <p className="text-xs text-white/80 leading-relaxed font-sans">{dialogueData.creativeSparkTechnique}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono font-bold text-blue-300 uppercase flex items-center gap-1.5">
                <Palette size={12} /> 영감 팔레트
              </span>
              <div className="flex flex-col gap-1 text-xs text-white/70">
                {dialogueData.colorPalette.map((col, i) => (
                  <span key={i} className="truncate">{col}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 🌟 CREATIVE SPARK AFFIRMATION (동적 생성) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-purple-950/60 border border-blue-500/40 space-y-2"
          >
            <span className="text-[10px] text-blue-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-yellow-400" />
              CREATIVE SPARK AFFIRMATION
            </span>
            <p className="text-sm sm:text-base font-black text-white leading-relaxed">
              "{dialogueData.inspirationAffirmation}"
            </p>
          </motion.div>
        </motion.div>
      ) : (
        /* Standby State: Before Starting Masterclass */
        <div className="rounded-[32px] sm:rounded-[40px] border border-dashed border-white/15 bg-white/[0.02] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
            <Sparkles size={28} />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h4 className="text-base font-bold text-white">마스터클래스 1:1 대화 대기</h4>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              마스터클래스를 진행할 거장을 선택하고(총 {availableArtworks.length}개 대표작 중 항시 랜덤 선정), 필요시 창작 고민을 입력한 후, 상단의 <strong>〈{selectedMaster.name.split('(')[0].trim()} × '{selectedArtwork?.piece?.split('(')[0]?.trim() || selectedMaster.piece.split('(')[0]}' 1:1 맞춤 영감 마스터클래스 대화〉 시작하기</strong> 버튼을 누르면 1:1 조언과 명작 통찰이 펼쳐집니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
