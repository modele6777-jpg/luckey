import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Compass,
  ArrowRight,
  Flame,
  Sun,
  Palette,
  BookOpen,
  Waves,
  Twitter,
  Feather,
  Key,
} from 'lucide-react';
import { TTSButton } from '@/components/TTSButton';
import { stopTTS } from '@/utils/tts';

export interface ChannelDetail {
  id: string;
  name: string;
  subName: string;
  badge: string;
  emblemEmoji: string;
  runeSymbol: string;
  runeName: string;
  runeMeaning: string;
  themeColor: string;
  accentGlow: string;
  summary: string;
  description: string;
  highlights: { title: string; desc: string; icon: string }[];
  speechText: string;
}

export const PRISM_CHANNELS_DETAILS: Record<string, ChannelDetail> = {
  hub: {
    id: 'hub',
    name: '프롤로그 허브 (Prologue Hub)',
    subName: '프리즘 우주의 중심 & ECPR 응급 소생',
    badge: '우주 시초 허브',
    emblemEmoji: '☀️',
    runeSymbol: 'ᚠ',
    runeName: 'Fehu',
    runeMeaning: '새로운 시작과 순환하는 에너지',
    themeColor: '#ef4444',
    accentGlow: 'rgba(239, 68, 68, 0.4)',
    summary: '모든 차원의 영감과 기능이 수렴하는 우주의 시초이자 생명력을 깨우는 중심 허브입니다.',
    description:
      '일상의 잡념과 급성 스트레스를 다스리는 ECPR 응급 심리 소생술, 오늘의 소원과 확언, 그리고 프리즘 7대 전문 채널로 통하는 차원 웜홀을 제공합니다.',
    highlights: [
      {
        icon: '🫁',
        title: 'ECPR 응급 심리 소생술',
        desc: '급작스러운 불안과 공황을 멈추는 4-7-8 진정 호흡, 5-4-3-2-1 그라운딩, 8대 EFT 타점 태핑',
      },
      {
        icon: '✨',
        title: '오늘의 시크릿 & 확언',
        desc: '나의 고민과 소원에 정확히 일치하는 인과율 완성형 확언과 최우선 맞춤 기법 처방',
      },
      {
        icon: '🌌',
        title: '빅뱅 옴니워프 내비게이션',
        desc: '어느 화면에서든 7대 프리즘 전문 채널로 지체 없이 순식간에 도약하는 차원 관문',
      },
    ],
    speechText:
      '프롤로그 허브는 프리즘 우주의 중심이자 생명력을 깨우는 시초입니다. 급성 불안을 가라앉히는 4-7-8 호흡과 EFT 소생술, 나만의 맞춤 소원 확언, 그리고 모든 전문 채널로의 도약을 지원합니다.',
  },
  orange: {
    id: 'orange',
    name: '오렌지 성찰 & 별에게 소원빌기',
    subName: '감정 성찰과 별빛 소망의 현실화',
    badge: '감정 성찰 & 소원 채널',
    emblemEmoji: '🍊',
    runeSymbol: 'ᛋ',
    runeName: 'Sowilo',
    runeMeaning: '태양과 내면의 불꽃',
    themeColor: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.4)',
    summary: '복잡한 감정을 차분히 정돈하고, 밤하늘 별에게 마음 깊은 소망을 띄워 현실로 직조하는 비밀의 숲입니다.',
    description:
      '불안과 결핍의 에너지를 풍요와 감사의 확언으로 승화시키는 별빛 소원 시크릿 키트와 100일 감정 필사 트레이닝을 지원합니다.',
    highlights: [
      {
        icon: '⭐',
        title: '별에게 소원빌기 & 시크릿 키트',
        desc: '인과 맥락이 100% 일치하는 완성형 확언과 감사의 에너지를 시각화하는 프리미엄 별빛 소원 처방',
      },
      {
        icon: '✍️',
        title: '100일 감정 필사 & 마인드셋',
        desc: '하루 한 문장씩 손으로 새기며 내면의 근력을 기르는 체계적인 감정 정화 필사 연습실',
      },
      {
        icon: '🏷️',
        title: '감정 라벨링 & 관찰자 분리',
        desc: '밀려오는 감정에 휩쓸리지 않고 객관적 관찰자의 눈으로 마음을 살피는 자기자비 성찰',
      },
    ],
    speechText:
      '오렌지 성찰과 별에게 소원빌기 채널은 감정을 정리하고 내면의 소망을 완성형 확언으로 현실화하는 비밀의 숲입니다. 별빛 소원과 100일 필사를 통해 마음에 풍요로운 온기를 채워보세요.',
  },
  trinity: {
    id: 'trinity',
    name: '트리니티 오라클 (Trinity Oracle)',
    subName: '사주·점성술·타로 삼위일체 운명 나침반',
    badge: '운명 통찰 & 결단 채널',
    emblemEmoji: '🔮',
    runeSymbol: 'ᛈ',
    runeName: 'Pertho',
    runeMeaning: '운명의 비의와 무의식의 상징',
    themeColor: '#c084fc',
    accentGlow: 'rgba(192, 132, 252, 0.4)',
    summary: '동서양의 지혜인 사주 오행과 타로 카드를 결합하여 무의식의 지혜를 읽고 삶의 결단을 밝혀줍니다.',
    description:
      '맹목적인 예언을 지양하고, 사용자가 주체적인 지혜로 현재의 에너지를 조망하고 올바른 방향을 선택하도록 이끕니다.',
    highlights: [
      {
        icon: '🃏',
        title: '트리니티 3카드 타로 스프레드',
        desc: '[현재 에너지], [방향과 결단], [실천 처방]으로 구성된 직관적이고 품격 있는 타로 리딩',
      },
      {
        icon: '🧭',
        title: '트리니티 마스터 직관 결단',
        desc: '단순한 맞고 틀림을 넘어 내면의 주체적인 용기와 행동 방향성을 선언하는 마스터의 통찰',
      },
      {
        icon: '📜',
        title: '1:1 영혼 가이드 & 오라클 요약',
        desc: '사주 명식과 질문 문맥이 유려하게 융합된 개인 맞춤형 운명 지침서와 3줄 핵심 요약',
      },
    ],
    speechText:
      '트리니티 오라클은 사주와 타로의 동서양 지혜를 융합한 운명 나침반입니다. 맹목적인 믿음을 넘어 현재의 에너지를 직시하고 지혜로운 결단과 실천 방향을 찾아가실 수 있습니다.',
  },
  heal: {
    id: 'heal',
    name: '아우라 신체 웰니스 (Aura Wellness)',
    subName: '생체 에너지 조율 & 호오포노포노 정화',
    badge: '심신 치유 & 정화 채널',
    emblemEmoji: '🌊',
    runeSymbol: 'ᛉ',
    runeName: 'Algiz',
    runeMeaning: '신성한 보호와 에너지 정화',
    themeColor: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    summary: '긴장으로 굳어진 몸의 감각을 깨우고, 고대 하와이 치유법 호오포노포노로 세포 단위의 에너지를 정화합니다.',
    description:
      '신체 감각 바디스캔, 호흡과 함께하는 스트레칭, 그리고 잠재의식의 기억을 지우는 4마디 정화 만트라를 제공합니다.',
    highlights: [
      {
        icon: '💧',
        title: '호오포노포노 4마디 정화 만트라',
        desc: '미안합니다, 용서하세요, 감사합니다, 사랑합니다를 통한 내면 기억과 부정적 감정의 소멸',
      },
      {
        icon: '🧘',
        title: '신체 감각 바디스캔 & 이완',
        desc: '머리끝부터 발끝까지 억압된 긴장을 하나씩 알아차리고 호흡으로 풀어내는 소매틱 루틴',
      },
      {
        icon: '🌿',
        title: '생체 에너지 리듬 조율',
        desc: '교감신경의 과각성을 가라앉히고 부교감신경의 자연 치유력을 극대화하는 웰니스 케어',
      },
    ],
    speechText:
      '아우라 신체 웰니스는 굳어진 신체 감각을 이완하고 호오포노포노 만트라로 세포 단위의 피로와 감정을 정화하는 채널입니다. 호흡과 함께 몸과 마음의 조화를 되찾아보세요.',
  },
  bluebird: {
    id: 'bluebird',
    name: '파랑새의 성소 (Bluebird Sanctuary)',
    subName: '영혼의 상처 치유 & 일상의 행복 온기',
    badge: '따뜻한 위로 & 감사 채널',
    emblemEmoji: '🐦',
    runeSymbol: 'ᛒ',
    runeName: 'Berkana',
    runeMeaning: '치유의 탄생과 감사의 온기',
    themeColor: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.4)',
    summary: '지친 마음에 일상의 다정한 행복을 되찾아주고, 따뜻한 위로와 감사의 온기를 채우는 안식처입니다.',
    description:
      '내면 아이의 상처를 어루만지는 위로의 편지, 오감으로 느끼는 감사 일기, 일상의 소소한 기쁨을 발견하는 연습실을 제공합니다.',
    highlights: [
      {
        icon: '💌',
        title: '파랑새의 위로 편지',
        desc: '세상의 평가와 잣대에서 벗어나 온전한 나 자신을 지지해주는 다정한 영혼의 편지',
      },
      {
        icon: '🕊️',
        title: '오감 감사 일기 & 행복 리추얼',
        desc: '매일 3가지 사소한 기쁨을 기록하여 뇌의 행복 호르몬을 자연스럽게 촉진하는 감사 루틴',
      },
      {
        icon: '🧸',
        title: '내면 아이 온기 포옹',
        desc: '외롭거나 상처받았던 어린 시절의 나를 따스하게 위로하고 심리적 안전감을 회복하는 공간',
      },
    ],
    speechText:
      '파랑새의 성소는 지친 영혼에 따뜻한 위로와 감사의 온기를 전하는 안식처입니다. 파랑새의 위로 편지와 감사 일기를 통해 일상 속에 숨겨진 온전한 행복을 만나보세요.',
  },
  muse: {
    id: 'muse',
    name: '뮤즈 예술처방 (Muse Art Therapy)',
    subName: '명화·명시·명곡 삼위일체 예술 치유',
    badge: '영혼의 예술 큐레이션',
    emblemEmoji: '🎨',
    runeSymbol: 'ᚹ',
    runeName: 'Wunjo',
    runeMeaning: '기쁨과 예술적 감응의 절정',
    themeColor: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    summary: '세계적 거장들의 명화, 영혼을 적시는 명시, 심금을 울리는 클래식 명곡을 엮어 예술적 카타르시스를 선물합니다.',
    description:
      '화가의 붓 터치 속에 담긴 심리적 상징을 해설하는 디지털 도슨트와 고민에 감응하는 맞춤 예술 처방전을 만날 수 있습니다.',
    highlights: [
      {
        icon: '🖼️',
        title: '디지털 도슨트 명화 심층 해설',
        desc: '고흐, 모네, 클림트 등 대가들의 작품 속에 숨겨진 치유의 상징과 따스한 시선 해설',
      },
      {
        icon: '📖',
        title: '시대를 초월한 명시 감상',
        desc: '말라붙은 마음에 촉촉한 단비를 내리는 세계적 시인들의 주옥같은 시구 큐레이션',
      },
      {
        icon: '🎻',
        title: '마음을 울리는 클래식 명곡',
        desc: '뇌파를 진정시키고 감정의 억압을 승화시키는 엄선된 클래식 사운드트랙 연동',
      },
    ],
    speechText:
      '뮤즈 예술처방은 명화, 명시, 클래식 명곡의 삼위일체 큐레이션으로 영혼의 카타르시스를 선물하는 예술 치유 공간입니다. 디지털 도슨트의 해설과 함께 예술이 건네는 깊은 위로를 경험해 보세요.',
  },
  epilogue: {
    id: 'epilogue',
    name: '에필로그 밤 서재 (Epilogue Night Study)',
    subName: '하루의 영감과 감정을 엮는 밤의 서재',
    badge: '회고 & 내면 서재 채널',
    emblemEmoji: '📖',
    runeSymbol: 'ᚨ',
    runeName: 'Ansuz',
    runeMeaning: '지혜와 영감의 신성한 언어',
    themeColor: '#34d399',
    accentGlow: 'rgba(52, 211, 153, 0.4)',
    summary: '하루를 마치며 떠오른 생각과 감정을 한 편의 수필처럼 고요히 엮어 지혜로 승화하는 밤의 서재입니다.',
    description:
      '세상의 소음이 멈춘 깊은 밤, 펜을 들고 나의 하루를 따뜻하게 마감하며 영혼의 책장에 영구히 소장하는 회고 저널입니다.',
    highlights: [
      {
        icon: '🌙',
        title: '밤의 회고 저널',
        desc: '오늘 하루의 감사와 배움을 기록하고, 내일을 향한 차분한 에너지를 준비하는 회고록',
      },
      {
        icon: '⭐',
        title: '별빛 사색 & 철학적 명언',
        desc: '동서양 철학자들의 깊은 통찰이 담긴 밤의 명언을 읽으며 내면의 지혜를 가다듬는 사색',
      },
      {
        icon: '📚',
        title: '영혼의 내면 서재 아카이빙',
        desc: '내가 남긴 기록들이 차곡차곡 쌓여 인생의 소중한 나침반이 되어주는 개인 라이브러리',
      },
    ],
    speechText:
      '에필로그 밤 서재는 하루의 발자취와 영감을 차분히 정리하는 고요한 사색의 공간입니다. 소음이 멈춘 밤, 나만의 회고 일기를 남기며 지혜로운 내일을 맞이해 보세요.',
  },
  key: {
    id: 'key',
    name: 'Key (40가지 불안 치유 마음약방)',
    subName: '《왜 나는 불안할까》 도서 임상 실천 워크북',
    badge: '임상 심리 실천 채널',
    emblemEmoji: '🔑',
    runeSymbol: 'ᚲ',
    runeName: 'Kenaz',
    runeMeaning: '치유의 횃불과 해법의 열쇠',
    themeColor: '#0ea5e9',
    accentGlow: 'rgba(14, 165, 233, 0.4)',
    summary: '임상심리학자 제이미 저커먼 박사의 도서 《왜 나는 불안할까》 기반 40가지 행동 실천 연습실입니다.',
    description:
      '생각과 감정을 분리하는 탈융합 훈련, 신체 감각 그라운딩, 실천 워크북 기록장 및 3분 응급 처방전을 제공합니다.',
    highlights: [
      {
        icon: '🎯',
        title: '40가지 실천 연습실',
        desc: '1장(머릿속 혼돈), 2장(신체 감각), 3장(불편한 감정)의 체계적인 ACT 임상 치유 연습',
      },
      {
        icon: '💊',
        title: '3분 응급 처방전 & 원형 차트',
        desc: '극심한 스트레스 상황에서 즉각 실천할 수 있는 쾌속 처방과 40개 연습 완주율 추적',
      },
      {
        icon: '📓',
        title: '나만의 실천 워크북 기록장',
        desc: '직접 작성한 답변과 SUD(주관적 불편감) 완화 추이를 안전하게 보관하는 치유 저널',
      },
    ],
    speechText:
      'Key 마음약방은 임상심리학자 제이미 저커먼 박사의 도서를 기반으로 40가지 불안 치유 행동을 실천하는 디지털 워크북입니다. 나만의 평온을 찾아가는 여정을 시작해 보세요.',
  },
};

