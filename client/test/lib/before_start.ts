import Ignis from '../../ignis';
import axios, { AxiosInstance } from 'axios';


export default function () {
  Object.defineProperty(document, 'baseURI', {
    value: 'http://127.0.0.1:9003'
  });

  const stop = Ignis.start({
    onError(err) {
      console.log(err);
      console.log('Request error', err, JSON.stringify(err));
    },
    requestTimeout: 10000,
    longRequest: {
      start($el: HTMLElement) {
        // is-loading
        console.log('Show Loader');
        if ($el.tagName === 'BUTTON') {
          $el.classList.toggle('is-loading');
        } else {
          (document.querySelector('.global-spinner') as HTMLElement).style.display = 'flex';
        }
      },
      stop($el: HTMLElement) {
        if ($el.tagName === 'BUTTON') {
          $el.classList.toggle('is-loading');
        } else {
          (document.querySelector('.global-spinner') as HTMLElement).style.display = 'none';
        }
        console.log('End Loader');
      }
    }
  });

  return function abort() {
    stop();
  };
}