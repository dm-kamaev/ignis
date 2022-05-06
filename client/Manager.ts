import { AxiosResponse } from 'axios';
import morphdom from 'morphdom';
import { I_life_hooks } from './I_life_hooks';
import { Once, Debounce, Changed } from './modificator';
import { getById, addCss } from './helper';

type T_cmd = {
  name: string;
  method: string;
  url: string;
};

export default class Manager {
  protected list: El[] = [];

  constructor(protected life_hooks: I_life_hooks) {}

  append($els: HTMLElement[]) {
    // console.log($els, '|', this.list);
    this.list = this.list.concat(
      $els.map($el => this._subscribe($el))
    );
  }

  bindings_new_cmds($el: HTMLElement) {
    const found = this.list.find(el => el.$el === $el);
    if (!found) {
      return;
    }
    const cache = found.cmds;
    const cmds = this.parse_cmds($el);
    const new_cmds: T_cmd[] = [];
    cmds.forEach(cmd => {
      if (!cache.find(el => el.name === cmd.name)) {
        this._bind_cmd($el, cmd);
        new_cmds.push(cmd);
      }
    });
    found.cmds = found.cmds.concat(new_cmds);
  }


  private _subscribe($el: HTMLElement) {
    const cmds = this.parse_cmds($el);
    cmds.forEach(cmd => this._bind_cmd($el, cmd));
    return new El($el, cmds);
  }

  private _bind_cmd($el: HTMLElement, { name }: T_cmd) {
    // console.log($el, { name, method, url, cb });
    const cb = (e: Event) => {
      const cmd = this.parse_cmds($el).find(el => el.name === name);
      if (!cmd) {
        const found = this.list.find(el => el.$el === $el);
        if (found) {
          found.cmds = found.cmds.filter(el => el.name !== name);
        }
        return $el.removeEventListener(name, cb);
      }

      let exec: () => void;
      if (name === 'submit') {
        exec = () => this._cb_form(e, $el, cmd);
      } else {
        exec = () => this._cb_el(e, $el, cmd);
      }

      if (cmd.mods.changed) {
        const el = this.list.find(el => el.$el === $el);
        if (el) {
          console.log('CHANGED', exec, cmd.mods.changed);
          if (el.is_not_changed($el, cmd.mods.changed)) {
            console.log('RETURN');
            return;
          }
        }
      }

      if (cmd.mods.debounce) {
        const el = this.list.find(el => el.$el === $el);
        if (el) {
          // console.log('SET', exec, cmd.mods.debounce);
          el.set_debounce_cb(exec, cmd.mods.debounce);
        }
      } else {
        exec();
      }

    };
    const once = this.parse_cmds($el).find(el => el.name === name)?.mods.once ? true : false;
    $el.addEventListener(name, cb, { once });
  }

  protected _cb_form(e: Event, $el: HTMLElement, cmd?: { method: string; url: string }) {

  }

  protected _cb_el(e: Event, $el: HTMLElement, cmd?: { method: string; url: string }) {

  }

  protected parse_cmds($el: HTMLElement) {
    const cmds_str = ($el.getAttribute('data-i-ev') as string).trim().split(/\s+/);
    return cmds_str.map(el => this.parse_cmd(el));
  }

  protected parse_cmd(cmd: string) {
    const [ name, method_url, modificators] = cmd.split('->');
    const m = method_url.match(/(\w+):(.+)/) as any;
    let method: string = m[1].trim();
    let url: string = m[2];
    const list_mod = (modificators || '').trim().split(',').map(el => el.trim()).filter(Boolean);
    const mods: {
      once?: InstanceType<typeof Once>;
      debounce?: InstanceType<typeof Debounce>;
      changed?: InstanceType<typeof Changed>;
    } = {};
    list_mod.forEach(el => {
      if (Once.is(el)) {
        mods.once = new Once(el);
      } else if (Debounce.is(el)) {
        mods.debounce = new Debounce(el);
      } else if (Changed.is(el)) {
        mods.changed = new Changed(el);
      } else {
        throw new Error('Unknown modificator '+el+', command = '+cmd);
      }
    });
    return { name, method, url, mods };
  }

