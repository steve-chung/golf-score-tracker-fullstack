require('dotenv/config')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  mode: process.env.NODE_ENV || 'development',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'public/')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src/'),
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react'
          ]
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/*.{html,css}',
        flatten: true
      }
    ])
  ],
  devServer: {
    open: true,
    stats: 'minimal',
    historyApiFallback: true,
    port: parseInt(process.env.PORT, 10) + 1,
    contentBase: path.join(__dirname, '/public'),
    proxy: {
      '/': `http://localhost:${process.env.PORT}`
    }
  }
}
