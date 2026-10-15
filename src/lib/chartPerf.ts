import {
  isFoldCoverScreen,
  isGalaxyFoldSeClass,
  isGalaxyPremiumClass,
  isLegacyMobile,
  isPerfReduced,
} from '@/lib/perfMode';

export function rechartsAnimationDuration(): number {
  if (isLegacyMobile()) return 0;
  if (isGalaxyFoldSeClass()) return isFoldCoverScreen() ? 800 : 1200;
  if (isGalaxyPremiumClass()) return 1200;
  return isPerfReduced() ? 400 : 1200;
}

export function rechartsAnimationActive(): boolean {
  if (isLegacyMobile()) return false;
  if (isGalaxyFoldSeClass()) return !isFoldCoverScreen();
  if (isGalaxyPremiumClass()) return true;
  return !isPerfReduced();
}