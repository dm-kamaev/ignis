const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  entry: {
    main: './client/example_start.js',
  },
  output: {
    path: path.resolve(__dirname, './client/dist'),
    filename: 'example_start.js' // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  }
};