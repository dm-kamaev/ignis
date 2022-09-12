import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[Revoke command from el]', function () {
  let turboHtml;
  const ID = 'test';

  beforeAll(async () => {
    turboHtml = before_start();
  });

  afterAll(async () => {
    turboHtml.stop();
  });

  afterEach(async () => {
    nock.cleanAll();
  });

  it('assign', async function () {
    nock('http://localhost')
      .post('/api/book')
      .reply(200, function (uri, requestBody) {
        return view_btn2(`POST:/api/book`, `POST:/api/book/input`, { id: ID, output_id: ID });
      });

    nock('http://localhost')
      .post('/api/book/input')
      .reply(200, function (uri, requestBody) {
        return view_result(this.req.headers['x-i-output-id']);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_btn2(`POST:/api/book`, `POST:/api/book/input`, { id: ID, output_id: ID }));
    document.getElementById(ID)?.dispatchEvent(new Event('input'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID));
  });

  it('revoke', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .reply(200, function (uri, requestBody) {
        count++;
        return view_btn(``, { id: ID, output_id: ID, data: null });
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_btn(``, { id: ID, output_id: ID, data: null }));
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(count).toEqual(1);
  });


});


function view_btn(method_url, { id, output_id, data }) {
  return `
    <button
      id="${id}"
      class="button is-primary card-footer-item"
      type="button"
      ${method_url ? `data-i-ev="click->${method_url}"` : ''}
      data-i-output-id="${output_id}"
      ${data ? `data-i-info='${JSON.stringify(data)}'` : ''}
    >
      Edit
    </button>
  `;
}

function view_btn2(method_url, method_url2, { id, output_id }) {
  return `
    <button
      id="${id}"
      class="button is-primary card-footer-item"
      type="button"
      data-i-ev="click->${method_url} input->${method_url2}"
      data-i-output-id="${output_id}"
    >
      Edit
    </button>
  `;
}

function view_result(id) {
  return `<p id="${id}">OK</p>`;
}
