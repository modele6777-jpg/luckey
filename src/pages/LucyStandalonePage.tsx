import { collectSpeechTranscript, createEndOfSpeechWatcher, type EndOfSpeechWatcher } from '@/lib/speechAutoSend';
import { startGeminiLiveVoice, type LiveVoiceSession } from '@/lib/geminiLiveSession';
import { LucyModeName } from '@/components/chat/LucyModeName';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { LucyModeTransition } from '@/components/chat/LucyModeTransition';
import { LucyEntryScreen, type LucyEntryVariant } from '@/components/chat/LucyEntryScreen';
import { publishTableSaju, publishTableAnswer, publishTableTools } from '@/lib/lucyTableBus';
import { MasterTableSheetButton } from '@/components/duo/MasterTableSheet';
import { extractAllToolFacts, pickCalculatedToolData, type ToolFact } from '@/lib/lucyMasterToolFacts';
import { LUCY_MASTER_DEPTH3_TOOLS } from '@/lib/divination/smartAgentRouter';
import { shouldOfferLucyMaster, dismissLucyMasterOffer, markLucyMasterFromOffer, consumeLucyMasterFromOffer, shouldOfferReturnToLucy, dismissReturnToLucyOffer } from '@/lib/lucyMasterOffer';
import { playLucyMasterSuction } from '@/components/omniwarp/BigBangMasterSuction';
import { isLucyChatPath } from '@/lib/duoPaneFocus';
import { isLucyTarotDrawRequest, isLucyTarotDrawOpen } from '@/lib/lucyTarotIntegrity';
import { useSyncedChatDraft } from '@/hooks/useSyncedChatDraft';
import { LUCY_PRO_PATH, resolveLucyPageChannels } from '@/lib/lucyChatPageMode';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Search, X, Check, Volume2, VolumeX, Square,
  Download, User, Plus, Sparkles, Sun, TreeDeciduous, Activity, Bird, Music, Zap, Flame, Compass,
  Loader2, Copy, RefreshCw, Camera, BookOpen, BookMarked, Mic, MicOff, MessageSquare, ChevronDown
} from 'lucide-react';
import { useApp, PersonaType, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { useTheme, LucyThemeBoundary } from '@/contexts/ThemeContext';
import { saveProfileToAllVaults } from '@/lib/profileVault';
import { useLocation } from 'wouter';
import { playTTS, playTTSInChunks, playQAndATTS, stopTTS, useTTSActive, subscribeTTS, prefetchTTS, prefetchTTSChunks, normalizeTextForSpeech } from '@/utils/tts';
import { unlockAudioPlayback, primeTTSAudioElement } from '@/lib/audio';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import { getLocalDateKey } from '@/lib/rebibleStorage';
import ReactMarkdown from 'react-markdown';
import { LucyProTypewriter } from '@/components/LucyProTypewriter';
import { ChatInsightsBoardModal } from '@/components/ChatInsightsBoardModal';
import { LucyAuraLoader } from '@/components/LucyAuraLoader';
import { LucyMasterTarotRoom } from '@/components/chat/LucyMasterTarotRoom';
import { LucyLibraryDialogs, LucyLibraryTrigger } from '@/components/chat/LucyLibraryDialogs';
import { LucyMasterBgmToggle } from '@/components/chat/LucyMasterBgmToggle';
import { setSelectedEngineKeys } from '@/lib/lucyEngineSelection';
import { detectMasterConcernTopic, getMasterDepthPrompts, type MasterConcernTopic } from '@/lib/lucyMasterPrompts';
import { hasMeaningfulMasterSession, type MasterSessionCardSource } from '@/lib/lucyMasterSessionCard';
import { LucyMasterSessionCard } from '@/components/chat/LucyMasterSessionCard';
import { PageGuideButton } from '@/components/guide/PageGuide';
import { getPageGuide } from '@/lib/pageGuides';
import { archiveMasterSession, buildDepthContinuityContext, buildDepthLinkedLucyContext, buildPastMasterSessionsContext } from '@/lib/lucyMasterContinuity';
import { isLucyMasterBgmPreferred, startLucyMasterBgm, stopLucyMasterBgm, setLucyMasterBgmDepth } from '@/lib/lucyMasterBgm';
import remarkGfm from 'remark-gfm';
import { safeSessionStorage, safeLocalStorage } from '@/utils/safeStorage';
import { isLucyMasterModeOn, setLucyMasterMode, LUCY_MASTER_MODE_EVENT, publishLucyTarotDraw, isAcceptingTarotDrawOffer, buildTarotHouseGuide, createTarotHouseGreeting, consumeTarotHouseGreetingPending, parseAnswerChoices, isAskingForDeepEngines, createDepthTwoTarotOffer, setLucyMasterLink, getLucyMasterLink, resolveLucyMasterLinkChoice, buildLinkedLucyContext, isTarotHouseGreetingPending, findConcernAnchor, createTarotHouseConcernQuestion, LUCY_TAROT_PICK_REQUEST_EVENT, LUCY_TAROT_PICKED_EVENT, LUCY_TAROT_PICK_CANCEL_EVENT, tarotPickPositions, toDetectedTarotCards, takeQueuedMasterTarotSpread, buildSpreadLayoutContext, matchMasterTarotSpread, isAutoSpreadCandidate, getLucyMasterDepth, useLucyMasterDepth, LUCY_MASTER_DEPTH_EVENT, LUCY_MASTER_DEPTH_INFO, LUCY_MASTER_MAX_DEPTH, getLucyBubbleMarker, setLucyBubbleMarker, useLucyBubbleMarker, type LucyMasterDepth } from '@/lib/lucyMasterMode';
import { cleanAssistantMessageDisplay, cleanUserMessageDisplay } from '@/utils/cleanMessage';
import { detectLucyChannelsFromText, formatChannelsModeTitle } from '@/lib/lucyAutoModeDetector';
import { selectOptimalDivinationTools, THEME_PRIMARY_DIVINATION_TOOLS, type SelectedDivinationToolsResult } from '@/lib/fifteenDivinationTools';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { DynamicGhostInputPlaceholder } from '@/components/chat/DynamicGhostInputPlaceholder';
import { ChatProfileDock } from '@/components/chat/ChatProfileDock';
import { useSmartScroll } from '@/hooks/useSmartScroll';
import { isLucyChatPaneVisible } from '@/lib/workspacePaneDom';
import { SmartScrollResumeButton } from '@/components/common/SmartScrollResumeButton';
import { ChatProfileModal } from '@/components/chat/ChatProfileModal';
import { type ChatTargetProfile } from '@/types/chatProfile';
import type { UserProfile } from '@/lib/sharedState';
import { buildMultiProfileSystemContext, generateMultiProfilePrompts } from '@/lib/multiProfileContext';
import { HORI_PROMPT_LIBRARY } from '@/data/horiPromptLibrary';
import { type LucyChatMode, LUCY_MODE_CONFIGS } from '@/components/chat/LucyModeSelectorBar';
import {
  hasEnteredLucyChatToday,
  markLucyChatEnteredToday,
  markFirstLucyVisitCompletedToday,
  hasSpokenDailyGreetingToday,
  markDailyGreetingSpokenToday,
  createDefaultGreeting,
  LUCY_GREETING_BODIES,
  isGreetingMessage,
  saveUnifiedMessagesSafely,
  loadSavedUnifiedMessages,
  mergeUnifiedMessages,
  restoreLatestConversation,
} from '@/lib/chatHistorySync';
import { processDailyChatArchival } from '@/lib/chatMemoryArchive';
import { drawLucyTarotCards, formatTarotMarker, type DetectedTarotCard } from '@/utils/tarotDetector';
import { TarotSpread } from '@/components/trinity/TarotSpread';
import { isLucyScrollPinned, lucyScrollPinHeld, noteLucyScrollPin, overlayCoversElement, releaseLucyScrollPin } from '@/lib/lucyScrollPin';
import { captureLucySearchAnchor, resolveLucySearchOpenGuardedTop, resolveLucySearchRestoreTop, type LucySearchScrollAnchor } from '@/lib/lucySearchScroll';
import { isDualPaneLayout, isDuoUnfoldedState } from '@/lib/perfMode';
import { subscribeFoldState } from '@/lib/foldState';
import { buildLucyTarotReadingPrompt } from '@/lib/lucyTarotReading';
import { getLucyChatDay as getTodayDateKey } from '@/lib/lucyChatDay';
import { joinKakaoBubblesForTTS } from '@/lib/lucyChatUtils';
import { LucyKakaoBubbleGroup } from '@/components/chat/LucyKakaoBubbleGroup';
import { LucyResponseRecommendation } from '@/components/LucyResponseRecommendation';
import { LucyCosmicBackground } from '@/components/chat/LucyCosmicBackground';
import { ALL_DCE_ENGINES } from '@/lib/divination/deterministicEngine';
import { LUCY_PRO_CATALOG_ENGINES } from '@/lib/divination/engineCatalog';
import '@/styles/lucy-starlight.css';

// Helper: Compress uploaded images to prevent UI stutter and huge payload overhead
function compressImageIfNeeded(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const src = loadEvt.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// 🌟 7대 셉타그램 채널 (프롤로그 -> 오렌지 -> 트리니티 -> 아우라 -> 블루버드 -> 뮤즈 -> 에필로그)
export type SpecialChannel = 'prologue' | 'orange' | 'trinity' | 'aura' | 'bluebird' | 'muse' | 'epilogue';
const ALL_CHANNELS: SpecialChannel[] = ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'];

interface ChannelConfig {
  id: SpecialChannel;
  name: string;
  shortName: string;
  tagline: string;
  icon: any;
  persona: PersonaType;
  badgeColor: string;
  activeColor: string;
  dotColor: string;
  onBadgeColor: string;
  prompts: string[];
}

// 🌟 Rich Prompt Pools for Dynamic Random Sampling (모두 자연스럽게 완성된 문장형으로 구성)
const CHANNEL_PROMPT_POOLS: Record<SpecialChannel, string[]> = {
  prologue: [
    '태을신수와 토정비결로 올해 새롭게 펼쳐질 나의 운명적 기회와 서막을 알려줘.',
    '새로운 시작을 앞두고 내 삶의 중심축을 바로잡는 나침반 질문은 무엇일까?',
    '태을신수의 거시적 흐름으로 볼 때 지금 내 인생 주기에서 어떤 서막이 열리고 있을까?',
    '토정비결로 이번 달 나에게 찾아올 반가운 소식과 생활 속 길흉 지침을 짚어줘.',
    '낯선 도전을 시작할 때 두려움을 용기와 설렘으로 바꾸려면 어떻게 해야 할까?',
    '내 안의 가장 순수한 열망과 비전을 명확한 첫걸음으로 구체화해 줘.'
  ],
  orange: [
    '홍국기문(기문둔갑)으로 지금 막힌 상황을 뚫을 최적의 돌파구와 타이밍을 알려줘.',
    '육임의 초전·중전·말전 흐름으로 내가 준비 중인 일의 진행 과정과 결과를 짚어줘.',
    '구성학의 구궁 에너지로 볼 때 올해 나에게 유리한 이동 방향과 공간 개운법은 무엇일까?',
    '기적수업의 관점으로 지금 내가 겪는 인간관계 갈등을 지혜롭게 풀어줘.',
    '내가 직면한 문제를 1원칙(First Principles)과 기문 전략으로 분해해서 명확히 분석해 줘.',
    '중요한 결정을 앞두고 반드시 고려해야 할 숨겨진 변수와 리스크는 무엇일까?',
    '장기적 성장을 위한 나만의 고유한 전략적 로드맵을 설계해 줘.',
    '직관과 논리가 충돌할 때 최선의 결정을 내리는 사고 프레임워크를 알려줘.',
    '현재 상황에서 가장 큰 레버리지 효과를 낼 수 있는 핵심 행동 한 가지는 무엇일까?',
    '내 생각의 확증 편향과 맹점을 점검하고 반대 논리를 냉철하게 검토해 줘.',
    '시간과 에너지의 병목 현상을 해결하는 시스템적 접근법을 알려줘.',
    '불확실성이 높을 때 위험을 최소화하면서 기회를 포착하는 의사결정법은 무엇일까?'
  ],
  trinity: [
    '사주와 자미두수, 점성술을 융합해서 올해 나의 재물운과 커리어 전환점을 분석해 줘.',
    '자미두수 명반의 부처궁과 재백궁 관점에서 내 연애운과 재물 그릇을 쉽게 풀어줘.',
    '나의 사주 본원과 서양 점성술 차트가 말해주는 내 진짜 매력과 강점은 무엇일까?',
    '오늘 나에게 힘이 될 타로와 별자리 메시지를 들려줘.',
    '현재 나의 운의 계절에서 지금은 씨앗을 뿌릴 때일까, 아니면 수확할 때일까?',
    '나의 천을귀인 기운을 일상에서 활성화할 수 있는 실천 팁을 알려줘.',
    '타고난 사주 오행 중 부족한 기운을 일상에서 채우는 개운법을 알려줘.',
    '앞으로 마주할 운의 터닝포인트와 주의해야 할 에너지 흐름을 짚어줘.',
    '내 사주원국의 십신 강점을 극대화하여 재물운을 높이는 방법을 알려줘.',
    '내 직관과 무의식이 가리키는 다음 단계의 영적 방향성은 무엇일까?',
    '내 사주 대운의 흐름에 맞는 올해의 커리어 및 재물 타이밍은 언제일까?',
    '최근 겪는 반복적인 우연과 동시성(Synchronicity)에는 어떤 의미가 있을까?'
  ],
  bluebird: [
    '숙요(27숙)로 나와 내가 신경 쓰이는 사람의 인연 결이 왜 이런지 다정하게 풀어줘.',
    '베딕 점성술 관점에서 내가 반복해서 겪는 마음의 아픔을 치유하는 지혜를 들려줘.',
    '누군가에 대한 억울함과 상처를 참된 용서로 치유하려면 어떻게 해야 할까?',
    '루시야, 오늘 마음이 조금 지치고 버거운데 따뜻하게 위로해 줘.',
    '남들과 비교하며 작아지는 내 마음을 편안하게 달래줄래?',
    '불안과 걱정이 올라올 때 내 마음을 지켜주는 세도나 4문답을 함께 해줘.',
    '오늘 하루 수고한 나 자신에게 건네는 포근한 손편지를 써줘.',
    '내 안의 상처받은 내면아이에게 다정한 포옹과 위로의 말을 건네줘.',
    '스스로를 자책하고 비난하는 마음을 멈추는 자기자비 연습법을 알려줘.',
    '과거의 상처로부터 안전하게 나를 지키는 따뜻한 조언을 들려줘.',
    '가슴속 응어리진 감정을 편안하게 흘려보내는 안전한 위로를 들려줘.',
    '오늘 내 마음을 밝게 채워줄 긍정 확언 문장을 만들어 줘.'
  ],
  aura: [
    '마하보테와 태국점성술로 내 출생 요일 기운에 맞는 오늘의 활력 컬러와 루틴을 알려줘.',
    '태국점성술(호라삿) 관점에서 요즘 지친 내 몸 컨디션을 회복하는 일상 개운법을 추천해 줘.',
    '지금 바로 몸의 긴장을 풀고 피로를 날리는 3분 호흡법을 알려줘.',
    '오늘 나의 신체 에너지와 바이오리듬을 끌어올리는 루틴을 추천해 줘.',
    '깊은 숙면을 취하고 아침을 상쾌하게 깨우는 나이트 케어 가이드를 알려줘.',
    '무기력할 때 뇌를 깨우는 간단한 스트레칭과 수분 섭취 루틴은 무엇일까?',
    '머리에 몰린 열과 복잡한 생각을 발끝으로 내리는 1분 그라운딩 기법을 알려줘.',
    '신경계를 안정시키고 미주신경을 활성화하는 4-7-8 이완 호흡법을 가이드해 줘.',
    '에너지가 방전되었을 때 10분 만에 안전하게 재충전하는 방법을 알려줘.',
    '잠들기 전 5분 동안 온몸의 긴장을 부드럽게 푸는 바디스캔 가이드를 해줘.'
  ],
  muse: [
    '카발라 생명나무와 타로 원형 상징으로 지금 막힌 내 창작 아이디어의 물꼬를 터줘!',
    '카발라의 세피로트 경로처럼 내 머릿속 영감을 현실의 멋진 결과물로 구현하는 법을 알려줘.',
    '서로 대립하는 두 가지 생각을 창의적으로 하나로 융합하는 방법을 알려줘.',
    '새로운 아이디어가 필요한데 내 고정관념을 깨우는 신선한 질문을 던져줘!',
    '지금 내 감정을 은유적으로 담아낸 아름다운 시 한 편을 지어줘.',
    '사람들의 마음을 사로잡는 감각적인 문장과 스토리텔링 아이디어를 추천해 줘.',
    '창작의 벽에 부딪혔을 때 영감의 물꼬를 트는 발상법은 무엇일까?',
    '오늘의 소소한 일상을 특별한 예술적 시선으로 바라보는 관점을 들려줘.',
    '내 프로젝트에 생명력을 불어넣는 참신한 카피라이팅 아이디어를 제안해 줘.',
    '창작 슬럼프를 기분 좋은 휴식과 새로운 도약의 계기로 바꾸는 법을 알려줘.'
  ],
  epilogue: [
    '주역 64괘의 지혜로 오늘 하루 나에게 있었던 일의 의미와 내일의 방향을 갈무리해 줘.',
    '주역과 베딕의 성찰로 지금 내가 나아갈 때인지 잠시 숨을 고를 때인지 짚어줘.',
    '오늘 하루 있었던 일들을 차분히 정리하고 마음을 비워내는 회고 질문을 던져줘.',
    '마음에 남은 응어리와 미련을 있는 그대로 흘려보내는 세도나 4문답을 해줘.',
    '오늘 밤 편안한 쉼과 숙면으로 인도하는 밤의 서재 방하착 가이드를 들려줘.',
    '하루 동안 수고한 나 자신에게 따뜻한 자기자비와 감사의 인사를 건네줘.',
    '오늘 겪은 크고 작은 경험 속에서 내가 얻은 가장 소중한 깨달음은 무엇일까?'
  ]
};

// 👑 Lucy Pro 마스터 추천 질문 (계산 근거와 심층 참고 관점을 구분)
const MASTER_PROMPT_POOL = [
  '올해의 흐름을 7대 테마로 살펴보고, 실제 계산된 결과와 상징 참고 관점을 분리해 알려줘.',
  '중요한 선택을 이번 질문에서 계산된 도구와 관련 있는 심층 관점으로 비교해 줘.',
  '사주·점성술·자미두수·주역 등 실제 산출된 근거와 정성적 참고를 구분해 재물과 커리어를 살펴봐 줘.',
  '지금 고민을 여러 시선으로 비춰보되, 계산 결과와 철학적 관점이 무엇인지 나눠서 설명해 줘.',
  '내면의 본질과 가능성을 7대 테마로 조망하고 근거가 없는 내용은 상징 참고라고 밝혀줘.',
  '사주·심리·신체 에너지·인생 전략 중 이번 질문에서 확인된 결과만 근거로 통합해 줘.',
  '중대한 전환점을 계산 근거와 심층 참고 관점으로 나눠 비교해 줘.',
  '나의 가능성을 살펴보되, 실제 계산된 항목과 영감·철학의 비유를 분명히 구분해 줘.',
  '비즈니스와 삶의 큰 계획을 세우고, 계산된 결과와 참고 관점의 한계를 함께 알려줘.',
  '의사결정의 여러 시선을 비교하되 미실행·미기록 항목은 사용했다고 말하지 말아줘.'
];

// 💬 일상 대화 & 힐링 & 인생 조언을 위한 풍부한 캐주얼 추천 질문 풀 (동적 순환)
const CASUAL_PROMPT_POOL = [
  '루시야, 오늘 하루를 어떻게 보내면 기분이 한결 좋아질까?',
  '요즘 생각이 너무 많은데 머릿속을 정리할 수 있는 좋은 질문을 던져줘.',
  '오늘 나에게 어울리는 행운의 컬러와 마음가짐은 무엇인지 알려줘.',
  '지금 이 순간 내 마음에 가장 필요한 따뜻한 위로는 무엇일까?',
  '오늘 하루를 특별하게 만들어줄 작은 실천 팁 하나만 알려줘.',
  '지친 나를 위해 따뜻한 차 한 잔 마시듯 마음을 포근하게 녹여줘.',
  '답답했던 마음을 시원하게 환기할 수 있는 긍정적인 생각법을 알려줘.',
  '오늘 밤 편안하게 푹 쉴 수 있는 다정한 힐링 한마디 부탁해.',
  '내 안의 불안을 가라앉히고 평온함을 되찾는 짧은 대화를 나누자.',
  '루시, 오늘 나 자신을 더 사랑할 수 있는 칭찬 한마디 해줄래?',
  '새로운 시작을 앞두고 용기를 북돋워 주는 따뜻한 조언을 듣고 싶어.',
  '지금 내 마음의 날씨를 알아차리고 다독여주는 시간을 가져보자.',
  '오늘 하루 소소하지만 확실한 행복을 찾는 비결은 무엇일까?',
  '루시의 눈으로 본 나의 가장 빛나는 장점은 무엇인지 말해줘.',
  '스트레스를 비우고 좋은 에너지를 채우는 오늘의 확언 한 줄을 들려줘!',
  '마음이 복잡할 때 호흡을 차분히 가다듬는 1분 이완법을 알려줘.',
  '인간관계에서 마음의 경계를 건강하게 지키는 방법은 무엇일까?',
  '오늘 나에게 일어날 수 있는 기분 좋은 우연과 행운은 무엇일지 알려줘.',
  '스스로에게 너무 엄격해질 때 나를 다정하게 안아주는 법을 알려줘.',
  '오늘 하루를 감사함으로 마무리하는 저녁 루틴을 추천해 줘.',
  '무기력할 때 작은 활력을 불어넣는 3분 기분 전환 팁을 알려줘.',
  '내 마음속 숨은 열정과 호기심을 깨우는 영감 질문을 던져줘.'
];

// 호리 프롬프트의 짧은 명사형 제목을 자연스럽게 완성된 문장형 질문으로 변환하는 헬퍼
function toCompleteSentencePrompt(title: string, body?: string): string {
  const t = (title || '').trim();
  if (!t) return '';
  // 이미 완성된 문장 종결어미로 끝나는 경우 그대로 사용하되 물음표/마침표 보정
  if (/[.!?]$/.test(t)) return t;
  if (/(할까|일까|볼까|줄래|할래|있을까|없을까|언제|누구|뭐야|어때|어떨까|무엇일까|어디일까)$/.test(t)) {
    return `${t}?`;
  }
  if (/(해줘|해 줘|알려줘|알려 줘|짚어줘|짚어 줘|봐줘|봐 줘|들려줘|들려 줘|써줘|써 줘|지어줘|부탁해|나누자|가져보자|싶어)$/.test(t)) {
    return `${t}.`;
  }
  // 본문(body)의 첫 문장이 적절한 길이(65자 이하)의 완성형 문장이라면 활용
  if (body) {
    const firstSentence = body.split(/(?<=[.!?])\s+/)[0]?.trim();
    if (firstSentence && firstSentence.length >= 14 && firstSentence.length <= 62) {
      return firstSentence;
    }
  }
  // 명사구 형태로 끝나는 제목을 자연스러운 완성형 질문 문장으로 변환
  if (/(방법|비결|가이드|루틴|팁|전략|처방|연습|기법|법)$/.test(t)) {
    return `${t}을 자세히 알려줘.`;
  }
  if (/(분석|진단|점검|설계|해석|풀이)$/.test(t)) {
    return `${t}을 해줘.`;
  }
  if (/(시기|타이밍|언제)$/.test(t)) {
    return `${t}는 언제쯤 찾아올까?`;
  }
  if (/(운세|흐름|전환점|가능성|점수|궁합|속마음|재능|분야|스타일|특징|의미|이유)$/.test(t)) {
    return `${t}은 어떤지 자세히 알려줘.`;
  }
  return `${t}에 대해 자세히 분석해서 알려줘.`;
}

const SPECIAL_CHANNELS: Record<SpecialChannel, ChannelConfig> = {
  // 0. 빨 (빨강) - 프롤로그
  prologue: {
    id: 'prologue',
    name: '프롤로그',
    shortName: '프롤로그',
    tagline: '태을신수·토정비결 기반 새로운 서막 & 비전 설계',
    icon: Compass,
    persona: 'lucy',
    badgeColor: 'bg-red-500 text-white',
    activeColor: 'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-400/50',
    dotColor: 'bg-red-500',
    onBadgeColor: 'bg-red-200/90 text-red-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.prologue
  },
  // 1. 주 (주황) - 오렌지 
  orange: {
    id: 'orange',
    name: '오렌지',
    shortName: '오렌지',
    tagline: '홍국기문·육임·구성학 & 1원칙 전략적 결단',
    icon: TreeDeciduous,
    persona: 'orange',
    badgeColor: 'bg-orange-500 text-white',
    activeColor: 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-400/50',
    dotColor: 'bg-orange-500',
    onBadgeColor: 'bg-orange-200/90 text-orange-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.orange
  },
  // 2. 노 (노랑) - 트리니티 
  trinity: {
    id: 'trinity',
    name: '트리니티',
    shortName: '트리니티',
    tagline: '사주·점성술·자미두수·타로 입체 운명 통찰',
    icon: Sparkles,
    persona: 'trinity',
    badgeColor: 'bg-amber-400 text-amber-950 font-bold',
    activeColor: 'border-amber-400 bg-amber-50 text-amber-950 ring-2 ring-amber-300/50',
    dotColor: 'bg-amber-500',
    onBadgeColor: 'bg-amber-200/90 text-amber-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.trinity
  },
  // 3. 초 (초록) - 아우라 
  aura: {
    id: 'aura',
    name: '아우라',
    shortName: '아우라',
    tagline: '마하보테·태국점성술 생체 리듬 & 신체 웰니스',
    icon: Activity,
    persona: 'aura',
    badgeColor: 'bg-emerald-500 text-white',
    activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/50',
    dotColor: 'bg-emerald-500',
    onBadgeColor: 'bg-emerald-200/90 text-emerald-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.aura
  },
  // 4. 파 (파랑) - 블루버드 
  bluebird: {
    id: 'bluebird',
    name: '블루버드',
    shortName: '블루버드',
    tagline: '숙요(27숙)·베딕 인연 치유 & 따뜻한 마음 위로',
    icon: Bird,
    persona: 'bluebird',
    badgeColor: 'bg-blue-500 text-white',
    activeColor: 'border-blue-500 bg-blue-50 text-blue-950 ring-2 ring-blue-400/50',
    dotColor: 'bg-blue-500',
    onBadgeColor: 'bg-blue-200/90 text-blue-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.bluebird
  },
  // 5. 남 (남색) - 뮤즈 
  muse: {
    id: 'muse',
    name: '뮤즈',
    shortName: '뮤즈',
    tagline: '카발라 생명나무·타로 상징 & 창작 영감 발현',
    icon: Music,
    persona: 'muse',
    badgeColor: 'bg-indigo-600 text-white',
    activeColor: 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-400/50',
    dotColor: 'bg-indigo-600',
    onBadgeColor: 'bg-indigo-200/90 text-indigo-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.muse
  },
  // 6. 보 (보라/분홍) - 에필로그
  epilogue: {
    id: 'epilogue',
    name: '에필로그',
    shortName: '에필로그',
    tagline: '주역 64괘·베딕 성찰 기반 하루 마감 & 회고',
    icon: BookOpen,
    persona: 'lucy',
    badgeColor: 'bg-pink-500 text-white',
    activeColor: 'border-pink-500 bg-pink-50 text-pink-950 ring-2 ring-pink-400/50',
    dotColor: 'bg-pink-500',
    onBadgeColor: 'bg-pink-200/90 text-pink-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.epilogue
  }
};

function parsePendingChannels(pending: string | null): SpecialChannel[] {
  if (!pending) return [];
  if (pending === 'casual' || pending === 'lucy') {
    return []; // 💬 Casual Chat (수다 모드)
  }
  if (pending === 'master' || pending === 'all') {
    return ALL_CHANNELS; // 👑 7대 채널 올인원 PRO 마스터 모드
  }
  const aliasMap: Record<string, SpecialChannel> = {
    prologue: 'prologue',
    deepthink: 'orange',
    orange: 'orange',
    oracle: 'trinity',
    trinity: 'trinity',
    vitality: 'aura',
    aura: 'aura',
    healing: 'bluebird',
    bluebird: 'bluebird',
    creative: 'muse',
    muse: 'muse',
    epilogue: 'epilogue',
  };
  const resolved = (aliasMap[pending] || pending) as SpecialChannel;
  if (ALL_CHANNELS.includes(resolved)) {
    return [resolved];
  }
  return [];
}

// Helper: Fisher-Yates array shuffling
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 말풍선 메시지의 고유 모드 및 채널들을 정확하게 분석/추출하는 헬퍼 함수
 * - 각 메시지가 실제로 작성/사용되었던 모드(수다 모드, 단일 채널, 융합 시너지, 올인원 마스터)를 온전히 보존
 * - 현재 화면이 일반 루시인지 루시 플러스인지에 관계없이 과거 대화가 임의로 덧씌워지지 않고 원래 모드로 표기됩니다.
 */
export function resolveMessageModeAndChannels(
  msg: any,
  filteredMessages?: any[],
  index?: number,
  _allowMaster?: boolean
): {
  mode: string;
  channels: SpecialChannel[];
  isMaster: boolean;
  isCasual: boolean;
  badgeLabel: string;
  badgeColor: string;
  badgeIcon: string;
} {
  // 메시지 객체별 실제 모드 캐시 (화면 모드 전환 시에도 기존 메시지 모드가 변질되지 않도록 영구 보존)
  if (msg && typeof msg === 'object' && (msg as any)._msgActualModeInfo_v4) {
    return (msg as any)._msgActualModeInfo_v4;
  }

  let rawChannels: string[] = Array.isArray(msg?.channels) ? [...msg.channels] : [];
  let rawMode: string = msg?.mode || msg?.channel || '';

  const msgId = String(msg?.id || '');
  const rawTextContent = typeof msg?.content === 'string' 
    ? msg.content 
    : (Array.isArray(msg?.content) ? (msg.content.find((item: any) => item.type === 'text')?.text || '') : '');
  const cleanText = rawTextContent.trim();

  // 0. 환영 및 일일 인사말 메시지인 경우: 인사말 고유의 모드/내용을 통해 실제 모드 추출
  const isGreet = msgId === 'greet' || msgId === 'greet-main' || msgId.startsWith('greet-') || msgId.includes('greet') || isGreetingMessage(msg);
  if (isGreet) {
    const isProTier = Boolean(
      typeof window !== 'undefined' && (
        window.location.search.includes('mode=pro') ||
        window.location.search.includes('mode=ultra') ||
        (safeLocalStorage.getItem('lucy_tier_mode') === 'pro' && !document.documentElement.classList.contains('lucy-plus-active'))
      )
    );
    const isMasterGreetingText = 
      isProTier && (
        cleanText.includes('운명학') || 
        cleanText.includes('마스터 모드') ||
        cleanText.includes('올인원 마스터') || 
        cleanText.includes('루시 프로') ||
        cleanText.includes('결정론') ||
        cleanText.includes('7대 테마')
      );
    if (isProTier && (rawMode === 'master' || isMasterGreetingText)) {
      rawChannels = [...ALL_CHANNELS];
      rawMode = 'master';
    } else {
      rawChannels = [];
      rawMode = 'casual';
    }
  }

  // 0-1. 메시지 본문이 명백한 일상 수다 대화인 경우 (수다 권유, 일상 안부 등 운명학 도구 분석이 없는 대화)
  const isExplicitCasualChatText = 
    (cleanText.includes('일상 수다가 필요해') || 
     cleanText.includes('가벼운 일상 수다') || 
     cleanText.includes('수다 떨 준비되어 있어') || 
     cleanText.includes('나랑 가볍게 수다 떨자') ||
     cleanText.includes('도란도란 이야기 나눌 준비가 되어 있으니까')) &&
    !cleanText.includes('15대 운명학') &&
    !cleanText.includes('올인원 마스터') &&
    !cleanText.includes('사주명리');

  if (isExplicitCasualChatText) {
    rawMode = 'casual';
    rawChannels = [];
  }

  // 1. 모델/사용자 메시지에 모드 및 채널이 비어 있는 경우 이전/다음 메시지로부터 상속 확인
  if (rawChannels.length === 0 && !rawMode && filteredMessages && typeof index === 'number') {
    // 1-1. 모델 메시지인 경우 직전 사용자 메시지 확인
    if (index > 0) {
      const prev = filteredMessages[index - 1];
      if (prev && prev.role === 'user') {
        if (Array.isArray(prev.channels) && prev.channels.length > 0) {
          rawChannels = [...prev.channels];
        }
        if (prev.mode) {
          rawMode = prev.mode;
        }
      }
    }
    // 1-2. 사용자 메시지인 경우 직후 모델 메시지 확인
    if (rawChannels.length === 0 && !rawMode && index < filteredMessages.length - 1) {
      const next = filteredMessages[index + 1];
      if (next && next.role !== 'user') {
        if (Array.isArray(next.channels) && next.channels.length > 0) {
          rawChannels = [...next.channels];
        }
        if (next.mode) {
          rawMode = next.mode;
        }
      }
    }
  }

  // 2. 메시지에 14개 이상의 운명학 도구(usedTools)가 사용된 모델 메시지인 경우 마스터 모드
  if (rawChannels.length === 0 && !rawMode && Array.isArray(msg?.usedTools) && msg.usedTools.length >= 14) {
    rawChannels = [...ALL_CHANNELS];
    rawMode = 'master';
  }

  // 3. 여전히 비어 있다면 본문 텍스트의 키워드 및 의도 분석
  if (rawChannels.length === 0 && !rawMode) {
    const detected = detectLucyChannelsFromText(cleanText, { allowMaster: true });
    if (detected.isMaster) {
      rawChannels = [...ALL_CHANNELS];
      rawMode = 'master';
    } else if (detected.channels.length > 0) {
      rawChannels = [...detected.channels];
      rawMode = detected.channels.length === 1 ? detected.channels[0] : 'synergy';
    } else {
      rawChannels = [];
      rawMode = 'casual';
    }
  }

  const filteredChannels = rawChannels.filter((c: any) => ALL_CHANNELS.includes(c)) as SpecialChannel[];
  const isAllChannels = filteredChannels.length === ALL_CHANNELS.length && ALL_CHANNELS.every((c) => filteredChannels.includes(c));

  const isProMsg = Boolean((msg as any)?.isPro || (msg as any)?.isLucyPro || msg?.conversationId === 'lucy-pro');
  const isMaster = Boolean(
    (rawMode === 'master' || msg?.mode === 'master') && isProMsg
  );
  const validChannels = isMaster ? [...ALL_CHANNELS] : filteredChannels;
  const isCasual = !isMaster && (rawMode === 'casual' || (validChannels.length === 0 && !['synergy', 'auto'].includes(rawMode || '')));

  let badgeLabel = rawMode === 'auto' && validChannels.length === 0 ? 'AI 심층 자동 상담' : '수다 모드';
  let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white border-slate-200 dark:border-white/20';
  let badgeIcon = rawMode === 'auto' && validChannels.length === 0 ? '⚡' : '💬';

  if (isMaster || isAllChannels || validChannels.length === 7 || rawMode === 'master') {
    badgeLabel = '올인원 심층 분석';
    badgeColor = 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 font-bold border-amber-400';
    badgeIcon = '👑';
  } else if (validChannels.length === 1) {
    const ch = validChannels[0];
    const cfg = SPECIAL_CHANNELS[ch];
    badgeLabel = cfg ? cfg.name : ch;
    badgeColor = cfg ? `${cfg.activeColor} dark:bg-slate-800 dark:text-white dark:border-amber-400/50 border font-bold` : 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-white border-amber-200 dark:border-amber-500/40';
    badgeIcon = ch === 'prologue' ? '🌅' : ch === 'trinity' ? '🔮' : ch === 'orange' ? '🍊' : ch === 'aura' ? '🌿' : ch === 'bluebird' ? '🕊️' : ch === 'muse' ? '🎨' : '🌙';
  } else if (validChannels.length >= 2 && validChannels.length < 7) {
    const names = validChannels.map((c) => SPECIAL_CHANNELS[c]?.shortName || c).join(' + ');
    badgeLabel = `${validChannels.length}중 융합 (${names})`;
    badgeColor = 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-300 font-bold';
    badgeIcon = '⚡';
  }

  const result: {
    mode: string;
    channels: SpecialChannel[];
    isMaster: boolean;
    isCasual: boolean;
    badgeLabel: string;
    badgeColor: string;
    badgeIcon: string;
  } = {
    mode: isMaster ? 'master' : (isCasual ? 'casual' : (validChannels.length === 1 ? validChannels[0] : 'synergy')),
    channels: isMaster ? [...ALL_CHANNELS] : validChannels,
    isMaster,
    isCasual,
    badgeLabel,
    badgeColor,
    badgeIcon
  };

  if (msg && typeof msg === 'object') {
    try {
      (msg as any)._msgActualModeInfo_v4 = result;
    } catch (_) {}
  }

  return result;
}

// 🎲 현재 프로필 및 모드에 맞춰 차분하게 제공되는 엄선된 추천 질문 6선 생성 순수 함수
function getCuratedPrompts(
  profiles: ChatTargetProfile[], 
  mode: LucyChatMode,
  channels: SpecialChannel[] = [],
  master: { depth: LucyMasterDepth; topic: MasterConcernTopic } = { depth: 1, topic: 'general' }
): string[] {
  // 🔮 루시 마스터: 상담 깊이(1~3)와 중심 고민 주제에 맞춰 점점 더 심오한 질문
  if (mode === 'master') return getMasterDepthPrompts(master.depth, master.topic);

  // 0. 다자간(2인 이상) 프로필 활성화 시: 두 사람(구성원)의 이름을 반영한 궁합·연애·시너지 맞춤 질문
  if (profiles.length >= 2) {
    const multiPrompts = generateMultiProfilePrompts(profiles);
    return shuffle(multiPrompts).slice(0, 6);
  }

  // 1. 2개 이상의 채널이 활성화된 융합(Fusion / Synergy) 모드인 경우
  if (channels.length >= 2) {
    const fusionPool: string[] = [];
    channels.forEach((ch) => {
      const pool = CHANNEL_PROMPT_POOLS[ch];
      if (pool) {
        fusionPool.push(...shuffle(pool).slice(0, 3));
      }
    });
    if (fusionPool.length >= 4) {
      return shuffle(Array.from(new Set(fusionPool))).slice(0, 6);
    }
  }

  // 2. 단일 특화 채널 모드 선택 시 (channels[0] 또는 mode가 특정 채널)
  const singleChannel = (channels.length === 1 ? channels[0] : (mode !== 'auto' && mode !== 'casual' ? mode : null)) as SpecialChannel | null;
  if (singleChannel && CHANNEL_PROMPT_POOLS[singleChannel]) {
    const pool = CHANNEL_PROMPT_POOLS[singleChannel];
    return shuffle(pool).slice(0, 6);
  }

  // 3. 7대 채널 올인원 마스터 모드 (레거시 또는 7대 전체 활성)
  if (channels.length === ALL_CHANNELS.length) {
    return shuffle(MASTER_PROMPT_POOL).slice(0, 6);
  }

  // 4. 수다 모드 명시 선택 시 (레거시)
  if (mode === 'casual') {
    return shuffle(CASUAL_PROMPT_POOL).slice(0, 6);
  }

  // 5. AI 스마트 자동 감지 모드 기본 대기 상태 (7대 채널 + 호리 77선 전편에서 균형 있게 선별)
  const diversePool: string[] = [
    ...shuffle(CHANNEL_PROMPT_POOLS.trinity).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.orange).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.aura).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.bluebird).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.muse).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.prologue).slice(0, 1),
    ...shuffle(CHANNEL_PROMPT_POOLS.epilogue).slice(0, 1),
    ...shuffle(HORI_PROMPT_LIBRARY.map((p) => toCompleteSentencePrompt(p.title, p.body))).slice(0, 4),
    ...shuffle(CASUAL_PROMPT_POOL).slice(0, 2),
  ];
  return shuffle(Array.from(new Set(diversePool))).slice(0, 6);
}

