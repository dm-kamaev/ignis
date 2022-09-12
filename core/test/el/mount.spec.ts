import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';


describe('[Mount]', function () {
  const ID = 'test';

  it('local mount', async function () {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return view_content(`POST:/api/book/form`, { id: ID, content: '2' });
      });

    const MOUNT_ID = 'root';
    document.body.innerHTML = `
      <div id=${MOUNT_ID}>
        ${view_content(`POST:/api/book/form`, { id: ID, content: '1' })}
      </div>
    `;
    const turboHtml = before_start({ root: document.getElementById(MOUNT_ID) as HTMLElement });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_content(`POST:/api/book/form`, { id: ID, content: '2' }));
    turboHtml.stop();
    await timeout(100); // wait submit
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_content(`POST:/api/book/form`, { id: ID, content: '2' }));
  });


  it('not mount', async function () {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return view_content(`POST:/api/book/form`, { id: ID, content: '2' });
      });

    const MOUNT_ID = 'root';
    const NOT_MOUNT_ID = 'root2';
    const BUTTON_ID = 'button_id';
    document.body.innerHTML = `
      <div>
        <div id=${MOUNT_ID}>
          ${view_content(`POST:/api/book/form`, { id: ID, content: '1' })}
        </div>
        <div id=${NOT_MOUNT_ID}>
          ${view_content(`POST:/api/book/form`, { id: BUTTON_ID, content: '1' })}
        </div>
      </div>
    `;
    const turboHtml = before_start({ root: document.getElementById(MOUNT_ID) as HTMLElement });
    await timeout(400); // wait mounted
    document.getElementById(BUTTON_ID)?.dispatchEvent(new Event('click'));
    await timeout(400); // wait submit
    expect(BUTTON_ID).equal_content(view_content(`POST:/api/book/form`, { id: BUTTON_ID, content: '1' }));
    turboHtml.stop();
  });


});


function view_content(method_url, { id, content }) {
  return `
    <button
      id="${id}"
      class="button is-primary card-footer-item"
      type="button"
      data-i-ev="click->${method_url}"
    >
      ${content}
    </button>
  `;
}
