import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[data-i-info]', function () {
  let abort;
  const ID = 'test';

  beforeAll(async () => {
    abort = before_start();
  });

  afterAll(async () => {
    abort();
  });

  beforeEach(() => {
    nock('http://localhost')
      .post('/api/book')
      .reply(200, function (uri, requestBody) {
        return view_result(this.req.headers['x-i-output-id'], requestBody as any);
      });
  });

  it('as string', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, `data-i-info='${JSON.stringify(data)}'`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

  it('as runtime object', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, `data-i-info-js="{ name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' }"`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

  it('as string for click', async function () {


    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn2(`POST:/api/book`, `data-i-info-click='${JSON.stringify(data)}'`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

  it('as runtime object for click', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn2(`POST:/api/book`, `data-i-info-click-js="{ name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' }"`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

});


function view_btn(method_url, data_info, { id, output_id, data }) {
  return `
    <button
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="click->${method_url}"
      data-i-output-id=${output_id}
      ${data_info}
    >
      Edit
    </button>
  `;
}

function view_btn2(method_url, data_info, { id, output_id, data }) {
  return `
    <button
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="click->${method_url} mouseover->GET:/api/hello"
      data-i-output-id=${output_id}
      ${data_info}
    >
      Edit
    </button>
  `;
}

function view_result(id, { name, year, variant, type, person }) {
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