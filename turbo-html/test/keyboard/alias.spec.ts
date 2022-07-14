import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';
import fire_keyboard_ev from '../lib/fire_keyboard_ev';


describe('[Alias keyboard]', function () {
  let abort;
  const ID = 'test';

  beforeAll(async () => {
    abort = before_start();
  });

  beforeEach(() => {
    nock('http://localhost')
    .post('/api/book/form')
    .reply(200, function (uri, requestBody) {
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
    });
  });

  afterAll(async () => {
    abort();
  });

  it('@keydown(enter, click)', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`click->POST:/api/book/form @keydown(enter, click)`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

  it('@keyup(enter, click)', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`click->POST:/api/book/form @keyup(enter, click)`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

  it('@keydown(enter, click) - revoke alias', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book/revoke')
      .reply(200, function (uri, requestBody) {
        count++;
        return view_btn(`click->POST:/api/book/revoke`, { id: this.req.headers['x-ignis-output-id'], output_id: this.req.headers['x-ignis-output-id'], data: null });
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`click->POST:/api/book/revoke @keydown(enter, click)`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    expect(ID).equal_content(view_btn(`click->POST:/api/book/revoke`, { id: ID, output_id: ID, data: null }));
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(300); // wait submit
    expect(count).toEqual(1);
  });

  it('@keydown(enter, click) - revoke source event', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book/revoke')
      .reply(200, function (uri, requestBody) {
        count++;
        return view_btn(`@keydown(enter, click)`, { id: this.req.headers['x-ignis-output-id'], output_id: this.req.headers['x-ignis-output-id'], data: null });
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`click->POST:/api/book/revoke @keydown(enter, click)`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    expect(ID).equal_content(view_btn(`@keydown(enter, click)`, { id: ID, output_id: ID, data: null }));
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(300); // wait submit
    expect(count).toEqual(1);
  });

  it('@keyup(enter, click) - revoke alias', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book/revoke')
      .reply(200, function (uri, requestBody) {
        count++;
        return view_btn(`click->POST:/api/book/revoke`, { id: this.req.headers['x-ignis-output-id'], output_id: this.req.headers['x-ignis-output-id'], data: null });
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`click->POST:/api/book/revoke @keyup(enter, click)`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit
    expect(ID).equal_content(view_btn(`click->POST:/api/book/revoke`, { id: ID, output_id: ID, data: null }));
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(300); // wait submit
    expect(count).toEqual(1);
  });
});


function view_btn(ev, { id, output_id, data }) {
  return `
    <button
      id="${id}"
      class="button is-primary card-footer-item"
      type="button"
      ${ev ? `data-i-ev="${ev}"` : ''}
      data-i-output-id="${output_id}"
      ${data ? `data-i-info='${JSON.stringify(data)}'` : ''}
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

