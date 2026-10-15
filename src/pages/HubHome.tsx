import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Sparkles, Music, TreeDeciduous, Bird, Activity, Zap, Moon, Sun, ChevronDown, ChevronUp, Brain, ChevronRight, Play, Pause, Hexagon, Triangle, X, Compass, HeartPulse, Shield, ListTodo } from 'lucide-react';
import { PrologueECPRView } from '@/components/prologue/PrologueECPRView';
import { PrologueTodoSection } from '@/components/prologue/PrologueTodoSection';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TTSButton } from '@/components/TTSButton';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLMStructured, PERSONAS, GlobalSyncSchema, ensureGlobalSyncResult, isBrokenGlobalSyncResult } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';

import { useNarrowPhone } from '@/hooks/useNarrowPhone';
import { getHubMetricsIntervalMs, isLegacyMobile } from '@/lib/perfMode';
import { computeRealtimeBiometrics, getKstHour } from '@/lib/biometrics';
import { HUB_TIME_PRESETS } from '@/lib/copyTone';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import { UniverseInsightCard } from '@/components/UniverseInsightCard';
import { type UniverseInsightItem } from '@/data/universeInsights';
import { useBinauralBeat } from '@/hooks/useBinauralBeat';
import { LucKeyLogoText } from '@/components/LucKeyLogoText';
import { openChannelIntro } from '@/components/common/ChannelIntroModal';
import { GoalProgressRingDashboard } from '@/components/goals/GoalProgressRingDashboard';
import { TodayLucyPersonaCard } from '@/components/TodayLucyPersonaCard';
import { useSwipeableTabs } from '@/hooks/useSwipeableTabs';
import { playAiResultNotification } from '@/lib/audioHaptics';

const HUB_SWIPE_TABS = ['universe', 'ecpr', 'todo'] as const;
type HubSwipeTab = typeof HUB_SWIPE_TABS[number];

const APPS = [
  {
    id: 'orange',
    name: 'ORANGE',
    subtitle: '마음 치유',
    desc: '내면의 소외된 아이를 보듬고 하루의 감정을 따뜻하게 성찰하는 마음 치유 공간',
    icon: TreeDeciduous,
    color: 'oklch(0.72 0.18 55)',
    path: '/orange',
    persona: 'ORANGE',
    personaDesc: '따뜻하고 솔직한 마음 치유 가이드',
    vibeKeyword: '마음 치유',
  },
  {
    id: 'trinity',
    name: 'TRINITY',
    subtitle: '운명 오라클',
    desc: '사주·점성술·타로의 우주적 데이터를 엮어 삶의 길과 기운을 읽어내는 운명 나침반',
    icon: Sparkles,
    color: 'oklch(0.85 0.15 90)',
    path: '/trinity',
    persona: 'TRINITY',
    personaDesc: '사주·점성술·타로 오라클 마스터',
    vibeKeyword: '운명 탐구',
  },
  {
    id: 'heal',
    name: 'AURA',
    subtitle: '신체 웰니스',
    desc: '호흡과 스트레칭, 차크라 조율로 몸의 활력과 생체 리듬을 회복하는 신체 웰니스 공간',
    icon: Activity,
    color: 'oklch(0.70 0.15 150)',
    path: '/heal',
    persona: 'AURA',
    personaDesc: '활력 회복 & 바디 웰니스 코치',
    vibeKeyword: '신체 활력',
  },
  {
    id: 'bluebird',
    name: 'BLUEBIRD',
    subtitle: '예술 정서',
    desc: '시적 문장과 바이노럴 힐링 사운드로 메마른 감성과 영혼을 맑게 정화하는 예술 치유처',
    icon: Bird,
    color: 'oklch(0.65 0.18 240)',
    path: '/bluebird',
    persona: 'BLUEBIRD',
    personaDesc: '소리 치유 & 시적 공감 큐레이터',
    vibeKeyword: '예술 정서',
  },
  {
    id: 'muse',
    name: 'MUSE',
    subtitle: '영감 창조',
    desc: '창작의 장애물을 걷어내고 독창적인 아이디어와 비전을 일깨우는 창의 스튜디오',
    icon: Music,
    color: 'oklch(0.50 0.15 260)',
    path: '/muse',
    persona: 'MUSE',
    personaDesc: '창작 스파크 & 영감 코칭 마스터',
    vibeKeyword: '영감 창조',
  },
  {
    id: 'epilogue',
    name: 'EPILOGUE',
    subtitle: '통합 결산',
    desc: '모든 채널의 여정과 기록을 한눈에 결산하고 내일의 새로운 시작을 준비하는 종합 에필로그',
    icon: Moon,
    color: 'oklch(0.65 0.25 310)',
    path: '/epilogue',
    persona: 'EPILOGUE',
    personaDesc: '하루의 발자취와 여정 결산 가이드',
    vibeKeyword: '통합 결산',
  },
];

