import { ICmd } from './type';
import type Manager from './Manager';
import type Executor from './Executor';
import type { KeydownAlias, KeyupAlias } from './customCmd';
import type El from './El';

import enumAttr from './enumAttr';

import * as keycode from 'keycode';
import { Every, Exec, Keydown, Keyup } from './customCmd';
import { createFakeEvent, logger } from './helperForBrowser';


export default class StrategyHandle {
  constructor(private readonly _el: El, private readonly _name: string, private readonly _executor: Executor, private readonly _get_ev_by_name: Manager['_get_ev_by_name']) {}

  custom_ev(custom_ev: ICmd['custom_ev']) {
    const { _el: el, _name: name, _executor: executor } = this;
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
        // if command was removed from element then revoke command and abort polling
        if (!cmd) {
          return el.revoke_cmd(name);
        }
        executor.runAsEvery(cmd, { spinner: false });
      }, delay);
      el.set_idle_for_every(idle);

      el.set_unsubscribe(name, () => {
        el.abort_every();
      });
    } else if (custom_ev instanceof Exec) {
      const exec = custom_ev;
      const delay = exec.get_delay_as_ms();

      const cb = () => {
        const cmd = this._get_ev_by_name($el, name);
        // if was removed from DOM then remove element
        if (!document.contains($el)) {
          return el.revoke_cmd(name);
        }
        // if command was removed from element then revoke command and abort polling
        if (!cmd) {
          return el.revoke_cmd(name);
        }
        const spinner = !Boolean($el.hasAttribute(enumAttr['spinner-off']));
        executor.runAsExec(cmd, { spinner });
        el.revoke_cmd(name);
      };

      if (delay) {
        setTimeout(cb, delay);
      } else {
        cb();
      }
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

        const spinner = !Boolean($el.hasAttribute(enumAttr['spinner-off']));
        const exec = () => { executor.runAsEl(e, cmd, { spinner }) };

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

  alias(key_ev: KeydownAlias | KeyupAlias) {
    const { _el: el, _name: name, _executor: executor } = this;
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
        executor.runAsForm(fake_event, cmd, { spinner });
      } else {
        executor.runAsEl(fake_event, cmd, { spinner });
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
    const { _el: el, _name: name, _executor: executor } = this;
    const $el = el.$el;
    const cb = (e: Event) => {
      const cmd = this._get_ev_by_name($el, name);
      if (!cmd) {
        return el.revoke_cmd(name);
      }

      let exec: () => void;
      const spinner = !Boolean($el.hasAttribute('data-i-spinner-off'));
      if (name === 'submit') {
        exec = () => executor.runAsForm(e, cmd, { spinner });
      } else {
        exec = () => executor.runAsEl(e, cmd, { spinner });
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


