import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[Error]', function () {
  let turboHtml;
  const ID = 'test';
  let error: Error;

  beforeAll(async () => turboHtml = before_start({
    onError(err) {
      error = err;
    }
  }));

  afterAll(async () => {
    turboHtml.stop();
  });

  it('Fail request', async function () {
    nock('http://localhost')
      .post('/api/book')
      .reply(500);

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(200); // wait submit

    expect(error).toBeInstanceOf(Error);
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
