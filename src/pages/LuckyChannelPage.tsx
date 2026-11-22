import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Sparkles, Music, TreeDeciduous, Bird, Activity, Moon, Sun, ChevronRight, Compass } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { openChannelIntro } from '@/components/common/ChannelIntroModal';
import { RealtimeEnergyPatternCard } from '@/components/hub/RealtimeEnergyPatternCard';

const CHANNELS = [
  {
    id: 'prologue',
    name: 'PROLOGUE',
    subtitle: '시작 방향',
    desc: '삶의 시작과 오늘의 방향을 잡고, 목적에 맞게 하루의 여정을 여는 프롤로그 공간',
    icon: Sun,
    color: '#ef4444',
    path: '/prologue',
    persona: 'PROLOGUE',
    personaDesc: '하루의 시작·방향·목적을 여는 가이드',
    vibeKeyword: '시작 방향',
  },
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
    desc: '시적 문장과 잔잔한 배경음악으로 감성을 돌보고 영감을 발견하는 예술 공간',
    icon: Bird,
    color: 'oklch(0.65 0.18 240)',
    path: '/bluebird',
    persona: 'BLUEBIRD',
    personaDesc: '음악과 시적 공감 큐레이터',
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

function recommendedChannelId(hour: number) {
  if (hour >= 6 && hour < 12) return 'trinity';
  if (hour >= 12 && hour < 18) return 'muse';
  if (hour >= 18 && hour < 22) return 'orange';
  return 'bluebird';
}

export default function LuckyChannelPage() {
  const [, navigate] = useLocation();
  const { sharedState } = useApp();
  const recommendedId = useMemo(() => recommendedChannelId(new Date().getHours()), []);
  const activeId = String(sharedState?.sourceApp || '').toLowerCase();

  return (
    <div className="relative w-full h-full min-h-0 flex flex-col text-white">
      <div data-app-scroll-root className="min-h-0 flex-1 w-full overflow-y-auto no-scrollbar touch-pan-y overscroll-x-none pt-14 pb-28">
        <div className="px-3 sm:px-6 prism-xs-pad w-full max-w-6xl mx-auto space-y-3.5 pb-6">
          <RealtimeEnergyPatternCard />
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pr-16">
            <div>
              <div className="flex items-center gap-2">
                <Compass size={15} className="text-cyan-400" />
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  유니버스 7대 차원 DApp 채널
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                  7 CHANNELS
                </span>
              </div>
              <p className="text-[11px] text-white/55 mt-0.5">
                시작 방향·마음 치유·운명 분석·신체 활력·예술 사운드·창작 영감·통합 결산 채널로 바로 이동합니다
              </p>
            </div>
            <button
              type="button"
              onClick={() => openChannelIntro('hub')}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/75 hover:text-white bg-white/5 hover:bg-white/15 border border-white/15 transition-all cursor-pointer shrink-0"
            >
              전체 채널 안내
            </button>
          </div>

          <div className="duo-channel-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-5 w-full items-stretch">
            {CHANNELS.map((app, i) => {
              const Icon = app.icon;
              const isActive = activeId === app.id;
              const isRecommended = recommendedId === app.id;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    navigate(app.path);
                    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: app.path } }));
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(app.path);
                    }
                  }}
                  className={`prism-xs-app-card group relative text-left rounded-[26px] p-5 sm:p-6 overflow-hidden transition-all duration-300 border flex flex-col justify-between h-full cursor-pointer ${
                    isActive
                      ? 'glass border-white/35 shadow-[0_0_28px_rgba(255,255,255,0.12)] scale-[1.01]'
                      : 'glass border-white/12 hover:border-white/30 hover:-translate-y-0.5 shadow-xl'
                  }`}
                >
                  <div
                    className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-[65px] opacity-15 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                    style={{ background: app.color }}
                  />
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
                      <div
                        className="relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden border border-white/15 shadow-md shrink-0"
                        style={{ background: `${app.color}16` }}
                      >
                        <Icon
                          size={22}
                          className="relative z-10 group-hover:scale-110 transition-transform duration-300"
                          style={{ color: app.color, filter: `drop-shadow(0 0 10px ${app.color})` }}
                          strokeWidth={2.1}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isRecommended && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
                            style={{
                              color: app.color,
                              borderColor: `${app.color}55`,
                              background: `${app.color}18`,
                            }}
                          >
                            오늘의 추천
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/75 bg-white/[0.07] border border-white/10 tracking-wide">
                          {app.subtitle}
                        </span>
                        <button
                          type="button"
                          title={`${app.name} 채널 소개`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const introId = app.id === 'prologue' ? 'hub' : app.id;
                            openChannelIntro(introId, app.path);
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                        >
                          ?
                        </button>
                      </div>
                    </div>
                    <div className="relative z-10 mb-2">
                      <div className="flex items-baseline gap-2">
                        <h2
                          className="text-xl font-extrabold tracking-wide transition-transform duration-300 group-hover:translate-x-0.5"
                          style={{ color: app.color }}
                        >
                          {app.name}
                        </h2>
                        <span className="text-[11px] font-semibold text-white/55 truncate">
                          {app.personaDesc}
                        </span>
                      </div>
                    </div>
                    <p className="relative z-10 text-[13px] leading-relaxed text-white/80 font-sans font-medium break-keep">
                      {app.desc}
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-5 pt-3.5 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: app.color }} />
                      <span className="text-[11px] font-bold text-white/60 tracking-wide font-sans">
                        {app.vibeKeyword} 스페이스
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-white/75 group-hover:text-white transition-colors">
                      <span>채널 입장</span>
                      <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
