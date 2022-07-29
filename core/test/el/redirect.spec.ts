import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[Redirect]', function () {
  let abort;
  const ID = 'test';
  const setHrefSpy = jest.fn(href => expect(href).toEqual('/page/redirect'));

  beforeAll(async () => {
    abort = before_start();

    delete (window as any).location;
    window.location = {} as any;
    Object.defineProperty(window.location, 'href', {
      // get: getHrefSpy,
      set: setHrefSpy,
    });
  });

  afterAll(async () => {
    abort();
  });

  it('redirect', async function () {
    nock('http://localhost')
      .defaultReplyHeaders({
        'x-i-redirect-to': '/page/redirect',
      })
      .post('/api/book/form')
      .reply(200);

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(100); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(setHrefSpy).toHaveBeenCalled();
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
