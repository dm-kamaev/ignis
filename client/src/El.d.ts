/// <reference types="node" />
import { Debounce, Changed } from './modificator';
import { ICmd } from './type';
interface ICb {
    (e: Event): void;
}
export default class El {
    $el: HTMLElement;
    private _hash_cb;
    private _idle_for_debounce;
    private _old_val;
    private _idle_for_every;
    private _request_id;
    private _cmds;
    constructor($el: HTMLElement, cmds: ICmd[]);
    set_debounce_cb(cb: (...any: any[]) => any, mod_debounce: InstanceType<typeof Debounce>): void;
    set_cb(event_name: string, cb: ICb): void;
    exec_cb(event_name: string, event: Event): void;
    set_idle_for_every(idle: NodeJS.Timeout): void;
    abort_every(): void;
    set_request_id(): string;
    get_request_id(): string;
    is_not_changed($el: HTMLElement, mod_changed: InstanceType<typeof Changed>): boolean;
    assign_cmd(cmd: ICmd): void;
    set_unsubscribe(name: string, unsubscribe: () => void): void;
    get_cmds(): Record<string, ICmd & {
        unsubscribe?: (() => void) | undefined;
    }>;
    revoke_cmd(name: string): void;
}
export {};
