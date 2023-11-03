interface InputUpdate {
    id: string;
    html: string;
    css?: string;
    js?: string;
}
interface InputAppendToTop {
    id: string;
    html: string;
    css?: string;
    js?: string;
}
interface InputAppendToEnd extends InputAppendToTop {
}
declare const _default: {
    Update: (data: InputUpdate) => Update;
    Remove: (id: string) => Remove;
    AppendToTop: (data: InputAppendToTop) => AppendToTop;
    AppendToEnd: (data: InputAppendToEnd) => AppendToEnd;
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
    constructor(data: InputUpdate);
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
    constructor(type: 'append_to_top' | 'append_to_end', data: InputAppendToTop | InputAppendToEnd);
}
declare class AppendToTop extends Append {
    /**
    * AppendToTop
    * @param {{ id: string, html: string; css?: string }} data
    */
    constructor(data: InputAppendToTop);
}
declare class AppendToEnd extends Append {
    /**
    * AppendToEnd
    * @param {{ id: string, html: string; css?: string }} data
    */
    constructor(data: InputAppendToEnd);
}
