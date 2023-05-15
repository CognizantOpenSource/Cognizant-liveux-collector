//© 2023 Cognizant. All rights reserved. Cognizant Confidential and/or Trade Secret.

export const onBFCache = (callback) => {
  window.addEventListener('pageshow', (event) => {
    if(event.persisted) {
      callback();
    }
  }, true);
}
