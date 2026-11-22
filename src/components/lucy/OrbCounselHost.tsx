import { LucyOrbCounsel } from '@/components/lucy/LucyOrbCounsel';
import { getPersistentUserProfile, useApp } from '@/contexts/AppContext';
import { saveUnifiedMessagesSafely } from '@/lib/chatHistorySync';
import { isLucyMasterModeOn } from '@/lib/lucyMasterMode';
import { setOrbCounselOpen, useOrbCounselOpen } from '@/lib/orbCounselGate';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import { useMemo } from 'react';

/** 사이드바·빅뱅에서 연 음성 오브. 어느 채널에서 열어도 같은 상담이 뜬다. */
export function OrbCounselHost() {
  const open = useOrbCounselOpen();
  const { sharedState, setPersonaMessages, setLucyProMessages } = useApp();
  const profile = sharedState?.userProfile || getPersistentUserProfile();
  const nickname = profile?.basic?.nickname || profile?.basic?.name || '';
  const chart = useMemo(() => {
    try { return calculateDetailedSaju(profile)?.systemPromptSummary || ''; }
    catch { return ''; }
  }, [profile]);

  return (
    <LucyOrbCounsel
      open={open}
      nickname={nickname}
      chart={chart}
      onFinish={(summary) => {
        setOrbCounselOpen(false);
        if (!summary) return;
        const message = {
          id: `orb-${Date.now()}`,
          role: 'model' as const,
          content: summary,
          timestamp: Date.now(),
          persona: 'lucy' as const,
          mode: isLucyMasterModeOn() ? 'master' as const : 'casual' as const,
        };
        if (isLucyMasterModeOn()) {
          setLucyProMessages((prev) => [...prev, message]);
          return;
        }
        setPersonaMessages((prev) => {
          const next = [...(prev.lucy || []), message];
          saveUnifiedMessagesSafely(next);
          return { ...prev, lucy: next, orange: next, trinity: next, aura: next, bluebird: next, muse: next };
        });
      }}
    />
  );
}
