# Turbo Html

[![Actions Status](https://github.com/dm-kamaev/ignis-html/workflows/Build/badge.svg)](https://github.com/dm-kamaev/ignis-html/actions) ![Coverage](https://github.com/dm-kamaev/ignis-html/blob/master/badges/coverage.svg)

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

<!-- https://gomakethings.com/how-to-turn-any-github-repo-into-a-cdn/#:~:text=Here's%20how%20it%20works.,repository%20name%20for%20the%20project.&text=You%20can%20also%20take%20advantage,number%7D%20to%20the%20repository%20name. -->
```js
  <script src="https://cdn.jsdelivr.net/gh/dm-kamaev/ignis-html/turbo-html/index.ts"></script>
  <script src="https://cdn.jsdelivr.net/gh/dm-kamaev/ignis-html@1.0.3/turbo-html/index.ts"></script>
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