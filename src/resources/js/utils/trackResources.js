import { getNavigationEntry } from './getNavigationEntry';
import { BF_NAVIGATION_ENTRY_TYPE } from './constants';

const MAX_RESOURCES_TRACKED = 30;

export const trackResources = (navigationEntry) => {
  const navEntry = navigationEntry || getNavigationEntry() || null;
  const performanceEntries = performance.getEntriesByType
    ? performance.getEntriesByType('resource')
    : [];

  const resources = [navEntry].concat(performanceEntries);

  return resources
    .filter(({ transferSize = 0, type = ''}) => transferSize > 0 && type !== BF_NAVIGATION_ENTRY_TYPE)
    .slice(0, MAX_RESOURCES_TRACKED)
    .map(({name: url, transferSize: size, initiatorType: type}) => ({
        size,
        url,
        type
      }));
};
