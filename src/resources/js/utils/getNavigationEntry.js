//© 2023 Cognizant. All rights reserved. Cognizant Confidential and/or Trade Secret.

export const getNavigationEntry = () => {
  return (
    performance?.getEntriesByType &&
    performance.getEntriesByType('navigation')[0]
  );
};
