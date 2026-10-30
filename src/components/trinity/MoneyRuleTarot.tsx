import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Coins, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { TAROT_DECK } from '@/data/tarotData';
import { getTodayDateKey } from '@/lib/dailyCache';
import { MONEY_RULE_POSITIONS, isMoneyRuleSession, moneyRuleReading, moneyRuleNarration, type MoneyRuleSession } from '@/lib/moneyRuleTarot';
import { playTTSInChunks, stopTTS, useTTSActive } from '@/utils/tts';
import { TarotSpread } from './TarotSpread';
import { TarotFlippingCard } from './TarotFlippingCard';

const STORAGE = 'luckey_money_rule_tarot_v1';
export function MoneyRuleTarot({ onBack }: { onBack: () => void }) {
  const { sharedState, updateSharedState } = useApp();
  const ttsActive = useTTSActive();
  const [session, setSession] = useState<MoneyRuleSession | null>(() => {
    try { const value = JSON.parse(localStorage.getItem(STORAGE) || 'null'); return isMoneyRuleSession(value) ? value : null; } catch { return null; }
  });
  const [question, setQuestion] = useState('');
  const [drawing, setDrawing] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const latest = useRef(sharedState);
  latest.current = sharedState;
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
  return <section className="mx-auto max-w-5xl space-y-5 pb-24 text-amber-50" aria-label="머니룰 타로">
    <header className="relative overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-[#16382c] via-[#10271f] to-[#151b19] p-6 sm:p-8">
      <button onClick={() => { stopTTS(); onBack(); }} className="mb-6 flex items-center gap-2 text-sm text-amber-100/80"><ArrowLeft size={16} />오라클 타로</button>
      <span className="text-xs tracking-[.25em] text-amber-300">THE SECRET OF ABUNDANCE</span>
      <h2 className="mt-3 flex items-center gap-3 text-3xl font-serif text-amber-100"><Coins />머니룰 타로</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-amber-50/85">돈복과 재물운을 초대하는 나만의 시크릿 리추얼.<br />카드를 볼 때마다 풍요의 가능성을 발견하고, 나만의 머니룰을 쌓아가세요.</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-amber-200">{MONEY_RULE_POSITIONS.map(p => <span key={p} className="rounded-full border border-amber-200/20 px-3 py-2">{p}</span>)}</div>
    </header>
    {drawing ? <div className="rounded-3xl border border-amber-300/20 bg-black/25 p-3 sm:p-5">
      <TarotSpread maxCards={3} positions={MONEY_RULE_POSITIONS} concern={question} deckSource={TAROT_DECK} cardBackId="oracle_money" allowReversed spreadName="풍요를 여는 머니룰 스프레드" onCancel={() => setDrawing(false)} onComplete={cards => {
        const value: MoneyRuleSession = { version: 1, createdAt: Date.now(), question: question.trim(), cards: cards.map(c => ({ ...c, reversed: Boolean(c.reversed) })) };
        setSession(value); setDrawing(false); void save(value);
      }} />
    </div> : <div className="rounded-3xl border border-amber-200/15 bg-[#14251f] p-5">
      <label htmlFor="money-rule-question" className="text-sm text-amber-100">지금 열고 싶은 풍요의 문</label>
      <input id="money-rule-question" value={question} maxLength={300} onChange={e => setQuestion(e.target.value)} placeholder="예: 내 가치를 수입으로 연결하려면 무엇을 바꿀까?" className="mt-3 w-full rounded-xl border border-amber-100/20 bg-black/25 p-3 text-sm text-white placeholder:text-zinc-400" />
      <button onClick={() => { stopTTS(); setDrawing(true); }} className="mt-4 flex items-center gap-2 rounded-xl bg-amber-200 px-5 py-3 font-bold text-[#153128]"><Sparkles size={16} />{session ? '새로운 머니룰 카드 뽑기' : '나의 머니룰 카드 뽑기'}</button>
    </div>}
    {!drawing && session && <div className="space-y-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-semibold">나의 시크릿 리딩</h3><button onClick={() => { if (ttsActive) stopTTS(); else void playTTSInChunks(moneyRuleNarration(session)); }} className="flex items-center gap-2 rounded-xl border border-amber-100/20 px-4 py-2 text-sm"><Volume2 size={16} />{ttsActive ? '듣기 중지' : '리딩 듣기'}</button></div>
      {session.question && <p className="text-sm text-amber-100/80">{session.question}</p>}
      <div className="grid gap-4 md:grid-cols-3">{session.cards.map((card, i) => <article key={card.id} className="rounded-2xl border border-amber-100/15 bg-[#14251f] p-5">
        <p className="mb-4 text-xs tracking-wider text-amber-300">0{i + 1} · {MONEY_RULE_POSITIONS[i]}</p>
        <div className="flex justify-center"><TarotFlippingCard card={card} index={i} slotName={MONEY_RULE_POSITIONS[i]} size="md" cardBackId="oracle_money" /></div>
        <h4 className="mt-4 font-bold">{card.nameKo} <span className="text-xs font-normal text-amber-100/70">{card.reversed ? '역방향' : '정방향'}</span></h4>
        <p className="mt-3 text-sm leading-7 text-zinc-200">{moneyRuleReading(card, i)}</p>
      </article>)}</div>
      <blockquote className="rounded-2xl border border-amber-300/25 bg-gradient-to-r from-amber-400/10 to-emerald-400/5 p-6 text-center leading-8 text-amber-100">나는 내가 만드는 가치를 존중하고,<br />기회를 살피며, 들어온 돈을 지혜롭게 관리합니다.</blockquote>
      <p className="text-center text-xs text-zinc-400">카드 상징 기반 리딩 · 최근 결과는 저장되어 언제든 다시 볼 수 있습니다.</p>
    </div>}
    {saveError && <p role="status" className="text-sm text-amber-200">저장 또는 동기화를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.<button onClick={() => { if(session) void save(session); }} className="ml-2 underline">저장 재시도</button></p>}
    <p className="text-center text-xs leading-6 text-zinc-400">카드를 반복해서 보는 것은 풍요의 관점과 습관을 가꾸는 리추얼입니다. 실제 재물 증가나 투자 성과를 보장하지 않습니다.</p>
  </section>;
}
