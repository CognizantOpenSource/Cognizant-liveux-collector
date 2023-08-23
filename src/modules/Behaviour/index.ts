import trackBehaviour from '@/modules/Behaviour/behaviour';
import { register, ON_LEAVE_STRATEGY } from '@/core/modulesRegistry';

const INIT_ON_BF_CACHE = true;

register((track: (metrics: Partial<CollectorMetrics>) => void): void => {
  trackBehaviour(track);
}, ON_LEAVE_STRATEGY, INIT_ON_BF_CACHE);
