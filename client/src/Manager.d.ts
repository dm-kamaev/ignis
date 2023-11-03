import { Axios } from 'axios';
import { ILifeHooks } from './type';
export default class Manager {
    protected readonly lifeHooks: ILifeHooks;
    private readonly axios;
    private _list;
    static get_selector(): string;
    static extract_els(node?: HTMLElement | Document): HTMLElement[];
    constructor(lifeHooks: ILifeHooks, axios: Axios);
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
