'use strict';

const express = require('express');
const body_parser = require('body-parser');

const router = express.Router();

exports.router = router;

router.use(body_parser.json({ limit: '90kb' }));

exports.counter_slow_request = 0;
router.get('/slow_request', async function (req, res) {
  const id = req.get('X-I-Id');
  const counter = ++exports.counter_slow_request;
  if (counter % 2 === 0) {
    await timeout((10 - counter) * 1000);
  }
  res.setHeader('X-I-Request-Id', req.get('X-I-Request-Id')).status(200).send(view_slow_request('GET:/api/book/slow_request', { id, counter }));
});


function view_slow_request(method_url, { id, counter }) {
  // eslint-disable-next-line max-len
  return `
  <div
    id=${id}
    data-i-ev="click->${method_url}">
    Count(Slow): <span id=count>${counter}</span>
  </div>`;
}

exports.view_slow_request = view_slow_request;


function timeout(t) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}