import { getDOMAttribute } from '@/utilities';

const CONSENT_ATTRIBUTE = 'data-wp-page-cookie';

export default (
  track: (metrics: Pick<CollectorMetrics, 'consent'>) => void
) => {
  track({
    consent: getDOMAttribute(CONSENT_ATTRIBUTE),
  });
};
