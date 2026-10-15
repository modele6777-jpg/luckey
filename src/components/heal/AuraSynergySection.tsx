import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Timer, Sparkles, Wind, Volume2, VolumeX, Check, Copy, RefreshCw, Zap, Award, ArrowRight, ShieldCheck, Heart, Play, Square, X, Brain, MessageSquare } from 'lucide-react';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLM } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playTTS, stopTTS, prefetchTTS, useTTSActive } from '@/utils/tts';
import { extractCleanConcernNoun, getKoreanParticle, attachKoreanParticle } from '@/utils/koreanGrammar';

interface SanctuaryData {
  title: string;
  tensionArea: string;
  targetThoughtDetail?: string;
  sedonaInquiryAnswer: string;
  sixtySecondSanctuaryProtocol: string[];
  zeroResistanceDeclaration: string;
  pureLightState: string;
  releaseInsight?: string;
}

// 🌟 60초 단계별 방하착 가이드 고정 프로토콜 (각 구간별 시간에 맞춤 설계되어 끊김 및 스킵 방지)
export const FIXED_SANCTUARY_PROTOCOL = [
  "00~15초: 숨을 천천히 들이쉬며 몸과 마음의 긴장을 가만히 바라봅니다.",
  "15~35초: 지금 올라온 이 감정이 잠시 머물러도 온전히 괜찮다고 인정합니다.",
  "35~50초: 호흡을 길게 내쉬며 손아귀에 쥐고 있던 힘을 가볍게 놓아줍니다.",
  "50~60초: 비워진 자리에서 온전한 자유와 순수한 평온을 누립니다."
];

// 음성(TTS) 낭독용 시간 맞춤 고정 문장 (각 3초대 분량으로 남은 시간 동안 깊은 침묵과 호흡 유지)
export const FIXED_SANCTUARY_SPEECHES = [
  "1단계, 자각입니다. 숨을 천천히 들이쉬며 몸과 마음의 긴장을 바라봅니다.",
  "2단계, 허용입니다. 지금 올라온 이 감정이 머물러도 온전히 괜찮습니다.",
  "3단계, 놓아줌입니다. 호흡을 길게 내쉬며 쥐고 있던 힘을 가볍게 놓아줍니다.",
  "4단계, 평온입니다. 비워진 자리에서 온전한 자유와 평화를 누립니다."
];

const FALLBACK_SANCTUARY: SanctuaryData = {
  title: "완전 해방 방하착 챔버 (Zero-Resistance Sanctuary)",
  tensionArea: "가슴 답답함 & 어깨 긴장",
  sedonaInquiryAnswer: "지금 쥐고 있는 통제의 욕구와 불안을 가슴 밖으로 완전히 열어놓습니다. 손을 펴듯 마음에 쥔 힘을 내려놓습니다.",
  sixtySecondSanctuaryProtocol: FIXED_SANCTUARY_PROTOCOL,
  zeroResistanceDeclaration: "나는 모든 저항과 집착을 허공 속으로 가볍게 흘려보내고, 본래의 완전한 자유와 평온으로 돌아옵니다.",
  pureLightState: "저항 0% · 순수 현존 (Zero-Resistance Pure Presence)"
};

const TENSION_PRESETS = [
  { id: 'chest', label: '가슴의 압박감과 답답함', icon: '🫀' },
  { id: 'shoulders', label: '어깨와 목덜미의 뻐근한 긴장', icon: '🧘' },
  { id: 'head', label: '머릿속 복잡한 생각과 두통', icon: '🧠' },
  { id: 'stomach', label: '명치와 복부의 조여듦', icon: '🌀' },
  { id: 'control', label: '모든 것을 통제하려는 강박', icon: '⛓️' },
  { id: 'fear', label: '불확실성에 대한 막연한 두려움', icon: '🌫️' },
];

