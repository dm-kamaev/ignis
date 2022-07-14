'use strict';




exports.view_tick = function view_tick(id, counter) {
  // ${counter < 10 ? 'data-i-ev="@every(5s)->GET:http://127.0.0.1:9002/api/book/poll"' : ''}
  // data-i-ev="@every(3s)->GET:http://127.0.0.1:9002/api/book/poll"
  return `
    <div
      id=${id}
      data-i-ev="@every(3s)->GET:http://127.0.0.1:9002/api/book/poll"
    >
      ${counter}
    </div>`;
};

exports.view_slow_request = function view_slow_request({ id, counter }) {
  return `<div id=${id} style="cursor:pointer;margin:0 auto;-webkit-user-select: none;-ms-user-select: none;user-select: none;">Count(Slow): ${counter}</div>`;
}


exports.view_book_change = function view_book_change(id, id_list_books, book, errors = {}) {
  const is_create = !book ? true : false;
  book = book || {};
  const if_error = (k, return_if_true) => {
    return Boolean(errors[k]) ? return_if_true : false;
  };
  const get_error = k => {
    return errors[k] || '';
  };
  const use_prev_value = () => Object.keys(errors).length ? 'data-i-preserve' : '';


  // enctype="multipart/form-data" || data-i-enctype="multipart/form-data"
  // mouseover->GET:http://127.0.0.1:9002/api/book/metrica/2
  // mouseover->GET:http://127.0.0.1:9002/api/book/metrica/2->debounce(1s),once
  // @keydown(enter, submit)
  // @keyup(enter, submit)
  // @keydown(enter)->GET:http://127.0.0.1:9002/api/book/metrica/2
  // @keyup(enter) -> GET: http://127.0.0.1:9002/api/book/metrica/2

  // eslint-disable-next-line max-len
  const arr = ['Fiction', 'Documentary prose', 'Memoir literature', 'Scientific and popular science literature', 'Reference literature', 'Educational literature', 'Technical literature', 'Literature on psychology and self-development'];
  // mouseover->GET:http://127.0.0.1:9002/api/book/metrica/2
  const html = `
      <form
        action="#"
        id=${id}
        data-i-ev="submit->${is_create ? 'POST:http://127.0.0.1:9002/api/book?utm_query=1' : `PUT:http://127.0.0.1:9002/api/book/${book.id}`}"
        data-i-output-id=${id_list_books}
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
    css: `.test-css-book-change{ font-size: 16px;}`
  };
}


exports.view_list_books = function view_list_books(books, id, id_book_change) {
  return `
    <div id=${id} class=column style=max-width:400px;margin-right:8px;margin-right:auto >
      <!-- <input
        type="text"
        data-i-ev="keyup->GET:http://127.0.0.1:9002/api/book/metrica/2->debounce(2s),changed(value)"
      />
      -->
      ${exports.view_tick('klsjf', 0)}
      <div>Total: ${books.length}</div>
      ${books.map((el, i) => {
        return exports.view_book({ id: i, el, id_list_books: id, id_book_change });
      }).join('')}
    </div>
  `;
  // data-i-info='${JSON.stringify({ id_list_books: id })}'
  // data-i-info-js='{ id_list_books: "${id}" }'
}

exports.view_book = function view_book({ id, el, id_list_books, id_book_change }) {
  // data-i-animation-class-on-update="fade-in"
  // data-i-animation-class-on-update="fade-in:delay(0.5s)" // delay is optional, default 100ms
  // data-i-animation-class-on-remove="fade-out:delay(3s)" // delay >= duration of animation
  // data-i-animation-class-on-update="fade-in" data-i-animation-class-on-remove="fade-out:delay(3s)"
  return `
    <div id=${id} class="card fade-in" style=margin-top:16px>
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
          type=button
          data-i-ev="click->PUT:http://127.0.0.1:9002/api/book/form/${el.id}"
          data-i-output-id=${id_book_change}
          data-i-info='${JSON.stringify({ id_list_books })}'
        >
          Edit
        </button>
        <button
          class="button is-danger card-footer-item"
          type=button
          data-i-ev="click->DELETE:http://127.0.0.1:9002/api/book/${el.id}"
          data-i-output-id=${id}
        >
          Remove
        </button>
      </footer>
    </div>
  `
};


exports.view_page = function view_page({ form, list }) {
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

        .fade-in {
          animation: fade_in ease 2s;
          -webkit-animation: fade_in ease 2s;
          -moz-animation: fade_in ease 2s;
          -o-animation: fade_in ease 2s;
          -ms-animation: fade_in ease 2s;
        }

        @keyframes fade_in {
          0% {opacity:0;}
          100% {opacity:1;}
        }

        .fade-out {
          animation: fade_out ease 2s;
          -webkit-animation: fade_out ease 2s;
          -moz-animation: fade_out ease 2s;
          -o-animation: fade_out ease 2s;
          -ms-animation: fade_out ease 2s;
        }

        @keyframes fade_out {
          0% {opacity:1;}
          100% {opacity:0;}
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

      <div data-i-ev="click->GET:/api/book/slow_request" data-i-output-id="result_slow_request" data-i-spinner-off class=columns style="margin:0 auto">
        ${exports.view_slow_request({ id: 'result_slow_request', counter: 0 })}
      </div>

      <div style=display:none; class="global-spinner">
        <div style="margin:auto"><img src="https://risk-monitoring.ru/img/preloader_grey.gif" alt=""/></div>
      </div>

      <script src="/stat/example/dist/example.js"></script>
    </body>
  </html>
  `;
}


