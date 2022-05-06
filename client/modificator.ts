
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
      throw new Error('Invalid modifictor: ' + el);
    }
    const number = parseInt(m[1].trim(), 10);
    const measure = m[2].trim() as 'ms' | 's' | 'm';
    switch (measure) {
      case 'ms':
        this._delay = number;
        break;
      case 's':
        this._delay = number * 1000;
        console.log('SEC', number, this._delay);
        break;
      case 'm':
        this._delay = number * 1000 * 60;
        break;
      default:
        throw new Error('Invalid measure: ' + el);
    }
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
      throw new Error('Invalid modifictor: ' + el);
    }
    this.prop = m[1];
  }
}