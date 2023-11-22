import TurboHtml, { ITurboHtmlOptions } from '../../index';


export default function ({ root, onLongRequest, onStartRequest, onError, onEndRequest }: ITurboHtmlOptions = {}) {
  if (global.address) {
    Object.defineProperty(document, 'baseURI', {
      value: global.address
    });
  }

  const turboHtml = new TurboHtml({
    root,
    onStartRequest,
    onError: onError || function (err) {
      console.log('Request error', err, JSON.stringify(err));
    },
    onEndRequest,
    requestTimeout: 10000,
    onLongRequest: onLongRequest || {
      start($el: HTMLElement) {
        // is-loading
        // console.log('Show Loader');
        // if ($el.tagName === 'BUTTON') {
        //   $el.classList.toggle('is-loading');
        // } else {
        //   (document.querySelector('.global-spinner') as HTMLElement).style.display = 'flex';
        // }
      },
      end($el: HTMLElement) {
        // if ($el.tagName === 'BUTTON') {
        //   $el.classList.toggle('is-loading');
        // } else {
        //   (document.querySelector('.global-spinner') as HTMLElement).style.display = 'none';
        // }
        // console.log('End Loader');
      }
    }
  });

  return turboHtml;
}