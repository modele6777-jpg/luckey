import { useState, useEffect, useCallback } from 'react';
import {
  getSavedTarotCardBackId,
  saveTarotCardBackId,
  getTarotCardBackTheme,
  TarotCardBackTheme,
} from '@/data/tarotCardBacks';

export function useTarotCardBack(): {
  cardBackId: string;
  theme: TarotCardBackTheme;
  setCardBackId: (id: string) => void;
} {
  const [cardBackId, setCardBackIdState] = useState<string>(() => getSavedTarotCardBackId());

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'luckey_tarot_card_back_id' && e.newValue) {
        setCardBackIdState(e.newValue);
      }
    };

    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.cardBackId) {
        setCardBackIdState(detail.cardBackId);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('luckey-tarot-card-back-changed', handleCustom);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('luckey-tarot-card-back-changed', handleCustom);
    };
  }, []);

  const setCardBackId = useCallback((id: string) => {
    setCardBackIdState(id);
    saveTarotCardBackId(id);
  }, []);

  const theme = getTarotCardBackTheme(cardBackId);

  return { cardBackId, theme, setCardBackId };
}
