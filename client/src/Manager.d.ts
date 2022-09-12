import { Axios } from 'axios';
import { I_life_hooks, I_class_form_data } from './interface';
export default class Manager {
    protected life_hooks: I_life_hooks;
    private axios;
    private _FormData;
    private _list;
    static get_selector(): string;
    static extract_els(node?: HTMLElement | Document): HTMLElement[];
    constructor(life_hooks: I_life_hooks, axios: Axios, _FormData: I_class_form_data);
    start(node: HTMLElement | Document): this;
    append($els: HTMLElement[]): void;
    bindings_new_cmds($el: HTMLElement): void;
    garbage_collector(): void;
    destroy(): void;
    /**
     * exec - call event on element
     * @param $el - HTMLElement
     * @param eventName - click, submit and etc.
     */
    exec($el: HTMLElement, eventName: string): void;
    private _subscribe;
    private _bind_cmd;
    private _get_ev_by_name;
    private _parse_cmds;
    private _parse_cmd;
}
