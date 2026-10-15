import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, Check, Compass, TreeDeciduous,
  Activity, Bird, Music, Zap, Moon, Orbit
} from 'lucide-react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { sendPrismToss } from '@/lib/prismToss';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { resolveCanonicalPath } from '@/lib/prismRouteRegistry';
import { findBestKeyExercise } from '@/lib/keyExercisesCatalog';
import type { SpecialChannel } from '@/pages/LucyStandalonePage';

export interface LucyResponseRecommendationProps {
  userQuery?: string;
  lucyAnswer: string;
  currentChannels: SpecialChannel[];
  isCasual?: boolean;
  isGreeting?: boolean;
  onSwitchChannel: (channels: SpecialChannel[], isMaster: boolean, label: string) => void;
  onNavigate?: (path: string) => void;
}

interface ChannelMeta {
  id: SpecialChannel;
  name: string;
  shortName: string;
  tagline: string;
  badgeLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  badgeClass: string;
  hoverClass: string;
  reason: string;
  path: string;
}

const CHANNELS_META: Record<SpecialChannel, ChannelMeta> = {
  orange: {
    id: 'orange',
    name: '오렌지 (성찰)',
    shortName: '오렌지',
    tagline: '1원칙 전략적 분석 & 감정 성찰',
    badgeLabel: '1원칙·전략',
    icon: TreeDeciduous,
    color: '#f97316',
    badgeClass: 'bg-orange-500/15 border-orange-500/30 text-orange-700 dark:text-orange-300',
    hoverClass: 'hover:bg-orange-500/25 hover:border-orange-500/50',
    reason: '1원칙 사고와 근본 원인 분석, 실행 전략에 특화된 채널',
    path: '/orange',
  },
  trinity: {
    id: 'trinity',
    name: '트리니티 (운명)',
    shortName: '트리니티',
    tagline: '사주원국 & 타로 무의식 통찰',
    badgeLabel: '사주·타로',
    icon: Sparkles,
    color: '#a855f7',
    badgeClass: 'bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300',
    hoverClass: 'hover:bg-purple-500/25 hover:border-purple-500/50',
    reason: '사주 명리와 타로 상징, 우주적 동시성에 특화된 채널',
    path: '/trinity',
  },
  aura: {
    id: 'aura',
    name: '아우라 (치유)',
    shortName: '아우라',
    tagline: '호흡 명상, 신체 이완 & 방하착',
    badgeLabel: '호흡·몸',
    icon: Activity,
    color: '#10b981',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    hoverClass: 'hover:bg-emerald-500/25 hover:border-emerald-500/50',
    reason: '신체 긴장 완화, 1분 호흡, 방하착 이완에 특화된 채널',
    path: '/heal',
  },
  bluebird: {
    id: 'bluebird',
    name: '블루버드 (정화)',
    shortName: '블루버드',
    tagline: '호오포노포노 정화 & 마음 위로',
    badgeLabel: '위로·정화',
    icon: Bird,
    color: '#06b6d4',
    badgeClass: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-700 dark:text-cyan-300',
    hoverClass: 'hover:bg-cyan-500/25 hover:border-cyan-500/50',
    reason: '내면아이 보듬기, 호오포노포노 정화와 공감 위로에 특화된 채널',
    path: '/bluebird',
  },
  muse: {
    id: 'muse',
    name: '뮤즈 (영감)',
    shortName: '뮤즈',
    tagline: '명화·명시·명곡 예술처방 & 창작',
    badgeLabel: '예술·영감',
    icon: Music,
    color: '#ec4899',
    badgeClass: 'bg-pink-500/15 border-pink-500/30 text-pink-700 dark:text-pink-300',
    hoverClass: 'hover:bg-pink-500/25 hover:border-pink-500/50',
    reason: '명화와 명곡 처방, 시적 은유와 창작 영감에 특화된 채널',
    path: '/muse',
  },
};

