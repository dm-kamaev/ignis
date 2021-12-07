'use strict';

const express = require('express');
require('express-async-errors');

const body_parser = require('body-parser');

module.exports = function () {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

    next();
  });

  app.use(body_parser.json({ limit: '90kb' }));
  // app.use(cookie_parser());

  // ------ END ------


  // eslint-disable-next-line global-require
  app.use('/api/book', require('./api.js'));






  app.all('*', function (req, res) {
    console.log('NOT FOUND === ', req.url);
    res.status(404).send('404 Not found');
  });


  app.use(async function (err, req, res, next) {
    if (err instanceof Error) {
      console.log('Http_error = ', err);
      res.status(500).send(err);
    } else {
      console.log(`method = ${req.method} url = ${req.url} ${err.stack}`);
      res.status(500).send('Internal server error');
    }

    next();
  });

  return app;
};


const app = module.exports();
const PORT = '9002', HOST = '127.0.0.1';
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
