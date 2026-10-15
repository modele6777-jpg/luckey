import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, Flame, Wind, Coins, BookOpen, Volume2, VolumeX,
  CheckCircle2, Zap, Sun, Moon, Feather, Check, Palette, ArrowRight, Share2,
  Compass, Shield, ShieldCheck, User, Calendar, Clock, X, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Eye, Layers,
  Copy, ZoomIn, AlertCircle
} from 'lucide-react';
import { TAROT_DECK, TarotCard, getTarotCardImageUrl } from '@/data/tarotData';
import { TarotSpread, SelectedTarotCardEntry } from './TarotSpread';
import { Streamdown } from '@/components/Streamdown';
import { invokeLLM, invokeLLMStream } from '@/lib/ai';
import { playTTS, playTTSInChunks, prefetchTTS, stopTTS, useTTSActive, useTTSState, prepareNaturalSpeechText } from '@/utils/tts';
import { playAiResultNotification, playAudioHaptic } from '@/lib/audioHaptics';
import { LucyTarotAdviceCard } from './LucyTarotAdviceCard';
import { TarotResultShareButton } from './TodayTarotShareModal';
import { TarotCardZoomModal } from './TarotCardZoomModal';
import { TarotFlippingCard } from './TarotFlippingCard';
import { FollowUpTarotTimeline, FollowUpTarotEntry } from './FollowUpTarotTimeline';
import { FollowUpTarotInputBar } from './FollowUpTarotInputBar';
import { TarotCardBackCustomizerModal } from './TarotCardBackCustomizerModal';
import { useTarotCardBack } from '@/hooks/useTarotCardBack';
import { getTodayAnchorTarotCard } from '@/lib/todayTarotNarration';
import { TarotSummaryGraphicCard } from '@/components/trinity/TarotSummaryGraphicCard';
import {
  extractOracleConciseSummary,
  extractGivenName,
  formatKoreanVocative,
  formatKoreanToTarget
} from '@/lib/tarotSummaryUtils';
import { type TarotShareData } from '@/utils/todayTarotExporter';
import { getTarotCardDetails } from '@/lib/dailyTarotOracle';
import { sendPrismToss } from '@/lib/prismToss';
import { MUSE_ART_CATALOG } from '@/lib/museDailyArt';
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { getTodayDateKey, getTrinityDailyResultKey } from '@/lib/dailyCache';
import {
  calculateDetailedSaju,
  generateDailySajuReport,
  type DailySajuReport,
  ELEMENT_DETAILS,
  type SajuAnalysisResult,
  type FiveElement
} from '@/lib/sajuAnalysis';
import { ACIM_CORE_CANON, ACIM_SACRED_QUOTES } from '@/lib/acimWisdom';

// Local storage keys
const STORAGE_HEALING_TREASURES = 'prism_oracle_healing_treasures';
const STORAGE_GROWTH_LOGS = 'prism_oracle_growth_logs';
const STORAGE_MIRACLE_TREASURES = 'prism_oracle_miracle_treasures';
const STORAGE_ORACLE_MODE = 'trinity_oracle_mode';
const STORAGE_ORACLE_MODE_SELECTED = 'trinity_oracle_mode_selected';
const STORAGE_DAILY_ORACLE_PREFIX = 'prism_oracle_daily_';

export type OracleMode = 'healing' | 'growth' | 'miracle';

export interface SavedDailyOracleSession {
  dateKey: string;
  mode: OracleMode;
  drawnCards: TarotCard[];
  inquiryText?: string;
  healingResult?: HealingResult | null;
  growthResult?: GrowthResult | null;
  miracleResult?: MiracleResult | null;
  savedAt: string;
}

export const getDailyOracleStorageKey = (mode: OracleMode, dateKey: string) => {
  return `${STORAGE_DAILY_ORACLE_PREFIX}${mode}_${dateKey}`;
};

export const loadTodayOracleSession = (
  mode: OracleMode,
  dateKey?: string,
  cloudSharedState?: any
): SavedDailyOracleSession | null => {
  if (typeof window === 'undefined') return null;
  const targetDateKey = dateKey || getTodayDateKey();
  const altIsoDateKey = new Date().toISOString().split('T')[0];

  const candidateKeys = [
    getDailyOracleStorageKey(mode, targetDateKey),
    getDailyOracleStorageKey(mode, altIsoDateKey),
    `prism_oracle_daily_${mode}_${targetDateKey}`,
    `prism_oracle_daily_${mode}_${altIsoDateKey}`,
    `prism_trinity_oracle_session_${mode}_${targetDateKey}`,
    `prism_trinity_oracle_session_${mode}_${altIsoDateKey}`,
    `prism_oracle_${mode}_${targetDateKey}`,
    `prism_oracle_${mode}_${altIsoDateKey}`,
    `trinity_oracle_session_${mode}_${targetDateKey}`,
    `trinity_oracle_session_${mode}_${altIsoDateKey}`,
    `trinity_daily_oracle_${mode}_${targetDateKey}`,
  ];

  for (const k of candidateKeys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.healingResult || parsed.growthResult || parsed.miracleResult || (parsed.drawnCards && parsed.drawnCards.length > 0))) {
          return parsed;
        }
      }
    } catch (_) {}
  }

  // Also check sessionStorage
  for (const k of candidateKeys) {
    try {
      const raw = sessionStorage.getItem(k);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.healingResult || parsed.growthResult || parsed.miracleResult || (parsed.drawnCards && parsed.drawnCards.length > 0))) {
          return parsed;
        }
      }
    } catch (_) {}
  }

  // Check cloudSharedState if provided
  if (cloudSharedState) {
    try {
      const cloudSession = cloudSharedState.oracleSessions?.[`${mode}_${targetDateKey}`]
        || cloudSharedState.oracleSessions?.[`${mode}_${altIsoDateKey}`];
      if (cloudSession && (cloudSession.healingResult || cloudSession.growthResult || cloudSession.miracleResult || (cloudSession.drawnCards && cloudSession.drawnCards.length > 0))) {
        try {
          const jsonStr = JSON.stringify(cloudSession);
          localStorage.setItem(getDailyOracleStorageKey(mode, targetDateKey), jsonStr);
          localStorage.setItem(`prism_trinity_oracle_session_${mode}_${targetDateKey}`, jsonStr);
          localStorage.setItem(`prism_oracle_${mode}_${targetDateKey}`, jsonStr);
        } catch (_) {}
        return cloudSession;
      }
    } catch (_) {}
  }

  // Scan localStorage for matching keys
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('oracle') && key.includes(mode) && (key.includes(targetDateKey) || key.includes(altIsoDateKey))) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && (parsed.healingResult || parsed.growthResult || parsed.miracleResult || (parsed.drawnCards && parsed.drawnCards.length > 0))) {
              return parsed;
            }
          } catch (_) {}
        }
      }
    }
  } catch (_) {}

  return null;
};

export const saveDailyOracleSession = (mode: OracleMode, dateKey: string, session: SavedDailyOracleSession) => {
  if (typeof window === 'undefined') return;
  try {
    const jsonStr = JSON.stringify(session);
    const primaryKey = getDailyOracleStorageKey(mode, dateKey);
    localStorage.setItem(primaryKey, jsonStr);
    localStorage.setItem(`prism_trinity_oracle_session_${mode}_${dateKey}`, jsonStr);
    localStorage.setItem(`prism_oracle_${mode}_${dateKey}`, jsonStr);
    sessionStorage.setItem(primaryKey, jsonStr);
    window.dispatchEvent(new CustomEvent('prism:oracle_session_updated', {
      detail: { mode, dateKey, session, oracleSessions: { [`${mode}_${dateKey}`]: session } }
    }));
    window.dispatchEvent(new CustomEvent('prism:realtime_sync', {
      detail: { oracleSessions: { [`${mode}_${dateKey}`]: session } }
    }));
  } catch (e) {
    console.warn('[Oracle] Failed to save daily session:', e);
  }
};

export interface CardInsight {
  card_name: string;
  position_name: string;
  core_meaning: string;
  saju_resonance?: string;
  personal_interpretation: string;
  action_guide?: string;
}

export interface SajuTarotSynergy {
  day_master_resonance: string;
  elemental_balance: {
    dominant_harmony: string;
    lacking_remedy: string;
  };
  destiny_flow_synthesis: string;
  saju_oracle_verdict: string;
}

export interface HealingResult {
  message: string;
  concise_summary?: string[];
  saju_tarot_synergy?: SajuTarotSynergy;
  card_insights?: CardInsight[];
  prescribed_art: {
    catalog_id?: string;
    artwork_title: string;
    art_quote: string;
  };
  micro_action: string;
  reward_item: {
    name: string;
    description: string;
    icon?: string;
  };
}

export interface GrowthResult {
  message?: string;
  macro_focus: string;
  concise_summary?: string[];
  saju_tarot_synergy?: SajuTarotSynergy;
  card_insights?: CardInsight[];
  dominant_element: {
    element: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
    element_ko: string;
    theme_brief: string;
  };
  micro_mission: {
    title: string;
    action_tip: string;
  };
  evening_reflection: string;
  prescribed_art?: {
    catalog_id?: string;
    artwork_title: string;
    art_quote: string;
  };
}

export interface MiracleResult {
  message: string;
  concise_summary?: string[];
  saju_tarot_synergy?: SajuTarotSynergy;
  card_insights?: CardInsight[];
  miracle_lesson?: {
    source: string;
    quote: string;
    application: string;
  };
  prescribed_art?: {
    catalog_id?: string;
    artwork_title: string;
    art_quote: string;
  };
  micro_action: string;
  reward_item: {
    name: string;
    description: string;
    icon?: string;
  };
}

export interface CollectedTreasure {
  id: string;
  name: string;
  description: string;
  date: string;
  cardNames: string[];
}


// Intelligent dynamic mapping of Tarot cards & Saju elements to MUSE_ART_CATALOG (56 masterpieces)
export function resolvePrescribedArtForCards(
  cards: TarotCard[],
  saju: SajuAnalysisResult | null,
  mode: OracleMode
): { artwork_title: string; art_quote: string; catalog_id: string } {
  if (!cards || cards.length === 0) {
    return {
      catalog_id: 'monet_water_lilies',
      artwork_title: '수련 (Water Lilies, 1916)',
      art_quote: '내가 수련을 그리는 것은 마음을 편안하게 만들기 위한 유일한 의식이다.',
    };
  }

  // Focus on 3rd card (Seed of Healing / Micro Trigger) or 1st card
  const anchorCard = cards[2] || cards[0];
  const cardId = (anchorCard.id || '').toLowerCase();
  const cardName = anchorCard.nameKo || '';

  // Specific Tarot Arcana mapping to MUSE_ART_CATALOG items
  const TAROT_CATALOG_MAP: Record<string, string> = {
    '0': 'chagall_paris_through_window', // 광대 -> 샤갈 창 너머의 파리
    'the_fool': 'chagall_paris_through_window',
    '1': 'kandinsky_composition_viii', // 마법사 -> 칸딘스키 구성 8
    'the_magician': 'kandinsky_composition_viii',
    '2': 'vermeer_girl_pearl_earring', // 여사제 -> 진주 귀걸이를 한 소녀
    'the_high_priestess': 'vermeer_girl_pearl_earring',
    '3': 'botticelli_birth_of_venus', // 여황제 -> 비너스의 탄생
    'the_empress': 'botticelli_birth_of_venus',
    '4': 'friedrich_wanderer', // 황제 -> 안개 바다 위의 방랑자
    'the_emperor': 'friedrich_wanderer',
    '5': 'raphael_school_of_athens', // 교황 -> 아테네 학당
    'the_hierophant': 'raphael_school_of_athens',
    '6': 'klimt_the_kiss', // 연인 -> 클림트 키스
    'the_lovers': 'klimt_the_kiss',
    '7': 'rosa_bonheur_horse_fair', // 전차 -> 로자 보뉴르 말 시장
    'the_chariot': 'rosa_bonheur_horse_fair',
    '8': 'lee_jung_seob_white_ox', // 힘 -> 이중섭 흰 소
    'strength': 'lee_jung_seob_white_ox',
    '9': 'hopper_nighthawks', // 은둔자 -> 호퍼 밤을 지새우는 사람들
    'the_hermit': 'hopper_nighthawks',
    '10': 'mondrian_composition_red_blue_yellow', // 운명의 수레바퀴 -> 몬드리안 빨강 파랑 노랑 구성
    'wheel_of_fortune': 'mondrian_composition_red_blue_yellow',
    '11': 'vermeer_the_milkmaid', // 정의 -> 페르메이르 우유 따르는 여인
    'justice': 'vermeer_the_milkmaid',
    '12': 'dali_persistence_of_memory', // 매달린 사람 -> 살바도르 달리 기억의 지속
    'the_hanged_man': 'dali_persistence_of_memory',
    '13': 'millais_ophelia', // 죽음 -> 밀레이 오필리아
    'death': 'millais_ophelia',
    '14': 'cezanne_mont_sainte_victoire', // 절제 -> 세잔 생트 빅투아르 산
    'temperance': 'cezanne_mont_sainte_victoire',
    '15': 'munch_the_scream', // 악마 -> 뭉크 절규
    'the_devil': 'munch_the_scream',
    '16': 'turner_rain_steam_speed', // 탑 -> 터너 비 증기 그리고 속도
    'the_tower': 'turner_rain_steam_speed',
    '17': 'gogh_starry_night', // 별 -> 반 고흐 별이 빛나는 밤
    'the_star': 'gogh_starry_night',
    '18': 'kitty_kielland_summer_night', // 달 -> 키티 킬란트 여름의 밤
    'the_moon': 'kitty_kielland_summer_night',
    '19': 'monet_impression_sunrise', // 태양 -> 모네 인상 해돋이
    'the_sun': 'monet_impression_sunrise',
    '20': 'caravaggio_calling_saint_matthew', // 심판 -> 카라바조 성 마태오의 소명
    'judgement': 'caravaggio_calling_saint_matthew',
    '21': 'matisse_the_dance', // 세계 -> 앙리 마티스 춤
    'the_world': 'matisse_the_dance',
  };

  let matchedId = TAROT_CATALOG_MAP[cardId] || TAROT_CATALOG_MAP[anchorCard.name.toLowerCase().replace(/\s+/g, '_')];

  // Minor Suit & Keywords fallback
  if (!matchedId) {
    if (cardName.includes('광대') || cardId.includes('fool')) matchedId = 'chagall_paris_through_window';
    else if (cardName.includes('마법사') || cardId.includes('magician')) matchedId = 'kandinsky_composition_viii';
    else if (cardName.includes('별') || cardId.includes('star')) matchedId = 'gogh_starry_night';
    else if (cardName.includes('태양') || cardId.includes('sun')) matchedId = 'monet_impression_sunrise';
    else if (cardName.includes('달') || cardId.includes('moon')) matchedId = 'kitty_kielland_summer_night';
    else if (cardName.includes('연인') || cardId.includes('lover')) matchedId = 'klimt_the_kiss';
    else if (cardName.includes('은둔자') || cardId.includes('hermit')) matchedId = 'hopper_nighthawks';
    else if (cardName.includes('전차') || cardId.includes('chariot')) matchedId = 'rosa_bonheur_horse_fair';
    else if (cardName.includes('힘') || cardId.includes('strength')) matchedId = 'lee_jung_seob_white_ox';
    else if (cardId.includes('wand') || cardName.includes('완드') || cardName.includes('지팡이')) {
      matchedId = mode === 'growth' ? 'rosa_bonheur_horse_fair' : 'gogh_cafe_terrace_night';
    } else if (cardId.includes('cup') || cardName.includes('컵')) {
      matchedId = 'monet_water_lilies';
    } else if (cardId.includes('sword') || cardName.includes('검') || cardName.includes('칼')) {
      matchedId = 'edward_hopper_automat';
    } else if (cardId.includes('pentacle') || cardName.includes('동전')) {
      matchedId = 'klimt_tree_of_life';
    }
  }

  // Saju Element resonance fallback
  if (!matchedId) {
    const dominant = saju?.elements?.dominant?.name;
    if (dominant === '목') matchedId = 'gogh_almond_blossoms';
    else if (dominant === '화') matchedId = 'monet_impression_sunrise';
    else if (dominant === '토') matchedId = 'millet_the_gleaners';
    else if (dominant === '금') matchedId = 'caillebotte_paris_street_rainy_day';
    else if (dominant === '수') matchedId = 'kroyer_summer_evening_skagen';
    else {
      const seed = cards.reduce((acc, c, idx) => acc + (c.nameKo.charCodeAt(0) || idx + 1), 0);
      const catalogIndex = seed % MUSE_ART_CATALOG.length;
      matchedId = MUSE_ART_CATALOG[catalogIndex].id;
    }
  }

  const catalogEntry = MUSE_ART_CATALOG.find((entry) => entry.id === matchedId) || MUSE_ART_CATALOG[0];

  return {
    catalog_id: catalogEntry.id,
    artwork_title: catalogEntry.title,
    art_quote: catalogEntry.quote,
  };
}

/**
 * 🌟 오라클 힐링타로 5단계 심층 총평 마크다운 본문 폴백 및 안전 생성 함수
 * AI 응답에서 본문(message)이 비어있거나 누락되었을 때도 100% 온전한 대서사 리딩을 렌더링
 */
export function buildFallbackHealingMessage(
  cards: SelectedTarotCardEntry[],
  saju: any,
  todayCard: TarotCard,
  recipientName: string,
  effectiveInquiry?: string,
  insights?: CardInsight[],
  synergy?: SajuTarotSynergy,
  microAction?: any
): string {
  const sajuNameStr = saju?.name || recipientName || '내담자';
  const dayMasterStr = saju ? `${saju.dayMaster.hanja}(${saju.dayMaster.korean} · ${saju.dayMaster.symbolName})` : '본원 기운';
  const domElStr = saju?.elements?.dominant?.name || '우세 오행';
  const domElAdvice = saju?.elements?.dominant?.advice || '유연한 흐름';
  const lackElStr = saju?.elements?.lacking?.name || '결핍 오행';
  const yongsinStr = saju?.yongsin?.name || '용신 보약';
  const yongsinTip = saju?.yongsin?.actionTip || '내면의 고요한 관찰';

  const c1 = cards[0];
  const c2 = cards[1];
  const c3 = cards[2];
  const c1Name = c1 ? `${c1.nameKo || c1.name}${c1.reversed ? ' (역방향)' : ' (정방향)'}` : '1번 과거 카드';
  const c2Name = c2 ? `${c2.nameKo || c2.name}${c2.reversed ? ' (역방향)' : ' (정방향)'}` : '2번 현재 카드';
  const c3Name = c3 ? `${c3.nameKo || c3.name}${c3.reversed ? ' (역방향)' : ' (정방향)'}` : '3번 조언 카드';
  const c1Keywords = c1?.keywords ? c1.keywords.slice(0, 3).join(', ') : '원형적 상징';
  const c2Keywords = c2?.keywords ? c2.keywords.slice(0, 3).join(', ') : '현실의 흐름';
  const c3Keywords = c3?.keywords ? c3.keywords.slice(0, 3).join(', ') : '해결의 열쇠';

  const todayCardStr = `[${todayCard.nameKo}] (${todayCard.name}${todayCard.reversed ? ' · 역방향' : ' · 정방향'})`;
  const inquiryFocus = effectiveInquiry ? `현재 마주하신 "${effectiveInquiry}" 고민` : '지금 마주하신 삶의 화두와 내면의 질문';

  const stage1Text = `${recipientName} 님, 오늘 당신이 품고 태어난 [${dayMasterStr}] 본원 기운과 2026 병오년(丙午年)의 거대한 세운 흐름, 그리고 오늘 하루를 관통하는 일일 지배 카드인 ${todayCardStr}의 기저 파동이 만나 당신의 삶의 무대에 매우 역동적이면서도 섬세한 운명의 장막을 펼쳐 보이고 있습니다.

오늘의 일일 지배 타로 [${todayCard.nameKo}]는 하루의 무의식적 기저와 현실 환경을 조율하는 핵심 우주 나침반입니다. 사주 원국에서 강하게 솟구치는 ${domElStr}의 기운과 오늘의 타로 배경 에너지가 교차하며, ${recipientName} 님이 품고 계신 ${inquiryFocus} 앞에서 내면의 무게와 생각의 속도를 조율하도록 촉구하고 있습니다. 사주 일간 본원의 고유한 품격과 오늘의 타로가 형성한 기저 장(Field) 안에서, 마음의 혼란은 결코 우연이 아니며 새로운 성숙과 도약을 향한 필연적인 운명적 신호탄입니다.

이제 당신이 직접 선택한 3장의 오라클 카드가 사주 명리의 오행 밸런스와 긴밀하게 결합하여, 과거의 무의식적 씨앗부터 현재의 현실적 갈등, 그리고 미래의 명쾌한 해결 열쇠에 이르기까지 깊고 자비로운 치유의 여정을 입체적으로 안내합니다. 외부의 소음에 휩쓸리지 않고 자신의 본원 페이스를 되찾는 지혜로운 해법이 지금 눈앞에 펼쳐집니다.`;

  const stage2Text = `${insights?.[0]?.personal_interpretation ? `${insights[0].personal_interpretation}\n\n` : ''}첫 번째 과거와 무의식의 자리에 놓인 [${c1Name}]는 지금의 고민이 싹트게 된 깊은 심리적 뿌리와 내면의 씨앗을 투명하게 비추고 있습니다. 카드가 품은 핵심 상징([${c1Keywords}])은 오랜 시간 동안 당신의 의식 아래에서 묵묵히 축적되어 온 생각의 패턴과 억눌린 감정의 파동을 정밀하게 해독합니다.

${sajuNameStr} 님의 타고난 사주 본원 [${dayMasterStr}] 기질은 본래 높은 책임감과 성실성을 지니고 있어, 주변의 기대를 외면하지 못하고 스스로 모든 무게를 짊어지려는 숭고한 기상을 가지고 있습니다. 그러나 오늘의 지배 타로 [${todayCard.nameKo}]의 파동과 1번 카드가 교차하면서 드러나는 진실은, 과거로부터 홀로 모든 것을 감내하려 했던 부담감과 "내가 더 참아야 한다"는 무의식적 자기 검열이 내면에 보이지 않는 에너지 정체를 만들어냈음을 말해줍니다.

자신의 솔직한 감정과 욕구를 뒤로한 채 외부 기준과 타인의 시선에 맞추려 했던 그 과거의 시간들이 오늘날 마음에 깊은 피로와 긴장의 파문을 일으켰던 것입니다. 하지만 카드의 도상은 이것이 당신의 결함이나 실수가 아니라고 위로합니다. 그것은 자신의 최선을 다해 살아온 사람만이 남길 수 있는 고결한 삶의 훈장이자, 이제는 낡은 짐을 내려놓고 스스로를 보살펴야 할 때임을 알리는 영혼의 전환점입니다.`;

  const stage3Text = `${insights?.[1]?.personal_interpretation ? `${insights[1].personal_interpretation}\n\n` : ''}두 번째 현재와 상황의 흐름 자리에 놓인 [${c2Name}]는 지금 ${recipientName} 님이 일상과 관계, 그리고 선택의 기로에서 느끼고 계실 현실적 긴장과 마음의 소용돌이를 입체적으로 진단합니다. 카드의 도상과 상징([${c2Keywords}])은 지금 겉으로 드러난 상황뿐만 아니라, 그 이면에서 요동치는 미세한 감정의 줄다리기를 날카롭게 포착합니다.

사주 원국에서 강하게 작용하는 ${domElStr}의 에너지가 오늘의 지배 카드 [${todayCard.nameKo}]의 현실적 작용과 맞물리면서, 생각은 꼬리를 물고 마음은 서둘러 상황을 통제하거나 결과를 예측하려 조급해하고 있습니다. ${effectiveInquiry ? `특히 마주하신 "${effectiveInquiry}" 사안 앞에서, ` : ''}자신의 기준과 현실의 진행 속도 사이에 존재하는 괴리감이 마음에 답답함과 무력감을 번갈아 일으키고 있는 형국입니다.

그러나 [${c2Name}]의 도상은 지금 마주한 갈등이 상황의 붕괴가 아니라, 낡고 정체된 에너지를 털어내고 새로운 균형을 찾기 위해 필연적으로 통과해야 할 '성스러운 정화의 관문(Purification Gate)'임을 보여줍니다. 바람이 불어야 먼지가 털려 나가듯, 현재의 혼란은 더 견고하고 유연한 자신을 빚어내기 위한 우주의 정돈 과정입니다. 지금은 서둘러 결과를 강제하려 하지 말고, 파도를 관찰하는 서퍼처럼 상황의 흐름을 한 걸음 물러서서 관찰하는 유연성이 절실합니다.`;

  const stage4Text = `${insights?.[2]?.personal_interpretation ? `${insights[2].personal_interpretation}\n\n` : ''}세 번째 미래와 조언, 그리고 해결의 열쇠 자리에 장엄하게 등장한 [${c3Name}]는 이번 오라클 리딩의 가장 위대한 전환점이자 명쾌한 탈출 로드맵입니다. 카드가 담지하고 있는 원형적 지혜([${c3Keywords}])는 막연한 위로를 넘어, 현실의 안개를 걷어내고 명징한 방향성을 제시하는 강력한 영적 나침반으로 작용합니다.

사주 원국에서 반드시 보충해야 할 결핍 오행 ${lackElStr}과 용신 ${yongsinStr}의 생명력 있는 기운이 이 3번 카드의 상징 체계 속에서 완벽하게 공명하고 있습니다. ${yongsinTip}의 사주 개운 원리가 카드의 도상과 만나면서, 당신에게 더 이상 과거의 죄책감이나 미래의 불안에 에너지를 낭비하지 말 것을 단호히 선언합니다. 이 카드는 상황을 통제하려 애쓰는 대신, ${recipientName} 님 스스로에게 주도권을 돌려주고 상황을 바라보는 프레임을 완전히 전환할 것을 지시합니다.

오늘의 지배 타로 [${todayCard.nameKo}]가 던진 하루의 화두는 바로 이 3번 카드의 결단을 통해 가장 온전하고 풍요로운 성장의 결실로 매듭지어질 것입니다. 두려움 때문에 미뤄왔던 솔직한 표현을 시작하고, 자신을 갉아먹던 기준을 과감히 내려놓으십시오. 카드가 비추는 빛을 따라 걸어갈 때, 복잡하게 얽혀 있던 고민의 실타래는 마법처럼 풀려나가며 당신이 가야 할 가장 맑고 안전한 길이 눈앞에 펼쳐질 것입니다.`;

  const actionStr = typeof microAction === 'string' && microAction.length > 5
    ? microAction
    : (microAction?.description || '따뜻한 온수를 섭취하고 가슴을 펴는 3번의 깊은 복식호흡 실천하기');

  const stage5Text = `${recipientName} 님, 운명은 이미 정해진 굳은 감옥이 아니라 당신의 호흡과 작은 선택들이 모여 빚어가는 살아있는 예술입니다. 사주 용신인 [${yongsinStr}]의 맑은 기운을 일상에서 깨우기 위해 오늘 하루, "${actionStr}"을(를) 정성스럽게 실천해 주십시오. 작은 온수를 마시고 가슴을 펴는 3번의 깊은 복식호흡만으로도 몸과 마음에 쌓였던 냉기와 독소가 씻겨 나가기 시작합니다.

사주에서 ${domElAdvice}의 지혜를 마음에 새기고, 오늘의 지배 타로 [${todayCard.nameKo}]의 든든한 배경 장 안에서 당신의 고유한 중심을 회복하십시오. 고민은 당신을 무너뜨리기 위해 찾아온 적이 아니라, 당신 안에 잠자고 있던 거대한 사랑과 내적 힘을 깨우기 위해 찾아온 귀한 손님입니다.

당신은 우주가 무수한 인연의 씨실과 날실로 정성껏 빚어낸 존귀하고 아름다운 영혼입니다. 오늘 하루, 스스로를 향해 "지금까지 정말 애썼다, 고맙다"는 따뜻한 인정과 다정한 미소를 건네주십시오. 사주 명리학의 유구한 지혜와 78장 타로 오라클의 영적 축복이 당신의 모든 발걸음을 눈부신 은총과 평온함으로 감싸 안기를 진심으로 기원합니다.`;

  return `### 🌌 1. 2026 오늘의 일일 타로 [${todayCard.nameKo}]와 사주 원국의 거대한 공명
${stage1Text}

### 🕯️ 2. 무의식의 뿌리와 과거의 씨앗 [1번 카드: ${c1Name}]
${stage2Text}

### ⚡ 3. 현실의 갈등과 마음의 소용돌이 [2번 카드: ${c2Name}]
${stage3Text}

### 🔮 4. 오라클의 전환점과 미래 해결의 열쇠 [3번 카드: ${c3Name}]
${stage4Text}

### 🌿 5. 운명을 바꾸는 일상 개운 처방과 마스터의 영혼 축복
${stage5Text}`;
}

/**
 * ⚡ 오라클 성장타로 5단계 실행 편지 마크다운 본문 폴백 생성 함수
 */
