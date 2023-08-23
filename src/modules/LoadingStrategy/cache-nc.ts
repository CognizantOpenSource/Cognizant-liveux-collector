const CACHE_NAMES_NC = [
  'no-cache',
  'dispatcher-cache',
  'cdn-cache-adobe',
  'cdn-cache-nc',
];
const HIT_STATE_NAME = 'be-hit-state';

const getCacheTypesNC = (
  serverTiming: readonly PerformanceServerTiming[]
): CacheType[] | undefined => {
  const hitStates = serverTiming
    .find(({ name }) => name === HIT_STATE_NAME)
    ?.description.split('|');

  if (hitStates === undefined || hitStates.length !== 4) return;

  const hitStatesIndex = hitStates.lastIndexOf('HIT');

  return [{ type: CACHE_NAMES_NC[hitStatesIndex] }];
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
    track({ cache: getCacheTypesNC(navigationEntry.serverTiming) });
  }
};
