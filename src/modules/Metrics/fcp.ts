import { Metric, onFCP } from 'web-vitals';

export default (
  track: (metrics: Pick<CollectorMetrics, 'fcp'>) => void
): void => {
  onFCP(({ value }: Metric) => {
    track({
      fcp: {
        value: Math.round(value),
      },
    });
  });
};
