'use strict';

const express = require('express');

const view = require('./view.js');

const router = express.Router();

module.exports = router;

const db_books = require('./db_books.js')


router.get('/start', async function (req, res) {
  const id_book_change = 'book_form';
  const id_list_books = 'list_books';

  const page = view.view_page({
    form: view.view_book_change(id_book_change, id_list_books).html,
    list: view.view_list_books(db_books.get_all(), id_list_books, id_book_change)
  });
  res.status(200).send(page);
});


