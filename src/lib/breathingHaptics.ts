/**
 * Breathing Studio Haptic Feedback Engine
 * Provides gentle, meditative vibration pulses for mobile devices
 * and soothing acoustic respiratory bio-harmonics during Inhale, Hold, and Exhale phases.
 */

import { playBreathingHaptic, isAudioHapticsEnabled } from './audioHaptics';

const STORAGE_KEY = 'prism_breathing_haptic';

/**
 * Checks whether the current device/browser supports the Vibration API.
 */
export function isHapticsSupported(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Retrieves the saved Haptic Feedback toggle state (defaults to true).
 */
export function getBreathingHapticSetting(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

/**
 * Saves the Haptic Feedback toggle state and dispatches an event for cross-component sync.
 */
export function setBreathingHapticSetting(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('breathing-haptic-setting-changed', { detail: { enabled } }));
  } catch (e) {
    console.warn('[Haptics] Failed to save setting:', e);
  }
}

export type BreathingPhaseType = 'inhale' | 'hold' | 'exhale' | 'idle' | 'test' | 'test-inhale' | 'test-exhale';

/**
 * Triggers gentle, distinct vibration pulses on mobile devices during Inhale, Exhale, Hold, or Test.
 * Seamlessly paired with the unified Audio Haptic Feedback engine.
 */
export function triggerBreathingHaptic(phase: BreathingPhaseType): boolean {
  // If haptic is toggled off and it's not a manual test trigger, do nothing
  if (!phase.startsWith('test') && !getBreathingHapticSetting() && !isAudioHapticsEnabled()) {
    return false;
  }

  try {
    switch (phase) {
      case 'inhale':
      case 'test-inhale':
        playBreathingHaptic('inhale');
        return true;

      case 'exhale':
      case 'test-exhale':
        playBreathingHaptic('exhale');
        return true;

      case 'hold':
        playBreathingHaptic('hold');
        return true;

      case 'test':
        playBreathingHaptic('cycle');
        return true;

      default:
        return false;
    }
  } catch (err) {
    console.warn('[Haptics] Trigger error:', err);
    return false;
  }
}
