/* istanbul ignore file */
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

interface I_instance_form_data {
  append(name: string, value: string | Blob, fileName?: string): void;
  delete(name: string): void;
  get(name: string): FormDataEntryValue | null;
  getAll(name: string): FormDataEntryValue[];
  has(name: string): boolean;
  set(name: string, value: string | Blob, fileName?: string): void;
  forEach(callbackfn: (value: FormDataEntryValue, key: string, parent: FormData) => void, thisArg?: any): void;
}

export interface I_class_form_data {
  prototype: I_instance_form_data;
  new(form?: HTMLFormElement): I_instance_form_data;
};
