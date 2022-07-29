import { I_life_hooks } from './interface';
export default class Manager_Long_Request {
    private _spinner;
    private _$el;
    private _is_finished;
    private _is_long_request;
    private _delay;
    private _min_diff_between_start_stop;
    private _start_request;
    constructor(_spinner: I_life_hooks['longRequest'], _$el: HTMLElement);
    start(): this;
    end(): void;
}
