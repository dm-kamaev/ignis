import { Axios, AxiosError, AxiosResponse } from 'axios';
import FormToJSON from 'forms_to_json';

import morphdom from 'morphdom';

import { getById, addCss, getTarget, logger } from './helper';

import Manager_Long_Request from './Manager_Long_Request';
import Animation from './Animation';
import { I_life_hooks, I_class_form_data } from './interface';
import enum_attr from './enum_attr';
import El from './El';
import Url from './Url';

type T_cmd = { name: string; method: string; url: string };

// set state for current page
history.replaceState({ v: 'turbo-html:1', url: document.location.href }, '', document.location.href);
window.addEventListener('popstate', function(ev) {
  if (ev.state && ev.state.v === 'turbo-html:1' && ev.state.url) {
    window.location.href = ev.state.url;
  }
});

const animation = new Animation();

export default class Executor {
  private axios: Axios;
  private life_hooks: I_life_hooks;
  private $el: HTMLElement;
  private el: El;


  constructor(life_hooks: I_life_hooks, el: El, axios: Axios, private _FormData: I_class_form_data) {
    this.el = el;
    this.$el = el.$el;
    this.life_hooks = life_hooks;
    this.axios = axios;
  }


  run_as_form(e: Event, cmd: { method: string; url: string }, { spinner }: { spinner: boolean }) {
    e.preventDefault();

    const $form: HTMLFormElement = getTarget(e);

    const axios = this.axios;
    const $el = this.$el;

    const id = $el.id;
    const output_id = $el.getAttribute('data-i-output-id');
    const url = new Url(cmd.url);
    const origin_url = cmd.url;
    const enctype = $el.getAttribute('enctype')?.trim() || $el.getAttribute('data-i-enctype')?.trim();
    const method = cmd.method;

    if (!id && !output_id) {
      throw new Error('[turbo-html]: Set "id" or "data-i-output-id" for <form>');
    }

    if (!['GET', 'DELETE', 'POST', 'PUT'].includes(method)) {
      throw new Error('[turbo-html]: Not valid method ' + method);
    }

    let req;
    const method_name = method.toLowerCase();
    const headers = this._build_headers({ id, output_id, request_id: this.el.set_request_id(), });

    if (method === 'GET' || method === 'DELETE') {
      const json = new FormToJSON($form).parse();
      const str_url = url.form_add_to_url(json);
      logger(json, method, str_url);
      req = axios[method.toLowerCase()](str_url, { headers });
    } else { // POST, PUT
      if (enctype === 'multipart/form-data') {
        const formdata = new this._FormData($form);
        // console.log('Content of FormData', Array.from(new this._FormData($form) as any));
        const str_url = url.get();
        logger(formdata, method, str_url, output_id);
        req = axios[method_name](str_url, formdata, { headers });
      } else {
        const json = new FormToJSON($form).parse();
        const str_url = url.get();
        logger(json, method, str_url, output_id);
        req = axios[method_name](str_url, json, { headers });
      }
    }

    this._make_request(req, $el, spinner, origin_url);
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
    const url = new Url(cmd.url);
    const origin_url = cmd.url;

    if (!['GET', 'POST', 'PUT','DELETE'].includes(method)) {
      throw new Error('Not valid method ' + method);
    }

    const method_name = method.toLowerCase();
    const headers = this._build_headers({ id, output_id, request_id: this.el.set_request_id(), });

    let req;
    const json = this._extract_data($el, cmd.name);
    if (method === 'GET' || method === 'DELETE') {
      const str_url = url.form_add_to_url(json);
      logger(json, method, str_url);
      req = axios[method_name](str_url, { headers });
    } else if (method === 'POST' || method === 'PUT') {
      const str_url = url.get();
      req = axios[method_name](str_url, json, { headers });
    }

    this._make_request(req, $el, spinner, origin_url);
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
    req.then((resp: AxiosResponse) => this._handle_response(resp, url)).catch(this._handler_error.bind(this)).finally(() => {
      manager_long_request.end();
      document.body.dispatchEvent(new Event('turbo-html:garbage_collector', {
        bubbles: true,
        cancelable: true,
        composed: false
      }));
    });
  }

