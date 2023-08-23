import {
  register,
  ON_LEAVE_STRATEGY,
  ON_NAVIGATION_STRATEGY,
  ON_START_STRATEGY,
  REGISTER_METRIC_EVENT_NAME,
} from '@/core/modulesRegistry';
import * as CollectorCore from '@/core';
import * as Utilities from '@/utilities';

describe('Collector Core', () => {
  describe('Initialization', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`listens to "${REGISTER_METRIC_EVENT_NAME}" event for metrics module registration`, () => {
      const addEventListenerMock = jest.spyOn(document, 'addEventListener');

      CollectorCore.initialize();

      expect(addEventListenerMock).toHaveBeenCalledTimes(2);

      const [, secondCall] = addEventListenerMock.mock.calls;
      const [eventName, callback] = secondCall;

      expect(eventName).toBe(REGISTER_METRIC_EVENT_NAME);
      expect((callback as () => void).name).toBe('onRegister');
    });

    it(`listens to "visibilitychange" event to submit metrics`, () => {
      const addEventListenerMock = jest.spyOn(document, 'addEventListener');

      CollectorCore.initialize();

      expect(addEventListenerMock).toHaveBeenCalledTimes(2);

      const [firstCall] = addEventListenerMock.mock.calls;
      const [eventName, callback] = firstCall;

      expect(eventName).toBe('visibilitychange');
      expect((callback as () => void).name).toBe('send');
    });
  });

  describe('Module initializer registration', () => {
    const someModuleInitializer: ModuleInitializer = jest
      .fn()
      .mockName('someModuleInitializer');

    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`runs a tracking module immediately if its strategy is "${ON_START_STRATEGY}"`, () => {
      CollectorCore.initialize();

      register(someModuleInitializer, ON_START_STRATEGY, false);

      expect(someModuleInitializer).toHaveBeenCalledTimes(1);
      expect(CollectorCore.MODULES_ON_LEAVE.length).toBe(0);
    });

    it(`runs a tracking module immediately if its strategy is "${ON_NAVIGATION_STRATEGY}"`, () => {
      CollectorCore.initialize();

      register(someModuleInitializer, ON_NAVIGATION_STRATEGY, false);

      expect(someModuleInitializer).toHaveBeenCalledTimes(1);
      expect(CollectorCore.MODULES_ON_LEAVE.length).toBe(0);
    });

    it(`registers a tracking module for later execution if its strategy is "${ON_LEAVE_STRATEGY}"`, () => {
      CollectorCore.initialize();

      register(someModuleInitializer, ON_LEAVE_STRATEGY, false);

      expect(someModuleInitializer).not.toHaveBeenCalled();
      expect(CollectorCore.MODULES_ON_LEAVE.length).toBe(1);

      const [initializer] = CollectorCore.MODULES_ON_LEAVE;

      expect(initializer).toEqual(someModuleInitializer);
    });
  });

  describe('Tracking', () => {
    const someModuleInitializer: ModuleInitializer = jest
      .fn()
      .mockImplementation((trackingFn) =>
        trackingFn({ domain: 'http://localhost' })
      )
      .mockName('someModuleInitializer');

    beforeEach(() => {
      CollectorCore.reset();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`"${ON_START_STRATEGY}" strategy`, () => {
      CollectorCore.initialize();

      register(someModuleInitializer, ON_START_STRATEGY, false);

      expect(CollectorCore.getMetrics()).toStrictEqual({
        domain: 'http://localhost',
        ingestionTimestamp: expect.any(Number),
        resources: expect.any(Array),
        timestamp: expect.any(Number),
        url: 'http://localhost/',
        viewId: expect.any(String),
      });
    });

    it(`${ON_NAVIGATION_STRATEGY} strategy`, () => {
      CollectorCore.initialize();

      register(someModuleInitializer, ON_NAVIGATION_STRATEGY, false);

      expect(CollectorCore.getMetrics()).toStrictEqual({
        domain: 'http://localhost',
        ingestionTimestamp: expect.any(Number),
        resources: expect.any(Array),
        timestamp: expect.any(Number),
        url: 'http://localhost/',
        viewId: expect.any(String),
      });
    });

    it(`${ON_LEAVE_STRATEGY} strategy`, () => {
      CollectorCore.initialize();

      register(someModuleInitializer, ON_LEAVE_STRATEGY, false);

      expect(CollectorCore.getMetrics()).toStrictEqual({
        domain: 'http://localhost',
        ingestionTimestamp: expect.any(Number),
        resources: expect.any(Array),
        timestamp: expect.any(Number),
        url: 'http://localhost/',
        viewId: expect.any(String),
      });
    });
  });

  describe('Submission', () => {
    const onStartInitializer: ModuleInitializer = jest
      .fn()
      .mockImplementation((trackingFn) =>
        trackingFn({ domain: 'http://localhost' })
      )
      .mockName(ON_START_STRATEGY);

    const onNavigationInitializer: ModuleInitializer = jest
      .fn()
      .mockImplementation((trackingFn) => trackingFn({ fid: { value: 3213 } }))
      .mockName(ON_NAVIGATION_STRATEGY);

    const onLeaveInitializer: ModuleInitializer = jest
      .fn()
      .mockImplementation((trackingFn) =>
        trackingFn({ consent: 'not-accepted' })
      )
      .mockName(ON_LEAVE_STRATEGY);

    afterEach(() => {
      CollectorCore.reset();

      jest.clearAllMocks();
    });

    it.skip('submits the beacon only on "visibilitychange" if `document.visitibilityState === "hidden"`', () => {
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
      });
      const collectMock = jest.spyOn(Utilities, 'collect');

      CollectorCore.initialize();

      register(onStartInitializer, ON_START_STRATEGY, false);
      register(onNavigationInitializer, ON_NAVIGATION_STRATEGY, false);
      register(onLeaveInitializer, ON_LEAVE_STRATEGY, false);

      expect(CollectorCore.getMetrics()).toStrictEqual({
        domain: 'http://localhost',
        fid: {
          value: 3213,
        },
        ingestionTimestamp: expect.any(Number),
        timestamp: expect.any(Number),
        url: 'http://localhost/',
        viewId: expect.any(String),
      });

      document.dispatchEvent(new Event('visibilitychange'));

      const finalPayload = {
        consent: 'not-accepted',
        domain: 'http://localhost',
        fid: {
          value: 3213,
        },
        ingestionTimestamp: expect.any(Number),
        timestamp: expect.any(Number),
        url: 'http://localhost/',
        viewId: expect.any(String),
      };

      expect(CollectorCore.getMetrics()).toStrictEqual(finalPayload);
      expect(collectMock).toHaveBeenCalledWith(finalPayload);
    });
  });
});
