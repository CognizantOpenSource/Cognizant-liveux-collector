export default (
  track: (metrics: Pick<CollectorMetrics, 'domContentLoaded' | 'load'>) => void,
  trackError: (error: unknown) => void,
  navigationEntry: PerformanceNavigationTiming | undefined
) => {
  if (navigationEntry) {
    track({
      domContentLoaded: {
        start: Math.round(navigationEntry.domContentLoadedEventStart),
        duration: Math.round(
          navigationEntry.domContentLoadedEventEnd -
            navigationEntry.domContentLoadedEventStart
        ),
      },
      load: {
        start: Math.round(navigationEntry.loadEventStart),
        duration: Math.round(
          navigationEntry.loadEventEnd - navigationEntry.loadEventStart
        ),
      },
    });
  }
};
