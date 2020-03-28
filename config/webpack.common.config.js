const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-soure-map',
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192
          }
        }
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_hash.[ext]',
            outputPath: 'font/'
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
};