import { createPortal } from 'react-dom';

export function LucyModeTransition({ target }: { target: 'lucy' | 'plus' }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="lucy-mode-transition" data-lucy-mode-transition={target} role="status" aria-live="polite" aria-busy="true">
      <div className="lucy-mode-transition-card">
        <span className="lucy-mode-transition-ring" aria-hidden="true" />
        <strong className="lucy-transition-wordmark" aria-label={target === 'plus' ? 'Lucy +' : 'Lucy'}>
          Lucy<span className="lucy-transition-plus" aria-hidden="true">+</span>
        </strong>
        <span>{target === 'plus' ? '마스터 모드로 전환하고 있어요' : '일반 모드로 돌아가고 있어요'}</span>
      </div>
    </div>, document.body
  );
}
