import { onFCP, onFID, onTTFB } from 'web-vitals';
import { onCLS, onLCP, onINP } from 'web-vitals/attribution';
import { isBot } from '../resources/js/utils/isBot';
import {
  createApiReporter,
  onVisibilityChange,
} from '../resources/js/utils/createApiReporter';
import { getNavigationEntry } from '../resources/js/utils/getNavigationEntry';
import { onBFCache } from '../resources/js/utils/onBFCache';
import { isDomain } from '../resources/js/utils/isDomain';
import {
  ENDPOINT,
  cookieDataSelector,
  marketSelector,
  renderTimeSelector,
  CACHE_NAMES,
  CACHE_NAMES_NC,
  JWT_NAME,
  httpStatusSelector,
  pageTypeSelector,
  versionNameSelector,
  NO_CACHE,
} from '../resources/js/utils/constants';
import { trackDarkMode } from '../resources/js/utils/trackDarkMode';
import { trackResources } from '../resources/js/utils/trackResources';

const trackAdditionalData = (report, navigationEntry) => {
  const domain = window.location.origin;
  const url = `${window.location.origin}${window.location.pathname}`;


  // report required values
  report({
    domain,
    url,
    timestamp: Date.now(),
  });

  // cookie
  onVisibilityChange(() => {
    const consentString = document
      .querySelector(`[${cookieDataSelector}]`)
      ?.getAttribute(cookieDataSelector);

    report({
      consent: consentString ? consentString.split(',') : [],
    });
  });

  onVisibilityChange(() => {
    const resources = trackResources(navigationEntry);

    if (resources.length) {
      report({
        resources,
      });
    }
  });

  // window information
  report({
    window: {
      // add window for readability
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      devicePixelRatio: Math.round(100 * window.devicePixelRatio) / 100,
    },
  });

  // network information
  if ('connection' in navigator) {
    const { saveData, downlink, effectiveType, rtt } = navigator.connection;

    report({
      network: {
        downlink,
        effectiveType,
        rtt,
        saveData,
      },
    });
  }

  // device information
  if ('deviceMemory' in navigator && 'hardwareConcurrency' in navigator) {
    report({
      device: {
        memory: navigator.deviceMemory,
        cpu: navigator.hardwareConcurrency,
      },
    });
  }

  //preferences
  const isDarkMode = trackDarkMode();
  if (isDarkMode) {
    report({
      preferences: {
        darkMode: isDarkMode,
      },
    });
  }

  // market, language, http status, render time
  const market = document
    .querySelector(`[${marketSelector}]`)
    ?.getAttribute(marketSelector);
  const language = document.documentElement.lang;
  const httpStatusCode = document
    .querySelector(`[${httpStatusSelector}]`)
    ?.getAttribute(httpStatusSelector);
  const pageType = document
    .querySelector(`[${pageTypeSelector}]`)
    ?.getAttribute(pageTypeSelector);
  const versionName = document
    .querySelector(`[${versionNameSelector}]`)
    ?.getAttribute(versionNameSelector);
  let ssrTime = document
    .querySelector(`[${renderTimeSelector}]`)
    ?.getAttribute(renderTimeSelector);
  if (ssrTime !== undefined) {
    ssrTime = Number(ssrTime);
  }

  // url information
  const urlSearchParameters = new URLSearchParams(window.location.search);
  const urlParams = Array.from(urlSearchParameters.keys());
  const urlHash = window.location.hash.includes(JWT_NAME)
    ? ''
    : window.location.hash;
  const isInternalNavigation = document.referrer.includes(
    document.location.host
  );
  const referrerUrl = document.referrer ? new URL(document.referrer) : null;

  // behaviour
  onVisibilityChange(() => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = Math.min(Math.max(window.scrollY, 0), scrollHeight);
    const percentOnLeave =
      scrollHeight > 0
        ? Math.round((10000 * scrollPosition) / scrollHeight, 1) / 100
        : 0;

    report({
      behaviour: {
        scroll: {
          pxOnLeave: Math.round(scrollPosition),
          percentOnLeave,
        },
        timeOnPage: Math.round(performance.now()),
      },
    });
  });

  report({
    isInternalNavigation,
    urlParams,
    urlHash,
    market,
    language,
    httpStatusCode,
    pageType,
    ...(versionName && { version: { name: versionName } }),
  });

  if (ssrTime) {
    report({
      ssrTime: {
        value: ssrTime,
      },
    });
  }

  if (referrerUrl) {
    report({
      referrer: {
        url: referrerUrl.href,
        domain: referrerUrl.origin,
        urlParams: Array.from(referrerUrl.searchParams.keys()),
      },
    });
  }
};

