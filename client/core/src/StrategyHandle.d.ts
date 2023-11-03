import { ICmd } from './type';
import type Manager from './Manager';
import type Executor from './Executor';
import type { KeydownAlias, KeyupAlias } from './customCmd';
import type El from './El';
export default class StrategyHandle {
    private readonly _el;
    private readonly _name;
    private readonly _executor;
    private readonly _get_ev_by_name;
    constructor(_el: El, _name: string, _executor: Executor, _get_ev_by_name: Manager['_get_ev_by_name']);
    custom_ev(custom_ev: ICmd['custom_ev']): void;
    alias(key_ev: KeydownAlias | KeyupAlias): void;
    default(): void;
    private _get_once;
}
