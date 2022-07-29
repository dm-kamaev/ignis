import { parser_delay } from './helper';
import enum_attr from './enum_attr';

export default class Animation {
  on_update($el: HTMLElement) {
    if (!this._has_animation($el, 'on_update')) {
      return;
    }

    const animation_on_update = $el.getAttribute(enum_attr.ANIMATION.ON_UPDATE) as string;
    let [class_name, str_delay ] = animation_on_update.trim().split(':');
    if (!class_name) {
      throw new Error(`[turbo-html]: Invalid ${enum_attr.ANIMATION.ON_UPDATE}="${$el.getAttribute(enum_attr.ANIMATION.ON_UPDATE)}", you must set class`);
    }
    class_name = class_name.trim();
    str_delay = str_delay ? str_delay.trim() : 'delay(100ms)';
    const delay = new Delay(str_delay);

    $el.classList.remove(class_name);
    setTimeout(() => $el.classList.add(class_name), delay.toNumber());
  }

  on_remove($el: HTMLElement, cb: (...arg: any) => void) {
    if (!this._has_animation($el, 'on_remove')) {
      return cb();
    }
    const animation_on_remove = $el.getAttribute(enum_attr.ANIMATION.ON_REMOVE) as string;
    let [class_name, str_delay] = animation_on_remove.trim().split(':');
    if (!class_name) {
      throw new Error(`[turbo-html]: Invalid ${enum_attr.ANIMATION.ON_REMOVE}="${$el.getAttribute(enum_attr.ANIMATION.ON_REMOVE)}", you must set class`);
    }
    if (!str_delay) {
      throw new Error(`[turbo-html]: Invalid ${enum_attr.ANIMATION.ON_REMOVE}="${$el.getAttribute(enum_attr.ANIMATION.ON_REMOVE)}", you must set delay`);
    }

    class_name = class_name.trim();
    str_delay = str_delay.trim();
    const delay = new Delay(str_delay);

    // CSS can't animate between display: none; and display: block;. Worse yet: it can't animate between height: 0 and height: auto.
    // We adding a bit of Javascript, you can listen for the animation end event, and set display:none manually.
    const end_of_animation = () => $el.style.display = 'none';
    $el.addEventListener('animationend', end_of_animation);
    $el.classList.add(class_name);
    setTimeout(() => {
      $el.outerHTML = '';
      $el.removeEventListener('animationend', end_of_animation);
    }, delay.toNumber());
  }

  private _has_animation($el: HTMLElement, type: 'on_update' | 'on_remove') {
    return $el.hasAttribute(type === 'on_update' ? 'data-i-animation-class-on-update' : 'data-i-animation-class-on-remove');
  }
}


class Delay {
  private readonly _delay: number;
  private static reg_exp = /^delay\(([\d\.]+)(ms|s|m)\)$/;
  static is(el: string) {
    return Delay.reg_exp.test(el);
  }

  constructor(el: string) {
    const m = el.match(Delay.reg_exp);
    if (!m) {
      throw new Error(`[turbo-html]: Invalid modifictor "${el}"`);
    }
    const { delay } = parser_delay(m[1], m[2], el);
    this._delay = delay;
  }

  toNumber() {
    return this._delay;
  }
}