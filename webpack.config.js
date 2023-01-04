const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

let config = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: "src/index.html",
      filename: "index.html"
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    open: true,
    historyApiFallback: true,
  },

  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
      process: require.resolve("process"),
    },
  },
};

if (process.env.NODE_ENV === "development") {
  config.plugins.push(
    new webpack.DefinePlugin({
      process: { env: JSON.stringify(dotenv.config().parsed) },
    })
  );
} else {
  config.plugins.push(
    new webpack.DefinePlugin({
      process: {
        env: JSON.stringify({
          DIRECTORY_OAUTH_CLIENT_ID: process.env.DIRECTORY_OAUTH_CLIENT_ID,
          DIRECTORY_REDIRECT_URI: process.env.DIRECTORY_REDIRECT_URI,
          DIRECTORY_HOST: process.env.DIRECTORY_HOST,
        }),
      },
    })
  );
}

module.exports = config;
