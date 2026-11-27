import { useEffect, useState, useCallback } from 'react';
import { loadInterpretiveTarotSummary } from '@/lib/interpretiveTarotSummary';

const EMPTY_SUMMARY: string[] = [];

export function useInterpretiveTarotSummary(reading: string | null | undefined, concern: string, enabled = true, includeCaution = true) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ reading: string; concern: string; bullets: string[]; error: boolean; includeCaution: boolean } | null>(null);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
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
  return { bullets: matching?.bullets || EMPTY_SUMMARY, error: matching?.error || false, loading: enabled && !!reading && reading.trim().length >= 40 && !matching, retry };
}
