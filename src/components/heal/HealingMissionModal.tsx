import React from 'react';
import { OneMinuteMeditationView } from './OneMinuteMeditationView';

interface HealingMissionModalProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function HealingMissionModal({ onClose, isModal = true }: HealingMissionModalProps) {
  return <OneMinuteMeditationView onClose={onClose} isModal={isModal} />;
}
