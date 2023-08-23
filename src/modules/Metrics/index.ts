import {
  register,
  ON_START_STRATEGY,
  ON_LEAVE_STRATEGY,
} from '@/core/modulesRegistry';
import trackFCP from '@/modules/Metrics/fcp';
import trackFID from '@/modules/Metrics/fid';
import trackLCP from '@/modules/Metrics/lcp';
import trackOnLoad from '@/modules/Metrics/onLoad';
import trackTTFB from '@/modules/Metrics/ttfb';
import trackCLS from '@/modules/Metrics/cls';
import trackINP from '@/modules/Metrics/inp';

const INIT_ON_BF_CACHE = false;

register(
  (track, errorTrackingFn) => {
    trackFCP(track);
    trackFID(track);
    trackLCP(track);
    trackTTFB(track, errorTrackingFn);
    trackCLS(track, errorTrackingFn);
    trackINP(track, errorTrackingFn);
  },
  ON_START_STRATEGY,
  INIT_ON_BF_CACHE
);

register(
  (
    track: (metrics: Partial<CollectorMetrics>) => void,
    errorTrackingFn,
    navigationEntry
  ): void => {
    trackOnLoad(track, errorTrackingFn, navigationEntry);
  },
  ON_LEAVE_STRATEGY,
  INIT_ON_BF_CACHE
);
