import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

function reloadFresh() {
  const go = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('recover', String(Date.now()));
    window.location.replace(url.toString());
  };
  const clear = (async () => {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  })();
  void clear.finally(go);
  window.setTimeout(go, 1500);
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error) { console.error('[LucKey screen error]', error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    const loadFailure = /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script|Failed to fetch|module script/i.test(this.state.error?.message || '');
    return (
      <div role="alert" className="fixed inset-0 z-[100000] flex items-center justify-center overflow-y-auto bg-[#f7f4ee] px-4 py-16 text-slate-900">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl space-y-5">
          <AlertTriangle size={36} className="mx-auto text-amber-600" />
          <h2 className="text-lg font-bold">잠시 화면을 표시하지 못했어요</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{loadFailure ? '연결이 불안정하거나 업데이트된 화면 파일을 불러오지 못했습니다. 연결을 확인한 뒤 다시 불러와 주세요.' : '현재 화면에서 일시적인 문제가 발생했습니다. 다시 시도하거나 오른쪽 메뉴에서 다른 화면으로 이동할 수 있어요.'}</p>
          {!loadFailure && <button type="button" onClick={() => this.setState({ hasError: false, error: null })} className="w-full rounded-xl bg-violet-600 px-4 py-3 text-white hover:bg-violet-500">현재 화면 다시 시도</button>}
          <button type="button" onClick={reloadFresh} className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 hover:bg-slate-50"><RotateCcw size={16} />사이트 다시 불러오기</button>
        </div>
      </div>
    );
  }
}
export default ErrorBoundary;
