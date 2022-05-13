'use strict';

const express = require('express');
const assert = require('assert');
const middleware_formidable = require('./middleware_formidable');
const { commands } = require('../server');
const { view_tick, view_book_change, view_list_books, view_book, view_slow_request } = require('./view');

const router = express.Router();

module.exports = router;

const db_books = require('./db_books.js')
const books = db_books.get_all();


router.post('/', async function (req, res) {
// router.post('/', middleware_formidable(), function (req, res) {
  // console.log(req.files, req.fields);
  const id_book_change = req.get('X-Ignis-Id');
  const id_list_books = req.get('X-Ignis-Output-Id');
  const { author, name, year, is_classic, type, hero } = req.body;

  const errors = {};
  if (!author) {
    errors.author = 'Автор не указан';
  }

  if (!is_classic) {
    errors.is_classic = 'Не выбран не один checkbox';
  }

  // await timeout(450);
  // await timeout(3000);

  let result = [];
  if (Object.keys(errors).length) {
    result = [
      commands.Update(
        view_book_change(id_book_change, id_list_books, null, errors)
      )
    ];
  } else {
    books.push({ id: books.length, author, name, year, is_classic, type, hero });
    result = [
      commands.Update(view_book_change(id_book_change, id_list_books)),
      // commands.Update({ ...view_book_change(id_book_change, id_list_books),  }), // Another variant
      commands.Update(view_list_books(books, id_list_books, id_book_change)),
      // commands.AppendToEnd({ html: view_book({ id: books.length - 1, el: books[books.length - 1], id_list_books, id_book_change }), id: id_list_books}) // Another variant
      // commands.AppendToTop({ html: view_book({ id: books.length - 1, el: books[books.length - 1], id_list_books, id_book_change }), id: id_list_books }) // Another variant
    ];
  }
  res.status(200).send(result);
});

router.put('/:id', function (req, res) {
  console.log(req.body);

  const book_id = parseInt(req.params.id, 10);
  const { author, name, year, is_classic, type, hero } = req.body;
  const id_book_change = req.get('X-Ignis-Id');
  const id_list_books = req.get('X-Ignis-Output-Id');

  const book = books[book_id];
  books[book_id] = {
    id: book.id,
    author, name, year, is_classic, type, hero
  };

  res.status(200).send([
    commands.Update(view_book_change(id_book_change, id_list_books)),
    commands.Update(view_list_books(books, id_list_books, id_book_change))
  ]);
});

router.put('/form/:id', async function (req, res) {
  console.log(req.body);

  const book_id = parseInt(req.params.id, 10);
  const { id_list_books } = req.body;
  const output_id = req.get('X-Ignis-Output-Id');


  const book = books[book_id];

  // await timeout(450);
  // await timeout(3000);

  res.status(200).send([
    commands.Update(view_book_change(output_id, id_list_books, book))
  ]);
});

router.get('/metrica/:id', async function (req, res) {
  console.log(req.url);
  res.status(200).send();
});

router.get('/redirect', async function (req, res) {
  console.log('redirect');
  res.setHeader('X-Ignis-Redirect-To', '/page/redirect').status(200).send();
});


router.delete('/:id', function (req, res) {
  console.log(req.body);
  const book_id = parseInt(req.params.id, 10);
  const output_id = parseInt(req.get('X-Ignis-Output-Id'), 10);

  assert.ok(book_id === output_id, 'Not equal id');

  db_books.remove(book_id);

  res.status(200).send([ commands.Remove(book_id) ]);
});

let counter = 0;
router.get('/poll', async function (req, res) {
  const id = req.get('X-Ignis-Id');
  if (++counter > 5) {
    res.status(286).send();
  } else {
    res.status(200).send(view_tick(id, counter));
  }
});


let counter_slow_request = 0;
router.get('/slow_request', async function (req, res) {
  const id = req.get('X-Ignis-Output-Id');
  const counter = ++counter_slow_request;
  if (counter % 2 === 0) {
    await timeout((10-counter)*1000);
  }
  // We are syncing response, discard outdated response by header
  res.setHeader('X-Ignis-Request-Id', req.get('X-Ignis-Request-Id')).status(200).send(view_slow_request({ id, counter }));
});



function timeout(t) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}