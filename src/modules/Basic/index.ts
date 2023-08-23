import trackDocumentMetrics from '@/modules/Basic/document';
import trackLocationMetrics from '@/modules/Basic/location';
import { register, ON_START_STRATEGY } from '@/core/modulesRegistry';

const INIT_ON_BF_CACHE = true;

register((track: (metrics: Partial<CollectorMetrics>) => void): void => {
  trackDocumentMetrics(track);
  trackLocationMetrics(track);
}, ON_START_STRATEGY, INIT_ON_BF_CACHE)
