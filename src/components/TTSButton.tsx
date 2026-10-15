import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { normalizeTextForSpeech, playTTS, playTTSInChunks, splitSpeechIntoChunks, stopTTS, subscribeTTS, prefetchTTS } from '../utils/tts';

interface TTSButtonProps {
  text: string;
  voice?: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede' | 'Lucy' | string;
  className?: string;
  onPlay?: () => void;
  onClick?: () => void;
  emotion?: string;
  /** @deprecated 모든 TTS 재생은 1.0 배속으로 영구 고정됩니다 */
  speed?: number;
}

export const TTSButton: React.FC<TTSButtonProps> = ({ text, voice = 'Kore', className = "", onPlay, onClick, emotion }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const textStr = typeof text === 'string' ? text : String(text || '');
  const cleanText = normalizeTextForSpeech(textStr);

  // Background warm-up / prefetch audio as soon as TTSButton renders
  useEffect(() => {
    if (!cleanText || cleanText.length < 2) return;
    const timer = setTimeout(() => {
      if (cleanText.length > 130) {
        const firstSentence = cleanText.match(/[^.!?。！？\n]+[.!?。！？\n]?/)?.[0] || cleanText.slice(0, 100);
        prefetchTTS(firstSentence, voice, emotion);
      } else {
        prefetchTTS(cleanText, voice, emotion);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [cleanText, voice, emotion]);

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

    // If text contains multiple sentences, stream sequentially sentence-by-sentence
    // for seamless real-time sentence highlighting and zero audio cutoffs.
    const sentences = splitSpeechIntoChunks(cleanText);
    if (sentences.length > 1) {
      playTTSInChunks(cleanText, voice, 140, emotion);
    } else {
      playTTS(cleanText, voice, false, emotion);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleSpeak}
      className={`p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-blue-400 hover:bg-white/10 transition-all ${className}`}
      title={isPlaying ? "Stop playing" : isLoading ? "Stop loading" : "Listen to response"}
    >
      {isLoading ? (
        <Loader2 size={14} className="animate-spin text-blue-400" />
      ) : isPlaying ? (
        <VolumeX size={14} className="text-blue-400" />
      ) : (
        <Volume2 size={14} />
      )}
    </motion.button>
  );
};
