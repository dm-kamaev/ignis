import FormToJSON from 'forms_to_json';
import Manager from './Manager';
import Manager_Long_Request from './Manager_Long_Request';


export default class Manager_Form extends Manager {

  static get_selector() {
    return '[data-ignis-form]';
  }

  static get_els(node = document) {
    return Array.from(node.querySelectorAll(Manager_Form.get_selector()));
  }

  constructor(life_hooks, axios, $els = Manager_Form.get_els()) {
    super($els, life_hooks);
    this.axios = axios;
  }

  start() {
    this._list = this.$els.map($el => this._add_listener($el));
    return this;
  }

  _add_listener($el) {
    this._subscribe($el);

    return new El_form($el);
  }

  _cb(e, $el) {
    e.preventDefault();

    const axios = this.axios;

    const id = $el.id;
    const output_id = $el.getAttribute('data-ignis-output-id');
    let [ method, url ] = $el.getAttribute('data-ignis-form').split('->');
    const enctype = $el.getAttribute('data-ignis-enctype')?.trim();
    method = method.trim();

    if (!output_id) {
      throw new Error('Not found id = ' + output_id);
    }

    if (!['GET', 'DELETE', 'POST', 'PUT'].includes(method)) {
      throw new Error('Not valid method ' + method);
    }

    const $form = this.get_target(e);
    let req;
    url = this.add_special_params(url, { id, output_id });
    if (method === 'GET' || method === 'DELETE') {
      // TODO: encode query params
      const json = new FormToJSON($form).parse();
      console.log(json, method, url);
      url = this.form_add_to_url(url, json);
      req = axios[method.toLowerCase()](url);
    } else { // POST, PUT
      if (enctype === 'multipart/form-data') {
        const formdata = new FormData($form);
        console.log(formdata, method, url, output_id);
        req = axios[method.toLowerCase()](url, formdata);
      } else {
        const json = new FormToJSON($form).parse();
        console.log(json, method, url, output_id);
        req = axios[method.toLowerCase()](url, json);
      }
    }

    const manager_long_request = new Manager_Long_Request(this.life_hooks.longRequest).start();

    req.then(this.handle_response.bind(this)).catch(this.handler_error.bind(this)).finally(manager_long_request.end.bind(manager_long_request));
  }


  _subscribe($el) {
    const cb = (e) => {
      this._cb(e, $el);
    };

    // const unsubscribe = () => {
    //   this._list = this._list.filter(el => $el !== el);
    //   $el.removeEventListener('submit', cb);
    // };
    $el.addEventListener('submit', cb);

    return;
  }

}


class El_form {
  constructor($el) {
    this.el = $el;
  }
}

