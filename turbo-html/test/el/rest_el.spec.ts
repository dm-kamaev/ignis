import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[REST el]', function () {
  let abort;
  const ID = 'test';

  beforeAll(async () => {
    abort = before_start();
  });

  afterAll(async () => {
    abort();
  });

  it('POST', async function () {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

  it('PUT', async function () {
    nock('http://localhost')
      .put('/api/book/form/1')
      .reply(200, function (uri, requestBody) {
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`PUT:/api/book/form/1`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });


  it('GET', async function () {
    nock('http://localhost')
      .get('/api/book/form/1')
      .query(true)
      .reply(200, function () {
        const searchParams = new URL(this.req.path, document.baseURI).searchParams;
        return view_result(this.req.headers['x-ignis-output-id'], {
          name: searchParams.get('name') as any,
          year: searchParams.get('year') as any,
          variant: searchParams.get('variant')?.split(',') as any,
          type: searchParams.get('type') as any,
          person: searchParams.get('person') as any,
        });
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`GET:/api/book/form/1`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });


  it('DELETE', async function () {
    nock('http://localhost')
      .delete('/api/book/form/1')
      .query(true)
      .reply(200, function () {
        const searchParams = new URL(this.req.path, document.baseURI).searchParams;
        return view_result(this.req.headers['x-ignis-output-id'], {
          name: searchParams.get('name') as any,
          year: searchParams.get('year') as any,
          variant: searchParams.get('variant')?.split(',') as any,
          type: searchParams.get('type') as any,
          person: searchParams.get('person') as any,
        });
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`DELETE:/api/book/form/1`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
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