export type LucyTier = 'ai' | 'plus';

// 추천 질문 마키: 기존 CSS 흐름(38초에 한 바퀴)과 같은 속도, 조작이 끝난 뒤 1.2초 뒤 자동 재개
const PROMPTS_MARQUEE_FLOW_DURATION_MS = 38000;
const PROMPTS_MARQUEE_MAX_PX_PER_SECOND = 22;
const PROMPTS_MARQUEE_RESUME_DELAY_MS = 1200;

const detectPageChannels = (text: string, options: { allowMaster?: boolean } = {}) =>
  detectLucyChannelsFromText(text, { allowMaster: Boolean(options.allowMaster) });

/** The first Lucy mount in this page load uses the initial aura loader instead of the entry screen. */
let lucyMountedBefore = false;

/** Lucy Master answers take longer; show the elapsed time so the wait never looks frozen. */
function LucyThinkingElapsed({ isLight, depth = 1 }: { isLight: boolean; depth?: LucyMasterDepth }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span data-lucy-thinking-elapsed className={`text-[11px] font-semibold tabular-nums ml-1 ${isLight ? 'text-emerald-800/80' : 'text-white/70'}`}>
      {seconds}초 · {depth >= 3 ? '심층 상담이라 1~2분 걸릴 수 있어요' : depth === 2 ? '심화 상담이라 조금 더 걸려요' : '보통 1분 안팎'}
    </span>
  );
}

