import { useState, useEffect, useCallback } from 'react';
import {
  moodSoundEngine,
  MoodAudioState,
  MoodSoundId,
  MOOD_PRESETS,
  MoodPreset,
} from '@/lib/moodSoundEngine';
import {
  BinauralPreset,
  BINAURAL_PRESETS,
  normalizeBinauralAppId,
} from '@/lib/binauralBeats';

const APP_TO_MOOD_MAP: Record<string, MoodSoundId> = {
  hub: 'rain',
  bluebird: 'forest',
  heal: 'rain',
  orange: 'whitenoise',
  muse: 'forest',
  epilogue: 'ocean',
  trinity: 'binaural',
};

export function useBinauralBeat(currentAppId?: string) {
  const [moodState, setMoodState] = useState<MoodAudioState>(() => moodSoundEngine.getState());

  useEffect(() => {
    return moodSoundEngine.subscribe((next) => {
      setMoodState(next);
    });
  }, []);

  const normalizedCurrent = currentAppId ? normalizeBinauralAppId(currentAppId) : null;
  const isCurrentAppPlaying = moodState.isPlaying;

  const toggle = useCallback((targetAppId?: string) => {
    // Open the background mood picker so user can pick rain, white noise, forest birds, etc.
    const appId = targetAppId || currentAppId || 'hub';
    const targetMood = APP_TO_MOOD_MAP[appId] || 'rain';

    if (!moodState.isPlaying) {
      void moodSoundEngine.startMood(targetMood);
      moodSoundEngine.setPickerOpen(true);
    } else {
      moodSoundEngine.togglePicker();
    }
  }, [moodState.isPlaying, currentAppId]);

  const start = useCallback((targetAppId?: string) => {
    const appId = targetAppId || currentAppId || 'hub';
    const targetMood = APP_TO_MOOD_MAP[appId] || 'rain';
    void moodSoundEngine.startMood(targetMood);
    moodSoundEngine.setPickerOpen(true);
  }, [currentAppId]);

  const stop = useCallback(() => {
    moodSoundEngine.stop();
  }, []);

  const openPicker = useCallback(() => {
    moodSoundEngine.setPickerOpen(true);
  }, []);

  const preset: BinauralPreset | undefined = normalizedCurrent ? BINAURAL_PRESETS[normalizedCurrent] : undefined;
  const currentMood: MoodPreset = MOOD_PRESETS.find(p => p.id === moodState.activeMood) || MOOD_PRESETS[0];

  return {
    isPlaying: moodState.isPlaying,
    isCurrentAppPlaying,
    activeAppId: currentAppId || null,
    activePreset: preset || null,
    activeMood: moodState.activeMood,
    currentMood,
    preset,
    toggle,
    start,
    stop,
    openPicker,
  };
}
