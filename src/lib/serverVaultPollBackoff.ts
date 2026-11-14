export const SERVER_VAULT_POLL_BASE_MS = 15_000;
export const SERVER_VAULT_POLL_MAX_MS = 120_000;

export function createServerVaultPollBackoff() {
  let delayMs = SERVER_VAULT_POLL_BASE_MS;
  return {
    current: () => delayMs,
    afterPoll(receivedUpdate: boolean): number {
      delayMs = receivedUpdate
        ? SERVER_VAULT_POLL_BASE_MS
        : Math.min(delayMs * 2, SERVER_VAULT_POLL_MAX_MS);
      return delayMs;
    },
    reset(): number {
      delayMs = SERVER_VAULT_POLL_BASE_MS;
      return delayMs;
    },
  };
}
