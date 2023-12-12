import { Axios } from 'axios';
import { ILifeHooks, ITurboHtmlOptions, ICmd } from './type';
import { Once, Debounce, Changed } from './modificator';

import Executor from './Executor';
import El from './El';
import enumAttr from './enumAttr';

import { Every, Exec, Keydown, Keyup, KeydownAlias, KeyupAlias, } from './customCmd';
import { createFakeEvent } from './helperForBrowser';
import StrategyHandle from './StrategyHandle';

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
    return '['+enumAttr.EV+']';
  }

  static extract_els(node: HTMLElement | Document = document): HTMLElement[] {
    return Array.from(node.querySelectorAll(Manager.get_selector()));
  }

  constructor(
    protected readonly lifeHooks: ILifeHooks,
    private readonly _globalHeaders: ITurboHtmlOptions['headers'],
    private readonly axios: Axios
  ) {}

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

  private _bind_cmd(el: El, { name, custom_ev, alias_ev }: ICmd) {
    // console.log($el, { name, method, url, cb });
    const executor = new Executor(this.lifeHooks, this._globalHeaders, el, this.axios);
    const strategy = new StrategyHandle(el, name, executor, this._get_ev_by_name.bind(this));
    if (custom_ev) {
      strategy.custom_ev(custom_ev);
    } else if (alias_ev instanceof KeyupAlias || alias_ev instanceof KeydownAlias) {
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

  private _parse_cmd(cmd: string): ICmd {
    const [ name, method_url, modificators ] = cmd.split('->');
    const default_val = { method: '', url: '', mods: { once: undefined, debounce: undefined, changed: undefined }};
    // @keydown(enter, submit)
    if (KeydownAlias.is(name)) {
      return { name, ...default_val, alias_ev: new KeydownAlias(name) };
    // @keyup(enter, submit)
    } else if (KeyupAlias.is(name)) {
      return { name, ...default_val, alias_ev: new KeyupAlias(name) };

    // click->POST:/api/book/revoke
    // mouseover->GET:http://127.0.0.1:9002/api/book/metrica/2?utm_source=web
    // mouseover->GET:http://127.0.0.1:9002/api/book/metrica/2->debounce(1s),once
    // keyup->GET:http://127.0.0.1:9002/api/book/metrica/2->debounce(2s),changed(value)

    // @keyup(enter)->POST:/api/book/revoke
    // @keydown(enter)->POST:/api/book/revoke

    // @every(3s)->GET:http://127.0.0.1:9002/api/book/poll

    // @exec(1m)->GET:http://127.0.0.1:9002/api/book/poll
    // @exec()->GET:http://127.0.0.1:9002/api/book/poll
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
      const method = m[1].trim();
      const url = m[2].trim();
      const list_mod = (modificators || '').trim().split(',').map(el => el.trim()).filter(Boolean);
      const mods: {
        once?: Once;
        debounce?: Debounce;
        changed?: Changed;
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

      const cmdObj: {
        name: string;
        method: string;
        url: string;
        mods: {
            once?: Once | undefined;
            debounce?: Debounce | undefined;
            changed?: Changed | undefined;
        };
        custom_ev?: Keyup | Keydown | Every | Exec | undefined;
      } = { name, method, url, mods, custom_ev: undefined };
      if (Keyup.is(name)) {
        cmdObj.custom_ev = new Keyup(name);
      } else if (Keydown.is(name)) {
        cmdObj.custom_ev = new Keydown(name);
      } else if (Every.is(name)) {
        cmdObj.custom_ev = new Every(name);
      } else if (Exec.is(name)) {
        cmdObj.custom_ev = new Exec(name);
      }
      return cmdObj;
    }
  }

}



