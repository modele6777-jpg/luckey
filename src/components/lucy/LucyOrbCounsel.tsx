import { PageGuideButton } from '@/components/guide/PageGuide';
import { getPageGuide } from '@/lib/pageGuides';
import { startGeminiLiveVoice, type LiveVoiceSession } from '@/lib/geminiLiveSession';
import { createOrbCounselBed, type OrbCounselBed } from '@/lib/orbCounselBed';
import { isLucyMasterBgmPlaying, stopLucyMasterBgm } from '@/lib/lucyMasterBgm';
import { ORB_MASTERS, orbVoice, type OrbMaster } from '@/lib/orbMasters';
import { generateHeavenlyAdvice } from '@/lib/orbHeavenlyAdvice';
import { playTTSInChunks, stopTTS, useTTSActive } from '@/utils/tts';
import { CHANNEL_MENU_ICONS, MessageCircleMinus } from '@/lib/channelMenuIcons';
import { drawLucyTarotCards } from '@/utils/tarotDetector';
import { Clover, KeyRound, MessageCirclePlus, type LucideIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
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
      <path d="M12 21s-6.7-4.35-9.33-8.2C.2 10 .4 6.4 3 4.8 5.1 3.5 7.7 4 9.1 5.8 10.5 4 13.1 3.5 15.2 4.8c2.6 1.6 2.8 5.2 1.1 7.9C18.7 16.6 12 21 12 21z" />
    </svg>
  );
}
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

