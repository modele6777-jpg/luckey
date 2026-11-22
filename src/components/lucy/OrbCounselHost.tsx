import { LucyOrbCounsel } from '@/components/lucy/LucyOrbCounsel';
import { getPersistentUserProfile, useApp } from '@/contexts/AppContext';
import { setOrbCounselOpen } from '@/lib/orbCounselGate';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import { requestLucyAction } from '@/lib/duoLucyActionRouting';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';

/** Orb is a page, not a popup. Only this route is active while it is open. */
export function OrbPage() {
  const [, navigate] = useLocation();
  const { sharedState } = useApp();
  const persistentProfile = getPersistentUserProfile();
  const profile = sharedState?.userProfile || persistentProfile;
  const nickname = sharedState?.userProfile?.basic?.nickname?.trim()
    || sharedState?.userProfile?.basic?.name?.trim()
    || persistentProfile?.basic?.nickname?.trim()
    || persistentProfile?.basic?.name?.trim()
    || '';
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
        // 상담 보고서는 내 말풍선으로 루시에게 보내고, 루시가 그 보고서에 바로 답한다.
        if (summary) requestLucyAction({ prompt: `${summary}\n\n오브 상담을 마쳤어. 이 보고서를 보고 루시 생각을 들려줘.` });
        // 접힌 화면은 requestLucyAction이 루시 채팅으로 이동한다. 펼친 화면(또는 보고서 없음)은 예전처럼 처음 화면으로 돌아간다.
        if (!summary || document.getElementById('duo-lucy-viewport')) {
          navigate('/');
          window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/' } }));
        }
      }}
    />
  );
}
