
    // Adaptive Activity Watchdog Timer:
    // Resets on incoming chunks. Allows a more realistic idle window for slower API responses,
    // and only aborts when there is no reply at all after a generous timeout to avoid silent drops.
    const WATCHDOG_IDLE_MS = 60000;
    const MAX_GENERATION_MS = 180000;
    let lastActivityTime = Date.now();
    const generationStartTime = Date.now();
    let watchdogTimer: NodeJS.Timeout | null = null;
    let isWatchdogTimeout = false;

    const resetWatchdog = () => {
      lastActivityTime = Date.now();
      if (watchdogTimer) clearTimeout(watchdogTimer);
      watchdogTimer = setTimeout(() => {
        const now = Date.now();
        const isIdleTooLong = now - lastActivityTime >= WATCHDOG_IDLE_MS;
        const isMaxDurationReached = now - generationStartTime >= MAX_GENERATION_MS;
        const hasPartialReply = replyText.trim().length > 0;

        if (isGeneratingRef.current[sourcePersona] && !hasPartialReply && (isIdleTooLong || isMaxDurationReached)) {
          console.warn(`[AppContext] Activity watchdog auto-released (${isIdleTooLong ? 'idle' : 'max cap'}) for ${sourcePersona}`);
          isWatchdogTimeout = true;
          try { currentAbortController.abort(); } catch (_) {}
        } else if (isGeneratingRef.current[sourcePersona]) {
          resetWatchdog();
        }
      }, WATCHDOG_IDLE_MS);
    };

    resetWatchdog();
    
    // 3. Prepare AI Prompt (🌟 상담 대상자가 지정된 경우 해당 인물 프로필로 사주·점성학 전면 전환)
    const profile = options?.customUserProfile || sharedState?.userProfile || getPersistentUserProfile();
