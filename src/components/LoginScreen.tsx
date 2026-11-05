import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { LucKeyLogoText } from './LucKeyLogoText';
export function LoginScreen() {
  const { signInWithGoogle, signInAsDeveloper } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    // Safety timeout to prevent infinite loading state if popup hangs
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 60000); // 1 minute max

    try {
      await signInWithGoogle();
    } catch (e: any) {
      if (
        e.code === 'auth/popup-closed-by-user' ||
        e.code === 'auth/cancelled-popup-request'
      ) {
        // User closed popup — not an error
        return;
      }
      const knownErrors: Record<string, string> = {
        'auth/unauthorized-domain': `이 도메인(${location.hostname})은 Firebase에 등록되지 않았습니다.\nFirebase 콘솔 -> Authentication -> Authorized domains 에 추가 필요.`,
        'auth/network-request-failed': '네트워크 오류. 인터넷 연결을 확인해주세요.',
        'auth/too-many-requests': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        'auth/popup-blocked': '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.',
      };
      setError(knownErrors[e.code] ?? `로그인 오류 [${e.code ?? e.message}]`);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-transparent px-6 pt-safe pb-safe relative overflow-x-hidden overflow-y-auto z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm"
      >
        {/* Logo area */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24 rounded-3xl border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.15)] group mx-auto backdrop-blur-md bg-zinc-900/60">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-amber-500/15 to-cyan-500/20 opacity-40 mix-blend-screen rounded-3xl" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="absolute -inset-2 rounded-full border border-dashed border-emerald-400/20" />
            <div className="relative z-10 flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16 C16 11, 12 9, 12 12 C12 15, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                  <path d="M16 16 C21 16, 23 12, 20 12 C17 12, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                  <path d="M16 16 C16 21, 20 23, 20 20 C20 17, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                  <path d="M16 16 C11 16, 9 20, 12 20 C15 20, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                </g>
                <g stroke="#fcd34d" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="16" cy="16" r="2.5" fill="#fde047" stroke="none" />
                  <path d="M16 18.5 L16 25" />
                  <path d="M16 23 L18.5 23" />
                  <path d="M16 25 L18 25" />
                </g>
              </svg>
            </div>
          </div>

          <div className="text-center mt-2">
            <LucKeyLogoText size="lg" />
          </div>

          <p className="text-center text-sm text-white/50 leading-relaxed max-w-xs mt-1 mb-8">
            행운(Luck)과 지혜의 해답(Key)을 여는<br />
            당신만의 소울 안식처 &amp; AI 페르소나 유니버스
          </p>
        </div>

        {/* Login buttons */}
        <div className="w-full flex flex-col gap-3.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-medium text-base flex items-center justify-center gap-3 transition-all"
            style={{
              background: 'oklch(0.75 0.12 50)',
              color: 'oklch(0.10 0.015 270)',
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 시작하기
              </>
            )}
          </motion.button>

          <p className="text-[11px] text-center text-emerald-400/90 font-medium">
            ✨ 같은 Google 계정으로 로그인하면 PC와 모바일에서 대화와 공유 데이터가 동기화됩니다.
          </p>

          <button
            type="button"
            onClick={() => signInAsDeveloper()}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-emerald-300 border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Code2 size={17} aria-hidden="true" />
            개발자 모드로 로그인
          </button>

          {error && (
            <p className="text-center text-sm text-red-400 whitespace-pre-line">{error}</p>
          )}
        </div>

        <p className="text-xs text-white/25 text-center flex items-center justify-center gap-1">
          LucKey 유니버스에 오신 것을 환영합니다 🍀
        </p>
      </motion.div>
    </div>
  );
}
