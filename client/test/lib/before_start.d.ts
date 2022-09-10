declare type T_long_request = {
    start($el: HTMLElement): void;
    stop($el: HTMLElement): void;
};
export default function ({ root, __FormData, longRequest, onError }?: {
    root?: HTMLElement;
    __FormData?: any;
    longRequest?: T_long_request;
    onError?: (err: Error) => void;
}): () => void;
export {};
