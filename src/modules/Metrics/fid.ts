import { Metric, onFID } from 'web-vitals';

export default (
  track: (metrics: Pick<CollectorMetrics, 'fid'>) => void
): void => {
  onFID(({ value }: Metric) => {
    track({
      fid: {
        value: Math.round(value),
      },
    });
  });
};
