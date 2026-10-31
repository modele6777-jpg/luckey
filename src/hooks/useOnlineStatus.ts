import { useState, useEffect, useCallback } from 'react';

/**
 * 네트워크 온라인/오프라인 상태를 실시간으로 추적하는 훅.
 * 브라우저의 online/offline 이벤트와 navigator.onLine을 함께 사용해
 * 네트워크가 끊기는 순간과 복구되는 순간을 즉시 감지합니다.
 */
export function useOnlineStatus(): { isOnline: boolean; justBackOnline: boolean } {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );
  const [justBackOnline, setJustBackOnline] = useState(false);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setJustBackOnline(true);
    window.setTimeout(() => setJustBackOnline(false), 4000);
  }, []);

  const handleOffline = useCallback(() => setIsOnline(false), []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline, justBackOnline };
}
