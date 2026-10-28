import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/** Legacy channel readers do not have an inline error area. */
export function TTSFailureNotice() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const onError = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      if (typeof detail?.message === 'string') setMessage(detail.message);
    };
    window.addEventListener('prism:tts-error', onError);
    return () => window.removeEventListener('prism:tts-error', onError);
  }, []);
  if (!message) return null;
  return createPortal(
    <div role="alert" className="fixed top-20 left-4 right-4 z-[10030] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 shadow-xl">
      <span className="flex-1">{message}</span>
      <button type="button" className="shrink-0 rounded-lg px-2 py-1 font-medium hover:bg-amber-100" onClick={() => setMessage('')}>닫기</button>
    </div>, document.body,
  );
}
