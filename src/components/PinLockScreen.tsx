/**
 * PIN 잠금 화면 — cosmic glassmorphism 리디자인 (cosmic-1202)
 * PIN 코드는 1202 (src/contexts/AppContext.tsx).
 * 은은한 앰비언트 글로우 + 황금빛 브랜딩 + 글래스 키패드 + 스프링 인디케이터 + 오류 쉐이크.
 * 키보드 입력(0-9, Backspace, Enter)과 오디오 컨텍스트 잠금 해제(ensureAudioUnlocked)는 유지.
 */
import React from 'react';
import { motion } from 'motion/react';
import { Delete, KeyRound } from 'lucide-react';
import { APP_VERSION } from '@/lib/appVersion';
import { getSharedAudioContext } from '@/lib/audio';

export const PIN_SCREEN_SPEC = 'cosmic-1202' as const;

const PIN_BG = 'oklch(0.07 0.02 280)';
const PIN_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '←'] as const;

type PinLockScreenProps = {
  onUnlock: (code: string) => boolean;
};

export function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const [pin, setPin] = React.useState('');
  const [pinError, setPinError] = React.useState(false);
  const pinRef = React.useRef(pin);
  pinRef.current = pin;

  const ensureAudioUnlocked = () => {
    try {
      const ctx = getSharedAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch (_) {}
  };

  const submitPin = React.useCallback((nextPin: string) => {
    ensureAudioUnlocked();
    if (nextPin.length !== 4) return;
    if (onUnlock(nextPin)) {
      setPin('');
      setPinError(false);
      return;
    }
    setPinError(true);
    window.setTimeout(() => {
      setPin('');
      setPinError(false);
    }, 650);
  }, [onUnlock]);

  const appendPinDigit = React.useCallback((digit: string) => {
    ensureAudioUnlocked();
    setPin((prev) => {
      if (prev.length >= 4) return prev;
      const nextPin = `${prev}${digit}`;
      if (nextPin.length === 4) {
        window.setTimeout(() => submitPin(nextPin), 0);
      }
      return nextPin;
    });
    setPinError(false);
  }, [submitPin]);

  const backspacePin = React.useCallback(() => {
    ensureAudioUnlocked();
    setPin((prev) => prev.slice(0, -1));
    setPinError(false);
  }, []);

  React.useEffect(() => {
    document.body.style.backgroundColor = PIN_BG;
    document.body.style.transition = 'background-color 0.2s ease';
  }, []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const current = pinRef.current;
      if (event.key >= '0' && event.key <= '9' && current.length < 4) {
        event.preventDefault();
        appendPinDigit(event.key);
        return;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        backspacePin();
        return;
      }
      if (event.key === 'Enter' && current.length === 4) {
        event.preventDefault();
        submitPin(current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [appendPinDigit, submitPin, backspacePin]);

  return (
    <div
      data-pin-screen={PIN_SCREEN_SPEC}
      className="relative h-dvh flex flex-col items-center justify-center overflow-hidden px-6 pt-safe pb-safe"
      style={{ backgroundColor: PIN_BG }}
    >
      {/* 은은한 앰비언트 글로우 — 황금빛 오라와 코스믹 블루 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.45) 0%, rgba(251,191,36,0.08) 55%, transparent 75%)' }}
        />
        <div
          className="absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -right-24 top-1/3 h-[340px] w-[340px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 70%)' }}
        />
      </div>

      {/* 브랜딩 — 황금빛 열쇠 */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 14 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/25 bg-white/[0.04] shadow-[0_0_45px_rgba(251,191,36,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl"
        >
          <KeyRound
            className="h-9 w-9 text-amber-300"
            style={{ filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.65))' }}
            strokeWidth={1.6}
          />
        </motion.div>

        <h1
          className="font-display text-3xl font-semibold tracking-[0.42em] sm:text-4xl"
          style={{
            color: 'transparent',
            backgroundImage: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 45%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(251,191,36,0.25)',
          }}
        >
          LUCKEY ARCHIVE
        </h1>
        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.45em] text-white/35">
          Private Access
        </p>
      </motion.div>

      {/* PIN 인디케이터 — 스프링 점 + 오류 쉐이크 */}
      <motion.div
        aria-hidden="true"
        animate={pinError ? { x: [0, -12, 12, -7, 7, -2, 0] } : { x: 0 }}
        transition={pinError ? { duration: 0.5, ease: 'easeInOut' } : { type: 'spring' }}
        className="relative z-10 mb-12 mt-12 flex gap-5"
      >
        {[0, 1, 2, 3].map((index) => {
          const filled = pin.length > index;
          return (
            <motion.div
              key={index}
              animate={{
                scale: filled ? 1.18 : 1,
                backgroundColor: filled ? 'rgba(251,191,36,0.95)' : 'rgba(255,255,255,0.05)',
                borderColor: filled ? 'rgba(251,191,36,0.85)' : 'rgba(255,255,255,0.18)',
                boxShadow: filled
                  ? '0 0 18px rgba(251,191,36,0.55), 0 0 4px rgba(251,191,36,0.7)'
                  : '0 0 0px rgba(0,0,0,0)',
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              className="h-3.5 w-3.5 rounded-full border backdrop-blur-sm"
            />
          );
        })}
      </motion.div>

      {/* 글래스 서큘러 키패드 */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 grid w-full max-w-[300px] grid-cols-3 gap-x-6 gap-y-5 place-items-center"
      >
        {PIN_KEYS.map((btn, index) => {
          const isEmpty = btn === '';
          const isBackspace = btn === '←';
          return (
            <motion.button
              key={`pin-key-${index}`}
              type="button"
              disabled={isEmpty}
              aria-label={isBackspace ? '지우기' : isEmpty ? undefined : `숫자 ${btn}`}
              onClick={() => {
                if (isBackspace) backspacePin();
                else if (!isEmpty) appendPinDigit(String(btn));
              }}
              whileTap={isEmpty ? undefined : { scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
              className={`flex h-[68px] w-[68px] items-center justify-center rounded-full border text-[22px] font-medium backdrop-blur-xl transition-colors duration-200 touch-manipulation
                ${isEmpty ? 'pointer-events-none border-transparent bg-transparent' : 'cursor-pointer border-white/10 bg-white/[0.05] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.35)] hover:border-white/20 hover:bg-white/[0.1] hover:text-white'}
                ${isBackspace ? 'text-white/60' : ''}
                ${pinError && !isBackspace && !isEmpty ? 'text-red-400/80' : ''}
              `}
              style={isBackspace ? { background: 'rgba(255,255,255,0.03)' } : undefined}
            >
              {isBackspace ? <Delete className="h-6 w-6" strokeWidth={1.6} /> : btn}
            </motion.button>
          );
        })}
      </motion.div>

      {/* 오류 피드백 */}
      <div className="relative z-10 mt-8 h-5">
        {pinError && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-red-400/90"
            style={{ textShadow: '0 0 14px rgba(248,113,113,0.4)' }}
          >
            PIN이 올바르지 않습니다
          </motion.p>
        )}
      </div>

      <p className="relative z-10 mt-8 text-[10px] tracking-[0.3em] text-white/20">
        v{APP_VERSION} · {PIN_SCREEN_SPEC}
      </p>
    </div>
  );
}
