import { I_life_hooks, I_class_form_data } from './src/interface';
export default class TurboHtml {
    private _manager;
    private _observer;
    constructor(options?: {
        root?: Document | HTMLElement;
        onError?(err: Error | any): void;
        longRequest?: I_life_hooks['longRequest'];
        requestTimeout?: number;
        __FormData?: I_class_form_data;
    });
    exec($el: HTMLElement, name: string): void;
    stop(): void;
}
