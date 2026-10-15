import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Leaf, Wind, ShieldCheck, Heart, Sparkles, Activity, Sun, Anchor,
  Brain, Ban, TrendingUp, Combine, BookOpen,
  Volume2, VolumeX, Play, Pause, Square, Headphones, RotateCcw
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';
import { playTTSInChunks, stopTTS, pauseTTS, resumeTTS, subscribeTTS } from '@/utils/tts';

export interface SedonaChapter {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  principles: string[];
  steps: string[];
  color: string;
  textColor: string;
  bgColor: string;
}

const SEDONA_CHAPTERS: SedonaChapter[] = [
  {
    id: 'ch-1',
    title: '4 Questions · 세도나 4문답',
    subtitle: 'Sedona Method · AURA',
    icon: Leaf,
    color: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-400',
    principles: [
      '레스터 레븐슨이 전한 세도나 메서드의 핵심은 네 가지 질문입니다.',
      '① 이 감정을 느낄 수 있나요? ② 흘려보낼 수 있나요? ③ 기꺼이 놓아버리겠습니까? ④ 언제? (지금!)',
      '질문만으로도 감정의 전하(Charge)가 약해지고, 호킨스의 놓아버림과 자연스럽게 이어집니다.',
    ],
    steps: [
      '지금 느끼는 감정에 세도나 4문답을 적용하는 방법 알려줘',
      '4문답 각 단계에서 스스로에게 할 말 예시 들어줘',
      '감정이 강할 때 4문답을 반복하는 실전 가이드 해줘',
    ],
  },
  {
    id: 'ch-2',
    title: 'Letting Go · 놓아버림의 원리',
    subtitle: 'Letting Go · David Hawkins',
    icon: BookOpen,
    color: 'border-teal-500/20',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-400',
    principles: [
      '데이비드 호킨스 『놓아버림(Letting Go)』— 억압이 아니라 자연스러운 해방입니다.',
      '감정을 느끼면 느낄수록, 저항 없이 통과하면 스스로 약해지고 사라집니다.',
      '분석하거나 해결하려 하지 말고, 느끼고 환영하는 것이 핵심입니다.',
    ],
    steps: [
      '호킨스의 놓아버림 3단계(느끼기→환영→놓기)를 오늘 내 감정에 적용해줘',
      '감정을 억누르지 않고 느끼다 자연스럽게 놓아버리는 연습 알려줘',
      '「놓아버림」과 「흘려보내기」의 차이와 공통점 설명해줘',
    ],
  },
  {
    id: 'ch-3',
    title: 'Feel the Feeling · 감정을 온전히 느끼기',
    subtitle: 'Letting Go · David Hawkins',
    icon: Brain,
    color: 'border-teal-500/20',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-400',
    principles: [
      '호킨스는 「감정을 느껴라」고 합니다. 머리가 아니라 몸에서 느껴야 합니다.',
      '가슴, 목, 배, 어깨— 감정이 어디에 자리하는지 찾아 비춰 보세요.',
      '얼마나 오래 느끼든 괜찮습니다. 느끼는 것 자체가 정화입니다.',
    ],
    steps: [
      '지금 감정이 몸 어디에 있는지 함께 찾아봐줘',
      '감정을 온전히 느끼며 놓아버리는 5분 바디 스캔 가이드 해줘',
      '머리로 분석하지 않고 몸으로 느끼는 연습법 알려줘',
    ],
  },
  {
    id: 'ch-4',
    title: 'Resistance · 저항 풀기',
    subtitle: 'Sedona × Letting Go',
    icon: Ban,
    color: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-400',
    principles: [
      '호킨스: 저항이 감정을 붙잡아 둡니다. 「이런 기분 싫어」가 고통을 연장합니다.',
      '세도나: 「느낄 수 있나요?」— 저항 대신 환영의 첫 질문입니다.',
      '저항을 저항하지 마세요. 저항마저 느끼고 놓아버릴 수 있습니다.',
    ],
    steps: [
      '지금 내가 무엇에 저항하고 있는지 함께 살펴봐줘',
      '저항을 느끼고 놓아버리는 호킨스식 연습 해줘',
      '세도나 1번 질문으로 저항을 환영하는 방법 알려줘',
    ],
  },
  {
    id: 'ch-5',
    title: 'Three Desires · 에고의 3대 욕구',
    subtitle: 'Sedona × Letting Go',
    icon: ShieldCheck,
    color: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-400',
    principles: [
      '세도나: 에고의 결핍 욕구—통제, 인정, 안전—에서 자유를 찾습니다.',
      '호킨스: 낮은 의식의 욕망(Desire)과 집착이 감정을 만들어냅니다.',
      '욕구를 알아차리고 느끼면, 세도나 질문과 놓아버림이 함께 작동합니다.',
    ],
    steps: [
      '지금 나의 통제 욕구를 느끼고 세도나+놓아버림으로 풀어줘',
      '인정 욕구가 올라올 때 호킨스식 감정 처리법 알려줘',
      '안전 욕구와 두려움을 항복하며 놓아버리는 통합 가이드 해줘',
    ],
  },
  {
    id: 'ch-6',
    title: 'Map of Consciousness · 의식 지도',
    subtitle: 'Letting Go · David Hawkins',
    icon: TrendingUp,
    color: 'border-teal-500/20',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-400',
    principles: [
      '호킨스 의식 지도: 수치가 낮을수록—수치심, 죄책감, 무기력, 슬픔, 두려움, 욕망, 분노, 자만.',
      '높을수록—용기, 수용, 사랑, 평화, 깨달음. 방하착은 한 단계씩 올라가는 길입니다.',
      '세도나 릴리즈 테마(무기력·슬픔·두려움·분노·통제·인정·안전)와 의식 지도가 맞닿아 있습니다.',
    ],
    steps: [
      '지금 내 감정이 호킨스 의식 지도 어디쯤인지 함께 살펴봐줘',
      '의식 수준을 한 단계 올리는 오늘의 놓아버림 처방 알려줘',
      '분노에서 용기로, 두려움에서 수용으로 올라가는 실천법 알려줘',
    ],
  },
  {
    id: 'ch-7',
    title: 'Emotional Release · 감정 방하착',
    subtitle: 'Sedona × Letting Go',
    icon: Heart,
    color: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-400',
    principles: [
      '무기력, 슬픔, 두려움, 분노— 억압된 감정은 몸에 전하(Charge)로 남습니다.',
      '호킨스: 감정 에너지가 쌓이면 스트레스와 질병으로 이어질 수 있습니다.',
      '세도나 4문답으로 질문하고, 호킨스 방식으로 느끼며, 함께 흘려냅니다.',
    ],
    steps: [
      '지금 가장 크게 느껴지는 감정을 세도나+놓아버림으로 흘려보내줘',
      '분노를 느끼다 놓아버리는 통합 4문답 적용해줘',
      '슬픔과 상실감을 안아 느끼고 흘려보내는 명상 가이드 해줘',
    ],
  },
  {
    id: 'ch-8',
    title: 'Surrender · 항복',
    subtitle: 'Sedona × Letting Go',
    icon: Sparkles,
    color: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-400',
    principles: [
      '호킨스: 항복(Surrender)은 패배가 아니라, 더 높은 힘에 맡기는 것입니다.',
      '세도나: 「기꺼이 놓아버리겠습니까?」— 항복의 질문입니다.',
      '완고한 에고를 내려놓을 때, 평정과 자비가 스스로 찾아옵니다.',
    ],
    steps: [
      '오늘 항복해야 할 완고함을 느끼고 흘려보내는 연습 해줘',
      '호킨스+세도나 융합 항복 확언문 맞춤으로 만들어줘',
      '통제하려는 마음을 우주에 맡기는 짧은 기도 가이드 해줘',
    ],
  },
  {
    id: 'ch-9',
    title: 'Sedona × Letting Go · 융합 실천',
    subtitle: 'Sedona × Letting Go',
    icon: Combine,
    color: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-400',
    principles: [
      '① 몸에서 감정을 느낀다 (호킨스) → ② 세도나 4문답으로 흘려보낸다 → ③ 항복하며 놓는다.',
      '두 방법은 경쟁이 아니라 같은 방향의 다른 손잡이입니다.',
      '어느 쪽이든 편한 것부터 시작하면 됩니다.',
    ],
    steps: [
      '세도나 4문답과 호킨스 놓아버림을 한 세션으로 합친 10분 가이드 해줘',
      '스트레스 순간에 30초 융합 릴리즈 기법 알려줘',
      '오늘 내 감정에 맞는 세도나 테마와 놓아버림 순서 추천해줘',
    ],
  },
  {
    id: 'ch-10',
    title: 'Stress & Body · 스트레스와 몸',
    subtitle: 'Letting Go · David Hawkins',
    icon: Activity,
    color: 'border-teal-500/20',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-400',
    principles: [
      '호킨스: 쌓인 감정 에너지가 만성 스트레스와 신체 긴장을 만듭니다.',
      '몸의 긴장을 느끼고 놓아버리면, 마음의 짐도 함께 가벼워집니다.',
      '세도나 솔페지오 주파수와 함께하면 신체·정서 동시 정화에 도움이 됩니다.',
    ],
    steps: [
      '몸에 쌓인 스트레스를 호킨스 방식으로 방출하는 법 알려줘',
      '어깨·턱·배 긴장을 느끼고 놓아버리는 바디 릴리즈 해줘',
      '신체 긴장과 감정을 함께 푸는 저녁 루틴 짜줘',
    ],
  },
  {
    id: 'ch-11',
    title: 'Daily Practice · 매일의 방하착',
    subtitle: 'Sedona × Letting Go',
    icon: Sun,
    color: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-400',
    principles: [
      '방하착은 한 번이 아니라 매 순간 선택하는 연습입니다.',
      '아침: 의식 지도 점검 + 세도나 질문. 낮: 감정 올라올 때 즉시 느끼고 놓기.',
      '저녁: 하루 쌓인 감정 에너지를 호킨스식으로 비우고 평온히 마무리.',
    ],
    steps: [
      '아침 5분 세도나+놓아버림 통합 루틴 짜줘',
      '감정이 올라올 때 바로 쓸 융합 30초 기법 알려줘',
      '하루를 평온하게 마무리하는 저녁 방하착 가이드 해줘',
    ],
  },
  {
    id: 'ch-12',
    title: 'Hollowness · 비움과 평정',
    subtitle: 'Sedona × Letting Go',
    icon: Anchor,
    color: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-400',
    principles: [
      '호킨스: 감정을 놓으면 잠시 텅 빈 느낌이 옵니다. 그것이 평정의 문입니다.',
      '세도나: 완전한 해방 후 남는 것은 순수한 자아와 고요함입니다.',
      '비어 있음은 결핍이 아니라, 본래의 자비로운 본성이 드러나는 공간입니다.',
    ],
    steps: [
      '방하착 후 텅 빈 느낌이 올 때 호킨스가 권하는 대처법 알려줘',
      '평정과 공허를 구분하는 방법 설명해줘',
      '비움 속에서 본래의 나를 느끼는 짧은 명상 안내해줘',
    ],
  },
  {
    id: 'ch-13',
    title: 'Dropping the Pen & 3 Core Wants · 펜 떨어뜨리기와 3대 욕구 해체',
    subtitle: 'Sedona Method · AURA',
    icon: Wind,
    color: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-400',
    principles: [
      '세도나 메서드의 대표적 앵커링: 펜을 꽉 쥐고 있다가 손을 펴 툭 떨어뜨리듯 감정을 즉각 방하착합니다.',
      '인간의 모든 불안과 분노의 뿌리에는 통제 욕구, 인정 욕구, 안전/생존 욕구가 있습니다.',
      '‘원한다(Want)’는 결핍 선언을 내려놓을 때 우주의 완전한 공급과 사랑이 채워집니다.',
    ],
    steps: [
      '통제 욕구를 내려놓는 3분 방하착 실천법 알려줘',
      '타인의 인정과 사랑에 목마른 결핍을 치유하는 법 알려줘',
      '미래 생존 불안을 세도나 4문답으로 즉시 릴리즈하는 가이드해줘',
    ],
  },
  {
    id: 'ch-14',
    title: 'Hawkins Somatic Scan & Resistance · 호킨스 신체 전압과 저항 놓아주기',
    subtitle: 'Letting Go · David Hawkins',
    icon: Activity,
    color: 'border-teal-500/20',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-400',
    principles: [
      '데이비드 호킨스: 감정의 이름(분노, 슬픔)을 떼고 오직 목·가슴·명치의 물리적 전압만 바라보며 버팁니다.',
      '‘이 감정을 느끼기 싫다’는 2차 저항을 먼저 환영하고 놓아줄 때 치유의 문이 열립니다.',
      '저항하지 않으면 아무리 격렬한 감정의 전압도 10~20분 안에 자연스럽게 방전되어 평화로 승화됩니다.',
    ],
    steps: [
      '생각을 끄고 가슴의 물리적 전압만 바라보는 호킨스 명상 가이드해줘',
      '부정적 감정에 대한 2차 저항을 흘려보내는 법 알려줘',
      '의식 지도(200 용기 -> 500 사랑 -> 600 평화)로 도약하는 루틴 짜줘',
    ],
  },
];

