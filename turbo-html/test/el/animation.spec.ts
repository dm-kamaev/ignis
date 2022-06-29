import nock from 'nock';
import before_start from '../lib/before_start';
import timeout from '../lib/timeout';
import { addCss } from '../../src/helper';
import { commands } from '../../src/cmd';

// jest.setTimeout(20000);
describe('[Animation]', function () {
  let abort;
  const ID = 'test';

  beforeAll(async () => {
    abort = before_start();
    addCss(`
      .fade-in {
        animation: fade_in ease 2s;
        -webkit-animation: fade_in ease 2s;
        -moz-animation: fade_in ease 2s;
        -o-animation: fade_in ease 2s;
        -ms-animation: fade_in ease 2s;
      }

      @keyframes fade_in {
        0% {opacity:0;}
        100% {opacity:1;}
      }

      .fade-out {
        animation: fade_out ease 2s;
        -webkit-animation: fade_out ease 2s;
        -moz-animation: fade_out ease 2s;
        -o-animation: fade_out ease 2s;
        -ms-animation: fade_out ease 2s;
      }

      @keyframes fade_out {
        0% {opacity:1;}
        100% {opacity:0;}
      }
    `)
  });

  afterAll(async () => {
    abort();
  });

  it('on update', async function () {
    nock('http://localhost')
      .get('/api/test')
      .reply(200, function (uri, requestBody) {
        return view_update(this.req.headers['x-ignis-id']);
    });
    document.body.innerHTML = view_update(ID);
    await timeout(100); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(1000); // wait mounted
    expect(document.getElementById(ID)?.classList.contains('fade-in')).toEqual(true);
  });

  it('on update:delay(1s)', async function () {
    nock('http://localhost')
      .get('/api/test')
      .reply(200, function (uri, requestBody) {
        return view_update(this.req.headers['x-ignis-id'], 'delay(1s)');
    });
    document.body.innerHTML = view_update(ID, 'delay(1s)');
    await timeout(100); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(2000); // wait mounted
    expect(document.getElementById(ID)?.classList.contains('fade-in')).toEqual(true);
  });

  it('on remove', async function () {
    nock('http://localhost')
      .delete('/api/test')
      .reply(200, function (uri, requestBody) {
        return [commands.Remove(this.req.headers['x-ignis-id'])];
    });
    document.body.innerHTML = view_remove(ID);
    await timeout(100); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(3000); // wait mounted
    expect(document.getElementById(ID)).toBeFalsy();
  });
});


function view_update(id, attribute?: string) {
  return `
    <div
      id=${id}
      class=test
      data-i-ev="click->GET:/api/test"
      ${attribute ? `data-i-animation-class-on-update="fade-in:${attribute}"`: 'data-i-animation-class-on-update="fade-in"'}
    >
      Content
    </div>`
  ;
}

function view_remove(id, attribute?: string) {
  return `
    <div
      id=${id}
      class=test
      data-i-ev="click->DELETE:/api/test"
      data-i-animation-class-on-remove="fade-out:delay(2s)"
    >
      Content
    </div>`
    ;
}
