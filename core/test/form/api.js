'use strict';

const express = require('express');
const body_parser = require('body-parser');
const middleware_formidable = require('./middleware_formidable');

const router = express.Router();

exports.router = router;

router.use(body_parser.json({ limit: '90kb' }));

router.post('/', async function (req, res) {
  const id = req.get('X-I-Id');
  // const id_list_books = req.get('X-I-Output-Id');
  const { name, year, variant, type, person } = req.body;

  res.status(200).send(view_form_submitted(id, { name, year, variant, type, person }));
});

router.post('/via_formdata', middleware_formidable(), function (req, res) {
  const id = req.get('X-I-Id');
  // const id_list_books = req.get('X-I-Output-Id');
  const { name } = req.fields;

  res.status(200).send(view_form_file_submitted(id, { name, file_name: req.files.file.name }));
});


router.put('/via_formdata', middleware_formidable(), function (req, res) {
  const id = req.get('X-I-Id');
  // const id_list_books = req.get('X-I-Output-Id');
  const { name } = req.fields;

  res.status(200).send(view_form_file_submitted(id, { name, file_name: req.files.file.name }));
});

router.put('/:id', async function (req, res) {
  const id = req.get('X-I-Id');
  // const id_list_books = req.get('X-I-Output-Id');
  const { name, year, variant, type, person } = req.body;

  res.status(200).send(view_form_submitted(id, { name, year, variant, type, person }));
});







router.get('/via_urlencode', function (req, res) {
  const id = req.get('X-I-Id');
  // const id_list_books = req.get('X-I-Output-Id');
  const { name, year, variant: str_variant, type, person } = req.query;
  const variant = str_variant.split(',');
  res.status(200).send(view_form_submitted(id, { name, year, variant, type, person }));
});

router.delete('/:id', async function (req, res) {
  const id = req.get('X-I-Id');
  // const id_list_books = req.get('X-I-Output-Id');
  const { name, year, variant: str_variant, type, person } = req.query;
  const variant = str_variant.split(',');
  res.status(200).send(view_form_submitted(id, { name, year, variant, type, person }));
});


function view_form(id, url, { name, year, variant, type, person }) {
  return `
      <form
        action="#"
        id="${id}"
        data-i-ev="submit->${url}"
        class="box"
      >

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Name:</label>
          <div class=control>
            <input type="text" name=name class="input" value="${name || ''}">
          </div>
          <p class=error></p>
        </div>

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Year:</label>
          <div class=control>
            <input type="number" name=year pattern="\d+" min="0" class="input" value="${year || ''}">
          </div>
          <p class=error></p>
        </div>

        <div style=margin-top:16px;display:flex; class=field>
          <div>
            <label class="checkbox">
              <input id=v1 type="checkbox" name=variant value=v1 class=checkbox ${variant.includes('v1') ? 'checked=checked' : ''}>
              Variant 1
            </label>
          </div>
          <div style=margin-left:8px>
            <label class="checkbox">
              <input id=v2 type="checkbox" name=variant value=v2 class=checkbox ${variant.includes('v2') ? 'checked=checked' : ''}>
              Varint 2
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
                    <input type="radio" id=${id} value="${el}" name="type" ${type === el ? 'checked' : ''}>
                    ${el}
                  </label>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style=margin-top:16px>
          <select name="person" class=select>
            <option>Выберите героя</option>
            <option value="Aleksandr" ${person === 'Aleksandr' ? 'selected' : ''}>Aleksandr</option>
            <option value="Aleksey" ${person === 'Aleksey' ? 'selected' : ''}>Aleksey</option>
            <option value="Anton" ${person === 'Anton' ? 'selected' : ''}>Anton</option>
            <option value="Artur" ${person === 'Artur' ? 'selected' : ''}>Artur</option>
          </select>
        </div>

        <div style=margin-top:16px>
          <button type="submit" class="button is-primary">Create</button>
        </div>
      </form>
  `;
}

exports.view_form = view_form;


function view_form_submitted(id, { name, year, variant, type, person }) {
  return `
    <div id="${id}">
      <div id="name">${name}</div>
      <div id="year">${year}</div>
      <div id="variant">${variant.join(',')}</div>
      <div id="type">${type}</div>
      <div id="person">${person}</div>
    </div>
  `;
}

exports.view_form_submitted = view_form_submitted;

function view_form_file(id, url, { name }) {
  return `
      <form
        action="#"
        id="${id}"
        data-i-ev="submit->${url}"
        enctype="multipart/form-data"
        class="box"
      >

        <div style=margin-top:16px; class=field>
          <label for="" class=label>Name:</label>
          <div class=control>
            <input type="text" name=name class="input" value="${name || ''}">
          </div>
          <p class=error></p>
        </div>

        <div style=margin-top:16px>
          <input type="file" name="file" multiple class="file">
        </div>

        <div style=margin-top:16px>
          <button type="submit" class="button is-primary">Create</button>
        </div>
      </form>
  `;
}

exports.view_form_file = view_form_file;

function view_form_file_submitted(id, { name, file_name }) {
  return `
    <div id="${id}">
      <div id="name">${name}</div>
      <div id="file_name">${file_name}</div>
    </div>
  `;
}
exports.view_form_file_submitted = view_form_file_submitted;