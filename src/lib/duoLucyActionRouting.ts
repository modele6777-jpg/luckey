/** Keep both panes mounted when a Lucy action is triggered from the content pane. */
export function shouldPreserveDuoSplitForLucyAction(
  contentPaneMounted: boolean,
  lucyPaneMounted: boolean,
): boolean {
  return contentPaneMounted && lucyPaneMounted;
}
