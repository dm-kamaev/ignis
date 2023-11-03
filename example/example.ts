// from source
import TurboHtml from '@ignis-web/turbo-html/core';

// from build
// import TurboHtml from '@ignis-web/turbo-html/client';


const turboHtml = new TurboHtml({
  onError(err) {
    console.log('Request error', err, JSON.stringify(err));
  },
  requestTimeout: 10000,
  onLongRequest: {
    start($el: HTMLElement) {
      // is-loading
      console.log('Show Loader');
      if ($el.tagName === 'BUTTON') {
        $el.classList.toggle('is-loading');
      } else {
        (document.querySelector('.global-spinner') as HTMLElement).style.display = 'flex';
      }
    },
    end($el: HTMLElement) {
      if ($el.tagName === 'BUTTON') {
        $el.classList.toggle('is-loading');
      } else {
        (document.querySelector('.global-spinner') as HTMLElement).style.display = 'none';
      }
      console.log('End Loader');
    }
  }
});

// setTimeout(() => {
//   console.log('submit');
//   turboHtml.exec(document.getElementById('book_form') as HTMLElement, 'submit') ;
// }, 10000);
