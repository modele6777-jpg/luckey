export interface OneStopState { cycleIndex: number; visitedPaths: string[] }

export function normalizeOneStopState(raw: unknown, paths: string[]): OneStopState {
  const data = raw as Partial<OneStopState> | null;
  const allowed = new Set(paths);
  return {
    cycleIndex: Number.isSafeInteger(data?.cycleIndex) && data!.cycleIndex! > 0 ? data!.cycleIndex! : 1,
    visitedPaths: [...new Set(Array.isArray(data?.visitedPaths) ? data.visitedPaths.filter(path => allowed.has(path)) : [])],
  };
}

/** Pure transition: context ranks unvisited destinations; a completed route starts the next cycle. */
export function advanceOneStopCycle(raw: OneStopState, paths: string[], current: string, ranked: string[]) {
  const state = normalizeOneStopState(raw, paths);
  const visited = new Set(state.visitedPaths);
  if (paths.includes(current)) visited.add(current);
  let candidates = paths.filter(path => !visited.has(path));
  const restarted = candidates.length === 0;
  if (restarted) {
    state.cycleIndex += 1;
    visited.clear();
    if (paths.includes(current)) visited.add(current);
    candidates = paths.filter(path => !visited.has(path));
  }
  const destination = ranked.find(path => candidates.includes(path)) || candidates[0];
  if (!destination) throw new Error('One-stop navigation needs at least two active destinations');
  visited.add(destination);
  return { destination, restarted, state: { cycleIndex: state.cycleIndex, visitedPaths: [...visited] } };
}
