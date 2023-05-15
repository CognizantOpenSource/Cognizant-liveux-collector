//© 2023 Cognizant. All rights reserved. Cognizant Confidential and/or Trade Secret.

const MAX_RESOURCES_TRACKED = 30;

export const trackResources = () => {
    const resources = performance.getEntriesByType
        ? performance.getEntriesByType('resource')
            .map(({name: url, initiatorType: type, transferSize: size = 0}) => ({
                url,
                type,
                size
            }))
        : [];

    // FIXME RUM-1157 limiting resources tracking to avoid rejection
    if (resources.length > MAX_RESOURCES_TRACKED) {
        resources.length = MAX_RESOURCES_TRACKED;
    }

    return resources;
}
