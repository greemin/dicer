const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const bundlePath = path.resolve(__dirname, "build/");
const isDev = process.env.NODE_ENV === "development";

const plugins = isDev
  ? [new webpack.HotModuleReplacementPlugin()]
  : [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        title: "Dicer",
        description: "Lightweight dicing tool",
        template: "client/page-template.hbs",
      }),
    ];

const optimization = !isDev
  ? {
      splitChunks: {
        chunks: "all",
        minSize: 10000,
        automaticNameDelimiter: "_",
      },
    }
  : {};

module.exports = {
  entry: "./client/index.js",
  output: {
    publicPath: "/",
    path: bundlePath,
    filename: "bundle.[contenthash].js",
  },
  optimization: optimization,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/react"] },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.hbs$/,
        use: ["handlebars-loader"],
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    port: 3000,
    publicPath: "http://localhost:3000/",
    proxy: {
      "/dice-results": "http://localhost:3001",
    },
  },
  plugins: plugins,
};
