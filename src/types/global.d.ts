export {};

declare module 'uuid';

declare global {
  interface Navigator {
    deviceMemory?: number;
  }

  interface PerformanceEntry {
    element: Node | HTMLElement;
    serverTiming: PerformanceServerTiming[] | null;
    sources: LayoutShiftAttribution[];
    value: number;
  }

  interface NetworkInformation {
    downlink?: number;
    effectiveType?: string;
    rtt?: number;
    saveData?: boolean;
  }

  type CoreWebVitalEntry = {
    value: number;
    element: string | string[];
  };

  type CoreWebVitals = {
    cls: {
      value: number;
      largestShift?: {
        element: string;
        loadState: string;
        time: number;
        value: number;
      };
    };
    fid: {
      value: number;
    };
    fcp: {
      value: number;
    };
    inp: {
      value: number;
      event?: {
        target: string;
        loadState: string;
        time: number;
        type: string;
      };
    };
    lcp: CoreWebVitalEntry;
    ttfb: {
      connectionTime?: number;
      dnsTime?: number;
      redirectTime?: number;
      requestTime?: number;
      responseTime?: number;
      value: number;
    };
  };

  type Resource = {
    url: string;
    type: string;
    size: number;
  };

  type Timing = {
    start: number;
    duration: number;
  };

  type CacheType = {
    age?: number;
    type: string;
    // TODO We may want to add a description
    // description: string;
  };

  type Behaviour = {
    behaviour: {
      scroll: {
        pxOnLeave: number;
        percentOnLeave: number;
      };
      timeOnPage: number;
    };
  };

  type NavigationEndMetrics = Behaviour & {
    consent?: string;
    /**
     * Using a map to ensure uniqueness,
     * convert to Array right before send if any leftover is present
     */
    resources?: Resource[] | Map<string, Resource>;
  };

  type NavigationStartMetrics = {
    // window
    domain: string;
    url: string;
    timestamp: number;
    urlHash?: string;
    urlParams?: string[];

    device?: {
      cpu: number;
      memory: number;
    };
    network?: {
      downlink?: number;
      effectiveType?: string;
      rtt?: number;
      saveData?: boolean;
    };
    preferences?: {
      darkMode?: boolean;
    };

    window?: {
      innerHeight: number;
      innerWidth: number;
      devicePixelRatio: number;
    };

    // DOM / Document
    isInternalNavigation?: boolean;
    language?: string;
    referrer?: {
      url: string;
      domain: string;
      urlParams: string[];
    };

    // DOM LiveUX data-layer (Henkel-based)
    httpStatusCode?: string;
    market?: string;
    pageType?: string;
    ssrTime?: {
      value: number;
    };
    version?: {
      name: string;
    };
  };

  type RuntimeMetrics = CoreWebVitals & {
    // on 'pageshow' and from window performanceTimings.serverTiming
    cache?: CacheType[];

    // on domContentLoaded / load
    domContentLoaded?: Timing;
    load?: Timing;
  };

  type SystemDimensions = {
    viewId: string;
    ingestionTimestamp: number;
  };

  type CollectorMetrics = NavigationStartMetrics &
    RuntimeMetrics &
    NavigationEndMetrics &
    SystemDimensions;

  type CollectorError = {
    message: string;
    stacktrace: string;
    source: string;
    type: string | 'error';
    viewId: string;
    url: string;
  };

  type ModuleInitializer = (
    trackingFn: (metrics: Partial<CollectorMetrics>) => void,
    errorTrackingFn: (error: unknown) => void,
    navigationEntry: PerformanceNavigationTiming | undefined
  ) => void;

  type ModuleConfig = {
    moduleInitializer: ModuleInitializer;
    strategy: string;
  };

  interface WindowEventMap {
    registerMetric: CustomEvent;
  }

  interface Document {
    addEventListener<T extends keyof CustomEventMap>(
      type: T,
      listener: (this: Window, event: CustomEventMap[T]) => void
    ): void;

    removeEventListener<T extends keyof CustomEventMap>(
      type: T,
      listener: (this: Window, event: CustomEventMap[T]) => void
    ): void;
  }

  interface MetricsHandler {
    track: (newMetrics: Partial<CollectorMetrics>) => void;
    trackError: (error: unknown) => void;
    getMetrics: () => Partial<CollectorMetrics>;
    reset: (initialMetrics?: Partial<CollectorMetrics>) => void;
  }
}
