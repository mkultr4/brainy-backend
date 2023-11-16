const path = require("path");
const webpack = require("webpack"); //to access built-in plugins

const config = {
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  entry: {
    index: "./index.ts",
    schema: "./schema.ts",
    db: "./db.ts",
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  target: "node",
  module: {
    loaders: [{ test: /\.ts(x?)$/, loader: "ts-loader" }]
  }
  // plugins: [new webpack.optimize.UglifyJsPlugin()]
};

module.exports = config;