  private _handle_response(resp: AxiosResponse, url: string) {
    const { config: _, headers, data } = resp;
    const status = resp.status;
    // const url_obj = new URL(config.url as string);
    // const url = url_obj.origin + url_obj.pathname;

    // We are syncing response, discard outdated response by header
    if (headers['x-i-request-id'] && this.el.get_request_id() !== headers['x-i-request-id']) {
      return;
    }

    // Abort polling
    // https://en.wikipedia.org/wiki/86_(term)
    if (status === 286) {
      return this.el.revoke_cmd('@every');
    }

    if (data instanceof Array) {
      data.forEach(cmd => this._apply_response(cmd));
    } else if (data) {
      const html = data;
      this._apply_response({ ev: 'update', data: { html, css: undefined } });
    } else if (headers['x-i-redirect-to']) {
      window.location.href = headers['x-i-redirect-to'];
    }

    // push url if has attribute
    if (this.el.$el.hasAttribute('data-i-push-url')) {
      history.pushState({ v:'turbo-html:1', url }, '', url);
    }
  }

  private _handler_error(err: AxiosError) {
    this.life_hooks.onError(err);
  }

  private _apply_response(resp: { ev: 'update', data: { id?: string; html: string, css?: string } } | { ev: 'remove', data: { id: string } } | { ev: 'append_to_top' | 'append_to_end', data: { id: string, html: string, css?: string } }) {
    if (resp.ev === 'update') {
      const { html, css } = resp.data;
      const id = resp.data.id || this._extract_id(resp.data.html);
      this._apply_css(css);
      this._render(id, html);
    } else if (resp.ev === 'remove') {
      const $el = getById(resp.data.id);
      if (!$el) {
        throw new Error('[turbo-html]: Not found element with id "#' + resp.data.id+'" for "remove"');
      }
      animation.on_remove($el, () => $el.outerHTML = '');
    } else if (resp.ev === 'append_to_top') {
      const { id, html, css } = resp.data;
      this._apply_css(css);

      const $el = getById(id);
      if (!$el) {
        throw new Error('[turbo-html]: Not found element with id "#' + id +'" for "append_to_top"');
      }
      $el.insertAdjacentHTML('afterbegin', html);
    } else if (resp.ev === 'append_to_end') {
      const { id, html, css } = resp.data;
      this._apply_css(css);

      const $el = getById(id);
      if (!$el) {
        throw new Error('[turbo-html]: Not found element with id "#' + id +'" for "append_to_end"');
      }
      $el.insertAdjacentHTML('beforeend', html);
    } else {
      throw new Error('[turbo-html]: Invalid command ' + JSON.stringify(resp));
    }
  }

  private _render(id: string, html: string) {
    const target = getById(id);
    if (!target) {
      throw new Error(`Not found element with id: #${id}`);
    }
    morphdom(target, html, options_for_render);
  }

  private _apply_css(css?: string) {
    if (css) {
      addCss(css);
    }
  }

  private _extract_id(html: string): string {
    const m = html.match(/id=([^>\s]+)/);
    if (!m) {
      throw new Error('[turbo-html]: Not found id in html - ' + html);
    }
    let id = m[1];
    if (!id) {
      throw new Error('[turbo-html]: Not found id in html - ' + html);
    }
    id = id.replace(/"/g, '').replace(/'/g, '').trim(); // remove quote
    if (!id) {
      throw new Error('[turbo-html]: Not found id in html - ' + html);
    }
    return id;
  }

  private _build_headers({ id, output_id, request_id }: { id: string, output_id: string | null, request_id: string }) {
    return {
      'X-I-Request': 'true',
      'X-I-Id': id,
      'X-I-Output-Id': output_id,
      'X-I-Request-Id': request_id,
    };
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
  },
  onElUpdated($el: HTMLElement) {
    animation.on_update($el);
  },
};
