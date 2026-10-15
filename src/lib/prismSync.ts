import {
  APP_VERSION,
  compareVersions,
  fetchDeployedAppVersion,
  formatDeviceLabel,
  getDeviceType,
  pickNewestVersion,
  type ClientAppVersions,
} from './appVersion';
import type { SharedState } from './sharedState';
import {
  saveSharedStateToFirestore,
  saveSharedStateToLocal,
  syncSharedStateWithCloud,
} from './sharedStateSync';

export type PrismSyncResult = {
  success: boolean;
  needsReload: boolean;
  message: string;
  localVersion: string;
  targetVersion: string;
  mergedState?: SharedState;
};

function mergeClientAppVersions(
  local?: ClientAppVersions,
  remote?: ClientAppVersions,
  currentDevice?: ReturnType<typeof getDeviceType>,
  currentVersion = APP_VERSION,
): ClientAppVersions {
  const merged: ClientAppVersions = {
    desktop: pickNewestVersion(local?.desktop, remote?.desktop),
    mobile: pickNewestVersion(local?.mobile, remote?.mobile),
    tablet: pickNewestVersion(local?.tablet, remote?.tablet),
  };

  if (currentDevice) {
    merged[currentDevice] = pickNewestVersion(merged[currentDevice], currentVersion);
  }

  return merged;
}

export function resolveUnifiedAppVersion(
  localVersion: string,
  deployedVersion?: string | null,
  state?: SharedState | null,
): string {
  const deviceVersions = state?.clientAppVersions
    ? Object.values(state.clientAppVersions)
    : [];

  return (
    pickNewestVersion(
      localVersion,
      deployedVersion || undefined,
      state?.unifiedAppVersion,
      ...deviceVersions,
    ) || localVersion
  );
}

export async function syncPrismAcrossDevices(
  uid?: string | null,
  currentState?: SharedState | null,
): Promise<PrismSyncResult> {
  const deviceType = getDeviceType();
  const localVersion = APP_VERSION;

  // Run deployed version check and Firestore state sync concurrently
  const [deployedResult, cloudResult] = await Promise.allSettled([
    fetchDeployedAppVersion(),
    uid ? syncSharedStateWithCloud(uid, currentState) : Promise.resolve(null),
  ]);

  const deployedVersion = deployedResult.status === 'fulfilled' ? deployedResult.value : null;
  const dataResult = cloudResult.status === 'fulfilled' ? cloudResult.value : null;

  let mergedState = dataResult?.state || currentState || null;
  let remoteState: SharedState | null = dataResult?.hadRemote ? dataResult.state : null;

  const targetVersion = resolveUnifiedAppVersion(
    localVersion,
    deployedVersion,
    mergedState,
  );

  const clientAppVersions = mergeClientAppVersions(
    mergedState?.clientAppVersions,
    remoteState?.clientAppVersions,
    deviceType,
    localVersion,
  );

  const versionPatch: Partial<SharedState> = {
    unifiedAppVersion: targetVersion,
    clientAppVersions,
    lastAppSyncAt: Date.now(),
  };

  if (uid && mergedState) {
    mergedState = { ...mergedState, ...versionPatch };
    saveSharedStateToLocal(uid, mergedState);
    void saveSharedStateToFirestore(uid, mergedState).catch(() => {});
  }

  const hasNewerTarget = compareVersions(localVersion, targetVersion) < 0;
  const hasNewerDeployed = Boolean(deployedVersion && compareVersions(deployedVersion, localVersion) > 0);
  const needsReload = hasNewerTarget || hasNewerDeployed;

  const otherDevice = deviceType === 'mobile' ? 'desktop' : 'mobile';
  const otherLabel = formatDeviceLabel(otherDevice);
  const thisLabel = formatDeviceLabel(deviceType);
  const otherVersion = clientAppVersions[otherDevice];

  let message = '';
  if (needsReload) {
    message = `${thisLabel} v${localVersion} → 최신 v${targetVersion || deployedVersion}으로 업그레이드 적용 중...`;
  } else if (otherVersion && compareVersions(otherVersion, localVersion) > 0) {
    message = `${otherLabel} 최신 버전(v${otherVersion}) 및 활동 데이터 기준으로 ${thisLabel}이 완벽히 동기화되었습니다.`;
  } else if (deployedVersion && compareVersions(deployedVersion, localVersion) > 0) {
    message = `서버 최신 버전 v${deployedVersion} 및 클라우드 데이터를 적용합니다...`;
  } else {
    message = `PC·모바일의 모든 활동 기록(사주·타로·오라클·치유·프로필)이 클라우드와 완벽하게 동기화되었습니다.`;
  }

  return {
    success: true,
    needsReload,
    message,
    localVersion,
    targetVersion,
    mergedState: mergedState || undefined,
  };
}

