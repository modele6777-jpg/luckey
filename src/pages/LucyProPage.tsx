import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { PageLoader } from '@/components/PageLoader';
import { safeSessionStorage } from '@/utils/safeStorage';

/** Keep installed legacy Pro links on the unified room and its mode state. */
export default function LucyProPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    safeSessionStorage.setItem('lucy_plus_active', 'true');
    navigate('/chat', { replace: true });
  }, [navigate]);
  return <PageLoader />;
}
