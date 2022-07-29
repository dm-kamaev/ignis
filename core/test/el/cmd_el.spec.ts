import nock from 'nock';
import before_start from '../lib/before_start';
import { commands } from '../../src/cmd';
import timeout from '../lib/timeout';


describe('[Commands for el]', function () {
  let abort;
  const ID = 'test';

  beforeAll(async () => {
    abort = before_start();
  });

  afterAll(async () => {
    abort();
  });

  it('Update', async function () {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return [commands.Update({ id: this.req.headers['x-i-output-id'], html: view_result(this.req.headers['x-i-output-id'], requestBody as any) })];
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
  });


  it('Update with css', async function () {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return [commands.Update({ id: this.req.headers['x-i-output-id'], html: view_result(this.req.headers['x-i-output-id'], requestBody as any), css: '.test-cls{color:blue}' })];
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(ID).equal_content(view_result(ID, data));
    expect(get_css_class('.test-cls')?.style.color).toEqual('blue');
  });

  it('Remove', async function () {
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return [commands.Remove(this.req.headers['x-i-output-id'])];
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = view_btn(`POST:/api/book/form`, { id: ID, output_id: ID, data });
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(document.getElementById(ID)).toBeFalsy();
  });

  it('AppendToTop', async function () {
    const id_list = 'list';
    const id_new_el = 'new_el';
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return [commands.AppendToTop({ id: this.req.headers['x-i-output-id'], html: view_result(id_new_el, data), css: '.test-cls{color:blue}' })];
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div id=list>
      ${view_btn(`POST:/api/book/form`, { id: ID, output_id: id_list, data })}
    </div>`;
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(id_new_el).equal_content(view_result(id_new_el, data));
    const new_el = (document.getElementById(ID)?.previousSibling?.previousSibling?.previousSibling as HTMLElement).outerHTML;
    expect(convert(new_el)).toEqual(convert(view_result(id_new_el, data)));
  });

  it('AppendToTop with css', async function () {
    const id_list = 'list';
    const id_new_el = 'new_el';
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return [commands.AppendToTop({ id: this.req.headers['x-i-output-id'], html: view_result(id_new_el, data), })];
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div id=list>
      ${view_btn(`POST:/api/book/form`, { id: ID, output_id: id_list, data })}
    </div>`;
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(id_new_el).equal_content(view_result(id_new_el, data));
    const new_el = (document.getElementById(ID)?.previousSibling?.previousSibling?.previousSibling as HTMLElement).outerHTML;
    expect(convert(new_el)).toEqual(convert(view_result(id_new_el, data)));
    expect(get_css_class('.test-cls')?.style.color).toEqual('blue');
  });

  it('AppendToEnd', async function () {
    const id_list = 'list';
    const id_new_el = 'new_el';
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return [commands.AppendToEnd({ id: this.req.headers['x-i-output-id'], html: view_result(id_new_el, data), })];
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div id=list>
      ${view_btn(`POST:/api/book/form`, { id: ID, output_id: id_list, data })}
    </div>`;
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(id_new_el).equal_content(view_result(id_new_el, data));
    const new_el = (document.getElementById(ID)?.nextSibling?.nextSibling?.nextSibling as HTMLElement).outerHTML;
    expect(convert(new_el)).toEqual(convert(view_result(id_new_el, data)));
  });

  it('AppendToEnd with css', async function () {
    const id_list = 'list';
    const id_new_el = 'new_el';
    nock('http://localhost')
      .post('/api/book/form')
      .reply(200, function (uri, requestBody) {
        return [commands.AppendToEnd({ id: this.req.headers['x-i-output-id'], html: view_result(id_new_el, data), css: '.test-cls{color:blue}' })];
      });

    const data = { name: 'Vasya', year: 1850, variant: ['v1', 'v2'], type: 'Fiction', person: 'Anton' };
    document.body.innerHTML = `
    <div id=list>
      ${view_btn(`POST:/api/book/form`, { id: ID, output_id: id_list, data })}
    </div>`;
    await timeout(400); // wait mounted
    document.getElementById(ID)?.dispatchEvent(new Event('click'));
    await timeout(100); // wait submit
    expect(id_new_el).equal_content(view_result(id_new_el, data));
    const new_el = (document.getElementById(ID)?.nextSibling?.nextSibling?.nextSibling as HTMLElement).outerHTML;
    expect(convert(new_el)).toEqual(convert(view_result(id_new_el, data)));
    expect(get_css_class('.test-cls')?.style.color).toEqual('blue');
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

const convert = (str) => ('' || str).replace(/\s+/g, ' ').trim();


function get_css_class(name: string): CSSPageRule | null {
  const styleSheets = Array.from(document.styleSheets).filter(
    (styleSheet) => !styleSheet.href || styleSheet.href.startsWith(window.location.origin)
  );
  for (let i = 0; i < styleSheets.length; i++) {
    if (!(styleSheets[i] instanceof CSSStyleSheet && styleSheets[i].cssRules)) {
      continue;
    }
    const cssRules = styleSheets[i].cssRules;
    for (let j = 0, l = cssRules.length; j < l; j++) {
      const rule = cssRules[j];
      const selectorText = (rule as any).selectorText;
      if (!selectorText) {
        continue;
      }
      if (selectorText.toLowerCase() === name) {
        return cssRules[j] as CSSPageRule;
      }
    }
  }
  return null;
}
