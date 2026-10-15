import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  moodSoundEngine,
  MoodAudioState,
  MoodSoundId,
  MOOD_PRESETS,
  MoodPreset,
} from '@/lib/moodSoundEngine';

export function useMoodSound() {
  const [state, setState] = useState<MoodAudioState>(() => moodSoundEngine.getState());

  useEffect(() => {
    return moodSoundEngine.subscribe((next) => {
      setState(next);
    });
  }, []);

  const currentPreset = useMemo<MoodPreset>(() => {
    return MOOD_PRESETS.find(p => p.id === state.activeMood) || MOOD_PRESETS[0];
  }, [state.activeMood]);

  const togglePlay = useCallback((targetMood?: MoodSoundId) => {
    return moodSoundEngine.togglePlay(targetMood);
  }, []);

  const setMood = useCallback((moodId: MoodSoundId) => {
    return moodSoundEngine.setMood(moodId);
  }, []);

  const setVolume = useCallback((vol: number) => {
    moodSoundEngine.setVolume(vol);
  }, []);

  const openPicker = useCallback(() => {
    moodSoundEngine.setPickerOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    moodSoundEngine.setPickerOpen(false);
  }, []);

  const togglePicker = useCallback(() => {
    moodSoundEngine.togglePicker();
  }, []);

  return {
    isPlaying: state.isPlaying,
    activeMood: state.activeMood,
    volume: state.volume,
    isPickerOpen: state.isPickerOpen,
    currentPreset,
    presets: MOOD_PRESETS,
    togglePlay,
    setMood,
    setVolume,
    openPicker,
    closePicker,
    togglePicker,
  };
}
