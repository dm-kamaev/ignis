import { Debounce, Changed } from './modificator';
import { T_cmd } from './interface';
import { get_uid } from './helper';

export default class El {
  private _idle_for_debounce: NodeJS.Timeout | null = null;
  private _old_val: any = null;
  private _idle_for_every: NodeJS.Timeout | null = null;
  private _request_id: string;
  constructor(public $el: HTMLElement, public cmds: T_cmd[]) {
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

  revoke_cmd(name: string) {
    this.cmds = this.cmds.filter(el => el.name !== name);
  }
}
