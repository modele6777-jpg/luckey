import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Flame, Volume2, VolumeX, Copy, Check, RefreshCw, Award, ArrowRight, ShieldCheck, Zap, Disc } from 'lucide-react';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLM } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playTTS, stopTTS, useTTSActive } from '@/utils/tts';

interface DestinyAlchemyData {
  title: string;
  tarotCardName: string;
  tarotKeyword: string;
  tarotMessage: string;
  fiveElementDeficiency: string;
  alchemyRemedy: {
    luckyColor: string;
    luckyDirection: string;
    luckyNumber: string;
    luckyFood: string;
    luckyAction: string;
  };
  destinyAlchemyAffirmation: string;
  talismanSecretCode: string;
}

const FALLBACK_ALCHEMY: DestinyAlchemyData = {
  title: "오늘의 태양 개운 연금술 크로스",
  tarotCardName: "The Sun (태양)",
  tarotKeyword: "압도적 성공과 생명력의 폭발",
  tarotMessage: "오늘 하루는 당신의 빛과 에너지가 최고조에 달하는 날입니다. 망설이지 말고 당당하게 계획을 펼쳐보세요.",
  fiveElementDeficiency: "오늘 보충할 기운: 생동하는 木(목)과 활력의 火(화) 기운",
  alchemyRemedy: {
    luckyColor: "골드, 썬샤인 옐로우",
    luckyDirection: "남동쪽",
    luckyNumber: "1, 7, 9",
    luckyFood: "상큼한 감귤류 과일 또는 따뜻한 꿀차",
    luckyAction: "오늘 점심 5분간 햇볕을 쬐며 기분 좋은 미소 짓기"
  },
  destinyAlchemyAffirmation: "오늘 나의 모든 순간은 황금빛 성공과 막힘없는 행운으로 가득하다.",
  talismanSecretCode: "SUN-SOLARIS-ALCHEMY-777"
};

const TAROT_CARDS = [
  { name: 'The Fool (광대)', emoji: '🃏', key: '순수한 도약과 무한한 시작' },
  { name: 'The Magician (마법사)', emoji: '🪄', key: '무한한 창조력과 새로운 시작' },
  { name: 'The High Priestess (여사제)', emoji: '📜', key: '깊은 직관과 비밀스러운 지혜' },
  { name: 'The Empress (여황제)', emoji: '👑', key: '풍요와 번영, 결실의 완성' },
  { name: 'The Emperor (황제)', emoji: '🏛️', key: '확고한 권위와 안정적 기반' },
  { name: 'The Hierophant (교황)', emoji: '🕊️', key: '영적 신념과 지혜로운 인도' },
  { name: 'The Lovers (연인)', emoji: '💖', key: '영혼의 조화와 운명적 선택' },
  { name: 'The Chariot (전차)', emoji: '⚔️', key: '단호한 의지와 거침없는 승리' },
  { name: 'Strength (힘)', emoji: '🦁', key: '내면의 용기와 부드러운 통제력' },
  { name: 'The Hermit (은둔자)', emoji: '🏮', key: '내면의 등불과 깊은 성찰' },
  { name: 'Wheel of Fortune (운명의 수레바퀴)', emoji: '☸️', key: '대운의 전환과 상승 기류' },
  { name: 'Justice (정의)', emoji: '⚖️', key: '명확한 균형과 공정한 결실' },
  { name: 'The Hanged Man (매달린 사람)', emoji: '🌀', key: '새로운 시각과 헌신의 가치' },
  { name: 'Death (죽음/해빙)', emoji: '🌅', key: '낡은 것의 해빙과 찬란한 환생' },
  { name: 'Temperance (절제)', emoji: '🏺', key: '완벽한 조화와 기운의 연금술' },
  { name: 'The Devil (악마/해방)', emoji: '⛓️', key: '속박의 타파와 원초적 에너지 해방' },
  { name: 'The Tower (탑)', emoji: '⚡', key: '갑작스러운 각성과 새로운 지평' },
  { name: 'The Star (별)', emoji: '⭐', key: '희망과 영감, 천상의 인도' },
  { name: 'The Moon (달)', emoji: '🌙', key: '환상 너머의 직관과 무의식 정화' },
  { name: 'The Sun (태양)', emoji: '☀️', key: '압도적 성공과 생명력의 폭발' },
  { name: 'Judgement (심판/부활)', emoji: '🎺', key: '영혼의 각성과 운명적 부름' },
  { name: 'The World (세계)', emoji: '🌍', key: '완벽한 조화와 새로운 차원의 완성' },
];

