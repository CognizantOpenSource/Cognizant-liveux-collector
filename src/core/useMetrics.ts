import { collect, collectError } from '@/utilities';

const REQUIRED_METRICS: Partial<CollectorMetrics> = {
  viewId: crypto.randomUUID(),
  timestamp: Date.now(),
  domain: location.origin,
  url: `${location.origin}${location.pathname}`,
};

export const useMetrics = (): MetricsHandler => {
  let trackedMetrics: Partial<CollectorMetrics> = {};

  const track = (metrics: Partial<CollectorMetrics>, immediate = false) => {
    if (immediate) {
      collect({
        ...metrics,
        ...REQUIRED_METRICS,
        ingestionTimestamp: Date.now(),
      } as CollectorMetrics);
    } else {
      trackedMetrics = {
        ...trackedMetrics,
        ...metrics,
      };
    }
  };

  const getMetrics = (): Partial<CollectorMetrics> => {
    let resources: Resource[] = [];

    if (trackedMetrics.resources && !Array.isArray(trackedMetrics.resources)) {
      resources = [
        ...(trackedMetrics.resources as Map<string, Resource>).values(),
      ];
    }

    return {
      ...trackedMetrics,
      ...REQUIRED_METRICS,
      resources,
      ingestionTimestamp: Date.now(),
    };
  };

  const reset = (initialMetrics?: Partial<CollectorMetrics>) => {
    trackedMetrics = { ...initialMetrics };
    REQUIRED_METRICS.timestamp = Date.now();
    REQUIRED_METRICS.viewId = crypto.randomUUID();
  };

  const trackError = (sourceError: unknown) => {
    const error = sourceError as Error;

    collectError({
      error,
      viewId: REQUIRED_METRICS.viewId as string,
    });
  };

  return {
    track,
    trackError,
    getMetrics,
    reset,
  };
};
