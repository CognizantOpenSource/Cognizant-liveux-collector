const CACHE_NAMES = ['cdn-cache', 'dispatcher-cache'];
const NO_CACHE = 'no-cache';

const getCacheTypes = (
  serverTiming: readonly PerformanceServerTiming[]
): CacheType[] => {
  const cacheTypes = serverTiming
    .filter(({ name, duration }) => CACHE_NAMES.includes(name) && duration)
    .map(({ name, duration }) => ({
      type: name,
      age: duration,
    }));

  return cacheTypes.length ? cacheTypes : [{ type: NO_CACHE }];
};

export default (
  track: (metrics: Pick<CollectorMetrics, 'cache'>) => void,
  trackError: (error: unknown) => void,
  navigationEntry: PerformanceNavigationTiming | undefined
) => {
  /**
   * The following event listener will *override* whatever
   * other caches tracked via Performance API as per old Collector
   * logic.
   *
   * Our JSON webperf mappings include an OS data type of "array" for "cache"
   * which doesn't exist in OS.
   *
   * We'll keep things as they are for the moment being, but in theory
   * the data type should be "nested" if we want to track all types of involved caches.
   *
   * Currently, the fact that we have an array of caches is not reflected in our OS documents
   * and this code is misleading.
   */

  if (navigationEntry && 'serverTiming' in navigationEntry) {
    track({ cache: getCacheTypes(navigationEntry.serverTiming) });
  }
};
