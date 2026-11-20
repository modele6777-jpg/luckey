import { useState } from 'react';
import { TarotSpread } from '@/components/trinity/TarotSpread';
import { toDetectedTarotCards } from '@/lib/lucyMasterMode';
import type { DetectedTarotCard } from '@/utils/tarotDetector';
import { requestLucyAction } from '@/lib/duoLucyActionRouting';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';

const KEY = 'lucy_master_daily_card';
const kstToday = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });

function readToday(): DetectedTarotCard | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null') as { date?: string; card?: DetectedTarotCard } | null;
    return saved?.date === kstToday() && saved.card ? saved.card : null;
  } catch { return null; }
}

/**
 * "Today's card" on the unfolded tarot table. The user shuffles and picks it
 * (never auto-drawn); it stays face-up for the rest of the KST day.
 */
export function MasterDailyCard() {
  const [card, setCard] = useState<DetectedTarotCard | null>(() => readToday());
  const [picking, setPicking] = useState(false);

  const ask = (picked: DetectedTarotCard) => requestLucyAction({
    prompt: `오늘의 한 장으로 ${picked.nameKo}(${picked.orientationKo})를 뽑았어. 이 카드를 오늘 하루에 맞춰 풀어줘.`,
  });

  return (
    <div className="mx-3.5 mt-2 mb-1 flex items-center gap-3 rounded-2xl border border-amber-300/30 bg-[#1a0f2e]/85 p-2.5 backdrop-blur-sm" data-master-daily-card={card ? 'open' : 'closed'}>
      {card ? (
        <>
          <img src={card.imageUrl} alt={card.nameKo} className={`h-20 w-12 shrink-0 rounded-md object-cover shadow-lg ${card.reversed ? 'rotate-180' : ''}`} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-wide text-amber-300/90">오늘의 한 장</p>
            <p className="truncate text-sm font-black text-white">{card.nameKo} <span className="text-[11px] font-semibold text-violet-200">{card.orientationKo}</span></p>
            <button
              type="button"
              onClick={() => { triggerHaptic('whitehole'); ask(card); }}
              className="mt-1.5 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-[11px] font-bold text-amber-100 active:scale-95"
            >루시에게 풀이 듣기</button>
          </div>
        </>
      ) : (
        <>
          <div className="h-20 w-12 shrink-0 rounded-md border border-amber-300/50 bg-gradient-to-br from-violet-700 via-indigo-900 to-violet-950 shadow-[0_0_14px_rgba(192,132,252,0.45)] flex items-center justify-center text-amber-200" aria-hidden="true">✦</div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-wide text-amber-300/90">오늘의 한 장</p>
            <p className="text-[12px] text-slate-200 break-keep">오늘 하루를 비춰 줄 카드를 직접 섞고 한 장 골라 보세요.</p>
            <button
              type="button"
              onClick={() => { triggerHaptic('whitehole'); setPicking(true); }}
              className="mt-1.5 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-[11px] font-bold text-amber-100 active:scale-95"
            >오늘의 카드 뽑기</button>
          </div>
        </>
      )}
      {picking && (
        <TarotSpread
          maxCards={1}
          positions={['오늘 나에게 온 카드']}
          spreadName="오늘의 한 장"
          spreadReason="섞고 마음이 가는 카드 한 장을 골라 주세요"
          allowReversed
          ambience="master"
          onCancel={() => setPicking(false)}
          onComplete={(picked) => {
            setPicking(false);
            const [next] = toDetectedTarotCards(picked);
            if (!next) return;
            try { localStorage.setItem(KEY, JSON.stringify({ date: kstToday(), card: next })); } catch { /* optional storage */ }
            setCard(next);
            ask(next);
          }}
        />
      )}
    </div>
  );
}
