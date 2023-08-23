# LiveUX Collector Script V2

LiveUX is a RUM tool to keep track of client websites' web performance.
The script in this repo does the collection of web performance data send it to the LiveUX infrastructure.

## Content

| File                      | Description                                 |
| ------------------------- | ------------------------------------------- |
| `src/core/*.ts`           | @gian                                       |
| `src/modules/**/index.ts` | @gian                                       |
| `src/types/global.d.ts`   | Typescript Types                            |
| `src/utilities/*.ts`      | Utility functions                           |
| `static/*.*`              | Web pages used to test the collector script |

## Installation

Install the dependencies with the command

```bash
npm install
```

#### Install yarn

We advice using `yarn` for the every other script.
To install yarn, run the command:

```bash
npm install --global yarn
```

## Scripts

### `yarn build`

Builds Core + Metrics modules bundles (this will run on deploy, via `Jenkinsfile`).

### `yarn build:assemble`

Builds Core + Metrics modules bundles and
generates the final `collector.min.js` as our Lambda would do, based on a local
feature flags configuration under `static/assemble/metrics_features.json`:

```json
{
  "Basic": true,
  "Behaviour": true,
  "DataLayer": true,
  "Device": true,
  "LoadingStrategy": true,
  "Metrics": true,
  "Network": true,
  "Viewport": true
}
```

This is especially useful to test in DevTools via script override.
Check out our [metrics classification](#metrics-classification).

### `yarn build:dev`

Builds Core + Metrics modules separately and injects them in `static/index.html` for local testing on a scraped webpage.

### `yarn build:debug`

Builds Core + Metrics modules separately and injects them in `static/index.html` for local testing on a scraped static
webpage, with source-maps.

## Manual testing

To check what the collector script would send, including what would be sent at the end of a page navigation

- Open the static page
- Open your browser's developer tools
- Activate a different browser tab, then re-activate the first tab (the one with the testing page)
- Check the network requests being sent to `ENDPOINT_REPLACE_ME_STRING` with some data in the payload.

## Collected data

Device-related:

- window size
- device pixel ratio
- device memory and CPU
- network speed

Business-related:

- page type
- website version
- market
- language

Technical data:

- timestamp
- domain
- url with stripped parameters
- url parameter keys (no values)
- HTTP status code

User behaviour data:

- scrolled pixels
- scroll percent
- time spent on the page

User preferences:

- save data mode

## Data classification

The following is a table representing:

- Field: the field name
- Logic module: the module containing the logic to collect that field
- Sent at: the moment in time the field should be sent
- Beacon: the name of the beacon which the data will be sent with

| Field                             | Logic module     | Sent at                 | Beacon |
| --------------------------------- | ---------------- | ----------------------- | ------ |
| `domain`                          | Basic            | Landing                 | Lan    |
| `language`                        | Basic            | Landing                 | Lan    |
| `url`                             | Basic            | Landing                 | Lan    |
| `urlParams`                       | Basic            | Landing                 | Lan    |
| `urlHash`                         | Basic            | Landing                 | Lan    |
| `timestamp`                       | Basic            | Landing                 | Lan    |
| `isInternalNavigation`            | Basic            | Landing                 | Lan    |
| `cache.type`                      | Loading strategy | Landing                 | Lan    |
| `cache.age`                       | Loading strategy | Landing                 | Lan    |
| `network.effectiveType`           | Network          | Landing                 | Lan    |
| `network.downlink`                | Network          | Landing                 | Lan    |
| `network.rtt`                     | Network          | Landing                 | Lan    |
| `network.saveData`                | Network          | Landing                 | Lan    |
| `device.isMobile`                 | Device           | Landing                 | Lan    |
| `device.isTablet`                 | Device           | Landing                 | Lan    |
| `device.isDesktop`                | Device           | Landing                 | Lan    |
| `device.cpu`                      | Device           | Landing                 | Lan    |
| `window.innerWidth`               | Viewport         | Landing                 | Lan    |
| `window.innerHeight`              | Viewport         | Landing                 | Lan    |
| `window.devicePixelRatio`         | Viewport         | Landing                 | Lan    |
| `preferences.reducedMotion`       | User preferences | Landing                 | Lan    |
| `preferences.darkMode`            | User preferences | Landing                 | Lan    |
| `referrer.url`                    | Basic            | Landing                 | Lan    |
| `referrer.domain`                 | Basic            | Landing                 | Lan    |
| `referrer.urlParams`              | Basic            | Landing                 | Lan    |
| `fcp.value`                       | Metrics          | Landing                 | Lan    |
| `load.start`                      | Metrics          | Document load event     | Lod    |
| `load.duration`                   | Metrics          | Document load event     | Lod    |
| `domContentLoaded.start`          | Metrics          | Document load event     | Lod    |
| `domContentLoaded.duration`       | Metrics          | Document load event     | Lod    |
| `behaviour.scroll.pxOnLeave`      | Behaviour        | Before leaving the page | Lv1    |
| `behaviour.scroll.percentOnLeave` | Behaviour        | Before leaving the page | Lv1    |
| `behaviour.timeOnPage`            | Behaviour        | Before leaving the page | Lv1    |
| `market`                          | Data layer       | Before leaving the page | Lv1    |
| `pageType`                        | Data layer       | Before leaving the page | Lv1    |
| `httpStatusCode`                  | Data layer       | Before leaving the page | Lv1    |
| `ssrTime.value`                   | Data layer       | Before leaving the page | Lv1    |
| `consent`                         | Data layer       | Before leaving the page | Lv1    |
| `lcp.value`                       | Metrics          | Before leaving the page | Lv2    |
| `ttfb.value`                      | Metrics          | Before leaving the page | Lv2    |
| `fid.value`                       | Metrics          | Before leaving the page | Lv2    |
| `inp.value`                       | Metrics          | Before leaving the page | Lv2    |
| `cls.value`                       | Metrics          | Before leaving the page | Lv2    |
| `connectionTime`                  | Metrics          | Before leaving the page | Lv2    |
| `dnsTime`                         | Metrics          | Before leaving the page | Lv2    |
| `redirectTime`                    | Metrics          | Before leaving the page | Lv2    |
| `requestTime`                     | Metrics          | Before leaving the page | Lv2    |
| `responseTime`                    | Metrics          | Before leaving the page | Lv2    |
| `cls.entries`                     | Full metrics     | Before leaving the page | Lv3    |
| `inp.entries`                     | Full metrics     | Before leaving the page | Lv3    |
