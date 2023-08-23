interface onBFCacheCallback {
  (event: PageTransitionEvent): void;
}

export const onBFCacheRestore = (callback: onBFCacheCallback) => {
  addEventListener(
    'pageshow',
    (event) => {
      if (event.persisted) {
        callback(event);
      }
    },
    true
  );
};
