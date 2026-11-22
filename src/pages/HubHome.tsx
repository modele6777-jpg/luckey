import { ScreenPortal } from '@/components/layout/ScreenPortal';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { ChevronDown, ChevronUp, Play, Pause, Hexagon, Triangle, X, Compass, HeartPulse, Shield, ListTodo } from 'lucide-react';
import { PrologueECPRView } from '@/components/prologue/PrologueECPRView';
import { PrologueTodoSection } from '@/components/prologue/PrologueTodoSection';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TTSButton } from '@/components/TTSButton';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLMStructured, PERSONAS, GlobalSyncSchema, ensureGlobalSyncResult, isBrokenGlobalSyncResult } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';

import { useNarrowPhone } from '@/hooks/useNarrowPhone';
import { getHubMetricsIntervalMs, isLegacyMobile } from '@/lib/perfMode';
import { computeRealtimeBiometrics } from '@/lib/biometrics';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import { UniverseInsightCard } from '@/components/UniverseInsightCard';
import { type UniverseInsightItem } from '@/data/universeInsights';
import { useBackgroundMood } from '@/hooks/useBackgroundMood';
import { LucKeyLogoText } from '@/components/LucKeyLogoText';
import { GoalProgressRingDashboard } from '@/components/goals/GoalProgressRingDashboard';
import { TodayLucyPersonaCard } from '@/components/TodayLucyPersonaCard';
import { useSwipeableTabs } from '@/hooks/useSwipeableTabs';
import { DailyCosmicRoutineCard } from '@/components/hub/DailyCosmicRoutineCard';

