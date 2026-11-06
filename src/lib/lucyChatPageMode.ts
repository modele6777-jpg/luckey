export const LUCY_PRO_PATH = '/chat/pro';
export const LUCY_MASTER_CHANNELS = ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'] as const;
export type LucyPageChannel = typeof LUCY_MASTER_CHANNELS[number];

/** Master belongs to Pro and Lucy +; preserves all channels when master is present. */
export function resolveLucyPageChannels(channels: readonly LucyPageChannel[], pro: boolean): LucyPageChannel[] {
  const valid = [...new Set(channels)].filter(channel => LUCY_MASTER_CHANNELS.includes(channel));
  if (pro) return [...LUCY_MASTER_CHANNELS];
  return valid.length === LUCY_MASTER_CHANNELS.length ? [] : valid;
}
