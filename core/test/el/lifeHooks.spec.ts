import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';
import HttpError from '../../src/HttpError';


describe('[lifeHooks]', function () {
  let turboHtml;
  const ID = 'test';
  let error: Error;
  let onStartRequestMock = jest.fn();
  let onEndRequestMock = jest.fn();
  let onErrorMock = jest.fn().mockImplementation((err) => error = err);

  beforeAll(async () => turboHtml = before_start({
    onStartRequest: onStartRequestMock,
    onError: onErrorMock,
    onEndRequest: onEndRequestMock,
  }));

  afterAll(async () => {
    turboHtml.stop();
  });

  afterEach(() => {
    error = undefined as any;
    onStartRequestMock.mockReset();
    onErrorMock.mockReset();
    onEndRequestMock.mockReset();
  });

  it('[Global hooks]: Fail request', async function () {
    nock('http://localhost')
      .post('/api/book')
      .reply(500);

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(200); // wait submit

    expect(onStartRequestMock).toBeCalledWith(document.getElementById(ID), {
      name: 'click',
      method: 'POST',
      url: '/api/book',
      mods: {},
      custom_ev: undefined
    });
    expect(onErrorMock).toBeCalled();
    expect(error).toBeInstanceOf(HttpError);
    expect(error instanceof HttpError && error.getResponse()?.status).toEqual(500);
    expect(error instanceof HttpError && error.getError().name).toEqual('AxiosError');
    expect(error instanceof HttpError && error.getData()).toEqual('');
    expect(onEndRequestMock).toBeCalledWith(document.getElementById(ID), {
      name: 'click',
      method: 'POST',
      url: '/api/book',
      mods: {},
      custom_ev: undefined
    }, error);
  });

  it('[Global hooks]: Success request', async function () {
    nock('http://localhost')
      .post('/api/book')
      .reply(200);

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(200); // wait submit

    expect(onStartRequestMock).toBeCalledWith(document.getElementById(ID), {
      name: 'click',
      method: 'POST',
      url: '/api/book',
      mods: {},
      custom_ev: undefined
    });
    expect(onErrorMock).not.toBeCalled();
    expect(error).not.toBeInstanceOf(Error);
    expect(onEndRequestMock).toBeCalledWith(document.getElementById(ID), {
      name: 'click',
      method: 'POST',
      url: '/api/book',
      mods: {},
      custom_ev: undefined
    });
  }, undefined);


  it('[Local hooks]: Fail request', async function () {
    nock('http://localhost')
      .post('/api/book')
      .reply(500);

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn_with_hooks(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(200); // wait submit

    expect(document.getElementById('on_start_request')?.innerHTML).toEqual('CALLED');
    expect(document.getElementById('on_error')?.innerHTML).toEqual('CALLED');
    expect(document.getElementById('on_end_request')?.innerHTML).toEqual('CALLED');
  });

  it('[Local hooks]: Success request', async function () {
    nock('http://localhost')
      .post('/api/book')
      .reply(200);

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn_with_hooks(`POST:/api/book`, { id: ID, output_id: ID, data });
    await timeout(200); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(200); // wait submit

    expect(document.getElementById('on_start_request')?.innerHTML).toEqual('CALLED');
    expect(document.getElementById('on_error')?.innerHTML).toEqual('NOT CALLED');
    expect(document.getElementById('on_end_request')?.innerHTML).toEqual('CALLED');
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

function view_btn_with_hooks(method_url, { id, output_id, data }) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  const code = `
    function onStartRequest() { document.getElementById("on_start_request").innerHTML = "CALLED"; }
    function onError() { document.getElementById("on_error").innerHTML = "CALLED"; }
    function onEndRequest() { document.getElementById("on_end_request").innerHTML = "CALLED"; }
  `;
  script.appendChild(document.createTextNode(code));
  const place = document.head;
  place.appendChild(script);

  return `
    <button
      id=${id}
      class="button is-primary card-footer-item"
      type=button
      data-i-ev="click->${method_url}"
      data-i-output-id=${output_id}
      data-i-info='${JSON.stringify(data)}'
      data-i-on-start-request="onStartRequest()"
      data-i-on-error="onError()"
      data-i-on-end-request="onEndRequest()"
    >
      Edit
    </button>
    <div id="on_start_request">NOT CALLED</div>
    <div id="on_error">NOT CALLED</div>
    <div id="on_end_request">NOT CALLED</div>
  `;
}
