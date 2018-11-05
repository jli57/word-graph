const path = require('path');

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '*']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env', '@babel/react']
          }
        },
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
            loader: 'url-loader',
            options: {
                // limit: 8000, // Convert images < 8kb to base64 strings
              name: '[path][hash]-[name].[ext]'
            }
        }]
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
  devtool: 'source-map'
};
