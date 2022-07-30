/// <reference types="node" />
import { Debounce, Changed } from './modificator';
import { T_cmd } from './interface';
export default class El {
    $el: HTMLElement;
    private _idle_for_debounce;
    private _old_val;
    private _idle_for_every;
    private _request_id;
    private _cmds;
    constructor($el: HTMLElement, cmds: T_cmd[]);
    set_debounce_cb(cb: (...any: any[]) => any, mod_debounce: InstanceType<typeof Debounce>): void;
    set_idle_for_every(idle: NodeJS.Timeout): void;
    abort_every(): void;
    set_request_id(): string;
    get_request_id(): string;
    is_not_changed($el: HTMLElement, mod_changed: InstanceType<typeof Changed>): boolean;
    assign_cmd(cmd: T_cmd): void;
    set_unsubscribe(name: string, unsubscribe: () => void): void;
    get_cmds(): Record<string, T_cmd & {
        unsubscribe?: (() => void) | undefined;
    }>;
    revoke_cmd(name: string): void;
}
