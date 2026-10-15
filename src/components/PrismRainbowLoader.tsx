import React from 'react';
import { LucKeyCosmicLoader, LucKeyCosmicLoaderProps } from './LucKeyCosmicLoader';

export type PrismRainbowLoaderProps = LucKeyCosmicLoaderProps;

/**
 * 🍀 PrismRainbowLoader (LucKeyCosmicLoader 호환 래퍼)
 * LucKey의 네잎클로버-황금 열쇠 코스믹 로더로 통합 렌더링
 */
export function PrismRainbowLoader({
  fullScreen = false,
  message = '행운과 해답의 문을 여는 중...',
  subMessage = 'LUCKEY · SOUL SANCTUARY',
  compact = false,
}: PrismRainbowLoaderProps) {
  return (
    <LucKeyCosmicLoader
      fullScreen={fullScreen}
      message={message}
      subMessage={subMessage}
      compact={compact}
    />
  );
}

export default PrismRainbowLoader;
