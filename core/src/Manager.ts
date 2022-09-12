import { Axios } from 'axios';
import { I_life_hooks, T_cmd, I_class_form_data } from './interface';
import { Once, Debounce, Changed } from './modificator';

import Executor from './Executor';
import El from './El';
import enum_attr from './enum_attr';

import * as keycode from 'keycode';
import { Every, Keydown, Keyup, alias } from './custom_event';
import { createFakeEvent, logger } from './helper';

// document.getElementById('book_form')?.addEventListener('keyup', (event) => {
//   if (keycode.isEventKey(event, 'enter')) {
//     console.log(`${event.code} is pressed`); // Enter is pressed
//   }
// });
// document.addEventListener('keyup', (event) => {
//   if (keycode.isEventKey(event, 'enter')) {
//     console.log(`Global ${event.code} is pressed`); // Enter is pressed
//   }
// });

export default class Manager {
  private _list: El[] = [];

  static get_selector() {
    return '['+enum_attr.EV+']';
  }

  static extract_els(node: HTMLElement | Document = document): HTMLElement[] {
    return Array.from(node.querySelectorAll(Manager.get_selector()));
  }

  constructor(protected life_hooks: I_life_hooks, private axios: Axios, private _FormData: I_class_form_data) {}

  start(node: HTMLElement | Document) {
    const $els = Manager.extract_els(node);
    this.append($els);
    return this;
  }

  append($els: HTMLElement[]) {
    // we filter already appended nodes
    const news = $els.filter($el => !this._list.find(el => el.$el === $el));
    this._list = this._list.concat(
      news.map($el => this._subscribe($el))
    );
  }

  bindings_new_cmds($el: HTMLElement) {
    const found = this._list.find(el => el.$el === $el);
    if (!found) {
      return;
    }
    const cache = found.get_cmds();
    const cmds = this._parse_cmds($el);
    cmds.forEach(cmd => {
      if (!cache[cmd.name]) {
        found.assign_cmd(cmd);
        this._bind_cmd(found, cmd);
      }
    });
  }

  garbage_collector() {
    // console.log('[GC]: before', this._list.length);
    this._list = this._list.filter(el => {
      if (document.contains(el.$el)) {
        return true;
      }
      Object.keys(el.get_cmds()).forEach(name => el.revoke_cmd(name));
      return false;
    });
    // console.log('[GC]: after', this._list.length);
  }

  destroy() {
    this._list.forEach(el => {
      Object.keys(el.get_cmds()).forEach(name => el.revoke_cmd(name));
    });
    this._list = [];
  }

  /**
   * exec - call event on element
   * @param $el - HTMLElement
   * @param eventName - click, submit and etc.
   */
  exec($el: HTMLElement, eventName: string) {
    const el = this._list.find(el => el.$el === $el);
    if (!el) {
      throw new Error(`[turbo-html]: Not found element ${$el}`);
    }

    el.exec_cb(eventName, createFakeEvent(eventName, el.$el));
  }

  private _subscribe($el: HTMLElement) {
    const cmds = this._parse_cmds($el);
    const el = new El($el, cmds);
    cmds.forEach(cmd => this._bind_cmd(el, cmd));
    return el;
  }

  private _bind_cmd(el: El, { name, custom_ev, alias_ev }: T_cmd) {
    // console.log($el, { name, method, url, cb });
    const executor = new Executor(this.life_hooks, el, this.axios, this._FormData);
    const strategy = new Strategy_handle(el, name, executor, this._get_ev_by_name.bind(this));
    if (custom_ev) {
      strategy.custom_ev(custom_ev);
    } else if (alias_ev) {
      strategy.alias(alias_ev);
    } else {
      strategy.default();
    }
  }

  private _get_ev_by_name($el: HTMLElement, name: string) {
    return this._parse_cmds($el).find(el => el.name === name);
  }

  private _parse_cmds($el: HTMLElement) {
    const evs = $el.getAttribute('data-i-ev');
    if (!evs) {
      return [];
    }
    const cmds_str = evs.trim().replace(/,\s+/g, ',').split(/\s+/);
    return cmds_str.map(el => this._parse_cmd(el));
  }

  private _parse_cmd(cmd: string) {
    const [ name, method_url, modificators ] = cmd.split('->');
    const default_val = { method: '', url: '', mods: { once: undefined, debounce: undefined, changed: undefined }};
    if (alias.Keydown.is(name)) {
      return { name, ...default_val, alias_ev: new alias.Keydown(name) }
    } else if (alias.Keyup.is(name)) {
      return { name, ...default_val, alias_ev: new alias.Keyup(name) }
    } else {
      if (!method_url) {
        throw new Error(`[turbo-html]: Incorrect address: "${method_url}" in cmd "${cmd}"`);
      }
      const m = method_url.match(/(\w+):(.+)/);
      if (!m) {
        throw new Error(`[turbo-html]: Incorrect address: "${method_url}" in cmd "${cmd}"`);
      }
      if (!m[1]) {
        throw new Error(`[turbo-html]: Incorrect method in address: "${method_url}" in cmd "${cmd}"`);
      }
      if (!m[2]) {
        throw new Error(`[turbo-html]: Incorrect url in address: "${method_url}" in cmd "${cmd}"`);
      }
      let method: string = m[1].trim();
      let url: string = m[2].trim();
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
          throw new Error('[turbo-html]: Unknown modificator '+el+', command = '+cmd);
        }
      });
      return { name, method, url, mods, custom_ev: Keyup.is(name) ? new Keyup(name) : Keydown.is(name) ? new Keydown(name) : Every.is(name) ? new Every(name) : undefined  };
    }
  }

}


