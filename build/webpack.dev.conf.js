"use strict";
const webpack = require("webpack");
const path = require("path");
var config = require('../config/index')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
  },
  // cheap-source-map is faster for development
  devtool: '#source-map',
  cache: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
})
