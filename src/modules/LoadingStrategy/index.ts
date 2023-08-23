import trackCache from '@/modules/LoadingStrategy/cache';
import trackCacheNC from '@/modules/LoadingStrategy/cache-nc';
import { isDomain } from '@/utilities';
import { register, ON_START_STRATEGY } from '@/core/modulesRegistry';

// todo: RUM-1118 - Include trackCacheNC only for NC domain and trackCache for default
const DOMAIN_NC = 'www.netcentric.biz';
const INIT_ON_BF_CACHE = false;

register(
  (
    track: (metrics: Partial<CollectorMetrics>) => void,
    errorTrackingFn: (error: unknown) => void,
    navigationEntry
  ): void => {
    isDomain(DOMAIN_NC)
      ? trackCacheNC(track, errorTrackingFn, navigationEntry)
      : trackCache(track, errorTrackingFn, navigationEntry);
  },
  ON_START_STRATEGY,
  INIT_ON_BF_CACHE
);
