/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');

const webpackConfig = require('./webpack.config');

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

module.exports = merge(webpackConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      chunksSortMode: 'manual',
      chunks: ['collector.core', ...METRICS_MODULES],
      filename: path.resolve(__dirname, './static/index.html'),
      inject: 'head',
      scriptLoading: 'blocking',
      template: path.resolve(__dirname, './static/index.template.html'),
    }),
  ],
  output: {
    path: path.resolve(__dirname, './static/collector'),
    filename: '[name].js',
  },
});
