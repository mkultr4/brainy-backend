const path = require('path');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    loaders: [{ test: /\.ts(x?)$/, loader: 'ts-loader' }]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "../../config", to: "config" }], {}),
    new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false
        }
      },
      cache: true,
      sourceMap: true
    })
  ]
};
