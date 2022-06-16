type T_input_update = { id: string, html: string, css?: string };
type T_input_append_to_top = { id: string, html: string; css?: string };
type T_input_append_to_end = T_input_append_to_top;

export default {
  Update: function (data: T_input_update) {
    return new Update(data);
  },
  Remove: function (id: string) {
    return new Remove(id);
  },
  AppendToTop: function (data: T_input_append_to_top) {
    return new AppendToTop(data);
  },
  AppendToEnd: function (data: T_input_append_to_end) {
    return new AppendToEnd(data);
  }
};




const CommandError = class CommandError extends Error {};
exports.CommandError;


class Command {
  private id: string | null;
  private html: string | null;
  private css: string | null;
  /**
   * Command
   * @param {string} ev - 'update' | 'remove' | 'append_to_top' | 'append_to_end'
   * @param {string | { id?: string, html: string, css?: string }} data
   */
  constructor(private ev: 'update' | 'remove' | 'append_to_top' | 'append_to_end', data: string | { id?: string, html?: string, css?: string }) {
    this.ev = ev;
    if (typeof data === 'object') {
      this.id = data.id ?? null;
      this.html = data.html ?? null;
      this.css = data.css ?? null;
      // console.log(this);
    } else {
      this.html = data;
    }
  }

  toJSON() {
    const data: { id: string, html: string, css?: string } = {} as any;
    if (!isNil(this.id)) {
      data.id = this.id as string;
    }
    if (!isNil(this.html)) {
      data.html = this.html as string;
    }
    if (!isNil(this.css)) {
      data.css = this.css as string;
    }
    return { v: 'ignis-html:1', ev: this.ev, data };
  }
}

class Update extends Command {
  /**
   * Update
   * @param {string | { id: string, html: string, css?: string }} data
   */
  constructor(data: T_input_update) {
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
      throw new CommandError('[@ignis-web/html:Remove] Not found id - '+id);
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
  constructor(type: 'append_to_top' | 'append_to_end', data: { id: string, html: string; css?: string }) {
    if (isNil(data.id)) {
      throw new CommandError('[@ignis-web/html:Append] Not found id - '+data.id);
    }

    super(type, data);
  }
}

class AppendToTop extends Append {
  /**
  * AppendToTop
  * @param {{ id: string, html: string; css?: string }} data
  */
  constructor(data: T_input_append_to_top) {
    super('append_to_top', data);
  }
}

class AppendToEnd extends Append {
  /**
  * AppendToEnd
  * @param {{ id: string, html: string; css?: string }} data
  */
  constructor(data: T_input_append_to_end) {
    super('append_to_end', data);
  }
}



function isNil(input?: string | null): boolean {
  return (input === undefined || input === null);
}