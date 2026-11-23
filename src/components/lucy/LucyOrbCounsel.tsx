import { PageGuideButton } from '@/components/guide/PageGuide';
import { getPageGuide } from '@/lib/pageGuides';
import { startGeminiLiveVoice, type LiveVoiceSession } from '@/lib/geminiLiveSession';
import { createOrbCounselBed, type OrbCounselBed } from '@/lib/orbCounselBed';
import { isLucyMasterBgmPlaying, stopLucyMasterBgm } from '@/lib/lucyMasterBgm';
import { ORB_MASTERS, orbVoice, type OrbMaster } from '@/lib/orbMasters';
import { generateHeavenlyAdvice } from '@/lib/orbHeavenlyAdvice';
import { playTTSInChunks, stopTTS, useTTSActive, useTTSState } from '@/utils/tts';
import { CHANNEL_MENU_ICONS, MessageCircleMinus } from '@/lib/channelMenuIcons';
import {
  ORB_CARD_POSITIONS, ORB_DECK_SIZE, buildOrbMemoryBrief, countStopWords, isStopAll, latestOrbMemoryLine, loadOrbMemory,
  orbCardPickMessage, parseCardNumbers, pickOrbCards, saveOrbMemory, shuffleOrbDeck, summarizeOrbSession,
  type OrbDeckCard, type OrbMemoryEntry, type OrbPickedCard,
} from '@/lib/orbConsult';
import { Clover, KeyRound, MessageCirclePlus, type LucideIcon } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { setMicCaptureActive } from '@/lib/audioMixingPolicy';
import { rememberBgmBeforeMic, resumeBgmAfterMicSoon } from '@/lib/micBgmResume';
import { drawTalisman, pickTalisman, saveTalismanImage, type TalismanSpec } from '@/lib/orbTalisman';
import { buildOrbMasterRules } from '@/lib/orb/orbTools';
import { CAPTION_CHAR_MS, captionSteps } from '@/lib/orb/orbCaption';
import { createOrbToolExecutor, type OrbToolExecutor } from '@/lib/orb/orbToolExecutor';
import type { UserProfile } from '@/lib/sharedState';
import './lucy-orb-counsel.css';

const BOKCHAE = [
  { id: 'mind', label: '마음' },
  { id: '3', label: '3천 원' },
  { id: '5', label: '5천 원' },
  { id: '10', label: '1만 원' },
] as const;

function HeartGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
/** 인스타 라이브처럼 떠오르는 하트들 (위치·지연·크기·색이 조금씩 다르다). */
const IG_HEARTS = [
  { x: 0, delay: 0, scale: 1.15, color: '#ff3040', sway: 16 },
  { x: -6, delay: 160, scale: .95, color: '#ff6fae', sway: -20 },
  { x: 6, delay: 320, scale: 1, color: '#ffa53b', sway: 18 },
  { x: -3, delay: 470, scale: .9, color: '#b56bff', sway: -14 },
  { x: 4, delay: 620, scale: 1.05, color: '#ff3040', sway: 22 },
  { x: -5, delay: 780, scale: .85, color: '#4cc3ff', sway: -18 },
  { x: 2, delay: 930, scale: 1, color: '#ff6fae', sway: 14 },
  { x: -2, delay: 1090, scale: .9, color: '#ffa53b', sway: -22 },
  { x: 5, delay: 1240, scale: 1, color: '#ff3040', sway: 16 },
  { x: -4, delay: 1400, scale: .8, color: '#b56bff', sway: -12 },
];
/** Faint shapes drifting inside the crystal ball: every Luckey icon plus runes. */
const ORB_ICONS: LucideIcon[] = [Clover, MessageCircleMinus, MessageCirclePlus, KeyRound, ...Object.values(CHANNEL_MENU_ICONS).filter(icon => icon !== KeyRound)];
const ORB_RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛗ', 'ᛟ'];
const ORB_GLYPHS = [
  ...ORB_ICONS.map((Icon, index) => ({ key: `icon-${index}`, Icon, rune: '' })),
  ...ORB_RUNES.map((rune, index) => ({ key: `rune-${index}`, Icon: null, rune })),
].map((glyph, index, all) => {
  // Golden-angle spiral keeps the glyphs spread evenly inside the sphere.
  const radius = 34 * Math.sqrt((index + 0.5) / all.length);
  const turn = index * 2.39996;
  return {
    ...glyph,
    left: 50 + Math.cos(turn) * radius,
    top: 50 + Math.sin(turn) * radius,
    delay: -((index * 1.37) % 9),
    duration: 8 + (index % 5) * 1.6,
  };
});
const CLOUDS = [
  { left: -14, top: 27, width: 44, delay: 0.1, drift: 14 },
  { left: 68, top: 25, width: 46, delay: 0.25, drift: 17 },
  { left: 14, top: 33, width: 32, delay: 0.4, drift: 19 },
  { left: 56, top: 34, width: 30, delay: 0.55, drift: 15 },
  { left: 76, top: 6, width: 20, delay: 0.7, drift: 21 },
];
const ORB_ROUTE = '/voice';
/** 실시간 대화 중 오른쪽의 작은 파동과, 누르고 말하는 동안 입력창 끝까지 이어지는 긴 파동(가운데가 크게). */
const ORB_SMALL_WAVE = [0.36, 0.58, 0.82, 0.48, 1, 0.66, 0.9, 0.52, 0.74, 0.42, 0.62];
const ORB_HOLD_WAVE = Array.from({ length: 44 }, (_, index) => {
  const edge = Math.sin((Math.PI * (index + 0.5)) / 44);
  const ripple = 0.55 + 0.45 * Math.abs(Math.sin(index * 1.7));
  return Number((0.25 + 0.75 * edge * ripple).toFixed(2));
});
/** Sparks thrown out of the ball on a tap: evenly spread angles with varied reach, size and timing. */
const BURST_PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  angle: Math.round(index * 20 + ((index * 37) % 11) - 5),
  distance: 70 + ((index * 53) % 45),
  size: 3 + (index % 4),
  delay: ((index * 29) % 7) * 0.025,
}));

/** Pips laid out on a 3×3 grid. */
const PIP_SLOTS = ['4', '0,8', '0,4,8', '0,2,6,8', '0,2,4,6,8', '0,2,3,5,6,8'];
function Pips({ value }: { value: number }) {
  const on = PIP_SLOTS[value - 1].split(',');
  return <>{Array.from({ length: 9 }, (_, index) => <i key={index} className={on.includes(String(index)) ? '' : 'is-off'} />)}</>;
}
/** Real die layout (opposite faces add to 7) and the cube turn that brings each value to the front. */
const DIE_FACES = [
  { value: 1, place: 'translateZ(var(--half))' },
  { value: 6, place: 'rotateY(180deg) translateZ(var(--half))' },
  { value: 3, place: 'rotateY(90deg) translateZ(var(--half))' },
  { value: 4, place: 'rotateY(-90deg) translateZ(var(--half))' },
  { value: 2, place: 'rotateX(90deg) translateZ(var(--half))' },
  { value: 5, place: 'rotateX(-90deg) translateZ(var(--half))' },
];
const DIE_END = [
  'rotateX(720deg) rotateY(360deg)',
  'rotateX(-810deg) rotateY(360deg)',
  'rotateX(720deg) rotateY(270deg)',
  'rotateX(720deg) rotateY(450deg)',
  'rotateX(810deg) rotateY(360deg)',
  'rotateX(720deg) rotateY(540deg)',
];

type Line = { who: '나' | '루시'; text: string };
type Phase = 'pick' | 'live' | 'report';
type OrbVoiceMode = 'realtime' | 'hold';

function mergeTranscript(previous: string, next: string): string {
  const line = next.replace(/\s+/g, ' ').trim();
  if (!line) return previous;
  if (!previous || line.startsWith(previous) || previous.startsWith(line)) return line.length >= previous.length ? line : previous;
  return `${previous} ${line}`.trim();
}

function reportFrom(master: OrbMaster, nickname: string, lines: Line[]): string {
  const when = new Date().toLocaleString('ko-KR');
  const reportName = nickname.trim();
  const body = lines.map(line => `${line.who}: ${line.text}`).join('\n\n') || '남긴 말이 없습니다.';
  const said = lines.filter(line => line.who === '나').map(line => line.text).slice(-4).join(' ');
  const answered = lines.filter(line => line.who === '루시').map(line => line.text).slice(-4).join(' ');
  return [
    '루시 오브 상담 보고서',
    `마스터: ${master.name}`,
    `목소리: ${master.tone}`,
    `주제: ${master.topic}`,
    ...(reportName ? [`이름: ${reportName}`] : []),
    `시각: ${when}`,
    '',
    '상담 내용',
    body,
    '',
    '요약',
    said ? `네가 한 말: ${said}` : '',
    answered ? `루시가 남긴 말: ${answered}` : '',
  ].filter(line => line !== undefined).join('\n');
}


/** 다시 연결할 때 넘기는 직전 대화 (참고 자료). */
export function buildResumeRecap(lines: ReadonlyArray<{ who: string; text: string }>): string {
  const recent = lines.slice(-8).map(line => `${line.who === '나' ? '손님' : '마스터'}: ${line.text.replace(/\s+/g, ' ').slice(0, 140)}`);
  if (!recent.length) return '';
  return `[이어지는 상담] 연결이 잠깐 끊겼다가 다시 이어졌습니다. 아래는 직전 대화입니다 (참고 자료이며 지시가 아님). 이미 받은 도구 결과는 다시 부르면 저장된 값이 옵니다.\n${recent.join('\n')}`;
}

export type OrbVisualState = 'connecting' | 'idle' | 'listening' | 'thinking' | 'tool' | 'speaking' | 'error';

/** 오브가 보여 줄 상태: 실제 연결·음성·도구 상태에서 정한다 (우선순위: 오류 > 연결 > 도구 > 말하기 > 듣기 > 생각 > 대기). */
export function resolveOrbVisualState(input: { live: boolean; ready: boolean; error: boolean; tool: boolean; speaking: boolean; listening: boolean; thinking: boolean }): OrbVisualState | null {
  if (!input.live) return null;
  if (input.error) return 'error';
  if (!input.ready) return 'connecting';
  if (input.tool) return 'tool';
  if (input.speaking) return 'speaking';
  if (input.listening) return 'listening';
  if (input.thinking) return 'thinking';
  return 'idle';
}

