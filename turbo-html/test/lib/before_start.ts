import TurboHtml from '../../index';

type T_long_request = { start($el: HTMLElement): void; stop($el: HTMLElement): void; };

export default function ({ __FormData, longRequest, onError }: { __FormData?: any, longRequest?: T_long_request, onError?: (err: Error) => void } = { __FormData: undefined, longRequest: undefined, onError: undefined }) {
  if (global.address) {
    Object.defineProperty(document, 'baseURI', {
      value: global.address
    });
  }

  const stop = TurboHtml.start({
    __FormData,
    onError: onError || function (err) {
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