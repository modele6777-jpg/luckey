import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error) { console.error('[LucKey screen error]', error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    const loadFailure = /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script|Failed to fetch|module script/i.test(this.state.error?.message || '');
    return (
      <div role="alert" className="flex flex-1 min-h-0 w-full items-center justify-center px-4 py-28 bg-[#05060d] text-white overflow-y-auto">
        <div className="w-full max-w-md rounded-3xl border border-white/10 p-6 text-center space-y-5">
          <AlertTriangle size={36} className="mx-auto text-amber-300" />
          <h2 className="text-lg font-bold">잠시 화면을 표시하지 못했어요</h2>
          <p className="text-sm text-white/65 leading-relaxed">{loadFailure ? '연결이 불안정하거나 업데이트된 화면 파일을 불러오지 못했습니다. 연결을 확인한 뒤 다시 불러와 주세요.' : '현재 화면에서 일시적인 문제가 발생했습니다. 다시 시도하거나 오른쪽 메뉴에서 다른 화면으로 이동할 수 있어요.'}</p>
          {!loadFailure && <button type="button" onClick={() => this.setState({ hasError: false, error: null })} className="w-full rounded-xl bg-violet-600 px-4 py-3 hover:bg-violet-500">현재 화면 다시 시도</button>}
          <button type="button" onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 hover:bg-white/10"><RotateCcw size={16} />사이트 다시 불러오기</button>
        </div>
      </div>
    );
  }
}
export default ErrorBoundary;
