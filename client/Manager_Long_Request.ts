import { I_life_hooks } from './interface';

export default class Manager_Long_Request {
  private _longRequest: I_life_hooks['longRequest'];
  private _is_finished: boolean;
  private _is_long_request: boolean;
  private _delay: number;
  private _min_diff_between_start_stop: number;
  private _start_request: number;

  constructor(longRequest: I_life_hooks['longRequest']) {
    this._longRequest = longRequest;
    this._is_finished = false;
    this._is_long_request = false;
    this._delay = 400; // it's long request, if delay more given  time (milliseconds)

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
        this._longRequest.start();
        clearInterval(idle);
      } else if (this._is_finished) {
        clearInterval(idle);
      }
    }, 100);
    return this;
  }


  end() {
    this._is_finished = true;
    const delay = this._delay;
    // console.log({ is_long_request: this._is_long_request });
    if (!this._is_long_request) {
      return;
    }
    const start = this._start_request;
    const now = Date.now();
    // console.log('duration', now - start, now, start);
    const duration = now - start;
    const diff = duration - delay;
    // console.log({ duration, delay, diff });
    if (diff < this._min_diff_between_start_stop) {
      const ms = this._min_diff_between_start_stop - diff;
      // console.log('next call', ms);
      setTimeout(() => {
        this._longRequest.end();
      }, ms);
    } else {
      // console.log('immediatealy call');
      this._longRequest.end();
    }
  }
}
