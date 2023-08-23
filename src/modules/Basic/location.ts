const JWT_NAME = 'access_token';

export default (
  track: (metrics: Pick<CollectorMetrics, 'urlHash' | 'urlParams'>) => void
): void => {
  track({
    urlHash: location.hash.includes(JWT_NAME) ? '' : location.hash,
    urlParams: Array.from(new URLSearchParams(location.search).keys()),
  });
};
