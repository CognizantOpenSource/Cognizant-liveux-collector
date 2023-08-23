export const REGISTER_METRIC_EVENT_NAME = 'registerMetric';

export const ON_START_STRATEGY = 'onStart';
export const ON_NAVIGATION_STRATEGY = 'onNavigation';
export const ON_LEAVE_STRATEGY = 'onLeave';

/**
 * TODO This will turn into a TS decorator
 * Functionally it's just that, even now
 **/
export function register(
  moduleInitializer: ModuleInitializer,
  strategy: string,
  initOnBFCache: boolean,
) {
  document.dispatchEvent(
    new CustomEvent(REGISTER_METRIC_EVENT_NAME, {
      detail: { moduleInitializer, strategy, initOnBFCache },
    })
  );
}
