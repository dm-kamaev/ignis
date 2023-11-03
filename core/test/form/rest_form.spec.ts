import before_start from '../lib/before_start';
import timeout from '../lib/timeout';
import start_server from '../lib/start_server';
const { router, view_form, view_form_submitted, view_form_file, view_form_file_submitted } = require('./api.js');


global.FormDataReal = FormData;

class FormDataMock {
  constructor($form: HTMLFormElement) {
    const formdata = new global.FormDataReal($form);
    // We set fake file, because mocking FormData not work
    const content = '<a id="a"><b id="b">hey!</b></a>';
    const blob = new Blob([content], { type: "text/xml" });
    formdata.set('file', blob, 'image.png');

    return formdata;
  }
}

// @ts-ignore
global.FormData = FormDataMock;

jest.setTimeout(20000);
describe('[REST form]', function () {
  let turboHtml;
  let stop_server;
  const ID = 'test';

  beforeAll(async () => {
    stop_server = await start_server();
    turboHtml = before_start({});
    global.app.use('/api/book', router);
  });

  afterAll(async () => {
    stop_server();
    turboHtml.stop();
  });

  it('POST', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(ID, `POST:/api/book?utm_query=1`, data);
    await timeout(600); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(800); // wait submit
    expect(ID).equal_content(view_form_submitted(ID, data));
  });


  it('PUT', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(ID, `PUT:/api/book/123?utm_query=1`, data);
    await timeout(600); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(800); // wait submit
    expect(ID).equal_content(view_form_submitted(ID, data));
  });

  it('GET', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(ID, `GET:/api/book/via_urlencode?utm_query=1`, data);
    await timeout(600); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(800); // wait submit
    expect(ID).equal_content(view_form_submitted(ID, data));
  });

  it('DELETE', async function () {
    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_form(ID, `DELETE:/api/book/453?utm_query=1`, data);
    await timeout(600); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(800); // wait submit
    expect(ID).equal_content(view_form_submitted(ID, data));
  });

  it('POST file', async function () {
    const data = { name: 'Vasya', file_name: 'image.png' };
    document.body.innerHTML = view_form_file(ID, `POST:/api/book/via_formdata?utm_query=1`, data);
    await timeout(600); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(800); // wait submit
    expect(ID).equal_content(view_form_file_submitted(ID, data));
  });

  it('PUT file', async function () {
    const data = { name: 'Vasya', file_name: 'image.png' };
    document.body.innerHTML = view_form_file(ID, `PUT:/api/book/via_formdata?utm_query=1`, data);
    await timeout(600); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('submit'));
    await timeout(800); // wait submit
    expect(ID).equal_content(view_form_file_submitted(ID, data));
  });
});