interface FeatureAppMeta {
  id: string;
  name: string;
  shortName: string;
  featureTitle: string;
  path: string;
  iconText: string;
  runeSymbol: string;
  runeName: string;
  color: string;
  glowColor: string;
  description: string;
  actionLabel: string;
  keywords: string[];
}

const FEATURE_APPS: FeatureAppMeta[] = [
  {
    id: 'trinity',
    name: 'TRINITY',
    shortName: '트리니티 타로',
    featureTitle: '3장의 타로 & 사주 운명 신탁',
    path: '/trinity',
    iconText: '🔮',
    runeSymbol: 'ᛈ',
    runeName: 'Pertho',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.9)',
    description: '3장의 상징 카드로 무의식의 심층 심리를 해독하고 운명의 흐름을 짚어봅니다',
    actionLabel: '타로 오라클 도약',
    keywords: ['타로', '사주', '운명', '미래', '점괘', '선택', '운세', '원국', '대운', '무의식', '카드', '동시성'],
  },
  {
    id: 'orange',
    name: 'ORANGE',
    shortName: '오렌지 성찰',
    featureTitle: '1원칙 성찰 & 별에게 소원빌기',
    path: '/orange',
    iconText: '🍊',
    runeSymbol: 'ᛋ',
    runeName: 'Sowilo',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.9)',
    description: '불안과 감정을 성찰하고 밤하늘 별에게 소망을 띄우는 비밀의 성찰 숲',
    actionLabel: '별에게 소원빌기 도약',
    keywords: ['소원', '별', '성찰', '1원칙', '전략', '의사결정', '감정', '계획', '목표', '분석', '불안'],
  },
  {
    id: 'aura',
    name: 'AURA',
    shortName: '아우라 방하착',
    featureTitle: '소울 바이오 & 방하착(放下着) 치유',
    path: '/heal',
    iconText: '🧘',
    runeSymbol: 'ᛉ',
    runeName: 'Algiz',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.9)',
    description: '세도나 방하착 명상과 1분 호흡 조율로 긴장과 번뇌를 내려놓습니다',
    actionLabel: '방하착 치유 도약',
    keywords: ['호흡', '방하착', '내려놓기', '신체', '피로', '수면', '잠', '이완', '명상', '스트레스', '체력'],
  },
  {
    id: 'bluebird',
    name: 'BLUEBIRD',
    shortName: '파랑새 성소',
    featureTitle: '호오포노포노 정화 & 비밀쪽지 성소',
    path: '/bluebird',
    iconText: '🐦',
    runeSymbol: 'ᛒ',
    runeName: 'Berkana',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.9)',
    description: '미안합니다·용서하세요·감사합니다·사랑합니다 정화와 따뜻한 비밀쪽지 안식처',
    actionLabel: '정화의 성소 도약',
    keywords: ['위로', '정화', '호오포노포노', '상처', '슬픔', '눈물', '우울', '외로', '힘들어', '마음', '비밀쪽지', '내면아이'],
  },
  {
    id: 'muse',
    name: 'MUSE',
    shortName: '뮤즈 예술처방',
    featureTitle: '명화·명시·명곡 예술처방실',
    path: '/muse',
    iconText: '🎨',
    runeSymbol: 'ᚹ',
    runeName: 'Wunjo',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.9)',
    description: '메마른 마음에 울림을 주는 클래식 명곡, 명화, 시구 맞춤 예술 처방',
    actionLabel: '예술 처방 도약',
    keywords: ['예술', '명화', '음악', '클래식', '시', '영감', '창작', '글쓰기', '아이디어', '아름다움', '처방'],
  },
  {
    id: 'epilogue',
    name: 'EPILOGUE',
    shortName: '에필로그 서재',
    featureTitle: '밤 서재 하루 마감 영감 일기',
    path: '/epilogue',
    iconText: '🌙',
    runeSymbol: 'ᚨ',
    runeName: 'Ansuz',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.9)',
    description: '오늘 하루의 깨달음과 감정을 고요히 마무리하고 지혜로 기록하는 밤의 서재',
    actionLabel: '밤의 서재 도약',
    keywords: ['일기', '회고', '마감', '하루', '밤', '서재', '기록', '정리', '마무리', '취침', '오늘'],
  },
  {
    id: 'key',
    name: 'KEY 마음약방',
    shortName: 'Key 실천 연습',
    featureTitle: '40가지 불안 치유 연습실 & Dr. Z 임상 솔루션',
    path: '/key',
    iconText: '🔑',
    runeSymbol: 'ᛟ',
    runeName: 'Othala',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    description: '불안, 걱정, 공황, 신체 긴장을 즉각 다스리는 40가지 수용전념치료(ACT) 행동 실천 연습실',
    actionLabel: 'Key 실천 연습실 도약',
    keywords: [
      '불안', '걱정', '공황', '초조', '두려움', '스트레스', '긴장', '마음약방', '처방', '연습',
      '실천', '키', 'key', '저커먼', '인지치료', 'act', '호흡연습', '신체감각', '마음챙김', '접지', '탈융합'
    ],
  },
];

