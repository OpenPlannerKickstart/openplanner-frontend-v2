import webpack from 'webpack';
import { merge } from 'webpack-merge';
import commonConfig from "./webpack.common.config";
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
const prodConfig: webpack.Configuration = merge(commonConfig, {
    mode: "production",
    entry: "./index.tsx",
    output: {
      filename: "js/[name].[contenthash].bundle.js",
      path: path.resolve(__dirname, "../../dist"),
      publicPath: "/",
    },
    plugins: [
        new CleanWebpackPlugin(),
        new Dotenv({
          path: "./.env.production",
        }),
        // Extracts CSS into separate files
        // Note: style-loader is for development, MiniCssExtractPlugin is for production
        new MiniCssExtractPlugin({
          filename: "styles/[name].[contenthash].css",
          chunkFilename: "[id].css",
        }),
      ],
      module: {
        rules: [],
      },
      optimization: {
        minimize: true,
        minimizer: [
          // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
          `...`,
          new TerserPlugin(),
          new CssMinimizerPlugin(),
        ],
      },
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },

})
export default prodConfig;