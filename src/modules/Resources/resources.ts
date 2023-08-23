const MAX_RESOURCES_PER_CHUNK = 30;
const SUBMIT_EVERY_MS = 3000;
const BF_NAVIGATION_ENTRY_TYPE = 'back_forward';

const BUFFERED_RESOURCES: Map<string, Resource> = new Map<string, Resource>();
const BEACON_QUEUE = [];

export default (
  track: (
    metrics: Pick<CollectorMetrics, 'resources'>,
    immediate?: boolean
  ) => void,
  trackError: (error: unknown) => void,
  navigationEntry: PerformanceNavigationTiming | undefined
) => {
  if (navigationEntry) {
    const resourcesEntries: PerformanceResourceTiming[] =
      performance.getEntriesByType('resource') ?? [];

    let areResourcesAtLandingSent = false;

    const resourcesObserver = new PerformanceObserver((entryList) => {
      try {
        const rawResources = [...entryList.getEntries()];

        if (!areResourcesAtLandingSent) {
          areResourcesAtLandingSent = true;

          rawResources.unshift(
            navigationEntry as unknown as PerformanceEntry,
            ...(resourcesEntries as unknown as PerformanceEntry[])
          );
        }

        enqueue(toResources(rawResources), track);
      } catch (error: unknown) {
        trackError(error);
      }
    });

    resourcesObserver.observe({ type: 'resource' });
  }
};

function enqueue(
  resources: Resource[],
  track: (
    metrics: Pick<CollectorMetrics, 'resources'>,
    immediate?: boolean
  ) => void
) {
  resources.forEach((resource) =>
    BUFFERED_RESOURCES.set(resource.url, resource)
  );

  if (BUFFERED_RESOURCES.size >= MAX_RESOURCES_PER_CHUNK) {
    chunkResources().forEach((resources: Resource[], index: number) => {
      if (resources.length === MAX_RESOURCES_PER_CHUNK) {
        BEACON_QUEUE.push(
          setTimeout(() => {
            track({ resources }, true);
          }, (index + 1) * SUBMIT_EVERY_MS)
        );
      } else {
        /**
         * The last chunk may contain < 30 entries,
         * so it can be safely sent at navigation end
         * OR chained (re-buffered) in the next batch as soon as the
         * buffer is filled with 30 entries
         **/

        enqueue(resources, track);
      }
    });
  } else {
    /**
     * Update the resources that could
     * potentially be tracked at navigation end as a remainder
     * as they are < 30 entries
     **/

    track({
      resources: BUFFERED_RESOURCES,
    });
  }
}

const chunkResources = (): Array<Resource[]> => {
  const chunks: Array<Resource[]> = [];

  let index = 0;

  for (const [resourceID, resource] of BUFFERED_RESOURCES.entries()) {
    if (index % MAX_RESOURCES_PER_CHUNK === 0) {
      chunks.push([]);
    }

    chunks[chunks.length - 1].push(resource as Resource);
    BUFFERED_RESOURCES.delete(resourceID);

    index++;
  }

  return chunks;
};

const toResources = (entries: any[]): Resource[] =>
  entries
    .filter(
      ({ transferSize = 0, type = '' }) =>
        transferSize && type !== BF_NAVIGATION_ENTRY_TYPE
    )
    .map(
      ({
        name: url,
        transferSize: size,
        initiatorType: type,
      }: PerformanceResourceTiming) => ({ size, url, type })
    );
