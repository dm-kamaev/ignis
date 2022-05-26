import axios from 'axios';
import before_start from '../lib/before_start';
const { router, view_tick_v1, view_tick_v2 } = require('./api.js');

jest.setTimeout(10000);
describe('[@every]', function () {
  let abort;

  beforeAll(async () => {
    abort = before_start();
  });

  afterAll(async () => {
    abort();
  });

  it('stop via http code', async function () {
    // timeout();
    // jest.advanceTimersByTime(10000);
    // jest.advanceTimersByTime(10000);

    global.app.use('/api/book', router);
    document.body.innerHTML = view_tick_v1('test', 0);
    await timeout(1100); // --> 1
    await timeout(1100); // --> 2
    await timeout(1100); // --> 3
    await timeout(1100); // --> Abort
    expect(document.getElementById('test')?.innerHTML.trim()).toEqual('3');
  });

  it('stop via revoke attribute', async function () {
    global.app.use('/api/book', router);
    document.body.innerHTML = view_tick_v2('test', 0);
    await timeout(1100); // --> 1
    await timeout(1100); // --> 2
    await timeout(1100); // --> 3
    await timeout(1100); // --> Abort
    expect(document.getElementById('test')?.innerHTML.trim()).toEqual('3');
  });
});

function timeout(t) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, t);
  });
}