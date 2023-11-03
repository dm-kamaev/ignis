export declare class Every {
    private readonly _delay;
    static is(el: string): boolean;
    constructor(el: string);
    get_delay_as_ms(): number;
}
export declare class Exec {
    readonly _targetEv: string;
    private readonly _delay?;
    private static readonly _hashRegExp;
    static is(el: string): boolean;
    constructor(el: string);
    private _withDelay;
    private _withoutDelay;
    get_delay_as_ms(): number | undefined;
}
declare class KeyEvent {
    readonly name: 'keyup' | 'keydown';
    readonly shortcut: string;
    static readonly reg_exp: RegExp;
    static is(el: string, reg_exp: RegExp): boolean;
    constructor(el: string, reg_exp: RegExp);
}
export declare class Keydown extends KeyEvent {
    readonly name = "keydown";
    static readonly reg_exp: RegExp;
    static is(el: string): boolean;
    constructor(el: string);
}
export declare class Keyup extends KeyEvent {
    readonly name = "keyup";
    static readonly reg_exp: RegExp;
    static is(el: string): boolean;
    constructor(el: string);
}
declare class KeyEventAlias {
    readonly name: 'keyup' | 'keydown';
    readonly shortcut: string;
    readonly target_ev: string;
    static readonly reg_exp: RegExp;
    static is(el: string, reg_exp: RegExp): boolean;
    constructor(el: string, reg_exp: RegExp);
}
export declare class KeydownAlias extends KeyEventAlias {
    readonly name = "keydown";
    static readonly reg_exp: RegExp;
    static is(el: string): boolean;
    constructor(el: string);
}
export declare class KeyupAlias extends KeyEventAlias {
    readonly name = "keyup";
    static readonly reg_exp: RegExp;
    static is(el: string): boolean;
    constructor(el: string);
}
export {};
