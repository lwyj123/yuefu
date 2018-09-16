/* eslint-disable no-undef */
const path = require("path");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
  mode: "development",

  devtool: "cheap-module-source-map",

  entry: {
    "yuefu.js": "./src/index.js",
    "yuefu.core": "./src/assets/core.scss"
  },

  output: {
    path: path.resolve(__dirname, "..", "dist"),
    filename: "[name]",
    library: "[name]",
    libraryTarget: "umd",
    libraryExport: "default",
    umdNamedDefine: true,
    publicPath: "/"
  },

  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".ts", ".scss"]
  },

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "eslint-loader",
        include: path.resolve(__dirname, "../src/js")
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["env"]
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
         loader: "awesome-typescript-loader"
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: path.join(__dirname, "postcss.config.js")
              }
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: "url-loader",
        options: {
          limit: 40000
        }
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      }
    ]
  },

  devServer: {
    compress: true,
    contentBase: path.resolve(__dirname, "..", "demo"),
    clientLogLevel: "none",
    quiet: false,
    open: true,
    historyApiFallback: {
      disableDotRule: true
    },
    watchOptions: {
      ignored: /node_modules/
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      YUEFU_VERSION: `"${require("../package.json").version}"`,
      GIT_HASH: JSON.stringify(gitRevisionPlugin.version())
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],

  performance: {
    hints: false
  }
};
