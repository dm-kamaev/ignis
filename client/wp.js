'use strict';

const path = require('path');


var params = {
  watch: false,
  mode: 'production',
  devtool: false,
  plugins: [],
};


// function get_prod_params(entry, params) {
//   return Object.assign({}, params, {
//     watch: false,
//     mode: 'production',
//     devtool: false,
//     plugins: [],
//   });
// }

function config({ mode, devtool, watch, plugins }) {
  return {
    mode,
    devtool,
    watch,
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'ignis-client.js',
      library: {
        name: 'Ignis',
        type: 'window',
        export: 'default',
      },
    },
    resolve: {},
    module: {},
    plugins,
  };
}

module.exports = config(params);