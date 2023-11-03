import { ILifeHooks } from './type';

export default class ManagerLongRequest {
  private _is_finished: boolean = false;
  private _is_long_request: boolean = false;
  private readonly _delay: number = 400; // it's long request, if delay more given time (milliseconds)
  private readonly _min_diff_between_start_stop: number;
  private _start_request: number;

  constructor(private readonly _spinner: ILifeHooks['onLongRequest'], private readonly _$el: HTMLElement) {
    const min_time_for_loader = 1000; //  1 second
    this._min_diff_between_start_stop = min_time_for_loader - this._delay; // We protect from flickering when show "loader"
  }

  start() {
    this._start_request = Date.now();
    // We listening request for detecting long delay
    const idle = setInterval(() => {
      const now = Date.now();
      if (!this._is_finished && (now - this._start_request) > this._delay) {
        this._is_long_request = true;
        this._spinner.start(this._$el);
        clearInterval(idle);
      } else if (this._is_finished) {
        clearInterval(idle);
      }
    }, 100);
    return this;
  }


  end() {
    const me = this;
    me._is_finished = true;
    const delay = me._delay;
    // console.log({ is_long_request: this._is_long_request });
    if (!me._is_long_request) {
      return;
    }
    const start = me._start_request;
    const now = Date.now();
    // console.log('duration', now - start, now, start);
    const duration = now - start;
    const diff = duration - delay;
    // console.log({ duration, delay, diff });
    if (diff < me._min_diff_between_start_stop) {
      const ms = me._min_diff_between_start_stop - diff;
      // console.log('next call', ms);
      setTimeout(() => {
        me._spinner.end(me._$el);
      }, ms);
    } else {
      // console.log('immediatealy call');
      me._spinner.end(me._$el);
    }
  }
}
