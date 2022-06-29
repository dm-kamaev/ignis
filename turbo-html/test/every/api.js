'use strict';

const express = require('express');

const router = express.Router();

exports.router = router;

let counter = 0;
router.get('/poll_v1', async function (req, res) {
  const id = req.get('X-Ignis-Id');
  // Variant 1
  if (++counter > 3) {
    res.status(286).send();
  } else {
    res.status(200).send(view_tick_v1(id, counter));
  }
});

let counter2 = 0;
router.get('/poll_v2', async function (req, res) {
  const id = req.get('X-Ignis-Id');
  // Variant 2
  console.log({ counter2 });
  res.status(200).send(view_tick_v2(id, ++counter2));
});

function view_tick_v1(id, counter) {
  // ${counter < 10 ? 'data-i-ev="@every(5s)->GET:http://127.0.0.1:9002/api/book/poll"' : ''}
  // data-i-ev="@every(3s)->GET:http://127.0.0.1:9002/api/book/poll"
  return `
    <div
      id=${id}
      data-i-ev="@every(1s)->GET:/api/book/poll_v1"
    >
      ${counter}
    </div>`;
};

exports.view_tick_v1 = view_tick_v1;

function view_tick_v2(id, counter) {
  // data-i-ev="@every(1s)->GET:http://127.0.0.1:9002/api/book/poll"
  return `
    <div
      id=${id}
      ${counter < 3 ? `data-i-ev="@every(1s)->GET:/api/book/poll_v2"` : ''}
    >
      ${counter}
    </div>`;
};

exports.view_tick_v2 = view_tick_v2;