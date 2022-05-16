'use strict';

const express = require('express');

const view = require('./view.js');
const view_history = require('./view_history.js');

const router = express.Router();

module.exports = router;

const db_books = require('./db_books.js')


router.get('/book', async function (req, res) {
  const id_book_change = 'book_form';
  const id_list_books = 'list_books';

  const page = view.view_page({
    form: view.view_book_change(id_book_change, id_list_books).html,
    list: view.view_list_books(db_books.get_all(), id_list_books, id_book_change)
  });
  res.status(200).send(page);
});


router.get('/step1', async function (req, res) {
  if (req.get('X-Ignis-Request')) {
    const output_id = req.get('X-Ignis-Output-Id');
    const html = view_history.step(output_id, 'step1');
    res.status(200).send(html);
  } else {
    const page = view_history.page('step1');
    res.status(200).send(page);
  }
});


router.get('/step2', async function (req, res) {
  if (req.get('X-Ignis-Request')) {
    const output_id = req.get('X-Ignis-Output-Id');
    const html = view_history.step(output_id, 'step2');
    res.status(200).send(html);
  } else {
    const page = view_history.page('step2');
    res.status(200).send(page);
  }
});


router.get('/step3', async function (req, res) {
  if (req.get('X-Ignis-Request')) {
    const output_id = req.get('X-Ignis-Output-Id');
    const html = view_history.step(output_id, 'step3');
    res.status(200).send(html);
  } else {
    const page = view_history.page('step3');
    res.status(200).send(page);
  }
});


