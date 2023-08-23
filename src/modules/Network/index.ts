import trackNetworkMetrics from '@/modules/Network/network';
import { register, ON_START_STRATEGY } from '@/core/modulesRegistry';

const INIT_ON_BF_CACHE = true;

register((trackingFn: (metrics: Partial<CollectorMetrics>) => void): void => {
  trackNetworkMetrics(trackingFn);
}, ON_START_STRATEGY, INIT_ON_BF_CACHE);
