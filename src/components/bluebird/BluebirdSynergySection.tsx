import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Flame, Sparkles, Mail, Send, Check, Copy, RefreshCw, Volume2, VolumeX, Shield, Award, Feather, Wind, Layers, ArrowRight, BookOpen, FileText } from 'lucide-react';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLM } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playTTS, stopTTS, useTTSActive } from '@/utils/tts';

export interface PureZeroData {
  title: string;
  cleansingCode: string;
  incineratedLetter?: string;
  extractedCoreWound?: string;
  fusionMatrix: {
    hooponoponoElement: string;
    letterElement: string;
    transmutationAlchemy: string;
  };
  hoponoponoWhisper: {
    sorry: string;
    forgive: string;
    thanks: string;
    love: string;
  };
  transmutedOracleResponse: string;
  pureZeroDeclaration: string;
  spiritualResetDate: string;
}

/**
 * 비밀 편지 내용을 심층 분석하여 오프라인/지연 시에도
 * 편지 내용을 100% 생생하게 반영하는 컨텍스추얼 영점 회귀 생성기
 */
export function generateContextualPureZero(
  letterText: string,
  nickname: string = '순수한 영혼',
  totalCount: number = 89
): PureZeroData {
  const clean = letterText.trim();
  const shortSnippet = clean.length > 40 ? clean.slice(0, 38) + '…' : clean;

  // 감정 테마 분석
  let theme = '묵은 상처와 자책';
  let targetSubject = '마음의 상처';
  if (/자책|후회|잘못|미안|죄책감|바보|실망/i.test(clean)) {
    theme = '과거의 자책과 후회';
    targetSubject = '스스로를 향했던 책망과 미안함';
  } else if (/서운|배신|상처|원망|미워|인간관계|사람|친구|가족|연인|외면/i.test(clean)) {
    theme = '관계에서 맺힌 서운함과 원망';
    targetSubject = '타인과의 관계에서 받은 상처와 응어리';
  } else if (/불안|두려|걱정|압박|실패|완벽|성공|미래/i.test(clean)) {
    theme = '미래에 대한 불안과 완벽주의';
    targetSubject = '가슴을 짓누르던 불안과 압박감';
  } else if (/외로|혼자|눈물|슬픔|울|공허|지쳐|힘들/i.test(clean)) {
    theme = '홀로 견뎌온 눈물과 외로움';
    targetSubject = '남모르게 삼켰던 슬픔과 고독';
  }

  const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

  return {
    title: `〈${theme} 소각〉 417Hz 영점 백지 환생`,
    cleansingCode: `ZERO-FUSION-${codeSuffix}`,
    incineratedLetter: clean,
    extractedCoreWound: `비밀 편지에 털어놓은 "${shortSnippet}"에 얽힌 ${targetSubject}`,
    fusionMatrix: {
      hooponoponoElement: `호오포노포노 4대 정화 진언(미안합니다·용서하세요·고맙습니다·사랑합니다)의 파동이 편지에 담긴 "${shortSnippet}"의 기억을 제로(Zero) 상태로 정화합니다.`,
      letterElement: `편지에 고백한 ${targetSubject}을 숨김없이 직시하여, 마음에 억압되어 있던 무의식적 고통의 패턴을 해방의 제단에 올렸습니다.`,
      transmutationAlchemy: `비밀 편지의 무거운 아픔이 417Hz 푸른 불꽃에 닿아 소각되었으며, 어떠한 카르마의 잔재도 남지 않은 완전한 순수 백지로 승화되었습니다.`
    },
    hoponoponoWhisper: {
      sorry: `편지에 적힌 "${shortSnippet}"의 기억 속에서 오랫동안 상처받고 아파했던 나 자신과 모든 인연에게 진심으로 미안합니다.`,
      forgive: `과거의 미숙함과 스스로를 몰아세웠던 자책, 그리고 편지 속 상황을 이제는 아무런 조건 없이 온전히 용서합니다.`,
      thanks: `숨겨두었던 고통을 용기 내어 비밀 편지에 털어놓고, 영혼을 정화할 소중한 계기를 마련해 준 것에 깊이 고맙습니다.`,
      love: `아픔의 재를 털어내고 어떤 얼룩도 없는 순수한 백지로 다시 태어난 나 자신을 온 마음 다해 사랑합니다.`
    },
    transmutedOracleResponse: `${nickname} 님이 소각을 위해 적어 내려간 비밀 편지—"${shortSnippet}"에 담긴 모든 회한과 무거운 짐은 호오포노포노 4대 정화 파동과 함께 푸른 불꽃 속에서 완전히 재가 되어 흩어졌습니다. 이제 그대의 마음은 아무런 상처의 흔적도 남아있지 않은 티 없이 맑은 '순수 백지(Pure White Zero)'로 환생하였습니다. 지나간 기억에 더 이상 얽매이지 마세요. 본래의 온전한 사랑과 평화가 그대와 함께합니다.`,
    pureZeroDeclaration: `나는 비밀 편지에 남겼던 "${shortSnippet}"의 모든 기억과 감정의 굴레를 영점(Zero)으로 온전히 비워내고, 흠결 없는 순수한 백지의 빛으로 다시 살아갑니다.`,
    spiritualResetDate: new Date().toLocaleDateString('ko-KR')
  };
}

