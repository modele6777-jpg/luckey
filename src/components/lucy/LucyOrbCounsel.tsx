import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { startGeminiLiveVoice, type LiveVoiceSession } from '@/lib/geminiLiveSession';
import { ORB_MASTERS, type OrbMaster } from '@/lib/orbMasters';
import { drawLucyTarotCards } from '@/utils/tarotDetector';
import React, { useEffect, useRef, useState } from 'react';
import './lucy-orb-counsel.css';

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
  const [lit, setLit] = useState(false);
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
    const appear = window.setTimeout(() => setReady(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1700);
    return () => {
      window.clearTimeout(appear);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      sessionRef.current?.stop();
      sessionRef.current = null;
    };
  }, [open]);

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
    if (typed) {
      session.sendText(typed);
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
    if (closedRef.current) return;
    closedRef.current = true;
    onFinishRef.current(report || null);
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
      <section className={`lucy-orb-stage ${ready ? 'is-ready' : ''} ${speaking ? 'is-speaking' : ''}`} role="dialog" aria-label="오브 상담">
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
        <button type="button" className={`lucy-orb-body ${lit ? 'is-lit' : ''}`} aria-label="오브 빛" onClick={flashOrb} />
        <div className="lucy-orb-copy">
          {phase === 'pick' && <p>마스터를 고르면 상담이 시작돼</p>}
          {phase === 'live' && <p>{speaking ? `${master?.name} 마스터가 말하고 있어` : `${master?.name} · ${master?.tone}. 말해도 되고, 적어도 돼`}</p>}
          {phase === 'report' && <p>상담 보고서야. 파일로 저장하면 나중에 그대로 볼 수 있어</p>}
          {notice && <p>{notice}</p>}
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
          {phase === 'report' && <pre className="lucy-orb-report">{report}</pre>}
        </div>
        {phase !== 'report' && (
          <form className="lucy-orb-dock" onSubmit={(event) => { event.preventDefault(); phase === 'live' ? sendDraft() : undefined; }}>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={phase === 'pick' ? '먼저 적어도 돼. 마스터를 고르면 이 글부터 상담해' : '여기에 적어도 같은 상담이야'} aria-label="오브 상담 입력" />
            {phase === 'live' && <button type="submit">보내기</button>}
          </form>
        )}
        {phase === 'report' && master && (
          <div className="lucy-orb-dock">
            <button type="button" onClick={() => saveReportFile(master, report)}>보고서 파일 저장</button>
            <button type="button" onClick={keepReport}>채팅에 남기기</button>
          </div>
        )}
      </section>
    </ScreenPortal>
  );
}
