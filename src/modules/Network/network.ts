export default (
  track: (metrics: Pick<CollectorMetrics, 'network'>) => void
) => {
  if ('connection' in navigator) {
    const {
      downlink,
      effectiveType,
      rtt,
      saveData,
    }: NetworkInformation = navigator.connection;

    track({
      network: {
        downlink,
        effectiveType,
        rtt,
        saveData,
      },
    });
  }
};
