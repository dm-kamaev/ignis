declare type T_input_update = {
    id: string;
    html: string;
    css?: string;
};
declare type T_input_append_to_top = {
    id: string;
    html: string;
    css?: string;
};
declare type T_input_append_to_end = T_input_append_to_top;
declare const _default: {
    Update: (data: T_input_update) => Update;
    Remove: (id: string) => Remove;
    AppendToTop: (data: T_input_append_to_top) => AppendToTop;
    AppendToEnd: (data: T_input_append_to_end) => AppendToEnd;
};
export default _default;
declare class Command {
    private ev;
    private id;
    private html;
    private css;
    /**
     * Command
     * @param {string} ev - 'update' | 'remove' | 'append_to_top' | 'append_to_end'
     * @param {string | { id?: string, html: string, css?: string }} data
     */
    constructor(ev: 'update' | 'remove' | 'append_to_top' | 'append_to_end', data: string | {
        id?: string;
        html?: string;
        css?: string;
    });
    toJSON(): {
        v: string;
        ev: "update" | "remove" | "append_to_top" | "append_to_end";
        data: {
            id: string;
            html: string;
            css?: string | undefined;
        };
    };
}
declare class Update extends Command {
    /**
     * Update
     * @param {string | { id: string, html: string, css?: string }} data
     */
    constructor(data: T_input_update);
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
    constructor(type: 'append_to_top' | 'append_to_end', data: {
        id: string;
        html: string;
        css?: string;
    });
}
declare class AppendToTop extends Append {
    /**
    * AppendToTop
    * @param {{ id: string, html: string; css?: string }} data
    */
    constructor(data: T_input_append_to_top);
}
declare class AppendToEnd extends Append {
    /**
    * AppendToEnd
    * @param {{ id: string, html: string; css?: string }} data
    */
    constructor(data: T_input_append_to_end);
}
