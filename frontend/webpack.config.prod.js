const path = require('path');

module.exports = {
  context: __dirname,
  entry: './dist/src/index.js',
  output: {
    publicPath: "/word-graph/",
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
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
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
  devtool: 'source-map'
};
