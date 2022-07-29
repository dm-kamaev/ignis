import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[Modificators]', function () {
  let abort;
  const ID = 'test';
  const ID_result = 'result';

  beforeAll(async () => {
    abort = before_start();
  });

  afterAll(async () => {
    abort();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('once', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(3)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-i-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_btn(`POST:/api/book->once`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(count).toEqual(1);
  });

  it('changed', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(3)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-i-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_input(`POST:/api/book->changed(value)`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true}));
    await timeout(100); // wait submit
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    await timeout(100); // wait submit
    (document.getElementById(ID) as HTMLInputElement).value = 'safsdfdasf';
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    await timeout(100); // wait submit

    expect(count).toEqual(2);
  });

  it('debounce', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(6)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-i-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_input(`POST:/api/book->debounce(1s)`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    document.getElementById(ID)?.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    await timeout(1100); // wait submit

    expect(count).toEqual(1);
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
    >
      Edit
    </button>
  `;
}

function view_input(method_url, { id, output_id, data }) {
  return `
    <input
      id=${id}
      class="button is-primary card-footer-item"
      type=text
      data-i-ev="input->${method_url}"
      data-i-output-id=${output_id}
      data-i-info='${JSON.stringify(data)}'
    />
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