"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Update: function (data) {
        return new Update(data);
    },
    Remove: function (id) {
        return new Remove(id);
    },
    AppendToTop: function (data) {
        return new AppendToTop(data);
    },
    AppendToEnd: function (data) {
        return new AppendToEnd(data);
    }
};
const CommandError = class CommandError extends Error {
};
exports.CommandError;
class Command {
    /**
     * Command
     * @param {string} ev - 'update' | 'remove' | 'append_to_top' | 'append_to_end'
     * @param {string | { id?: string, html: string, css?: string }} data
     */
    constructor(ev, data) {
        this.ev = ev;
        this.ev = ev;
        if (typeof data === 'object') {
            this.id = data.id ?? null;
            this.html = data.html ?? null;
            this.css = data.css ?? null;
            this.js = data.js ?? null;
            // console.log(this);
        }
        else {
            this.html = data;
        }
    }
    toJSON() {
        const data = {};
        if (isNotNil(this.id)) {
            data.id = this.id;
        }
        if (isNotNil(this.html)) {
            data.html = this.html;
        }
        if (isNotNil(this.css)) {
            data.css = this.css;
        }
        if (isNotNil(this.js)) {
            data.js = this.js;
        }
        return { v: 'turbo-html:1', ev: this.ev, data };
    }
}
class Update extends Command {
    /**
     * Update
     * @param {string | { id: string, html: string, css?: string }} data
     */
    constructor(data) {
        super('update', data);
    }
}
class Remove extends Command {
    /**
     *
     * @param {string} id
     */
    constructor(id) {
        if (isNil(id)) {
            throw new CommandError('[turbo-html:Remove] Not found id - ' + id);
        }
        super('remove', { id });
    }
}
class Append extends Command {
    /**
     * Append
     * @param {string} type - 'append_to_top' | 'append_to_end'
     * @param {{ id: string, html: string; css?: string }} data
     */
    constructor(type, data) {
        if (isNil(data.id)) {
            throw new CommandError('[turbo-html:Append] Not found id - ' + data.id);
        }
        super(type, data);
    }
}
class AppendToTop extends Append {
    /**
    * AppendToTop
    * @param {{ id: string, html: string; css?: string }} data
    */
    constructor(data) {
        super('append_to_top', data);
    }
}
class AppendToEnd extends Append {
    /**
    * AppendToEnd
    * @param {{ id: string, html: string; css?: string }} data
    */
    constructor(data) {
        super('append_to_end', data);
    }
}
function isNotNil(input) {
    return !(input === undefined || input === null);
}
function isNil(input) {
    return !isNotNil(input);
}
