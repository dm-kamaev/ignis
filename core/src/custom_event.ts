import { parser_delay } from './helper';

// @every(3s)
export class Every {
  private readonly _delay: number;
  static is(el: string) {
    return /^@every\(\d+(ms|s|m)\)$/.test(el);
  }

  constructor(el: string) {
    const m = el.match(/^@every\((\d+)(ms|s|m)\)$/);
    if (!m) {
      throw new Error(`[turbo-html]: Invalid event "${el}"`);
    }
    const { delay } = parser_delay(m[1], m[2], el);
    this._delay = delay;
  }

  get_delay_as_ms(): number {
    return this._delay;
  }
}

class Key_event {
  public readonly name: 'keyup' | 'keydown';
  public readonly shortcut: string;
  static readonly reg_exp: RegExp;

  static is(el: string, reg_exp: RegExp): boolean {
    return reg_exp.test(el);
  }

  constructor(el: string, reg_exp: RegExp) {
    const m = el.match(reg_exp);
    if (!m) {
      throw new Error('Invalid event: ' + el);
    }
    if (!m[1]) {
      throw new Error('Not found shorcut: ' + el);
    }
    this.shortcut = m[1].trim().toLowerCase();
  }
}

// @keydown(enter)
export class Keydown extends Key_event {
  public readonly name = 'keydown';
  static readonly reg_exp = new RegExp('^@keydown\\((.+)\\)$');
  static is(el: string) {
    return super.is(el, Keydown.reg_exp);
  }

  constructor(el: string) {
    super(el, Keydown.reg_exp);
  }
}

export class Keyup extends Key_event {
  public readonly name = 'keyup';
  static readonly reg_exp = new RegExp('^@keyup\\((.+)\\)$');
  static is(el: string) {
    return super.is(el, Keyup.reg_exp);
  }

  constructor(el: string) {
    super(el, Keyup.reg_exp);
  }
}

class Key_event_alias {
  public readonly name: 'keyup' | 'keydown';
  public readonly shortcut: string;
  public readonly target_ev: string;
  static readonly reg_exp: RegExp;

  static is(el: string, reg_exp: RegExp): boolean {
    return reg_exp.test(el);
  }

  constructor(el: string, reg_exp: RegExp) {
    const m = el.match(reg_exp);
    if (!m) {
      throw new Error('Invalid event: ' + el);
    }
    if (!m[1]) {
      throw new Error('Not found shorcut: ' + el);
    }
    if (!m[2]) {
      throw new Error('Not found target event: ' + el);
    }
    this.shortcut = m[1].trim().toLowerCase();
    this.target_ev = m[2].trim();
  }
}

// @keydown(enter, submit)
class Keydown_alias extends Key_event_alias {
  public readonly name = 'keydown';
  static readonly reg_exp = new RegExp('^@keydown\\((.+),(\\w+)\\)$');
  static is(el: string) {
    return super.is(el, Keydown_alias.reg_exp);
  }

  constructor(el: string) {
    super(el, Keydown_alias.reg_exp);
  }

}

// @keyup(enter, submit)
class Keyup_alias extends Key_event_alias {
  public readonly name = 'keyup';
  static readonly reg_exp = new RegExp('^@keyup\\((.+),(\\w+)\\)$');

  static is(el: string) {
    return super.is(el, Keyup_alias.reg_exp);
  }

  constructor(el: string) {
    super(el, Keyup_alias.reg_exp);
  }
}

export const alias = {
  Keydown: Keydown_alias,
  Keyup: Keyup_alias
}


