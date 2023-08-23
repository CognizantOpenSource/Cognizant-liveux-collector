const COLOR_SCHEME_RULE_NAME = 'prefers-color-scheme';

export default (
  track: (metrics: Pick<CollectorMetrics, 'device' | 'preferences'>) => void
) => {
  const { deviceMemory: memory, hardwareConcurrency: cpu }: Navigator =
    navigator;

  const payload: Partial<CollectorMetrics> = {};

  if (memory && cpu) {
    payload.device = {
      cpu,
      memory,
    };
  }

  const isDarkMode = trackColorScheme();

  if (isDarkMode !== null) {
    payload.preferences = {
      darkMode: isDarkMode,
    };
  }

  track(payload);
};

function trackColorScheme() {
  const isSupported =
    window.matchMedia &&
    window.matchMedia(`(${COLOR_SCHEME_RULE_NAME}`).matches;

  return isSupported
    ? window.matchMedia(`(${COLOR_SCHEME_RULE_NAME}: dark)`).matches
    : null;
}
