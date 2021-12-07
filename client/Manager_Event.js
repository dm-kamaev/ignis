import Manager from './Manager';
import Manager_Long_Request from './Manager_Long_Request';


export default class Manager_Event extends Manager {

  static get_selector() {
    return '[data-ignis-event]';
  }


  static get_els(node = document){
    return Array.from(node.querySelectorAll(Manager_Event.get_selector()));
  }

  constructor(life_hooks, axios, $els = Manager_Event.get_els()) {
    super($els, life_hooks);
    this.axios = axios;
  }

  start() {
    this._list = this.$els.map($el => this._add_listener($el));
    return this;
  }

  _add_listener($el) {
    const unsubscribe = this._subscribe($el);

    return new El($el, unsubscribe);
  }

  _cb(e, $el) {
    e.preventDefault();

    const axios = this.axios;

    const id = $el.id;
    const output_id = $el.getAttribute('data-ignis-output-id');

    let [_, method, url ] = $el.getAttribute('data-ignis-event').split('->');

    if (!['GET', 'POST', 'PUT','DELETE'].includes(method)) {
      throw new Error('Not valid method ' + method);
    }
    console.log(method, url, output_id);

    url = this.add_special_params(url, { id, output_id });
    let req;
    const str_data = $el.getAttribute('data-ignis-data');
    const json = str_data ? JSON.parse(str_data) : {};
    if (method === 'GET' || method === 'DELETE') {
      console.log(json, method, url);
      url = this.form_add_to_url(url, json);
      req = axios[method.toLowerCase()](url);
    } else if (method === 'POST' || method === 'PUT') {
      req = axios[method.toLowerCase()](url, json);
    }

    const manager_long_request = new Manager_Long_Request(this.life_hooks.longRequest).start();

    req.then(this.handle_response.bind(this)).catch(this.handler_error.bind(this)).finally(manager_long_request.end.bind(manager_long_request));;
  }

  _subscribe($el) {
    const cb = (e) => {
      this._cb(e, $el);
    };

    const event_name = $el.getAttribute('data-ignis-event').split('->')[0];
    $el.addEventListener(event_name, cb);
  }

}


class El {
  constructor($el, unsubscribe) {
    this.el = $el;
    this._unsubscribe = unsubscribe;
  }

  unsubscribe() {
    this._unsubscribe();
  }

}
