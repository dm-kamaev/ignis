const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  entry: {
    main: './example/example.ts',
  },
  output: {
    path: path.resolve(__dirname, './example/dist'),
    filename: 'example.js' // <--- Will be compiled to this single file
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