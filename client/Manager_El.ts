import {Axios} from 'axios';
import FormToJSON from 'forms_to_json';
import Manager from './Manager';
import Manager_Long_Request from './Manager_Long_Request';
import { I_life_hooks } from './I_life_hooks';


export default class Manager_El extends Manager {
  private axios: Axios;

  static get_selector() {
    return '[data-i-ev]';
  }

  static get_els(node: HTMLElement | Document = document): HTMLElement[] {
    return Array.from(node.querySelectorAll(Manager_El.get_selector()));
  }

  constructor(life_hooks: I_life_hooks, axios: Axios) {
    super(life_hooks);
    this.axios = axios;
  }

  start() {
    const $els = Manager_El.get_els();
    this.append($els);
    return this;
  }


  _cb_form(e: Event, $el: HTMLElement, cmd: { method: string; url: string }) {
    e.preventDefault();

    const axios = this.axios;

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

    const $form: HTMLFormElement = this.get_target(e);
    let req;
    const method_name = method.toLowerCase();
    const headers = {
      'X-Ignis-Html-Request': 'true',
      'X-Ignis-Html-Id': id,
      'X-Ignis-Output-Id': output_id,
    };
    if (method === 'GET' || method === 'DELETE') {
      // TODO: encode query params
      const json = new FormToJSON($form).parse();
      console.log(json, method, url);
      url = this.form_add_to_url(url, json);
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

    const manager_long_request = new Manager_Long_Request(this.life_hooks.longRequest).start();

    req.then(this.handle_response.bind(this)).catch(this.handler_error.bind(this)).finally(manager_long_request.end.bind(manager_long_request));
  }

  _cb_el(e: Event, $el: HTMLElement, cmd: { method: string; url: string }) {
    e.preventDefault();

    const axios = this.axios;

    const id = $el.id;
    const output_id = $el.getAttribute('data-i-output-id');

    const method = cmd.method;
    let url = cmd.url;


    if (!['GET', 'POST', 'PUT','DELETE'].includes(method)) {
      throw new Error('Not valid method ' + method);
    }

    const method_name = method.toLowerCase();
    const headers = {
      'X-Ignis-Html-Request': 'true',
      'X-Ignis-Html-Id': id,
      'X-Ignis-Output-Id': output_id,
    };

    let req;
    const str_data = $el.getAttribute('data-i-data');
    const json = str_data ? JSON.parse(str_data) : {};
    if (method === 'GET' || method === 'DELETE') {
      console.log(json, method, url);
      url = this.form_add_to_url(url, json);
      req = axios[method_name](url, { headers });
    } else if (method === 'POST' || method === 'PUT') {
      req = axios[method_name](url, json, { headers });
    }

    const manager_long_request = new Manager_Long_Request(this.life_hooks.longRequest).start();

    req.then(this.handle_response.bind(this)).catch(this.handler_error.bind(this)).finally(manager_long_request.end.bind(manager_long_request));
  }


}

