import { ILifeHooks } from './type';
export default class ManagerLongRequest {
    private readonly _spinner;
    private readonly _$el;
    private _is_finished;
    private _is_long_request;
    private readonly _delay;
    private readonly _min_diff_between_start_stop;
    private _start_request;
    constructor(_spinner: ILifeHooks['onLongRequest'], _$el: HTMLElement);
    start(): this;
    end(): void;
}
