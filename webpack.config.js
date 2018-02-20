const path = require('path');
const webpack = require('webpack');

const config = {
  entry: path.join(__dirname, './lib/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './lib')
  },
  plugins: [
    new webpack.ProgressPlugin()
  ],
  module: {
    loaders: [
      {
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  },
  devtool: 'source-map'
}

module.exports = config;
