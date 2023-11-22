const webpack = require('webpack');
const path = require('path');
const zlib = require('zlib');

var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    plugins: [
        new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
};