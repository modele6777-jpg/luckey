/**
 * LOCKED UI — 메인 PIN 화면 고정 스펙 (classic-v1)
 * 점 4개 + 원형 숫자 키패드. 텍스트 입력·숫자 미리보기 없음.
 * 레이아웃 변경은 사용자 명시 요청 없이 하지 마세요.
 */
import React from 'react';
import { motion } from 'motion/react';
import { APP_VERSION } from '@/lib/appVersion';
import { getSharedAudioContext } from '@/lib/audio';

export const PIN_SCREEN_SPEC = 'classic-v1' as const;

const PIN_BG = 'oklch(0.08 0.02 270)';
const PIN_TITLE_COLOR = 'oklch(0.75 0.12 50)';
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
    }, 400);
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
        setPin((prev) => prev.slice(0, -1));
        setPinError(false);
        return;
      }
      if (event.key === 'Enter' && current.length === 4) {
        event.preventDefault();
        submitPin(current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [appendPinDigit, submitPin]);

  return (
    <div
      data-pin-screen={PIN_SCREEN_SPEC}
      className="h-dvh flex flex-col items-center justify-center px-6 pt-safe pb-safe"
      style={{ backgroundColor: PIN_BG }}
    >
      <div className="text-center mb-10">
        <h1
          className="font-display text-4xl tracking-[0.3em] mb-4"
          style={{ color: PIN_TITLE_COLOR }}
        >
          SECURED
        </h1>
        <p className="text-white/40 text-sm tracking-widest uppercase">
          접근 PIN 입력
        </p>
      </div>

      <div className="flex gap-4 mb-10" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              pin.length > index
                ? 'bg-yellow-500 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                : 'bg-transparent border-white/20'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px] place-items-center">
        {PIN_KEYS.map((btn, index) => (
          <button
            key={`pin-key-${index}`}
            type="button"
            aria-label={btn === '←' ? '지우기' : btn === '' ? undefined : `숫자 ${btn}`}
            onClick={() => {
              if (btn === '←') {
                setPin((prev) => prev.slice(0, -1));
                setPinError(false);
              } else if (btn !== '') {
                appendPinDigit(String(btn));
              }
            }}
            className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-medium transition-all touch-manipulation
              ${btn === '' ? 'pointer-events-none opacity-0' : 'hover:bg-white/10 active:scale-95 cursor-pointer'}
              ${pinError && btn !== '' && btn !== '←' ? 'text-red-500' : 'text-white/80'}
              ${btn === '←' ? 'bg-white/5' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>

      {pinError && (
        <motion.p
          initial={{ x: -4 }}
          animate={{ x: 4 }}
          transition={{ repeat: 5, duration: 0.05, repeatType: 'reverse' }}
          className="mt-8 text-red-500/80 text-xs font-bold tracking-widest uppercase"
        >
          PIN이 올바르지 않습니다
        </motion.p>
      )}

      <p className="mt-10 text-[10px] text-white/20 tracking-widest">
        v{APP_VERSION} · {PIN_SCREEN_SPEC}
      </p>
    </div>
  );
}