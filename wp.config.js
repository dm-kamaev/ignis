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
    main: './core/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './client'),
    filename: 'index.js', // <--- Will be compiled to this single file
    // library: 'TurboHtml',
    // libraryTarget: 'umd',
    libraryExport: 'default',
    library: {
      name: 'TurboHtml',
      type: 'umd'
    },
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