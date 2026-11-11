import React from 'react';
import { LucKeyCosmicLoader } from './LucKeyCosmicLoader';

export function PageLoader() {
  return (
      <LucKeyCosmicLoader
        fullScreen
        compact
        message="LucKey 유니버스 조율 중..."
        subMessage="FINDING YOUR INNER CALM"
      />
  );
}