class Strategy_handle {
  constructor(private el: El, private name: string, private executor: Executor, private _get_ev_by_name: Manager['_get_ev_by_name']) {}

  custom_ev(custom_ev: T_cmd['custom_ev']) {
    const { el, name, executor } = this;
    const $el = el.$el;
    if (custom_ev instanceof Every) {
      const every = custom_ev;
      const delay = every.get_delay_as_ms();

      const idle = setInterval(() => {
        const cmd = this._get_ev_by_name($el, name);
        // if was removed from DOM then remove element
        if (!document.contains($el)) {
          return el.revoke_cmd(name);
        }
        // if command was removed  from element then revoke command and abort polling
        if (!cmd) {
          return el.revoke_cmd(name);
        }
        executor.run_as_every(cmd, { spinner: false });
      }, delay);
      el.set_idle_for_every(idle);

      el.set_unsubscribe(name, () => {
        el.abort_every();
      });
    } else if (custom_ev instanceof Keydown || custom_ev instanceof Keyup) {
      const key_ev = custom_ev;
      const cb = (e: Event) => {
        if (!keycode.isEventKey(e, key_ev.shortcut)) {
          return;
        }
        const cmd = this._get_ev_by_name($el, name);
        if (!cmd) {
          return el.revoke_cmd(name);
        }

        const spinner = !Boolean($el.hasAttribute(enum_attr.SPINNER_OFF));
        const exec = () => { executor.run_as_el(e, cmd, { spinner }) };

        const mods = cmd.mods;
        if (mods.changed) {
          if (el.is_not_changed($el, mods.changed)) {
            return;
          }
        }

        if (mods.debounce) {
          el.set_debounce_cb(exec, mods.debounce);
        } else {
          exec();
        }
      };

      let cb2: (e: Event) => void;
      // We resolve problem with submit form twice (browser fire form submit on "keydown" and "keyup" for "enter", by default)
      // https://localcoder.org/form-submitted-twice-using-submit-on-keyup
      // We prevent this behaviour
      if (key_ev.shortcut === 'enter' && key_ev.name === 'keyup') {
        cb2 = (e: Event) => {
          if (keycode.isEventKey(e, key_ev.shortcut)) {
            e.preventDefault();
            return false;
          }
        };
        $el.addEventListener('keydown', cb2);
      }

      el.set_unsubscribe(name, () => {
        $el.removeEventListener(key_ev.name, cb);
        if (cb2) {
          $el.removeEventListener('keydown', cb2);
        }
      });

      el.set_cb(key_ev.name, cb);

      $el.addEventListener(key_ev.name, cb, { once: this._get_once($el, name) });
    }
  }

  alias(key_ev: NonNullable<T_cmd['alias_ev']>) {
    const { el, name, executor } = this;
    const $el = el.$el;
    const cb = (e: Event) => {
      if (!keycode.isEventKey(e, key_ev.shortcut)) {
        return;
      }
      e.preventDefault(); // disable for origin element
      const cmd_alias = this._get_ev_by_name($el, name);
      // if alias command was removed from element then revoke command
      if (!cmd_alias) {
        return el.revoke_cmd(name);
      }
      logger(`${(e as KeyboardEvent).code} is pressed`);
      const cmd = this._get_ev_by_name($el, key_ev.target_ev);
      // if target command was removed from element then revoke command
      if (!cmd) {
        return el.revoke_cmd(name);
      }
      const spinner = !Boolean($el.hasAttribute('data-i-spinner-off'));
      const fake_event = createFakeEvent(key_ev.target_ev, $el);

      // e.stopPropagation(); // disable for origin element
      if (key_ev.target_ev === 'submit') {
        executor.run_as_form(fake_event, cmd, { spinner });
      } else {
        executor.run_as_el(fake_event, cmd, { spinner });
      }
    };
    let cb2: (e: Event) => void;
    // We resolve problem with submit form twice (browser fire form submit on "keydown" and "keyup" for "enter", by default)
    // https://localcoder.org/form-submitted-twice-using-submit-on-keyup
    // We prevent this behaviour
    if (key_ev.shortcut === 'enter' && key_ev.name === 'keyup') {
      cb2 = (e: Event) => {
        if (keycode.isEventKey(e, key_ev.shortcut)) {
          e.preventDefault();
          return false;
        }
      };
      $el.addEventListener('keydown', cb2);
    }

    el.set_unsubscribe(name, () => {
      $el.removeEventListener(key_ev.name, cb);
      if (cb2) {
        $el.removeEventListener('keydown', cb2);
      }
    });

    el.set_cb(key_ev.name, cb);

    $el.addEventListener(key_ev.name, cb);
  }

  default() {
    const { el, name, executor } = this;
    const $el = el.$el;
    const cb = (e: Event) => {
      const cmd = this._get_ev_by_name($el, name);
      if (!cmd) {
        return el.revoke_cmd(name);
      }

      let exec: () => void;
      const spinner = !Boolean($el.hasAttribute('data-i-spinner-off'));
      if (name === 'submit') {
        exec = () => executor.run_as_form(e, cmd, { spinner });
      } else {
        exec = () => executor.run_as_el(e, cmd, { spinner });
      }

      const mods = cmd.mods;
      if (mods.changed) {
        if (el.is_not_changed($el, mods.changed)) {
          return;
        }
      }

      if (mods.debounce) {
        el.set_debounce_cb(exec, mods.debounce);
      } else {
        exec();
      }

    };

    el.set_unsubscribe(name, () => $el.removeEventListener(name, cb));
    el.set_cb(name, cb);

    $el.addEventListener(name, cb, { once: this._get_once($el, name) });
  }

  private _get_once($el: HTMLElement, name: string) {
    return this._get_ev_by_name($el, name)?.mods.once ? true : false
  }
}