export async function forcePurgeStaleCaches(): Promise<void> {
  try {
    if ('caches' in window) {
      const keys = await window.caches.keys();
      await Promise.all(keys.map((k) => window.caches.delete(k)));
    }
  } catch (err) {
    console.warn('[CachePurge] Warning:', err);
  }
}

export async function forceAppUpgradeAndReload(): Promise<void> {
  const fallbackId = window.setTimeout(() => {
    window.location.href = window.location.pathname + '?v=' + Date.now();
  }, 1000);

  try {
    await forcePurgeStaleCaches();
    const swState = await applyServiceWorkerUpdate();
    if (swState === 'reloading') return;
  } catch (e) {
    console.warn('[forceAppUpgradeAndReload] SW update error:', e);
  }

  window.clearTimeout(fallbackId);
  window.setTimeout(() => {
    window.location.href = window.location.pathname + '?v=' + Date.now();
  }, 150);
}

const SW_UPDATE_TIMEOUT_MS = 2000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => window.setTimeout(() => resolve(fallback), ms)),
  ]);
}

function activateWaitingWorker(registration: ServiceWorkerRegistration): 'reloading' {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    }, { once: true });
  }
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
  window.setTimeout(() => window.location.reload(), 300);
  return 'reloading';
}

function waitForInstallingWorker(
  registration: ServiceWorkerRegistration,
  worker: ServiceWorker,
): Promise<'reloading' | 'idle'> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: 'reloading' | 'idle') => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const onStateChange = (event: Event) => {
      const target = event.target as ServiceWorker | null;
      if (target?.state === 'installed') {
        worker.removeEventListener('statechange', onStateChange);
        finish(activateWaitingWorker(registration));
      } else if (target?.state === 'redundant') {
        worker.removeEventListener('statechange', onStateChange);
        finish('idle');
      }
    };

    worker.addEventListener('statechange', onStateChange);
    window.setTimeout(() => {
      worker.removeEventListener('statechange', onStateChange);
      finish('idle');
    }, SW_UPDATE_TIMEOUT_MS);
  });
}

export async function applyServiceWorkerUpdate(): Promise<'reloading' | 'updating' | 'idle'> {
  if (!('serviceWorker' in navigator)) return 'idle';

  const registrations = await navigator.serviceWorker.getRegistrations();
  if (registrations.length === 0) {
    const ready = await navigator.serviceWorker.ready.catch(() => null);
    if (ready) await ready.update();
    return 'idle';
  }

  let sawUpdateActivity = false;

  for (const registration of registrations) {
    if (registration.waiting) {
      return activateWaitingWorker(registration);
    }

    if (registration.installing) {
      return withTimeout(
        waitForInstallingWorker(registration, registration.installing),
        SW_UPDATE_TIMEOUT_MS,
        'idle',
      );
    }

    const updateResult = await withTimeout(
      new Promise<'reloading' | 'updating' | 'idle'>((resolve) => {
        let settled = false;
        const finish = (result: 'reloading' | 'updating' | 'idle') => {
          if (settled) return;
          settled = true;
          resolve(result);
        };

        const onUpdateFound = () => {
          sawUpdateActivity = true;
          const installing = registration.installing;
          if (!installing) {
            finish('updating');
            return;
          }
          void waitForInstallingWorker(registration, installing).then((result) => {
            finish(result === 'reloading' ? 'reloading' : 'updating');
          });
        };

        registration.addEventListener('updatefound', onUpdateFound, { once: true });
        void registration.update().finally(() => {
          window.setTimeout(() => finish(sawUpdateActivity ? 'updating' : 'idle'), 800);
        });
      }),
      SW_UPDATE_TIMEOUT_MS,
      'idle',
    );

    if (updateResult === 'reloading') return 'reloading';
    if (updateResult === 'updating') sawUpdateActivity = true;
  }

  return sawUpdateActivity ? 'updating' : 'idle';
}