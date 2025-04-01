import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin  from 'mini-css-extract-plugin';
import HtmlWebpackPlugin  from 'html-webpack-plugin';
import { CleanWebpackPlugin } from "clean-webpack-plugin";
// import "../../src"
const config: webpack.Configuration = {
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        fallback: {
          net: false,
        },
      },
      context: path.resolve(__dirname, "../../src"),
      module: {
        rules: [
          {
            test: /\.js$/,
            use: [{ loader: "babel-loader"  }, { loader: "source-map-loader" }],
            
            exclude: /node_modules/,
          },
          {
            test: /\.ts(x?)$/,
            use: [{ loader: "ts-loader", options: { transpileOnly: true } }],
            exclude: /node_modules/,
          },
          {
            test: /\.(css|scss|sass)$/,
            use: [
              // { loader: MiniCssExtractPlugin.loader },
              // { loader: "style-loader" },
              // // { loader: "css-loader", options: { importLoaders: 1 } },
    
              process.env.NODE_ENV !== "production"
                ? "style-loader"
                : MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: { config: path.resolve(__dirname, "../") },
                },
              },
              // {
              //   loader: "postcss-loader",
              //   options: {
              //     sourceMap: true,
              //     ident: "postcss",
              //     plugins: [postcss, tailwindcss, autoprefixer]
              //   }
              // },
              // { loader: "sass-loader" },
            ],
          },
          {
            test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
            use: [
              "file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]",
              // "image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false",
            ],
          },
          // {
          //   test: /\.svg$/,
          //   use: ["@svgr/webpack"],
          // },
        ],
      },
      plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          template: "../public/index.html",
          favicon: "../public/favicon.ico",
          // manifest: "../public/manifest.json",
        }),
      ],
      performance: {
        hints: false,
     
      },
      
}
export default config;