export const SedonaBible: React.FC<{ 
  onConsult: (text: string) => void;
}> = ({ onConsult }) => {
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [isPausedFull, setIsPausedFull] = useState(false);
  const [currentNarratingChapter, setCurrentNarratingChapter] = useState<number | null>(null);

  // 세도나 지혜도감 전체 14개 챕터 연속 낭독 대본 생성
  const fullSpeechScript = useMemo(() => {
    const lines: string[] = [
      '세도나 메서드와 데이비드 호킨스의 놓아버림 통합 지혜도감 전체 낭독을 시작합니다.',
      '레스터 레븐슨의 세도나 4문답과 데이비드 호킨스의 감정 놓아버림을 통해, 내면의 모든 저항과 에고를 풀고 본래의 평정을 회복하는 지혜의 여정입니다.',
    ];

    SEDONA_CHAPTERS.forEach((ch, idx) => {
      lines.push(`제 ${idx + 1}장. ${ch.title}.`);
      ch.principles.forEach((p) => lines.push(p));
    });

    lines.push(
      '마침 말씀입니다. 레스터 레븐슨은 질문으로, 데이비드 호킨스는 느낌으로 가르칩니다. 둘 다 같은 곳으로 향합니다. 감정을 붙잡지 않는 완전한 자유. 오늘 하루도 평온하고 가벼운 마음으로 온전히 머무르시길 축복합니다.'
    );

    return lines.join('\n\n');
  }, []);

  // TTS 상태 구독으로 재생 완료 자동 감지
  useEffect(() => {
    const unsubscribe = subscribeTTS((state) => {
      if (!state.isSpeaking && !state.isLoading) {
        setIsPlayingFull(false);
        setIsPausedFull(false);
        setCurrentNarratingChapter(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // 전체 낭독 시작
  const handleStartFullNarration = useCallback(async () => {
    try {
      stopTTS();
      setIsPlayingFull(true);
      setIsPausedFull(false);
      setCurrentNarratingChapter(0);
      await playTTSInChunks(fullSpeechScript, 'Kore', 110, '치유');
    } catch (err) {
      console.warn('[SedonaBible] Narration error:', err);
      setIsPlayingFull(false);
      setIsPausedFull(false);
    }
  }, [fullSpeechScript]);

  // 일시정지 토글
  const handleTogglePause = useCallback(() => {
    if (isPausedFull) {
      resumeTTS();
      setIsPausedFull(false);
    } else {
      pauseTTS();
      setIsPausedFull(true);
    }
  }, [isPausedFull]);

  // 정지
  const handleStopNarration = useCallback(() => {
    stopTTS();
    setIsPlayingFull(false);
    setIsPausedFull(false);
    setCurrentNarratingChapter(null);
  }, []);

  // 개별 챕터 즉시 낭독
  const handleReadSingleChapter = useCallback(async (index: number) => {
    const ch = SEDONA_CHAPTERS[index];
    if (!ch) return;
    const text = `제 ${index + 1}장. ${ch.title}. ${ch.principles.join(' ')}`;
    try {
      stopTTS();
      setIsPlayingFull(true);
      setIsPausedFull(false);
      setCurrentNarratingChapter(index);
      await playTTSInChunks(text, 'Kore', 110, '치유');
    } catch (err) {
      console.warn('[SedonaBible] Single chapter narration error:', err);
      setIsPlayingFull(false);
      setIsPausedFull(false);
    }
  }, []);

  return (
    <div className="space-y-12 py-6 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">
          <Sparkles size={12} className="text-emerald-400" />
          <span>AI 코칭 &amp; 방하착 질문 가이드</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
          Sedona Bible
        </h2>
        <p className="text-sm text-emerald-400/90 uppercase tracking-[0.25em] font-bold">
          세도나 메서드 &amp; 데이비드 호킨스 『놓아버림』 통합 바이블
        </p>
        <p className="text-xs text-white/45 max-w-2xl mx-auto leading-relaxed font-sans normal-case tracking-normal">
          레스터 레븐슨의 세도나 4문답과 데이비드 호킨스의 감정 놓아버림을 바탕으로, 루시(AI)와 1:1 대화를 나누며 내면의 저항을 풀고 평정을 회복하는 코칭 가이드입니다.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {['4문답', '느끼기', '저항풀기', '항복', '놓아버림'].map((step) => (
            <span
              key={step}
              className="text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300/90"
            >
              {step}
            </span>
          ))}
        </div>

        {/* 🌟 전체 낭독 오디오북 플레이어 패널 (iPhone Mini 등 초소형 모바일 완벽 대응) */}
        <div className="max-w-2xl mx-auto mt-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-teal-950/50 to-slate-900/70 border border-emerald-500/30 shadow-2xl backdrop-blur-md relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            {/* 플레이어 정보 및 상태 배지 */}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  <Headphones className="w-3 h-3 text-emerald-400" />
                  전체 지혜 14장 오디오북
                </span>
                {isPlayingFull && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 border border-amber-400/40 text-amber-300 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    {isPausedFull ? '일시정지됨' : currentNarratingChapter !== null ? `제 ${currentNarratingChapter + 1}장 낭독 중` : '연속 낭독 중'}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight break-keep">
                세도나 × 호킨스 통합 지혜도감 전체 낭독
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-200/70 break-keep">
                14개 전 챕터의 핵심 원리와 방하착 지혜를 차분한 치유 음성으로 연속 청취합니다.
              </p>
            </div>

            {/* 컨트롤 버튼 그룹 */}
            <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
              {!isPlayingFull ? (
                <button
                  type="button"
                  onClick={handleStartFullNarration}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer min-h-[42px]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>전체 낭독 시작</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleTogglePause}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 active:scale-95 transition-all cursor-pointer min-h-[40px]"
                    title={isPausedFull ? '이어듣기' : '일시정지'}
                  >
                    {isPausedFull ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                        <span>이어듣기</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current text-amber-300" />
                        <span>일시정지</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleStopNarration}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs active:scale-95 transition-all cursor-pointer min-h-[40px]"
                    title="낭독 멈춤"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>정지</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 14개 챕터 렌더링 */}
      <div className="space-y-10">
        {SEDONA_CHAPTERS.map((chapter, idx) => (
          <div key={chapter.id} className="relative">
            {/* 챕터별 상단 퀵 낭독 바 */}
            <div className="flex justify-end pr-3 pb-2">
              <button
                type="button"
                onClick={() => handleReadSingleChapter(idx)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50 hover:text-emerald-300 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                title={`제 ${idx + 1}장 낭독 듣기`}
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>제 {idx + 1}장 개별 낭독</span>
              </button>
            </div>

            <BibleToolSection
              title={chapter.title}
              subtitle={chapter.subtitle}
              icon={chapter.icon}
              principles={chapter.principles}
              steps={chapter.steps}
              color={chapter.color}
              textColor={chapter.textColor}
              bgColor={chapter.bgColor}
              onSelectStep={onConsult}
            />
          </div>
        ))}
      </div>

      {/* Footer Quote Banner */}
      <div className="mt-12 p-8 rounded-[36px] bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-2xl relative z-10">
          <Combine className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="space-y-6 relative z-10">
          <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">
            Sedona × Letting Go Note
          </h3>
          <p className="text-xl md:text-xl text-emerald-100 leading-relaxed font-sans max-w-3xl mx-auto drop-shadow-lg">
            &ldquo;레스터 레븐슨은 질문으로, 데이비드 호킨스는 느낌으로 가르칩니다. 둘 다 같은 곳으로 향합니다—감정을 붙잡지 않는 자유.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};