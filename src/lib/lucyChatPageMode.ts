export const LUCY_PRO_PATH = '/chat/pro';
export const LUCY_MASTER_CHANNELS = ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'] as const;
export type LucyPageChannel = typeof LUCY_MASTER_CHANNELS[number];

/** Master belongs to Pro; regular chat keeps casual, single and partial fusion modes. */
export function resolveLucyPageChannels(channels: readonly LucyPageChannel[], pro: boolean): LucyPageChannel[] {
  if (pro) return [...LUCY_MASTER_CHANNELS];
  const valid = [...new Set(channels)].filter(channel => LUCY_MASTER_CHANNELS.includes(channel));
  return valid.length === LUCY_MASTER_CHANNELS.length ? [] : valid;
}
