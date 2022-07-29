declare abstract class Modificator {
    static is(el: string): boolean;
    new(el: string): void;
}
export declare class Once extends Modificator {
    static is(el: string): boolean;
    constructor(el: string);
}
export declare class Debounce extends Modificator {
    private readonly _delay;
    static is(el: string): boolean;
    constructor(el: string);
    get_delay_as_ms(): number;
}
export declare class Changed extends Modificator {
    readonly prop: string;
    static is(el: string): boolean;
    constructor(el: string);
}
export {};
