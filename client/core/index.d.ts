import { ILifeHooks } from './src/type';
import HttpError from './src/HttpError';
export interface ITurboHtmlOptions {
    root?: Document | HTMLElement;
    onStartRequest?: ILifeHooks['onStartRequest'];
    onError?: ILifeHooks['onError'];
    onEndRequest?: ILifeHooks['onEndRequest'];
    onLongRequest?: ILifeHooks['onLongRequest'];
    requestTimeout?: number;
}
export default class TurboHtml {
    private readonly _manager;
    private readonly _observer;
    static HttpError: typeof HttpError;
    constructor(options?: ITurboHtmlOptions);
    exec($el: HTMLElement, name: string): void;
    stop(): void;
}
