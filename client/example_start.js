import Ignis from './ignis';


Ignis.start({
  onError(err) {
    console.log('Request error', err, JSON.stringify(err));
  },
  requestTimeout: 10000,
  longRequest: {
    start() {
      console.log('Show Loader');
      document.querySelector('.global-spinner').style.display = 'flex';
    },
    end() {
      document.querySelector('.global-spinner').style.display = 'none';
      console.log('End Loader');
    }
  }
});


