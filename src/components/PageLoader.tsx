import React from 'react';
import { LucKeyCosmicLoader } from './LucKeyCosmicLoader';

export function PageLoader() {
  return (
    <div className="h-full min-h-[50vh] flex flex-col items-center justify-center py-10 w-full">
      <LucKeyCosmicLoader
        compact
        message="LucKey 유니버스 조율 중..."
        subMessage="ALIGNING SACRED FREQUENCY"
      />
    </div>
  );
}
