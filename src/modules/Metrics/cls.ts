import { onCLS } from 'web-vitals/attribution';
import { roundMS } from '@/utilities';

export default (
  track: (metrics: Pick<CoreWebVitals, 'cls'>) => void,
  trackError: (error: unknown) => void
): void => {
  onCLS(({ value, attribution }: any) => {
    try {
      const hasAttribution = Object.keys(attribution).length;

      track({
        cls: {
          value: roundMS(value),
          ...(hasAttribution && {
            largestShift: {
              element: attribution.largestShiftTarget,
              loadState: attribution.loadState,
              time: Math.round(attribution.largestShiftTime),
              value: roundMS(attribution.largestShiftValue),
            },
          }),
        },
      });
    } catch (error: unknown) {
      trackError(error);
    }
  });
};