export function LucyResponseRecommendation({
  userQuery = '',
  lucyAnswer,
  currentChannels = [],
  isCasual = false,
  isGreeting = false,
  onSwitchChannel,
  onNavigate,
}: LucyResponseRecommendationProps) {
  const [isLeaping, setIsLeaping] = useState(false);

  // 1. 수다 모드(isCasual) 또는 루시의 인사말(isGreeting)에서는 기법 추천과 채널 추천을 전면 생략
  if (isCasual || isGreeting) {
    return null;
  }

  // 루시의 기본/환영 인사말 패턴 감지 시 LucKey 연계 추천 생략
  const cleanLucyText = (lucyAnswer || '').trim();
  if (
    cleanLucyText.includes("통합 AI 마스터 가이드 '루시'야") ||
    cleanLucyText.includes('반가워! 나는 루시야') ||
    cleanLucyText.includes('오늘도 새로운 하루가 시작되었어') ||
    cleanLucyText.includes('지난 대화들의 소중한 이야기들도 내 마음에 다 간직하고 있으니') ||
    cleanLucyText.includes('영혼 여정을 함께하는')
  ) {
    return null;
  }

  // 사용자 질문이 아예 없거나(초기 인사말 단계) 공백인 경우 연계 추천 생략
  const cleanUserText = (userQuery || '').trim().toLowerCase();
  if (!cleanUserText) {
    return null;
  }

  // 사용자 입력이 단순 인사말인 경우 연계 추천 생략
  const isSimpleGreetingQuery = /^(안녕|안녕하세요|안뇽|하이|hi|hello|좋은\s*아침|좋은\s*하루|반가워|반갑습니다|루시\s*안녕|루시야\s*안녕|안녕\s*루시)[!~.\s]*$/i.test(cleanUserText);
  if (isSimpleGreetingQuery && cleanLucyText.length < 160) {
    return null;
  }

  // 답변 텍스트가 10자 미만인 경우 추천 생략
  if (!lucyAnswer || lucyAnswer.trim().length < 10) {
    return null;
  }

  // 2. 질문과 답변의 맥락 정밀 분석을 통해 최적의 단일 추천 채널 및 Key 실천 기법 도출
  const { recommendedChannel, recommendedFeature, themeReason } = useMemo(() => {
    const cleanUser = (userQuery || '').toLowerCase();
    const cleanLucy = (lucyAnswer || '').toLowerCase();

    // 40대 Key 마음약방 실천 연습 중 맥락에 가장 부합하는 1개 기법 먼저 정밀 추출
    const bestEx = findBestKeyExercise(cleanUser, cleanLucy);

    // 각 채널별 정밀 도메인 키워드 사전
    const CHANNEL_KEYWORDS: Record<SpecialChannel, string[]> = {
      orange: [
        '전략', '1원칙', '분석', '계획', '의사결정', '선택', '판단', '로드맵', '우선순위',
        '해결책', '대안', '원인', '성찰', '이성', '논리', '체계', '소원', '우물', '소망',
        '동기', '목표', '성공', '커리어', '진로', '사업', '비즈니스', '투자', '취업', '효율', '실행방안'
      ],
      trinity: [
        '사주', '타로', '운명', '운세', '미래', '점괘', '카드', '오라클', '신탁', '동시성',
        '천간', '지지', '대운', '오행', '목화토금수', '사주팔자', '명리', '무의식', '영혼',
        '상징', '인연', '전생', '우주', '직관', '예감', '점', '팔자', '별자리', '운의흐름'
      ],
      aura: [
        '호흡', '방하착', '내려놓기', '세도나', '신체', '몸', '피로', '수면', '잠', '불면',
        '이완', '명상', '스트레스', '긴장', '두통', '근육', '어깨', '목', '체력', '건강',
        '휴식', '쉼', '맥박', '심장', '가슴답답', '숨가쁨', '과호흡', '굳음', '몸살', '지침', '탈진'
      ],
      bluebird: [
        '위로', '정화', '호오포노포노', '미안', '용서', '고마워', '사랑해', '상처', '슬픔',
        '눈물', '울음', '외로움', '우울', '힘들', '속상', '괴로', '내면아이', '따뜻', '포옹',
        '마음치유', '토닥', '비밀쪽지', '상실', '이별', '공감', '서러움', '가슴아픔', '마음'
      ],
      muse: [
        '예술', '명화', '그림', '미술', '음악', '노래', '클래식', '명곡', '시', '시구',
        '작시', '영감', '창작', '글쓰기', '문장', '표현', '아이디어', '카피', '감성', '감수성',
        '도슨트', '박물관', '전시', '아름다움', '뮤즈', '낭만', '예술치유', '선율'
      ],
    };

    // 채널 점수 계산 (사용자 질문 가중치 6점 / 루시 답변 가중치 3점)
    const channelScores: Record<SpecialChannel, number> = {
      orange: 0,
      trinity: 0,
      aura: 0,
      bluebird: 0,
      muse: 0,
    };

    (Object.keys(CHANNEL_KEYWORDS) as SpecialChannel[]).forEach((ch) => {
      const kws = CHANNEL_KEYWORDS[ch];
      for (const kw of kws) {
        if (cleanUser.includes(kw)) channelScores[ch] += 6;
        if (cleanLucy.includes(kw)) channelScores[ch] += 3;
      }
      // 현재 대화 채널과의 연속성 보너스 (+4)
      if (currentChannels.includes(ch)) {
        channelScores[ch] += 4;
      }
    });

    // 매칭된 Key 연습의 도메인과 LucKey 채널 시너지 연계 가중치 부여
    const exIdx = bestEx.globalIndex;
    if ([13, 14, 15, 16, 17, 18, 20, 21].includes(exIdx)) {
      // 신체 감각, 호흡, 이완, 근육 긴장 -> 아우라 채널
      channelScores.aura += 12;
    } else if ([9, 23, 24, 28, 32, 33, 35].includes(exIdx)) {
      // 내면아이, 슬픔, 위로, 수용, 감정 정화 -> 블루버드 채널
      channelScores.bluebird += 12;
    } else if ([1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 22, 25, 26, 27, 29, 30, 31, 34, 39, 40].includes(exIdx)) {
      // 전략적 사고, 우선순위, 가치 행동, 인지 재구성 -> 오렌지 채널
      channelScores.orange += 12;
    } else if ([36, 37, 38].includes(exIdx)) {
      // 예기불안, 미래 통찰 -> 트리니티 및 오렌지
      channelScores.trinity += 8;
      channelScores.orange += 6;
    }

    // 최고 득점 단 1개의 최적 추천 채널 선정
    const sortedChannels = (Object.keys(channelScores) as SpecialChannel[]).sort(
      (a, b) => channelScores[b] - channelScores[a]
    );

    // 모든 채널 점수가 0인 경우에도 Key 연습의 성격에 맞는 자연스러운 채널 도출
    let topChannelKey: SpecialChannel = sortedChannels[0];
    if (channelScores[topChannelKey] <= 0) {
      if ([13, 14, 15, 16, 17, 18, 20, 21].includes(exIdx)) topChannelKey = 'aura';
      else if ([9, 23, 24, 28, 32, 33, 35].includes(exIdx)) topChannelKey = 'bluebird';
      else if ([36, 37, 38].includes(exIdx)) topChannelKey = 'trinity';
      else topChannelKey = 'orange';
    }

    const primaryChannel = CHANNELS_META[topChannelKey];

    const keyFeature: FeatureAppMeta = {
      id: 'key',
      name: 'KEY 마음약방',
      shortName: `연습 ${bestEx.index}. ${bestEx.title}`,
      featureTitle: `40대 치유 연습 중 맞춤 추천: 연습 ${bestEx.index}. ${bestEx.title} (${bestEx.page}쪽)`,
      path: `/key?ex=${bestEx.globalIndex}`,
      iconText: bestEx.icon || '🔑',
      runeSymbol: 'ᛟ',
      runeName: 'Othala',
      color: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.9)',
      description: `[${bestEx.tag}] ${bestEx.purpose}`,
      actionLabel: `실천`,
      keywords: [],
    };

    const reasonText = `[${bestEx.tag}·${primaryChannel.badgeLabel}] ${primaryChannel.shortName} 채널 × Key ${bestEx.title} 맞춤 연계`;

    return {
      recommendedChannel: primaryChannel,
      recommendedFeature: keyFeature,
      themeReason: reasonText,
    };
  }, [userQuery, lucyAnswer, currentChannels]);

  // 추천 기능으로 도약 실행 (오브의 handleTossToDimension과 동일한 유기적 토스 연동)
  const handleLeapToFeature = (feature: FeatureAppMeta) => {
    if (isLeaping) return;
    setIsLeaping(true);

    const safePath = resolveCanonicalPath(feature.path || '/');
    const targetAppId = feature.id === 'aura' ? 'heal' : feature.id === 'trinity' ? 'oracle' : feature.id;
    const queryStr = userQuery || '루시와의 대화';
    const keyThemeStr = feature.shortName;
    const directAnswerStr = lucyAnswer ? lucyAnswer.slice(0, 180) : '';

    if (feature.id === 'key' || feature.path.includes('/key')) {
      const match = feature.path.match(/ex=(\d+)/);
      const exIdx = match ? match[1] : '1';
      try {
        sessionStorage.setItem('key_target_exercise', exIdx);
      } catch (_) {}
    }

    try {
      const tossPayload = {
        source: 'lucy',
        sourceName: '루시 심층 대화',
        targetAppId: feature.id,
        timestamp: Date.now(),
        query: queryStr,
        keyTheme: keyThemeStr,
        directAnswer: directAnswerStr,
        actionSolution: '루시 추천 기능으로 이어서 심화 진행',
      };
      safeLocalStorage.setItem('prism_toss_context', JSON.stringify(tossPayload));
      safeLocalStorage.setItem('pending_prism_toss', JSON.stringify(tossPayload));

      sendPrismToss({
        sourceApp: 'lucy',
        targetApp: targetAppId,
        actionType: 'smart_toss',
        contextMessage: `[루시 대화 연동 도약] ${keyThemeStr}`,
        autoTrigger: true,
        autoPrompt: `[루시 대화 연계] 질문: "${queryStr.slice(0, 100)}" / 루시 조언: "${directAnswerStr.slice(0, 150)}"`,
        orbInsight: {
          query: queryStr,
          keyTheme: keyThemeStr,
          directAnswer: directAnswerStr,
          actionSolution: '루시 추천 기능으로 이어서 심화 진행',
        },
        tossedAt: Date.now(),
      });
    } catch (e) {
      console.warn('[LucyRecommendation] Toss dispatch error:', e);
    }

    try {
      triggerHaptic('bigbang');
    } catch (_) {}

    try {
      window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: safePath } }));
      window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: safePath } }));
    } catch (_) {}

    setTimeout(() => {
      try {
        if (onNavigate) {
          onNavigate(safePath);
        } else if (typeof window !== 'undefined') {
          window.location.href = safePath;
        }
      } catch (err) {
        console.error('[LucyRecommendation] Navigation error:', err);
      } finally {
        setTimeout(() => setIsLeaping(false), 800);
      }
    }, 280);
  };

  const isCurrentChannelActive = (currentChannels || []).includes(recommendedChannel.id);
  const RecChannelIcon = recommendedChannel.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-800/70 text-slate-800 dark:text-slate-200"
    >
      {/* 🌟 단일 통합 추천 칸 (Key 추천 기법 + LucKey 연계 추천 경로 1개를 같은 칸에 배치) */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-slate-900 text-white border border-cyan-500/30 shadow-md space-y-2.5 transition-all hover:border-cyan-400/50">
        {/* 헤더: LucKey 연계 추천 라벨 & 테마 이유 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
            <Sparkles size={13} className="text-amber-400 animate-pulse" />
            <span>LucKey 연계 추천</span>
          </div>
          <span className="text-[10px] text-slate-400 truncate max-w-[210px] sm:max-w-none">
            {themeReason}
          </span>
        </div>

        {/* 같은 칸 내부: Key 추천기법 (좌측) + 단 1개의 LucKey 연계 채널 (우측) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-0.5">
          {/* A. Key 추천 기법 (40가지 실천 연습실) */}
          <div
            onClick={() => handleLeapToFeature(recommendedFeature)}
            className="flex-1 flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-cyan-400/25 hover:border-cyan-400/60 transition-all duration-200 hover:scale-[1.015] cursor-pointer group active:scale-[0.99] min-w-0"
            title={`${recommendedFeature.featureTitle} (클릭 시 Key 연습실로 바로 이동)`}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border font-serif font-black text-base text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
              style={{
                background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25) 0%, rgba(20,20,35,0.95) 80%)',
                borderColor: recommendedFeature.color,
                boxShadow: `0 0 10px ${recommendedFeature.glowColor}`,
              }}
            >
              {recommendedFeature.iconText || '🔑'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/40 shrink-0">
                  Key 추천 기법
                </span>
                <span className="text-xs font-bold text-white break-keep break-words group-hover:text-cyan-200 transition-colors">
                  {recommendedFeature.shortName}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 break-keep break-words whitespace-normal mt-0.5 font-normal">
                {recommendedFeature.description}
              </p>
            </div>
            <button
              type="button"
              disabled={isLeaping}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-black shrink-0 flex items-center gap-1 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:brightness-110 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${recommendedFeature.color}, #f59e0b)`,
              }}
            >
              <span>실천</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* B. LucKey 연계 추천 경로 (단 1개만 같은 칸에 배치) */}
          <div className="sm:border-l sm:border-white/10 sm:pl-2.5 flex items-center justify-between sm:justify-start gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                handleLeapToFeature({
                  id: recommendedChannel.id,
                  name: recommendedChannel.name,
                  shortName: recommendedChannel.shortName,
                  featureTitle: `${recommendedChannel.name} 전문 채널`,
                  path: recommendedChannel.path,
                  iconText: '✨',
                  runeSymbol: 'ᛟ',
                  runeName: recommendedChannel.shortName,
                  color: recommendedChannel.color,
                  glowColor: recommendedChannel.color,
                  description: recommendedChannel.tagline,
                  actionLabel: `${recommendedChannel.shortName} 채널 입장`,
                  keywords: [],
                });
                onSwitchChannel([recommendedChannel.id], false, recommendedChannel.name);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95 ${recommendedChannel.badgeClass} ${recommendedChannel.hoverClass}`}
              title={`[${recommendedChannel.name}] LucKey 채널로 즉시 입장합니다.`}
            >
              <RecChannelIcon size={13} className="shrink-0" />
              <span>{recommendedChannel.shortName} 채널</span>
              <span className="text-[10px] opacity-75 font-normal">➔</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
