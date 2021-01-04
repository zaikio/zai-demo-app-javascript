const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const LAUNCHPAD_URL =
  process.env.LAUNCHPAD_URL || "https://launchpad.zaikio.com/launchpad.js";

let config = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: "src/index.html",
      filename: "index.html",
      launchpadUrl: LAUNCHPAD_URL,
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
      "process.env.DIRECTORY_OAUTH_CLIENT_ID": JSON.stringify(
        process.env.DIRECTORY_OAUTH_CLIENT_ID
      ),
      "process.env.DIRECTORY_OAUTH_CLIENT_SECRET": JSON.stringify(
        process.env.DIRECTORY_OAUTH_CLIENT_SECRET
      ),
      "process.env.DIRECTORY_REDIRECT_URI": JSON.stringify(
        process.env.DIRECTORY_REDIRECT_URI
      ),
      "process.env.DIRECTORY_HOST": JSON.stringify(process.env.DIRECTORY_HOST),
    })
  );
}

module.exports = config;
