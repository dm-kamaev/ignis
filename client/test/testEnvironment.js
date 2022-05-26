const express = require('express');
// for server node apps
// const NodeEnvironment = require('jest-environment-node');

// for browser js apps
const NodeEnvironment = require('jest-environment-jsdom').default;

module.exports = class ExpressEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.__server = null;
  }

  async setup() {
    await super.setup();
    let server;
    const app = express();

    app.set('trust proxy', 1);
    app.disable('x-powered-by');

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, content-length, accept, Referer, Location, X-Ignis-Request, X-Ignis-Id, X-Ignis-Output-Id, X-Ignis-Request-Id');
      res.setHeader('Access-Control-Expose-Headers', 'X-Ignis-Request-Id, X-Ignis-Redirect-To');

      next();
    });

    await new Promise(function (resolve) {
      server = app.listen(9003, '127.0.0.1', function () {
        let address = server.address();
        console.log(
          ` Running server on '${JSON.stringify(address)}'...`);
        resolve();
      });
    });
    let address = server.address();
    this.__server = server;
    this.global.address = `http://${address.address}:${address.port}`;
    this.global.app = app;
    // app.use('/api/book', require('../../example/api.js'));
    // app.use(express.static('./testfiles'));
  }

  async teardown() {
    this.__server.close();
    await super.teardown();
  }

  runScript(script) {
    console.log({ script });
    return super.runScript(script);
  }
};