export default (track: (metrics: Pick<CollectorMetrics, 'window'>) => void) => {
  track({
    window: {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      devicePixelRatio: Math.round(100 * window.devicePixelRatio) / 100,
    },
  });
};