const HUB_SWIPE_TABS = ['universe', 'ecpr', 'todo'] as const;
type HubSwipeTab = typeof HUB_SWIPE_TABS[number];


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
  lucyGuide: "오늘의 메시지를 준비하고 있어요.",
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
    if (typeof window !== 'undefined') {
      const urlTab = new URLSearchParams(window.location.search).get('tab');
      if (urlTab === 'ecpr' || urlTab === 'todo' || urlTab === 'universe') return urlTab;
      const p = window.location.pathname.toLowerCase();
      if (p.startsWith('/ecpr')) return 'ecpr';
      if (
        p.startsWith('/todo') || 
        p.startsWith('/mission') || 
        p.startsWith('/synergy') || 
        p.startsWith('/aegis')
      ) return 'todo';
    }
    return 'universe';
  });

  useEffect(() => {
    const clean = location ? location.split('?')[0].toLowerCase() : '';
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const searchTab = new URLSearchParams(search).get('tab');

    if (searchTab === 'ecpr' || clean === '/ecpr') {
      setActiveSection('ecpr');
    } else if (
      searchTab === 'todo' ||
      clean === '/todo' || 
      clean === '/mission' || 
      clean === '/synergy' || 
      clean === '/aegis'
    ) {
      setActiveSection('todo');
    } else if (
      searchTab === 'universe' ||
      clean === '/prologue' || 
      clean === '/universe' || 
      clean === '/'
    ) {
      setActiveSection('universe');
    }
  }, [location]);

  useEffect(() => {
    const applyTargetTab = (tab: string | null | undefined) => {
      if (!tab) return;
      if (tab === 'universe' || tab === 'ecpr' || tab === 'todo') {
        setActiveSection(tab);
        try {
          sessionStorage.setItem('prism_target_tab', tab);
        } catch (_) {}
      }
    };

    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: string }>;
      applyTargetTab(customEvent.detail?.tab);
    };

    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent<{ path?: string; tab?: string }>;
      const path = customEvent.detail?.path || '';
      const tab = customEvent.detail?.tab;
      if (tab === 'universe' || tab === 'ecpr' || tab === 'todo') {
        applyTargetTab(tab);
      } else if (path === '/ecpr') {
        setActiveSection('ecpr');
      } else if (path === '/todo' || path === '/mission' || path === '/synergy' || path === '/aegis') {
        setActiveSection('todo');
      } else if (path === '/prologue' || path === '/universe') {
        setActiveSection('universe');
      }
    };

    window.addEventListener('prism-tab-change', handleTabChange);
    window.addEventListener('nav-click-active', handleNavClick);
    return () => {
      window.removeEventListener('prism-tab-change', handleTabChange);
      window.removeEventListener('nav-click-active', handleNavClick);
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('prism_target_tab', activeSection);
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: activeSection } }));
  }, [activeSection]);

  // 🚀 빅뱅 버튼 좌우 룬 점 탭 전환 및 앱 내부 탭 동기화
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
        navigate('/prologue');
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
  const { isCurrentAppPlaying: isBackgroundMoodPlaying, toggle: toggleBackgroundMood } = useBackgroundMood('hub');
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

  return (
    <div className="universe-layout h-app-full w-full min-w-0 flex flex-col relative font-sans bg-transparent">
      {/* Header Info Bar - Always Fixed Outside Scroll Root */}
      {/* Top Left Branding */}
      <motion.div
        data-page-brand="true"
        initial={{ y: -8, opacity: 0.88 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="duo-page-brand relative w-full shrink-0 px-4 pt-4 pointer-events-none z-40 transition-opacity duration-300"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 pl-1 sm:pl-2">
          <div
            data-brand-logo="true"
            data-no-scroll-top="true"
            className="pointer-events-auto cursor-pointer flex flex-col justify-center select-none"
            onClick={() => {
              setActiveSection('universe');
              try {
                sessionStorage.setItem('prism_target_tab', 'universe');
              } catch (_) {}
              if (typeof window !== 'undefined') {
                (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
              }
              navigate('/prologue?tab=universe');
              try {
                window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: 'universe' } }));
              } catch (_) {}
            }}
            title="프롤로그 유니버스 탭으로 이동"
          >
            <h1>
              <LucKeyLogoText />
            </h1>
          </div>
        </div>
      </motion.div>

      {/* 상단 로고와 메뉴 사이 중앙 영문 앱 제목 */}
      <div
        data-page-title="true"
        className="duo-page-title pointer-events-none select-none z-40 flex items-center justify-center transition-opacity duration-300"
      >
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.32em] text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          PROLOGUE
        </span>
      </div>


      {/* Navigation Subnav Menu (Universe, eCPR & ToDo Sections) */}
      <motion.nav
        initial={{ y: -10, opacity: 0.88 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="prism-xs-subnav duo-page-nav relative self-center shrink-0 mx-auto z-40 flex items-center gap-1 p-1 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-[calc(100%-2rem)] overflow-x-auto no-scrollbar md:max-w-fit transition-opacity duration-300"
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
              aria-pressed={isActive}
              aria-label={item.label}
              title={item.label}
              onClick={() => {
                setActiveSection(item.id as 'universe' | 'ecpr' | 'todo');
                if (item.id === 'ecpr') {
                  navigate('/ecpr');
                } else if (item.id === 'todo') {
                  navigate('/todo');
                } else {
                  navigate('/prologue');
                }
              }}
              className={`prism-subnav-btn flex shrink-0 whitespace-nowrap items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? item.id === 'ecpr'
                    ? 'bg-gradient-to-r from-red-500/80 via-rose-500/70 to-amber-500/70 text-white shadow-lg shadow-red-500/20 border border-red-500/30'
                    : item.id === 'todo'
                    ? 'bg-gradient-to-r from-indigo-600/80 via-purple-600/70 to-amber-500/70 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/30'
                    : 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/20 border border-yellow-500/30'
                  : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100 keep-white' : 'opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.nav>

      <div data-app-scroll-root {...hubSwipeHandlers} className="min-h-0 flex-1 w-full pt-4 pb-24 flex flex-col items-center relative z-10 overflow-y-auto no-scrollbar scroll-smooth text-slate-900 dark:text-white touch-pan-y overscroll-x-none">
        {!legacy && <FloatingParticles count={narrow ? 4 : 14} />}

        {activeSection === 'ecpr' ? (
          <PrologueECPRView />
        ) : activeSection === 'todo' ? (
          <div className="prism-page-content w-full mx-auto px-3 sm:px-6 prism-xs-pad flex-1 flex flex-col items-center min-w-0">
            <ErrorBoundary>
              <PrologueTodoSection />
            </ErrorBoundary>
          </div>
        ) : (
          <div className="prism-page-content universe-content relative z-10 w-full min-w-0 px-3 sm:px-6 prism-xs-pad flex-1 flex flex-col mx-auto space-y-6 md:space-y-7">
            
            {/* 프로필 설정 유도 모달 */}
            <AnimatePresence>
              {showProfileModal && (
                <ScreenPortal><motion.div
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
                </motion.div></ScreenPortal>
              )}
            </AnimatePresence>

            <div className="prism-page-content universe-content relative z-10 w-full min-w-0 px-3 sm:px-6 prism-xs-pad flex-1 flex flex-col mx-auto space-y-6 md:space-y-7">

              {/* ✨ 데일리 코스믹 모닝 루틴 허브 — 앱을 켜자마자 원클릭으로 하루를 여는 3분 루틴 */}
              <ErrorBoundary>
                <DailyCosmicRoutineCard />
              </ErrorBoundary>

              {/* Dual-Pane Top Split: Left Pane (Today's Lucy Persona) & Right Pane (Universe Insight) */}
              <div className="duo-split-grid items-stretch">
                {/* 오늘의 루시 페르소나 메시지 (Today's Lucy Persona Message) */}
                <div className="flex flex-col h-full">
                  <TodayLucyPersonaCard
                    saju={saju}
                    biometrics={{ fatigue, stress, focus, sleep }}
                    globalInsight={globalData?.summary}
                  />
                </div>

                {/* Global Insights Section (Universe Insight Diversified) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col h-full"
                >
                  <UniverseInsightCard 
                    saju={saju} 
                    customInsight={globalData?.summary ? { summary: globalData.summary, author: globalData.author } : undefined}
                    onInsightChange={(newInsight) => {
                      updateSharedState({
                        globalMemory: newInsight.quote,
                      }, 'HUB');
                    }}
                  />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className="flex flex-col"
              >
                <GoalProgressRingDashboard />
              </motion.div>

            </div>
          </div>
        )}
      </div>

      


    </div>
  );
}
