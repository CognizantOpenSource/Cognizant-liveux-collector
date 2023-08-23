//© 2023 Cognizant. All rights reserved. Cognizant Confidential and/or Trade Secret.

import { isBot, getNavigationEntry, collect } from '@/utilities';
import {
  REGISTER_METRIC_EVENT_NAME,
  ON_LEAVE_STRATEGY,
} from '@/core/modulesRegistry';
import { useMetrics } from './useMetrics';
import { onBFCacheRestore } from '@/utilities/bfcache';

const BF_CACHE = 'bfcache';

export const { track, trackError, getMetrics, reset } = useMetrics();
export const MODULES_ON_LEAVE: ModuleInitializer[] = [];
const MODULES_ON_BF_CACHE: ModuleConfig[] = [];

const navigationEntry = getNavigationEntry();

function registerModule({ moduleInitializer, strategy }: ModuleConfig) {
  if (strategy !== ON_LEAVE_STRATEGY) {
    try {
      moduleInitializer(track, trackError, navigationEntry);
    } catch (error: unknown) {
      console.error(
        `[Cognizant Web Vitals Monitoring Error]: Failed to initialize module.
        ${(error as Error)?.message || error || ''}`
      );

      trackError(error);
    }
  } else {
    MODULES_ON_LEAVE.push(moduleInitializer as ModuleInitializer);
  }
}

function onRegister({ detail: { initOnBFCache, ...detail } }: CustomEvent) {
  if (initOnBFCache) {
    MODULES_ON_BF_CACHE.push(detail as ModuleConfig);
  }

  registerModule(detail as ModuleConfig);
}

function send() {
  MODULES_ON_LEAVE.forEach((moduleInitializer: ModuleInitializer) => {
    moduleInitializer(track, trackError, navigationEntry);
  });

  document.removeEventListener(REGISTER_METRIC_EVENT_NAME, onRegister);
  document.removeEventListener('visibilitychange', send);

  collect(getMetrics() as CollectorMetrics);
}

export function initialize(onBFCache = false) {
  document.addEventListener('visibilitychange', send, { once: true });

  /**
   * On BF cache restore, previously attached listeners
   * will be left untouched, including the ones in web-vitals,
   * unless explicitly removed or opt'd { once: true }.
   */

  if (onBFCache) {
    MODULES_ON_LEAVE.length = 0;

    reset({ cache: [{ type: BF_CACHE }] });
    MODULES_ON_BF_CACHE.forEach(registerModule);
  } else {
    document.addEventListener(REGISTER_METRIC_EVENT_NAME, onRegister);
  }
}

try {
  const shouldTrack =
    Math.random() < (Number('REPLACE_ME_TRAFFIC_PERCENTAGE') || 1);

  if (shouldTrack && !isBot()) {
    initialize();

    onBFCacheRestore(() => {
      initialize(true);
    });
  }
} catch (error: unknown) {
  console.error(
    `[Cognizant Web Vitals Monitoring Error]: 
    ${(error as Error)?.message || error || ''}`
  );

  trackError(error);
}
