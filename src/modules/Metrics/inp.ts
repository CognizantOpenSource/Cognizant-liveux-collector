import { onINP } from 'web-vitals/attribution';
import { roundMS } from '@/utilities';

export default (
  track: (metrics: Pick<CollectorMetrics, 'inp'>) => void,
  trackError: (error: unknown) => void
): void => {
  onINP(({ value, attribution }: any) => {
    try {
      const hasAttribution = Object.keys(attribution || {}).length;

      track({
        inp: {
          value: Math.round(value),
          ...(hasAttribution && {
            event: {
              loadState: attribution.loadState,
              target: attribution.eventTarget,
              type: attribution.eventType,
              time: roundMS(attribution.eventTime),
            },
          }),
        },
      });
    } catch (error: unknown) {
      trackError(error);
    }
  });
};