/**
 * Initialise RUM collector for `chance` percentage of users (chance should be between 0.1 and 1.0)
 * Collect metrics and send them to an endpoint on `viewchange` event
 *
 * @param {string} endpoint
 * @param {number} chance
 */

const initCollector = (endpoint, chance = 1) => {
  if (!endpoint) {
    console.log('Please specify endpoint');
    return;
  }
  if (isBot() || Math.random() > chance) return;

  const report = createApiReporter(endpoint);

  const reportHandler = ({ name, value }) => {
    let CWVEntry = {
      [name.toLocaleLowerCase()]: {
        value: Math.round(value),
      },
    };
    report(CWVEntry);
  };

  onLCP(({ name, value, attribution }) => {
    report({
      [name.toLocaleLowerCase()]: {
        element: attribution?.element ?? '',
        value: Math.round(value),
      },
    });
  });

  onINP(({name, value, attribution}) => {
    const hasAttribution = Object.keys((attribution || {})).length;

    report({
      [name.toLocaleLowerCase()]: {
        value: Math.round(value),
        ...(hasAttribution && {
          event: {
            loadState: attribution.loadState,
            target: attribution.eventTarget,
            type: attribution.eventType,
            time: Math.round(attribution.eventTime * 10000) / 10000,
          }
        }),
      },
    });
  });


  onCLS(({ name, value, attribution }) => {
    const hasAttribution = Object.keys((attribution || {})).length;

    report({
      [name.toLocaleLowerCase()]: {
        value: Math.round(value * 10000) / 10000,
        ...(hasAttribution && {
          largestShift: {
            element: attribution.largestShiftTarget,
            loadState: attribution.loadState,
            time: Math.round(attribution.largestShiftTime),
            value: Math.round(attribution.largestShiftValue * 10000) / 10000,
          }
        }),
      },
    });

  });

  onTTFB(({ name, value, entries }) => {
    const metricValue = Math.round(value);

    const navigationTimings = entries[0] && {
      redirectTime: Math.round(entries[0].fetchStart),
      dnsTime: Math.round(
        entries[0].domainLookupEnd - entries[0].domainLookupStart
      ),
      connectionTime: Math.round(
        entries[0].connectEnd - entries[0].connectStart
      ),
      requestTime: Math.round(
        entries[0].responseStart - entries[0].requestStart
      ),
      responseTime: Math.round(
        Math.max(entries[0].responseEnd - entries[0].responseStart, 0)
      ),
    };
    report({
      [name.toLocaleLowerCase()]: {
        value: metricValue,
        ...navigationTimings,
      },
    });

  });

  onFID(reportHandler);

  onFCP(reportHandler);

  const navEntry = getNavigationEntry();

  // CDN and dispatcher cache
  if (navEntry && 'serverTiming' in navEntry) {
    if (isDomain('www.netcentric.biz')) {
      const hitStates = navEntry.serverTiming
        .find(({ name }) => name === 'be-hit-state')
        ?.description.split('|');

      if (hitStates !== undefined || hitStates.length === 4) {
        const type = CACHE_NAMES_NC[hitStates.lastIndexOf('HIT')];
        report({ cache: [{ type }] });
      }
    } else {
      const cacheTypes = navEntry.serverTiming
        .filter(({ name, duration }) => CACHE_NAMES.includes(name) && duration)
        .map(({ name, duration }) => ({
          type: name,
          age: duration,
          // description for future development
          // description,
        }));

      if (cacheTypes.length) {
        report({ cache: [...cacheTypes] });
      } else {
        report({ cache: [{ type: NO_CACHE }] });
      }
    }
  }

  // loading events
  if (navEntry) {
    onVisibilityChange(() => {
      report({
        domContentLoaded: {
          start: Math.round(navEntry.domContentLoadedEventStart),
          duration: Math.round(
            navEntry.domContentLoadedEventEnd -
              navEntry.domContentLoadedEventStart
          ),
        },
        load: {
          start: Math.round(navEntry.loadEventStart),
          duration: Math.round(navEntry.loadEventEnd - navEntry.loadEventStart),
        },
      });
    });
  }

  trackAdditionalData(report, navEntry);

  onBFCache(() => {
    trackAdditionalData(report, navEntry);
  });
};

try {
  initCollector(ENDPOINT, 1);
} catch (error) {
  console.log(error);
}
