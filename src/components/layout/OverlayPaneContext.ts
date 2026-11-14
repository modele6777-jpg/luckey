import { createContext } from 'react';
import type { OverlayPane } from '@/lib/overlayPane';

/** React context survives portals and carries the initiating logical pane. */
export const OverlayPaneContext = createContext<OverlayPane | null>(null);
