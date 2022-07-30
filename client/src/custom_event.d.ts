export declare class Every {
    private readonly _delay;
    static is(el: string): boolean;
    constructor(el: string);
    get_delay_as_ms(): number;
}
declare class Key_event {
    readonly name: 'keyup' | 'keydown';
    readonly shortcut: string;
    static readonly reg_exp: RegExp;
    static is(el: string, reg_exp: RegExp): boolean;
    constructor(el: string, reg_exp: RegExp);
}
export declare class Keydown extends Key_event {
    readonly name = "keydown";
    static readonly reg_exp: RegExp;
    static is(el: string): boolean;
    constructor(el: string);
}
export declare class Keyup extends Key_event {
    readonly name = "keyup";
    static readonly reg_exp: RegExp;
    static is(el: string): boolean;
    constructor(el: string);
}
declare class Key_event_alias {
    readonly name: 'keyup' | 'keydown';
    readonly shortcut: string;
    readonly target_ev: string;
    static readonly reg_exp: RegExp;
    static is(el: string, reg_exp: RegExp): boolean;
    constructor(el: string, reg_exp: RegExp);
}
declare class Keydown_alias extends Key_event_alias {
    readonly name = "keydown";
    static readonly reg_exp: RegExp;
    static is(el: string): boolean;
    constructor(el: string);
}
declare class Keyup_alias extends Key_event_alias {
    readonly name = "keyup";
    static readonly reg_exp: RegExp;
    static is(el: string): boolean;
    constructor(el: string);
}
export declare const alias: {
    Keydown: typeof Keydown_alias;
    Keyup: typeof Keyup_alias;
};
export {};
