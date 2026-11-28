import { useEffect, useState, useCallback, useMemo } from 'react';
import { loadInterpretiveTarotSummary, resolveTarotSummaryForDisplay } from '@/lib/interpretiveTarotSummary';

const EMPTY_SUMMARY: string[] = [];

export function useInterpretiveTarotSummary(reading: string | null | undefined, concern: string, enabled = true, includeCaution = true, cards?: any[]) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ reading: string; concern: string; bullets: string[]; error: boolean; includeCaution: boolean } | null>(null);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  const fallbackBullets = useMemo(
    () => enabled ? resolveTarotSummaryForDisplay(reading, concern, [], cards) : EMPTY_SUMMARY,
    [reading, concern, enabled, cards],
  );
  useEffect(() => {
    if (!enabled || !reading || reading.trim().length < 40) return;
    let current = true;
    setResult(null);
    loadInterpretiveTarotSummary(reading, concern, includeCaution).then(bullets => {
      if (current) setResult({ reading, concern, bullets, error: false, includeCaution });
    }).catch(() => {
      if (current) setResult({ reading, concern, bullets: [], error: true, includeCaution });
    });
    return () => { current = false; };
  }, [reading, concern, enabled, attempt, includeCaution]);
  const matching = enabled && result?.reading === reading && result?.concern === concern && result?.includeCaution === includeCaution ? result : null;
  const bullets = matching?.bullets.length === 3 ? matching.bullets : fallbackBullets;
  // 모델이 거절·실패해도 본문에서 만든 3줄이 있으면 실패 배너를 붙이지 않는다.
  const failedWithoutSummary = Boolean(matching?.error) && bullets.length !== 3;
  return { bullets, error: failedWithoutSummary, loading: enabled && !!reading && reading.trim().length >= 40 && !matching, retry };
}
