import { Axios, AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import FormToJSON from 'forms_to_json';
import morphdom from 'morphdom';

import { getById, addCss, getTarget } from './helper';

import Manager_Long_Request from './Manager_Long_Request';
import { I_life_hooks } from './interface';
import enum_attr from './enum_attr';
import El from './El';

type T_cmd = { name: string; method: string; url: string };

// set state for current page
history.replaceState({ v: 'ignis-html:1', url: document.location.href }, '', document.location.href);
window.addEventListener('popstate', function(ev) {
  if (ev.state.v === 'ignis-html:1' && ev.state.url) {
    window.location.href = ev.state.url;
  }
});

export default class Executor {
  private axios: Axios;
  private life_hooks: I_life_hooks;
  private $el: HTMLElement;
  private el: El;


  constructor(life_hooks: I_life_hooks, el: El, axios: Axios) {
    this.el = el;
    this.$el = el.$el;
    this.life_hooks = life_hooks;
    this.axios = axios;
  }


  run_as_form(e: Event, cmd: { method: string; url: string }, { spinner }: { spinner: boolean }) {
    e.preventDefault();

    const axios = this.axios;
    const $el = this.$el;

    const id = $el.id;
    const output_id = $el.getAttribute('data-i-output-id');
    let url = cmd.url;
    const enctype = $el.getAttribute('data-i-enctype')?.trim();
    const method = cmd.method;

    if (!output_id) {
      throw new Error('Not found id = ' + output_id);
    }

    if (!['GET', 'DELETE', 'POST', 'PUT'].includes(method)) {
      throw new Error('Not valid method ' + method);
    }

    const $form: HTMLFormElement = getTarget(e);
    let req;
    const method_name = method.toLowerCase();
    const headers = this._build_headers({ id, output_id, request_id: this.el.set_request_id(), });

    if (method === 'GET' || method === 'DELETE') {
      // TODO: encode query params
      const json = new FormToJSON($form).parse();
      console.log(json, method, url);
      url = this._form_add_to_url(url, json);
      req = axios[method.toLowerCase()](url, { headers });
    } else { // POST, PUT
      if (enctype === 'multipart/form-data') {
        const formdata = new FormData($form);
        console.log(formdata, method, url, output_id);
        req = axios[method_name](url, formdata, { headers });
      } else {
        const json = new FormToJSON($form).parse();
        console.log(json, method, url, output_id);
        req = axios[method_name](url, json, { headers });
      }
    }

    this._make_request(req, $el, spinner, url);
  }

  run_as_el(e: Event, cmd: T_cmd, settings: { spinner: boolean }) {
    e.preventDefault();
    this._run(cmd, settings);
  }

  run_as_every(cmd: T_cmd, settings: { spinner: boolean }) {
    this._run(cmd, settings);
  }

  private _run(cmd: T_cmd, { spinner }: { spinner: boolean }) {
    const axios = this.axios;
    const $el = this.$el;

    const id = $el.id;
    const output_id = $el.getAttribute('data-i-output-id');

    const method = cmd.method;
    let url = cmd.url;
    const origin_url = cmd.url;


    if (!['GET', 'POST', 'PUT','DELETE'].includes(method)) {
      throw new Error('Not valid method ' + method);
    }

    const method_name = method.toLowerCase();
    const headers = this._build_headers({ id, output_id, request_id: this.el.set_request_id(), });

    let req;
    const json = this._extract_data($el, cmd.name);
    if (method === 'GET' || method === 'DELETE') {
      console.log(json, method, url);
      url = this._form_add_to_url(url, json);
      req = axios[method_name](url, { headers });
    } else if (method === 'POST' || method === 'PUT') {
      req = axios[method_name](url, json, { headers });
    }

    this._make_request(req, $el, spinner, url);
  }

  private _extract_data($el: HTMLElement, name: string): Record<string, any> {
    const obj = $el.hasAttribute(`data-i-info-${name}-js`) ? { attr: `data-i-info-${name}-js`, js: true } :
      $el.hasAttribute(`data-i-info-${name}`) ? { attr: `data-i-info-${name}`, js: false } :
      $el.hasAttribute('data-i-info-js') ? { attr: 'data-i-info-js', js: true } :
      { attr: 'data-i-info', js: false };
    if (obj.js) {
      const expr = $el.getAttribute(obj.attr);
      const code = `with(this){${`return ${expr}`}}`;
      const fn = new Function(code).bind($el);
      return fn();
    } else {
      const str_data = $el.getAttribute(obj.attr);
      if (!str_data) {
        return {};
      }
      return JSON.parse(str_data);
    }
  }

  private _make_request(req: Promise<AxiosResponse>, $el: HTMLElement, spinner: boolean, url: string) {
    const manager_long_request = spinner ? new Manager_Long_Request(this.life_hooks.longRequest, $el).start() : { end: () => {} };

    req.then((resp: AxiosResponse) => this._handle_response(resp, url)).catch(this._handler_error.bind(this)).finally(manager_long_request.end.bind(manager_long_request));
  }

  private _handle_response(resp: AxiosResponse, url: string) {
    const { config: _, headers, data } = resp;
    const status = resp.status;

    // const url_obj = new URL(config.url as string);
    // const url = url_obj.origin + url_obj.pathname;

    // We are syncing response, discard outdated response by header
    if (headers['x-ignis-request-id'] && this.el.get_request_id() !== headers['x-ignis-request-id']) {
      return;
    }

    // Abort polling
    // https://en.wikipedia.org/wiki/86_(term)
    if (status === 286) {
      return this.el.abort_every();
    }

    if (data instanceof Array) {
      data.forEach(cmd => this._apply_response(cmd));
    } else if (data) {
      const html = data;
      this._apply_response({ ev: 'update', data: { html, css: undefined } });
    } else if (headers['x-ignis-redirect-to']) {
      window.location.href = headers['x-ignis-redirect-to'];
    }

    // push url if has attribute
    if (this.el.$el.hasAttribute('data-i-push-url')) {
      history.pushState({ v:'ignis-html:1', url }, '', url);
    }
  }

  private _handler_error(err: AxiosError) {
    this.life_hooks.onError(err);
  }

  private _apply_response(resp: { ev: 'update', data: { id?: string; html: string, css?: string } } | { ev: 'remove', data: { id: string } } | { ev: 'append_to_top' | 'append_to_end', data: { id: string, html: string, css?: string } }) {
    if (resp.ev === 'update') {
      const { html, css } = resp.data;
      const id = resp.data.id || this._extract_id(resp.data.html);
      console.log({ id, html });
      this._apply_css(css);
      this._render(id, html);
    } else if (resp.ev === 'remove') {
      const $el = getById(resp.data.id);
      if (!$el) {
        throw new Error('[@ignis-web/html]: Not found element with id "#' + resp.data.id+'" for "remove"');
      }
      $el.outerHTML = '';
    } else if (resp.ev === 'append_to_top') {
      const { id, html, css } = resp.data;
      this._apply_css(css);

      const $el = getById(id);
      if (!$el) {
        throw new Error('[@ignis-web/html]: Not found element with id "#' + id +'" for "append_to_top"');
      }
      $el.insertAdjacentHTML('afterbegin', html);
    } else if (resp.ev === 'append_to_end') {
      const { id, html, css } = resp.data;
      this._apply_css(css);

      const $el = getById(id);
      if (!$el) {
        throw new Error('[@ignis-web/html]: Not found element with id "#' + id +'" for "append_to_end"');
      }
      $el.insertAdjacentHTML('beforeend', html);
    } else {
      throw new Error('[@ignis-web/html]: Invalid command ' + JSON.stringify(resp));
    }
  }

  private _render(id: string, html: string) {
    const target = getById(id);
    if (!target) {
      throw new Error(`Not found element with id: #${id}`);
    }
    morphdom(target, html, options_for_render);
  }

  private _is_absolute_url(url: string) {
    return new RegExp('^(https?:)?//').test(url);
  }

  private _create_url_obj(url: string) {
    return this._is_absolute_url(url) ? new URL(url) : new URL(url, document.baseURI);
  }

  private _apply_css(css?: string) {
    if (css) {
      addCss(css);
    }
  }

  private _extract_id(html: string): string {
    const m = html.match(/d=([^>\s]+)/);
    if (!m) {
      throw new Error('Not found id in html: ' + html);
    }
    const id = m[1];
    if (!id) {
      throw new Error('Not found id in html: ' + html);
    }
    return id;
  }

  private _build_headers({ id, output_id, request_id }: { id: string, output_id: string | null, request_id: string }) {
    return {
      'X-Ignis-Request': 'true',
      'X-Ignis-Id': id,
      'X-Ignis-Output-Id': output_id,
      'X-Ignis-Request-Id': request_id,
    };
  }

  private _form_add_to_url(url: string, data) {
    const url_obj = this._create_url_obj(url);
    Object.keys(data).forEach(k => {
      url_obj.searchParams.append(k, data[k]);
    });
    return url_obj.href;
  }

}




const options_for_render = {
  onBeforeElUpdated: function (fromEl, toEl) {
    if (toEl.tagName === 'INPUT') {
      const use_prev_value = toEl.hasAttribute(enum_attr.PRESERVE);
      if ((toEl.type === 'checkbox' || toEl.type === 'radio') && use_prev_value) {
        toEl.checked = fromEl.checked;
      } else if (toEl.type === 'file' && use_prev_value) {
        toEl.files = fromEl.files;
      } else if (use_prev_value) {
        toEl.value = fromEl.value;
      }
    } else if (toEl.tagName === 'SELECT' && toEl.hasAttribute(enum_attr.PRESERVE)) {
      toEl.value = fromEl.value;
    }
    return true;
  }
};