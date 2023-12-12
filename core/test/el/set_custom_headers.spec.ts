import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[set_custom_headers]', function () {
  let turboHtml;
  const ID = 'test';

  afterEach(async () => {
    turboHtml.stop();
  });

  it('[el]: global headers', async function () {
    const token = 'sfl;sf234324=-2lksfmsa-234234-kla1';
    nock('http://localhost')
      .post('/api/book')
      .reply(200, function () {
        return view_result(this.req.headers['x-i-output-id'], this.req.headers['x-api-token']);
      });

    turboHtml = before_start({
      headers: {
        'X-API-Token': token,
      },
    });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(200); // wait submit

    expect(ID).equal_content(view_result(ID, token));
  });

   it('[el]: merge headers', async function () {
    const local_api_token = 123;
    const local_header = 'local';
    const csrf_token = 'sfsdfsdfsdf-=23=223kccxksda;jla[q';
    nock('http://localhost')
      .post('/api/book')
      .reply(200, function () {
        return view_result(
          this.req.headers['x-i-output-id'],
          this.req.headers['x-api-token'],
          this.req.headers['csrf-token'],
          this.req.headers['local-header'],

        );
      });

    turboHtml = before_start({
      headers: {
        'X-API-Token': 'sfl;sf234324=-2lksfmsa-234234-kla1',
        'CSRF-Token': csrf_token,
      },
    });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data }, `data-i-headers='{ "X-API-Token": ${local_api_token}, "Local-Header": "${local_header}" }'`);
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(200); // wait submit

    expect(ID).equal_content(view_result(ID, local_api_token, csrf_token, local_header));
  });

  it('[el]: invalid json headers', async function () {
    const local_api_token = 123;
    const local_header = 'local';
    const csrf_token = 'sfsdfsdfsdf-=23=223kccxksda;jla[q';

    let error: any;
    const onErrorMock = jest.fn().mockImplementation((err) => {
      error = err
    });
    turboHtml = before_start({
      headers: {
        'X-API-Token': 'sfl;sf234324=-2lksfmsa-234234-kla1',
        'CSRF-Token': csrf_token,
      },
      onError: onErrorMock,
    });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data }, `data-i-headers='{ X-API-Token: ${local_api_token}, "Local-Header": "${local_header}" }'`);
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(200); // wait submit

    expect(onErrorMock).toBeCalledTimes(1);
    expect(error).toBeInstanceOf(Error);
  });


  it('[form]: global headers', async function () {
    const token = 'sfl;sf234324=-2lksfmsa-234234-kla1';
    nock('http://localhost')
      .post('/api/book')
      .reply(200, function () {
        return view_result(this.req.headers['x-i-output-id'], this.req.headers['x-api-token']);
      });

    turboHtml = before_start({
      headers: {
        'X-API-Token': token,
      },
    });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(200); // wait submit

    expect(ID).equal_content(view_result(ID, token));
  });

   it('[form]: merge headers', async function () {
    const local_api_token = 123;
    const local_header = 'local';
    const csrf_token = 'sfsdfsdfsdf-=23=223kccxksda;jla[q';
    nock('http://localhost')
      .post('/api/book')
      .reply(200, function () {
        return view_result(
          this.req.headers['x-i-output-id'],
          this.req.headers['x-api-token'],
          this.req.headers['csrf-token'],
          this.req.headers['local-header'],

        );
      });

    turboHtml = before_start({
      headers: {
        'X-API-Token': 'sfl;sf234324=-2lksfmsa-234234-kla1',
        'CSRF-Token': csrf_token,
      },
    });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(`POST:/api/book`, { id: ID, output_id: ID, data }, `data-i-headers='{ "X-API-Token": ${local_api_token}, "Local-Header": "${local_header}" }'`);
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(200); // wait submit

    expect(ID).equal_content(view_result(ID, local_api_token, csrf_token, local_header));
  });
});

function view_btn(method_url, { id, output_id, data }, headers?: string) {
  return `
    <button
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="click->${method_url}"
      data-i-output-id=${output_id}
      data-i-info='${JSON.stringify(data)}'
      ${headers ? headers : ''}
    >
      Edit
    </button>
  `;
}

function view_form(method_url, { id, output_id, data }, headers?: string) {
  return `
    <form
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="submit->${method_url}"
      data-i-output-id=${output_id}
      ${headers ? headers : ''}
    >
      ${Object.entries(data).map(([ name, value ]) => `<input type="text" name=${name} value="${value instanceof Array ? value.join(',') : value}"></input>`).join(' ')}
    </form>
  `;
}

function view_result(id, ...tokens) {
  return `
    <div id="${id}">
      ${tokens.map(el => `<p>${el}</p>`).join('')}
    </div>
  `;
}




