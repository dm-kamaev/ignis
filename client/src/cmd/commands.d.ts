type T_InputUpdate = {
    id: string;
    html: string;
    css?: string;
    js?: string;
};
type T_InputAppendToTop = {
    id: string;
    html: string;
    css?: string;
    js?: string;
};
type T_InputAppendToEnd = T_InputAppendToTop;
declare const _default: {
    Update: (data: T_InputUpdate) => Update;
    Remove: (id: string) => Remove;
    AppendToTop: (data: T_InputAppendToTop) => AppendToTop;
    AppendToEnd: (data: T_InputAppendToEnd) => AppendToEnd;
};
export default _default;
declare class Command {
    private ev;
    private id;
    private html;
    private css;
    private js;
    /**
     * Command
     * @param {string} ev - 'update' | 'remove' | 'append_to_top' | 'append_to_end'
     * @param {string | { id?: string, html: string, css?: string }} data
     */
    constructor(ev: 'update' | 'remove' | 'append_to_top' | 'append_to_end', data: string | {
        id?: string;
        html?: string;
        css?: string;
        js?: string;
    });
    toJSON(): {
        v: string;
        ev: "update" | "remove" | "append_to_top" | "append_to_end";
        data: {
            id: string;
            html: string;
            css?: string | undefined;
            js: string;
        };
    };
}
declare class Update extends Command {
    /**
     * Update
     * @param {string | { id: string, html: string, css?: string }} data
     */
    constructor(data: T_InputUpdate);
}
declare class Remove extends Command {
    /**
     *
     * @param {string} id
     */
    constructor(id: string);
}
declare class Append extends Command {
    /**
     * Append
     * @param {string} type - 'append_to_top' | 'append_to_end'
     * @param {{ id: string, html: string; css?: string }} data
     */
    constructor(type: 'append_to_top' | 'append_to_end', data: T_InputAppendToTop | T_InputAppendToEnd);
}
declare class AppendToTop extends Append {
    /**
    * AppendToTop
    * @param {{ id: string, html: string; css?: string }} data
    */
    constructor(data: T_InputAppendToTop);
}
declare class AppendToEnd extends Append {
    /**
    * AppendToEnd
    * @param {{ id: string, html: string; css?: string }} data
    */
    constructor(data: T_InputAppendToEnd);
}