const INITIAL_ZERO: PureZeroData = {
  title: "호오포노포노 × 비밀편지 영점 회귀 융합 매트릭스",
  cleansingCode: "HOOPONOPONO-ZERO-LIMIT-BLUEBIRD",
  incineratedLetter: "누구에게도 털어놓지 못했던 마음의 응어리와 자책의 편지",
  extractedCoreWound: "잠재의식 속에 억압되어 있던 낡은 기억의 매듭",
  fusionMatrix: {
    hooponoponoElement: "4대 정화 파동 (미안합니다 · 용서하세요 · 고맙습니다 · 사랑합니다)",
    letterElement: "내면의 상처와 억압된 감정의 고백 편지",
    transmutationAlchemy: "기억의 매듭을 푸른 417Hz 불꽃으로 승화시켜 0(Zero State) 백지로 재탄생"
  },
  hoponoponoWhisper: {
    sorry: "나의 무의식 속에 쌓여 있던 기억과 고통의 패턴들에 대해 미안합니다.",
    forgive: "스스로를 자책하고 타인을 원망했던 과거의 마음을 너그럽게 용서합니다.",
    thanks: "이 아픔을 통해 내면을 마주하고 정화할 기회를 주어 진심으로 고맙습니다.",
    love: "상처를 딛고 온전한 본래의 빛으로 회귀하는 나 자신을 온 마음 다해 사랑합니다."
  },
  transmutedOracleResponse: "그대가 남긴 비밀스러운 아픔과 상처의 편지는 푸른 정화의 불꽃 속에서 완전히 재가 되어 흩어졌습니다. 이제 그대의 마음은 아무런 얼룩도 없는 순수한 백지(Pure White Zero)로 환생하였습니다.",
  pureZeroDeclaration: "나는 모든 기억의 얽힘을 영점(Zero)으로 돌려보내고, 온전한 평화와 사랑의 빛으로 다시 태어납니다.",
  spiritualResetDate: new Date().toLocaleDateString('ko-KR')
};

