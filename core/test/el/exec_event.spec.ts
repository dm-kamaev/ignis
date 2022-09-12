import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[Exec event]', function () {
  let turboHtml;
  const ID = 'test';

  beforeAll(async () => {
    turboHtml = before_start();
  });

  afterAll(async () => {
    turboHtml.stop();
  });

  it('Click', async function () {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return view_result(this.req.headers['x-i-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    turboHtml.exec(document.getElementById(ID), 'click');
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

  it('Submit', async function () {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        const data = {
          ...requestBody as any,
          variant: (requestBody as any).variant.split(','),
        };
        return view_result(this.req.headers['x-i-output-id'], data);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    turboHtml.exec(document.getElementById(ID), 'submit');
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

function view_form(method_url, { id, output_id, data }) {
  return `
    <form
      action="#"
      id="${id}"
      data-i-ev="submit->${method_url}"
      data-i-output-id=${output_id}
      class="box"
    >
      <input type="text" name=name value=${data.name}></input>
      <input type="number" name=year value=${data.year}></input>
      <input type="text" name=type value=${data.type}></input>
      <input type="text" name=variant value=${data.variant.join(',')}></input>
      <input type="text" name=person value=${data.person}></input>
    </form>
  `;
}
