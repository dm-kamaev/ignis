import parserDelay from './util/parserDelay';

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
    const { delay } = parserDelay(m[1], m[2], el);
    this._delay = delay;
  }

  get_delay_as_ms(): number {
    return this._delay;
  }
}

// @exec(3s) | @exec
export class Exec {
  public readonly _targetEv: string;
  private readonly _delay?: number;
  private static readonly _hashRegExp = { withDelay: /^@exec\((\d+)(ms|s|m)\)$/, withOutDelay: /^@exec$/ };

  static is(el: string) {
    return Exec._hashRegExp.withDelay.test(el) || Exec._hashRegExp.withOutDelay.test(el);
  }

  constructor(el: string) {
    const result = this._withDelay(el);
    if (result instanceof Error) {
      const result = this._withoutDelay(el);
      if (result instanceof Error) {
        throw result;
      }
    } else {
      this._delay = result;
    }
  }

  private _withDelay(el: string) {
    const m = el.match(Exec._hashRegExp.withDelay);
    if (!m) {
      return new Error(`[turbo-html]: Invalid event "${el}"`);
    }

    if (!m[1]) {
      return new Error('Not found number delay: ' + el);
    }

    if (!m[2]) {
      return new Error('Not found measure delay: ' + el);
    }

    const { delay } = parserDelay(m[1], m[2], el);

    return delay;
  }

  private _withoutDelay(el: string) {
    if (!Exec._hashRegExp.withOutDelay.test(el)) {
      return new Error(`[turbo-html]: Invalid event "${el}"`);
    }
  }

  get_delay_as_ms(): number | undefined {
    return this._delay;
  }
}

class KeyEvent {
  readonly name: 'keyup' | 'keydown';
  readonly shortcut: string;
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
      throw new Error('Not found shortcut: ' + el);
    }
    this.shortcut = m[1].trim().toLowerCase();
  }
}

// @keydown(enter)
export class Keydown extends KeyEvent {
  public readonly name = 'keydown';
  static readonly reg_exp = new RegExp('^@keydown\\((.+)\\)$');
  static is(el: string) {
    return super.is(el, Keydown.reg_exp);
  }

  constructor(el: string) {
    super(el, Keydown.reg_exp);
  }
}

// @keyup(enter)
export class Keyup extends KeyEvent {
  public readonly name = 'keyup';
  static readonly reg_exp = new RegExp('^@keyup\\((.+)\\)$');
  static is(el: string) {
    return super.is(el, Keyup.reg_exp);
  }

  constructor(el: string) {
    super(el, Keyup.reg_exp);
  }
}

class KeyEventAlias {
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
      throw new Error('Not found shortcut: ' + el);
    }
    if (!m[2]) {
      throw new Error('Not found target event: ' + el);
    }
    this.shortcut = m[1].trim().toLowerCase();
    this.target_ev = m[2].trim();
  }
}

// @keydown(enter, submit)
export class KeydownAlias extends KeyEventAlias {
  public readonly name = 'keydown';
  static readonly reg_exp = new RegExp('^@keydown\\((.+),(\\w+)\\)$');
  static is(el: string) {
    return super.is(el, KeydownAlias.reg_exp);
  }

  constructor(el: string) {
    super(el, KeydownAlias.reg_exp);
  }

}

// @keyup(enter, submit)
export class KeyupAlias extends KeyEventAlias {
  public readonly name = 'keyup';
  static readonly reg_exp = new RegExp('^@keyup\\((.+),(\\w+)\\)$');

  static is(el: string) {
    return super.is(el, KeyupAlias.reg_exp);
  }

  constructor(el: string) {
    super(el, KeyupAlias.reg_exp);
  }
}


