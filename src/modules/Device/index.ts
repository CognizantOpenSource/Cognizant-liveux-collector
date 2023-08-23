import trackDevice from '@/modules/Device/device';
import { register, ON_START_STRATEGY } from '@/core/modulesRegistry';

const INIT_ON_BF_CACHE = true;

register((track: (metrics: Partial<CollectorMetrics>) => void): void => {
  trackDevice(track);
}, ON_START_STRATEGY, INIT_ON_BF_CACHE);
