import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { normalizeTextForSpeech, playTTS, playTTSInChunks, splitSpeechIntoChunks, stopTTS, subscribeTTS } from '../utils/tts';

interface TTSButtonProps {
  text: string;
  voice?: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede' | 'Lucy' | string;
  className?: string;
  onPlay?: () => void;
  onClick?: () => void;
  emotion?: string;
  skipCompletionChime?: boolean;
  disabled?: boolean;
  /** @deprecated 모든 TTS 재생은 1.0 배속으로 영구 고정됩니다 */
  speed?: number;
}

export const TTSButton: React.FC<TTSButtonProps> = ({ text, voice = 'Kore', className = "", onPlay, onClick, emotion, skipCompletionChime, disabled = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const textStr = typeof text === 'string' ? text : String(text || '');
  const cleanText = normalizeTextForSpeech(textStr);

  useEffect(() => {
    const unsubscribe = subscribeTTS((state) => {
      // It is playing or loading if the speech is active and matches our text or full reading text.
      const isMatch = (state.activeText === cleanText) || (state.activeFullText && state.activeFullText === cleanText);
      setIsPlaying(state.isSpeaking && Boolean(isMatch));
      setIsLoading(state.isLoading && Boolean(isMatch));
    });
    return unsubscribe;
  }, [cleanText]);

  const handleSpeak = async () => {
    if (disabled) return;
    // If already playing or loading, a click halts the playback and resets
    if (isPlaying || isLoading) {
      stopTTS();
      return;
    }

    try {
      onPlay?.();
      onClick?.();
    } catch (e) {
      console.warn('[TTSButton] onPlay/onClick error:', e);
    }

    setError('');
    try {
    // If text contains multiple sentences, stream sequentially sentence-by-sentence
    // for seamless real-time sentence highlighting and zero audio cutoffs.
    const sentences = splitSpeechIntoChunks(cleanText);
    if (sentences.length > 1) {
      await playTTSInChunks(cleanText, voice, 140, emotion, undefined, { skipCompletionChime });
    } else {
      await playTTS(cleanText, voice, true, emotion, undefined, false, undefined, undefined, undefined, { skipCompletionChime });
    }
    } catch (err) {
      setError(err instanceof Error ? err.message : '음성을 재생하지 못했습니다. 다시 눌러 주세요.');
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.1 }}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      onClick={handleSpeak}
      disabled={disabled}
      className={`p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-blue-400 hover:bg-white/10 transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-white/40 disabled:hover:bg-white/5 ${className}`}
      title={disabled ? '문구 전체를 정확히 입력하면 음성을 들을 수 있어요' : isPlaying ? "Stop playing" : isLoading ? "Stop loading" : "Listen to response"}
    >
      {isLoading ? (
        <Loader2 size={14} className="animate-spin text-blue-400" />
      ) : isPlaying ? (
        <VolumeX size={14} className="text-blue-400" />
      ) : (
        <Volume2 size={14} />
      )}
    </motion.button>
    {error && <span role="alert" className="max-w-56 text-xs text-amber-500">{error}</span>}
    </span>
  );
};