const THOUGHT_EMOTION_CHIPS = [
  { label: '미래 불안 & 초조함', text: '앞일에 대한 불안과 결과가 잘못될까 봐 온종일 초조하고 안절부절못해요' },
  { label: '관계의 서운함 & 분노', text: '가까운 사람과의 대화에서 서운함과 답답한 응어리가 마음에 남아있어요' },
  { label: '자책 & 후회', text: '‘그때 더 잘했어야 했는데’ 하는 자책과 후회가 꼬리를 물어요' },
  { label: '통제 강박 & 완벽주의', text: '내 뜻대로 완벽히 풀리지 않으면 견디기 힘든 통제 강박이 있어요' },
  { label: '일정 압박 & 번아웃', text: '마감과 할 일에 쫓겨 숨이 가쁘고 지친 피로감이 커요' },
  { label: '막연한 두려움 & 무기력', text: '이유를 알 수 없는 막연한 두려움과 무기력감에 짓눌려요' },
];

export function AuraSynergySection() {
  const { updateSharedState } = useApp();
  const userProfile = getPersistentUserProfile();
  const [selectedTension, setSelectedTension] = useState<string>(TENSION_PRESETS[0].id);
  const [customDetail, setCustomDetail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Initial state is null so result does not appear prematurely before user action
  const [sanctuaryData, setSanctuaryData] = useState<SanctuaryData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isChamberActive, setIsChamberActive] = useState<boolean>(false);
  const [isChamberCompleted, setIsChamberCompleted] = useState<boolean>(false);
  const [chamberTimer, setChamberTimer] = useState<number>(60);
  const [isTtsGuideEnabled, setIsTtsGuideEnabled] = useState<boolean>(true);
  const isTTSActive = useTTSActive();
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const lastSpokenPhaseRef = useRef<number | null>(null);
  const chamberSessionIdRef = useRef<string | null>(null);

  const toggleTone = () => {
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
        osc.frequency.setValueAtTime(528, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        setIsAudioPlaying(true);
      } catch (e) {
        console.warn('Sanctuary audio error:', e);
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

  // Helper to extract clean voice prompt from protocol item
  // 시간에 맞춤 설계된 고정 문장 반환으로 긴 문장 스킵 및 잘림 현상 원천 방지
  const getCleanPhaseSpeech = (_text: string, phaseIndex: number): string => {
    return FIXED_SANCTUARY_SPEECHES[phaseIndex] || FIXED_SANCTUARY_SPEECHES[0];
  };

  // Compute current protocol phase from remaining seconds
  // 60s total:
  // Phase 0: 60 ~ 46 (0~15s elapsed, 15초 구간)
  // Phase 1: 45 ~ 26 (15~35s elapsed, 20초 구간)
  // Phase 2: 25 ~ 11 (35~50s elapsed, 15초 구간)
  // Phase 3: 10 ~ 1  (50~60s elapsed, 10초 구간)
  // Complete: 0
  const getCurrentPhaseIndex = (timer: number): number => {
    if (timer > 45) return 0;
    if (timer > 25) return 1;
    if (timer > 10) return 2;
    if (timer > 0) return 3;
    return 4; // Completed
  };

  // Chamber 60-second countdown and timed real-time TTS narration
  useEffect(() => {
    if (!isChamberActive) {
      lastSpokenPhaseRef.current = null;
      return;
    }

    const interval = setInterval(() => {
      setChamberTimer((prev) => {
        if (prev <= 1) {
          setIsChamberActive(false);
          setIsChamberCompleted(true);
          // 🌟 60초 타이머가 완료되어도 현재 재생 중이던 음성 낭독이 중간에 끊기지 않고 끝까지 부드럽게 재생되도록 stopTTS()를 호출하지 않음
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isChamberActive, isTtsGuideEnabled, sanctuaryData]);

  // Real-time TTS trigger matching the current active phase
  useEffect(() => {
    if (!isChamberActive || !isTtsGuideEnabled || !sanctuaryData) return;

    const currentPhase = getCurrentPhaseIndex(chamberTimer);
    if (currentPhase < 4 && lastSpokenPhaseRef.current !== currentPhase) {
      lastSpokenPhaseRef.current = currentPhase;
      const speechText = getCleanPhaseSpeech(FIXED_SANCTUARY_PROTOCOL[currentPhase], currentPhase);
      if (!chamberSessionIdRef.current) {
        chamberSessionIdRef.current = `sanctuary_${Date.now()}`;
      }
      playTTS(speechText, 'Kore', false, '명상', chamberSessionIdRef.current, true);
    }
  }, [chamberTimer, isChamberActive, isTtsGuideEnabled, sanctuaryData]);

  // 🌟 60초 챔버 완료 시 저항 0% 완전 해방 선언문 자동 낭독
  useEffect(() => {
    if (isChamberCompleted && isTtsGuideEnabled && sanctuaryData?.zeroResistanceDeclaration) {
      const declText = `저항 0% 완전 해방 선언문입니다. ${sanctuaryData.zeroResistanceDeclaration}`;
      const timer = setTimeout(() => {
        playTTS(declText, 'Kore', false, '명상');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isChamberCompleted, isTtsGuideEnabled, sanctuaryData]);

  const handleToggleDeclarationTTS = () => {
    if (isTTSActive) {
      stopTTS();
    } else if (sanctuaryData?.zeroResistanceDeclaration) {
      const declText = `저항 0% 완전 해방 선언문입니다. ${sanctuaryData.zeroResistanceDeclaration}`;
      playTTS(declText, 'Kore', false, '명상');
    }
  };

  const handleStartChamber = () => {
    if (isChamberActive || isChamberCompleted) {
      setIsChamberActive(false);
      setIsChamberCompleted(false);
      setChamberTimer(60);
      lastSpokenPhaseRef.current = null;
      chamberSessionIdRef.current = null;
      stopTTS();
    } else {
      setIsChamberCompleted(false);
      setChamberTimer(60);
      setIsChamberActive(true);
      lastSpokenPhaseRef.current = null;
      const sessId = `sanctuary_${Date.now()}`;
      chamberSessionIdRef.current = sessId;

      // Pre-warm / prefetch all 4 phase scripts immediately to avoid audio delay
      FIXED_SANCTUARY_SPEECHES.forEach((speech) => {
        prefetchTTS(speech, 'Kore', '명상').catch(() => {});
      });

      // Pre-warm declaration script
      if (sanctuaryData?.zeroResistanceDeclaration) {
        const declText = `저항 0% 완전 해방 선언문입니다. ${sanctuaryData.zeroResistanceDeclaration}`;
        prefetchTTS(declText, 'Kore', '명상').catch(() => {});
      }

      // Immediately start 1st phase speech with sequence session ID
      if (isTtsGuideEnabled) {
        lastSpokenPhaseRef.current = 0;
        const firstSpeech = getCleanPhaseSpeech(FIXED_SANCTUARY_PROTOCOL[0], 0);
        playTTS(firstSpeech, 'Kore', false, '명상', sessId, true);
      }
    }
  };

  const handleSynthesizeSanctuary = async () => {
    setIsLoading(true);
    // Stop ongoing chamber or speech
    setIsChamberActive(false);
    setIsChamberCompleted(false);
    setChamberTimer(60);
    stopTTS();

    const item = TENSION_PRESETS.find(p => p.id === selectedTension);
    const tensionLabel = item ? item.label : '긴장';
    const trimmedDetail = customDetail.trim();
    const concernTopic = extractCleanConcernNoun(trimmedDetail, tensionLabel);
    const combined = trimmedDetail ? `${tensionLabel} (마음의 생각·감정: ${concernTopic})` : tensionLabel;

    const systemPrompt = `당신은 오라(AURA)의 완전 해방 방하착 챔버 마스터입니다.
좌측 메뉴 [Letting Go Method]의 데이비드 호킨스 & 세도나 메서드 흘려보내기 5문답과 우측 메뉴 [1-MIN]의 60초 마이크로 집중 명상 동조를 완벽히 융합하여 '완전 해방 방하착 챔버' 가이드를 설계하세요.

[★ 최우선 문맥 완성도 및 한국어 문법 원칙 - 문맥 상 오류 원천 배제]
1. 원문 서술형 문장의 품격 있는 명사구 정제:
   사용자의 고민이 구어체 서술형 문장(예: '~못해요', '~남아있어요', '~있어요', '~물어요')으로 입력되었더라도, 결합할 때 절대 원문을 어색하게 따옴표로 감싸거나 서술형 어미 뒤에 조사를 붙이지 마세요(예: "안절부절못해요에 대한 생각" ❌, "〈안절부절못해요 해방〉" ❌).
   반드시 문맥에 자연스러운 품격 있는 명사구(예: '미래에 대한 불안과 초조함', '상대에 대한 서운함과 마음의 응어리', '과거에 대한 자책과 후회')로 정제하여 완결된 문장으로 작성하세요.
2. 올바른 한국어 조사(은/는, 이/가, 을/를, 과/와, 으로/로) 문법 철저 준수:
   받침 유무에 따른 올바른 조사를 결합하여 어색함이 전혀 없는 매끄럽고 유려한 문장이어야 합니다.
3. 세련되고 완결성 높은 타이틀(title):
   〈고민 핵심 명사구 해방〉 528Hz 무저항 챔버 (예: 〈미래 불안과 초조함 해방〉 528Hz 무저항 챔버, 〈관계의 서운함과 응어리 방하착〉 528Hz 무저항 챔버) 형태로 자연스럽게 명명하세요.
4. 깊은 공감의 요약(targetThoughtDetail):
   사용자의 고민 핵심을 따뜻하고 정갈하게 정제하여 한 줄 명사구/요약문으로 정리하세요.
5. 세도나 5문답 깨달음(sedonaInquiryAnswer):
   손아귀의 힘을 풀듯 마음의 짐을 내려놓게 하는 깊고 유려한 성찰 문장으로 작성하세요.
6. 1인칭 완전 해방 선언문(zeroResistanceDeclaration):
   번역투나 기계적 결합이 없는, 낭독했을 때 깊은 안도감이 밀려오는 당당하고 평화로운 1인칭 해방 선언문이어야 합니다.
7. 본질 통찰(releaseInsight):
   그 마음을 쥐고 있던 통제·인정·안전의 에고 결핍을 꿰뚫어보는 한 줄의 지혜 통찰을 제시하세요.
(※ 60초 단계별 방하착 프로토콜은 시간에 맞춘 표준 고정 가이드로 안전하게 자동 동조됩니다)`;

    const userPrompt = `[양쪽 메뉴 융합: LETTING GO 방하착 ✕ 1-MIN 마이크로 호흡]
[타겟 신체 긴장 영역]: "${tensionLabel}"
[사용자가 직접 적은 마음에 걸리는 생각 / 쥐고 있는 감정]: ${trimmedDetail ? `"${trimmedDetail}" (핵심 정제 주제: "${concernTopic}")` : '(입력 없음 - 신체 긴장 영역 중심 해방 설계)'}
[사용자 닉네임]: "${userProfile?.basic?.nickname || userProfile?.basic?.name || '제제'}"

반드시 아래 JSON 스키마로만 엄격하게 응답하세요 (문맥 상 오류 및 비문 절대 금지):
{
  "title": "〈${concernTopic} 해방〉 528Hz 무저항 챔버",
  "tensionArea": "${tensionLabel}",
  "targetThoughtDetail": "${trimmedDetail ? concernTopic : tensionLabel}",
  "sedonaInquiryAnswer": "손아귀에 쥔 힘을 풀듯 ${attachKoreanParticle(concernTopic, '을/를')} 허공으로 내려놓는 깊은 깨달음의 세도나 해방 문장",
  "zeroResistanceDeclaration": "나는 ${attachKoreanParticle(concernTopic, '을/를')} 가볍게 놓아주고 본래의 자유로 돌아온다는 1인칭 완전 해방 선언문",
  "pureLightState": "순수 해방 상태 명칭 (예: 집착 0% · 절대 평온)",
  "releaseInsight": "이 마음을 내려놓을 때 열리는 본질적 한 줄 통찰"
}`;

    const safetyTimeout = new Promise<SanctuaryData>((resolve) => {
      setTimeout(() => {
        resolve({
          ...FALLBACK_SANCTUARY,
          tensionArea: tensionLabel,
          targetThoughtDetail: concernTopic,
          title: `〈${concernTopic} 해방〉 528Hz 무저항 챔버`,
          sedonaInquiryAnswer: trimmedDetail
            ? `마음을 무겁게 짓누르던 ${attachKoreanParticle(concernTopic, '과/와')} 통제 욕구를 있는 그대로 허용하고, 허공 속으로 가볍게 흘려보냅니다.`
            : FALLBACK_SANCTUARY.sedonaInquiryAnswer,
          sixtySecondSanctuaryProtocol: FIXED_SANCTUARY_PROTOCOL,
          zeroResistanceDeclaration: trimmedDetail
            ? `나는 ${concernTopic}에 얽매이던 모든 생각과 저항을 놓아주고, 본래의 완전한 자유와 평온으로 돌아옵니다.`
            : FALLBACK_SANCTUARY.zeroResistanceDeclaration,
          releaseInsight: trimmedDetail
            ? `쥐고 있던 생각을 놓아줄 때, 나는 그 생각보다 훨씬 더 광대한 순수 의식임을 발견합니다.`
            : '저항을 멈출 때, 본래 있던 평화가 스스로 드러납니다.'
        });
      }, 6500);
    });

    const runAI = async (): Promise<SanctuaryData> => {
      try {
        const raw = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          responseFormat: { type: 'json_object' }
        });
        const parsed = typeof raw === 'string' ? JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) : raw;
        if (parsed && parsed.zeroResistanceDeclaration) {
          return {
            ...parsed,
            sixtySecondSanctuaryProtocol: FIXED_SANCTUARY_PROTOCOL,
            targetThoughtDetail: parsed.targetThoughtDetail || (trimmedDetail ? trimmedDetail : undefined)
          };
        }
      } catch (e) {
        console.warn('[AuraSynergy] invokeLLM error:', e);
      }
      throw new Error('Need fallback');
    };

    try {
      const result = await Promise.race([runAI(), safetyTimeout]);
      result.sixtySecondSanctuaryProtocol = FIXED_SANCTUARY_PROTOCOL;
      setSanctuaryData(result);
      recordPrismFeature({
        app: 'heal',
        featureName: 'Aura Zero-Resistance Sanctuary Synergy',
        summary: result.title,
        details: { tension: combined, title: result.title }
      });
      updateSharedState({}, 'HEAL');
    } catch (e) {
      console.warn('Aura fallback error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!sanctuaryData) return;
    const thoughtSection = (sanctuaryData.targetThoughtDetail && sanctuaryData.targetThoughtDetail !== sanctuaryData.tensionArea)
      ? `💭 방하착 대상 생각/감정: "${sanctuaryData.targetThoughtDetail}"\n`
      : '';
    const insightSection = sanctuaryData.releaseInsight ? `💡 해방 통찰: ${sanctuaryData.releaseInsight}\n` : '';
    const text = `⚡ [${sanctuaryData.title}]\n\n🌿 타겟 긴장: ${sanctuaryData.tensionArea}\n${thoughtSection}💬 세도나 방하착: ${sanctuaryData.sedonaInquiryAnswer}\n${insightSection}\n⏱️ 60초 챔버 프로토콜:\n${sanctuaryData.sixtySecondSanctuaryProtocol.join('\n')}\n\n🕊️ 완전 해방 선언: "${sanctuaryData.zeroResistanceDeclaration}"\n- PRISM AURA Zero-Resistance Sanctuary`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentPhaseIndex = isChamberActive ? getCurrentPhaseIndex(chamberTimer) : -1;
  const phaseNames = ['1단계: 자각', '2단계: 허용', '3단계: 놓아줌', '4단계: 순수 평온'];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 text-white font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 via-zinc-950/90 to-teal-950/40 shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles size={12} className="text-emerald-400 animate-pulse" />
                LETTING GO ✕ 1-MIN FUSION
              </span>
              <span className="text-[10px] text-white/40 font-mono">ZERO RESISTANCE 528Hz</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Leaf className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" size={28} />
              <span>완전 해방 방하착 챔버 (Zero-Resistance)</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/70 max-w-xl leading-relaxed">
              <strong>Letting Go Method(세도나 흘려보내기)</strong>와 <strong>1-MIN(1분 마이크로 집중 명상)</strong>의 양쪽 메뉴를 융합하여, 몸과 마음에 맺힌 저항을 0%로 증발시키는 방하착 챔버입니다.
            </p>
          </div>

          <button
            onClick={toggleTone}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
              isAudioPlaying
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
            }`}
          >
            {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isAudioPlaying ? '치유 주파수 재생 중' : '528Hz 치유음 켜기'}</span>
          </button>
        </div>
      </div>

      {/* Tension Preset Selection */}
      <div className="glass p-6 sm:p-8 rounded-[32px] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-emerald-300 flex items-center gap-2 font-mono uppercase tracking-wider">
            <Wind size={16} className="text-emerald-400" />
            <span>1. 오늘 즉시 흘려보내고 싶은 긴장/집착 영역 선택</span>
          </label>
          <span className="text-[10px] text-white/40 font-sans">실시간 해방 처방</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TENSION_PRESETS.map((p) => {
            const isSelected = selectedTension === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedTension(p.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/25 border-emerald-400/80 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-xs font-bold font-sans truncate">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Thought/Emotion Detail Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-emerald-300 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Sparkles size={15} className="text-emerald-400" />
              <span>2. 마음에 걸리는 생각이나 쥐고 있는 감정이 있다면 자유롭게 적어주세요 (선택)</span>
            </label>
            {customDetail.trim() && (
              <button
                type="button"
                onClick={() => setCustomDetail('')}
                className="text-[11px] text-white/40 hover:text-white/80 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X size={12} />
                <span>지우기</span>
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              placeholder="예: 이번 프로젝트 결과에 대해 온종일 초조하고 안절부절못하겠어요... / 사람들과의 대화에서 서운하고 답답한 응어리가 남아있어요..."
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/60 font-sans resize-none transition-all leading-relaxed"
              maxLength={300}
            />
            <div className="absolute bottom-2.5 right-3 text-[10px] text-white/30 font-mono">
              {customDetail.length}/300자
            </div>
          </div>

          {/* Quick thought / emotion preset chips */}
          <div className="space-y-1.5 pt-0.5">
            <span className="text-[10px] text-white/40 font-sans block">
              💡 표현하기 어려울 땐 아래 추천 감정·생각 칩을 터치해보세요:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {THOUGHT_EMOTION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (customDetail.trim()) {
                      setCustomDetail((prev) => `${prev.trim()}, ${chip.text}`);
                    } else {
                      setCustomDetail(chip.text);
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl text-[11px] bg-white/[0.04] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-400/40 text-white/70 hover:text-emerald-200 transition-all cursor-pointer font-sans"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200/90 leading-relaxed flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400 shrink-0" />
            <span>
              여기에 적어주신 생각과 감정은 <strong>세도나 5문답 처방</strong>, <strong>60초 단계별 실시간 음성 가이드</strong>, <strong>1인칭 해방 선언문</strong>에 1:1 맞춤으로 직접 스며들어 온전히 녹여냅니다.
            </span>
          </div>
        </div>

        <button
          onClick={handleSynthesizeSanctuary}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin text-black" />
              <span>세도나 5문답 & 60초 명상 챔버 융합 중...</span>
            </>
          ) : (
            <>
              <Zap size={18} className="text-black" />
              <span>〈완전 해방 방하착 챔버 & 60초 프로토콜〉 가동하기</span>
            </>
          )}
        </button>
      </div>

      {/* Output Chamber Card: Rendered ONLY when synthesized, avoiding premature results */}
      {sanctuaryData ? (
        <motion.div
          key={sanctuaryData.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black/95 border border-emerald-500/30 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  ZERO-RESISTANCE CHAMBER
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                  {sanctuaryData.pureLightState}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{sanctuaryData.title}</h3>
              <p className="text-xs text-emerald-200/70 mt-1 font-sans">
                타겟 저항: <strong className="text-white">{sanctuaryData.tensionArea}</strong> · {sanctuaryData.sedonaInquiryAnswer}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? '복사 완료' : '전체 복사'}</span>
              </button>
            </div>
          </div>

          {/* Target Thought & Emotion Reflection Card */}
          {(sanctuaryData.targetThoughtDetail || customDetail.trim()) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} className="text-emerald-400" />
                  방하착 대상 마음의 생각 · 감정
                </span>
                <span className="text-[10px] text-emerald-400/90 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  1:1 맞춤 해방 동조
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                "{sanctuaryData.targetThoughtDetail || customDetail.trim()}"
              </p>
              {sanctuaryData.releaseInsight && (
                <p className="text-[11px] text-emerald-200/80 leading-relaxed flex items-start gap-1.5 pt-0.5">
                  <Sparkles size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>해방 통찰:</strong> {sanctuaryData.releaseInsight}</span>
                </p>
              )}
            </div>
          )}

          {/* 60s Interactive Chamber Timer Widget with Real-time TTS Narration */}
          <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-2 font-mono">
                  <Timer size={16} className="text-emerald-400" />
                  <span>60초 무저항 방하착 챔버 가동</span>
                </span>
                {isChamberActive && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-bold text-emerald-300 animate-pulse font-sans">
                    {phaseNames[currentPhaseIndex] || '완전 해방 중'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Immediate Declaration TTS Button */}
                <button
                  type="button"
                  onClick={handleToggleDeclarationTTS}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    isTTSActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}
                  title="저항 0% 완전 해방 선언문 즉시 낭독 듣기 / 중단"
                >
                  {isTTSActive ? <VolumeX size={13} className="text-amber-300" /> : <Volume2 size={13} />}
                  <span>{isTTSActive ? '낭독 중단' : '선언문 낭독'}</span>
                </button>

                {/* TTS Guide Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (isTtsGuideEnabled) {
                      stopTTS();
                    }
                    setIsTtsGuideEnabled(!isTtsGuideEnabled);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isTtsGuideEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                  }`}
                  title="60초 단계별 실시간 음성 가이드 낭독 토글"
                >
                  {isTtsGuideEnabled ? <Volume2 size={13} className="text-emerald-400" /> : <VolumeX size={13} />}
                  <span>{isTtsGuideEnabled ? '실시간 안내 ON' : '안내 OFF'}</span>
                </button>

                {/* Chamber Start/Stop Button */}
                <button
                  type="button"
                  onClick={handleStartChamber}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    isChamberActive
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                      : isChamberCompleted && isTTSActive
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 animate-pulse'
                      : isChamberCompleted
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  }`}
                >
                  {isChamberActive ? (
                    <>
                      <Square size={12} />
                      <span>챔버 중단</span>
                    </>
                  ) : isChamberCompleted && isTTSActive ? (
                    <>
                      <VolumeX size={12} />
                      <span>낭독 중단</span>
                    </>
                  ) : isChamberCompleted ? (
                    <>
                      <RefreshCw size={12} />
                      <span>다시 시작하기</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} />
                      <span>60초 방하착 시작</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isChamberActive ? (
              <div className="relative w-40 h-40 flex items-center justify-center py-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-emerald-400/40"
                />
                <div className="w-32 h-32 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)]">
                  <span className="text-3xl font-mono font-black text-white">{chamberTimer}s</span>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold mt-0.5">
                    {phaseNames[currentPhaseIndex] || 'LETTING GO'}
                  </span>
                </div>
              </div>
            ) : isChamberCompleted ? (
              <div className="py-4 flex flex-col items-center justify-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 transition-all ${
                    isTTSActive
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.7)] animate-pulse'
                      : 'bg-emerald-500/30 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                  }`}>
                    {isTTSActive ? (
                      <Volume2 size={32} className="text-emerald-300 animate-bounce" />
                    ) : (
                      <Check size={36} className="text-emerald-300" />
                    )}
                  </div>
                </div>
                <div className="space-y-1 max-w-md">
                  <span className="text-sm font-bold text-emerald-300 flex items-center justify-center gap-1.5 font-sans">
                    <Sparkles size={15} className="text-emerald-400" />
                    <span>{isTTSActive ? '선언문 낭독 중' : '저항 0% 완전 해방 달성 완료'}</span>
                  </span>
                  <p className="text-xs text-emerald-100/70 leading-relaxed font-sans">
                    {isTTSActive
                      ? '해방 선언문을 낭독 중입니다. 깊은 호흡과 함께 평온을 누리세요.'
                      : '모든 무거운 저항과 긴장이 허공으로 증발했습니다. 타이머 완료와 함께 확언이 자동 종료되었으니, 가벼워진 영혼으로 온전한 평화를 누리세요.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={handleToggleDeclarationTTS}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 border ${
                      isTTSActive
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isTTSActive ? <VolumeX size={14} className="text-amber-300" /> : <Volume2 size={14} />}
                    <span>{isTTSActive ? '선언문 낭독 중단' : '선언문 다시 듣기'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStartChamber}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <RefreshCw size={13} />
                    <span>60초 방하착 다시 시작</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-3 text-xs text-white/50 max-w-md font-sans">
                '60초 방하착 시작'을 누르면 시간에 맞춰 4개 구간의 방하착 안내가 실시간 음성(TTS)과 함께 순서대로 흐릅니다.
              </div>
            )}
          </div>

          {/* 60s Protocol Timeline with Live Step Highlight & Narration Badge */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-300 uppercase font-mono tracking-wider flex items-center gap-2">
                <Wind size={14} /> 60초 단계별 방하착 가이드
              </h4>
              <span className="text-[11px] text-white/40 font-sans">
                {isChamberActive ? '실시간 챔버 가동 중' : '시간 맞춰 음성 낭독'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sanctuaryData.sixtySecondSanctuaryProtocol.map((proto, idx) => {
                const isCurrentPhase = isChamberActive && currentPhaseIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                      isCurrentPhase
                        ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-[1.01]'
                        : 'bg-white/[0.03] border-white/10 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[11px] font-bold font-mono tracking-wide ${isCurrentPhase ? 'text-emerald-300' : 'text-white/60'}`}>
                        {phaseNames[idx]}
                      </span>
                      {isCurrentPhase && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse">
                          <Volume2 size={11} />
                          실시간 안내 중
                        </span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed font-sans ${isCurrentPhase ? 'text-white font-medium' : 'text-white/70'}`}>
                      {proto}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zero Resistance Declaration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900/30 via-zinc-900/50 to-teal-900/20 border border-emerald-400/40 relative shadow-inner space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-400" />
                저항 0% 완전 해방 선언문 (Zero-Resistance Declaration)
              </span>
              <button
                type="button"
                onClick={handleToggleDeclarationTTS}
                className={`text-[11px] font-bold flex items-center gap-1 px-3 py-1 rounded-full border transition-all cursor-pointer shadow-sm active:scale-95 ${
                  isTTSActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-emerald-200 border-emerald-400/20'
                }`}
                title="선언문 음성 낭독 듣기 / 중단"
              >
                {isTTSActive ? <VolumeX size={12} className="text-amber-300" /> : <Volume2 size={12} />}
                <span>{isTTSActive ? '낭독 중단' : '선언문 듣기'}</span>
              </button>
            </div>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight break-keep">
              "{sanctuaryData.zeroResistanceDeclaration}"
            </p>
          </div>
        </motion.div>
      ) : (
        /* Standby State: Before Synthesizing */
        <div className="rounded-[32px] border border-dashed border-white/15 bg-white/[0.02] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Timer size={28} />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h4 className="text-base font-bold text-white">방하착 챔버 대기 상태</h4>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              상단에서 흘려보내고 싶은 긴장·집착 영역을 선택하고 <strong>〈가동하기〉</strong> 버튼을 누르면,
              당신만을 위한 세도나 5문답 해방 처방과 60초 실시간 TTS 음성 안내 챔버가 시작됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

