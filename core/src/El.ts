import { Debounce, Changed } from './modificator';
import { ICmd } from './type';
import { get_uid, logger } from './helperForBrowser';

interface ICb { (e: Event): void }

export default class El {
  private _hash_cb: Record<string, ICb> = {};
  private _idle_for_debounce: number | null = null;
  private _old_val: any = null;
  private _idle_for_every: NodeJS.Timeout | null = null;
  private _request_id: string;
  private _cmds: Record<string, ICmd & { unsubscribe?: () => void }> = {};

  constructor(public $el: HTMLElement, cmds: ICmd[]) {
    cmds.forEach(el => {
      this._cmds[el.name] = el;
    });
  }

  set_debounce_cb(cb: (...any) => any, mod_debounce: InstanceType<typeof Debounce>) {
    if (this._idle_for_debounce) {
      clearTimeout(this._idle_for_debounce);
    }
    this._idle_for_debounce = setTimeout(cb, mod_debounce.get_delay_as_ms());
  }

  set_cb(event_name: string, cb: ICb) {
    this._hash_cb[event_name] = cb;
  }

  exec_cb(event_name: string, event: Event) {
    const cb = this._hash_cb[event_name];
    if (!cb) {
      throw new Error(`[turbo-html]: Not found event with "${event_name}"`);
    }
    cb(event);
  }

  set_idle_for_every(idle: NodeJS.Timeout) {
    this._idle_for_every = idle;
  }

  abort_every() {
    if (this._idle_for_every) {
      clearInterval(this._idle_for_every);
      logger('ABort!');
    }
  }

  set_request_id() {
    return this._request_id = get_uid();
  }

  get_request_id() {
    return this._request_id;
  }

  is_not_changed($el: HTMLElement, mod_changed: InstanceType<typeof Changed>) {
    const current = `${mod_changed.prop}` in $el ? $el[mod_changed.prop] : $el.getAttribute(mod_changed.prop);
    const result = current === this._old_val;
    if (!result) {
      this._old_val = current;
    }
    return result;
  }

  assign_cmd(cmd: ICmd) {
    this._cmds[cmd.name] = cmd;
  }

  set_unsubscribe(name: string, unsubscribe: () => void) {
    this._cmds[name].unsubscribe = unsubscribe;
  }

  get_cmds() {
    return this._cmds;
  }

  revoke_cmd(name: string) {
    // console.log('[revoke cmd]: before', Object.keys(this._cmds).length);
    this._cmds[name]?.unsubscribe?.();
    if (name.startsWith('@every')) {
      this.abort_every();
    }
    this._cmds = omit(this._cmds, name);
    this._hash_cb = omit(this._hash_cb, name);
  }

}

function omit<T extends {}, K extends keyof T>(obj: T, key: K): T {
  const result = {} as T;
  Object.keys(obj).filter(k => k !== key).forEach(key => result[key] = obj[key]);
  return result;
}