  protected get_target(e) { return e && e.target || e.srcElement; }

  protected form_add_to_url(url: string, data) {
    const url_obj = this._create_url_obj(url);
    Object.keys(data).forEach(k => {
      url_obj.searchParams.append(k, data[k]);
    });
    return url_obj.href;
  }

  private _exec({ ev, data }, url) {
    if (ev === 'update') {
      const { html, css } = data;
      const id = this._extract_id(html);
      console.log({ id, html });
      this._apply_css(css, url);
      this._render(id, html);
    } else if (ev === 'remove') {
      getById(data.id).outerHTML = '';
    } else if (ev === 'append_to_top') {
      const { id, html, css } = data;
      this._apply_css(css, url);
      getById(id).insertAdjacentHTML('afterbegin', html);
    } else if (ev === 'append_to_end') {
      const { id, html, css } = data;
      this._apply_css(css, url);
      getById(id).insertAdjacentHTML('beforeend', html);
    } else {
      throw new Error('Invalid command ' + JSON.stringify({ ev, data }));
    }
  }

  handle_response(resp: AxiosResponse) {
    const { config, headers, data } = resp;
    const url_obj = new URL(config.url as string);
    const url = url_obj.origin + url_obj.pathname;

    if (data instanceof Array) {
      data.forEach(cmd => this._exec(cmd, url));
    } else if (data) {
      this._exec({ ev: 'update', data: { html: data, css: null } }, url);
    } else if (headers['x-ignis-redirect-to']) {
      window.location.href = headers['x-ignis-redirect-to'];
    }

    // We store requested url for avoid repeat adding css
    // this._hash_requested_url[url] = true;
  }

  handler_error(err) {
    this.life_hooks.onError(err);
  }

  private _render(id: string, html: string) {
    morphdom(getById(id), html, get_options() as any);
  }

  private _is_absolute_url(url: string) {
    return new RegExp('^(https?:)?//').test(url);
  }

  private _create_url_obj(url: string) {
    return this._is_absolute_url(url) ? new URL(url) : new URL(url, document.baseURI);
  }

  private _apply_css(css: string, _url: string) {
    // if (css && !this._hash_requested_url[url]) {
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

}

const ATTR_USE_PREV_VALUE = 'data-i-preserve';

const get_options = () => {
  return {
    onBeforeElUpdated: function (fromEl, toEl) {
      if (toEl.tagName === 'INPUT') {
        const use_prev_value = toEl.hasAttribute(ATTR_USE_PREV_VALUE);
        if ((toEl.type === 'checkbox' || toEl.type === 'radio') && use_prev_value) {
          toEl.checked = fromEl.checked;
        } else if (toEl.type === 'file' && use_prev_value) {
          toEl.files = fromEl.files;
        } else if (use_prev_value) {
          toEl.value = fromEl.value;
        }
      } else if (toEl.tagName === 'SELECT' && toEl.hasAttribute(ATTR_USE_PREV_VALUE)) {
        toEl.value = fromEl.value;
      }
    }
  };
};

class El {
  private _idTime: NodeJS.Timeout | null = null;
  private _old_val: any = null;
  constructor(public $el: HTMLElement, public cmds: T_cmd[]) {

  }

  set_debounce_cb(cb: (...any) => any, mod_debounce: InstanceType<typeof Debounce>) {
    if (this._idTime) {
      clearTimeout(this._idTime);
    }
    this._idTime = setTimeout(cb, mod_debounce.get_delay_as_ms());
  }

  is_not_changed($el: HTMLElement, mod_changed: InstanceType<typeof Changed>) {
    const current = `${mod_changed.prop}` in $el ? $el[mod_changed.prop] : $el.getAttribute(mod_changed.prop);
    console.log({ current, _old_val: this._old_val });
    const result = current === this._old_val;
    if (!result) {
      this._old_val = current;
    }
    return result;
  }
}

