import nock from 'nock';
import { commands } from '../../src/cmd';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';

describe('[@exec]', function () {
  let turboHtml;
  const ID = 'test';

  beforeAll(async () => {
    turboHtml = before_start();
  });

  beforeEach(async () => {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return [commands.Update({ id: this.req.headers['x-i-output-id'], html: view_result(this.req.headers['x-i-output-id'], requestBody as any) })];
      });
  });

  afterAll(async () => {
    turboHtml.stop();
  });

  it('[element]: @exec', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`@exec`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    expect(ID).equal_content(view_result(ID, data));
  });

  it('[element]: @exec(1s)', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`@exec(1s)`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    await timeout(1000); // wait delay
    expect(ID).equal_content(view_result(ID, data));
  });

  it('[form]: @exec', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(`@exec`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    expect(ID).equal_content(view_result(ID, data));
  });


  it('[form]: @exec', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(`@exec(1s)`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    await timeout(1000); // wait delay
    expect(ID).equal_content(view_result(ID, data));
  });
});

function view_btn(command, { id, output_id, data }) {
  return `
    <button
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="${command}->POST:/api/book/form"
      data-i-output-id=${output_id}
      data-i-info='${JSON.stringify(data)}'
    >
      Edit
    </button>
  `;
}

function view_form(command, { id, output_id, data }) {
  return `
    <form
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="${command}->POST:/api/book/form"
      data-i-output-id=${output_id}
    >
      ${Object.entries(data).map(([ name, value ]) => `<input type="text" name=${name} value="${value instanceof Array ? value.join(',') : value}"></input>`).join(' ')}
    </form>
  `;
}

function view_result(id, { name, year, variant, type, person }) {
  return `
    <div id="${id}">
      <div id="name">${name}</div>
      <div id="year">${year}</div>
      <div id="variant">${variant instanceof Array ? variant.join(',') : variant}</div>
      <div id="type">${type}</div>
      <div id="person">${person}</div>
    </div>
  `;
}


