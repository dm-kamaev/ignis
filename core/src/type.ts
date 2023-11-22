/* istanbul ignore file */
import type { Every, Exec, Keydown, Keyup, KeydownAlias, KeyupAlias, } from './customCmd';
import type { Once, Debounce, Changed } from './modificator';

export interface ICmd {
  name: string;
  method: string;
  url: string;
  mods: { once?: Once; debounce?: Debounce; changed?: Changed; };
  custom_ev?: Keyup | Keydown | Every | Exec;
  alias_ev?: KeydownAlias | KeyupAlias;
};

export interface ILifeHooks {
  onStartRequest($el: HTMLElement, cmd: ICmd): void | Promise<void>;
  onError(err: Error | any, $el: HTMLElement): void | Promise<void>;
  onEndRequest($el: HTMLElement, cmd: ICmd, err?: Error | any): void | Promise<void>;
  onLongRequest: { start($el: HTMLElement): void; end($el: HTMLElement): void; };
};

