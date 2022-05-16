import { Axios } from 'axios';
import { I_life_hooks, T_cmd } from './interface';
import { Once, Debounce, Changed } from './modificator';

import Executor from './Executor';
import El from './El';
import enum_attr from './enum_attr';



export default class Manager {
  protected list: El[] = [];

  static get_selector() {
    return '['+enum_attr.EV+']';
  }

  static get_els(node: HTMLElement | Document = document): HTMLElement[] {
    return Array.from(node.querySelectorAll(Manager.get_selector()));
  }

  constructor(protected life_hooks: I_life_hooks, private axios: Axios) {}

  start() {
    const $els = Manager.get_els();
    this.append($els);
    return this;
  }

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
        this._bind_cmd(found, cmd);
        new_cmds.push(cmd);
      }
    });
    found.cmds = found.cmds.concat(new_cmds);
  }


  private _subscribe($el: HTMLElement) {
    const cmds = this.parse_cmds($el);
    const el = new El($el, cmds);
    cmds.forEach(cmd => this._bind_cmd(el, cmd));
    return el;
  }

  private _bind_cmd(el: El, { name }: T_cmd) {
    const $el = el.$el;
    // console.log($el, { name, method, url, cb });
    const executor = new Executor(this.life_hooks, el, this.axios);

    if (Every.is(name)) {
      const every = new Every(name);
      const exec = () => {
        const idle = setInterval(() => {
          const cmd = this.parse_cmds($el).find(el => el.name === name);
          // if was removed from DOM then remove element
          if (!document.contains($el)) {
            el.abort_every();
            this.list = this.list.filter(el => el.$el === $el);
            return;
          }
          // if command was removed  from element then revoke command and abort polling
          if (!cmd) {
            el.revoke_cmd(name);
            el.abort_every();
            return;
          }
          executor.run_as_every(cmd, { spinner: false });
        }, every.get_delay_as_ms());
        el.set_idle_for_every(idle);
      };
      return exec();
    }

    const cb = (e: Event) => {
      const cmd = this.parse_cmds($el).find(el => el.name === name);
      if (!cmd) {
        el.revoke_cmd(name);
        return $el.removeEventListener(name, cb);
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
    const once = this.parse_cmds($el).find(el => el.name === name)?.mods.once ? true : false;
    $el.addEventListener(name, cb, { once });
  }


  protected parse_cmds($el: HTMLElement) {
    const evs = $el.getAttribute('data-i-ev');
    if (!evs) {
      return [];
    }
    const cmds_str = evs.trim().split(/\s+/);
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


}


class Every {
  private readonly _delay: number;
  static is(el: string) {
    return /^@every\(\d+(ms|s|m)\)$/.test(el);
  }

  constructor(el: string) {
    const m = el.match(/^@every\((\d+)(ms|s|m)\)$/);
    if (!m) {
      throw new Error('Invalid event: ' + el);
    }
    const number = parseInt(m[1].trim(), 10);
    const measure = m[2].trim() as 'ms' | 's' | 'm';
    switch (measure) {
      case 'ms':
        this._delay = number;
        break;
      case 's':
        this._delay = number * 1000;
        break;
      case 'm':
        this._delay = number * 1000 * 60;
        break;
      default:
        throw new Error('Invalid measure: ' + el);
    }
  }

  get_delay_as_ms(): number {
    return this._delay;
  }
}