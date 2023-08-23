/* eslint-disable */
const { merge } = require('webpack-merge');

const webpackConfig = require('./webpack.config.dev');

module.exports = merge(webpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
});
