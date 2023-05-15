# Cognizant® Web Performance Collector

Cognizant® Web Vitals Monitoring is a RUM tool to keep track of client websites' web performance.
The script in this repo does the collection of web performance data send it to the Cognizant® Web Vitals Monitoring infrastructure.

## Content

| File                                       | Description                                      |
| ------------------------------------------ | ------------------------------------------------ |
| `src/collector/collector-liveux.js`        | collector script code                            |
| `src/collector/collector-liveux.bundle.js` | bundled, unminified collector script code        |
| `src/collector/index.html`                 | Testing page                                     |
| `src/collector/apdex.html`                 | Second testing page (for same-domain navigation) |
| `src/resources/*.*`                        | CSS and JS files for the test pages to work      |

## Installation

Install the dependencies

```bash
npm install
```

## Run

Start the testing environment and file watcher for bundling with one command

```bash
npm run start
```

## Testing

To check what the collector script would send at the end of a page navigation, activate a different browser tab and re-activate the one with the testing environment.
You will see a network request being sent to `ENDPOINT_REPLACE_ME_STRING` with some data in the payload.

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

#### JSON payload example

```json
{
    "fcp": {
        "value": 93
    },
    "window": {
        "innerHeight": 541,
        "innerWidth": 1920,
        "devicePixelRatio": 2
    },
    "network": {
        "downlink": 3.35,
        "effectiveType": "4g",
        "rtt": 150,
        "saveData": false
    },
    "device": {
        "memory": 8,
        "cpu": 16
    },
    "timestamp": 1671014011369,
    "ssrTime": {
        "value": 5113
    },
    "ttfb": {
        "value": 6
    },
    "lcp": {
        "value": 93,
        "element": "#myCarousel>div.carousel-inner>div.carousel-item.active>img"
    },
    "cls": {
        "value": 0,
        "entries": []
    },
    "domContentLoaded": {
        "start": 110,
        "duration": 0
    },
    "load": {
        "start": 121,
        "duration": 2
    }
}
```
