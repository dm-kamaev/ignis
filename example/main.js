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
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, content-length, accept, Referer, Location, X-Ignis-Html-Request, X-Ignis-Html-Id, X-Ignis-Output-Id');
    res.setHeader('Access-Control-Expose-Headers', 'X-Ignis-Redirect-To');

    next();
  });

  app.use(body_parser.json({ limit: '90kb' }));
  // app.use(cookie_parser());

  // ------ END ------


  // eslint-disable-next-line global-require
  app.use('/api/book', require('./api.js'));

  app.use('/page/redirect', (_, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      After Redirect!
    </body>
    </html>`)
  });






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
