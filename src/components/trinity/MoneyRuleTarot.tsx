import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Coins, Sparkles, Volume2, VolumeX, ZoomIn } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { ORACLE_DECKS } from '@/data/oracleDecks';
import { getTodayDateKey } from '@/lib/dailyCache';
import { MONEY_RULE_POSITIONS, isMoneyRuleSession, moneyRuleNarration, moneyRuleReading, moneyRuleSummaryLines, type MoneyRuleSession } from '@/lib/moneyRuleTarot';
import { playTTSInChunks, prepareNaturalSpeechText, stopTTS, useTTSState } from '@/utils/tts';
import { DuoWorkspace } from '@/components/layout/DuoWorkspace';
import { TarotSpread } from './TarotSpread';
import { TarotFlippingCard } from './TarotFlippingCard';
import { TarotCardZoomModal } from './TarotCardZoomModal';
import { TarotSummaryGraphicCard } from './TarotSummaryGraphicCard';
import type { TarotCard } from '@/data/tarotData';

const STORAGE = 'luckey_money_rule_tarot_v1';
const ABUNDANCE = '나는 내가 만드는 가치를 존중하고, 기회를 살피며, 들어온 돈을 지혜롭게 관리합니다.';

export function MoneyRuleTarot({ onBack }: { onBack: () => void }) {
  const { sharedState, updateSharedState } = useApp();
  const tts = useTTSState();
  const [session, setSession] = useState<MoneyRuleSession | null>(() => {
    try { const value = JSON.parse(localStorage.getItem(STORAGE) || 'null'); return isMoneyRuleSession(value) ? value : null; } catch { return null; }
  });
  const [question, setQuestion] = useState('');
  const [drawing, setDrawing] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [zoomed, setZoomed] = useState<{ card: TarotCard; slotName: string } | null>(null);
  const latest = useRef(sharedState);
  latest.current = sharedState;
  const summaryLines = useMemo(() => session ? moneyRuleSummaryLines(session) : [], [session]);
  const summarySpeech = summaryLines.join('\n');
  const fullSpeech = session ? moneyRuleNarration(session) : '';
  const speakingText = (text: string) => Boolean((tts.isSpeaking || tts.isLoading) && text && tts.activeFullText === prepareNaturalSpeechText(text));
  const summarySpeaking = speakingText(summarySpeech);
  const fullSpeaking = speakingText(fullSpeech);

  useEffect(() => {
    const cloud = sharedState?.oracleSessions?.money_rule;
    if (isMoneyRuleSession(cloud)) setSession(current => !current || cloud.createdAt > current.createdAt ? cloud : current);
  }, [sharedState?.oracleSessions?.money_rule]);
  useEffect(() => () => stopTTS(), []);
  useEffect(() => {
    if (session) { try { localStorage.setItem(STORAGE, JSON.stringify(session)); } catch { setSaveError(true); } }
  }, [session]);

  const save = async (value: MoneyRuleSession) => {
    const state = latest.current;
    setSaveError(false);
    try {
      await updateSharedState({ oracleSessions: { ...state?.oracleSessions, money_rule: value }, todayOracles: {
        ...state?.todayOracles, [getTodayDateKey()]: { ...state?.todayOracles?.[getTodayDateKey()], oracle_money_rule: { mode: 'money', cards: value.cards.map(c => c.nameKo), summary: moneyRuleNarration(value), timestamp: value.createdAt } },
      } }, 'trinity_oracle');
    } catch { setSaveError(true); }
  };

  const playSpeech = (text: string) => {
    void playTTSInChunks(text, 'Kore', 110, undefined, undefined, { isUserToggleClick: true });
  };

  return <section className="mx-auto w-full max-w-6xl space-y-5 pb-24 text-amber-50" aria-label="머니룰 타로">
    <header className="relative overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-[#16382c] via-[#10271f] to-[#151b19] p-5 sm:p-7">
      <button onClick={() => { stopTTS(); onBack(); }} className="mb-4 flex items-center gap-2 text-sm text-amber-100/80"><ArrowLeft size={16} />오라클 타로</button>
      <span className="text-xs tracking-[.25em] text-amber-300">THE SECRET OF ABUNDANCE</span>
      <h2 className="mt-2 flex items-center gap-3 text-2xl sm:text-3xl font-serif text-amber-100"><Coins />머니룰 타로</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-amber-50/85">78장 링에서 세 자리를 고르면, 다른 오라클과 같은 카드 공개·크게보기·3줄 요약으로 머니룰을 읽습니다.</p>
      <p className="mt-3 text-xs leading-6 text-amber-100/70">선정 덱 · {ORACLE_DECKS.money.name} · {ORACLE_DECKS.money.cards.length}장<br />{ORACLE_DECKS.money.edition} · <a href={ORACLE_DECKS.money.source} target="_blank" rel="noreferrer" className="underline">공개 원본 출처</a></p>
    </header>

    <div className="rounded-3xl border border-amber-200/15 bg-[#14251f] p-5">
      <label htmlFor="money-rule-question" className="text-sm text-amber-100">지금 열고 싶은 풍요의 문</label>
      <input id="money-rule-question" value={question} maxLength={300} onChange={e => setQuestion(e.target.value)} placeholder="예: 내 가치를 수입으로 연결하려면 무엇을 바꿀까?" className="mt-3 w-full rounded-xl border border-amber-100/20 bg-black/25 p-3 text-sm text-white placeholder:text-zinc-400" />
      <button onClick={() => { stopTTS(); setDrawing(true); }} className="mt-4 flex items-center gap-2 rounded-xl bg-amber-200 px-5 py-3 font-bold text-[#153128]"><Sparkles size={16} />{session ? '새로운 머니룰 카드 뽑기' : '78장 링에서 카드 뽑기'}</button>
    </div>

    {drawing && <TarotSpread
      maxCards={3}
      positions={MONEY_RULE_POSITIONS}
      concern={question}
      deckSource={ORACLE_DECKS.money.cards}
      cardBackId="oracle_money"
      cardBackVariant="oracle"
      allowReversed
      spreadName="풍요를 여는 머니룰 스프레드"
      spreadReason={ORACLE_DECKS.money.reason}
      onCancel={() => setDrawing(false)}
      onComplete={cards => {
        const value: MoneyRuleSession = { version: 1, createdAt: Date.now(), question: question.trim(), cards: cards.map(c => ({ ...c, reversed: Boolean(c.reversed) })) };
        setSession(value);
        setDrawing(false);
        void save(value);
      }}
    />}

    {!drawing && session && <DuoWorkspace className="gap-5">
      <div className="duo-workspace-pair" aria-live="polite">
        <div className="space-y-2">
          <div className="duo-workspace-actions flex items-center justify-between gap-2 px-1">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-yellow-500/80">
              <Sparkles size={11} className="animate-pulse text-yellow-400" />
              <span>풍요를 여는 머니룰 스프레드 (3장)</span>
            </p>
            <span className="flex items-center gap-1 text-[10px] text-yellow-300/70">
              <ZoomIn size={11} className="text-yellow-400" />
              카드 클릭 시 확대 보기
            </span>
          </div>
          <div className="flex max-w-full flex-wrap justify-center gap-3.5 p-3" style={{ perspective: 1200 }}>
            {session.cards.map((card, index) => {
              const slotName = MONEY_RULE_POSITIONS[index];
              const shown = { ...card, reversed: Boolean(card.reversed) };
              return <TarotFlippingCard
                key={`${card.id}-${index}`}
                card={shown}
                index={index}
                size="md"
                slotName={slotName}
                cardBackId="oracle_money"
                onClick={() => setZoomed({ card: shown, slotName: `#${index + 1} ${slotName}` })}
              />;
            })}
          </div>
        </div>
        <TarotSummaryGraphicCard
          bullets={summaryLines}
          question={session.question || '풍요를 여는 머니룰'}
          readingText={fullSpeech}
          isTTSActive={summarySpeaking}
          onToggleTTS={() => playSpeech(summarySpeech)}
          title="머니룰 핵심 3줄 요약"
          subtitle="MONEY RULE · 세 자리의 금전 상징과 실천"
        />
      </div>

      <div className="glass relative flex flex-col space-y-4 overflow-hidden rounded-3xl border border-yellow-500/30 p-4 shadow-2xl sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/5 blur-[80px]" />
        <div className="duo-workspace-actions relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <Sparkles size={16} className="animate-pulse" />
            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-white sm:text-sm">Money Rule Insight</h3>
          </div>
          <button
            type="button"
            onClick={() => playSpeech(fullSpeech)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${fullSpeaking ? 'animate-pulse border border-yellow-400/40 bg-yellow-500/25 text-yellow-300' : 'border border-white/15 bg-white/10 text-white/90'}`}
          >
            {fullSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} className="text-yellow-400" />}
            <span>{fullSpeaking ? '중지' : '전체 낭독'}</span>
          </button>
        </div>
        {session.question && <p className="relative z-10 text-sm text-amber-100/90">나의 질문 · {session.question}</p>}
        <div className="relative z-10 space-y-4">
          {session.cards.map((card, index) => <article key={`${card.id}-reading`} className="space-y-1">
            <h4 className="text-sm font-bold text-amber-100">0{index + 1} · {MONEY_RULE_POSITIONS[index]} · {card.nameKo} <span className="text-xs font-normal text-amber-100/70">{card.reversed ? '역방향' : '정방향'}</span></h4>
            <p className="text-sm leading-7 text-zinc-200">{moneyRuleReading(card, index)}</p>
          </article>)}
        </div>
        <blockquote className="relative z-10 rounded-2xl border border-amber-300/25 bg-gradient-to-r from-amber-400/10 to-emerald-400/5 p-5 text-center leading-8 text-amber-100">{ABUNDANCE}</blockquote>
        <p className="relative z-10 text-center text-xs leading-6 text-zinc-400">카드 상징 기반 리딩입니다. 실제 재물 증가나 투자 성과를 보장하지 않으며, 결과는 이 기기에 저장됩니다.</p>
      </div>
    </DuoWorkspace>}

    <TarotCardZoomModal
      isOpen={!!zoomed}
      onClose={() => setZoomed(null)}
      card={zoomed?.card ?? null}
      slotName={zoomed?.slotName}
    />
    {saveError && <p role="status" className="text-sm text-amber-200">저장 또는 동기화를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.<button onClick={() => { if (session) void save(session); }} className="ml-2 underline">저장 재시도</button></p>}
  </section>;
}
