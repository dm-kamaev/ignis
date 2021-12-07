'use strict';

const express = require('express');
const middleware_formidable = require('./middleware_formidable');
const { commands } = require('../server');

const router = express.Router();

module.exports = router;

let books = [];


router.post('/', async function (req, res) {
// router.post('/', middleware_formidable(), function (req, res) {
  // console.log(req.files, req.fields);
  const id_book_change = req.query.__self_id;
  const id_list_books = req.query.__output_id;
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
      commands.Update(view_list_books(books, id_list_books, id_book_change)),
      // commands.AppendToEnd({ id: id_list_books, html: `<p class="test-append-to-top">I am AppendToTop ${books.length}!!!</p>`, css: '.test-append-to-top{color: red}'})
    ];
  }
  res.status(200).send(result);
});

router.put('/:id', function (req, res) {
  console.log(req.body);

  const book_id = parseInt(req.params.id, 10);
  const { author, name, year, is_classic, type, hero } = req.body;
  const id_book_change = req.query.__self_id;
  const id_list_books = req.query.__output_id;


  let book = books[book_id];
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
  const output_id = req.query.__output_id;

  const book = books[book_id];

  // await timeout(450);
  // await timeout(3000);

  // res.status(200).send(view_book_change(output_id, id_list_books, book));
  res.status(200).send([
    commands.Update(view_book_change(output_id, id_list_books, book))
  ]);
});

router.get('/metrica/:id', async function (req, res) {
  console.log(req.url);
  res.status(200).send();
});



router.delete('/:id', function (req, res) {
  console.log(req.body);
  const book_id = parseInt(req.params.id, 10);
  const output_id = req.query.__output_id;

  books = books.filter(el => el.id !== book_id);

  res.status(200).send(view_list_books(books, output_id));
});



