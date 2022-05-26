import { Every, Keydown, Keyup, alias } from './custom_event';

export interface I_life_hooks {
  onError(err: Error | any): void;
  longRequest: { start($el: HTMLElement): void; stop($el: HTMLElement): void; };
};

export type T_cmd = {
  name: string;
  method: string;
  url: string;
  custom_ev?: Keydown | Keyup | Every;
  alias_ev?: InstanceType<typeof alias.Keydown> | InstanceType<typeof alias.Keyup>;
};