export function buildFallbackGrowthMessage(
  cards: SelectedTarotCardEntry[],
  saju: any,
  todayCard: TarotCard,
  recipientName: string,
  effectiveInquiry?: string,
  macroFocus?: string,
  microMission?: any
): string {
  const sajuNameStr = saju?.name || recipientName || '도전자';
  const dayMasterStr = saju ? `${saju.dayMaster.hanja}(${saju.dayMaster.symbolName})` : '본원 기질';
  const domElStr = saju?.elements?.dominant?.name || '우세 오행';
  const lackElStr = saju?.elements?.lacking?.name || '결핍 오행';
  const yongsinStr = saju?.yongsin?.name || '용신 추진력';

  const c1 = cards[0];
  const c2 = cards[1];
  const c3 = cards[2];
  const c1Name = c1 ? `${c1.nameKo || c1.name}${c1.reversed ? ' (역방향)' : ' (정방향)'}` : '1번 카드';
  const c2Name = c2 ? `${c2.nameKo || c2.name}${c2.reversed ? ' (역방향)' : ' (정방향)'}` : '2번 카드';
  const c3Name = c3 ? `${c3.nameKo || c3.name}${c3.reversed ? ' (역방향)' : ' (정방향)'}` : '3번 실행 카드';

  const stage1 = `${recipientName} 님, 안녕하세요! 당신의 잠재 역량을 최고조로 끌어올리는 퍼포먼스 라이프 코치 루시입니다. 2026 병오년(丙午年)의 도약 타이밍 속에서, 오늘 당신의 하루를 지배하는 일일 타로 [${todayCard.nameKo}](${todayCard.reversed ? '역방향' : '정방향'})와 사주 본원 [${dayMasterStr}] 기질의 결합은 강력한 현실 돌파의 기저 에너지를 형성하고 있습니다. ${effectiveInquiry ? `당신이 마주한 "${effectiveInquiry}" 과제 앞에서, ` : ''}${macroFocus || '생각의 과부하를 멈추고 사주 본원 추진력과 타로 실행 에너지를 동기화할 때입니다.'}`;

  const stage2 = `1번 자리에 놓인 [${c1Name}]는 지금까지 당신의 실행력을 옭아매었던 낡은 마인드셋의 정체를 정밀 타격합니다. ${sajuNameStr} 님의 사주 본원은 본래 높은 책임감과 추진 잠재력을 지니고 있지만, 1번 카드의 도상은 "완벽하게 준비된 후에 시작하겠다"는 착각이나 실패에 대한 방어기제가 실행의 첫 발을 묶어두고 있었음을 지적합니다. 완벽주의를 단호히 폐기하고 거친 초안이라도 즉각 현실로 끄집어내는 것이 모든 돌파의 시작점입니다.`;

  const stage3 = `2번 자리에 놓인 [${c2Name}]는 오늘 당신이 현장에서 즉각 동원해야 할 현실 역량과 집중 타깃을 제시합니다. 사주에서 강하게 분출되는 ${domElStr}의 에너지가 분산되면 조급함과 번아웃을 유발합니다. 2번 카드의 도상은 오늘 업무와 일상에서 중요하지 않은 80%의 잔가지를 쳐내고, 결과를 좌우하는 20%의 핵심 우선순위 1가지만을 집요하게 공략하라고 지시합니다.`;

  const stage4 = `3번 자리에 놓인 [${c3Name}]는 이번 리딩의 가장 명쾌한 결론이자 즉각적 돌파 로드맵입니다. 사주에서 부족했던 ${lackElStr}과 용신 ${yongsinStr}의 날카로운 실행 기운이 3번 카드의 전략적 도상과 만나 폭발적인 시너지를 냅니다. 더 이상 주저하거나 다른 대안을 기웃거리지 마십시오. 3번 카드가 비추는 전략적 방향성에 모든 자원을 베팅하고 단호하게 실행에 착수하십시오.`;

  const missionTitle = microMission?.title || '오늘 10분 안에 끝낼 수 있는 가장 작은 현실 행동 과제 1가지 즉시 완수';
  const stage5 = `${recipientName} 님, 성장은 생각의 깊이가 아니라 행동의 빈도와 속도에서 판가름 납니다. 오늘 즉시 실천할 수 있는 단 하나의 '5분 마이크로 액션'으로 "${missionTitle}"을(를) 즉각 완수하십시오. 사주 본원의 기상과 3장의 카드가 당신에게 강력한 성공 모멘텀을 부여하고 있습니다. 머뭇거리지 말고 지금 당장 시작하십시오. 당신의 거침없는 도약을 루시가 끝까지 지원사격하겠습니다!`;

  return `### ⚡ 1. 2026 오늘의 일일 타로 [${todayCard.nameKo}]와 사주 본원의 잠재력 공명 (현실 돌파의 기저 에너지)
${stage1}

### 🧠 2. 실행 정체의 뿌리와 낡은 마인드셋 혁신 [1번 카드: ${c1Name}]
${stage2}

### 🎯 3. 4원소 역량 역학 진단과 현실적 장애물 타격 [2번 카드: ${c2Name}]
${stage3}

### 🚀 4. 오라클 돌파 전략과 우선순위 압축 로드맵 [3번 카드: ${c3Name}]
${stage4}

### 🛠️ 5. 오늘의 1% 마이크로 실행 시스템과 루시의 단호한 멘토링
${stage5}`;
}

/**
 * 🕊️ 오라클 기적수업(ACIM) 5단계 지각전환 마크다운 본문 폴백 생성 함수
 */
export function buildFallbackMiracleMessage(
  cards: SelectedTarotCardEntry[],
  saju: any,
  todayCard: TarotCard,
  recipientName: string,
  effectiveInquiry?: string,
  insights?: CardInsight[],
  miracleLesson?: { source: string; quote: string; application: string },
  microAction?: any
): string {
  const sajuNameStr = saju?.name || recipientName || '빛의 형제';
  const dayMasterStr = saju ? `${saju.dayMaster.hanja}(${saju.dayMaster.korean} · ${saju.dayMaster.symbolName})` : '본원 생명';
  const yongsinStr = saju?.yongsin?.name || '평화의 중심';

  const c1 = cards[0];
  const c2 = cards[1];
  const c3 = cards[2];
  const c1Name = c1 ? `${c1.nameKo || c1.name}${c1.reversed ? ' (역방향)' : ' (정방향)'}` : '1번 에고 카드';
  const c2Name = c2 ? `${c2.nameKo || c2.name}${c2.reversed ? ' (역방향)' : ' (정방향)'}` : '2번 거룩한 순간 카드';
  const c3Name = c3 ? `${c3.nameKo || c3.name}${c3.reversed ? ' (역방향)' : ' (정방향)'}` : '3번 평화의 기적 카드';
  const c1Keywords = c1?.keywords ? c1.keywords.slice(0, 3).join(', ') : '두려움의 투사';
  const c2Keywords = c2?.keywords ? c2.keywords.slice(0, 3).join(', ') : '지각의 전환';
  const c3Keywords = c3?.keywords ? c3.keywords.slice(0, 3).join(', ') : '참된 용서와 평화';

  const todayCardStr = `[${todayCard.nameKo}] (${todayCard.name}${todayCard.reversed ? ' · 역방향' : ' · 정방향'})`;
  const inquiryFocus = effectiveInquiry ? `현재 마음을 어지럽히는 "${effectiveInquiry}" 사안` : '지금 마주하신 현실의 갈등과 불안';

  const lessonQuote = miracleLesson?.quote || '기적은 지각의 전환이다. 두려움 대신 사랑을, 죄책감 대신 하나님의 평화를 선택할 때 기적은 이미 일어났다.';
  const lessonSource = miracleLesson?.source || '기적수업(ACIM) 텍스트 1장';
  const lessonApp = miracleLesson?.application || '판단을 성령께 온전히 넘겨주고 내면의 무죄성을 선언하십시오.';

  const stage1Text = `${recipientName} 님, 하나님의 거룩한 자녀이신 당신의 내면 깊은 곳에는 세상 그 어떤 풍파나 죄책감으로도 결코 훼손될 수 없는 순결한 하나님의 평화가 이미 깃들어 있습니다. 2026 병오년(丙午年)의 거대한 흐름 속에서, 오늘 당신의 무의식적 시야를 비추는 일일 타로 ${todayCardStr}와 사주 본원 [${dayMasterStr}]의 기운은 지금 마주한 ${inquiryFocus}이 결코 당신을 해칠 수 있는 실체가 아니라, 오직 '에고의 환영에서 깨어나 참된 용서를 선택하라는 성령의 부드러운 초대장'임을 선언하고 있습니다.

기적수업은 가르칩니다. "실재하는 것은 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다." 오늘의 일일 타로 [${todayCard.nameKo}]가 현실의 표면에 드러낸 요동침은 당신의 영원한 무죄성을 입증하기 위한 거룩한 무대입니다. 에고가 속삭이는 결핍과 분리의 거짓말을 꿰뚫어 보고, 성령의 시선으로 상황을 다시 바라볼 때 고통은 눈 녹듯 사라집니다.

이제 당신이 직접 선택한 3장의 오라클 카드가 에고의 깊은 두려움의 뿌리를 밝히 드러내고, 판단을 멈추는 '거룩한 순간(Holy Instant)'을 거쳐, 온전한 참된 용서와 하나님의 평화로 귀환하는 영적 여정을 장엄하게 안내합니다. 마음의 눈을 열고 성령의 자비로운 음성에 귀를 기울여 주십시오.`;

  const stage2Text = `${insights?.[0]?.personal_interpretation ? `${insights[0].personal_interpretation}\n\n` : ''}첫 번째 에고의 환영과 숨겨진 두려움의 자리에 놓인 [${c1Name}]는 지금 ${recipientName} 님의 마음속에서 무의식적으로 작동하고 있는 결핍과 죄책감의 정체를 투명하게 비춥니다. 카드의 핵심 도상([${c1Keywords}])은 "내가 무언가를 빼앗겼다"거나 "상대방 혹은 환경 때문에 내가 상처받았다"는 에고의 익숙한 희생자 각본을 고스란히 보여줍니다.

기적수업의 형이상학에서 모든 고통의 원인은 외부 세상에 있지 않고, 하나님과 분리되었다는 근원적 두려움을 세상에 투사(Projection)한 결과입니다. [${c1Name}]는 당신이 품고 있던 과거의 상처나 원한, 통제하려는 불안이 사실은 당신 자신을 방어하기 위해 쌓아 올린 에고의 허망한 성벽이었음을 밝힙니다.

그러나 카드는 당신을 질책하지 않습니다. 에고의 정체를 알아차리는 순간, 그 환영은 이미 힘을 잃기 시작합니다. 당신이 경험한 모든 아픔은 실재하는 죄가 아니라 '사랑을 부르는 외침(A Call for Love)'이었을 뿐입니다. 이제 그 낡은 두려움의 옷을 벗고, 스스로에게 씌웠던 모든 자책과 타인을 향한 판단을 성령의 제단 위에 정직하게 내려놓으십시오.`;

  const stage3Text = `${insights?.[1]?.personal_interpretation ? `${insights[1].personal_interpretation}\n\n` : ''}두 번째 거룩한 순간(Holy Instant)과 지각의 전환 자리에 놓인 [${c2Name}]는 이번 오라클 리딩의 가장 거룩한 연금술이 일어나는 축복의 교차로입니다. 카드의 신성한 상징([${c2Keywords}])은 지금 이 순간, 과거에 대한 후회와 미래에 대한 두려움을 단번에 멈추고 시간의 굴레에서 벗어나는 '영원한 지금'으로 당신을 초대합니다.

거룩한 순간이란, 자신의 작은 앎과 판단을 완전히 포기하고 성령께 상황을 전적으로 맡기는 지각의 전환입니다. 사주에서 작용하는 [${yongsinStr}]의 평화로운 중심과 [${c2Name}]의 에너지가 결합하며, 당신에게 "상황을 내 힘으로 바꾸려 애쓰지 말고, 오직 상황을 바라보는 내 마음의 눈을 치유해 달라"고 요청할 것을 가르칩니다.

${effectiveInquiry ? `특히 "${effectiveInquiry}" 사안에 대해 ` : ''}당신이 옳다고 믿었던 모든 판단과 서운함을 내려놓으십시오. "나는 아무것도 알지 못하며, 그러므로 어떻게 판단해야 할지도 모릅니다. 성령이여, 당신의 눈으로 이 형제와 이 상황을 바라보게 하소서." 이 단 한 번의 겸허한 기도가 마음에 임할 때, 차가웠던 판단의 얼음이 녹아내리고 기적이 흘러들 공간이 마련됩니다.`;

  const stage4Text = `${insights?.[2]?.personal_interpretation ? `${insights[2].personal_interpretation}\n\n` : ''}세 번째 참된 용서와 하나님의 평화 자리에 영광스럽게 임재한 [${c3Name}]는 모든 두려움의 꿈에서 깨어난 영혼에게 주어지는 최종 승리의 면류관이자 하나님의 선물입니다. 카드의 초월적 도상([${c3Keywords}])은 기적수업이 말하는 참된 용서가 결코 '상대방의 죄를 너그럽게 봐주는 것'이 아니라, '애초에 죄란 일어나지 않았음을(환영이었음을) 간파하는 것'임을 단호히 증명합니다.

당신을 상처 입힐 수 있는 세상은 결코 존재하지 않습니다. 상처 입은 것은 실재하지 않는 당신의 작은 에고였을 뿐, 하나님의 거룩한 자녀인 당신의 참마음(Christ Self)은 단 한 순간도 다친 적이 없으며 영원히 온전합니다. [${c3Name}]는 오늘의 지배 타로 [${todayCard.nameKo}]가 제시했던 모든 삶의 숙제가 바로 이 참된 용서의 은총 속에서 완벽하게 해소되었음을 선언합니다.

가슴속에 남아 있던 미세한 원한의 찌꺼기마저 하나님의 자비로운 빛 속으로 사라집니다. 당신이 형제를 무죄하게 바라볼 때 당신 자신의 무죄성이 증명되며, 그 자리에는 세상이 결코 빼앗아갈 수 없는 하나님의 완전한 평화(The Peace of God)가 강물처럼 넘쳐흐릅니다. 기적은 이미 성취되었습니다.`;

  const actionStr = typeof microAction === 'string' && microAction.length > 5
    ? microAction
    : (microAction?.description || '가슴에 손을 얹고 "나는 하나님께서 창조하신 그대로의 순결한 빛이다"를 3번 선언하기');

  const stage5Text = `${recipientName} 님, 하나님의 사랑 안에서 당신은 영원히 안전하며 무한히 축복받은 존재입니다. 오늘 하루, 에고의 거친 파도가 마음을 흔들려 할 때마다 [${lessonSource}]의 거룩한 가르침을 마음에 닻으로 내리십시오:

> **"${lessonQuote}"**  
> *— ${lessonApp}*

일상에서 실천할 수 있는 단 하나의 작은 기적의 의식으로, "${actionStr}"을(를) 조용히 행해 보십시오. 숨을 들이쉬며 하나님의 평화를 받아들이고, 숨을 내쉬며 세상에 대한 모든 판단과 원한을 성령께 온전히 넘겨주십시오.

당신은 죄를 지을 수도 없고, 잃어버릴 수도 없으며, 실패할 수도 없는 영원한 생명의 빛입니다. 오늘 마주치는 모든 사람과 상황을 향해 마음속으로 조용히 축복을 건네십시오: "형제여, 당신 안에서 나는 하나님의 거룩함을 봅니다. 당신을 용서함으로 나 자신을 용서합니다." 기적수업의 순결한 진리와 78장 오라클의 자비로운 인도가 당신의 모든 순간을 완전한 평화와 기쁨으로 가득 채우기를 간절히 기도합니다. 샬롬.`;

  return `### 🕊️ 1. 2026 오늘의 일일 타로 [${todayCard.nameKo}]와 성령의 거룩한 초대 (지각의 전환)
${stage1Text}

### 🌑 2. 에고의 환영과 숨겨진 두려움의 투사 [1번 카드: ${c1Name}]
${stage2Text}

### 🕯️ 3. 거룩한 순간(Holy Instant)과 지각의 정화 [2번 카드: ${c2Name}]
${stage3Text}

### 🕊️ 4. 참된 용서와 하나님의 평화 (기적의 선물) [3번 카드: ${c3Name}]
${stage4Text}

### 🌿 5. 오늘의 기적수업 워크북 선언과 제제의 평화 축복
${stage5Text}`;
}


export interface TrinityOracleSectionProps {
  onNavigateToTarot?: (focusDaily?: boolean) => void;
}

