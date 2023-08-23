/* eslint-disable */
const { merge } = require('webpack-merge');

const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {
  optimization: {
    minimize: false,
  },
});
