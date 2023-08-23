import trackConsent from '@/modules/DataLayer/consent';
import trackDataLayer from '@/modules/DataLayer/dataLayer';
import { register, ON_LEAVE_STRATEGY } from '@/core/modulesRegistry';

const INIT_ON_BF_CACHE = true;

register((track: (metrics: Partial<CollectorMetrics>) => void): void => {
  trackConsent(track);
  trackDataLayer(track);
}, ON_LEAVE_STRATEGY, INIT_ON_BF_CACHE);
