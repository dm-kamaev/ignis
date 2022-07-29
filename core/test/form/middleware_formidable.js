'use strict';

// MIDDLEWARE FOR UPLOAD FILES


const formidable = require('express-formidable');

// const Http_error_file_too_big = require('/p/wfm/http_errors/Http_error_file_too_big.js');


/**
 * @param  {{ maxFileSize: number, multioles: boolean }} options
 * @return {function(req, res, next)}
 */
module.exports = function (options = {}) {
  let maxFileSize = options.maxFileSize || 20 * 1024 * 1024; /* 20Mb */
  let middleware_formidable = formidable({ maxFileSize, multiples: options.multiples || false });
  return function (req, res, next) {
    middleware_formidable(req, res, function (err) {
      if (err) {
        // return next(new Http_error_file_too_big(`Файл не может быть больше ${Math.floor(maxFileSize / 1024 / 1024)}. ${err.message}`));
        return next(new Error(`Файл не может быть больше ${Math.floor(maxFileSize / 1024 / 1024)}. ${err.message}`));
      } else {
        return next();
      }
    });
  };
};

