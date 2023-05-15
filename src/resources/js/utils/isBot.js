//© 2023 Cognizant. All rights reserved. Cognizant Confidential and/or Trade Secret.

export const isBot = () => {
  const bots = /bot|crawl|spider|baidu|bingpreview|Datanyze|facebookexternalhit|mediapartners-google|slurp|Sogou|yandex/i;
  return bots.test(navigator.userAgent);
};