function view_book_change(id, id_list_books, book, errors = {}) {
  const is_create = !book ? true : false;
  book = book || {};
  const if_error = (k, return_if_true) => {
    return Boolean(errors[k]) ? return_if_true : false;
  };
  const get_error = k => {
    return errors[k] || '';
  };
  const use_prev_value = () => Object.keys(errors).length ? 'data-ignis-use-prev-value' : '';


  // data-ignis-enctype="multipart/form-data"

  // eslint-disable-next-line max-len
  const arr = ['Fiction', 'Documentary prose', 'Memoir literature', 'Scientific and popular science literature', 'Reference literature', 'Educational literature', 'Technical literature', 'Literature on psychology and self-development'];
  const html = `
      <form
        action="#"
        id=${id}
        data-ignis-form="${is_create ? 'POST->http://127.0.0.1:9002/api/book?utm_query=1' : `PUT->http://127.0.0.1:9002/api/book/${book.id}`}"
        data-ignis-output-id=${id_list_books}
        class="box"
      >
        <div style=margin-top:16px; class=field>
          <label for="" class=label>Author:</label>
          <div class=control>
            <input type="text" name=author class="input ${if_error('author', 'red')}" value="${book.author || ''}" ${use_prev_value()}>
          </div>
          <p class=error>${get_error('author')}</p>
        </div>

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Name:</label>
          <div class=control>
            <input type="text" name=name class="input" value="${book.name || ''}" ${use_prev_value()}>
          </div>
          <p class=error></p>
        </div>

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Year:</label>
          <div class=control>
            <input type="number" name=year pattern="\d+" min="0" class="input" value="${book.year || ''}" ${use_prev_value()}>
          </div>
          <p class=error></p>
        </div>

        <div style=margin-top:16px;display:flex; class=field>
          <div>
            <label class="checkbox">
              <input type="checkbox" name=is_classic value=v1 class=checkbox ${book.is_classic?.includes('v1') ? 'checked' : ''} ${use_prev_value()}>
              Classic
            </label>
          </div>
          <div style=margin-left:8px>
            <label class="checkbox">
              <input type="checkbox" name=is_classic value=v2 class=checkbox ${book.is_classic?.includes('v2') ? 'checked' : ''} ${use_prev_value()}>
              Classic 2
            </label>
          </div>
        </div>
        <p class=error>${get_error('is_classic')}</p>

        <div style=margin-top:8px; class=field>
          <label for="" class=field>Types of literature:</label>
          <div class="control">
            ${arr.map((el, i) => {
              const id = `v${i+1}`;
              return `
                <div>
                  <label for=${id} class="radio">
                    <input type="radio" id=${id} value="${el}" name="type" ${book.type === el ? 'checked' : ''} ${use_prev_value()}>
                    ${el}
                  </label>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style=margin-top:16px>
          <select name="hero" class=select ${use_prev_value()}>
            <option>Выберите героя</option>
            <option value="t1" ${book.hero === 't1' ? 'selected' : ''}>Чебурашка</option>
            <option value="t2" ${book.hero === 't2' ? 'selected' : ''}>Крокодил Гена</option>
            <option value="t3" ${book.hero === 't3' ? 'selected' : ''}>Шапокляк</option>
            <option value="t4" ${book.hero === 't4' ? 'selected' : ''}>Крыса Лариса</option>
          </select>
        </div>

        <div style=margin-top:16px>
          <input type="file" name="file" multiple class="file" ${use_prev_value()}>
        </div>

        <div style=margin-top:16px>
          <button type="submit" class="button is-primary">${is_create ? 'Create' : 'Edit'}</button>
          <p class=error>${Object.keys(errors).length ? 'Неверно введены данные' : ''}</p>
        </div>
      </form>
  `;

  return {
    html,
    css: '.test-css-book-change{ font-size: 16px;}'
  };
}


function view_list_books(books, id, id_book_change) {
  return `
    <div id=${id} class=column style=max-width:400px;margin-right:8px;margin-right:auto >
      <div>Total: ${books.length}</div>
      ${books.map(el => {
        return `
          <div class="card" style=margin-top:16px data-ignis-event="mouseenter->GET->http://127.0.0.1:9002/api/book/metrica/${el.id}">
            <div class="card-content">
              <div class="content">
                <p>${el.name}</p>
                <p>${el.author}</p>
                <p>${el.year}</p>
                <p>${el.is_classic}</p>
                <p>${el.type}</p>
                <p>${el.hero}</p>
              </div>
            </div>
            <footer class="card-footer">
              <button
                class="button is-primary card-footer-item"
                type=submit
                data-ignis-event="click->PUT->http://127.0.0.1:9002/api/book/form/${el.id}"
                data-ignis-output-id=${id_book_change}
                data-ignis-data='${JSON.stringify({ id_list_books: id })}''
              >
                Edit
              </button>
              <button
                class="button is-danger card-footer-item"
                type=submit
                data-ignis-event="click->DELETE->http://127.0.0.1:9002/api/book/${el.id}"
                data-ignis-output-id=${id}
              >
                Remove
              </button>
            </footer>
          </div>
        `;
      }).join('')}
    </div>
  `;
}


function view_page({ form, list }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

      <title>Document</title>
      <style>
        .red, .error{
          border-color:red;
          color: red;
        }
        .red:hover{
          border-color:red;
        }

        .global-spinner {
          position:fixed;
          width:100%;
          left:0;right:0;top:0;bottom:0;
          background-color: rgba(255,255,255,0.7);
          z-index:9999;
          display:none;
        }
      </style>
    </head>
    <body>
      <div class=columns style="margin:0 auto">
        <div class="column is-one-quarter is-offset-4">
          ${form}
        </div>
        ${list}
      </div>

      <div style=display:none; class="global-spinner">
        <div style="margin:auto"><img src="https://risk-monitoring.ru/img/preloader_grey.gif" alt=""/></div>
      </div>

       <script src="../client/example_start.js"></script>
      <!-- <script src="../client/dist/ignis-client.js"></script> -->
    </body>
  </html>
  `;
}


const fs = require('fs');
const path = require('path');

const id_book_change = 'book_form';
const id_list_books = 'list_books';

const page = view_page({
  form: view_book_change(id_book_change, id_list_books).html,
  list: view_list_books(books, id_list_books, id_book_change)
});
fs.writeFileSync(path.join(__dirname, './index.html'), page);


function timeout(t) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}