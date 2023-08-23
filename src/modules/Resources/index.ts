import trackResourcesMetrics from '@/modules/Resources/resources';
import { register, ON_START_STRATEGY } from '@/core/modulesRegistry';

const INIT_ON_BF_CACHE = false;

register(
  (
    trackingFn: (metrics: Partial<CollectorMetrics>) => void,
    errorTrackingFn: (error: unknown) => void,
    navigationEntry: PerformanceNavigationTiming | undefined
  ): void => {
    trackResourcesMetrics(trackingFn, errorTrackingFn, navigationEntry);
  },
  ON_START_STRATEGY,
  INIT_ON_BF_CACHE
);
