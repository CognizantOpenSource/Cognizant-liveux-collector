const ENDPOINT = 'ENDPOINT_REPLACE_ME_STRING';
const ENDPOINT_ERROR_LOGGING = 'ENDPOINT_ERROR_LOGGING_REPLACE_ME_STRING';

export const isBot = (): boolean => {
  const bots =
    /bot|crawl|spider|baidu|bingpreview|Datanyze|facebookexternalhit|mediapartners-google|slurp|Sogou|yandex/i;

  return bots.test(navigator.userAgent);
};

export const isDomain = (domain: string): boolean =>
  domain === location.hostname;

export const roundMS = (value: number): number =>
  Math.round(value * 10000) / 10000;

export const getNavigationEntry = ():
  | PerformanceNavigationTiming
  | undefined => {
  return (
    performance?.getEntriesByType &&
    performance.getEntriesByType('navigation')[0]
  );
};

export const getDOMAttribute = (attributeName: string): string | undefined => {
  const element: HTMLElement | null = document.querySelector(
    `[${attributeName}]`
  );

  return element?.getAttribute(attributeName) ?? undefined;
};

export const collect = (
  data: CollectorMetrics | CollectorError,
  endpointOverride?: string,
  plain = false
) => {
  try {
    const bodyString: string | Blob = JSON.stringify(data);

    const ok = navigator.sendBeacon(
      endpointOverride || ENDPOINT,
      plain ? bodyString : new Blob([bodyString], { type: 'application/json' })
    );

    if (!ok) {
      throw new Error('Beacon failure.');
    }
  } catch (error: unknown) {
    console.error(
      `[Cognizant Web Vitals Monitoring Error]: Failed to log.
      ${(error as Error)?.message || error || ''}`
    );

    collectError({ error, viewId: '' });
  }
};

export function collectError({
  error: sourceError,
  viewId,
}: {
  viewId: string;
  error: unknown;
}): void {
  const error = sourceError as Error;

  collect(
    {
      message: error?.message || error || '',
      source: 'collector',
      stacktrace: (error?.stack || '').toString(),
      type: 'error',
      viewId,
      url: location.href,
    } as CollectorError,
    ENDPOINT_ERROR_LOGGING,
    true
  );
}
