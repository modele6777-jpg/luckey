/**
 * OmniWarp System & Big Bang Button (BBB) Type Definitions
 * Zero-UI Embodied Cognition Framework
 */

export type WarpPhase = 'idle' | 'whitehole' | 'mirrorhole' | 'event_horizon' | 'blackhole' | 'wormhole' | 'bigbang' | 'aborted';

export interface OmniWarpContext {
  activeRoute: string;
  activeTitle: string;
  summary: string;
  primarySubject?: string;
  sessionData?: Record<string, any>;
  capturedAt: number;
}

export interface OmniWarpTarget {
  id?: string;
  icon?: string;
  phase: WarpPhase;
  gauge: number; // 0.0 ~ 1.0 (0% ~ 100%)
  aiTemperature: number; // 0.0 ~ 1.5
  title: string;
  name?: string;
  actionType: string;
  destinationPath: string;
  previewLabel: string;
  previewDescription: string;
  themeColor: string;
  accentGlow: string;
  stageIndex?: number; // 1 ~ 9
  runeSymbol?: string;
  runeName?: string;
  eventHorizonMode?: 'whitehole' | 'mirrorhole' | 'blackhole';
  cycleStats?: {
    visitedCount: number;
    totalCount: number;
    remainingCount: number;
    cycleIndex: number;
    isFullCycleCompleted: boolean;
  };
}

export interface WarpForceMetrics {
  startTime?: number;
  hardwarePressure: number; // 0.0 ~ 1.0
  touchArea: number; // calculated contact area
  durationMs: number;
  virtualForce: number; // blended force 0.0 ~ 1.0
  isAborted: boolean;
  phase: WarpPhase;
  dragOffsetX?: number;
  dragOffsetY?: number;
  dragDistance?: number;
  dragAngleDeg?: number;
  radialSectorIndex?: number;
  eventHorizonMode?: 'whitehole' | 'mirrorhole' | 'blackhole';
}

export interface BigBangCommitEventDetail {
  phase: WarpPhase;
  target: OmniWarpTarget;
  context: OmniWarpContext;
  metrics: WarpForceMetrics;
  timestamp: number;
}