const PROLOGUE_APPS = ['orange', 'trinity', 'heal', 'bluebird', 'muse', 'epilogue']
  .map((id) => APPS.find((app) => app.id === id)!);

type TimeEnergySlot = 'morning' | 'afternoon' | 'evening' | 'night';

type TimeEnergyAdvice = {
  slotLabel: string;
  energyPatternName: string;
  energyPatternDesc: string;
  energyAppId: string;
  energyAppName: string;
  matchReason: string;
  matchPercentage: number;
};

const TIME_ENERGY_PRESETS: Record<TimeEnergySlot, TimeEnergyAdvice> = {
  morning: {
    slotLabel: '아침',
    ...HUB_TIME_PRESETS.morning,
    energyAppId: 'trinity',
    energyAppName: 'TRINITY',
    matchPercentage: 92,
  },
  afternoon: {
    slotLabel: '오후',
    ...HUB_TIME_PRESETS.afternoon,
    energyAppId: 'muse',
    energyAppName: 'MUSE',
    matchPercentage: 90,
  },
  evening: {
    slotLabel: '저녁',
    ...HUB_TIME_PRESETS.evening,
    energyAppId: 'orange',
    energyAppName: 'ORANGE',
    matchPercentage: 88,
  },
  night: {
    slotLabel: '밤',
    ...HUB_TIME_PRESETS.night,
    energyAppId: 'bluebird',
    energyAppName: 'BLUEBIRD',
    matchPercentage: 94,
  },
};

