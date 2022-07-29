export default class Animation {
    on_update($el: HTMLElement): void;
    on_remove($el: HTMLElement, cb: (...arg: any) => void): void;
    private _has_animation;
}