function saveReportFile(master: OrbMaster, report: string) {
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `루시_오브상담_${master.name}_${stamp}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export function LucyOrbCounsel({
  open,
  nickname,
  chart,
  onFinish,
}: {
  open: boolean;
  nickname: string;
  chart: string;
  onFinish: (summary: string | null) => void;
}) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [voiceMode, setVoiceMode] = useState<OrbVoiceMode>('hold');
  const [talkPressed, setTalkPressed] = useState(false);
  const [ready, setReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [master, setMaster] = useState<OrbMaster | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const [micPermissionBusy, setMicPermissionBusy] = useState(false);
  const [micUnavailable, setMicUnavailable] = useState(false);
  const [report, setReport] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [dice, setDice] = useState<[number, number]>([1, 6]);
  const [rolling, setRolling] = useState(false);
  const [thrown, setThrown] = useState(0);
  const [location] = useLocation();
  const [awayFromOrb, setAwayFromOrb] = useState(false);
  const [bedOn, setBedOn] = useState(true);
  const [bok, setBok] = useState<string | null>(null);
  const [hearted, setHearted] = useState(false);
  const [burst, setBurst] = useState(0);
  const [caution, setCaution] = useState(false);
  const [lit, setLit] = useState(false);
  const [orbBurst, setOrbBurst] = useState(0);
  const [heavenBurst, setHeavenBurst] = useState(false);
  const [charging, setCharging] = useState(false);
  const [heaven, setHeaven] = useState<{ status: 'loading' | 'ready'; text: string } | null>(null);
  const holdTimer = useRef<number | null>(null);
  const heldRef = useRef(false);
  const heavenToken = useRef(0);
  const heavenSpokeRef = useRef(false);
  const micPrime = useRef<Promise<MediaStream> | null>(null);
  const releasePrimedMicRef = useRef<() => void>(() => {});
  const ttsActive = useTTSActive();
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
    setMaster(null);
    setLines([]);
    setDraft('');
    setNotice('');
    setMicPermissionBusy(false);
    setMicUnavailable(false);
    setReport('');
    setReady(false);
    setSpeaking(false);
    setLeaving(false);
    setBok(null);
    setHearted(false);
    setBurst(0);
    setCaution(false);
    setLit(false);
    setRolling(false);
    setThrown(0);
    setHeaven(null);
    setCharging(false);
    setOrbBurst(0);
    const appear = window.setTimeout(() => setReady(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1700);
    if (isLucyMasterBgmPlaying()) stopLucyMasterBgm();
    const bed = createOrbCounselBed();
    bedRef.current = bed;
    const on = sessionStorage.getItem('lucy_orb_bed') !== 'off';
    setBedOn(on);
    void bed?.resume().then(() => bed.setAudible(on && document.visibilityState !== 'hidden', false));
    return () => {
      window.clearTimeout(appear);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      if (dieTimer.current) window.clearTimeout(dieTimer.current);
      if (cautionTimer.current) window.clearTimeout(cautionTimer.current);
      if (holdTimer.current) window.clearTimeout(holdTimer.current);
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

  if (!open) return null;

  // 마이크는 사용자가 누른 그 순간에 요청한다 (브라우저가 탭 안에서만 허용 창을 띄우는 경우가 있다).
  const requestMic = (): Promise<MediaStream> | null => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return null;
    const request = navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    request.catch(() => undefined);
    return request;
  };
  const releasePrimedMic = () => {
    const pending = micPrime.current;
    micPrime.current = null;
    void pending?.then(stream => stream.getTracks().forEach(track => track.stop())).catch(() => undefined);
  };

  releasePrimedMicRef.current = releasePrimedMic;

  const describeMicPermissionError = (error: unknown) => {
    const name = error && typeof error === 'object' && 'name' in error ? String(error.name) : '';
    const errorSuffix = name ? ` (오류 코드: ${name})` : '';
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return `마이크 권한이 차단되어 있어요. 브라우저 주소창의 사이트 설정에서 마이크를 허용한 뒤 다시 눌러 주세요. iPhone에서는 설정 > Safari(홈 화면 앱이면 해당 앱) > 마이크도 확인해 주세요.${errorSuffix}`;
    }
    if (name === 'SecurityError') {
      return `브라우저나 앱이 이 화면의 마이크 접근을 차단했어요. 사이트 권한과 기기 설정에서 Luckey의 마이크를 허용한 뒤 다시 시도해 주세요.${errorSuffix}`;
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return `사용할 수 있는 마이크를 찾지 못했어요. 마이크가 연결되어 있는지 확인해 주세요.${errorSuffix}`;
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return `마이크가 다른 앱에서 사용 중이거나 시작할 수 없어요. 다른 앱에서 마이크를 닫고 다시 시도해 주세요.${errorSuffix}`;
    }
    return `마이크를 시작하지 못했어요.${errorSuffix} Safari에서 권한을 이미 허용했다면, Safari에서 사이트를 직접 열었는지 확인해 주세요. 홈 화면 웹 앱이나 앱 내 브라우저에서 실행 중이라면 그 앱의 마이크 권한도 확인해 주세요.`;
  };

  const requestMicPermission = async () => {
    if (micPermissionBusy) return;
    setMicPermissionBusy(true);
    setMicUnavailable(false);
    setNotice('마이크 권한을 요청하고 있습니다…');
    releasePrimedMic();
    const request = requestMic();
    if (!request) {
      setMicUnavailable(true);
      setNotice('이 브라우저에서는 마이크를 사용할 수 없어요. Safari 또는 Chrome에서 다시 시도해 주세요.');
      setMicPermissionBusy(false);
      return;
    }
    try {
      const stream = await request;
      stream.getTracks().forEach(track => track.stop());
      setNotice('마이크 권한이 허용됐어요. 마스터를 선택하면 음성 상담을 시작합니다.');
    } catch (error) {
      setMicUnavailable(true);
      setNotice(describeMicPermissionError(error));
    } finally {
      setMicPermissionBusy(false);
    }
  };

  const begin = (next: OrbMaster, micStreamOverride?: Promise<MediaStream> | null, shouldGreet = true) => {
    sessionRef.current?.stop();
    const micStream = micStreamOverride === undefined ? micPrime.current || requestMic() : micStreamOverride;
    micPrime.current = null;
    setMaster(next);
    setPhase('live');
    setNotice('');
    setMicUnavailable(false);
    const cards = drawLucyTarotCards(3).map((card, index) => `${index + 1}번 ${card.nameKo} ${card.orientationKo}`).join(', ');
    const session = startGeminiLiveVoice({
      nickname,
      chart,
      cards,
      voice: next.voice,
      focus: next.focus,
      greet: next.greet,
      onState: (state) => setSpeaking(state === 'speaking'),
      onUserText: (text) => {
        if (lucyBuf.current) take('루시', lucyBuf);
        userBuf.current = mergeTranscript(userBuf.current, text);
      },
      onLucyText: (text) => {
        if (userBuf.current) take('나', userBuf);
        lucyBuf.current = mergeTranscript(lucyBuf.current, text);
      },
      onError: (error) => setNotice(error.message),
      onNotice: (message) => {
        setNotice(message);
        setMicUnavailable(true);
      },
      startMuted: voiceMode === 'hold',
      micStream,
    });
    sessionRef.current = session;
    if (shouldGreet) {
      const typed = draft.trim();
      const cue = typed
        ? `먼저 존댓말로 두 문장만 인사한 뒤, 이어서 이 말씀에 답하세요. 이 지시 문장은 읽지 마세요. 사용자의 말: ${typed}`
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
    releasePrimedMic();
    const request = requestMic();
    if (!request) {
      setMicUnavailable(true);
      setNotice('이 브라우저에서는 마이크를 사용할 수 없어요. Safari 또는 Chrome에서 다시 시도해 주세요.');
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
    sessionRef.current?.setMuted(next === 'hold');
  };

  const startPushToTalk = (event?: React.PointerEvent<HTMLButtonElement>) => {
    if (voiceMode !== 'hold' || micUnavailable || micPermissionBusy || !sessionRef.current) return;
    if (event) {
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* optional on older browsers */ }
    }
    setTalkPressed(true);
    sessionRef.current.setMuted(false);
  };

  const stopPushToTalk = () => {
    setTalkPressed(false);
    sessionRef.current?.setMuted(voiceMode === 'hold');
  };

  const openReport = () => {
    if (!master || closedRef.current) return;
    if (userBuf.current) take('나', userBuf);
    if (lucyBuf.current) take('루시', lucyBuf);
    sessionRef.current?.stop();
    sessionRef.current = null;
    setReport(reportFrom(master, nickname, linesRef.current));
    setPhase('report');
    setCaution(true);
    if (cautionTimer.current) window.clearTimeout(cautionTimer.current);
    cautionTimer.current = window.setTimeout(() => setCaution(false), 3200);
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
    sessionRef.current.sendText(text);
    userBuf.current = text;
    take('나', userBuf);
  };

  const offerBok = () => {
    if (!bok || hearted) return;
    const picked = BOKCHAE.find(item => item.id === bok);
    if (!picked) return;
    setHearted(true);
    setBurst(value => value + 1);
    setReport(current => `${current}\n\n복채\n${picked.label}`.trim());
  };

  const rollMaster = () => {
    if (rolling || leaving) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 두 주사위의 눈을 먼저 정하고, 3D 주사위가 그 눈이 위로 오도록 굴러가 멈춘다. 합으로 마스터를 고른다.
    releasePrimedMic();
    micPrime.current = requestMic();
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
    sessionRef.current.sendText(text);
    userBuf.current = text;
    take('나', userBuf);
    setDraft('');
  };

  return (
      <section
        className={`lucy-orb-stage ${ready ? 'is-ready' : ''} ${phase === 'live' ? 'is-live' : ''} ${speaking ? 'is-speaking' : ''} ${leaving ? 'is-leaving' : ''}`}
        data-orb-counsel="true"
        role="region"
        aria-label="오브 상담"
        onPointerDown={() => { void bedRef.current?.resume().then(() => bedRef.current?.setAudible(bedAudible, speaking)); }}
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
          <div className="lucy-heaven" role="dialog" aria-label="천상의 조언">
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
        {caution && <p className="lucy-orb-caution" role="status">이 상담은 참고일 뿐입니다. 맹신하지 마세요.</p>}
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
                void bedRef.current?.resume();
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
          <div className="lucy-orb-figure">
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
          {phase === 'report' && <p>이번 상담을 부적으로 남겼습니다. 파일로도 보관할 수 있습니다</p>}
          {(phase === 'pick' || phase === 'live') && (
            <div className="lucy-orb-voice-controls">
              <span className="lucy-orb-voice-label">음성 대화 방식</span>
              <div className="lucy-orb-voice-options" role="group" aria-label="음성 대화 방식">
                <button type="button" aria-pressed={voiceMode === 'realtime'} onClick={() => chooseVoiceMode('realtime')}>실시간 대화</button>
                <button type="button" aria-pressed={voiceMode === 'hold'} onClick={() => chooseVoiceMode('hold')}>누르고 말하기</button>
              </div>
              <p className="lucy-orb-voice-description">
                {voiceMode === 'realtime' ? '마이크가 계속 켜져 있어 자연스럽게 대화해요.' : '버튼을 누르고 있는 동안 말하고, 오브를 짧게 누르면 실시간 대화로 바뀌어요.'}
              </p>
            </div>
          )}
          {notice && <p role="status">{notice}</p>}
          {phase === 'pick' && (
            <div className="lucy-orb-permission-actions">
              <button type="button" className="lucy-orb-permission" disabled={micPermissionBusy} onClick={() => void requestMicPermission()}>
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
          {phase === 'pick' && (
            <div className="lucy-orb-masters">
              {ORB_MASTERS.map(item => (
                <button key={item.id} type="button" onClick={() => begin(item)}>
                  <strong>{item.name}</strong>
                  <span>{item.tone} · {item.topic}</span>
                </button>
              ))}
            </div>
          )}
          {phase === 'live' && master && (
            <div className="lucy-orb-keywords">
              {master.prompts.map(prompt => (
                <button key={prompt} type="button" onClick={() => ask(prompt)}>{prompt}</button>
              ))}
            </div>
          )}
          {phase === 'live' && (
            <div className="lucy-orb-lines">
              {lines.slice(-3).map((line, index) => <span key={`${line.who}-${index}`}>{line.who}: {line.text}</span>)}
            </div>
          )}
          {phase === 'report' && master && (
            <article className="lucy-charm" aria-label="상담 부적">
              <span className="lucy-charm-side">守</span>
              <span className="lucy-charm-seal">{master.name}</span>
              <h2>상담 부적</h2>
              <p>{master.topic}</p>
              <div className="lucy-charm-lines">
                {(lines.length ? lines.slice(-6) : [{ who: '루시' as const, text: '오늘은 말을 아끼고, 숨만 고르기로 했습니다.' }]).map((line, index) => (
                  <span key={`${line.who}-${index}`}>{line.who === '나' ? '원' : '답'} · {line.text}</span>
                ))}
              </div>
            </article>
          )}
        </div>
        {/* 입력창은 마스터가 정해진 뒤(상담 중)에만 보인다. */}
        {phase === 'live' && (
          <div className="lucy-orb-dock">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); }} placeholder="적고 오브를 누르면 보내집니다" aria-label="오브 상담 입력" enterKeyHint="done" />
            {voiceMode === 'hold' && (
              <button
                type="button"
                className={`lucy-orb-ptt lucy-orb-dock-ptt ${talkPressed ? 'is-pressed' : ''}`}
                aria-label={talkPressed ? '말하기 전송 중, 놓으면 멈춥니다' : '길게 눌러 말하기'}
                aria-pressed={talkPressed}
                disabled={micUnavailable || micPermissionBusy || !sessionRef.current}
                onPointerDown={startPushToTalk}
                onPointerUp={stopPushToTalk}
                onPointerLeave={stopPushToTalk}
                onPointerCancel={stopPushToTalk}
                onLostPointerCapture={stopPushToTalk}
                onKeyDown={(event) => {
                  if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
                    event.preventDefault();
                    startPushToTalk();
                  }
                }}
                onKeyUp={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                    stopPushToTalk();
                  }
                }}
                onBlur={stopPushToTalk}
                onContextMenu={(event) => event.preventDefault()}
              >
                {talkPressed ? '말하는 중' : '길게 눌러 말하기'}
              </button>
            )}
          </div>
        )}
        {phase === 'report' && master && (
          <>
          <div className="lucy-bok">
            <p>복채는 마음껏 고르셔도 됩니다</p>
            <div>
              {BOKCHAE.map(item => (
                <button key={item.id} type="button" className={bok === item.id ? 'is-on' : ''} disabled={hearted} onClick={() => setBok(item.id)}>{item.label}</button>
              ))}
            </div>
            <button type="button" className={`lucy-ig-like ${hearted ? 'is-liked' : ''}`} disabled={!bok} onClick={offerBok} aria-label="복채 내기">
              <HeartGlyph />
            </button>
            {burst > 0 && (
              <span key={burst} className="lucy-ig-pop" aria-hidden="true">
                <HeartGlyph />
                {[-72, -46, -18, 12, 40, 68].map(angle => (
                  <i key={angle} style={{ ['--a' as string]: `${angle}deg` }}><HeartGlyph /></i>
                ))}
              </span>
            )}
          </div>
          <div className="lucy-orb-dock lucy-orb-report-dock">
            <button type="button" onClick={() => saveReportFile(master, report)}>보고서 파일 저장</button>
            <button type="button" onClick={keepReport}>채팅에 남기기</button>
            <button type="button" className="lucy-orb-report-close" onClick={closeWithoutSaving}>닫기</button>
          </div>
          </>
        )}
      </section>
  );
}
