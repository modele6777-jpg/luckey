import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { LucKeyLogoText } from './LucKeyLogoText';
export function LoginScreen() {
  const { signInWithGoogle, signInAsDeveloper, signInAsPairedSession, importDevicePairingCode } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPairingInput, setShowPairingInput] = useState(false);
  const [pairingCode, setPairingCode] = useState('');
  const [pairingStatus, setPairingStatus] = useState<string | null>(null);

  const handlePairingSubmit = async () => {
    if (pairingCode.trim().length !== 6) {
      setError('6자리 연동 코드를 정확히 입력해주세요.');
      return;
    }
    setLoading(true);
    setPairingStatus('PC/다른 기기의 데이터를 가져오는 중...');
    setError(null);
    try {
      const res = await importDevicePairingCode(pairingCode.trim());
      if (res.success) {
        setPairingStatus('🎉 연동 성공! 실시간 데이터 연결을 활성화합니다...');
        setTimeout(() => {
          signInAsPairedSession();
        }, 800);
      } else {
        setError(res.message || '유효하지 않거나 만료된 연동 코드입니다.');
        setPairingStatus(null);
      }
    } catch (e: any) {
      setError('연동 중 오류가 발생했습니다: ' + (e?.message || '알 수 없음'));
      setPairingStatus(null);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Login button */}
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
            ✨ 같은 Google 계정으로 로그인 시 PC와 모바일의 모든 정보가 실시간 자동 동기화됩니다.
          </p>

          {/* Developer mode / Instant preview bypass button across all environments */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInAsDeveloper}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all bg-white/5 backdrop-blur-md hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer"
          >
            개발자/프리뷰 모드로 즉시 시작하기 (기기 자동 연동)
          </motion.button>

          {/* 6-digit Device Pairing Option */}
          <div className="w-full">
            {!showPairingInput ? (
              <button
                type="button"
                onClick={() => setShowPairingInput(true)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-amber-300/80 hover:text-amber-200 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡ PC ⇄ 모바일 6자리 코드로 연동하기</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3.5 rounded-2xl bg-white/5 border border-amber-500/30 flex flex-col gap-2.5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">6자리 연동 코드 입력</span>
                  <button
                    type="button"
                    onClick={() => { setShowPairingInput(false); setPairingStatus(null); setError(null); }}
                    className="text-[11px] text-white/40 hover:text-white/70"
                  >
                    닫기
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="6자리 숫자"
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    className="flex-1 px-3 py-2 bg-black/50 rounded-xl text-sm font-mono tracking-widest text-center text-yellow-400 font-bold border border-white/15 outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    disabled={loading || pairingCode.trim().length !== 6}
                    onClick={handlePairingSubmit}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-xl text-xs transition-all cursor-pointer shrink-0 shadow-md"
                  >
                    {loading ? '연동 중...' : '연동 시작'}
                  </button>
                </div>
                {pairingStatus && (
                  <p className="text-[11px] text-emerald-300 text-center">{pairingStatus}</p>
                )}
              </motion.div>
            )}
          </div>

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
