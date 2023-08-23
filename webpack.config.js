/* eslint-disable */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const METRICS_MODULES_PATH = './src/modules';
const METRICS_MODULES = [
  'Basic',
  'Behaviour',
  'DataLayer',
  'Device',
  'LoadingStrategy',
  'Metrics',
  'Network',
  'Resources',
  'Viewport',
];

module.exports = {
  mode: 'production',
  entry: {
    ['collector.core']: './src/core/index.ts',
    // split metrics bundles for SS composition
    ...METRICS_MODULES.reduce(
      (modules, moduleName) => ({
        ...modules,
        [moduleName]: `${METRICS_MODULES_PATH}/${moduleName}/index.ts`,
      }),
      {}
    ),
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    usedExports: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: '/node_modules',
        loader: 'ts-loader',
      },
    ],
  },
};
