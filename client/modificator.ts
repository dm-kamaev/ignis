import { parser_delay } from './helper';

abstract class Modificator {
  static is(el: string): boolean { return false; };
  new(el: string) { };
}

export class Once extends Modificator {
  static is(el: string) {
    return el === 'once';
  }

  constructor(el: string) {
    super();
  }
}

export class Debounce extends Modificator {
  private readonly _delay: number;
  static is(el: string) {
    return /^debounce\(\d+(ms|s|m)\)$/.test(el);
  }

  constructor(el: string) {
    super();
    const m = el.match(/^debounce\((\d+)(ms|s|m)\)$/);
    if (!m) {
      throw new Error(`[@ignis-web/html]: Invalid modifictor "${el}"`);
    }
    const { delay } = parser_delay(m[1], m[2], el);
    this._delay = delay;
  }

  get_delay_as_ms(): number {
    return this._delay;
  }
}


export class Changed extends Modificator {
  public readonly prop: string;

  static is(el: string) {
    return /^changed\([\w\.]+\)$/.test(el);
  }

  constructor(el: string) {
    super();
    const m = el.match(/^changed\(([\w\.]+)\)$/);
    if (!m) {
      throw new Error(`[@ignis-web/html]: Invalid modifictor "${el}"`);
    }
    this.prop = m[1];
  }
}