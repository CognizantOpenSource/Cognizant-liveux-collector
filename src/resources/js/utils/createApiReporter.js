import { v4 as generateViewId } from 'uuid';
import { onBFCache } from './onBFCache';
import { MAX_CONTENT_LENGTH, BFCACHE } from './constants';

export function createApiReporter(url) {
  let isSent = false;
  let values = {
    viewId: generateViewId(),
  };

  onBFCache(() => {
    values = {
      cache: [{ type: BFCACHE }],
      // Regen viewId
      viewId: generateViewId()
    };

    isSent = false;

    onVisibilityChange(sendData, 1);
  });

  const sendData = () => {
    if (isSent) return;
    isSent = true;
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(values)], {
        type: 'application/json',
      });

      if (blob.size < MAX_CONTENT_LENGTH) {
        navigator.sendBeacon(url, blob);
      }
    } else {
      const client = new XMLHttpRequest();
      client.open('POST', url, false);
      client.setRequestHeader('Content-Type', 'application/json');
      client.send(JSON.stringify(values));
    }
  };

  onVisibilityChange(sendData, 1);

  return (newMetrics) => {
    values = {
      ingestionTimestamp: Date.now(),
      ...values,
      ...newMetrics,
    };
  };
}

let visiblityChangeCallbacks = [];
let isVisibilitChangeInit = false;

export function onVisibilityChange(callback, order = 0) {
  visiblityChangeCallbacks.push([callback, order]);
  const visibilityChangeCB = () => {
    if (document.visibilityState === 'hidden') {
      visiblityChangeCallbacks
        .sort((a, b) => a[1] - b[1])
        .forEach(([cb]) => cb());
      visiblityChangeCallbacks = [];
    }
  };

  if (!isVisibilitChangeInit) {
    isVisibilitChangeInit = true;
    document.addEventListener('visibilitychange', visibilityChangeCB);
  }
}
