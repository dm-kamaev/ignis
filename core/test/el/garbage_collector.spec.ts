import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';
import * as helper from '../../src/helperForBrowser';

const spy_debounce = jest.spyOn(helper, 'debounce').mockImplementation(cb => {
  return function() { cb() };
});

describe('[Garbage collector]', function () {
  let turboHtml;
  const ID = 'test';

  beforeAll(async () => {
    turboHtml = before_start();
  });

  afterAll(async () => {
    turboHtml.stop();
  });


  it('call gs', async function () {
    nock('http://localhost')
    .post('/api/book')
    .reply(200, function (uri, requestBody) {
      return view_result(this.req.headers['x-i-output-id'], requestBody as any);
    });
    const id_button = 'button';
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
      <div id=${ID}>
        ${view_btn(`POST:/api/book`, `data-i-info='${JSON.stringify(data)}'`, { id: id_button, output_id: ID })}
      </div>
      <div data-i-ev="click->GET:/api/book"></div>
    `;
    await timeout(100); // wait mounted
    document.getElementById(id_button)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    document.dispatchEvent(new Event('turbo-html:garbage_collector'));
    await timeout(200); // wait submit
    expect(ID).equal_content(view_result(ID, data));
    expect(spy_debounce).toBeCalledTimes(1);
  });
});


function view_btn(method_url, data_info, { id, output_id }) {
  return `
    <button
      id="${id}"
      class="button is-primary card-footer-item"
      type="button"
      ${method_url ? `data-i-ev="click->${method_url}"` : ''}
      data-i-output-id="${output_id}"
      ${data_info ? data_info : ''}
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