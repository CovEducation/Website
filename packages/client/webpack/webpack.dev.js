const webpack = require('webpack');

const commonPaths = require('./paths');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: commonPaths.outputPath,
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-modules-typescript-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              localsConvention: 'camelCase',
              modules: {
                localIdentName: '[local]___[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    contentBase: commonPaths.outputPath,
    compress: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
      '/socket.io/*': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