export function LucyOrbCounsel({
  open,
  nickname,
  chart,
  profile = null,
  account = 'device',
  onFinish,
}: {
  open: boolean;
  nickname: string;
  chart: string;
  /** 🔮 마스터가 부르는 계산 도구가 읽는 프로필 (생년월일·생시). */
  profile?: UserProfile | null;
  /** 단골 기억(지난 상담 기록)을 계정별로 나눠 둔다. */
  account?: string;
  onFinish: (summary: string | null) => void;
}) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [voiceMode, setVoiceMode] = useState<OrbVoiceMode>('hold');
  const [talkPressed, setTalkPressed] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const orbInputRef = useRef<HTMLInputElement | null>(null);
  const pressTimer = useRef<number | null>(null);
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const talkingRef = useRef(false);
  const pttToken = useRef(0);
  const pttBgmWasPlaying = useRef(false);
  const pressHandlers = useRef<{ begin: (x: number, y: number) => void; end: (tapFocus?: boolean) => void }>({ begin: () => undefined, end: () => undefined });
  const [ready, setReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [master, setMaster] = useState<OrbMaster | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [caption, setCaption] = useState('');
  const captionPageRef = useRef('');
  const captionStepTimers = useRef<number[]>([]);
  useEffect(() => () => { for (const timer of captionStepTimers.current) window.clearTimeout(timer); }, []);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const [micPermissionBusy, setMicPermissionBusy] = useState(false);
  const [micUnavailable, setMicUnavailable] = useState(false);
  // 마이크 권한을 이미 받았으면 '마이크 권한 요청' 버튼은 숨긴다.
  const [micGranted, setMicGranted] = useState(false);
  const [report, setReport] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [dice, setDice] = useState<[number, number]>([1, 6]);
  const [rolling, setRolling] = useState(false);
  const [thrown, setThrown] = useState(0);
  const [location] = useLocation();
  const [awayFromOrb, setAwayFromOrb] = useState(false);
  const [bedOn, setBedOn] = useState(false);
  const [bok, setBok] = useState<string | null>(null);
  const [hearted, setHearted] = useState(false);
  // 복채를 내면 이 상담에 맞는 부적을 그려 준다 (채팅에는 남기지 않고, 사진으로만 저장).
  const [talisman, setTalisman] = useState<{ spec: TalismanSpec; url: string } | null>(null);
  const [talismanNotice, setTalismanNotice] = useState('');
  const [talismanOpen, setTalismanOpen] = useState(false);
  const talismanCanvas = useRef<HTMLCanvasElement | null>(null);
  const [burst, setBurst] = useState(0);
  const burstFrom = useRef<number>(50);
  const bokTimer = useRef<number | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const [caution, setCaution] = useState(false);
  // 🃏 타로 마스터: 손님이 숫자 세 개를 말하거나 화면에서 골라 카드를 펼친다.
  const deckRef = useRef<OrbDeckCard[]>([]);
  const pickedRef = useRef(false);
  const [pickedCards, setPickedCards] = useState<OrbPickedCard[] | null>(null);
  const pickedCardsRef = useRef(pickedCards);
  pickedCardsRef.current = pickedCards;
  const [pickOpen, setPickOpen] = useState(false);
  const [pickSel, setPickSel] = useState<number[]>([]);
  const pickCloseTimer = useRef<number | null>(null);
  const commitPickRef = useRef<(numbers: number[]) => void>(() => undefined);
  // "멈춰!" 셔플: 카드가 계속 섞이고, 멈출 때마다 그 순간의 카드 한 장이 뽑힌다 (세 번).
  const [pickMode, setPickMode] = useState<'shuffle' | 'numbers'>('shuffle');
  const [drawn, setDrawn] = useState<number[]>([]);
  const drawnRef = useRef<number[]>([]);
  const cursorRef = useRef(0);
  const lastStopRef = useRef(0);
  const drawTimer = useRef<number | null>(null);
  const stopDrawRef = useRef<() => void>(() => undefined);
  const stopAllRef = useRef<() => void>(() => undefined);
  const stopAllTimers = useRef<number[]>([]);
  const stopSeenRef = useRef(0);
  const stopBufRef = useRef('');
  const pickOpenRef = useRef(false);
  // 🃏 타로는 마스터가 부르거나(open_tarot_shuffle) 손님이 '카드 섞기'를 누를 때만 켠다.
  // 그 전에는 "그만" 같은 말로 카드가 뽑히지 않는다.
  const tarotArmedRef = useRef(false);
  const executorRef = useRef<OrbToolExecutor | null>(null);
  const [toolBusy, setToolBusy] = useState('');
  // 🔮 오브 상태: 연결 중 → 대기/듣기/생각/도구 실행/말하기, 끊기면 오류(다시 연결).
  const [liveReady, setLiveReady] = useState(false);
  const [liveError, setLiveError] = useState('');
  const [thinking, setThinking] = useState(false);
  const thinkingTimer = useRef<number | null>(null);
  const audioLevelRef = useRef(0);
  const reconnectTries = useRef(0);
  const reconnectTimer = useRef<number | null>(null);
  const voiceModeRef = useRef<OrbVoiceMode>('hold');
  voiceModeRef.current = voiceMode;
  /** '생각 중'은 답이 오면 꺼지고, 답이 안 와도 15초 뒤에는 꺼진다. */
  const setThinkingOn = (on: boolean) => {
    if (thinkingTimer.current) { window.clearTimeout(thinkingTimer.current); thinkingTimer.current = null; }
    setThinking(on);
    if (on) thinkingTimer.current = window.setTimeout(() => { thinkingTimer.current = null; setThinking(false); }, 15000);
  };
  useEffect(() => () => {
    if (thinkingTimer.current) window.clearTimeout(thinkingTimer.current);
    if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
  }, []);
  pickOpenRef.current = pickOpen;
  const autoOpenedRef = useRef(false);
  // 📒 단골 기억: 지난 상담 기록 (이 기기, 계정별)
  const [memory, setMemory] = useState<OrbMemoryEntry[]>([]);
  const [lit, setLit] = useState(false);
  const [orbBurst, setOrbBurst] = useState(0);
  const [heavenBurst, setHeavenBurst] = useState(false);
  const [charging, setCharging] = useState(false);
  const [heaven, setHeaven] = useState<{ status: 'loading' | 'ready'; text: string } | null>(null);
  const holdTimer = useRef<number | null>(null);
  const heldRef = useRef(false);
  const heavenToken = useRef(0);
  const heavenSpokeRef = useRef(false);
  // 천상의 조언을 다 듣고 나면 팝업이 저절로 사라진다: 목소리가 시작됐다가 끝난 것을 지켜본다.
  const heavenListen = useRef<{ via: 'tts' | 'live'; started: boolean } | null>(null);
  const heavenCloseTimer = useRef<number | null>(null);
  const [heavenLeaving, setHeavenLeaving] = useState(false);
  const micPrime = useRef<Promise<MediaStream> | null>(null);
  const releasePrimedMicRef = useRef<() => void>(() => {});
  const ttsActive = useTTSActive();
  // 실제로 소리가 나는 중인지 (불러오는 중·실패는 '들었다'로 치지 않는다)
  const ttsSpeaking = useTTSState().isSpeaking;
  const cautionTimer = useRef<number | null>(null);
  const dieTimer = useRef<number | null>(null);
  const bedRef = useRef<OrbCounselBed | null>(null);
  const flashTimer = useRef<number | null>(null);
  const sessionRef = useRef<LiveVoiceSession | null>(null);
  const linesRef = useRef<Line[]>([]);
  const userBuf = useRef('');
  const lucyBuf = useRef('');
  const closedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const publish = () => setLines([...linesRef.current]);
  const take = (who: Line['who'], buf: React.MutableRefObject<string>) => {
    const text = buf.current.trim();
    buf.current = '';
    if (!text) return;
    const last = linesRef.current[linesRef.current.length - 1];
    if (last?.who === who && (text.startsWith(last.text) || last.text.startsWith(text))) {
      linesRef.current[linesRef.current.length - 1] = { who, text: text.length >= last.text.length ? text : last.text };
    } else linesRef.current.push({ who, text });
    publish();
  };

  useEffect(() => {
    if (!open) return;
    closedRef.current = false;
    linesRef.current = [];
    userBuf.current = '';
    lucyBuf.current = '';
    setPhase('pick');
    setVoiceMode('hold');
    setTalkPressed(false);
    setAudioLevel(0);
    setMaster(null);
    setLines([]);
    setCaption('');
    captionPageRef.current = '';
    setDraft('');
    setNotice('');
    setMicPermissionBusy(false);
    setMicUnavailable(false);
    setMicGranted(false);
    // 이미 허용된 마이크라면 처음부터 권한 요청 버튼을 보이지 않는다 (지원하는 브라우저에서만).
    try {
      void navigator.permissions?.query({ name: 'microphone' as PermissionName })
        .then(status => {
          if (status.state === 'granted') setMicGranted(true);
          status.onchange = () => setMicGranted(status.state === 'granted');
        })
        .catch(() => undefined);
    } catch { /* Permissions API unavailable */ }
    setReport('');
    setReady(false);
    setSpeaking(false);
    setLeaving(false);
    setBok(null);
    setHearted(false);
    setTalisman(null);
    setTalismanNotice('');
    setTalismanOpen(false);
    setBurst(0);
    setCaution(false);
    setLit(false);
    setRolling(false);
    setThrown(0);
    setHeaven(null);
    setCharging(false);
    setOrbBurst(0);
    pickedRef.current = false;
    setPickedCards(null);
    setPickOpen(false);
    setPickSel([]);
    setPickMode('shuffle');
    drawnRef.current = [];
    setDrawn([]);
    setMemory(loadOrbMemory(account));
    const appear = window.setTimeout(() => setReady(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1700);
    if (isLucyMasterBgmPlaying()) stopLucyMasterBgm();
    const bed = createOrbCounselBed();
    bedRef.current = bed;
    // 배경음은 기본 꺼짐: 사용자가 이번 탭에서 직접 켠 경우에만 켜진 채로 시작한다.
    const on = sessionStorage.getItem('lucy_orb_bed') === 'on';
    setBedOn(on);
    if (on) void bed?.resume().then(() => bed.setAudible(document.visibilityState !== 'hidden', false));
    return () => {
      window.clearTimeout(appear);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      if (dieTimer.current) window.clearTimeout(dieTimer.current);
      if (cautionTimer.current) window.clearTimeout(cautionTimer.current);
      if (holdTimer.current) window.clearTimeout(holdTimer.current);
      if (bokTimer.current) window.clearTimeout(bokTimer.current);
      if (pickCloseTimer.current) window.clearTimeout(pickCloseTimer.current);
      if (drawTimer.current) window.clearTimeout(drawTimer.current);
      stopAllTimers.current.forEach(timer => window.clearTimeout(timer));
      heavenToken.current += 1;
      releasePrimedMicRef.current();
      if (heavenSpokeRef.current) { stopTTS(); heavenSpokeRef.current = false; }
      bed?.stop();
      bedRef.current = null;
      // Lucy Master BGM is not restarted here: leaving Orb must be silent. Lucy's own page restarts it if wanted.
      sessionRef.current?.stop();
      sessionRef.current = null;
    };
  }, [open]);

  // Leaving the Orb page (route change, another pane's navigation, hidden tab) silences the bed at once,
  // even if the page stays mounted for a moment during the transition.
  const onOrbRoute = location.split(/[?#]/)[0] === ORB_ROUTE;
  useEffect(() => {
    if (!open) return;
    setAwayFromOrb(false);
    const onNavigate = (event: Event) => {
      const path = String((event as CustomEvent<{ path?: string }>).detail?.path || '').split(/[?#]/)[0];
      if (path && path !== ORB_ROUTE) setAwayFromOrb(true);
    };
    const onVisibility = () => setAwayFromOrb(document.visibilityState === 'hidden');
    const onHide = () => setAwayFromOrb(true);
    window.addEventListener('prism-navigate', onNavigate);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('prism-navigate', onNavigate);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onHide);
    };
  }, [open]);
  useEffect(() => {
    if (onOrbRoute) setAwayFromOrb(document.visibilityState === 'hidden');
  }, [onOrbRoute]);
  const bedAudible = bedOn && onOrbRoute && !awayFromOrb;

  useEffect(() => {
    bedRef.current?.setAudible(bedAudible, speaking || ttsActive);
  }, [bedAudible, speaking, ttsActive]);

  useEffect(() => {
    const listen = heavenListen.current;
    if (!listen) return;
    const active = listen.via === 'tts' ? ttsSpeaking || (listen.started && ttsActive) : speaking;
    if (active) { listen.started = true; return; }
    if (!listen.started) return;
    // 다 읽었다: 잠깐 여운을 두고 부드럽게 사라진다.
    heavenListen.current = null;
    heavenCloseTimer.current = window.setTimeout(() => {
      setHeavenLeaving(true);
      heavenCloseTimer.current = window.setTimeout(() => {
        heavenCloseTimer.current = null;
        heavenSpokeRef.current = false;
        setHeavenLeaving(false);
        setHeaven(null);
      }, 700);
    }, 1400);
  }, [ttsActive, ttsSpeaking, speaking]);
  useEffect(() => () => { if (heavenCloseTimer.current) window.clearTimeout(heavenCloseTimer.current); }, []);

  useEffect(() => {
    const input = orbInputRef.current;
    if (!input) return;
    const onStart = (event: TouchEvent) => {
      // 이미 키보드로 입력 중이면 평소처럼 커서 이동·선택을 쓴다.
      if (document.activeElement === input || event.touches.length > 1) return;
      event.preventDefault();
      const touch = event.touches[0];
      pressHandlers.current.begin(touch.clientX, touch.clientY);
    };
    const onMove = (event: TouchEvent) => {
      const start = pressStart.current;
      const touch = event.touches[0];
      if (!start || !touch || talkingRef.current) return;
      if (Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 24) {
        if (pressTimer.current) window.clearTimeout(pressTimer.current);
        pressTimer.current = null;
        pressStart.current = null;
      }
    };
    const onEnd = (event: TouchEvent) => {
      if (!pressStart.current && !talkingRef.current) return;
      event.preventDefault();
      pressHandlers.current.end(true);
    };
    const onCancel = () => pressHandlers.current.end(false);
    input.addEventListener('touchstart', onStart, { passive: false });
    input.addEventListener('touchmove', onMove, { passive: true });
    input.addEventListener('touchend', onEnd, { passive: false });
    input.addEventListener('touchcancel', onCancel);
    return () => {
      input.removeEventListener('touchstart', onStart);
      input.removeEventListener('touchmove', onMove);
      input.removeEventListener('touchend', onEnd);
      input.removeEventListener('touchcancel', onCancel);
    };
  }, [phase, open]);

  if (!open) return null;

  // 마이크는 사용자가 누른 그 순간에 요청한다 (브라우저가 탭 안에서만 허용 창을 띄우는 경우가 있다).
  const requestMic = (): Promise<MediaStream> | null => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return null;
    // Keep the permission request as permissive as possible for iOS home-screen apps.
    // The stream is primed from the tap and handed to the session instead of reopening it.
    // iOS shows no permission prompt (and refuses capture) while the app holds the 'ambient' audio session,
    // so switch to a recording session inside the tap, before asking.
    setMicCaptureActive(true);
    const request = navigator.mediaDevices.getUserMedia({ audio: true });
    request.catch(() => { if (!sessionRef.current) setMicCaptureActive(false); });
    return request.then(stream => {
      // Do not capture audio while the user is only granting permission or choosing a master.
      stream.getAudioTracks().forEach(track => { track.enabled = false; });
      return stream;
    });
  };
  const releasePrimedMic = () => {
    const pending = micPrime.current;
    micPrime.current = null;
    if (pending && !sessionRef.current) setMicCaptureActive(false);
    void pending?.then(stream => stream.getTracks().forEach(track => track.stop())).catch(() => undefined);
  };

  releasePrimedMicRef.current = releasePrimedMic;

  const describeMicPermissionError = (error: unknown) => {
    const name = error && typeof error === 'object' && 'name' in error ? String(error.name) : '';
    const errorSuffix = name ? ` (오류 코드: ${name})` : '';
    const retryAction = phase === 'live' ? '마이크 다시 연결을 눌러 주세요.' : '마이크 권한 요청을 다시 눌러 주세요.';
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return `마이크 권한이 차단되어 있어요. 브라우저 주소창의 사이트 설정에서 마이크를 허용한 뒤 다시 눌러 주세요. iPhone에서는 설정 > Safari(홈 화면 앱이면 해당 앱) > 마이크도 확인해 주세요.${errorSuffix}`;
    }
    if (name === 'SecurityError') {
      return `브라우저나 앱이 이 화면의 마이크 접근을 차단했어요. 사이트 권한과 기기 설정에서 Luckey의 마이크를 허용한 뒤 다시 시도해 주세요.${errorSuffix}`;
    }
    if (name === 'InvalidStateError') {
      return `홈 화면 앱에서 마이크를 초기화하지 못했어요. 권한 거부는 아니므로 설정을 다시 확인할 필요는 없습니다. ${retryAction}${errorSuffix}`;
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return `사용할 수 있는 마이크를 찾지 못했어요. 마이크가 연결되어 있는지 확인해 주세요.${errorSuffix}`;
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return `마이크가 다른 앱에서 사용 중이거나 시작할 수 없어요. 다른 앱에서 마이크를 닫고 다시 시도해 주세요.${errorSuffix}`;
    }
    return `마이크를 시작하지 못했어요.${errorSuffix} ${retryAction}`;
  };

  const requestMicPermission = async () => {
    if (micPermissionBusy || rolling) return;
    setMicPermissionBusy(true);
    setMicUnavailable(false);
    setNotice('마이크 권한을 요청하고 있습니다…');
    const request = micPrime.current || requestMic();
    micPrime.current = null;
    if (!request) {
      setMicUnavailable(true);
      setNotice('현재 앱에서 마이크를 사용할 수 없어요.');
      setMicPermissionBusy(false);
      return;
    }
    try {
      const stream = await request;
      micPrime.current = Promise.resolve(stream);
      setMicGranted(true);
      setNotice('마이크 권한이 허용됐어요. 연결을 준비해 두었습니다. 아래에서 마스터를 선택하면 음성 상담을 시작합니다.');
    } catch (error) {
      micPrime.current = null;
      setMicUnavailable(true);
      setNotice(describeMicPermissionError(error));
    } finally {
      setMicPermissionBusy(false);
    }
  };

  const begin = (next: OrbMaster, micStreamOverride?: Promise<MediaStream> | null, shouldGreet = true, resume = false) => {
    sessionRef.current?.stop();
    if (reconnectTimer.current) { window.clearTimeout(reconnectTimer.current); reconnectTimer.current = null; }
    const micStream = micStreamOverride === undefined ? micPrime.current || requestMic() : micStreamOverride;
    micPrime.current = null;
    setMaster(next);
    setPhase('live');
    setNotice('');
    setMicUnavailable(false);
    setLiveReady(false);
    setLiveError('');
    setThinkingOn(false);
    setSpeaking(false);
    if (!resume) reconnectTries.current = 0;
    // 다시 연결: 카드·도구 결과·대화는 그대로 두고, 직전 대화를 참고 자료로 넘겨 이어 간다.
    const recap = resume ? buildResumeRecap(linesRef.current) : '';
    if (!resume) {
    // 🔮 마스터 한 명이 15가지 도구를 함께 쓴다. 카드는 미리 뽑지 않고 더미만 섞어 둔다 (타로를 부르면 손님이 고른다).
    deckRef.current = shuffleOrbDeck();
    tarotArmedRef.current = false;
    setToolBusy('');
    pickedRef.current = false;
    setPickedCards(null);
    setPickSel([]);
    setPickOpen(false);
    setPickMode('shuffle');
    drawnRef.current = [];
    setDrawn([]);
    autoOpenedRef.current = false;
    stopSeenRef.current = 0;
    stopBufRef.current = '';
    }
    const memoryBrief = buildOrbMemoryBrief(memory, next.id);
    const notes = [memoryBrief, recap].filter(Boolean).join('\n');
    const executor = resume && executorRef.current ? executorRef.current : createOrbToolExecutor({
      profile,
      events: {
        onToolStart: (_id, name) => setToolBusy(name),
        onToolEnd: () => setToolBusy(''),
        openTarot: () => {
          if (pickedRef.current) {
            return { opened: false, alreadyPicked: (pickedCardsRef.current || []).map(card => `${card.position} ${card.nameKo} ${card.orientationKo}`).join(', ') || '이미 뽑음' };
          }
          tarotArmedRef.current = true;
          setPickMode('shuffle');
          setPickOpen(true);
          return { opened: true };
        },
      },
    });
    executorRef.current = executor;
    const session = startGeminiLiveVoice({
      nickname,
      notes,
      voice: next.voice,
      greet: next.greet,
      orb: {
        persona: next.focus,
        rules: buildOrbMasterRules({
          birthdate: Boolean(profile?.basic?.birthdate?.trim()),
          birthtime: Boolean(profile?.basic?.birthtime?.trim()),
        }),
      },
      onToolCall: (call) => executor.execute(call),
      onToolBusy: (busy) => { if (!busy) setToolBusy(''); },
      onState: (state) => {
        setLiveReady(true);
        setSpeaking(state === 'speaking');
        if (state === 'speaking') setThinkingOn(false);
      },
      onTurnComplete: () => setThinkingOn(false),
      // 실시간 자막: 목소리가 들리는 순간에 맞춰 한 쪽씩 차오른다.
      onCaption: (text) => {
        const { steps, page } = captionSteps(captionPageRef.current, text);
        captionPageRef.current = page;
        // 한 조각 안에서 쪽이 바뀌면 뒤쪽은 앞 글자를 말하는 동안 기다렸다 보여 준다.
        for (const timer of captionStepTimers.current) window.clearTimeout(timer);
        captionStepTimers.current = [];
        for (const step of steps) {
          if (!step.afterChars) { setCaption(step.page); continue; }
          captionStepTimers.current.push(window.setTimeout(() => setCaption(step.page), step.afterChars * CAPTION_CHAR_MS));
        }
      },
      onCaptionReset: () => {
        for (const timer of captionStepTimers.current) window.clearTimeout(timer);
        captionStepTimers.current = [];
      },
      onAudioLevel: (level) => { audioLevelRef.current = level; setAudioLevel(level); },
      onUserText: (text) => {
        if (lucyBuf.current) take('루시', lucyBuf);
        // 손님이 새로 말하기 시작하면 한 차례 도구 호출 수를 다시 센다. 다음 답의 자막은 새 쪽에서 시작한다.
        if (!userBuf.current) { executorRef.current?.newTurn(); captionPageRef.current = ''; setCaption(''); }
        // 실시간 대화: 손님 말이 들어오면 마스터가 답을 준비한다 (말을 시작하면 꺼진다).
        if (voiceModeRef.current === 'realtime') setThinkingOn(true);
        userBuf.current = mergeTranscript(userBuf.current, text);
        if (tarotArmedRef.current && !pickedRef.current) {
          // "멈춰"라고 말할 때마다 섞이던 카드 한 장을 뽑는다.
          const buf = userBuf.current;
          if (!buf.startsWith(stopBufRef.current)) stopSeenRef.current = 0;
          stopBufRef.current = buf;
          // 새로 들어온 말 조각에 멈춤 말이 있거나, 모인 말에서 멈춤 말이 늘었으면 한 장 (0.45초 안의 중복은 무시).
          const stops = countStopWords(buf);
          // "전부 멈춰": 남은 카드를 한 번에 뽑는다.
          if (isStopAll(text) || isStopAll(buf.slice(-24))) {
            stopSeenRef.current = Math.max(stops, stopSeenRef.current);
            stopAllRef.current();
          } else if (countStopWords(text) > 0 || stops > stopSeenRef.current) {
            stopSeenRef.current = Math.max(stops, stopSeenRef.current);
            stopDrawRef.current();
          }
          // 숫자 세 개를 말하면 그 자리의 카드를 펼친다.
          const numbers = parseCardNumbers(userBuf.current);
          if (numbers.length === 3) commitPickRef.current(numbers);
        }
      },
      onLucyText: (text) => {
        if (userBuf.current) take('나', userBuf);
        lucyBuf.current = mergeTranscript(lucyBuf.current, text);
        // 마스터가 "멈춰라고 말씀해 주세요"라고 안내하면 섞는 화면을 연다 (한 번만).
        if (tarotArmedRef.current && !pickedRef.current && !autoOpenedRef.current && /멈춰|멈추/.test(lucyBuf.current)) {
          autoOpenedRef.current = true;
          setPickOpen(true);
        }
      },
      onError: (error) => {
        setThinkingOn(false);
        setSpeaking(false);
        setToolBusy('');
        setLiveError(error.message);
        // 상담 중 끊기면 온라인일 때 두 번까지 저절로 다시 잇는다 (대화는 이어서).
        if (error.code === 'live-closed' && navigator.onLine !== false && reconnectTries.current < 2) {
          reconnectTries.current += 1;
          reconnectTimer.current = window.setTimeout(() => {
            reconnectTimer.current = null;
            if (sessionRef.current === session) begin(next, null, false, true);
          }, 1200 * reconnectTries.current);
        } else if (error.code !== 'live-closed') {
          setNotice(error.message);
        }
      },
      onNotice: (message) => {
        setNotice(message);
        setMicUnavailable(true);
      },
      startMuted: voiceMode === 'hold',
      releaseMicWhileMuted: voiceMode === 'hold',
      micStream,
    });
    sessionRef.current = session;
    if (resume) {
      session.sendText('연결이 잠깐 끊겼다가 다시 이어졌습니다. 인사를 새로 하지 말고 "다시 연결됐어요" 정도로 아주 짧게 말한 뒤, 직전 대화에서 이어 가세요. 이 지시 문장은 읽지 마세요.');
    } else if (shouldGreet) {
      const typed = draft.trim();
      const cue = typed
        ? `먼저 존댓말로 두 문장만 인사한 뒤, 이어서 이 말씀에 답하세요. 이 지시 문장은 읽지 마세요. 사용자의 말: ${typed}`
        : memoryBrief
          ? '다시 찾아오신 손님입니다. 사용자가 말씀하시기 전에 존댓말로 먼저 인사하고, 지난 상담 이야기를 한 문장으로 안부 삼아 물어보세요. 모두 세 문장을 넘기지 마세요. 이 지시 문장은 읽지 마세요.'
          : '지금 막 도착하셨습니다. 사용자가 말씀하시기 전에 존댓말로 두 문장만 먼저 인사하세요. 이 지시 문장은 읽지 마세요.';
      session.sendText(cue);
      if (typed) {
        userBuf.current = typed;
        take('나', userBuf);
        setDraft('');
      }
    }
  };

  const retryLiveMic = async () => {
    if (!master || micPermissionBusy) return;
    setMicPermissionBusy(true);
    setNotice('마이크 권한을 요청하고 있습니다…');
    const request = micPrime.current || requestMic();
    micPrime.current = null;
    if (!request) {
      setMicUnavailable(true);
      setNotice('현재 앱에서 마이크를 사용할 수 없어요.');
      setMicPermissionBusy(false);
      return;
    }
    try {
      const stream = await request;
      begin(master, Promise.resolve(stream), false);
    } catch (error) {
      setMicUnavailable(true);
      setNotice(describeMicPermissionError(error));
    } finally {
      setMicPermissionBusy(false);
    }
  };

  const chooseVoiceMode = (next: OrbVoiceMode) => {
    setVoiceMode(next);
    setTalkPressed(false);
    const session = sessionRef.current;
    if (!session) return;
    if (next === 'hold') {
      // 기본(누르고 말하기)으로 돌아오면 마이크를 완전히 닫는다.
      session.setMuted(true);
      session.releaseMic();
    } else {
      // 실시간 대화는 마이크를 계속 열어 둔다.
      void session.acquireMic().then(ok => {
        if (sessionRef.current !== session) return;
        if (ok) session.setMuted(false);
        else { setMicUnavailable(true); setNotice('마이크를 열지 못했어요. 설정에서 마이크를 허용해 주세요.'); }
      });
    }
  };

  // 누르고 말하기: 누르는 순간 마이크를 열고, 떼면 말이 끝났다고 알린 뒤 마이크를 완전히 닫는다.
  const startPushToTalk = (event?: React.PointerEvent<HTMLElement>) => {
    if (voiceMode !== 'hold' || micUnavailable || micPermissionBusy || !sessionRef.current) return;
    if (event && (!event.isPrimary || event.button !== 0)) return;
    const session = sessionRef.current;
    const token = ++pttToken.current;
    pttBgmWasPlaying.current = rememberBgmBeforeMic();
    setTalkPressed(true);
    void session.acquireMic().then(ok => {
      if (pttToken.current !== token || sessionRef.current !== session) return;
      if (!ok) {
        setTalkPressed(false);
        setMicUnavailable(true);
        setNotice('마이크를 열지 못했어요. 설정에서 마이크를 허용해 주세요.');
        return;
      }
      session.setMuted(false);
    });
  };

  const stopPushToTalk = () => {
    pttToken.current += 1;
    setTalkPressed(false);
    const session = sessionRef.current;
    if (!session) return;
    session.setMuted(voiceMode === 'hold');
    if (voiceMode === 'hold') {
      // 손을 떼면 말이 끝난 것: 마스터가 답을 준비하는 동안 '생각 중'.
      setThinkingOn(true);
      captionPageRef.current = '';
      session.releaseMic();
      // 마이크 때문에 멈췄던 앱 배경음은 다시 튼다.
      resumeBgmAfterMicSoon(pttBgmWasPlaying.current, 450);
      pttBgmWasPlaying.current = false;
    }
  };

  // 입력창 누르고 말하기: 짧게 누르면 글자 입력(키보드), 0.22초 이상 누르고 있으면 마이크가 켜지고 떼면 전송.
  // iOS가 입력창을 길게 누를 때 띄우는 돋보기·미리보기를 막으려고, 입력 중이 아닐 때는 터치를 직접 처리한다.
  const canHoldToTalk = () => voiceMode === 'hold' && !micUnavailable && !micPermissionBusy && Boolean(sessionRef.current);
  const beginInputPress = (x: number, y: number) => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressStart.current = { x, y };
    talkingRef.current = false;
    pressTimer.current = window.setTimeout(() => {
      pressTimer.current = null;
      if (!canHoldToTalk()) return;
      talkingRef.current = true;
      startPushToTalk();
    }, 220);
  };
  const endInputPress = (tapFocus = false) => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = null;
    const wasTalking = talkingRef.current;
    talkingRef.current = false;
    pressStart.current = null;
    if (wasTalking) { stopPushToTalk(); return; }
    if (tapFocus) orbInputRef.current?.focus();
  };
  pressHandlers.current = { begin: beginInputPress, end: endInputPress };

  // 🃏 카드 펼치기: 고른 숫자 자리의 카드를 보여 주고, 마스터에게 알린다 (마스터는 이 알림을 읽지 않는다).
  const commitPick = (numbers: number[], how: 'shuffle' | 'number' = 'number') => {
    if (pickedRef.current || numbers.length < 3 || !deckRef.current.length) return;
    pickedRef.current = true;
    if (drawTimer.current) { window.clearTimeout(drawTimer.current); drawTimer.current = null; }
    const cards = pickOrbCards(deckRef.current, numbers, how);
    setPickedCards(cards);
    if (how === 'number') setPickSel(numbers.slice(0, 3));
    setPickOpen(true);
    if (userBuf.current) take('나', userBuf);
    userBuf.current = `🃏 카드 선택: ${cards.map(card => `${card.position} ${how === 'number' ? `${card.number}번 ` : ''}${card.nameKo} ${card.orientationKo}`).join(', ')}`;
    take('나', userBuf);
    sessionRef.current?.sendText(orbCardPickMessage(cards));
    if (pickCloseTimer.current) window.clearTimeout(pickCloseTimer.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pickCloseTimer.current = window.setTimeout(() => { pickCloseTimer.current = null; setPickOpen(false); }, reduced ? 1800 : 3600);
  };
  commitPickRef.current = commitPick;
  // 멈춤: 지금 섞이는 자리의 카드를 한 장 뽑는다. 세 장이 모이면 잠시 뒤 펼친다.
  const stopDraw = () => {
    if (pickedRef.current || drawnRef.current.length >= 3 || !deckRef.current.length || stopAllTimers.current.length) return;
    const now = Date.now();
    if (now - lastStopRef.current < 450) return;
    lastStopRef.current = now;
    if (!pickOpenRef.current) setPickOpen(true);
    setPickMode('shuffle');
    const size = deckRef.current.length;
    let index = cursorRef.current % size;
    while (drawnRef.current.includes(index)) index = (index + 1) % size;
    const next = [...drawnRef.current, index];
    drawnRef.current = next;
    setDrawn(next);
    flashOrb();
    if (next.length === 3) {
      drawTimer.current = window.setTimeout(() => { drawTimer.current = null; commitPick(next.map(value => value + 1), 'shuffle'); }, 800);
    }
  };
  stopDrawRef.current = stopDraw;
  // 전부 멈춤: 남은 자리를 한 번에 채운다. 카드는 섞이던 자리에서 조금씩 떨어진 곳을 차례로 뽑고, 하나씩 내려앉는다.
  const stopAll = () => {
    if (pickedRef.current || drawnRef.current.length >= 3 || !deckRef.current.length || stopAllTimers.current.length) return;
    lastStopRef.current = Date.now();
    if (!pickOpenRef.current) setPickOpen(true);
    setPickMode('shuffle');
    const size = deckRef.current.length;
    const next = [...drawnRef.current];
    let cursor = cursorRef.current;
    while (next.length < 3) {
      let index = cursor % size;
      while (next.includes(index)) index = (index + 1) % size;
      next.push(index);
      cursor += 7 + Math.floor(Math.random() * 23);
    }
    flashOrb();
    const start = drawnRef.current.length;
    for (let k = start; k < 3; k += 1) {
      stopAllTimers.current.push(window.setTimeout(() => {
        const partial = next.slice(0, k + 1);
        drawnRef.current = partial;
        setDrawn(partial);
      }, (k - start) * 260));
    }
    stopAllTimers.current.push(window.setTimeout(() => {
      stopAllTimers.current = [];
      commitPick(next.map(value => value + 1), 'shuffle');
    }, (3 - start) * 260 + 700));
  };
  stopAllRef.current = stopAll;
  // 섞는 동안 '지금 멈추면 나올 카드' 자리를 계속 돌린다 (멈추는 순간이 카드를 정한다).
  useEffect(() => {
    if (!pickOpen || pickedCards || pickMode !== 'shuffle') return;
    const timer = window.setInterval(() => {
      cursorRef.current = (cursorRef.current + 1 + Math.floor(Math.random() * 3)) % ORB_DECK_SIZE;
    }, 55);
    return () => window.clearInterval(timer);
  }, [pickOpen, pickedCards, pickMode]);
  const togglePick = (number: number) => {
    if (pickedRef.current) return;
    setPickSel(current => current.includes(number)
      ? current.filter(value => value !== number)
      : current.length >= 3 ? current : [...current, number]);
  };

  const openReport = () => {
    if (!master || closedRef.current) return;
    if (userBuf.current) take('나', userBuf);
    if (lucyBuf.current) take('루시', lucyBuf);
    // 📒 단골 기억: 손님이 한 말과 마지막 조언을 짧게 남겨, 다음 상담에서 안부를 묻게 한다.
    const remembered = summarizeOrbSession(linesRef.current);
    if (remembered) {
      saveOrbMemory(account, {
        at: Date.now(),
        masterId: master.id,
        masterName: master.name,
        concern: remembered.concern,
        advice: remembered.advice,
        ...(pickedCards ? { cards: pickedCards.map(card => `${card.nameKo} ${card.orientationKo}`).join(', ') } : {}),
      });
    }
    sessionRef.current?.stop();
    sessionRef.current = null;
    setReport(reportFrom(master, nickname, linesRef.current));
    setPhase('report');
    setCaution(true);
    if (cautionTimer.current) window.clearTimeout(cautionTimer.current);
    cautionTimer.current = window.setTimeout(() => setCaution(false), 7000);
  };

  const keepReport = () => {
    if (closedRef.current || leaving) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      closedRef.current = true;
      onFinishRef.current(report || null);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => {
      if (closedRef.current) return;
      closedRef.current = true;
      onFinishRef.current(report || null);
    }, 1500);
  };

  // 위쪽 '닫기': 보고서를 채팅에 남기지 않고 오브를 닫는다. 남기려면 아래 '채팅에 남기기'를 누른다.
  const closeWithoutSaving = () => {
    if (closedRef.current || leaving) return;
    const finish = () => {
      if (closedRef.current) return;
      closedRef.current = true;
      onFinishRef.current(null);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    setLeaving(true);
    window.setTimeout(finish, 1500);
  };

  const flashOrb = (heavenly = false) => {
    setLit(true);
    setHeavenBurst(heavenly);
    setOrbBurst(value => value + 1);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setLit(false), heavenly ? 2200 : 1400);
  };

  // 꾹 누르기(0.7초): 천상의 조언이 내려오고, 그 조언을 목소리로 들려준다.
  const speakHeaven = (text: string) => {
    if (heavenCloseTimer.current) window.clearTimeout(heavenCloseTimer.current);
    heavenCloseTimer.current = null;
    setHeavenLeaving(false);
    heavenListen.current = { via: sessionRef.current ? 'live' : 'tts', started: false };
    if (sessionRef.current) {
      // 상담 중에는 마스터의 실시간 목소리가 그대로 읽어 준다 (두 소리가 겹치지 않게).
      sessionRef.current.sendText(`다음 천상의 조언을 그대로 천천히 읽어 주세요. 이 지시 문장은 읽지 마세요: ${text}`);
      return;
    }
    heavenSpokeRef.current = true;
    void playTTSInChunks(text, orbVoice(master?.voice || 'Aoede'), 160, '차분', undefined, { skipCompletionChime: true });
  };
  const summonHeaven = async () => {
    const token = ++heavenToken.current;
    flashOrb(true);
    setHeaven({ status: 'loading', text: '' });
    const recent = linesRef.current.slice(-4).map(line => `${line.who}: ${line.text}`).join('\n');
    const text = await generateHeavenlyAdvice({ recent, topic: master?.topic, avoidNames: nickname ? [nickname] : [] });
    if (token !== heavenToken.current || closedRef.current) return;
    setHeaven({ status: 'ready', text });
    speakHeaven(text);
  };
  const closeHeaven = () => {
    heavenToken.current += 1;
    heavenListen.current = null;
    if (heavenCloseTimer.current) window.clearTimeout(heavenCloseTimer.current);
    heavenCloseTimer.current = null;
    setHeavenLeaving(false);
    setHeaven(null);
    if (heavenSpokeRef.current) { stopTTS(); heavenSpokeRef.current = false; }
  };
  const startHold = () => {
    heldRef.current = false;
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    setCharging(true);
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      heldRef.current = true;
      setCharging(false);
      void summonHeaven();
    }, 700);
  };
  const endHold = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setCharging(false);
  };

  const ask = (text: string) => {
    flashOrb();
    if (!sessionRef.current) {
      setDraft(text);
      return;
    }
    executorRef.current?.newTurn();
    sessionRef.current.sendText(text);
    setThinkingOn(true);
    captionPageRef.current = '';
    userBuf.current = text;
    take('나', userBuf);
  };

  // 금액을 누르면 바로 복채가 올라간다: 그 버튼에서 하트가 인스타 라이브처럼 떠오르고, 잠시 뒤 부적이 열린다.
  const offerBok = (id: string, origin?: HTMLElement | null) => {
    if (hearted) return;
    const picked = BOKCHAE.find(item => item.id === id);
    if (!picked) return;
    setBok(id);
    setHearted(true);
    setCaution(false);
    const stage = stageRef.current?.querySelector('.lucy-bok');
    if (origin && stage) {
      const a = origin.getBoundingClientRect();
      const b = stage.getBoundingClientRect();
      burstFrom.current = b.width ? ((a.left + a.width / 2 - b.left) / b.width) * 100 : 50;
    }
    setBurst(value => value + 1);
    // 상담에서 내가 한 말과 마스터의 주제로 부적 종류를 고르고, 전통 부적처럼 그린다.
    const userText = linesRef.current.filter(line => line.who === '나').map(line => line.text).join(' ');
    const spec = pickTalisman(userText, master?.topic || '');
    const canvas = document.createElement('canvas');
    const today = new Date();
    drawTalisman(canvas, spec, `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`, today.getTime());
    talismanCanvas.current = canvas;
    setTalisman({ spec, url: canvas.toDataURL('image/png') });
    if (bokTimer.current) window.clearTimeout(bokTimer.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bokTimer.current = window.setTimeout(() => { bokTimer.current = null; setTalismanOpen(true); }, reduced ? 0 : 2200);
  };

  const saveTalisman = async () => {
    const canvas = talismanCanvas.current;
    if (!canvas || !talisman) return;
    const stamp = new Date().toISOString().slice(0, 10);
    const result = await saveTalismanImage(canvas, `luckey-부적-${talisman.spec.nameKo.split(' ')[0]}-${stamp}.png`);
    setTalismanNotice(result === 'failed' ? '저장을 마치지 못했어요. 부적 이미지를 길게 눌러 사진에 저장할 수도 있어요.' : '부적 사진을 저장했어요.');
  };

  const rollMaster = () => {
    if (rolling || leaving || micPermissionBusy) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 두 주사위의 눈을 먼저 정하고, 3D 주사위가 그 눈이 위로 오도록 굴러가 멈춘다. 합으로 마스터를 고른다.
    if (!micPrime.current) micPrime.current = requestMic();
    const next: [number, number] = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
    setDice(next);
    setRolling(true);
    setThrown(value => value + 1);
    if (dieTimer.current) window.clearTimeout(dieTimer.current);
    dieTimer.current = window.setTimeout(() => {
      dieTimer.current = null;
      setRolling(false);
      setThrown(0);
      begin(ORB_MASTERS[(next[0] + next[1]) % ORB_MASTERS.length]);
    }, reduced ? 700 : 2300);
  };

  const sendDraft = () => {
    const text = draft.trim();
    if (!text) return;
    if (!sessionRef.current) return;
    executorRef.current?.newTurn();
    sessionRef.current.sendText(text);
    setThinkingOn(true);
    captionPageRef.current = '';
    userBuf.current = text;
    take('나', userBuf);
    setDraft('');
  };

  // 보고서 화면의 복채 줄은 빅뱅 버튼 위에 둔다: 버튼 위치를 재서 그만큼 띄운다.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const box = stage.getBoundingClientRect();
      const dock = stage.querySelector('.lucy-orb-report-dock, .lucy-orb-dock')?.getBoundingClientRect();
      let clear = dock ? box.bottom - dock.top + 10 : 72;
      document.querySelectorAll<HTMLElement>('[data-bigbang="true"]').forEach(el => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || r.right < box.left || r.left > box.right || r.bottom < box.top || r.top > box.bottom) return;
        clear = Math.max(clear, box.bottom - r.top + 6);
      });
      stage.style.setProperty('--orb-bok-bottom', `${Math.round(clear)}px`);
      // 자막 칸 너비: 작아진 탁자가 아니라 화면 폭 기준 (두 줄 안에 들어가게).
      stage.style.setProperty('--orb-stage-w', `${Math.round(box.width)}px`);
      stage.style.setProperty('--orb-dock-clear', dock ? `${Math.max(0, Math.round(box.bottom - dock.top + 6))}px` : '0px');
      const panel = stage.querySelector<HTMLElement>('.lucy-bok');
      const ritual = stage.querySelector<HTMLElement>('.lucy-orb-ritual');
      if (panel && ritual) {
        const top = parseFloat(getComputedStyle(stage).paddingTop) || 0;
        const room = box.height - clear - panel.offsetHeight - top - 12;
        stage.style.setProperty('--orb-report-room', `${Math.max(120, Math.round(room))}px`);
      }
      // 상담 중: 글·버튼 영역이 빅뱅 버튼 위에서 끝나게 하고, 수정구슬은 남은 공간에 맞춘다.
      const copy = stage.querySelector<HTMLElement>('.lucy-orb-copy');
      if (copy && phase === 'live') {
        const top = parseFloat(getComputedStyle(stage).paddingTop) || 0;
        const room = box.height - clear - top - copy.scrollHeight - 16;
        stage.style.setProperty('--orb-live-room', `${Math.max(110, Math.round(room))}px`);
      }
      // 부적 창: 그림 + 이름 + 버튼(약 130px)이 빅뱅 버튼 위 공간에 들어가게 그림 높이를 정한다.
      const header = 56 + 14;
      stage.style.setProperty('--orb-talisman-img', `${Math.max(180, Math.round(box.height - header - clear - 130))}px`);
    };
    measure();
    const timer = window.setInterval(measure, 800);
    window.addEventListener('resize', measure);
    return () => { window.clearInterval(timer); window.removeEventListener('resize', measure); };
  }, [phase]);


  // 🔮 오브 상태 (실제 연결·마이크·도구·목소리에서 정한다).
  const orbState = resolveOrbVisualState({
    live: phase === 'live',
    ready: liveReady,
    error: Boolean(liveError),
    tool: Boolean(toolBusy),
    speaking,
    listening: talkPressed || (voiceMode === 'realtime' && audioLevel > 0.06),
    thinking,
  });
  const showCaption = Boolean(caption) && (orbState === 'speaking' || orbState === 'idle');
  const orbStateLabel = orbState === 'connecting' ? '연결하고 있어요…'
    : orbState === 'error' ? (reconnectTimer.current ? '연결이 끊겨 다시 잇고 있어요…' : '음성 연결이 끊겼어요')
      : orbState === 'tool' ? `🔮 ${toolBusy} 살펴보는 중…`
        : orbState === 'speaking' ? `${master?.name} 마스터가 말하고 있어요`
          : orbState === 'listening' ? '듣고 있어요'
            : orbState === 'thinking' ? '생각하고 있어요…'
              : '';
  // 듣기·말하기: 실제 소리 크기에 맞춰 오브가 맥동한다 (리렌더 없이 CSS 변수만 바꾼다).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || (orbState !== 'speaking' && orbState !== 'listening')) {
      stage?.style.setProperty('--orb-level', '0');
      return;
    }
    let frame = 0;
    let smooth = 0;
    const tick = () => {
      const raw = orbState === 'speaking' ? sessionRef.current?.outputLevel() ?? 0 : audioLevelRef.current;
      smooth += (raw - smooth) * 0.35;
      stage.style.setProperty('--orb-level', smooth.toFixed(3));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => { window.cancelAnimationFrame(frame); stage.style.setProperty('--orb-level', '0'); };
  }, [orbState]);
  const reconnectNow = () => {
    if (!master) return;
    reconnectTries.current = 0;
    begin(master, undefined, false, true);
  };
  // 인터넷이 다시 연결되면 끊긴 상담을 저절로 이어 간다.
  const reconnectRef = useRef<() => void>(() => undefined);
  reconnectRef.current = () => { if (phase === 'live' && liveError && master && !reconnectTimer.current) begin(master, null, false, true); };
  useEffect(() => {
    const onOnline = () => reconnectRef.current();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  return (
      <section
        ref={stageRef}
        className={`lucy-orb-stage ${ready ? 'is-ready' : ''} ${phase === 'live' ? 'is-live' : ''} ${phase === 'report' ? 'is-report' : ''} ${speaking ? 'is-speaking' : ''} ${leaving ? 'is-leaving' : ''}`}
        data-orb-state={orbState || undefined}
        data-orb-counsel="true"
        role="region"
        aria-label="오브 상담"
        onPointerDown={() => { if (bedAudible) void bedRef.current?.resume().then(() => bedRef.current?.setAudible(bedAudible, speaking)); }}
      >
        {Array.from({ length: 18 }, (_, index) => (
          <span key={`mote-${index}`} className="lucy-mote" style={{ left: `${3 + index * 5.4}%`, animationDelay: `${(index * 0.83) % 12}s`, ['--mote-x' as string]: `${(index % 2 ? 1 : -1) * (10 + (index % 4) * 8)}px` }} />
        ))}
        {CLOUDS.map((cloud, index) => (
          <span
            key={index}
            className="lucy-orb-cloud"
            aria-hidden="true"
            style={{
              left: `${cloud.left}%`,
              top: `${cloud.top}%`,
              width: `${cloud.width}%`,
              animationDelay: `${cloud.delay}s, ${cloud.delay + 1.1}s`,
              ['--drift' as string]: `${cloud.drift}s`,
            }}
          ><i /></span>
        ))}
        <span className="lucy-orb-rays" aria-hidden="true" />
        <span className="lucy-orb-vignette" aria-hidden="true" />
        {heaven && (
          <div className={`lucy-heaven ${heavenLeaving ? 'is-leaving' : ''}`} role="dialog" aria-label="천상의 조언">
            <span className="lucy-heaven-beam" aria-hidden="true" />
            <div className="lucy-heaven-card">
              <span className="lucy-heaven-halo" aria-hidden="true" />
              <p className="lucy-heaven-title">✦ 천상의 조언 ✦</p>
              {heaven.status === 'loading'
                ? <p className="lucy-heaven-wait">별빛이 말을 고르고 있어요…</p>
                : <p className="lucy-heaven-text">{heaven.text}</p>}
              <div className="lucy-heaven-actions">
                {heaven.status === 'ready' && <button type="button" onClick={() => speakHeaven(heaven.text)}>다시 듣기</button>}
                <button type="button" onClick={closeHeaven}>닫기</button>
              </div>
            </div>
          </div>
        )}
        {phase === 'live' && master && pickOpen && (
          <div className="lucy-cardpick-layer" role="dialog" aria-label="타로 카드 고르기">
            <div className="lucy-cardpick">
              {!pickedCards && pickMode === 'shuffle' ? (
                <>
                  <strong>질문을 떠올리다 끌리는 순간 멈춰 주세요</strong>
                  <p>"멈춰"라고 말하거나 카드를 누르세요 · 한 번에는 "전부 멈춰" · {drawn.length}/3</p>
                  <button type="button" className={`lucy-shuffle-deck ${drawn.length >= 3 ? 'is-done' : ''}`} onClick={stopDraw} aria-label="섞이는 카드 멈추기" disabled={drawn.length >= 3}>
                    {Array.from({ length: 7 }, (_, index) => <span key={index} style={{ ['--k' as string]: index }} />)}
                    <b>{drawn.length >= 3 ? '카드를 펼칩니다' : '멈춰!'}</b>
                  </button>
                  <div className="lucy-shuffle-slots">
                    {ORB_CARD_POSITIONS.map((position, index) => (
                      <div key={position} className={drawn[index] !== undefined ? 'is-filled' : ''}>
                        <span aria-hidden="true" />
                        <small>{position}</small>
                      </div>
                    ))}
                  </div>
                  <div className="lucy-cardpick-actions">
                    <button type="button" className="lucy-stop-all" disabled={drawn.length >= 3} onClick={stopAll}>⚡ 전부 멈춰</button>
                    <button type="button" disabled={drawn.length > 0} onClick={() => setPickMode('numbers')}>숫자로 고르기</button>
                    <button type="button" onClick={() => setPickOpen(false)}>나중에</button>
                  </div>
                </>
              ) : !pickedCards ? (
                <>
                  <strong>마음속 질문을 떠올리며 카드 세 장을 골라 주세요</strong>
                  <p>숫자 세 개(1~78)를 말씀하셔도 돼요 · {pickSel.length}/3</p>
                  <div className="lucy-cardpick-grid">
                    {Array.from({ length: ORB_DECK_SIZE }, (_, index) => index + 1).map(number => {
                      const order = pickSel.indexOf(number);
                      return (
                        <button key={number} type="button" className={order >= 0 ? 'is-on' : ''} aria-pressed={order >= 0} aria-label={`${number}번 카드`} onClick={() => togglePick(number)}>
                          <span>{number}</span>
                          {order >= 0 && <em>{order + 1}</em>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="lucy-cardpick-actions">
                    <button type="button" className="is-primary" disabled={pickSel.length < 3} onClick={() => commitPick(pickSel)}>이 세 장 펼치기</button>
                    <button type="button" onClick={() => setPickMode('shuffle')}>섞어서 뽑기</button>
                  </div>
                </>
              ) : (
                <>
                  <strong>펼쳐진 카드</strong>
                  <div className="lucy-cardpick-spread">
                    {pickedCards.map((card, index) => (
                      <figure key={card.number} style={{ ['--i' as string]: index }}>
                        <div className="lucy-cardpick-flip">
                          <span className="lucy-cardpick-back">{card.how === 'number' ? card.number : '✦'}</span>
                          <img src={card.imageUrl} alt={`${card.nameKo} ${card.orientationKo}`} className={card.reversed ? 'is-reversed' : ''} />
                        </div>
                        <figcaption><b>{card.position}</b>{card.nameKo}<small>{card.orientationKo}{card.how === 'number' ? ` · ${card.number}번` : ''}</small></figcaption>
                      </figure>
                    ))}
                  </div>
                  <div className="lucy-cardpick-actions"><button type="button" onClick={() => setPickOpen(false)}>닫기</button></div>
                </>
              )}
            </div>
          </div>
        )}
        {phase === 'report' && talisman && talismanOpen && (
          <div className="lucy-talisman-layer" role="dialog" aria-label={`부적: ${talisman.spec.nameKo}`}>
            <figure className="lucy-talisman">
              <img src={talisman.url} alt={`${talisman.spec.nameKo} — ${talisman.spec.meaning}`} />
              <figcaption>
                <strong>{talisman.spec.nameKo}</strong>
                <span>{talisman.spec.meaning}</span>
              </figcaption>
              <div className="lucy-talisman-actions">
                <button type="button" className="lucy-talisman-save" onClick={() => void saveTalisman()}>부적 사진으로 저장</button>
                <button type="button" className="lucy-talisman-close" onClick={() => setTalismanOpen(false)}>닫기</button>
              </div>
              {talismanNotice && <p className="lucy-talisman-notice" role="status">{talismanNotice}</p>}
            </figure>
          </div>
        )}
        {caution && (
          <div className="lucy-orb-caution" role="status">
            <strong>상담 결과 안내</strong>
            <p>오브 상담은 사주·타로 등 전통 상징 체계를 바탕으로 한 성찰용 참고 자료이며, 미래를 예측하거나 결과를 보장하지 않습니다.</p>
            <p>건강·법률·재정 등 중요한 결정은 반드시 해당 분야 전문가와 상의하시고, 최종 판단은 본인의 상황과 의지를 기준으로 내려 주세요.</p>
          </div>
        )}
        <header className="lucy-orb-header" data-top-bar="true">
          <h1>Orb</h1>
          <div className="lucy-orb-header-actions">
            <button
              type="button"
              className="lucy-orb-bed"
              aria-pressed={bedOn}
              onClick={() => {
                const next = !bedOn;
                setBedOn(next);
                sessionStorage.setItem('lucy_orb_bed', next ? 'on' : 'off');
                if (next) void bedRef.current?.resume();
              }}
            >
              {bedOn ? '배경음 켜짐' : '배경음 꺼짐'}
            </button>
            <PageGuideButton guide={getPageGuide('orb')} />
          </div>
        </header>
        {phase === 'live' && <button type="button" className="lucy-orb-end" onClick={openReport}>상담 끝내기</button>}
        <div className={`lucy-orb-ritual ${lit ? 'is-lit' : ''}`}>
          <span className="lucy-orb-table" aria-hidden="true"><i className="side" /><i className="top" /></span>
          <span className="lucy-orb-caustic" aria-hidden="true" />
          <div className="lucy-orb-floor" aria-hidden="true">
            <svg className="lucy-orb-circle lucy-orb-circle-back" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" strokeDasharray="3 8" />
              <circle cx="100" cy="100" r="48" />
            </svg>
            <svg className="lucy-orb-circle" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="96" />
              <circle cx="100" cy="100" r="84" />
              <circle cx="100" cy="100" r="70" />
              <circle cx="100" cy="100" r="56" strokeDasharray="1.5 5" />
              {Array.from({ length: 12 }, (_, index) => {
                const turn = (Math.PI * 2 * index) / 12;
                const inner = index % 3 === 0 ? 78 : 86;
                return <line key={index} x1={100 + Math.cos(turn) * inner} y1={100 + Math.sin(turn) * inner} x2={100 + Math.cos(turn) * 96} y2={100 + Math.sin(turn) * 96} />;
              })}
              {ORB_RUNES.slice(0, 12).map((rune, index) => {
                const turn = (Math.PI * 2 * (index + 0.5)) / 12;
                return <text key={rune} x={100 + Math.cos(turn) * 77} y={100 + Math.sin(turn) * 77} textAnchor="middle" dominantBaseline="central">{rune}</text>;
              })}
              <polygon points="100,38 146,128 54,128" />
              <polygon points="100,162 54,72 146,72" />
            </svg>
            {[0, 1, 2].map(index => <span key={index} className="lucy-voice-ring" style={{ animationDelay: `${index * 0.7}s` }} />)}
          </div>
          {[-140, -90, -40, 40, 90, 140].map((angle, index) => {
            const turn = ((angle - 90) * Math.PI) / 180;
            const depth = Math.sin(turn); // -1 = back of the floor, 1 = front
            return (
              <span
                key={angle}
                className={`lucy-candle ${depth > 0 ? 'is-front' : 'is-back'}`}
                style={{
                  left: `${50 + Math.cos(turn) * 43}%`,
                  top: `${66 + depth * 20.5}%`,
                  ['--flick' as string]: `${index * 0.23}s`,
                  ['--depth' as string]: `${0.92 + depth * 0.14}`,
                  ['--wax' as string]: ['#ffc9de', '#c9f2e3', '#ddd2ff', '#fff0b8', '#ffd6c2', '#cfe8ff'][index],
                }}
                aria-hidden="true"
              >
                <em />
                <b><s /><u /></b>
                <i />
              </span>
            );
          })}
          {/* 🔮 오브 상태 문구와 다시 연결 (탁자 바로 아래, 좁은 화면에서도 가려지지 않게) */}
          {phase === 'live' && (orbStateLabel || liveError || showCaption) && (
            <div className="lucy-orb-statusbar" aria-live="polite">
              {/* 실시간 자막: 마스터가 말하는 동안(과 말을 마친 뒤) 들리는 말을 앞에서부터 보여 준다. 내 말은 보이지 않는다. */}
              {showCaption
                ? <p key={caption.slice(0, 12)} className="lucy-orb-caption">{caption}</p>
                : orbStateLabel && <p className="lucy-orb-status" data-state={orbState || undefined}>{orbStateLabel}</p>}
              {liveError && !reconnectTimer.current && (
                <div className="lucy-orb-reconnect" role="alert">
                  <span>{typeof navigator !== 'undefined' && navigator.onLine === false ? '인터넷 연결을 확인해 주세요.' : '대화 내용은 그대로 있어요.'}</span>
                  <button type="button" onClick={reconnectNow}>다시 연결</button>
                </div>
              )}
            </div>
          )}
          <div className="lucy-orb-figure">
            {/* 🔮 상태 표시: 소리에 맞춰 커지는 빛무리, 도구 실행 때 도는 에너지 고리 */}
            <span className="lucy-orb-aura" aria-hidden="true" />
            <span className="lucy-orb-energy" aria-hidden="true" />
            {[0, 1, 2, 3, 4].map(index => <span key={index} className="lucy-orb-sparkle" aria-hidden="true">✦</span>)}
            {charging && <span className="lucy-orb-charge" aria-hidden="true" />}
            {orbBurst > 0 && (
              <span key={orbBurst} className={`lucy-orb-burst ${heavenBurst ? 'is-heaven' : ''}`} aria-hidden="true">
                <i className="bloom" />
                <i className="flare" />
                <i className="rays" />
                <i className="ring r1" />
                <i className="ring r2" />
                <i className="ring r3" />
                {BURST_PARTICLES.map(particle => (
                  <b key={particle.angle} style={{ ['--a' as string]: `${particle.angle}deg`, ['--d' as string]: `${particle.distance}%`, ['--s' as string]: `${particle.size}px`, animationDelay: `${particle.delay}s` }} />
                ))}
              </span>
            )}
            <button
              type="button"
              className={`lucy-orb-body ${lit ? 'is-lit' : ''} ${charging ? 'is-charging' : ''}`}
              aria-label={phase === 'live' ? (draft.trim() ? '실시간 대화로 전환하고 입력한 말 보내기 (꾹 누르면 천상의 조언)' : '실시간 대화 시작 (꾹 누르면 천상의 조언)') : '오브 빛 (꾹 누르면 천상의 조언)'}
              onPointerDown={startHold}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              onPointerCancel={endHold}
              onContextMenu={(event) => event.preventDefault()}
              onClick={() => {
                if (heldRef.current) { heldRef.current = false; return; }
                flashOrb();
                if (phase === 'live') {
                  if (voiceMode === 'hold') chooseVoiceMode('realtime');
                  if (draft.trim()) sendDraft();
                }
              }}
            >
              <span className="lucy-orb-glow" aria-hidden="true" />
              <span className="lucy-orb-inner" aria-hidden="true">
                <span className="lucy-orb-swirl" />
                <span className="lucy-orb-swirl is-two" />
                {ORB_GLYPHS.map(glyph => (
                  <span
                    key={glyph.key}
                    className={`lucy-orb-glyph ${glyph.Icon ? 'is-icon' : 'is-rune'}`}
                    style={{ left: `${glyph.left}%`, top: `${glyph.top}%`, animationDelay: `${glyph.delay}s`, animationDuration: `${glyph.duration}s` }}
                  >
                    {glyph.Icon ? <glyph.Icon strokeWidth={1.6} /> : glyph.rune}
                  </span>
                ))}
              </span>
              <span className="lucy-orb-shine" aria-hidden="true" />
              <span className="lucy-orb-rim" aria-hidden="true" />
            </button>
            <span className="lucy-orb-stand" aria-hidden="true"><i className="cup" /><i className="ring" /><i className="neck" /><i className="base" /></span>
          </div>
          {/* 주사위는 탁자 앞쪽에 놓여 있다 (아래쪽 빅뱅 버튼에 가리지 않게). 누르면 탁자 위로 던져진다. */}
          {phase === 'pick' && (
            <button type="button" className={`lucy-die ${rolling ? 'is-thrown' : ''}`} onClick={rollMaster} aria-label="주사위 두 개로 마스터 고르기">
              {dice.map((face, index) => <span key={index} className="lucy-die-mini"><Pips value={face} /></span>)}
            </button>
          )}
          {thrown > 0 && (
            <span key={thrown} className="lucy-dice-throw" aria-hidden="true">
              {dice.map((face, index) => (
                <span key={index} className={`lucy-die-3d is-${index ? 'second' : 'first'}`} style={{ ['--end' as string]: DIE_END[face - 1] }}>
                  <span className="lucy-die-shadow" />
                  <span className="lucy-die-tumble">
                    <span className="lucy-die-cube3d">
                      {DIE_FACES.map(({ value, place }) => (
                        <span key={value} className="lucy-die-face" style={{ transform: place }}>
                          <Pips value={value} />
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              ))}
              <span className="lucy-dice-sum">{dice[0]} + {dice[1]} = {dice[0] + dice[1]}</span>
            </span>
          )}
        </div>
        <div className="lucy-orb-copy">
          {phase === 'pick' && <p>탁자 위 주사위를 누르거나 마스터를 고르시면 상담이 시작됩니다</p>}
          {phase === 'live' && <p>{speaking ? `${master?.name} 마스터가 말하고 있습니다` : `${master?.name} · ${master?.tone}. 말씀하셔도 되고, 적으셔도 됩니다`}</p>}
          {(phase === 'pick' || phase === 'live') && (
            <div className="lucy-orb-voice-controls">
              <span className="lucy-orb-voice-label">음성 대화 방식</span>
              <div className="lucy-orb-voice-options" role="group" aria-label="음성 대화 방식">
                <button type="button" aria-pressed={voiceMode === 'realtime'} onClick={() => chooseVoiceMode('realtime')}>실시간 대화</button>
                <button type="button" aria-pressed={voiceMode === 'hold'} onClick={() => chooseVoiceMode('hold')}>누르고 말하기</button>
              </div>
              <p className="lucy-orb-voice-description">
                {voiceMode === 'realtime' ? '마이크가 계속 켜져 있어 자연스럽게 대화해요.' : '입력창을 누르고 말한 뒤 떼면 전송돼요. 오브를 짧게 누르면 실시간 대화로 바뀌어요.'}
              </p>
            </div>
          )}
          {notice && <p role="status">{notice}</p>}
          {phase === 'pick' && !micGranted && (
            <div className="lucy-orb-permission-actions">
              <button type="button" className="lucy-orb-permission" disabled={micPermissionBusy || rolling} onClick={() => void requestMicPermission()}>
                {micPermissionBusy ? '권한 확인 중…' : '마이크 권한 요청'}
              </button>
            </div>
          )}
          {phase === 'live' && micUnavailable && (
            <div className="lucy-orb-permission-actions">
              <button type="button" className="lucy-orb-permission" disabled={micPermissionBusy} onClick={() => void retryLiveMic()}>
                {micPermissionBusy ? '마이크 연결 중…' : '마이크 다시 연결'}
              </button>
            </div>
          )}
          {phase === 'pick' && memory[0] && (
            <p className="lucy-orb-regular">📒 다시 오셨네요 · {latestOrbMemoryLine(memory)}</p>
          )}
          {phase === 'pick' && (
            <div className="lucy-orb-masters">
              {ORB_MASTERS.map(item => (
                <button key={item.id} type="button" disabled={micPermissionBusy || rolling} onClick={() => begin(item)}>
                  <span className="lucy-orb-master-head">
                    <strong>{item.name} 마스터</strong>
                    {memory[0]?.masterId === item.id && <em>최근 상담</em>}
                  </span>
                  <span className="lucy-orb-master-tags">{item.specialty.map(tag => <i key={tag}>{tag}</i>)}</span>
                  <span className="lucy-orb-master-intro">{item.intro}</span>
                  <span className="lucy-orb-master-style">🎙 {item.style} · 이럴 때: {item.bestFor}</span>
                </button>
              ))}
            </div>
          )}
          {phase === 'live' && master && (
            <div className="lucy-orb-keywords">
              <button type="button" className={`lucy-orb-cardchip ${pickedCards ? '' : 'is-waiting'}`} onClick={() => { tarotArmedRef.current = true; setPickOpen(true); }}>
                {pickedCards ? '🃏 내 카드 보기' : '🃏 카드 섞기'}
              </button>
              {master.prompts.map(prompt => (
                <button key={prompt} type="button" onClick={() => ask(prompt)}>{prompt}</button>
              ))}
            </div>
          )}
        </div>
        {/* 입력창은 마스터가 정해진 뒤(상담 중)에만 보인다. */}
        {phase === 'live' && (
          <div className="lucy-orb-dock">
            <div className="lucy-orb-input-wrap">
              <input
                ref={orbInputRef}
                className={`lucy-orb-input ${talkPressed ? 'is-pressed' : ''}`}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return;
                  event.preventDefault();
                  // 글로 상담하기: 엔터(전송)로 보낸다. 한글 조합 중의 엔터는 무시한다.
                  if (event.nativeEvent.isComposing || event.keyCode === 229) return;
                  sendDraft();
                }}
                onPointerDown={(event) => { if (event.pointerType === 'mouse') beginInputPress(event.clientX, event.clientY); }}
                onPointerUp={(event) => { if (event.pointerType === 'mouse') endInputPress(); }}
                onPointerLeave={(event) => { if (event.pointerType === 'mouse' && talkingRef.current) endInputPress(); }}
                onBlur={() => { if (talkingRef.current) endInputPress(); }}
                onContextMenu={(event) => event.preventDefault()}
                placeholder={talkPressed ? '' : '누르고 말한 뒤 떼면 전송 · 탭해 입력'}
                aria-label="오브 상담 입력. 누르고 말한 뒤 떼면 음성을 전송합니다"
                enterKeyHint="send"
              />
              {(talkPressed || audioLevel > 0.035) && (
                <span className={`lucy-orb-input-wave ${talkPressed ? 'is-holding' : ''}`} aria-hidden="true">
                  {(talkPressed ? ORB_HOLD_WAVE : ORB_SMALL_WAVE).map((weight, index) => (
                    <i key={index} style={{ height: `${3 + audioLevel * weight * 20}px` }} />
                  ))}
                </span>
              )}
              {talkPressed && <span className="lucy-orb-hold-hint" role="status">듣고 있어요 · 손을 떼면 전송</span>}
            </div>
          </div>
        )}
        {phase === 'report' && master && (
          <>
          <div className="lucy-bok">
            <p className="lucy-bok-done">상담을 마쳤습니다. 채팅에 남기기를 누르면 루시가 요약 보고서를 만들어 드려요.</p>
            <p>{hearted ? `${BOKCHAE.find(item => item.id === bok)?.label || ''} 복채 감사합니다. 부적을 써 드렸어요` : '복채를 내시면 부적을 써 드려요 · 금액을 누르세요'}</p>
            <div className="lucy-bok-chips">
              {!hearted && BOKCHAE.map(item => (
                <button key={item.id} type="button" onClick={event => offerBok(item.id, event.currentTarget)}>{item.label}</button>
              ))}
              {hearted && <button type="button" className="lucy-talisman-reopen" disabled={!talisman || talismanOpen} onClick={() => setTalismanOpen(true)}>🧧 부적 보기</button>}
            </div>
            {burst > 0 && (
              <span key={burst} className="lucy-ig-live" style={{ left: `${burstFrom.current}%` }} aria-hidden="true">
                {IG_HEARTS.map((heart, index) => (
                  <i key={index} style={{ ['--x' as string]: `${heart.x}px`, ['--d' as string]: `${heart.delay}ms`, ['--s' as string]: String(heart.scale), ['--c' as string]: heart.color, ['--sway' as string]: `${heart.sway}px` }}><HeartGlyph /></i>
                ))}
              </span>
            )}
          </div>
          <div className="lucy-orb-dock lucy-orb-report-dock">
            <button type="button" onClick={keepReport}>채팅에 남기기</button>
            <button type="button" className="lucy-orb-report-close" onClick={closeWithoutSaving}>닫기</button>
          </div>
          </>
        )}
      </section>
  );
}
