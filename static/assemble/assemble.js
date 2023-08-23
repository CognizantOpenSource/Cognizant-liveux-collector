/**
 * Node script to simulate the assembling process of the final user-facing
 * collector script bundle.
 *
 * The process is based on a configuration of feature flags
 * resembling the one which lives in DynamoDB, associated to a customer_id
 *
 * This assembling process could be performed out of the box via webpack,
 * but it wouldn't really simulate what's happening in our Lambda,
 * which is in charge of merging the JS feature-files together.
 */

/* eslint-disable */
const fs = require('fs');
const path = require('path');

const COLLECTOR_RESOURCES_PATH = path.resolve(__dirname, '../../build');
const COLLECTOR_STATIC_PATH = path.resolve(__dirname, '../../static/collector');
const COLLECTOR_OUTPUT_PATH = path.resolve(__dirname, '../../src/collector')

const FEATURES_CONFIGURATION = require('./metrics_features.json');

const REPLACE_ENDPOINT = 'ENDPOINT_REPLACE_ME_STRING';
const REPLACE_LOGGER_ENDPOINT = 'ENDPOINT_ERROR_LOGGING_REPLACE_ME_STRING';
const REPLACE_SAMPLING_PERCENTAGE = 'REPLACE_ME_TRAFFIC_PERCENTAGE';

// Assembling configuration
const ENDPOINT = '';
const LOGGER_ENDPOINT = '';
const SAMPLING_PERCENTAGE = '';

const COLLECTOR_CHUNKS = [];

function readFile(path) {
  return fs.readFileSync(path, 'utf-8');
}

try {
  /**
   *  For backward-compatibility, assemble on JENKINS and deploy as is
   *  to preserve the old lambda VARIABLE FILL-UP
   */
  const collectorScriptJSFile = readFile(
    `${COLLECTOR_RESOURCES_PATH}/collector.core.js`
  )
    .replace(REPLACE_ENDPOINT, ENDPOINT || REPLACE_ENDPOINT)
    .replace(REPLACE_LOGGER_ENDPOINT, LOGGER_ENDPOINT || REPLACE_LOGGER_ENDPOINT)
    .replace(REPLACE_SAMPLING_PERCENTAGE, SAMPLING_PERCENTAGE || '1');

  COLLECTOR_CHUNKS.push(collectorScriptJSFile);

  Object.entries(FEATURES_CONFIGURATION).forEach(([featureName, isEnabled]) => {
    if (isEnabled) {
      COLLECTOR_CHUNKS.push(
        readFile(`${COLLECTOR_RESOURCES_PATH}/${featureName}.js`)
      );
    }
  });

  fs.writeFileSync(
    `${COLLECTOR_OUTPUT_PATH}/collector.min.js`,
    COLLECTOR_CHUNKS.join(' ')
  );

  console.log('\n[LiveUX Collector] Assembling complete.');
} catch (error) {
  console.log('\n[LiveUX Collector] Assembling error.');
}
