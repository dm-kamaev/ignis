import nock from 'nock';
import { commands } from '../../src/cmd';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';

describe('[data-i-push-url]', function () {
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

  it('[element]: set url and then back', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    // init state
    expect(window.location.href).toEqual('http://localhost/');
    expect(history.state).toMatchObject({ v: 'turbo-html:1', url: 'http://localhost/' });

    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));

    // checking changed state and url
    expect(window.location.href).toEqual('http://localhost/api/book/form');
    expect(history.state).toMatchObject({ v: 'turbo-html:1', url: '/api/book/form' });

    history.back();
    await timeout(100); // wait back

    // init state
    expect(window.location.href).toEqual('http://localhost/');
    expect(history.state).toMatchObject({ v: 'turbo-html:1', url: 'http://localhost/' });
  });

  it('[form]: set url and then back', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    // init state
    expect(window.location.href).toEqual('http://localhost/');
    expect(history.state).toMatchObject({ v: 'turbo-html:1', url: 'http://localhost/' });

    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));

    // checking changed state and url
    expect(window.location.href).toEqual('http://localhost/api/book/form');
    expect(history.state).toMatchObject({ v: 'turbo-html:1', url: '/api/book/form' });

    history.back();
    await timeout(100); // wait back

    // init state
    expect(window.location.href).toEqual('http://localhost/');
    expect(history.state).toMatchObject({ v: 'turbo-html:1', url: 'http://localhost/' });
  });
});

function view_btn(method_url, { id, output_id, data }) {
  return `
    <button
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="click->${method_url}"
      data-i-output-id=${output_id}
      data-i-info='${JSON.stringify(data)}'
      data-i-push-url
    >
      Edit
    </button>
  `;
}

function view_form(method_url, { id, output_id, data }) {
  return `
    <form
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="submit->${method_url}"
      data-i-output-id=${output_id}
      data-i-push-url
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


