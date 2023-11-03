
interface InputUpdate { id: string, html: string, css?: string; js?: string; };
interface InputAppendToTop { id: string, html: string; css?: string; js?: string; };
interface InputAppendToEnd extends InputAppendToTop {};

export default {
  Update: function (data: InputUpdate) {
    return new Update(data);
  },
  Remove: function (id: string) {
    return new Remove(id);
  },
  AppendToTop: function (data: InputAppendToTop) {
    return new AppendToTop(data);
  },
  AppendToEnd: function (data: InputAppendToEnd) {
    return new AppendToEnd(data);
  }
};




const CommandError = class CommandError extends Error {};
exports.CommandError;


class Command {
  private id: string | null;
  private html: string | null;
  private css: string | null;
  private js: string | null;
  /**
   * Command
   * @param {string} ev - 'update' | 'remove' | 'append_to_top' | 'append_to_end'
   * @param {string | { id?: string, html: string, css?: string }} data
   */
  constructor(private ev: 'update' | 'remove' | 'append_to_top' | 'append_to_end', data: string | { id?: string, html?: string, css?: string; js?: string; }) {
    this.ev = ev;
    if (typeof data === 'object') {
      this.id = data.id ?? null;
      this.html = data.html ?? null;
      this.css = data.css ?? null;
      this.js = data.js ?? null;
      // console.log(this);
    } else {
      this.html = data;
    }
  }

  toJSON() {
    const data: { id: string, html: string, css?: string; js: string } = {} as any;
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
  constructor(data: InputUpdate) {
    super('update', data);
  }
}

class Remove extends Command {
  /**
   *
   * @param {string} id
   */
  constructor(id: string) {
    if (isNil(id)) {
      throw new CommandError('[turbo-html:Remove] Not found id - '+id);
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
  constructor(type: 'append_to_top' | 'append_to_end', data: InputAppendToTop | InputAppendToEnd) {
    if (isNil(data.id)) {
      throw new CommandError('[turbo-html:Append] Not found id - '+data.id);
    }

    super(type, data);
  }
}

class AppendToTop extends Append {
  /**
  * AppendToTop
  * @param {{ id: string, html: string; css?: string }} data
  */
  constructor(data: InputAppendToTop) {
    super('append_to_top', data);
  }
}

class AppendToEnd extends Append {
  /**
  * AppendToEnd
  * @param {{ id: string, html: string; css?: string }} data
  */
  constructor(data: InputAppendToEnd) {
    super('append_to_end', data);
  }
}


function isNotNil(input?: string | null): input is string {
  return !(input === undefined || input === null);
}

function isNil(input?: string | null): input is null {
  return !isNotNil(input);
}