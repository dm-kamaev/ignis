'use strict';

const express = require('express');
const middleware_formidable = require('./middleware_formidable');
const { commands } = require('../server');
// const { view_book_change, view_book } = require('./view');

const router = express.Router();

module.exports = router;


router.post('/', async function (req, res) {
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
  console.log(errors);
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
    const books = db_books.get_all();
    db_books.create({ id: books.length, author, name, year, is_classic, type, hero });
    result = [
      commands.Update(view_book_change(id_book_change, id_list_books)),
      // commands.Update({ ...view_book_change(id_book_change, id_list_books),  }), // Another variant
      // commands.Update(view_list_books(books, id_list_books, id_book_change)),
      // commands.AppendToEnd({ html: view_book({ id: books.length - 1, el: books[books.length - 1], id_list_books, id_book_change }), id: id_list_books}) // Another variant
      commands.AppendToTop({ html: view_book({ id: books.length - 1, el: books[books.length - 1], id_list_books, id_book_change }), id: id_list_books }) // Another variant
    ];
  }
  res.status(200).send(result);
});

router.post('/via_formdata', middleware_formidable(), function (req, res) {
  const id_book_change = req.get('X-Ignis-Id');
  const id_list_books = req.get('X-Ignis-Output-Id');
  const { author, name, year, is_classic, type, hero } = req.fields;
  console.log(req.files);


  let result = [];
  res.status(200).send(view_form_submitted(id_book_change, id_list_books));
});


router.get('/via_urlencode', function (req, res) {
  const id_book_change = req.get('X-Ignis-Id');
  const id_list_books = req.get('X-Ignis-Output-Id');
  const { author, name, year, is_classic, type, hero } = req.query;

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
    const books = db_books.get_all();
    db_books.create({ id: books.length, author, name, year, is_classic, type, hero });
    result = [
      commands.Update(view_book_change(id_book_change, id_list_books)),
      // commands.Update({ ...view_book_change(id_book_change, id_list_books),  }), // Another variant
      // commands.Update(view_list_books(books, id_list_books, id_book_change)),
      // commands.AppendToEnd({ html: view_book({ id: books.length - 1, el: books[books.length - 1], id_list_books, id_book_change }), id: id_list_books}) // Another variant
      commands.AppendToTop({ html: view_book({ id: books.length - 1, el: books[books.length - 1], id_list_books, id_book_change }), id: id_list_books }) // Another variant
    ];
  }
  res.status(200).send(result);
});


function view_form(id, id_list_books, book) {

  const html = `
      <form
        action="#"
        id=${id}
        data-i-ev="submit->POST:/api/book?utm_query=1"
        data-i-output-id=${id_list_books}
        class="box"
      >

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Name:</label>
          <div class=control>
            <input type="text" name=name class="input" value="${book.name || ''}">
          </div>
          <p class=error></p>
        </div>

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Year:</label>
          <div class=control>
            <input type="number" name=year pattern="\d+" min="0" class="input" value="${book.year || ''}">
          </div>
          <p class=error></p>
        </div>

        <div style=margin-top:16px;display:flex; class=field>
          <div>
            <label class="checkbox">
              <input type="checkbox" name=is_classic value=v1 class=checkbox ${book.is_classic?.includes('v1') ? 'checked' : ''}>
              Classic
            </label>
          </div>
          <div style=margin-left:8px>
            <label class="checkbox">
              <input type="checkbox" name=is_classic value=v2 class=checkbox ${book.is_classic?.includes('v2') ? 'checked' : ''}>
              Classic 2
            </label>
          </div>
        </div>

        <div style=margin-top:8px; class=field>
          <label for="" class=field>Types of literature:</label>
          <div class="control">

            ${// eslint-disable-next-line max-len
              ['Fiction', 'Documentary prose', 'Memoir literature', 'Scientific and popular science literature', 'Reference literature', 'Educational literature', 'Technical literature', 'Literature on psychology and self-development'].map((el, i) => {
              const id = `v${i+1}`;
              return `
                <div>
                  <label for=${id} class="radio">
                    <input type="radio" id=${id} value="${el}" name="type" ${book.type === el ? 'checked' : ''}>
                    ${el}
                  </label>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style=margin-top:16px>
          <select name="hero" class=select>
            <option>Выберите героя</option>
            <option value="t1" ${book.hero === 't1' ? 'selected' : ''}>Чебурашка</option>
            <option value="t2" ${book.hero === 't2' ? 'selected' : ''}>Крокодил Гена</option>
            <option value="t3" ${book.hero === 't3' ? 'selected' : ''}>Шапокляк</option>
            <option value="t4" ${book.hero === 't4' ? 'selected' : ''}>Крыса Лариса</option>
          </select>
        </div>

        <div style=margin-top:16px>
          <button type="submit" class="button is-primary">Create</button>
        </div>
      </form>
  `;

  return {
    html,
    css: '.test-css-book-change{ font-size: 16px;}'
  };
}

exports.view_form = view_form;


function view_form_submitted() {

}