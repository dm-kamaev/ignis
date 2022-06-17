import before_start from '../lib/before_start';
import start_server from '../lib/start_server';
import timeout from '../lib/timeout';
const api = require('./api.js');

jest.setTimeout(20000);
describe('[Sync request]', function () {
  let abort;
  let stop_server;
  const ID = 'test';

  beforeAll(async () => {
    stop_server = await start_server();
    abort = before_start();
    global.app.use('/api/book', api.router);
  });

  afterAll(async () => {
    stop_server();
    abort();
  });

  it('sync request: We are syncing response, discard outdated response by header', async function () {
    document.body.innerHTML = api.view_slow_request(`GET:/api/book/slow_request`, { id: ID, counter: api.counter_slow_request });
    await timeout(100); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(10000); // wait submit

    expect(document.getElementById('count')?.textContent).toEqual(api.counter_slow_request+'');
  });
});

