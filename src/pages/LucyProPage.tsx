import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { PageLoader } from '@/components/PageLoader';

/** Keep installed legacy Pro links on the unified Lucy room. */
export default function LucyProPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate('/chat', { replace: true });
  }, [navigate]);
  return <PageLoader />;
}
