/**
 * PIN 잠금 화면 — 미니멀 럭셔리 옵시디언 & 에메랄드 글래스모피즘
 * PIN 코드: 1202 (src/contexts/AppContext.tsx)
 * 
 * 🔇 [오디오 불변 원칙]:
 *   PIN 화면에서는 AudioContext를 절대 생성하거나 resume하지 않습니다.
 *   (멜론, 스포티파이, 애플뮤직 등 외부 음악이 멈추지 않도록 무소음 보안 가드 유지)
 */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Clover } from 'lucide-react';

export const PIN_SCREEN_SPEC = 'minimal-emerald-1202' as const;

const PIN_BG = '#07080b';

// 키패드 숫자 및 iOS 스타일 영문 서브 라벨 (미니멀 럭셔리 감성)
const KEYPAD_BUTTONS = [
  { digit: '1', sub: '' },
  { digit: '2', sub: 'ABC' },
  { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' },
  { digit: '5', sub: 'JKL' },
  { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' },
  { digit: '8', sub: 'TUV' },
  { digit: '9', sub: 'WXYZ' },
  { digit: '', sub: '' },
  { digit: '0', sub: '+' },
  { digit: 'backspace', sub: '' },
] as const;

type PinLockScreenProps = {
  onUnlock: (code: string) => boolean;
};

export function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const [pin, setPin] = React.useState('');
  const [pinError, setPinError] = React.useState(false);
  const pinRef = React.useRef(pin);
  pinRef.current = pin;

  const submitPin = React.useCallback(
    (nextPin: string) => {
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
    },
    [onUnlock]
  );

  const appendPinDigit = React.useCallback(
    (digit: string) => {
      setPin((prev) => {
        if (prev.length >= 4) return prev;
        const nextPin = `${prev}${digit}`;
        if (nextPin.length === 4) {
          window.setTimeout(() => submitPin(nextPin), 10);
        }
        return nextPin;
      });
      setPinError(false);
    },
    [submitPin]
  );

  const backspacePin = React.useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setPinError(false);
  }, []);

  React.useEffect(() => {
    document.body.style.backgroundColor = PIN_BG;
    document.body.style.transition = 'background-color 0.3s ease';
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
      className="relative h-dvh w-full flex flex-col items-center justify-between overflow-hidden px-6 pt-safe pb-safe select-none"
      style={{ backgroundColor: PIN_BG }}
    >
      {/* 🌌 은은한 에메랄드 & 딥 옵시디언 앰비언트 글로우 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(5,150,105,0.15) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute bottom-10 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(52,211,153,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* 상단 브랜딩 & 로고 */}
      <div className="relative z-10 flex flex-col items-center text-center mt-12 sm:mt-16">
        {/* 미니멀 네잎클로버 엠블럼 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.06] shadow-[0_0_35px_rgba(16,185,129,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl"
        >
          <Clover
            className="h-8 w-8 text-emerald-300"
            style={{ filter: 'drop-shadow(0 0 10px rgba(52,211,153,0.5))' }}
            strokeWidth={1.5}
          />
        </motion.div>

        <h1 className="font-light text-2xl tracking-[0.38em] text-white/90 uppercase pl-1">
          LucKey
        </h1>
        <p className="mt-2 text-[11px] font-medium tracking-[0.32em] text-white/40 uppercase">
          보안 잠금 해제
        </p>

        {/* 4자리 PIN 인디케이터 — 미니멀 에메랄드 펄 */}
        <motion.div
          aria-hidden="true"
          animate={pinError ? { x: [0, -14, 14, -8, 8, -3, 0] } : { x: 0 }}
          transition={pinError ? { duration: 0.45, ease: 'easeInOut' } : { type: 'spring' }}
          className="mt-8 flex items-center gap-5"
        >
          {[0, 1, 2, 3].map((index) => {
            const filled = pin.length > index;
            return (
              <motion.div
                key={index}
                animate={{
                  scale: filled ? 1.25 : 1,
                  backgroundColor: filled ? '#34d399' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: filled ? '#6ee7b7' : 'rgba(255, 255, 255, 0.22)',
                  boxShadow: filled
                    ? '0 0 16px rgba(52,211,153,0.7), 0 0 3px rgba(110,231,183,0.9)'
                    : '0 0 0px rgba(0,0,0,0)',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                className="h-3 w-3 rounded-full border backdrop-blur-sm"
              />
            );
          })}
        </motion.div>

        {/* 오류 메시지 영역 (높이 고정으로 레이아웃 흔들림 방지) */}
        <div className="mt-4 h-5 flex items-center justify-center">
          <AnimatePresence>
            {pinError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[11px] font-medium tracking-[0.2em] text-red-400"
              >
                비밀번호가 올바르지 않습니다
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 중앙/하단 미니멀 글래스 키패드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 grid w-full max-w-[290px] grid-cols-3 gap-x-5 gap-y-4 place-items-center mb-10 sm:mb-14"
      >
        {KEYPAD_BUTTONS.map((btn, index) => {
          const isEmpty = btn.digit === '';
          const isBackspace = btn.digit === 'backspace';

          if (isEmpty) {
            return <div key={`empty-${index}`} className="h-[68px] w-[68px]" />;
          }

          if (isBackspace) {
            return (
              <motion.button
                key="keypad-backspace"
                type="button"
                aria-label="한 글자 지우기"
                onClick={backspacePin}
                whileTap={{ scale: 0.88 }}
                className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-white/50 hover:text-white/80 active:text-white transition-colors duration-150 touch-manipulation focus:outline-none"
              >
                <Delete className="h-6 w-6" strokeWidth={1.5} />
              </motion.button>
            );
          }

          return (
            <motion.button
              key={`pin-${btn.digit}`}
              type="button"
              aria-label={`숫자 ${btn.digit}`}
              onClick={() => appendPinDigit(btn.digit)}
              whileTap={{ scale: 0.92, backgroundColor: 'rgba(255, 255, 255, 0.16)' }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
              className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-150 hover:border-white/20 hover:bg-white/[0.08] active:border-white/30 touch-manipulation focus:outline-none"
            >
              <span className="text-[25px] font-light leading-none tracking-normal">
                {btn.digit}
              </span>
              {btn.sub ? (
                <span className="text-[9px] font-medium tracking-[0.16em] text-white/35 mt-0.5 leading-none">
                  {btn.sub}
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
