const path = require('path');

let params = {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
};
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
  params = {
    mode: 'production',
    devtool: false,
    watch: false,
  };
}

module.exports = {
  ...params,
  entry: {
    main: './client/ignis.ts',
  },
  output: {
    path: path.resolve(__dirname, './client/dist'),
    filename: 'ignis.js' // <--- Will be compiled to this single file
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