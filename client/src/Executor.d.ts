import { Axios } from 'axios';
import { ILifeHooks, ICmd } from './type';
import type El from './El';
export default class Executor {
    private readonly _lifeHooks;
    private readonly el;
    private readonly _axios;
    private readonly $el;
    constructor(_lifeHooks: ILifeHooks, el: El, _axios: Axios);
    runAsForm(e: Event, cmd: ICmd, { spinner }: {
        spinner: boolean;
    }): void;
    runAsEl(e: Event, cmd: ICmd, settings: {
        spinner: boolean;
    }): void;
    runAsEvery(cmd: ICmd, settings: {
        spinner: boolean;
    }): void;
    runAsExec(cmd: ICmd, settings: {
        spinner: boolean;
    }): void;
    private _runAsForm;
    private getLifeHookFromAttribute;
    private _run;
    private _extract_data;
    private _make_request;
    private _handle_response;
    private _handlerError;
    private _exec;
    private _setLifeHooks;
    private _apply_response;
    private _render;
    private _apply_css;
    private _apply_js;
    private _extract_id;
    private _build_headers;
}