export function TrinitySynergySection() {
  const { updateSharedState } = useApp();
  const userProfile = getPersistentUserProfile();
  // Always pick a dynamic fresh random card when loading or drawing, never predetermined
  const [selectedCard, setSelectedCard] = useState<typeof TAROT_CARDS[0]>(() => {
    return TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  });
  const [userQuery, setUserQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alchemyData, setAlchemyData] = useState<DestinyAlchemyData>(FALLBACK_ALCHEMY);
  const [isDrawn, setIsDrawn] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const isTTSActive = useTTSActive();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const toggle741Hz = () => {
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
        osc.frequency.setValueAtTime(741, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        setIsAudioPlaying(true);
      } catch (e) {
        console.warn('Audio synthesis failed:', e);
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

  const handleSpeakAlchemy = () => {
    if (isTTSActive) {
      stopTTS();
    } else {
      const text = `오늘의 개운 연금술 처방입니다. 오늘의 타로 카드: ${alchemyData.tarotCardName}. 메시지: ${alchemyData.tarotMessage}. 오행 처방: ${alchemyData.fiveElementDeficiency}. 행운의 색은 ${alchemyData.alchemyRemedy.luckyColor}, 길방위는 ${alchemyData.alchemyRemedy.luckyDirection}입니다. 오늘의 확언: ${alchemyData.destinyAlchemyAffirmation}`;
      playTTS(text, 'Kore', false, '신비');
    }
  };

  const handleDrawAndSynthesize = async (cardToUse?: typeof TAROT_CARDS[0]) => {
    setIsLoading(true);
    // Draw genuinely random card from all 22 Major Arcana without predetermination
    let randomCard = cardToUse;
    if (!randomCard) {
      const pool = TAROT_CARDS.filter((c) => c.name !== selectedCard.name);
      randomCard = (pool.length > 0 ? pool : TAROT_CARDS)[Math.floor(Math.random() * (pool.length > 0 ? pool.length : TAROT_CARDS.length))];
    }
    setSelectedCard(randomCard);

    const systemPrompt = "당신은 트리니티의 운명 개운 연금술(Alchemy) 마스터입니다. 좌측 메뉴 [Lucky]의 사주 오행(木火土金水) 결핍 보충 처방과 우측 메뉴 [TAROT]의 78장 타로 아르카나 상징을 완벽히 융합하여, '오늘 하루'에 직결되는 명쾌하고 실천적인 맞춤형 개운 솔루션을 제공하세요.";
    const userPrompt = `[양쪽 메뉴 융합: LUCKY 사주 오행 ✕ TAROT 타로 리딩]
[드로우된 타로 카드]: ${randomCard.name} (${randomCard.key})
[사용자 고민/소망]: "${userQuery.trim() || '오늘 나의 운명을 극대화할 행운 개운 비법'}"
[사용자 닉네임]: "${userProfile?.basic?.nickname || userProfile?.basic?.name || '제제'}"

반드시 아래 JSON 스키마로만 엄격하게 응답하세요 (모든 항목은 오늘 하루 중심의 간결하고 심플한 1~2문장으로 작성):
{
  "title": "오늘의 개운 칭호 (예: 오늘의 골든 솔라 개운 크로스)",
  "tarotCardName": "${randomCard.name}",
  "tarotKeyword": "카드의 핵심 상징 키워드",
  "tarotMessage": "오늘 하루를 위한 간결하고 명쾌한 핵심 계시 (1~2문장)",
  "fiveElementDeficiency": "오늘 보충할 오행 기운 (예: 활력의 火 기운 보충)",
  "alchemyRemedy": {
    "luckyColor": "오늘의 행운 색상 2가지",
    "luckyDirection": "오늘의 길방위",
    "luckyNumber": "오늘의 행운 숫자",
    "luckyFood": "오늘의 개운 음식",
    "luckyAction": "오늘 바로 실천할 초간단 개운 행동 1가지"
  },
  "destinyAlchemyAffirmation": "오늘 하루를 승리로 이끄는 1인칭 심플 확언 (1문장)",
  "talismanSecretCode": "영문 대문자와 숫자로 이루어진 연금술 부적 시길 코드"
}`;

    const safetyTimeout = new Promise<DestinyAlchemyData>((resolve) => {
      setTimeout(() => {
        resolve({
          ...FALLBACK_ALCHEMY,
          tarotCardName: randomCard.name,
          tarotKeyword: randomCard.key,
          title: `〈${randomCard.name}〉 오늘의 개운 연금술 크로스`,
          tarotMessage: `오늘 하루는 ${randomCard.key}의 기운이 깃드는 날입니다. 편안한 마음으로 자신의 빛을 믿고 나아가세요.`
        });
      }, 6500);
    });

    const runAI = async (): Promise<DestinyAlchemyData> => {
      try {
        const raw = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          responseFormat: { type: 'json_object' }
        });
        const parsed = typeof raw === 'string' ? JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) : raw;
        if (parsed && parsed.tarotMessage) {
          return parsed;
        }
      } catch (e) {
        console.warn('[TrinitySynergy] invokeLLM error:', e);
      }
      throw new Error('Need fallback');
    };

    try {
      const result = await Promise.race([runAI(), safetyTimeout]);
      setAlchemyData(result);
      setIsDrawn(true);
      recordPrismFeature({
        app: 'trinity',
        featureName: 'Trinity Destiny Alchemy Synergy',
        summary: result.title,
        details: { card: randomCard.name, title: result.title }
      });
      updateSharedState({}, 'TRINITY');
    } catch (e) {
      console.warn('Alchemy fallback error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const text = `✨ [${alchemyData.title}]\n\n🃏 타로 오라클: ${alchemyData.tarotCardName}\n💬 계시: ${alchemyData.tarotMessage}\n\n🔮 오행 개운 솔루션:\n- 부족 기운: ${alchemyData.fiveElementDeficiency}\n- 행운의 색: ${alchemyData.alchemyRemedy.luckyColor}\n- 길방위: ${alchemyData.alchemyRemedy.luckyDirection}\n- 행운의 숫자: ${alchemyData.alchemyRemedy.luckyNumber}\n- 개운 음식: ${alchemyData.alchemyRemedy.luckyFood}\n- 실천 행동: ${alchemyData.alchemyRemedy.luckyAction}\n\n🌟 대운 확언: "${alchemyData.destinyAlchemyAffirmation}"\n- PRISM TRINITY Destiny Alchemy Cross`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 text-white font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-yellow-500/30 bg-gradient-to-br from-yellow-950/50 via-zinc-950/90 to-amber-950/40 shadow-[0_0_50px_rgba(234,179,8,0.15)] backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-yellow-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest uppercase bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1.5">
                <Sparkles size={12} className="text-yellow-400 animate-pulse" />
                LUCKY ✕ TAROT FUSION
              </span>
              <span className="text-[10px] text-white/40 font-mono">741Hz INTUITION FREQUENCY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Compass className="text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]" size={28} />
              <span>운명 개운 타로 솔루션 (Destiny Alchemy Cross)</span>
            </h2>
            <p className="text-xs sm:text-sm text-yellow-100/70 max-w-xl leading-relaxed">
              <strong>Lucky(좌측: 사주 오행 개운 처방)</strong>와 <strong>TAROT(우측: 천상 타로 리딩)</strong>의 양쪽 메뉴를 융합하여, 닫힌 운로를 활짝 열어젖히는 맞춤형 개운 연금술 솔루션입니다.
            </p>
          </div>

          <button
            onClick={toggle741Hz}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
              isAudioPlaying
                ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
            }`}
          >
            {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isAudioPlaying ? '741Hz 직관 주파수 재생 중' : '741Hz 주파수 켜기'}</span>
          </button>
        </div>
      </div>

      {/* Input & Draw Action Card */}
      <div className="glass p-6 sm:p-8 rounded-[32px] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-yellow-300 flex items-center gap-2 font-mono uppercase tracking-wider">
            <Sparkles size={16} className="text-yellow-400" />
            <span>오늘 알고 싶은 운명과 개운 소망</span>
          </label>
          <span className="text-[10px] text-white/40 font-sans">오행 &amp; 타로 결합</span>
        </div>

        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="예: 오늘 나의 운명을 극대화하고 막힌 흐름을 뚫어줄 개운 솔루션을 알려주세요..."
          className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-400/60 font-sans"
        />

        <div className="flex items-center gap-2 text-[11px] text-yellow-300/80 bg-yellow-500/10 px-3.5 py-2 rounded-xl border border-yellow-500/20">
          <Disc size={13} className="text-yellow-400 shrink-0" />
          <span>천상 메이저 아르카나 22종 실시간 무작위 추첨 (카드가 미리 고정되지 않으며 매 실행 시 새롭게 결정됩니다)</span>
        </div>

        <button
          onClick={() => handleDrawAndSynthesize()}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin text-black" />
              <span>타로 아르카나 & 오행 연금술 실시간 합성 중...</span>
            </>
          ) : (
            <>
              <Zap size={18} className="text-black" />
              <span>〈운명 개운 타로 솔루션 & 부적〉 즉시 발급받기</span>
            </>
          )}
        </button>
      </div>

      {/* Output Display */}
      {isDrawn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black/95 border border-yellow-500/30 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-yellow-400">
                  DESTINY ALCHEMY ORACLE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 font-mono">
                  {alchemyData.talismanSecretCode}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{alchemyData.title}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => handleDrawAndSynthesize()}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-yellow-500/25 hover:bg-yellow-500/35 text-yellow-300 border border-yellow-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                title="다른 무작위 카드로 솔루션 다시 추첨하기"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin text-yellow-400" : "text-yellow-400"} />
                <span>다른 카드 다시 뽑기</span>
              </button>

              <button
                onClick={handleSpeakAlchemy}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTTSActive
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 animate-pulse'
                    : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 border border-yellow-500/30'
                }`}
              >
                {isTTSActive ? <VolumeX size={14} className="text-amber-300" /> : <Volume2 size={14} className="text-yellow-300" />}
                <span>{isTTSActive ? '낭독 중단' : '연금술 처방 음성 낭독'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? '복사 완료' : '솔루션 전체 복사'}</span>
              </button>
            </div>
          </div>

          {/* Drawn Tarot Card Info */}
          <div className="p-6 rounded-3xl bg-yellow-950/30 border border-yellow-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-400/50 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(234,179,8,0.4)] shrink-0">
              {selectedCard.emoji}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-yellow-400 font-mono font-bold uppercase">
                  {alchemyData.tarotKeyword}
                </span>
                <button
                  onClick={() => handleDrawAndSynthesize()}
                  disabled={isLoading}
                  className="text-[11px] text-yellow-300 hover:text-yellow-100 flex items-center gap-1 font-bold cursor-pointer transition-colors"
                >
                  <RefreshCw size={11} className={isLoading ? "animate-spin" : ""} />
                  <span>새 카드 뽑기</span>
                </button>
              </div>
              <h4 className="text-lg font-bold text-white">{alchemyData.tarotCardName}</h4>
              <p className="text-xs text-yellow-100/80 leading-relaxed font-sans">{alchemyData.tarotMessage}</p>
            </div>
          </div>

          {/* 5-Elements Remedy Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-yellow-300 uppercase font-mono tracking-wider flex items-center gap-2">
                <Flame size={14} className="text-orange-400" /> 맞춤형 오행 개운 처방전
              </h4>
              <span className="text-[11px] text-amber-300 font-medium">
                {alchemyData.fiveElementDeficiency}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '행운의 색상', val: alchemyData.alchemyRemedy.luckyColor, icon: '🎨' },
                { label: '길방위', val: alchemyData.alchemyRemedy.luckyDirection, icon: '🧭' },
                { label: '행운의 숫자', val: alchemyData.alchemyRemedy.luckyNumber, icon: '🔢' },
                { label: '개운 음식', val: alchemyData.alchemyRemedy.luckyFood, icon: '🍵' },
                { label: '실천 행동', val: alchemyData.alchemyRemedy.luckyAction, icon: '⚡', span: 'col-span-2' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 ${
                    item.span ? item.span : ''
                  }`}
                >
                  <span className="text-[10px] text-white/40 font-mono block">
                    {item.icon} {item.label}
                  </span>
                  <p className="text-xs font-bold text-white">{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Affirmation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-950/40 via-zinc-900/60 to-amber-950/40 border border-yellow-500/30 space-y-1">
            <span className="text-[10px] text-yellow-400 font-mono font-bold uppercase">
              DESTINY ALCHEMY AFFIRMATION
            </span>
            <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
              "{alchemyData.destinyAlchemyAffirmation}"
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
