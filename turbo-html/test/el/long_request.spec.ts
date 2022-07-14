import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[Long request]', function () {
  let abort;
  const ID = 'test';
  const result: { start?: HTMLElement, stop?: HTMLElement } = { start: undefined, stop: undefined };

  beforeAll(async () => abort = before_start({
    longRequest: {
      start($el) {
        result.start = $el;
      },
      stop($el) {
        result.stop = $el;
      }
    }
  }));

  afterAll(async () => {
    abort();
  });


  beforeEach(async () => {
    result.start = undefined;
    result.stop = undefined;
    nock.cleanAll();
  });

  it('start/stop spinner', async function () {
    nock('http://localhost')
      .post('/api/book')
      .delay(1000)
      .reply(200, function (uri, requestBody) {
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    const source = document.getElementById(ID);
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(1200); // wait submit

    expect(ID).equal_content(view_result(ID, data));
    expect(result.start).toEqual(source);
    expect(result.stop).toEqual(source);
  });

  it('protect from flickering spinner', async function () {
    nock('http://localhost')
      .post('/api/book')
      .delay(500)
      .reply(200, function (uri, requestBody) {
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    const source = document.getElementById(ID);
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(500 + 500 + 100); // delay from server + delay for protecting from flickering spinner + delay for detecting stop request

    expect(ID).equal_content(view_result(ID, data));
    expect(result.start).toEqual(source);
    expect(result.stop).toEqual(source);
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

