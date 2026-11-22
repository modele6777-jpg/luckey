import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { startGeminiLiveVoice, type LiveVoiceSession } from '@/lib/geminiLiveSession';
import { drawLucyTarotCards } from '@/utils/tarotDetector';
import React, { useEffect, useRef, useState } from 'react';
import './lucy-orb-counsel.css';

type Line = { who: '나' | '루시'; text: string };

function mergeTranscript(previous: string, next: string): string {
  const line = next.replace(/\s+/g, ' ').trim();
  if (!line) return previous;
  if (!previous || line.startsWith(previous) || previous.startsWith(line)) return line.length >= previous.length ? line : previous;
  return `${previous} ${line}`.trim();
}

function summaryFrom(lines: Line[]): string | null {
  const said = lines.filter(line => line.who === '나').map(line => line.text).slice(-4).join(' ');
  const answered = lines.filter(line => line.who === '루시').map(line => line.text).slice(-4).join(' ');
  if (!said && !answered) return null;
  return ['오브 상담 요약', said ? `네가 한 말: ${said}` : '', answered ? `루시가 남긴 말: ${answered}` : ''].filter(Boolean).join('\n');
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
  const [ready, setReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const sessionRef = useRef<LiveVoiceSession | null>(null);
  const linesRef = useRef<Line[]>([]);
  const userBuf = useRef('');
  const lucyBuf = useRef('');
  const closedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const publish = () => {
    linesRef.current = [...linesRef.current];
    setLines(linesRef.current);
  };
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
    setLines([]);
    setDraft('');
    setNotice('');
    setReady(false);
    setSpeaking(false);
    const appear = window.setTimeout(() => setReady(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1700);
    const cards = drawLucyTarotCards(3).map((card, index) => `${index + 1}번 ${card.nameKo} ${card.orientationKo}`).join(', ');
    const session = startGeminiLiveVoice({
      nickname,
      chart,
      cards,
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
    return () => {
      window.clearTimeout(appear);
      session.stop();
      if (sessionRef.current === session) sessionRef.current = null;
    };
  }, [open, nickname, chart]);

  if (!open) return null;

  const finish = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (userBuf.current) take('나', userBuf);
    if (lucyBuf.current) take('루시', lucyBuf);
    sessionRef.current?.stop();
    onFinishRef.current(summaryFrom(linesRef.current));
  };

  const sendDraft = () => {
    const text = draft.trim();
    if (!text) return;
    sessionRef.current?.sendText(text);
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
              width: 180 + index * 70,
              height: 140 + index * 48,
              left: `${8 + index * 12}%`,
              top: `${18 + (index % 3) * 16}%`,
              animationDelay: `${index * 0.12}s`,
            }}
          />
        ))}
        <button type="button" className="lucy-orb-end" onClick={finish}>상담 끝내기</button>
        <div className="lucy-orb-body" aria-hidden="true" />
        <div className="lucy-orb-copy">
          <p>{ready ? (speaking ? '루시가 말하고 있어' : '듣고 있어. 말해도 되고, 적어도 돼') : '안개 속에서 오브가 나오고 있어'}</p>
          {notice && <p>{notice}</p>}
          <div className="lucy-orb-lines">
            {lines.slice(-3).map((line, index) => <span key={`${line.who}-${index}`}>{line.who}: {line.text}</span>)}
          </div>
        </div>
        <form className="lucy-orb-dock" onSubmit={(event) => { event.preventDefault(); sendDraft(); }}>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="여기에 적어도 같은 상담이야" aria-label="오브 상담 입력" />
          <button type="submit">보내기</button>
        </form>
      </section>
    </ScreenPortal>
  );
}
