'use strict';


exports.Update = function (data) {
  return new Update(data);
};

exports.Remove = function (id) {
  return new Remove(id);
};

exports.AppendToTop = function (data) {
  return new AppendToTop(data);
};

exports.AppendToEnd = function (data) {
  return new AppendToEnd(data);
};


class Command {
  constructor(ev, data) {
    this.ev = ev;
    if (typeof data === 'object') {
      this.id = data.id || null;
      this.html = data.html;
      this.css = data.css || null;
    } else {
      this.html = data;
    }
  }

  toJSON() {
    return { ev: this.ev, data: { html: this.html, css: this.css, id: this.id, } };
  }
}

class Update extends Command {
  constructor(data) {
    super('update', data);
  }
}

class Remove extends Command {
  constructor(id) {
    super('remove', { id });
  }
}


class Append extends Command {
  constructor(type, data) {
    super(type, data);
  }
}

class AppendToTop extends Append {
  constructor(data) {
    super('append_to_top', data);
  }
}

class AppendToEnd extends Append {
  constructor(data) {
    super('append_to_end', data);
  }
}