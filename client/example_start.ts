import Ignis from './ignis';


Ignis.start({
  onError(err) {
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


