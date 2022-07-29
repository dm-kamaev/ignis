const express = require('express');
const portfinder = require('portfinder');

export default async function () {
  let server;
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, content-length, accept, Referer, Location, X-I-Request, X-I-Id, X-I-Output-Id, X-I-Request-Id');
    res.setHeader('Access-Control-Expose-Headers', 'X-I-Request-Id, X-I-Redirect-To');

    next();
  });

  const port = await portfinder.getPortPromise();
  await new Promise(function (resolve) {
    server = app.listen(port, '127.0.0.1', function () {
      const address = server.address();
      console.log(` Running server on '${JSON.stringify(address)}'...`);
      resolve(null);
    });
  });

  let address = server.address();
  (global as any).address = `http://${address.address}:${address.port}`;
  (global as any).app = app;

  return () => {
    server.close();
  };
}
