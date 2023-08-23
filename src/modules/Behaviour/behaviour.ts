export default (
  track: (metrics: Pick<CollectorMetrics, 'behaviour'>) => void
) => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPosition = Math.min(Math.max(window.scrollY, 0), scrollHeight);
  const percentOnLeave =
    scrollHeight > 0
      ? Math.round(10000 * scrollPosition / scrollHeight) / 100
      : 0;

  track({
    behaviour: {
      scroll: {
        pxOnLeave: Math.round(scrollPosition),
        percentOnLeave,
      },
      timeOnPage: Math.round(performance.now()),
    },
  });
};
