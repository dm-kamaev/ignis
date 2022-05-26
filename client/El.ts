import { Debounce, Changed } from './modificator';
import { T_cmd } from './interface';
import { get_uid } from './helper';

export default class El {
  private _idle_for_debounce: NodeJS.Timeout | null = null;
  private _old_val: any = null;
  private _idle_for_every: NodeJS.Timeout | null = null;
  private _request_id: string;
  private _cmds: Record<string, T_cmd & { unsubscribe?: () => void }> = {};
  constructor(public $el: HTMLElement, cmds: T_cmd[]) {
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

  set_idle_for_every(idle: NodeJS.Timeout) {
    this._idle_for_every = idle;
  }

  abort_every() {
    if (this._idle_for_every) {
      clearInterval(this._idle_for_every);
      console.log('ABort!');
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

  assign_cmd(cmd: T_cmd) {
    this._cmds[cmd.name] = cmd;
  }

  set_unsubscribe(name: string, unsubscribe: () => void) {
    this._cmds[name].unsubscribe = unsubscribe;
  }

  get_cmds() {
    return this._cmds;
  }

  revoke_cmd(name: string) {
    console.log('[revoke cmd]: before', Object.keys(this._cmds).length);
    this._cmds[name]?.unsubscribe?.();
    if (name === '@every') {
      this.abort_every();
    }
    const names = Object.keys(this._cmds).filter(n => n !== name);
    const filtered: El['_cmds'] = {};
    names.forEach(name => filtered[name] = this._cmds[name]);
    this._cmds = filtered;
    // this.cmds = this.cmds.filter(el => el.name !== name);
    console.log('[revoke cmd]: after', Object.keys(this._cmds).length);
  }

}