export function openChannelIntro(channelId: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('prism:open-channel-intro', {
        detail: { channelId },
      }),
    );
  }
}

export function ChannelIntroModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [channelId, setChannelId] = useState<string>('hub');

  const channel = PRISM_CHANNELS_DETAILS[channelId] || PRISM_CHANNELS_DETAILS.hub;

  useEffect(() => {
    const handleOpen = (e: CustomEvent<{ channelId: string }>) => {
      if (e.detail?.channelId) {
        setChannelId(e.detail.channelId);
        setIsOpen(true);
      }
    };
    window.addEventListener('prism:open-channel-intro' as any, handleOpen);
    return () => {
      window.removeEventListener('prism:open-channel-intro' as any, handleOpen);
    };
  }, []);

  const handleClose = useCallback(() => {
    stopTTS();
    setIsOpen(false);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-3 sm:p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl bg-zinc-950/95 border shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-white"
          style={{
            borderColor: `${channel.themeColor}40`,
            boxShadow: `0 20px 60px -10px rgba(0, 0, 0, 0.8), 0 0 30px ${channel.accentGlow}`,
          }}
        >
          {/* Ambient Header Glow */}
          <div
            className="absolute top-0 left-0 right-0 h-32 opacity-25 pointer-events-none blur-2xl"
            style={{
              background: `radial-gradient(ellipse at top, ${channel.themeColor}, transparent 70%)`,
            }}
          />

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 border shadow-sm"
                style={{
                  backgroundColor: `${channel.themeColor}20`,
                  borderColor: `${channel.themeColor}50`,
                }}
              >
                {channel.emblemEmoji}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-bold border tracking-wider"
                    style={{
                      backgroundColor: `${channel.themeColor}25`,
                      borderColor: `${channel.themeColor}60`,
                      color: channel.themeColor,
                    }}
                  >
                    {channel.badge}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {channel.runeSymbol} {channel.runeName}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white truncate mt-0.5">
                  {channel.name}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer shrink-0"
              title="닫기"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="relative z-10 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 custom-scrollbar text-sm">
            {/* Channel Core Summary Quote */}
            <div
              className="p-3.5 rounded-2xl border bg-white/[0.03] flex flex-col gap-1.5"
              style={{ borderColor: `${channel.themeColor}30` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold tracking-wide" style={{ color: channel.themeColor }}>
                  ✦ 채널의 핵심 사명과 가치
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <TTSButton
                    text={channel.speechText}
                    voice="Kore"
                    className="text-[10px] px-2 py-1 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                {channel.summary}
              </p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                {channel.description}
              </p>
            </div>

            {/* Rune Wisdom */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70">
              <span className="text-base">{channel.runeSymbol}</span>
              <span className="font-semibold text-white/85">고대 룬 비의:</span>
              <span className="text-white/70 break-keep break-words whitespace-normal">{channel.runeMeaning}</span>
            </div>

            {/* Highlights (3 Key Features) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider px-1">
                주요 경험 및 특화 기능
              </span>
              <div className="grid grid-cols-1 gap-2">
                {channel.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all"
                  >
                    <span className="text-lg shrink-0 mt-0.5">{h.icon}</span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-bold text-white leading-snug">
                        {h.title}
                      </span>
                      <span className="text-[11px] text-white/60 leading-relaxed mt-0.5">
                        {h.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="relative z-10 p-3.5 sm:p-4 border-t border-white/10 bg-black/60 flex items-center justify-between gap-3">
            <span className="text-[11px] text-white/40 truncate hidden xs:inline">
              상단 엠블럼을 언제든 눌러 채널 가이드를 열 수 있습니다.
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="w-full xs:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ml-auto"
              style={{
                backgroundColor: channel.themeColor,
                boxShadow: `0 4px 15px ${channel.accentGlow}`,
              }}
            >
              <span>채널 시작하기</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
