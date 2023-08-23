import { getDOMAttribute } from '@/utilities';

const HTTP_STATUS_ATTRIBUTE = 'data-wp-http-status';
const MARKET_ATTRIBUTE = 'data-wp-market';
const PAGE_TYPE_ATTRIBUTE = 'data-wp-page-type';
const SSR_TIME_ATTRIBUTE = 'data-wp-page-render-time';
const VERSION_NAME_SELECTOR = 'data-wp-version-name';

export default (
  track: (
    metrics: Pick<
      CollectorMetrics,
      'httpStatusCode' | 'market' | 'pageType' | 'ssrTime' | 'version'
    >
  ) => void
): void => {
  const ssrTime = getDOMAttribute(SSR_TIME_ATTRIBUTE);
  const versionName = getDOMAttribute(VERSION_NAME_SELECTOR);

  track({
    httpStatusCode: getDOMAttribute(HTTP_STATUS_ATTRIBUTE),
    market: getDOMAttribute(MARKET_ATTRIBUTE),
    pageType: getDOMAttribute(PAGE_TYPE_ATTRIBUTE),
    ...(ssrTime && { ssrTime: { value: Number(ssrTime) } }),
    ...(versionName && { version: { name: versionName } }),
  });
};
