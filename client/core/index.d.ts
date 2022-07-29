import { I_life_hooks, I_class_form_data } from './src/interface';
declare function start(options?: {
    root?: Document | HTMLElement;
    onError?(err: Error | any): void;
    longRequest?: I_life_hooks['longRequest'];
    requestTimeout?: number;
    __FormData?: I_class_form_data;
}): () => void;
declare const _default: {
    start: typeof start;
};
export default _default;
