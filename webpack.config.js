const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

let config = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist/assets")
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    publicPath: "/assets/",
    open: true,
    historyApiFallback: true
  }
};

if (process.env.NODE_ENV === "development") {
  config.plugins = [new Dotenv()];
} else {
  config.plugins = [
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
      "process.env.DIRECTORY_HOST": JSON.stringify(process.env.DIRECTORY_HOST)
    })
  ];
}

module.exports = config;
