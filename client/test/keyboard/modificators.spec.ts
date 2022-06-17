import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';
import fire_keyboard_ev from '../lib/fire_keyboard_ev';



describe('[Modificators keyboard]', function () {
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

  it('once: @keydown', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(3)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_btn(`@keydown(enter)->POST:/api/book->once`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    expect(count).toEqual(1);
  });

  it('changed: @keydown', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(3)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_input(`@keydown(enter)->POST:/api/book->changed(value)`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    (document.getElementById(ID) as HTMLInputElement).value = 'safsdfdasf';
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit

    expect(count).toEqual(2);
  });

  it('debounce: @keydown', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(6)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_input(`@keydown(enter)->POST:/api/book->debounce(1s)`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(1100); // wait submit

    expect(count).toEqual(1);
  });

  it('once: @keyup', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(3)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_btn(`@keyup(enter)->POST:/api/book->once`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit
    expect(count).toEqual(1);
  });

  it('changed: @keyup', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(3)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_input(`@keyup(enter)->POST:/api/book->changed(value)`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit
    (document.getElementById(ID) as HTMLInputElement).value = 'safsdfdasf';
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit

    expect(count).toEqual(2);
  });

  it('debounce: @keyup', async function () {
    let count = 0;
    nock('http://localhost')
      .post('/api/book')
      .times(6)
      .reply(200, function (uri, requestBody) {
        count++;
        return view_result(this.req.headers['x-ignis-output-id'], requestBody as any);
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div>
      ${view_input(`@keyup(enter)->POST:/api/book->debounce(1s)`, { id: ID, output_id: ID_result, data })}
      <div id=${ID_result}></div>
    </div>`;
    await timeout(100); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(1100); // wait submit

    expect(count).toEqual(1);
  });

});


function view_btn(ev, { id, output_id, data }) {
  return `
    <button
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="${ev}"
      data-i-output-id=${output_id}
      data-i-info='${JSON.stringify(data)}'
    >
      Edit
    </button>
  `;
}

function view_input(ev, { id, output_id, data }) {
  return `
    <input
      id=${id}
      class="button is-primary card-footer-item"
      type=text
      data-i-ev="${ev}"
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