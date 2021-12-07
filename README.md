

In browser:
```js
import Ignis from 'ignis-html/client';


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
```

```js
  <script src="https://unpkg.com/ignis-html@1.0.3/client/dist/ignis.js"></script>
  <script>
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
  </script>
```