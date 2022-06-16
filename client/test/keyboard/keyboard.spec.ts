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

  it('@keydown(enter)', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`@keydown(enter)->POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keydown', 'enter');
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });

  it('@keyup(enter)', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`@keyup(enter)->POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    fire_keyboard_ev(document.getElementById(ID) as HTMLElement, 'keyup', 'enter');
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
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


