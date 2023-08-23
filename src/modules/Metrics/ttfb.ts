import { Metric, onTTFB } from 'web-vitals';

export default (
  track: (metrics: Pick<CollectorMetrics, 'ttfb'>) => void,
  trackError: (error: unknown) => void
): void => {
  onTTFB(({ value, entries }: Metric) => {
    try {
      const navigationEntry = entries[0] as PerformanceNavigationTiming;

      const navigationTimings = navigationEntry && {
        redirectTime: Math.round(navigationEntry.fetchStart),
        dnsTime: Math.round(
          navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart
        ),
        connectionTime: Math.round(
          navigationEntry.connectEnd - navigationEntry.connectStart
        ),
        requestTime: Math.round(
          navigationEntry.responseStart - navigationEntry.requestStart
        ),
        responseTime: Math.round(
          Math.max(
            navigationEntry.responseEnd - navigationEntry.responseStart,
            0
          )
        ),
      };

      track({
        ttfb: {
          ...navigationTimings,
          value: Math.round(value),
        },
      });
    } catch (error: unknown) {
      trackError(error);
    }
  });
};
