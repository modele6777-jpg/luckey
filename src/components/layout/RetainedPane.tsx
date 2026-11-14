import { useEffect, useState, type ReactNode } from 'react';

/** Mount a pane on first use, then retain its dialogs/state across fold changes. */
export function RetainedPane({ active, children }: { active: boolean; children: ReactNode }) {
  const [visited, setVisited] = useState(active);
  useEffect(() => { if (active) setVisited(true); }, [active]);
  return active || visited ? children : null;
}
