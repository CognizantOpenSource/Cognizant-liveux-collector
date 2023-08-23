import { onLCP } from 'web-vitals/attribution';

export default (track: (metrics: Pick<CoreWebVitals, 'lcp'>) => void): void => {
  onLCP(({ value, attribution }: any) => {
    track({
      lcp: {
        element: attribution?.element ?? '',
        value: Math.round(value),
      },
    });
  });
};