function getTimeEnergySlot(hour: number): TimeEnergySlot {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

// Zero-overhead: AuroraBackground already provides cosmic stars and nebulas globally
function FloatingParticles(_props: { count?: number }) {
  return null;
}

type GlobalInsightData = {
  summary: string;
  author?: string;
  lucyGuide: string;
  museGuide: string;
  orangeGuide: string;
  bluebirdGuide: string;
  healGuide?: string;
  prologueGuide?: string;
  epilogueGuide?: string;
  themeColor?: string;
};

const DEFAULT_GLOBAL_INSIGHT: GlobalInsightData = {
  summary: "진정한 발견의 여정은 새로운 풍경을 찾는 것이 아니라, 새로운 눈을 가지는 데 있다.",
  author: "마르셀 프루스트",
  lucyGuide: "현재 우주 주파수 수신 중",
  museGuide: "영감 충전 중",
  orangeGuide: "비타민 채우는 중",
  bluebirdGuide: "날개 쉬는 중",
  healGuide: "에너지 회복 중",
  prologueGuide: "차원 연결 완료",
  epilogueGuide: "여정 기록 완료"
};

export default function HubHome() {
  const narrow = useNarrowPhone();
  const legacy = isLegacyMobile();
  const [location, navigate] = useLocation();
  const { firebaseUser, sharedState, logout, updateSharedState, setIsChatOpen, isChatOpen, openLucyChat, sendUnifiedMessage } = useApp();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [activeSection, setActiveSection] = useState<'universe' | 'ecpr' | 'todo'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/ecpr')) return 'ecpr';
    if (typeof window !== 'undefined' && (
      window.location.pathname.startsWith('/todo') || 
      window.location.pathname.startsWith('/mission') || 
      window.location.pathname.startsWith('/synergy') || 
      window.location.pathname.startsWith('/aegis')
    )) return 'todo';
    return 'universe';
  });

  useEffect(() => {
    if (location === '/ecpr') {
      setActiveSection('ecpr');
    } else if (location === '/todo' || location === '/mission' || location === '/synergy' || location === '/aegis') {
      setActiveSection('todo');
    } else if (location === '/' || location === '/universe') {
      setActiveSection('universe');
    }
  }, [location]);

  const { swipeHandlers: hubSwipeHandlers } = useSwipeableTabs<HubSwipeTab>({
    tabs: HUB_SWIPE_TABS,
    activeTab: activeSection,
    onTabChange: (newTab) => {
      setActiveSection(newTab);
      if (newTab === 'ecpr') {
        navigate('/ecpr');
      } else if (newTab === 'todo') {
        navigate('/todo');
      } else {
        navigate('/');
      }
    },
    enabled: true,
  });

  // 첫 로그인 시 프로필 미완성이라면 팝업 표시
  useEffect(() => {
    const hasProfile = Boolean(
      sharedState?.userProfile?.basic?.name ||
      sharedState?.userProfile?.basic?.nickname ||
      sharedState?.userProfile?.basic?.birthdate ||
      getPersistentUserProfile()?.basic?.name ||
      getPersistentUserProfile()?.basic?.nickname ||
      getPersistentUserProfile()?.basic?.birthdate
    );
    if (sharedState !== null && !hasProfile) {
      const dismissed = sessionStorage.getItem('profileModalDismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowProfileModal(true), 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [sharedState]);

  const [metricsTick, setMetricsTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setMetricsTick((t) => t + 1), getHubMetricsIntervalMs());
    return () => window.clearInterval(id);
  }, []);

  const biometrics = useMemo(
    () => computeRealtimeBiometrics(sharedState),
    [sharedState, metricsTick],
  );
  const { fatigue, stress, focus, sleepScore: sleep } = biometrics;
  const clarity = Math.max(0, Math.min(100, 100 - (stress * 0.4) + (sleep * 0.3)));

  const saju = useMemo(
    () => calculateDetailedSaju(sharedState?.userProfile || getPersistentUserProfile()),
    [sharedState?.userProfile]
  );

  const vibe = sharedState?.currentVibe;
  const sourceApp = sharedState?.sourceApp;
  const { isCurrentAppPlaying: isBinauralPlaying, toggle: toggleBinaural } = useBinauralBeat('hub');
  const [isSyncingGlobal, setIsSyncingGlobal] = useState(false);
  const [globalData, setGlobalData] = useState<GlobalInsightData>(() => {
    try {
      const cached = localStorage.getItem("trinity_cached_global_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!isBrokenGlobalSyncResult(parsed)) {
          return parsed;
        }
        localStorage.removeItem("trinity_cached_global_data");
        localStorage.removeItem("trinity_cached_global_data_time");
      }
    } catch (e) {
      console.error("Failed to load cached globalData:", e);
    }
    return DEFAULT_GLOBAL_INSIGHT;
  });

  // Sync Global Insights
  const syncGlobal = useCallback(async (force = false) => {
    if (isSyncingGlobal) return;

    // If not forced and we already have a quote in state/storage, check cache age (12 hours)
    if (!force) {
      const cached = localStorage.getItem("trinity_cached_global_data");
      const cachedTime = localStorage.getItem("trinity_cached_global_data_time");
      if (cached && cachedTime) {
        const age = Date.now() - parseInt(cachedTime, 10);
        const parsed = JSON.parse(cached);
        if (age < 12 * 60 * 60 * 1000 && !isBrokenGlobalSyncResult(parsed)) { // 12 hours cache
          console.log(`[HubHome] Skipping background sync. Cache is active (${Math.round(age / 60000)} mins old).`);
          setGlobalData(parsed);
          return;
        }
        if (isBrokenGlobalSyncResult(parsed)) {
          localStorage.removeItem("trinity_cached_global_data");
          localStorage.removeItem("trinity_cached_global_data_time");
        }
      }
    }
    
    // Check for cooldown if sync failed recently with quota or timeout error
    const lastSyncError = sessionStorage.getItem('lastSyncError');
    if (lastSyncError) {
      const { time, isQuota, isTimeout } = JSON.parse(lastSyncError);
      if ((isQuota || isTimeout) && Date.now() - time < 60000) { // 1 minute cooldown
        console.log(`[HubHome] Skipping global sync due to recent ${isQuota ? 'quota' : 'timeout'}.`);
        return;
      }
    }

    setIsSyncingGlobal(true);

    try {
      const rawNick = sharedState?.userProfile?.basic?.nickname?.trim() || sharedState?.userProfile?.basic?.name?.trim();
      const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
      
      // Aggregate activities from all apps
      const activities: string[] = [];
      if ((sharedState?.deepSyncHistory || []).length > 0) activities.push('트리니티 심층 분석');
      if ((sharedState?.museHistory || []).length > 0) activities.push('뮤즈 영감 기록');
      if ((sharedState?.orangeHistory || []).length > 0) activities.push('오렌지 아이디어 연금술');
      if ((sharedState?.bluebirdHistory || []).length > 0) activities.push('블루버드 소울 처방');
      if ((sharedState?.healHistory || []).length > 0) activities.push('아우라 세도나 방하착 정화');
      if ((sharedState?.epilogueHistory || []).length > 0) activities.push('에필로그 여정 성찰');
      if ((sharedState?.prologueHistory || []).length > 0) activities.push('프롤로그 다차원 통합');

      // Extract soul data from sharedState
      const compactSoul = (value: string | undefined, fallback: string) =>
        (value || fallback).slice(0, 180);
      const trinitySoul = compactSoul(sharedState?.trinityMemory, '우주 심층 분석 기록 없음');
      const museSoul = compactSoul(sharedState?.museMemory, '창작 영감 분석 기록 없음');
      const orangeSoul = compactSoul(sharedState?.orangeMemory, '아이디어 연금술 기록 없음');
      const bluebirdSoul = compactSoul(sharedState?.bluebirdMemory, '영혼 치유 분석 기록 없음');
      const healSoul = compactSoul(sharedState?.healMemory, '활력의 흐름 분석 기록 없음');
      const epilogueSoul = compactSoul(sharedState?.epilogueMemory, '최종 여정 성찰 기록 없음');
      const prologueSoul = compactSoul(sharedState?.prologueMemory, '프롤로그 다차원 통합 기록 없음');
      const soulData = `[운명(Trinity)]: ${trinitySoul}\n[창의(Muse)]: ${museSoul}\n[무의식(Orange)]: ${orangeSoul}\n[치유(Bluebird)]: ${bluebirdSoul}\n[활력(Aura)]: ${healSoul}\n[성찰(Epilogue)]: ${epilogueSoul}\n[통합(Prologue)]: ${prologueSoul}`;

      const systemPrompt = PERSONAS.globalSync(
        nickname,
        { fatigue, sleep, stress, focus },
        vibe || '평화로움',
        activities,
        soulData
      );

      const data = ensureGlobalSyncResult(await invokeLLMStructured({
        messages: [
          { role: 'system', content: systemPrompt }, 
          { role: 'user', content: '나의 현재 상태와 기록들에 가장 잘 어울리는 역사적인 실존 인물의 명언을 딱 1개만 알려줘. 임의로 응원하거나 조언하는 말은 절대 쓰지 마.' }
        ],
        schema: GlobalSyncSchema,
        maxRetries: 1
      }));

      setGlobalData(data as any);
      try {
        playAiResultNotification();
      } catch (_) {}
      localStorage.setItem("trinity_cached_global_data", JSON.stringify(data));
      localStorage.setItem("trinity_cached_global_data_time", String(Date.now()));
      sessionStorage.removeItem('lastSyncError');
      
      recordPrismFeature({
        app: 'hub',
        featureName: '글로벌 에코시스템 싱크',
        summary: `통합 요약: "${data.summary || '글로벌 싱크 완료'}", 생체 지표: 피로도 ${fatigue}%, 스트레스 ${stress}%, 수면 ${sleep}점, 집중도 ${focus}점`,
        details: data,
      });

      // Update memories in sharedState
      await updateSharedState({
        globalMemory: data.summary,
        trinityMemory: data.lucyGuide,
        museMemory: data.museGuide,
        orangeMemory: data.orangeGuide,
        bluebirdMemory: data.bluebirdGuide,
        healMemory: data.healGuide,
        prologueMemory: data.prologueGuide,
        epilogueMemory: data.epilogueGuide,
        ...(data.themeColor ? { themeColor: data.themeColor } : {})
      }, 'HUB');
    } catch (err: any) {
      const errMessage = err?.message || String(err);
      const isQuota = errMessage.includes('429') || errMessage.includes('RESOURCE_EXHAUSTED') || errMessage.toLowerCase().includes('quota');
      const isTimeout = errMessage.toLowerCase().includes('timeout') || errMessage.toLowerCase().includes('deadline');
      
      if (isQuota || isTimeout) {
        console.warn(`[HubHome] Global sync throttled due to ${isQuota ? 'quota' : 'timeout'}.`);
        sessionStorage.setItem('lastSyncError', JSON.stringify({ 
          time: Date.now(), 
          isQuota: isQuota,
          isTimeout: isTimeout
        }));
      } else {
        console.error('[HubHome] Global sync failed:', err);
      }

      // Fallback only if we have absolutely nothing
      const cached = localStorage.getItem("trinity_cached_global_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!isBrokenGlobalSyncResult(parsed)) {
          setGlobalData(parsed);
        } else {
          localStorage.removeItem("trinity_cached_global_data");
          localStorage.removeItem("trinity_cached_global_data_time");
          setGlobalData(DEFAULT_GLOBAL_INSIGHT);
        }
      } else {
        setGlobalData(DEFAULT_GLOBAL_INSIGHT);
      }
    } finally {
      setIsSyncingGlobal(false);
    }
  }, [isSyncingGlobal, sharedState, fatigue, sleep, stress, focus, vibe, updateSharedState]);

  // Avoid unsolicited background AI calls on home mount to prevent quota exhaustion and UI thread freezing
  // Global insight uses cached data or default presets instantly

  const hour = getKstHour();
  const timeSlot = getTimeEnergySlot(hour);
  const timeAdvice = TIME_ENERGY_PRESETS[timeSlot];

  // Determine which app is "active" based on sourceApp
  const activeApp = APPS.find(a => sharedState?.sourceApp === a.id.toUpperCase());

  // 시간대별 기본 추천 + 긴급 생체 지표 시 우선 보정
  let energyPatternName = timeAdvice.energyPatternName;
  let energyPatternDesc = timeAdvice.energyPatternDesc;
  let energyAppName = timeAdvice.energyAppName;
  let energyAppId = timeAdvice.energyAppId;
  let matchReason = `${timeAdvice.slotLabel} 리듬 · ${timeAdvice.matchReason}`;
  let matchPercentage = timeAdvice.matchPercentage;

  if (fatigue > 65 || sleep < 50) {
    energyPatternName = '회복이 필요한 시간';
    energyPatternDesc = '피곤할 땐 무리하지 말고 몸을 먼저 쉬게 해 보세요.';
    energyAppName = 'AURA';
    energyAppId = 'heal';
    matchReason = '피로 회복·가벼운 스트레칭에 좋아요';
    matchPercentage = Math.min(99, Math.round(75 + fatigue * 0.25));
  } else if (stress > 60) {
    energyPatternName = '마음 쉬어가기';
    energyPatternDesc = '스트레스가 높을 땐 잠깐 멈추고 호흡을 고르는 게 좋아요.';
    energyAppName = 'BLUEBIRD';
    energyAppId = 'bluebird';
    matchReason = '마음 안정·휴식에 좋은 시간';
    matchPercentage = Math.min(99, Math.round(70 + stress * 0.3));
  }
  
  const recommendedEnergyApp = APPS.find(a => a.id === energyAppId);
  const EnergyAppIcon = recommendedEnergyApp?.icon || Sparkles;
  const energyAppColor = recommendedEnergyApp?.color || 'oklch(0.85 0.15 90)';


  return (
    <div className="h-app-full w-full flex flex-col relative font-sans bg-transparent">
      {/* Header Info Bar - Always Fixed Outside Scroll Root */}
      <motion.div
        initial={{ y: -8, opacity: 0.88 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="prism-hub-header fixed top-safe-2 left-2 sm:left-4 md:top-safe-4 md:left-6 pointer-events-auto z-[110] transition-all duration-300 isolate"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div 
            className="relative w-11 h-11 rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] group backdrop-blur-md cursor-pointer transition-transform active:scale-95 shrink-0"
            onClick={() => openChannelIntro('hub')}
            title="프롤로그 허브 채널 소개 (클릭)"
          >
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} 
               className="absolute inset-0 rounded-full border border-dashed border-red-500/40 group-hover:border-red-400 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all" 
             />
             <div className="absolute inset-[3px] rounded-full border border-red-500/30 bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center transition-all">
               <Sun size={20} className="relative z-10 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] transition-transform group-hover:scale-110 duration-300 animate-pulse" strokeWidth={1.5} />
             </div>
          </div>
          <div className="cursor-pointer flex flex-col justify-center select-none" onClick={() => navigate('/')}>
            <h1>
              <LucKeyLogoText />
            </h1>
            <p className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-widest font-bold font-sans leading-none mt-0.5">
              PROLOGUE • INTEGRATED HUB
            </p>
          </div>
        </div>
      </motion.div>


      {/* Navigation Subnav Menu (Universe, eCPR & ToDo Sections) */}
      <motion.nav
        initial={{ y: -10, x: '-50%', opacity: 0.88 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="prism-xs-subnav fixed top-safe-nav md:top-safe-nav-md left-1/2 z-[100] flex items-center gap-1 p-1 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-[95vw] overflow-x-auto no-scrollbar md:max-w-fit md:overflow-visible transition-all duration-300"
      >
        {[
          { id: 'universe', icon: Compass, label: 'Universe' },
          { id: 'ecpr', icon: HeartPulse, label: 'eCPR' },
          { id: 'todo', icon: ListTodo, label: 'ToDo' },
        ].map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id as 'universe' | 'ecpr' | 'todo');
                if (item.id === 'ecpr') {
                  navigate('/ecpr');
                } else if (item.id === 'todo') {
                  navigate('/todo');
                } else {
                  navigate('/');
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold font-sans transition-all duration-300 whitespace-nowrap cursor-pointer ${
                isActive
                  ? item.id === 'ecpr'
                    ? 'bg-gradient-to-r from-red-500/40 via-rose-500/30 to-amber-500/40 text-white border border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] scale-[1.02]'
                    : item.id === 'todo'
                    ? 'bg-gradient-to-r from-indigo-600/50 via-purple-600/40 to-amber-600/50 text-white border border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-[1.02]'
                    : 'bg-gradient-to-r from-red-500/40 via-orange-500/30 to-amber-500/40 text-white border border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] scale-[1.02]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={14} className={isActive ? (item.id === 'ecpr' ? 'text-red-300 animate-pulse' : item.id === 'todo' ? 'text-indigo-300 animate-pulse' : 'text-amber-300 animate-pulse') : 'text-white/40'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </motion.nav>

      <div data-app-scroll-root {...hubSwipeHandlers} className="flex-1 w-full overflow-x-hidden overflow-y-auto flex flex-col no-scrollbar z-10 pb-28 sm:pb-32">
        {!legacy && <FloatingParticles count={narrow ? 4 : 20} />}

        {activeSection === 'ecpr' ? (
          <PrologueECPRView />
        ) : activeSection === 'todo' ? (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-home md:pt-home-md">
            <ErrorBoundary>
              <PrologueTodoSection />
            </ErrorBoundary>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col relative text-white font-sans">
            
            {/* 프로필 설정 유도 모달 */}
            <AnimatePresence>
              {showProfileModal && (
                <motion.div
                  key="profile-modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                >
                  <motion.div
                    key="profile-modal-content"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="rounded-3xl p-6 max-w-sm w-full"
                    style={{ background: 'oklch(0.12 0.015 270)', border: '1px solid oklch(0.75 0.12 50 / 0.3)' }}
                  >
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">🧪</div>
                      <h2 className="font-display text-xl mb-2" style={{ color: 'oklch(0.75 0.12 50)' }}>Welcome, Traveler!</h2>
                      <p className="text-sm text-white/50 leading-relaxed">
                        프로필을 설정하면 모든 채널의 AI가 연결되어<br/>당신만을 위한 맞춤형 가이드를 제공합니다.
                      </p>
                    </div>
                    <div className="space-y-2 mb-6">
                      {[
                        { icon: '🌿', text: 'ORANGE: 마음 치유와 성찰 일기 맞춤 지원' },
                        { icon: '✨', text: 'TRINITY: 사주·타로·별자리 운명 분석 맞춤 지원' },
                        { icon: '⚡', text: 'AURA: 신체 활력과 호흡·스트레칭 맞춤 코칭' },
                        { icon: '🐦', text: 'BLUEBIRD: 예술 사운드와 시적 감성 치유 맞춤 처방' },
                        { icon: '🎵', text: 'MUSE: 창작 영감과 아이디어 브레인스토밍 지원' },
                        { icon: '🌙', text: 'EPILOGUE: 일상의 발자취와 종합 여정 결산 기록' },
                      ].map(({ icon, text }) => (
                        <div key={text} className="flex items-center gap-3 text-xs text-white/40 font-sans">
                          <span>{icon}</span>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          sessionStorage.setItem('profileModalDismissed', '1');
                          setShowProfileModal(false);
                        }}
                        className="flex-1 py-3 rounded-xl text-sm text-white/30 hover:text-white/50 transition-colors"
                        style={{ border: '1px solid oklch(0.22 0.01 270)' }}
                      >
                        나중에
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileModal(false);
                          navigate('/epilogue');
                        }}
                        className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{ background: 'oklch(0.75 0.12 50 / 0.15)', color: 'oklch(0.75 0.12 50)', border: '1px solid oklch(0.75 0.12 50 / 0.3)' }}
                      >
                        Set Up Profile 🧪
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 w-full px-3 sm:px-5 prism-xs-pad pt-home md:pt-home-md flex-1 flex flex-col max-w-5xl mx-auto">

              {/* 오늘의 루시 페르소나 메시지 (Today's Lucy Persona Message) */}
              <TodayLucyPersonaCard
                saju={saju}
                biometrics={{ fatigue, stress, focus, sleep }}
                globalInsight={globalData?.summary}
              />

              {/* Global Insights Section (Universe Insight Diversified) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <UniverseInsightCard 
                  saju={saju} 
                  customInsight={globalData?.summary ? { summary: globalData.summary, author: globalData.author } : undefined}
                  onInsightChange={(newInsight) => {
                    // Keep sharedState memory updated if needed
                    updateSharedState({
                      globalMemory: newInsight.quote,
                    }, 'HUB');
                  }}
                />
              </motion.div>
              
              {/* User-Defined Goals Progress Ring Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <GoalProgressRingDashboard />
              </motion.div>

              {/* 에너지 패턴 추천앱 복구 구성 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="glass prism-xs-hub-card p-6 md:p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div 
                    className="hidden md:block absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110"
                    style={{ background: energyAppColor }} 
                  />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-6 md:gap-8">
                    {/* 왼쪽 영역: 생체 상태 */}
                    <div className="flex flex-col justify-between md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] font-mono block mb-1">REAL-TIME BIOMETRICS</span>
                        <h3 className="text-lg font-display font-bold text-white tracking-tight">현재 실시간 에너지 패턴</h3>
                        {saju && (
                          <p className="text-[11px] text-indigo-300/90 font-sans font-semibold mt-1 flex items-center gap-1">
                            <Sparkles size={10} className="text-amber-400" />
                            {saju.dayMaster.hanja}({saju.dayMaster.korean}) 본원 체질 · {saju.elements.dominant.element}기운 우세
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-3.5 mt-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-sans">
                            <span className="text-white/40 flex items-center gap-1.5 font-medium"><Activity size={12} className="text-emerald-400" /> 피로도 (Fatigue)</span>
                            <span className="text-emerald-400 font-bold font-mono">{Math.round(fatigue)}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, Math.max(5, fatigue))}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-sans">
                            <span className="text-white/40 flex items-center gap-1.5 font-medium"><Brain size={12} className="text-red-400" /> 스트레스지표 (Stress)</span>
                            <span className="text-red-400 font-bold font-mono">{Math.round(stress)}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min(100, Math.max(5, stress))}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-sans">
                            <span className="text-white/40 flex items-center gap-1.5 font-medium"><Zap size={12} className="text-amber-400" /> 몰입 지수 (Focus)</span>
                            <span className="text-amber-400 font-bold font-mono">{Math.round(focus)}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, Math.max(5, focus))}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽 영역: 에너지 동조 추천 앱 */}
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono border uppercase tracking-wider animate-pulse" style={{ color: energyAppColor, borderColor: `${energyAppColor}40`, background: `${energyAppColor}10` }}>
                            SYNC RATE {matchPercentage}%
                          </div>
                          <span className="text-[10px] text-white/45 font-bold uppercase tracking-widest font-mono">ENERGY SYNC ADVICE · {timeAdvice.slotLabel}</span>
                        </div>

                        <h4 className="text-xl font-bold text-white tracking-tight break-keep" style={{ filter: `drop-shadow(0 0 10px ${energyAppColor}10)` }}>
                          {energyPatternName}
                        </h4>
                        
                        <p className="text-xs text-white/60 leading-relaxed break-keep font-medium">
                          {energyPatternDesc}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 border border-white/10" style={{ background: `${energyAppColor}10` }}>
                            <EnergyAppIcon size={18} style={{ color: energyAppColor, filter: `drop-shadow(0 0 8px ${energyAppColor})` }} />
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-white uppercase tracking-wider">{energyAppName} App</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-mono leading-tight">{matchReason}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(recommendedEnergyApp?.path || '/')}
                          className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0 border border-white/10 hover:border-white/25 hover:bg-white/5 shadow-xl font-sans"
                        >
                          <span>에너지 채널 즉시 접속하기</span>
                          <ChevronRight size={14} className="opacity-60" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* DApp Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pb-4 md:pb-6 w-full">
                {PROLOGUE_APPS.map((app, i) => {
                  const Icon = app.icon;
                  const isActive = activeApp?.id === app.id;
                  
                  return (
                    <motion.button
                      key={app.id}
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => {
                        navigate(app.path);
                        window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: app.path } }));
                      }}
                      className={`prism-xs-app-card group relative text-left rounded-[32px] p-6 md:p-8 overflow-hidden transition-all duration-500 border ${
                        isActive 
                          ? 'bg-white/10 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-[1.02]' 
                          : 'glass border-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundImage: `radial-gradient(circle at center, ${app.color} 0%, transparent 70%)` }} />
                      
                      <div className="relative w-12 h-12 rounded-[20px] flex items-center justify-center mb-6 overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md">
                        <div className="absolute inset-0 bg-white/5" />
                        <Icon 
                          size={24} 
                          className="relative z-10 group-hover:scale-110 transition-transform duration-500 group-hover:animate-pulse" 
                          style={{ color: app.color, filter: `drop-shadow(0 0 12px ${app.color})` }} 
                          strokeWidth={2}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold tracking-wider text-white group-hover:translate-x-1 transition-transform duration-500" style={{ color: app.color }}>{app.name}</h3>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] pt-1 font-sans">{app.subtitle}</span>
                      </div>
                      <p className="text-sm leading-relaxed mb-8 max-w-[85%] font-sans font-medium text-white/80">
                        {app.desc}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: app.color }} />
                          <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] font-sans">
                            {app.persona}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors group-hover:translate-x-1" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      


    </div>
  );
}
