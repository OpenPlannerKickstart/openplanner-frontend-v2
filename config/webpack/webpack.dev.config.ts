import  ForkTsCheckerWebpackPlugin  from 'fork-ts-checker-webpack-plugin';
import Dotenv  from 'dotenv-webpack';
import { merge } from 'webpack-merge';
import webpack from 'webpack';
import commonConfig from "./webpack.common.config";
import 'webpack-dev-server';
import paths from '../paths';
// import "../../config"

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import path from 'path';
const devConfig: webpack.Configuration = merge(commonConfig, {
    mode: "development",
    resolve: {  
        alias: {
          '@pages': path.resolve(__dirname, "../../src"),
          // '@changes': path.resolve(__dirname, '../../config'),
          // '@changesPackge': path.resolve(__dirname, '../../'),
          // "react-dom": "@hot-loader/react-dom", // replaces the "react-dom" package with additional patches to support hot reloading
        },
      },
      entry: [
        // "react-hot-loader/patch", // activate HMR for React
        "webpack-dev-server/client?http://0.0.0.0:4800", // bundle the client for webpack-dev-server and connect to the provided endpoint
        "webpack/hot/only-dev-server", // bundle the client for hot reloading, only- means to only hot reload for successful updates
        "./index.tsx", // the entry point of our app
      ],  
      devServer: {
        historyApiFallback: true,
        static: paths.src,
        open: true,
        compress: true,
        port: 4800,
        https:false,
        // host: "local-ipv4",
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: true,
      },
      devtool: "inline-source-map",
      plugins: [
        // new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new ReactRefreshWebpackPlugin(), // enable HMR globally
        new Dotenv({
          path: "./.env.development",
        }),
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            configFile: path.resolve(__dirname, "../../tsconfig.json"),
            diagnosticOptions: {
              semantic: true,
              syntactic: true,
            },
            mode: "write-references",
          },
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
        ],
})

export default devConfig;