export function BluebirdSynergySection() {
  const { updateSharedState } = useApp();
  const userProfile = getPersistentUserProfile();
  const [confessionText, setConfessionText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isIncinerated, setIsIncinerated] = useState<boolean>(false);
  const [pureZeroData, setPureZeroData] = useState<PureZeroData>(INITIAL_ZERO);
  const [copied, setCopied] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [recentSavedNotes, setRecentSavedNotes] = useState<{ title: string; content: string }[]>([]);
  const isTTSActive = useTTSActive();

  // Dual Menu State Integration (Left: Ho'oponopono, Right: Letter)
  const [sorryCount, setSorryCount] = useState<number>(() => Number(localStorage.getItem('hoponopono_sorry_count') || 12));
  const [forgiveCount, setForgiveCount] = useState<number>(() => Number(localStorage.getItem('hoponopono_forgive_count') || 15));
  const [thankCount, setThankCount] = useState<number>(() => Number(localStorage.getItem('hoponopono_thank_count') || 28));
  const [loveCount, setLoveCount] = useState<number>(() => Number(localStorage.getItem('hoponopono_love_count') || 34));

  const totalHooponoponoCleansings = sorryCount + forgiveCount + thankCount + loveCount;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Load any secret notes saved in right-menu [LETTER]
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bluebird_secret_messages_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentSavedNotes(parsed.slice(0, 3).map((n: any) => ({
            title: n.title || '비밀 쪽지',
            content: n.content || ''
          })));
        }
      }
    } catch (e) {
      console.warn('Failed to inspect saved secret notes:', e);
    }
  }, []);

  const incrementWord = (type: 'sorry' | 'forgive' | 'thank' | 'love') => {
    if (type === 'sorry') {
      const next = sorryCount + 1;
      setSorryCount(next);
      localStorage.setItem('hoponopono_sorry_count', String(next));
    } else if (type === 'forgive') {
      const next = forgiveCount + 1;
      setForgiveCount(next);
      localStorage.setItem('hoponopono_forgive_count', String(next));
    } else if (type === 'thank') {
      const next = thankCount + 1;
      setThankCount(next);
      localStorage.setItem('hoponopono_thank_count', String(next));
    } else if (type === 'love') {
      const next = loveCount + 1;
      setLoveCount(next);
      localStorage.setItem('hoponopono_love_count', String(next));
    }
  };

  const handleLoadSampleLetter = (text: string) => {
    setConfessionText(text);
  };

  const toggle417Hz = () => {
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
        osc.frequency.setValueAtTime(417, ctx.currentTime);

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

  // Play a short ethereal chime when incineration completes
  const playIncinerationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(417, ctx.currentTime + 1.5);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.7);
      setTimeout(() => {
        try { ctx.close(); } catch (e) {}
      }, 1800);
    } catch (e) {}
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

  const handleSpeakHooponopono = () => {
    if (isTTSActive) {
      stopTTS();
    } else {
      const text = `블루버드 영점 회귀 정화입니다. 오라클의 계시: ${pureZeroData.transmutedOracleResponse}. 미안합니다: ${pureZeroData.hoponoponoWhisper.sorry}. 용서하세요: ${pureZeroData.hoponoponoWhisper.forgive}. 고맙습니다: ${pureZeroData.hoponoponoWhisper.thanks}. 사랑합니다: ${pureZeroData.hoponoponoWhisper.love}. 순수 백지 환생 선언: ${pureZeroData.pureZeroDeclaration}`;
      playTTS(text, 'Kore', false, '치유');
    }
  };

  const handleIncinerateAndTransmute = async () => {
    if (!confessionText.trim()) return;
    const currentLetter = confessionText.trim();
    setIsLoading(true);

    const rawNick = userProfile?.basic?.nickname?.trim() || userProfile?.basic?.name?.trim();
    const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';

    const systemPrompt = `당신은 블루버드의 '호오포노포노 4대 주문 & 감정 소각 연금술 마스터'입니다.
좌측 메뉴 [Ho'oponopono]의 4대 정화 언어(미안합니다, 용서하세요, 고맙습니다, 사랑합니다)와 사용자가 작성한 [소각할 마음의 비밀 편지]를 유기적으로 완벽히 융합하여, 마음에 맺힌 무거운 상처와 자책을 푸른 불꽃으로 소각하고 완전한 0(Zero State, 순수 백지)으로 승화시키는 정화의 계시와 융합 매트릭스를 생성하세요.

[필수 원칙 - 사용자의 편지 내용 100% 반영]:
1. 사용자가 적은 편지의 고유한 고백(구체적 사연, 대상, 자책, 후회, 원망, 두려움, 미안함 등)의 핵심 문맥을 결과값 전체에 깊이 있게 녹여내야 합니다.
2. 일반적인 추상적 문구나 상투적인 위로를 절대 반복하지 마세요. 사용자가 털어놓은 구체적 상처("..."에 대한 아픔/갈등/자책)를 직접 호명하고 보듬어 안으며, 호오포노포노 4대 주문("미안합니다", "용서하세요", "고맙습니다", "사랑합니다") 각각이 그 사연에 대해 어떻게 작동하는지 개별적이고 구체적인 문장으로 정화해 주어야 합니다.
3. transmutedOracleResponse에는 사용자의 편지 속 아픔이 푸른 불꽃에 소각되어 순수한 백지로 환생하는 과정을 시적이고 감동적으로 서술하세요.
4. pureZeroDeclaration에는 편지의 구체적 매듭을 풀고 자유로워진 나 자신을 선언하는 1인칭 확언을 작성하세요.`;

    const userPrompt = `[양쪽 메뉴 융합: HO'OPONOPONO 정화 ✕ LETTER 비밀 편지]
- 사용자가 소각을 위해 털어놓은 비밀 편지:
"${currentLetter}"

- 작성자 닉네임: "${nickname}"
- 현재 호오포노포노 정화 누적: 총 ${totalHooponoponoCleansings}회 (미안합니다 ${sorryCount}회, 용서하세요 ${forgiveCount}회, 고맙습니다 ${thankCount}회, 사랑합니다 ${loveCount}회)

반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "편지 내용과 호오포노포노가 융합된 맞춤 소각 명칭 (예: [편지의 핵심 상처]를 정화하는 417Hz 순수 백지 환생)",
  "cleansingCode": "영문 대문자 시길 코드 (예: ZERO-CLEANSE-HEAL)",
  "extractedCoreWound": "편지에서 읽어낸 핵심 고통/얽힌 기억 (한 줄 요약)",
  "fusionMatrix": {
    "hooponoponoElement": "호오포노포노 4대 정화 파동이 이 편지의 상처에 어떻게 침투하여 씻어내는지 (1~2문장)",
    "letterElement": "사용자가 털어놓은 비밀 편지의 감정적 응어리와 무의식적 패턴 분석 (1~2문장)",
    "transmutationAlchemy": "편지의 상처가 4대 주문과 만나 푸른 불꽃에 소각되어 0(Zero)으로 승화된 결과 (1~2문장)"
  },
  "hoponoponoWhisper": {
    "sorry": "편지에 담긴 상황/자책/기억을 향해 진심으로 건네는 맞춤 '미안합니다' 문장",
    "forgive": "편지 속 사건/타인/나 자신을 온전히 놓아주는 맞춤 '용서하세요' 문장",
    "thanks": "이 고통스러운 편지가 영적 정화와 성장의 계기가 되어주었음에 대한 맞춤 '고맙습니다' 문장",
    "love": "상처를 태우고 본래의 눈부신 백지로 돌아온 나를 축복하는 맞춤 '사랑합니다' 문장"
  },
  "transmutedOracleResponse": "편지의 아픔이 푸른 불꽃 속에서 완전히 재가 되어 날아가고 순수한 백지(Pure White Zero)로 환생했음을 알리는 위로와 치유의 계시 (3~4문장, 편지의 감정을 깊이 언급할 것)",
  "pureZeroDeclaration": "편지의 상처로부터 해방되어 영점(Zero)의 평온으로 회귀했음을 선포하는 1인칭 확언문 (1~2문장)",
  "spiritualResetDate": "${new Date().toLocaleDateString('ko-KR')}"
}`;

    // 4.5초 안전 타임아웃 (지연 없이 편지 내용을 분석한 동적 폴백 즉시 반환)
    const contextualFallback = generateContextualPureZero(currentLetter, nickname, totalHooponoponoCleansings);

    const safetyTimeout = new Promise<PureZeroData>((resolve) => {
      setTimeout(() => {
        resolve(contextualFallback);
      }, 4500);
    });

    const runAI = async (): Promise<PureZeroData> => {
      try {
        const raw = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          responseFormat: { type: 'json_object' }
        });
        const parsed = typeof raw === 'string' ? JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) : raw;
        if (parsed && (parsed.transmutedOracleResponse || parsed.fusionMatrix)) {
          return {
            title: parsed.title || contextualFallback.title,
            cleansingCode: parsed.cleansingCode || contextualFallback.cleansingCode,
            incineratedLetter: currentLetter,
            extractedCoreWound: parsed.extractedCoreWound || contextualFallback.extractedCoreWound,
            fusionMatrix: {
              hooponoponoElement: parsed.fusionMatrix?.hooponoponoElement || contextualFallback.fusionMatrix.hooponoponoElement,
              letterElement: parsed.fusionMatrix?.letterElement || contextualFallback.fusionMatrix.letterElement,
              transmutationAlchemy: parsed.fusionMatrix?.transmutationAlchemy || contextualFallback.fusionMatrix.transmutationAlchemy,
            },
            hoponoponoWhisper: {
              sorry: parsed.hoponoponoWhisper?.sorry || contextualFallback.hoponoponoWhisper.sorry,
              forgive: parsed.hoponoponoWhisper?.forgive || contextualFallback.hoponoponoWhisper.forgive,
              thanks: parsed.hoponoponoWhisper?.thanks || contextualFallback.hoponoponoWhisper.thanks,
              love: parsed.hoponoponoWhisper?.love || contextualFallback.hoponoponoWhisper.love,
            },
            transmutedOracleResponse: parsed.transmutedOracleResponse || contextualFallback.transmutedOracleResponse,
            pureZeroDeclaration: parsed.pureZeroDeclaration || contextualFallback.pureZeroDeclaration,
            spiritualResetDate: parsed.spiritualResetDate || contextualFallback.spiritualResetDate
          };
        }
      } catch (e) {
        console.warn('[BluebirdSynergy] invokeLLM error, using contextual fallback:', e);
      }
      return contextualFallback;
    };

    try {
      const result = await Promise.race([runAI(), safetyTimeout]);
      result.incineratedLetter = currentLetter;
      setPureZeroData(result);
      setIsIncinerated(true);
      playIncinerationChime();
      recordPrismFeature({
        app: 'bluebird',
        featureName: 'Bluebird Pure Zero Synergy',
        summary: result.title,
        details: { title: result.title, letterExcerpt: currentLetter.slice(0, 50) }
      });
      updateSharedState({
        bluebirdMemory: `[호오포노포노 × 비밀편지 융합 소각]: ${result.title} (소각된 상처: "${currentLetter.slice(0, 50)}")`,
        lastBluebirdSync: Date.now()
      }, 'BLUEBIRD');
    } catch (e) {
      console.warn('Bluebird fallback error:', e);
      setPureZeroData(contextualFallback);
      setIsIncinerated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const text = `🐦 [${pureZeroData.title}]\n\n🔥 소각된 편지: "${pureZeroData.incineratedLetter || confessionText}"\n\n✨ 호오포노포노 4대 정화:\n1. 미안합니다: ${pureZeroData.hoponoponoWhisper.sorry}\n2. 용서하세요: ${pureZeroData.hoponoponoWhisper.forgive}\n3. 고맙습니다: ${pureZeroData.hoponoponoWhisper.thanks}\n4. 사랑합니다: ${pureZeroData.hoponoponoWhisper.love}\n\n🕊️ 백지 환생 오라클:\n"${pureZeroData.transmutedOracleResponse}"\n\n💫 영점 회귀 확언: "${pureZeroData.pureZeroDeclaration}"\n- PRISM BLUEBIRD Pure Zero Transmutation`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 text-white font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-sky-500/30 bg-gradient-to-br from-sky-950/50 via-zinc-950/90 to-blue-950/40 shadow-[0_0_50px_rgba(14,165,233,0.15)] backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <Sparkles size={12} className="text-sky-400 animate-pulse" />
                HO'OPONOPONO ✕ LETTER FUSION
              </span>
              <span className="text-[10px] text-white/40 font-mono">417Hz PURIFICATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Feather className="text-sky-400 drop-shadow-[0_0_12px_rgba(14,165,233,0.8)]" size={28} />
              <span>감정 소각 & 순수 백지 환생 (Pure Zero)</span>
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/70 max-w-xl leading-relaxed">
              <strong>Ho'oponopono(4대 정화 진언)</strong>와 <strong>LETTER(비밀 편지 고백)</strong>의 양쪽 메뉴를 융합하여, 마음에 맺힌 상처와 응어리를 푸른 불꽃으로 소각하고 완전한 순수 백지로 환생시킵니다.
            </p>
          </div>

          <button
            onClick={toggle417Hz}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
              isAudioPlaying
                ? 'bg-sky-500 text-black border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.6)] animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
            }`}
          >
            {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isAudioPlaying ? '417Hz 정화음 재생 중' : '417Hz 정화음 켜기'}</span>
          </button>
        </div>
      </div>

      {/* Secret Letter Form */}
      {!isIncinerated ? (
        <div className="space-y-6">
          {/* Dual Menu Fusion Monitor */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-indigo-950/40 border border-sky-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="text-sky-400" size={16} />
                <span className="text-xs font-bold text-sky-200 font-mono tracking-wider uppercase">
                  DUAL-MENU SYNERGY MATRIX : HO'OPONOPONO × SECRET LETTER
                </span>
              </div>
              <span className="text-[10px] text-white/50 font-mono">
                누적 정화 {totalHooponoponoCleansings}회 연동
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Menu Status: Ho'oponopono */}
              <div className="p-4 rounded-2xl bg-black/30 border border-sky-400/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                    <Heart size={13} className="text-sky-400" />
                    좌측 메뉴 : 호오포노포노 4대 정화 실시간 게이지
                  </span>
                  <span className="text-[10px] text-sky-400 font-mono">클릭 시 정화 누적</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => incrementWord('sorry')}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-sky-500/20 border border-white/5 hover:border-sky-400/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-[9px] text-white/50 group-hover:text-sky-300">미안합니다</div>
                    <div className="text-xs font-bold text-white font-mono">{sorryCount}회</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => incrementWord('forgive')}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-sky-500/20 border border-white/5 hover:border-sky-400/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-[9px] text-white/50 group-hover:text-sky-300">용서하세요</div>
                    <div className="text-xs font-bold text-white font-mono">{forgiveCount}회</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => incrementWord('thank')}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-sky-500/20 border border-white/5 hover:border-sky-400/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-[9px] text-white/50 group-hover:text-sky-300">고맙습니다</div>
                    <div className="text-xs font-bold text-white font-mono">{thankCount}회</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => incrementWord('love')}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-sky-500/20 border border-white/5 hover:border-sky-400/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-[9px] text-white/50 group-hover:text-sky-300">사랑합니다</div>
                    <div className="text-xs font-bold text-white font-mono">{loveCount}회</div>
                  </button>
                </div>
              </div>

              {/* Right Menu Status: Secret Letter Preset & Saved Notes */}
              <div className="p-4 rounded-2xl bg-black/30 border border-indigo-400/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                    <Mail size={13} className="text-indigo-400" />
                    우측 메뉴 : 비밀 편지 고백 프리셋
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono">빠른 선택</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "지나간 과거에 대한 후회와 자책",
                    "가까운 관계에서 받은 깊은 서운함",
                    "미래에 대한 불안과 완벽주의 압박",
                    "스스로를 인정하지 못했던 미안함"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLoadSampleLetter(preset)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 text-[10px] text-white/70 hover:text-white transition-all cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                  {recentSavedNotes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleLoadSampleLetter(recentSavedNotes[0].content)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[10px] text-amber-200 font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <FileText size={10} />
                      최근 쪽지 불러오기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 sm:p-8 rounded-[32px] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-sky-300 flex items-center gap-2 font-mono uppercase tracking-wider">
                <Mail size={16} className="text-sky-400" />
                <span>호오포노포노 주문과 융합하여 소각할 마음의 비밀 편지</span>
              </label>
              <span className="text-[10px] text-white/40 font-sans">양쪽 메뉴 융합 소각</span>
            </div>

            <textarea
              rows={6}
              value={confessionText}
              onChange={(e) => setConfessionText(e.target.value)}
              placeholder="누구에게도 말하지 못했던 마음의 상처, 스스로에 대한 자책, 후회, 원망, 혹은 서운했던 감정을 이곳에 모두 솔직하게 적어주세요. 호오포노포노 4대 정화 파동과 함께 푸른 불꽃 속에서 영원히 소각되며, 적어주신 상처의 내용이 결과값에 완전히 반영되어 순수한 백지로 환생합니다..."
              className="w-full p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/15 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sky-400/60 leading-relaxed resize-none font-sans"
            />

            {isLoading ? (
              <div className="p-6 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex flex-col items-center justify-center gap-3 text-center animate-pulse">
                <div className="relative flex items-center justify-center">
                  <Flame size={32} className="text-sky-400 animate-bounce" />
                  <Sparkles size={20} className="text-amber-300 absolute -top-1 -right-2 animate-spin" />
                </div>
                <div className="text-sm font-bold text-sky-200">
                  호오포노포노 4대 파동으로 비밀 편지의 상처를 푸른 불꽃에 소각하는 중...
                </div>
                <div className="text-xs text-white/50 font-mono">
                  417Hz 카르마 클리어링 & 순수 백지 환생 연금술 적용 중
                </div>
              </div>
            ) : (
              <button
                onClick={handleIncinerateAndTransmute}
                disabled={isLoading || !confessionText.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <Flame size={18} className="text-amber-300 animate-pulse" />
                <span>〈호오포노포노 × 비밀 편지 융합 소각〉 단행하기</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Reborn Pure Zero Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black/95 border border-sky-500/30 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 flex items-center gap-1">
                  <Sparkles size={11} />
                  PURE ZERO TRANSMUTATION COMPLETE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono">
                  {pureZeroData.spiritualResetDate}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{pureZeroData.title}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSpeakHooponopono}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTTSActive
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 animate-pulse'
                    : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/30'
                }`}
              >
                {isTTSActive ? <VolumeX size={14} className="text-amber-300" /> : <Volume2 size={14} className="text-sky-300" />}
                <span>{isTTSActive ? '낭독 중단' : '정화 확언 음성 낭독'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? '복사 완료' : '정화 확언 복사'}</span>
              </button>

              <button
                onClick={() => {
                  setIsIncinerated(false);
                  setConfessionText('');
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                새로운 쪽지 작성
              </button>
            </div>
          </div>

          {/* Incinerated Letter Showcase (소각된 마음의 비밀 편지 원문 및 상처 박스) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950/20 via-sky-950/30 to-blue-950/20 border border-sky-500/30 relative overflow-hidden space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <Flame size={14} className="text-amber-400 animate-pulse" />
                소각된 마음의 비밀 편지 (Incinerated Confession)
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-200 border border-red-500/30 font-mono font-bold flex items-center gap-1">
                <Check size={11} className="text-emerald-400" />
                417Hz 푸른 불꽃 소각 완료
              </span>
            </div>

            {pureZeroData.incineratedLetter && (
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 relative">
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic font-serif">
                  "{pureZeroData.incineratedLetter}"
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
                  <span>소각된 원문 감정 반영 완료</span>
                  <span>상처가 영점(Zero)의 재로 승화됨</span>
                </div>
              </div>
            )}

            {pureZeroData.extractedCoreWound && (
              <div className="flex items-center gap-2 text-xs text-sky-200">
                <span className="font-bold text-sky-400 shrink-0 font-mono">[정화된 핵심 상처]:</span>
                <span className="text-white/90">{pureZeroData.extractedCoreWound}</span>
              </div>
            )}
          </div>

          {/* Fusion Matrix Report */}
          {pureZeroData.fusionMatrix && (
            <div className="p-5 sm:p-6 rounded-3xl bg-sky-950/30 border border-sky-400/30 space-y-3">
              <div className="flex items-center gap-2 text-sky-300 text-xs font-bold font-mono uppercase tracking-wider">
                <Layers size={14} className="text-sky-400" />
                <span>양쪽 메뉴 융합 매트릭스 (Fusion Matrix)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <div className="text-[10px] font-bold text-sky-400">좌측 : 호오포노포노 정화 파동</div>
                  <div className="text-xs text-white/80 font-sans leading-relaxed">{pureZeroData.fusionMatrix.hooponoponoElement}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <div className="text-[10px] font-bold text-indigo-400">우측 : 비밀 편지 감정 진단</div>
                  <div className="text-xs text-white/80 font-sans leading-relaxed">{pureZeroData.fusionMatrix.letterElement}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/40 border border-sky-500/30 space-y-1">
                  <div className="text-[10px] font-bold text-teal-400">융합 : 영점 환생 연금술</div>
                  <div className="text-xs text-white/80 font-sans leading-relaxed">{pureZeroData.fusionMatrix.transmutationAlchemy}</div>
                </div>
              </div>
            </div>
          )}

          {/* Incineration Result Oracle */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-sky-900/30 via-zinc-900/50 to-blue-900/20 border border-sky-400/40 relative shadow-inner space-y-3">
            <span className="text-[10px] font-mono text-sky-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sparkles size={14} className="text-sky-400" />
              블루버드 정화 오라클의 계시 (Oracle Response)
            </span>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight break-keep">
              "{pureZeroData.transmutedOracleResponse}"
            </p>
          </div>

          {/* 4-Step Ho'oponopono Whispers (편지 내용 맞춤 정화 진언) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase font-mono tracking-wider flex items-center gap-2">
              <Heart size={14} className="text-rose-400" /> 편지 상처 맞춤 호오포노포노 4대 정화 속삭임
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: '미안합니다 (I am sorry)', text: pureZeroData.hoponoponoWhisper.sorry, color: 'text-indigo-300' },
                { title: '용서하세요 (Please forgive me)', text: pureZeroData.hoponoponoWhisper.forgive, color: 'text-sky-300' },
                { title: '고맙습니다 (Thank you)', text: pureZeroData.hoponoponoWhisper.thanks, color: 'text-teal-300' },
                { title: '사랑합니다 (I love you)', text: pureZeroData.hoponoponoWhisper.love, color: 'text-rose-300' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className={`text-[10px] font-mono font-bold ${item.color} uppercase`}>
                    {item.title}
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Affirmation Banner */}
          <div className="p-5 rounded-2xl bg-sky-950/40 border border-sky-500/30 space-y-1">
            <span className="text-[10px] text-sky-400 font-mono font-bold uppercase">
              PURE ZERO RESET AFFIRMATION
            </span>
            <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
              "{pureZeroData.pureZeroDeclaration}"
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

