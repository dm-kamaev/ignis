import Ignis from '../../index';

type T_long_request = { start($el: HTMLElement): void; stop($el: HTMLElement): void; };

export default function ({ __FormData, longRequest }: { __FormData?: any, longRequest?: T_long_request } = { __FormData: undefined, longRequest: undefined }) {
  if (global.address) {
    Object.defineProperty(document, 'baseURI', {
      value: global.address
    });
  }

  const stop = Ignis.start({
    __FormData,
    onError(err) {
      console.log(err);
      console.log('Request error', err, JSON.stringify(err));
    },
    requestTimeout: 10000,
    longRequest: longRequest || {
      start($el: HTMLElement) {
        // is-loading
        // console.log('Show Loader');
        // if ($el.tagName === 'BUTTON') {
        //   $el.classList.toggle('is-loading');
        // } else {
        //   (document.querySelector('.global-spinner') as HTMLElement).style.display = 'flex';
        // }
      },
      stop($el: HTMLElement) {
        // if ($el.tagName === 'BUTTON') {
        //   $el.classList.toggle('is-loading');
        // } else {
        //   (document.querySelector('.global-spinner') as HTMLElement).style.display = 'none';
        // }
        // console.log('End Loader');
      }
    }
  });

  return function abort() {
    stop();
  };
}