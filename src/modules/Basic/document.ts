export default (
  track: (
    metrics: Pick<
      CollectorMetrics,
      'isInternalNavigation' | 'language' | 'referrer'
    >
  ) => void
): void => {
  const referrerURL: URL | null = document.referrer
    ? new URL(document.referrer)
    : null;

  track({
    isInternalNavigation: false,
    language: document.documentElement.lang,
    ...(referrerURL && {
      isInternalNavigation: document.referrer.includes(location.host),
      referrer: {
        domain: referrerURL.origin,
        url: `${referrerURL.origin}${referrerURL.pathname}`,
        urlParams: Array.from(referrerURL.searchParams.keys()),
      },
    }),
  });
};
