import { ILifeHooks, ICmd } from './type';
import enumAttr from './enumAttr';

export default class LifeHookManager {
  private readonly _lifeHooks: {
    onStartRequest: [ILifeHooks['onStartRequest']] | [ILifeHooks['onStartRequest'], ILifeHooks['onStartRequest']],
    onEndRequest: [ILifeHooks['onEndRequest']] | [ILifeHooks['onEndRequest'], ILifeHooks['onEndRequest']];
    onError: [ILifeHooks['onError']] | [ILifeHooks['onError'], ILifeHooks['onError']];
  };

  constructor(globalLifeHooks: ILifeHooks, private readonly $el: HTMLElement) {
    const localOnStartRequest = this._getLifeHookFromAttribute($el.getAttribute(enumAttr.hook['on-start-request']));
    const localOnError = this._getLifeHookFromAttribute($el.getAttribute(enumAttr.hook['on-error']));
    const localOnEndRequest = this._getLifeHookFromAttribute($el.getAttribute(enumAttr.hook['on-end-request']));

    this._lifeHooks = {
      onStartRequest: localOnStartRequest ? [localOnStartRequest, globalLifeHooks.onStartRequest] : [globalLifeHooks.onStartRequest],
      onEndRequest: localOnEndRequest ? [localOnEndRequest, globalLifeHooks.onEndRequest] : [globalLifeHooks.onEndRequest],
      onError: localOnError ? [localOnError, globalLifeHooks.onError] : [globalLifeHooks.onError]
    };
  }

  callOnStartRequest(cmd: ICmd) {
    let start = Promise.resolve();
    this._lifeHooks.onStartRequest.forEach(el => {
      try {
        const result = el(this.$el, cmd) || Promise.resolve();
        start = Promise.resolve(result);
      } catch (err) {
        console.error('[turbo-html]: Error in handler of OnStartRequest', err);
      }
    });
    start.catch(err => {
      console.error('[turbo-html]: Error in handler of OnStartRequest', err);
    });
  }

  callOnEndRequest(cmd: ICmd, err?: unknown | Error) {
    let start = Promise.resolve();
    this._lifeHooks.onEndRequest.forEach(el => {
      try {
        // console.log(el.toString(), [this.$el, cmd, err]);
        const result = el(this.$el, cmd, err) || Promise.resolve();
        start = Promise.resolve(result);
      } catch (err) {
        console.error('[turbo-html]: Error in handler of OnEndRequest', err);
      }
    });
    start.catch(err => {
      console.error('[turbo-html]: Error in handler of OnEndRequest', err);
    });
  }

  callOnError(err: unknown | Error) {
    let start = Promise.resolve();
    this._lifeHooks.onError.forEach(el => {
      try {
        const result = el(err, this.$el) || Promise.resolve();
        start = Promise.resolve(result);
      } catch (err) {
        console.error('[turbo-html]: Error in handler of OnError', err);
      }
    });
    start.catch(err => {
      console.error('[turbo-html]: Error in handler of OnError', err);
    });
  }


  private _getLifeHookFromAttribute(expr: string | null) {
    if (!expr) {
      return;
    }
    const code = `with(this){${`return ${expr}`}}`;
    const fn = new Function(code).bind(this.$el);
    return fn;
  }
}