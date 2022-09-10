import { Axios } from 'axios';
import { I_life_hooks, I_class_form_data } from './interface';
import El from './El';
declare type T_cmd = {
    name: string;
    method: string;
    url: string;
};
export default class Executor {
    private _FormData;
    private axios;
    private life_hooks;
    private $el;
    private el;
    constructor(life_hooks: I_life_hooks, el: El, axios: Axios, _FormData: I_class_form_data);
    run_as_form(e: Event, cmd: {
        method: string;
        url: string;
    }, { spinner }: {
        spinner: boolean;
    }): void;
    run_as_el(e: Event, cmd: T_cmd, settings: {
        spinner: boolean;
    }): void;
    run_as_every(cmd: T_cmd, settings: {
        spinner: boolean;
    }): void;
    private _run;
    private _extract_data;
    private _make_request;
    private _handle_response;
    private _handler_error;
    private _apply_response;
    private _render;
    private _apply_css;
    private _apply_js;
    private _extract_id;
    private _build_headers;
}
export {};