function LucyStandaloneContent({ pro = false }: { pro?: boolean }) {
  // Lucy and Lucy+ share one required basic-tool + deep-perspective answer policy.
  // 🌟 실제 펼친 듀얼스크린 감지:
  // 오직 실제 DOM에 '#duo-lucy-viewport' 및 '#duo-content-viewport'가 모두 존재하고 isDuoUnfoldedState().unfolded가 true일 때만 '펼침'으로 판정!
  // 접힌 단일 화면에서는 isActuallyUnfoldedDual이 무조건 false!
  const [location, navigate] = useLocation();

  const isActuallyUnfoldedDual = typeof document !== 'undefined' && Boolean(
    document.getElementById('duo-lucy-viewport') && document.getElementById('duo-content-viewport')
  ) && isDuoUnfoldedState().unfolded;

  const [isDuoUnfolded, setIsDuoUnfolded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return isActuallyUnfoldedDual;
  });
  const isDuoPortrait = isDuoUnfolded && isDuoUnfoldedState().orientation === 'portrait';

  // Lucy Plus is a distinct bubble step, active only in the unfolded Lucy cosmic room.
  const [isMasterMode, setIsMasterMode] = useState<boolean>(() => isLucyMasterModeOn());
  const bubbleMarker = useLucyBubbleMarker();
  const isCosmicRoomActive = isActuallyUnfoldedDual && isLucyChatPath(location) && !isMasterMode;

  const [lucyTier, setLucyTier] = useState<LucyTier>(() => {
    try {
      if (typeof window !== 'undefined') {
        const mode = new URLSearchParams(window.location.search || '').get('mode');
        if (mode === 'ai') return 'ai';
        if (mode === 'plus') return 'plus';
        return isCosmicRoomActive ? 'plus' : 'ai';
      }
    } catch {
      return 'ai';
    }
    return 'ai';
  });

  // 🔮 점술모드(Lucy Master): 빅뱅 버튼 홀드로 켜고 끈다. 접힘·펼침 모두 같은 값을 쓴다.
  // 🔮 상담 깊이(빅뱅 홀드로 1→2→3). 바뀔 때 잠깐 안내를 띄운다.
  const masterDepth = useLucyMasterDepth();
  // 배경음: 곡은 그대로, 깊이마다 소리를 한 겹씩 더한다 (켜져 있을 때만 들림)
  useEffect(() => { setLucyMasterBgmDepth(masterDepth); }, [masterDepth]);
  const [depthNotice, setDepthNotice] = useState<{ depth: LucyMasterDepth; changed: boolean; key: number } | null>(null);
  useEffect(() => {
    let timer = 0;
    const onDepth = (e: Event) => {
      const detail = (e as CustomEvent<{ depth: LucyMasterDepth; changed: boolean }>).detail;
      if (!detail) return;
      setDepthNotice({ depth: detail.depth, changed: detail.changed, key: Date.now() });

      window.clearTimeout(timer);
      timer = window.setTimeout(() => setDepthNotice(null), 2800);
    };
    window.addEventListener(LUCY_MASTER_DEPTH_EVENT, onDepth);
    return () => { window.removeEventListener(LUCY_MASTER_DEPTH_EVENT, onDepth); window.clearTimeout(timer); };
  }, []);
  // 홀드로 루시 마스터에 들어올 때 잠깐 보여주는 로딩 화면
  const [isMasterEntering, setIsMasterEntering] = useState<boolean>(() => isLucyMasterModeOn() && isTarotHouseGreetingPending());
  // 🎵 점술모드 배경음: 켜져 있으면 재생(선호 기억), 모드를 끄거나 화면을 떠나면 멈춤
  useEffect(() => {
    if (!isMasterMode) { stopLucyMasterBgm(); return; }
    if (isLucyMasterBgmPreferred()) void startLucyMasterBgm();
    const onVisibility = () => {
      if (document.hidden) stopLucyMasterBgm();
      else if (isLucyMasterBgmPreferred()) void startLucyMasterBgm();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stopLucyMasterBgm();
    };
  }, [isMasterMode]);

  useEffect(() => {
    if (!isMasterEntering) return;
    const t = setTimeout(() => setIsMasterEntering(false), 1400);
    return () => clearTimeout(t);
  }, [isMasterEntering]);
  useEffect(() => {
    const handleMasterMode = (e: Event) => {
      const on = Boolean((e as CustomEvent)?.detail?.on);
      setIsMasterMode(on);
      if (on) setIsMasterEntering(true);
      triggerHaptic('whitehole');
    };
    window.addEventListener(LUCY_MASTER_MODE_EVENT, handleMasterMode);
    return () => window.removeEventListener(LUCY_MASTER_MODE_EVENT, handleMasterMode);
  }, []);
  const requireBasicAndDeep = true;

  // Cosmic Room on the unfolded Lucy screen is Lucy Plus by default; folded Lucy is basic Lucy (−).
  useEffect(() => {
    if (pro || isMasterMode) return;
    if (isActuallyUnfoldedDual && isLucyChatPath(location)) {
      if (bubbleMarker !== 'plus') setLucyBubbleMarker('plus');
      return;
    }
    if (!isActuallyUnfoldedDual && bubbleMarker !== 'minus') setLucyBubbleMarker('minus');
  }, [bubbleMarker, isActuallyUnfoldedDual, isMasterMode, location, pro]);

  // Lucy Plus follows the expanded Cosmic Room; other left-pane apps remain Lucy (−).
  const showPlusMarker = isCosmicRoomActive;
  const isPlusMode = showPlusMarker;
  const [modeTransitioningTier, setModeTransitioningTier] = useState<LucyTier | null>(null);

  // Entry screens: Lucy Plus when the screen unfolds; Lucy when it folds back or
  // when a folded screen enters the Lucy chat from another channel.
  // A remount (folded screen coming back to Lucy from another channel) shows the Lucy entry screen.
  const [lucyEntry, setLucyEntry] = useState<{ run: number; variant: LucyEntryVariant }>(() => ({
    run: lucyMountedBefore && !pro ? 1 : 0,
    variant: showPlusMarker ? 'plus' : 'lucy',
  }));
  useEffect(() => { lucyMountedBefore = true; }, []);
  const entryPlusRef = useRef(showPlusMarker);
  const entryLocationRef = useRef(location);
  useEffect(() => {
    const wasPlus = entryPlusRef.current;
    const previousLocation = entryLocationRef.current;
    entryPlusRef.current = showPlusMarker;
    entryLocationRef.current = location;
    if (pro) return;
    if (wasPlus !== showPlusMarker) {
      setLucyEntry(entry => ({ run: entry.run + 1, variant: showPlusMarker ? 'plus' : 'lucy' }));
      return;
    }
    if (!showPlusMarker && isLucyChatPath(location) && !isLucyChatPath(previousLocation)) {
      setLucyEntry(entry => ({ run: entry.run + 1, variant: 'lucy' }));
    }
  }, [showPlusMarker, location, pro]);

  const previousPlusMode = useRef(isPlusMode);
  useEffect(() => {
    if (previousPlusMode.current === isPlusMode) return;
    previousPlusMode.current = isPlusMode;
  }, [isPlusMode]);

  const chatScope = 'lucy';
  const { resolvedTheme, lucyDayPeriod } = useTheme();
  // 📱 시간대별 루시 고유 테마(아침·낮·밤) 100% 반영: 아침(06:00~) 및 낮(11:00~)은 화사한 햇살/하늘 테마, 밤(18:00~)은 코스믹 나이트 테마
  // 루시 마스터는 집중을 위해 언제나 어두운 보라빛 타로 테이블 테마
  const isLight = !isMasterMode && lucyDayPeriod !== 'night';
  const useWhiteTheme = false;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const storedLocal = safeLocalStorage.getItem('lucy_tier_mode');
    const storedSession = safeSessionStorage.getItem('lucy_tier_mode');
    const hasLegacyProMode = mode === 'pro' || mode === 'ultra' || storedLocal === 'pro' || storedLocal === 'ultra' || storedSession === 'pro' || storedSession === 'ultra';
    if (!hasLegacyProMode) return;

    const normalizedTier: LucyTier = showPlusMarker ? 'plus' : 'ai';
    setLucyTier(normalizedTier);
    safeLocalStorage.setItem('lucy_tier_mode', normalizedTier);
    safeSessionStorage.setItem('lucy_tier_mode', normalizedTier);
    if (mode === 'pro' || mode === 'ultra') {
      params.set('mode', normalizedTier);
      const query = params.toString();
      navigate(`${window.location.pathname}${query ? `?${query}` : ''}`, { replace: true });
    }
  }, [location, showPlusMarker, navigate]);

  useEffect(() => {
    // Legacy Pro events now resolve to the current Lucy / Lucy+ presentation.
    const handleEvolvePro = () => {
      window.dispatchEvent(new CustomEvent('prism:revert_lucy_normal'));
    };

    // ✨ 빅뱅 버튼 탭: 접혀있거나 일반 채널이면 'Lucy', 펼치고 코스믹 룸일 때만 'Lucy +'!
    const handleRevertNormal = (e?: any) => {
      if (isLucyMasterModeOn()) setLucyMasterMode(false);
      const isDual = typeof document !== 'undefined' && Boolean(
        document.getElementById('duo-lucy-viewport') && document.getElementById('duo-content-viewport')
      ) && isDuoUnfoldedState().unfolded;
      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      const isCosmic = isDual && isLucyChatPath(path) && getLucyBubbleMarker() === 'plus';
      const validTarget: LucyTier = isCosmic ? 'plus' : 'ai';
      safeLocalStorage.setItem('lucy_tier_mode', validTarget);
      safeSessionStorage.setItem('lucy_tier_mode', validTarget);
      setLucyTier(validTarget);
      const mode = new URLSearchParams(window.location.search).get('mode');
      if (mode === 'pro' || mode === 'ultra') navigate('/chat?mode=' + validTarget, { replace: true });
      setModeTransitioningTier(validTarget);
      setTimeout(() => setModeTransitioningTier(null), 550);
      triggerHaptic('whitehole');
      setModeSwitchToast(validTarget === 'plus' ? '🌿 Lucy Plus' : '✨ Lucy');
      setTimeout(() => setModeSwitchToast(null), 2000);
    };

    // Tap events only return to the normal tier; Pro requires a BigBang hold.
    const handleToggle = handleRevertNormal;

    window.addEventListener('prism:evolve_lucy_pro', handleEvolvePro);
    window.addEventListener('prism:evolve_lucy_ultra', handleEvolvePro);
    window.addEventListener('prism:evolve_lucy_plus', handleEvolvePro);
    window.addEventListener('prism:revert_lucy_normal', handleRevertNormal);
    window.addEventListener('prism:revert_lucy_ai', handleRevertNormal);
    window.addEventListener('prism:toggle_lucy_plus', handleToggle);

    return () => {
      window.removeEventListener('prism:evolve_lucy_pro', handleEvolvePro);
      window.removeEventListener('prism:evolve_lucy_ultra', handleEvolvePro);
      window.removeEventListener('prism:evolve_lucy_plus', handleEvolvePro);
      window.removeEventListener('prism:revert_lucy_normal', handleRevertNormal);
      window.removeEventListener('prism:revert_lucy_ai', handleRevertNormal);
      window.removeEventListener('prism:toggle_lucy_plus', handleToggle);
    };
  }, []);

  useEffect(() => {
    if (isPlusMode) {
      document.documentElement.classList.add('lucy-plus-active');
      document.body.classList.add('lucy-plus-active');
    } else {
      document.documentElement.classList.remove('lucy-plus-active');
      document.body.classList.remove('lucy-plus-active');
    }
    return () => {
      document.documentElement.classList.remove('lucy-plus-active');
      document.body.classList.remove('lucy-plus-active');
    };
  }, [isPlusMode]);

  const { 
    firebaseUser, 
    signInWithGoogle, 
    sendUnifiedMessage,
    revealLucyTarotCard,
    personaMessages, 
    setPersonaMessages,
    isGenerating,
    abortGenerating: abortNormalGenerating,
    lucyProMessages,
    isLucyProGenerating,
    abortLucyProGenerating,
    setLucyProMessages,
    clearLucyProMessages,
    sharedState,
    updateSharedState
  } = useApp();

  // Both modes now send to conversationId 'lucy', so abort the same runtime.
  const abortGenerating = abortNormalGenerating;

  // 🃏 2단계(사주 + 타로)에 들어서면 루시가 카드 뽑기를 권한다. 카드는 손님이 직접 섞고 고른다.
  useEffect(() => {
    const onDepth = (e: Event) => {
      const detail = (e as CustomEvent<{ depth: LucyMasterDepth; changed: boolean; shallower?: boolean }>).detail;
      // 3단계에서 2단계로 얕아질 때는 카드 권유를 다시 하지 않는다.
      if (!detail?.changed || detail.shallower || detail.depth !== 2 || !isLucyMasterModeOn()) return;
      const layout = isDuoUnfoldedState().unfolded ? 'unfolded' : 'folded';
      setLucyProMessages(prev => [...prev, createDepthTwoTarotOffer(layout)]);
    };
    window.addEventListener(LUCY_MASTER_DEPTH_EVENT, onDepth);
    return () => window.removeEventListener(LUCY_MASTER_DEPTH_EVENT, onDepth);
  }, [setLucyProMessages]);
  const chatAccount = firebaseUser?.uid || safeSessionStorage.getItem('prism_auth_uid') || 'device';
  // 점술모드 대화는 다시 들어오면 비워지므로, 비우기 전/나갈 때 계정별 상담 기록으로 남긴다 (3단계 연결용).
  const masterMessagesRef = useRef(lucyProMessages);
  masterMessagesRef.current = lucyProMessages;
  const librarySessionKey = `lucy:${chatAccount}:${chatScope}`;

  const handleAbortGeneration = useCallback(() => {
    try {
      if (isMasterMode) abortLucyProGenerating();
      else abortGenerating('lucy');
      triggerHaptic('abort');
    } catch (_) {}
  }, [abortGenerating, abortLucyProGenerating, isMasterMode]);

  // 🔒 모드 선택: Lucy Ultra 상태일 때는 7대 채널 마스터 상시 가동, 일반 모드일 때는 자동 감지 모드
  const selectedMode = (isMasterMode ? 'master' : 'auto') as LucyChatMode;

  // 🎛️ 현재 AI가 감지·가동 중인 채널 (Ultra일 때는 ALL_CHANNELS, 일반일 때는 자동/동적)
  const [activeChannels, setActiveChannelsState] = useState<SpecialChannel[]>(() => {
    if (isMasterMode) return resolveLucyPageChannels([], true);
    try {
      safeLocalStorage.removeItem('lucy_selected_mode');
      const pending = safeSessionStorage.getItem('lucy_pro_pending_channel');
      if (pending) {
        safeSessionStorage.removeItem('lucy_pro_pending_channel');
        return resolveLucyPageChannels(parsePendingChannels(pending), false);
      }
    } catch (_) {}
    return [];
  });

  const setActiveChannels = useCallback((channels: SpecialChannel[]) => {
    setActiveChannelsState(resolveLucyPageChannels(channels, isMasterMode));
  }, [isMasterMode]);

  useEffect(() => {
    if (isMasterMode) {
      setActiveChannelsState(ALL_CHANNELS);
      setAutoDetectedTitleState('🔮 점술모드');
    } else if (!pro) {
      setActiveChannelsState([]);
      setAutoDetectedTitleState(null);
    }
  }, [isMasterMode, pro]);

  // 채널 변경 시 safeLocalStorage에 영구 동기화
  useEffect(() => {
    try {
      safeLocalStorage.setItem('lucy_active_channels', JSON.stringify(activeChannels));
    } catch (_) {}
  }, [activeChannels]);

  const [input, setInput] = useSyncedChatDraft(chatAccount, chatScope);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isAutoDetect = selectedMode === 'auto';
  const [autoDetectedTitle, setAutoDetectedTitleState] = useState<string | null>(() => {
    if (selectedMode === 'casual') return '💬 수다 모드';
    if (selectedMode === 'master') return isMasterMode ? '🔮 점술모드' : null;
    if (selectedMode !== 'auto') {
      const cfg = SPECIAL_CHANNELS[selectedMode as SpecialChannel];
      return cfg ? cfg.name : selectedMode;
    }
    return null;
  });

  const setAutoDetectedTitle = useCallback((value: React.SetStateAction<string | null>) => {
    setAutoDetectedTitleState(previous => {
      const next = typeof value === 'function' ? value(previous) : value;
      return isMasterMode ? '🔮 점술모드' : next?.includes('마스터') ? 'AI 자동 상담' : next;
    });
  }, [isMasterMode]);

  const currentActiveModeConfig = useMemo(() => {
    if (isMasterMode) return { ...LUCY_MODE_CONFIGS[0], label: '점술모드', subLabel: '🔮 점술모드', tagline: '사주 상담 · 펼치면 타로' };
    if (activeChannels.length >= 2) {
      return {
        id: 'auto' as const,
        icon: '⚡',
        label: `${activeChannels.length}중 융합`,
        subLabel: '시너지 모드',
        tagline: `${activeChannels.map((c) => SPECIAL_CHANNELS[c]?.shortName || c).join(' + ')} 융합 시너지 지능 가동 중`,
        activeGradient: 'from-indigo-500 to-purple-600 text-white shadow-indigo-200/50',
        activeBorder: 'border-indigo-400',
        badgeBg: 'bg-indigo-100 text-indigo-950 border-indigo-200',
      };
    }
    return LUCY_MODE_CONFIGS.find((m) => m.id === selectedMode) || LUCY_MODE_CONFIGS[0];
  }, [selectedMode, activeChannels, isMasterMode]);

  // 📌 추천 질문 라이브러리 및 칩에서 지정된 모드를 보존하여 실시간 디바운스 임의 덮어쓰기 방지
  const presetModeRef = useRef<{
    text: string;
    channels: SpecialChannel[];
    title: string;
  } | null>(null);

  // 입력하는 동안의 실시간 AI 모드 감지와 'AI 감지' 배지는 사용자 요청으로 제거했다. 모드 판별은 보낼 때만 한다.

  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // 🔍 상단 검색창 활성화 및 하단 입력창 포커스 시 전 모드(루시·루시플러스·루시프로·루시플러스프로) 공통으로 빅뱅버튼 숨김 클래스 연동
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const hideBigBang = isSearchOpen || isInputFocused;
    if (hideBigBang) {
      document.documentElement.classList.add('lucy-search-active', 'lucy-input-focused');
      document.body.classList.add('lucy-search-active', 'lucy-input-focused');
    } else {
      document.documentElement.classList.remove('lucy-search-active', 'lucy-input-focused');
      document.body.classList.remove('lucy-search-active', 'lucy-input-focused');
    }
    return () => {
      document.documentElement.classList.remove('lucy-search-active', 'lucy-input-focused');
      document.body.classList.remove('lucy-search-active', 'lucy-input-focused');
    };
  }, [isSearchOpen, isInputFocused]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const setModeSwitchToast = (_val: string | null) => {};
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState('');
  const manualTtsRunRef = useRef(0);
  const manualTtsActiveRef = useRef(false);
  const [ttsInfo, setTtsInfo] = useState({
    isSpeaking: false,
    isLoading: false,
    activeText: null as string | null,
    activeSentence: null as string | null,
  });

  // 🔊 낭독 세션 동안은 하단 자동 이동을 붙잡는다.
  // 청크 경계에서 isSpeaking이 잠깐 false가 되는데, 그 틈에 하단으로 끌어내리면 다음 문장에서
  // 다시 중앙으로 올라와 화면이 위아래로 출렁인다. 낭독이 멈춘 뒤에도 잠깐 더 잡아 둔다.
  const ttsHoldsScrollRef = useRef(false);
  const ttsHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ttsReading = Boolean(playingMsgId) || ttsInfo.isSpeaking || ttsInfo.isLoading;

  useEffect(() => {
    if (ttsHoldTimerRef.current) {
      clearTimeout(ttsHoldTimerRef.current);
      ttsHoldTimerRef.current = null;
    }
    if (ttsReading) {
      ttsHoldsScrollRef.current = true;
      return;
    }
    ttsHoldTimerRef.current = setTimeout(() => {
      ttsHoldsScrollRef.current = false;
      ttsHoldTimerRef.current = null;
    }, 900);
    return () => {
      if (ttsHoldTimerRef.current) {
        clearTimeout(ttsHoldTimerRef.current);
        ttsHoldTimerRef.current = null;
      }
    };
  }, [ttsReading]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInputComposingRef = useRef(false);
  const chatFooterRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = chatFooterRef.current;
    if (!el) return;
    const updateFooterHeight = () => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0) {
        const hStr = `${Math.round(rect.height)}px`;
        document.documentElement.style.setProperty('--lucy-footer-height', hStr);
        document.documentElement.style.setProperty('--sidebar-footer-height', hStr);
      }
    };
    updateFooterHeight();
    const ro = new ResizeObserver(updateFooterHeight);
    ro.observe(el);
    window.addEventListener('resize', updateFooterHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateFooterHeight);
      document.documentElement.style.removeProperty('--lucy-footer-height');
      // --sidebar-footer-height는 채널 이동 시에도 메뉴 분할선 위치를 일치시키기 위해 유지
    };
  }, []);

  // URI shorthand may still enter Lucy+ directly when the expanded Lucy pane is visible.
  useEffect(() => {
    if (pro) return;
    const mode = new URLSearchParams(location.includes('?') ? location.slice(location.indexOf('?') + 1) : '').get('mode');
    if (mode === 'plus' && isDuoUnfolded && isLucyChatPath(location) && bubbleMarker !== 'plus') {
      setLucyBubbleMarker('plus');
    }
  }, [location, isDuoUnfolded, bubbleMarker, pro]);

  // 🧭 The mode follows the left Cosmic Room automatically; Master remains its own mode.
  useEffect(() => {
    if (pro) return;
    const isDual = typeof document !== 'undefined' && Boolean(
      document.getElementById('duo-lucy-viewport') && document.getElementById('duo-content-viewport')
    ) && isDuoUnfoldedState().unfolded;
    const clean = location ? location.split('?')[0].split('#')[0] : '/';
    const isCosmic = isDual && isLucyChatPath(clean) && !isMasterMode;
    const expected: LucyTier = isCosmic ? 'plus' : 'ai';
    if (lucyTier !== expected) {
      setLucyTier(expected);
      safeLocalStorage.setItem('lucy_tier_mode', expected);
      safeSessionStorage.setItem('lucy_tier_mode', expected);
      if (!isMasterMode) {
        setModeTransitioningTier(expected);
        setTimeout(() => setModeTransitioningTier(null), 550);
        try { triggerHaptic('whitehole'); } catch (_) {}
        setModeSwitchToast(expected === 'plus' ? '🌿 Lucy Plus' : '✨ Lucy');
        setTimeout(() => setModeSwitchToast(null), 2000);
      }
    }
  }, [location, isDuoUnfolded, pro, lucyTier, isMasterMode]);

  useEffect(() => {
    let initialRun = true;
    const handleLayoutChange = () => {
      if (typeof window === 'undefined') return;
      const isDual = Boolean(
        document.getElementById('duo-lucy-viewport') && document.getElementById('duo-content-viewport')
      ) && isDuoUnfoldedState().unfolded;
      setIsDuoUnfolded((prev) => {
        const clean = window.location.pathname || '/';
        const isCosmic = isDual && isLucyChatPath(clean) && !isLucyMasterModeOn();
        const targetTier: LucyTier = isCosmic ? 'plus' : 'ai';

        if (initialRun) {
          initialRun = false;
          setLucyTier(targetTier);
          return isDual;
        }
        if (prev !== isDual) {
          setLucyTier(() => {
            safeLocalStorage.setItem('lucy_tier_mode', targetTier);
            safeSessionStorage.setItem('lucy_tier_mode', targetTier);
            setModeTransitioningTier(targetTier);
            setTimeout(() => setModeTransitioningTier(null), 550);
            try { triggerHaptic('whitehole'); } catch (_) {}
            setModeSwitchToast(targetTier === 'plus' ? '🌿 듀오 펼침 · Lucy' : '✨ 듀오 접힘 · Lucy');
            setTimeout(() => setModeSwitchToast(null), 2000);
            return targetTier;
          });
        }
        return isDual;
      });
    };
    handleLayoutChange();
    // Follow the shared fold store. The pane ids change in the App frame's next
    // commit, so read them on the following frame instead of mid-event.
    let frame = 0;
    const unsubscribe = subscribeFoldState(() => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; handleLayoutChange(); });
    });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);

  // 🛡️ 접힌 상태(Cover Screen)에서는 무조건 기본 'Lucy'(ai)로 리셋
  useEffect(() => {
    const isDual = typeof document !== 'undefined' && Boolean(
      document.getElementById('duo-lucy-viewport') && document.getElementById('duo-content-viewport')
    ) && isDuoUnfoldedState().unfolded;
    if (!isDual && lucyTier === 'plus') {
      setLucyTier('ai');
      safeLocalStorage.setItem('lucy_tier_mode', 'ai');
      safeSessionStorage.setItem('lucy_tier_mode', 'ai');
    }
  }, [isDuoUnfolded, lucyTier]);

  const currentGhostPromptRef = useRef<string>('');
  const [activeGhostPrompt, setActiveGhostPrompt] = useState<string>('');

  // 🔊 루시 답변 자동 음성 재생 (Auto-TTS 바로재생) 상태 및 설정 (기본값: ON, localStorage 영구 보존)
  const [isAutoTts, setIsAutoTts] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lucy_chat_auto_tts');
      return saved !== 'false';
    } catch {
      return true;
    }
  });
  const isAutoTtsRef = useRef(isAutoTts);
  // 🎙️ 마이크(음성 모드)를 켜기 전 자동읽기 설정. 마이크를 끄면 이 값으로 되돌린다 (null = 마이크 꺼짐).
  const autoTtsBeforeVoiceRef = useRef<boolean | null>(null);
  useEffect(() => {
    isAutoTtsRef.current = isAutoTts;
  }, [isAutoTts]);

  const [autoTtsToast, setAutoTtsToast] = useState<string | null>(null);
  const lastAutoSpokenMsgIdRef = useRef<string | null>(null);
  const hasGreetingSpokenRef = useRef<boolean>(hasSpokenDailyGreetingToday(chatScope));
  const [isGreetingPendingTap, setIsGreetingPendingTap] = useState(false);

  // 🌟 매일 '처음' 루시채팅에 들어갈 때만 인사말을 표시·낭독하기 위한 일일 최초 진입 판별
  const visitDateKeyRef = useRef<string>(getTodayDateKey());
  const isFirstVisitTodayRef = useRef<boolean>((() => {
    const alreadyEntered = hasEnteredLucyChatToday(chatScope);
    if (!alreadyEntered) {
      markLucyChatEnteredToday(chatScope);
      return true;
    }
    return false;
  })());


  const autoTtsToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAutoTts = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}

    const currentVal = isAutoTtsRef.current;
    // 이미 켜져 있는 상태에서 한 번 더 누르면 무조건 OFF(false)로 전환하고 진행 중인 음성도 즉시 중지
    const next = currentVal ? false : true;

    isAutoTtsRef.current = next;
    isAutoTtsBusyRef.current = false;
    setIsAutoTts(next);
    // 마이크가 켜진 동안 직접 바꾸면, 마이크를 꺼도 그 선택을 그대로 둔다.
    if (autoTtsBeforeVoiceRef.current !== null) autoTtsBeforeVoiceRef.current = next;

    try {
      localStorage.setItem('lucy_chat_auto_tts', String(next));
      window.dispatchEvent(new CustomEvent('prism:auto_tts_changed', { detail: next }));
    } catch (_) {}

    if (!next) {
      hasGreetingSpokenRef.current = true;
      setIsGreetingPendingTap(false);
      stopTTS();
      setPlayingMsgId(null);
    }

    if (autoTtsToastTimerRef.current) clearTimeout(autoTtsToastTimerRef.current);
    setAutoTtsToast(
      next
        ? '🔊 자동읽기 ON · 루시 답변을 자동으로 읽어드려요'
        : '🔇 자동읽기 OFF · 음성 자동 재생이 꺼졌습니다'
    );
    autoTtsToastTimerRef.current = setTimeout(() => setAutoTtsToast(null), 2200);
  }, []);

  // 말풍선 모드 등 외부에서 변경된 자동읽기 설정 실시간 동기화
  useEffect(() => {
    const handleAutoTtsSync = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (typeof detail === 'boolean') {
        isAutoTtsRef.current = detail;
        setIsAutoTts(detail);
        if (!detail) {
          isAutoTtsBusyRef.current = false;
          stopTTS();
          setPlayingMsgId(null);
        }
      }
    };
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === 'lucy_chat_auto_tts') {
        const nextVal = e.newValue !== 'false';
        isAutoTtsRef.current = nextVal;
        setIsAutoTts(nextVal);
        if (!nextVal) {
          isAutoTtsBusyRef.current = false;
          stopTTS();
          setPlayingMsgId(null);
        }
      }
    };
    window.addEventListener('prism:auto_tts_changed', handleAutoTtsSync);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('prism:auto_tts_changed', handleAutoTtsSync);
      window.removeEventListener('storage', handleStorageSync);
      if (autoTtsToastTimerRef.current) clearTimeout(autoTtsToastTimerRef.current);
    };
  }, []);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
  // 검색이 목록을 걸러내기 전에 읽고 있던 위치를 보관한다. 검색을 닫으면 이 자리로 되돌린다.
  const searchScrollAnchorRef = useRef<LucySearchScrollAnchor | null>(null);
  const searchWasOpenRef = useRef(false);
  const searchOpenGuardRef = useRef<{ userTouched: boolean; until: number; frame: number | null }>({
    userTouched: false,
    until: 0,
    frame: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 📷 카메라·사진 고르기 창을 여는 동안 iOS는 앱을 잠깐 '숨김'으로 본다.
  // 돌아왔을 때 "다시 들어옴"으로 착각해 대화를 맨 아래로 끌어내리지 않도록, 열기 전 위치를 기억해 둔다.
  const photoPickerRef = useRef<{ openedAt: number; scrollTop: number; atBottom: boolean } | null>(null);
  const photoPinStopRef = useRef<(() => void) | null>(null);
  // 사진 메뉴(사진 보관함·사진 찍기·파일 선택)가 떠 있는 동안 대화를 보던 자리(맨 아래였다면 맨 아래)에 고정한다.
  // iOS는 메뉴가 떠 있는 동안 화면 갱신(requestAnimationFrame)을 멈출 수 있어서,
  // 스크롤 이벤트·타이머·화면 갱신 세 가지로 지키고, 사진을 고르거나 취소하거나 화면을 다시 만질 때까지 유지한다.
  const pinConversationForPicker = (picker: { scrollTop: number; atBottom: boolean }, maxMs: number) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    photoPinStopRef.current?.();
    let stopped = false;
    let frame: number | null = null;
    const target = () => (picker.atBottom ? container.scrollHeight - container.clientHeight : picker.scrollTop);
    const hold = () => {
      if (stopped) return;
      const top = target();
      if (Math.abs(container.scrollTop - top) > 1) container.scrollTop = top;
      if (picker.atBottom) {
        isUserScrolledUpRef.current = false;
        setShowReturnToRecentConversation(false);
      }
    };
    const loop = () => { hold(); if (!stopped) frame = requestAnimationFrame(loop); };
    const interval = window.setInterval(hold, 60);
    const timeout = window.setTimeout(() => stop(), maxMs);
    const onUserTouch = () => stop();
    const stop = () => {
      if (stopped) return;
      stopped = true;
      if (frame !== null) cancelAnimationFrame(frame);
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      container.removeEventListener('scroll', hold);
      document.removeEventListener('pointerdown', onUserTouch, true);
      document.removeEventListener('touchstart', onUserTouch, true);
      document.removeEventListener('wheel', onUserTouch, true);
      if (photoPinStopRef.current === stop) photoPinStopRef.current = null;
    };
    container.addEventListener('scroll', hold, { passive: true });
    // 사용자가 직접 화면을 만지면 고정을 풀어 스크롤을 막지 않는다 (카메라 버튼 탭 자체는 이미 지나감).
    window.setTimeout(() => {
      if (stopped) return;
      document.addEventListener('pointerdown', onUserTouch, true);
      document.addEventListener('touchstart', onUserTouch, true);
      document.addEventListener('wheel', onUserTouch, true);
    }, 0);
    photoPinStopRef.current = stop;
    hold();
    loop();
  };
  const openPhotoPicker = () => {
    const container = messagesContainerRef.current;
    const scrollTop = container?.scrollTop ?? 0;
    const atBottom = container ? container.scrollHeight - container.clientHeight - scrollTop < 48 : true;
    const picker = { openedAt: Date.now(), scrollTop, atBottom };
    photoPickerRef.current = picker;
    // 메뉴가 닫힐 때까지 (최대 1분)
    pinConversationForPicker(picker, 60_000);
    fileInputRef.current?.click();
  };
  const restoreAfterPhotoPicker = () => {
    const picker = photoPickerRef.current;
    photoPickerRef.current = null;
    if (!picker) return;
    // 메뉴가 닫히고 화면이 다시 자리 잡는 동안
    pinConversationForPicker(picker, 900);
  };
  // 사진 고르기를 취소하거나, 메뉴 밖을 눌러 닫고 앱으로 돌아와도 보던 자리로
  useEffect(() => {
    const input = fileInputRef.current;
    const onReturn = () => { if (photoPickerRef.current) restoreAfterPhotoPicker(); };
    input?.addEventListener('cancel', onReturn);
    window.addEventListener('focus', onReturn);
    return () => {
      input?.removeEventListener('cancel', onReturn);
      window.removeEventListener('focus', onReturn);
    };
  });
  useEffect(() => () => { photoPinStopRef.current?.(); }, []);
  const isReturningFromPhotoPicker = () => {
    const picker = photoPickerRef.current;
    return Boolean(picker && Date.now() - picker.openedAt < 2 * 60 * 1000);
  };
  const isTTSActive = useTTSActive();
  const isUserScrolledUpRef = useRef(false);
  // 📖 방금 도착한 루시 답의 id. 답이 화면보다 길어지면 그 답의 첫 부분으로 스크롤을 맞춘다.
  const answerAnchorIdRef = useRef<string | null>(null);
  const lastAnswerAnchorRef = useRef<string | null>(null);
  const [showReturnToRecentConversation, setShowReturnToRecentConversation] = useState(false);
  const isAutoScrollingRef = useRef(false);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageGeometryRef = useRef({ height: 0, viewport: 0 });
  const followLayoutFrameRef = useRef<number | null>(null);
  const followLatestLayoutRef = useRef<() => void>(() => {});
  const topScrollTimerRef = useRef<number | null>(null);
  const topScrollRestoreRef = useRef<(() => void) | null>(null);

  const cancelTopScrollAnimation = useCallback(() => {
    if (topScrollTimerRef.current !== null) window.clearTimeout(topScrollTimerRef.current);
    topScrollTimerRef.current = null;
    topScrollRestoreRef.current?.();
    topScrollRestoreRef.current = null;
    isAutoScrollingRef.current = false;
  }, []);

  const scrollToConversationTop = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    cancelTopScrollAnimation();
    const hasScrollableHistory = container.scrollHeight - container.clientHeight > 80;
    isUserScrolledUpRef.current = hasScrollableHistory;
    setShowReturnToRecentConversation(hasScrollableHistory);
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }

    const roots = new Set<HTMLElement>([container]);
    for (let root = container.parentElement; root; root = root.parentElement) {
      if (root.scrollTop > 0) roots.add(root);
    }
    const documentScroller = container.ownerDocument.scrollingElement as HTMLElement | null;
    if (documentScroller?.scrollTop && documentScroller.scrollTop > 0) roots.add(documentScroller);
    const positions = [...roots].map((element) => {
      const start = element.scrollTop;
      const previousBehavior = element.style.scrollBehavior;
      element.style.scrollBehavior = 'auto';
      return { element, start, previousBehavior };
    });
    topScrollRestoreRef.current = () => {
      positions.forEach(({ element, previousBehavior }) => { element.style.scrollBehavior = previousBehavior; });
      topScrollRestoreRef.current = null;
    };

    const finish = () => {
      positions.forEach(({ element }) => { element.scrollTop = 0; });
      topScrollRestoreRef.current?.();
      topScrollRestoreRef.current = null;
      topScrollTimerRef.current = null;
      isAutoScrollingRef.current = false;
    };
    const maxStart = Math.max(...positions.map(({ start }) => start));
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (maxStart <= 1 || reduceMotion) {
      finish();
      return;
    }

    // Keep auto-bottom effects from pulling the conversation away while the user returns to its top.
    isAutoScrollingRef.current = true;
    const duration = 460;
    let startedAt: number | null = null;
    const animate = () => {
      const now = performance.now();
      if (startedAt === null) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      positions.forEach(({ element, start }) => { element.scrollTop = start * (1 - eased); });
      if (progress < 1) topScrollTimerRef.current = window.setTimeout(animate, 16);
      else finish();
    };
    topScrollTimerRef.current = window.setTimeout(animate, 0);
  }, [cancelTopScrollAnimation]);

  useEffect(() => () => cancelTopScrollAnimation(), [cancelTopScrollAnimation]);
  useEffect(() => {
    if (ttsInfo.isSpeaking || ttsInfo.isLoading) cancelTopScrollAnimation();
  }, [ttsInfo.isSpeaking, ttsInfo.isLoading, cancelTopScrollAnimation]);

  // 🎯 TTS 낭독 중인 하이라이트 문장 화면 수직 중앙(50%) 자동 정렬 스마트 스크롤
  const {
    isUserOverriding: isLucyUserOverriding,
    resumeAutoScroll: resumeLucyAutoScroll,
    remainingSeconds: lucyRemainingSeconds,
    hasActiveHighlight: hasLucyActiveHighlight,
  } = useSmartScroll({
    containerRef: messagesContainerRef,
    enabled: ttsReading,
    centerOffset: 0,
    resumeDelayMs: 3000,
  });

  // Dedicated Lucy entrance aura loader (세션 내 1회만 진입 로딩, 화면 접힘/펼침 반응형 전환 시에는 0ms 무로딩 즉각 유지)
  const [isLucyReady, setIsLucyReady] = useState(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('lucy_chat_ready_once') === 'true') {
        return true;
      }
    } catch (_) {}
    return false;
  });

  useEffect(() => {
    if (isLucyReady) return;
    const timer = setTimeout(() => {
      setIsLucyReady(true);
      try {
        sessionStorage.setItem('lucy_chat_ready_once', 'true');
      } catch (_) {}
    }, 600);
    return () => clearTimeout(timer);
  }, [isLucyReady]);

  // 🌌 루시 채팅 페이지 스코프 설정 (배경 순백색 고정용)
  useEffect(() => {
    document.documentElement.classList.add('in-lucy-chat');
    document.body.classList.add('in-lucy-chat');
    document.documentElement.style.removeProperty('--lucy-chat-bar-height');
    document.body.style.removeProperty('--lucy-chat-bar-height');

    return () => {
      document.documentElement.style.removeProperty('--lucy-chat-bar-height');
      document.body.style.removeProperty('--lucy-chat-bar-height');
      document.documentElement.classList.remove('in-lucy-chat');
      document.body.classList.remove('in-lucy-chat');
    };
  }, []);


  // Determine User Nickname (🛡️ 실명이나 구글 계정명으로 폴백하지 않고 '제제'로 영구 고정)
  const rawNickname = sharedState?.userProfile?.basic?.nickname?.trim();
  const userDisplayName = (rawNickname && rawNickname !== '여행자' && rawNickname !== '사용자' && rawNickname !== '박주형')
    ? rawNickname
    : '제제';

  // 👥 대화창 내 다자간 프로필 (최대 4인) 상태 관리
  // 🛡️ 영구 보존: 새로고침 또는 재진입 시에도 사용자가 설정한 다자간 프로필 및 본인 사주 정보가 절대 초기화되지 않도록 로컬스토리지에 영구 보존합니다.
  const CHAT_PROFILES_STORAGE_KEY = 'lucy_chat_active_profiles_permanent';

  const [activeProfiles, setActiveProfiles] = useState<ChatTargetProfile[]>(() => {
    const persistentBasic = getPersistentUserProfile()?.basic;
    const sharedBasic = sharedState?.userProfile?.basic;
    const basic = {
      ...sharedBasic,
      ...persistentBasic,
      birthtime: persistentBasic?.birthtime ?? sharedBasic?.birthtime,
      birthdate: persistentBasic?.birthdate || sharedBasic?.birthdate,
      lunarSolar: persistentBasic?.lunarSolar || sharedBasic?.lunarSolar,
      gender: persistentBasic?.gender || sharedBasic?.gender,
      birthCity: persistentBasic?.birthCity || sharedBasic?.birthCity,
    };
    // 🌟 사용자 요청: 루시 채팅에서 실명 대신 닉네임(기본 '제제')으로 호칭 및 표시
    const rawRealName = basic?.name?.trim();
    const myRealName = (rawRealName && rawRealName !== '제제' && rawRealName !== '여행자' && rawRealName !== '사용자')
      ? rawRealName
      : (persistentBasic?.name?.trim() || '박주형');
    const myDisplayName = userDisplayName;

    // 1. 이전에 저장된 다자간 프로필 리스트가 있으면 최우선 복원 (사용자가 수정한 값이 덮어써지지 않도록 영구 보존)
    try {
      const saved = safeLocalStorage.getItem(CHAT_PROFILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatTargetProfile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => {
            if (p.isMe || p.relationship === '본인') {
              return {
                ...p,
                name: myDisplayName,
                nickname: myDisplayName,
                birthdate: p.birthdate || basic?.birthdate || '1994-01-24',
                birthtime: p.birthtime !== undefined ? p.birthtime : (basic?.birthtime ?? '12:00'),
                gender: p.gender || basic?.gender || 'male',
                birthCity: p.birthCity || basic?.birthCity || '서울',
                lunarSolar: p.lunarSolar || basic?.lunarSolar || 'solar',
                relationship: '본인',
                isMe: true,
              };
            }
            return p;
          });
        }
      }
    } catch (_) {}

    const myProfile: ChatTargetProfile = {
      id: 'my-profile',
      isMe: true,
      name: myDisplayName,
      nickname: myDisplayName,
      birthdate: basic?.birthdate || '1994-01-24',
      birthtime: basic?.birthtime ?? '12:00',
      gender: basic?.gender || 'male',
      birthCity: basic?.birthCity || '서울',
      lunarSolar: basic?.lunarSolar || 'solar',
      relationship: '본인'
    };

    return [myProfile];
  });

  // 👥 현재 상담 메인 기준 대상 프로필 ID
  const [activeProfileId, setActiveProfileId] = useState<string>('my-profile');

  // 현재 활성 상담 대상 프로필 (다자간 모드 시 선택된 대상, 1인 시 해당 1인)
  const primaryProfile = useMemo(() => {
    if (activeProfiles.length === 1) return activeProfiles[0];
    const found = activeProfiles.find((p) => p.id === activeProfileId);
    return found || activeProfiles[0];
  }, [activeProfiles, activeProfileId]);

  // 🌟 사용자 요청: 루시 채팅에서 실명 대신 닉네임으로 호칭 및 사주 상담
  const counselingUserProfile: UserProfile = useMemo(() => {
    if (!primaryProfile) return sharedState?.userProfile || getPersistentUserProfile();
    const isMe = primaryProfile.isMe || primaryProfile.relationship === '본인';
    return {
      ...sharedState?.userProfile,
      basic: {
        ...sharedState?.userProfile?.basic,
        name: isMe ? userDisplayName : primaryProfile.name,
        nickname: isMe ? userDisplayName : (primaryProfile.nickname || primaryProfile.name),
        birthdate: primaryProfile.birthdate,
        birthtime: primaryProfile.birthtime,
        gender: primaryProfile.gender,
        birthCity: primaryProfile.birthCity,
        lunarSolar: primaryProfile.lunarSolar || 'solar',
      },
    };
  }, [primaryProfile, sharedState?.userProfile, userDisplayName]);

  // Detailed Saju Info for Soul Profile View (상담 대상자 기준으로 자동 동기화)
  const sajuInfo = useMemo(() => calculateDetailedSaju(counselingUserProfile), [counselingUserProfile]);

  // 🔮 루시 마스터(점술모드)는 일반 루시·루시+와 대화 내역을 따로 쓴다 (lucy-pro 저장소).
  const lucyMessages = isMasterMode ? (lucyProMessages || []) : (personaMessages?.lucy || []);
  // 채팅방에 들어올 때마다 첫 인사(시간대 인사 + 문장)를 새로 고른다. 저장된 대화는 그대로 둔다.
  const shownGreetingRef = useRef<(typeof lucyMessages)[number] | null>(null);
  const [greetingEntry, setGreetingEntry] = useState(() => ({ at: Date.now(), variant: Math.floor(Math.random() * LUCY_GREETING_BODIES.length) }));
  const refreshEntryGreeting = useCallback(() => {
    setGreetingEntry(previous => {
      // 한 번 들어올 때 여러 진입 신호(경로·표시·pageshow)가 겹치므로 한 번만 바꾼다.
      if (Date.now() - previous.at < 1500) return previous;
      const count = LUCY_GREETING_BODIES.length;
      const step = 1 + Math.floor(Math.random() * (count - 1));
      return { at: Date.now(), variant: (previous.variant + step) % count };
    });
  }, []);

  const isLucyGenerating = isMasterMode ? Boolean(isLucyProGenerating) : Boolean(isGenerating?.lucy);
  // 🧰 엔진함에서 담아 둔 엔진 (매 답변에 함께 사용)
  // 엔진함 담기 기능은 제거됨: 예전에 담아 둔 엔진도 비워서 매 질문 자동 선택만 쓰게 한다.
  useEffect(() => { setSelectedEngineKeys([]); }, []);

  // 🔮 일반 루시 대화의 맥락을 읽어 상담이 필요해 보이면 점술모드로 들어갈지 채팅에 제안한다.
  const [masterOfferFor, setMasterOfferFor] = useState<string | null>(null);
  const [dismissedRecommendationFor, setDismissedRecommendationFor] = useState<string | null>(null);
  const offeredForRef = useRef<string | null>(null);
  useEffect(() => {
    if (isMasterMode || pro || isLucyGenerating) return;
    const last = lucyMessages[lucyMessages.length - 1];
    if (!last || (last.role !== 'model' && last.role !== 'assistant') || offeredForRef.current === last.id) return;
    const recentUser = lucyMessages.filter(m => m.role === 'user').slice(-3).map(m => typeof m.content === 'string' ? m.content : '');
    if (!recentUser.length) return;
    if (shouldOfferLucyMaster(recentUser)) {
      offeredForRef.current = last.id;
      setMasterOfferFor(last.id);
    }
  }, [isMasterMode, pro, isLucyGenerating, lucyMessages]);
  useEffect(() => { if (isMasterMode) setMasterOfferFor(null); }, [isMasterMode]);
  const acceptMasterOffer = useCallback(() => {
    setMasterOfferFor(null);
    markLucyMasterFromOffer();
    playLucyMasterSuction();
    setLucyMasterMode(true);
    if (isLucyMasterBgmPreferred()) void startLucyMasterBgm();
    triggerHaptic('wormhole');
  }, []);
  const declineMasterOffer = useCallback(() => {
    setDismissedRecommendationFor(masterOfferFor);
    setMasterOfferFor(null);
    dismissLucyMasterOffer();
    triggerHaptic('whitehole');
  }, [masterOfferFor]);

  // 🌙 점술모드에서 상담이 마무리된 것처럼 보이면 일반 루시로 돌아갈지 채팅에 묻는다.
  const [returnOfferFor, setReturnOfferFor] = useState<string | null>(null);
  const returnOfferedForRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isMasterMode || isLucyGenerating) return;
    const last = lucyMessages[lucyMessages.length - 1];
    if (!last || (last.role !== 'model' && last.role !== 'assistant') || returnOfferedForRef.current === last.id) return;
    const userTexts = lucyMessages.filter(m => m.role === 'user').map(m => typeof m.content === 'string' ? m.content : '');
    if (shouldOfferReturnToLucy(userTexts)) {
      returnOfferedForRef.current = last.id;
      setReturnOfferFor(last.id);
    }
  }, [isMasterMode, isLucyGenerating, lucyMessages]);
  useEffect(() => { if (!isMasterMode) setReturnOfferFor(null); }, [isMasterMode]);
  const acceptReturnOffer = useCallback(() => {
    setReturnOfferFor(null);
    playLucyMasterSuction('out');
    setLucyMasterMode(false);
    triggerHaptic('whitehole');
  }, []);
  const declineReturnOffer = useCallback(() => {
    setReturnOfferFor(null);
    dismissReturnToLucyOffer();
    triggerHaptic('whitehole');
  }, []);

  // 🔮 펼친 루시 마스터의 왼쪽 테이블(사주 원국판)에 상담 대상의 원국과 루시의 최신 답을 넘긴다.
  useEffect(() => {
    if (isMasterMode) publishTableSaju(sajuInfo);
  }, [isMasterMode, sajuInfo]);
  useEffect(() => {
    if (!isMasterMode || isLucyGenerating) return;
    for (let i = lucyMessages.length - 1; i >= 0; i--) {
      const m = lucyMessages[i];
      if ((m.role === 'model' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim()) {
        // 인사·안내 말풍선이 아니라, 사용자의 말에 대한 실제 답일 때만 테이블 면을 바꾼다.
        if (lucyMessages.slice(0, i).some(prev => prev.role === 'user')) publishTableAnswer(m.content);
        return;
      }
    }
  }, [isMasterMode, isLucyGenerating, lucyMessages]);

  // 🔮 점술모드가 켜지면 타로집에 들어선 것처럼 루시가 먼저 인사한다 (다른 화면에서 홀드해 들어와도 1회).
  // 루시 마스터는 나갔다 다시 들어오면 항상 처음부터: 이전 마스터 대화를 비우고 새 인사로 시작한다.
  useEffect(() => {
    if (!isMasterMode || !consumeTarotHouseGreetingPending()) return;
    archiveMasterSession(chatAccount, masterMessagesRef.current || []);
    clearLucyProMessages();
    // Always offer "이어서 / 새로" on entry: regular Lucy history may still be loading,
    // or today's thread may be empty after the KST midnight rollover.
    // 루시의 상담 제안으로 들어왔으면 방금 대화를 이어서 보므로 "이어서/새로" 질문 없이 고민부터 묻는다.
    const fromOffer = consumeLucyMasterFromOffer();
    const greeting = createTarotHouseGreeting(userDisplayName, isDuoUnfoldedState().unfolded ? 'unfolded' : 'folded', !fromOffer);
    setLucyMasterLink(fromOffer ? 'linked' : 'undecided');
    setLucyProMessages([greeting]);
  }, [isMasterMode, setLucyProMessages, clearLucyProMessages, userDisplayName, chatAccount]);
  // 📜 상담 카드: 상담에서 도달한 가장 깊은 단계를 기억해 카드에 적는다.
  const maxDepthRef = useRef<LucyMasterDepth>(1);
  useEffect(() => {
    if (!isMasterMode) return;
    if (masterDepth > maxDepthRef.current) maxDepthRef.current = masterDepth;
  }, [isMasterMode, masterDepth]);
  const [sessionCardOffer, setSessionCardOffer] = useState<MasterSessionCardSource | null>(null);
  const [sessionCard, setSessionCard] = useState<MasterSessionCardSource | null>(null);
  const wasMasterRef = useRef(isMasterMode);
  useEffect(() => {
    if (wasMasterRef.current && !isMasterMode) {
      const messages = [...(masterMessagesRef.current || [])];
      archiveMasterSession(chatAccount, messages);
      // 상담이 끝나면: 실제로 나눈 상담이 있었을 때만 "카드로 남길까?"를 한 번 묻는다.
      if (hasMeaningfulMasterSession(messages)) {
        setSessionCardOffer({ messages, depth: maxDepthRef.current, endedAt: Date.now() });
      }
    }
    if (!wasMasterRef.current && isMasterMode) {
      maxDepthRef.current = 1;
      setSessionCardOffer(null);
    }
    wasMasterRef.current = isMasterMode;
  }, [isMasterMode, chatAccount]);

  // 🎙️ 루시 1:1 전용 실시간 음성 대화 모드 (STT 마이크 + TTS 자동 루프)
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(() => {
    if (pro) return false;
    try {
      return sessionStorage.getItem('lucy_chat_voice_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'error'>('idle');

  // 🎙️ 마이크(음성 모드)를 켜면 자동읽기도 켜고, 끄면 원래 설정으로 되돌린다. 저장된 설정은 바꾸지 않는다.
  useEffect(() => {
    if (isVoiceMode) {
      if (autoTtsBeforeVoiceRef.current !== null) return;
      autoTtsBeforeVoiceRef.current = isAutoTtsRef.current;
      if (!isAutoTtsRef.current) {
        isAutoTtsRef.current = true;
        isAutoTtsBusyRef.current = false;
        setIsAutoTts(true);
        if (autoTtsToastTimerRef.current) clearTimeout(autoTtsToastTimerRef.current);
        setAutoTtsToast('🎙️ 음성모드 · 말로 이야기해요');
        autoTtsToastTimerRef.current = setTimeout(() => setAutoTtsToast(null), 2200);
      }
      return;
    }
    const before = autoTtsBeforeVoiceRef.current;
    if (before === null) return;
    autoTtsBeforeVoiceRef.current = null;
    if (!before && isAutoTtsRef.current) {
      isAutoTtsRef.current = false;
      isAutoTtsBusyRef.current = false;
      setIsAutoTts(false);
      if (autoTtsToastTimerRef.current) clearTimeout(autoTtsToastTimerRef.current);
      setAutoTtsToast('🔇 마이크 꺼짐 · 자동읽기를 원래대로 껐어요');
      autoTtsToastTimerRef.current = setTimeout(() => setAutoTtsToast(null), 2200);
    }
  }, [isVoiceMode]);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [speechInterim, setSpeechInterim] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  const isVoiceModeRef = useRef<boolean>(isVoiceMode);
  useEffect(() => {
    isVoiceModeRef.current = isVoiceMode;
    try {
      sessionStorage.setItem(pro ? 'lucy_pro_chat_voice_mode' : 'lucy_chat_voice_mode', String(isVoiceMode));
    } catch (_) {}
  }, [isVoiceMode, pro]);

  const voiceStateRef = useRef<'idle' | 'listening' | 'thinking' | 'speaking' | 'error'>('idle');
  useEffect(() => {
    voiceStateRef.current = voiceState;
  }, [voiceState]);

  const isVoiceMutedRef = useRef<boolean>(isVoiceMuted);
  useEffect(() => {
    isVoiceMutedRef.current = isVoiceMuted;
  }, [isVoiceMuted]);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechWatcherRef = useRef<EndOfSpeechWatcher | null>(null);
  const speechTranscriptRef = useRef<string>('');
  const voiceUtteranceRef = useRef(false);
  const liveVoiceRef = useRef<LiveVoiceSession | null>(null);
  const [voiceEngine, setVoiceEngine] = useState<'live' | 'browser' | null>(null);
  const isLucyGeneratingRef = useRef<boolean>(isLucyGenerating);

  // 🎙️ 음성 인식 중지
  const stopRecognition = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    speechWatcherRef.current?.dispose();
    speechWatcherRef.current = null;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    try {
      recognition?.abort();
    } catch (_) {}
  }, []);

  const stopRecognitionRef = useRef(stopRecognition);
  useEffect(() => {
    stopRecognitionRef.current = stopRecognition;
  }, [stopRecognition]);

  // handleSend forward ref
  const handleSendRef = useRef<(textToSend?: string, forcedChannels?: SpecialChannel[], pickedTarotCards?: DetectedTarotCard[]) => Promise<void>>(async () => {});

  // 🎙️ 음성 인식 시작 (STT)
  const startListening = useCallback(() => {
    if (liveVoiceRef.current) return;
    if (typeof window === 'undefined' || !isVoiceModeRef.current || isVoiceMutedRef.current) return;
    stopRecognition();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome/Safari를 권장합니다.');
      setVoiceState('error');
      return;
    }

    try {
      unlockAudioPlayback();
      primeTTSAudioElement();

      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      // 한 문장씩 듣는다: 말이 끝나면 브라우저(특히 아이폰 Safari)가 스스로 문장을 확정하고 듣기를 닫는다.
      // 확정되거나 닫히는 순간 바로 보내고, 아무 말도 없었으면 다시 듣는다.
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const isCurrent = () => recognitionRef.current === recognition && isVoiceModeRef.current && !isVoiceMutedRef.current;

      recognition.onstart = () => {
        if (!isCurrent()) return;
        setVoiceError(null);
        setVoiceState('listening');
        voiceStateRef.current = 'listening';
      };

      // 말이 끝나면(들은 글자가 1.2초 동안 그대로면) 시리처럼 자동 전송한다.
      const watcher = createEndOfSpeechWatcher({
        // 루시가 답변을 쓰는 중이어도 이어서 보낼 수 있다 (상태 표시가 늦게 풀려도 전송이 막히지 않게).
        canSend: () => isCurrent(),
        onSend: (text) => {
          speechTranscriptRef.current = '';
          setSpeechTranscript('');
          setSpeechInterim('');
          voiceUtteranceRef.current = true;
          void handleSendRef.current(text);
        },
      });
      speechWatcherRef.current?.dispose();
      speechWatcherRef.current = watcher;

      recognition.onresult = (event: any) => {
        if (!isCurrent() || watcher.sent) return;
        const { text, interim } = collectSpeechTranscript(event.results);
        if (watcher.heard(text)) {
          speechTranscriptRef.current = text;
          setSpeechTranscript(text);
          setSpeechInterim(interim);
        }
        // 브라우저가 문장을 확정했으면(말이 끝남) 기다리지 않고 바로 보낸다.
        const results = event.results as ArrayLike<{ isFinal?: boolean }>;
        if (results.length > 0 && results[results.length - 1]?.isFinal) watcher.flush();
      };

      recognition.onerror = (e: any) => {
        if (!isCurrent()) return;
        console.warn('[LucyChat] STT error:', e.error || e);
        if (e.error === 'not-allowed') {
          stopRecognition();
          setVoiceError('마이크 권한이 차단되어 있습니다. 브라우저 설정에서 마이크를 허용해 주세요.');
          setVoiceState('error');
        }
      };

      recognition.onend = () => {
        if (!isCurrent()) return;
        // 브라우저가 말이 끝났다고 듣기를 닫으면, 들은 말이 있을 때 바로 보낸다.
        if (watcher.sent || watcher.flush()) return;
        if (
          voiceStateRef.current === 'listening' &&
          !isLucyGeneratingRef.current
        ) {
          try {
            recognition.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      stopRecognition();
      console.warn('[LucyChat] startListening error:', err);
      setVoiceState('idle');
    }
  }, [stopRecognition]);

  // 🛟 안전장치: 화면에 보이는 들은 말이 1.5초 동안 그대로면, 인식기 신호와 상관없이 보낸다.
  const heardOnScreen = (speechTranscript || speechInterim).trim();
  useEffect(() => {
    const text = heardOnScreen;
    if (!isVoiceMode || isVoiceMuted || liveVoiceRef.current || text.length < 1) return;
    const timer = setTimeout(() => {
      if (!isVoiceModeRef.current || isVoiceMutedRef.current) return;
      const watcher = speechWatcherRef.current;
      if (watcher && !watcher.sent && watcher.text.trim()) {
        watcher.sendNow();
        return;
      }
      speechTranscriptRef.current = '';
      setSpeechTranscript('');
      setSpeechInterim('');
      voiceUtteranceRef.current = true;
      void handleSendRef.current(text);
    }, 1500);
    return () => clearTimeout(timer);
  }, [heardOnScreen, isVoiceMode, isVoiceMuted]);

  const startListeningRef = useRef(startListening);
  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  // 🎙️ 루시 말 끊기 (인터럽트) 및 듣기 전환
  const handleInterruptLucy = useCallback(() => {
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}
    stopTTS();
    setVoiceState('listening');
    voiceStateRef.current = 'listening';
    startListening();
  }, [startListening]);

  const handleToggleVoiceMode = useCallback(() => {
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}

    if (isVoiceModeRef.current) {
      isVoiceModeRef.current = false;
      speechTranscriptRef.current = '';
      liveVoiceRef.current?.stop();
      liveVoiceRef.current = null;
      setVoiceEngine(null);
      stopRecognition();
      stopTTS();
      setIsVoiceMode(false);
      setVoiceState('idle');
      voiceStateRef.current = 'idle';
      setSpeechTranscript('');
      setSpeechInterim('');
      setVoiceError(null);
    } else {
      unlockAudioPlayback();
      primeTTSAudioElement();
      setIsVoiceMode(true);
      isVoiceModeRef.current = true;
      setIsVoiceMuted(false);
      isVoiceMutedRef.current = false;
      setSpeechTranscript('');
      setSpeechInterim('');
      setVoiceError(null);
      setVoiceEngine('live');
      setVoiceState('listening');
      voiceStateRef.current = 'listening';
      liveVoiceRef.current?.stop();
      const spread = drawLucyTarotCards(3).map((card, index) => `${index + 1}번 ${card.nameKo} ${card.orientationKo}`).join(', ');
      const session = startGeminiLiveVoice({
        nickname: userDisplayName,
        chart: sajuInfo?.systemPromptSummary || '',
        cards: spread,
        onState: (state) => {
          if (!isVoiceModeRef.current || liveVoiceRef.current !== session) return;
          setVoiceState(state);
          voiceStateRef.current = state;
        },
        onUserText: (text) => {
          if (!isVoiceModeRef.current || liveVoiceRef.current !== session) return;
          setSpeechTranscript(text);
        },
        onLucyText: (text) => {
          if (!isVoiceModeRef.current || liveVoiceRef.current !== session) return;
          setSpeechInterim(text);
        },
        onError: (error) => {
          if (liveVoiceRef.current !== session) return;
          liveVoiceRef.current = null;
          session.stop();
          if (!isVoiceModeRef.current) return;
          if (error.code === 'mic-denied') {
            setVoiceEngine(null);
            setVoiceState('error');
            voiceStateRef.current = 'error';
            setVoiceError(error.message);
            return;
          }
          setVoiceEngine('browser');
          setVoiceError(null);
          startListeningRef.current?.();
        },
      });
      liveVoiceRef.current = session;
    }
  }, [stopRecognition, userDisplayName, sajuInfo]);

  // 빅뱅버튼 홀드 시 별도 말풍선 없이 루시채팅 자체 음성 모드 즉시 토글
  useEffect(() => {
    const handleBigBangVoiceToggle = () => {
      setOrbCounselOpen(true);
    };
    window.addEventListener('prism:toggle_lucy_chat_voice', handleBigBangVoiceToggle);
    return () => {
      window.removeEventListener('prism:toggle_lucy_chat_voice', handleBigBangVoiceToggle);
    };
  }, []);

  // AI 응답 생성 상태 변화에 따른 음성 모드 동기화
  useEffect(() => {
    isLucyGeneratingRef.current = isLucyGenerating;
    if (isVoiceModeRef.current) {
      if (isLucyGenerating) {
        setVoiceState('thinking');
        voiceStateRef.current = 'thinking';
        stopRecognition();
      }
    }
  }, [isLucyGenerating, stopRecognition]);

  // 페이지 언마운트 시 음성 인식 및 TTS 정리
  useEffect(() => {
    return () => {
      // Prevent the outgoing chat's TTS listener from restarting its microphone.
      isVoiceModeRef.current = false;
      isAutoTtsRef.current = false;
      voiceStateRef.current = 'idle';
      liveVoiceRef.current?.stop();
      liveVoiceRef.current = null;
      stopRecognition();
      stopTTS();
    };
  }, [stopRecognition]);

  // 사용자가 대화창에서 프로필을 직접 변경/수정한 경우 플래그 (새로고침 또는 페이지 재진입 전까지 프로필 원복 방지)
  const hasUserCustomizedProfilesRef = useRef<boolean>((() => {
    try {
      return safeLocalStorage.getItem('lucy_user_customized_profiles') === 'true';
    } catch {
      return false;
    }
  })());

  // 루시 채팅 진입 시 일일 초기화 점검 및 대화 기록이 없을 때 기본 루시 인사말 보장
  useEffect(() => {
    const todayKey = getTodayDateKey();
    if (visitDateKeyRef.current !== todayKey) {
      visitDateKeyRef.current = todayKey;
      isFirstVisitTodayRef.current = true;
      hasGreetingSpokenRef.current = false;
      markLucyChatEnteredToday(chatScope);
    }

    if (!pro) setPersonaMessages((prevRecord) => {
      const existing = prevRecord.lucy || [];
      const stored = loadSavedUnifiedMessages();
      const currentList = mergeUnifiedMessages(existing, stored);
      const archival = processDailyChatArchival(currentList, userDisplayName);
      let nextList = archival.messages;

      const hasUserMsg = nextList.some((m) => m.role === 'user' && !!m.content);
      if (!hasUserMsg && nextList.length === 0) {
        nextList = [createDefaultGreeting('lucy', userDisplayName)];
      }

      if (!isFirstVisitTodayRef.current) {
        markFirstLucyVisitCompletedToday(chatScope);
      }

      const existingUsers = existing.filter((message) => message.role === 'user' && message.content).length;
      const nextUsers = nextList.filter((message) => message.role === 'user' && message.content).length;
      if (nextUsers === 0 && existingUsers > 0 && !archival.wasArchived) return prevRecord;
      if (JSON.stringify(existing) !== JSON.stringify(nextList)) {
        saveUnifiedMessagesSafely(nextList);
        return {
          lucy: nextList,
          orange: nextList,
          trinity: nextList,
          aura: nextList,
          bluebird: nextList,
          muse: nextList,
        };
      }
      return prevRecord;
    });

    const handleBeforeUnload = () => {
      markFirstLucyVisitCompletedToday(chatScope);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [setPersonaMessages, userDisplayName, pro, chatScope]);

  // 루시 채팅에서 벗어날 때(언마운트 시) 오늘 첫 방문 완료 처리 (인사말과 다자간 프로필은 영구 보존)
  useEffect(() => {
    return () => {
      markFirstLucyVisitCompletedToday(chatScope);
      // 🛡️ 다자간 프로필 영구 보존: 세션/로컬 삭제 금지
    };
  }, []);

  // 🔮 루시 마스터 추천 질문의 깊이·주제 (렌더마다 최신값)
  const masterConcernTopic = useMemo<MasterConcernTopic>(
    () => (isMasterMode ? detectMasterConcernTopic(findConcernAnchor(lucyProMessages || [])) : 'general'),
    [isMasterMode, lucyProMessages],
  );
  const masterPromptContextRef = useRef<{ depth: LucyMasterDepth; topic: MasterConcernTopic }>({ depth: 1, topic: 'general' });
  masterPromptContextRef.current = { depth: masterDepth, topic: masterConcernTopic };

  // 🎲 차분하게 유지되는 맞춤 추천 질문 상태 (새로고침 🔄 클릭, 모드 전환, 프로필 변경 시에만 명시적으로 갱신되며 실시간 임의 변동 방지)
  const [currentPrompts, setCurrentPrompts] = useState<string[]>(() => {
    return getCuratedPrompts(activeProfiles, selectedMode, activeChannels, masterPromptContextRef.current);
  });


  // 🔄 루시 AI 모드 ↔ 마스터 모드 전환 시 하단 추천 질문 예시 1:1 실시간 즉시 동기화
  useEffect(() => {
    setCurrentPrompts(getCuratedPrompts(activeProfiles, selectedMode, activeChannels, masterPromptContextRef.current));
  }, [selectedMode, activeChannels, activeProfiles, masterDepth, masterConcernTopic]);

  // sharedState 변경 시 내 프로필 정보 동기화 (사용자가 대화창에서 프로필을 직접 수정한 경우 덮어쓰지 않고 변경 상태 유지)
  useEffect(() => {
    if (hasUserCustomizedProfilesRef.current) return;
    const persistentBasic = getPersistentUserProfile()?.basic;
    const basic = {
      ...sharedState?.userProfile?.basic,
      ...persistentBasic,
      birthtime: persistentBasic?.birthtime ?? sharedState?.userProfile?.basic?.birthtime,
    };
    if (basic?.name || basic?.nickname || basic?.birthdate) {
      setActiveProfiles((prev) => {
        if (hasUserCustomizedProfilesRef.current) return prev;
        const me = prev.find((p) => p.isMe);
        if (!me) return prev;
        const rawRealName = basic?.name?.trim();
        const realName = (rawRealName && rawRealName !== '제제' && rawRealName !== '여행자' && rawRealName !== '사용자')
          ? rawRealName
          : (persistentBasic?.name?.trim() || me.name || '박주형');
        const newBirthdate = basic?.birthdate || me.birthdate;
        const newBirthtime = basic?.birthtime ?? me.birthtime;
        const newGender = basic?.gender || me.gender;
        const newCity = basic?.birthCity || me.birthCity;
        const newLs = basic?.lunarSolar || me.lunarSolar;
        if (
          me.name === realName &&
          me.birthdate === newBirthdate &&
          me.birthtime === newBirthtime &&
          me.gender === newGender &&
          me.birthCity === newCity &&
          me.lunarSolar === newLs
        ) {
          return prev;
        }
        const next = prev.map((p) =>
          p.isMe
            ? {
                ...p,
                name: realName,
                birthdate: newBirthdate,
                birthtime: newBirthtime,
                gender: newGender,
                birthCity: newCity,
                lunarSolar: newLs,
              }
            : p
        );
        try {
          safeLocalStorage.setItem(CHAT_PROFILES_STORAGE_KEY, JSON.stringify(next));
        } catch (_) {}
        return next;
      });
    }
  }, [sharedState?.userProfile?.basic]);

  // 프로필 모달 상태
  const [isChatProfileModalOpen, setIsChatProfileModalOpen] = useState(false);
  const [editingChatProfile, setEditingChatProfile] = useState<ChatTargetProfile | null>(null);

  const handleOpenAddChatProfile = useCallback(() => {
    setEditingChatProfile(null);
    setIsChatProfileModalOpen(true);
  }, []);

  const handleOpenEditChatProfile = useCallback((profile: ChatTargetProfile) => {
    setEditingChatProfile(profile);
    setIsChatProfileModalOpen(true);
  }, []);

  const handleSaveChatProfile = useCallback((profile: ChatTargetProfile) => {
    hasUserCustomizedProfilesRef.current = true;
    try {
      safeLocalStorage.setItem('lucy_user_customized_profiles', 'true');
    } catch (_) {}
    setActiveProfiles((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === profile.id);
      
      // Check if another profile is already '본인'
      const existingSelfIndex = prev.findIndex(
        (p) => p.id !== profile.id && (p.isMe || p.relationship === '본인')
      );

      let safeProfile = { ...profile };
      // 🛡️ '본인' 중복 방지: 이미 본인이 존재한다면 추가 프로필은 타인 관계로 강제 보정
      if (existingSelfIndex !== -1 && (safeProfile.relationship === '본인' || safeProfile.isMe)) {
        safeProfile.relationship = '연인';
        safeProfile.isMe = false;
      }

      let updated: ChatTargetProfile[];
      if (existsIndex !== -1) {
        updated = [...prev];
        updated[existsIndex] = safeProfile;
      } else {
        if (prev.length >= 4) return prev;
        updated = [...prev, safeProfile];
      }

      // 🌟 1명만 남은 경우 무조건 '본인'으로 자동 확정
      if (updated.length === 1) {
        updated = [
          {
            ...updated[0],
            isMe: true,
            relationship: '본인',
          },
        ];
      } else if (updated.length >= 2) {
        // 2명 이상일 때 '본인'이 2명 이상 중복되지 않도록 보장 (첫 번째 본인만 유지)
        let foundFirstSelf = false;
        updated = updated.map((p) => {
          if (p.isMe || p.relationship === '본인') {
            if (!foundFirstSelf) {
              foundFirstSelf = true;
              return { ...p, isMe: true, relationship: '본인' };
            }
            return { ...p, isMe: false, relationship: '연인' };
          }
          return p;
        });
      }

      // 🛡️ 내 프로필(isMe) 수정 시 글로벌 sharedState 및 영구 볼트의 사주 실명/생년월일 동기화 (닉네임 '제제'는 불변 유지)
      if (safeProfile.isMe) {
        const currentProfile = getPersistentUserProfile();
        const existingNick = (currentProfile?.basic?.nickname && currentProfile.basic.nickname !== '박주형')
          ? currentProfile.basic.nickname
          : '제제';
        const updatedBasic = {
          ...(currentProfile?.basic || {}),
          name: safeProfile.name.trim() || '박주형',
          nickname: existingNick,
          birthdate: safeProfile.birthdate,
          birthtime: safeProfile.birthtime,
          gender: safeProfile.gender,
          birthCity: safeProfile.birthCity,
          lunarSolar: safeProfile.lunarSolar,
        };
        const updatedUserProfile = {
          ...(currentProfile || {}),
          basic: updatedBasic,
        };
        saveProfileToAllVaults(updatedUserProfile);
        setPersistentUserProfile(updatedUserProfile);
        updateSharedState({
          userProfile: {
            ...(sharedState?.userProfile || {}),
            basic: updatedBasic,
          },
        }, 'lucy');
      }

      setCurrentPrompts(getCuratedPrompts(updated, selectedMode, activeChannels, masterPromptContextRef.current));
      try {
        safeLocalStorage.setItem(CHAT_PROFILES_STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  }, [selectedMode, activeChannels]);

  const handleSelectActiveProfile = useCallback((profileId: string) => {
    setActiveProfileId(profileId);
    const target = activeProfiles.find((p) => p.id === profileId);
    if (target) {
      setModeSwitchToast(`🔮 상담 기준 전환 · [${target.name}] 님의 만세력·사주로 분석합니다`);
      setTimeout(() => setModeSwitchToast(null), 2500);
      try {
        triggerHaptic('whitehole');
      } catch (_) {}
    }
  }, [activeProfiles]);

  const handleRemoveChatProfile = useCallback((profileId: string) => {
    hasUserCustomizedProfilesRef.current = true;
    setActiveProfiles((prev) => {
      // 2명 이상일 때만 삭제 가능 (내 프로필 포함)
      if (prev.length <= 1) return prev;
      let remaining = prev.filter((p) => p.id !== profileId);
      // 🌟 사용자 요청: 1명만 남으면 무조건 '본인'으로 자동 확정
      if (remaining.length === 1) {
        remaining = [
          {
            ...remaining[0],
            isMe: true,
            relationship: '본인',
          },
        ];
      }
      // 삭제된 프로필이 현재 활성 상담 대상이었던 경우 첫 번째 프로필로 자동 전환
      if (profileId === activeProfileId && remaining.length > 0) {
        setActiveProfileId(remaining[0].id);
      }
      setCurrentPrompts(getCuratedPrompts(remaining, selectedMode, activeChannels, masterPromptContextRef.current));
      try {
        safeLocalStorage.setItem(CHAT_PROFILES_STORAGE_KEY, JSON.stringify(remaining));
      } catch (_) {}
      return remaining;
    });
  }, [selectedMode, activeChannels, activeProfileId]);

  // Refresh / Reshuffle prompts (새로고침 버튼 클릭 시에만 안정적으로 갱신)
  const refreshPrompts = useCallback(() => {
    setCurrentPrompts(getCuratedPrompts(activeProfiles, selectedMode, activeChannels, masterPromptContextRef.current));
  }, [activeProfiles, selectedMode, activeChannels]);

  // 🌀 추천 질문 예시 마키: 자동 흐름 + 손가락·포인터 드래그·휠 양방향 무한 스크롤
  const promptsMarqueeRef = useRef<HTMLDivElement | null>(null);
  const promptsMarqueeHoldRef = useRef<{ hover: boolean; dragging: boolean; touched: boolean; resumeAt: number }>({
    hover: false,
    dragging: false,
    touched: false,
    resumeAt: 0,
  });
  const promptsMarqueeDragRef = useRef<{ active: boolean; pointerId: number; startX: number; startScroll: number; moved: boolean }>({
    active: false,
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const promptsMarqueeSuppressClickRef = useRef(false);
  // 루프 폭은 매 프레임 다시 재면 레이아웃을 계속 강제로 읽게 되므로 측정값을 캐시하고,
  // 질문 목록·트랙 폭이 바뀔 때만(ResizeObserver) 무효화한다.
  const promptsMarqueeLoopCacheRef = useRef(0);

  // 루프 폭: 트랙은 질문 목록을 두 번 복제해 그린다. 복제본이 시작되는 지점까지의 실제 거리를
  // 루프 주기로 쓰고(칩 사이 gap까지 정확히 일치), 측정이 안 되면 scrollWidth의 절반으로 대체한다.
  const measurePromptsMarqueeLoop = useCallback((force = false) => {
    if (!force && promptsMarqueeLoopCacheRef.current > 0) return promptsMarqueeLoopCacheRef.current;
    const container = promptsMarqueeRef.current;
    if (!container) return 0;
    const track = container.firstElementChild as HTMLElement | null;
    if (!track) return 0;
    const halfWidth = track.scrollWidth / 2;
    const count = currentPrompts.length;
    let loop = halfWidth;
    if (count > 0 && track.children.length >= count * 2) {
      const firstChip = track.children[0] as HTMLElement;
      const loopStartChip = track.children[count] as HTMLElement;
      const exactPeriod = loopStartChip.offsetLeft - firstChip.offsetLeft;
      if (exactPeriod > 0 && Math.abs(exactPeriod - halfWidth) <= 16) loop = exactPeriod;
    }
    promptsMarqueeLoopCacheRef.current = loop > 0 ? loop : 0;
    return loop;
  }, [currentPrompts.length]);

  // 스크롤 위치를 루프 폭으로 감는다: 앞으로 넘어가면 -loop, 뒤로 넘어가면 +loop → 양방향 무한 순환
  const wrapPromptsMarquee = useCallback((target?: number) => {
    const container = promptsMarqueeRef.current;
    if (!container) return;
    const loop = measurePromptsMarqueeLoop();
    if (!(loop > 0)) return;
    const base = typeof target === 'number' ? target : container.scrollLeft;
    const next = ((base % loop) + loop) % loop;
    if (Math.abs(next - container.scrollLeft) > 0.01) container.scrollLeft = next;
  }, [measurePromptsMarqueeLoop]);

  const holdPromptsMarquee = useCallback((key: 'hover' | 'dragging' | 'touched', held: boolean) => {
    const state = promptsMarqueeHoldRef.current;
    state[key] = held;
    if (!held) state.resumeAt = performance.now() + PROMPTS_MARQUEE_RESUME_DELAY_MS;
  }, []);

  useEffect(() => {
    if (!isLucyReady) return;
    const container = promptsMarqueeRef.current;
    if (!container) return;
    const hold = promptsMarqueeHoldRef.current;
    // A previous pane/background transition may have swallowed touchend.
    hold.hover = false; hold.dragging = false; hold.touched = false;
    hold.resumeAt = 0;
    const reduceMotionQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    let frame = 0;
    let lastTimestamp = 0;
    let pendingPixels = 0;

    const advance = (timestamp: number) => {
      frame = window.requestAnimationFrame(advance);
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        return;
      }
      const deltaMs = Math.min(120, timestamp - lastTimestamp);
      lastTimestamp = timestamp;
      // prefers-reduced-motion: 자동 흐름만 멈추고 수동 스크롤은 그대로 둔다
      if (reduceMotionQuery?.matches) return;
      // 호버·드래그·터치 중에는 멈추고, 조작이 끝난 뒤 짧은 유예(1.2초) 후 재개
      if (hold.hover || hold.dragging || hold.touched) return;
      if (timestamp < hold.resumeAt) return;
      const loop = measurePromptsMarqueeLoop();
      if (!(loop > 0)) return;
      pendingPixels += Math.min(loop / PROMPTS_MARQUEE_FLOW_DURATION_MS, PROMPTS_MARQUEE_MAX_PX_PER_SECOND / 1000) * deltaMs;
      const stepPixels = Math.floor(pendingPixels);
      if (stepPixels <= 0) return;
      pendingPixels -= stepPixels;
      // 컨테이너 폭을 넘어서면 브라우저가 값을 잘라 버리므로 정수 기준으로 한 번 감아 준다
      const loopPixels = Math.max(1, Math.round(loop));
      let next = container.scrollLeft + stepPixels;
      if (next >= loopPixels) next -= loopPixels;
      container.scrollLeft = next;
    };

    // 터치 관성 스크롤처럼 브라우저가 직접 움직인 위치도 범위 밖으로 나가지 않게 감는다
    const handleNativeScroll = () => wrapPromptsMarquee();
    // 휠: deltaX와 세로 deltaY를 모두 가로 이동으로 반영(넘치는 내용이 없으면 개입하지 않는다)
    const handleNativeWheel = (event: WheelEvent) => {
      if (container.scrollWidth <= container.clientWidth + 2) return;
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!delta) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? container.clientWidth : 1;
      wrapPromptsMarquee(container.scrollLeft + delta * unit);
    };

    container.addEventListener('scroll', handleNativeScroll, { passive: true });
    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    // 질문 목록·트랙 폭이 바뀌면(모드 전환·폰트 로딩·화면 회전) 루프 폭을 다시 잡는다
    const track = container.firstElementChild as HTMLElement | null;
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      promptsMarqueeLoopCacheRef.current = 0;
      measurePromptsMarqueeLoop(true);
    }) : null;
    if (track && resizeObserver) resizeObserver.observe(track);
    measurePromptsMarqueeLoop(true);
    // 0에서 시작하면 왼쪽(이전 질문)으로 밀 자리가 없으므로 1px 안쪽에서 출발한다
    if (container.scrollLeft <= 0) container.scrollLeft = 1;
    frame = window.requestAnimationFrame(advance);

    return () => {
      window.cancelAnimationFrame(frame);
      container.removeEventListener('scroll', handleNativeScroll);
      container.removeEventListener('wheel', handleNativeWheel);
      resizeObserver?.disconnect();
    };
  }, [isLucyReady, currentPrompts.length, measurePromptsMarqueeLoop, wrapPromptsMarquee]);

  const handlePromptsMarqueePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') holdPromptsMarquee('hover', true);
  };

  const endPromptsMarqueeDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
    const drag = promptsMarqueeDragRef.current;
    if (!drag.active) return;
    if (drag.moved) {
      // 드래그 직후 같은 손짓이 칩 클릭(질문 전송)으로 새어 들어가지 않게 한 번 막는다
      promptsMarqueeSuppressClickRef.current = true;
      window.setTimeout(() => { promptsMarqueeSuppressClickRef.current = false; }, 320);
    }
    drag.active = false;
    drag.pointerId = -1;
    drag.moved = false;
    holdPromptsMarquee('dragging', false);
    const container = promptsMarqueeRef.current;
    if (container && event && container.hasPointerCapture?.(event.pointerId)) {
      try { container.releasePointerCapture(event.pointerId); } catch { /* noop */ }
    }
  };

  const handlePromptsMarqueePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') holdPromptsMarquee('hover', false);
    endPromptsMarqueeDrag(event);
  };

  const handlePromptsMarqueePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // 터치는 브라우저의 가로 팬(관성 포함)을 그대로 쓰고, 마우스·펜 드래그만 직접 처리한다
    if (event.pointerType === 'touch' || event.button !== 0) return;
    const container = promptsMarqueeRef.current;
    if (!container || container.scrollWidth <= container.clientWidth + 2) return;
    const drag = promptsMarqueeDragRef.current;
    drag.active = true;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startScroll = container.scrollLeft;
    drag.moved = false;
    holdPromptsMarquee('dragging', true);
  };

  const handlePromptsMarqueePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = promptsMarqueeDragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const container = promptsMarqueeRef.current;
    if (!container) return;
    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      // 실제로 끌기 시작한 뒤에만 포인터를 잡는다 — 단순 클릭에서 포인터를 잡으면
      // click 이벤트가 칩이 아니라 컨테이너로 가서 질문 선택이 막힌다.
      try { container.setPointerCapture(event.pointerId); } catch { /* noop */ }
    }
    if (!drag.moved) return;
    wrapPromptsMarquee(drag.startScroll - dx);
  };

  const handlePromptsMarqueeClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!promptsMarqueeSuppressClickRef.current) return;
    promptsMarqueeSuppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const handlePromptsMarqueeTouchStart = () => holdPromptsMarquee('touched', true);
  const handlePromptsMarqueeTouchEnd = () => holdPromptsMarquee('touched', false);

  // 말풍선 배지 / 추천 카드 클릭 시: AI 모드를 유지한 채 해당 채널 조합(단일·융합·마스터)을 즉시 반영
  // Dynamic Current Mode Info
  const channelCount = activeChannels.length;
  const isCasualChat = channelCount === 0 && !requireBasicAndDeep;
  const isFullProMaster = isMasterMode && channelCount === ALL_CHANNELS.length;
  const isSingleSpecial = channelCount === 1;
  const isSynergy = channelCount >= 2 && (!isMasterMode || channelCount < ALL_CHANNELS.length);

  const currentModeTitle = useMemo(() => {
    if (isCasualChat) return '가벼운 일상 수다';
    if (requireBasicAndDeep && channelCount === 0) return 'AI 심층 자동 상담';
    if (isFullProMaster) return '🔮 점술모드';
    if (isSingleSpecial) {
      const ch = activeChannels[0];
      return (ch && SPECIAL_CHANNELS[ch]?.name) || '특화 채널';
    }
    const names = activeChannels.map((c) => (c && SPECIAL_CHANNELS[c]?.shortName) || c).join(' + ');
    return `${channelCount}중 융합 (${names})`;
  }, [channelCount, activeChannels, isCasualChat, isFullProMaster, isSingleSpecial, requireBasicAndDeep]);

  const currentModeTagline = useMemo(() => {
    if (isCasualChat) return '루시와 편안하게 나누는 친근하고 따뜻한 일상 대화';
    if (requireBasicAndDeep && channelCount === 0) return '질문에 맞는 기초 도구와 심층 관점을 함께 선택해 답변';
    if (isFullProMaster) return '7대 테마를 바탕으로 질문별 계산 결과와 심층 참고 관점을 구분해 안내';
    if (isSingleSpecial) {
      const ch = activeChannels[0];
      return (ch && SPECIAL_CHANNELS[ch]?.tagline) || '특화 지능 통찰';
    }
    const names = activeChannels.map((c) => (c && SPECIAL_CHANNELS[c]?.shortName) || c).join(' + ');
    return `${names} 지능이 결합되어 다각도 입체 시너지 통찰을 제공합니다.`;
  }, [channelCount, activeChannels, isCasualChat, isFullProMaster, isSingleSpecial, requireBasicAndDeep]);

  // 🌟 호리(hori.chat) 스타일 동적 예시 고민 풀 (모두 자연스럽게 완성된 문장형 질문으로 제공)
  const dynamicGhostPrompts = useMemo(() => {
    // 2인 이상 시 두 사람(다자간) 맞춤 궁합 질문 우선 노출
    if (activeProfiles.length >= 2) {
      return generateMultiProfilePrompts(activeProfiles).map((q) => toCompleteSentencePrompt(q));
    }

    const horiSentences = HORI_PROMPT_LIBRARY.map((p) => toCompleteSentencePrompt(p.title, p.body));
    
    let contextualPrompts: string[] = [];
    if (selectedMode === 'casual') {
      contextualPrompts = CASUAL_PROMPT_POOL;
    } else if (selectedMode === 'master') {
      contextualPrompts = MASTER_PROMPT_POOL;
    } else if (selectedMode !== 'auto') {
      const chPool = CHANNEL_PROMPT_POOLS[selectedMode];
      if (chPool) contextualPrompts = chPool;
    } else {
      // AI 자동 모드 기본 상태: 7대 채널 대표 질문 + 캐주얼 질문 혼합
      contextualPrompts = [
        ...CHANNEL_PROMPT_POOLS.trinity,
        ...CHANNEL_PROMPT_POOLS.orange,
        ...CHANNEL_PROMPT_POOLS.aura,
        ...CHANNEL_PROMPT_POOLS.bluebird,
        ...CHANNEL_PROMPT_POOLS.muse,
        ...CASUAL_PROMPT_POOL
      ];
    }

    const combined = [...contextualPrompts.map((q) => toCompleteSentencePrompt(q)), ...horiSentences];
    return Array.from(new Set(combined.filter((p) => p && p.trim().length > 0)));
  }, [activeProfiles.length, selectedMode]);

  // dynamicGhostPrompts가 준비되거나 모드가 바뀌면 즉시 첫 예시 질문을 activeGhostPrompt의 기본값으로 동기화
  useEffect(() => {
    if (dynamicGhostPrompts.length > 0) {
      currentGhostPromptRef.current = dynamicGhostPrompts[0];
      setActiveGhostPrompt(dynamicGhostPrompts[0]);
    }
  }, [dynamicGhostPrompts]);

  // Filter messages by search query if search is active (대화 기록이 비어있다면 기본 루시 인사말 표시 보장)
  const filteredMessages = useMemo(() => {
    const isMasterGreeting = false;
    const rawList = lucyMessages.length > 0
      ? (lucyMessages.length === 1 && isGreetingMessage(lucyMessages[0])
          ? (isMasterGreeting
              ? [createDefaultGreeting('lucy', userDisplayName, true)]
              : (lucyMessages[0].mode === 'master' || (typeof lucyMessages[0].content === 'string' && (lucyMessages[0].content.includes('마스터 모드') || lucyMessages[0].content.includes('운명학 올인원')))
                  ? [createDefaultGreeting('lucy', userDisplayName, false, isPlusMode)]
                  : lucyMessages))
          : lucyMessages)
      : [createDefaultGreeting('lucy', userDisplayName, isMasterGreeting, isPlusMode)];
    const baseList = rawList.map((m) => {
      if (isGreetingMessage(m) && typeof m.content === 'string') {
        if (isMasterGreeting && (m.mode === 'master' || m.content.includes('마스터 모드'))) {
          return {
            ...m,
            content: m.content
              .replace(/\d+대\s*운명학/g, '운명학')
              .replace(/\d+가지\s*(?:운명학\s*도구|결정론\s*엔진|운명학·결정론\s*엔진)/g, '운명학 도구·관점'),
          };
        }
        if (!isMasterGreeting && (m.mode === 'master' || m.content.includes('마스터 모드') || m.content.includes('운명학 올인원'))) {
          return createDefaultGreeting('lucy', userDisplayName, false, isPlusMode);
        }
      }
      return m;
    });
    const freshList = baseList.map((m, index) => {
      // 인사 뒤에 대화 기록이 있으면 그 인사는 고정한다. 인사만 있을 때만 들어올 때마다 새로 고른다.
      if (isMasterMode || index !== 0 || baseList.length !== 1 || !isGreetingMessage(m) || m.mode === 'master') return m;
      const fresh = createDefaultGreeting('lucy', userDisplayName, false, isPlusMode, new Date(greetingEntry.at), greetingEntry.variant);
      const shown = { ...m, content: fresh.content, timestamp: greetingEntry.at };
      shownGreetingRef.current = shown;
      return shown;
    });
    return freshList;
  }, [lucyMessages, userDisplayName, isPlusMode, pro, lucyTier, greetingEntry, isMasterMode]);

  const searchHits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as typeof filteredMessages;
    const hits = filteredMessages.filter((m) => lucyMessagePlainText(m).toLowerCase().includes(q));
    return hits.slice(-40).reverse();
  }, [filteredMessages, searchQuery]);

  // 인사만 보이던 방에서 첫 대화가 시작되면, 그때 보이던 인사를 저장해 이후 고정한다.
  useEffect(() => {
    const shown = shownGreetingRef.current;
    if (isMasterMode || !shown || lucyMessages.length < 2) return;
    const first = lucyMessages[0];
    if (!isGreetingMessage(first) || first.id !== shown.id) {
      shownGreetingRef.current = null;
      return;
    }
    shownGreetingRef.current = null;
    if (first.content === shown.content) return;
    setPersonaMessages((previous) => {
      const current = previous.lucy || [];
      if (!current.length || current[0].id !== shown.id) return previous;
      const next = [{ ...current[0], content: shown.content, timestamp: shown.timestamp }, ...current.slice(1)];
      saveUnifiedMessagesSafely(next);
      return { ...previous, lucy: next, orange: next, trinity: next, aura: next, bluebird: next, muse: next };
    });
  }, [isMasterMode, lucyMessages, setPersonaMessages]);

  // 🛡️ 루시 플러스(Lucy+) 진입 시 잔존하는 프로 모드(마스터) 인사말 및 프로 상태 완벽 정화
  useEffect(() => {
    if (lucyTier === 'plus' && !pro) {
      setPersonaMessages((prevRecord) => {
        const current = prevRecord.lucy || [];
        if (current.length === 1 && isGreetingMessage(current[0]) && (current[0].mode === 'master' || (typeof current[0].content === 'string' && current[0].content.includes('마스터 모드')))) {
          const freshGreeting = [createDefaultGreeting('lucy', userDisplayName, false, true)];
          saveUnifiedMessagesSafely(freshGreeting);
          return {
            ...prevRecord,
            lucy: freshGreeting,
          };
        }
        return prevRecord;
      });
    }
  }, [lucyTier, pro, userDisplayName, setPersonaMessages]);

  // Background Auto-Prefetch latest Lucy message for 0ms instant TTS playback
  useEffect(() => {
    if (lucyMessages.length > 0 && !isLucyGenerating) {
      const lastMsg = lucyMessages[lucyMessages.length - 1];
      if (lastMsg && lastMsg.role !== 'user' && typeof lastMsg.content === 'string' && lastMsg.content.length > 1) {
        prefetchTTSChunks(lastMsg.content, 'Aoede');
      }
    }
  }, [lucyMessages, isLucyGenerating]);

  // Keep TTS playing seamlessly across app transitions (global playback persistence)
  useEffect(() => {
    return () => {
      // Do not stop TTS on unmount so audio continues across route switches
    };
  }, []);

  // Subscribe to TTS state changes
  useEffect(() => {
    return subscribeTTS((state) => {
      setTtsInfo({
        isSpeaking: state.isSpeaking,
        isLoading: state.isLoading,
        activeText: state.activeText,
        activeSentence: state.activeSentence || state.currentSentence || null,
      });
      if (!state.isSpeaking && !state.isLoading && !state.isPaused && !state.activeSessionId) {
        setPlayingMsgId(null);
        if (isVoiceModeRef.current && !isVoiceMutedRef.current && !isLucyGeneratingRef.current && !recognitionRef.current) {
          // 루시 음성 종료 시 자동으로 듣기(STT) 상태로 전환하여 연속 대화 연결
          setVoiceState('listening');
          voiceStateRef.current = 'listening';
          startListeningRef.current?.();
        }
      } else if (state.isSpeaking && isVoiceModeRef.current && !isVoiceMutedRef.current) {
        setVoiceState('speaking');
        voiceStateRef.current = 'speaking';
        stopRecognitionRef.current?.();
      }
    });
  }, []);

  // 🔊 자동 음성 재생(Auto-TTS) 동시 중복 호출 및 자기 취소 방지용 단일 러너 뮤텍스
  const isAutoTtsBusyRef = useRef(false);
  const pageMountedAtRef = useRef<number>(Date.now());

  // 🔮 루시 마스터 자동읽기: 사용자가 한 말도 남자 목소리(Charon)로 먼저 읽어준다
  const masterUserSpeechRef = useRef<Promise<void> | null>(null);
  const triggerAutoTts = useCallback(async (textToSpeak: string, msgId?: string) => {
    if (manualTtsActiveRef.current) return;
    if (msgId && !isLucyTarotDrawOpen(lucyMessages.find(message => message.id === msgId)?.tarotDraw)) return;
    if ((!isAutoTtsRef.current && !isVoiceModeRef.current) || !textToSpeak || !textToSpeak.trim()) return;
    if (msgId && lastAutoSpokenMsgIdRef.current === msgId) return;
    if (isAutoTtsBusyRef.current) return;

    const resolvedMsgId = msgId || String(lucyMessages.length - 1);
    setTtsError('');
    lastAutoSpokenMsgIdRef.current = resolvedMsgId;
    setPlayingMsgId(resolvedMsgId);
    isAutoTtsBusyRef.current = true;

    try {
      unlockAudioPlayback();
      primeTTSAudioElement();

      // 분할된 2~4개의 카톡 말풍선을 순서대로 이어 붙여 한 번에 연속 낭독
      // 루시 마스터: 내 말(남자 목소리)이 먼저 끝난 뒤 루시가 이어서 읽는다
      if (masterUserSpeechRef.current) {
        await masterUserSpeechRef.current;
        masterUserSpeechRef.current = null;
      }
      // 답변 보기([답변선택: …]) 줄은 읽지 않는다
      const spokenSource = parseAnswerChoices(cleanAssistantMessageDisplay(textToSpeak)).text;
      const joinedBubblesText = joinKakaoBubblesForTTS(spokenSource, 4) || spokenSource;
      const cleanAnswer = normalizeTextForSpeech(joinedBubblesText);
      if (cleanAnswer) {
        await playTTSInChunks(cleanAnswer, 'Aoede', 110, undefined, undefined, {
          isChatMode: true,
          skipCompletionChime: true,
          isAutoPlay: true,
        });
      }
    } catch (ttsErr) {
      console.warn('[Auto-TTS] Voice playback error:', ttsErr);
      setTtsError(ttsErr instanceof Error ? ttsErr.message : 'AI 음성을 재생하지 못했습니다. 다시 눌러 주세요.');
    } finally {
      if (!manualTtsActiveRef.current) setPlayingMsgId(null);
      isAutoTtsBusyRef.current = false;
    }
  }, [lucyMessages]);

  // 🌸 사용자 요청: 루시 및 루시프로 진입 시 인사말 자동 TTS 낭독 비활성화 (수동 스피커 탭 시에만 재생)
  useEffect(() => {
    hasGreetingSpokenRef.current = true;
  }, []);

  // 🔊 자동 음성 재생(Auto-TTS) 안전 백업 감시자: 새 어시스턴트 메시지 도착 시 바로재생 보장
  useEffect(() => {
    if (!isAutoTtsRef.current || isLucyGenerating || lucyMessages.length === 0 || isAutoTtsBusyRef.current) return;
    const lastMsgIndex = lucyMessages.length - 1;
    const lastMsg = lucyMessages[lastMsgIndex];
    if (!lastMsg || lastMsg.role === 'user' || typeof lastMsg.content !== 'string' || !lastMsg.content.trim()) return;

    // 만약 사용자 발화가 아직 없는 환영/인사말 상태라면 자동 낭독하지 않음
    const hasUser = lucyMessages.some((m) => m.role === 'user' && !!m.content);
    if (!hasUser || lastMsg.id?.startsWith('greet') || isGreetingMessage(lastMsg)) return;

    // 방금 전송된 메시지이고 아직 음성 재생되지 않은 경우 바로 자동 재생
    const targetId = String(lastMsg.id || lastMsgIndex);
    if (targetId && lastAutoSpokenMsgIdRef.current !== targetId && !ttsInfo.isSpeaking && !ttsInfo.isLoading) {
      const msgTime = lastMsg.timestamp || 0;
      const isRecent = Date.now() - msgTime < 25000;
      if (isRecent) {
        triggerAutoTts(lastMsg.content, targetId);
      }
    }
  }, [lucyMessages, isLucyGenerating, ttsInfo.isSpeaking, ttsInfo.isLoading, triggerAutoTts]);


  //  Dynamic PWA Manifest & iOS Home-screen Metadata Switcher
  useEffect(() => {
    const prevTitle = document.title;
    const isDual = typeof document !== 'undefined' && Boolean(
      document.getElementById('duo-lucy-viewport') && document.getElementById('duo-content-viewport')
    ) && isDuoUnfoldedState().unfolded;
    const clean = location ? location.split('?')[0].split('#')[0] : '/';
    const isCosmic = isDual;
    const activeTitle = 'Lucy';
    document.title = activeTitle;

    let manifestTag = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    const prevManifestHref = manifestTag ? manifestTag.getAttribute('href') : null;
    if (manifestTag) {
      manifestTag.setAttribute('href', '/manifest-lucy.webmanifest');
    }

    const appleTouchIcons = document.querySelectorAll('link[rel^="apple-touch-icon"]') as NodeListOf<HTMLLinkElement>;
    const prevAppleIconHrefs: string[] = [];
    appleTouchIcons.forEach((iconTag) => {
      prevAppleIconHrefs.push(iconTag.href);
      iconTag.href = '/apple-touch-icon-lucy-v3.png';
    });

    const favicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]') as NodeListOf<HTMLLinkElement>;
    const prevFaviconHrefs: string[] = [];
    favicons.forEach((favTag) => {
      prevFaviconHrefs.push(favTag.href);
      favTag.href = '/lucy-icon-192-v3.png';
    });

    let appleTitleTag = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement | null;
    const prevAppleTitle = appleTitleTag ? appleTitleTag.getAttribute('content') : null;
    if (appleTitleTag) {
      appleTitleTag.setAttribute('content', 'Lucy');
    }

    let statusBarStyleTag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') as HTMLMetaElement | null;
    const prevStatusBarStyle = statusBarStyleTag ? statusBarStyleTag.getAttribute('content') : null;
    if (statusBarStyleTag) {
      statusBarStyleTag.setAttribute('content', 'black-translucent');
    }

    let themeColorTag = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    const prevThemeColor = themeColorTag ? themeColorTag.getAttribute('content') : null;
    let didCreateThemeTag = false;
    if (!themeColorTag) {
      themeColorTag = document.createElement('meta');
      themeColorTag.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorTag);
      didCreateThemeTag = true;
    }
    const chatBackground = useWhiteTheme ? '#ffffff' : '#101722';
    themeColorTag.setAttribute('content', chatBackground);
    const previousLucyTheme = document.documentElement.getAttribute('data-lucy-theme');
    document.documentElement.setAttribute('data-lucy-theme', useWhiteTheme ? 'white' : 'starlight');

    // 📱 앱(PWA) 모드에서 상하단 안전영역(노치/홈바)이 어두운 body 배경으로 비쳐 회색으로 보이는 현상 방지
    // ⚠️ 펼친 듀얼 화면에서는 바디 전체에 단색 배경을 덮어씌우지 않아 럭키채널 우주배경을 온전히 보존
    const prevHtmlBg = document.documentElement.style.background;
    const prevBodyBg = document.body.style.background;
    const prevHtmlBgColor = document.documentElement.style.backgroundColor;
    const prevBodyBgColor = document.body.style.backgroundColor;
    if (!isDuoUnfolded) {
      document.documentElement.style.background = chatBackground;
      document.body.style.background = chatBackground;
      document.documentElement.style.backgroundColor = chatBackground;
      document.body.style.backgroundColor = chatBackground;
    }

    return () => {
      document.title = prevTitle;
      if (manifestTag && prevManifestHref) manifestTag.setAttribute('href', prevManifestHref);
      appleTouchIcons.forEach((iconTag, idx) => {
        if (prevAppleIconHrefs[idx]) iconTag.href = prevAppleIconHrefs[idx];
      });
      favicons.forEach((favTag, idx) => {
        if (prevFaviconHrefs[idx]) favTag.href = prevFaviconHrefs[idx];
      });
      if (appleTitleTag && prevAppleTitle) appleTitleTag.setAttribute('content', prevAppleTitle);
      if (statusBarStyleTag && prevStatusBarStyle) statusBarStyleTag.setAttribute('content', prevStatusBarStyle);
      if (themeColorTag) {
        if (didCreateThemeTag) {
          themeColorTag.remove();
        } else if (prevThemeColor) {
          themeColorTag.setAttribute('content', prevThemeColor);
        }
      }
      document.documentElement.style.background = prevHtmlBg;
      document.body.style.background = prevBodyBg;
      document.documentElement.style.backgroundColor = prevHtmlBgColor;
      document.body.style.backgroundColor = prevBodyBgColor;
      if (previousLucyTheme === null) document.documentElement.removeAttribute('data-lucy-theme');
      else document.documentElement.setAttribute('data-lucy-theme', previousLucyTheme);
    };
  }, []);

  useEffect(() => {
    const color = lucyDayPeriod === 'morning' ? '#faf7f0' : lucyDayPeriod === 'day' ? '#e6f3ff' : '#101722';
    document.documentElement.style.setProperty('--lucy-page-background', color);
    const tag = document.querySelector('meta[name="theme-color"]');
    const previous = tag?.getAttribute('content');
    tag?.setAttribute('content', color);
    return () => {
      document.documentElement.style.removeProperty('--lucy-page-background');
      if (previous != null) tag?.setAttribute('content', previous);
    };
  }, [lucyDayPeriod]);

  // A resize/image/history update is not a request to read older messages.
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const previous = messageGeometryRef.current;
    const layoutChanged = previous.height !== scrollHeight || previous.viewport !== clientHeight;
    messageGeometryRef.current = { height: scrollHeight, viewport: clientHeight };
    if (clientHeight < 2 || isAutoScrollingRef.current) return;
    // 낭독 중 문장 중앙 정렬로 생기는 이동은 사용자의 스크롤이 아니다.
    // 여기서 사용자가 위로 올렸다고 판단하면 낭독 위치와 하단 사이를 오가게 된다.
    if (ttsHoldsScrollRef.current) return;
    if (layoutChanged && !isUserScrolledUpRef.current) {
      followLatestLayoutRef.current();
      return;
    }
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    // Only a layer over this conversation may ignore layout noise. A content-pane dialog stays independent.
    if (!isUserScrolledUpRef.current && (overlayCoversElement(container) || lucyScrollPinHeld())) {
      if (isLucyScrollPinned() || distanceFromBottom <= 80) followLatestLayoutRef.current();
      return;
    }
    if (distanceFromBottom > 80) {
      isUserScrolledUpRef.current = true;
      noteLucyScrollPin(false);
      setShowReturnToRecentConversation(true);
    } else if (distanceFromBottom <= 35) {
      isUserScrolledUpRef.current = false;
      noteLucyScrollPin(true);
      setShowReturnToRecentConversation(false);
    }
  }, []);

  // 🌟 PC 데스크톱 마우스 휠 및 트랙패드 스크롤 시 자동 스크롤과 충돌 없이 즉각 반응
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -2) {
        // 위로 휠 스크롤 시 즉시 사용자 수동 조작 모드로 전환하여 하단 끌어당김 방지
        if (overlayCoversElement(container)) return;
        releaseLucyScrollPin();
        isUserScrolledUpRef.current = true;
        noteLucyScrollPin(false);
      } else if (e.deltaY > 2) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const dist = scrollHeight - (scrollTop + clientHeight);
        if (dist <= 30) {
          isUserScrolledUpRef.current = false;
        }
      }
    };
    let touchY: number | null = null;
    const readOlder = () => {
      if (overlayCoversElement(container)) return;
      releaseLucyScrollPin();
      isUserScrolledUpRef.current = true;
      noteLucyScrollPin(false);
      setShowReturnToRecentConversation(true);
    };
    const onTouchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? null; };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      if (touchY !== null && y !== undefined && y - touchY > 6) readOlder();
      if (y !== undefined) touchY = y;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
      if (['ArrowUp', 'PageUp', 'Home'].includes(event.key) || (event.key === ' ' && event.shiftKey)) readOlder();
    };
    container.addEventListener('wheel', onWheel, { passive: true });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('keydown', onKeyDown);
    };
  }, [isLucyReady]);

  // 📱 상단 상태바/헤더 탭 시 최상단 스크롤 이벤트 직접 수신
  useEffect(() => {
    const handleScrollToTopEvent = (e: any) => {
      const target = e?.detail?.target;
      // 채널 본문에서 난 탭은 채널 화면만 올린다. 접힌 화면의 루시 패널은 DOM에 남아 있으므로
      // #duo-content-viewport id가 없는 상태(data-workspace-pane="content")까지 막아야 한다.
      if (
        target &&
        typeof target.closest === 'function' &&
        (target.closest('#duo-content-viewport') || target.closest('[data-workspace-pane="content"]'))
      ) {
        return;
      }
      // 다른 채널을 보는 동안 숨겨진 채팅의 읽던 위치를 건드리지 않는다.
      if (!isLucyChatPaneVisible()) return;
      if (messagesContainerRef.current) {
        scrollToConversationTop();
      }
    };
    window.addEventListener('prism-scroll-to-top', handleScrollToTopEvent);
    return () => window.removeEventListener('prism-scroll-to-top', handleScrollToTopEvent);
  }, [scrollToConversationTop]);

  // Keep the callback stable: playback changes must not rerun the mount scroll effect.
  const ttsBlocksAutoScrollRef = useRef(false);
  ttsBlocksAutoScrollRef.current = ttsInfo.isSpeaking || ttsInfo.isLoading || ttsHoldsScrollRef.current;

  const scrollToBottom = useCallback((force = false, smooth = true) => {
    if (!messagesContainerRef.current) return;
    // TTS owns the viewport, including during layout/reveal/background recovery.
    if (ttsBlocksAutoScrollRef.current || manualTtsActiveRef.current) return;
    if (!force && isUserScrolledUpRef.current) return;
    if (force) cancelTopScrollAnimation();

    isAutoScrollingRef.current = true;
    if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 200);

    const container = messagesContainerRef.current;
    // 📖 새 답이 화면보다 길어지면 맨 아래(답의 끝)가 아니라 답의 첫 부분에서 멈춘다.
    // 그 뒤로는 읽는 중으로 보고 더 끌어내리지 않는다 ("최근대화" 버튼으로 내려갈 수 있다).
    const anchorId = answerAnchorIdRef.current;
    if (anchorId) {
      if (force) {
        answerAnchorIdRef.current = null;
      } else {
        const anchor = container.querySelector<HTMLElement>(`[data-chat-msg-id="${CSS.escape(anchorId)}"]`);
        if (anchor) {
          const anchorTop = anchor.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 8;
          const maxTop = container.scrollHeight - container.clientHeight;
          if (anchorTop < maxTop - 2) {
            answerAnchorIdRef.current = null;
            container.scrollTo({ top: Math.max(0, anchorTop), behavior: smooth ? 'smooth' : 'auto' });
            isUserScrolledUpRef.current = true;
            noteLucyScrollPin(false);
            setShowReturnToRecentConversation(true);
            return;
          }
        }
      }
    }
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [cancelTopScrollAnimation]);

  useEffect(() => {
    const last = lucyMessages[lucyMessages.length - 1];
    if (!last) return;
    if (last.role === 'user') {
      answerAnchorIdRef.current = null;
      return;
    }
    const prev = lucyMessages[lucyMessages.length - 2];
    const id = String(last.id || lucyMessages.length - 1);
    // 채팅방에 들어온 뒤 새로 도착한 답만 (들어올 때는 최신 대화를 그대로 보여 준다)
    const fresh = Boolean(last.timestamp && last.timestamp >= pageMountedAtRef.current - 1000 && Date.now() - last.timestamp < 2 * 60 * 1000);
    if (prev?.role === 'user' && fresh && !isGreetingMessage(last) && lastAnswerAnchorRef.current !== id) {
      lastAnswerAnchorRef.current = id;
      answerAnchorIdRef.current = id;
    }
  }, [lucyMessages]);

  followLatestLayoutRef.current = () => {
    if (followLayoutFrameRef.current !== null) cancelAnimationFrame(followLayoutFrameRef.current);
    followLayoutFrameRef.current = requestAnimationFrame(() => {
      followLayoutFrameRef.current = null;
      scrollToBottom(false, false);
    });
  };
  useEffect(() => () => {
    if (followLayoutFrameRef.current !== null) cancelAnimationFrame(followLayoutFrameRef.current);
  }, []);

  const restoreLatestSavedMessages = useCallback(() => {
    const saved = loadSavedUnifiedMessages();
    if (!saved.some(message => message.role === 'user' && message.content)) return;
    setPersonaMessages(previous => {
      const current = previous.lucy || [];
      const next = restoreLatestConversation(current, saved);
      if (next === current) return previous;
      return { lucy: next, orange: next, trinity: next, aura: next, bluebird: next, muse: next };
    });
  }, [setPersonaMessages]);

  // Continuous height & image layout observer for smooth uncropped scrolling
  useEffect(() => {
    if (!messagesWrapperRef.current || !messagesContainerRef.current) return;

    let rafId: number | null = null;
    let lastHeight = 0;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const newHeight = entry ? entry.contentRect.height : 0;
      if (Math.abs(newHeight - lastHeight) < 8) return;
      lastHeight = newHeight;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!isUserScrolledUpRef.current && !ttsBlocksAutoScrollRef.current) {
          scrollToBottom(false, false);
        }
      });
    });

    resizeObserver.observe(messagesWrapperRef.current);

    const handleContentResized = () => {
      if (!isUserScrolledUpRef.current && !ttsBlocksAutoScrollRef.current) {
        scrollToBottom(false, false);
      }
    };
    window.addEventListener('lucy-chat-content-resized', handleContentResized);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
      window.removeEventListener('lucy-chat-content-resized', handleContentResized);
    };
  }, [isLucyReady, scrollToBottom]);

  useEffect(() => {
    if (!isUserScrolledUpRef.current && !ttsBlocksAutoScrollRef.current) {
      scrollToBottom(false, false);
    }
  }, [isLucyReady, lucyMessages, isLucyGenerating, ttsInfo.isSpeaking, scrollToBottom]);

  // The message viewport mounts only after the entrance loader finishes.
  // Align it before paint; playback state must never retrigger this entry scroll.
  useLayoutEffect(() => {
    if (!isLucyReady) return;
    if (['/', '/chat', '/lucy', '/chat/pro'].includes(String(location).split(/[?#]/)[0])) refreshEntryGreeting();
    restoreLatestSavedMessages();
    isUserScrolledUpRef.current = false;
    setShowReturnToRecentConversation(false);
    scrollToBottom(true, false);
    let second = 0;
    let active = true;
    const align = () => { if (active && !isUserScrolledUpRef.current) scrollToBottom(true, false); };
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(align); });
    document.fonts?.ready.then(align).catch(() => {});
    return () => { active = false; cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [isLucyReady, location, scrollToBottom, restoreLatestSavedMessages, refreshEntryGreeting]);

  // Follow resized geometry at the bottom; revealing a retained pane reopens the latest thread.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !isLucyReady) return;
    let wasHidden = container.getBoundingClientRect().height < 2;
    const revealLatest = () => {
      const hidden = container.getBoundingClientRect().height < 2;
      if (!hidden && wasHidden && isReturningFromPhotoPicker()) {
        // 카메라·사진 고르기 동안 화면이 잠깐 접혔다 펴진 것: 다시 들어온 게 아니므로 보던 자리 유지
        restoreAfterPhotoPicker();
        wasHidden = hidden;
        return;
      }
      if (!hidden && (wasHidden || !isUserScrolledUpRef.current)) {
        if (wasHidden) {
          refreshEntryGreeting();
          restoreLatestSavedMessages();
        }
        isUserScrolledUpRef.current = false;
        setShowReturnToRecentConversation(false);
        scrollToBottom(wasHidden, false);
      }
      wasHidden = hidden;
    };
    const observer = new ResizeObserver(revealLatest);
    observer.observe(container);
    return () => observer.disconnect();
  }, [isLucyReady, scrollToBottom, restoreLatestSavedMessages, refreshEntryGreeting]);

  // Returning from the background also opens at the latest conversation.
  const wasAppHiddenRef = useRef(false);
  useEffect(() => {
    if (!isLucyReady) return;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        wasAppHiddenRef.current = true;
      } else if (document.visibilityState === 'visible' && wasAppHiddenRef.current) {
        wasAppHiddenRef.current = false;
        // 카메라·사진 고르기에서 돌아온 것: 다시 들어온 게 아니므로 보던 자리를 그대로 둔다.
        if (isReturningFromPhotoPicker()) {
          restoreAfterPhotoPicker();
          return;
        }
        refreshEntryGreeting();
        restoreLatestSavedMessages();
        isUserScrolledUpRef.current = false;
        setShowReturnToRecentConversation(false);
        scrollToBottom(true, false);
      }
    };

    const onPageShow = (event?: Event) => {
      if (event?.type === 'pageshow' && isReturningFromPhotoPicker()) {
        restoreAfterPhotoPicker();
        return;
      }
      refreshEntryGreeting();
      restoreLatestSavedMessages();
      isUserScrolledUpRef.current = false;
      setShowReturnToRecentConversation(false);
      scrollToBottom(true, false);
      followLatestLayoutRef.current();
    };
    let navigationFrame: number | null = null;
    const onLucyNavigation = (event: Event) => {
      const path = (event as CustomEvent<{ path?: unknown }>).detail?.path;
      if (typeof path !== 'string' || !['/', '/chat', '/lucy', '/chat/pro'].includes(path.split(/[?#]/)[0])) return;
      if (navigationFrame !== null) cancelAnimationFrame(navigationFrame);
      navigationFrame = requestAnimationFrame(() => { navigationFrame = null; onPageShow(); });
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('prism-navigate', onLucyNavigation);
    window.addEventListener('nav-click-active', onLucyNavigation);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('prism-navigate', onLucyNavigation);
      window.removeEventListener('nav-click-active', onLucyNavigation);
      if (navigationFrame !== null) cancelAnimationFrame(navigationFrame);
    };
  }, [isLucyReady, scrollToBottom, restoreLatestSavedMessages, refreshEntryGreeting]);

  // 🚀 최상단 스크롤 이벤트 수신 시 루시 대화창 최상단으로 부드럽게 스크롤
  useEffect(() => {
    const handleScrollToTopEvent = () => scrollToConversationTop();
    window.addEventListener('prism:scroll_to_top', handleScrollToTopEvent);
    return () => {
      window.removeEventListener('prism:scroll_to_top', handleScrollToTopEvent);
    };
  }, [scrollToConversationTop]);

  // 🚀 최하단 스크롤 이벤트 수신 시 루시 대화창 최하단으로 부드럽게 스크롤
  useEffect(() => {
    const handleScrollToBottomEvent = () => {
      isUserScrolledUpRef.current = false;
      setShowReturnToRecentConversation(false);
      scrollToBottom(true, true);
    };
    window.addEventListener('prism:scroll_to_bottom', handleScrollToBottomEvent);
    return () => {
      window.removeEventListener('prism:scroll_to_bottom', handleScrollToBottomEvent);
    };
  }, [scrollToBottom]);

  // 🔎 검색 열기·닫기. 검색은 대화 목록 자체를 걸러내므로 닫을 때 검색어도 함께 비운다.
  const closeSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchOpen(false);
  }, []);

  const openSearchHit = useCallback((id: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    window.requestAnimationFrame(() => {
      const root = messagesContainerRef.current;
      const target = root?.querySelector(`[data-chat-msg-id="${CSS.escape(id)}"]`);
      target?.scrollIntoView({ block: 'center', behavior: 'auto' });
    });
  }, []);

  const toggleSearch = useCallback(() => {
    if (isSearchOpen) closeSearch();
    else setIsSearchOpen(true);
  }, [isSearchOpen, closeSearch]);

  // 검색창은 preventScroll로 포커스만 준다. autoFocus는 iOS에서 뷰포트까지 끌어올려 대화를 튀게 만든다.
  // 패널이 이미 제자리에 그려진 다음 프레임에 포커스해야 WebKit이 빈(높이 0) 입력물을 찾아
  // 스크롤 컨테이너를 뒤적이지 않는다.
  const holdSearchOpenReadingPosition = useCallback(() => {
    const container = messagesContainerRef.current;
    const guard = searchOpenGuardRef.current;
    if (!container || guard.userTouched || Date.now() > guard.until) return;
    const anchor = searchScrollAnchorRef.current;
    if (!anchor) return;
    const expectedTop = resolveLucySearchRestoreTop(anchor, container.scrollHeight, container.clientHeight);
    const next = resolveLucySearchOpenGuardedTop({
      expectedTop,
      currentTop: container.scrollTop,
      scrollHeight: container.scrollHeight,
      clientHeight: container.clientHeight,
      userTouched: guard.userTouched,
    });
    if (next === null) return;
    container.scrollTop = next;
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;
    const focusSearch = () => {
      searchInputRef.current?.focus({ preventScroll: true });
      holdSearchOpenReadingPosition();
    };
    focusSearch();
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(focusSearch);
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [isSearchOpen, holdSearchOpenReadingPosition]);

  // 🔎 검색창이 열린 직후 잠깐 동안 읽던 자리를 지킨다.
  // iOS WebKit은 작은 글씨 input에 포커스를 주면 자동 확대·뷰포트 이동을 하면서 안쪽 스크롤까지
  // 건드리는데, 그때 대화가 엉뚱한 곳(흔히 최상단)에 남는다. 사용자가 직접 만진 뒤에는 건드리지 않는다.
  useEffect(() => {
    const guard = searchOpenGuardRef.current;
    const stopGuard = () => {
      if (guard.frame !== null) cancelAnimationFrame(guard.frame);
      guard.frame = null;
      guard.until = 0;
    };
    if (!isSearchOpen || searchQuery.trim()) {
      stopGuard();
      return;
    }
    const container = messagesContainerRef.current;
    guard.userTouched = false;
    guard.until = Date.now() + 1200;
    const markTouched = () => { guard.userTouched = true; };
    container?.addEventListener('touchstart', markTouched, { passive: true });
    window.addEventListener('wheel', markTouched, { passive: true });
    const viewport = window.visualViewport;
    const onViewportChange = () => holdSearchOpenReadingPosition();
    viewport?.addEventListener('resize', onViewportChange);
    viewport?.addEventListener('scroll', onViewportChange);
    const sample = () => {
      holdSearchOpenReadingPosition();
      if (Date.now() <= guard.until) {
        guard.frame = requestAnimationFrame(sample);
        return;
      }
      guard.frame = null;
    };
    guard.frame = requestAnimationFrame(sample);
    return () => {
      stopGuard();
      container?.removeEventListener('touchstart', markTouched);
      window.removeEventListener('wheel', markTouched);
      viewport?.removeEventListener('resize', onViewportChange);
      viewport?.removeEventListener('scroll', onViewportChange);
    };
  }, [isSearchOpen, searchQuery, holdSearchOpenReadingPosition]);

  // 검색을 열기 전에 읽고 있던 자리를 기억해 두고, 검색을 닫으면 그 자리로 되돌린다.
  // (필터링으로 목록이 줄 때 브라우저가 scrollTop을 0으로 물리적 클램프하기 때문에, 기억해 두지 않으면 대화가 최상단에 남는다.)
  useLayoutEffect(() => {
    const wasOpen = searchWasOpenRef.current;
    if (wasOpen === isSearchOpen) return;
    searchWasOpenRef.current = isSearchOpen;
    const container = messagesContainerRef.current;
    if (!container) return;
    if (isSearchOpen) {
      searchScrollAnchorRef.current = captureLucySearchAnchor(container.scrollTop, container.scrollHeight, container.clientHeight);
      return;
    }
    const anchor = searchScrollAnchorRef.current;
    searchScrollAnchorRef.current = null;
    cancelTopScrollAnimation();
    isAutoScrollingRef.current = true;
    if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setTimeout(() => { isAutoScrollingRef.current = false; }, 200);
    container.scrollTo({
      top: resolveLucySearchRestoreTop(anchor, container.scrollHeight, container.clientHeight),
      behavior: 'auto',
    });
    const readingHistory = Boolean(anchor && !anchor.pinnedToBottom);
    isUserScrolledUpRef.current = readingHistory;
    noteLucyScrollPin(!readingHistory);
    setShowReturnToRecentConversation(readingHistory);
  }, [isSearchOpen, cancelTopScrollAnimation]);

  // Handle image attachment with auto-compression (prevents stuttering & infinite scroll)
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('이미지 크기는 최대 15MB까지 가능합니다.');
      return;
    }

    try {
      const compressed = await compressImageIfNeeded(file);
      if (compressed) {
        setAttachedImage(compressed);
      }
    } catch (err) {
      console.error('[ImageSelect] Failed to process image:', err);
    } finally {
      e.target.value = '';
    }
  };

  // Send message with multi-channel context routing (루시가 답변 준비 중일 때도 추가 연속 입력 허용 및 통합 맥락 반영)
  // 🃏 루시 마스터 타로: 손님이 직접 섞고 고를 때까지 보낼 말을 잠시 맡아둔다.
  // 펼친 화면이면 왼쪽 타로 테이블에서, 접힌 화면이면 채팅 위에 스프레드를 띄운다.
  type PendingTarotPick = { text: string; count: number; concern: string; inChat: boolean; positions: string[]; spreadName?: string; spreadReason?: string };
  const [pendingTarotPick, setPendingTarotPick] = useState<PendingTarotPick | null>(null);
  const pendingTarotPickRef = useRef(pendingTarotPick);
  pendingTarotPickRef.current = pendingTarotPick;
  // 고른 카드를 보낼 때 함께 넘길 배열법(자리 이름)
  const spreadLayoutRef = useRef<{ spreadName: string; positions: string[] } | null>(null);
  const requestMasterTarotPick = useCallback((req: { text: string; count: number; concern: string; positions?: string[]; spreadName?: string; spreadReason?: string }) => {
    const leftTable = isDuoUnfoldedState().unfolded && Boolean(document.querySelector('[data-duo-divination-tarot="true"]'));
    const positions = req.positions?.length ? req.positions : tarotPickPositions(req.count);
    setPendingTarotPick({ ...req, positions, inChat: !leftTable });
    triggerHaptic('whitehole');
    if (leftTable) {
      window.dispatchEvent(new CustomEvent(LUCY_TAROT_PICK_REQUEST_EVENT, { detail: { count: req.count, concern: req.concern, positions, spreadName: req.spreadName, spreadReason: req.spreadReason } }));
    }
  }, []);
  const finishMasterTarotPick = useCallback((cards: DetectedTarotCard[] | null) => {
    const pending = pendingTarotPickRef.current;
    setPendingTarotPick(null);
    if (!pending) return;
    // 카드 고르기를 닫으면 그냥 닫는다. (예시 버튼이 만든 문장 등을 입력창에 되돌려 적지 않는다)
    if (!cards || cards.length === 0) return;
    spreadLayoutRef.current = { spreadName: pending.spreadName || (cards.length >= 3 ? '과거·현재·미래' : '원 카드'), positions: pending.positions };
    void handleSendRef.current?.(pending.text, undefined, cards);
  }, [setInput]);
  useEffect(() => {
    const onPicked = (e: Event) => finishMasterTarotPick(((e as CustomEvent)?.detail?.cards as DetectedTarotCard[]) || null);
    const onCancel = () => finishMasterTarotPick(null);
    window.addEventListener(LUCY_TAROT_PICKED_EVENT, onPicked);
    window.addEventListener(LUCY_TAROT_PICK_CANCEL_EVENT, onCancel);
    return () => {
      window.removeEventListener(LUCY_TAROT_PICKED_EVENT, onPicked);
      window.removeEventListener(LUCY_TAROT_PICK_CANCEL_EVENT, onCancel);
    };
  }, [finishMasterTarotPick]);

  const handleSend = useCallback(async (textToSend?: string, forcedChannels?: SpecialChannel[], pickedTarotCards?: DetectedTarotCard[]) => {
    const fromVoice = voiceUtteranceRef.current;
    voiceUtteranceRef.current = false;
    const hasExplicitUserInput = Boolean(textToSend || input.trim() || attachedImage);
    // 💡 사용자가 직접 입력한 텍스트가 없고 첨부 이미지가 없는 경우(생성 중이 아닐 때만), 현재 화면에 표시/타이핑 중인 완성형 예시 질문 채택
    const candidateGhost = (!hasExplicitUserInput && !isLucyGenerating)
      ? (currentGhostPromptRef.current || activeGhostPrompt || dynamicGhostPrompts[0] || '')
      : '';
    const rawMsg = textToSend || (input.trim() ? input : candidateGhost);
    if (!rawMsg.trim() && !attachedImage) return;

    const userCleanText = rawMsg.trim();

    if (!fromVoice && !attachedImage && !forcedChannels?.length && !pickedTarotCards?.length && liveVoiceRef.current?.sendText(userCleanText)) {
      setInput('');
      setSpeechInterim('');
      setSpeechTranscript(userCleanText);
      speechTranscriptRef.current = userCleanText;
      return;
    }

    if (fromVoice && isVoiceModeRef.current && userCleanText && !attachedImage) {
      setInput('');
      stopTTS();
      setVoiceState('thinking');
      voiceStateRef.current = 'thinking';
      stopRecognition();
      unlockAudioPlayback();
      primeTTSAudioElement();
      await sendUnifiedMessage(userCleanText, 'lucy', undefined, {
        conversationId: isMasterMode ? 'lucy-pro' : 'lucy',
        voiceTurn: true,
        mode: 'casual',
        customUserProfile: counselingUserProfile,
        onFinish: async (fullText, _sent, replyMsgId) => {
          if (!isVoiceModeRef.current || !fullText?.trim()) return;
          void triggerAutoTts(fullText, replyMsgId);
        },
      });
      return;
    }

    // 🔮 루시 마스터 인사의 "이어서/새로" 선택에는 바로 답하고, 이어서 오늘의 고민·질문을 물어본다
    if (isMasterMode && !attachedImage && getLucyMasterLink() === 'undecided') {
      const link = resolveLucyMasterLinkChoice(userCleanText);
      if (link !== 'undecided') {
        setInput('');
        const now = Date.now();
        setLucyProMessages(prev => [
          ...prev,
          { id: `master-user-${now}`, role: 'user', persona: 'lucy', timestamp: now, mode: 'master', content: userCleanText },
          createTarotHouseConcernQuestion(link === 'linked'),
        ]);
        return;
      }
      // 선택 없이 바로 고민을 꺼냈다면 새로 시작한 것으로 보고 그대로 상담을 이어간다
      setLucyMasterLink('fresh');
    }

    // 직전 완성된 루시 답변 이후 연속으로 쌓인 사용자 메시지가 있다면 함께 합쳐서 채널·운명학 도구를 판별
    const priorUnansweredTexts: string[] = [];
    for (let i = lucyMessages.length - 1; i >= 0; i--) {
      const m = lucyMessages[i];
      if (m.role === 'model') {
        const mTxt = typeof m.content === 'string' ? m.content.trim() : '';
        if (mTxt.length > 0) break;
        continue;
      }
      if (m.role === 'user') {
        const uTxt = typeof m.content === 'string'
          ? m.content.trim()
          : Array.isArray(m.content)
          ? (m.content.find((item: any) => item.type === 'text')?.text || '').trim()
          : '';
        if (uTxt) priorUnansweredTexts.unshift(uTxt);
      }
    }
    const combinedContextText =
      priorUnansweredTexts.length > 0
        ? [...priorUnansweredTexts, userCleanText].filter(Boolean).join('\n')
        : userCleanText;

    // 💡 만약 예시 질문(candidateGhost)이 전송된 것이라면 해당 예시 질문의 특성에 맞는 채널 자동 매핑 우선 확인
    let effectiveForcedChannels = forcedChannels;
    if (effectiveForcedChannels === undefined && !input.trim() && candidateGhost && userCleanText === candidateGhost.trim()) {
      const horiItem = HORI_PROMPT_LIBRARY.find((p) => p.title === userCleanText || p.body === userCleanText);
      if (horiItem && horiItem.tool_ids && horiItem.tool_ids.length > 0) {
        effectiveForcedChannels = horiItem.tool_ids.filter((t) => ALL_CHANNELS.includes(t as SpecialChannel)) as SpecialChannel[];
      } else {
        for (const [ch, pool] of Object.entries(CHANNEL_PROMPT_POOLS)) {
          if (pool.includes(userCleanText)) {
            effectiveForcedChannels = [ch as SpecialChannel];
            break;
          }
        }
        if (isMasterMode && !effectiveForcedChannels && MASTER_PROMPT_POOL.includes(userCleanText)) {
          effectiveForcedChannels = ALL_CHANNELS;
        }
      }
    }

    let channels = effectiveForcedChannels !== undefined ? effectiveForcedChannels : activeChannels;
    if (isMasterMode) {
      // 👑 Lucy Pro 마스터 모드: 7대 테마를 사용하고, 실제 계산·참고 상태는 질문별 기록을 따름
      channels = ALL_CHANNELS;
      setActiveChannels(ALL_CHANNELS);
      setAutoDetectedTitle('🔮 점술모드');
    } else if (effectiveForcedChannels !== undefined) {
      channels = effectiveForcedChannels;
      setActiveChannels(effectiveForcedChannels);
      setAutoDetectedTitle(formatChannelsModeTitle(effectiveForcedChannels, isMasterMode));
      presetModeRef.current = {
        text: userCleanText,
        channels: effectiveForcedChannels,
        title: formatChannelsModeTitle(effectiveForcedChannels, isMasterMode),
      };
    } else if (isAutoDetect && forcedChannels === undefined && combinedContextText.length > 0) {
      const detected = detectPageChannels(combinedContextText, { allowMaster: isMasterMode });
      if (isMasterMode && detected.isMaster) {
        channels = ALL_CHANNELS;
      } else {
        channels = detected.channels;
      }
      setActiveChannels(channels);
      setAutoDetectedTitle((isMasterMode && detected.isMaster) ? detected.modeTitle : formatChannelsModeTitle(channels, isMasterMode));
    } else if (forcedChannels !== undefined) {
      channels = forcedChannels;
      setActiveChannels(forcedChannels);
      setAutoDetectedTitle(formatChannelsModeTitle(forcedChannels, isMasterMode));
    }

    channels = isMasterMode ? ALL_CHANNELS : resolveLucyPageChannels(channels, false);
    setActiveChannels(channels);
    setAutoDetectedTitle(formatChannelsModeTitle(channels, isMasterMode));
    const channelCount = channels.length;
    const isMaster = isMasterMode;
    const isCasual = !requireBasicAndDeep && !isMaster && channelCount === 0;
    const isSingle = !isMaster && channelCount === 1;
    const isSyn = !isMaster && channelCount >= 2;

    let targetPersona: PersonaType = 'lucy';
    let extraSystemContext: string | undefined = undefined;

    // 👥 활성화된 1인~4인 프로필 사주·점성술 데이터 및 다자간 궁합 가이드 주입 (현재 메인 상담 대상자 강조)
    const multiProfileContext = buildMultiProfileSystemContext(activeProfiles, activeProfileId, userDisplayName);
    if (multiProfileContext) {
      extraSystemContext = multiProfileContext;
    }
    const nicknameGuidance = `[사용자 호칭 절대 원칙]\n- 루시채팅에서 사용자를 부를 때는 본명이나 실명('박주형' 등)을 절대 부르지 말고, 반드시 사용자의 닉네임인 '${userDisplayName}'(으)로만 다정하게 불러줘. (예: '${userDisplayName}아', '${userDisplayName}야')`;
    extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${nicknameGuidance}` : nicknameGuidance;

    if (isCasual) {
      targetPersona = 'lucy';
    } else if (isSingle) {
      targetPersona = SPECIAL_CHANNELS[channels[0]].persona;
      const chCfg = THEME_PRIMARY_DIVINATION_TOOLS[channels[0]];
      const singleContext = `[${SPECIAL_CHANNELS[channels[0]].name} 전문 모드 — ${SPECIAL_CHANNELS[channels[0]].tagline}]
- ${chCfg ? `이 테마의 주력 운명학 도구: ${chCfg.fusionPhilosophy}` : `${SPECIAL_CHANNELS[channels[0]].name}의 전문적 통찰을 바탕으로 현실적 대안과 조언을 깊이 있게 설명해 줘.`}`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${singleContext}` : singleContext;
    } else if (isMaster) {
      const masterContext = `[루시 통합 상담]
- 질문과 관련하여 실제 계산 데이터가 전달된 도구만 비교하고, 없는 계산을 실행했다고 말하지 마.
- 상징적 조언은 상징이라고 밝히고, 계산 실패·입력 부족은 정직하게 안내해. 엔진 개수로 정확성을 주장하지 마.`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${masterContext}` : masterContext;
      targetPersona = 'lucy';
    } else if (isSyn) {
      const channelNames = channels.map((c) => SPECIAL_CHANNELS[c]?.name || c).join(' + ');
      const themeFusions = channels
        .map((c) => THEME_PRIMARY_DIVINATION_TOOLS[c]?.fusionPhilosophy)
        .filter(Boolean)
        .join(' / ');
      const synContext = `[${channelCount}중 융합 시너지 모드: ${channelNames}]
- 융합된 테마별 주력 도구 시너지: ${themeFusions}
- 위 테마들과 질문 의도에 맞춰 가장 적합한 1~3개 핵심 운명학 도구를 교차 융합해 깊이 있고 유용한 시너지 답변을 도출해 줘.`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${synContext}` : synContext;
      targetPersona = 'lucy';
    }

    // 🔮 점술모드(타로집): 접힘 = 사주 베이스, 펼침 = 왼쪽 타로 테이블 + 사주 베이스
    const divinationLayout: 'folded' | 'unfolded' | undefined = isMasterMode
      ? (isDuoUnfoldedState().unfolded ? 'unfolded' : 'folded')
      : undefined;
    // 타로는 대화 흐름에서 뽑는다: 사용자가 직접 요청하거나, 루시의 "카드 뽑아볼까?" 제안에 응했을 때만.
    const lastLucyText = (() => {
      for (let i = lucyMessages.length - 1; i >= 0; i--) {
        const m = lucyMessages[i];
        if (m.role === 'model' || m.role === 'assistant') return typeof m.content === 'string' ? m.content : '';
      }
      return '';
    })();
    const isTarotIntent = Boolean(pickedTarotCards?.length)
      || isLucyTarotDrawRequest(combinedContextText)
      || Boolean(divinationLayout && isAcceptingTarotDrawOffer(userCleanText, lastLucyText));
    const isThreeCardRequest = /3장|세\s*장|쓰리카드|과거\s*현재\s*미래/i.test(combinedContextText);
    // 🃏 루시 마스터: 카드는 자동으로 뽑지 않고, 손님이 직접 섞고(셔플) 스프레드에서 고르게 한다.
    // 펼친 타로 테이블: 고민·질문을 적으면 그에 맞는 배열법으로 바로 카드 스프레드를 연다.
    const hasLeftTarotTable = divinationLayout === 'unfolded' && typeof document !== 'undefined'
      && Boolean(document.querySelector('[data-duo-divination-tarot="true"]'));
    // 방금 펼친 카드 풀이에 이어 묻는 말(그럼·이 카드·더 자세히 등)은 새 스프레드를 열지 않고 대화로 답한다.
    const isFollowUpOnReading = /\[TAROT:/.test(lastLucyText)
      && /(그럼|그러면|그래서|이\s*카드|그\s*카드|방금|아까|더\s*자세히|자세하게|왜|무슨\s*뜻|어떻게\s*해|뭘\s*해야)/.test(userCleanText);
    // 1단계(사주)에서는 고민을 적어도 스프레드를 자동으로 열지 않는다. 2단계부터 타로가 테이블에 더해진다.
    const autoSpread = hasLeftTarotTable && getLucyMasterDepth() >= 2 && !pickedTarotCards?.length && !attachedImage && !isFollowUpOnReading
      && (isTarotIntent || isAutoSpreadCandidate(userCleanText));
    if (divinationLayout && (isTarotIntent || autoSpread) && !pickedTarotCards?.length) {
      setInput('');
      // 타로 테이블의 추천 예시를 눌렀다면 그 질문에 맞춘 배열법(장수·자리)을 쓴다.
      // 펼친 테이블에서 장수를 직접 말하지 않았다면 고민 내용에 맞는 배열법을 고른다.
      const explicitCount = /한\s*장|1\s*장|세\s*장|3\s*장|쓰리카드|과거\s*현재\s*미래/i.test(combinedContextText);
      const concernText = findConcernAnchor([...lucyMessages, { role: 'user', content: userCleanText }]) || userCleanText;
      const queuedSpread = takeQueuedMasterTarotSpread()
        ?? (hasLeftTarotTable && !explicitCount ? matchMasterTarotSpread(userCleanText, concernText) : null);
      requestMasterTarotPick({
        text: userCleanText,
        count: queuedSpread ? queuedSpread.positions.length : isThreeCardRequest ? 3 : 1,
        concern: findConcernAnchor([...lucyMessages, { role: 'user', content: userCleanText }]),
        positions: queuedSpread?.positions,
        spreadName: queuedSpread?.spreadName,
        spreadReason: queuedSpread?.reason,
      });
      return;
    }
    const wantsDeepEngines = Boolean(divinationLayout) && isAskingForDeepEngines(userCleanText, lastLucyText);
    const divinationMode = divinationLayout
      ? { base: (isTarotIntent ? 'tarot_saju' : 'saju') as 'saju' | 'tarot_saju', deep: wantsDeepEngines, depth: getLucyMasterDepth() }
      : undefined;

    // 🔮 질문 의도와 활성 테마에 맞춰 도구 지침을 주입하고, 계산 근거와 상징 참고를 구분
    const divinationSelection: SelectedDivinationToolsResult = isCasual
      ? { isCasualMessage: true, selectedTools: [], promptInjection: '', selectionReason: '가벼운 일상 인사', firedEngineBadges: [] }
      : (divinationMode
        // 점술모드: 사주 메인. 7대 채널 보강·올인원 총동원 없이, 원할 때만 관련 엔진 추가
        ? selectOptimalDivinationTools(combinedContextText, [], counselingUserProfile, false, { allowMaster: false, requireBasicAndDeep, divinationMode })
        : selectOptimalDivinationTools(combinedContextText, isMaster ? ALL_CHANNELS : channels, counselingUserProfile, isMaster, { allowMaster: isMasterMode || requireBasicAndDeep, requireBasicAndDeep }));
    // 🧭 3단계(심층): 13대 도구 계산 결과를 왼쪽 테이블에 넘긴다 (데이터만, 지시문 아님).
    if (divinationMode?.depth === 3 && !divinationSelection.isCasualMessage) {
      const concernForBoard = findConcernAnchor([...lucyMessages, { role: 'user', content: userCleanText }]) || userCleanText;
      publishTableTools(divinationSelection.calculationAudit || [], concernForBoard, extractAllToolFacts(LUCY_MASTER_DEPTH3_TOOLS, divinationSelection.engineTools) as Record<string, ToolFact[]>, pickCalculatedToolData(LUCY_MASTER_DEPTH3_TOOLS, divinationSelection.engineTools));
    }
    if (!divinationSelection.isCasualMessage && divinationSelection.promptInjection) {
      extraSystemContext = extraSystemContext
        ? `${extraSystemContext}\n\n${divinationSelection.promptInjection}`
        : divinationSelection.promptInjection;
    }
    if (divinationLayout) {
      // 인사에서 물어본 "일반 루시 대화 이어갈까?"에 대한 선택 반영
      const link = resolveLucyMasterLinkChoice(userCleanText);
      if (link === 'linked') {
        const linked = buildLinkedLucyContext(personaMessages?.lucy || []);
        if (linked) extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${linked}` : linked;
      }
      // 처음 꺼낸 고민을 중심에 고정해 대화가 산으로 가지 않게 한다 (아직 없으면 이번 말이 중심 고민)
      const concernAnchor = findConcernAnchor([...lucyMessages, { role: 'user', content: userCleanText }]);
      const depthNow = getLucyMasterDepth();
      const houseGuide = buildTarotHouseGuide(divinationLayout, isTarotIntent, wantsDeepEngines, concernAnchor, depthNow);
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${houseGuide}` : houseGuide;
      // 🔮 상담 깊이 이어짐: 2·3단계는 앞 단계 상담을 이어받고, 3단계는 일반 루시 대화와 지난 점술모드 상담까지 연결한다.
      const continuity = [
        buildDepthContinuityContext(lucyMessages, depthNow),
        depthNow >= 3 && link !== 'linked' ? buildDepthLinkedLucyContext(personaMessages?.lucy || []) : '',
        depthNow >= 3 ? buildPastMasterSessionsContext(chatAccount, String(lucyMessages.find(m => m.role === 'user')?.id || '')) : '',
      ].filter(Boolean).join('\n\n');
      if (continuity) extraSystemContext = `${extraSystemContext}\n\n${continuity}`;
    }

    // 🔮 타로 질문 의도 감지 시 실제 운명의 타로 카드를 즉시 드로우하여 루시 프롬프트에 주입 (이미지 비주얼 연동)
    let tarotCardMarkers: string | undefined;
    if (isTarotIntent) {
      const drawnCards = pickedTarotCards?.length ? pickedTarotCards : drawLucyTarotCards(isThreeCardRequest ? 3 : 1);
      const cardMarkers = drawnCards.map((c) => formatTarotMarker(c)).join(' ');
      tarotCardMarkers = cardMarkers;
      // 펼친 점술모드: 뽑힌 카드를 왼쪽 타로 테이블에 바로 펼친다.
      if (divinationLayout === 'unfolded') publishLucyTarotDraw(drawnCards);
      const tarotInstruction = buildLucyTarotReadingPrompt(drawnCards, userCleanText);
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${tarotInstruction}` : tarotInstruction;
      // 직접 고른 카드에는 배열법 자리 이름을 짝지어 넘긴다
      const layout = pickedTarotCards?.length ? spreadLayoutRef.current : null;
      spreadLayoutRef.current = null;
      const layoutContext = layout ? buildSpreadLayoutContext(layout.spreadName, layout.positions, drawnCards) : '';
      if (layoutContext) extraSystemContext = `${extraSystemContext}\n\n${layoutContext}`;
    }
    const usedToolNames =
      !divinationSelection.isCasualMessage && divinationSelection.promptInjection
        ? (divinationSelection.firedEngineBadges || [])
        : [];

    setInput('');
    const imgToSend = attachedImage || undefined;
    setAttachedImage(null);
    stopTTS();

    if (isVoiceModeRef.current) {
      setVoiceState('thinking');
      voiceStateRef.current = 'thinking';
      stopRecognition();
    }

    // 🔮 루시 마스터 + 자동읽기: 내가 한 말을 남자 목소리로 먼저 읽고, 루시 답변은 그 다음에 이어서 읽는다
    if (isMasterMode && isAutoTtsRef.current && !isVoiceModeRef.current) {
      const spokenUser = normalizeTextForSpeech(userCleanText);
      if (spokenUser) {
        unlockAudioPlayback();
        primeTTSAudioElement();
        masterUserSpeechRef.current = playTTSInChunks(spokenUser, 'Charon', 110, undefined, undefined, {
          isChatMode: true,
          skipCompletionChime: true,
          isAutoPlay: true,
        }).then(() => undefined, () => undefined);
      }
    }

    // Text-only chat must not prime a silent player or wake an audio context.
    if (isAutoTtsRef.current || isVoiceModeRef.current) {
      unlockAudioPlayback();
      primeTTSAudioElement();
    }

    // 🌟 사용자 요청: 프로필이 바뀌면 내 기준이 아니라 그 사람 기준으로 상담 (counselingUserProfile 전달)
    await sendUnifiedMessage(userCleanText, targetPersona, imgToSend, {
      tarotCardMarkers,
      conversationId: isMasterMode ? 'lucy-pro' : 'lucy',
      isLucyPlus: isPlusMode,
      isLucyPro: isMasterMode,
      isPro: isMasterMode,
      requireBasicAndDeep,
      extraSystemContext,
      customUserProfile: counselingUserProfile,
      channels: isMaster ? ALL_CHANNELS : channels,
      mode: isMaster ? 'master' : (isCasual ? 'casual' : (isSingle ? channels[0] : isSyn ? 'synergy' : 'auto')),
      channel: isSingle ? channels[0] : undefined,
      usedTools: usedToolNames,
      calculationAudit: divinationSelection.calculationAudit || [],
      onFinish: async (fullText, _sentText, replyMsgId) => {
        if (!tarotCardMarkers && (isAutoTtsRef.current || isVoiceModeRef.current) && fullText && fullText.trim()) {
          void triggerAutoTts(fullText, replyMsgId);
        }
      }
    });
  }, [input, attachedImage, isLucyGenerating, lucyMessages, activeChannels, isAutoDetect, sendUnifiedMessage, activeProfiles, activeProfileId, counselingUserProfile, triggerAutoTts, activeGhostPrompt, dynamicGhostPrompts, stopRecognition, pro, isPlusMode, isMasterMode, personaMessages]);

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const handleSelectPromptFromLibrary = useCallback((
    promptText: string, 
    sendImmediately: boolean,
    toolIds?: string[],
    _promptTitle?: string
  ) => {
    // 1. 도구 ID(toolIds)로부터 유효한 7대 채널 목록 추출
    let resolvedChannels: SpecialChannel[] = [];
    if (toolIds && toolIds.length > 0) {
      resolvedChannels = toolIds.filter((t) => ALL_CHANNELS.includes(t as SpecialChannel)) as SpecialChannel[];
    }
    if (resolvedChannels.length === 0) {
      const detected = detectPageChannels(promptText);
      resolvedChannels = (isMasterMode && detected.isMaster) ? ALL_CHANNELS : detected.channels;
    }

    // 2. 일관된 모드 명칭 생성 (단일: '오렌지 (성찰)', 융합: '2중 융합 (오렌지 + 트리니티)')
    const modeTitle = formatChannelsModeTitle(resolvedChannels, isMasterMode);

    // 3. 헤더 배지 및 활성 채널 상태 즉시 전환
    setActiveChannels(resolvedChannels);
    setAutoDetectedTitle(modeTitle);

    // 4. 프리셋 레퍼런스에 등록하여 250ms 디바운스 실시간 감지기가 임의로 덮어쓰지 못하도록 보존
    presetModeRef.current = {
      text: promptText,
      channels: resolvedChannels,
      title: modeTitle,
    };

    setInput(promptText);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 60);
  }, [isMasterMode]);

  // 🎯 가로 스크롤 추천 질문 칩 클릭 시 해당 질문에 맞는 7대 채널 모드로 전환하고 채팅 입력란에만 입력 (즉시 전송 X)
  const handleSelectRecommendationChip = useCallback((promptText: string) => {
    const focusInputBox = (textToFill: string) => {
      setInput(textToFill);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 60);
    };

    // 1. HORI_PROMPT_LIBRARY 77선 라이브러리 항목 일치 확인
    const horiItem = HORI_PROMPT_LIBRARY.find((p) => p.title === promptText || p.body === promptText);
    if (horiItem && horiItem.tool_ids && horiItem.tool_ids.length > 0) {
      const validChannels = horiItem.tool_ids.filter((t) => ALL_CHANNELS.includes(t as SpecialChannel)) as SpecialChannel[];
      const modeTitle = formatChannelsModeTitle(validChannels, isMasterMode);
      setActiveChannels(validChannels);
      setAutoDetectedTitle(modeTitle);
      presetModeRef.current = {
        text: horiItem.body,
        channels: validChannels,
        title: modeTitle,
      };
      focusInputBox(horiItem.body);
      return;
    }

    // 2. 단일 채널 전용 추천 풀 일치 확인
    for (const [ch, pool] of Object.entries(CHANNEL_PROMPT_POOLS)) {
      if (pool.includes(promptText)) {
        const targetChannels: SpecialChannel[] = [ch as SpecialChannel];
        const modeTitle = formatChannelsModeTitle(targetChannels, isMasterMode);
        setActiveChannels(targetChannels);
        setAutoDetectedTitle(modeTitle);
        presetModeRef.current = {
          text: promptText,
          channels: targetChannels,
          title: modeTitle,
        };
        focusInputBox(promptText);
        return;
      }
    }

    // 3. 올인원 마스터 추천 풀 일치 확인
    if (isMasterMode && MASTER_PROMPT_POOL.includes(promptText)) {
      const targetChannels = ALL_CHANNELS;
      const modeTitle = formatChannelsModeTitle(targetChannels, true);
      setActiveChannels(targetChannels);
      setAutoDetectedTitle(modeTitle);
      presetModeRef.current = {
        text: promptText,
        channels: targetChannels,
        title: modeTitle,
      };
      focusInputBox(promptText);
      return;
    }

    // 4. 일반/융합 질문 풀 및 텍스트 자동 감지 폴백
    const detected = detectPageChannels(promptText);
    const targetChannels = (isMasterMode && detected.isMaster) ? ALL_CHANNELS : detected.channels;
    const modeTitle = (isMasterMode && detected.isMaster) ? detected.modeTitle : formatChannelsModeTitle(targetChannels, isMasterMode);
    setActiveChannels(targetChannels);
    setAutoDetectedTitle(modeTitle);
    presetModeRef.current = {
      text: promptText,
      channels: targetChannels,
      title: modeTitle,
    };
    focusInputBox(promptText);
  }, [isMasterMode]);

  // Handle pending channel and draft / auto-send input from other sub-apps (ReBible, Prism, etc.)
  useEffect(() => {
    try {
      const pending = safeSessionStorage.getItem('lucy_pro_pending_channel');
      let targetChannels: SpecialChannel[] | null = null;
      if (pending) {
        safeSessionStorage.removeItem('lucy_pro_pending_channel');
        targetChannels = parsePendingChannels(pending);
        setActiveChannels(targetChannels);
      }

      // 1. Explicit auto-send prompt from other sub-apps (e.g. 40가지 기법 질문, ReBible 묵상 등)
      const autoSendPrompt = sessionStorage.getItem('lucy_injected_auto_send');
      if (autoSendPrompt) {
        sessionStorage.removeItem('lucy_injected_auto_send');
        sessionStorage.removeItem('lucy_injected_input_draft');
        // Determine channels based on pending channel or fallback to Master Mode
        const finalChannels: SpecialChannel[] = targetChannels !== null
          ? targetChannels
          : ALL_CHANNELS;
        setActiveChannels(finalChannels);
        // Automatically start the conversation with reliable retry
        const runSend = (attempt = 0) => {
          if (handleSendRef.current) {
            handleSendRef.current(autoSendPrompt, finalChannels);
          } else if (attempt < 15) {
            setTimeout(() => runSend(attempt + 1), 100);
          }
        };
        setTimeout(() => runSend(0), 150);
        return;
      }

      const injectedDraft = sessionStorage.getItem('lucy_injected_input_draft');
      if (injectedDraft) {
        sessionStorage.removeItem('lucy_injected_input_draft');
        setInput(injectedDraft);
      }
    } catch (_) {}

    const handleDynamicInject = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail) return;
      const injectedChannels: SpecialChannel[] = detail.channel
        ? parsePendingChannels(detail.channel)
        : (detail.channels || ALL_CHANNELS);
      setActiveChannels(injectedChannels);
      if (!detail.prompt) return;
      if (detail.draftOnly) {
        setInput(detail.prompt);
        return;
      }
      setTimeout(() => {
        if (handleSendRef.current) {
          handleSendRef.current(detail.prompt, injectedChannels);
        }
      }, 150);
    };

    window.addEventListener('lucy-inject-message', handleDynamicInject);
    return () => {
      window.removeEventListener('lucy-inject-message', handleDynamicInject);
    };
  }, [location]);


  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleVoicePlay = async (id: string, text: string, _voice?: string) => {
    if (!isLucyTarotDrawOpen(lucyMessages.find(message => message.id === id)?.tarotDraw)) return;
    isUserScrolledUpRef.current = true; // 수동 음성 재생 클릭 시 하단 끌어당김 절대 차단
    unlockAudioPlayback();
    primeTTSAudioElement();
    const run = ++manualTtsRunRef.current;
    setTtsError('');
    lastAutoSpokenMsgIdRef.current = id;
    const clean = normalizeTextForSpeech(text);
    if (playingMsgId === id && (ttsInfo.isSpeaking || ttsInfo.isLoading)) {
      manualTtsActiveRef.current = false;
      stopTTS();
      setPlayingMsgId(null);
      return;
    }
    manualTtsActiveRef.current = true;
    stopTTS();
    try {
      // Starting a sequence emits an idle reset first. Assign its owner after that reset.
      const playback = playTTSInChunks(clean, _voice === 'Charon' ? 'Charon' : 'Aoede', 220, undefined, undefined, {
        isChatMode: true,
        skipCompletionChime: true,
      });
      setPlayingMsgId(id);
      await playback;
    } catch (error) {
      if (manualTtsRunRef.current === run) setTtsError(error instanceof Error ? error.message : 'AI 음성을 재생하지 못했습니다. 다시 눌러 주세요.');
    } finally {
      if (manualTtsRunRef.current === run) {
        manualTtsActiveRef.current = false;
        setPlayingMsgId(null);
      }
    }
  };

  // Export full conversation as Markdown
  const handleExportChat = () => {
    if (lucyMessages.length === 0) {
      alert('내보낼 대화 내역이 없습니다.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('ko-KR');
    let md = '# Lucy 대화 기록\n- **대화 일시**: ' + todayStr + '\n- **사용자**: ' + userDisplayName + '\n\n---\n\n';

    lucyMessages.forEach((msg) => {
      const speaker = msg.role === 'user' ? userDisplayName : 'Lucy';
      const timeStr = new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      const rawTxt = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
      const txt = msg.role === 'user' ? cleanUserMessageDisplay(rawTxt) : cleanAssistantMessageDisplay(rawTxt);
      md += '### [' + speaker + '] (' + timeStr + ')\n' + txt + '\n\n---\n\n';
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '루시AI프로_대화기록_' + getLocalDateKey() + '.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isLucyReady) {
    return (
      <LucyAuraLoader
        fullScreen
        tier={lucyTier}
        isUnfolded={showPlusMarker}
      />
    );
  }

  return (
    <div
      data-lucy-period={lucyDayPeriod}
      data-lucy-light={isLight ? 'true' : 'false'}
      data-lucy-master={isMasterMode ? 'true' : undefined}
      data-lucy-search-active={isSearchOpen ? 'true' : 'false'}
      data-lucy-input-focused={isInputFocused ? 'true' : 'false'}
      className={`lucy-chat-shell ${isLight ? 'light' : 'dark'} ${isSearchOpen ? 'lucy-search-active' : ''} ${isInputFocused ? 'lucy-input-focused' : ''} ${isMasterMode ? 'is-pro-theme' : ''} ${lucyDayPeriod === 'night' ? 'lucy-night' : 'lucy-daylight'} h-full min-h-0 flex-1 w-full max-w-full overflow-hidden overflow-x-clip overscroll-x-none flex flex-col font-sans select-text relative transition-colors duration-500`}
      style={{
        overflowX: 'clip',
        maxWidth: '100%',
      }}
    >
      {/* 🔮 상담 깊이 안내 (빅뱅 홀드). 시각 전용, 입력을 막지 않는다. */}
      <AnimatePresence>
        {isMasterMode && depthNotice && (
          <motion.div
            key={depthNotice.key}
            data-lucy-master-depth-notice={depthNotice.depth}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute left-1/2 top-16 z-[60] w-[min(92%,360px)] -translate-x-1/2 rounded-2xl border border-amber-300/50 bg-[#1e0f3a]/90 px-4 py-3 text-center shadow-[0_10px_40px_rgba(124,58,237,0.45)] backdrop-blur-md"
          >
            <p className="text-sm font-black text-amber-200">
              {depthNotice.changed ? `🔮 상담 깊이 ${depthNotice.depth}단계 · ${LUCY_MASTER_DEPTH_INFO[depthNotice.depth].name}` : `🔮 이미 가장 깊은 ${LUCY_MASTER_MAX_DEPTH}단계예요`}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-violet-100/90 break-keep">
              {depthNotice.changed ? `다음 답부터 ${LUCY_MASTER_DEPTH_INFO[depthNotice.depth].note}` : '빅뱅 버튼을 한 번 탭하면 일반 루시로 돌아가요'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 🌌 Shared AI/Plus sky background; clover accents belong to Pro modes only */}
      {isMasterMode
        ? <LucyMasterTarotRoom />
        : <LucyCosmicBackground isProMode={isMasterMode} period={lucyDayPeriod} />}
      {isMasterMode && (
        <div className="absolute right-3 z-30" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 64px)' }}>
          <LucyMasterBgmToggle />
        </div>
      )}
      {isMasterMode && pendingTarotPick?.inChat && (
        <TarotSpread
          maxCards={pendingTarotPick.count}
          positions={pendingTarotPick.positions}
          concern={pendingTarotPick.concern}
          spreadName={pendingTarotPick.spreadName || '루시의 타로 테이블'}
          spreadReason={pendingTarotPick.spreadReason || '카드를 섞고, 마음이 가는 카드를 직접 골라줘'}
          ambience="master"
          allowReversed
          onCancel={() => finishMasterTarotPick(null)}
          onComplete={(cards) => finishMasterTarotPick(toDetectedTarotCards(cards))}
        />
      )}
      {isMasterEntering && (
        <LucyAuraLoader
          fullScreen
          tier="pro"
          message="🔮 루시 마스터 채널로 들어가는 중..."
          subMessage="촛불을 켜고 사주 차트를 펼치는 중"
          isUnfolded={showPlusMarker}
        />
      )}
      {/* Lucy and Lucy Plus have their own entry screens; other mode changes keep the short transition. */}
      <LucyModeTransition active={modeTransitioningTier !== null && modeTransitioningTier !== 'plus' && modeTransitioningTier !== 'ai'} isPlusMode={showPlusMarker} isProMode={isMasterMode} />
      <LucyEntryScreen trigger={lucyEntry.run} variant={lucyEntry.variant} period={lucyDayPeriod} />

      {/* PRO Top Header Bar */}
      <header 
        data-top-bar="true"
        data-lucy-header-tap-scroll="true"
        onClick={(event) => {
          const target = event.target;
          // 검색창 영역(data-no-scroll-top)은 제외한다. 검색 중 이 영역 탭이 대화를 최상단으로 끌어올리면 안 된다.
          if (target instanceof HTMLElement && target.closest('button, a, input, select, textarea, [role="button"], [data-no-scroll-top]')) return;
          scrollToConversationTop();
        }}
        style={{
          paddingTop: isDuoPortrait ? 'max(8px, 0.5rem)' : 'max(14px, calc(env(safe-area-inset-top, 0px) + 10px))',
          overflowX: 'hidden',
        }}
        className={`lucy-chat-header w-full max-w-full overflow-x-hidden px-3.5 sm:px-8 lg:px-12 pb-3 backdrop-blur-xl border-b shadow-xs flex flex-col gap-2.5 z-40 shrink-0 relative transition-colors duration-500 ${
          isLight
            ? 'bg-white/85 border-amber-200/60 text-slate-900 shadow-[0_2px_14px_rgba(180,140,90,0.08)]'
            : isPlusMode
            ? 'bg-slate-950/85 border-amber-500/30 text-white shadow-[0_4px_24px_rgba(245,158,11,0.1)]'
            : 'bg-slate-950/80 border-white/10 text-white'
        }`}
      >
        <div className="flex items-center justify-between gap-2 min-w-0 w-full max-w-full">
          {/* Brand logo stays within the current chat page. */}
          <div className="flex items-center min-w-0 flex-1 overflow-hidden">
            <div
              className="flex items-center gap-2 sm:gap-3 min-w-0 w-full group select-none"
            >
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap min-w-0">
                  <h1
                    className={`text-base sm:text-xl font-black tracking-tight flex items-center gap-1.5 shrink-0 ${isLight ? 'text-slate-900' : 'text-white'}`}
                  >
                    <span data-no-scroll-top="true" className="flex items-center gap-1.5 select-none">
                      <LucyModeName plus={showPlusMarker} pro={false} master={isMasterMode} isLight={isLight} />
                    </span>
                  </h1>
                  {isMasterMode && (
                    <span
                      data-lucy-master-depth={masterDepth}
                      title="빅뱅 버튼을 꾹 누르면 상담이 한 단계 깊어져요"
                      aria-label={`상담 깊이 ${masterDepth}, ${LUCY_MASTER_DEPTH_INFO[masterDepth].name}`}
                      className="inline-flex h-7 shrink-0 items-center justify-center rounded-full border border-amber-300/50 bg-amber-400/15 px-2.5"
                    >
                      <span aria-hidden="true" className="inline-flex gap-[3px]">
                        {[1, 2, 3].map(level => (
                          <span key={level} className={`h-1.5 w-1.5 rounded-full ${level <= masterDepth ? 'bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.8)]' : 'bg-white/20'}`} />
                        ))}
                      </span>
                    </span>
                  )}
                  {/* 엔진함은 점술 도구 창(접은 화면 "도구" 버튼 · 펼친 화면 왼쪽 테이블)의 📚 엔진함 탭으로 옮겨졌다 */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Tools: 검색 · 자동 읽기 · 내보내기 */}
          <div className="lucy-header-actions flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 🔮 접은 화면 점술모드: 펼친 화면의 왼쪽 테이블(사주·타로·추천 도구·양피지)을 창으로 본다 */}
            {isMasterMode && <MasterTableSheetButton tone={isLight ? 'light' : 'dark'} />}
            {/* 📘 가이드 */}
            <PageGuideButton guide={getPageGuide(isMasterMode ? 'master' : 'lucy')} tone={isLight ? 'light' : 'dark'} />
            {/* 1. 검색 (Search Toggle) */}
            <button
              type="button"
              onClick={toggleSearch}
              className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                isSearchOpen
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
                  : isLight
                  ? 'bg-amber-50/80 hover:bg-amber-100/80 text-slate-600 border border-amber-900/10'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
              }`}
              title="대화 내역 검색"
              aria-label="대화 검색"
            >
              <Search size={16} />
            </button>


            {/* 🔊 루시 답변 자동 음성 읽기 (Auto-TTS 바로재생 토글 버튼: 한 번 더 누르면 즉시 끄기) */}
            <button
              type="button"
              data-auto-tts-toggle="true"
              onClick={toggleAutoTts}
              className={`px-2.5 py-1.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1 text-[11px] font-bold ${
                isAutoTts
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-100/80 dark:from-emerald-950/80 dark:to-teal-900/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 shadow-2xs'
                  : isLight
                  ? 'bg-amber-50/80 text-slate-500 hover:text-slate-700 border border-amber-900/10'
                  : 'bg-white/10 text-white/85 hover:text-white border border-white/15'
              }`}
              title={isAutoTts ? '자동읽기 ON - 한 번 더 누르면 즉시 꺼집니다' : '자동읽기 OFF - 누르면 켜집니다'}
              aria-pressed={isAutoTts}
              aria-label={isAutoTts ? '자동읽기 켜짐 (눌러서 끄기)' : '자동읽기 꺼짐 (눌러서 켜기)'}
            >
              {isAutoTts ? (
                <>
                  <Volume2 size={15} className="text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
                  <span className="hidden xs:inline">자동읽기 ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={15} className={isLight ? 'text-slate-400 shrink-0' : 'text-white/75 shrink-0'} />
                  <span className="hidden xs:inline">자동읽기 OFF</span>
                </>
              )}
            </button>

            {/*  Export Chat */}
            {lucyMessages.length > 0 && (
              <button
                onClick={handleExportChat}
                className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer hidden xs:flex items-center justify-center border ${
                  isLight
                    ? 'bg-amber-50/80 hover:bg-amber-100/80 text-slate-600 border-amber-900/10'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                }`}
                title="대화 내역 Markdown으로 내보내기"
                aria-label="대화 내보내기"
              >
                <Download size={15} />
              </button>
            )}

            {/* 로그인 버튼 (비로그인 상태일 때만 표시) */}
            {!firebaseUser && (
              <button
                onClick={() => signInWithGoogle()}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-amber-50/90 hover:bg-amber-100 border-amber-900/15 text-slate-700'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                로그인
              </button>
            )}
          </div>
        </div>

        {/*  Search Input Dropdown */}
        {/* 높이 애니메이션 없음: 높이 0에서 포커스를 받으면 iOS가 대화를 끌어올린다. */}

      </header>

      {isSearchOpen && (
        <div className="lucy-search-overlay" role="dialog" aria-label="대화 검색" onClick={closeSearch}>
          <div className="lucy-search-panel" data-no-scroll-top="true" onClick={(e) => e.stopPropagation()}>
            <div className="lucy-search-bar">
              <Search size={18} aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="대화에 나온 말로 검색"
                autoComplete="off"
                enterKeyHint="search"
              />
              <button type="button" className="lucy-search-close" onClick={closeSearch}>닫기</button>
            </div>
            <div className="lucy-search-results">
              {!searchQuery.trim() ? (
                <div className="lucy-search-hint">대화에 나온 말을 입력하면 그 이야기로 이동해요</div>
              ) : searchHits.length === 0 ? (
                <div className="lucy-search-empty">“{searchQuery.trim()}”에 맞는 대화가 없어요.<br />다른 단어로 찾아보세요.</div>
              ) : searchHits.map((hit) => {
                const text = lucyMessagePlainText(hit).replace(/\s+/g, ' ').trim();
                const when = hit.timestamp ? new Date(hit.timestamp).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                return (
                  <button key={String(hit.id)} type="button" className="lucy-search-item" onClick={() => openSearchHit(String(hit.id))}>
                    <span className="lucy-search-icon" aria-hidden="true">{hit.role === 'user' ? '나' : '루'}</span>
                    <span className="lucy-search-text">
                      <strong>{text.slice(0, 80) || '내용 없음'}</strong>
                      <small>{hit.role === 'user' ? '내가 보낸 말' : '루시'}{when ? ` · ${when}` : ''}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 📱 메인 본문: 펼침 모드에서는 좌측 50% 화면을 온전히 채우며, 접힘 모드에서는 전체 단일 화면 채움 */}
      <div className="flex-1 min-h-0 flex flex-col w-full max-w-full overflow-hidden">
        <div className="h-full min-h-0 flex flex-col min-w-0 overflow-hidden relative w-full flex-1">
          {/* Chat Messages Stream */}
          <main
        ref={messagesContainerRef}
        data-app-scroll-root="true"
        onScroll={handleScroll}
        style={{ overflowX: 'hidden', touchAction: 'pan-y' }}
        className="prism-page-content lucy-chat-main min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-x-none touch-pan-y p-3 sm:p-5 lg:p-6 w-full mx-auto min-w-0 select-text"
      >
        <div ref={messagesWrapperRef} className="space-y-3 sm:space-y-4 pb-3 sm:pb-4 w-full max-w-full min-w-0 overflow-x-hidden">
          {filteredMessages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const msgId = String(msg.id || index);
            const rawContent = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
            const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '';
            const hasImage = Array.isArray(msg.content) && msg.content.some((item: any) => item.type === 'image_url');
            const imageUrl = hasImage ? (msg.content as any[]).find((item: any) => item.type === 'image_url')?.image_url?.url : null;
            const rawTextContent = Array.isArray(msg.content) ? (msg.content as any[]).find((item: any) => item.type === 'text')?.text || '' : rawContent;
            const parsedAssistant = isUser
              ? { text: cleanUserMessageDisplay(rawTextContent), choices: [] as string[] }
              : parseAnswerChoices(cleanAssistantMessageDisplay(rawTextContent, true));
            const textContent = parsedAssistant.text;
            const answerChoices = parsedAssistant.choices;
            if (!isUser && !textContent.trim() && !imageUrl) {
              return null;
            }
            const msgModeInfo = resolveMessageModeAndChannels(msg, filteredMessages, index);

            // 루시의 인사말인지 여부 정밀 판별
            const isGreeting = (() => {
              if (isUser) return false;
              if (msgId === 'greet' || msgId === 'greet-main' || msgId.startsWith('greet-') || msgId.toLowerCase().includes('greet')) {
                return true;
              }
              const prevUser = filteredMessages.slice(0, index).reverse().find((m: any) => m.role === 'user');
              if (!prevUser) {
                return true;
              }
              const cleanText = textContent.trim();
              if (
                cleanText.includes("통합 AI 마스터 가이드 '루시'야") ||
                cleanText.includes('반가워! 나는 루시야') ||
                cleanText.includes('오늘도 새로운 하루가 시작되었어') ||
                cleanText.includes('지난 대화들의 소중한 이야기들도 내 마음에 다 간직하고 있으니') ||
                cleanText.includes('영혼 여정을 함께하는') ||
                cleanText.includes('수다 떨 준비되어 있어') ||
                cleanText.includes('나랑 가볍게 수다 떨자') ||
                cleanText.includes('언제든 친구처럼 다정하게 수다')
              ) {
                return true;
              }
              const userText = (typeof prevUser.content === 'string'
                ? prevUser.content
                : Array.isArray(prevUser.content)
                ? prevUser.content.find((item: any) => item.type === 'text')?.text || ''
                : '').trim();
              if (!userText) {
                return true;
              }
              const isSimpleGreetingQuery = /^(안녕|안녕하세요|안뇽|하이|hi|hello|좋은\s*아침|좋은\s*하루|반가워|반갑습니다|루시\s*안녕|루시야\s*안녕|안녕\s*루시)[!~.\s]*$/i.test(userText);
              if (isSimpleGreetingQuery && cleanText.length < 160) {
                return true;
              }
              return false;
            })();

            return (
              <motion.div
                key={msgId}
                data-chat-msg-id={msgId}
                data-tts-playing-message={playingMsgId === msgId ? 'true' : undefined}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col w-full max-w-full min-w-0 overflow-x-hidden ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Speaker label, passive mode badge and timestamp */}
                <div className="flex items-center gap-1.5 mb-1.5 px-1 text-[11px] flex-wrap max-w-full min-w-0">
                  {!isUser ? (
                    <span
                      className={`font-bold flex items-center gap-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}
                      style={{ color: isLight ? '#92400e' : '#fcd34d' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                      Lucy
                    </span>
                  ) : (
                    <span
                      className={`font-bold flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-white'}`}
                      style={{ color: isLight ? '#475569' : '#ffffff' }}
                    >
                      <User size={12} className={isLight ? 'text-slate-400' : 'text-white/80'} />
                      {userDisplayName}
                    </span>
                  )}


                  <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/70'}`}>{timeStr}</span>
                </div>
                <div className="relative group max-w-[92%] sm:max-w-[85%] lg:max-w-[80%] min-w-0">
                  {/* Attached Image Preview (in User Message or Lucy's Card Deep Insight Reply) */}
                  {(() => {
                    const cardImageToDisplay = isUser ? imageUrl : (imageUrl || null);
                    if (!cardImageToDisplay) return null;
                    return (
                      <div className="mb-2 overflow-hidden rounded-2xl border border-amber-900/15 dark:border-white/15 shadow-sm max-w-xs bg-[#fffdf9] dark:bg-slate-900 min-h-[100px]">
                        <img 
                          src={cardImageToDisplay} 
                          alt="첨부 이미지" 
                          loading="lazy"
                          className="w-full h-auto object-cover max-h-64 rounded-2xl" 
                        />
                      </div>
                    );
                  })()}

                  {/* Message Bubble(s) */}
                  {isUser ? (
                    <>
                      <div
                        data-forward-bubble
                        className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-sm sm:text-[15px] lg:text-base leading-relaxed select-text min-w-0 max-w-full overflow-x-hidden break-words [overflow-wrap:anywhere] transition-colors duration-300 ${
                          isLight
                            ? 'lucy-user-bubble bg-amber-100 border border-amber-300 text-slate-900 rounded-tr-xs font-sans shadow-xs'
                            : 'lucy-starlight-user bg-indigo-600/90 border border-indigo-400/30 text-white rounded-tr-xs font-sans shadow-sm'
                        }`}
                        style={{
                          backgroundColor: useWhiteTheme ? '#f1f5f9' : isLight ? '#fef3c7' : undefined,
                          color: isLight ? '#0f172a' : '#ffffff',
                        }}
                      >
                        <div
                          className={`whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}
                          style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                        >
                          {textContent}
                        </div>
                      </div>

                      {/* User Action buttons: Copy & TTS */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap justify-end pr-1">
                        <button
                          onClick={() => handleCopy(msgId, textContent)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isLight
                              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              : 'text-white/65 hover:text-white hover:bg-white/10'
                          }`}
                          title="복사"
                        >
                          {copiedId === msgId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => handleVoicePlay(msgId, textContent, 'Charon')}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            playingMsgId === msgId && (ttsInfo.isSpeaking || ttsInfo.isLoading)
                              ? 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60'
                              : isLight
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                              : 'text-white/65 hover:text-amber-300 hover:bg-white/10'
                          }`}
                          title={
                            playingMsgId === msgId && ttsInfo.isLoading
                              ? '음성 준비 중...'
                              : playingMsgId === msgId && ttsInfo.isSpeaking
                              ? '음성 멈추기'
                              : '음성으로 듣기'
                          }
                        >
                          {playingMsgId === msgId && ttsInfo.isLoading ? (
                            <Loader2 size={14} className="animate-spin text-amber-600" />
                          ) : playingMsgId === msgId && ttsInfo.isSpeaking ? (
                            <VolumeX size={14} className="animate-pulse" />
                          ) : (
                            <Volume2 size={14} />
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <LucyKakaoBubbleGroup
                      msgId={msgId}
                      verifiedTarotMarkers={msg.tarotDraw?.source === 'app-random' ? msg.tarotDraw.markers : undefined}
                      revealedTarotCardIds={msg.tarotDraw?.revealedCardIds}
                      onRevealTarotCard={cardId => revealLucyTarotCard(msgId, cardId, isMasterMode ? 'lucy-pro' : 'lucy')}
                      textContent={textContent}
                      isLatest={index === filteredMessages.length - 1}
                      isGenerating={isLucyGenerating && index === filteredMessages.length - 1}
                      isHistorical={
                        isGreeting ||
                        index < filteredMessages.length - 1 ||
                        Boolean(msg.timestamp && msg.timestamp < pageMountedAtRef.current - 2000)
                      }
                      isLight={isLight}
                      variant="standalone"
                      theme={useWhiteTheme ? 'default' : 'starlight'}
                      playingMsgId={playingMsgId}
                      ttsInfo={ttsInfo}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      onVoicePlay={handleVoicePlay}
                      renderRecommendationFooter={() => {
                        if (isLucyGenerating && index === filteredMessages.length - 1) return null;
                        if (index !== filteredMessages.length - 1 || searchQuery.trim()) return null;

                        const recentUserTexts = filteredMessages
                          .slice(0, index)
                          .filter((candidate: any) => candidate.role === 'user')
                          .slice(-3)
                          .map((candidate: any) => {
                            const content = typeof candidate.content === 'string'
                              ? candidate.content
                              : Array.isArray(candidate.content)
                                ? candidate.content.find((item: any) => item.type === 'text')?.text || ''
                                : '';
                            return cleanUserMessageDisplay(content);
                          });
                        const answerChoiceButtons = answerChoices.length > 0 ? (
                          <div className="mt-2.5 flex flex-wrap gap-1.5" data-lucy-answer-choices="true">
                            {answerChoices.map(choice => (
                              <button
                                key={choice}
                                type="button"
                                onClick={() => {
                                  triggerHaptic('whitehole');
                                  void handleSend(choice);
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                                  isLight
                                    ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                                    : 'bg-amber-500/10 border-amber-400/40 text-amber-200 hover:bg-amber-500/20'
                                }`}
                              >
                                {choice}
                              </button>
                            ))}
                          </div>
                        ) : null;

                        if (dismissedRecommendationFor === msgId) return answerChoiceButtons;
                        const nextStepRecommendation = !isMasterMode && !msgModeInfo.isCasual && !isGreeting ? (
                          <LucyResponseRecommendation
                            userQuery={recentUserTexts[recentUserTexts.length - 1] || ''}
                            recentUserTexts={recentUserTexts}
                            lucyAnswer={textContent}
                            currentChannels={msgModeInfo.channels}
                            isCasual={msgModeInfo.isCasual}
                            isGreeting={isGreeting}
                            isMasterMode={isMasterMode}
                            forceDivination={masterOfferFor === msgId}
                            isLight={isLight}
                            onEnterDivination={acceptMasterOffer}
                            onDismissDivination={() => {
                              setDismissedRecommendationFor(msgId);
                              if (masterOfferFor === msgId) declineMasterOffer();
                            }}
                            onNavigate={path => navigate(path)}
                          />
                        ) : null;

                        return (
                          <>
                            {answerChoiceButtons}
                            {nextStepRecommendation}
                          </>
                        );
                      }}
                    />
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}

          {isMasterMode && !isLucyGenerating && returnOfferFor && lucyMessages[lucyMessages.length - 1]?.id === returnOfferFor && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              data-lucy-master-return-offer
              className="max-w-[92%] rounded-2xl border border-violet-400/40 bg-[#1a0f2e]/90 p-3.5 text-white shadow-sm"
            >
              <p className="text-[13px] font-bold">🌙 상담은 여기까지 할까?</p>
              <p className="mt-1 text-xs leading-relaxed text-violet-100/85 break-keep">
                마음이 조금 정리된 것 같아. 일반 루시로 돌아가서 편하게 얘기할까? 다시 깊게 보고 싶을 땐 언제든 불러 줘.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  data-lucy-master-return-accept
                  onClick={acceptReturnOffer}
                  className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow active:scale-95"
                >일반 루시로 돌아가기</button>
                <button
                  type="button"
                  data-lucy-master-return-decline
                  onClick={declineReturnOffer}
                  className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-white/85 active:scale-95"
                >조금 더 상담할래</button>
              </div>
            </motion.div>
          )}

          {!isMasterMode && sessionCardOffer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              data-lucy-session-card-offer
              className="max-w-[92%] rounded-2xl border border-violet-400/40 bg-[#1a0f2e]/90 p-3.5 text-white shadow-sm"
            >
              <p className="text-[13px] font-bold">📜 방금 상담을 카드로 남길까?</p>
              <p className="mt-1 text-xs leading-relaxed text-violet-100/85 break-keep">핵심 3줄이랑 내가 남기는 한마디를 한 장에 담아 줄게.</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  data-lucy-session-card-open
                  onClick={() => { triggerHaptic('whitehole'); setSessionCard(sessionCardOffer); setSessionCardOffer(null); }}
                  className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow active:scale-95"
                >카드 만들기</button>
                <button
                  type="button"
                  data-lucy-session-card-dismiss
                  onClick={() => setSessionCardOffer(null)}
                  className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-white/85 active:scale-95"
                >괜찮아</button>
              </div>
            </motion.div>
          )}

          {isLucyGenerating && (
            <div className={`flex items-center gap-2.5 p-3.5 border rounded-2xl w-fit shadow-xs animate-pulse ${
              isLight
                ? 'bg-[#fffdf9]/95 border-emerald-200/80 text-emerald-950'
                : 'bg-slate-900/90 border-emerald-500/30 text-white'
            }`}>
              <span className="text-base select-none animate-bounce">✨</span>
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
              </div>
              <span
                className={`text-xs sm:text-sm font-bold ml-1 ${isLight ? 'text-emerald-950' : 'text-white'}`}
                style={{ color: isLight ? '#022c22' : '#ffffff' }}
              >
                기본 도구와 심층 관점을 함께 살펴보고 있어요...
              </span>
              {isMasterMode && <LucyThinkingElapsed isLight={isLight} depth={masterDepth} />}
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ⌨️ Bottom Input Bar: Image Preview + STT Mic + Multi-Modal Vision + Send */}
      <footer 
        ref={chatFooterRef}
        style={{
          paddingTop: '2px',
          paddingBottom: 'max(2px, env(safe-area-inset-bottom, 0px))',
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.96)' : undefined,
          color: isLight ? '#1e293b' : '#ffffff',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
        className={`lucy-chat-footer w-full max-w-full overflow-x-hidden px-1.5 sm:px-2.5 backdrop-blur-xl border-t shadow-xs shrink-0 z-40 relative transition-colors duration-300 flex flex-col justify-center ${
          isLight
            ? 'bg-white/95 border-amber-200/80 text-slate-800 shadow-[0_-2px_12px_rgba(180,140,90,0.06)]'
            : 'bg-slate-950/88 border-white/10 text-white'
        }`}
      >
        <div className="lucy-input-stack w-full min-w-0 max-w-full flex flex-col gap-1 overflow-x-hidden">
          {/* Image Attachment Preview */}
          {attachedImage && (
            <div className="flex items-center gap-1.5 bg-amber-50/90 dark:bg-slate-900 p-1 rounded-xl w-fit border border-amber-200 dark:border-white/15">
              <img src={attachedImage} alt="첨부 미리보기" className="w-8 h-8 object-cover rounded-lg" />
              <div className={`text-[11px] font-medium pr-1.5 ${isLight ? 'text-slate-600' : 'text-white'}`}>이미지 비전 준비됨</div>
              <button 
                onClick={() => setAttachedImage(null)}
                className="p-0.5 rounded-full hover:bg-amber-200/60 dark:hover:bg-white/10 text-slate-500 dark:text-white/80 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}


          {ttsError && <div role="alert" className="flex items-center justify-between gap-2 rounded-lg border border-amber-400/40 bg-amber-100 px-3 py-2 text-xs text-amber-950">
            <span>{ttsError}</span>
            <button type="button" aria-label="음성 오류 안내 닫기" onClick={() => setTtsError('')}>닫기</button>
          </div>}

          {/* 🔊 실시간 루시 음성 재생 바 (현재 말하는 중일 때 즉시 멈춤 지원) */}
          <AnimatePresence>
            {(ttsInfo.isSpeaking || ttsInfo.isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="lucy-voice-status flex items-center justify-between px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-300/80 dark:border-amber-500/40 rounded-lg sm:rounded-xl text-[10px] sm:text-xs text-amber-950 dark:text-white shadow-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {ttsInfo.isLoading ? (
                    <Loader2 size={11} className="animate-spin text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <Volume2 size={11} className="text-amber-600 dark:text-amber-400 animate-pulse shrink-0" />
                  )}
                  <span className={`font-bold text-[10px] sm:text-[11px] shrink-0 ${isLight ? 'text-amber-950' : 'text-white'}`}>
                    {ttsInfo.isLoading ? '루시 음성 준비 중...' : '루시 음성 안내 중'}
                  </span>
                  {ttsInfo.activeText && ttsInfo.activeText !== '__CONVERSATION__' && (
                    <span className={`text-[9px] sm:text-[10px] truncate max-w-[170px] sm:max-w-[340px] ${isLight ? 'text-amber-900/70' : 'text-white/85'}`}>
                      "{ttsInfo.activeText.slice(0, 30)}..."
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopTTS();
                    setPlayingMsgId(null);
                  }}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-bold text-[9px] cursor-pointer active:scale-95 transition-all shadow-2xs shrink-0 ml-1.5"
                  title="음성 즉시 중지"
                >
                  <Square size={8} className="fill-current" />
                  <span>중지</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🎙️ 루시 1:1 전용 실시간 음성 대화 모드 패널 (Voice Mode Active Panel) */}
          <AnimatePresence>
            {isVoiceMode && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className={`p-2.5 sm:p-3 rounded-2xl border backdrop-blur-xl transition-all shadow-md my-0.5 ${
                  isLight
                    ? 'bg-gradient-to-r from-amber-50/95 via-yellow-50/90 to-amber-50/95 border-amber-300/80 text-slate-800 shadow-[0_2px_12px_rgba(251,191,36,0.15)]'
                    : 'bg-gradient-to-r from-slate-900/95 via-amber-950/40 to-slate-900/95 border-amber-400/40 text-white shadow-[0_2px_16px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {voiceState === 'listening' ? (
                      <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-300">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/40 animate-pulse shrink-0">
                          <Mic size={13} className="text-cyan-600 dark:text-cyan-300" />
                        </div>
                        <div className="flex items-center gap-0.5 h-3 px-0.5 shrink-0">
                          <span className="w-1 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
                          <span className="w-1 h-3.5 bg-cyan-300 rounded-full animate-pulse" />
                          <span className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        </div>
                        <span className="text-xs font-bold truncate">
                          {voiceEngine === 'live' ? '실시간으로 듣고 있어요. 그냥 말하세요' : '루시가 듣고 있어요... 편하게 말씀하세요'}
                        </span>
                      </div>
                    ) : voiceState === 'thinking' ? (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40 shrink-0">
                          <Loader2 size={13} className="animate-spin text-amber-600 dark:text-amber-300" />
                        </div>
                        <span className="text-xs font-bold truncate animate-pulse">
                          듣고, 바로 말할게요
                        </span>
                      </div>
                    ) : voiceState === 'speaking' ? (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40 animate-pulse shrink-0">
                          <Volume2 size={13} className="text-amber-600 dark:text-amber-300 animate-pulse" />
                        </div>
                        <span className="text-xs font-bold truncate">
                          루시가 말하고 있어요
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-300">
                        <Mic size={14} className="text-slate-400 shrink-0" />
                        <span className="text-xs font-medium truncate">
                          <span className="font-bold">LUCY</span>
                          <span className="ml-1.5 opacity-70">Voice Mode</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* 루시 말 끊기 (인터럽트) 버튼 */}
                    {voiceState === 'speaking' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (liveVoiceRef.current) {
                            liveVoiceRef.current.interrupt();
                            setVoiceState('listening');
                            voiceStateRef.current = 'listening';
                            return;
                          }
                          handleInterruptLucy();
                        }}
                        className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] cursor-pointer active:scale-95 transition-all shadow-xs flex items-center gap-1"
                        title="루시 말 끊고 바로 질문하기"
                      >
                        <Square size={8} className="fill-current" />
                        <span>말끊기</span>
                      </button>
                    )}

                    {/* 음소거 토글 */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextMuted = !isVoiceMutedRef.current;
                        setIsVoiceMuted(nextMuted);
                        isVoiceMutedRef.current = nextMuted;
                        if (nextMuted) {
                          liveVoiceRef.current?.setMuted(true);
                          stopRecognition();
                          voiceStateRef.current = 'idle';
                          speechTranscriptRef.current = '';
                          setSpeechTranscript('');
                          setSpeechInterim('');
                          setVoiceState('idle');
                        } else {
                          liveVoiceRef.current?.setMuted(false);
                          setVoiceState('listening');
                          startListening();
                        }
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isVoiceMuted
                          ? 'bg-rose-500/20 text-rose-400 border-rose-400/40'
                          : isLight
                          ? 'bg-white/80 hover:bg-amber-100 text-slate-600 border-amber-200'
                          : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
                      }`}
                      title={isVoiceMuted ? '마이크 음소거 해제' : '마이크 임시 음소거'}
                    >
                      {isVoiceMuted ? <MicOff size={12} /> : <Mic size={12} />}
                    </button>

                    {/* 음성 모드 종료 버튼 */}
                    <button
                      type="button"
                      onClick={handleToggleVoiceMode}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 cursor-pointer"
                      title="음성 모드 끄기 (텍스트 모드로 복귀)"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {/* 실시간 음성 인식 텍스트 표시 영역 */}
                {(speechTranscript || speechInterim) && (
                  <div data-voice-transcript className="relative overflow-hidden mt-1.5 px-2.5 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-amber-400/30 text-xs flex items-center justify-between gap-2">
                    {/* 말을 멈추면 자동 전송까지 남은 시간 (글자가 바뀌면 처음부터 다시) */}
                    {heardOnScreen.length >= 1 && !isVoiceMuted && (
                      <span
                        key={heardOnScreen}
                        aria-hidden="true"
                        data-voice-autosend-bar
                        className="lucy-voice-autosend-bar pointer-events-none absolute bottom-0 left-0 h-[3px] bg-amber-400"
                      />
                    )}
                    <span className="truncate text-slate-700 dark:text-amber-100/90 font-medium">
                      "{speechTranscript || speechInterim}"
                    </span>
                    {voiceEngine !== 'live' && (
                    <button
                      type="button"
                      onClick={() => {
                        const textToSend = (speechTranscript || speechInterim).trim();
                        if (textToSend) {
                          voiceUtteranceRef.current = true;
                          void handleSend(textToSend);
                          setSpeechTranscript('');
                          setSpeechInterim('');
                        }
                      }}
                      className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-[10px] shrink-0 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      지금 전송
                    </button>
                    )}
                  </div>
                )}

                {/* 마이크 에러 알림 */}
                {voiceError && (
                  <div className="mt-1 px-2 py-1 rounded-lg bg-rose-500/15 border border-rose-400/30 text-[11px] text-rose-300 flex items-center justify-between">
                    <span>{voiceError}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceError(null);
                        startListening();
                      }}
                      className="text-[10px] font-bold underline ml-2 cursor-pointer"
                    >
                      다시 시도
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 👥 대화창 상담 대상자 프로필 독 바 (2인 이상 궁합/시너지 모드 시 항시 표시) */}
          {activeProfiles.length > 1 && (
            <ChatProfileDock
              profiles={activeProfiles}
              activeProfileId={activeProfileId}
              onSelectProfile={handleSelectActiveProfile}
              onAddClick={handleOpenAddChatProfile}
              onEditProfile={handleOpenEditChatProfile}
              onRemoveProfile={handleRemoveChatProfile}
              maxProfiles={4}
            />
          )}

          {/* 💡 추천 질문 가로 나열 바 & 추천질문 라이브러리 버튼 (+ 1인 모드 시 슬림 프로필 칩 통합) */}
          <div className="lucy-suggestion-toolbar w-full flex items-center gap-1 sm:gap-1.5 h-[24px] sm:h-[26px] py-0 overflow-x-auto no-scrollbar scroll-smooth">
            {/* 1인 점괘 모드일 때: 별도 세로줄을 차지하지 않고 한 줄에 초슬림하게 통합 */}
            {activeProfiles.length <= 1 && (
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 h-full">
                <button
                  type="button"
                  onClick={() => {
                    if (activeProfiles[0]) {
                      handleOpenEditChatProfile(activeProfiles[0]);
                    } else {
                      handleOpenAddChatProfile();
                    }
                  }}
                  className={`px-2 sm:px-2.5 h-[22px] sm:h-[24px] rounded-full border text-[10px] sm:text-[11px] font-bold transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs ${
                    isLight
                      ? 'bg-amber-50/90 hover:bg-amber-100 border-amber-300/80 text-amber-900'
                      : 'bg-amber-950/60 hover:bg-amber-900/60 border-amber-500/40 text-white'
                  }`}
                  style={{ color: isLight ? '#78350f' : '#ffffff' }}
                  title="내 사주 프로필 수정"
                >
                  <User size={10} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate max-w-[48px] sm:max-w-[76px]">
                    {activeProfiles[0]?.isMe ? userDisplayName : (activeProfiles[0]?.name || userDisplayName)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddChatProfile}
                  className={`px-1.5 sm:px-2 h-[22px] sm:h-[24px] rounded-full border text-[9px] sm:text-[10px] font-medium transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-0.5 shadow-2xs ${
                    isLight
                      ? 'bg-[#fffdf9] hover:bg-amber-50 border-amber-900/15 hover:border-amber-300 text-slate-600 hover:text-amber-800'
                      : 'bg-slate-900 hover:bg-slate-800 border-white/15 hover:border-amber-400/50 text-white'
                  }`}
                  style={{ color: isLight ? '#475569' : '#ffffff' }}
                  title="궁합/상담 대상자 추가"
                >
                  <Plus size={9} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="hidden xs:inline">궁합</span>
                </button>
              </div>
            )}

            {/* ✨ 추천질문 전체보기 모달 트리거 아이콘 버튼 (점술모드에서만) */}
            {isMasterMode && <LucyLibraryTrigger
              id="lucy-open-prompt-library-btn"
              type="button"
              aria-haspopup="dialog"
              stateKey={`${librarySessionKey}:prompt`}
              aria-controls="hori-prompt-library-dialog"
              className={`w-[22px] h-[22px] min-w-[22px] min-h-[22px] sm:w-[24px] sm:h-[24px] sm:min-w-[24px] sm:min-h-[24px] p-0 rounded-lg bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 hover:from-amber-500/25 hover:to-yellow-500/30 border border-amber-400/80 dark:border-amber-500/60 transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center shadow-2xs group ${
                isLight ? 'text-amber-900' : 'text-white'
              }`}
              style={{ color: isLight ? '#78350f' : '#ffffff' }}
              title="사주·타로·점성술·자미두수 추천질문 전체보기"
              aria-label="추천질문 라이브러리 열기"
            >
              <Sparkles size={11} className="sm:w-3 sm:h-3 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            </LucyLibraryTrigger>}

            {/* 새로고침 셔플 버튼 */}
            <button
              type="button"
              onClick={refreshPrompts}
              className={`w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] p-0 rounded-lg border transition-all shrink-0 cursor-pointer active:scale-90 flex items-center justify-center shadow-2xs ${
                isLight
                  ? 'text-amber-600 hover:text-amber-800 bg-[#fffdf9] hover:bg-amber-50 border-amber-200/80'
                  : 'text-amber-400 hover:text-amber-300 bg-slate-900 hover:bg-slate-800 border-amber-500/30'
              }`}
              title="새로운 맞춤 추천 질문으로 변경 (랜덤 셔플)"
              aria-label="추천 질문 새로고침"
            >
              <RefreshCw size={10} className={`sm:w-2.5 sm:h-2.5 text-amber-600 dark:text-amber-400 ${isLucyGenerating ? 'animate-spin' : ''}`} />
            </button>

            {/* 가로 무한 흐름 추천 질문 리스트 (자동 흐름 + 손가락·휠·드래그 양방향 스크롤) */}
            {currentPrompts.length > 0 && (
              <div
                ref={promptsMarqueeRef}
                aria-label="추천 질문 예시"
                className="lucy-prompts-marquee-container flex-1 min-w-0 flex items-center py-0 h-full select-none"
                onPointerEnter={handlePromptsMarqueePointerEnter}
                onPointerLeave={handlePromptsMarqueePointerLeave}
                onPointerDown={handlePromptsMarqueePointerDown}
                onPointerMove={handlePromptsMarqueePointerMove}
                onPointerUp={endPromptsMarqueeDrag}
                onPointerCancel={endPromptsMarqueeDrag}
                onTouchStart={handlePromptsMarqueeTouchStart}
                onTouchEnd={handlePromptsMarqueeTouchEnd}
                onTouchCancel={handlePromptsMarqueeTouchEnd}
                onClickCapture={handlePromptsMarqueeClickCapture}
                onDragStart={(event) => event.preventDefault()}
              >
                <div className="lucy-prompts-marquee-track">
                  {[...currentPrompts, ...currentPrompts].map((promptText, promptIdx) => (
                    <button
                      key={`${promptText}-${promptIdx}`}
                      type="button"
                      onClick={() => handleSelectRecommendationChip(promptText)}
                      disabled={isLucyGenerating}
                      aria-hidden={promptIdx >= currentPrompts.length ? true : undefined}
                      tabIndex={promptIdx >= currentPrompts.length ? -1 : undefined}
                      draggable={false}
                      className={`shrink-0 px-2.5 sm:px-3 h-[22px] sm:h-[24px] flex items-center rounded-full border text-[10px] sm:text-[11.5px] font-medium transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-40 whitespace-nowrap leading-none ${
                        isLight
                          ? 'bg-[#fffdf9]/90 hover:bg-amber-50 border-amber-200/80 hover:border-amber-300 text-slate-800 hover:text-amber-950'
                          : 'bg-slate-900/90 hover:bg-slate-800 border-white/20 hover:border-amber-400/50 text-white hover:text-amber-200'
                      }`}
                      style={{ color: isLight ? '#1e293b' : '#ffffff' }}
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 💬 Input Container */}
          <div
            style={{ backgroundColor: isLight ? '#ffffff' : undefined }}
            onClick={(e) => {
              if (e.target !== fileInputRef.current && !(e.target as HTMLElement)?.closest('button')) {
                textareaRef.current?.focus();
              }
            }}
            className={`lucy-starlight-composer cursor-text flex items-center gap-1.5 sm:gap-2.5 border focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/20 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 min-h-[38px] sm:min-h-[42px] max-h-[42px] transition-all shadow-2xs ${
              isLight
                ? 'bg-white border-amber-300/70'
                : 'bg-slate-900/90 border-white/15'
            }`}
          >
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => { restoreAfterPhotoPicker(); void handleImageSelect(e); }}
              accept="image/*" 
              className="hidden" 
            />

            {/* 📷 Image / Camera Button */}
            <button
              type="button"
              onClick={openPhotoPicker}
              className={`w-7 h-7 sm:w-8 sm:h-8 p-0 flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${
                lucyDayPeriod !== 'night'
                  ? 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                  : 'text-white/75 hover:text-amber-300 hover:bg-white/10'
              }`}
              title="사진/이미지 첨부"
              aria-label="사진 첨부"
            >
              <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Textarea Wrapper for Ghost Typewriter Overlay */}
            <div className="relative flex-1 min-h-[24px] sm:min-h-[28px] flex items-center">
              {/* 옅은색 동적 예시 고민 타이프라이터 플레이스홀더 (호리 스타일) */}
              <DynamicGhostInputPlaceholder
                prompts={dynamicGhostPrompts}
                isVisible={!input && !isLucyGenerating && !isInputFocused}
                pauseDuration={12000}
                typingSpeed={45}
                deletingSpeed={20}
                onCurrentPromptChange={(prompt) => {
                  currentGhostPromptRef.current = prompt;
                  setActiveGhostPrompt(prompt);
                }}
              />

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onCompositionStart={() => { isInputComposingRef.current = true; }}
                onCompositionEnd={() => { isInputComposingRef.current = false; }}
                onFocus={() => {
                  setIsInputFocused(true);
                  if (typeof window !== 'undefined') {
                    if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
                    if (document.documentElement.scrollLeft !== 0) document.documentElement.scrollLeft = 0;
                    if (document.body.scrollLeft !== 0) document.body.scrollLeft = 0;
                  }
                  setTimeout(() => {
                    if (typeof window !== 'undefined') {
                      if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
                      if (document.documentElement.scrollLeft !== 0) document.documentElement.scrollLeft = 0;
                      if (document.body.scrollLeft !== 0) document.body.scrollLeft = 0;
                    }
                    if (messagesContainerRef.current) {
                      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                    }
                  }, 80);
                }}
                onKeyDown={(e) => {
                  // Safari may end composition before keydown; keyCode 229 still identifies the IME event.
                  if (isInputComposingRef.current || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
                  if (e.key === 'Tab' && !input && currentGhostPromptRef.current) {
                    e.preventDefault();
                    setInput(currentGhostPromptRef.current);
                    return;
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                onBlur={() => {
                  React.startTransition(() => setIsInputFocused(false));
                  if (window.scrollY !== 0) window.scrollTo(0, 0);
                  if (document.documentElement.scrollTop !== 0) document.documentElement.scrollTop = 0;
                  if (document.body.scrollTop !== 0) document.body.scrollTop = 0;
                }}
                placeholder={
                  isLucyGenerating
                    ? '추가로 할 말을 입력하면 이어서 한 번에 답변해 드려요...'
                    : (isInputFocused ? '메시지를 입력하세요 (Shift+Enter 줄바꿈, Enter 전송)...' : '')
                }
                rows={1}
                className={`w-full bg-transparent text-[13px] sm:text-sm resize-none outline-none leading-tight sm:leading-snug min-h-[24px] sm:min-h-[28px] max-h-[40px] py-0.5 z-10 ${
                  isLight ? 'text-slate-800 placeholder-slate-400' : 'text-white placeholder-white/65'
                }`}
                style={{ color: isLight ? '#1e293b' : '#ffffff' }}
              />
            </div>

            {/* Send or Stop Generation Button: 답변 준비 중이라도 입력창에 글자/이미지가 있으면 즉시 전송 버튼으로 자동 전환 */}
            {isLucyGenerating && !input.trim() && !attachedImage ? (
              <button
                type="button"
                onClick={handleAbortGeneration}
                className="w-7 h-7 sm:w-8 sm:h-8 p-0 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-md cursor-pointer shrink-0 active:scale-95 flex items-center justify-center animate-pulse"
                title="답변 생성 중단 (글자를 입력하면 추가 전송 버튼으로 자동 전환됩니다)"
                aria-label="생성 중단"
              >
                <Square size={11} className="sm:w-3.5 sm:h-3.5 fill-current text-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() && !attachedImage && (!activeGhostPrompt || isLucyGenerating)}
                className={`lucy-starlight-send w-7 h-7 sm:w-8 sm:h-8 p-0 font-bold rounded-lg sm:rounded-xl transition-all shadow-xs cursor-pointer shrink-0 active:scale-95 flex items-center justify-center ${
                  input.trim() || attachedImage
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/20'
                    : activeGhostPrompt && !isLucyGenerating
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/20 ring-1 ring-amber-400/40'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 opacity-30 cursor-not-allowed text-slate-950'
                }`}
                title={
                  input.trim() || attachedImage
                    ? (isLucyGenerating ? '추가 메시지 연속 전송 (진행 중인 답변을 멈추고 합쳐서 답변)' : '메시지 전송')
                    : activeGhostPrompt
                    ? `예시 질문 바로 전송: "${activeGhostPrompt}"`
                    : '메시지를 입력하거나 예시를 선택하세요'
                }
                aria-label={
                  input.trim() || attachedImage
                    ? (isLucyGenerating ? '추가 메시지 연속 전송' : '메시지 전송')
                    : activeGhostPrompt
                    ? `예시 질문 바로 전송: ${activeGhostPrompt}`
                    : '메시지 전송'
                }
              >
                <Send size={12.5} className="sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </div>
      </footer>
        </div>
      </div>

      {/*  제제 님의 소울 프로필 퀵뷰 모달 */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <ScreenPortal><div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`rounded-3xl p-6 w-full max-w-md shadow-2xl border relative space-y-4 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/15 text-white'
              }`}
            >
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-white flex items-center justify-center shadow-sm">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{primaryProfile?.name || sharedState?.userProfile?.basic?.name || '박주형'} 님의 소울 프로필</h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/75'}`}>Google 계정 연동 및 사주·에너지 요약</p>
                </div>
              </div>

              <div className={`border rounded-2xl p-4 space-y-2.5 text-xs ${
                isLight ? 'bg-amber-50/60 border-amber-200/80 text-slate-700' : 'bg-slate-800/80 border-white/15 text-white'
              }`}>
                <div className="flex justify-between border-b border-amber-200/60 dark:border-white/10 pb-2">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>본명 (실명)</span>
                  <span className={`font-bold ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>{primaryProfile?.name || sharedState?.userProfile?.basic?.name || '박주형'}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 dark:border-white/10 pb-2">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>소울 닉네임 (호칭)</span>
                  <span className={`font-bold ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>{userDisplayName}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 dark:border-white/10 pb-2">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>연동 이메일</span>
                  <span className={`font-medium truncate max-w-[200px] ${isLight ? 'text-slate-800' : 'text-white'}`}>{firebaseUser?.email || '미연동'}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 dark:border-white/10 pb-2">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>사주 본원 (일주)</span>
                  <span className={`font-bold ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>{sajuInfo ? sajuInfo.shortDigest : '기본 분석 진행 중'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>상담 선호 스타일</span>
                  <span className={`font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>{sharedState?.userProfile?.psych?.counselingStyle || '따뜻하고 직관적인 공감'}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div></ScreenPortal>
        )}
      </AnimatePresence>

      {/* 📍 루시 채팅 스마트 스크롤 낭독 위치 즉시 복귀 플로팅 버튼 */}
      <SmartScrollResumeButton
        isVisible={isLucyUserOverriding && isTTSActive && hasLucyActiveHighlight}
        onResume={() => resumeLucyAutoScroll('smooth')}
        remainingSeconds={lucyRemainingSeconds}
        fixed
        className="!bottom-[calc(var(--sidebar-footer-height,var(--lucy-footer-height,140px))+12px)] sm:!bottom-[calc(var(--sidebar-footer-height,var(--lucy-footer-height,140px))+16px)]"
      />

      <AnimatePresence>
        {showReturnToRecentConversation && (
          <motion.button
            type="button"
            data-sidebar-aware="true"
            aria-label="최근대화"
            title="최근대화"
            onClick={() => {
              isUserScrolledUpRef.current = false;
              setShowReturnToRecentConversation(false);
              scrollToBottom(true, true);
            }}
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed right-4 z-50 inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-slate-950/90 px-2.5 py-1.5 text-[11px] font-semibold text-amber-100 shadow-[0_8px_25px_rgba(245,158,11,0.25)] backdrop-blur-md transition-colors hover:bg-slate-900 active:scale-95 cursor-pointer"
            style={{
              right: 'calc(var(--sites-sidebar-width, 80px) + 16px)',
              left: 'auto',
              transform: 'none',
              zIndex: 500,
              bottom: `calc(var(--sidebar-footer-height, var(--lucy-footer-height, 140px)) + ${isLucyUserOverriding && isTTSActive && hasLucyActiveHighlight ? '160px' : '100px'})`,
            }}
          >
            <ChevronDown size={13} className="text-amber-300" />
            <span>최근대화</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 🔊 Auto-TTS Feedback Toast */}
      <AnimatePresence>
        {autoTtsToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-950/95 text-emerald-100 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 border border-emerald-500/30"
          >
            <Volume2 size={15} className="text-emerald-400 animate-pulse shrink-0" />
            <span>{autoTtsToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📖 13페이지 추천 질문 라이브러리 모달 */}
      {/* 엔진함·추천질문 라이브러리는 점술모드에서만 연다 */}
      {sessionCard && <LucyMasterSessionCard source={sessionCard} onClose={() => setSessionCard(null)} />}
      {isMasterMode && <LucyLibraryDialogs sessionKey={librarySessionKey} isLight={isLight} onSelectPrompt={handleSelectPromptFromLibrary} />}

      {/* 👥 대화창 프로필 추가/수정 모달 */}
      <ChatProfileModal
        isOpen={isChatProfileModalOpen}
        onClose={() => setIsChatProfileModalOpen(false)}
        onSave={handleSaveChatProfile}
        initialProfile={editingChatProfile}
        totalProfilesCount={activeProfiles.length}
        existingProfiles={activeProfiles}
        userRealName={sharedState?.userProfile?.basic?.name || getPersistentUserProfile()?.basic?.name || '박주형'}
      />



      {/* End of content */}

    </div>
  );
}

function lucyMessagePlainText(message: { role?: string; content?: unknown }): string {
  const raw = typeof message.content === 'string'
    ? message.content
    : Array.isArray(message.content)
      ? (message.content.find((item: { type?: string; text?: string }) => item?.type === 'text')?.text || '')
      : '';
  return message.role === 'user' ? cleanUserMessageDisplay(raw) : cleanAssistantMessageDisplay(raw, true);
}

export default function LucyStandalonePage(props: { pro?: boolean }) {
  return <LucyThemeBoundary><LucyStandaloneContent {...props} /></LucyThemeBoundary>;
}
