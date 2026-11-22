import { LucyOrbCounsel } from '@/components/lucy/LucyOrbCounsel';
import { getPersistentUserProfile, useApp } from '@/contexts/AppContext';
import { saveUnifiedMessagesSafely } from '@/lib/chatHistorySync';
import { isLucyMasterModeOn } from '@/lib/lucyMasterMode';
import { setOrbCounselOpen } from '@/lib/orbCounselGate';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';

/** Orb is a page, not a popup. Only this route is active while it is open. */
export function OrbPage() {
  const [, navigate] = useLocation();
  const { sharedState, setPersonaMessages, setLucyProMessages } = useApp();
  const profile = sharedState?.userProfile || getPersistentUserProfile();
  const nickname = profile?.basic?.nickname || profile?.basic?.name || '';
  const chart = useMemo(() => {
    try { return calculateDetailedSaju(profile)?.systemPromptSummary || ''; }
    catch { return ''; }
  }, [profile]);

  useEffect(() => {
    setOrbCounselOpen(true);
    return () => setOrbCounselOpen(false);
  }, []);

  return (
    <LucyOrbCounsel
      open
      nickname={nickname}
      chart={chart}
      onFinish={(summary) => {
        if (summary) {
          const message = {
            id: `orb-${Date.now()}`,
            role: 'model' as const,
            content: summary,
            timestamp: Date.now(),
            persona: 'lucy' as const,
            mode: isLucyMasterModeOn() ? 'master' as const : 'casual' as const,
          };
          if (isLucyMasterModeOn()) setLucyProMessages((prev) => [...prev, message]);
          else {
            setPersonaMessages((prev) => {
              const next = [...(prev.lucy || []), message];
              saveUnifiedMessagesSafely(next);
              return { ...prev, lucy: next, orange: next, trinity: next, aura: next, bluebird: next, muse: next };
            });
          }
        }
        navigate('/');
        window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/' } }));
      }}
    />
  );
}