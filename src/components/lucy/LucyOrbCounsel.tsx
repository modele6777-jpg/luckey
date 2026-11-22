import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { startGeminiLiveVoice, type LiveVoiceSession } from '@/lib/geminiLiveSession';
import { createOrbCounselBed, type OrbCounselBed } from '@/lib/orbCounselBed';
import { isLucyMasterBgmPlaying, startLucyMasterBgm, stopLucyMasterBgm } from '@/lib/lucyMasterBgm';
import { ORB_MASTERS, type OrbMaster } from '@/lib/orbMasters';
import { drawLucyTarotCards } from '@/utils/tarotDetector';
import React, { useEffect, useRef, useState } from 'react';
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
type Line = { who: '나' | '루시'; text: string };
type Phase = 'pick' | 'live' | 'report';

function mergeTranscript(previous: string, next: string): string {
  const line = next.replace(/\s+/g, ' ').trim();
  if (!line) return previous;
  if (!previous || line.startsWith(previous) || previous.startsWith(line)) return line.length >= previous.length ? line : previous;
  return `${previous} ${line}`.trim();
}

function reportFrom(master: OrbMaster, nickname: string, lines: Line[]): string {
  const when = new Date().toLocaleString('ko-KR');
  const body = lines.map(line => `${line.who}: ${line.text}`).join('\n\n') || '남긴 말이 없습니다.';
  const said = lines.filter(line => line.who === '나').map(line => line.text).slice(-4).join(' ');
  const answered = lines.filter(line => line.who === '루시').map(line => line.text).slice(-4).join(' ');
  return [
    '루시 오브 상담 보고서',
    `마스터: ${master.name}`,
    `목소리: ${master.tone}`,
    `주제: ${master.topic}`,
    `이름: ${nickname || '친구'}`,
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
  const [ready, setReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [master, setMaster] = useState<OrbMaster | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const [report, setReport] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [dieFace, setDieFace] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [bedOn, setBedOn] = useState(true);
  const [bok, setBok] = useState<string | null>(null);
  const [hearted, setHearted] = useState(false);
  const [burst, setBurst] = useState(0);
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
    setMaster(null);
    setLines([]);
    setDraft('');
    setNotice('');
    setReport('');
    setReady(false);
    setSpeaking(false);
    setLeaving(false);
    setBok(null);
    setHearted(false);
    setBurst(0);
    const appear = window.setTimeout(() => setReady(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1700);
    const masterWasOn = isLucyMasterBgmPlaying();
    if (masterWasOn) stopLucyMasterBgm();
    const bed = createOrbCounselBed();
    bedRef.current = bed;
    const on = sessionStorage.getItem('lucy_orb_bed') !== 'off';
    setBedOn(on);
    void bed?.resume().then(() => bed.setAudible(on, false));
    return () => {
      window.clearTimeout(appear);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      if (dieTimer.current) window.clearInterval(dieTimer.current);
      bed?.stop();
      bedRef.current = null;
      if (masterWasOn) void startLucyMasterBgm();
      sessionRef.current?.stop();
      sessionRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    bedRef.current?.setAudible(bedOn, speaking);
  }, [bedOn, speaking]);

  if (!open) return null;

  const begin = (next: OrbMaster) => {
    sessionRef.current?.stop();
    setMaster(next);
    setPhase('live');
    setNotice('');
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
    });
    sessionRef.current = session;
    const typed = draft.trim();
    const cue = typed
      ? `먼저 네 말투로 두 문장만 인사한 뒤, 이어서 이 말에 답해. 이 지시 문장은 읽지 마. 사용자의 말: ${typed}`
      : '지금 막 도착했어. 사용자가 말하기 전에 네 말투로 두 문장만 먼저 인사해. 이 지시 문장은 읽지 마.';
    session.sendText(cue);
    if (typed) {
      userBuf.current = typed;
      take('나', userBuf);
      setDraft('');
    }
  };

  const openReport = () => {
    if (!master || closedRef.current) return;
    if (userBuf.current) take('나', userBuf);
    if (lucyBuf.current) take('루시', lucyBuf);
    sessionRef.current?.stop();
    sessionRef.current = null;
    setReport(reportFrom(master, nickname, linesRef.current));
    setPhase('report');
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

  const flashOrb = () => {
    setLit(true);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setLit(false), 950);
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
    setRolling(true);
    let ticks = 0;
    if (dieTimer.current) window.clearInterval(dieTimer.current);
    dieTimer.current = window.setInterval(() => {
      ticks += 1;
      setDieFace(1 + Math.floor(Math.random() * 6));
      if (ticks < 8) return;
      if (dieTimer.current) window.clearInterval(dieTimer.current);
      dieTimer.current = null;
      setRolling(false);
      const pick = ORB_MASTERS[Math.floor(Math.random() * ORB_MASTERS.length)];
      begin(pick);
    }, 90);
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
    <ScreenPortal>
      <section
        className={`lucy-orb-stage ${ready ? 'is-ready' : ''} ${phase === 'live' ? 'is-live' : ''} ${speaking ? 'is-speaking' : ''} ${leaving ? 'is-leaving' : ''}`}
        role="dialog"
        aria-label="오브 상담"
        onPointerDown={() => { void bedRef.current?.resume().then(() => bedRef.current?.setAudible(bedOn, speaking)); }}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <span key={`mote-${index}`} className="lucy-mote" style={{ left: `${8 + index * 9}%`, animationDelay: `${index * .35}s` }} />
        ))}
        {[0, 1, 2, 3, 4, 5].map(index => (
          <span
            key={index}
            className="lucy-orb-mist"
            style={{
              width: `${42 + index * 12}%`,
              height: `${24 + index * 9}%`,
              left: `${4 + index * 8}%`,
              top: `${12 + (index % 3) * 14}%`,
              animationDelay: `${index * 0.12}s`,
            }}
          />
        ))}
        {phase === 'live' && <button type="button" className="lucy-orb-end" onClick={openReport}>상담 끝내기</button>}
        {phase === 'report' && <button type="button" className="lucy-orb-end" onClick={keepReport}>채팅으로</button>}
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
        <div className={`lucy-orb-ritual ${lit ? 'is-lit' : ''}`}>
          <svg className="lucy-orb-circle lucy-orb-circle-back" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="90" strokeDasharray="3 8" />
            <circle cx="100" cy="100" r="48" />
          </svg>
          <svg className="lucy-orb-circle" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="96" />
            <circle cx="100" cy="100" r="84" />
            <circle cx="100" cy="100" r="70" />
            <circle cx="100" cy="100" r="56" strokeDasharray="1.5 5" />
            {Array.from({ length: 12 }, (_, index) => {
              const turn = (Math.PI * 2 * index) / 12;
              const inner = index % 3 === 0 ? 78 : 86;
              return <line key={index} x1={100 + Math.cos(turn) * inner} y1={100 + Math.sin(turn) * inner} x2={100 + Math.cos(turn) * 96} y2={100 + Math.sin(turn) * 96} />;
            })}
            <polygon points="100,38 146,128 54,128" />
            <polygon points="100,162 54,72 146,72" />
          </svg>
          {[0, 1, 2].map(index => <span key={index} className="lucy-voice-ring" style={{ animationDelay: `${index * 0.7}s` }} />)}
          <span className="lucy-orbit" aria-hidden="true">{[0, 1, 2, 3, 4].map(index => <i key={index} />)}</span>
          {[-140, -90, -40, 40, 90, 140].map((angle, index) => {
            const turn = ((angle - 90) * Math.PI) / 180;
            return (
              <span
                key={angle}
                className="lucy-candle"
                style={{ left: `${50 + Math.cos(turn) * 43}%`, top: `${50 + Math.sin(turn) * 43}%`, ['--flick' as string]: `${index * 0.23}s` }}
                aria-hidden="true"
              >
                <em />
                <b><s /><u /></b>
                <i />
              </span>
            );
          })}
          <button type="button" className={`lucy-orb-body ${lit ? 'is-lit' : ''}`} aria-label={draft.trim() ? '입력한 말 보내기' : '오브 빛'} onClick={() => { flashOrb(); if (phase === 'live') sendDraft(); }} />
        </div>
        <div className="lucy-orb-copy">
          {phase === 'pick' && <p>마스터를 고르면 상담이 시작돼</p>}
          {phase === 'live' && <p>{speaking ? `${master?.name} 마스터가 말하고 있어` : `${master?.name} · ${master?.tone}. 말해도 되고, 적어도 돼`}</p>}
          {phase === 'report' && <p>이번 상담을 부적으로 남겼어. 파일로도 보관할 수 있어</p>}
          {notice && <p>{notice}</p>}
          {phase === 'pick' && (
            <div className="lucy-orb-masters">
              <button type="button" className={`lucy-die ${rolling ? 'is-rolling' : ''}`} onClick={rollMaster} aria-label="주사위로 마스터 고르기">
                {Array.from({ length: 9 }, (_, index) => {
                  const pips = ['4', '0,8', '0,4,8', '0,2,6,8', '0,2,4,6,8', '0,2,3,5,6,8'][dieFace - 1];
                  return <i key={index} className={pips.split(',').includes(String(index)) ? '' : 'is-off'} />;
                })}
              </button>
              <p className="lucy-die-caption">주사위를 누르면 마스터가 무작위로 정해져</p>
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
                {(lines.length ? lines.slice(-6) : [{ who: '루시' as const, text: '오늘은 말을 아끼고, 숨만 고르기로 했어.' }]).map((line, index) => (
                  <span key={`${line.who}-${index}`}>{line.who === '나' ? '원' : '답'} · {line.text}</span>
                ))}
              </div>
            </article>
          )}
        </div>
        {phase !== 'report' && (
          <div className="lucy-orb-dock">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); }} placeholder={phase === 'pick' ? '먼저 적어도 돼. 마스터를 고른 뒤 오브를 누르면 보내져' : '적고 오브를 누르면 보내져'} aria-label="오브 상담 입력" enterKeyHint="done" />
          </div>
        )}
        {phase === 'report' && master && (
          <>
          <div className="lucy-bok">
            <p>복채는 마음껏 고르면 돼</p>
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
          <div className="lucy-orb-dock">
            <button type="button" onClick={() => saveReportFile(master, report)}>보고서 파일 저장</button>
            <button type="button" onClick={keepReport}>채팅에 남기기</button>
          </div>
          </>
        )}
      </section>
    </ScreenPortal>
  );
}