export function TrinityOracleSection({ onNavigateToTarot }: TrinityOracleSectionProps = {}) {
  const [, setLocation] = useLocation();
  const { sharedState, updateSharedState, firebaseUser } = useApp();
  const userProfile = sharedState?.userProfile || getPersistentUserProfile();

  // 🔄 실시간 일일 타로 동기화 틱
  const [syncTick, setSyncTick] = useState<number>(0);
  useEffect(() => {
    const handleDailyUpdate = () => {
      setSyncTick((t) => t + 1);
    };
    window.addEventListener('prism:daily_oracle_updated', handleDailyUpdate);
    window.addEventListener('storage', handleDailyUpdate);
    window.addEventListener('focus', handleDailyUpdate);
    return () => {
      window.removeEventListener('prism:daily_oracle_updated', handleDailyUpdate);
      window.removeEventListener('storage', handleDailyUpdate);
      window.removeEventListener('focus', handleDailyUpdate);
    };
  }, []);

  const handleGoToTarot = useCallback((focusDaily = true) => {
    if (onNavigateToTarot) {
      onNavigateToTarot(focusDaily);
    } else {
      window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: 'tarot', focusDaily } }));
    }
  }, [onNavigateToTarot]);

  // 사주 명리 정밀 계산 (기본값 내장으로 미입력 시에도 완벽한 명식 및 오행 분석 보장)
  const saju = useMemo(() => {
    if (userProfile?.basic?.birthdate) {
      return calculateDetailedSaju(userProfile);
    }
    return calculateDetailedSaju({
      basic: {
        name: (userProfile?.basic?.name && userProfile.basic.name !== '여행자') ? userProfile.basic.name : '제제',
        nickname: (userProfile?.basic?.nickname && userProfile.basic.nickname !== '여행자') ? userProfile.basic.nickname : '제제',
        birthdate: '1995-05-15',
        birthtime: '12:00',
        gender: (userProfile?.basic?.gender as any) || 'female',
      },
    });
  }, [userProfile]);

  // 🌌 오늘의 천문 날짜 키 & 당일 사주 일진 리포트 (천간/지지, 십신, 오행 조화, 보약 처방)
  const todayDateKey = useMemo(() => getTodayDateKey(), []);

  const dailySaju: DailySajuReport | null = useMemo(() => {
    if (!saju) return null;
    try {
      return generateDailySajuReport(saju, new Date());
    } catch (e) {
      console.error('[TrinityOracleSection] daily saju error:', e);
      return null;
    }
  }, [saju]);

  // 🔮 오늘 뽑은 데일리 타로의 전체 결과(카드, 진단, 3줄 요약, 처방, 행운 파동 등) 조회
  const todayDailyResultData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const uid = firebaseUser?.uid || 'guest';
      const candidateKeys = [
        getTrinityDailyResultKey(uid),
        getTrinityDailyResultKey('guest'),
        `trinity_daily_result_${uid}_${todayDateKey}`,
        `trinity_daily_result_guest_${todayDateKey}`,
        `prism_daily_oracle_trinity_${todayDateKey}`,
      ];

      for (const k of candidateKeys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.drawnCard || parsed?.card || parsed?.diagnosis || parsed?.summary) {
            return parsed;
          }
        }
      }

      // Check sharedState
      if (sharedState?.todayOracles?.[todayDateKey]?.trinity) {
        const trinityData = sharedState.todayOracles[todayDateKey].trinity;
        if (trinityData?.drawnCard || trinityData?.card || trinityData?.diagnosis || trinityData?.summary) {
          return trinityData;
        }
      }
      if (sharedState?.latestDailyOracles?.trinity?.dateKey === todayDateKey) {
        const trinityData = sharedState.latestDailyOracles.trinity;
        if (trinityData?.drawnCard || trinityData?.card || trinityData?.diagnosis || trinityData?.summary) {
          return trinityData;
        }
      }

      // Fallback search across all local storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('trinity_daily_result_') || key.startsWith('limit_daily_trinity_')) && key.endsWith(todayDateKey)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed?.drawnCard || parsed?.card || parsed?.diagnosis || parsed?.summary) {
                return parsed;
              }
            } catch (_) {}
          }
        }
      }
    } catch (e) {
      console.warn('[TrinityOracleSection] daily tarot result lookup error:', e);
    }
    return null;
  }, [firebaseUser?.uid, todayDateKey, sharedState?.todayOracles, sharedState?.latestDailyOracles, syncTick]);

  // 🔮 오늘의 타로 지배 카드 (Cosmic Anchor) - 오늘 직접 뽑은 일일 타로가 있으면 우선 연동, 미추첨 시 당일 천문 시드 기반 결정
  const todayDailyTarot: TarotCard = useMemo(() => {
    const rawCard = todayDailyResultData?.drawnCard || todayDailyResultData?.card;
    if (rawCard) {
      const found = TAROT_DECK.find(
        (c) => c.id === rawCard.id || c.name === rawCard.name || c.nameKo === rawCard.nameKo
      );
      if (found) {
        const isRev = Boolean(
          rawCard.reversed === true ||
          rawCard.reversed === 'true' ||
          rawCard.isReversed === true ||
          rawCard.isReversed === 'true' ||
          rawCard.orientation === 'reversed' ||
          (rawCard.nameKo && (rawCard.nameKo.includes('(역)') || rawCard.nameKo.includes('(역방향)'))) ||
          (rawCard.name && (rawCard.name.includes('(Rev)') || rawCard.name.includes('(Reversed)')))
        );
        return {
          ...found,
          reversed: isRev,
        };
      }
    }
    const seed = todayDateKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const majorCards = TAROT_DECK.filter(c => c.type === 'major');
    return majorCards[seed % majorCards.length] || TAROT_DECK[0];
  }, [todayDailyResultData, todayDateKey]);

  const todayDailyTarotDetails = useMemo(() => {
    return getTarotCardDetails(todayDailyTarot);
  }, [todayDailyTarot]);

  const hasTodayDailyResult = useMemo(() => {
    return Boolean(
      todayDailyResultData?.diagnosis ||
      todayDailyResultData?.summary ||
      todayDailyResultData?.drawnCard ||
      todayDailyResultData?.conciseSummaryBullets ||
      todayDailyResultData?.concise_summary
    );
  }, [todayDailyResultData]);

  // 사주 정보 빠른 수정 모달 상태
  const [showSajuModal, setShowSajuModal] = useState<boolean>(false);
  const [editName, setEditName] = useState(
    (userProfile?.basic?.nickname && userProfile.basic.nickname !== '여행자')
      ? userProfile.basic.nickname
      : ((userProfile?.basic?.name && userProfile.basic.name !== '여행자') ? userProfile.basic.name : '제제')
  );
  const [editBirthdate, setEditBirthdate] = useState(userProfile?.basic?.birthdate || '1995-05-15');
  const [editBirthtime, setEditBirthtime] = useState(userProfile?.basic?.birthtime || '12:00');
  const [editGender, setEditGender] = useState<'male' | 'female'>(
    userProfile?.basic?.gender === 'male' ? 'male' : 'female'
  );

  const handleSaveSajuProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updatedProfile = {
      ...(userProfile || {}),
      basic: {
        ...(userProfile?.basic || {}),
        name: editName.trim() || '제제',
        birthdate: editBirthdate,
        birthtime: editBirthtime,
        gender: editGender,
      },
    };
    setPersistentUserProfile(updatedProfile);
    setShowSajuModal(false);
  };

  // 1. Triple Mode State ('healing' | 'growth' | 'miracle') with persistence and URL/session support
  const [oracleMode, setOracleMode] = useState<OracleMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const urlMode = searchParams.get('mode') || searchParams.get('oracleMode');
        if (urlMode === 'healing' || urlMode === 'growth' || urlMode === 'miracle') {
          return urlMode;
        }
        if (urlMode === 'acim') {
          return 'miracle';
        }
        const sessionMode = sessionStorage.getItem('prism_oracle_target_mode');
        if (sessionMode === 'healing' || sessionMode === 'growth' || sessionMode === 'miracle') {
          sessionStorage.removeItem('prism_oracle_target_mode');
          return sessionMode;
        }
        if (sessionMode === 'acim') {
          sessionStorage.removeItem('prism_oracle_target_mode');
          return 'miracle';
        }
        const savedMode = localStorage.getItem(STORAGE_ORACLE_MODE);
        if (savedMode === 'healing' || savedMode === 'growth' || savedMode === 'miracle') {
          return savedMode;
        }
        if (savedMode === 'acim') {
          return 'miracle';
        }
      } catch (_) {}
    }
    return 'healing';
  });

  const [zoomedCard, setZoomedCard] = useState<{ card: TarotCard; slotName?: string } | null>(null);

  // Track whether the user has explicitly selected a mode or needs to choose
  // 🌟 사용자 요청: "오라클타로 모드직접선택 화면을 오라클타로 초기화면으로 수정"
  // 기본적으로 진입 시 모드 직접 선택 화면(isModeChosen = false)을 초기화면으로 표시
  const [isModeChosen, setIsModeChosen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const urlMode = searchParams.get('mode') || searchParams.get('oracleMode');
        if (urlMode === 'healing' || urlMode === 'growth' || urlMode === 'miracle' || urlMode === 'acim') return true;
        const sessionMode = sessionStorage.getItem('prism_oracle_target_mode');
        if (sessionMode === 'healing' || sessionMode === 'growth' || sessionMode === 'miracle' || sessionMode === 'acim') return true;
      } catch (_) {}
    }
    return false;
  });

  const handleResetToModeSelection = useCallback(() => {
    setIsModeChosen(false);
    setSelectedCardIdx(0);
    stopTTS();
  }, []);

  // 질문자 명칭 추출 (닉네임 최우선 호칭)
  const recipientName = useMemo(() => {
    const rawNick = userProfile?.basic?.nickname?.trim();
    if (rawNick && rawNick !== '여행자') {
      return rawNick;
    }
    const rawName = userProfile?.basic?.name?.trim();
    if (rawName && rawName !== '여행자') {
      return rawName;
    }
    return '제제';
  }, [userProfile?.basic?.nickname, userProfile?.basic?.name]);

  // 🌿 제제 전용 다정한 호칭
  const jejeName = useMemo(() => {
    if (!recipientName || recipientName === '제제') return '제제';
    return extractGivenName(recipientName);
  }, [recipientName]);

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSummaryCopied, setIsSummaryCopied] = useState<boolean>(false);

  // 2. Card Draw Stage State ('intro' | 'spread' | 'result')
  const [stage, setStage] = useState<'intro' | 'spread' | 'result'>('spread');
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 3. Results State
  const [healingResult, setHealingResult] = useState<HealingResult | null>(null);
  const [growthResult, setGrowthResult] = useState<GrowthResult | null>(null);
  const [miracleResult, setMiracleResult] = useState<MiracleResult | null>(null);

  // 4. Mission Completion & Rewards State
  const [isHealingCompleted, setIsHealingCompleted] = useState<boolean>(false);
  const [isGrowthCompleted, setIsGrowthCompleted] = useState<boolean>(false);
  const [isMiracleCompleted, setIsMiracleCompleted] = useState<boolean>(false);
  const [treasures, setTreasures] = useState<CollectedTreasure[]>([]);
  const [showTreasureModal, setShowTreasureModal] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(1);

  // 🎴 20종 타로 덱 뒷면 커스텀 상태
  const { theme: tarotBackTheme, cardBackId } = useTarotCardBack();
  const [showCardBackModal, setShowCardBackModal] = useState<boolean>(false);

  // 🌟 오늘 전체 운기를 관통하는 데일리 지배 타로 카드 (오늘의 타로 결과 및 정/역방향 동기화)
  const todayAnchorCard = todayDailyTarot;

  // Card tab view state
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);
  const [showAllCardsTogether, setShowAllCardsTogether] = useState<boolean>(true);

  // TTS State
  const isTTSActive = useTTSActive();
  const ttsState = useTTSState();
  const [inquiryText, setInquiryText] = useState<string>('');

  // 🌟 오늘의 오라클 당일 1회 세션 및 복원 상태 (힐링/자기계발/기적수업 모두 1일 1회 엄격 적용)
  const [todayDailySession, setTodayDailySession] = useState<SavedDailyOracleSession | null>(() =>
    loadTodayOracleSession(oracleMode, todayDateKey, sharedState)
  );

  const healingTodaySession = useMemo(
    () => loadTodayOracleSession('healing', todayDateKey, sharedState),
    [todayDateKey, syncTick, sharedState]
  );
  const growthTodaySession = useMemo(
    () => loadTodayOracleSession('growth', todayDateKey, sharedState),
    [todayDateKey, syncTick, sharedState]
  );
  const miracleTodaySession = useMemo(
    () => loadTodayOracleSession('miracle', todayDateKey, sharedState),
    [todayDateKey, syncTick, sharedState]
  );

  // 모드 변경 또는 마운트 시 당일 저장된 오라클 세션 동기화 (1일 1회 완료된 경우 결과 자동 복원)
  useEffect(() => {
    const saved = loadTodayOracleSession(oracleMode, todayDateKey, sharedState);
    setTodayDailySession(saved);
    if (saved && (saved.healingResult || saved.growthResult || saved.miracleResult)) {
      if (saved.drawnCards && saved.drawnCards.length > 0) setDrawnCards(saved.drawnCards);
      if (oracleMode === 'healing' && saved.healingResult) setHealingResult(saved.healingResult);
      if (oracleMode === 'growth' && saved.growthResult) setGrowthResult(saved.growthResult);
      if (oracleMode === 'miracle' && saved.miracleResult) setMiracleResult(saved.miracleResult);
      if (saved.inquiryText) setInquiryText(saved.inquiryText);
      setStage('result');
    }
  }, [oracleMode, todayDateKey, sharedState]);

  // 클라우드 실시간 동기화 헬퍼 (PC <-> 모바일 양방향 실시간 보존)
  const syncOracleSessionToCloud = useCallback((mode: OracleMode, session: SavedDailyOracleSession) => {
    const sessionKey = `${mode}_${todayDateKey}`;
    try {
      const jsonStr = JSON.stringify(session);
      localStorage.setItem(getDailyOracleStorageKey(mode, todayDateKey), jsonStr);
      localStorage.setItem(`prism_trinity_oracle_session_${mode}_${todayDateKey}`, jsonStr);
      localStorage.setItem(`prism_oracle_${mode}_${todayDateKey}`, jsonStr);
      sessionStorage.setItem(getDailyOracleStorageKey(mode, todayDateKey), jsonStr);

      window.dispatchEvent(new CustomEvent('prism:oracle_session_updated', {
        detail: { mode, dateKey: todayDateKey, session, oracleSessions: { [sessionKey]: session } }
      }));
      window.dispatchEvent(new CustomEvent('prism:realtime_sync', {
        detail: { oracleSessions: { [sessionKey]: session } }
      }));

      void updateSharedState({
        oracleSessions: {
          ...(sharedState?.oracleSessions || {}),
          [sessionKey]: session,
        },
        todayOracles: {
          ...(sharedState?.todayOracles || {}),
          [todayDateKey]: {
            ...((sharedState?.todayOracles || {})[todayDateKey] || {}),
            [`oracle_${mode}`]: {
              mode,
              dateKey: todayDateKey,
              cards: session.drawnCards?.map(c => c.nameKo || c.name),
              summary: mode === 'healing' ? session.healingResult?.message : mode === 'miracle' ? session.miracleResult?.message : session.growthResult?.macro_focus,
              timestamp: Date.now(),
            }
          }
        }
      }, 'trinity_oracle');
    } catch (_) {}
  }, [sharedState, todayDateKey, updateSharedState]);

  // 실시간 기기 간 오라클 세션 수신 리스너 (PC에서 뽑으면 모바일에서도 즉시 반영)
  useEffect(() => {
    const handleOracleSync = (e?: Event) => {
      const detail = (e as CustomEvent)?.detail;
      let directSession: SavedDailyOracleSession | null = null;
      if (detail) {
        if (detail.session && detail.mode === oracleMode) {
          directSession = detail.session;
        } else if (detail.oracleSessions?.[`${oracleMode}_${todayDateKey}`]) {
          directSession = detail.oracleSessions[`${oracleMode}_${todayDateKey}`];
        } else if (detail[`${oracleMode}_${todayDateKey}`]) {
          directSession = detail[`${oracleMode}_${todayDateKey}`];
        }
      }

      const saved = directSession || loadTodayOracleSession(oracleMode, todayDateKey, sharedState);
      if (saved) {
        setTodayDailySession(saved);
        if (saved.drawnCards && saved.drawnCards.length > 0) {
          setDrawnCards(saved.drawnCards);
          if (saved.healingResult && oracleMode === 'healing') setHealingResult(saved.healingResult);
          if (saved.growthResult && oracleMode === 'growth') setGrowthResult(saved.growthResult);
          if (saved.miracleResult && oracleMode === 'miracle') setMiracleResult(saved.miracleResult);
        }
      }
      try {
        const tr = localStorage.getItem(STORAGE_HEALING_TREASURES);
        if (tr) setTreasures(JSON.parse(tr));
        const gr = localStorage.getItem(STORAGE_GROWTH_LOGS);
        if (gr) {
          const parsed = JSON.parse(gr);
          setStreakCount(parsed.streak || 1);
          if (parsed.lastDate === new Date().toISOString().split('T')[0] && parsed.completed) {
            setIsGrowthCompleted(true);
          }
        }
      } catch (_) {}
      setSyncTick((t) => t + 1);
    };

    window.addEventListener('prism:oracle_session_updated', handleOracleSync);
    window.addEventListener('prism:realtime_sync', handleOracleSync);
    return () => {
      window.removeEventListener('prism:oracle_session_updated', handleOracleSync);
      window.removeEventListener('prism:realtime_sync', handleOracleSync);
    };
  }, [oracleMode, todayDateKey, sharedState]);

  // 오늘 결과 보기 핸들러
  const handleRestoreTodayOracle = useCallback((targetMode?: OracleMode) => {
    const mode = targetMode || oracleMode;
    const saved = loadTodayOracleSession(mode, todayDateKey, sharedState) || todayDailySession;
    if (!saved) return;
    if (saved.drawnCards && saved.drawnCards.length > 0) {
      setDrawnCards(saved.drawnCards);
    }
    if (saved.inquiryText) setInquiryText(saved.inquiryText);
    if (mode === 'healing' && saved.healingResult) {
      setHealingResult(saved.healingResult);
    } else if (mode === 'growth' && saved.growthResult) {
      setGrowthResult(saved.growthResult);
    } else if (mode === 'miracle' && saved.miracleResult) {
      setMiracleResult(saved.miracleResult);
    }
    setOracleMode(mode);
    setIsModeChosen(true);
    setStage('result');
  }, [oracleMode, todayDateKey, sharedState, todayDailySession]);

  // 🌟 당일 완료된 결과가 있는 경우 카드뽑기 화면(spread)을 건너뛰고 즉시 결과 화면으로 자동 전환
  useEffect(() => {
    if (stage === 'spread') {
      const saved = loadTodayOracleSession(oracleMode, todayDateKey, sharedState);
      if (saved && (saved.healingResult || saved.growthResult || saved.miracleResult)) {
        handleRestoreTodayOracle();
      }
    }
  }, [stage, oracleMode, todayDateKey, sharedState, handleRestoreTodayOracle]);

  // 🚪 오라클 카드 선택창 닫기 핸들러: 기존 저장된 세션이 있으면 결과창으로, 없으면 모드 선택창으로 안전하게 복귀
  const handleCancelOracleSpread = useCallback(() => {
    const saved = loadTodayOracleSession(oracleMode, todayDateKey, sharedState);
    if (saved && (saved.healingResult || saved.growthResult || saved.miracleResult)) {
      handleRestoreTodayOracle();
    } else {
      setIsModeChosen(false);
      setStage('spread');
    }
    stopTTS();
  }, [oracleMode, todayDateKey, sharedState, handleRestoreTodayOracle]);

  // Load collected treasures and growth records on mount
  useEffect(() => {
    try {
      const savedTreasures = localStorage.getItem(STORAGE_HEALING_TREASURES);
      if (savedTreasures) {
        setTreasures(JSON.parse(savedTreasures));
      }
      const savedGrowth = localStorage.getItem(STORAGE_GROWTH_LOGS);
      if (savedGrowth) {
        const parsed = JSON.parse(savedGrowth);
        setStreakCount(parsed.streak || 1);
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.lastDate === todayStr && parsed.completed) {
          setIsGrowthCompleted(true);
        }
      }
    } catch (e) {
      console.warn('Failed to parse oracle local storage', e);
    }
  }, []);

  // 78-card full deck for all modes
  const fullDeck = useMemo(() => TAROT_DECK, []);
  const activeDeckSource = fullDeck;

  const slotPositions = useMemo(() => {
    if (oracleMode === 'healing') {
      return ['과거 / 무의식의 뿌리', '현재 / 상황과 마음의 흐름', '미래 / 조언과 해결의 열쇠'];
    }
    if (oracleMode === 'miracle') {
      return ['에고의 환영과 두려움', '거룩한 순간과 지각의 전환', '참된 용서와 평화의 기적'];
    }
    return ['자기계발 마인드셋', '4원소 역량 영역', '1줄 마이크로 실행'];
  }, [oracleMode]);

  // 🌟 오라클 핵심 3줄 요약 추출 (사주 원국 ✕ 타로 3카드 융합 정밀 분석)
  const oracleSummaryBullets = useMemo(() => {
    let rawBullets: string[] = [];

    if (oracleMode === 'healing') {
      if (!healingResult) return [];
      if (healingResult.concise_summary && healingResult.concise_summary.length === 3) {
        rawBullets = healingResult.concise_summary;
      } else {
        rawBullets = extractOracleConciseSummary({
          message: healingResult.message,
          oracleMode: 'healing',
          cards: drawnCards,
          saju,
          todayCard: todayAnchorCard,
          microAction: healingResult.micro_action || healingResult.reward_item,
        });
      }
    } else if (oracleMode === 'miracle') {
      if (!miracleResult) return [];
      if (miracleResult.concise_summary && miracleResult.concise_summary.length === 3) {
        rawBullets = miracleResult.concise_summary;
      } else {
        rawBullets = extractOracleConciseSummary({
          message: miracleResult.message,
          oracleMode: 'miracle',
          cards: drawnCards,
          saju,
          todayCard: todayAnchorCard,
          microAction: miracleResult.micro_action || miracleResult.reward_item,
        });
      }
    } else {
      if (!growthResult) return [];
      if (growthResult.concise_summary && growthResult.concise_summary.length === 3) {
        rawBullets = growthResult.concise_summary;
      } else {
        rawBullets = extractOracleConciseSummary({
          message: growthResult.message || growthResult.macro_focus,
          oracleMode: 'growth',
          cards: drawnCards,
          saju,
          todayCard: todayAnchorCard,
          macroFocus: growthResult.macro_focus,
          microMission: growthResult.micro_mission,
        });
      }
    }

    if (!rawBullets || rawBullets.length === 0) return [];
    const expectedTags = oracleMode === 'miracle'
      ? ['마음의 환영', '지각의 전환', '기적의 선언']
      : ['현재 에너지', '방향과 결단', '실천 처방'];

    return rawBullets.slice(0, 3).map((bullet, idx) => {
      const match = bullet.match(/^\[([^\]]+)\]\s*(.*)$/);
      let content = match ? match[2].trim() : bullet.trim();
      content = content.replace(/[\s.…·,-]+$/, '');
      if (content.length > 125) {
        const dotIdx = content.lastIndexOf('.', 115);
        if (dotIdx > 45) {
          content = content.slice(0, dotIdx + 1);
        }
      }
      content = content.replace(/[\s.…·,-]+$/, '');
      if (!/[.!?]$/.test(content)) content += '.';
      const tag = expectedTags[idx] || '실천 처방';
      return `[${tag}] ${content}`;
    });
  }, [oracleMode, healingResult, growthResult, miracleResult, drawnCards, saju, todayAnchorCard]);

  // 🔮 78장 오라클 결과 공유 & 이미지 카드 익스포트 데이터
  const oracleShareData: TarotShareData = useMemo(() => {
    const activeResult = oracleMode === 'healing'
      ? healingResult
      : oracleMode === 'miracle'
      ? miracleResult
      : growthResult;

    const letterMsg = oracleMode === 'healing'
      ? healingResult?.message
      : oracleMode === 'miracle'
      ? miracleResult?.message
      : (growthResult?.message || growthResult?.macro_focus);

    const oracleTitle = oracleMode === 'healing'
      ? '사주 ✕ 타로 콜라보 오라클'
      : oracleMode === 'miracle'
      ? '기적수업 지각전환 오라클'
      : '루시의 4원소 마인드셋 오라클';

    const defaultConcern = oracleMode === 'healing'
      ? '사주 ✕ 타로 융합 운명 성찰'
      : oracleMode === 'miracle'
      ? '에고의 환영을 넘어선 참된 용서'
      : '현실 성장과 돌파';

    const spreadTitle = oracleMode === 'healing'
      ? '사주 ✕ 타로 3카드 스프레드 (과거·현재·미래)'
      : oracleMode === 'miracle'
      ? '기적수업 3카드 거룩한 순간 스프레드'
      : '4원소 마인드셋 스프레드 (3장)';

    return {
      title: oracleTitle,
      concern: inquiryText || defaultConcern,
      spreadName: spreadTitle,
      cards: drawnCards.map((c, i) => ({
        id: c.id,
        nameKo: c.nameKo,
        name: c.name,
        reversed: !!c.reversed,
        keywords: c.keywords,
        imageUrl: getTarotCardImageUrl(c),
        slotName: slotPositions[i],
      })),
      dateStr: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      diagnosis: letterMsg,
      conciseSummaryBullets: oracleSummaryBullets.length > 0 ? oracleSummaryBullets : undefined,
      adviceHeadline: activeResult?.card_insights?.[2]?.personal_interpretation?.slice(0, 80) || undefined,
      subtitle: oracleMode === 'miracle'
        ? `에고의 환영을 넘어 참된 용서와 하나님의 평화로 · 지배 타로 [${todayDailyTarot.nameKo}]`
        : `오늘의 지배 타로 [${todayDailyTarot.nameKo}] · 사주 일진 [${dailySaju?.dayPillar.full || '조화'}] (${dailySaju?.tenGodGan.name || '상생'})`,
      luckyColor: dailySaju?.remedy?.luckyColor || undefined,
      frequency: saju?.yongsin?.name ? `사주 용신: ${saju.yongsin.name} · 지배 카드: ${todayDailyTarot.nameKo}` : `지배 카드: ${todayDailyTarot.nameKo}`,
    };
  }, [oracleMode, healingResult, growthResult, miracleResult, inquiryText, drawnCards, slotPositions, saju, oracleSummaryBullets, todayDailyTarot, dailySaju]);

  const displayFullReadingText = useMemo(() => {
    if (oracleMode === 'healing') {
      const msg = healingResult?.message?.trim();
      const hasAllStages = Boolean(msg && msg.includes('1.') && msg.includes('2.') && msg.includes('3.') && msg.includes('4.') && msg.includes('5.'));
      if (msg && msg.length >= 1000 && hasAllStages) return msg;
      if (healingResult) {
        return buildFallbackHealingMessage(
          drawnCards,
          saju,
          todayAnchorCard,
          recipientName,
          inquiryText,
          healingResult.card_insights,
          healingResult.saju_tarot_synergy,
          healingResult.micro_action
        );
      }
      return '';
    } else if (oracleMode === 'miracle') {
      const msg = miracleResult?.message?.trim();
      const hasAllStages = Boolean(msg && msg.includes('1.') && msg.includes('2.') && msg.includes('3.') && msg.includes('4.') && msg.includes('5.'));
      if (msg && msg.length >= 1000 && hasAllStages) return msg;
      if (miracleResult) {
        return buildFallbackMiracleMessage(
          drawnCards,
          saju,
          todayAnchorCard,
          recipientName,
          inquiryText,
          miracleResult.card_insights,
          miracleResult.miracle_lesson,
          miracleResult.micro_action
        );
      }
      return '';
    } else {
      const msg = growthResult?.message?.trim() || growthResult?.macro_focus?.trim();
      if (msg && msg.length >= 50) return msg;
      if (growthResult) {
        return buildFallbackGrowthMessage(
          drawnCards,
          saju,
          todayAnchorCard,
          recipientName,
          inquiryText,
          growthResult.macro_focus,
          growthResult.micro_mission
        );
      }
      return '';
    }
  }, [oracleMode, healingResult, growthResult, miracleResult, drawnCards, saju, todayAnchorCard, recipientName, inquiryText]);

  // 🔮 오라클 연속 추가 질문 & 잔여 덱 관리 엔진 (모드별 독립 보존)
  const oracleFollowUpStorageKey = `prism_oracle_followup_${oracleMode}_${todayDateKey}`;

  const [oracleFollowUpEntries, setOracleFollowUpEntries] = useState<FollowUpTarotEntry[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`prism_oracle_followup_${oracleMode}_${todayDateKey}`);
        if (cached) return JSON.parse(cached);
      }
    } catch (_) {}
    return [];
  });

  const [isOracleFollowUpGenerating, setIsOracleFollowUpGenerating] = useState<boolean>(false);
  const [showOracleFollowUpWheelModal, setShowOracleFollowUpWheelModal] = useState<boolean>(false);
  const [pendingOracleFollowUpQuestion, setPendingOracleFollowUpQuestion] = useState<string>('');

  // Persist oracle follow-up entries on change
  useEffect(() => {
    try {
      localStorage.setItem(oracleFollowUpStorageKey, JSON.stringify(oracleFollowUpEntries));
    } catch (_) {}
  }, [oracleFollowUpEntries, oracleFollowUpStorageKey]);

  // Synchronize follow-up entries on mode or date change
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`prism_oracle_followup_${oracleMode}_${todayDateKey}`);
      if (cached) {
        setOracleFollowUpEntries(JSON.parse(cached));
      } else {
        setOracleFollowUpEntries([]);
      }
    } catch (_) {
      setOracleFollowUpEntries([]);
    }
  }, [oracleMode, todayDateKey]);

  // 잔여 덱 무결성 보장: 이미 뽑힌 3장의 카드 + 누적된 추가 질문 카드들을 완전 제외
  const oracleDrawnCardIds = useMemo(() => {
    const ids = new Set<string>();
    drawnCards.forEach((c) => { if (c?.id) ids.add(c.id); });
    (oracleFollowUpEntries || []).forEach((entry) => { if (entry?.card?.id) ids.add(entry.card.id); });
    return ids;
  }, [drawnCards, oracleFollowUpEntries]);

  const oracleRemainingDeck = useMemo(() => {
    return TAROT_DECK.filter((c) => !oracleDrawnCardIds.has(c.id));
  }, [oracleDrawnCardIds]);

  // 🔮 오라클 연속 심층 리딩 실행기 (사주 + 모드별 특화 LLM 스트리밍)
  const executeOracleFollowUpReading = useCallback(async (
    questionText: string,
    chosenCard: TarotCard,
    isReversed: boolean,
  ) => {
    if (isOracleFollowUpGenerating) return;

    const safeCard = chosenCard || TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
    const cardNameKo = safeCard.nameKo || safeCard.name || '타로 카드';
    const cardNameEn = safeCard.name || cardNameKo;
    const cardKeywords = Array.isArray(safeCard.keywords) ? safeCard.keywords.join(', ') : '';

    const newEntryId = `fu_oracle_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newEntry: FollowUpTarotEntry = {
      id: newEntryId,
      question: questionText,
      card: safeCard,
      reversed: isReversed,
      reading: '',
      isGenerating: true,
      createdAt: Date.now(),
    };
    setOracleFollowUpEntries((prev) => [...prev, newEntry]);
    setIsOracleFollowUpGenerating(true);

    let currentText = '';
    try {
      const modeKorean = oracleMode === 'healing' ? '힐링 타로' : oracleMode === 'miracle' ? '기적수업 타로' : '자기계발 타로';
      const initialCardsDesc = drawnCards.map((c) => `${c?.nameKo || c?.name || '카드'}(${c?.reversed ? '역방향' : '정방향'})`).join(', ');
      const sajuContext = saju?.dayMaster ? `\n[사주 일간] ${saju.dayMaster.korean || saju.dayMaster.gan} (${saju.dayMaster.element} 오행)` : '';

      const previousQAHistory = (oracleFollowUpEntries || [])
        .filter((e) => e && e.card && e.reading && !e.isGenerating)
        .map(
          (e, idx) =>
            `[추가 질문 #${idx + 1}] "${e.question || '추가 질문'}"\n[뽑힌 카드] ${e.card?.nameKo || e.card?.name || '타로 카드'} (${e.reversed ? '역방향' : '정방향'})\n[해설] ${(e.reading || '').slice(0, 250)}`,
        )
        .join('\n\n');

      const messagesForLLM = [
        {
          role: 'system',
          content: `당신은 사주 명리학과 78장 타로, 오라클 심층 성찰을 융합하는 '트리니티 오라클 마스터'입니다. 질문자가 ${modeKorean}(3카드 스프레드) 리딩을 마친 후, 이미 뽑힌 카드를 제외하고 남은 잔여 덱에서 새로운 카드를 추가로 뽑아 심층 연속 질문을 던졌습니다.${sajuContext}

[답변 규정]
1. 질문자의 구체적인 추가 질문에 대하여, 새로 뽑힌 잔여 덱 추가 카드의 도상 상징과 정/역방향 에너지를 직관적으로 관통하여 날카롭고 똑부러지게 답변하십시오.
2. 질문자의 사주 원국 본원 기운과 이번 ${modeKorean}의 핵심 지혜(${oracleMode === 'healing' ? '정서 치유와 수용' : oracleMode === 'miracle' ? '에고의 환영 해체와 평화의 지각전환' : '현실적 성장과 4원소 실행력'})를 결합하여 지금 당장 실천할 수 있는 구체적 행동 지침을 제시하십시오.
3. 한국어로 품격 있고 신뢰감 넘치는 정통 마스터의 어조를 유지하십시오.`,
        },
        {
          role: 'user',
          content: `[오라클 모드] ${modeKorean}
[내담자 고민/의제] "${inquiryText || '오라클 심층 성찰'}"
[초기 3장의 오라클 카드] ${initialCardsDesc}
[초기 리딩 요약] ${displayFullReadingText ? displayFullReadingText.slice(0, 500) : ''}
${previousQAHistory ? `\n[이전 추가질문 이력]\n${previousQAHistory}\n` : ''}
[새로 뽑힌 잔여 덱 추가 카드] ${cardNameKo} (${cardNameEn}) - ${isReversed ? '역방향' : '정방향'} / 키워드: ${cardKeywords}
[이번 추가 질문] "${questionText}"`,
        },
      ];

      const fullGenerated = await invokeLLMStream({
        messages: messagesForLLM as any,
        onChunk: (chunk) => {
          currentText += chunk;
          setOracleFollowUpEntries((prev) =>
            prev.map((e) => (e.id === newEntryId ? { ...e, reading: currentText } : e)),
          );
        },
      });

      const finalText = fullGenerated || currentText;
      setOracleFollowUpEntries((prev) =>
        prev.map((e) =>
          e.id === newEntryId ? { ...e, reading: finalText, isGenerating: false } : e,
        ),
      );
      playAudioHaptic('card_draw');
    } catch (err: any) {
      console.warn('[executeOracleFollowUpReading] Streaming interrupted, applying fallback interpretation:', err);
      const fallbackReading = `새로 뽑힌 ${cardNameKo} (${isReversed ? '역방향' : '정방향'})의 에너지는 당신의 내면에 잠재된 통찰과 치유의 가능성을 비추고 있습니다. 지금 마음속에 떠오른 첫 번째 지혜를 신뢰하고 자연스러운 호흡으로 삶의 흐름을 이어가세요.`;
      setOracleFollowUpEntries((prev) =>
        prev.map((e) =>
          e.id === newEntryId
            ? { ...e, reading: currentText.trim() ? currentText : fallbackReading, isGenerating: false }
            : e,
        ),
      );
      playAudioHaptic('card_draw');
    } finally {
      setIsOracleFollowUpGenerating(false);
    }
  }, [oracleMode, drawnCards, saju, inquiryText, displayFullReadingText, oracleFollowUpEntries, isOracleFollowUpGenerating]);

  const handleOracleDirectFollowUpDraw = useCallback((questionText: string) => {
    setPendingOracleFollowUpQuestion(questionText);
    setShowOracleFollowUpWheelModal(true);
  }, []);

  const handleOracleAutoFollowUpDraw = useCallback((questionText: string) => {
    if (isOracleFollowUpGenerating) return;
    if (oracleRemainingDeck.length === 0) return;
    const randomIndex = Math.floor(Math.random() * oracleRemainingDeck.length);
    const chosenCard = oracleRemainingDeck[randomIndex];
    const isReversed = Math.random() < 0.35;
    playAudioHaptic('card_draw');
    executeOracleFollowUpReading(questionText, chosenCard, isReversed);
  }, [oracleRemainingDeck, executeOracleFollowUpReading, isOracleFollowUpGenerating]);

  const handleOracleFollowUpWheelComplete = useCallback((selected: any[]) => {
    setShowOracleFollowUpWheelModal(false);
    if (!selected || selected.length === 0) return;
    const card = selected[0];
    const reversed = !!card.reversed;
    const q = pendingOracleFollowUpQuestion || '오라클 추가 심층 통찰과 조언';
    setPendingOracleFollowUpQuestion('');
    executeOracleFollowUpReading(q, card, reversed);
  }, [pendingOracleFollowUpQuestion, executeOracleFollowUpReading]);

  // Handle mode switch with persistent saving and daily session restore (1일 1회 원칙: 이미 완료된 경우 결과 즉시 복원)
  const handleModeSwitch = (mode: OracleMode) => {
    setOracleMode(mode);
    setIsModeChosen(true);
    try {
      localStorage.setItem(STORAGE_ORACLE_MODE, mode);
      localStorage.setItem(STORAGE_ORACLE_MODE_SELECTED, 'true');
    } catch (_) {}

    const saved = loadTodayOracleSession(mode, todayDateKey, sharedState);
    setTodayDailySession(saved);
    stopTTS();
    setSelectedCardIdx(0);
    setShowAllCardsTogether(true);

    if (saved && (saved.healingResult || saved.growthResult || saved.miracleResult)) {
      if (saved.drawnCards && saved.drawnCards.length > 0) {
        setDrawnCards(saved.drawnCards);
      }
      if (mode === 'healing' && saved.healingResult) setHealingResult(saved.healingResult);
      if (mode === 'growth' && saved.growthResult) setGrowthResult(saved.growthResult);
      if (mode === 'miracle' && saved.miracleResult) setMiracleResult(saved.miracleResult);
      if (saved.inquiryText) setInquiryText(saved.inquiryText);
      setStage('result');
    } else {
      setStage('spread');
      setDrawnCards([]);
      setHealingResult(null);
      setGrowthResult(null);
      setMiracleResult(null);
      setIsHealingCompleted(false);
      setIsGrowthCompleted(false);
      setIsMiracleCompleted(false);
    }
  };

  // 🎯 토스된 글자 자동 수신 및 3장 오라클 즉시 실행
  useEffect(() => {
    const triggerAutoOracle = (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2) return;
      sessionStorage.removeItem('prism_auto_execute_text');
      setInquiryText(trimmed);

      // Determine intent (miracle vs healing vs growth)
      const isMiracleIntent = /(?:기적수업|기적|acim|용서|지각\s*전환|거룩한\s*순간|에고|원한|속죄|하나님의\s*평화|참마음)/i.test(trimmed);
      const isHealingIntent = /(?:힐링|치유|내면|마음|상처|위로|휴식|쉼|불안|스트레스|우울|눈물|지친|아파)/i.test(trimmed);
      const isGrowthIntent = /(?:성장|계발|실행|목표|사업|역량|커리어|공부|성공|돈|부자|습관|루틴|돌파)/i.test(trimmed);
      const savedMode = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_ORACLE_MODE) as OracleMode | null) : null;
      const targetMode: OracleMode = isMiracleIntent
        ? 'miracle'
        : isHealingIntent
        ? 'healing'
        : isGrowthIntent
        ? 'growth'
        : (savedMode === 'healing' || savedMode === 'growth' || savedMode === 'miracle')
        ? savedMode
        : 'healing';

      setOracleMode(targetMode);
      setIsModeChosen(true);
      try {
        localStorage.setItem(STORAGE_ORACLE_MODE, targetMode);
        localStorage.setItem(STORAGE_ORACLE_MODE_SELECTED, 'true');
      } catch (_) {}

      const existing = loadTodayOracleSession(targetMode, todayDateKey, sharedState);
      if (existing && (existing.healingResult || existing.growthResult || existing.miracleResult)) {
        if (existing.drawnCards && existing.drawnCards.length > 0) setDrawnCards(existing.drawnCards);
        if (targetMode === 'healing' && existing.healingResult) setHealingResult(existing.healingResult);
        if (targetMode === 'growth' && existing.growthResult) setGrowthResult(existing.growthResult);
        if (targetMode === 'miracle' && existing.miracleResult) setMiracleResult(existing.miracleResult);
        setStage('result');
        return;
      }

      const deck = TAROT_DECK;
      const seedNum = trimmed.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
      const shuffled = [...deck].sort((a, b) => {
        const hashA = (a.id.charCodeAt(0) * 31 + seedNum) % 1000;
        const hashB = (b.id.charCodeAt(0) * 31 + seedNum) % 1000;
        return hashA - hashB;
      });
      const selected3: SelectedTarotCardEntry[] = shuffled.slice(0, 3).map((c, i) => ({
        ...c,
        slotIndex: i,
        reversed: false,
      }));

      setTimeout(() => {
        void handleCardsComplete(selected3, trimmed);
      }, 120);
    };

    if (typeof window !== 'undefined') {
      const autoText = sessionStorage.getItem('prism_auto_execute_text');
      if (autoText) {
        triggerAutoOracle(autoText);
      }
    }

    const handleExecute = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && detail.text && (detail.tab === 'oracle' || detail.targetMenuId?.includes('trinity') || detail.targetMenu?.path?.includes('oracle'))) {
        triggerAutoOracle(detail.text);
      }
    };
    window.addEventListener('prism:selection_execute', handleExecute);
    return () => window.removeEventListener('prism:selection_execute', handleExecute);
  }, []);

  // Run AI analysis after 3 cards are drawn (Preserve reversed orientation for both reading and zoom modal)
  const handleCardsComplete = async (cards: SelectedTarotCardEntry[], queryInquiry?: string) => {
    // 🛡️ 1일 1회 엄격 가드: 이미 당일 완료된 세션이 있는 경우 다시 뽑기/재분석 차단 및 기존 결과 복원
    const existing = loadTodayOracleSession(oracleMode, todayDateKey, sharedState);
    if (existing && (existing.healingResult || existing.growthResult || existing.miracleResult)) {
      handleRestoreTodayOracle();
      return;
    }

    const effectiveInquiry = queryInquiry !== undefined ? queryInquiry : inquiryText;
    if (effectiveInquiry && effectiveInquiry !== inquiryText) {
      setInquiryText(effectiveInquiry);
    }
    setDrawnCards(cards);
    setStage('result');
    setIsLoading(true);
    stopTTS();

    const sajuNameStr = saju?.name || recipientName || '내담자';
    const dayMasterStr = saju ? `${saju.dayMaster.hanja}(${saju.dayMaster.korean} · ${saju.dayMaster.symbolName})` : '본원 기운';
    const domElStr = saju?.elements?.dominant?.name || '우세 오행';
    const lackElStr = saju?.elements?.lacking?.name || '결핍 오행';
    const yongsinStr = saju?.yongsin?.name || '용신 보약';

    const cardDescriptions = cards
      .map((c, i) => {
        const d = getTarotCardDetails(c);
        const orientStr = c.reversed ? ' [역방향 (Reversed)]' : ' [정방향 (Upright)]';
        const detailStr = d
          ? ` | 도상 상징: [${d.symbolWord}], 영적 원형: [${d.archetype}], 본래 뜻: [${c.reversed ? d.reversedCore : d.uprightCore}]`
          : '';
        return `${i + 1}번 슬롯 [${slotPositions[i]}]: ${c.nameKo} (${c.name})${orientStr} - 유형: ${c.type}, 핵심 키워드: [${c.keywords.join(', ')}]${detailStr}`;
      })
      .join('\n');

    // Dynamically determine candidate masterpiece matching these specific 3 cards from MUSE_ART_CATALOG
    const dynamicPrescribedArt = resolvePrescribedArtForCards(cards, saju, oracleMode);

    const dailyDiagnosis = todayDailyResultData?.diagnosis || todayDailyResultData?.summary || '';
    const dailyRemedy = todayDailyResultData?.remedy || '';
    const dailyEnergy = todayDailyResultData?.spiritualEnergy || '';
    const dailyBullets = Array.isArray(todayDailyResultData?.conciseSummaryBullets)
      ? todayDailyResultData.conciseSummaryBullets
      : Array.isArray(todayDailyResultData?.concise_summary)
      ? todayDailyResultData.concise_summary
      : [];
    const dailyBulletsStr = dailyBullets.length > 0 ? dailyBullets.map((b: string) => `    * ${b}`).join('\n') : '';

    const sajuContextPrompt = saju
      ? `
# 질문자의 사주명리학(四柱命理) 정밀 원국:
- 이름 및 성별: ${saju.name} (${saju.gender})
- 일간(Day Master) 본원: ${saju.dayMaster.hanja}(${saju.dayMaster.korean}) — ${saju.dayMaster.symbolName}
  * 영적 아키타입: ${saju.dayMaster.archetypeTitle}
  * 핵심 기질 키워드: ${saju.dayMaster.coreKeywords.join(', ')}
  * 본원 성향: ${saju.dayMaster.personalityEssence}
- 사주 4주 8자: 년주(${saju.pillars.year.full}) | 월주(${saju.pillars.month.full}) | 일주(${saju.pillars.day.full})${saju.pillars.hour ? ` | 시주(${saju.pillars.hour.full})` : ''}
- 오행 구성: 목(${saju.elements.counts.목}개) · 화(${saju.elements.counts.화}개) · 토(${saju.elements.counts.토}개) · 금(${saju.elements.counts.금}개) · 수(${saju.elements.counts.수}개)
- 최강 우세 오행: ${saju.elements.dominant.name} (${saju.elements.dominant.advice})
- 결핍 오행 및 용신 보약: ${saju.elements.lacking.name} (용신: ${saju.yongsin.name} - ${saju.yongsin.actionTip})
- 2026 병오년(丙午年) 세운 흐름: ${saju.annual2026.theme} (${saju.annual2026.keyOpportunity})

# [★ 2026 오늘의 일일 타로 결과 연동 (Today's Daily Tarot Connection)]:
- 오늘의 타로 카드: [${todayAnchorCard.nameKo}] (${todayAnchorCard.name}${todayAnchorCard.reversed ? ' • 역방향 [Reversed]' : ' • 정방향 [Upright]'})
- 카드의 핵심 키워드: [${todayAnchorCard.keywords.join(', ')}]
${todayDailyTarotDetails ? `- 도상 상징: [${todayDailyTarotDetails.symbolWord}], 원형: [${todayDailyTarotDetails.archetype}], 본래 뜻: [${todayAnchorCard.reversed ? todayDailyTarotDetails.reversedCore : todayDailyTarotDetails.uprightCore}]` : ''}
${hasTodayDailyResult ? `- 질문자가 오늘 직접 뽑은 오늘의 타로 진단:\n  "${dailyDiagnosis}"
${dailyRemedy ? `- 오늘의 타로 맞춤 처방 및 조언:\n  "${dailyRemedy}"` : ''}
${dailyEnergy ? `- 오늘의 영적 기저 에너지:\n  "${dailyEnergy}"` : ''}
${dailyBulletsStr ? `- 오늘의 타로 핵심 요약:\n${dailyBulletsStr}` : ''}` : `- (당일 천문 시드 지배 카드 기저 에너지 작용)`}

★ [★ 필수 연동 및 심층 리딩 지침]:
1. 오라클 타로는 일반 타로보다 훨씬 더 길고 자세하며, 방대하고 정밀한 영적/운명적 청사진을 제공하는 상위 오라클입니다.
2. 질문자가 오늘 마주한 기저 운기는 오늘의 타로([${todayAnchorCard.nameKo}])의 상징과 진단 내용에 의해 이미 첫 단추가 채워져 있습니다.
3. 이번에 새로 뽑힌 3장의 오라클 카드(1번: ${cards[0]?.nameKo}, 2번: ${cards[1]?.nameKo}, 3번: ${cards[2]?.nameKo})는 오늘의 타로가 던진 일일 운명의 화두를 심층적으로 확장하고 해결하는 직접적인 연계 카드입니다.
4. 따라서 리딩의 첫 시작(### 1단계)부터 오늘의 타로 결과와 사주 본원 기운(${saju?.dayMaster?.symbolName || '본원 기운'})의 상호작용을 명확하게 짚어내고, 3장의 오라클 카드가 오늘의 타로 에너지를 어떻게 조율하고 더 높은 차원의 해법으로 이끄는지 반드시 유기적으로 연결하여 2500~3500자 이상의 압도적 대서사로 전개하십시오.
`
      : '';

    try {
      if (oracleMode === 'healing') {
        // [SAJU ✕ TAROT COLLABORATION MODE] Professional, Insightful, Mystical & Grounded
        const systemPrompt = `당신은 동양의 '사주명리학(四柱命理)'과 서양의 '정통 78장 타로(Tarot)'를 완벽하게 교차 융합하는 '정통 사주 ✕ 타로 오라클 마스터(Saju & Tarot Oracle Master)'입니다.

# 핵심 사명 (Core Oracle Mission):
오라클 타로는 일반 타로보다 훨씬 더 길고 자세하며, 방대하고 정밀한 영적/운명적 대서사를 제공하는 최상위 오라클입니다.
이 리딩의 목적은 질문자가 털어놓은 【구체적인 고민의 근원적 치유, 내면의 무의식적 피로 해소, 사주 원국과 카드의 깊은 공명, 현실적이고 따뜻한 실천 개운 처방】을 사주 일간 본원(${saju?.dayMaster?.symbolName || '본원 기운'}) 기질과 오늘의 일일 타로([${todayAnchorCard.nameKo}])의 배경 파동, 그리고 3장의 오라클 카드(1번: ${cards[0]?.nameKo}, 2번: ${cards[1]?.nameKo}, 3번: ${cards[2]?.nameKo})와 정교하게 교차 융합하여, 압도적으로 풍성하고 깊이 있는 '5단계 심층 총평 대서사 본문'으로 온전히 전달하는 것입니다.
- 형식적인 단문이나 요약식 서술을 철저히 배제합니다.
- 자기계발 오라클 타로와 동등하거나 그 이상의 풍성하고 디테일한 분량(2,500~3,500자 이상의 장문 대서사)으로 본문('message')을 서술하십시오.
- 오직 질문자의 구체적인 고민("${effectiveInquiry || '삶의 균형과 심리적 치유'}")과 오늘의 일일 타로([${todayAnchorCard.nameKo}])의 배경 에너지를 서두부터 결말까지 관통시키며, 3장의 카드를 돋보기로 들여다보듯 도상 상징과 사주 오행(목화토금수), 용신을 결합해 깊이 있는 1:1 심층 상담을 전개하십시오.
- 유치한 반말, 편지 형식의 사적인 독백("안녕... 네 작은 친구 제제야" 등)을 일절 배제합니다.
- 성과 경쟁 채찍질이 아닌, 질문자의 타고난 기질과 카드의 흐름을 존중하는 깊이 있는 통찰과 심리적 해원(解冤), 명쾌한 방향성을 선물해야 합니다.
- '화이트홀', '블랙홀', '웜홀', '손끝 물리량', '파동 측정' 등의 인위적/공상과학/기술적 용어는 절대 사용하지 마십시오.

# Tone & Voice:
- 품격 있고 신뢰감 넘치며, 따뜻하고 깊이 있는 정통 경어체("~님", "~입니다", "~을 암시합니다", "~의 흐름을 보이고 있습니다", "~을 권해드립니다")를 일관되게 사용합니다.
- 내담자를 부를 때는 정중하게 "${recipientName} 님"으로 호칭합니다.

# 3줄 요약 원칙 (풍성하고 깊이 있는 요약 — 자기계발 오라클과 동등한 분량):
3줄 요약은 지나치게 짧은 단문이나 축약으로 끝내지 말고, 사주 원국과 카드의 상징을 긴밀히 교차 융합하여 자기계발 오라클과 동등하게 풍성하고 깊이 있는 통찰(각 항목당 60~85자 내외의 완성된 문장)로 온전하게 작성하십시오.
- 어설픈 쉼표 중간 끊기나 줄임말 없이, 주어와 서술어가 갖추어진 완성도 높은 정통 경어체 문맥으로 작성하십시오.

# message (사주 ✕ 타로 콜라보 심층 총평 본문 — 5단계 대서사 구조, 각 단계당 2~3개 이상의 긴 단락 필수):
반드시 다음 5개의 소제목(### 마크다운 헤더)을 갖추고, 각 단계마다 350~500자 이상의 깊고 풍성한 단락들(총 2,500~3,500자 이상)을 전개하십시오:
- ### 🌌 1. 2026 오늘의 일일 타로 [${todayAnchorCard.nameKo}]와 사주 원국의 거대한 공명
- ### 🕯️ 2. 무의식의 뿌리와 과거의 씨앗 [1번 카드: ${cards[0]?.nameKo}]
- ### ⚡ 3. 현실의 갈등과 마음의 소용돌이 [2번 카드: ${cards[1]?.nameKo}]
- ### 🔮 4. 오라클의 전환점과 미래 해결의 열쇠 [3번 카드: ${cards[2]?.nameKo}]
- ### 🌿 5. 운명을 바꾸는 일상 개운 처방과 마스터의 영혼 축복

반드시 마크다운 코드블록 없이 순수 JSON 형식으로만 응답해야 합니다. "message" 필드를 가장 먼저 작성하세요:
{
  "message": "질문자(${recipientName} 님)를 정중히 부르며 시작하여, 5개의 소제목(### 1~5단계)을 빠짐없이 갖추고 각 단계마다 2~3개의 긴 단락으로 오늘의 일일 타로 [${todayAnchorCard.nameKo}]와 사주 일간 본원, 3장의 카드를 유기적으로 교차 해설한 2500~3500자 이상의 5단계 심층 총평 대서사 본문 (마크다운 포맷)",
  "concise_summary": [
    "[현재 에너지] 사주 일간(${saju?.dayMaster?.symbolName || '본원 기운'})과 1·2번 카드가 마주한 질문자 내면의 무의식적 피로와 현실 에너지 흐름을 섬세하게 진단한 깊이 있는 1~2문장 (60~85자 내외)",
    "[방향과 결단] 사주 용신(${saju?.yongsin?.name || '조화'})과 3번 조언 카드가 제시하는 지혜로운 마음가짐과 영혼의 전환점 결단 (60~85자 내외)",
    "[실천 처방] 오늘 일상에서 지친 심신을 회복하고 운명의 기운을 상생으로 순환시킬 구체적이고 따뜻한 힐링 실천법 (55~80자 내외)"
  ],
  "micro_action": "3번 미래/조언 카드가 제안하는 일상 행동 1가지 (30자 내외)",
  "reward_item": {
    "name": "오늘의 마인드 보물 아이템 이름",
    "description": "이 아이템이 상징하는 운명 조화의 의미"
  },
  "prescribed_art": {
    "artwork_title": "${dynamicPrescribedArt.artwork_title}",
    "art_quote": "${dynamicPrescribedArt.art_quote}"
  },
  "saju_tarot_synergy": {
    "day_master_resonance": "사주 일간 본원과 오늘의 타로 공명 분석 (2~3문장의 깊은 해설)",
    "elemental_balance": {
      "dominant_harmony": "우세 오행 조율 해설 (2문장)",
      "lacking_remedy": "결핍 오행/용신 보완 해설 (2문장)"
    },
    "destiny_flow_synthesis": "2026 세운과 오늘의 타로가 빚어내는 운명적 타이밍 지혜 (2~3문장)",
    "saju_oracle_verdict": "사주와 타로의 결정적 오라클 계시 (1~2문장)"
  },
  "card_insights": [
    {
      "card_name": "${cards[0]?.nameKo || '1번 카드'}",
      "position_name": "과거 / 무의식의 뿌리",
      "core_meaning": "카드의 본질적 도상 상징과 뜻 (2~3문장 이상의 상세한 상징학적 해독)",
      "saju_resonance": "질문자의 사주 일간 본원(${saju?.dayMaster?.symbolName || '본원 기운'}) 및 오행과의 심층 공명 해설 (2~3문장)",
      "personal_interpretation": "질문자의 고민 맥락과 연결된 과거 심리적 뿌리 상세 리딩 (3~4문장 이상의 디테일한 분석)",
      "action_guide": "일상에서 실천할 수 있는 생각과 마음가짐의 정돈 조언 (2문장)"
    },
    {
      "card_name": "${cards[1]?.nameKo || '2번 카드'}",
      "position_name": "현재 / 상황과 마음의 흐름",
      "core_meaning": "카드의 본질적 도상 상징과 뜻 (2~3문장 이상의 상세한 상징학적 해독)",
      "saju_resonance": "질문자의 사주 일간 본원(${saju?.dayMaster?.symbolName || '본원 기운'}) 및 오행과의 심층 공명 해설 (2~3문장)",
      "personal_interpretation": "현재 마주한 현실 갈등과 감정 역학 상세 리딩 (3~4문장 이상의 디테일한 분석)",
      "action_guide": "현재 상황에서 마음의 균형을 잡는 구체적 조화 팁 (2문장)"
    },
    {
      "card_name": "${cards[2]?.nameKo || '3번 카드'}",
      "position_name": "미래 / 조언과 해결의 열쇠",
      "core_meaning": "카드의 본질적 도상 상징과 뜻 (2~3문장 이상의 상세한 상징학적 해독)",
      "saju_resonance": "질문자의 사주 결핍 오행 및 용신(${saju?.yongsin?.name || '보약'})과의 심층 공명 해설 (2~3문장)",
      "personal_interpretation": "미래 해결의 열쇠와 운명적 돌파구 상세 리딩 (3~4문장 이상의 디테일한 분석)",
      "action_guide": "오늘 즉시 실천할 가장 구체적인 개운 힐링 액션 (2문장)"
    }
  ]
}`;

        const inquiryPromptAddon = effectiveInquiry
          ? `\n\n# [최우선 필수 집중 주제] 내담자가 질문한 구체적인 고민:\n"${effectiveInquiry}"\n★ 절대 지침: 사주 ✕ 타로 리딩은 질문자의 구체적인 고민("${effectiveInquiry}")을 서두부터 중심에 두고 전개되어야 합니다. 일반론적 설명을 배제하고, 내담자가 호소한 고민 상황을 명확히 짚어내며, 사주 본원 기운(${saju?.dayMaster?.symbolName || '본원 기운'})이 왜 이 고민 앞에서 특정 패턴을 겪게 되었는지, 그리고 뽑힌 3장의 카드가 이 고민을 어떻게 해결의 길로 인도하는지 사주와 타로의 콜라보레이션으로 명쾌하게 작성해 주세요.\n`
          : `\n\n# 질문자의 상황:\n사주 원국의 일간(${saju?.dayMaster?.symbolName || '본원 기운'})과 오행 분포(${saju?.elements?.dominant?.name || '조화'} 우세, ${saju?.elements?.lacking?.name || '보완'} 결핍)를 바탕으로 현재 삶의 흐름과 고민을 입체적으로 조명하고, 3장의 타로 카드가 전하는 명쾌한 방향성을 전해 주세요.\n`;

        const prompt = `${sajuContextPrompt}${inquiryPromptAddon}\n\n사용자가 뽑은 3장의 카드:\n${cardDescriptions}\n\n위 질문자(${recipientName} 님)의 사주 명리학 원국과 뽑힌 3장의 타로 카드가 지닌 본질적 도상 상징과 뜻을 긴밀하게 '교차 융합(Collaboration)'하여, 질문자의 고민을 중심에 두고 높은 통찰과 현실적 해법을 담은 정통 타로 리딩 결과를 JSON으로 생성해 주십시오.\n\n★ [작성 지침 - 절대 엄수]:\n1. 분량 및 디테일: 자기계발 오라클 타로처럼 매우 길고, 돋보기로 들여다보듯 디테일하고 깊이 있게 작성하십시오.\n2. 'message' 필드는 본문 리딩의 핵심 대서사이므로 반드시 5개의 소제목(### 1~5단계)을 빠짐없이 갖추고, 각 단계마다 2~3개의 긴 단락(각 단계당 350~500자 이상, 총 2,500~3,500자 이상)으로 풍성하게 서술하십시오. 결코 1~2줄의 짧은 요약으로 끝내지 마십시오.\n3. 3줄 요약('concise_summary')은 각 항목당 60~85자 내외로 사주 원국과 카드의 의미를 융합하여 자기계발 오라클만큼 풍성하고 깊이 있는 완성형 문맥으로 작성하십시오.\n4. 카드별 심층 분석('card_insights')의 4개 항목(core_meaning, saju_resonance, personal_interpretation, action_guide)을 3장의 카드 모두 빠짐없이 풍성하고 디테일하게 작성하십시오.`;
        const res = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          responseFormat: { type: 'json_object' },
          timeoutMs: 60000,
        });
        const clean = res.replace(/```json/g, '').replace(/```/g, '').trim();
        let parsed: any = null;
        try {
          parsed = JSON.parse(clean);
        } catch (jsonErr) {
          console.warn('Direct JSON parse failed, attempting fallback repair:', jsonErr);
          const msgMatch = clean.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
          if (msgMatch) {
            try {
              parsed = { message: JSON.parse(`"${msgMatch[1]}"`) };
            } catch (_) {}
          }
        }

        // 🌟 본문(message) 추출 및 폴백 보장: 본문이 비어있거나 누락되지 않도록 100% 안전 처리
        let messageText = '';
        if (typeof parsed?.message === 'string' && parsed.message.trim().length > 30) {
          messageText = parsed.message.trim();
        } else if (typeof parsed?.content === 'string' && parsed.content.trim().length > 30) {
          messageText = parsed.content.trim();
        } else if (typeof parsed?.reading === 'string' && parsed.reading.trim().length > 30) {
          messageText = parsed.reading.trim();
        } else if (typeof parsed?.letter === 'string' && parsed.letter.trim().length > 30) {
          messageText = parsed.letter.trim();
        } else if (typeof parsed?.interpretation === 'string' && parsed.interpretation.trim().length > 30) {
          messageText = parsed.interpretation.trim();
        } else if (parsed?.message && typeof parsed.message === 'object') {
          messageText = Object.values(parsed.message).filter((v): v is string => typeof v === 'string').join('\n\n');
        }

        const enrichedCardInsights: CardInsight[] = cards.map((c, i) => {
          const role = slotPositions[i] || `${i + 1}번 카드`;
          const rawInsight = parsed?.card_insights?.[i] || {};
          const cardKeywords = c.keywords.slice(0, 3).join(', ');
          const orientationText = c.reversed ? '역방향(내적 성찰과 에너지 정돈)' : '정방향(직접적인 발현과 흐름)';
          return {
            card_name: rawInsight.card_name || c.nameKo,
            position_name: rawInsight.position_name || role,
            core_meaning: (typeof rawInsight.core_meaning === 'string' && rawInsight.core_meaning.trim().length > 20)
              ? rawInsight.core_meaning.trim()
              : `${c.nameKo} 카드는 [${cardKeywords}]의 원형적 상징을 품고 있으며, ${orientationText}의 위치에서 상황의 본질을 꿰뚫는 깊은 영적 지혜를 담고 있습니다. 카드의 도상에 새겨진 상징들은 질문자의 의식 아래 잠들어 있던 직관을 일깨우고, 낡은 생각의 관성을 벗어나 새로운 시선으로 삶의 질서를 정돈하도록 안내합니다.`,
            saju_resonance: (typeof rawInsight.saju_resonance === 'string' && rawInsight.saju_resonance.trim().length > 20)
              ? rawInsight.saju_resonance.trim()
              : `질문자의 사주 일간 [${dayMasterStr}] 본원과 만나 오행의 흐름을 조율하며, 오늘 하루를 이끄는 일일 지배 타로 [${todayAnchorCard.nameKo}]의 파동과 공명합니다. 사주에서 강하게 분출되는 ${domElStr}의 기운을 유연하게 순환시키고, 부족했던 ${lackElStr}과 용신 ${yongsinStr}의 생명력을 보완하여 어떤 마찰 속에서도 평정심을 유지하도록 지탱합니다.`,
            personal_interpretation: (typeof rawInsight.personal_interpretation === 'string' && rawInsight.personal_interpretation.trim().length > 20)
              ? rawInsight.personal_interpretation.trim()
              : `${role}의 자리에서 ${recipientName} 님에게 전하는 핵심 메시지로, 카드의 상징이 ${effectiveInquiry ? `"${effectiveInquiry}" 고민 맥락과` : '질문자의 현실 상황과'} 정밀하게 맞물립니다. 마주한 혼란은 당신의 결함이 아니라 내면의 에너지가 새로운 성숙과 도약을 위해 필연적으로 거쳐야 할 정화의 관문입니다. 카드는 서둘러 상황을 통제하려 하기보다, 내면의 고요한 중심을 먼저 회복할 것을 강력히 권고합니다.`,
            action_guide: (typeof rawInsight.action_guide === 'string' && rawInsight.action_guide.trim().length > 10)
              ? rawInsight.action_guide.trim()
              : `오늘 하루, [${c.keywords[0] || '조화'}]의 키워드를 마음에 품고 따뜻한 차 한 잔과 함께 깊은 호흡으로 몸과 마음의 긴장을 부드럽게 이완해 보세요.`,
          };
        });

        const hasAllStages = Boolean(messageText && messageText.includes('1.') && messageText.includes('2.') && messageText.includes('3.') && messageText.includes('4.') && messageText.includes('5.'));
        if (!messageText || messageText.length < 1000 || !hasAllStages) {
          messageText = buildFallbackHealingMessage(
            cards,
            saju,
            todayAnchorCard,
            recipientName,
            effectiveInquiry,
            enrichedCardInsights,
            parsed?.saju_tarot_synergy,
            parsed?.micro_action
          );
        }

        // 🌟 3줄 요약: 자기계발 오라클과 동등한 깊이와 분량(60~85자) 보장
        let conciseBullets: string[] = [];
        if (Array.isArray(parsed?.concise_summary) && parsed.concise_summary.length >= 3) {
          conciseBullets = parsed.concise_summary.slice(0, 3);
        } else {
          conciseBullets = extractOracleConciseSummary({
            message: messageText,
            oracleMode: 'healing',
            cards,
            saju,
            todayCard: todayAnchorCard,
            microAction: parsed?.micro_action,
          });
        }

        const finalHealingResult: HealingResult = {
          message: messageText,
          concise_summary: conciseBullets,
          saju_tarot_synergy: parsed?.saju_tarot_synergy,
          card_insights: enrichedCardInsights,
          prescribed_art: (parsed?.prescribed_art?.artwork_title && !parsed.prescribed_art.artwork_title.includes('클로드 모네'))
            ? {
                ...parsed.prescribed_art,
                catalog_id: MUSE_ART_CATALOG.find(m => m.title.includes(parsed.prescribed_art.artwork_title) || parsed.prescribed_art.artwork_title.includes(m.title))?.id || dynamicPrescribedArt.catalog_id
              }
            : dynamicPrescribedArt,
          micro_action: typeof parsed?.micro_action === 'string' && parsed.micro_action.length > 5
            ? parsed.micro_action
            : '따뜻한 차 한 잔과 3번의 깊은 복식호흡으로 마음의 긴장을 즉시 비워내기',
          reward_item: parsed?.reward_item || {
            name: '지혜의 나침반',
            description: '사주와 타로의 에너지를 조화롭게 정렬하는 통찰의 상징'
          }
        };

        setHealingResult(finalHealingResult);
        try {
          playAiResultNotification();
        } catch (_) {}
        const savedHealingSession: SavedDailyOracleSession = {
          dateKey: todayDateKey,
          mode: 'healing',
          drawnCards: cards,
          inquiryText: effectiveInquiry,
          healingResult: finalHealingResult,
          savedAt: new Date().toISOString(),
        };
        saveDailyOracleSession('healing', todayDateKey, savedHealingSession);
        syncOracleSessionToCloud('healing', savedHealingSession);
        setTodayDailySession(savedHealingSession);
      } else if (oracleMode === 'miracle') {
        // [MIRACLE MODE - A Course in Miracles (ACIM) Dedicated Metaphysical Oracle]
        const miracleInquiryPromptAddon = effectiveInquiry
          ? `\n\n# [최우선 필수 집중 화두] 질문자가 호소한 구체적인 삶의 갈등/두려움/고민:\n"${effectiveInquiry}"\n★ 절대 지침: 기적수업(ACIM) 오라클 리딩은 질문자의 구체적인 고민("${effectiveInquiry}")을 정중앙에 두고 풀이해야 합니다. 일반적인 세속적 타로 점술이나 막연한 조언을 배제하고, 질문자가 겪고 있는 고통의 본질을 에고의 두려움/죄책감/투사 관점에서 밝히 드러내며, 성령의 지각 전환(Shift in Perception)과 거룩한 순간(Holy Instant), 그리고 참된 용서를 통해 온전한 하나님의 평화로 귀환하는 영적 길을 2500~3500자 이상의 대서사로 인도하십시오.\n`
          : `\n\n# 질문자의 영적 화두:\n세상의 복잡한 갈등과 에고의 불안 속에서, 마음의 눈을 성령의 시선으로 전환하여 하나님의 온전한 평화와 참된 용서의 기적을 체험하도록 이끌어 주십시오.\n`;

        const systemPrompt = `당신은 『기적수업(A Course in Miracles, ACIM)』의 심원한 비이원론(Non-duality) 형이상학과 내면의 거룩한 평화를 78장 타로 및 사주 명리와 정교하게 융합하는 '기적수업 지각전환 영적 오라클 마스터'입니다.

# 핵심 사명 (Core ACIM Oracle Mission):
오라클 타로는 일반 타로보다 훨씬 더 길고 자세하며, 방대하고 정밀한 영적/운명적 대서사를 제공하는 최상위 오라클입니다.
이 리딩의 목적은 질문자가 호소한 구체적인 고민("${effectiveInquiry || '에고의 불안과 내면의 평화'}")을 기적수업의 근본 원리【에고의 환영과 분리감 타파, 죄책감과 원한의 해체, 성령의 지각 전환(Shift in Perception), 거룩한 순간(Holy Instant), 참된 용서(True Forgiveness), 하나님의 평화(Peace of God)】를 바탕으로, 사주 일간 본원(${saju?.dayMaster?.symbolName || '본원 생명'})과 오늘의 일일 타로([${todayAnchorCard.nameKo}])의 배경 파동, 그리고 3장의 오라클 카드(1번 에고의 두려움: ${cards[0]?.nameKo}, 2번 거룩한 순간/지각전환: ${cards[1]?.nameKo}, 3번 참된 용서/평화의 기적: ${cards[2]?.nameKo})와 입체적으로 융합하여, 2,500~3,500자 이상의 압도적이고 눈부신 '5단계 지각전환 대서사 본문'으로 전달하는 것입니다.
- 형식적인 단문이나 요약식 서술을 철저히 배제합니다.
- 기적수업의 핵심 금언(예: "실재하는 것은 위협받을 수 없다. 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다", "기적은 사랑의 자연스러운 표현이다", "용서는 환영을 환영으로 알아보는 것이다")을 유기적으로 녹여내십시오.
- 성과 경쟁이나 세속적 처세술이 아닌, 두려움의 꿈에서 깨어나 참된 마음(Christ Mind)의 완전한 무죄성과 평온함을 회복하도록 안내해야 합니다.
- 유치한 반말이나 편지체 사적 잡담을 배제하고, 신성하고 자비로우며 깊은 평화가 깃든 정통 경어체("${recipientName} 님")를 일관되게 사용하십시오.

# 3줄 요약 원칙 (ACIM 지각전환 3요소):
각 항목당 60~85자 내외의 완성된 문장으로 작성하십시오:
- [마음의 환영] 1번 카드가 비추는 에고의 결핍/두려움/투사의 본질을 짚어낸 문장 (60~85자)
- [지각의 전환] 2번 카드가 안내하는 거룩한 순간과 성령께 맡김의 지각 전환 문장 (60~85자)
- [기적의 선언] 3번 카드가 약속하는 참된 용서와 하나님의 평화를 선언하는 문장 (60~85자)

# message (5단계 대서사 구조 — 각 단계당 2~3개 이상의 긴 단락, 총 2,500~3,500자 이상):
반드시 다음 5개의 소제목(### 마크다운 헤더)을 갖추어 전개하십시오:
- ### 🕊️ 1. 2026 오늘의 일일 타로 [${todayAnchorCard.nameKo}]와 성령의 거룩한 초대 (지각의 전환)
- ### 🌑 2. 에고의 환영과 숨겨진 두려움의 투사 [1번 카드: ${cards[0]?.nameKo}]
- ### 🕯️ 3. 거룩한 순간(Holy Instant)과 지각의 정화 [2번 카드: ${cards[1]?.nameKo}]
- ### 🕊️ 4. 참된 용서와 하나님의 평화 (기적의 선물) [3번 카드: ${cards[2]?.nameKo}]
- ### 🌿 5. 오늘의 기적수업 워크북 선언과 제제의 평화 축복

반드시 마크다운 코드블록 없이 순수 JSON 형식으로만 응답해야 합니다. "message" 필드를 가장 먼저 작성하세요:
{
  "message": "2500~3500자 이상의 5단계 지각전환 대서사 본문 (마크다운 포맷)",
  "concise_summary": [
    "[마음의 환영] 에고의 투사와 무의식적 죄책감 해독 (60~85자)",
    "[지각의 전환] 거룩한 순간을 통한 성령의 시선 회복 (60~85자)",
    "[기적의 선언] 참된 용서와 하나님의 평화 완성 선언 (60~85자)"
  ],
  "miracle_lesson": {
    "source": "기적수업(ACIM) 워크북 레슨 또는 텍스트 장절",
    "quote": "기적수업 성스러운 핵심 인용문구",
    "application": "오늘 이 레슨을 마음에 품고 적용하는 영적 지침"
  },
  "micro_action": "오늘 실천할 1분 거룩한 순간 심호흡/기도 실천법 (30자 내외)",
  "reward_item": {
    "name": "평화의 흰 비둘기",
    "description": "세상의 모든 두려움을 지워내는 온전한 용서와 은총의 상징"
  },
  "prescribed_art": {
    "artwork_title": "${dynamicPrescribedArt.artwork_title}",
    "art_quote": "${dynamicPrescribedArt.art_quote}"
  },
  "saju_tarot_synergy": {
    "day_master_resonance": "사주 본원과 기적수업 지각전환의 영적 공명 (2~3문장)",
    "elemental_balance": {
      "dominant_harmony": "오행 에너지를 평화의 통로로 정렬하는 지혜",
      "lacking_remedy": "결핍 오행을 하나님의 충만함으로 채우는 원리"
    },
    "destiny_flow_synthesis": "오늘의 일일 타로와 2026 운기가 주는 성스러운 평화의 기회",
    "saju_oracle_verdict": "지각 전환의 결정적 영적 계시"
  },
  "card_insights": [
    {
      "card_name": "${cards[0]?.nameKo || '1번 카드'}",
      "position_name": "에고의 환영과 두려움",
      "core_meaning": "카드의 상징과 에고의 투사 심층 해독",
      "saju_resonance": "사주 일간과 에고 두려움의 무의식적 패턴 분석",
      "personal_interpretation": "고민 맥락에서 에고가 만들어낸 환영의 정체",
      "action_guide": "이 환영을 성령께 맡기고 내려놓는 태도"
    },
    {
      "card_name": "${cards[1]?.nameKo || '2번 카드'}",
      "position_name": "거룩한 순간과 지각의 전환",
      "core_meaning": "시간의 초월과 거룩한 순간의 도상 상징",
      "saju_resonance": "사주 용신과 성령의 빛이 만나는 정화의 순간",
      "personal_interpretation": "현재 상황을 성령의 시선으로 다시 바라보는 통찰",
      "action_guide": "거룩한 순간을 진입하는 내적 기도"
    },
    {
      "card_name": "${cards[2]?.nameKo || '3번 카드'}",
      "position_name": "참된 용서와 평화의 기적",
      "core_meaning": "참된 용서와 하나님의 평화 완성의 상징",
      "saju_resonance": "본원의 온전한 무죄성이 세상에 발현되는 결실",
      "personal_interpretation": "미래를 여는 완전한 해방과 평화의 선물",
      "action_guide": "오늘 하루 평화의 사도로 살아가는 구체적 실천"
    }
  ]
}`;

        const prompt = `${sajuContextPrompt}${miracleInquiryPromptAddon}\n\n사용자가 뽑은 3장의 기적수업 오라클 카드:\n${cardDescriptions}\n\n위 질문자(${recipientName} 님)의 사주 명리학 원국과 기적수업 3카드 스프레드를 형이상학적으로 융합하여 온전한 내면의 평화와 지각의 전환을 인도하는 결과를 JSON으로 생성해 주십시오.\n\n★ [작성 지침 - 절대 엄수]:\n1. 'message' 필드는 5개의 소제목(### 1~5단계)을 빠짐없이 갖추고, 각 단계마다 2~3개의 긴 단락(총 2,500~3,500자 이상)으로 풍성하게 서술하십시오.\n2. 3줄 요약('concise_summary')은 각 항목당 60~85자 내외로 [마음의 환영], [지각의 전환], [기적의 선언]의 완성된 문맥으로 작성하십시오.\n3. 'miracle_lesson' 항목을 충실하게 작성해 주십시오.`;

        const res = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          responseFormat: { type: 'json_object' },
          timeoutMs: 60000,
        });

        const clean = res.replace(/```json/g, '').replace(/```/g, '').trim();
        let parsed: any = null;
        try {
          parsed = JSON.parse(clean);
        } catch (jsonErr) {
          console.warn('Direct JSON parse failed, attempting fallback repair:', jsonErr);
          const msgMatch = clean.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
          if (msgMatch) {
            try {
              parsed = { message: JSON.parse(`"${msgMatch[1]}"`) };
            } catch (_) {}
          }
        }

        let messageText = '';
        if (typeof parsed?.message === 'string' && parsed.message.trim().length > 30) {
          messageText = parsed.message.trim();
        } else if (typeof parsed?.content === 'string' && parsed.content.trim().length > 30) {
          messageText = parsed.content.trim();
        } else if (typeof parsed?.reading === 'string' && parsed.reading.trim().length > 30) {
          messageText = parsed.reading.trim();
        } else if (parsed?.message && typeof parsed.message === 'object') {
          messageText = Object.values(parsed.message).filter((v): v is string => typeof v === 'string').join('\n\n');
        }

        const enrichedCardInsights: CardInsight[] = cards.map((c, i) => {
          const role = slotPositions[i] || `${i + 1}번 카드`;
          const rawInsight = parsed?.card_insights?.[i] || {};
          const cardKeywords = c.keywords.slice(0, 3).join(', ');
          const orientationText = c.reversed ? '역방향(내면의 저항과 에고의 미세한 두려움 직면)' : '정방향(직접적인 성령의 빛과 지각전환)';
          return {
            card_name: rawInsight.card_name || c.nameKo,
            position_name: rawInsight.position_name || role,
            core_meaning: (typeof rawInsight.core_meaning === 'string' && rawInsight.core_meaning.trim().length > 20)
              ? rawInsight.core_meaning.trim()
              : `${c.nameKo} 카드는 [${cardKeywords}]의 상징을 품고 있으며, ${orientationText}의 흐름 속에서 에고의 환영을 식별하고 참된 마음의 눈을 뜨도록 이끕니다.`,
            saju_resonance: (typeof rawInsight.saju_resonance === 'string' && rawInsight.saju_resonance.trim().length > 20)
              ? rawInsight.saju_resonance.trim()
              : `질문자의 사주 일간 [${dayMasterStr}] 본원의 신성한 생명력과 만나 오늘의 일일 타로 [${todayAnchorCard.nameKo}]의 현실 장 속에서 두려움을 사랑으로 녹여내는 거룩한 공명을 일으킵니다.`,
            personal_interpretation: (typeof rawInsight.personal_interpretation === 'string' && rawInsight.personal_interpretation.trim().length > 20)
              ? rawInsight.personal_interpretation.trim()
              : `${role}의 자리에서 ${recipientName} 님에게 전하는 메시지로, 마주하신 갈등은 형제나 세상의 죄가 아니라 사랑을 요청하는 외침이었음을 깨닫게 합니다.`,
            action_guide: (typeof rawInsight.action_guide === 'string' && rawInsight.action_guide.trim().length > 10)
              ? rawInsight.action_guide.trim()
              : `오늘 하루, 마음에 서운함이나 불안이 스칠 때마다 "성령이여, 당신의 눈으로 이 순간을 보게 하소서"라는 기도를 조용히 올려보세요.`,
          };
        });

        const hasAllStages = Boolean(messageText && messageText.includes('1.') && messageText.includes('2.') && messageText.includes('3.') && messageText.includes('4.') && messageText.includes('5.'));
        if (!messageText || messageText.length < 1000 || !hasAllStages) {
          messageText = buildFallbackMiracleMessage(
            cards,
            saju,
            todayAnchorCard,
            recipientName,
            effectiveInquiry,
            enrichedCardInsights,
            parsed?.miracle_lesson,
            parsed?.micro_action
          );
        }

        let conciseBullets: string[] = [];
        if (Array.isArray(parsed?.concise_summary) && parsed.concise_summary.length >= 3) {
          conciseBullets = parsed.concise_summary.slice(0, 3);
        } else {
          conciseBullets = extractOracleConciseSummary({
            message: messageText,
            oracleMode: 'miracle',
            cards,
            saju,
            todayCard: todayAnchorCard,
            microAction: parsed?.micro_action,
          });
        }

        const finalMiracleResult: MiracleResult = {
          message: messageText,
          concise_summary: conciseBullets,
          saju_tarot_synergy: parsed?.saju_tarot_synergy,
          card_insights: enrichedCardInsights,
          miracle_lesson: parsed?.miracle_lesson || {
            source: '기적수업(ACIM) 텍스트 1장',
            quote: '실재하는 것은 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다.',
            application: '모든 판단을 성령께 넘겨드리고 본연의 온전한 무죄성을 수용하십시오.'
          },
          prescribed_art: (parsed?.prescribed_art?.artwork_title && !parsed.prescribed_art.artwork_title.includes('클로드 모네'))
            ? {
                ...parsed.prescribed_art,
                catalog_id: MUSE_ART_CATALOG.find(m => m.title.includes(parsed.prescribed_art.artwork_title) || parsed.prescribed_art.artwork_title.includes(m.title))?.id || dynamicPrescribedArt.catalog_id
              }
            : dynamicPrescribedArt,
          micro_action: typeof parsed?.micro_action === 'string' && parsed.micro_action.length > 5
            ? parsed.micro_action
            : '가슴에 손을 얹고 "나는 하나님께서 창조하신 그대로의 순결한 빛이다"를 3번 선언하기',
          reward_item: parsed?.reward_item || {
            name: '평화의 흰 비둘기',
            description: '세상의 모든 두려움을 지워내는 온전한 용서와 은총의 상징'
          }
        };

        setMiracleResult(finalMiracleResult);
        try {
          playAiResultNotification();
        } catch (_) {}
        const savedMiracleSession: SavedDailyOracleSession = {
          dateKey: todayDateKey,
          mode: 'miracle',
          drawnCards: cards,
          inquiryText: effectiveInquiry,
          miracleResult: finalMiracleResult,
          savedAt: new Date().toISOString(),
        };
        saveDailyOracleSession('miracle', todayDateKey, savedMiracleSession);
        syncOracleSessionToCloud('miracle', savedMiracleSession);
        setTodayDailySession(savedMiracleSession);
      } else {
        // [GROWTH MODE] Extreme Focus on Self-Development, Competence Building, Habit Architecture, and Breakthrough Execution
        const growthInquiryPromptAddon = effectiveInquiry
          ? `\n\n# [최우선 필수 집중 과제] 질문자가 직면한 구체적인 성장 고민 및 돌파 과제:\n"${effectiveInquiry}"\n★ 절대 지침: 오라클 루시의 자기계발 서한은 오직 위의 구체적인 성장 고민/과제("${effectiveInquiry}")를 정중앙에 두고 풀이해야 합니다. 일반적인 자기계발 격언을 배제하고, 질문자가 고민하는 현실적 문제점("${effectiveInquiry}")의 원인을 사주 기질(${saju?.dayMaster?.symbolName || '본원 기운'}) 관점에서 날카롭게 진단하고, 3장의 카드를 활용해 즉시 돌파할 수 있는 실행 전략과 행동 지침을 명쾌하게 제시해 주세요.\n`
          : `\n\n# 질문자의 잠재 역량 돌파 과제:\n질문자의 사주 본원(${saju?.dayMaster?.symbolName || '본원 기운'})이 지닌 본래의 추진력을 가로막는 나태함과 미루기, 목표 실행의 정체를 부수고, 오늘 즉시 행동으로 전환할 수 있는 강력한 자기계발 돌파구를 제시해 주세요.\n`;

        const systemPrompt = `당신은 탁월함을 이끌어내는 초정밀 자기계발 멘토이자 퍼포먼스 라이프 코치 '오라클 루시(Lucy)'입니다.

# 핵심 사명 (Core Self-Development Mission):
오라클 타로는 일반 타로보다 훨씬 더 길고 자세하며, 방대하고 정밀한 자기계발 실행 전략을 제공하는 상위 오라클입니다.
이 리딩의 목적은 질문자가 털어놓은 【구체적인 고민의 명쾌한 돌파, 현실적인 자기계발 실행 전략, 역량 레벨업, 나태함과 정체 돌파, 즉각적 행동 솔루션】을 사주 본원 기질과 오늘의 일일 타로([${todayAnchorCard.nameKo}])의 배경 파동, 그리고 3장의 오라클 카드(1번 마인드셋: ${cards[0]?.nameKo}, 2번 4원소 역량: ${cards[1]?.nameKo}, 3번 1줄 마이크로 실행: ${cards[2]?.nameKo})와 교차 융합하여 깊이 있는 '1:1 심층 자기계발 실행 서한(Letter)'으로 온전히 전달하는 것입니다.
- 막연한 일반론이나 감상적인 위로, 모호한 점술적 언어를 철저히 배제합니다.
- 오직 질문자의 구체적인 고민("${effectiveInquiry || '현실적 성장과 실행 과제'}")과 오늘의 일일 타로([${todayAnchorCard.nameKo}])의 영향력을 서한의 서두부터 끝까지 정중앙에 두고, 3장의 카드를 활용해 고민을 정밀 타격하여 당장 오늘 실천할 수 있는 명쾌하고 단호한 행동 솔루션을 제시하세요.

# 3줄 요약 원칙 (매우 중요):
3줄 요약은 길게 늘어놓지 말고, 각 줄마다 핵심만 35~50자 내외로 매우 압축하여 명쾌하게 작성하십시오.

# message (루시의 1:1 심층 자기계발 실행 서한 — 5단계 구조):
반드시 다음 5개의 소제목(### 마크다운 헤더)을 갖추어 명쾌하고 강력한 자기계발 실행 편지를 전개하십시오:
- ### ⚡ 1. 2026 오늘의 일일 타로 [${todayAnchorCard.nameKo}]와 사주 본원의 잠재력 공명 (현실 돌파의 기저 에너지)
- ### 🧠 2. 실행 정체의 뿌리와 낡은 마인드셋 혁신 [1번 카드: ${cards[0]?.nameKo}]
- ### 🎯 3. 4원소 역량 역학 진단과 현실적 장애물 타격 [2번 카드: ${cards[1]?.nameKo}]
- ### 🚀 4. 오라클 돌파 전략과 우선순위 압축 로드맵 [3번 카드: ${cards[2]?.nameKo}]
- ### 🛠️ 5. 오늘의 1% 마이크로 실행 시스템과 루시의 단호한 멘토링

반드시 마크다운 코드블록 없이 순수 JSON 형식으로만 응답해야 합니다. "message" 필드를 가장 먼저 작성하세요:
{
  "message": "질문자의 고민을 중심에 두고 사주 본원 기질과 오늘의 일일 타로 [${todayAnchorCard.nameKo}], 3장의 카드를 결합하여, 5개의 소제목(### 1~5단계)을 갖춘 완성도 높은 루시의 1:1 심층 자기계발 실행 편지 본문 (마크다운 포맷)",
  "concise_summary": [
    "[현재 에너지] 사주 일간과 1·2번 카드가 만난 실행 정체/현실 과제의 핵심 진단 (35~45자 이내)",
    "[방향과 결단] 사주 용신과 3번 조언 카드가 제시하는 명쾌한 성장 결단 지침 (35~45자 이내)",
    "[실천 처방] 오늘 당장 완수할 가장 구체적인 1줄 행동 처방 (30~40자 이내)"
  ],
  "macro_focus": "질문자의 고민 해결과 성장을 이끌어낼 핵심 마인드셋 브리핑 (2~3문장)",
  "dominant_element": {
    "element": "Wands",
    "element_ko": "완드 (불) - 커리어 & 프로젝트 자기계발 추진력",
    "theme_brief": "오늘 가장 집중해야 할 핵심 자기계발 현실 영역 한 줄 해설"
  },
  "micro_mission": {
    "title": "3번 실행 카드의 상징에 기반하여 5~10분 안에 즉시 실행할 초정밀 과제 (30자 내외)",
    "action_tip": "실행 시 머뭇거림을 없애주는 단단한 코칭 조언"
  },
  "evening_reflection": "오늘 저녁 나의 성장과 행동을 돌아보는 1줄 자기계발 성찰 질문"
}`;

        const prompt = `${sajuContextPrompt}${growthInquiryPromptAddon}\n\n사용자가 뽑은 3장의 카드:\n${cardDescriptions}\n\n위 질문자(${recipientName} 님)의 사주 기질과 오늘의 일일 타로 [${todayAnchorCard.nameKo}], 그리고 타로 3장의 원소적 상징 및 본래 뜻을 긴밀하게 융합하여, 질문자의 고민을 직접 돌파하고 실질적인 역량 레벨업을 이뤄낼 수 있도록 온전히 초점을 맞춘 'message' (루시의 1:1 심층 자기계발 실행 편지)와 실행 툴킷을 JSON으로 도출해 줘.\n\n★ [작성 지침]:\n1. 'message' 필드는 본문의 핵심이므로 5개의 소제목(### 1~5단계)을 빠짐없이 갖추어 완전하고 깊이 있는 마크다운 본문으로 작성해 줘. (절대 누락 금지)\n2. 3줄 요약('concise_summary')은 각 항목당 35~50자 내외로 핵심만 명료하게 단문으로 작성해 줘.`;
        const res = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          responseFormat: { type: 'json_object' },
          timeoutMs: 60000,
        });
        const clean = res.replace(/```json/g, '').replace(/```/g, '').trim();
        let parsed: any = null;
        try {
          parsed = JSON.parse(clean);
        } catch (jsonErr) {
          console.warn('Direct JSON parse failed, attempting fallback repair:', jsonErr);
          const msgMatch = clean.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
          if (msgMatch) {
            try {
              parsed = { message: JSON.parse(`"${msgMatch[1]}"`) };
            } catch (_) {}
          }
        }

        let messageText = '';
        if (typeof parsed?.message === 'string' && parsed.message.trim().length > 30) {
          messageText = parsed.message.trim();
        } else if (typeof parsed?.macro_focus === 'string' && parsed.macro_focus.trim().length > 30) {
          messageText = parsed.macro_focus.trim();
        } else if (typeof parsed?.content === 'string' && parsed.content.trim().length > 30) {
          messageText = parsed.content.trim();
        }

        if (!messageText || messageText.length < 50) {
          messageText = buildFallbackGrowthMessage(
            cards,
            saju,
            todayAnchorCard,
            recipientName,
            effectiveInquiry,
            parsed?.macro_focus,
            parsed?.micro_mission
          );
        }

        let conciseBullets: string[] = [];
        if (Array.isArray(parsed?.concise_summary) && parsed.concise_summary.length >= 3) {
          conciseBullets = parsed.concise_summary.slice(0, 3);
        } else {
          conciseBullets = extractOracleConciseSummary({
            message: messageText,
            oracleMode: 'growth',
            cards,
            saju,
            todayCard: todayAnchorCard,
            macroFocus: parsed?.macro_focus,
            microMission: parsed?.micro_mission,
          });
        }

        const finalGrowthResult: GrowthResult = {
          message: messageText,
          macro_focus: parsed?.macro_focus || messageText.slice(0, 150),
          concise_summary: conciseBullets,
          dominant_element: parsed?.dominant_element || {
            element: 'Wands',
            element_ko: '완드 (불) - 실행력 & 자기계발 프로젝트 추진력',
            theme_brief: '미뤄둔 자기계발 공부나 업무 루틴을 5분 안에 착수하여 성장 모멘텀을 형성하는 날'
          },
          micro_mission: parsed?.micro_mission || {
            title: "미뤄두었던 핵심 자기계발 서류/학습 1개를 열고 5분간 집중 처리하기",
            action_tip: "완벽하게 끝내려 하지 말고, 단 5분만 손을 대보는 것에 의의를 두세요."
          },
          evening_reflection: parsed?.evening_reflection || '오늘 나는 결과에 끌려다니지 않고 스스로의 역량을 한 단계 성장시켰는가?',
          prescribed_art: dynamicPrescribedArt,
        };

        setGrowthResult(finalGrowthResult);
        try {
          playAiResultNotification();
        } catch (_) {}
        const savedGrowthSession: SavedDailyOracleSession = {
          dateKey: todayDateKey,
          mode: 'growth',
          drawnCards: cards,
          inquiryText: effectiveInquiry,
          growthResult: finalGrowthResult,
          savedAt: new Date().toISOString(),
        };
        saveDailyOracleSession('growth', todayDateKey, savedGrowthSession);
        syncOracleSessionToCloud('growth', savedGrowthSession);
        setTodayDailySession(savedGrowthSession);
      }
    } catch (err) {
      console.error('Oracle AI error:', err);
      // Fallbacks with rich Saju-Tarot blended meanings
      const sajuNameStr = saju?.name || '내담자';
      const dayMasterStr = saju?.dayMaster ? `${saju.dayMaster.hanja}(${saju.dayMaster.symbolName})` : '본원 기운';
      const domElStr = saju?.elements?.dominant?.name || '우세 오행';
      const lackElStr = saju?.elements?.lacking?.name || '결핍 오행';
      const yongsinStr = saju?.yongsin?.name || '용신 보약';

      if (oracleMode === 'healing') {
        const healingFallbackMessage = buildFallbackHealingMessage(
          cards,
          saju,
          todayDailyTarot,
          recipientName,
          effectiveInquiry,
          undefined,
          undefined,
          '따뜻한 온수를 자주 섭취하고 가슴을 펴는 3번의 깊은 복식호흡 실천하기'
        );

        const fallbackHealingResult: HealingResult = {
          concise_summary: [
            `[현재 에너지] 사주 [${dayMasterStr}]과 [${cards[0]?.nameKo || '1번'}] 카드가 만나 생각 과부하와 전환기 피로가 누적된 상태입니다.`,
            `[방향과 결단] 용신 [${yongsinStr}]과 [${cards[2]?.nameKo || '조언 카드'}]를 따라 무거운 부담을 내려놓고 회복을 선택하세요.`,
            `[실천 처방] 따뜻한 차 한 잔과 3번의 깊은 복식호흡으로 마음의 긴장을 즉시 비워내기.`
          ],
          saju_tarot_synergy: {
            day_master_resonance: `${sajuNameStr} 님의 타고난 사주 본원인 ${dayMasterStr}의 기운과 오늘의 일일 타로 [${todayDailyTarot.nameKo}], 그리고 오늘 뽑힌 [${cards.map(c => c.nameKo).join(', ')}] 타로 카드가 만나, 삶의 긴장을 완화하고 본연의 균형과 지혜를 회복하는 깊은 조화의 공명을 일으킵니다.`,
            elemental_balance: {
              dominant_harmony: `사주에서 강한 ${domElStr}의 에너지를 타로 카드의 상징이 부드럽게 순환시켜, 과도한 소모 없이 안정적인 중심을 잡도록 돕습니다.`,
              lacking_remedy: `사주에서 결핍된 ${lackElStr}과 용신 ${yongsinStr}의 에너지를 3번 조언 카드가 채워주어 심리적 안정과 명쾌한 방향성을 완성합니다.`
            },
            destiny_flow_synthesis: `오늘의 일일 타로 [${todayDailyTarot.nameKo}]와 2026 병오년(丙午年)의 역동적인 운기 속에서, 이번 오라클 스프레드는 외부의 소음에 휩쓸리지 않고 자신의 본원 페이스를 지키는 것이 가장 현명한 해법임을 비춰줍니다.`,
            saju_oracle_verdict: `당신의 사주 원국과 타로 카드는 지금 마주한 흐름이 새로운 도약과 안정의 기점이 될 것임을 분명히 증명하고 있습니다.`
          },
          card_insights: cards.map((c, i) => {
            const role = slotPositions[i] || `${i + 1}번 카드`;
            const cardKeywords = c.keywords.slice(0, 3).join(', ');
            const isRev = c.reversed;
            const orientationText = isRev ? '역방향(내적 성찰과 에너지 정돈)' : '정방향(직접적인 발현과 흐름)';
            return {
              card_name: c.nameKo,
              position_name: role,
              core_meaning: `${c.nameKo} 카드는 [${cardKeywords}]의 원형적 상징을 품고 있으며, ${orientationText}의 위치에서 상황의 본질을 꿰뚫는 깊은 영적 지혜를 담고 있습니다. 카드의 도상에 새겨진 상징들은 질문자의 의식 아래 잠들어 있던 직관을 일깨우고, 낡은 생각의 관성을 벗어나 새로운 시선으로 삶의 질서를 정돈하도록 안내합니다.`,
              saju_resonance: `질문자의 사주 일간 [${dayMasterStr}] 본원과 만나 오행의 흐름을 조율하며, 오늘 하루를 이끄는 일일 지배 타로 [${todayDailyTarot.nameKo}]의 파동과 공명합니다. 사주에서 강하게 분출되는 ${domElStr}의 기운을 유연하게 순환시키고, 부족했던 ${lackElStr}과 용신 ${yongsinStr}의 생명력을 보완하여 어떤 마찰 속에서도 평정심을 유지하도록 지탱합니다.`,
              personal_interpretation: `${role}의 자리에서 ${recipientName} 님에게 전하는 핵심 메시지로, 카드의 상징이 ${effectiveInquiry ? `"${effectiveInquiry}" 고민 맥락과` : '질문자의 현실 상황과'} 정밀하게 맞물립니다. 마주한 혼란은 당신의 결함이 아니라 내면의 에너지가 새로운 성숙과 도약을 위해 필연적으로 거쳐야 할 정화의 관문입니다. 카드는 서둘러 상황을 통제하려 하기보다, 내면의 고요한 중심을 먼저 회복할 것을 강력히 권고합니다.`,
              action_guide: `오늘 하루, [${c.keywords[0] || '조화'}]의 키워드를 마음에 품고 따뜻한 차 한 잔과 함께 깊은 호흡으로 몸과 마음의 긴장을 부드럽게 이완해 보세요.`,
            };
          }),
          message: healingFallbackMessage,
          prescribed_art: dynamicPrescribedArt,
          micro_action: '창문을 열고 시원한 공기를 들이마시며 가슴에 손을 얹고 3번 천천히 심호흡하기',
          reward_item: {
            name: '지혜의 나침반',
            description: '사주와 타로의 에너지를 조화롭게 정렬하는 통찰의 상징'
          }
        };
        setHealingResult(fallbackHealingResult);
        const fbHealingSession: SavedDailyOracleSession = {
          dateKey: todayDateKey,
          mode: 'healing',
          drawnCards: cards,
          inquiryText: effectiveInquiry,
          healingResult: fallbackHealingResult,
          savedAt: new Date().toISOString(),
        };
        saveDailyOracleSession('healing', todayDateKey, fbHealingSession);
        syncOracleSessionToCloud('healing', fbHealingSession);
        setTodayDailySession(fbHealingSession);
      } else if (oracleMode === 'miracle') {
        const miracleFallbackMessage = buildFallbackMiracleMessage(
          cards,
          saju,
          todayDailyTarot,
          recipientName,
          effectiveInquiry,
          undefined,
          {
            source: '기적수업(ACIM) 텍스트 1장',
            quote: '실재하는 것은 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다.',
            application: '판단을 성령께 온전히 넘겨주고 내면의 온전한 무죄성을 선언하십시오.'
          },
          '가슴에 손을 얹고 "나는 하나님께서 창조하신 그대로의 순결한 빛이다"를 3번 선언하기'
        );

        const fallbackMiracleResult: MiracleResult = {
          message: miracleFallbackMessage,
          concise_summary: [
            `[마음의 환영] 사주 [${dayMasterStr}]과 [${cards[0]?.nameKo || '1번'}] 카드가 에고의 분리감과 통제 두려움을 비춥니다.`,
            `[지각의 전환] [${cards[1]?.nameKo || '2번'}] 카드를 통해 판단을 멈추고 거룩한 순간의 평화를 선택하세요.`,
            `[기적의 선언] [${cards[2]?.nameKo || '3번'}] 카드가 약속하는 참된 용서 안에서 하나님의 완전한 평화가 깃듭니다.`
          ],
          miracle_lesson: {
            source: '기적수업(ACIM) 텍스트 1장',
            quote: '실재하는 것은 위협받을 수 없으며, 실재하지 않는 것은 존재하지 않는다. 여기에 하나님의 평화가 있다.',
            application: '판단을 성령께 온전히 넘겨주고 내면의 온전한 무죄성을 선언하십시오.'
          },
          prescribed_art: dynamicPrescribedArt,
          micro_action: '가슴에 손을 얹고 "나는 하나님께서 창조하신 그대로의 순결한 빛이다"를 3번 선언하기',
          reward_item: {
            name: '평화의 흰 비둘기',
            description: '에고의 모든 환영을 녹여내는 하나님의 영원한 평화와 무죄성의 상징'
          },
          card_insights: cards.map((c, i) => {
            const role = slotPositions[i] || `${i + 1}번 카드`;
            const cardKeywords = c.keywords.slice(0, 3).join(', ');
            const isRev = c.reversed;
            const orientationText = isRev ? '역방향(내면의 저항과 에고의 미세한 두려움 직면)' : '정방향(직접적인 성령의 빛과 지각전환)';
            return {
              card_name: c.nameKo,
              position_name: role,
              core_meaning: `${c.nameKo} 카드는 [${cardKeywords}]의 상징을 품고 있으며, ${orientationText}의 위치에서 에고의 환영을 식별하고 참된 마음의 눈을 뜨도록 이끕니다.`,
              saju_resonance: `사주 일간 [${dayMasterStr}] 본원의 신성한 생명력과 결합하여, 오늘의 일일 타로 [${todayDailyTarot.nameKo}]와 함께 두려움을 사랑으로 전환하는 성령의 빛을 비춥니다.`,
              personal_interpretation: `${role}의 자리에서 ${recipientName} 님에게 전하는 메시지로, 마주하신 갈등은 형제나 세상의 죄가 아니라 사랑을 요청하는 외침이었음을 깨닫게 합니다.`,
              action_guide: '오늘 이 순간 마음의 모든 긴장을 성령께 맡기고 고요한 쉼을 누리세요.'
            };
          }),
          saju_tarot_synergy: {
            day_master_resonance: `${sajuNameStr} 님의 사주 본원 [${dayMasterStr}]과 오늘의 일일 타로 [${todayDailyTarot.nameKo}], 그리고 [${cards.map(c => c.nameKo).join(' · ')}]의 상징이 어우러져 에고의 환영을 벗겨내고 하나님의 영원한 평화를 증거합니다.`,
            elemental_balance: {
              dominant_harmony: `사주의 에너지를 성령의 거룩한 도구로 정렬하여 내면의 갈등을 근원적으로 정화합니다.`,
              lacking_remedy: `부족한 기운을 하나님의 온전한 은총과 용서의 기적으로 충만하게 채웁니다.`
            },
            destiny_flow_synthesis: `오늘의 일일 타로 [${todayDailyTarot.nameKo}]는 두려움 대신 사랑을 선택하기에 가장 성스러운 기적의 타이밍입니다.`,
            saju_oracle_verdict: `당신은 결코 죄를 지을 수도, 상처받을 수도 없는 하나님의 순결한 자녀입니다.`
          }
        };

        setMiracleResult(fallbackMiracleResult);
        const fbMiracleSession: SavedDailyOracleSession = {
          dateKey: todayDateKey,
          mode: 'miracle',
          drawnCards: cards,
          inquiryText: effectiveInquiry,
          miracleResult: fallbackMiracleResult,
          savedAt: new Date().toISOString(),
        };
        saveDailyOracleSession('miracle', todayDateKey, fbMiracleSession);
        syncOracleSessionToCloud('miracle', fbMiracleSession);
        setTodayDailySession(fbMiracleSession);
      } else {
        const fallbackGrowthResult: GrowthResult = {
          concise_summary: [
            `[현재 에너지] 사주 [${dayMasterStr}]의 추진력이 [${cards[0]?.nameKo || '1번'}] 카드와 만나 일시적인 실행 정체에 머물러 있습니다.`,
            `[방향과 결단] 용신 [${yongsinStr}]과 [${cards[2]?.nameKo || '3번 카드'}]를 따라 잔가지를 쳐내고 우선순위 1번에 집중하세요.`,
            `[실천 처방] 오늘 10분 안에 끝낼 수 있는 가장 작은 행동 과제 1가지를 즉시 완수하기.`
          ],
          message: `### ⚡ 1. 2026 오늘의 일일 타로 [${todayDailyTarot.nameKo}]와 사주 본원의 잠재력 공명 (현실 돌파의 기저 에너지)
${recipientName} 님, 안녕하세요! 당신의 잠재 역량을 최고조로 끌어올리는 퍼포먼스 라이프 코치 루시입니다.
2026 병오년(丙午年)의 거대한 도약 타이밍 속에서, 오늘 당신의 하루를 지배하는 일일 타로 [${todayDailyTarot.nameKo}](${todayDailyTarot.reversed ? '역방향' : '정방향'})와 사주 본원 [${dayMasterStr}] 기질의 결합은 실로 강력한 현실 돌파의 기저 에너지를 형성하고 있습니다.
오늘의 일일 타로 [${todayDailyTarot.nameKo}]는 오늘 당신이 마주할 실행 환경의 기저 무대입니다.${dailyDiagnosis ? ` 오늘 타로에서 분석된 "${dailyDiagnosis.slice(0, 80)}..." 흐름은` : ''} 당신의 ${effectiveInquiry ? `"${effectiveInquiry}" 과제` : '현실적 목표'}와 직결되어 있습니다. 생각만 많아지고 행동이 지체되었던 것은 당신의 실력이 모자라서가 아니라, 오늘의 타로 에너지를 자신의 사주 본원 추진력과 제대로 동기화하지 못했기 때문입니다. 이제 뽑힌 3장의 마인드셋 카드가 실행의 벽을 단숨에 부술 4원소 전략을 전개합니다.

### 🧠 2. 실행 정체의 뿌리와 낡은 마인드셋 혁신 [1번 카드: ${cards[0]?.nameKo || '마인드셋 카드'}]
1번 자리에 놓인 [${cards[0]?.nameKo || '1번 카드'}](${cards[0]?.reversed ? '역방향' : '정방향'})는 지금까지 당신의 실행력을 옭아매었던 낡은 마인드셋의 정체를 정밀 타격합니다. ${sajuNameStr} 님의 사주 본원은 본래 높은 책임감과 추진 잠재력을 가지고 있지만, 1번 카드의 도상은 "완벽하게 준비된 후에 시작하겠다"는 착각이나 실패에 대한 과도한 방어기제가 실행의 첫 발을 묶어두고 있었음을 날카롭게 지적합니다. 오늘의 지배 타로 [${todayDailyTarot.nameKo}]의 파동 속에서, 1번 카드가 요구하는 핵심은 '완벽주의의 단호한 폐기'입니다. 머뭇거리는 고민을 멈추고 거친 초안이라도 즉각 현실로 끄집어내는 태도 전환이 모든 돌파의 시작점입니다.

### 🎯 3. 4원소 역량 역학 진단과 현실적 장애물 타격 [2번 카드: ${cards[1]?.nameKo || '역량 카드'}]
2번 자리에 놓인 [${cards[1]?.nameKo || '2번 카드'}](${cards[1]?.reversed ? '역방향' : '정방향'})는 오늘 당신이 현장에서 즉각 동원해야 할 4원소(불·물·공기·흙)의 현실 역량과 집중 타깃을 제시합니다. 사주에서 강하게 분출되는 ${domElStr}의 에너지가 여러 갈래로 분산되면 조급함과 번아웃을 유발합니다. 2번 카드의 도상은 오늘 당신의 업무와 일상에서 중요하지 않은 80%의 잔가지를 가차 없이 쳐내고, 결과를 좌우하는 20%의 핵심 우선순위 1가지만을 집요하게 공략하라고 지시합니다. 에너지를 한 점에 모을 때 저항은 뚫리고 현실적인 성과가 드러나기 시작합니다.

### 🚀 4. 오라클 돌파 전략과 우선순위 압축 로드맵 [3번 카드: ${cards[2]?.nameKo || '실행 카드'}]
3번 자리에 놓인 [${cards[2]?.nameKo || '3번 카드'}](${cards[2]?.reversed ? '역방향' : '정방향'})는 이번 리딩의 가장 명쾌한 결론이자 즉각적 돌파 로드맵입니다. 사주에서 부족했던 ${lackElStr}과 용신 ${yongsinStr}의 날카로운 실행 기운이 3번 카드의 전략적 도상과 만나 폭발적인 시너지를 냅니다. 오늘의 지배 타로 [${todayDailyTarot.nameKo}]가 제시했던 과제는 이 3번 카드의 명확한 결단을 통해 단숨에 해결됩니다. 더 이상 주저하거나 다른 대안을 기웃거리지 마십시오. 3번 카드가 비추는 전략적 방향성에 모든 자원을 베팅하고 단호하게 실행에 착수하십시오.

### 🛠️ 5. 오늘의 1% 마이크로 실행 시스템과 루시의 단호한 멘토링
${recipientName} 님, 성장은 생각의 깊이가 아니라 행동의 빈도와 속도에서 판가름 납니다. 오늘 즉시 실천할 수 있는 단 하나의 '5분 마이크로 액션'을 설계하십시오.${dailyRemedy ? ` 오늘의 타로 처방("${dailyRemedy}")과 함께` : ''} 지금 당장 미뤄왔던 핵심 문서 1개를 열거나, 결정을 내리지 못했던 사안에 대해 "예/아니오"의 마침표를 찍으십시오. 사주 본원의 기상과 3장의 카드가 당신에게 강력한 성공 모멘텀을 부여하고 있습니다. 머뭇거리지 말고 지금 당장 시작하십시오. 당신의 거침없는 도약을 루시가 끝까지 지원사격하겠습니다!`,
          saju_tarot_synergy: {
            day_master_resonance: `${sajuNameStr}님의 사주 본원 [${dayMasterStr}]의 타고난 결단력과 오늘의 일일 타로 [${todayDailyTarot.nameKo}], 그리고 오라클 3장 [${cards.map(c => c.nameKo).join(' · ')}]의 4원소 현실 역량이 결합하여 지속 가능한 자기계발과 역량 성장의 강력한 모멘텀을 형성합니다.`,
            elemental_balance: {
              dominant_harmony: `사주 ${domElStr}의 강점을 자기계발 루틴과 정렬하여 에너지 낭비 없이 핵심 역량에 집중하도록 돕습니다.`,
              lacking_remedy: `부족한 ${lackElStr}과 ${yongsinStr}의 역량 영역을 1줄 마이크로 습관 시스템으로 채워 흔들리지 않는 자기 효능감을 완성합니다.`
            },
            destiny_flow_synthesis: `오늘의 일일 타로 [${todayDailyTarot.nameKo}]와 2026 병오년의 상승 모멘텀 속에서, 미뤄왔던 자기계발 과제와 학습 역량을 단단하게 구축할 최적의 타이밍입니다.`,
            saju_oracle_verdict: `생각과 계획에 머무르지 않고, 작은 마이크로 실행으로 당신의 역량을 매일 한 뼘씩 확장하세요.`
          },
          card_insights: cards.map((c, i) => ({
            card_name: c.nameKo,
            position_name: slotPositions[i],
            core_meaning: `${c.nameKo} 카드는 [${c.keywords.slice(0, 2).join(', ')}]의 역량 계발 및 실행 원리를 상징합니다. 도상에 새겨진 원형적 뜻은 문제의 핵심을 꿰뚫고 현실적인 해결책을 도출할 수 있는 마인드셋을 선사합니다.`,
            saju_resonance: `질문자의 ${dayMasterStr}과 상응하여, 오늘의 일일 타로 [${todayDailyTarot.nameKo}]와 함께 지체와 완벽주의를 깨부수고 자기계발 효능감을 즉시 극대화합니다.`,
            personal_interpretation: `${slotPositions[i]}의 축으로서, 자신의 한계를 돌파하고 체계적인 성장 루틴을 구축하기 위한 명확한 실천 기준점을 제공합니다.`,
            action_guide: `오늘 즉시 실천할 수 있는 [${c.keywords[0] || '실행'}] 행동을 5분 안에 개시하세요.`,
          })),
          macro_focus: `[${dayMasterStr}]의 본원 기상과 오늘의 일일 타로 [${todayDailyTarot.nameKo}], 그리고 [${cards.map(c => c.nameKo).join(' · ')}]의 역량 흐름에 따라, 오늘은 불필요한 망설임을 걷어내고 내가 통제할 수 있는 최소 단위의 자기계발 행동에 집중할 때입니다. 성장은 실천에서 피어납니다.`,
          dominant_element: {
            element: 'Wands',
            element_ko: '완드 (불) - 실행력 & 자기계발 프로젝트 추진력',
            theme_brief: '미뤄둔 자기계발 공부나 업무 루틴을 5분 안에 착수하여 성장 모멘텀을 형성하는 날'
          },
          micro_mission: {
            title: "미뤄두었던 핵심 자기계발 서류/학습 1개를 열고 5분간 집중 처리하기",
            action_tip: "완벽하게 끝내려 하지 말고, 단 5분만 손을 대보는 것에 의의를 두세요."
          },
          evening_reflection: '오늘 나는 결과에 끌려다니지 않고 스스로의 역량을 한 단계 성장시켰는가?',
          prescribed_art: dynamicPrescribedArt,
        };
        setGrowthResult(fallbackGrowthResult);
        const fbGrowthSession: SavedDailyOracleSession = {
          dateKey: todayDateKey,
          mode: 'growth',
          drawnCards: cards,
          inquiryText: effectiveInquiry,
          growthResult: fallbackGrowthResult,
          savedAt: new Date().toISOString(),
        };
        saveDailyOracleSession('growth', todayDateKey, fbGrowthSession);
        syncOracleSessionToCloud('growth', fbGrowthSession);
        setTodayDailySession(fbGrowthSession);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Complete 1-min healing micro-action and unlock treasure
  const handleCompleteHealing = () => {
    if (!healingResult) return;
    setIsHealingCompleted(true);
    const newTreasure: CollectedTreasure = {
      id: 'treasure_' + Date.now(),
      name: healingResult.reward_item.name,
      description: healingResult.reward_item.description,
      date: new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      cardNames: drawnCards.map((c) => c.nameKo),
    };

    const updated = [newTreasure, ...treasures];
    setTreasures(updated);
    try {
      localStorage.setItem(STORAGE_HEALING_TREASURES, JSON.stringify(updated));
      void updateSharedState({ healingTreasures: updated }, 'trinity_oracle');
    } catch (e) {
      console.warn('Failed to save treasure', e);
    }
  };

  // Complete growth micro-mission
  const handleToggleGrowth = () => {
    const next = !isGrowthCompleted;
    setIsGrowthCompleted(next);
    if (next) {
      const nextStreak = streakCount + 1;
      setStreakCount(nextStreak);
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const growthPayload = { streak: nextStreak, lastDate: todayStr, completed: true };
        localStorage.setItem(
          STORAGE_GROWTH_LOGS,
          JSON.stringify(growthPayload)
        );
        void updateSharedState({ growthLogs: growthPayload }, 'trinity_oracle');
      } catch (e) {
        console.warn('Failed to save growth log', e);
      }
    }
  };

  // ⚠️ 오라클 타로 성찰 주의사항 낭독 문구 (맹목적 믿음 지양 및 주체적 지혜 권고)
  const ORACLE_CAUTION_SPEECH =
    '주의사항을 전해드립니다. 타로는 정해진 미래를 맹목적으로 따르기 위한 것이 아니며, 현재의 마음을 비추고 현명한 선택을 돕는 내면의 성찰 도구입니다. 맹목적인 믿음을 지양하고, 모든 운명의 결정권과 최종 열쇠는 언제나 당신 자신의 주체적인 지혜와 용기에 있음을 기억하세요.';

  // 🎙️ 사주·타로 콜라보 심층 총평 전용 TTS Speech Text (힐링: 사주·타로 마스터 / 기적수업: ACIM 마스터 / 자기계발: 루시 + 끝에 주의사항 낭독)
  const oracleLetterSpeechText = useMemo(() => {
    const message = displayFullReadingText;
    if (!message) return '';
    const recipient = recipientName;
    const intro = oracleMode === 'healing'
      ? `${recipient} 님을 위한 사주와 타로 콜라보 심층 마스터 리딩입니다.`
      : oracleMode === 'miracle'
      ? `${recipient} 님을 위한 기적수업 지각 전환과 참된 용서의 심층 오라클 리딩입니다.`
      : `루시가 ${recipient} 님에게 보내는 명쾌한 자기계발 실행 편지입니다.`;
    return prepareNaturalSpeechText(`${intro}\n\n${message}\n\n${ORACLE_CAUTION_SPEECH}`);
  }, [displayFullReadingText, oracleMode, recipientName]);

  const isOracleLetterTTSActive = useMemo(() => {
    if (!isTTSActive || !oracleLetterSpeechText) return false;
    const cleanSpeech = prepareNaturalSpeechText(oracleLetterSpeechText);
    return ttsState.activeFullText === cleanSpeech;
  }, [isTTSActive, oracleLetterSpeechText, ttsState.activeFullText]);

  const handleToggleOracleLetterTTS = async () => {
    if (isOracleLetterTTSActive) {
      stopTTS();
      return;
    }
    if (oracleLetterSpeechText) {
      await playTTSInChunks(oracleLetterSpeechText, 'Kore', 110);
    }
  };

  // Aliases for compatibility
  const healingLetterSpeechText = oracleLetterSpeechText;
  const isHealingLetterTTSActive = isOracleLetterTTSActive;
  const handleToggleHealingLetterTTS = handleToggleOracleLetterTTS;

  // 🎙️ 오라클 핵심 3줄 요약 TTS 음성 텍스트 및 토글 핸들러 (요약 본문만 깔끔하게 낭독)
  const oracleSummarySpeechText = useMemo(() => {
    if (!oracleSummaryBullets || oracleSummaryBullets.length === 0) return '';
    const intro = oracleMode === 'healing'
      ? `${recipientName} 님의 사주 ✕ 타로 오라클 핵심 3줄 요약입니다.`
      : oracleMode === 'miracle'
      ? `${recipientName} 님의 기적수업 지각전환 핵심 3줄 요약입니다.`
      : `루시의 성장 오라클 핵심 3줄 요약입니다.`;
    const lines = oracleSummaryBullets.map((b) => {
      return b.replace(/^\[([^\]]+)\]\s*/, '$1. ');
    }).join(' ');
    return prepareNaturalSpeechText(`${intro}\n\n${lines}`);
  }, [oracleMode, oracleSummaryBullets, recipientName]);

  const isOracleSummaryTTSActive = useMemo(() => {
    if (!isTTSActive || !oracleSummarySpeechText) return false;
    const cleanSpeech = prepareNaturalSpeechText(oracleSummarySpeechText);
    return ttsState.activeFullText === cleanSpeech;
  }, [isTTSActive, oracleSummarySpeechText, ttsState.activeFullText]);

  const handleToggleOracleSummaryTTS = async () => {
    if (isOracleSummaryTTSActive) {
      stopTTS();
      return;
    }
    if (oracleSummarySpeechText) {
      await playTTSInChunks(oracleSummarySpeechText, 'Kore', 110);
    }
  };

  // 🎴 개별 카드 심층 해설 전용 음성 생성기 및 토글 핸들러
  const [activeCardTTSKey, setActiveCardTTSKey] = useState<string | null>(null);

  const getCardSpeechText = useCallback((card: TarotCard, insight: CardInsight, idx: number) => {
    const parts: string[] = [];
    const slotName = slotPositions[idx] || `${idx + 1}번 위치`;
    parts.push(`${idx + 1}번째 슬롯, ${slotName}의 ${card.nameKo} 카드 심층 해설입니다.`);
    if (insight.core_meaning) {
      parts.push(`카드의 본질적 도상과 상징입니다. ${insight.core_meaning}`);
    }
    if (insight.saju_resonance) {
      parts.push(`사주 본원 및 오행 공명입니다. ${insight.saju_resonance}`);
    }
    if (insight.personal_interpretation) {
      const readerTitle = oracleMode === 'healing' ? '사주와 타로 콜라보 심층 해설입니다.' : oracleMode === 'miracle' ? '기적수업 지각전환 심층 해설입니다.' : '루시의 역량 분석 리딩입니다.';
      parts.push(`${readerTitle} ${insight.personal_interpretation}`);
    }
    if (insight.action_guide) {
      const actionTitle = oracleMode === 'healing' ? '상황을 조화롭게 이끄는 실천 조언입니다.' : oracleMode === 'miracle' ? '기적과 평화를 위한 지각전환 조언입니다.' : '오늘의 1% 실행 팁입니다.';
      parts.push(`${actionTitle} ${insight.action_guide}`);
    }
    return prepareNaturalSpeechText(parts.join(' '));
  }, [oracleMode, slotPositions]);

  const isCardTTSActive = useCallback((cardId: string, speechText: string) => {
    if (!isTTSActive || !speechText) return false;
    const cleanSpeech = prepareNaturalSpeechText(speechText);
    return ttsState.activeFullText === cleanSpeech;
  }, [isTTSActive, ttsState.activeFullText]);

  const handleToggleCardTTS = async (card: TarotCard, insight: CardInsight, idx: number) => {
    const speechText = getCardSpeechText(card, insight, idx);
    const key = `${card.id}-${idx}`;
    if (isCardTTSActive(card.id, speechText)) {
      stopTTS();
      setActiveCardTTSKey(null);
      return;
    }
    setActiveCardTTSKey(key);
    await playTTSInChunks(speechText, 'Kore', 110);
  };

  // Auto-prefetch TTS for Jeje's healing letter
  useEffect(() => {
    if (stage === 'result') {
      if (healingLetterSpeechText && healingLetterSpeechText.length >= 20) {
        prefetchTTS(healingLetterSpeechText.slice(0, 350), 'Kore');
      }
    }
  }, [stage, healingLetterSpeechText]);

  // Executive Summary Card (Substantial Saju-Tarot Synthesis Report)
  // Executive Summary Card (Substantial Saju-Tarot Synthesis Report)
  const renderExecutiveSummaryCard = () => {
    const synergy = oracleMode === 'healing' ? healingResult?.saju_tarot_synergy : oracleMode === 'miracle' ? miracleResult?.saju_tarot_synergy : growthResult?.saju_tarot_synergy;
    const verdict = synergy?.saju_oracle_verdict || (oracleMode === 'healing'
      ? `${saju?.name || recipientName || '내담자'} 님의 사주 본원 기운과 3장의 카드가 조화롭게 만나, 삶의 긴장을 덜고 내면의 평온과 지혜를 회복하는 힐링의 관문이 활짝 열렸습니다.`
      : oracleMode === 'miracle'
      ? `${saju?.name || recipientName || '내담자'} 님의 에고의 두려움이 온전히 해체되고, 성령의 지각 전환을 통해 하나님의 평화와 참된 용서의 관문이 열렸습니다.`
      : growthResult?.macro_focus);
    const resonance = synergy?.day_master_resonance;
    const flow = synergy?.destiny_flow_synthesis;
    const remedy = synergy?.elemental_balance?.lacking_remedy;
    const actionTip =
      oracleMode === 'healing'
        ? healingResult?.micro_action
        : oracleMode === 'miracle'
          ? (miracleResult?.micro_action || miracleResult?.miracle_lesson?.application)
          : growthResult?.micro_mission
            ? `${growthResult.micro_mission.title} — ${growthResult.micro_mission.action_tip}`
            : '';

    if (!verdict && !resonance) return null;

    return (
      <div className="glass p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-purple-950/20 border border-yellow-500/40 shadow-2xl space-y-5 backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar: Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-yellow-500/20 relative z-10">
          <div className="flex items-center gap-2.5 text-yellow-300 font-bold text-sm sm:text-base font-serif">
            <div className="w-8 h-8 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shadow-sm shrink-0">
              <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest block">
                  {oracleMode === 'healing' ? 'SAJU × TAROT COLLABORATION REPORT' : oracleMode === 'miracle' ? 'ACIM × TAROT MIRACLE SHIFT REPORT' : 'SAJU × TAROT SELF-DEVELOPMENT REPORT'}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-200 font-bold border border-yellow-400/30">
                  {oracleMode === 'healing' ? '사주 ✕ 타로 융합 마스터 리포트' : oracleMode === 'miracle' ? '기적수업 지각전환 마스터 리포트' : '자기계발 실행 마스터 리포트'}
                </span>
              </div>
              <h3 className="text-white text-sm sm:text-base font-bold">
                {oracleMode === 'healing'
                  ? '사주 ✕ 타로 콜라보 종합 마스터 리포트'
                  : oracleMode === 'miracle'
                  ? '기적수업 ✕ 타로 지각전환 종합 리포트'
                  : '사주 ✕ 타로 자기계발 종합 마스터 리포트'}
              </h3>
            </div>
          </div>
        </div>

        {/* Master Verdict Quote Box */}
        {verdict && (
          <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-yellow-400/35 relative z-10 shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                <span>{oracleMode === 'healing' ? '🔮' : oracleMode === 'miracle' ? '🕊️' : '⚡'}</span>
                <span>
                  {oracleMode === 'healing'
                    ? 'SAJU × TAROT ORACLE VERDICT (사주 ✕ 타로 최종 오라클 계시)'
                    : oracleMode === 'miracle'
                    ? 'ACIM MIRACLE VERDICT (기적수업 지각전환 최종 선언)'
                    : 'SELF-GROWTH ORACLE VERDICT (자기계발 돌파 계시)'}
                </span>
              </span>
              <span className="text-[10px] text-zinc-400 font-sans">
                {saju?.name}님의 본원 [{saju?.dayMaster.symbolName}] ✕ 3장의 타로
              </span>
            </div>
            <p className="text-sm sm:text-base font-serif font-bold text-yellow-100 leading-relaxed">
              "{verdict}"
            </p>
          </div>
        )}

        {/* 4 Core Fusion Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
          {resonance && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/25 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold font-serif">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  {oracleMode === 'healing' ? '사주 ✕ 타로 본원 공명' : oracleMode === 'miracle' ? '마음의 환영과 내면 평화' : '사주 ✕ 타로 역량 공명'}
                </span>
                <span>{oracleMode === 'healing' ? '본원 기질과 카드의 조화' : oracleMode === 'miracle' ? '에고의 방어기제와 두려움 직시' : '본원 추진력과 자기계발 모멘텀'}</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans pt-0.5">
                {resonance}
              </p>
            </div>
          )}

          {flow && (
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-400/25 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold font-serif">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-400/20 text-purple-200 border border-purple-400/30">
                  {oracleMode === 'healing' ? '2026 병오년 세운 흐름' : oracleMode === 'miracle' ? '거룩한 순간과 지각 전환' : '2026 세운 성장 기회'}
                </span>
                <span>{oracleMode === 'healing' ? '세운 운기와 타이밍' : oracleMode === 'miracle' ? '성령의 눈으로 다시 보기' : '역량 레벨업 & 도약 타이밍'}</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans pt-0.5">
                {flow}
              </p>
            </div>
          )}

          {remedy && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/25 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold font-serif">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  {oracleMode === 'healing' ? '오행 ✕ 용신 조화와 보약' : oracleMode === 'miracle' ? '참된 용서와 하나님의 평화' : '오행 ✕ 용신 습관 보약'}
                </span>
                <span>{oracleMode === 'healing' ? '결핍 오행 보완 & 처방' : oracleMode === 'miracle' ? '과거 투사 거두기와 무조건적 용서' : '결핍 보완 생산성 & 루틴 시스템'}</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans pt-0.5">
                {remedy}
              </p>
            </div>
          )}

          {actionTip && (
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-yellow-300 text-xs font-bold font-serif">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-400/20 text-yellow-200 border border-yellow-400/30">
                  {oracleMode === 'healing' ? '핵심 실천 조언' : oracleMode === 'miracle' ? '오늘의 거룩한 선언' : '오늘의 자기계발 미션'}
                </span>
                <span>{oracleMode === 'healing' ? '일상에서 실천할 조화 가이드' : oracleMode === 'miracle' ? '평화의 확신을 주는 오늘 한 줄 선언' : '지금 실천할 1줄 성장 과제'}</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans pt-0.5">
                {actionTip}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 🌟 78장 오라클 핵심 3줄 요약 전용 그래픽 카드 렌더러
  const renderOracleSummaryCard = () => {
    if (!oracleSummaryBullets || oracleSummaryBullets.length === 0) return null;

    return (
      <TarotSummaryGraphicCard
        bullets={oracleSummaryBullets}
        readingText={displayFullReadingText}
        isTTSActive={isOracleSummaryTTSActive}
        onToggleTTS={oracleSummarySpeechText ? handleToggleOracleSummaryTTS : undefined}
        title={
          oracleMode === 'healing'
            ? '사주 ✕ 타로 융합 핵심 3줄 요약'
            : oracleMode === 'miracle'
            ? '기적수업 지각전환 핵심 3줄 요약'
            : '성장 오라클 핵심 3줄 요약'
        }
        subtitle={
          oracleMode === 'miracle'
            ? 'ACIM ESSENCE · 에고의 환영 해체 ✕ 기적의 지각 전환'
            : 'ORACLE ESSENCE · 사주 원국 ✕ 타로 3카드 융합'
        }
        className="my-3"
      />
    );
  };

  // Render Saju-Tarot Fusion Letter (Healing: Jeje / Growth: Lucy)
  const renderFusionLetterSection = (message?: string) => {
    if (!message) return null;

    const isHealing = oracleMode === 'healing';
    const readingTitle = isHealing
      ? `${recipientName} 님을 위한 사주 ✕ 타로 콜라보 심층 총평`
      : `${recipientName} 님을 위한 사주 ✕ 타로 자기계발 실행 총평`;
    const readingBadgeLatin = isHealing ? "SAJU × TAROT COLLABORATIVE READING" : "LUCY'S ACTION READING";
    const readingBadgeKo = isHealing ? "사주 ✕ 타로 융합 심층 총평" : "사주 ✕ 타로 융합 실행 총평";
    const readingSubtitle = isHealing ? '"사주 원국과 타로 3장의 에너지가 빚어내는 운명과 심리의 나침반"' : '"네 안의 잠재력을 깨우는 단단한 나침반이 되어줄게"';
    const copyHeader = `[${readingTitle}]`;

    return (
      <div className="glass p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/20 via-zinc-950/90 to-purple-950/30 border border-amber-400/35 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* User's Concern Display Pill (if inquiry was specified) */}
        {inquiryText && (
          <div className="mb-4 px-4 py-2.5 rounded-2xl bg-black/40 border border-amber-400/25 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2 text-xs text-zinc-300 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold shrink-0">
                {isHealing ? '성찰 고민' : '돌파 과제'}
              </span>
              <span className="font-medium text-white truncate">"{inquiryText}"</span>
            </div>
            <span className="text-[10px] text-amber-400/80 font-mono shrink-0">
              {isHealing ? '사주 ✕ 타로 1:1 맞춤 리딩' : '1:1 맞춤 실행 서한'}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md shrink-0">
              {isHealing ? (
                <Sparkles size={22} className="text-amber-400 animate-pulse" />
              ) : (
                <Sparkles size={22} className="text-amber-400 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  {readingBadgeLatin}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                  {readingBadgeKo}
                </span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold font-serif text-white mt-0.5">
                {readingTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {/* 🔊 심층 총평 TTS 버튼 */}
            {oracleLetterSpeechText && (
              <button
                type="button"
                onClick={handleToggleOracleLetterTTS}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                  isOracleLetterTTSActive
                    ? "bg-rose-500/30 text-rose-200 border border-rose-400/60 ring-2 ring-rose-400/30 animate-pulse"
                    : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/35 hover:border-amber-400/60"
                }`}
                title={isOracleLetterTTSActive ? "낭독 중지" : (isHealing ? "사주 ✕ 타로 콜라보 리딩 음성으로 듣기" : "루시의 명쾌한 실행 편지 음성으로 듣기")}
              >
                {isOracleLetterTTSActive ? (
                  <>
                    <VolumeX size={14} className="text-rose-300" />
                    <span className="text-[11px]">낭독 중지</span>
                    <span className="flex gap-0.5 ml-0.5">
                      <span className="w-1 h-2.5 bg-rose-300 rounded-full animate-bounce" />
                      <span className="w-1 h-3.5 bg-rose-200 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} className="text-amber-400" />
                    <span className="text-[11px]">{isHealing ? "심층 리딩 듣기" : "실행 편지 듣기"}</span>
                  </>
                )}
              </button>
            )}

            <TarotResultShareButton
              data={oracleShareData}
              variant="compact"
              label="결과 공유"
            />
            <span className="text-xs text-amber-300/80 font-serif italic hidden md:inline-block">
              {readingSubtitle}
            </span>
          </div>
        </div>

        <div className="mt-4 p-6 sm:p-8 rounded-2xl bg-black/50 border border-amber-400/20 relative z-10 space-y-5 shadow-inner">
          <div className="text-sm sm:text-base text-zinc-100 leading-relaxed oracle-markdown-body font-serif">
            <Streamdown immediate enableTTSHighlight={isOracleLetterTTSActive}>{message}</Streamdown>
          </div>

          {/* 리딩 하단 액션 툴바 */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {oracleLetterSpeechText && (
                <button
                  type="button"
                  onClick={handleToggleOracleLetterTTS}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isOracleLetterTTSActive ? <VolumeX size={13} className="text-rose-400" /> : <Volume2 size={13} className="text-amber-400" />}
                  <span>{isOracleLetterTTSActive ? '낭독 중지' : '리딩 음성으로 듣기'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const summaryBlock = oracleSummaryBullets && oracleSummaryBullets.length > 0
                    ? `\n\n【핵심 3줄 요약】\n${oracleSummaryBullets.join('\n')}`
                    : '';
                  const fullText = `${copyHeader}${summaryBlock}\n\n${message}`;
                  navigator.clipboard?.writeText(fullText).then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }).catch(() => {});
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{isCopied ? '총평 복사 완료!' : '총평 복사'}</span>
              </button>
              <TarotResultShareButton
                data={oracleShareData}
                variant="compact"
                label="결과 공유 / 소장"
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
              <Check size={13} className="text-emerald-400" />
              <span>오늘의 오라클 1일 1회 완료</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCollaborativeReadingSection = renderFusionLetterSection;

  // Render Evening Reflection Card
  const renderEveningReflectionSection = (reflection?: string) => {
    if (!reflection) return null;

    return (
      <div className="glass p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-black/50 border border-indigo-400/30 shadow-xl relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-md">
            <Moon size={18} className="text-indigo-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest">
                EVENING REFLECTION PROMPT
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                오늘 밤 성찰 질문
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-serif font-bold text-indigo-100">
              "{reflection}"
            </h4>
          </div>
        </div>
      </div>
    );
  };

  // Toss inspiration to Muse Art Recommendation (Dynamic Art Prescription)
  const handleTossToMuse = () => {
    const activeResult = oracleMode === 'healing' ? healingResult : oracleMode === 'miracle' ? miracleResult : growthResult;
    if (!activeResult) return;

    const prescribed =
      activeResult.prescribed_art ||
      resolvePrescribedArtForCards(drawnCards, saju, oracleMode);

    sendPrismToss({
      sourceApp: 'oracle',
      targetApp: 'muse',
      actionType: 'art_prescription',
      cards: drawnCards.map((c, i) => {
        const insight = activeResult.card_insights?.[i];
        return {
          id: c.id,
          name: c.name,
          nameKo: c.nameKo,
          keywords: c.keywords,
          keyword: c.keywords[0],
          cardName: c.nameKo,
          cardIndex: i,
          description: insight ? `${insight.core_meaning} - ${insight.personal_interpretation}` : c.keywords.join(', '),
        };
      }),
      anchorArtworkTitle: prescribed.artwork_title,
      anchorArtworkCatalogId: prescribed.catalog_id,
      anchorArtQuote: prescribed.art_quote,
      contextMessage: oracleMode === 'healing' ? healingResult?.message : oracleMode === 'miracle' ? miracleResult?.message : growthResult?.macro_focus,
      tossedAt: Date.now(),
    });

    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: '/muse' } }));
    setLocation('/muse');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render Card-by-Card Deep Reading Section (Tabbed 1-Card Focus + 3-Cards Unified View)
  const renderCardInsightsSection = (insights?: CardInsight[]) => {
    if (!insights || insights.length === 0) return null;

    const currentCard = drawnCards[selectedCardIdx] || drawnCards[0];
    const currentInsight = insights[selectedCardIdx] || insights[0];

    const renderCardCard = (card: TarotCard, insight: CardInsight, idx: number) => {
      const isCardRev = Boolean(
        card.reversed === true ||
        card.reversed === ('true' as any) ||
        (card as any)?.isReversed === true ||
        (card as any)?.isReversed === 'true' ||
        (card as any)?.orientation === 'reversed' ||
        (card.nameKo && (card.nameKo.includes('(역)') || card.nameKo.includes('(역방향)'))) ||
        (card.name && (card.name.includes('(Rev)') || card.name.includes('(Reversed)')))
      );
      const cardWithRev = { ...card, reversed: isCardRev };
      return (
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 shadow-lg backdrop-blur-sm"
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div
              onClick={() => setZoomedCard({ card: cardWithRev, slotName: `#${idx + 1} ${slotPositions[idx]}` })}
              className="group/cardthumb relative w-14 h-20 rounded-xl overflow-hidden border border-amber-400/40 hover:border-amber-400 shadow-md hover:shadow-amber-500/20 shrink-0 cursor-zoom-in transition-all"
              title="클릭하여 카드 크게 보기"
            >
              <img
                src={getTarotCardImageUrl(card)}
                alt={card.nameKo}
                style={{ transform: isCardRev ? 'rotate(180deg)' : undefined, transformOrigin: 'center center' }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/cardthumb:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cardthumb:opacity-100 flex items-center justify-center transition-opacity">
                <ZoomIn className="w-4 h-4 text-amber-300 drop-shadow" />
              </div>
              {isCardRev && (
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-rose-950/90 border border-rose-500/70 text-rose-200 text-[7px] font-bold font-mono leading-none pointer-events-none">
                  REV
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
                  #{idx + 1} {slotPositions[idx]}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 uppercase">
                  {card.type === 'major' ? 'MAJOR ARCANA' : card.type.toUpperCase()}
                </span>
                {isCardRev ? (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold flex items-center gap-0.5">
                    <span>⟲ 역방향</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 font-semibold">
                    정방향
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white font-serif mt-1">
                {card.nameKo} <span className="text-xs text-zinc-400 font-sans font-normal italic">({card.name})</span>
              </h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {card.keywords.slice(0, 3).map((kw) => (
                  <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars in clean harmonized grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insight.core_meaning && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-100 leading-relaxed font-sans">
              <span className="font-bold text-amber-300 block mb-1 text-[11px] flex items-center gap-1.5">
                <span>🏛️</span> 카드의 본질적 도상 & 상징
              </span>
              {insight.core_meaning}
            </div>
          )}

          {insight.saju_resonance && (
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-400/20 text-xs text-purple-100 leading-relaxed font-sans">
              <span className="font-bold text-purple-300 block mb-1 text-[11px] flex items-center gap-1.5">
                <span>☯️</span> 사주 본원 및 오행 공명
              </span>
              {insight.saju_resonance}
            </div>
          )}

          {insight.personal_interpretation && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-xs text-emerald-100 leading-relaxed font-sans md:col-span-2">
              <span className="font-bold text-emerald-300 block mb-1 text-[11px] flex items-center gap-1.5">
                <span>{oracleMode === 'healing' ? '🔮' : oracleMode === 'miracle' ? '🕊️' : '⚡'}</span> {oracleMode === 'healing' ? '사주 ✕ 타로 콜라보 심층 해설' : oracleMode === 'miracle' ? '기적수업 지각전환 심층 해설' : '루시의 자기계발 심층 분석 & 역량 가이드'}
              </span>
              {insight.personal_interpretation}
            </div>
          )}

          {insight.action_guide && (
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 text-xs text-zinc-200 leading-relaxed font-sans md:col-span-2">
              <span className="font-bold text-yellow-300 block mb-1 text-[11px] flex items-center gap-1.5">
                <span>💡</span> {oracleMode === 'healing' ? '상황을 조화롭게 이끄는 실천 조언' : oracleMode === 'miracle' ? '기적과 평화를 위한 지각전환 조언' : '오늘 즉시 실천할 1% 자기계발 팁'}
              </span>
              {insight.action_guide}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

    return (
      <div className="glass p-5 sm:p-7 rounded-3xl bg-white/[0.02] border border-amber-400/25 shadow-xl space-y-4 backdrop-blur-xl">
        {/* Header & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif text-white">
                {oracleMode === 'healing'
                  ? '3장의 카드별 심층 분석 (과거 · 현재 · 미래)'
                  : oracleMode === 'miracle'
                  ? '3장의 카드별 기적수업 지각전환 분석'
                  : '3장의 카드별 현실 실행 툴킷'}
              </h3>
              <span className="text-[10px] text-zinc-400 font-sans">
                카드를 하나씩 선택하여 상징과 사주 공명을 집중 탐색해 보세요
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAllCardsTogether(!showAllCardsTogether)}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] text-amber-300 font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            {showAllCardsTogether ? <Eye size={13} /> : <Layers size={13} />}
            <span>{showAllCardsTogether ? '카드 한 장씩 집중보기' : '3장 전체 펼쳐보기'}</span>
          </button>
        </div>

        {/* Card Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setShowAllCardsTogether(true)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              showAllCardsTogether
                ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 shadow-md ring-1 ring-amber-400/30'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>3장 전체</span>
          </button>
          {drawnCards.map((c, i) => {
            const isSelected = !showAllCardsTogether && selectedCardIdx === i;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setShowAllCardsTogether(false);
                  setSelectedCardIdx(i);
                }}
                className={`flex-1 min-w-[110px] px-3 py-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                <span className="text-[10px] opacity-70 font-mono">#{i + 1}</span>
                <span className="truncate">{c.nameKo}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Switch */}
        {showAllCardsTogether ? (
          <div className="space-y-4">
            {drawnCards.map((c, i) => (
              <div key={c.id}>
                {renderCardCard(c, insights[i], i)}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {renderCardCard(currentCard, currentInsight, selectedCardIdx)}
            {/* Step navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={selectedCardIdx === 0}
                onClick={() => setSelectedCardIdx(selectedCardIdx - 1)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                  selectedCardIdx === 0
                    ? 'opacity-30 border-white/5 cursor-not-allowed text-zinc-500'
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-zinc-300 hover:text-white cursor-pointer'
                }`}
              >
                <ChevronLeft size={14} />
                <span>이전 카드</span>
              </button>
              <span className="text-xs text-zinc-500 font-mono">
                {selectedCardIdx + 1} / {drawnCards.length}
              </span>
              <button
                type="button"
                disabled={selectedCardIdx === drawnCards.length - 1}
                onClick={() => setSelectedCardIdx(selectedCardIdx + 1)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                  selectedCardIdx === drawnCards.length - 1
                    ? 'opacity-30 border-white/5 cursor-not-allowed text-zinc-500'
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-zinc-300 hover:text-white cursor-pointer'
                }`}
              >
                <span>다음 카드</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 🌟 오늘의 지배 카드 (Cosmic Anchor) 연동 & 사전 안내 배너 렌더러
  const renderCosmicDominantCardBanner = () => {
    if (!hasTodayDailyResult) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-yellow-400/40 bg-gradient-to-r from-yellow-950/40 via-amber-950/30 to-indigo-950/40 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Ambient glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left Info */}
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.3)] mt-0.5">
                <Sparkles size={22} className="animate-pulse text-yellow-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                    오늘의 지배 카드 (Cosmic Anchor) 연동 안내
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-400/30">
                    사전 추천
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5 flex-wrap">
                  <span>오늘의 타로 선택 시 더 정확한 안내가 가능합니다</span>
                </h4>
                <p className="text-xs text-zinc-300/90 mt-1 leading-relaxed break-keep">
                  오라클 타로는 오늘 하루를 관통하는 <strong className="text-yellow-300 font-bold">'오늘의 지배 카드'</strong>의 기저 파동 및 사주 본원과 융합하여 당신의 고민을 가장 입체적으로 해독합니다. <span className="text-amber-200 font-medium">오늘의 타로를 먼저 확인하시면 리딩의 정밀도가 극대화됩니다.</span>
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400 flex-wrap">
                  <span className="text-amber-400/80">✦</span>
                  <span>현재 당일 천문 시드 지배 카드: <strong className="text-amber-200 font-bold">[{todayDailyTarot.nameKo}]</strong> ({todayDailyTarot.name})</span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-zinc-400">오늘 일진: <span className="text-white font-medium">{dailySaju?.dayPillar.full || '당일 운기'}</span></span>
                </div>
              </div>
            </div>

            {/* Right Action */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleGoToTarot(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <Sparkles size={14} className="text-black" />
                <span>오늘의 타로 먼저 선택하기 (추천)</span>
              </button>
              <span className="text-[10px] text-zinc-400 text-center md:text-right">
                바로 오라클 카드를 뽑으셔도 무방합니다
              </span>
            </div>
          </div>
        </motion.div>
      );
    }

    // When hasTodayDailyResult is true:
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-yellow-400/40 bg-gradient-to-r from-yellow-950/40 via-amber-950/20 to-indigo-950/40 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      >
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left Card Thumbnail + Content */}
          <div className="flex items-center sm:items-start gap-4 min-w-0 flex-1">
            {/* Tarot Card Thumbnail with proper orientation */}
            <div className="relative shrink-0 group">
              <div className="w-14 sm:w-16 h-22 sm:h-24 rounded-xl overflow-hidden border-2 border-yellow-400/60 shadow-[0_0_18px_rgba(234,179,8,0.3)] bg-black/60 relative">
                <img
                  src={getTarotCardImageUrl(todayDailyTarot)}
                  alt={todayDailyTarot.nameKo}
                  className={`w-full h-full object-cover transition-transform duration-300 ${todayDailyTarot.reversed ? 'rotate-180' : ''}`}
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black border tracking-tighter ${
                  todayDailyTarot.reversed
                    ? 'bg-rose-500/90 text-white border-rose-300 shadow-sm'
                    : 'bg-emerald-500/90 text-white border-emerald-300 shadow-sm'
                }`}>
                  {todayDailyTarot.reversed ? '역방향' : '정방향'}
                </span>
              </div>
            </div>

            {/* Info details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-yellow-400 animate-pulse" />
                  오늘의 지배 카드 (Cosmic Anchor)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  오라클 배경 에너지 실시간 연동 활성화
                </span>
              </div>

              <div className="flex items-baseline gap-2 flex-wrap">
                <h4 className="text-base sm:text-lg font-serif font-black text-white tracking-tight">
                  [{todayDailyTarot.nameKo}]
                </h4>
                <span className="text-xs text-yellow-300/80 font-mono">
                  {todayDailyTarot.name}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                  todayDailyTarot.reversed
                    ? 'bg-rose-500/15 text-rose-300 border-rose-400/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                }`}>
                  {todayDailyTarot.reversed ? '역방향 (Reversed)' : '정방향 (Upright)'}
                </span>
              </div>

              <p className="text-xs text-zinc-300/90 mt-1 leading-relaxed break-keep">
                오늘 직접 뽑으신 지배 카드 <strong className="text-yellow-200">[{todayDailyTarot.nameKo}]</strong>의 파동이 사주 본원 <strong className="text-amber-300">[{saju?.dayMaster?.symbolName || '기운'}]</strong>과 공명하며, 이번 오라클 리딩 전반의 상황 진단과 현실 처방에 강력한 배경 에너지로 유기적 연동 중입니다.
              </p>

              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-zinc-400 flex-wrap">
                <span className="text-amber-400/80">✦</span>
                <span>핵심 키워드: <strong className="text-zinc-200">{todayDailyTarot.keywords.slice(0, 3).join(', ')}</strong></span>
                <span className="text-zinc-500">|</span>
                <span>오늘 일진: <strong className="text-white">{dailySaju?.dayPillar.full || '당일 운기'}</strong> {dailySaju?.tenGodGan.name && `[${dailySaju.tenGodGan.name}]`}</span>
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => handleGoToTarot(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-yellow-400/30 text-yellow-300 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 whitespace-nowrap hover:text-white"
              title="오늘의 타로 리딩 결과 및 음성 낭독 확인"
            >
              <Eye size={14} className="text-yellow-400" />
              <span>오늘의 타로 결과 보기</span>
            </button>
            <span className="text-[10px] text-emerald-300/90 text-center md:text-right flex items-center gap-1 justify-center md:justify-end">
              <span>✓ 1일 1회 일일 타로 연동 완료</span>
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 text-white">
      {/* 1. Header & Segment Controller */}
      <div className="glass relative p-5 sm:p-7 rounded-3xl bg-white/[0.04] border border-amber-400/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden">
        {/* Ambient cosmic glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] sm:text-xs font-mono text-amber-300 mb-2 uppercase tracking-widest">
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
              DESTINY ✕ TAROT FUSION
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
              오라클 타로 <span className="text-amber-400/90 font-light text-lg sm:text-xl">· 사주 명리 ✕ 타로 융합</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300/80 mt-1 font-sans">
              {!isModeChosen
                ? '원하시는 모드(🌿 힐링 치유 · 🕊️ 기적수업 지각전환 · ⚡ 자기계발 실행)를 선택하여 시작해 주세요.'
                : oracleMode === 'healing'
                ? '지친 마음의 치유와 안식을 위해 사주 본원과 78장 풀덱 타로가 전하는 따뜻한 힐링 오라클'
                : oracleMode === 'miracle'
                ? '에고의 두려움을 걷어내고 거룩한 순간과 참된 용서를 통해 온전한 평화를 찾는 기적수업 오라클'
                : '역량 강화와 실질적 성장을 위해 사주 추진력과 78장 타로 4원소가 전하는 자기계발 오라클'}
            </p>
          </div>

          {/* Dual Mode Switcher & Mode Change Button */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
            {isModeChosen && (
              <button
                type="button"
                onClick={handleResetToModeSelection}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-amber-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                title="모드 직접 선택 초기화면으로 이동"
              >
                <Layers size={13} className="text-amber-400" />
                <span>모드 선택</span>
              </button>
            )}
            <div className="flex items-center p-1 rounded-2xl bg-black/50 border border-white/10 shadow-inner shrink-0">
              <button
                onClick={() => handleModeSwitch('healing')}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isModeChosen && oracleMode === 'healing'
                    ? 'text-yellow-200 font-bold shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isModeChosen && oracleMode === 'healing' && (
                  <motion.div
                    layoutId="oracle-mode-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/50 via-yellow-600/40 to-indigo-600/40 border border-yellow-400/40"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <Heart size={14} className="relative z-10 text-rose-300" />
                <span className="relative z-10">힐링 (78장)</span>
              </button>

              <button
                onClick={() => handleModeSwitch('miracle')}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isModeChosen && oracleMode === 'miracle'
                    ? 'text-yellow-200 font-bold shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isModeChosen && oracleMode === 'miracle' && (
                  <motion.div
                    layoutId="oracle-mode-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/50 via-indigo-600/40 to-amber-600/40 border border-purple-400/50"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <Feather size={14} className="relative z-10 text-purple-300" />
                <span className="relative z-10">기적수업 (78장)</span>
              </button>

              <button
                onClick={() => handleModeSwitch('growth')}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isModeChosen && oracleMode === 'growth'
                    ? 'text-yellow-200 font-bold shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isModeChosen && oracleMode === 'growth' && (
                  <motion.div
                    layoutId="oracle-mode-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/50 via-yellow-600/40 to-indigo-600/40 border border-yellow-400/40"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <Zap size={14} className="relative z-10 text-amber-400" />
                <span className="relative z-10">자기계발 (78장)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Saju Alignment Status Bar */}
        <div className="relative z-10 mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-medium shadow-sm">
              <Compass size={13} className="text-amber-400" />
              <span>사주 융합 연동:</span>
              <strong className="text-white font-bold">{saju?.name || '여행자'}</strong>
              <span className="text-amber-200">[{saju?.dayMaster.hanja}({saju?.dayMaster.korean}) · {saju?.dayMaster.symbolName}]</span>
            </span>

            {saju && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">木 {saju.elements.counts.목}</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30">火 {saju.elements.counts.화}</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">土 {saju.elements.counts.토}</span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-400/15 text-zinc-200 border border-zinc-400/30">金 {saju.elements.counts.금}</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30">水 {saju.elements.counts.수}</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-400/30 font-sans font-bold">용신: {saju.yongsin.name}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowSajuModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] text-zinc-300 hover:text-white transition-colors"
          >
            <User size={12} className="text-amber-400" />
            <span>생년월일(사주) 수정</span>
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300 flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setIsModeChosen(false);
                setDrawnCards([]);
                setStage('spread');
                stopTTS();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="오라클 모드(힐링 vs 자기계발) 선택 화면으로 이동"
            >
              <Layers size={13} className="text-amber-400" />
              <span>모드 직접 선택</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCardBackModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Quin 스타일 20종 타로 카드 뒷면 덱 커스텀"
            >
              <Palette size={13} className="text-yellow-400" />
              <span>덱 뒷면 ({tarotBackTheme.nameKo})</span>
            </button>

            {oracleMode === 'healing' ? (
              <button
                onClick={() => setShowTreasureModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 transition-colors cursor-pointer"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>오라클 보물상자 ({treasures.length})</span>
              </button>
            ) : oracleMode === 'miracle' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400/30 text-purple-300">
                <Feather size={13} className="text-purple-400" />
                <span>평화의 기적 {miracleTodaySession?.miracleResult ? '완료' : '성찰'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-300">
                <Flame size={13} className="text-orange-400" />
                <span>실행 스트릭 {streakCount}일차</span>
              </div>
            )}
            {todayDailySession && stage !== 'result' && (
              <button
                type="button"
                onClick={() => handleRestoreTodayOracle()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>오늘의 결과 보기</span>
              </button>
            )}
          </div>

          {stage === 'result' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                <Check size={12} className="text-emerald-400" />
                <span>1일 1회 완료 (내일 00시 리셋)</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🌟 오늘의 지배 카드 (Cosmic Anchor) 연동 & 사전 안내 배너 */}
      {renderCosmicDominantCardBanner()}

      {/* 2. Main Stage Area */}
      <AnimatePresence mode="wait">
        {!isModeChosen ? (
          /* 🌟 사용자 요청: "오라클타로 모드직접선택 화면을 오라클타로 초기화면으로 수정"
             진입 시 항상 모드 직접 선택 화면이 초기화면으로 표시됨 */
          <motion.div
            key="oracle-mode-gate-stage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full relative"
          >
            {/* MODE SELECTION GATE: Choose between Healing (22 Major) vs Growth (78 Full Deck) */}
            <div className="glass p-5 sm:p-8 rounded-3xl bg-zinc-950/80 border border-amber-400/25 shadow-2xl relative overflow-hidden text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[11px] font-mono text-amber-300 mb-3 uppercase tracking-widest">
                <Sparkles size={12} className="text-amber-400" />
                ORACLE TAROT MODE SELECTION
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                오라클 타로 모드를 선택해 주세요
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl mx-auto leading-relaxed">
                사주 원국과 공명하는 3가지 특화 타로 모드(🌿 힐링 · 🕊️ 기적수업 · ⚡ 자기계발) 중 원하시는 방식을 선택하세요.<br className="hidden sm:inline" />
                선택하신 모드는 자동으로 저장되어 다음번에도 그대로 유지됩니다.
              </p>

              {/* 🎴 오라클 덱 뒷면 선택 버튼 */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCardBackModal(true)}
                  className="px-3.5 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                  title="Quin 스타일 20종 타로 카드 뒷면 덱 커스텀"
                >
                  <Palette size={13} className="text-yellow-400" />
                  <span>오라클 덱 뒷면: <strong className="text-white underline underline-offset-2">{tarotBackTheme.nameKo}</strong> (클릭하여 변경)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6 max-w-4xl mx-auto text-left">
                {/* 🌿 Healing Mode Option Card */}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('healing')}
                  className={`group relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                    oracleMode === 'healing'
                      ? 'bg-gradient-to-b from-rose-950/40 via-zinc-900/80 to-black border-rose-400/60 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
                      : 'bg-zinc-900/60 hover:bg-zinc-900/90 border-white/10 hover:border-rose-400/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center">
                        <Heart size={20} className="text-rose-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                        {healingTodaySession?.healingResult ? '✓ 오늘 1일 1회 완료' : '78장 풀덱 (1일 1회)'}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-200 transition-colors flex items-center gap-1.5">
                      <span>🌿 힐링 타로</span>
                      <span className="text-xs font-normal text-rose-300/80">(사주 ✕ 타로)</span>
                    </h4>
                    <p className="text-xs text-zinc-300/90 mt-2 leading-relaxed">
                      사주 원국과 78장 타로의 깊은 조화와 치유.<br />
                      과거·현재·미래 3카드 심층 총평과 실천 조언.
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-zinc-400">
                      <ShieldCheck size={13} className="text-rose-400" />
                      <span>정서적 안정 · 번아웃 해소 · 무조건적 수용</span>
                    </div>
                  </div>

                  <div className="mt-5 w-full py-2.5 rounded-xl bg-rose-500/20 group-hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 text-xs font-bold text-center transition-colors">
                    {healingTodaySession?.healingResult ? '✨ 힐링 타로 당일 결과 보기' : '🌿 78장 힐링 타로 덱 펼치기 (1일 1회)'}
                  </div>
                </button>

                {/* 🕊️ Miracle Mode Option Card */}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('miracle')}
                  className={`group relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                    oracleMode === 'miracle'
                      ? 'bg-gradient-to-b from-purple-950/40 via-zinc-900/80 to-black border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
                      : 'bg-zinc-900/60 hover:bg-zinc-900/90 border-white/10 hover:border-purple-400/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
                        <Feather size={20} className="text-purple-300 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        {miracleTodaySession?.miracleResult ? '✓ 오늘 1일 1회 완료' : '78장 풀덱 (1일 1회)'}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 transition-colors flex items-center gap-1.5">
                      <span>🕊️ 기적수업 타로</span>
                      <span className="text-xs font-normal text-purple-300/80">(ACIM 지각전환)</span>
                    </h4>
                    <p className="text-xs text-zinc-300/90 mt-2 leading-relaxed">
                      에고의 두려움을 걷어내고 온전한 평화로 귀환.<br />
                      거룩한 순간·참된 용서 3카드와 워크북 선언.
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-zinc-400">
                      <Sparkles size={13} className="text-purple-400" />
                      <span>지각 전환 · 참된 용서 · 하나님의 평화</span>
                    </div>
                  </div>

                  <div className="mt-5 w-full py-2.5 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-bold text-center transition-colors">
                    {miracleTodaySession?.miracleResult ? '✨ 기적수업 타로 당일 결과 보기' : '🕊️ 78장 기적수업 덱 펼치기 (1일 1회)'}
                  </div>
                </button>

                {/* ⚡ Growth Mode Option Card */}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('growth')}
                  className={`group relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                    oracleMode === 'growth'
                      ? 'bg-gradient-to-b from-amber-950/40 via-zinc-900/80 to-black border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                      : 'bg-zinc-900/60 hover:bg-zinc-900/90 border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                        <Zap size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        {growthTodaySession?.growthResult ? '✓ 오늘 1일 1회 완료' : '78장 풀덱 (1일 1회)'}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors flex items-center gap-1.5">
                      <span>⚡ 자기계발 타로</span>
                      <span className="text-xs font-normal text-amber-300/80">(마인드셋 & 실행)</span>
                    </h4>
                    <p className="text-xs text-zinc-300/90 mt-2 leading-relaxed">
                      현실적 문제 돌파구와 추진력을 깨우는 전략적 통찰.<br />
                      루시의 실행 매트릭스 분석과 1줄 마이크로 미션.
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-zinc-400">
                      <Flame size={13} className="text-amber-400" />
                      <span>역량 레벨업 · 행동 전환 · 데일리 루틴</span>
                    </div>
                  </div>

                  <div className="mt-5 w-full py-2.5 rounded-xl bg-amber-500/20 group-hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold text-center transition-colors">
                    {growthTodaySession?.growthResult ? '✨ 자기계발 타로 당일 결과 보기' : '⚡ 자기계발 타로 덱 펼치기 (1일 1회)'}
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        ) : stage === 'spread' || stage === 'intro' ? (
          /* SPREAD CARD DRAW INTERACTION */
          <motion.div
            key={`oracle-draw-stage-${oracleMode}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full relative"
          >
            <div className="glass p-4 sm:p-6 rounded-3xl bg-zinc-950/70 border border-amber-400/20 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-2">
                <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-400/80">
                    {oracleMode === 'healing' ? 'Inner Child Oracle • 78 Full Deck' : oracleMode === 'miracle' ? 'A Course in Miracles • 78 Full Deck' : 'Mindset Toolkit • 78 Full Deck'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCardBackModal(true)}
                    className="px-2.5 py-1 rounded-xl border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Quin 스타일 20종 타로 카드 뒷면 덱 커스텀"
                  >
                    <Palette size={12} />
                    <span>덱 뒷면 ({tarotBackTheme.nameKo})</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToModeSelection}
                    className="text-[10px] text-zinc-400 hover:text-amber-300 underline underline-offset-2 ml-1 cursor-pointer"
                  >
                    모드 변경
                  </button>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white mt-0.5">
                  {oracleMode === 'healing'
                    ? '내면의 숨결을 마주할 3장의 카드'
                    : oracleMode === 'miracle'
                    ? '거룩한 순간과 지각전환을 위한 3장의 카드'
                    : '오늘의 마인드셋을 이끌 3장의 카드'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  {oracleMode === 'healing'
                    ? '카드를 손가락이나 마우스로 굴려 마음이 이끄는 3장을 천천히 선택해 보세요.'
                    : oracleMode === 'miracle'
                    ? '에고의 환영을 벗고 참된 평화를 비출 3장의 카드를 조용히 선택해 주세요.'
                    : '4원소(불·물·공기·흙)의 현실 실행력을 깨울 3장의 도구를 선택해 주세요.'}
                </p>

                {/* Inquiry Display / Quick Edit in Spread Stage */}
                <div className="max-w-md mx-auto mt-3">
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 border border-amber-400/25 focus-within:border-amber-400/60 transition-all">
                    <Sparkles size={14} className="text-amber-400 shrink-0" />
                    <input
                      type="text"
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      placeholder={
                        oracleMode === 'healing'
                          ? "마음속 고민을 입력하면 치유 편지에 깊이 반영됩니다..."
                          : oracleMode === 'miracle'
                          ? "마음을 어지럽히는 갈등이나 원한을 입력하면 지각전환 리딩에 깊이 반영됩니다..."
                          : "돌파하고 싶은 성장 고민을 입력하면 실행 편지에 깊이 반영됩니다..."
                      }
                      className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    {inquiryText && (
                      <button
                        type="button"
                        onClick={() => setInquiryText('')}
                        className="text-[11px] text-zinc-500 hover:text-zinc-300 shrink-0 cursor-pointer"
                        title="지우기"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* 🌌 오늘의 타로 결과 및 천문 일진 연동 배너 */}
                <div className="max-w-xl mx-auto mt-3 mb-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-wrap items-center justify-between gap-2.5 relative z-10 text-xs text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-mono text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                      {hasTodayDailyResult ? 'DAILY TAROT SYNCED' : 'COSMIC ANCHOR'}
                    </span>
                    <span className="text-zinc-300">
                      오늘의 {hasTodayDailyResult ? '타로 결과 연동' : '지배 타로'}: <strong className="text-amber-200">{todayDailyTarot.nameKo}</strong>
                      <span className="text-[10px] text-amber-400/80 ml-1">
                        ({todayDailyTarot.name}{todayDailyTarot.reversed ? ' • 역방향' : ' • 정방향'})
                      </span>
                    </span>
                    {hasTodayDailyResult && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                        ✓ 일일 타로 리딩 연동됨
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 text-xs">
                    <span className="text-amber-400/80">✦</span>
                    <span>
                      오늘 일진(日辰): <strong className="text-white">{dailySaju?.dayPillar.full || '당일 운기'}</strong>
                      {dailySaju?.tenGodGan.name && <span className="text-amber-300 text-[11px] ml-1">[{dailySaju.tenGodGan.name}]</span>}
                    </span>
                    {dailySaju?.remedy.luckyColor && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 ml-1">
                        (개운: <span className="text-amber-200 font-medium">{dailySaju.remedy.luckyColor}</span>)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Native TarotSpread Component Integration (1일 1회 완료 시 안내 카드 표시, 미완료 시에만 덱 펼치기) */}
              {todayDailySession && (todayDailySession.healingResult || todayDailySession.growthResult || todayDailySession.miracleResult) ? (
                <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-950/30 via-zinc-900/60 to-black border border-amber-400/30 text-center max-w-lg mx-auto shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    오늘의 {oracleMode === 'healing' ? '힐링 타로' : oracleMode === 'miracle' ? '기적수업 타로' : '자기계발 타로'} 1일 1회 완료
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                    오늘 뽑으신 3장의 오라클 카드가 안전하게 보존되어 있습니다.<br />
                    오라클 타로는 깊은 성찰을 위해 하루 1회만 제공됩니다. (내일 00시 리셋)
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRestoreTodayOracle()}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles size={16} />
                    <span>✨ 오늘 오라클 결과 바로 확인하기</span>
                  </button>
                </div>
              ) : (
                <div className="w-full min-h-[440px] md:min-h-[480px] relative">
                  <TarotSpread
                    key={`oracle-spread-${oracleMode}-${cardBackId}`}
                    maxCards={3}
                    positions={slotPositions}
                    deckSource={activeDeckSource}
                    cardBackId={cardBackId}
                    allowReversed={true}
                    spreadName={oracleMode === 'healing' ? '내면아이 쉼 스프레드' : oracleMode === 'miracle' ? '기적수업 지각전환 스프레드' : '4원소 마인드셋 스프레드'}
                    onComplete={handleCardsComplete}
                    onCancel={handleCancelOracleSpread}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* RESULT PRESENTATION AREA */
          <motion.div
            key="oracle-result-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* 🌟 토스된 질문/의제 실시간 표시 배너 */}
            {inquiryText && (
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-900/40 border border-purple-400/40 flex items-center gap-2.5 backdrop-blur-xl shadow-lg">
                <Sparkles size={16} className="text-purple-400 shrink-0 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                    {oracleMode === 'healing' ? '내담자의 마음 치유 고민' : oracleMode === 'miracle' ? '내담자의 용서와 평화 성찰' : '내담자의 자기계발 돌파 과제'}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">"{inquiryText}"</p>
                </div>
              </div>
            )}

            {/* 1. 3D Flipping Cards Spread Row (일반타로와 100% 동일한 상단 카드 펼침) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap px-1 text-center">
                <p className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={11} className="text-yellow-400 animate-pulse" />
                  <span>{oracleMode === 'healing' ? '사주 ✕ 타로 3카드 힐링 스프레드' : oracleMode === 'miracle' ? '기적수업 3카드 지각전환 스프레드' : '4원소 마인드셋 3카드 스프레드'}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCardBackModal(true)}
                    className="px-2.5 py-1 rounded-xl border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="20종 타로 카드 뒷면 덱 커스텀"
                  >
                    <Palette size={11} />
                    <span>덱 뒷면 ({tarotBackTheme.nameKo})</span>
                  </button>
                  <span className="text-[10px] text-yellow-300/70 font-sans flex items-center gap-1">
                    <ZoomIn size={11} className="text-yellow-400" />
                    <span>(카드 클릭 시 확대 보기)</span>
                  </span>
                </div>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.05,
                    },
                  },
                }}
                className="flex gap-2.5 sm:gap-4 flex-wrap justify-center p-2 sm:p-3 max-w-full"
                style={{ perspective: 1200 }}
              >
                {drawnCards.map((card, idx) => {
                  const positionLabel = slotPositions[idx] || `${idx + 1}번`;
                  const isRev = Boolean(
                    card.reversed === true ||
                    card.reversed === ('true' as any) ||
                    (card as any)?.isReversed === true ||
                    (card as any)?.isReversed === 'true' ||
                    (card as any)?.orientation === 'reversed' ||
                    (card.nameKo && (card.nameKo.includes('(역)') || card.nameKo.includes('(역방향)'))) ||
                    (card.name && (card.name.includes('(Rev)') || card.name.includes('(Reversed)')))
                  );
                  const cardWithRev = { ...card, reversed: isRev };
                  return (
                    <TarotFlippingCard
                      key={`${card.id}-${idx}-${cardBackId}`}
                      card={cardWithRev}
                      slotName={positionLabel}
                      index={idx}
                      size="md"
                      cardBackId={cardBackId}
                      onClick={() => setZoomedCard({ card: cardWithRev, slotName: `#${idx + 1} ${positionLabel}` })}
                    />
                  );
                })}
              </motion.div>
            </div>

            {/* Loading Indicator */}
            {isLoading ? (
              <div className="glass p-12 rounded-3xl bg-zinc-950/60 border border-amber-400/20 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                <p className="text-sm font-serif text-amber-200 animate-pulse">
                  {oracleMode === 'healing'
                    ? '사주 원국과 78장 타로를 융합하여 심층 오라클 리딩을 작성 중입니다...'
                    : oracleMode === 'miracle'
                    ? '기적수업의 거룩한 순간과 78장 타로를 융합하여 지각전환의 평화 리딩을 작성 중입니다...'
                    : '4원소 마인드셋과 질문자의 과제를 융합하여 실행 편지를 작성 중입니다...'}
                </p>
              </div>
            ) : (healingResult || growthResult || miracleResult) ? (
              /* 2. Unified Glass Reading Card (일반타로와 100% 동일한 구성) */
              <div className="glass p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-yellow-500/30 shadow-2xl flex flex-col relative overflow-hidden backdrop-blur-xl space-y-4">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] pointer-events-none rounded-full" />

                {/* Header: Title + 전체 낭독 TTS Button */}
                <div className="flex justify-between items-center pb-3 border-b border-white/10 shrink-0 relative z-10 w-full font-sans">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                    <h4 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white font-serif">
                      {oracleMode === 'healing'
                        ? 'Oracle Trinity’s Saju × Tarot Insight'
                        : oracleMode === 'miracle'
                        ? 'Oracle Trinity’s ACIM Miracle Insight'
                        : 'Oracle Lucy’s Self-Growth Insight'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {oracleLetterSpeechText && (
                      <button
                        type="button"
                        onClick={handleToggleOracleLetterTTS}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                          isOracleLetterTTSActive
                            ? "bg-yellow-500/25 text-yellow-300 border border-yellow-400/40 animate-pulse"
                            : "bg-white/10 hover:bg-white/20 text-white/90 border border-white/15"
                        }`}
                        title={isOracleLetterTTSActive ? "낭독 중지하기" : "전체 리딩 음성으로 듣기"}
                      >
                        {isOracleLetterTTSActive ? <VolumeX size={13} className="text-rose-300" /> : <Volume2 size={13} className="text-yellow-400" />}
                        <span>{isOracleLetterTTSActive ? "중지" : "전체 낭독"}</span>
                        {isOracleLetterTTSActive && (
                          <span className="flex gap-0.5 ml-0.5">
                            <span className="w-1 h-2 bg-yellow-300 rounded-full animate-bounce" />
                            <span className="w-1 h-3 bg-yellow-200 rounded-full animate-bounce [animation-delay:0.15s]" />
                            <span className="w-1 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-white/85 text-xs sm:text-sm leading-relaxed relative z-10 w-full font-sans space-y-4" style={{ wordBreak: 'keep-all' }}>
                  {/* ✨ 핵심 3줄 요약 카드 (항상 첫 칸에 고정: 상황 진단, 방향성, 실천 처방 & 원클릭 TTS) */}
                  {renderOracleSummaryCard()}

                  {/* 🔮 오늘의 일일 타로 결과 연동 상태 배너 (오른쪽 리딩 내용 노출 숨김) */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-amber-500/5 border border-amber-400/30 flex items-center gap-2 flex-wrap text-xs shadow-sm">
                    <Sparkles size={14} className="text-amber-400 animate-pulse shrink-0" />
                    <span className="text-amber-300 font-bold text-xs">
                      오늘의 타로 결과 연동:
                    </span>
                    <span className="text-white font-medium">
                      [{todayDailyTarot.nameKo}]
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      todayDailyTarot.reversed
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    }`}>
                      {todayDailyTarot.reversed ? '역방향 (Reversed)' : '정방향 (Upright)'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[10px] font-bold">
                      {hasTodayDailyResult ? '✓ 일일 타로 진단 ✕ 오라클 심층 확장' : '천문 지배 기저 에너지 결합'}
                    </span>
                  </div>

                  {/* 📜 Streamdown 기반 정통 마크다운 본문 리딩 */}
                  <div className="text-white/90 leading-relaxed font-sans text-xs sm:text-sm pt-2">
                    <Streamdown immediate enableTTSHighlight={isOracleLetterTTSActive}>{displayFullReadingText}</Streamdown>
                  </div>

                  {/* 🕊️ 기적수업 거룩한 선언 & 워크북 레슨 카드 (기적수업 모드 시) */}
                  {oracleMode === 'miracle' && miracleResult?.miracle_lesson && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-violet-950/40 border border-violet-400/40 shadow-lg relative overflow-hidden space-y-2.5 my-3">
                      <div className="flex items-center justify-between gap-2 border-b border-violet-400/20 pb-2">
                        <div className="flex items-center gap-2 text-violet-300 font-serif font-bold text-xs sm:text-sm">
                          <Sparkles size={14} className="text-violet-300 animate-pulse" />
                          <span>🕊️ 기적수업 거룩한 선언 & 워크북 레슨</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-200 border border-violet-400/30">
                          {miracleResult.miracle_lesson.source || 'ACIM Workbook Lesson'}
                        </span>
                      </div>
                      <blockquote className="italic text-amber-200 text-xs sm:text-sm border-l-2 border-violet-400/60 pl-3 py-1 my-1">
                        "{miracleResult.miracle_lesson.quote}"
                      </blockquote>
                      {miracleResult.miracle_lesson.application && (
                        <p className="text-white/85 text-[11px] sm:text-xs leading-relaxed pt-1">
                          <span className="text-violet-300 font-semibold mr-1">✦ 지각 전환의 실천:</span>
                          {miracleResult.miracle_lesson.application}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 🌟 그에 맞는 루시의 조언 (TTS 가능) */}
                  <div className="pt-2">
                    <LucyTarotAdviceCard
                      cards={drawnCards}
                      tarotConcern={inquiryText || (oracleMode === 'healing' ? '사주 명리 및 78장 타로 융합 운명 성찰' : oracleMode === 'miracle' ? '에고의 환영 해체 및 기적수업 지각전환' : '현실적인 도전과 자기계발 성장 돌파')}
                      readingText={displayFullReadingText}
                      mode="oracle"
                      oracleMode={oracleMode}
                      saju={saju}
                      className="mt-2"
                    />
                  </div>

                  {/* ⚠️ 타로 성찰 주의사항 (맹목적 믿음 지양 상시 표시) */}
                  <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 space-y-1.5 text-xs text-white/85 shadow-sm">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                      <AlertCircle size={14} className="text-amber-400 shrink-0" />
                      <span>타로 성찰 주의사항 (맹목적 믿음 지양)</span>
                    </div>
                    <p className="leading-relaxed text-white/70 break-keep text-[11px] sm:text-xs">
                      타로는 미래를 결정짓는 절대적 예언이 아니라, 자신의 내면을 성찰하고 더 나은 선택을 돕는 지혜의 나침반입니다. 맹목적인 믿음을 지양하고, 모든 운명의 결정권과 최종 열쇠는 언제나 당신 자신의 주체적인 의지와 지혜에 있습니다.
                    </p>
                  </div>

                  {/* 🔮 오라클 연속 추가 질문 & 잔여 덱 심층 리딩 타임라인 영역 */}
                  <div className="mt-6 pt-6 border-t border-amber-500/25 space-y-5">
                    {oracleFollowUpEntries.length > 0 && (
                      <FollowUpTarotTimeline
                        entries={oracleFollowUpEntries}
                        onZoomCard={(data) => setZoomedCard({ card: data.card, slotName: data.slotName })}
                      />
                    )}
                    <FollowUpTarotInputBar
                      remainingCount={oracleRemainingDeck.length}
                      totalCount={TAROT_DECK.length}
                      drawnCount={oracleDrawnCardIds.size}
                      initialConcern={inquiryText || (oracleMode === 'healing' ? '마음 치유와 회복' : oracleMode === 'miracle' ? '기적수업과 내면의 평화' : '자기계발과 성장 돌파')}
                      drawnCards={drawnCards}
                      isGenerating={isOracleFollowUpGenerating}
                      onDirectDraw={handleOracleDirectFollowUpDraw}
                      onAutoDraw={handleOracleAutoFollowUpDraw}
                      title={`${oracleMode === 'healing' ? '🌿 힐링 오라클' : oracleMode === 'miracle' ? '🕊️ 기적수업 오라클' : '⚡ 자기계발 오라클'} 추가 질문 & 연속 리딩`}
                      subtitle={`초기 3장을 제외한 남은 ${oracleRemainingDeck.length}장의 잔여 덱에서 카드를 뽑아 추가 통찰을 얻으세요.`}
                      customChips={
                        oracleMode === 'healing'
                          ? [
                              '이 상처를 온전히 흘려보내기 위해 지금 필요한 마음가짐은?',
                              '내 안의 치유 에너지를 깨우는 구체적인 사랑의 행동은?',
                              '이 감정이 진정으로 원하는 내면아이의 메시지는 무엇인가요?',
                              '오늘 밤 편안한 수면과 휴식을 돕는 마음의 처방은?',
                            ]
                          : oracleMode === 'miracle'
                          ? [
                              '이 두려움을 참된 용서로 전환하는 거룩한 순간은?',
                              '에고의 환상을 내려놓고 성령의 시선으로 바라보는 법은?',
                              '지금 내 마음에 필요한 기적수업의 평화 원리는 무엇인가요?',
                              '판단과 분리를 멈추고 온전한 사랑을 선택하는 구체적 길은?',
                            ]
                          : [
                              '이 목표를 달성하기 위해 오늘 실행할 가장 강력한 1가지 루틴은?',
                              '나의 숨겨진 잠재력을 폭발시킬 돌파구는 무엇인가?',
                              '결정적 성장을 가로막는 무의식적 한계 신념을 깨는 법은?',
                              '앞으로 30일 내 가장 폭발적인 성과를 낼 우선순위는?',
                            ]
                      }
                      placeholder="오라클 리딩에 대해 더 궁금한 점을 질문하세요"
                    />
                  </div>
                </div>

                {/* 3. Bottom Actions: 1-per-day badge, Mode Switch, Share */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-between gap-2.5 relative z-10 w-full shrink-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
                      <Check size={12} className="text-emerald-400" />
                      <span>오늘의 {oracleMode === 'healing' ? '힐링' : oracleMode === 'miracle' ? '기적수업' : '자기계발'} 오라클 완료 (1일 1회)</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {oracleMode !== 'healing' && (
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('healing')}
                          className="text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all text-[11px] font-bold flex items-center gap-1 py-1.5 px-3 rounded-full bg-emerald-500/15 border border-emerald-400/30 cursor-pointer active:scale-95 shadow-sm"
                          title="힐링 타로 모드로 전환"
                        >
                          <Layers size={12} className="text-emerald-400" />
                          <span>🌿 힐링 타로</span>
                        </button>
                      )}
                      {oracleMode !== 'miracle' && (
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('miracle')}
                          className="text-violet-300 hover:text-white hover:bg-violet-500/20 transition-all text-[11px] font-bold flex items-center gap-1 py-1.5 px-3 rounded-full bg-violet-500/15 border border-violet-400/30 cursor-pointer active:scale-95 shadow-sm"
                          title="기적수업 타로 모드로 전환"
                        >
                          <Layers size={12} className="text-violet-400" />
                          <span>🕊️ 기적수업</span>
                        </button>
                      )}
                      {oracleMode !== 'growth' && (
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('growth')}
                          className="text-amber-300 hover:text-white hover:bg-amber-500/20 transition-all text-[11px] font-bold flex items-center gap-1 py-1.5 px-3 rounded-full bg-amber-500/15 border border-amber-400/30 cursor-pointer active:scale-95 shadow-sm"
                          title="자기계발 타로 모드로 전환"
                        >
                          <Layers size={12} className="text-amber-400" />
                          <span>⚡ 자기계발</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleResetToModeSelection}
                        className="text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-[11px] font-medium flex items-center gap-1 py-1.5 px-3 rounded-full bg-white/5 border border-white/10 cursor-pointer active:scale-95"
                        title="모드 직접 선택 화면으로 이동"
                      >
                        <span>모드 선택 화면</span>
                      </button>
                    </div>
                  </div>

                  <TarotResultShareButton
                    data={oracleShareData}
                    variant="secondary"
                    label="결과 카드 소장 & 공유"
                  />
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Treasure Box Modal */}
      <AnimatePresence>
        {showTreasureModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass w-full max-w-md p-6 rounded-3xl bg-zinc-950 border border-amber-400/30 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400" />
                  <h3 className="text-lg font-serif font-bold text-white">오라클 마음 보물상자</h3>
                </div>
                <button
                  onClick={() => setShowTreasureModal(false)}
                  className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5"
                >
                  닫기
                </button>
              </div>

              {treasures.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  <p>아직 수집된 마음 보물이 없어요.</p>
                  <p className="mt-1 text-zinc-500">오라클 타로 리딩을 완료하고 보물을 수집해 보세요!</p>
                </div>
              ) : (
                <div className="max-h-[340px] overflow-y-auto no-scrollbar space-y-3">
                  {treasures.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl bg-white/[0.04] border border-amber-400/20 flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
                        ✨
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-yellow-200">{t.name}</h4>
                          <span className="text-[10px] font-mono text-zinc-400">{t.date}</span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-0.5">{t.description}</p>
                        <div className="text-[10px] text-zinc-400 mt-1.5 flex items-center gap-1">
                          <span>연계 카드:</span>
                          <span className="text-amber-400/80">{t.cardNames.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Saju Profile Edit Modal */}
      <AnimatePresence>
        {showSajuModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass w-full max-w-md p-6 rounded-3xl bg-zinc-950 border border-amber-400/40 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-amber-400" />
                  <h3 className="text-lg font-serif font-bold text-white">사주 명식 정보 설정</h3>
                </div>
                <button
                  onClick={() => setShowSajuModal(false)}
                  className="text-xs text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveSajuProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">성명 (호칭)</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">생년월일 (양력)</label>
                  <input
                    type="date"
                    value={editBirthdate}
                    onChange={(e) => setEditBirthdate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">태어난 시간</label>
                    <input
                      type="time"
                      value={editBirthtime}
                      onChange={(e) => setEditBirthtime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">성별</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as 'male' | 'female')}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="female">여성</option>
                      <option value="male">남성</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200/90 text-[11px] leading-relaxed">
                  💡 사주 정보를 변경하면 타로 카드 뽑기 시 사용자의 사주 일간(본원) 및 오행 구성, 용신 보약 데이터가 타로 해석에 실시간 자동 융합됩니다.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSajuModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:brightness-110"
                  >
                    저장 및 사주 반영
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tarot Card Zoom Modal */}
      <TarotCardZoomModal
        isOpen={!!zoomedCard}
        onClose={() => setZoomedCard(null)}
        card={zoomedCard?.card ?? null}
        slotName={zoomedCard?.slotName}
      />

      {/* 20종 타로 덱 뒷면 커스텀 모달 */}
      <TarotCardBackCustomizerModal
        isOpen={showCardBackModal}
        onClose={() => setShowCardBackModal(false)}
      />

      {/* 🎡 오라클 잔여 덱 전용 360도 원형 휠 선택 모달 */}
      {showOracleFollowUpWheelModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
          <div className="relative w-full max-w-5xl h-[88vh] rounded-3xl bg-slate-950/95 border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col">
            <TarotSpread
              deckSource={oracleRemainingDeck}
              maxCards={1}
              cardBackId={cardBackId}
              allowReversed={true}
              concern={pendingOracleFollowUpQuestion}
              spreadName={`오라클 추가 질문 #${oracleFollowUpEntries.length + 1}`}
              spreadReason={`초기 3장을 제외한 ${oracleRemainingDeck.length}장의 잔여 덱에서 1장을 직접 고릅니다.`}
              onComplete={handleOracleFollowUpWheelComplete}
              onCancel={() => setShowOracleFollowUpWheelModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
